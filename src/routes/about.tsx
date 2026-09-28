import { Link, createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { CtaSection } from "@/components/home/cta-section";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: `About — ${SITE.name}` },
      {
        name: "description",
        content:
          "Damien Real Estate makes it easier to find a home, apartment or plot in Rwanda — with clear information and human help.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green">
            About Damien
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            We’re making it easier to find your place in Rwanda.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-quiet">
            Property hunting here still happens in fragments — WhatsApp groups,
            roadside signs, a cousin who knows an agent. Damien exists to put
            the useful part of that in one place, without pretending Rwanda is
            somewhere else.
          </p>
        </div>
        <div className="overflow-hidden rounded-xl">
          <img
            src="/images/about-rwanda.jpg"
            alt="Kigali neighbourhoods across the hills"
            className="media aspect-[4/3] w-full object-cover"
          />
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 md:grid-cols-3">
          {[
            {
              title: "Local understanding",
              copy: "We search the way people here actually search — by neighbourhood, by budget in RWF, by whether the water tank is real.",
            },
            {
              title: "Better information",
              copy: "Listings should tell you enough to decide if a viewing is worth the trip. Size, beds, photos that match the place.",
            },
            {
              title: "Human help",
              copy: "If the filters don’t catch it, a person will. Damien is a small team, not a portal with no one behind it.",
            },
          ].map((item) => (
            <article key={item.title}>
              <h2 className="font-display text-xl font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-quiet">
                {item.copy}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-3xl font-semibold tracking-tight">
          Built for ordinary searches.
        </h2>
        <p className="mt-4 leading-relaxed text-quiet">
          Damien is not a luxury developer and not a classifieds dump. We help
          people find houses to rent, apartments, land and homes for sale —
          across Kigali and other Rwandan cities — then connect them to a
          viewing. The product is the search, not a brochure about us.
        </p>
        <p className="mt-4 leading-relaxed text-quiet">
          If you know what you need, start with the listings. If you don’t,
          tell us. We’ll help you find it.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button variant="terracotta" asChild>
            <Link to="/properties">Browse properties</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/contact">Talk to Damien</Link>
          </Button>
        </div>
      </section>
      <CtaSection />
    </>
  );
}
