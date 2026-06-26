"use client";

import React, { useState } from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";

const PATTERNS = [
  { name: "The Multi-Tiered Verification Loop", role: "Audit & Risk Compliance", d: "Spawns three peer validators that must cross-check transaction parameters independently before signing off logs.", id: "p1" },
  { name: "The Cognitive Sentinel Buffer", role: "Real-Time System Security", d: "An isolation gate that monitors API call frequency and masks payload variables on-the-fly to secure compliance boundaries.", id: "p2" },
  { name: "The Recursive Horizon Predictor", role: "Strategic Forecasting & Planning", d: "Runs lightweight Monte Carlo simulations inside local subnets to optimize delivery networks without real-world latency risks.", id: "p3" }
];

export default function PatternsPage() {
  const [selected, setSelected] = useState<string>("p1");
  const detail = PATTERNS.find((p) => p.id === selected) || PATTERNS[0];

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Cognitive Frameworks"
        title="Patterns of Intelligence"
        highlightedWord="Patterns of Intelligence"
        description="Standardized, high-throughput multi-agent orchestration paradigms mapped directly to regulatory compliance challenges."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Resources", href: "/resources" }, { label: "Patterns of Intelligence" }]}
      />

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5 flex flex-col gap-3">
          <h3 className="text-[14px] font-mono uppercase text-white/40 tracking-wider mb-2">Architectural Patterns</h3>
          {PATTERNS.map((p) => (
            <button
              key={p.id} onClick={() => setSelected(p.id)}
              className={`w-full text-left p-5 rounded-[20px] border transition-all ${
                selected === p.id ? "bg-[#009DFF]/5 border-[#009DFF]/30 text-white" : "bg-[#050505]/30 border-white/5 text-white/60 hover:text-white"
              }`}
            >
              <span className="text-[9px] font-mono text-[#009DFF] uppercase font-bold tracking-wider">{p.role}</span>
              <h4 className="text-[15px] font-bold mt-1 tracking-tight">{p.name}</h4>
            </button>
          ))}
        </div>

        <div className="lg:col-span-7 rounded-[24px] border border-white/5 bg-[#030304] p-8 flex flex-col justify-between">
          <div>
            <span className="px-3 py-1 text-[10px] font-mono tracking-widest text-[#E4000F] border border-[#E4000F]/20 bg-[#E4000F]/5 rounded-full font-bold uppercase inline-block">
              ACTIVE COGNITIVE PARADIGM
            </span>
            <h2 className="text-[24px] sm:text-[30px] font-bold text-white tracking-tight mt-4 leading-snug">{detail.name}</h2>
            <p className="text-[11px] font-mono text-white/40 mt-1 uppercase tracking-wider">Applicable Field: {detail.role}</p>
            <p className="mt-4 text-[14px] leading-relaxed text-white/60 font-light">{detail.d}</p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap gap-6 items-center justify-between text-[11px] text-white/30 font-mono">
            <span>ALIGNMENT INDEX: 100% DETERMINISTIC</span>
            <span>VERIFIED BY: GFF SINGAPORE LABS</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-16">
        <PremiumCTA title="Integrate Cognitive Patterns" description="Speak with a systems analyst to map our proprietary intelligence patterns to your enterprise structure." />
      </div>
    </InnerPageShell>
  );
}