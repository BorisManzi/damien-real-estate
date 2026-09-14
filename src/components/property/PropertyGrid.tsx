import { PropertyCard } from "@/components/property/PropertyCard";
import type { Property } from "@/types/property";

export function PropertyGrid({
  properties,
  emptyMessage = "No properties match your search. Try adjusting filters or talk to Damien.",
}: {
  properties: Property[];
  emptyMessage?: string;
}) {
  if (properties.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-16 text-center">
        <p className="font-display text-xl font-semibold text-charcoal">
          Nothing here yet
        </p>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
