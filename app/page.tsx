import type { Metadata } from "next";
import LandingPage from "@/components/LandingPage";
import JsonLd from "@/components/JsonLd";
import { createPageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = createPageMetadata({
  title: `${siteConfig.name} | ${siteConfig.tagline}`,
  description: siteConfig.description,
  path: "/",
});

export default function Page() {
  return (
    <>
      <JsonLd path="/" pageTitle={`${siteConfig.name} | ${siteConfig.tagline}`} />
      <LandingPage />
    </>
  );
}
