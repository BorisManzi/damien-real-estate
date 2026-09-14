const problems = [
  "Calling multiple agents",
  "Searching through WhatsApp groups",
  "Driving around looking for signs",
  "Unclear information",
  "Outdated listings",
  "Wasted time",
];

const benefits = [
  {
    title: "Better discovery",
    body: "Find properties based on where you actually want to live.",
  },
  {
    title: "Clear information",
    body: "See the important details before wasting time on a viewing.",
  },
  {
    title: "Human help",
    body: "Not sure what fits? Our team can help you find it.",
  },
  {
    title: "Less hassle",
    body: "Spend less time searching and more time settling in.",
  },
];

export function DamienDifference() {
  return (
    <section className="bg-green text-white py-16 md:py-24">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-display text-3xl font-bold leading-tight md:text-4xl text-balance">
              Finding a home shouldn&apos;t be this hard.
            </h2>
            <p className="mt-4 text-white/75">
              Property hunting in Rwanda can involve:
            </p>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {problems.map((item) => (
                <li
                  key={item}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85"
                >
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-8 max-w-md font-display text-xl font-semibold leading-snug text-sage">
              One place to discover properties, compare your options and get help
              finding the right one.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {benefits.map((b, i) => (
              <div
                key={b.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <span className="font-display text-sm font-bold text-accent">
                  0{i + 1}
                </span>
                <h3 className="mt-2 font-display text-lg font-semibold">
                  {b.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  {b.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
