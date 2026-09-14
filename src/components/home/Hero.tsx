import { SearchBar } from "@/components/search/SearchBar";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative min-h-[78vh] md:min-h-[82vh]">
        <Image
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1800&q=80"
          alt="Modern home nestled in green hills"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/55 via-charcoal/35 to-charcoal/65" />

        <div className="relative container-page flex min-h-[78vh] flex-col justify-end pb-10 pt-28 md:min-h-[82vh] md:justify-center md:pb-20 md:pt-24">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-sage">
              Damien Real Estate
            </p>
            <h1 className="font-display text-4xl font-bold leading-[1.05] text-white text-balance sm:text-5xl md:text-6xl">
              Find your place in Rwanda.
            </h1>
            <p className="mt-4 max-w-lg text-base text-white/85 md:text-lg">
              Homes, apartments and properties made easier to find.
            </p>
          </div>

          <div className="mt-8 w-full max-w-4xl">
            <SearchBar />
          </div>
        </div>
      </div>
    </section>
  );
}
