"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { TransactionType } from "@/types/property";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const tabs: { id: TransactionType; label: string }[] = [
  { id: "rent", label: "Rent" },
  { id: "buy", label: "Buy" },
  { id: "land", label: "Land" },
];

export function SearchBar({
  className,
  defaultTab = "rent",
  compact = false,
}: {
  className?: string;
  defaultTab?: TransactionType;
  compact?: boolean;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<TransactionType>(defaultTab);
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [budget, setBudget] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  function submit(e?: FormEvent) {
    e?.preventDefault();
    const params = new URLSearchParams();
    params.set("type", tab);
    if (location) params.set("location", location);
    if (propertyType) params.set("propertyType", propertyType);
    if (budget) params.set("maxPrice", budget);
    setMobileOpen(false);
    router.push(`/properties?${params.toString()}`);
  }

  const form = (
    <form onSubmit={submit} className="w-full">
      <div className="mb-4 flex gap-1 rounded-full bg-cream p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              tab === t.id
                ? "bg-white text-green shadow-sm"
                : "text-muted hover:text-charcoal"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div
        className={cn(
          "grid gap-3",
          compact ? "md:grid-cols-4" : "md:grid-cols-[1.2fr_1fr_1fr_auto]"
        )}
      >
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">
            Location
          </span>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Kigali, Kicukiro"
            className="h-12 w-full rounded-xl border border-border bg-white px-4 text-sm focus:border-green focus:outline-none focus:ring-2 focus:ring-green/15"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">
            Property type
          </span>
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="h-12 w-full rounded-xl border border-border bg-white px-4 text-sm focus:border-green focus:outline-none focus:ring-2 focus:ring-green/15"
          >
            <option value="">Any type</option>
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="land">Land</option>
            <option value="commercial">Commercial</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">
            Budget
          </span>
          <select
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="h-12 w-full rounded-xl border border-border bg-white px-4 text-sm focus:border-green focus:outline-none focus:ring-2 focus:ring-green/15"
          >
            <option value="">Any budget</option>
            <option value="200000">Up to RWF 200,000</option>
            <option value="500000">Up to RWF 500,000</option>
            <option value="1000000">Up to RWF 1,000,000</option>
            <option value="50000000">Up to RWF 50M</option>
            <option value="200000000">Up to RWF 200M</option>
          </select>
        </label>
        <div className="flex items-end">
          <Button type="submit" size="lg" className="w-full md:min-w-[10rem]">
            <Search className="h-4 w-4" aria-hidden />
            Search properties
          </Button>
        </div>
      </div>
    </form>
  );

  return (
    <>
      {/* Desktop / tablet search card */}
      <div
        className={cn(
          "hidden rounded-2xl border border-white/20 bg-white/95 p-5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.45)] backdrop-blur-md md:block",
          className
        )}
      >
        <p className="mb-3 font-display text-lg font-semibold text-charcoal">
          What are you looking for?
        </p>
        {form}
      </div>

      {/* Mobile trigger */}
      <div className={cn("md:hidden", className)}>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex w-full items-center gap-3 rounded-2xl border border-white/20 bg-white/95 px-4 py-4 text-left shadow-lg backdrop-blur-md"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-green text-white">
            <Search className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-sm font-semibold text-charcoal">
              Search properties
            </span>
            <span className="text-xs text-muted">
              Location · Type · Budget
            </span>
          </span>
        </button>
      </div>

      {/* Mobile full-screen search */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[70] bg-cream md:hidden">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="font-display text-lg font-semibold">
              What are you looking for?
            </p>
            <button
              type="button"
              aria-label="Close search"
              onClick={() => setMobileOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl hover:bg-cream-dark"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-4">{form}</div>
        </div>
      )}
    </>
  );
}
