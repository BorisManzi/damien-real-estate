import type { PricePeriod, Property } from "@/types/property";

export function formatPrice(
  price: number,
  currency: Property["currency"] = "RWF",
  period: PricePeriod = null
): string {
  const formatted = new Intl.NumberFormat("en-RW", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);

  if (period === "month") return `${formatted} / month`;
  if (period === "night") return `${formatted} / night`;
  return formatted;
}

export function formatLocation(property: Pick<Property, "city" | "district" | "neighborhood">) {
  if (property.neighborhood) {
    return `${property.city} · ${property.neighborhood}`;
  }
  return `${property.city} · ${property.district}`;
}

export function formatSpecs(property: Property): string {
  const parts: string[] = [];
  if (property.bedrooms != null) parts.push(`${property.bedrooms} beds`);
  if (property.bathrooms != null) parts.push(`${property.bathrooms} baths`);
  if (property.size != null && property.sizeUnit) {
    parts.push(`${property.size} ${property.sizeUnit}`);
  }
  return parts.join(" · ");
}

export function statusLabel(status: string): string {
  return status.replace(/-/g, " ").toUpperCase();
}
