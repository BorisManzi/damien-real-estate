import { Hero } from "@/components/home/Hero";
import { FeaturedProperties } from "@/components/home/FeaturedProperties";
import { LocationExplorer } from "@/components/home/LocationExplorer";
import { PropertyTypes } from "@/components/home/PropertyTypes";
import { DamienDifference } from "@/components/home/DamienDifference";
import { HowItWorks } from "@/components/home/HowItWorks";
import { CTASection } from "@/components/home/CTASection";
import { WhatsAppButton } from "@/components/contact/WhatsAppButton";
import {
  getFeaturedProperties,
  getLocations,
} from "@/lib/properties";

export default async function HomePage() {
  const [featured, locations] = await Promise.all([
    getFeaturedProperties(6),
    getLocations(),
  ]);

  return (
    <>
      <Hero />
      <FeaturedProperties properties={featured} />
      <LocationExplorer locations={locations} />
      <PropertyTypes />
      <DamienDifference />
      <HowItWorks />
      <section className="container-page pb-8">
        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-border bg-white p-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-display text-xl font-semibold text-charcoal">
              Prefer WhatsApp?
            </h2>
            <p className="mt-1 text-sm text-muted">
              Send us what you&apos;re looking for — we&apos;ll help from there.
            </p>
          </div>
          <WhatsAppButton label="Send us what you're looking for" variant="primary" />
        </div>
      </section>
      <CTASection />
    </>
  );
}
