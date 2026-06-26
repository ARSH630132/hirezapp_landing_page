"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Database, Cpu, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import MotionReveal from "@/components/inner-pages/MotionReveal";
import { BentoGrid, BentoCard } from "@/components/inner-pages/BentoGrid";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";

const DIMS = [
  { id: "gov", t: "Governance & Security", s: 84, i: ShieldCheck, g: "Fragmented security checks without automated kernel logs.", r: "Deploy custom Sovereign Guardrail policies with zero-trust eBPF telemetry.", tc: ["eBPF Shield", "Guardrails"] },
  { id: "dat", t: "Data Surface Density", s: 42, i: Database, g: "Corporate intellectual property locked across legacy CSVs and siloed databases.", r: "Orchestrate a sovereign hybrid vector-graph index using Neo4j and pgvector.", tc: ["GFF Data Fabric", "Graph-Vector"] },
  { id: "cmp", t: "Compute Scalability", s: 65, i: Cpu, g: "Compute workloads are statically provisioned leading to excessive idle costs.", r: "Implement dynamic SLA-based compute scaling dynamically across containers.", tc: ["K8s Scalers", "vLLM Runtime"] }
];

export default function BlueprintPage() {
  const [actId, setActId] = useState("dat");
  const act = DIMS.find((d) => d.id === actId) || DIMS[0];

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Tier 0 • Diagnostics"
        title="Enterprise AI Blueprints"
        highlightedWord="Blueprints"
        description="Audit existing data structures, analyze regulatory boundaries, and design mathematically structured multi-agent topologies before writing code."
        breadcrumbs={[{ label: "Platforms", href: "/platforms" }, { label: "Blueprint" }]}
      />
      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-24 space-y-20">
        <MotionReveal className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-10 border-y border-white/5 items-center">
          <div className="lg:col-span-5">
            <span className="text-xs font-mono text-[#009DFF] uppercase tracking-widest font-bold">Strategic Framework</span>
            <h2 className="text-2xl font-bold text-white mt-2">The Diagnostic Foundation</h2>
          </div>
          <div className="lg:col-span-7">
            <p className="text-white/70 font-light text-sm leading-relaxed">
              We believe successful enterprise AI is an architectural discipline, not a series of prompt experiments. Before GFF deploys an agent, we model your entire system topology, audit your data surfaces, and design a deterministic roadmap to convert objectives into secure sovereign software blueprints.
            </p>
          </div>
        </MotionReveal>

        <MotionReveal className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono text-[#009DFF] uppercase tracking-widest font-semibold">Diagnostics Core</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Interactive Readiness Assessor</h2>
            <p className="text-white/50 text-xs sm:text-sm font-light">Select an operational dimension to inspect custom topologies and compliance recommendations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-4xl mx-auto items-stretch">
            <div className="md:col-span-5 flex flex-col gap-3">
              {DIMS.map((d) => {
                const Icon = d.i;
                const isSel = actId === d.id;
                return (
                  <button key={d.id} onClick={() => setActId(d.id)} className={`p-4 rounded-xl border text-left transition-all duration-300 flex items-center justify-between cursor-pointer group ${isSel ? "text-[#009DFF] border-[#009DFF]/30 bg-[#009DFF]/5 shadow-[0_0_15px_rgba(0,157,255,0.03)]" : "border-white/5 bg-black/40 hover:border-white/10"}`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg border ${isSel ? "border-[#009DFF]/30 bg-[#009DFF]/10 text-[#009DFF]" : "border-white/5 bg-white/5 text-white/40"}`}><Icon className="w-4 h-4" /></div>
                      <div>
                        <span className="text-[9px] font-mono text-white/40 block">AUDIT</span>
                        <span className="text-xs font-bold text-white mt-0.5 block">{d.t}</span>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-white/80">{d.s}%</span>
                  </button>
                );
              })}
            </div>
            <div className="md:col-span-7 bg-[#04060b] rounded-xl border border-white/10 p-5 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-gradient-to-bl from-[#009DFF]/5 to-transparent blur-[40px] pointer-events-none" />
              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-[9px] uppercase tracking-wider font-mono text-white/40">Readiness Gap Inspector</span>
                  <span className="text-[9px] font-mono text-[#009DFF] bg-[#009DFF]/10 px-2 py-0.5 rounded">ID: {act.id}_audit</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div className="space-y-3">
                    <div>
                      <span className="flex items-center gap-1 text-red-400 font-mono text-[9px] uppercase"><AlertCircle className="w-3.5 h-3.5" /> Identified Gap</span>
                      <p className="text-xs text-white/60 leading-relaxed mt-1 font-light">{act.g}</p>
                    </div>
                    <div>
                      <span className="flex items-center gap-1 text-green-400 font-mono text-[9px] uppercase"><CheckCircle2 className="w-3.5 h-3.5" /> Recommendation</span>
                      <p className="text-xs text-white/80 leading-relaxed mt-1 font-light">{act.r}</p>
                    </div>
                  </div>
                  <div className="border border-white/5 bg-black/50 rounded-xl p-3 flex flex-col items-center justify-center min-h-[140px]">
                    <span className="text-[8px] font-mono text-white/30 uppercase mb-2">Topology</span>
                    {actId === "gov" && (
                      <svg className="w-full h-[70px]" viewBox="0 0 200 70">
                        <rect x="10" y="15" width="45" height="22" rx="4" fill="#050505" stroke="#E4000F" strokeWidth="1" />
                        <text x="32" y="29" fill="#E4000F" fontSize="7" textAnchor="middle" fontWeight="600">INGRESS</text>
                        <path d="M55 26 L145 26" stroke="#009DFF" strokeWidth="1" strokeDasharray="3 3" />
                        <circle cx="100" cy="26" r="6" fill="#009DFF" opacity="0.3" />
                        <rect x="145" y="15" width="45" height="22" rx="4" fill="#050505" stroke="#009DFF" strokeWidth="1" />
                        <text x="167" y="29" fill="white" fontSize="7" textAnchor="middle" fontWeight="600">eBPF MESH</text>
                        <text x="100" y="55" fill="#009DFF" fontSize="6.5" textAnchor="middle" fontFamily="monospace">SOVEREIGN GUARDRAILS</text>
                      </svg>
                    )}
                    {actId === "dat" && (
                      <svg className="w-full h-[70px]" viewBox="0 0 200 70">
                        <circle cx="30" cy="15" r="7" fill="#050505" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                        <text x="30" y="18" fill="white" fontSize="7" textAnchor="middle" opacity="0.5">DB</text>
                        <path d="M37 15 L90 30" stroke="#E4000F" strokeWidth="1" strokeDasharray="2 2" />
                        <rect x="90" y="15" width="80" height="25" rx="4" fill="#050505" stroke="#009DFF" strokeWidth="1" />
                        <text x="130" y="30" fill="white" fontSize="7" textAnchor="middle" fontWeight="600">NEO4J + PGVECTOR</text>
                        <text x="100" y="55" fill="#009DFF" fontSize="6.5" textAnchor="middle" fontFamily="monospace">DATA FABRIC ROUTING</text>
                      </svg>
                    )}
                    {actId === "cmp" && (
                      <svg className="w-full h-[70px]" viewBox="0 0 200 70">
                        <rect x="20" y="20" width="30" height="15" rx="3" fill="#050505" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                        <text x="35" y="29" fill="white" fontSize="6" textAnchor="middle" opacity="0.5">QUEUE</text>
                        <path d="M50 27 L90 27" stroke="#009DFF" strokeWidth="1" />
                        <rect x="90" y="10" width="40" height="35" rx="4" fill="#050505" stroke="#009DFF" strokeWidth="1" />
                        <text x="110" y="24" fill="white" fontSize="7" textAnchor="middle">K8S</text>
                        <text x="110" y="34" fill="#009DFF" fontSize="6" textAnchor="middle" fontFamily="monospace">vLLM</text>
                        <text x="100" y="60" fill="#009DFF" fontSize="6.5" textAnchor="middle" fontFamily="monospace">ELASTIC CONTAINER MESH</text>
                      </svg>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between flex-wrap gap-2 z-10">
                <div className="flex gap-1">
                  {act.tc.map((t) => <span key={t} className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-mono text-white/60">{t}</span>)}
                </div>
                <Link href="/build/blueprint" className="text-xs text-[#009DFF] hover:underline flex items-center gap-1 font-semibold group">Configure Simulator <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" /></Link>
              </div>
            </div>
          </div>
        </MotionReveal>

        <MotionReveal className="space-y-8">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-white">Solution Topologies & Expected Impact</h2>
          <BentoGrid>
            <BentoCard title="Autonomous Compliance Core" description="Continuous eBPF kernel monitors scanning live database transactions, auto-redacting PII leaks and validating regulatory schemas." badge="Security Mesh" glowColor="red" metric={{ value: "-98%", label: "PII Leakage Risk" }} />
            <BentoCard title="Cognitive Pipeline Mesh" description="Sovereign multi-agent router connecting multi-modal models to parse complex regulatory compliance requests." badge="Reasoning Loop" glowColor="blue" metric={{ value: "10x", label: "Workload Throughput" }} />
            <BentoCard title="Action Gateway Network" description="Cryptographically signed outbound brokers executing idempotent operations in legacy SAP systems with human-approval gates." badge="Deterministic Execution" glowColor="purple" metric={{ value: "Zero-Risk", label: "State Recoverability" }} />
          </BentoGrid>
        </MotionReveal>

        <MotionReveal className="space-y-8">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-white">90-Day Enterprise Roadmap</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              { p: "Phase 1: Days 1-30", t: "Diagnostics & Topology Design", d: "Conduct stakeholder workshops, execute GFF Readiness assessments, and map target security boundaries." },
              { p: "Phase 2: Days 31-60", t: "Sandbox Prototype & DAG Coding", d: "Establish local sandbox clusters inside the GFF Garage, model agent graphs inside Foundry, and load knowledge bases." },
              { p: "Phase 3: Days 61-90", t: "Cluster Scaling & Production Delivery", d: "Promote validated agents into elastic clusters in GFF Factory, connect production SAP/SQL streams, and launch operations." }
            ].map((ph, idx) => (
              <div key={idx} className="p-5 rounded-xl border border-white/5 bg-black/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-[#009DFF]/20 transition-all">
                <div>
                  <span className="text-[9px] font-mono font-bold text-[#009DFF] uppercase tracking-wider">{ph.p}</span>
                  <h3 className="font-bold text-white text-base mt-0.5">{ph.t}</h3>
                  <p className="text-xs text-white/50 leading-relaxed font-light mt-1">{ph.d}</p>
                </div>
              </div>
            ))}
          </div>
        </MotionReveal>

        <PremiumCTA
          title="Scale Your Enterprise Topology Design"
          description="Ready to design your custom sovereign system? Launch our interactive, frontend-only simulator to instantly model execution boundaries."
          primaryLabel="Launch Blueprint Generator"
          primaryHref="/build/blueprint"
        />
      </div>
    </InnerPageShell>
  );
}
