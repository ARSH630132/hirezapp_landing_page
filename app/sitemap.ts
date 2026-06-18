import type { MetadataRoute } from "next";
import { siteConfig, siteRoutes } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: new URL(siteRoutes.home, siteConfig.url).toString(),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: new URL(siteRoutes.about, siteConfig.url).toString(),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
