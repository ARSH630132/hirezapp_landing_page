import type { Metadata } from "next";
import { siteConfig } from "./site-config";

type PageMetadataOptions = {
  title?: string;
  description?: string;
  path?: string;
  keywords?: string[];
  noIndex?: boolean;
};

export function createPageMetadata({
  title,
  description = siteConfig.description,
  path = "/",
  keywords = [...siteConfig.keywords],
  noIndex = false,
}: PageMetadataOptions = {}): Metadata {
  const pageTitle = title ?? `${siteConfig.name} | ${siteConfig.tagline}`;
  const canonicalUrl = new URL(path, siteConfig.url).toString();
  const ogImageUrl = new URL(siteConfig.ogImage, siteConfig.url).toString();

  return {
    title: pageTitle,
    description,
    keywords,
    authors: [...siteConfig.authors],
    creator: siteConfig.creator,
    publisher: siteConfig.publisher,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: canonicalUrl,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url: canonicalUrl,
      siteName: siteConfig.name,
      title: pageTitle,
      description,
      images: [
        {
          url: ogImageUrl,
          alt: `${siteConfig.name} logo`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      creator: siteConfig.twitterHandle,
      images: [ogImageUrl],
    },
    category: "technology",
    applicationName: siteConfig.name,
    referrer: "origin-when-cross-origin",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    other: {
      "theme-color": siteConfig.themeColor,
    },
  };
}
