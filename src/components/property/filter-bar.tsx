import { LayoutGrid, List } from "lucide-react";
import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/select-native";
import { LOCATIONS, PROPERTY_TYPES } from "@/data/properties";
import {
  budgetsFor,
  type PropertySearch,
  type SortKey,
  type ViewKey,
} from "@/lib/filters";
import type { PropertyKind, TransactionType } from "@/data/properties";
import { cn } from "@/lib/utils";

const INTENTS: { id: TransactionType | ""; label: string }[] = [
  { id: "", label: "All" },
  { id: "rent", label: "Rent" },
  { id: "buy", label: "Buy" },
  { id: "land", label: "Land" },
];

export function FilterBar({
  value,
  onChange,
  lockedIntent,
}: {
  value: PropertySearch;
  onChange: (next: PropertySearch) => void;
  lockedIntent?: TransactionType;
}) {
  const intent = lockedIntent ?? value.intent;
  const budgets = budgetsFor(intent);

  function patch(partial: PropertySearch) {
    onChange({ ...value, ...partial });
  }

  return (
    <div className="flex flex-col gap-4">
      {lockedIntent ? null : (
        <div
          className="flex w-fit gap-1 rounded-full bg-cream-dark p-1"
          role="tablist"
        >
          {INTENTS.map((tab) => (
            <button
              key={tab.label}
              type="button"
              role="tab"
              aria-selected={(intent ?? "") === tab.id}
              onClick={() =>
                patch({
                  intent: tab.id === "" ? undefined : tab.id,
                  type: tab.id === "land" ? "land" : value.type === "land" ? undefined : value.type,
                })
              }
              className={cn(
                "h-9 min-w-14 rounded-full px-4 text-sm font-medium transition-colors",
                (intent ?? "") === tab.id
                  ? "bg-green text-cream"
                  : "text-quiet hover:text-charcoal",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <Field label="Location" htmlFor="filter-location">
          <NativeSelect
            id="filter-location"
            value={value.location ?? ""}
            onChange={(e) =>
              patch({ location: e.target.value || undefined })
            }
          >
            <option value="">All locations</option>
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </NativeSelect>
        </Field>
        <Field label="Type" htmlFor="filter-type">
          <NativeSelect
            id="filter-type"
            value={value.type ?? ""}
            onChange={(e) =>
              patch({
                type: (e.target.value || undefined) as PropertyKind | undefined,
              })
            }
          >
            {PROPERTY_TYPES.map((t) => (
              <option key={t.label} value={t.value}>
                {t.label}
              </option>
            ))}
          </NativeSelect>
        </Field>
        <Field label="Price" htmlFor="filter-price">
          <NativeSelect
            id="filter-price"
            value={value.budget ?? ""}
            onChange={(e) => patch({ budget: e.target.value || undefined })}
          >
            {budgets.map((b) => (
              <option key={b.label} value={b.value}>
                {b.label}
              </option>
            ))}
          </NativeSelect>
        </Field>
        <Field label="Bedrooms" htmlFor="filter-beds">
          <NativeSelect
            id="filter-beds"
            value={value.beds ?? ""}
            onChange={(e) => patch({ beds: e.target.value || undefined })}
          >
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </NativeSelect>
        </Field>
        <Field label="Bathrooms" htmlFor="filter-baths">
          <NativeSelect
            id="filter-baths"
            value={value.baths ?? ""}
            onChange={(e) => patch({ baths: e.target.value || undefined })}
          >
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
          </NativeSelect>
        </Field>
        <Field label="Furnished" htmlFor="filter-furnished">
          <NativeSelect
            id="filter-furnished"
            value={value.furnished ?? ""}
            onChange={(e) =>
              patch({ furnished: e.target.value || undefined })
            }
          >
            <option value="">Any</option>
            <option value="yes">Furnished</option>
            <option value="no">Unfurnished</option>
          </NativeSelect>
        </Field>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Field label="Sort" htmlFor="filter-sort">
          <NativeSelect
            id="filter-sort"
            value={value.sort ?? "recommended"}
            onChange={(e) => patch({ sort: e.target.value as SortKey })}
            className="w-48"
          >
            <option value="recommended">Recommended</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </NativeSelect>
        </Field>
        <div className="flex rounded-full border border-border p-1">
          <button
            type="button"
            aria-label="Grid view"
            aria-pressed={(value.view ?? "grid") === "grid"}
            onClick={() => patch({ view: "grid" })}
            className={cn(
              "inline-flex size-9 items-center justify-center rounded-full",
              (value.view ?? "grid") === "grid"
                ? "bg-green text-cream"
                : "text-quiet hover:text-charcoal",
            )}
          >
            <LayoutGrid className="size-4" />
          </button>
          <button
            type="button"
            aria-label="List view"
            aria-pressed={value.view === "list"}
            onClick={() => patch({ view: "list" as ViewKey })}
            className={cn(
              "inline-flex size-9 items-center justify-center rounded-full",
              value.view === "list"
                ? "bg-green text-cream"
                : "text-quiet hover:text-charcoal",
            )}
          >
            <List className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}
