"use client";

import React, { useState, useMemo } from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";

const ARTICLES = [
  { t: "GFF AI Secures Sovereign Compliance Milestones in Singapore Hub", c: "CORPORATE", d: "Announcing successful completion of comprehensive multi-layer sandboxing compliance trials under ASEAN security guidelines." },
  { t: "Engineering Breakthrough: mTLS Handshake Latency Reduced Below 1ms", c: "ENGINEERING", d: "Our distributed cache synchronization group reduces peer-to-peer verification loops to sub-millisecond intervals." }
];

export default function NewsroomPage() {
  const [filter, setFilter] = useState("All");

  const filtered = useMemo(() => {
    return filter === "All" ? ARTICLES : ARTICLES.filter(a => a.c === filter);
  }, [filter]);

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Press Office"
        title="Official GFF AI Corporate Newsroom"
        highlightedWord="Corporate Newsroom"
        description="Official press announcements, technological achievements, and global corporate reports published by the GFF communication committee."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Resources", href: "/resources" }, { label: "Newsroom" }]}
      />

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-24">
        <div className="flex flex-wrap gap-2 mb-10 border-b border-white/5 pb-6">
          {["All", "CORPORATE", "ENGINEERING"].map((cat) => (
            <button
              key={cat} onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-[10.5px] font-semibold tracking-wider transition-all uppercase ${
                filter === cat ? "bg-white text-black shadow-lg" : "bg-white/5 text-white/60 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map((art) => (
            <div key={art.t} className="rounded-[24px] border border-white/5 bg-[#050505]/40 p-6 sm:p-8 flex flex-col justify-between hover:border-white/10 transition-all duration-300">
              <div>
                <span className="text-[9px] font-mono text-[#E4000F] font-bold tracking-widest uppercase mb-4 block">{art.c}</span>
                <h3 className="text-[18px] sm:text-[20px] font-bold text-white tracking-tight leading-snug">{art.t}</h3>
                <p className="mt-3 text-[13px] text-white/50 leading-relaxed font-light">{art.d}</p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/5 text-[11px] text-white/30 font-mono">
                PUBLISHED BY GFF PTE. LTD. • SINGAPORE HQ
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-16">
        <PremiumCTA title="Connect with Our Press Office" description="Reach out to GFF media relations for certified corporate materials, spokespersons queries, or executive interviews." />
      </div>
    </InnerPageShell>
  );
}