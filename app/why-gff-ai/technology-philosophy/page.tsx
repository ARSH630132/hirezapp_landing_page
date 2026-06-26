"use client";

import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import ArchitectureDiagram from "@/components/inner-pages/ArchitectureDiagram";
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
    title: "Global Delivery Model",
    tag: "PRESENCE",
    desc: "Exploring our Singapore HQ, London and India factories.",
    href: "/why-gff-ai/global-model"
  },
  {
    title: "Core Differentiator",
    tag: "PROPRIETARY IP",
    desc: "Agentic GDP Index, Digital Labour Penetration, and AI Board Readiness.",
    href: "/why-gff-ai/differentiator"
  }
];

export default function TechnologyPhilosophyPage() {
  const filteredLinks = RELATED_PAGES.filter(p => p.href !== "/why-gff-ai/technology-philosophy");

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Technical Ethos"
        title="Our Technology Philosophy & Architecture"
        highlightedWord="Technology Philosophy"
        description="The GFF AI Reference Architecture provides a robust, cryptographically isolated structural blueprint designed to prevent prompt drift and state decay."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Why GFF AI", href: "/why-gff-ai" },
          { label: "Technology Philosophy" }
        ]}
      />

      <NarrativeSection
        tag="ARCHITECTURAL COMPLIANCE"
        title="Zero-Trust Boundaries for Autonomous Systems"
        paragraphs={[
          "Under GFF AI PTE LTD. (UEN 202621347N), enterprise agents are not treated as experimental text interfaces. They are engineered as stateful, microservice-level corporate assets. Our technology philosophy holds that autonomous agent actions must remain fully predictable, auditable, and isolated within cryptographic lanes.",
          "Our GFF AI Reference Architecture governs knowledge boundaries through localized hybrid graph-vector state memories (pgvector and Neo4j), enforces strict PII-obfuscating guardrails, and schedules outward operations via audited transactional queues. This prevents memory leaks and guarantees system alignment."
        ]}
        bullets={[
          { boldText: "Cryptographic Isolation", text: "Runtime parameters are isolated locally inside zero-trust sandbox boundaries." },
          { boldText: "Hybrid State Memory", text: "Long-term client context is governed through cryptographically signed graph nodes." },
          { boldText: "Deterministic Routing", text: "Task requests are routed through strict semantic protocols to prevent system hallucination." }
        ]}
      />

      {/* Interactive System Blueprint Diagram Section */}
      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-16">
        <h2 className="text-center text-[28px] sm:text-[34px] font-bold text-white tracking-tight mb-8">
          The GFF AI Reference Architecture Blueprint
        </h2>
        <ArchitectureDiagram />
      </div>

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 py-16 flex flex-col gap-16">
        <PremiumCTA
          title="Review the Technical Specification with Our Architects"
          description="Incorporate our stateful memory architectures and secure semantic router topologies into your sovereign enterprise infrastructure."
        />

        <RelatedPagesGrid links={filteredLinks} />
      </div>
    </InnerPageShell>
  );
}