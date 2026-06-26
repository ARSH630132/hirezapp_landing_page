"use client";

import React, { useState } from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";

const LAYERS = {
  garage: {
    t: "Layer I: Secure Garage Sandbox",
    tg: "COGNITIVE ISOLATION",
    d: "Resilient trial loops under strict isolation, with no outer communication allowed.",
    s: ["Local SQLite/Vector Sandboxing", "Strict PII Masking", "Single-Agent Safety Loops"]
  },
  foundry: {
    t: "Layer II: Foundry Orchestrator",
    tg: "INTER-AGENT ORCHESTRATION",
    d: "Spawns sub-agents dynamically with secure multi-agent communication handshake loops.",
    s: ["Dynamic Sub-Agent Spawning", "Mutual TLS Handshakes", "Synchronous Graph Caching"]
  },
  factory: {
    t: "Layer III: Factory Sovereign Scale",
    tg: "SOVEREIGN PRODUCTION SCALING",
    d: "Hundreds of autonomous loops executing C-suite strategies with auto-healing code pipelines.",
    s: ["Auto-Healing Runtimes", "High-Throughput Dispatchers", "AES-256 Memory Logs"]
  }
};

type Key = keyof typeof LAYERS;

export default function ArchitectureLibraryPage() {
  const [sel, setSel] = useState<Key>("garage");

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Technical Blueprint"
        title="Reference Architecture Library"
        highlightedWord="Reference Architecture"
        description="Explore GFF AI's triple-layer sovereign runtime architecture. Interact with the schema below to review engineering boundaries."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Resources", href: "/resources" }, { label: "Architecture" }]}
      />

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="w-full max-w-[480px] aspect-square rounded-[32px] border border-white/5 bg-[#030304] p-8 relative flex flex-col justify-between overflow-hidden">
            <div className="absolute inset-0 bg-radial-gradient(circle 200px at 50% 50%, rgba(0,157,255,0.03), transparent 80%) pointer-events-none" />
            
            <div className="flex justify-between items-center text-[10px] font-mono text-white/40 uppercase">
              <span>SYSTEM STATE: ACTIVE</span>
              <span className="text-[#009DFF] font-bold">INTERACTIVE SPEC</span>
            </div>

            <svg className="w-full h-[180px] my-6" viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g onClick={() => setSel("garage")} className="cursor-pointer">
                <rect x="40" y="40" width="320" height="40" rx="8" fill={sel === "garage" ? "rgba(0,157,255,0.08)" : "transparent"} stroke={sel === "garage" ? "#009DFF" : "rgba(255,255,255,0.2)"} strokeWidth="1.5" />
                <text x="60" y="64" fill="white" fontSize="10" fontFamily="monospace">LAYER 1: GARAGE COGNITIVE SANDBOX</text>
              </g>
              <g onClick={() => setSel("foundry")} className="cursor-pointer">
                <rect x="40" y="100" width="320" height="40" rx="8" fill={sel === "foundry" ? "rgba(228,0,15,0.08)" : "transparent"} stroke={sel === "foundry" ? "#E4000F" : "rgba(255,255,255,0.2)"} strokeWidth="1.5" />
                <text x="60" y="124" fill="white" fontSize="10" fontFamily="monospace">LAYER 2: FOUNDRY ORCHESTRATOR</text>
              </g>
              <g onClick={() => setSel("factory")} className="cursor-pointer">
                <rect x="40" y="160" width="320" height="40" rx="8" fill={sel === "factory" ? "rgba(0,157,255,0.08)" : "transparent"} stroke={sel === "factory" ? "#009DFF" : "rgba(255,255,255,0.2)"} strokeWidth="1.5" />
                <text x="60" y="184" fill="white" fontSize="10" fontFamily="monospace">LAYER 3: FACTORY SOVEREIGN SCALE</text>
              </g>
            </svg>

            <div className="text-center text-[10px] font-mono text-white/30 uppercase">
              Click elements inside schema to inspect specifics
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 flex flex-col justify-center">
          <span className="text-[10px] font-mono tracking-widest text-[#E4000F] font-bold uppercase">{LAYERS[sel].tg}</span>
          <h2 className="text-[26px] sm:text-[32px] font-bold text-white tracking-tight mt-2">{LAYERS[sel].t}</h2>
          <p className="mt-4 text-[14px] leading-relaxed text-white/60 font-light">{LAYERS[sel].d}</p>
          
          <div className="mt-8 border-t border-white/5 pt-6">
            <h4 className="text-[11px] font-mono text-white/40 uppercase tracking-widest mb-4">Core Boundary Properties</h4>
            <div className="flex flex-col gap-3">
              {LAYERS[sel].s.map((spec) => (
                <div key={spec} className="flex items-center gap-3 text-[13px] text-white/80 font-mono">
                  <svg className="w-4 h-4 text-[#009DFF] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{spec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-16">
        <PremiumCTA title="Review Custom Network Configurations" description="Schedule a private workshop to detail custom multi-agent network boundaries." />
      </div>
    </InnerPageShell>
  );
}