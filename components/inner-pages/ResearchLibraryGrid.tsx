"use client";

import React, { useState, useMemo } from "react";

const PAPERS = [
  {
    t: "GFF Heuristic Agent Orchestration Framework v1.4",
    cat: "Agentic AI",
    time: "12 min read",
    desc: "A reference guide outlining dynamic task routing, sub-agent spawning, and transactional isolation.",
    size: "2.4 MB PDF"
  },
  {
    t: "Zero-Trust Agentic Security: Multi-Layer Sandboxing",
    cat: "Security",
    time: "18 min read",
    desc: "Analysis of secure memory boundaries, PII token obfuscation, and runtime container isolation.",
    size: "4.1 MB PDF"
  },
  {
    t: "Horizontal Multi-Agent Scaling & Latency Benchmarks",
    cat: "Scalability",
    time: "15 min read",
    desc: "Empirical study on microsecond-level synchronization of shared graph databases and custom caches.",
    size: "1.8 MB PDF"
  },
  {
    t: "Ensuring System Alignment: Safety Loops & Audits",
    cat: "Security",
    time: "10 min read",
    desc: "Exploring Human-in-the-Loop execution patterns, validation logic fallback states, and compliance monitoring.",
    size: "3.2 MB PDF"
  }
];

export default function ResearchLibraryGrid() {
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");
  const [downloading, setDownloading] = useState<Record<string, boolean>>({});
  const [downloaded, setDownloaded] = useState<Record<string, boolean>>({});

  const filtered = useMemo(() => {
    return PAPERS.filter((p) => {
      const matchSearch = p.t.toLowerCase().includes(search.toLowerCase()) || p.desc.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCat === "All" || p.cat === selectedCat;
      return matchSearch && matchCat;
    });
  }, [search, selectedCat]);

  const handleDownload = (t: string) => {
    if (downloading[t]) return;
    setDownloading((p) => ({ ...p, [t]: true }));
    setTimeout(() => {
      setDownloading((p) => ({ ...p, [t]: false }));
      setDownloaded((p) => ({ ...p, [t]: true }));
      setTimeout(() => {
        setDownloaded((p) => ({ ...p, [t]: false }));
      }, 3000);
    }, 1200);
  };

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-white/5 pb-5">
        <div className="flex flex-wrap gap-1">
          {["All", "Agentic AI", "Security", "Scalability"].map((cat) => (
            <button
              key={cat} onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1.5 rounded-lg text-[10.5px] font-semibold tracking-wider transition-colors uppercase ${
                selectedCat === cat ? "bg-white text-black" : "bg-white/5 text-white/60 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-[250px]">
          <input
            type="text" placeholder="Search papers..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#050505] border border-white/10 rounded-full px-4 py-1.5 text-[11.5px] text-white focus:outline-none focus:border-[#009DFF]"
          />
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((paper) => (
            <div key={paper.t} className="rounded-[20px] border border-white/5 bg-[#050505]/60 backdrop-blur-[12px] p-5 flex flex-col justify-between group hover:border-white/12 transition-all">
              <div>
                <div className="flex items-center justify-between text-[9px] font-mono uppercase text-white/40 mb-3">
                  <span className="text-[#009DFF] font-semibold">{paper.cat}</span>
                  <span>{paper.time}</span>
                </div>
                <h3 className="text-[15.5px] font-semibold text-white tracking-tight group-hover:text-[#009DFF] transition-colors">{paper.t}</h3>
                <p className="mt-2 text-[12.5px] leading-[1.5] text-white/55 font-light">{paper.desc}</p>
              </div>

              <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-[11px]">
                <span className="text-white/40 font-mono text-[10px]">{paper.size}</span>
                <button onClick={() => handleDownload(paper.t)} className="flex items-center gap-1.5 text-white hover:text-[#009DFF] font-semibold text-[10.5px] uppercase">
                  {downloading[paper.t] ? (
                    <span className="animate-pulse text-[#009DFF]">Transmitting...</span>
                  ) : downloaded[paper.t] ? (
                    <span className="text-green-400 flex items-center gap-1 normal-case font-medium">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      Packed & Sent
                    </span>
                  ) : (
                    <>
                      <span>Download Spec</span>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-white/40 text-[12px]">No whitepapers match search parameters.</div>
      )}
    </div>
  );
}
