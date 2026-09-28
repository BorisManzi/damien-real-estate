import { createFileRoute } from "@tanstack/react-router";
import { ListingForm } from "@/components/admin/listing-form";
import { DashCard } from "@/components/admin/shell";

export const Route = createFileRoute("/admin/listings/new")({
  component: NewListingPage,
});

function NewListingPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          New listing
        </h1>
        <p className="mt-1 text-sm text-quiet">
          Live listings appear on the public Damien site immediately.
        </p>
      </div>
      <DashCard>
        <ListingForm />
      </DashCard>
    </div>
  );
}
