import { createFileRoute } from "@tanstack/react-router";
import { Marketplace } from "@/components/property/marketplace";
import { listLiveListings } from "@/lib/catalog";
import { parseSearch } from "@/lib/filters";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/rent")({
  validateSearch: parseSearch,
  loader: () => listLiveListings(),
  head: () => ({
    meta: [
      { title: `Homes for rent — ${SITE.name}` },
      {
        name: "description",
        content: "Houses and apartments for rent in Kigali and across Rwanda.",
      },
    ],
  }),
  component: RentPage,
});

function RentPage() {
  const search = Route.useSearch();
  const listings = Route.useLoaderData();
  return (
    <Marketplace
      title="Homes for rent."
      subtitle="Places you can move into — without spending weeks in WhatsApp groups."
      search={search}
      lockedIntent="rent"
      path="/rent"
      listings={listings}
    />
  );
}
