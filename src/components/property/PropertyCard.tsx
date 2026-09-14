import { Badge } from "@/components/ui/Badge";
import { FavoriteButton } from "@/components/property/FavoriteButton";
import { formatLocation, formatPrice, formatSpecs, statusLabel } from "@/lib/format";
import type { Property } from "@/types/property";
import { ArrowUpRight, Bath, BedDouble, Maximize2, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function PropertyCard({ property }: { property: Property }) {
  const primaryStatus =
    property.status.find((s) => s.startsWith("for-")) || property.status[0];

  return (
    <Link
      href={`/properties/${property.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white transition-all duration-300 hover:-translate-y-1 hover:border-green/20 hover:shadow-[0_12px_40px_-20px_rgba(15,81,50,0.35)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-cream-dark">
        <Image
          src={property.images[0]}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex gap-1.5">
          <Badge tone={primaryStatus === "for-sale" ? "accent" : "green"}>
            {statusLabel(primaryStatus)}
          </Badge>
          {property.status.includes("new") && <Badge tone="neutral">New</Badge>}
        </div>
        <FavoriteButton
          propertyId={property.id}
          className="absolute right-3 top-3"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted">
            {property.propertyType}
          </p>
          <h3 className="font-display text-lg font-semibold leading-snug text-charcoal">
            {property.title}
          </h3>
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {formatLocation(property)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
          {property.bedrooms != null && (
            <span className="inline-flex items-center gap-1">
              <BedDouble className="h-3.5 w-3.5" aria-hidden />
              {property.bedrooms}
            </span>
          )}
          {property.bathrooms != null && (
            <span className="inline-flex items-center gap-1">
              <Bath className="h-3.5 w-3.5" aria-hidden />
              {property.bathrooms}
            </span>
          )}
          {property.size != null && (
            <span className="inline-flex items-center gap-1">
              <Maximize2 className="h-3.5 w-3.5" aria-hidden />
              {property.size} {property.sizeUnit}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-border/70 pt-3">
          <p className="font-display text-base font-bold text-green">
            {formatPrice(property.price, property.currency, property.pricePeriod)}
          </p>
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-cream text-green transition-colors group-hover:bg-green group-hover:text-white">
            <ArrowUpRight className="h-4 w-4" aria-hidden />
            <span className="sr-only">View {property.title}</span>
          </span>
        </div>
        <span className="sr-only">{formatSpecs(property)}</span>
      </div>
    </Link>
  );
}
