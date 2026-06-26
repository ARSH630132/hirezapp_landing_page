"use client";

import React, { useState, useMemo } from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";

const STUDIES = [
  { title: "Securing Multi-Agent State Synchronization in Global Audit Frameworks", sector: "Audit", outcome: "99.99% Consistency Rate", d: "A detailed analysis of deploying transactional multi-agent routines within multi-national audit structures under zero-trust guidelines." },
  { title: "Sovereign Risk Mitigation and Compliance in Energy Markets", sector: "Energy", outcome: "Zero Data Leakage Across Borders", d: "How sandboxed cognitive layers allow sovereign states to operate autonomous grid-intelligence networks while enforcing cross-border compliance." },
  { title: "Accelerating Advisory Board Reporting with High-Throughput Memory Structures", sector: "Advisory", outcome: "Sub-15ms Reporting Latency", d: "Demonstrating the power of hierarchical agent systems to gather, filter, and verify sovereign advisory board indicators safely." }
];

export default function CaseStudiesPage() {
  const [sector, setSector] = useState("All");

  const filtered = useMemo(() => {
    return sector === "All" ? STUDIES : STUDIES.filter(s => s.sector === sector);
  }, [sector]);

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Operational Proofs"
        title="Enterprise Case Studies"
        highlightedWord="Case Studies"
        description="Explore detailed analysis of verified multi-agent integrations across audit, finance, advisory, and energy sectors."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Resources", href: "/resources" }, { label: "Case Studies" }]}
      />

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-24">
        <div className="flex flex-wrap gap-2 mb-10 border-b border-white/5 pb-6">
          {["All", "Audit", "Energy", "Advisory"].map((sec) => (
            <button
              key={sec} onClick={() => setSector(sec)}
              className={`px-4 py-1.5 rounded-full text-[10.5px] font-semibold tracking-wider transition-all uppercase ${
                sector === sec ? "bg-white text-black" : "bg-white/5 text-white/60 hover:text-white"
              }`}
            >
              {sec}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map((s) => (
            <div key={s.title} className="rounded-[24px] border border-white/5 bg-[#050505]/40 p-6 sm:p-8 flex flex-col justify-between hover:border-[#009DFF]/20 transition-all">
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-white/40 mb-4">
                  <span className="text-[#E4000F] font-bold uppercase">{s.sector} SECTOR</span>
                  <span className="text-green-400 font-semibold">{s.outcome}</span>
                </div>
                <h3 className="text-[18px] sm:text-[20px] font-bold text-white tracking-tight leading-snug">{s.title}</h3>
                <p className="mt-4 text-[13px] text-white/60 leading-relaxed font-light">{s.d}</p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/5 text-[11px] font-mono text-white/30 uppercase tracking-widest">
                Outcome Verified & Signed by GFF Security Labs
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-16">
        <PremiumCTA title="Ready to Achieve Sovereign Outcomes?" description="Initiate a scoping session to draft your enterprise's custom cognitive success blueprint." />
      </div>
    </InnerPageShell>
  );
}