import { InquiryForm } from "@/components/contact/InquiryForm";
import { WhatsAppButton } from "@/components/contact/WhatsAppButton";
import { getPropertyBySlug } from "@/lib/properties";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell Damien what you're looking for. We'll help you find a place in Rwanda.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ContactPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const propertySlug = Array.isArray(sp.property) ? sp.property[0] : sp.property;
  const property = propertySlug
    ? await getPropertyBySlug(propertySlug)
    : undefined;

  return (
    <div className="container-page py-12 md:py-16">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-green">
            Contact
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold text-charcoal md:text-5xl text-balance">
            Tell us what you&apos;re looking for.
          </h1>
          <p className="mt-4 max-w-md text-muted leading-relaxed">
            Share a few details and we&apos;ll help you find the right place —
            or jump straight to WhatsApp if that&apos;s easier.
          </p>

          <div className="mt-8 space-y-3">
            <WhatsAppButton
              label="Chat with Damien"
              variant="primary"
              size="lg"
              message={
                property
                  ? `Hello Damien, I'm interested in the ${property.title} in ${property.district}. Is it still available?`
                  : undefined
              }
            />
            <p className="text-sm text-muted">
              Or call{" "}
              <a
                className="font-medium text-green"
                href={`tel:${(process.env.NEXT_PUBLIC_PHONE || "+250788000000").replace(/\s/g, "")}`}
              >
                {process.env.NEXT_PUBLIC_PHONE || "+250 788 000 000"}
              </a>
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-6 md:p-8">
          <Suspense
            fallback={
              <div className="h-64 animate-pulse rounded-xl bg-cream-dark" />
            }
          >
            <InquiryForm defaultPropertyTitle={property?.title} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
