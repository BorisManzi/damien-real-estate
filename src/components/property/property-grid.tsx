import { PropertyCard } from "@/components/property/property-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Property } from "@/data/properties";
import { cn } from "@/lib/utils";

export function PropertyGrid({
  properties,
  layout = "grid",
}: {
  properties: Property[];
  layout?: "grid" | "list";
}) {
  return (
    <div
      className={cn(
        layout === "list"
          ? "flex flex-col gap-4"
          : "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3",
      )}
    >
      {properties.map((p) => (
        <PropertyCard key={p.id} property={p} layout={layout} />
      ))}
    </div>
  );
}

export function PropertyGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-xl bg-paper shadow-border">
          <Skeleton className="aspect-[4/3] w-full rounded-none" />
          <div className="space-y-2 p-4">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-5 w-32" />
          </div>
        </div>
      ))}
    </div>
  );
}
