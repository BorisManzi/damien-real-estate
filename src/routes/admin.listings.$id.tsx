import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ListingForm } from "@/components/admin/listing-form";
import { DashCard } from "@/components/admin/shell";
import { Button } from "@/components/ui/button";
import { deleteListing, getManagedListing } from "@/lib/catalog";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/admin/listings/$id")({
  component: EditListingPage,
});

function EditListingPage() {
  const { id } = Route.useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: listing, isPending } = useQuery({
    queryKey: ["listings", "one", id],
    queryFn: () => getManagedListing({ data: id }),
  });

  if (isPending) {
    return <p className="py-16 text-center text-sm text-quiet">Loading listing…</p>;
  }

  if (!listing) {
    return (
      <div className="py-16 text-center">
        <p className="font-display text-2xl font-semibold">Listing not found</p>
        <Link to="/admin/listings" className="mt-3 inline-block text-sm text-green">
          Back to listings
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            {listing.title}
          </h1>
          <p className="mt-1 text-sm text-quiet">
            {listing.neighborhood}, {listing.city}
          </p>
        </div>
        <div className="flex gap-2">
          {listing.lifecycle === "live" ? (
            <Button variant="outline" size="sm" asChild>
              <Link to="/properties/$slug" params={{ slug: listing.slug }}>
                View on site
              </Link>
            </Button>
          ) : null}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              void (async () => {
                await deleteListing({ data: listing.id });
                await queryClient.invalidateQueries({ queryKey: ["listings"] });
                toast.success("Listing removed");
                void navigate({ to: "/admin/listings" });
              })();
            }}
          >
            Remove
          </Button>
        </div>
      </div>
      <DashCard>
        <ListingForm listing={listing} />
      </DashCard>
    </div>
  );
}
