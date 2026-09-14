import { PropertyGrid } from "@/components/property/PropertyGrid";
import { searchProperties } from "@/lib/properties";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Rent",
  description: "Find houses and apartments for rent across Rwanda with Damien.",
};

export default async function RentPage() {
  const properties = await searchProperties({
    transactionType: "rent",
    sort: "recommended",
  });

  return (
    <div className="container-page py-10 md:py-14">
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-wide text-green">
          For rent
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">
          Places to rent.
        </h1>
        <p className="mt-2 text-muted">
          {properties.length} rental properties ·{" "}
          <Link href="/properties?type=rent" className="text-green underline-offset-2 hover:underline">
            Refine search
          </Link>
        </p>
      </div>
      <PropertyGrid properties={properties} />
    </div>
  );
}
