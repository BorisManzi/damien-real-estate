import { useHomePage } from "@/lib/home-context";

export function Difference() {
  const { difference } = useHomePage();
  return (
    <section className="bg-green-ink text-cream">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div>
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {difference.heading}
          </h2>
          <p className="mt-4 max-w-md text-cream/70">{difference.body}</p>
          <ul className="mt-8 grid gap-2 sm:grid-cols-2">
            {difference.problems.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-cream/65"
              >
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-terracotta" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="grid gap-px overflow-hidden rounded-xl bg-cream/10 sm:grid-cols-2">
          {difference.benefits.map((b) => (
            <article key={b.title} className="bg-green-deep p-6">
              <h3 className="font-display text-lg font-semibold">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-cream/70">
                {b.copy}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
