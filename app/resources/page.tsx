"use client";
import Link from "next/link";
import React, { useState, useMemo } from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";
import { CATS } from "@/components/inner-pages/resources-data";

export default function ResourcesPage() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return CATS.filter((c) => {
      const matchFilter = filter === "All" || c.m === filter;
      const matchSearch = c.t.toLowerCase().includes(search.toLowerCase()) || c.d.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [filter, search]);

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Knowledge Vault"
        title="Research & Intelligence Library"
        highlightedWord="Research & Intelligence"
        visualType= "research"
        description="Access institutional-grade insights, academic breakthroughs, reference architectures, and standardized cognitive paradigms engineered for sovereign enterprises."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Resources" }]}
      />

      {/* Grid Directory */}
      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 py-12">
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between border-b border-white/5 pb-8 mb-10">
          <div>
            <h2 className="text-[24px] sm:text-[32px] font-bold text-white tracking-tight">Enterprise Knowledge Domains</h2>
            <p className="text-[13px] text-white/50 mt-1 font-light">Filter and search to explore relevant assets.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center w-full lg:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-[240px]">
              <input
                type="text"
                placeholder="Search directories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full py-1.5 pl-9 pr-8 text-[11.5px] text-white placeholder-white/40 focus:outline-none focus:border-[#009DFF]/60 focus:bg-white/10 transition-all font-light"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                  aria-label="Clear search"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2 items-center">
              {["All", "Tech", "Exec", "Media", "Corp"].map((m) => (
                <button
                  key={m} onClick={() => setFilter(m)}
                  className={`px-3 py-1.5 rounded-full text-[10.5px] font-semibold tracking-wider transition-all uppercase ${
                    filter === m ? "bg-white text-black shadow-lg" : "bg-white/5 text-white/60 hover:text-white border border-white/5"
                  }`}
                >
                  {m === "Tech" ? "Technical" : m === "Exec" ? "Executive" : m === "Media" ? "Multimedia" : m === "Corp" ? "Corporate" : "All"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
       {filtered.map((cat) => (
  <Link
    key={cat.s}
    href={cat.h}
    className="group relative rounded-[24px] border border-white/5 bg-[#050505]/40 backdrop-blur-[8px] p-6 flex flex-col justify-between hover:border-white/12 transition-all duration-300 cursor-pointer block"
  >
              <div>
                <div className="flex items-center justify-between text-[9px] font-mono uppercase text-white/40 mb-4">
                  <span className="text-[#009DFF] font-bold tracking-widest">{cat.tg}</span>
                </div>
                <h3 className="text-[18px] sm:text-[20px] font-bold text-white tracking-tight group-hover:text-[#009DFF] transition-colors flex items-center justify-between gap-3">
                  <span>{cat.t}</span>
                  <svg className="w-4 h-4 text-white/30 group-hover:text-white group-hover:translate-x-1.5 transition-all duration-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </h3>
                <p className="mt-3 text-[13px] leading-[1.55] text-white/55 font-light">{cat.d}</p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-end text-[11px] text-white/40">
                {/* <span className="font-mono text-[9px] uppercase tracking-wider group-hover:text-white/60 transition-colors">Access Directory →</span> */}
             
<span className="text-white/30 group-hover:text-white transition-colors">
  VERIFIED PREVIEW
</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 py-12">
        <PremiumCTA
          title="Looking for Specific Reference Blueprints?"
          description="Schedule a technical deep dive with our lead architects to configure custom sandbox environments aligned with your sector's regulatory standards."
        />
      </div>
    </InnerPageShell>
  );
}