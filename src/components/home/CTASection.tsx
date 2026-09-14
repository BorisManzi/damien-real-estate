import { Button } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/contact/WhatsAppButton";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="container-page pb-16 md:pb-24">
      <div className="relative overflow-hidden rounded-[2rem] bg-charcoal px-6 py-14 text-white md:px-12 md:py-16">
        <div className="pill-pattern absolute inset-0 opacity-60" aria-hidden />
        <div className="relative mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl text-balance">
            Still looking for the right place?
          </h2>
          <p className="mt-3 text-white/75">
            Tell us what you need. We&apos;ll help you find it.
          </p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link href="/contact" className="sm:min-w-[10rem]">
              <Button variant="accent" size="lg" className="w-full">
                Find my home
              </Button>
            </Link>
            <WhatsAppButton
              label="Talk to Damien"
              variant="secondary"
              size="lg"
              className="sm:min-w-[10rem] [&_button]:bg-white/10 [&_button]:text-white [&_button]:border-white/20 [&_button]:hover:bg-white/20"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
