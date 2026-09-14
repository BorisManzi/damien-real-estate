import Link from "next/link";
import { Building2, Home, Landmark, Store } from "lucide-react";

const categories = [
  {
    title: "Houses",
    description: "Find houses for rent or sale.",
    href: "/properties?propertyType=house",
    icon: Home,
  },
  {
    title: "Apartments",
    description: "Modern apartments and flats.",
    href: "/properties?propertyType=apartment",
    icon: Building2,
  },
  {
    title: "Land",
    description: "Discover land opportunities.",
    href: "/land",
    icon: Landmark,
  },
  {
    title: "Commercial",
    description: "Spaces for businesses and offices.",
    href: "/properties?propertyType=commercial",
    icon: Store,
  },
];

export function PropertyTypes() {
  return (
    <section className="container-page py-16 md:py-24">
      <div className="mb-10 max-w-xl">
        <h2 className="font-display text-3xl font-bold text-charcoal md:text-4xl">
          What are you looking for?
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((cat) => (
          <Link
            key={cat.title}
            href={cat.href}
            className="group rounded-2xl border border-border bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-green/25 hover:shadow-[0_12px_32px_-20px_rgba(15,81,50,0.3)]"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cream text-green transition-colors group-hover:bg-green group-hover:text-white">
              <cat.icon className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <h3 className="mt-5 font-display text-xl font-semibold text-charcoal">
              {cat.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {cat.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
