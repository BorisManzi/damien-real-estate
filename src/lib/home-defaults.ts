export type HomeHero = {
  eyebrow: string;
  headline: string;
  subhead: string;
  searchLabel: string;
  imageSrc: string;
  imageAlt: string;
};

export type HomeLocations = {
  heading: string;
  subhead: string;
  items: Array<{
    slug: string;
    name: string;
    match: string;
    imageSrc: string;
  }>;
};

export type HomeContent = {
  hero: HomeHero;
  featured: {
    heading: string;
    subhead: string;
    linkLabel: string;
  };
  locations: HomeLocations;
  categories: {
    heading: string;
    items: Array<{ title: string; copy: string }>;
  };
  difference: {
    heading: string;
    body: string;
    problems: string[];
    benefits: Array<{ title: string; copy: string }>;
  };
  howItWorks: {
    heading: string;
    steps: Array<{ title: string; copy: string }>;
  };
  cta: {
    heading: string;
    body: string;
    primaryLabel: string;
    secondaryLabel: string;
  };
  footer: {
    blurb: string;
  };
};

export const DEFAULT_HOME: HomeContent = {
  hero: {
    eyebrow: "Damien Real Estate",
    headline: "Find your place in Rwanda.",
    subhead: "Homes, apartments and properties made easier to find.",
    searchLabel: "Search properties",
    imageSrc: "/images/hero.jpg",
    imageAlt: "Residential hillsides of Kigali, Rwanda",
  },
  featured: {
    heading: "Places worth seeing.",
    subhead: "A few of the properties currently available through Damien.",
    linkLabel: "All properties",
  },
  locations: {
    heading: "Find a place in your neighborhood.",
    subhead: "Search the parts of Rwanda people actually ask us about.",
    items: [
      {
        slug: "kigali",
        name: "Kigali",
        match: "Kigali",
        imageSrc: "/images/locations/kigali.jpg",
      },
      {
        slug: "gasabo",
        name: "Gasabo",
        match: "Gasabo",
        imageSrc: "/images/locations/gasabo.jpg",
      },
      {
        slug: "kicukiro",
        name: "Kicukiro",
        match: "Kicukiro",
        imageSrc: "/images/locations/kicukiro.jpg",
      },
      {
        slug: "nyarugenge",
        name: "Nyarugenge",
        match: "Nyarugenge",
        imageSrc: "/images/locations/nyarugenge.jpg",
      },
      {
        slug: "musanze",
        name: "Musanze",
        match: "Musanze",
        imageSrc: "/images/locations/musanze.jpg",
      },
      {
        slug: "rubavu",
        name: "Rubavu",
        match: "Rubavu",
        imageSrc: "/images/locations/rubavu.jpg",
      },
      {
        slug: "huye",
        name: "Huye",
        match: "Huye",
        imageSrc: "/images/locations/huye.jpg",
      },
      {
        slug: "rwamagana",
        name: "Rwamagana",
        match: "Rwamagana",
        imageSrc: "/images/locations/rwamagana.jpg",
      },
    ],
  },
  categories: {
    heading: "What are you looking for?",
    items: [
      { title: "Houses", copy: "Find houses for rent or sale." },
      { title: "Apartments", copy: "Modern apartments and flats." },
      { title: "Land", copy: "Discover land opportunities." },
      { title: "Commercial", copy: "Spaces for businesses and offices." },
    ],
  },
  difference: {
    heading: "Finding a home shouldn’t be this hard.",
    body: "Property hunting in Rwanda can involve a lot of noise. Damien is one place to discover properties, compare your options and get help finding the right one.",
    problems: [
      "Calling multiple agents",
      "Searching through WhatsApp groups",
      "Driving around looking for signs",
      "Unclear information",
      "Outdated listings",
      "Wasted time",
    ],
    benefits: [
      {
        title: "Better discovery",
        copy: "Find properties based on where you actually want to live.",
      },
      {
        title: "Clear information",
        copy: "See the important details before wasting time on a viewing.",
      },
      {
        title: "Human help",
        copy: "Not sure what fits? Our team can help you find it.",
      },
      {
        title: "Less hassle",
        copy: "Spend less time searching and more time settling in.",
      },
    ],
  },
  howItWorks: {
    heading: "Your next place is closer than you think.",
    steps: [
      {
        title: "Search",
        copy: "Tell us where you want to live and what you’re looking for.",
      },
      {
        title: "Explore",
        copy: "Browse properties that match your needs.",
      },
      {
        title: "Move in",
        copy: "Contact Damien, arrange a viewing and take the next step.",
      },
    ],
  },
  cta: {
    heading: "Still looking for the right place?",
    body: "Tell us what you need. We’ll help you find it.",
    primaryLabel: "Find my home",
    secondaryLabel: "Talk to Damien",
  },
  footer: {
    blurb:
      "Find your place in Rwanda. Homes, apartments and land — without the usual hassle.",
  },
};

export function mergeHomeContent(raw: unknown): HomeContent {
  const src = raw && typeof raw === "object" ? (raw as Partial<HomeContent>) : {};
  return {
    hero: {
      ...DEFAULT_HOME.hero,
      ...(src.hero ?? {}),
      imageSrc: src.hero?.imageSrc || DEFAULT_HOME.hero.imageSrc,
    },
    featured: { ...DEFAULT_HOME.featured, ...(src.featured ?? {}) },
    locations: {
      heading: src.locations?.heading ?? DEFAULT_HOME.locations.heading,
      subhead: src.locations?.subhead ?? DEFAULT_HOME.locations.subhead,
      items:
        src.locations?.items?.length
          ? src.locations.items.map((item, i) => ({
              ...DEFAULT_HOME.locations.items[i % DEFAULT_HOME.locations.items.length],
              ...item,
              imageSrc:
                item.imageSrc ||
                DEFAULT_HOME.locations.items[i % DEFAULT_HOME.locations.items.length]
                  .imageSrc,
            }))
          : DEFAULT_HOME.locations.items,
    },
    categories: {
      heading: src.categories?.heading ?? DEFAULT_HOME.categories.heading,
      items: DEFAULT_HOME.categories.items.map((item, i) => ({
        ...item,
        ...(src.categories?.items?.[i] ?? {}),
      })),
    },
    difference: {
      heading: src.difference?.heading ?? DEFAULT_HOME.difference.heading,
      body: src.difference?.body ?? DEFAULT_HOME.difference.body,
      problems:
        src.difference?.problems?.filter(Boolean).length
          ? src.difference.problems.filter(Boolean)
          : DEFAULT_HOME.difference.problems,
      benefits: DEFAULT_HOME.difference.benefits.map((item, i) => ({
        ...item,
        ...(src.difference?.benefits?.[i] ?? {}),
      })),
    },
    howItWorks: {
      heading: src.howItWorks?.heading ?? DEFAULT_HOME.howItWorks.heading,
      steps: DEFAULT_HOME.howItWorks.steps.map((item, i) => ({
        ...item,
        ...(src.howItWorks?.steps?.[i] ?? {}),
      })),
    },
    cta: { ...DEFAULT_HOME.cta, ...(src.cta ?? {}) },
    footer: { ...DEFAULT_HOME.footer, ...(src.footer ?? {}) },
  };
}
