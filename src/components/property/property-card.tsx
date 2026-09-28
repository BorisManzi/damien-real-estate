import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Bath, BedDouble, Maximize } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FavoriteButton } from "@/components/property/favorite-button";
import type { Property } from "@/data/properties";
import { statusLabel, typeLabel } from "@/data/properties";
import { formatPrice, formatSize, locationLine } from "@/lib/format";
import { cn } from "@/lib/utils";

function badgeVariant(p: Property) {
  if (p.transactionType === "rent") return "rent" as const;
  if (p.transactionType === "buy") return "sale" as const;
  return "land" as const;
}

export function PropertyCard({
  property,
  layout = "grid",
}: {
  property: Property;
  layout?: "grid" | "list";
}) {
  const meta = [
    property.bedrooms != null ? `${property.bedrooms} beds` : null,
    property.bathrooms != null ? `${property.bathrooms} baths` : null,
    formatSize(property.size),
  ]
    .filter(Boolean)
    .join(" · ");

  if (layout === "list") {
    return (
      <Link
        to="/properties/$slug"
        params={{ slug: property.slug }}
        className="group grid overflow-hidden rounded-xl bg-paper shadow-border transition-[box-shadow,transform] duration-200 hover:shadow-border-hover sm:grid-cols-[240px_1fr]"
      >
        <div className="relative aspect-[4/3] overflow-hidden sm:aspect-auto sm:h-full">
          <img
            src={property.images[0] ?? "/images/properties/house-modern.jpg"}
            alt={property.title}
            className="media size-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <Badge variant={badgeVariant(property)} className="absolute left-3 top-3">
            {statusLabel(property.status)}
          </Badge>
        </div>
        <div className="relative flex flex-col justify-between p-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-quiet">
              {typeLabel(property.propertyType)}
            </p>
            <h3 className="mt-1 font-display text-xl font-semibold tracking-tight text-charcoal">
              {property.title}
            </h3>
            <p className="mt-1 text-sm text-quiet">
              {locationLine(property.neighborhood, property.city)}
            </p>
            <p className="mt-3 text-sm text-quiet">{meta}</p>
          </div>
          <div className="mt-4 flex items-end justify-between gap-3">
            <p className="font-display text-lg font-semibold text-green">
              {formatPrice(property.price, property.pricePeriod)}
            </p>
            <span className="inline-flex size-9 items-center justify-center rounded-full border border-border text-green transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <ArrowUpRight className="size-4" />
            </span>
          </div>
          <FavoriteButton id={property.id} className="absolute right-3 top-3" />
        </div>
      </Link>
    );
  }

  return (
    <Link
      to="/properties/$slug"
      params={{ slug: property.slug }}
      className="group flex flex-col overflow-hidden rounded-xl bg-paper shadow-border transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-border-hover"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={property.images[0] ?? "/images/properties/house-modern.jpg"}
          alt={property.title}
          className="media size-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <Badge variant={badgeVariant(property)} className="absolute left-3 top-3">
          {statusLabel(property.status)}
        </Badge>
        <FavoriteButton id={property.id} invert className="absolute right-3 top-3" />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-quiet">
          {typeLabel(property.propertyType)}
        </p>
        <h3 className="mt-1 font-display text-lg font-semibold tracking-tight text-charcoal">
          {property.title}
        </h3>
        <p className="mt-1 text-sm text-quiet">
          {locationLine(property.neighborhood, property.city)}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-quiet">
          {property.bedrooms != null ? (
            <span className="inline-flex items-center gap-1">
              <BedDouble className="size-3.5" strokeWidth={1.75} />
              {property.bedrooms}
            </span>
          ) : null}
          {property.bathrooms != null ? (
            <span className="inline-flex items-center gap-1">
              <Bath className="size-3.5" strokeWidth={1.75} />
              {property.bathrooms}
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1">
            <Maximize className="size-3.5" strokeWidth={1.75} />
            {formatSize(property.size)}
          </span>
        </div>
        <div className="mt-auto flex items-end justify-between pt-4">
          <p className={cn("font-display text-base font-semibold text-green")}>
            {formatPrice(property.price, property.pricePeriod)}
          </p>
          <span className="inline-flex size-8 items-center justify-center rounded-full text-green transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            <ArrowUpRight className="size-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
