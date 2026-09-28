import { properties, type Property } from "@/data/properties";

export const TEAM = [
  { id: "boris", name: "Boris Manzi", role: "Founder" },
  { id: "aline", name: "Aline Uwase", role: "Lettings" },
  { id: "jean", name: "Jean-Claude Habimana", role: "Sales" },
  { id: "diane", name: "Diane Mukamana", role: "Viewings" },
] as const;

export type TeamId = (typeof TEAM)[number]["id"];

export type ListingLifecycle = "live" | "draft" | "paused" | "let" | "sold";

export type ManagedListing = Property & {
  lifecycle: ListingLifecycle;
  views: number;
  inquiryCount: number;
  saveCount: number;
  assignedTo: TeamId;
};

export type LeadStage =
  | "new"
  | "contacted"
  | "viewing"
  | "negotiating"
  | "won"
  | "lost";

export type LeadSource = "website" | "whatsapp" | "referral" | "walk-in";

export type Lead = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  source: LeadSource;
  intent: "rent" | "buy" | "land" | "unsure";
  stage: LeadStage;
  propertyId?: string;
  propertyTitle?: string;
  location: string;
  budget: string;
  bedrooms: string;
  notes: string;
  assignedTo: TeamId;
  lastActivityAt: string;
  createdAt: string;
  nextAction?: string;
  websiteInquiry?: boolean;
};

export type Activity = {
  id: string;
  at: string;
  kind: "inquiry" | "viewing" | "whatsapp" | "listing" | "note" | "won";
  title: string;
  detail: string;
  leadId?: string;
  listingId?: string;
};

export type WeekPoint = {
  week: string;
  visits: number;
  views: number;
  searches: number;
  inquiries: number;
  whatsapp: number;
  viewings: number;
};

const STATS: Record<
  string,
  {
    views: number;
    inquiryCount: number;
    saveCount: number;
    assignedTo: TeamId;
    lifecycle?: ListingLifecycle;
  }
> = {
  p01: { views: 1842, inquiryCount: 18, saveCount: 42, assignedTo: "aline" },
  p02: { views: 1511, inquiryCount: 14, saveCount: 31, assignedTo: "aline" },
  p03: { views: 978, inquiryCount: 9, saveCount: 22, assignedTo: "boris" },
  p04: { views: 640, inquiryCount: 6, saveCount: 11, assignedTo: "diane" },
  p05: { views: 1210, inquiryCount: 11, saveCount: 28, assignedTo: "aline" },
  p06: { views: 1344, inquiryCount: 12, saveCount: 33, assignedTo: "diane" },
  p07: { views: 801, inquiryCount: 7, saveCount: 16, assignedTo: "aline" },
  p08: { views: 555, inquiryCount: 5, saveCount: 9, assignedTo: "diane" },
  p09: { views: 1670, inquiryCount: 15, saveCount: 37, assignedTo: "jean" },
  p10: { views: 1422, inquiryCount: 10, saveCount: 29, assignedTo: "jean" },
  p11: { views: 733, inquiryCount: 6, saveCount: 14, assignedTo: "jean" },
  p12: { views: 690, inquiryCount: 5, saveCount: 12, assignedTo: "jean" },
  p13: { views: 488, inquiryCount: 4, saveCount: 8, assignedTo: "boris" },
  p14: { views: 920, inquiryCount: 8, saveCount: 19, assignedTo: "boris" },
  p15: { views: 310, inquiryCount: 2, saveCount: 5, assignedTo: "jean" },
  p16: { views: 1104, inquiryCount: 9, saveCount: 24, assignedTo: "boris" },
  p17: { views: 402, inquiryCount: 3, saveCount: 6, assignedTo: "aline" },
  p18: { views: 275, inquiryCount: 2, saveCount: 4, assignedTo: "diane" },
  p19: { views: 612, inquiryCount: 5, saveCount: 10, assignedTo: "diane" },
  p20: { views: 358, inquiryCount: 3, saveCount: 7, assignedTo: "boris" },
};

export function seedListings(): ManagedListing[] {
  const fromSite = properties.map((p) => {
    const extra = STATS[p.id] ?? {
      views: 120,
      inquiryCount: 1,
      saveCount: 2,
      assignedTo: "aline" as TeamId,
    };
    return {
      ...p,
      lifecycle: extra.lifecycle ?? "live",
      views: extra.views,
      inquiryCount: extra.inquiryCount,
      saveCount: extra.saveCount,
      assignedTo: extra.assignedTo,
    };
  });
  return [...fromSite, ...WORKSPACE_ONLY];
}

const WORKSPACE_ONLY: ManagedListing[] = [
  {
    id: "p21",
    title: "Architect’s House, Gacuriro",
    slug: "architects-house-gacuriro",
    status: "for-sale",
    transactionType: "buy",
    propertyType: "house",
    price: 185000000,
    pricePeriod: "sale",
    currency: "RWF",
    city: "Kigali",
    district: "Gasabo",
    neighborhood: "Gacuriro",
    bedrooms: 5,
    bathrooms: 4,
    size: 420,
    parking: true,
    garden: true,
    furnished: false,
    description:
      "A five-bedroom house still in photography. Wide garden, a study, and a layout meant for a family that entertains. Draft until the last images land.",
    amenities: ["Garden", "Study", "Generator", "Staff quarters", "Double parking"],
    images: [
      "/images/properties/house-pool.jpg",
      "/images/properties/house-modern.jpg",
      "/images/interiors/living-1.jpg",
      "/images/interiors/kitchen-2.jpg",
    ],
    featured: false,
    createdAt: "2026-09-10",
    lifecycle: "draft",
    views: 0,
    inquiryCount: 0,
    saveCount: 0,
    assignedTo: "jean",
  },
  {
    id: "p22",
    title: "Compact Studio, Kimihurura",
    slug: "compact-studio-kimihurura",
    status: "for-rent",
    transactionType: "rent",
    propertyType: "studio",
    price: 180000,
    pricePeriod: "month",
    currency: "RWF",
    city: "Kigali",
    district: "Gasabo",
    neighborhood: "Kimihurura",
    bedrooms: 1,
    bathrooms: 1,
    size: 32,
    parking: false,
    garden: false,
    furnished: true,
    description:
      "A furnished studio paused while the owner repaints. Will go live again in October — keep the waitlist.",
    amenities: ["Furnished", "Fibre", "Water tank", "Security"],
    images: [
      "/images/interiors/apt-1.jpg",
      "/images/interiors/apt-3.jpg",
      "/images/interiors/living-3.jpg",
    ],
    featured: false,
    createdAt: "2026-08-18",
    lifecycle: "paused",
    views: 214,
    inquiryCount: 4,
    saveCount: 9,
    assignedTo: "aline",
  },
  {
    id: "p23",
    title: "Corner Plot, Rwamagana",
    slug: "corner-plot-rwamagana-sold",
    status: "available",
    transactionType: "land",
    propertyType: "land",
    price: 22000000,
    pricePeriod: "sale",
    currency: "RWF",
    city: "Rwamagana",
    district: "Rwamagana",
    neighborhood: "Rwamagana",
    bedrooms: null,
    bathrooms: null,
    size: 800,
    parking: false,
    garden: false,
    furnished: false,
    description:
      "An 800 m² corner plot that closed in August. Kept in the workspace for comparable sales.",
    amenities: ["Titled", "Corner plot", "Road access"],
    images: [
      "/images/properties/land-africa.jpg",
      "/images/locations/rwamagana.jpg",
    ],
    featured: false,
    createdAt: "2026-06-02",
    lifecycle: "sold",
    views: 640,
    inquiryCount: 7,
    saveCount: 12,
    assignedTo: "boris",
  },
  {
    id: "p24",
    title: "Serviced 1 Bedroom, Kacyiru",
    slug: "serviced-1-bedroom-kacyiru",
    status: "for-rent",
    transactionType: "rent",
    propertyType: "apartment",
    price: 280000,
    pricePeriod: "month",
    currency: "RWF",
    city: "Kigali",
    district: "Gasabo",
    neighborhood: "Kacyiru",
    bedrooms: 1,
    bathrooms: 1,
    size: 48,
    parking: true,
    garden: false,
    furnished: true,
    description:
      "Let to a consultant on a twelve-month term from August. Housekeeping twice a week; parking included.",
    amenities: ["Furnished", "Housekeeping", "Parking", "Fibre", "Backup power"],
    images: [
      "/images/interiors/apt-2.jpg",
      "/images/interiors/kitchen-1.jpg",
      "/images/interiors/living-2.jpg",
    ],
    featured: false,
    createdAt: "2026-07-18",
    lifecycle: "let",
    views: 890,
    inquiryCount: 11,
    saveCount: 20,
    assignedTo: "diane",
  },
];

export const WEEKLY: WeekPoint[] = [
  { week: "Jun 30", visits: 318, views: 702, searches: 164, inquiries: 9, whatsapp: 22, viewings: 3 },
  { week: "Jul 7", visits: 354, views: 781, searches: 188, inquiries: 11, whatsapp: 26, viewings: 4 },
  { week: "Jul 14", visits: 401, views: 860, searches: 210, inquiries: 12, whatsapp: 29, viewings: 5 },
  { week: "Jul 21", visits: 446, views: 955, searches: 236, inquiries: 14, whatsapp: 33, viewings: 5 },
  { week: "Jul 28", visits: 512, views: 1104, searches: 271, inquiries: 16, whatsapp: 38, viewings: 6 },
  { week: "Aug 4", visits: 548, views: 1180, searches: 290, inquiries: 17, whatsapp: 41, viewings: 7 },
  { week: "Aug 11", visits: 603, views: 1295, searches: 322, inquiries: 19, whatsapp: 46, viewings: 8 },
  { week: "Aug 18", visits: 661, views: 1410, searches: 348, inquiries: 21, whatsapp: 50, viewings: 8 },
  { week: "Aug 25", visits: 724, views: 1566, searches: 381, inquiries: 24, whatsapp: 55, viewings: 10 },
  { week: "Sep 1", visits: 812, views: 1740, searches: 430, inquiries: 27, whatsapp: 61, viewings: 11 },
  { week: "Sep 8", visits: 894, views: 1922, searches: 488, inquiries: 29, whatsapp: 66, viewings: 13 },
  { week: "Sep 15", visits: 976, views: 2148, searches: 541, inquiries: 32, whatsapp: 72, viewings: 14 },
];

export const FUNNEL = [
  { label: "Searches", value: 4069 },
  { label: "Listing views", value: 15663 },
  { label: "Inquiries", value: 231 },
  { label: "WhatsApp", value: 539 },
  { label: "Viewings", value: 94 },
  { label: "Moved in", value: 11 },
];

export const SOURCES = [
  { name: "Website", value: 42, fill: "var(--color-green)" },
  { name: "WhatsApp", value: 38, fill: "var(--color-sage)" },
  { name: "Referral", value: 14, fill: "var(--color-terracotta)" },
  { name: "Walk-in", value: 6, fill: "var(--color-cream-dark)" },
];

export const seedLeads: Lead[] = [
  {
    id: "l01",
    name: "Marie Uwase",
    phone: "0788 441 203",
    email: "marie.uwase@gmail.com",
    source: "website",
    intent: "rent",
    stage: "viewing",
    propertyId: "p01",
    propertyTitle: "Modern 3 Bedroom House",
    location: "Kicukiro, Kigali",
    budget: "RWF 450,000 / month",
    bedrooms: "3",
    notes: "Family of four. Wants the garden and a viewing Saturday morning.",
    assignedTo: "aline",
    lastActivityAt: "2026-09-15T09:20:00.000Z",
    createdAt: "2026-09-12T14:05:00.000Z",
    nextAction: "Confirm Saturday viewing",
    websiteInquiry: true,
  },
  {
    id: "l02",
    name: "Eric Ndayisaba",
    phone: "0732 118 904",
    source: "website",
    intent: "rent",
    stage: "new",
    propertyId: "p02",
    propertyTitle: "Bright 2 Bedroom Apartment",
    location: "Kacyiru, Kigali",
    budget: "RWF 300,000 / month",
    bedrooms: "2",
    notes: "Works nearby the ministries. Asked if backup power is reliable.",
    assignedTo: "aline",
    lastActivityAt: "2026-09-16T07:40:00.000Z",
    createdAt: "2026-09-16T07:40:00.000Z",
    nextAction: "Call today",
    websiteInquiry: true,
  },
  {
    id: "l03",
    name: "Claudine Ingabire",
    phone: "0788 902 331",
    source: "whatsapp",
    intent: "rent",
    stage: "contacted",
    propertyId: "p03",
    propertyTitle: "Family House with Garden",
    location: "Gacuriro, Kigali",
    budget: "RWF 650,000 / month",
    bedrooms: "4",
    notes: "Sent the floor plan on WhatsApp. Waiting on the husband.",
    assignedTo: "boris",
    lastActivityAt: "2026-09-14T16:12:00.000Z",
    createdAt: "2026-09-11T11:00:00.000Z",
    nextAction: "Follow up Thursday",
  },
  {
    id: "l04",
    name: "Patrick Mugisha",
    phone: "0722 560 118",
    email: "p.mugisha@outlook.com",
    source: "referral",
    intent: "buy",
    stage: "negotiating",
    propertyId: "p09",
    propertyTitle: "Contemporary Family Home",
    location: "Kibagabaga, Kigali",
    budget: "RWF 90–100M",
    bedrooms: "4",
    notes: "Second viewing done. Discussing fixtures and a September close.",
    assignedTo: "jean",
    lastActivityAt: "2026-09-15T13:05:00.000Z",
    createdAt: "2026-08-29T10:22:00.000Z",
    nextAction: "Send revised offer notes",
  },
  {
    id: "l05",
    name: "Sandrine Iradukunda",
    phone: "0783 214 667",
    source: "website",
    intent: "buy",
    stage: "viewing",
    propertyId: "p10",
    propertyTitle: "Hillside House with Views",
    location: "Rebero, Kigali",
    budget: "RWF 120,000,000",
    bedrooms: "4",
    notes: "Wants the view. Viewing booked for Friday 10:00.",
    assignedTo: "jean",
    lastActivityAt: "2026-09-13T08:30:00.000Z",
    createdAt: "2026-09-08T19:14:00.000Z",
    nextAction: "Friday viewing",
    websiteInquiry: true,
  },
  {
    id: "l06",
    name: "Alain Bizimana",
    phone: "0786 009 441",
    source: "walk-in",
    intent: "land",
    stage: "new",
    propertyId: "p13",
    propertyTitle: "Residential Plot, Kicukiro",
    location: "Kicukiro, Kigali",
    budget: "RWF 25–30M",
    bedrooms: "",
    notes: "Came to the office after seeing the board. Wants to build next year.",
    assignedTo: "boris",
    lastActivityAt: "2026-09-15T11:48:00.000Z",
    createdAt: "2026-09-15T11:48:00.000Z",
    nextAction: "Share plot measurements",
  },
  {
    id: "l07",
    name: "Grace Mukeshimana",
    phone: "0788 330 215",
    source: "whatsapp",
    intent: "rent",
    stage: "won",
    propertyId: "p06",
    propertyTitle: "Furnished 2 Bedroom in Kimihurura",
    location: "Kimihurura, Kigali",
    budget: "RWF 420,000 / month",
    bedrooms: "2",
    notes: "Moved in 1 September. Deposit paid. Smooth handover.",
    assignedTo: "diane",
    lastActivityAt: "2026-09-01T15:00:00.000Z",
    createdAt: "2026-08-12T09:40:00.000Z",
  },
  {
    id: "l08",
    name: "Theogene Nsengiyumva",
    phone: "0738 441 090",
    source: "website",
    intent: "land",
    stage: "lost",
    propertyId: "p16",
    propertyTitle: "Lake-view Land, Rubavu",
    location: "Rubavu",
    budget: "RWF 50,000,000",
    bedrooms: "",
    notes: "Chose a plot closer to town. Keep on the Rubavu list.",
    assignedTo: "boris",
    lastActivityAt: "2026-09-04T12:10:00.000Z",
    createdAt: "2026-08-20T17:05:00.000Z",
    websiteInquiry: true,
  },
  {
    id: "l09",
    name: "Divine Uwimana",
    phone: "0782 771 654",
    source: "whatsapp",
    intent: "rent",
    stage: "contacted",
    propertyId: "p05",
    propertyTitle: "4 Bedroom House in Nyarutarama",
    location: "Nyarutarama, Kigali",
    budget: "Up to RWF 1,000,000 / month",
    bedrooms: "4",
    notes: "Expat family arriving in October. Asked about schools and generator.",
    assignedTo: "aline",
    lastActivityAt: "2026-09-14T10:02:00.000Z",
    createdAt: "2026-09-10T08:18:00.000Z",
    nextAction: "Send school notes",
  },
  {
    id: "l10",
    name: "Kevin Hakizimana",
    phone: "0789 120 887",
    email: "kevin.h@company.rw",
    source: "website",
    intent: "rent",
    stage: "new",
    propertyId: "p17",
    propertyTitle: "Office Space, Kacyiru",
    location: "Kacyiru, Kigali",
    budget: "RWF 1,200,000 / month",
    bedrooms: "",
    notes: "Small team of eight. Needs fibre and parking for three cars.",
    assignedTo: "aline",
    lastActivityAt: "2026-09-16T06:55:00.000Z",
    createdAt: "2026-09-16T06:55:00.000Z",
    nextAction: "Reply with floor plate",
    websiteInquiry: true,
  },
  {
    id: "l11",
    name: "Immaculée Nyirahabimana",
    phone: "0785 443 219",
    source: "referral",
    intent: "rent",
    stage: "viewing",
    propertyId: "p08",
    propertyTitle: "Townhouse in Kanombe",
    location: "Kanombe, Kigali",
    budget: "RWF 320,000 / month",
    bedrooms: "3",
    notes: "Cousin of a previous client. Viewing tomorrow at 16:00.",
    assignedTo: "diane",
    lastActivityAt: "2026-09-15T18:20:00.000Z",
    createdAt: "2026-09-13T12:44:00.000Z",
    nextAction: "Tomorrow 16:00 viewing",
  },
  {
    id: "l12",
    name: "Olivier Mugabo",
    phone: "0733 908 441",
    source: "website",
    intent: "buy",
    stage: "new",
    propertyId: "p12",
    propertyTitle: "Modern Apartment, Gikondo",
    location: "Gikondo, Kigali",
    budget: "RWF 45,000,000",
    bedrooms: "2",
    notes: "First-time buyer. Asked about title and service charge.",
    assignedTo: "jean",
    lastActivityAt: "2026-09-15T20:11:00.000Z",
    createdAt: "2026-09-15T20:11:00.000Z",
    nextAction: "Share title notes",
    websiteInquiry: true,
  },
  {
    id: "l13",
    name: "Chantal Mukamana",
    phone: "0788 667 102",
    source: "whatsapp",
    intent: "rent",
    stage: "contacted",
    propertyId: "p19",
    propertyTitle: "Quiet House in Remera",
    location: "Remera, Kigali",
    budget: "RWF 380,000 / month",
    bedrooms: "3",
    notes: "Needs to be close to the stadium. Sent photos last night.",
    assignedTo: "diane",
    lastActivityAt: "2026-09-15T21:04:00.000Z",
    createdAt: "2026-09-14T19:30:00.000Z",
  },
  {
    id: "l14",
    name: "Fabrice Niyonsaba",
    phone: "0781 220 556",
    source: "walk-in",
    intent: "rent",
    stage: "new",
    propertyId: "p18",
    propertyTitle: "Shop Unit, Nyamirambo",
    location: "Nyamirambo, Kigali",
    budget: "RWF 400,000 / month",
    bedrooms: "",
    notes: "Wants a corner shop. Asked about foot traffic on weekends.",
    assignedTo: "diane",
    lastActivityAt: "2026-09-14T15:36:00.000Z",
    createdAt: "2026-09-14T15:36:00.000Z",
    nextAction: "Call with weekend notes",
  },
  {
    id: "l15",
    name: "Ange Ishimwe",
    phone: "0784 991 230",
    source: "website",
    intent: "land",
    stage: "contacted",
    propertyId: "p14",
    propertyTitle: "Hillside Plot, Musanze",
    location: "Musanze",
    budget: "RWF 18,000,000",
    bedrooms: "",
    notes: "Based in Kigali, wants a weekend build. Asked about access road.",
    assignedTo: "boris",
    lastActivityAt: "2026-09-12T09:15:00.000Z",
    createdAt: "2026-09-09T16:40:00.000Z",
    websiteInquiry: true,
  },
];

export const seedActivities: Activity[] = [
  {
    id: "a01",
    at: "2026-09-16T07:40:00.000Z",
    kind: "inquiry",
    title: "New website inquiry",
    detail: "Eric Ndayisaba · Bright 2 Bedroom Apartment, Kacyiru",
    leadId: "l02",
    listingId: "p02",
  },
  {
    id: "a02",
    at: "2026-09-16T06:55:00.000Z",
    kind: "inquiry",
    title: "New website inquiry",
    detail: "Kevin Hakizimana · Office Space, Kacyiru",
    leadId: "l10",
    listingId: "p17",
  },
  {
    id: "a03",
    at: "2026-09-15T21:04:00.000Z",
    kind: "whatsapp",
    title: "WhatsApp reply sent",
    detail: "Diane sent photos of Quiet House in Remera to Chantal Mukamana",
    leadId: "l13",
    listingId: "p19",
  },
  {
    id: "a04",
    at: "2026-09-15T18:20:00.000Z",
    kind: "viewing",
    title: "Viewing booked",
    detail: "Kanombe townhouse · tomorrow 16:00 with Immaculée",
    leadId: "l11",
    listingId: "p08",
  },
  {
    id: "a05",
    at: "2026-09-15T13:05:00.000Z",
    kind: "note",
    title: "Offer conversation",
    detail: "Patrick Mugisha — Kibagabaga family home, discussing fixtures",
    leadId: "l04",
    listingId: "p09",
  },
  {
    id: "a06",
    at: "2026-09-15T11:48:00.000Z",
    kind: "inquiry",
    title: "Walk-in at the office",
    detail: "Alain Bizimana asked about the Kicukiro residential plot",
    leadId: "l06",
    listingId: "p13",
  },
  {
    id: "a07",
    at: "2026-09-15T09:20:00.000Z",
    kind: "viewing",
    title: "Viewing confirmed",
    detail: "Marie Uwase · Modern 3 Bedroom House, Kicukiro · Saturday",
    leadId: "l01",
    listingId: "p01",
  },
  {
    id: "a08",
    at: "2026-09-14T16:12:00.000Z",
    kind: "whatsapp",
    title: "Floor plan shared",
    detail: "Gacuriro family house sent to Claudine Ingabire",
    leadId: "l03",
    listingId: "p03",
  },
  {
    id: "a09",
    at: "2026-09-01T15:00:00.000Z",
    kind: "won",
    title: "Moved in",
    detail: "Grace Mukeshimana took the furnished Kimihurura apartment",
    leadId: "l07",
    listingId: "p06",
  },
  {
    id: "a10",
    at: "2026-09-13T08:30:00.000Z",
    kind: "listing",
    title: "Listing performing well",
    detail: "Hillside House with Views passed 1,400 views this month",
    listingId: "p10",
  },
];

export function teamName(id: string) {
  return TEAM.find((t) => t.id === id)?.name ?? id;
}

export const STAGE_LABEL: Record<LeadStage, string> = {
  new: "New",
  contacted: "Contacted",
  viewing: "Viewing",
  negotiating: "Negotiating",
  won: "Won",
  lost: "Lost",
};

export const STAGE_ORDER: LeadStage[] = [
  "new",
  "contacted",
  "viewing",
  "negotiating",
  "won",
  "lost",
];

export const SOURCE_LABEL: Record<LeadSource, string> = {
  website: "Website",
  whatsapp: "WhatsApp",
  referral: "Referral",
  "walk-in": "Walk-in",
};

export const LIFECYCLE_LABEL: Record<ListingLifecycle, string> = {
  live: "Live",
  draft: "Draft",
  paused: "Paused",
  let: "Let",
  sold: "Sold",
};
