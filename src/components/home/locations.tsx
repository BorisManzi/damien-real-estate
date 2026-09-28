import { Link } from "@tanstack/react-router";
import { countForLocation, type Property } from "@/data/properties";
import { useHomePage } from "@/lib/home-context";
import { useLiveListings } from "@/lib/listings-query";

export function Locations({ listings }: { listings?: Property[] }) {
  const { locations } = useHomePage();
  const published = useLiveListings(listings);
  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-charcoal sm:text-4xl">
          {locations.heading}
        </h2>
        <p className="mt-2 max-w-lg text-quiet">{locations.subhead}</p>
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {locations.items.map((loc, i) => {
            const count = countForLocation(loc.match, published);
            return (
              <Link
                key={loc.slug}
                to="/properties"
                search={{ location: loc.match }}
                className={`group relative overflow-hidden rounded-xl ${
                  i === 0 ? "col-span-2 min-h-52 md:min-h-64" : "min-h-44"
                }`}
              >
                <img
                  src={loc.imageSrc}
                  alt={loc.name}
                  className="media absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-ink/80 via-green-ink/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="font-display text-lg font-semibold text-cream">
                    {loc.name}
                  </p>
                  <p className="text-xs text-cream/75">
                    {count} {count === 1 ? "property" : "properties"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
