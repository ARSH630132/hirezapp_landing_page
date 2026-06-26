"use client";

import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import { BentoGrid, BentoCard } from "@/components/inner-pages/BentoGrid";
import NarrativeSection from "@/components/inner-pages/NarrativeSection";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";
import RelatedPagesGrid from "@/components/inner-pages/RelatedPagesGrid";
import { Cpu, Globe, Award } from "lucide-react";

const RELATED_PAGES = [
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

export default function WhyGffAiPage() {
  return (
    <InnerPageShell>
      <InnerPageHero
        category="Corporate Strategy"
        title="Why Choose GFF AI"
        highlightedWord="GFF AI"
        description="GFF AI PTE LTD. is the premium partner bridging abstract AI research and boardroom execution with our industrialization layers."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Why GFF AI" }
        ]}
      />

      <NarrativeSection
        tag="ARCHITECTS OF THE AGENT ECONOMY"
        title="Boardroom Governance Meets Industrial-Scale AI"
        paragraphs={[
          "Enterprise AI initiatives frequently stall because they treat cognitive agents as superficial software components. At GFF AI PTE LTD. (UEN 202621347N), we design and industrialize enterprise agents as core corporate assets, engineered to scale alongside human organizational hierarchies.",
          "Our unique GFF AI Reference Architecture enforces cryptographic isolation, zero-trust memory lanes, and multi-layered safety guardrails. We ensure your transition to a digital workforce is highly auditable, safe, and computationally resilient."
        ]}
        bullets={[
          { boldText: "Singapore Global HQ", text: "Centred in the world's leading sovereign digital hub to guarantee corporate data privacy." },
          { boldText: "Proprietary Indices", text: "Empowering boards with the Agentic GDP Index and Digital Labour Penetration Score." },
          { boldText: "Zero-Trust Standard", text: "Pioneering stateful agent sandboxing and cryptographically isolated tool execution." }
        ]}
      />

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 py-12">
        <h2 className="text-[28px] sm:text-[36px] font-bold text-white tracking-tight mb-4 text-center">
          The Pillars of GFF AI Strategic Supremacy
        </h2>
        <p className="text-[15px] text-white/60 text-center max-w-[700px] mx-auto mb-12 font-light">
          We bring analytical rigour to help enterprise boards confidently measure, govern, and deploy autonomous cognitive networks.
        </p>

        <BentoGrid>
          <BentoCard
            title="Strategic Sovereignty"
            description="Operating as GFF AI PTE LTD. out of Singapore, we align our platform directly with stringent global risk guidelines and AI governance frameworks."
            badge="Corporate"
            icon={<Globe className="w-5 h-5 text-[#009DFF]" />}
            glowColor="blue"
          />
          <BentoCard
            title="GFF AI Reference Architecture"
            description="Our structural blueprint integrates real-time telemetry, dynamic task-routing, pgvector state memory, and autonomous audit logs."
            badge="Engineering"
            icon={<Cpu className="w-5 h-5 text-[#E4000F]" />}
            glowColor="red"
          />
          <BentoCard
            title="Proprietary IP Division"
            description="Leverage quantitative benchmarks including our Agentic GDP Index, Digital Labour Penetration Score, and AI Board Readiness Index."
            badge="Research"
            icon={<Award className="w-5 h-5 text-purple-400" />}
            glowColor="purple"
          />
        </BentoGrid>
      </div>

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 py-16 flex flex-col gap-16">
        <PremiumCTA
          title="Supercharge Your Enterprise Autonomy"
          description="Explore our strategic subpages below to analyze GFF AI's exact delivery model, global centres of excellence, and proprietary architectural research."
        />

        <RelatedPagesGrid links={RELATED_PAGES} />
      </div>
    </InnerPageShell>
  );
}