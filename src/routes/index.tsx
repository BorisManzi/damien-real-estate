import { createFileRoute } from "@tanstack/react-router";
import { Categories } from "@/components/home/categories";
import { CtaSection } from "@/components/home/cta-section";
import { Difference } from "@/components/home/difference";
import { Featured } from "@/components/home/featured";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { Locations } from "@/components/home/locations";
import { listLiveListings } from "@/lib/catalog";
import { getHomeContent } from "@/lib/home";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/")({
  loader: async () => {
    const [listings, home] = await Promise.all([listLiveListings(), getHomeContent()]);
    return { listings, home };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${SITE.name} — ${loaderData?.home.hero.headline ?? SITE.tagline}`,
      },
      {
        name: "description",
        content: loaderData?.home.hero.subhead || SITE.description,
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { listings } = Route.useLoaderData();
  return (
    <>
      <Hero />
      <Featured listings={listings} />
      <Locations listings={listings} />
      <Categories />
      <Difference />
      <HowItWorks />
      <CtaSection />
    </>
  );
}
