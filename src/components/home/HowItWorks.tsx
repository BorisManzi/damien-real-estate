const steps = [
  {
    n: "01",
    title: "Search",
    body: "Tell us where you want to live and what you're looking for.",
  },
  {
    n: "02",
    title: "Explore",
    body: "Browse properties that match your needs.",
  },
  {
    n: "03",
    title: "Move in",
    body: "Contact Damien, arrange a viewing and take the next step.",
  },
];

export function HowItWorks() {
  return (
    <section className="container-page py-16 md:py-24">
      <div className="mb-12 max-w-2xl">
        <h2 className="font-display text-3xl font-bold text-charcoal md:text-4xl text-balance">
          Your next place is closer than you think.
        </h2>
      </div>

      <ol className="relative grid gap-8 md:grid-cols-3 md:gap-6">
        <div
          className="pointer-events-none absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-green via-sage to-accent md:block"
          aria-hidden
        />
        {steps.map((step) => (
          <li key={step.n} className="relative">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-green bg-cream font-display text-sm font-bold text-green">
              {step.n}
            </div>
            <h3 className="font-display text-xl font-semibold text-charcoal">
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
