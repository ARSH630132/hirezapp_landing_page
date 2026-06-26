"use client";

import React, { useState, useMemo } from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";

const EVENTS = [
  { title: "Sovereign AI Summit 2026", loc: "Singapore", date: "NOV 11-12, 2026", d: "Our flagship physical summit bringing together compliance officers, institutional investors, and sovereign systems architects at our main Singapore hub." },
  { title: "Distributed Orchestration Roundtable", loc: "London", date: "DEC 04, 2026", d: "A private, Chatham House rules dinner discussion focusing on cryptographic sandboxing and inter-agent isolation boundaries." },
  { title: "Cognitive Scale Hackathon", loc: "India", date: "FEB 18-20, 2027", d: "A high-intensity developer hackathon in Bengaluru focused on building ultra-low-latency, auto-healing agentic clusters." }
];

export default function EventsPage() {
  const [selectedLoc, setSelectedLoc] = useState("All");

  const filtered = useMemo(() => {
    return selectedLoc === "All" ? EVENTS : EVENTS.filter(e => e.loc === selectedLoc);
  }, [selectedLoc]);

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Global Footprint"
        title="Physical Summits & Executive Roundtables"
        highlightedWord="Physical Summits"
        description="GFF AI connects systems engineers, developers, and C-suite leaders globally. Explore upcoming summits, developer workshops, and private Chatham House dinners."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Resources", href: "/resources" }, { label: "Events" }]}
      />

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-24">
        <div className="flex flex-wrap gap-2 mb-10 border-b border-white/5 pb-6">
          {["All", "Singapore", "London", "India"].map((loc) => (
            <button
              key={loc} onClick={() => setSelectedLoc(loc)}
              className={`px-4 py-1.5 rounded-full text-[10.5px] font-semibold tracking-wider transition-all uppercase ${
                selectedLoc === loc ? "bg-white text-black shadow-lg" : "bg-white/5 text-white/60 hover:text-white"
              }`}
            >
              {loc}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((e) => (
            <div key={e.title} className="rounded-[24px] border border-white/5 bg-[#050505]/40 p-6 flex flex-col justify-between hover:border-white/10 transition-all duration-300">
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-white/40 mb-4">
                  <span className="text-[#E4000F] font-bold uppercase">{e.loc}</span>
                  <span>{e.date}</span>
                </div>
                <h3 className="text-[17px] sm:text-[19px] font-bold text-white tracking-tight leading-snug">{e.title}</h3>
                <p className="mt-3 text-[13px] text-white/50 leading-relaxed font-light">{e.d}</p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-[#009DFF] font-mono uppercase tracking-wider">
                <span>Request invitation →</span>
                <span>SECURED EVENT</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-16">
        <PremiumCTA title="Request Executive Delegate Access" description="Connect with our global relations team to request a reserved invitation to GFF physical summits or roundtables." />
      </div>
    </InnerPageShell>
  );
}