import { PropertyGrid } from "@/components/property/PropertyGrid";
import { searchProperties } from "@/lib/properties";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Buy",
  description: "Browse homes and properties for sale across Rwanda.",
};

export default async function BuyPage() {
  const properties = await searchProperties({
    transactionType: "buy",
    sort: "recommended",
  });

  return (
    <div className="container-page py-10 md:py-14">
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-wide text-green">
          For sale
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">
          Places to buy.
        </h1>
        <p className="mt-2 text-muted">
          {properties.length} properties for sale ·{" "}
          <Link href="/properties?type=buy" className="text-green underline-offset-2 hover:underline">
            Refine search
          </Link>
        </p>
      </div>
      <PropertyGrid properties={properties} />
    </div>
  );
}
