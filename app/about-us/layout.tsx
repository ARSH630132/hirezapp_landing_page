import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { createPageMetadata } from "@/lib/metadata";
import { siteRoutes } from "@/lib/site-config";

const aboutTitle = "About Us";
const aboutDescription =
  "Learn about GFF AI — our mission, leadership, and enterprise AI consulting approach across strategy, delivery, and scale from Garage to Foundry to Factory.";

export const metadata: Metadata = createPageMetadata({
  title: aboutTitle,
  description: aboutDescription,
  path: siteRoutes.about,
  keywords: [
    "GFF AI about",
    "enterprise AI company",
    "AI consulting team",
    "AI transformation partner",
    "Garage Foundry Factory",
  ],
});

export default function AboutUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd
        path={siteRoutes.about}
        pageTitle={`${aboutTitle} | GFF AI`}
        pageDescription={aboutDescription}
      />
      {children}
    </>
  );
}
