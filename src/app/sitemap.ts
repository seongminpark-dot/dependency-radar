import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { getCountryStats } from "@/lib/worldBank";

export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/sources",
    "/privacy",
    "/terms",
    "/disclaimer",
  ].map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.6,
  }));

  try {
    const rows = await getCountryStats();

    const countryRoutes: MetadataRoute.Sitemap = rows.map((row) => ({
      url: `${siteConfig.url}/country/${row.iso3}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.75,
    }));

    return [...staticRoutes, ...countryRoutes];
  } catch {
    return staticRoutes;
  }
}
