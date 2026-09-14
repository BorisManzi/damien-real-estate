import { PropertyGrid } from "@/components/property/PropertyGrid";
import { searchProperties } from "@/lib/properties";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Land",
  description: "Discover land opportunities across Rwanda with Damien Real Estate.",
};

export default async function LandPage() {
  const properties = await searchProperties({
    transactionType: "land",
    sort: "recommended",
  });

  return (
    <div className="container-page py-10 md:py-14">
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-wide text-green">
          Land
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">
          Land opportunities.
        </h1>
        <p className="mt-2 text-muted">
          {properties.length} plots available ·{" "}
          <Link href="/properties?type=land" className="text-green underline-offset-2 hover:underline">
            Refine search
          </Link>
        </p>
      </div>
      <PropertyGrid properties={properties} />
    </div>
  );
}
