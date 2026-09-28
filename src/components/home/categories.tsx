import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useHomePage } from "@/lib/home-context";

const CATS = [
  {
    to: "/properties" as const,
    search: { type: "house" as const },
    icon: HouseIcon,
  },
  {
    to: "/properties" as const,
    search: { type: "apartment" as const },
    icon: AptIcon,
  },
  {
    to: "/land" as const,
    search: undefined,
    icon: LandIcon,
  },
  {
    to: "/properties" as const,
    search: { type: "commercial" as const },
    icon: ShopIcon,
  },
];

export function Categories() {
  const { categories } = useHomePage();
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        {categories.heading}
      </h2>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.items.map((item, i) => {
          const cat = CATS[i];
          if (!cat) return null;
          return (
            <Link
              key={item.title}
              to={cat.to}
              search={cat.search}
              className="group rounded-xl border border-border bg-paper p-5 shadow-border transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-border-hover"
            >
              <cat.icon />
              <h3 className="mt-5 font-display text-xl font-semibold tracking-tight">
                {item.title}
              </h3>
              <p className="mt-1 text-sm text-quiet">{item.copy}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-green">
                Browse
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function HouseIcon() {
  return (
    <svg viewBox="0 0 40 40" className="size-10 text-green" fill="none" aria-hidden>
      <path
        d="M6 18.5 20 7l14 11.5V33a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V18.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <rect x="16" y="22" width="8" height="12" className="fill-terracotta" />
    </svg>
  );
}

function AptIcon() {
  return (
    <svg viewBox="0 0 40 40" className="size-10 text-green" fill="none" aria-hidden>
      <rect x="8" y="6" width="24" height="28" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M14 12h4M22 12h4M14 18h4M22 18h4M14 24h4M22 24h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="17" y="28" width="6" height="6" className="fill-terracotta" />
    </svg>
  );
}

function LandIcon() {
  return (
    <svg viewBox="0 0 40 40" className="size-10 text-green" fill="none" aria-hidden>
      <path
        d="M4 28c4-7 7-11 10-11s5 6 8 6 5-8 10-8 4 6 4 13H4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="28" cy="10" r="3" className="fill-terracotta" />
    </svg>
  );
}

function ShopIcon() {
  return (
    <svg viewBox="0 0 40 40" className="size-10 text-green" fill="none" aria-hidden>
      <path
        d="M7 16h26v18H7V16Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M8 10h24l2 6H6l2-6Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <rect x="17" y="22" width="6" height="12" className="fill-terracotta" />
    </svg>
  );
}
