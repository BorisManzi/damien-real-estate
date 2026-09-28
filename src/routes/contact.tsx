import { createFileRoute } from "@tanstack/react-router";
import { InquiryForm } from "@/components/contact/inquiry-form";
import { SITE, defaultWhatsappMessage, whatsappUrl } from "@/lib/site";

type ContactSearch = {
  property?: string;
};

export const Route = createFileRoute("/contact")({
  validateSearch: (search: Record<string, unknown>): ContactSearch => {
    if (typeof search.property === "string" && search.property.length > 0) {
      return { property: search.property };
    }
    return {};
  },
  head: () => ({
    meta: [
      { title: `Contact — ${SITE.name}` },
      {
        name: "description",
        content:
          "Tell Damien what you’re looking for. We’ll help you find a place in Rwanda.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { property } = Route.useSearch();
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1fr_1.15fr]">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green">
          Contact
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">
          Send us what you’re looking for.
        </h1>
        <p className="mt-4 max-w-md text-quiet">
          A name, a number, and a neighbourhood is enough. We reply on the
          phone — and on WhatsApp if that’s easier.
        </p>
        <ul className="mt-8 space-y-3 text-sm">
          <li>
            <span className="text-quiet">WhatsApp</span>
            <br />
            <a
              className="font-medium text-green hover:underline"
              href={whatsappUrl(defaultWhatsappMessage())}
              target="_blank"
              rel="noreferrer"
            >
              Chat with Damien
            </a>
          </li>
          <li>
            <span className="text-quiet">Phone</span>
            <br />
            <a className="font-medium" href={`tel:${SITE.phoneE164}`}>
              {SITE.phoneDisplay}
            </a>
          </li>
          <li>
            <span className="text-quiet">Email</span>
            <br />
            <a className="font-medium" href={`mailto:${SITE.email}`}>
              {SITE.email}
            </a>
          </li>
          <li>
            <span className="text-quiet">Office</span>
            <br />
            {SITE.location}
          </li>
        </ul>
      </div>
      <InquiryForm defaultProperty={property} />
    </div>
  );
}
