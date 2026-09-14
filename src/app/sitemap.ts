import { getAllProperties } from "@/lib/properties";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://damien.rw";
  const properties = await getAllProperties();

  const staticRoutes = [
    "",
    "/properties",
    "/rent",
    "/buy",
    "/land",
    "/about",
    "/contact",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const propertyRoutes = properties.map((p) => ({
    url: `${base}/properties/${p.slug}`,
    lastModified: new Date(p.createdAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...propertyRoutes];
}
