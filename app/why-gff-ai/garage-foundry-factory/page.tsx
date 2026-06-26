"use client";

import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import OperatingModelTimeline from "@/components/inner-pages/OperatingModelTimeline";
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
    desc: "Empowering global enterprises with cognitive resilience and self-healing workflows.",
    href: "/why-gff-ai/vision"
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
    desc: "Meet Dr. Ashish Chandra and the executive boardroom directors of GFF AI.",
    href: "/why-gff-ai/leadership"
  },
  {
    title: "Global Delivery Model",
    tag: "PRESENCE",
    desc: "Exploring our Singapore HQ, London Innovation Centre, and India Engineering Factory.",
    href: "/why-gff-ai/global-model"
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
    desc: "Agentic GDP Index, Digital Labour Penetration Score, and AI Board Readiness Index.",
    href: "/why-gff-ai/differentiator"
  }
];

export default function GarageFoundryFactoryPage() {
  const filteredLinks = RELATED_PAGES.filter(p => p.href !== "/why-gff-ai/garage-foundry-factory");

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Delivery Methodology"
        title="Garage, Foundry, and Factory Framework"
        highlightedWord="Garage, Foundry, and Factory"
        description="Our structured engineering lifecycle bridges abstract academic ideas and boardroom execution through secure, localized stages of validation."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Why GFF AI", href: "/why-gff-ai" },
          { label: "Methodology" }
        ]}
      />

      <NarrativeSection
        tag="INDUSTRIAL IMPLEMENTATION"
        title="Three Strict Staging Layers Built for Governance"
        paragraphs={[
          "Enterprise boards often hesitate to deploy multi-agent automation due to the threat of catastrophic failure or loss of data control. GFF AI PTE LTD. (UEN 202621347N) resolves this challenge. By separating development into distinct stages, we guarantee maximum safety and governance at every step of your digital transformation.",
          "Our Garage Innovation Layer validates architectural and technical feasibility within safe sandboxes. The Foundry Co-Creation Layer configures custom system integrations and builds secure, zero-trust memory paths. Finally, the Factory Industrialisation Layer deploys highly auditable multi-agent microservices designed to scale seamlessly with your operations."
        ]}
        bullets={[
          { boldText: "Garage Innovation Layer", text: "Proof of architecture is validated under simulated parameters within two weeks." },
          { boldText: "Foundry Co-Creation Layer", text: "Integrates with internal APIs, databases, and secure private networks." },
          { boldText: "Factory Industrialisation Layer", text: "Deploys autonomous, containerized multi-agent clusters with automated recovery loops." }
        ]}
      />

      {/* Interactive Timeline Section */}
      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-16">
        <h2 className="text-center text-[28px] sm:text-[34px] font-bold text-white tracking-tight mb-8">
          The Three Pillars of Enterprise AI Scale
        </h2>
        <OperatingModelTimeline />
      </div>

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 py-16 flex flex-col gap-16">
        <PremiumCTA
          title="Begin Blueprinting Your Sandbox"
          description="Speak with our leading engineering specialists in our Singapore headquarters to co-design your first isolated Garage session."
        />

        <RelatedPagesGrid links={filteredLinks} />
      </div>
    </InnerPageShell>
  );
}