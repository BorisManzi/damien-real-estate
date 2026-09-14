import { PropertyGrid } from "@/components/property/PropertyGrid";
import type { Property } from "@/types/property";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function FeaturedProperties({ properties }: { properties: Property[] }) {
  return (
    <section className="container-page py-16 md:py-24">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-3xl font-bold text-charcoal md:text-4xl">
            Places worth seeing.
          </h2>
          <p className="mt-2 max-w-xl text-muted">
            A few of the properties currently available through Damien.
          </p>
        </div>
        <Link
          href="/properties"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-green hover:gap-2.5 transition-all"
        >
          View all properties
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <PropertyGrid properties={properties} />
    </section>
  );
}
