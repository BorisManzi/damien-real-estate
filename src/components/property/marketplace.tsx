import { Link, useNavigate } from "@tanstack/react-router";
import { FilterBar } from "@/components/property/filter-bar";
import { PropertyGrid, PropertyGridSkeleton } from "@/components/property/property-grid";
import { Button } from "@/components/ui/button";
import type { Property, TransactionType } from "@/data/properties";
import { filterProperties, type PropertySearch } from "@/lib/filters";
import { useLiveListingsQuery } from "@/lib/listings-query";

export function Marketplace({
  title,
  subtitle,
  search,
  lockedIntent,
  path,
  listings,
}: {
  title: string;
  subtitle?: string;
  search: PropertySearch;
  lockedIntent?: TransactionType;
  path: "/properties" | "/rent" | "/buy" | "/land";
  listings?: Property[];
}) {
  const navigate = useNavigate();
  const q = useLiveListingsQuery(listings);
  const published = q.data ?? [];
  const filters = lockedIntent ? { ...search, intent: lockedIntent } : search;
  const results = filterProperties(published, filters);
  const view = search.view ?? "grid";

  function onChange(next: PropertySearch) {
    const merged = lockedIntent ? { ...next, intent: lockedIntent } : next;
    void navigate({
      to: path,
      search: merged,
    });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-2 max-w-xl text-quiet">{subtitle}</p>
      ) : null}

      <div className="mt-8 rounded-xl border border-border bg-paper p-4 sm:p-5">
        <FilterBar
          value={filters}
          onChange={onChange}
          lockedIntent={lockedIntent}
        />
      </div>

      <div className="mt-8 flex items-baseline justify-between">
        <p className="text-sm text-quiet">
          {q.isPending ? (
            "Loading properties…"
          ) : (
            <>
              <span className="font-medium text-charcoal">{results.length}</span>{" "}
              {results.length === 1 ? "property" : "properties"}
            </>
          )}
        </p>
      </div>

      <div className="mt-5">
        {q.isPending ? (
          <PropertyGridSkeleton />
        ) : results.length === 0 ? (
          <EmptyState
            onClear={() =>
              onChange({
                intent: lockedIntent,
                sort: "recommended",
                view,
              })
            }
          />
        ) : (
          <PropertyGrid properties={results} layout={view} />
        )}
      </div>
    </div>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-paper px-6 py-16 text-center">
      <p className="font-display text-xl font-semibold">No places match yet</p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-quiet">
        Try a different neighbourhood, budget or type — or tell Damien what you
        need and we’ll look with you.
      </p>
      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button variant="outline" onClick={onClear}>
          Clear filters
        </Button>
        <Button variant="terracotta" asChild>
          <Link to="/contact">Help me find a place</Link>
        </Button>
      </div>
    </div>
  );
}
