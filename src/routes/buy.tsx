import { createFileRoute } from "@tanstack/react-router";
import { Marketplace } from "@/components/property/marketplace";
import { listLiveListings } from "@/lib/catalog";
import { parseSearch } from "@/lib/filters";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/buy")({
  validateSearch: parseSearch,
  loader: () => listLiveListings(),
  head: () => ({
    meta: [
      { title: `Homes for sale — ${SITE.name}` },
      {
        name: "description",
        content: "Houses and apartments for sale in Kigali and across Rwanda.",
      },
    ],
  }),
  component: BuyPage,
});

function BuyPage() {
  const search = Route.useSearch();
  const listings = Route.useLoaderData();
  return (
    <Marketplace
      title="Homes for sale."
      subtitle="Houses and apartments with the details that matter before a viewing."
      search={search}
      lockedIntent="buy"
      path="/buy"
      listings={listings}
    />
  );
}
