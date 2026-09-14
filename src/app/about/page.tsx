import { WhatsAppButton } from "@/components/contact/WhatsAppButton";
import { Button } from "@/components/ui/Button";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Damien Real Estate makes it easier to find homes, apartments and land in Rwanda — with clear information and human help.",
};

export default function AboutPage() {
  return (
    <div>
      <section className="container-page py-14 md:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-green">
              About Damien
            </p>
            <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-charcoal md:text-5xl text-balance">
              We&apos;re making it easier to find your place in Rwanda.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              Damien exists because finding a home here still means too many
              calls, WhatsApp forwards, and unclear listings. We built a simpler
              way to discover properties and get real help.
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem]">
            <Image
              src="https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1200&q=80"
              alt="Hills and neighborhoods across Rwanda"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="container-page grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Local understanding",
              body: "We know how people actually search for property in Rwanda — by neighborhood, budget, and word of mouth.",
            },
            {
              title: "Clearer information",
              body: "See bedrooms, price, location and photos before you spend an afternoon on a viewing.",
            },
            {
              title: "Human assistance",
              body: "Not sure what fits? Talk to Damien on WhatsApp or phone. Real people, not just listings.",
            },
            {
              title: "For ordinary people",
              body: "This isn't only for luxury buyers. We surface practical homes people can actually afford.",
            },
            {
              title: "Less hassle",
              body: "One place to search, compare and contact — instead of juggling ten agents and group chats.",
            },
            {
              title: "Built for Rwanda",
              body: "WhatsApp-first contact, RWF pricing, and locations that match how people describe where they live.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-border p-6">
              <h2 className="font-display text-xl font-semibold text-charcoal">
                {item.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-16 text-center">
        <h2 className="font-display text-3xl font-bold text-charcoal">
          Ready to look?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-muted">
          Start with a search, or tell us what you need and we&apos;ll help.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/properties">
            <Button size="lg">Find a property</Button>
          </Link>
          <WhatsAppButton label="Chat with Damien" variant="secondary" size="lg" />
        </div>
      </section>
    </div>
  );
}
