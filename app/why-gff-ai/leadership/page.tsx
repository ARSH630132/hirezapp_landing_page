"use client";

import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import NarrativeSection from "@/components/inner-pages/NarrativeSection";
import { BentoGrid, BentoCard } from "@/components/inner-pages/BentoGrid";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";
import RelatedPagesGrid from "@/components/inner-pages/RelatedPagesGrid";
import { Users, Shield, Award } from "lucide-react";

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
    title: "Global Delivery Model",
    tag: "PRESENCE",
    desc: "Exploring our Singapore HQ, London and India factories.",
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
    desc: "Agentic GDP Index, Digital Labour Penetration, and AI Board Readiness.",
    href: "/why-gff-ai/differentiator"
  }
];

export default function LeadershipPage() {
  const filteredLinks = RELATED_PAGES.filter(p => p.href !== "/why-gff-ai/leadership");

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Corporate Governance"
        title="Executive Leadership"
        visualType="executiveLeadership"
        highlightedWord="Leadership"
        description="Meet GFF AI PTE LTD.'s strategic leadership directing the safe integration of autonomous digital labour inside international enterprises."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Why GFF AI", href: "/why-gff-ai" },
          { label: "Leadership" }
        ]}
      />

      <NarrativeSection
        tag="FOUNDER & CHAIRMAN"
        title="Dr. Ashish Chandra"
        subtitle="Architect of Sovereign Agentic Systems"
        paragraphs={[
          "Dr. Ashish Chandra leads GFF AI PTE LTD. (UEN 202621347N) with a deep focus on academic rigor, sovereign system engineering, and executive boardroom alignment. Under his guidance, GFF AI has pioneered state-of-the-art reference architectures that help global enterprise boards govern, secure, and industrialize multi-agent cognitive layers safely.",
          "Through his vision, our global headquarters in Singapore coordinates our London Client Innovation Centre and India AI Engineering Factory to deliver highly secure, high-throughput sandboxes."
        ]}
        bullets={[
          { boldText: "Sovereign Alignment", text: "Pioneering risk boundaries that align models with complex local legal mandates." },
          { boldText: "Global Delivery Leader", text: "Coordinating strategic execution across GFF's premier global delivery nodes." },
          { boldText: "Boardroom-Level Governance", text: "Guiding executive boards using advanced metrics like the Agentic GDP Index." }
        ]}
      />

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 py-12">
        <h2 className="text-[28px] sm:text-[36px] font-bold text-white tracking-tight mb-4 text-center">
          Our Executive Boardroom Structure
        </h2>
        <p className="text-[15px] text-white/60 text-center max-w-[700px] mx-auto mb-12 font-light">
          GFF AI structures its executive leadership across three key governance hubs to ensure compliance, stability, and extreme technical execution.
        </p>

        <BentoGrid>
          <BentoCard
            title="Chief Technology Director"
            description="Leading the GFF AI Engineering Division to supervise global container orchestration, custom semantic router setups, and pgvector knowledge systems."
            badge="Infrastructure Hub"
            icon={<Users className="w-5 h-5 text-[#009DFF]" />}
            glowColor="blue"
          />
          <BentoCard
            title="Chief Compliance Director"
            description="Supervising our multi-layer zero-trust guardrails, GDPR boundaries, and regional legal alignments across our London and Singapore operational hubs."
            badge="Regulatory Hub"
            icon={<Shield className="w-5 h-5 text-[#E4000F]" />}
            glowColor="red"
          />
          <BentoCard
            title="Director of IP & Quantitative Research"
            description="Directing our GFF AI Research Division, publishing proprietary industry metrics including our Digital Labour Penetration Score and AI Board Readiness Index."
            badge="Research Hub"
            icon={<Award className="w-5 h-5 text-purple-400" />}
            glowColor="purple"
          />
        </BentoGrid>
      </div>

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 py-16 flex flex-col gap-16">
        <PremiumCTA
          title="Engage Directly with Our Systems Architects"
          description="Schedule a technical deep-dive with our leadership team to review the GFF AI Reference Architecture under your specific compliance framework."
        />

        <RelatedPagesGrid links={filteredLinks} />
      </div>
    </InnerPageShell>
  );
}