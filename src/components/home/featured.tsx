import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PropertyGrid, PropertyGridSkeleton } from "@/components/property/property-grid";
import type { Property } from "@/data/properties";
import { getFeaturedProperties } from "@/data/properties";
import { useHomePage } from "@/lib/home-context";
import { useLiveListingsQuery } from "@/lib/listings-query";

export function Featured({ listings }: { listings?: Property[] }) {
  const { featured } = useHomePage();
  const q = useLiveListingsQuery(listings);
  const items = getFeaturedProperties(q.data ?? []);
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-charcoal sm:text-4xl">
            {featured.heading}
          </h2>
          <p className="mt-2 max-w-md text-quiet">{featured.subhead}</p>
        </div>
        <Link
          to="/properties"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-green hover:underline"
        >
          {featured.linkLabel}
          <ArrowRight className="size-4" />
        </Link>
      </div>
      <div className="mt-10">
        {q.isPending ? (
          <PropertyGridSkeleton />
        ) : (
          <PropertyGrid properties={items} />
        )}
      </div>
    </section>
  );
}
