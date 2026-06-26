"use client";

import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import NarrativeSection from "@/components/inner-pages/NarrativeSection";
import Carousel from "@/components/inner-pages/Carousel";
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

const VISION_PHASES = [
  {
    title: "Phase I: Safe Sandboxed Sandbox",
    tag: "FOUNDATIONAL SECURITY",
    desc: "Establishing highly secure local execution zones (Garage Layer) to prove cognitive viability and lock down secure corporate data boundaries.",
    metric: "0% Leakage Guarantee"
  },
  {
    title: "Phase II: Orchestrated Networks",
    tag: "INTEGRATION LAYER",
    desc: "Deploying the Foundry Co-Creation Layer to allow seamless cross-functional communications, API dispatching, and safety-audited routing loops.",
    metric: "Sub-15ms Synchronization"
  },
  {
    title: "Phase III: Sovereign Ecosystems",
    tag: "THE AGENTIC ECONOMY",
    desc: "Fully industrialized, auto-healing systems that dynamically scale multi-agent microservices in the Factory Industrialisation Layer.",
    metric: "100x Operational Volume"
  }
];

export default function VisionPage() {
  const filteredLinks = RELATED_PAGES.filter(p => p.href !== "/why-gff-ai/vision");

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Strategic Outlook"
        title="Our Vision: Empowering Enterprise Autonomy"
        highlightedWord="Enterprise Autonomy"
        description="Pioneering the next era of high-throughput corporate agency, where sovereign networks of self-correcting agents execute board strategies with precision."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Why GFF AI", href: "/why-gff-ai" },
          { label: "Vision" }
        ]}
      />

      <NarrativeSection
        tag="DECADE HORIZON"
        title="Transforming Strategic Vision into Autonomous Action"
        paragraphs={[
          "GFF AI PTE LTD. (UEN 202621347N) envisions a future where multi-national corporations and government boards operate with absolute cognitive resilience. We see an upcoming landscape where human strategic thinkers work side-by-side with secure, self-healing networks of autonomous systems.",
          "Our research division in Singapore focuses on solving the most critical boardroom challenge of this decade: aligning sovereign models with complex, ever-evolving risk vectors. Through GFF AI, organizations gain an institutional-grade platform to safely govern their digital workforce."
        ]}
        bullets={[
          { boldText: "Automated Resiliency", text: "Multi-agent chains that detect runtime anomalies and trigger safe failovers automatically." },
          { boldText: "Scale-Free Optimization", text: "Adding new specialized units to existing workflows with zero system disruptions." },
          { boldText: "Absolute Trust Paths", text: "Secure cryptographic signatures for every action, decision, and system audit." }
        ]}
      />

      {/* Interactive Phase Carousel */}
      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 py-12">
        <h2 className="text-[28px] sm:text-[36px] font-bold text-white tracking-tight mb-4">
          The Roadmap to Cognitive Industrialization
        </h2>
        <p className="text-[15px] text-white/60 max-w-[700px] mb-8 font-light">
          Review our phased methodology to securely transition your enterprise workflows from manual execution to strategic cognitive autonomy.
        </p>

        <Carousel items={VISION_PHASES} />
      </div>

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 py-16 flex flex-col gap-16">
        <PremiumCTA
          title="Prepare Your Infrastructure for the Future"
          description="Schedule a technical session with GFF AI systems architects to begin blueprinting Phase I of your autonomous sandbox."
        />

        <RelatedPagesGrid links={filteredLinks} />
      </div>
    </InnerPageShell>
  );
}