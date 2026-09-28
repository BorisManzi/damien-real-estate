import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { requireStaff } from "@/lib/catalog";
import { getSql } from "@/lib/db";
import {
  DEFAULT_HOME,
  mergeHomeContent,
  type HomeContent,
} from "@/lib/home-defaults";

export type { HomeContent, HomeHero, HomeLocations } from "@/lib/home-defaults";
export { DEFAULT_HOME };

export type CmsImageInput =
  | { kind: "url"; url: string }
  | { kind: "keep"; id: string }
  | { kind: "upload"; dataUrl: string; mime: string };

export type HomeInput = {
  hero: {
    eyebrow: string;
    headline: string;
    subhead: string;
    searchLabel: string;
    imageAlt: string;
    image: CmsImageInput;
  };
  featured: HomeContent["featured"];
  locations: {
    heading: string;
    subhead: string;
    items: Array<{
      slug: string;
      name: string;
      match: string;
      image: CmsImageInput;
    }>;
  };
  categories: HomeContent["categories"];
  difference: HomeContent["difference"];
  howItWorks: HomeContent["howItWorks"];
  cta: HomeContent["cta"];
  footer: HomeContent["footer"];
};

type StoredImage = { kind: "url"; url: string } | { kind: "blob"; mediaId: string };

type StoredHome = {
  hero: Omit<HomeContent["hero"], "imageSrc"> & { image: StoredImage };
  featured: HomeContent["featured"];
  locations: {
    heading: string;
    subhead: string;
    items: Array<{
      slug: string;
      name: string;
      match: string;
      image: StoredImage;
    }>;
  };
  categories: HomeContent["categories"];
  difference: HomeContent["difference"];
  howItWorks: HomeContent["howItWorks"];
  cta: HomeContent["cta"];
  footer: HomeContent["footer"];
};

export const getHomeContent = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      return await loadHome();
    } catch {
      return DEFAULT_HOME;
    }
  },
);

export const saveHomeContent = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: HomeInput) => input)
  .handler(async ({ context, data }) => {
    await requireStaff(context.userId);
    const stored = await persistHome(data);
    return toPublic(stored);
  });

export async function readPageMediaBytes(id: string): Promise<{
  mime: string;
  body: Uint8Array;
  redirectUrl?: string;
} | null> {
  try {
    const sql = await getSql();
    const rows = await sql.query<{
      source: string;
      url: string | null;
      mime: string | null;
      bytes: Uint8Array | Buffer | null;
    }>("select source, url, mime, bytes from page_media where id = $1 limit 1", [
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
  } catch {
    return null;
  }
}

async function loadHome(): Promise<HomeContent> {
  const sql = await getSql();
  const rows = await sql<{ body: string }>`
    select body from page_content where id = ${"home"} limit 1
  `;
  if (!rows[0]) {
    const stored = publicToStored(DEFAULT_HOME);
    await sql`
      insert into page_content (id, body)
      values (${"home"}, ${JSON.stringify(stored)})
      on conflict (id) do nothing
    `;
    return DEFAULT_HOME;
  }
  return toPublic(parseStored(rows[0].body));
}

async function persistHome(data: HomeInput): Promise<StoredHome> {
  const sql = await getSql();
  const heroImage = await persistImage(data.hero.image);
  const locationItems = [];
  for (const item of data.locations.items) {
    locationItems.push({
      slug: item.slug.trim() || "place",
      name: item.name.trim() || "Place",
      match: item.match.trim() || item.name.trim() || "Kigali",
      image: await persistImage(item.image),
    });
  }
  const stored: StoredHome = {
    hero: {
      eyebrow: data.hero.eyebrow.trim(),
      headline: data.hero.headline.trim() || DEFAULT_HOME.hero.headline,
      subhead: data.hero.subhead.trim(),
      searchLabel: data.hero.searchLabel.trim() || DEFAULT_HOME.hero.searchLabel,
      imageAlt: data.hero.imageAlt.trim() || DEFAULT_HOME.hero.imageAlt,
      image: heroImage,
    },
    featured: {
      heading: data.featured.heading.trim() || DEFAULT_HOME.featured.heading,
      subhead: data.featured.subhead.trim(),
      linkLabel: data.featured.linkLabel.trim() || DEFAULT_HOME.featured.linkLabel,
    },
    locations: {
      heading: data.locations.heading.trim() || DEFAULT_HOME.locations.heading,
      subhead: data.locations.subhead.trim(),
      items: locationItems.length ? locationItems : publicToStored(DEFAULT_HOME).locations.items,
    },
    categories: {
      heading: data.categories.heading.trim() || DEFAULT_HOME.categories.heading,
      items: DEFAULT_HOME.categories.items.map((item, i) => ({
        title: data.categories.items[i]?.title.trim() || item.title,
        copy: data.categories.items[i]?.copy.trim() || item.copy,
      })),
    },
    difference: {
      heading: data.difference.heading.trim() || DEFAULT_HOME.difference.heading,
      body: data.difference.body.trim(),
      problems: data.difference.problems.map((p) => p.trim()).filter(Boolean),
      benefits: DEFAULT_HOME.difference.benefits.map((item, i) => ({
        title: data.difference.benefits[i]?.title.trim() || item.title,
        copy: data.difference.benefits[i]?.copy.trim() || item.copy,
      })),
    },
    howItWorks: {
      heading: data.howItWorks.heading.trim() || DEFAULT_HOME.howItWorks.heading,
      steps: DEFAULT_HOME.howItWorks.steps.map((item, i) => ({
        title: data.howItWorks.steps[i]?.title.trim() || item.title,
        copy: data.howItWorks.steps[i]?.copy.trim() || item.copy,
      })),
    },
    cta: {
      heading: data.cta.heading.trim() || DEFAULT_HOME.cta.heading,
      body: data.cta.body.trim(),
      primaryLabel: data.cta.primaryLabel.trim() || DEFAULT_HOME.cta.primaryLabel,
      secondaryLabel:
        data.cta.secondaryLabel.trim() || DEFAULT_HOME.cta.secondaryLabel,
    },
    footer: {
      blurb: data.footer.blurb.trim() || DEFAULT_HOME.footer.blurb,
    },
  };
  const body = JSON.stringify(stored);
  const existing = await sql<{ id: string }>`
    select id from page_content where id = ${"home"} limit 1
  `;
  if (existing.length) {
    await sql`
      update page_content
      set body = ${body}, updated_at = now()
      where id = ${"home"}
    `;
  } else {
    await sql`
      insert into page_content (id, body) values (${"home"}, ${body})
    `;
  }
  return stored;
}

async function persistImage(input: CmsImageInput): Promise<StoredImage> {
  if (input.kind === "url") {
    return { kind: "url", url: input.url || DEFAULT_HOME.hero.imageSrc };
  }
  if (input.kind === "keep") {
    return { kind: "blob", mediaId: input.id };
  }
  const parsed = parseDataUrl(input.dataUrl);
  const bytes = Buffer.from(parsed.base64, "base64");
  const id = crypto.randomUUID();
  const sql = await getSql();
  await sql.query(
    `insert into page_media (id, source, mime, bytes) values ($1, 'blob', $2, $3)`,
    [id, input.mime || parsed.mime, bytes],
  );
  return { kind: "blob", mediaId: id };
}

function parseStored(body: string): StoredHome {
  try {
    const parsed = JSON.parse(body) as StoredHome;
    return parsed;
  } catch {
    return publicToStored(DEFAULT_HOME);
  }
}

function toPublic(stored: StoredHome): HomeContent {
  const raw = {
    hero: {
      eyebrow: stored.hero?.eyebrow,
      headline: stored.hero?.headline,
      subhead: stored.hero?.subhead,
      searchLabel: stored.hero?.searchLabel,
      imageAlt: stored.hero?.imageAlt,
      imageSrc: resolveStoredImage(stored.hero?.image, DEFAULT_HOME.hero.imageSrc),
    },
    featured: stored.featured,
    locations: {
      heading: stored.locations?.heading,
      subhead: stored.locations?.subhead,
      items: (stored.locations?.items ?? []).map((item, i) => ({
        slug: item.slug,
        name: item.name,
        match: item.match,
        imageSrc: resolveStoredImage(
          item.image,
          DEFAULT_HOME.locations.items[i % DEFAULT_HOME.locations.items.length]
            .imageSrc,
        ),
      })),
    },
    categories: stored.categories,
    difference: stored.difference,
    howItWorks: stored.howItWorks,
    cta: stored.cta,
    footer: stored.footer,
  };
  return mergeHomeContent(raw);
}

function publicToStored(content: HomeContent): StoredHome {
  return {
    hero: {
      eyebrow: content.hero.eyebrow,
      headline: content.hero.headline,
      subhead: content.hero.subhead,
      searchLabel: content.hero.searchLabel,
      imageAlt: content.hero.imageAlt,
      image: srcToStored(content.hero.imageSrc),
    },
    featured: content.featured,
    locations: {
      heading: content.locations.heading,
      subhead: content.locations.subhead,
      items: content.locations.items.map((item) => ({
        slug: item.slug,
        name: item.name,
        match: item.match,
        image: srcToStored(item.imageSrc),
      })),
    },
    categories: content.categories,
    difference: content.difference,
    howItWorks: content.howItWorks,
    cta: content.cta,
    footer: content.footer,
  };
}

function srcToStored(src: string): StoredImage {
  const match = /^\/api\/media\/([^/?#]+)$/.exec(src);
  if (match) return { kind: "blob", mediaId: match[1] };
  return { kind: "url", url: src };
}

function resolveStoredImage(image: StoredImage | undefined, fallback: string) {
  if (!image) return fallback;
  if (image.kind === "blob" && image.mediaId) return `/api/media/${image.mediaId}`;
  if (image.kind === "url" && image.url) return image.url;
  return fallback;
}

function parseDataUrl(dataUrl: string) {
  const match = /^data:([^;]+);base64,(.+)$/.exec(dataUrl);
  if (match) return { mime: match[1], base64: match[2] };
  return { mime: "image/jpeg", base64: dataUrl };
}
