import { createFileRoute } from "@tanstack/react-router";
import { Marketplace } from "@/components/property/marketplace";
import { listLiveListings } from "@/lib/catalog";
import { parseSearch } from "@/lib/filters";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/properties/")({
  validateSearch: parseSearch,
  loader: () => listLiveListings(),
  head: () => ({
    meta: [
      { title: `Properties — ${SITE.name}` },
      {
        name: "description",
        content:
          "Browse houses, apartments and land for rent and sale across Rwanda.",
      },
    ],
  }),
  component: PropertiesPage,
});

function PropertiesPage() {
  const search = Route.useSearch();
  const listings = Route.useLoaderData();
  return (
    <Marketplace
      title="Find your next place."
      subtitle="Filter by how you actually search — rent or buy, neighbourhood, budget."
      search={search}
      path="/properties"
      listings={listings}
    />
  );
}
