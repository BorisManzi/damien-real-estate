import type { LocationTile } from "@/types/property";
import Image from "next/image";
import Link from "next/link";

export function LocationExplorer({ locations }: { locations: LocationTile[] }) {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container-page">
        <div className="mb-10 max-w-2xl">
          <h2 className="font-display text-3xl font-bold text-charcoal md:text-4xl">
            Find a place in your neighborhood.
          </h2>
          <p className="mt-2 text-muted">
            Browse by the areas people actually search in Rwanda.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {locations.map((loc, i) => (
            <Link
              key={loc.slug}
              href={`/properties?location=${encodeURIComponent(loc.name)}`}
              className={`group relative overflow-hidden rounded-2xl ${
                i === 0 || i === 5 ? "md:col-span-2 md:row-span-1 aspect-[16/10]" : "aspect-[4/5] md:aspect-[4/5]"
              }`}
            >
              <Image
                src={loc.image}
                alt={loc.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/75 via-charcoal/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <h3 className="font-display text-lg font-semibold text-white md:text-xl">
                  {loc.name}
                </h3>
                <p className="text-sm text-white/75">{loc.propertyCount} properties</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
