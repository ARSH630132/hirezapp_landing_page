"use client";

import React, { useState } from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";

const LAYERS = {
  garage: {
    n: "01",
    t: "Secure Garage Sandbox",
    tg: "COGNITIVE ISOLATION",
    d: "A contained experimentation layer where isolated agents test reasoning loops, data retrieval, and safety behavior without external system access.",
    c: "#009DFF",
    flow: "Local Context → Masked Memory → Single-Agent Validation",
    s: ["Local Vector Sandbox", "Strict PII Masking", "No External Egress", "Single-Agent Safety Loop"],
  },
  foundry: {
    n: "02",
    t: "Foundry Orchestrator",
    tg: "INTER-AGENT COORDINATION",
    d: "A controlled orchestration layer that coordinates specialized agents through policy gates, secure handshakes, and shared state validation.",
    c: "#E4000F",
    flow: "Task Router → Agent Mesh → Governance Checkpoint",
    s: ["Dynamic Agent Spawning", "mTLS Agent Handshakes", "Policy-Based Routing", "Graph State Caching"],
  },
  factory: {
    n: "03",
    t: "Factory Sovereign Scale",
    tg: "PRODUCTION RUNTIME",
    d: "A sovereign production layer designed for high-throughput execution, auditability, runtime resilience, and enterprise-scale autonomous operations.",
    c: "#00D6A3",
    flow: "Enterprise Queue → Runtime Dispatch → Audit Ledger",
    s: ["Auto-Healing Runtimes", "High-Throughput Dispatchers", "AES-256 Memory Logs", "Continuous Compliance Telemetry"],
  },
};

const SPEC_CARDS = [
  {
    title: "Memory Isolation",
    desc: "Separates private agent memory, shared operational memory, and archived compliance memory.",
    tag: "MEMORY",
  },
  {
    title: "Governed Data Flow",
    desc: "Routes every agent action through policy checks, access boundaries, and traceable execution paths.",
    tag: "FLOW",
  },
  {
    title: "Runtime Security",
    desc: "Applies mTLS handshakes, sandbox enforcement, scoped permissions, and encrypted audit logs.",
    tag: "SECURITY",
  },
  {
    title: "Operational Scale",
    desc: "Supports high-throughput orchestration across enterprise queues, agents, and production workflows.",
    tag: "SCALE",
  },
];

type Key = keyof typeof LAYERS;

export default function ArchitectureLibraryPage() {
  const [sel, setSel] = useState<Key>("garage");
  const current = LAYERS[sel];

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Technical Blueprint"
        title="Reference Architecture Library"
        highlightedWord="Reference Architecture"
        visualType="referenceArchitecture"
        description="Explore GFF AI's sovereign runtime architecture across sandboxed experimentation, governed orchestration, and enterprise-scale autonomous execution."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: "Architecture" },
        ]}
      />

      <section className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          <div className="lg:col-span-7 rounded-[32px] border border-white/10 bg-[#050505]/50 p-6 sm:p-8 overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,157,255,0.12),transparent_35%),radial-gradient(circle_at_80%_70%,rgba(228,0,15,0.10),transparent_35%)] pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between border-b border-white/5 pb-5">
              <div>
                <p className="text-[10px] font-mono text-[#009DFF] uppercase tracking-widest font-bold">
                  Interactive Runtime Schema
                </p>
                <h2 className="mt-2 text-[26px] sm:text-[34px] font-bold text-white">
                  Sovereign Agent Architecture
                </h2>
              </div>
              <span className="hidden sm:inline-flex px-3 py-1 rounded-full border border-emerald-400/20 bg-emerald-400/5 text-[9px] font-mono text-emerald-400 uppercase tracking-widest">
                System Active
              </span>
            </div>

            <div className="relative z-10 mt-8 grid grid-cols-1 gap-5">
              {(Object.keys(LAYERS) as Key[]).map((key, index) => {
                const layer = LAYERS[key];
                const active = sel === key;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSel(key)}
                    className={`group relative w-full rounded-[24px] border p-5 text-left transition-all duration-300 overflow-hidden ${
                      active
                        ? "border-white/20 bg-white/[0.045]"
                        : "border-white/5 bg-black/30 hover:border-white/15 hover:bg-white/[0.025]"
                    }`}
                  >
                    <div
                      className="absolute left-0 top-0 h-full w-[3px]"
                      style={{ backgroundColor: layer.c }}
                    />
                    {active && (
                      <div
                        className="absolute inset-0 opacity-10"
                        style={{
                          background: `linear-gradient(90deg, ${layer.c}, transparent)`,
                        }}
                      />
                    )}

                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5">
                      <div
                        className="w-14 h-14 rounded-2xl border flex items-center justify-center font-mono font-black text-white"
                        style={{
                          borderColor: `${layer.c}55`,
                          backgroundColor: `${layer.c}14`,
                          boxShadow: active ? `0 0 24px ${layer.c}35` : "none",
                        }}
                      >
                        {layer.n}
                      </div>

                      <div className="flex-1">
                        <p
                          className="text-[10px] font-mono uppercase tracking-widest font-bold"
                          style={{ color: layer.c }}
                        >
                          {layer.tg}
                        </p>
                        <h3 className="mt-1 text-[18px] sm:text-[22px] font-bold text-white">
                          Layer {index + 1}: {layer.t}
                        </h3>
                        <p className="mt-2 text-[13px] leading-relaxed text-white/55">
                          {layer.flow}
                        </p>
                      </div>

                      <span className="text-white/30 group-hover:text-white transition-colors text-2xl">
                        →
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="relative z-10 mt-8 rounded-[24px] border border-white/5 bg-black/40 p-5">
              <p className="text-[10px] font-mono text-white/35 uppercase tracking-widest">
                Runtime Flow
              </p>
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                {current.flow.split(" → ").map((item, idx) => (
                  <React.Fragment key={item}>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-[12px] font-mono text-white/75">
                      {item}
                    </div>
                    {idx < current.flow.split(" → ").length - 1 && (
                      <span className="hidden sm:flex items-center text-white/25">→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          <aside className="lg:col-span-5">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-[32px] border border-white/10 bg-[#050505]/60 p-6 sm:p-8 overflow-hidden relative">
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    background: `radial-gradient(circle at 80% 20%, ${current.c}, transparent 40%)`,
                  }}
                />

                <div className="relative z-10">
                  <p
                    className="text-[10px] font-mono uppercase tracking-widest font-bold"
                    style={{ color: current.c }}
                  >
                    {current.tg}
                  </p>

                  <h2 className="mt-3 text-[30px] sm:text-[38px] font-bold text-white leading-tight">
                    {current.t}
                  </h2>

                  <p className="mt-5 text-[15px] leading-8 text-white/60">
                    {current.d}
                  </p>

                  <div className="mt-8 border-t border-white/10 pt-6">
                    <p className="text-[10px] font-mono text-white/35 uppercase tracking-widest mb-4">
                      Core Boundary Properties
                    </p>

                    <div className="space-y-3">
                      {current.s.map((spec) => (
                        <div
                          key={spec}
                          className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.025] px-4 py-3"
                        >
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: current.c }}
                          />
                          <span className="text-[13px] text-white/75 font-mono">
                            {spec}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  ["AES-256", "Memory Lock"],
                  ["mTLS", "Agent Boundary"],
                  ["RBAC", "Policy Scope"],
                  ["Ledger", "Audit Trace"],
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="rounded-[20px] border border-white/10 bg-white/[0.025] p-4"
                  >
                    <p className="text-[18px] font-black text-white">{value}</p>
                    <p className="mt-1 text-[9px] font-mono uppercase tracking-widest text-white/35">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {SPEC_CARDS.map((card) => (
            <div
              key={card.title}
              className="rounded-[24px] border border-white/5 bg-[#050505]/45 p-6 hover:border-[#009DFF]/30 transition-all duration-300"
            >
              <p className="text-[10px] font-mono text-[#009DFF] uppercase tracking-widest font-bold">
                {card.tag}
              </p>
              <h3 className="mt-3 text-[20px] font-bold text-white">
                {card.title}
              </h3>
              <p className="mt-3 text-[13px] leading-7 text-white/55">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-16">
        <PremiumCTA
          title="Request Architecture Review"
          description="Schedule a private technical workshop to review custom multi-agent network boundaries, memory isolation models, and sovereign deployment constraints."
        />
      </div>
    </InnerPageShell>
  );
}