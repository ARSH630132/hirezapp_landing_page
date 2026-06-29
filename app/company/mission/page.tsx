"use client";

import React from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import CompanyNavigation from "@/components/inner-pages/CompanyNavigation";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";
import { ShieldAlert, Compass, Eye, Heart } from "lucide-react";

export default function CompanyMissionPage() {
  const values = [
    {
      title: "Rigorous Safety",
      icon: <ShieldAlert className="w-5 h-5 text-[#E4000F]" />,
      desc: "Every autonomous agent must execute within strict deterministic boundaries. Zero tolerance for unverified network commands.",
    },
    {
      title: "Heuristic Efficiency",
      icon: <Compass className="w-5 h-5 text-[#009DFF]" />,
      desc: "No bloated architectures where light, optimized, and deterministic rules can accurately resolve tasks. We value elegant performance.",
    },
    {
      title: "Absolute Transparency",
      icon: <Eye className="w-5 h-5 text-emerald-400" />,
      desc: "Token consumption, execution states, and audit trails are fully inspectable. Integrity is embedded in every state machine.",
    },
  ];

  return (
    <InnerPageShell>
      <CompanyNavigation />
      <InnerPageHero
        category="Our Core Mission"
        title="Engineering Trust for the Autonomous Era"
        highlightedWord="Autonomous"
        visualType="mission"
        description="We believe agentic networks will drive the next industrial revolution. Our mission is to provide the trust infrastructure, safety bounds, and scale protocols required to run them."
      />

      {/* Narrative Editorial Section */}
      <section className="relative w-full px-6 lg:px-16 pb-16">
        <div className="max-w-[1200px] mx-auto space-y-8">
          <div className="p-8 rounded-[24px] border border-white/5 bg-[#050505]/60 backdrop-blur-[12px] space-y-4">
            <h2 className="text-[20px] font-semibold text-white tracking-tight flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#E4000F]" />
              <span>The Agent Economy Charter</span>
            </h2>
            <p className="text-white/70 leading-[1.7] text-[14.5px] font-light font-sans">
              As the Architects of the Agent Economy, GFF AI was founded on the conviction that intelligence must not be black-box chaos. To operate at enterprise scale, autonomous agents require deterministic constraints, absolute auditable state transitions, and high-throughput execution tracks.
            </p>
            <p className="text-white/70 leading-[1.7] text-[14.5px] font-light font-sans">
              Our engineering philosophy is forged from the discipline of industrial automation—where safety margins are non-negotiable, and sub-millisecond reliability is the baseline expectation. We don't just build agents; we build the pipelines that make them trusted assets.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values System */}
      <section className="relative w-full px-6 lg:px-16 pb-16 border-t border-white/5 pt-16">
        <div className="max-w-[1795px] mx-auto">
          <div className="text-center max-w-[800px] mx-auto mb-12">
            {/* <span className="text-[10px] font-mono tracking-[0.2em] text-[#009DFF] uppercase font-bold">Inviolable Pillars</span> */}
            <h2 className="text-[28px] sm:text-[34px] font-bold text-white tracking-tight mt-2">Our Operating Core</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((val) => (
              <div key={val.title} className="p-6 rounded-[20px] border border-white/5 bg-[#030304]/40 hover:border-[#E4000F]/20 transition-all">
                <div className="w-9 h-9 rounded-lg bg-white/[0.02] border border-white/10 flex items-center justify-center mb-4">{val.icon}</div>
                <h3 className="text-[17px] font-semibold text-white tracking-tight">{val.title}</h3>
                <p className="mt-3 text-[13px] leading-[1.6] text-white/60 font-light font-sans">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium CTA */}
      <section className="relative w-full px-6 lg:px-16 pb-16">
        <div className="max-w-[1795px] mx-auto">
          <PremiumCTA
            title="Adopt an Auditable Framework"
            description="Explore our blueprint structures designed to support absolute safety and compliance from day one."
            primaryLabel="Review Safety Specs"
            secondaryLabel="Meet Leadership"
            secondaryHref="/company/leadership"
          />
        </div>
      </section>
    </InnerPageShell>
  );
}
