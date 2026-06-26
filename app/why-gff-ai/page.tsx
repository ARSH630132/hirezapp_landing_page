"use client";

import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import OperatingModelTimeline from "@/components/inner-pages/OperatingModelTimeline";
import NarrativeSection from "@/components/inner-pages/NarrativeSection";

export default function WhyGffAiPage() {
  return (
    <InnerPageShell>
      <InnerPageHero
        category="Operating Model"
        title="Why Choose GFF AI"
        highlightedWord="GFF AI"
        description="We bridge the gap between abstract AI research and real-world industrial scale with our proven Garage, Foundry, and Factory methodology."
      />
      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-12">
        <h2 className="text-center text-[28px] sm:text-[34px] font-bold text-white tracking-tight mb-8">
          The Three Pillars of Enterprise AI Scale
        </h2>
        <OperatingModelTimeline />
      </div>

      <NarrativeSection
        tag="PROVEN VELOCITY"
        title="Our Execution Speed is Unmatched"
        paragraphs={[
          "Enterprise AI initiatives often stall in the proof-of-concept phase. GFF AI ensures seamless transition through explicit staging.",
          "Our Garage phase validates engineering readiness within days, saving millions in misaligned infrastructure spending. The Foundry phase establishes cryptographic security and high-availability endpoints, while the Factory provides automated container scaling and sub-agent supervision."
        ]}
        bullets={[
          { boldText: "10x Faster POCs", text: "We deliver interactive architectural sandboxes in under 2 weeks." },
          { boldText: "Zero Trust Security", text: "SOC2 compliance, multi-layer sandboxing, and continuous auditing are baked in." },
          { boldText: "Production Scale", text: "Autonomous nodes operate 24/7 with auto-healing and dynamic provisioning." }
        ]}
      />
    </InnerPageShell>
  );
}