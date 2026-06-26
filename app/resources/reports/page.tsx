"use client";

import React, { useState } from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";

const REPORTS = [
  { id: "rep-labour", t: "Global Digital Labour Penetration Report", q: "Q4 2026", d: "Quantitative study of autonomous multi-agent systems displacing manual workflows in banking and financial compliance sectors." },
  { id: "rep-board", t: "Sovereign AI Board Readiness Index", q: "Q1 2026", d: "Evaluating C-suite compliance benchmarks and framework compatibility across EU, US, and ASEAN jurisdictions." }
];

export default function ReportsPage() {
  const [downloading, setDownloading] = useState<string | null>(null);

  const triggerDownload = (id: string) => {
    setDownloading(id);
    setTimeout(() => {
      setDownloading(null);
      alert("Executive report compiled and transmitted to your browser sandbox.");
    }, 1500);
  };

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Market Intelligence"
        title="Macroeconomic Reports & Indicators"
        highlightedWord="Reports & Indicators"
        description="Access institutional intelligence indices, digital labor penetration reports, and compliance readiness matrices."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Resources", href: "/resources" }, { label: "Reports" }]}
      />

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-24 grid grid-cols-1 md:grid-cols-2 gap-8">
        {REPORTS.map((rep) => (
          <div key={rep.id} className="rounded-[24px] border border-white/5 bg-[#050505]/40 p-6 flex flex-col justify-between hover:border-white/10 transition-all group">
            <div>
              <div className="flex justify-between items-center text-[10px] font-mono text-white/40 mb-4">
                <span>INDEX REPORT</span>
                <span>{rep.q}</span>
              </div>
              <h3 className="text-[17px] sm:text-[18px] font-bold text-white tracking-tight leading-snug">{rep.t}</h3>
              <p className="mt-3 text-[13px] text-white/50 leading-relaxed font-light">{rep.d}</p>
            </div>
            <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-[11px]">
              <span className="text-white/30 font-mono">CONFIDENTIAL EXECUTIVE LEVEL</span>
              <button onClick={() => triggerDownload(rep.id)} className="text-white hover:text-[#009DFF] font-bold uppercase tracking-wider text-[10px]">
                {downloading === rep.id ? "TRANSMITTING..." : "ACQUIRE REPORT →"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-16">
        <PremiumCTA title="Request Bespoke Sector Indexes" description="Schedule a private briefing with GFF analysts to compile a tailored macroeconomic impact index for your specific territory." />
      </div>
    </InnerPageShell>
  );
}