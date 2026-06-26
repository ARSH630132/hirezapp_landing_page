"use client";

import React from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";

const POSTS = [
  { t: "The Architecture of Sovereign Memory: Isolation in High-Throughput Agent Networks", c: "SOVEREIGNTY", r: "8 min read", d: "How physical memory isolation protocols prevent data leakage and align runtime parameters under dynamic international law." },
  { t: "Deterministic Multi-Agent Execution: Replacing Probabilistic Hallucinations with Finite Logic Gate Fallbacks", c: "ALIGNMENT", r: "11 min read", d: "Exploring GFF's dual-loop validation framework which enforces human control boundaries over autonomous micro-transactions." }
];

export default function BlogHubPage() {
  return (
    <InnerPageShell>
      <InnerPageHero
        category="Editorial Publications"
        title="Sovereign Perspectives & Essays"
        highlightedWord="Sovereign Perspectives"
        description="Strategic analysis, philosophical alignment paradigms, and technical insights from the GFF editorial board."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Resources", href: "/resources" }, { label: "Blog" }]}
      />

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-24">
        <h2 className="text-[20px] font-bold text-white uppercase tracking-wider mb-8 border-b border-white/5 pb-4">Latest Editorial Essays</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {POSTS.map((post) => (
            <div key={post.t} className="rounded-[24px] border border-white/5 bg-[#050505]/40 p-6 sm:p-8 flex flex-col justify-between hover:border-white/10 transition-all duration-300">
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-white/40 mb-4">
                  <span className="text-[#009DFF] font-bold uppercase">{post.c}</span>
                  <span>{post.r}</span>
                </div>
                <h3 className="text-[19px] sm:text-[22px] font-bold text-white tracking-tight leading-snug">{post.t}</h3>
                <p className="mt-4 text-[14px] text-white/55 leading-relaxed font-light">{post.d}</p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-white/30 font-mono">
                <span>By GFF Editorial Board</span>
                <span className="text-[#009DFF] font-bold cursor-pointer hover:text-white transition-colors">Read Essay →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-16">
        <PremiumCTA title="Looking to Author with Us?" description="Reach out to the GFF Research Syndicate to pitch peer-reviewed collaborative publications." />
      </div>
    </InnerPageShell>
  );
}