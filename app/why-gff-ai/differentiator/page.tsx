"use client";

import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import { BentoGrid, BentoCard } from "@/components/inner-pages/BentoGrid";
import NarrativeSection from "@/components/inner-pages/NarrativeSection";
import ResearchLibraryGrid from "@/components/inner-pages/ResearchLibraryGrid";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";
import RelatedPagesGrid from "@/components/inner-pages/RelatedPagesGrid";
import { Award, BarChart, CheckSquare } from "lucide-react";

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
    title: "Operating Model",
    tag: "EXECUTION",
    desc: "From architectural blueprinting to horizontal multi-agent scaling.",
    href: "/why-gff-ai/operating-model"
  },
  {
    title: "Technology Philosophy",
    tag: "ARCHITECTURE",
    desc: "Discover GFF AI Reference Architecture, built for cryptographic safety.",
    href: "/why-gff-ai/technology-philosophy"
  }
];

export default function DifferentiatorPage() {
  const filteredLinks = RELATED_PAGES.filter(p => p.href !== "/why-gff-ai/differentiator");

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Proprietary IP"
        title="Our Differentiator & Research Division"
        highlightedWord="Differentiator"
        visualType="coreDifferentiator"
        description="GFF AI PTE LTD. goes beyond general-purpose tools to engineer quantitative benchmarks and sovereign reference architectures."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Why GFF AI", href: "/why-gff-ai" },
          { label: "Differentiator" }
        ]}
      />

      <NarrativeSection
        tag="QUANTITATIVE RIGOUR"
        title="Sovereign Governance backed by Elite Research"
        paragraphs={[
          "Enterprise boards cannot afford to rely on speculative tech hype. At GFF AI PTE LTD. (UEN 202621347N), we distinguish ourselves by delivering rigorous academic foundations and quantitative measurements to guide the rollout of autonomous agents.",
          "Our GFF AI Research Division publishes three core indices to help enterprise directors evaluate and scale digital labour securely. We bridge the gap between financial governance and physical computing infrastructure."
        ]}
        bullets={[
          { boldText: "Agentic GDP Index", text: "Measures overall financial throughput driven and processed entirely by cognitive agents." },
          { boldText: "Digital Labour Penetration", text: "Tracks the ratio of automated end-to-end task flows vs. legacy human workflows." },
          { boldText: "Board Readiness Index", text: "Analyzes system architecture and security boundaries against global compliance mandates." }
        ]}
      />

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 py-12">
        <h2 className="text-[28px] sm:text-[36px] font-bold text-white tracking-tight mb-4 text-center">
          Our Three Proprietary Corporate Indices
        </h2>
        <p className="text-[15px] text-white/60 text-center max-w-[700px] mx-auto mb-12 font-light">
          Proprietary quantitative tools designed by the GFF AI Research Division.
        </p>

        <BentoGrid>
          <BentoCard
            title="Agentic GDP Index"
            description="Evaluating the percentage of corporate revenue and transactional volume routed through autonomous agent pipelines."
            badge="Index 01"
            icon={<Award className="w-5 h-5 text-[#009DFF]" />}
            glowColor="blue"
          />
          <BentoCard
            title="Digital Labour Penetration Score"
            description="Tracking operational task velocity and data processing efficiency to benchmark automation ratios against global averages."
            badge="Index 02"
            icon={<BarChart className="w-5 h-5 text-[#E4000F]" />}
            glowColor="red"
          />
          <BentoCard
            title="AI Board Readiness Index"
            description="Evaluating board alignment, cybersecurity boundaries, disaster recovery, and model failovers to guarantee compliance."
            badge="Index 03"
            icon={<CheckSquare className="w-5 h-5 text-purple-400" />}
            glowColor="purple"
          />
        </BentoGrid>
      </div>

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 py-12">
        <h2 className="text-[28px] sm:text-[34px] font-bold text-white tracking-tight mb-4">
          Publications & Whitepaper Library
        </h2>
        <p className="text-[15px] text-white/60 max-w-[700px] mb-8 font-light">
          Download our technical research papers and architectural specifications.
        </p>

        <ResearchLibraryGrid />
      </div>

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 py-16 flex flex-col gap-16">
        <PremiumCTA
          title="Elevate Your Corporate Governance"
          description="Schedule a technical deep-dive with our quantitative research division to audit and evaluate your organization."
        />

        <RelatedPagesGrid links={filteredLinks} />
      </div>
    </InnerPageShell>
  );
}