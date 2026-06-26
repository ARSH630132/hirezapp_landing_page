"use client";

import { useState } from "react";
import { ShieldCheck, Layers, Play, CheckCircle2, ChevronRight, Settings, Info, Server } from "lucide-react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import MotionReveal from "@/components/inner-pages/MotionReveal";
import { BentoGrid, BentoCard } from "@/components/inner-pages/BentoGrid";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";

const CATEGORIES = ["All", "Security", "Operations", "Finance"];

const ACCELERATORS = [
  {
    id: "auditor",
    name: "Sovereign Compliance Guard",
    category: "Security",
    desc: "Runs continuous, zero-overhead audits on active database streams, auto-redacting PII and identifying schema drift.",
    schema: "Ingest Stream -> eBPF Kernel Masking -> Validation Hook -> Ledger Audit Logs",
    systemPrompt: "Enforce zero-trust boundaries. Redact any matches for SSN, PAN, or secret keys prior to external routing.",
    datasources: "PostgreSQL, MySQL, Local File System"
  },
  {
    id: "sap",
    name: "ERP Freight Sync Agent",
    category: "Operations",
    desc: "Directly parses and syncs inland freight transport schedules with SAP systems via cryptographically signed OAuth webhooks.",
    schema: "Kafka Freight Stream -> Schema Parser -> Temporal State Machine -> Signed SAP Trigger",
    systemPrompt: "Maintain absolute idempotency. Do not trigger secondary freight requests unless verified via system signature.",
    datasources: "SAP S/4HANA, Kafka Broker, Oracle DB"
  },
  {
    id: "digest",
    name: "SOX Financial Ledger Auditor",
    category: "Finance",
    desc: "Ingests fragmented multi-department CSV files, flags variance anomalies, and auto-generates audit-ready ledger balances.",
    schema: "Departmental S3 Buckets -> Variance Evaluator -> Self-Correction Loop -> Signed PDF Artifact",
    systemPrompt: "Evaluate variance limits against SOC1 metrics. Flag any transaction deviation exceeding 0.05% for human review.",
    datasources: "Amazon S3, Snowflake, ERP Ledgers"
  },
  {
    id: "sla",
    name: "SLA Workload Scheduler",
    category: "Operations",
    desc: "Monitors non-production cluster compute workloads to automatically scale down resources during off-peak hours.",
    schema: "Prometheus Metrics API -> Compute Capacity Evaluator -> K8s Scale Command",
    systemPrompt: "Optimize core resource thresholds. Ensure non-production scaling does not degrade production database memory pools.",
    datasources: "Kubernetes API, Prometheus, Grafana"
  },
  {
    id: "pii-redact",
    name: "Zero-Trust PII Redactor",
    category: "Security",
    desc: "Secures outbound LLM invocations by anonymizing sensitive corporate intellectual property and proprietary keys.",
    schema: "LLM Gateway Ingress -> Token Hash Filter -> Anonymizer Proxy -> Outbound Gateway",
    systemPrompt: "Detect intellectual property patterns. Substitute recognized source-code patterns with placeholder IDs.",
    datasources: "GFF API Gateway, Local Config Map"
  }
];

export default function MarketplacePage() {
  const [activeCat, setActiveCat] = useState("All");
  const [selectedId, setSelectedId] = useState("auditor");
  const [sandboxActive, setSandboxActive] = useState<Record<string, boolean>>({});
  const [deployingId, setDeployingId] = useState<string | null>(null);

  const filtered = ACCELERATORS.filter(
    (acc) => activeCat === "All" || acc.category === activeCat
  );

  const activeAcc = ACCELERATORS.find((acc) => acc.id === selectedId) || ACCELERATORS[0];

  const handleDeploySandbox = (id: string) => {
    setDeployingId(id);
    setTimeout(() => {
      setSandboxActive((prev) => ({ ...prev, [id]: true }));
      setDeployingId(null);
    }, 600);
  };

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Tier 1.5 • Pre-Audited Modules"
        title="Sovereign Accelerator Registry"
        highlightedWord="Accelerator"
        description="Browse and stage enterprise-grade multi-agent templates, deterministic cognitive flows, and custom security guardrails designed for GFF Foundry."
        breadcrumbs={[{ label: "Platforms", href: "/platforms" }, { label: "Accelerator Registry" }]}
      />

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-24 space-y-20">
        
        {/* Core Description Banner */}
        <MotionReveal className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-10 border-y border-white/5 items-center bg-white/[0.01] px-6 rounded-2xl">
          <div className="lg:col-span-5">
            <span className="text-xs font-mono text-[#009DFF] uppercase tracking-widest font-bold">Registry Purpose</span>
            <h2 className="text-2xl font-bold text-white mt-2">Accelerate Safely</h2>
          </div>
          <div className="lg:col-span-7">
            <p className="text-white/70 font-light text-sm leading-relaxed">
              Sovereign enterprise systems shouldn&apos;t be coded from scratch. The GFF Accelerator Registry hosts a collection of verified, pre-scoped patterns that address industry challenges—from data ingestion pipelines to automated compliance controllers—without introducing fake purchase loops or licensing overhead.
            </p>
          </div>
        </MotionReveal>

        {/* Section 1: Registry Explorer with Interactive Inspector */}
        <MotionReveal className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Sovereign Asset Registry</h2>
              <p className="text-white/50 text-xs mt-1 font-light">Explore, filter, and inspect structural agent schemas.</p>
            </div>
            
            {/* Filter Tabs */}
            <div className="flex gap-1.5 p-1 bg-white/5 rounded-lg border border-white/10">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCat(cat)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    activeCat === cat 
                      ? "bg-white/10 text-white shadow-sm" 
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Grid list of assets */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map((acc) => {
                const isSelected = acc.id === selectedId;
                const isStaged = sandboxActive[acc.id];
                return (
                  <div
                    key={acc.id}
                    onClick={() => setSelectedId(acc.id)}
                    className={`p-5 rounded-xl border flex flex-col justify-between min-h-[180px] transition-all cursor-pointer relative group ${
                      isSelected 
                        ? "border-[#009DFF] bg-[#009DFF]/5" 
                        : "border-white/5 bg-black/40 hover:border-white/10"
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <span className="px-2 py-0.5 rounded text-[8px] bg-white/5 text-white/50 border border-white/10 uppercase font-mono tracking-widest">
                          {acc.category}
                        </span>
                        {isStaged && (
                          <span className="text-[9px] font-mono font-bold text-green-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> STAGED
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-white mt-3 group-hover:text-[#009DFF] transition-colors">{acc.name}</h3>
                      <p className="text-xs text-white/50 font-light mt-1.5 line-clamp-2 leading-relaxed">{acc.desc}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-white/40">
                      <span>Inspect Schema</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Interactive Inspector Panel */}
            <div className="lg:col-span-6 bg-[#04060b] rounded-xl border border-white/10 p-5 flex flex-col justify-between shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-gradient-to-bl from-[#009DFF]/10 to-transparent blur-[40px] pointer-events-none" />
              
              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <div>
                    <span className="text-[9px] uppercase font-mono tracking-wider text-white/40 font-semibold">Schema & Logic Inspector</span>
                    <h3 className="text-sm font-bold text-white mt-0.5">{activeAcc.name}</h3>
                  </div>
                  <Server className="w-4 h-4 text-[#009DFF]" />
                </div>

                {/* ANIMATED EXECUTION DAG GRAPH */}
                <div className="border border-white/5 bg-black/60 rounded-xl p-3 flex flex-col items-center justify-center relative overflow-hidden min-h-[140px]">
                  <span className="text-[8px] font-mono text-white/30 absolute top-2 right-2 uppercase tracking-wider">Dynamic Execution DAG</span>
                  <div className="w-full flex items-center justify-between px-1 mt-4 text-[8px] font-mono text-white/50 text-center uppercase gap-1">
                    {(() => {
                      const stages = activeAcc.id === "auditor" 
                        ? ["DB Ingest", "eBPF Filter", "Valid Hook", "Audit Log"]
                        : activeAcc.id === "sap" 
                        ? ["Kafka Stream", "Parser", "Temporal SM", "SAP Trigger"]
                        : activeAcc.id === "digest" 
                        ? ["S3 Ingest", "Eval Gate", "Correction", "PDF Ledger"]
                        : activeAcc.id === "sla" 
                        ? ["Metrics API", "Compute Eval", "K8s Scale", "Pod Pool"]
                        : ["LLM Gateway", "Hash Filter", "Proxy Mask", "Outbound"];
                      return stages.map((st, i) => (
                        <div key={i} className="flex flex-col items-center flex-1">
                          <div className="w-5 h-5 rounded-full border border-white/10 bg-[#050505] flex items-center justify-center mb-1 text-[9px] font-bold text-[#009DFF] relative">
                            {i + 1}
                            {i < 3 && (
                              <div className="absolute left-5 top-[9px] w-[50px] sm:w-[65px] h-[1px] bg-gradient-to-r from-[#009DFF] to-transparent opacity-40" />
                            )}
                          </div>
                          <span className="truncate max-w-[70px] text-[7.5px] leading-tight font-medium text-white/80">{st}</span>
                        </div>
                      ));
                    })()}
                  </div>
                  <span className="text-[8.5px] font-mono text-[#009DFF] mt-5 uppercase tracking-widest animate-pulse">● System Telemetry Pipeline Active</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                    <span className="text-[9px] font-mono uppercase text-white/40">Connected Data Surface</span>
                    <p className="font-mono text-white/80 font-semibold">{activeAcc.datasources}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] font-mono uppercase text-white/40">Active System prompt</span>
                    <p className="p-3 rounded-lg bg-black/20 border border-white/5 text-white/70 italic font-light leading-relaxed">
                      &ldquo;{activeAcc.systemPrompt}&rdquo;
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 relative z-10 flex items-center justify-between flex-wrap gap-2">
                <span className="text-[10px] text-white/30 font-mono">ID: {activeAcc.id}_accelerator_v1.0</span>
                
                <button
                  onClick={() => handleDeploySandbox(activeAcc.id)}
                  disabled={sandboxActive[activeAcc.id] || deployingId === activeAcc.id}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    sandboxActive[activeAcc.id]
                      ? "bg-green-500/10 text-green-400 border border-green-500/20 cursor-default"
                      : deployingId === activeAcc.id
                      ? "bg-white/5 text-white/50 border border-white/10 cursor-not-allowed"
                      : "bg-[#009DFF] text-white hover:bg-[#009DFF]/80"
                  }`}
                >
                  {sandboxActive[activeAcc.id] ? (
                    <>✓ Active in Sandbox</>
                  ) : deployingId === activeAcc.id ? (
                    <>Deploying...</>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" /> Deploy to Sandbox
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </MotionReveal>

        {/* Section 2: Architecture of an Accelerator */}
        <MotionReveal className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">The Accelerator Anatomy</h2>
            <p className="text-white/50 text-xs mt-2 font-light">Every blueprint asset in our registry is engineered across four sovereign layers.</p>
          </div>

          <BentoGrid>
            <BentoCard
              title="1. Model Configuration"
              description="Specifies the foundation and context-window boundaries, model temperature bounds, and custom vocabulary settings."
              icon={<Settings className="w-5 h-5 text-red-500" />}
              badge="Deterministic Engine"
              glowColor="red"
            />
            <BentoCard
              title="2. Guardrail Policy"
              description="Active zero-trust directives governing PII masking, toxicity analysis, prompt injection blocks, and regulatory constraints."
              icon={<ShieldCheck className="w-5 h-5 text-blue-500" />}
              badge="Security Surface"
              glowColor="blue"
            />
            <BentoCard
              title="3. System Tools"
              description="Signed execution declarations mapping available REST endpoints, SQL databases, SCADA controls, and Human-in-the-Loop loops."
              icon={<Layers className="w-5 h-5 text-purple-500" />}
              badge="Integration Spec"
              glowColor="purple"
            />
          </BentoGrid>
        </MotionReveal>

        {/* CTA Section */}
        <PremiumCTA
          title="Collaborate on a Custom Sovereign Accelerator"
          description="Have a specific regulatory pipeline or legacy integration gap? Partner with GFF Systems Architects to design and lock a custom multi-agent template."
          primaryLabel="Connect with Engineers"
          primaryHref="/contact"
        />

      </div>
    </InnerPageShell>
  );
}
