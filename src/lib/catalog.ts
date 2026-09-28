import { createServerFn } from "@tanstack/react-start";
import type { Property, PropertyKind, TransactionType } from "@/data/properties";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";

export type ListingLifecycle = "live" | "draft" | "paused" | "let" | "sold";

export type ManagedListing = Property & {
  lifecycle: ListingLifecycle;
  media: { id: string; src: string }[];
};

export type ClientStatus = "inquired" | "rented" | "purchased";

export type ClientRow = {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: ClientStatus;
  listingId: string | null;
  listingTitle: string | null;
  notes: string;
  createdAt: string;
};

export const LIFECYCLE_LABEL: Record<ListingLifecycle, string> = {
  live: "Live",
  draft: "Draft",
  paused: "Paused",
  let: "Let",
  sold: "Sold",
};

export const CLIENT_STATUS_LABEL: Record<ClientStatus, string> = {
  inquired: "Inquired",
  rented: "Rented",
  purchased: "Purchased",
};

export type PhotoInput =
  | { kind: "keep"; id: string }
  | { kind: "upload"; dataUrl: string; mime: string };

export type ListingInput = {
  id?: string;
  title: string;
  neighborhood: string;
  city: string;
  district: string;
  transactionType: TransactionType;
  propertyType: PropertyKind;
  price: number;
  size: number;
  bedrooms: number | null;
  bathrooms: number | null;
  furnished: boolean | "partial";
  parking: boolean;
  garden: boolean;
  featured: boolean;
  description: string;
  amenities: string[];
  lifecycle: ListingLifecycle;
  photos: PhotoInput[];
  coverIndex: number;
};

export type ClientInput = {
  id?: string;
  name: string;
  phone: string;
  email: string;
  status: ClientStatus;
  listingId: string | null;
  notes: string;
};

type ListingRow = {
  id: string;
  slug: string;
  title: string;
  status: string;
  transaction_type: string;
  property_type: string;
  price: number;
  price_period: string | null;
  currency: string;
  city: string;
  district: string;
  neighborhood: string;
  bedrooms: number | null;
  bathrooms: number | null;
  size: number;
  parking: boolean;
  garden: boolean;
  furnished: string;
  description: string;
  amenities: string;
  featured: boolean;
  lifecycle: string;
  created_at: string | Date;
};

type MediaRow = {
  id: string;
  listing_id: string;
  sort_order: number;
  is_cover: boolean;
  source: string;
  url: string | null;
};

const g = globalThis as typeof globalThis & {
  __damienCatalogSeed__?: Promise<void>;
};

export function ensureCatalog() {
  g.__damienCatalogSeed__ ??= seedCatalog().catch((err) => {
    g.__damienCatalogSeed__ = undefined;
    throw err;
  });
  return g.__damienCatalogSeed__;
}

export const listLiveListings = createServerFn({ method: "GET" }).handler(
  async () => {
    await ensureCatalog();
    return loadListings("live");
  },
);

export const getListingBySlug = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    await ensureCatalog();
    const all = await loadListings("live");
    return all.find((p) => p.slug === slug) ?? null;
  });

export const listManagedListings = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireStaff(context.userId);
    return loadListings("all");
  });

export const getManagedListing = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((id: string) => id)
  .handler(async ({ context, data: id }) => {
    await requireStaff(context.userId);
    const all = await loadListings("all");
    return all.find((p) => p.id === id) ?? null;
  });

export const saveListing = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: ListingInput) => input)
  .handler(async ({ context, data }) => {
    await requireStaff(context.userId);
    return persistListing(data, context.userId);
  });

export const setListingLifecycle = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: string; lifecycle: ListingLifecycle }) => input)
  .handler(async ({ context, data }) => {
    await requireStaff(context.userId);
    const sql = await getSql();
    await sql`update listings set lifecycle = ${data.lifecycle} where id = ${data.id}`;
    return { ok: true as const };
  });

export const deleteListing = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: string) => id)
  .handler(async ({ context, data: id }) => {
    await requireStaff(context.userId);
    const sql = await getSql();
    await sql`delete from listings where id = ${id}`;
    return { ok: true as const };
  });

export const getStaffStatus = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensureCatalog();
    const staff = await ensureStaff(context.userId);
    return { staff };
  });

export const listClients = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireStaff(context.userId);
    return loadClients();
  });

export const saveClient = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: ClientInput) => input)
  .handler(async ({ context, data }) => {
    await requireStaff(context.userId);
    const sql = await getSql();
    const id = data.id ?? crypto.randomUUID();
    const listingId = data.listingId || null;
    const name = data.name.trim();
    if (!name) throw new Error("Name is required");
    if (data.id) {
      await sql`
        update clients
        set name = ${name},
            phone = ${data.phone.trim()},
            email = ${data.email.trim()},
            status = ${data.status},
            listing_id = ${listingId},
            notes = ${data.notes.trim()}
        where id = ${id}
      `;
    } else {
      await sql`
        insert into clients (id, name, phone, email, status, listing_id, notes)
        values (
          ${id},
          ${name},
          ${data.phone.trim()},
          ${data.email.trim()},
          ${data.status},
          ${listingId},
          ${data.notes.trim()}
        )
      `;
    }
    return { id };
  });

export const deleteClient = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: string) => id)
  .handler(async ({ context, data: id }) => {
    await requireStaff(context.userId);
    const sql = await getSql();
    await sql`delete from clients where id = ${id}`;
    return { ok: true as const };
  });

export const createInquiry = createServerFn({ method: "POST" })
  .validator(
    (input: {
      name: string;
      phone: string;
      listingSlug?: string;
      notes: string;
    }) => input,
  )
  .handler(async ({ data }) => {
    await ensureCatalog();
    const sql = await getSql();
    let listingId: string | null = null;
    if (data.listingSlug) {
      const found = await sql<{ id: string }>`
        select id from listings where slug = ${data.listingSlug} limit 1
      `;
      listingId = found[0]?.id ?? null;
    }
    const name = data.name.trim();
    if (!name || !data.phone.trim()) throw new Error("Name and phone are required");
    await sql`
      insert into clients (id, name, phone, email, status, listing_id, notes)
      values (
        ${crypto.randomUUID()},
        ${name},
        ${data.phone.trim()},
        ${""},
        ${"inquired"},
        ${listingId},
        ${data.notes.trim()}
      )
    `;
    return { ok: true as const };
  });

export async function readMediaBytes(id: string): Promise<{
  mime: string;
  body: Uint8Array;
  redirectUrl?: string;
} | null> {
  await ensureCatalog();
  const sql = await getSql();
  const rows = await sql.query<{
    source: string;
    url: string | null;
    mime: string | null;
    bytes: Uint8Array | Buffer | null;
  }>("select source, url, mime, bytes from listing_media where id = $1 limit 1", [
    id,
  ]);
  const row = rows[0];
  if (!row) return null;
  if (row.source === "url" && row.url) {
    return { mime: "text/plain", body: new Uint8Array(), redirectUrl: row.url };
  }
  if (!row.bytes) return null;
  const body =
    row.bytes instanceof Uint8Array ? row.bytes : new Uint8Array(row.bytes);
  return { mime: row.mime || "image/jpeg", body };
}

export async function requireStaff(userId: string) {
  await ensureCatalog();
  const ok = await ensureStaff(userId);
  if (!ok) throw new Error("Forbidden");
}

export async function addStaffProfile(userId: string, name: string) {
  await ensureCatalog();
  const sql = await getSql();
  await sql`
    insert into staff_profiles (user_id, name, role)
    values (${userId}, ${name}, ${"founder"})
    on conflict (user_id) do nothing
  `;
}

async function ensureStaff(userId: string): Promise<boolean> {
  const sql = await getSql();
  const mine = await sql<{ user_id: string }>`
    select user_id from staff_profiles where user_id = ${userId} limit 1
  `;
  if (mine.length) return true;
  const countRows = await sql<{ n: number }>`
    select count(*)::int as n from staff_profiles
  `;
  if (Number(countRows[0]?.n ?? 0) === 0) {
    await sql`
      insert into staff_profiles (user_id, name, role)
      values (${userId}, ${"Admin"}, ${"founder"})
    `;
    return true;
  }
  return false;
}

async function loadListings(scope: "live" | "all"): Promise<ManagedListing[]> {
  const sql = await getSql();
  const rows =
    scope === "live"
      ? await sql<ListingRow>`
          select * from listings where lifecycle = 'live' order by featured desc, created_at desc
        `
      : await sql<ListingRow>`
          select * from listings order by created_at desc
        `;
  if (!rows.length) return [];
  const media = await sql<MediaRow>`
    select id, listing_id, sort_order, is_cover, source, url
    from listing_media
    order by is_cover desc, sort_order asc
  `;
  const byListing = new Map<string, { id: string; src: string }[]>();
  for (const m of media) {
    const src = m.source === "url" && m.url ? m.url : `/api/media/${m.id}`;
    const list = byListing.get(m.listing_id) ?? [];
    list.push({ id: m.id, src });
    byListing.set(m.listing_id, list);
  }
  return rows.map((row) => toListing(row, byListing.get(row.id) ?? []));
}

function toListing(
  row: ListingRow,
  mediaItems: { id: string; src: string }[],
): ManagedListing {
  let amenities: string[] = [];
  try {
    const parsed = JSON.parse(row.amenities || "[]") as unknown;
    if (Array.isArray(parsed)) amenities = parsed.map(String);
  } catch {
    amenities = [];
  }
  const created =
    typeof row.created_at === "string"
      ? row.created_at.slice(0, 10)
      : new Date(row.created_at).toISOString().slice(0, 10);
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    status: row.status as Property["status"],
    transactionType: row.transaction_type as TransactionType,
    propertyType: row.property_type as PropertyKind,
    price: Number(row.price),
    pricePeriod: (row.price_period as Property["pricePeriod"]) ?? null,
    currency: "RWF",
    city: row.city,
    district: row.district,
    neighborhood: row.neighborhood,
    bedrooms: row.bedrooms == null ? null : Number(row.bedrooms),
    bathrooms: row.bathrooms == null ? null : Number(row.bathrooms),
    size: Number(row.size),
    parking: Boolean(row.parking),
    garden: Boolean(row.garden),
    furnished:
      row.furnished === "yes" ? true : row.furnished === "partial" ? "partial" : false,
    description: row.description,
    amenities,
    images: mediaItems.map((m) => m.src),
    media: mediaItems,
    featured: Boolean(row.featured),
    createdAt: created,
    lifecycle: row.lifecycle as ListingLifecycle,
  };
}

async function persistListing(data: ListingInput, userId: string) {
  const sql = await getSql();
  const title = data.title.trim();
  if (!title) throw new Error("Title is required");
  if (!data.photos.length) throw new Error("Add at least one photo");
  const id = data.id ?? crypto.randomUUID();
  const existing = data.id
    ? await sql<{ slug: string }>`select slug from listings where id = ${id} limit 1`
    : [];
  const slug =
    existing[0]?.slug ??
    (await uniqueSlug(slugify(title) || "listing"));
  const status =
    data.transactionType === "rent"
      ? "for-rent"
      : data.transactionType === "buy"
        ? "for-sale"
        : "available";
  const pricePeriod = data.transactionType === "rent" ? "month" : "sale";
  const furnished =
    data.furnished === true ? "yes" : data.furnished === "partial" ? "partial" : "no";
  const amenities = JSON.stringify(data.amenities);
  if (data.id && existing.length) {
    await sql`
      update listings set
        title = ${title},
        status = ${status},
        transaction_type = ${data.transactionType},
        property_type = ${data.propertyType},
        price = ${Math.round(data.price)},
        price_period = ${pricePeriod},
        city = ${data.city.trim() || "Kigali"},
        district = ${data.district.trim()},
        neighborhood = ${data.neighborhood.trim()},
        bedrooms = ${data.bedrooms},
        bathrooms = ${data.bathrooms},
        size = ${Math.round(data.size) || 0},
        parking = ${data.parking},
        garden = ${data.garden},
        furnished = ${furnished},
        description = ${data.description.trim()},
        amenities = ${amenities},
        featured = ${data.featured},
        lifecycle = ${data.lifecycle}
      where id = ${id}
    `;
  } else {
    await sql`
      insert into listings (
        id, slug, title, status, transaction_type, property_type, price, price_period,
        city, district, neighborhood, bedrooms, bathrooms, size, parking, garden,
        furnished, description, amenities, featured, lifecycle, created_by
      ) values (
        ${id}, ${slug}, ${title}, ${status}, ${data.transactionType}, ${data.propertyType},
        ${Math.round(data.price)}, ${pricePeriod}, ${data.city.trim() || "Kigali"},
        ${data.district.trim()}, ${data.neighborhood.trim()}, ${data.bedrooms},
        ${data.bathrooms}, ${Math.round(data.size) || 0}, ${data.parking}, ${data.garden},
        ${furnished}, ${data.description.trim()}, ${amenities}, ${data.featured},
        ${data.lifecycle}, ${userId}
      )
    `;
  }

  const keepIds = data.photos
    .filter((p): p is { kind: "keep"; id: string } => p.kind === "keep")
    .map((p) => p.id);
  if (keepIds.length) {
    const placeholders = keepIds.map((_, i) => `$${i + 2}`).join(", ");
    await sql.query(
      `delete from listing_media where listing_id = $1 and id not in (${placeholders})`,
      [id, ...keepIds],
    );
  } else {
    await sql`delete from listing_media where listing_id = ${id}`;
  }

  const coverIndex = Math.min(Math.max(0, data.coverIndex), data.photos.length - 1);
  for (let i = 0; i < data.photos.length; i += 1) {
    const photo = data.photos[i];
    const isCover = i === coverIndex;
    if (photo.kind === "keep") {
      await sql`
        update listing_media
        set sort_order = ${i}, is_cover = ${isCover}
        where id = ${photo.id} and listing_id = ${id}
      `;
      continue;
    }
    const parsed = parseDataUrl(photo.dataUrl);
    const bytes = Buffer.from(parsed.base64, "base64");
    const mediaId = crypto.randomUUID();
    await sql.query(
      `insert into listing_media (id, listing_id, sort_order, is_cover, source, mime, bytes)
       values ($1, $2, $3, $4, 'blob', $5, $6)`,
      [mediaId, id, i, isCover, photo.mime || parsed.mime, bytes],
    );
  }
  return { id, slug };
}

async function uniqueSlug(base: string) {
  const sql = await getSql();
  let slug = base;
  let n = 0;
  for (;;) {
    const found = await sql<{ slug: string }>`
      select slug from listings where slug = ${slug} limit 1
    `;
    if (!found.length) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
}

function slugify(title: string) {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

function parseDataUrl(dataUrl: string) {
  const match = /^data:([^;]+);base64,(.+)$/.exec(dataUrl);
  if (match) return { mime: match[1], base64: match[2] };
  return { mime: "image/jpeg", base64: dataUrl };
}

async function loadClients(): Promise<ClientRow[]> {
  const sql = await getSql();
  const rows = await sql<{
    id: string;
    name: string;
    phone: string;
    email: string;
    status: string;
    listing_id: string | null;
    notes: string;
    created_at: string | Date;
    listing_title: string | null;
  }>`
    select c.id, c.name, c.phone, c.email, c.status, c.listing_id, c.notes, c.created_at,
           l.title as listing_title
    from clients c
    left join listings l on l.id = c.listing_id
    order by c.created_at desc
  `;
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    phone: r.phone,
    email: r.email,
    status: r.status as ClientStatus,
    listingId: r.listing_id,
    listingTitle: r.listing_title,
    notes: r.notes,
    createdAt:
      typeof r.created_at === "string"
        ? r.created_at
        : new Date(r.created_at).toISOString(),
  }));
}

async function seedCatalog() {
  const sql = await getSql();
  const existing = await sql<{ n: number }>`select count(*)::int as n from listings`;
  if (Number(existing[0]?.n ?? 0) > 0) return;

  const { seedListings } = await import("@/data/admin-seed");
  const listings = seedListings();
  for (const listing of listings) {
    const furnished =
      listing.furnished === true
        ? "yes"
        : listing.furnished === "partial"
          ? "partial"
          : "no";
    await sql`
      insert into listings (
        id, slug, title, status, transaction_type, property_type, price, price_period,
        city, district, neighborhood, bedrooms, bathrooms, size, parking, garden,
        furnished, description, amenities, featured, lifecycle, created_at
      ) values (
        ${listing.id}, ${listing.slug}, ${listing.title}, ${listing.status},
        ${listing.transactionType}, ${listing.propertyType}, ${listing.price},
        ${listing.pricePeriod}, ${listing.city}, ${listing.district}, ${listing.neighborhood},
        ${listing.bedrooms}, ${listing.bathrooms}, ${listing.size}, ${listing.parking},
        ${listing.garden}, ${furnished}, ${listing.description},
        ${JSON.stringify(listing.amenities)}, ${listing.featured}, ${listing.lifecycle},
        ${listing.createdAt}
      )
      on conflict (id) do nothing
    `;
    for (let i = 0; i < listing.images.length; i += 1) {
      await sql`
        insert into listing_media (id, listing_id, sort_order, is_cover, source, url)
        values (
          ${`${listing.id}-img-${i}`},
          ${listing.id},
          ${i},
          ${i === 0},
          ${"url"},
          ${listing.images[i]}
        )
        on conflict (id) do nothing
      `;
    }
  }

  const clients: Array<{
    id: string;
    name: string;
    phone: string;
    email: string;
    status: ClientStatus;
    listingId: string;
    notes: string;
    createdAt: string;
  }> = [
    {
      id: "c01",
      name: "Patrick Mugisha",
      phone: "0788 221 009",
      email: "patrick.mugisha@gmail.com",
      status: "purchased",
      listingId: "p23",
      notes: "Bought the corner plot in Rwamagana, August 2026.",
      createdAt: "2026-08-12T10:00:00.000Z",
    },
    {
      id: "c02",
      name: "Diane Iradukunda",
      phone: "0733 445 812",
      email: "diradukunda@yahoo.com",
      status: "rented",
      listingId: "p24",
      notes: "Twelve-month term on the serviced 1-bed in Kacyiru.",
      createdAt: "2026-07-20T09:00:00.000Z",
    },
    {
      id: "c03",
      name: "Jean Bosco Niyonsenga",
      phone: "0788 667 441",
      email: "",
      status: "rented",
      listingId: "p04",
      notes: "Moved into the Nyarugenge studio in June.",
      createdAt: "2026-06-18T11:30:00.000Z",
    },
    {
      id: "c04",
      name: "Aline Mukamana",
      phone: "0722 109 338",
      email: "aline.m@outlook.com",
      status: "purchased",
      listingId: "p11",
      notes: "Sale completed on the Kicukiro 3-bed.",
      createdAt: "2026-08-28T15:00:00.000Z",
    },
  ];
  for (const c of clients) {
    await sql`
      insert into clients (id, name, phone, email, status, listing_id, notes, created_at)
      values (
        ${c.id}, ${c.name}, ${c.phone}, ${c.email}, ${c.status}, ${c.listingId},
        ${c.notes}, ${c.createdAt}
      )
      on conflict (id) do nothing
    `;
  }
}
