import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function PropertyGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];
  const count = images.length;

  useEffect(() => {
    if (count < 2) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") setActive((i) => (i + 1) % count);
      if (e.key === "ArrowLeft") setActive((i) => (i - 1 + count) % count);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [count]);

  return (
    <div>
      <div className="relative overflow-hidden rounded-xl bg-cream-dark">
        <img
          src={current}
          alt={`${title} — photo ${active + 1} of ${count}`}
          className="media aspect-[4/3] w-full object-cover transition-opacity duration-200 sm:aspect-[16/10]"
        />
        {count > 1 ? (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => setActive((i) => (i - 1 + count) % count)}
              className="absolute left-3 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-cream/90 text-charcoal shadow-border hover:bg-paper"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={() => setActive((i) => (i + 1) % count)}
              className="absolute right-3 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-cream/90 text-charcoal shadow-border hover:bg-paper"
            >
              <ChevronRight className="size-5" />
            </button>
            <p className="absolute bottom-3 right-3 rounded-full bg-green-ink/70 px-2.5 py-1 text-xs font-medium text-cream">
              {active + 1} / {count}
            </p>
          </>
        ) : null}
      </div>
      {count > 1 ? (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              aria-label={`Show photo ${i + 1}`}
              aria-pressed={i === active}
              onClick={() => setActive(i)}
              className={cn(
                "relative h-16 w-20 shrink-0 overflow-hidden rounded-md",
                i === active
                  ? "ring-2 ring-green ring-offset-2 ring-offset-cream"
                  : "opacity-80 hover:opacity-100",
              )}
            >
              <img
                src={src}
                alt=""
                className="size-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
