import { useHomePage } from "@/lib/home-context";

export function HowItWorks() {
  const { howItWorks } = useHomePage();
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <h2 className="max-w-xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        {howItWorks.heading}
      </h2>
      <ol className="relative mt-12 grid gap-8 md:grid-cols-3 md:gap-6">
        <div
          aria-hidden
          className="pointer-events-none absolute left-[16%] right-[16%] top-6 hidden h-px bg-border md:block"
        />
        {howItWorks.steps.map((step, i) => (
          <li key={`${step.title}-${i}`} className="relative">
            <span className="relative z-10 inline-flex size-12 items-center justify-center rounded-full bg-green font-display text-sm font-semibold text-cream">
              {String(i + 1).padStart(2, "0")}
            </span>
            {i < howItWorks.steps.length - 1 ? (
              <span
                aria-hidden
                className="absolute left-12 top-6 hidden h-px w-[calc(100%-0.5rem)] bg-sage/50 md:block"
              />
            ) : null}
            <h3 className="mt-5 font-display text-xl font-semibold">
              {step.title}
            </h3>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-quiet">
              {step.copy}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
