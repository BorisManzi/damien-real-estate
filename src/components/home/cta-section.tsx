import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useHomePage } from "@/lib/home-context";
import { defaultWhatsappMessage, whatsappUrl } from "@/lib/site";

export function CtaSection() {
  const { cta } = useHomePage();
  return (
    <section className="px-4 pb-16 sm:px-6 sm:pb-24">
      <div className="geo-d geo-grid relative mx-auto max-w-6xl overflow-hidden rounded-2xl bg-green px-6 py-14 text-cream sm:px-12 sm:py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-16 size-64 rounded-full bg-sage/15"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 left-10 size-48 rounded-[40%] bg-terracotta/20"
        />
        <div className="relative max-w-xl">
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {cta.heading}
          </h2>
          <p className="mt-3 text-cream/75">{cta.body}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button variant="terracotta" size="lg" asChild>
              <Link to="/contact">{cta.primaryLabel}</Link>
            </Button>
            <Button variant="invertOutline" size="lg" asChild>
              <a
                href={whatsappUrl(defaultWhatsappMessage())}
                target="_blank"
                rel="noreferrer"
              >
                {cta.secondaryLabel}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
