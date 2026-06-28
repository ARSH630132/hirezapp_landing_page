"use client";

import Link from "next/link";
import React, { useState, useMemo } from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";
import { downloadAssetLinks } from "@/lib/cta-links";

const PAPERS = [
  { t: "Dynamic Task Routing in Heuristic Multi-Agent Systems", c: "Orchestration", a: "GFF Research", y: "2026", d: "Mathematical formulation of state spaces, sub-agent spawning heuristics, and backpressure mitigation algorithms in transactional networks.", href: downloadAssetLinks.routing },
  { t: "Cryptographic Memory Isolation & Zero-Trust State Management", c: "Security", a: "Sovereignty Lab", y: "2026", d: "A protocol for ensuring PII token obfuscation, memory boundaries, and secure sandboxing across untrusted third-party APIs.", href: downloadAssetLinks.isolation },
  { t: "Horizontal Scaling and Latency Synchronisation of Shared Graph Caches", c: "Scale", a: "Infrastructure Group", y: "2025", d: "Empirical analysis of sub-millisecond graph synchronization across distributed cloud fabrics under high operational load.", href: downloadAssetLinks.graph }
];

export default function ResearchArchive() {
  const [search, setSearch] = useState("");
  const [downloading, setDownloading] = useState<Record<string, boolean>>({});

  const filtered = useMemo(() => {
    return PAPERS.filter((p) => p.t.toLowerCase().includes(search.toLowerCase()) || p.d.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  const handleDownload = (t: string) => {
    setDownloading(p => ({ ...p, [t]: true }));
    setTimeout(() => {
      setDownloading(p => ({ ...p, [t]: false }));
      alert(`Spec for "${t}" has been cryptographically packaged.`);
    }, 1200);
  };

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Academic Archive"
        title="Theoretical Research & Publications"
        highlightedWord="Research & Publications"
        description="Explore Peer-Reviewed Papers and Scientific Formulations Driving Secure Enterprise Multi-Agent Autonomy."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Resources", href: "/resources" }, { label: "Research" }]}
      />

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center border-b border-white/5 pb-6 mb-8">
            <h2 className="text-[18px] font-bold text-white uppercase tracking-wider">Publications Index</h2>
            <input
              type="text" placeholder="Search academic papers..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="bg-[#050505] border border-white/10 rounded-full px-4 py-1.5 text-[11.5px] text-white focus:outline-none focus:border-[#009DFF] w-full sm:w-[250px]"
            />
          </div>

          <div className="flex flex-col gap-6">
            {filtered.map((p) => (
              <div key={p.t} className="rounded-[20px] border border-white/5 bg-[#050505]/40 p-6 flex flex-col justify-between hover:border-white/10 transition-all">
                <div>
                  <div className="flex items-center justify-between text-[9px] font-mono text-white/40 mb-3">
                    <span className="text-[#009DFF] font-semibold uppercase">{p.c}</span>
                    <span>PUBLISHED: {p.y}</span>
                  </div>
                  <h3 className="text-[17px] font-bold text-white tracking-tight">{p.t}</h3>
                  <p className="text-[11px] font-mono text-white/30 mt-1">Authors: {p.a}</p>
                  <p className="mt-3 text-[13px] text-white/60 font-light leading-relaxed">{p.d}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-[11px]">
                  <span className="text-white/30 font-mono">FORMAT: ACADEMIC PDF</span>
                  <Link href={p.href} download onClick={() => handleDownload(p.t)} className="text-[#009DFF] font-bold uppercase tracking-wider text-[10px]">
                    {downloading[p.t] ? "Decrypting..." : "Download Preprint 🛡️"}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="rounded-[24px] border border-white/5 bg-[#030304] p-6">
            <h3 className="text-[14px] font-mono uppercase tracking-wider text-[#E4000F] font-bold mb-4">Scientific Focus</h3>
            <p className="text-[13px] text-white/60 font-light leading-relaxed">
              Our Singapore theoretical research group is dedicated to solving deterministic alignment problems under massive scale. We focus on state synchronization, zero-leakage vector borders, and algorithmic safety guarantees.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-16">
        <PremiumCTA title="Translate Research into Strategic Execution" description="Talk to a GFF engineering director about piloting our sandboxed multi-agent architectures." />
      </div>
    </InnerPageShell>
  );
}
