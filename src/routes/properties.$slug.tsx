import { Link, createFileRoute } from "@tanstack/react-router";
import { Bath, BedDouble, Car, Leaf, Maximize } from "lucide-react";
import type { ReactNode } from "react";
import { InquiryPanel, MobileStickyCta } from "@/components/property/inquiry-panel";
import { PropertyCard } from "@/components/property/property-card";
import { PropertyGallery } from "@/components/property/property-gallery";
import { Badge } from "@/components/ui/badge";
import { listLiveListings } from "@/lib/catalog";
import { useLiveListings } from "@/lib/listings-query";
import { formatPrice, formatSize } from "@/lib/format";
import { SITE } from "@/lib/site";
import { statusLabel, typeLabel } from "@/data/properties";

export const Route = createFileRoute("/properties/$slug")({
  loader: async ({ params }) => {
    const all = await listLiveListings();
    return {
      all,
      property: all.find((p) => p.slug === params.slug) ?? null,
    };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData?.property?.title ?? "Property"} — ${SITE.name}`,
      },
    ],
  }),
  component: PropertyDetailPage,
});

function PropertyDetailPage() {
  const loaded = Route.useLoaderData();
  const published = useLiveListings(loaded.all);
  const property =
    published.find((p) => p.slug === loaded.property?.slug) ?? loaded.property;

  if (!property) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-semibold">
          That listing isn’t here.
        </h1>
        <p className="mt-2 text-quiet">
          It may have been rented or sold. Browse what’s available now.
        </p>
        <Link
          to="/properties"
          className="mt-6 inline-flex text-sm font-medium text-green hover:underline"
        >
          Back to properties
        </Link>
      </div>
    );
  }

  const similar = published
    .filter(
      (p) =>
        p.id !== property.id &&
        (p.neighborhood === property.neighborhood ||
          p.transactionType === property.transactionType),
    )
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type":
      property.propertyType === "land"
        ? "Landform"
        : "Residence",
    name: property.title,
    description: property.description,
    image: property.images,
    address: {
      "@type": "PostalAddress",
      addressLocality: property.neighborhood,
      addressRegion: property.district,
      addressCountry: "RW",
    },
    floorSize: {
      "@type": "QuantitativeValue",
      value: property.size,
      unitCode: "MTK",
    },
    numberOfRooms: property.bedrooms,
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: "RWF",
      availability: "https://schema.org/InStock",
    },
  };

  const badge =
    property.transactionType === "rent"
      ? "rent"
      : property.transactionType === "buy"
        ? "sale"
        : "land";

  return (
    <article className="pb-24 lg:pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1.6fr)_340px] lg:gap-12 lg:py-12">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-quiet">
            <Link to="/properties" className="hover:text-green">
              Properties
            </Link>
            <span className="mx-2">/</span>
            {property.neighborhood}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge variant={badge}>{statusLabel(property.status)}</Badge>
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-quiet">
              {typeLabel(property.propertyType)}
            </span>
          </div>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {property.title}
          </h1>
          <p className="mt-2 text-quiet">
            {property.neighborhood}, {property.city}
          </p>
          <p className="mt-3 font-display text-2xl font-semibold text-green">
            {formatPrice(property.price, property.pricePeriod)}
          </p>

          <div className="mt-6">
            <PropertyGallery images={property.images} title={property.title} />
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {property.bedrooms != null ? (
              <Stat
                icon={<BedDouble className="size-4" />}
                label="Bedrooms"
                value={String(property.bedrooms)}
              />
            ) : null}
            {property.bathrooms != null ? (
              <Stat
                icon={<Bath className="size-4" />}
                label="Bathrooms"
                value={String(property.bathrooms)}
              />
            ) : null}
            <Stat
              icon={<Maximize className="size-4" />}
              label="Size"
              value={formatSize(property.size)}
            />
            {property.parking ? (
              <Stat
                icon={<Car className="size-4" />}
                label="Parking"
                value="Yes"
              />
            ) : null}
            {property.garden ? (
              <Stat
                icon={<Leaf className="size-4" />}
                label="Garden"
                value="Yes"
              />
            ) : null}
            <Stat
              label="Furnished"
              value={
                property.furnished === true
                  ? "Yes"
                  : property.furnished === "partial"
                    ? "Partial"
                    : "No"
              }
            />
          </dl>

          <section className="mt-10">
            <h2 className="font-display text-xl font-semibold">About this place</h2>
            <p className="mt-3 max-w-prose leading-relaxed text-quiet">
              {property.description}
            </p>
          </section>

          <section className="mt-10">
            <h2 className="font-display text-xl font-semibold">Amenities</h2>
            <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {property.amenities.map((a) => (
                <li
                  key={a}
                  className="flex items-center gap-2 text-sm text-charcoal"
                >
                  <span className="size-1.5 rounded-full bg-terracotta" />
                  {a}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10">
            <h2 className="font-display text-xl font-semibold">Location</h2>
            <p className="mt-3 text-quiet">
              {property.neighborhood}, {property.district}, {property.city},
              Rwanda
            </p>
          </section>
        </div>

        <div className="hidden lg:block">
          <InquiryPanel property={property} sticky />
        </div>
        <div className="lg:hidden">
          <InquiryPanel property={property} />
        </div>
      </div>

      {similar.length ? (
        <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Similar places
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {similar.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </section>
      ) : null}

      <MobileStickyCta property={property} />
    </article>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon?: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-paper px-4 py-3 shadow-border">
      <dt className="flex items-center gap-1.5 text-xs uppercase tracking-[0.12em] text-quiet">
        {icon}
        {label}
      </dt>
      <dd className="mt-1 font-display text-lg font-semibold">{value}</dd>
    </div>
  );
}
