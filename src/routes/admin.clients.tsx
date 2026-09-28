import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { type FormEvent, useMemo, useState } from "react";
import { toast } from "sonner";
import { DashCard } from "@/components/admin/shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/select-native";
import { Textarea } from "@/components/ui/textarea";
import {
  CLIENT_STATUS_LABEL,
  deleteClient,
  saveClient,
  type ClientRow,
  type ClientStatus,
} from "@/lib/catalog";
import { formatWhen } from "@/lib/format";
import { useClientsQuery, useManagedListings } from "@/lib/listings-query";

export const Route = createFileRoute("/admin/clients")({
  component: ClientsPage,
});

function ClientsPage() {
  const queryClient = useQueryClient();
  const { data: clients = [], isPending } = useClientsQuery();
  const listings = useManagedListings();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"" | ClientStatus>("");
  const [editing, setEditing] = useState<ClientRow | "new" | null>(null);

  const rows = useMemo(() => {
    return clients.filter((c) => {
      if (status && c.status !== status) return false;
      if (q) {
        const blob = `${c.name} ${c.phone} ${c.email} ${c.listingTitle ?? ""}`.toLowerCase();
        if (!blob.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [clients, q, status]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            Contacts
          </h1>
          <p className="mt-1 text-sm text-quiet">
            People who inquired, rented, or bought — names and numbers in one place.
          </p>
        </div>
        <Button variant="terracotta" onClick={() => setEditing("new")}>
          <Plus className="size-4" />
          Add contact
        </Button>
      </div>

      <DashCard className="p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, phone or listing"
            aria-label="Search contacts"
          />
          <NativeSelect
            value={status}
            onChange={(e) => setStatus(e.target.value as "" | ClientStatus)}
            aria-label="Filter by status"
          >
            <option value="">Everyone</option>
            <option value="rented">Rented</option>
            <option value="purchased">Purchased</option>
            <option value="inquired">Inquired</option>
          </NativeSelect>
        </div>
      </DashCard>

      <div className="space-y-3 md:hidden">
        {rows.map((c) => (
          <button
            key={c.id}
            type="button"
            className="w-full rounded-xl border border-border bg-paper p-4 text-left shadow-border"
            onClick={() => setEditing(c)}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="font-medium">{c.name}</p>
              <Badge variant={c.status === "inquired" ? "new" : "muted"}>
                {CLIENT_STATUS_LABEL[c.status]}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-quiet">{c.phone}</p>
            {c.listingTitle ? (
              <p className="mt-1 text-xs text-faint">{c.listingTitle}</p>
            ) : null}
          </button>
        ))}
      </div>

      <DashCard className="hidden overflow-hidden p-0 md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-border bg-cream/70 text-xs uppercase tracking-[0.12em] text-quiet">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Listing</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Added</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr
                  key={c.id}
                  className="cursor-pointer border-b border-border last:border-0 hover:bg-cream/60"
                  onClick={() => setEditing(c)}
                >
                  <td className="px-4 py-3">
                    <p className="font-medium">{c.name}</p>
                    {c.email ? (
                      <p className="text-xs text-quiet">{c.email}</p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-quiet">{c.phone || "—"}</td>
                  <td className="px-4 py-3 text-quiet">{c.listingTitle ?? "—"}</td>
                  <td className="px-4 py-3">
                    <Badge variant={c.status === "inquired" ? "new" : "muted"}>
                      {CLIENT_STATUS_LABEL[c.status]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-quiet">{formatWhen(c.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {isPending ? (
          <p className="px-4 py-12 text-center text-sm text-quiet">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="px-4 py-12 text-center text-sm text-quiet">
            No contacts yet. Add someone who rented or bought.
          </p>
        ) : null}
      </DashCard>

      <ClientDialog
        open={editing !== null}
        client={editing === "new" || editing === null ? null : editing}
        listings={listings.map((l) => ({ id: l.id, title: l.title }))}
        onClose={() => setEditing(null)}
        onSaved={async () => {
          await queryClient.invalidateQueries({ queryKey: ["clients"] });
          setEditing(null);
        }}
      />
    </div>
  );
}

function ClientDialog({
  open,
  client,
  listings,
  onClose,
  onSaved,
}: {
  open: boolean;
  client: ClientRow | null;
  listings: { id: string; title: string }[];
  onClose: () => void;
  onSaved: () => void | Promise<void>;
}) {
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setBusy(true);
    try {
      await saveClient({
        data: {
          id: client?.id,
          name: String(data.get("name") ?? ""),
          phone: String(data.get("phone") ?? ""),
          email: String(data.get("email") ?? ""),
          status: String(data.get("status")) as ClientStatus,
          listingId: String(data.get("listingId") ?? "") || null,
          notes: String(data.get("notes") ?? ""),
        },
      });
      toast.success(client ? "Contact saved" : "Contact added");
      await onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{client ? "Edit contact" : "New contact"}</DialogTitle>
          <DialogDescription>
            Keep a name and number for someone who inquired, rented, or bought.
          </DialogDescription>
        </DialogHeader>
        <form key={client?.id ?? "new"} onSubmit={submit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required defaultValue={client?.name} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" defaultValue={client?.phone} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" defaultValue={client?.email} />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="status">Status</Label>
              <NativeSelect
                id="status"
                name="status"
                defaultValue={client?.status ?? "rented"}
              >
                <option value="rented">Rented</option>
                <option value="purchased">Purchased</option>
                <option value="inquired">Inquired</option>
              </NativeSelect>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="listingId">Listing</Label>
              <NativeSelect
                id="listingId"
                name="listingId"
                defaultValue={client?.listingId ?? ""}
              >
                <option value="">None</option>
                {listings.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.title}
                  </option>
                ))}
              </NativeSelect>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" defaultValue={client?.notes} />
          </div>
          <div className="flex flex-wrap justify-between gap-2 pt-2">
            {client ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  void (async () => {
                    await deleteClient({ data: client.id });
                    await queryClient.invalidateQueries({ queryKey: ["clients"] });
                    toast.success("Contact removed");
                    await onSaved();
                  })();
                }}
              >
                Remove
              </Button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="terracotta" disabled={busy}>
                {busy ? "Saving…" : "Save"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
