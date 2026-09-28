import {
  properties,
  type Property,
  type PropertyKind,
  type TransactionType,
} from "@/data/properties";

export type SortKey = "recommended" | "newest" | "price-asc" | "price-desc";
export type ViewKey = "grid" | "list";

export type PropertySearch = {
  intent?: TransactionType;
  location?: string;
  type?: PropertyKind;
  budget?: string;
  beds?: string;
  baths?: string;
  furnished?: string;
  q?: string;
  sort?: SortKey;
  view?: ViewKey;
};

export const emptySearch: PropertySearch = {};

export function parseSearch(raw: Record<string, unknown>): PropertySearch {
  const str = (key: string) => {
    const v = raw[key];
    return typeof v === "string" && v.length ? v : undefined;
  };
  const intent = str("intent");
  const type = str("type");
  const sort = str("sort");
  const view = str("view");
  return {
    intent:
      intent === "rent" || intent === "buy" || intent === "land"
        ? intent
        : undefined,
    location: str("location"),
    type: isKind(type) ? type : undefined,
    budget: str("budget"),
    beds: str("beds"),
    baths: str("baths"),
    furnished: str("furnished"),
    q: str("q"),
    sort: isSort(sort) ? sort : undefined,
    view: view === "list" || view === "grid" ? view : undefined,
  };
}

function isKind(v: string | undefined): v is PropertyKind {
  return (
    v === "house" ||
    v === "apartment" ||
    v === "studio" ||
    v === "townhouse" ||
    v === "land" ||
    v === "commercial"
  );
}

function isSort(v: string | undefined): v is SortKey {
  return (
    v === "recommended" ||
    v === "newest" ||
    v === "price-asc" ||
    v === "price-desc"
  );
}

export function filterProperties(
  list: Property[],
  filters: PropertySearch,
): Property[] {
  let result = list.filter((p) => {
    if (filters.intent && p.transactionType !== filters.intent) return false;
    if (filters.type && p.propertyType !== filters.type) return false;
    if (filters.location) {
      const q = filters.location.toLowerCase();
      const blob = `${p.city} ${p.district} ${p.neighborhood}`.toLowerCase();
      if (!blob.includes(q)) return false;
    }
    if (filters.q) {
      const q = filters.q.toLowerCase();
      const blob =
        `${p.title} ${p.city} ${p.district} ${p.neighborhood} ${p.description}`.toLowerCase();
      if (!blob.includes(q)) return false;
    }
    if (filters.budget) {
      const cap = Number(filters.budget);
      if (!Number.isNaN(cap) && p.price > cap) return false;
    }
    if (filters.beds) {
      const n = Number(filters.beds);
      if (!Number.isNaN(n)) {
        if (p.bedrooms == null || p.bedrooms < n) return false;
      }
    }
    if (filters.baths) {
      const n = Number(filters.baths);
      if (!Number.isNaN(n)) {
        if (p.bathrooms == null || p.bathrooms < n) return false;
      }
    }
    if (filters.furnished === "yes") {
      if (p.furnished !== true && p.furnished !== "partial") return false;
    }
    if (filters.furnished === "no") {
      if (p.furnished !== false) return false;
    }
    return true;
  });

  const sort = filters.sort ?? "recommended";
  result = [...result];
  if (sort === "newest") {
    result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } else if (sort === "price-asc") {
    result.sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    result.sort((a, b) => b.price - a.price);
  } else {
    result.sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return b.createdAt.localeCompare(a.createdAt);
    });
  }
  return result;
}

export function allFiltered(filters: PropertySearch, list: Property[] = properties) {
  return filterProperties(list, filters);
}

export const RENT_BUDGETS = [
  { value: "", label: "Any budget" },
  { value: "200000", label: "Up to RWF 200,000" },
  { value: "350000", label: "Up to RWF 350,000" },
  { value: "500000", label: "Up to RWF 500,000" },
  { value: "800000", label: "Up to RWF 800,000" },
  { value: "1500000", label: "Up to RWF 1,500,000" },
];

export const BUY_BUDGETS = [
  { value: "", label: "Any budget" },
  { value: "40000000", label: "Up to RWF 40,000,000" },
  { value: "70000000", label: "Up to RWF 70,000,000" },
  { value: "100000000", label: "Up to RWF 100,000,000" },
  { value: "150000000", label: "Up to RWF 150,000,000" },
  { value: "250000000", label: "Up to RWF 250,000,000" },
];

export const LAND_BUDGETS = [
  { value: "", label: "Any budget" },
  { value: "20000000", label: "Up to RWF 20,000,000" },
  { value: "40000000", label: "Up to RWF 40,000,000" },
  { value: "80000000", label: "Up to RWF 80,000,000" },
  { value: "150000000", label: "Up to RWF 150,000,000" },
];

export function budgetsFor(intent?: TransactionType) {
  if (intent === "buy") return BUY_BUDGETS;
  if (intent === "land") return LAND_BUDGETS;
  return RENT_BUDGETS;
}
