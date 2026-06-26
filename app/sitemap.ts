import type { MetadataRoute } from "next";
import { siteConfig, siteRoutes } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return Object.entries(siteRoutes).map(([key, path]) => {
    const isHome = key === "home";
    return {
      url: new URL(path, siteConfig.url).toString(),
      lastModified,
      changeFrequency: isHome ? "weekly" : "monthly" as const,
      priority: isHome ? 1.0 : 0.8,
    };
  });
}
