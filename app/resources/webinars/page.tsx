"use client";

import React, { useState } from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";

const WEBINARS = [
  { id: "w1", title: "Model Alignment under Cross-Border Sovereign Regulation", date: "COMING: OCT 14, 2026", desc: "A rigorous deep dive into keeping distributed multi-agent state containers compliant under dynamic EU & ASEAN cybersecurity framework changes." },
  { id: "w2", title: "Orchestration Safety: Structuring Zero-Halucinatory System Gates", date: "ARCHIVED: SEPT 2026", desc: "An architectural review showing how deterministic state structures restrict LLM boundaries for mission-critical operations." }
];

export default function WebinarsPage() {
  const [registered, setRegistered] = useState<Record<string, boolean>>({});

  const handleRegister = (id: string) => {
    setRegistered(p => ({ ...p, [id]: true }));
    setTimeout(() => {
      setRegistered(p => ({ ...p, [id]: false }));
      alert("Registration request secured and stored. Dynamic pass generated.");
    }, 1200);
  };

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Training & Education"
        title="Executive Webinars & Masterclasses"
        highlightedWord="Webinars & Masterclasses"
        visualType="executiveMasterclasses"
        description="Connect with lead systems engineers, compliance experts, and C-suite strategists to explore sovereign multi-agent deployment safety."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Resources", href: "/resources" }, { label: "Webinars" }]}
      />

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-24 grid grid-cols-1 md:grid-cols-2 gap-8">
        {WEBINARS.map((web) => (
          <div key={web.id} className="rounded-[24px] border border-white/5 bg-[#050505]/40 p-6 sm:p-8 flex flex-col justify-between hover:border-[#009DFF]/20 transition-all">
            <div>
              <span className="text-[10px] font-mono text-[#009DFF] tracking-wider uppercase">{web.date}</span>
              <h3 className="text-[18px] sm:text-[20px] font-bold text-white tracking-tight leading-snug mt-3">{web.title}</h3>
              <p className="mt-3 text-[13px] text-white/50 leading-relaxed font-light">{web.desc}</p>
            </div>
            <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-[11px] font-mono text-white/30 uppercase">Format: Interactive Workshop</span>
              <button onClick={() => handleRegister(web.id)} className="text-white hover:text-[#009DFF] font-bold uppercase tracking-wider text-[10px]">
                {registered[web.id] ? "SECURING PASS..." : "SECURE WEB PASS →"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-16">
        <PremiumCTA title="Request Custom Group Training Workshop" description="Schedule a private multi-agent masterclass session for your core software and executive board teams." />
      </div>
    </InnerPageShell>
  );
}