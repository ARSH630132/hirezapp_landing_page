"use client";

import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import { BentoGrid, BentoCard } from "@/components/inner-pages/BentoGrid";
import NarrativeSection from "@/components/inner-pages/NarrativeSection";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";
import RelatedPagesGrid from "@/components/inner-pages/RelatedPagesGrid";
import { Shield, Sparkles, Scale } from "lucide-react";

const RELATED_PAGES = [
  {
    title: "Why Choose GFF AI",
    tag: "OVERVIEW",
    desc: "The premium partner bridging abstract AI research and boardroom execution.",
    href: "/why-gff-ai"
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

export default function MissionPage() {
  const filteredLinks = RELATED_PAGES.filter(p => p.href !== "/why-gff-ai/mission");

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Corporate Ethos"
        title="Our Mission: Architects of the Agent Economy"
        highlightedWord="Agent Economy"
          visualType="agentEconomyMission"
        description="GFF AI PTE LTD. is dedicated to engineering safe, sovereign agentic infrastructure to securely scale enterprise cognitive intelligence."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Why GFF AI", href: "/why-gff-ai" },
          { label: "Mission" }
        ]}
      />

      <NarrativeSection
        tag="MISSION STATEMENT"
        title="Guiding the Sovereign Integration of Enterprise Agents"
        paragraphs={[
          "As the global business ecosystem transitions toward an era of cognitive automation, GFF AI PTE LTD. (UEN 202621347N) stands as the primary institutional guardian of enterprise safety. Our mission is to architect resilient, cryptographically secure digital labour systems that align seamlessly with boardroom vision and risk frameworks.",
          "We believe that AI agents should not be isolated experiments. They must operate with absolute transparency, deterministic boundaries, and real-time human alignment. We provide the foundational infrastructure required to coordinate, scale, and secure these agents safely."
        ]}
        bullets={[
          { boldText: "Sovereign Frameworks", text: "Providing total protection over proprietary models, data paths, and system memories." },
          { boldText: "Ethical Supervision", text: "Implementing dual-tier guardrail protocols to guarantee auditability and safety." },
          { boldText: "Ecosystem Stability", text: "Fostering long-term stability using advanced reference architectures." }
        ]}
      />

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 py-12">
        <h2 className="text-[28px] sm:text-[36px] font-bold text-white tracking-tight mb-4 text-center">
          The Three Pillars of Our Mission
        </h2>
        <p className="text-[15px] text-white/60 text-center max-w-[700px] mx-auto mb-12 font-light">
          How we guide multi-national corporations and boards through the next paradigm of cognitive industrialization.
        </p>

        <BentoGrid>
          <BentoCard
            title="Safe Autonomy"
            description="Developing runtime isolation containers and cryptographic data boundaries to protect against prompt exploits, data leakage, and toxic outputs."
            badge="Security"
            icon={<Shield className="w-5 h-5 text-[#009DFF]" />}
            glowColor="blue"
          />
          <BentoCard
            title="Sovereign Control"
            description="Preserving complete ownership of model fine-tuning, training parameters, and transactional data boundaries in line with localized regulatory demands."
            badge="Compliance"
            icon={<Scale className="w-5 h-5 text-[#E4000F]" />}
            glowColor="red"
          />
          <BentoCard
            title="Operational Harmony"
            description="Connecting digital labour seamlessly with human managers through sophisticated human-in-the-loop validation dashboards and override metrics."
            badge="Synergy"
            icon={<Sparkles className="w-5 h-5 text-purple-400" />}
            glowColor="purple"
          />
        </BentoGrid>
      </div>

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 py-16 flex flex-col gap-16">
        <PremiumCTA
          title="Align Your Board with the Agent Economy"
          description="Speak with our leading systems engineers and strategy advisors in Singapore to co-author your custom sandbox blueprint."
        />

        <RelatedPagesGrid links={filteredLinks} />
      </div>
    </InnerPageShell>
  );
}