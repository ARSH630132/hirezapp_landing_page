"use client";

import React, { useState } from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";

const WHITEPAPERS = [
  { t: "GFF Heuristic Agent Orchestration Framework v1.4", c: "Core Systems", d: "A comprehensive developer guide outlining runtime task dispatchers, dynamic container lifecycle management, and execution buffers.", id: "wp-orch" },
  { t: "Zero-Trust Agentic Security: Multi-Layer Sandboxing Protocols", c: "Security", d: "Analysis of strict network boundary separation, on-the-fly encrypted payload mapping, and real-time state verification.", id: "wp-sec" },
  { t: "Horizontal Scaling & Memory Consistency Metrics", c: "Scalability", d: "Deep analysis of sub-15ms sync algorithms for distributed C-suite graph systems and redundant cached pools.", id: "wp-scale" }
];

export default function WhitepapersPage() {
  const [downloading, setDownloading] = useState<string | null>(null);

  const triggerDownload = (id: string) => {
    setDownloading(id);
    setTimeout(() => {
      setDownloading(null);
      alert("Specification document packed and transmitted securely.");
    }, 1500);
  };

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Technical Specs"
        title="Engineering Whitepapers"
        highlightedWord="Engineering Whitepapers"
        description="Detailed framework whitepapers and system specifications. Read our core design paradigms for safe model orchestrations."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Resources", href: "/resources" }, { label: "Whitepapers" }]}
      />

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {WHITEPAPERS.map((wp) => (
            <div key={wp.id} className="rounded-[24px] border border-white/5 bg-[#050505]/40 p-6 flex flex-col justify-between hover:border-white/10 transition-all group">
              <div>
                <span className="text-[10px] font-mono text-[#009DFF] tracking-wider uppercase">{wp.c}</span>
                <h3 className="text-[18px] font-bold text-white tracking-tight mt-2 group-hover:text-[#009DFF] transition-colors">{wp.t}</h3>
                <p className="mt-4 text-[13px] text-white/50 leading-relaxed font-light">{wp.d}</p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-[11px]">
                <span className="font-mono text-white/30">SYSTEM SPECS v1.4</span>
                <button onClick={() => triggerDownload(wp.id)} className="text-white hover:text-[#009DFF] font-bold uppercase tracking-wider text-[10px]">
                  {downloading === wp.id ? "TRANSMITTING..." : "GET SPECIFICATION →"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-16">
        <PremiumCTA title="Ready to Discuss Framework Compliance?" description="Request a walkthrough of the GFF Heuristic Agent Orchestration framework with a security architect." />
      </div>
    </InnerPageShell>
  );
}