"use client";

import React, { useState } from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";
import AnimatedBackgroundGrid from "@/components/inner-pages/AnimatedBackgroundGrid";
import { TrendingUp, Globe, Shield } from "lucide-react";

export default function InvestorRelationsPage() {
  const [active, setActive] = useState<"milestones" | "strategy">("milestones");

  return (
    <InnerPageShell>
      <div className="relative overflow-hidden min-h-screen pb-16">
        <AnimatedBackgroundGrid />
        
        <InnerPageHero
          category="Financial Operations"
          title="Investor Relations Pathway"
          highlightedWord="Investor"
          description="Access GFF AI's institutional milestones, strategic corporate phases, and capital-efficient enterprise growth trajectories."
        />

        <div className="max-w-[1200px] mx-auto px-6 lg:px-16 pb-24 space-y-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 rounded-[24px] border border-white/5 bg-[#050505]/60 backdrop-blur-[12px]">
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center gap-2 text-[#009DFF] text-[10px] font-mono uppercase font-bold">
                <TrendingUp className="w-3.5 h-3.5" /> High-Yield Cognitive Assets
              </div>
              <h2 className="text-[20px] font-semibold text-white tracking-tight">Capital-Efficient Cognitive Infrastructure</h2>
              <p className="text-white/70 text-[13px] font-light">
                GFF AI addresses the orchestration gap with high-performance, productized cognitive assets. By separating cloud compute from logical structures, we maintain high margins.
              </p>
            </div>
            <div className="lg:col-span-4 p-4 rounded-xl border border-white/5 bg-black/40 flex flex-col gap-2">
              <div className="flex justify-between text-[11px] font-mono text-white/40">
                <span>DIRECT ASSETS</span>
                <span className="text-[#009DFF]">100% PROPRIETARY</span>
              </div>
              <div className="h-[2px] w-full bg-white/5 rounded">
                <div className="h-full w-[80%] bg-gradient-to-r from-[#E4000F] to-[#009DFF]" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-center gap-4 border-b border-white/5 pb-2">
              {["milestones", "strategy"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActive(tab as any)}
                  className={`px-4 py-2 text-[12px] font-mono uppercase tracking-wider transition-all border-b-2 ${
                    active === tab ? "text-white border-[#009DFF]" : "text-white/40 border-transparent hover:text-white"
                  }`}
                >
                  {tab === "milestones" ? "Corporate Milestones" : "Investment Strategy"}
                </button>
              ))}
            </div>

            {active === "milestones" ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { n: "I", t: "Core Incubation", d: "Constructing zero-trust enclaves and multi-agent DAG architectures." },
                  { n: "II", t: "Enterprise Scaling", d: "Capturing recurring SLA-backed allocations in logistics and banking." },
                  { n: "III", t: "Sovereign Hubs", d: "Deploying localized regional model clusters to lock geographic regulatory nodes." }
                ].map((p, idx) => (
                  <div key={idx} className="p-6 rounded-[24px] border border-white/5 bg-gradient-to-b from-[#08080a] to-[#010101] relative overflow-hidden">
                    <span className="absolute top-4 right-4 text-[38px] font-mono font-bold leading-none text-white/5">{p.n}</span>
                    <h4 className="text-[14px] font-semibold text-white tracking-tight mt-2">{p.t}</h4>
                    <p className="mt-2 text-[12px] text-white/50 font-light leading-relaxed">{p.d}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-[24px] border border-white/5 bg-[#050505]/40 backdrop-blur-[12px] space-y-2">
                  <Globe className="w-6 h-6 text-[#009DFF]" />
                  <h4 className="text-[15px] font-semibold text-white">Bilateral Stability</h4>
                  <p className="text-[12.5px] text-white/60 font-light">We leverage regional localized models conforming fully with sovereign laws to capture geographically locked markets.</p>
                </div>
                <div className="p-6 rounded-[24px] border border-white/5 bg-[#050505]/40 backdrop-blur-[12px] space-y-2">
                  <Shield className="w-6 h-6 text-[#E4000F]" />
                  <h4 className="text-[15px] font-semibold text-white">Sovereign Cloud Alliances</h4>
                  <p className="text-[12.5px] text-white/60 font-light">By orchestrating on national cloud complexes, we offer hardware decoupling, maximizing our corporate margin structure.</p>
                </div>
              </div>
            )}
          </div>

          <PremiumCTA
            title="Interested in GFF AI's Corporate Governance?"
            description="Strategic allocators and partners may request an operational review with high discretion."
            primaryLabel="Connect with IR Desk"
            primaryHref="mailto:investors@gff.ai"
            secondaryLabel="Review Privacy Framework"
            secondaryHref="/privacy"
          />
        </div>
      </div>
    </InnerPageShell>
  );
}
