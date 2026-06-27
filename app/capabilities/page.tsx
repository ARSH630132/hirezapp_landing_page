"use client";

import React, { useState } from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";
import { Network, Cpu, Shield, Database, Workflow, Activity, GraduationCap, Layers, Settings, FlaskConical, Compass, ArrowRight, CheckCircle } from "lucide-react";

const capabilities = [
  { id: "strategy", title: "AI Strategy", href: "/capabilities/strategy", tag: "INCEPTION", icon: <Compass className="w-4 h-4 text-[#E4000F]" />, desc: "Feasibility studies, readiness, and strategic ROI simulations." },
  { id: "engineering", title: "AI Engineering", href: "/capabilities/engineering", tag: "SYSTEMS", icon: <Settings className="w-4 h-4 text-[#009DFF]" />, desc: "Low-latency microservices, API layers, and model hosting." },
  { id: "agents", title: "Agentic AI", href: "/capabilities/agents", tag: "COGNITIVE", icon: <Cpu className="w-4 h-4 text-purple-400" />, desc: "Goal-directed multi-agent frameworks running complex workflows." },
  { id: "governance", title: "AI Governance", href: "/capabilities/governance", tag: "COMPLIANCE", icon: <Shield className="w-4 h-4 text-emerald-400" />, desc: "Real-time safety guardrails and immutable audit logs." },
  // { id: "data", title: "Enterprise Data", href: "/capabilities/data", tag: "RECON", icon: <Database className="w-4 h-4 text-amber-400" />, desc: "Real-time CDC syncing and hybrid vector database layouts." },
  { id: "labs", title: "AI Labs", href: "/capabilities/labs", tag: "SANDBOX", icon: <FlaskConical className="w-4 h-4 text-pink-400" />, desc: "Rapid prototyping sandbox to stress-test frontier agents." },
  { id: "operations", title: "AI Operations", href: "/capabilities/operations", tag: "TELEMETRY", icon: <Activity className="w-4 h-4 text-cyan-400" />, desc: "Monitor semantic latencies, token consumption, and failovers." },
  // { id: "twins", title: "Cognitive Twins", href: "/capabilities/twins", tag: "SIMULATION", icon: <Layers className="w-4 h-4 text-indigo-400" />, desc: "High-fidelity digital replicas of operational business assets." },
  // { id: "universities", title: "AI Enablement", href: "/capabilities/universities", tag: "ACADEMY", icon: <GraduationCap className="w-4 h-4 text-teal-400" />, desc: "Corporate AI developer academies and executive upskilling." },
  { id: "knowledge-graph", title: "Knowledge Graph", href: "/capabilities/knowledge-graph", tag: "SEMANTIC", icon: <Network className="w-4 h-4 text-violet-400" />, desc: "Multi-hop relational entity networks and semantic search layers." },
  { id: "managed-services", title: "Managed Services", href: "/capabilities/managed-services", tag: "OPERATIONS", icon: <Workflow className="w-4 h-4 text-[#E4000F]" />, desc: "Continuous model tuning, latency SLA, and 24/7 support." }
];

const stackLayers = [
  { id: "experience", name: "Experience Layer", desc: "Premium chat interfaces and custom secure portals.", tech: ["Next.js React", "WebSockets"], specs: ["Sub-50ms render loop", "Dynamic widgets"] },
  { id: "agentic", name: "Agentic AI Layer", desc: "Goal-directed multi-agent frameworks running complex workflows.", tech: ["GFF Router", "LangGraph"], specs: ["State sandbox", "Dynamic tools"] },
  { id: "knowledge", name: "Knowledge Graph Layer", desc: "Semantic relationships mapped alongside vector indexes.", tech: ["Neo4j", "pgvector"], specs: ["10M+ Nodes", "Lineage tracking"] },
  { id: "data", name: "Data & Integration Layer", desc: "Real-time CDC syncing and high-volume unstructured indexing pipelines.", tech: ["Kafka", "CDC Connect"], specs: ["10k+ chunks/sec", "Zero data retention"] },
  { id: "governance", name: "Governance Layer", desc: "Safety firewall intercepting prompts and outputs to scrub PII.", tech: ["GFF Shield", "SOC2 Validator"], specs: ["99.9% PII recall", "<12ms latency"] },
  { id: "operations", name: "Managed AI Operations Layer", desc: "Telemetry tracking latencies, cost curves, and anomalies.", tech: ["Prometheus", "Grafana"], specs: ["Telemetry <5ms", "Auto-failover"] }
];

export default function CapabilitiesPage() {
  const [activeLayer, setActiveLayer] = useState("agentic");
  const currentLayer = stackLayers.find(l => l.id === activeLayer) || stackLayers[1];

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Systems Engineering"
        title="Technical Capabilities"
        highlightedWord="Capabilities"
        description="GFF AI engineers resilient, high-throughput, and secure enterprise-grade systems architectures designed to elevate core business operations with autonomous cognitive intelligence."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Capabilities" }]}
      />

      {/* SECTION 1: INTERACTIVE ENTERPRISE AI STACK */}
      <section className="relative w-full px-6 lg:px-16 pb-20">
        <div className="max-w-[1795px] mx-auto">
          <div className="text-center max-w-[800px] mx-auto mb-12">
            {/* <span className="text-[10px] font-mono tracking-[0.2em] text-[#009DFF] uppercase font-bold">THE STRUCTURAL FABRIC</span> */}
            <h2 className="text-[28px] sm:text-[34px] font-bold text-white tracking-tight mt-2">Enterprise AI Stack Architecture</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 flex justify-center">
              <div className="w-full max-w-[500px] flex flex-col gap-2">
                {stackLayers.map((layer) => {
                  const isSelected = activeLayer === layer.id;
                  return (
                    <div
                      key={layer.id}
                      onClick={() => setActiveLayer(layer.id)}
                      className={`cursor-pointer p-4 rounded-xl border transition-all flex justify-between items-center ${
                        isSelected ? "bg-white/5 border-[#009DFF] shadow-[0_0_15px_rgba(0,157,255,0.1)]" : "bg-[#030304]/60 border-white/5 hover:border-white/10"
                      }`}
                    >
                      <div>
                        <h4 className="text-[14px] font-semibold text-white">{layer.name}</h4>
                        <span className="text-[10px] text-white/40 font-mono">0{stackLayers.indexOf(layer)+1} . CLICK TO INSPECT</span>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${isSelected ? "bg-[#009DFF] animate-pulse" : "bg-white/10"}`} />
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="lg:col-span-5 bg-[#030304]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6 min-h-[300px] flex flex-col justify-between">
              <div>
                {/* <span className="text-[9px] font-mono tracking-widest text-[#009DFF] uppercase bg-[#009DFF]/5 px-2 py-0.5 rounded border border-[#009DFF]/10">INSPECTOR SPEC</span> */}
                <h3 className="text-[20px] font-bold text-white mt-3">{currentLayer.name}</h3>
                <p className="mt-2 text-[13px] leading-[1.6] text-white/60 font-light">{currentLayer.desc}</p>
                <div className="mt-4 space-y-1.5">
                  {currentLayer.specs.map((spec, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[12px] text-white/80 font-light">
                      <CheckCircle className="w-3.5 h-3.5 text-[#009DFF]" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5">
                <span className="text-[9px] font-mono text-white/30 uppercase">Integrations</span>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {currentLayer.tech.map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-white/70">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: COMMAND GRID */}
      <section className="relative w-full px-6 lg:px-16 pb-20 border-t border-white/5 pt-16">
        <div className="max-w-[1795px] mx-auto">
          <div className="text-center max-w-[800px] mx-auto mb-12">
            {/* <span className="text-[10px] font-mono tracking-[0.2em] text-[#E4000F] uppercase font-bold">COMMAND GRID</span> */}
            <h2 className="text-[28px] sm:text-[34px] font-bold text-white tracking-tight mt-2">Core Capabilities Matrix</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {capabilities.map((cap) => (
              <a
                key={cap.id}
                href={cap.href}
                className="group relative flex flex-col justify-between p-5 rounded-2xl border border-white/5 bg-[#030304]/40 backdrop-blur-md hover:border-white/10 hover:bg-[#070709]/80 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono tracking-widest text-white/40 group-hover:text-[#009DFF] transition-colors">{cap.tag}</span>
                    <div className="p-1 rounded bg-white/5 border border-white/10">{cap.icon}</div>
                  </div>
                  <h3 className="text-[15.5px] font-semibold text-white tracking-tight mt-3">{cap.title}</h3>
                  <p className="mt-2 text-[12px] leading-[1.5] text-white/50 font-light group-hover:text-white/70 transition-colors">{cap.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10.5px] font-mono text-[#009DFF] group-hover:text-white transition-all">
                  <span>INSPECT BLUEPRINT</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: FACTORIES */}
      {/* <section className="relative w-full px-6 lg:px-16 pb-20 border-t border-white/5 pt-16">
        <div className="max-w-[1795px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="rounded-2xl border border-white/5 bg-[#030304]/60 p-6 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[30%] aspect-square bg-[#E4000F]/2 rounded-full blur-3xl pointer-events-none" />
              <div>
                <span className="text-[9px] font-mono tracking-widest text-[#E4000F] uppercase border border-[#E4000F]/20 bg-[#E4000F]/5 px-2 py-0.5 rounded">AGENT FACTORY</span>
                <h3 className="text-[20px] font-bold text-white mt-4">Automated Agent Synthesis</h3>
                <p className="mt-2 text-[13px] leading-[1.6] text-white/60 font-light">
                  Our customized synthesis compiler takes declarative configurations and builds sandboxed cognitive workers bound to secure APIs and self-correction reasoning loops.
                </p>
                <div className="mt-4 p-3 rounded-xl border border-white/5 bg-black/40 grid grid-cols-4 gap-1 text-center text-[9px] font-mono text-white/50">
                  <div className="p-1 border border-white/5 bg-white/5 rounded">YAML Conf</div>
                  <div className="p-1 border border-white/5 bg-white/5 rounded">Tool Bind</div>
                  <div className="p-1 border border-white/5 bg-white/5 rounded text-[#E4000F]">Sandbox</div>
                  <div className="p-1 border border-white/5 bg-white/5 rounded text-emerald-400">Deploy</div>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-white/5 bg-[#030304]/60 p-6 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[30%] aspect-square bg-[#009DFF]/2 rounded-full blur-3xl pointer-events-none" />
              <div>
                <span className="text-[9px] font-mono tracking-widest text-[#009DFF] uppercase border border-[#009DFF]/20 bg-[#009DFF]/5 px-2 py-0.5 rounded">GRAPH FACTORY</span>
                <h3 className="text-[20px] font-bold text-white mt-4">Structured Entity Synthesis</h3>
                <p className="mt-2 text-[13px] leading-[1.6] text-white/60 font-light">
                  Converts active data streams into structured semantic node networks, ensuring zero hallucinations and deterministic lineage during runtime vector searches.
                </p>
                <div className="mt-4 p-3 rounded-xl border border-white/5 bg-black/40 grid grid-cols-4 gap-1 text-center text-[9px] font-mono text-white/50">
                  <div className="p-1 border border-white/5 bg-white/5 rounded">CDC Sync</div>
                  <div className="p-1 border border-white/5 bg-white/5 rounded">Extract</div>
                  <div className="p-1 border border-white/5 bg-white/5 rounded text-[#009DFF]">Stitch</div>
                  <div className="p-1 border border-white/5 bg-white/5 rounded text-emerald-400">Index</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
 */}
      {/* SECTION 4: GARAGE TO FACTORY */}
      <section className="relative w-full px-6 lg:px-16 pb-20 border-t border-white/5 pt-16">
        <div className="max-w-[1795px] mx-auto">
          <div className="text-center max-w-[800px] mx-auto mb-12">
            {/* <span className="text-[10px] font-mono tracking-[0.2em] text-[#009DFF] uppercase font-bold">LIFECYCLE</span> */}
            <h2 className="text-[28px] sm:text-[34px] font-bold text-white tracking-tight mt-2">Garage-to-Factory Progression</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[
              { phase: "PHASE 01", title: "The GFF Garage", desc: "Collaborative, low-friction sandboxes for feasibility studies, model comparison, initial prompt engineering, and operational ROI modeling.", tag: "INCUBATE" },
              { phase: "PHASE 02", title: "The GFF Foundry", desc: "Rigorous hardening stage. We assemble knowledge networks, stitch high-throughput vector DBs, compile multi-agent schemas, and bind API scopes.", tag: "ASSEMBLE" },
              { phase: "PHASE 03", title: "The GFF Factory", desc: "Production-scale deployment. Continuous latency optimizations, GPU orchestration, telemetry reporting, model tuning cron jobs, and 24/7 operations SLA support.", tag: "OPERATE" }
            ].map((p, idx) => (
              <div key={idx} className="p-5 rounded-2xl border border-white/5 bg-[#030304]/40 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center text-[9.5px] font-mono">
                    <span className="text-[#009DFF] font-semibold">{p.phase}</span>
                    <span className="text-white/40">{p.tag}</span>
                  </div>
                  <h4 className="text-[17px] font-bold text-white mt-3">{p.title}</h4>
                  <p className="mt-2 text-[12.5px] leading-[1.5] text-white/50 font-light">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: RELATED PLATFORMS */}
      {/* <section className="relative w-full px-6 lg:px-16 pb-20 border-t border-white/5 pt-16">
        <div className="max-w-[1795px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="/platforms" className="p-5 rounded-2xl border border-white/5 bg-[#030304]/60 hover:border-[#009DFF]/30 transition-all">
              <h4 className="text-[15px] font-semibold text-white flex justify-between items-center">
                <span>The Platform Spec</span>
                <ArrowRight className="w-3.5 h-3.5 text-white/30" />
              </h4>
              <p className="mt-2 text-[12.5px] text-white/50 font-light">Browse complete system specifications, integration endpoints, and host layouts.</p>
            </a>
            <a href="/platforms/foundry" className="p-5 rounded-2xl border border-white/5 bg-[#030304]/60 hover:border-[#E4000F]/30 transition-all">
              <h4 className="text-[15px] font-semibold text-white flex justify-between items-center">
                <span>GFF Foundry</span>
                <ArrowRight className="w-3.5 h-3.5 text-white/30" />
              </h4>
              <p className="mt-2 text-[12.5px] text-white/50 font-light">Deploy secure sandboxes, map data ingestion streams, and bind agentic loops.</p>
            </a>
            <a href="/build/sandbox" className="p-5 rounded-2xl border border-white/5 bg-[#030304]/60 hover:border-purple-500/30 transition-all">
              <h4 className="text-[15px] font-semibold text-white flex justify-between items-center">
                <span>Enterprise Sandbox</span>
                <ArrowRight className="w-3.5 h-3.5 text-white/30" />
              </h4>
              <p className="mt-2 text-[12.5px] text-white/50 font-light">Launch real-time interactive AI simulations, test prompt models, and optimize latency.</p>
            </a>
          </div>
        </div>
      </section> */}

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-16">
        <PremiumCTA
          title="Ready to Scale Your Autonomous Core?"
          description="Schedule a structural session with our Lead Systems Architects to model custom agent pipelines and secure integration paths tailored for your stack."
          primaryLabel="Consult Systems Architect"
          secondaryLabel="Inspect Platform Spec"
        />
      </div>
    </InnerPageShell>
  );
}
