import { locations, properties } from "@/data/properties";
import type { Property, PropertyFilters, TransactionType } from "@/types/property";

/** Data access layer — swap this for API/DB calls later without rewriting UI. */
export async function getAllProperties(): Promise<Property[]> {
  return properties;
}

export async function getFeaturedProperties(limit = 6): Promise<Property[]> {
  return properties.filter((p) => p.featured).slice(0, limit);
}

export async function getPropertyBySlug(slug: string): Promise<Property | undefined> {
  return properties.find((p) => p.slug === slug);
}

export async function getLocations() {
  return locations;
}

export function filterProperties(
  list: Property[],
  filters: PropertyFilters = {}
): Property[] {
  let result = [...list];

  if (filters.transactionType && filters.transactionType !== "all") {
    result = result.filter((p) => p.transactionType === filters.transactionType);
  }

  if (filters.propertyType && filters.propertyType !== "all") {
    result = result.filter((p) => p.propertyType === filters.propertyType);
  }

  if (filters.location) {
    const q = filters.location.toLowerCase();
    result = result.filter(
      (p) =>
        p.city.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q) ||
        (p.neighborhood?.toLowerCase().includes(q) ?? false)
    );
  }

  if (filters.query) {
    const q = filters.query.toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q)
    );
  }

  if (filters.minPrice != null) {
    result = result.filter((p) => p.price >= filters.minPrice!);
  }

  if (filters.maxPrice != null) {
    result = result.filter((p) => p.price <= filters.maxPrice!);
  }

  if (filters.bedrooms && filters.bedrooms !== "any") {
    result = result.filter(
      (p) => p.bedrooms != null && p.bedrooms >= (filters.bedrooms as number)
    );
  }

  if (filters.bathrooms && filters.bathrooms !== "any") {
    result = result.filter(
      (p) => p.bathrooms != null && p.bathrooms >= (filters.bathrooms as number)
    );
  }

  if (filters.furnished === true) {
    result = result.filter((p) => p.furnished === true);
  }

  switch (filters.sort) {
    case "newest":
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
    case "price-asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result.sort((a, b) => b.price - a.price);
      break;
    default:
      result.sort((a, b) => Number(b.featured) - Number(a.featured));
  }

  return result;
}

export async function searchProperties(
  filters: PropertyFilters = {}
): Promise<Property[]> {
  return filterProperties(await getAllProperties(), filters);
}

export async function getPropertiesByTransaction(
  type: TransactionType
): Promise<Property[]> {
  return searchProperties({ transactionType: type });
}
