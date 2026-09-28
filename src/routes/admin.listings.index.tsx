import { Link, createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { ExternalLink, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { DashCard } from "@/components/admin/shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/select-native";
import {
  LIFECYCLE_LABEL,
  setListingLifecycle,
  type ListingLifecycle,
} from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { useManagedListingsQuery } from "@/lib/listings-query";
import { cn } from "@/lib/utils";
import type { TransactionType } from "@/data/properties";

export const Route = createFileRoute("/admin/listings/")({
  component: ListingsPage,
});

function ListingsPage() {
  const queryClient = useQueryClient();
  const { data: listings = [], isPending } = useManagedListingsQuery();
  const [q, setQ] = useState("");
  const [intent, setIntent] = useState<"" | TransactionType>("");
  const [life, setLife] = useState<"" | ListingLifecycle>("");

  const rows = useMemo(() => {
    return listings.filter((p) => {
      if (intent && p.transactionType !== intent) return false;
      if (life && p.lifecycle !== life) return false;
      if (q) {
        const blob = `${p.title} ${p.neighborhood} ${p.city}`.toLowerCase();
        if (!blob.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [listings, q, intent, life]);

  async function toggle(id: string, lifecycle: ListingLifecycle) {
    const next = lifecycle === "live" ? "paused" : "live";
    try {
      await setListingLifecycle({ data: { id, lifecycle: next } });
      await queryClient.invalidateQueries({ queryKey: ["listings"] });
      toast.success(next === "live" ? "Now live on the site" : "Taken off the site");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update");
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            Listings
          </h1>
          <p className="mt-1 text-sm text-quiet">
            {listings.filter((l) => l.lifecycle === "live").length} live on the
            public site
          </p>
        </div>
        <Button variant="terracotta" asChild>
          <Link to="/admin/listings/new">
            <Plus className="size-4" />
            New listing
          </Link>
        </Button>
      </div>

      <DashCard className="p-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search title or neighbourhood"
            aria-label="Search listings"
          />
          <NativeSelect
            value={intent}
            onChange={(e) => setIntent(e.target.value as "" | TransactionType)}
            aria-label="Filter by intent"
          >
            <option value="">All intents</option>
            <option value="rent">Rent</option>
            <option value="buy">Buy</option>
            <option value="land">Land</option>
          </NativeSelect>
          <NativeSelect
            value={life}
            onChange={(e) => setLife(e.target.value as "" | ListingLifecycle)}
            aria-label="Filter by status"
          >
            <option value="">All statuses</option>
            <option value="live">Live</option>
            <option value="draft">Draft</option>
            <option value="paused">Paused</option>
            <option value="let">Let</option>
            <option value="sold">Sold</option>
          </NativeSelect>
        </div>
      </DashCard>

      {isPending ? (
        <p className="py-10 text-center text-sm text-quiet">Loading listings…</p>
      ) : null}

      <div className="space-y-3 md:hidden">
        {rows.map((p) => (
          <DashCard key={p.id} className="p-4">
            <Link
              to="/admin/listings/$id"
              params={{ id: p.id }}
              className="flex gap-3"
            >
              <img
                src={p.images[0]}
                alt=""
                className="media size-16 shrink-0 rounded-md object-cover"
              />
              <span className="min-w-0">
                <span className="block font-medium">{p.title}</span>
                <span className="block text-xs text-quiet">
                  {p.neighborhood} · {formatPrice(p.price, p.pricePeriod)}
                </span>
                <span className="mt-1 inline-flex">
                  <Badge variant={p.lifecycle === "live" ? "rent" : "muted"}>
                    {LIFECYCLE_LABEL[p.lifecycle]}
                  </Badge>
                </span>
              </span>
            </Link>
            <div className="mt-3 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => void toggle(p.id, p.lifecycle)}
              >
                {p.lifecycle === "live" ? "Pause" : "Go live"}
              </Button>
            </div>
          </DashCard>
        ))}
        {!isPending && rows.length === 0 ? (
          <p className="py-10 text-center text-sm text-quiet">
            No listings match those filters.
          </p>
        ) : null}
      </div>

      <DashCard className="hidden overflow-hidden p-0 md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-border bg-cream/70 text-xs uppercase tracking-[0.12em] text-quiet">
              <tr>
                <th className="px-4 py-3 font-medium">Listing</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <Link
                      to="/admin/listings/$id"
                      params={{ id: p.id }}
                      className="flex items-center gap-3"
                    >
                      <img
                        src={p.images[0]}
                        alt=""
                        className="media size-12 rounded-md object-cover"
                      />
                      <span>
                        <span className="block font-medium text-charcoal">
                          {p.title}
                        </span>
                        <span className="block text-xs text-quiet">
                          {p.neighborhood}, {p.city}
                          {p.featured ? " · Featured" : ""}
                        </span>
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={p.lifecycle === "live" ? "rent" : "muted"}
                      className={cn(
                        p.lifecycle === "paused" && "normal-case tracking-normal",
                      )}
                    >
                      {LIFECYCLE_LABEL[p.lifecycle]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 tabular-nums text-quiet">
                    {formatPrice(p.price, p.pricePeriod)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {p.lifecycle === "live" ? (
                        <Button variant="ghost" size="sm" asChild>
                          <Link
                            to="/properties/$slug"
                            params={{ slug: p.slug }}
                            target="_blank"
                          >
                            <ExternalLink className="size-4" />
                            <span className="sr-only">View on site</span>
                          </Link>
                        </Button>
                      ) : null}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => void toggle(p.id, p.lifecycle)}
                      >
                        {p.lifecycle === "live" ? "Pause" : "Go live"}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!isPending && rows.length === 0 ? (
          <p className="px-4 py-12 text-center text-sm text-quiet">
            No listings match those filters.
          </p>
        ) : null}
      </DashCard>
    </div>
  );
}
