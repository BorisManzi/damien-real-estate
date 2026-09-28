import { createFileRoute } from "@tanstack/react-router";
import { Marketplace } from "@/components/property/marketplace";
import { listLiveListings } from "@/lib/catalog";
import { parseSearch } from "@/lib/filters";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/land")({
  validateSearch: parseSearch,
  loader: () => listLiveListings(),
  head: () => ({
    meta: [
      { title: `Land for sale — ${SITE.name}` },
      {
        name: "description",
        content: "Residential and commercial land in Rwanda, listed with Damien.",
      },
    ],
  }),
  component: LandPage,
});

function LandPage() {
  const search = Route.useSearch();
  const listings = Route.useLoaderData();
  return (
    <Marketplace
      title="Land in Rwanda."
      subtitle="Plots for building a home, holding, or a small commercial project."
      search={search}
      lockedIntent="land"
      path="/land"
      listings={listings}
    />
  );
}
