import {
  MobileStickyCTA,
  PropertyActionPanel,
} from "@/components/property/PropertyActions";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import { Badge } from "@/components/ui/Badge";
import { formatLocation, statusLabel } from "@/lib/format";
import { getAllProperties, getPropertyBySlug } from "@/lib/properties";
import { Bath, BedDouble, Car, Maximize2, Trees } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const list = await getAllProperties();
  return list.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return { title: "Property not found" };

  return {
    title: property.title,
    description: property.description.slice(0, 155),
    openGraph: {
      title: property.title,
      description: property.description.slice(0, 155),
      images: property.images[0] ? [{ url: property.images[0] }] : [],
    },
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  const primaryStatus =
    property.status.find((s) => s.startsWith("for-")) || property.status[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description,
    image: property.images,
    url: `/properties/${property.slug}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: property.city,
      addressRegion: property.district,
      addressCountry: "RW",
    },
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: property.currency,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="container-page py-8 pb-28 md:py-12 lg:pb-16">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr] lg:gap-10">
          <div>
            <PropertyGallery images={property.images} title={property.title} />

            <div className="mt-8">
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{statusLabel(primaryStatus)}</Badge>
                <span className="text-sm capitalize text-muted">
                  {property.propertyType}
                </span>
              </div>
              <h1 className="mt-3 font-display text-3xl font-bold text-charcoal md:text-4xl">
                {property.title}
              </h1>
              <p className="mt-2 text-muted">{formatLocation(property)}</p>

              <div className="mt-6 flex flex-wrap gap-3">
                {property.bedrooms != null && (
                  <Spec icon={BedDouble} label={`${property.bedrooms} Bedrooms`} />
                )}
                {property.bathrooms != null && (
                  <Spec icon={Bath} label={`${property.bathrooms} Bathrooms`} />
                )}
                {property.size != null && (
                  <Spec
                    icon={Maximize2}
                    label={`${property.size} ${property.sizeUnit}`}
                  />
                )}
                {property.parking && <Spec icon={Car} label="Parking" />}
                {property.garden && <Spec icon={Trees} label="Garden" />}
              </div>

              <section className="mt-10">
                <h2 className="font-display text-xl font-semibold">
                  About this place
                </h2>
                <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">
                  {property.description}
                </p>
              </section>

              <section className="mt-10">
                <h2 className="font-display text-xl font-semibold">Amenities</h2>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {property.amenities.map((a) => (
                    <li
                      key={a}
                      className="rounded-xl border border-border bg-white px-4 py-3 text-sm"
                    >
                      {a}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="mt-10">
                <h2 className="font-display text-xl font-semibold">Location</h2>
                <p className="mt-3 text-muted">
                  {property.neighborhood
                    ? `${property.neighborhood}, ${property.district}, ${property.city}`
                    : `${property.district}, ${property.city}`}
                  , Rwanda
                </p>
              </section>
            </div>
          </div>

          <div className="hidden lg:block">
            <PropertyActionPanel property={property} />
          </div>
        </div>

        <div className="mt-8 lg:hidden">
          <PropertyActionPanel property={property} />
        </div>
      </article>
      <MobileStickyCTA property={property} />
    </>
  );
}

function Spec({
  icon: Icon,
  label,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm font-medium text-charcoal">
      <Icon className="h-4 w-4 text-green" />
      {label}
    </span>
  );
}
