"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

const typeTabs = [
  { value: "all", label: "All" },
  { value: "rent", label: "Rent" },
  { value: "buy", label: "Buy" },
  { value: "land", label: "Land" },
] as const;

export function FilterPanel({ total }: { total: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (!value || value === "all" || value === "any") params.delete(key);
      else params.set(key, value);
      startTransition(() => {
        router.push(`/properties?${params.toString()}`);
      });
    },
    [router, searchParams]
  );

  const currentType = searchParams.get("type") || "all";
  const sort = searchParams.get("sort") || "recommended";

  return (
    <div className={cn("space-y-4", pending && "opacity-70")}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-charcoal md:text-4xl">
            Find your next place.
          </h1>
          <p className="mt-1 text-sm text-muted">{total} properties</p>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted">Sort</span>
          <select
            value={sort}
            onChange={(e) => update("sort", e.target.value)}
            className="h-10 rounded-xl border border-border bg-white px-3 text-sm focus:border-green focus:outline-none"
          >
            <option value="recommended">Recommended</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </label>
      </div>

      <div className="flex gap-1 overflow-x-auto rounded-full bg-cream-dark p-1">
        {typeTabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => update("type", tab.value)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              currentType === tab.value
                ? "bg-white text-green shadow-sm"
                : "text-muted hover:text-charcoal"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 rounded-2xl border border-border bg-white p-4 sm:grid-cols-2 lg:grid-cols-5">
        <label className="text-sm">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted">
            Location
          </span>
          <input
            defaultValue={searchParams.get("location") || ""}
            key={searchParams.get("location") || "loc"}
            placeholder="Kigali, Kicukiro"
            onBlur={(e) => update("location", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                update("location", (e.target as HTMLInputElement).value);
              }
            }}
            className="h-11 w-full rounded-xl border border-border px-3 focus:border-green focus:outline-none"
          />
        </label>

        <label className="text-sm">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted">
            Property type
          </span>
          <select
            value={searchParams.get("propertyType") || "all"}
            onChange={(e) => update("propertyType", e.target.value)}
            className="h-11 w-full rounded-xl border border-border bg-white px-3 focus:border-green focus:outline-none"
          >
            <option value="all">Any type</option>
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="land">Land</option>
            <option value="commercial">Commercial</option>
          </select>
        </label>

        <label className="text-sm">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted">
            Max price
          </span>
          <select
            value={searchParams.get("maxPrice") || ""}
            onChange={(e) => update("maxPrice", e.target.value)}
            className="h-11 w-full rounded-xl border border-border bg-white px-3 focus:border-green focus:outline-none"
          >
            <option value="">Any</option>
            <option value="200000">RWF 200,000</option>
            <option value="500000">RWF 500,000</option>
            <option value="1000000">RWF 1,000,000</option>
            <option value="50000000">RWF 50M</option>
            <option value="200000000">RWF 200M</option>
          </select>
        </label>

        <label className="text-sm">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted">
            Bedrooms
          </span>
          <select
            value={searchParams.get("bedrooms") || "any"}
            onChange={(e) => update("bedrooms", e.target.value)}
            className="h-11 w-full rounded-xl border border-border bg-white px-3 focus:border-green focus:outline-none"
          >
            <option value="any">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </label>

        <div className="flex items-end">
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() =>
              startTransition(() => router.push("/properties"))
            }
          >
            Clear filters
          </Button>
        </div>
      </div>
    </div>
  );
}
