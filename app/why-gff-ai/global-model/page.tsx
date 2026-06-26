"use client";

import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import GlobalHubMap from "@/components/inner-pages/GlobalHubMap";
import NarrativeSection from "@/components/inner-pages/NarrativeSection";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";
import RelatedPagesGrid from "@/components/inner-pages/RelatedPagesGrid";

const RELATED_PAGES = [
  {
    title: "Why Choose GFF AI",
    tag: "OVERVIEW",
    desc: "The premium partner bridging abstract AI research and boardroom execution.",
    href: "/why-gff-ai"
  },
  {
    title: "Mission & Purpose",
    tag: "ETHOS",
    desc: "Our commitment to building safe, sovereign agentic infrastructure.",
    href: "/why-gff-ai/mission"
  },
  {
    title: "Vision of Autonomy",
    tag: "OUTLOOK",
    desc: "Empowering global enterprises with cognitive resilience.",
    href: "/why-gff-ai/vision"
  },
  {
    title: "Garage, Foundry & Factory",
    tag: "METHODOLOGY",
    desc: "Our triple-layer industrialization framework designed for safe execution.",
    href: "/why-gff-ai/garage-foundry-factory"
  },
  {
    title: "Operating Model",
    tag: "EXECUTION",
    desc: "From architectural blueprinting to horizontal multi-agent scaling.",
    href: "/why-gff-ai/operating-model"
  },
  {
    title: "Executive Leadership",
    tag: "GOVERNANCE",
    desc: "Meet Dr. Ashish Chandra and the executive boardroom directors.",
    href: "/why-gff-ai/leadership"
  },
  {
    title: "Technology Philosophy",
    tag: "ARCHITECTURE",
    desc: "Discover GFF AI Reference Architecture, built for cryptographic safety.",
    href: "/why-gff-ai/technology-philosophy"
  },
  {
    title: "Core Differentiator",
    tag: "PROPRIETARY IP",
    desc: "Agentic GDP Index, Digital Labour Penetration, and AI Board Readiness.",
    href: "/why-gff-ai/differentiator"
  }
];

export default function GlobalModelPage() {
  const filteredLinks = RELATED_PAGES.filter(p => p.href !== "/why-gff-ai/global-model");

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Global Presence"
        title="Our Global Delivery Model"
        highlightedWord="Global Delivery Model"
        description="GFF AI PTE LTD. deploys enterprise sandboxes across three primary geopolitical delivery hubs to guarantee sovereignty, compliance, and velocity."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Why GFF AI", href: "/why-gff-ai" },
          { label: "Global Model" }
        ]}
      />

      <NarrativeSection
        tag="GEOGRAPHIC FOOTPRINT"
        title="Sovereign Control in Strategic Jurisdictions"
        paragraphs={[
          "To satisfy the rigorous regulatory requirements of global multi-national corporations, GFF AI PTE LTD. (UEN 202621347N) coordinates its execution across three specialized physical hubs, ensuring strict corporate data governance and data boundaries.",
          "Our Singapore Global HQ houses our core corporate governance and proprietary IP research division. Our London Client Innovation Centre coordinates client strategy and co-designs secure, bespoke system blueprints. Finally, our India AI Engineering Factory drives high-throughput technical container scaling, security sandboxing, and live system telemetry."
        ]}
        bullets={[
          { boldText: "Singapore Global HQ", text: "Governs corporate compliance, platform security standards, and research initiatives." },
          { boldText: "London Innovation Centre", text: "Co-designs bespoke workflows and semantic routing topologies for global banking and logistics clients." },
          { boldText: "India Engineering Factory", text: "Maintains high-availability nodes, pgvector caches, and containerized scale-out structures." }
        ]}
      />

      {/* Interactive Global Map Component */}
      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-16">
        <h2 className="text-center text-[28px] sm:text-[34px] font-bold text-white tracking-tight mb-8">
          The GFF AI Sovereign Compute Network
        </h2>
        <GlobalHubMap />
      </div>

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 py-16 flex flex-col gap-16">
        <PremiumCTA
          title="Secure Your Local Delivery Parameters"
          description="Schedule an architectural deep-dive with our team to configure sandbox delivery boundaries in your specific geographic jurisdiction."
        />

        <RelatedPagesGrid links={filteredLinks} />
      </div>
    </InnerPageShell>
  );
}