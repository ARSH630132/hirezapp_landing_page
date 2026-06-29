"use client";

import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import EnterpriseFlowDiagram from "@/components/inner-pages/EnterpriseFlowDiagram";
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
    title: "Garage, Foundry & Factory",
    tag: "METHODOLOGY",
    desc: "Our triple-layer industrialization framework designed for safe execution.",
    href: "/why-gff-ai/garage-foundry-factory"
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

export default function OperatingModelPage() {
  const filteredLinks = RELATED_PAGES.filter(p => p.href !== "/why-gff-ai/operating-model");

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Operational Excellence"
        title="Our Operating Model & Execution Lifecycle"
        highlightedWord="Operating Model"
        visualType="operatingModel"
        description="We implement rigorous software engineering and governance controls to structure the lifecycle of autonomous multi-agent clusters."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Why GFF AI", href: "/why-gff-ai" },
          { label: "Operating Model" }
        ]}
      />

      <NarrativeSection
        tag="LIFECYCLE MANAGEMENT"
        title="Institutional-Grade Orchestration for Digital Labour"
        paragraphs={[
          "Deploying artificial intelligence within regulated industries requires far more than generic API calls. At GFF AI PTE LTD. (UEN 202621347N), our operating model enforces continuous auditability, cryptographic signatures, and strict human oversight across every single transaction path.",
          "Our GFF AI Reference Architecture controls the entire agent lifecycle. This includes the initial semantic routing of incoming tasks, real-time safety guardrail scans, human-in-the-loop approvals for critical operations, and secure payload delivery to legacy systems."
        ]}
        bullets={[
          { boldText: "Automated Routing", text: "Task payloads are evaluated and assigned to specialized agent micro-services dynamically." },
          { boldText: "Secure Guardrails", text: "Deterministic filters and local LLM validators scan every output for security risks." },
          { boldText: "Human Override Blocks", text: "Critical financial or operational steps require explicit confirmation by authorized staff." }
        ]}
      />

      {/* Interactive Runtime Flow Diagram Section */}
      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-16">
        <h2 className="text-center text-[28px] sm:text-[34px] font-bold text-white tracking-tight mb-8">
          The GFF AI Runtime Execution Architecture
        </h2>
        <EnterpriseFlowDiagram />
      </div>

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 py-16 flex flex-col gap-16">
        <PremiumCTA
          title="Supercharge Your Operational Resilience"
          description="Schedule a technical consultation with our systems architects to design an isolated, high-throughput sandbox."
        />

        <RelatedPagesGrid links={filteredLinks} />
      </div>
    </InnerPageShell>
  );
}