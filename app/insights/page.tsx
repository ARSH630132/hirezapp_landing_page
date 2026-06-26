"use client";

import React from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";

const INSIGHTS = [
  { t: "Sovereign Cognitive Networks & The Modern Boardroom", tag: "STRATEGIC INITIATIVE", h: "/resources/blog", d: "How executive directors navigate digital labor and model risk boundaries under emerging global regulations." },
  { t: "The 2026 Patterns of Intelligence Catalog", tag: "COGNITIVE ARCHETYPES", h: "/insights/patterns-of-intelligence", d: "A comprehensive guide to standardized enterprise intelligence patterns mapped to industrial challenges." },
  { t: "Autonomous Audit Verification Frameworks", tag: "COMPLIANCE & RISK", h: "/resources/case-studies", d: "Leveraging decentralized agent networks to execute verified continuous audits with sub-millisecond consistency." }
];

export default function InsightsHubPage() {
  return (
    <InnerPageShell>
      <InnerPageHero
        category="Thought Leadership"
        title="Executive Insights & Strategic Outlook"
        highlightedWord="Insights & Strategic Outlook"
        description="Strategic analysis, macroeconomic labor indexes, and alignment frameworks designed exclusively for C-suite leaders navigating autonomous agency."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Insights" }]}
      />

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-24">
        <h2 className="text-[20px] font-bold text-white uppercase tracking-wider mb-8 border-b border-white/5 pb-4">Featured Briefings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {INSIGHTS.map((ins) => (
            <a
              key={ins.t} href={ins.h}
              className="group rounded-[24px] border border-white/5 bg-[#050505]/40 p-6 flex flex-col justify-between hover:border-white/10 transition-all duration-300"
            >
              <div>
                <span className="text-[9px] font-mono text-[#009DFF] font-bold tracking-widest uppercase mb-4 block">{ins.tag}</span>
                <h3 className="text-[17px] sm:text-[19px] font-bold text-white tracking-tight mt-2 group-hover:text-[#009DFF] transition-all">{ins.t}</h3>
                <p className="mt-3 text-[13px] text-white/55 leading-relaxed font-light">{ins.d}</p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-white/30 font-mono uppercase tracking-wider">
                <span>Explore Briefing →</span>
                <span>VERIFIED READ</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-16">
        <PremiumCTA title="Scaffold Your Autonomous Sandbox" description="Connect with GFF strategists to build custom compliance-bound environments built for C-suite trials." />
      </div>
    </InnerPageShell>
  );
}