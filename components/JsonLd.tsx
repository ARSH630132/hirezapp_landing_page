import { siteConfig, siteRoutes } from "@/lib/site-config";

type JsonLdProps = {
  path?: string;
  pageTitle?: string;
  pageDescription?: string;
};

export default function JsonLd({
  path = siteRoutes.home,
  pageTitle,
  pageDescription = siteConfig.description,
}: JsonLdProps) {
  const pageUrl = new URL(path, siteConfig.url).toString();
  const logoUrl = new URL(siteConfig.ogImage, siteConfig.url).toString();

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    logo: logoUrl,
    email: siteConfig.email,
    description: siteConfig.description,
    sameAs: [],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: logoUrl,
      },
    },
    inLanguage: "en-US",
  };

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: pageTitle ?? `${siteConfig.name} | ${siteConfig.tagline}`,
    description: pageDescription,
    url: pageUrl,
    isPartOf: {
      "@type": "WebSite",
      url: siteConfig.url,
      name: siteConfig.name,
    },
    about: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    inLanguage: "en-US",
  };

  const professionalService = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    image: logoUrl,
    areaServed: ["Singapore", "United Kingdom", "India", "Worldwide"],
    serviceType: [
      "Enterprise AI Consulting",
      "Agentic AI Engineering",
      "AI Transformation Strategy",
      "AI Governance",
      "AI Training",
    ],
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [organization, website, webPage, professionalService],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
