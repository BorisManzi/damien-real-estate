import { Search } from "lucide-react";
import { useState } from "react";
import { PropertySearch } from "@/components/search/property-search";
import { SearchSheet } from "@/components/search/search-sheet";
import { Button } from "@/components/ui/button";
import { useHomePage } from "@/lib/home-context";

export function Hero() {
  const { hero } = useHomePage();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <section className="relative">
      <div className="relative min-h-[78vw] overflow-hidden sm:min-h-[520px] lg:min-h-[640px]">
        <img
          src={hero.imageSrc}
          alt={hero.imageAlt}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-green-ink/85 via-green-ink/40 to-green-ink/25" />
        <div className="relative mx-auto flex min-h-[78vw] max-w-6xl flex-col justify-end px-4 pb-10 pt-16 sm:min-h-[520px] sm:px-6 sm:pb-16 lg:min-h-[640px] lg:justify-center lg:pb-32">
          <p className="reveal text-xs font-semibold uppercase tracking-[0.2em] text-sage">
            {hero.eyebrow}
          </p>
          <h1 className="reveal reveal-2 mt-3 max-w-2xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-cream sm:text-5xl lg:text-6xl">
            {hero.headline}
          </h1>
          <p className="reveal reveal-3 mt-4 max-w-md text-base leading-relaxed text-cream/80 sm:text-lg">
            {hero.subhead}
          </p>
          <div className="reveal reveal-4 mt-6 md:hidden">
            <Button
              variant="terracotta"
              size="lg"
              className="w-full max-w-sm"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="size-4" />
              {hero.searchLabel}
            </Button>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto -mt-10 hidden max-w-6xl px-6 md:block lg:-mt-16">
        <PropertySearch variant="hero" />
      </div>
      <SearchSheet open={searchOpen} onOpenChange={setSearchOpen} />
    </section>
  );
}
