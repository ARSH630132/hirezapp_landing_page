"use client";

import { useState } from "react";
import Link from "next/link";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";

interface Stage {
  n: number;
  name: string;
  desc: string;
  tool: string;
  btn: string;
  metric: string;
}

const JOURNEY: Stage[] = [
  { n: 1, name: "Visitor", desc: "Explore core reference blueprints and test cognitive flows in sandbox environments.", tool: "/build/sandbox", btn: "Sandbox", metric: "Free Access" },
  { n: 2, name: "AI Assessment", desc: "Evaluate operational readiness and regulatory compliance score with our scanner.", tool: "/build/assessment", btn: "Assessor", metric: "Readiness Index" },
  { n: 3, name: "Blueprint", desc: "Architect personalized multi-agent execution roadmaps and custom DAG diagrams.", tool: "/build/blueprint", btn: "Blueprint", metric: "Tailored Topologies" },
  { n: 4, name: "Workshop", desc: "Review structural requirements with GFF AI engineers to model integration schemes.", tool: "/build/talk", btn: "Inquire", metric: "Architect Sync" },
  { n: 5, name: "Proposal", desc: "Compile custom commercial scoping and download PPT execution deck previews.", tool: "/build/proposal", btn: "Proposal Studio", metric: "Algorithmic SOW" },
  { n: 6, name: "Contract", desc: "Sign secure enterprise-grade agreements. Secure dedicated air-gapped enclaves.", tool: "/build/sandbox", btn: "Sovereign Specs", metric: "SOC2 Audited" },
  { n: 7, name: "Delivery", desc: "Assemble and configure agent topologies dynamically inside GFF Foundry Studio.", tool: "/build/foundry-studio", btn: "Foundry Studio", metric: "30-Day Launch" },
  { n: 8, name: "Operate", desc: "Execute cognitive workflows. Supervisor nodes continually inspect transaction schemas.", tool: "/build/talk", btn: "Chat Console", metric: "99.9% Success Rate" },
  { n: 9, name: "Expand", desc: "License new marketplace connectors and scale cognitive nodes as enterprise ROI grows.", tool: "/build/marketplace", btn: "Marketplace", metric: "Dynamic Multipliers" }
];

export default function BuildHubPage() {
  const [active, setActive] = useState<Stage>(JOURNEY[0]);

  const tools = [
    { title: "Readiness Assessor", href: "/build/assessment", desc: "Evaluate legacy systems integration, VPC security, and telemetry.", cat: "DIAGNOSTIC", accent: "#009DFF" },
    { title: "Blueprint Architect", href: "/build/blueprint", desc: "Map tailored agent execution graphs and topological timelines.", cat: "ROADMAP", accent: "#9D00FF" },
    { title: "ROI Calculator", href: "/build/roi", desc: "Estimate labor hours reclaimed and licensing cost multipliers.", cat: "FINANCIAL", accent: "#E4000F" },
    { title: "Cognitive Chat Console", href: "/build/talk", desc: "Interact directly with advanced multi-system supervisors.", cat: "CHATBOT", accent: "#00FF9D" },
    { title: "Proposal Studio", href: "/build/proposal", desc: "Obtain automated Statements of Work and downloadable presentation previews.", cat: "COMMERCIAL", accent: "#3B82F6" },
    { title: "Zero-Trust Sandbox", href: "/build/sandbox", desc: "Run secure trace logs inside virtual hardware enclaves.", cat: "SANDBOX", accent: "#8B5CF6" },
    { title: "Foundry Studio Simulator", href: "/build/foundry-studio", desc: "Design complex visual agent DAG execution schemas.", cat: "WORKSPACE", accent: "#009DFF" },
    { title: "Asset Marketplace", href: "/build/marketplace", desc: "Acquire certified connector recipes and custom personas.", cat: "ASSETS", accent: "#EC4899" }
  ];

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Enterprise Development"
        title="Build with GFF AI"
        highlightedWord="GFF AI"
        description="Launch our interactive assessor tools, blueprint planners, sandbox simulators, and proposal studios to construct your custom multi-agent enterprise fleet."
      />

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-24 space-y-16">
        {/* SECTION 1: Sovereign Journey Timeline */}
        <section className="p-8 lg:p-10 rounded-[24px] border border-white/5 bg-[#04060b] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[30%] h-[30%] bg-[#009DFF]/5 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-[1400px] mx-auto space-y-8">
            <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-4">
              <div>
                <span className="text-xs font-mono text-[#009DFF] font-semibold uppercase tracking-wider block mb-1">DEPLOYMENT PROTOCOL</span>
                <h2 className="text-2xl lg:text-3xl font-bold text-white">The 9-Stage Sovereign Journey</h2>
                <p className="text-white/60 text-xs mt-1 max-w-[600px] font-light">Select any milestone to inspect timeline metrics and relevant self-service utilities.</p>
              </div>
              <div className="text-xs font-mono text-[#009DFF] bg-[#009DFF]/10 px-3 py-1 rounded-full border border-[#009DFF]/20 self-start">
                PHASE 0{active.n}: {active.name.toUpperCase()}
              </div>
            </div>

            {/* Timeline Row */}
            <div className="relative overflow-x-auto pb-4 scrollbar-none">
              <div className="min-w-[840px] flex items-center justify-between relative px-2">
                <div className="absolute top-[20px] left-4 right-4 h-[2px] bg-white/5 z-0" />
                <div className="absolute top-[20px] left-4 h-[2px] bg-gradient-to-r from-[#E4000F] to-[#009DFF] z-0 transition-all duration-300" style={{ width: `${((active.n - 1) / 8) * 100}%` }} />
                
                {JOURNEY.map((stg) => {
                  const act = active.n === stg.n;
                  return (
                    <button key={stg.n} onClick={() => setActive(stg)} className="flex flex-col items-center relative z-10 group focus:outline-none w-[80px]">
                      <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                        act ? "bg-black border-[#009DFF] text-[#009DFF] shadow-[0_0_12px_rgba(0,157,255,0.3)] scale-110" :
                        stg.n < active.n ? "bg-gradient-to-r from-[#E4000F] to-[#009DFF] border-transparent text-white" : "bg-[#020202] border-white/10 text-white/40 group-hover:border-white/30"
                      }`}>{stg.n}</div>
                      <span className={`text-[10px] mt-2 font-semibold truncate w-full text-center transition-colors ${act ? "text-[#009DFF]" : "text-white/60 group-hover:text-white"}`}>{stg.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Detail Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 border-t border-white/5">
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center gap-2 text-[11px] font-mono text-white/50">
                  <span className="text-[#E4000F] font-bold">PHASE 0{active.n}</span>
                  <span>|</span>
                  <span className="text-[#00FF9D] font-semibold">{active.metric}</span>
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-white">{active.name} Milestone</h3>
                <p className="text-white/70 text-xs leading-relaxed max-w-[720px] font-light">{active.desc}</p>
                <div className="pt-2">
                  <Link href={active.tool} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold text-white bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#009DFF]/30 transition group">
                    <span>Launch {active.btn}</span>
                    <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform text-[#009DFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
              
              <div className="lg:col-span-4 p-5 rounded-xl bg-white/[0.01] border border-white/5 flex flex-col justify-between">
                <div>
                  <h4 className="text-[10px] font-mono text-white/40 uppercase tracking-wider mb-2">EXPECTED ARTIFACT</h4>
                  <p className="text-xs text-white/80 font-light leading-relaxed">Integrated architecture graphs, security baseline audits, and dynamic simulation results corresponding to the phase objectives.</p>
                </div>
                <div className="text-[9px] font-mono text-white/30 pt-4 border-t border-white/5 flex justify-between">
                  <span>DATA PRIVACY</span>
                  <span className="text-[#00FF9D]">ENFORCED</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Tools Grid */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono text-[#009DFF] font-semibold uppercase tracking-wider block">UTILITY TERMINAL</span>
            <h2 className="text-2xl lg:text-3xl font-bold text-white">Self-Service Diagnostic & Simulator Tools</h2>
            <p className="text-white/60 text-xs max-w-[600px] mx-auto font-light">Access automated assessments, pricing simulators, and sandbox environments.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((t) => (
              <div key={t.title} className="p-6 rounded-2xl border border-white/5 bg-[#030304]/80 flex flex-col justify-between hover:border-white/10 transition-all group relative">
                <div>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded border" style={{ color: t.accent, borderColor: `${t.accent}25`, backgroundColor: `${t.accent}08` }}>{t.cat}</span>
                  <h3 className="text-base font-bold text-white mt-4 group-hover:text-[#009DFF] transition-colors">{t.title}</h3>
                  <p className="mt-2 text-xs text-white/60 leading-relaxed font-light">{t.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/5">
                  <Link href={t.href} className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-[#009DFF] transition">
                    <span>LAUNCH UTILITY</span>
                    <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <PremiumCTA />
      </div>
    </InnerPageShell>
  );
}