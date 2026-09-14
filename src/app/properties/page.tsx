import { FilterPanel } from "@/components/property/FilterPanel";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { searchProperties } from "@/lib/properties";
import type { PropertyFilters, PropertyType, TransactionType } from "@/types/property";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Properties",
  description:
    "Browse homes, apartments and land for rent and sale across Rwanda.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const filters: PropertyFilters = {
    transactionType: (first(sp.type) as TransactionType | "all") || "all",
    location: first(sp.location),
    propertyType: (first(sp.propertyType) as PropertyType | "all") || "all",
    maxPrice: first(sp.maxPrice) ? Number(first(sp.maxPrice)) : undefined,
    bedrooms: first(sp.bedrooms)
      ? (Number(first(sp.bedrooms)) as number)
      : "any",
    sort: (first(sp.sort) as PropertyFilters["sort"]) || "recommended",
    query: first(sp.q),
  };

  const results = await searchProperties(filters);

  return (
    <div className="container-page py-10 md:py-14">
      <Suspense fallback={<div className="h-40 animate-pulse rounded-2xl bg-cream-dark" />}>
        <FilterPanel total={results.length} />
      </Suspense>
      <div className="mt-8">
        <PropertyGrid properties={results} />
      </div>
    </div>
  );
}
