import { Link, createFileRoute } from "@tanstack/react-router";
import { Building2, Plus, Users } from "lucide-react";
import { DashCard } from "@/components/admin/shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CLIENT_STATUS_LABEL, LIFECYCLE_LABEL } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { useClientsQuery, useManagedListingsQuery } from "@/lib/listings-query";

export const Route = createFileRoute("/admin/")({
  component: OverviewPage,
});

function OverviewPage() {
  const listingsQ = useManagedListingsQuery();
  const clientsQ = useClientsQuery();
  const listings = listingsQ.data ?? [];
  const clients = clientsQ.data ?? [];
  const live = listings.filter((l) => l.lifecycle === "live").length;
  const recent = listings.slice(0, 6);
  const recentClients = clients.slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Workspace
          </h1>
          <p className="mt-1 text-sm text-quiet">
            Listings, contacts, and the public homepage.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link to="/admin/home">Edit homepage</Link>
          </Button>
          <Button variant="terracotta" asChild>
            <Link to="/admin/listings/new">
              <Plus className="size-4" />
              Add listing
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <DashCard className="p-5">
          <div className="flex items-start justify-between">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-quiet">
              Live listings
            </p>
            <Building2 className="size-4 text-sage-deep" />
          </div>
          <p className="mt-3 font-display text-3xl font-semibold tabular-nums">
            {live}
          </p>
          <p className="mt-1 text-xs text-quiet">{listings.length} in total</p>
        </DashCard>
        <DashCard className="p-5">
          <div className="flex items-start justify-between">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-quiet">
              Contacts
            </p>
            <Users className="size-4 text-sage-deep" />
          </div>
          <p className="mt-3 font-display text-3xl font-semibold tabular-nums">
            {clients.length}
          </p>
          <p className="mt-1 text-xs text-quiet">Renters, buyers, inquiries</p>
        </DashCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <DashCard>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Listings</h2>
            <Link
              to="/admin/listings"
              className="text-sm font-medium text-green hover:underline"
            >
              All
            </Link>
          </div>
          <ul className="space-y-3">
            {recent.map((p) => (
              <li key={p.id} className="flex gap-3">
                <img
                  src={p.images[0]}
                  alt=""
                  className="media size-14 rounded-md object-cover"
                />
                <div className="min-w-0 flex-1">
                  <Link
                    to="/admin/listings/$id"
                    params={{ id: p.id }}
                    className="truncate font-medium hover:text-green"
                  >
                    {p.title}
                  </Link>
                  <p className="text-xs text-quiet">
                    {p.neighborhood} · {formatPrice(p.price, p.pricePeriod)}
                  </p>
                  <Badge
                    variant={p.lifecycle === "live" ? "rent" : "muted"}
                    className="mt-1"
                  >
                    {LIFECYCLE_LABEL[p.lifecycle]}
                  </Badge>
                </div>
              </li>
            ))}
            {!recent.length ? (
              <p className="py-6 text-sm text-quiet">No listings yet.</p>
            ) : null}
          </ul>
        </DashCard>

        <DashCard>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Contacts</h2>
            <Link
              to="/admin/clients"
              className="text-sm font-medium text-green hover:underline"
            >
              All
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {recentClients.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{c.name}</p>
                  <p className="truncate text-xs text-quiet">
                    {c.phone}
                    {c.listingTitle ? ` · ${c.listingTitle}` : ""}
                  </p>
                </div>
                <Badge variant={c.status === "inquired" ? "new" : "muted"}>
                  {CLIENT_STATUS_LABEL[c.status]}
                </Badge>
              </li>
            ))}
            {!recentClients.length ? (
              <p className="py-6 text-sm text-quiet">No contacts yet.</p>
            ) : null}
          </ul>
        </DashCard>
      </div>
    </div>
  );
}
