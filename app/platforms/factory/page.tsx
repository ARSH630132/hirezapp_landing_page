"use client";

import { useState, useEffect } from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import MotionReveal from "@/components/inner-pages/MotionReveal";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";

export default function FactoryPage() {
  const [throughput, setThroughput] = useState(412);
  const [latency, setLatency] = useState(118);

  useEffect(() => {
    const interval = setInterval(() => {
      setThroughput((prev) => Math.min(600, Math.max(300, prev + Math.floor(Math.random() * 21) - 10)));
      setLatency((prev) => Math.min(180, Math.max(90, prev + Math.floor(Math.random() * 9) - 4)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Industrialisation Layer"
        title="GFF AI Factory"
        highlightedWord="Factory"
        description="Scale, monitor, operate, and monetize sovereign agent networks at global scale."
     visualType="factory"
      />
      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-24 space-y-16">
        <MotionReveal className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-10 border-y border-white/5">
          <div className="lg:col-span-5">
            {/* <span className="text-xs font-mono text-[#FF3B30] uppercase tracking-widest font-bold">Enterprise Operations</span> */}
            <h2 className="text-3xl font-bold text-white mt-2">The Industrialisation Layer</h2>
          </div>
          <div className="lg:col-span-7">
            <p className="text-white/70 font-light text-sm">
              The Factory is Tier 3 of GFF's Operating Model. It is the mission-critical control tower that handles auto-scaling operations, monitors SLA requirements, executes human-approval loops, and attributes usage costs across business units.
            </p>
          </div>
        </MotionReveal>

        <MotionReveal className="space-y-6">
          <h2 className="text-2xl font-bold text-white text-center">Observability Monitor</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-6 rounded-2xl border border-white/5 bg-black/40 flex flex-col justify-between">
              <span className="text-xs font-mono text-white/40 uppercase">Cluster Throughput</span>
              <span className="text-3xl font-mono font-bold text-[#FF3B30] mt-3">{throughput} t/sec</span>
              <span className="text-[10px] text-white/40 mt-1 uppercase">Active horizontal nodes</span>
            </div>
            <div className="p-6 rounded-2xl border border-white/5 bg-black/40 flex flex-col justify-between">
              <span className="text-xs font-mono text-white/40 uppercase">Median Latency</span>
              <span className="text-3xl font-mono font-bold text-[#FF3B30] mt-3">{latency} ms</span>
              <span className="text-[10px] text-white/40 mt-1 uppercase">Sovereign routing overhead</span>
            </div>
            <div className="p-6 rounded-2xl border border-white/5 bg-black/40 flex flex-col justify-between">
              <span className="text-xs font-mono text-white/40 uppercase">Safety Policy Status</span>
              <span className="text-3xl font-mono font-bold text-green-500 mt-3">100% SECURE</span>
              <span className="text-[10px] text-white/40 mt-1 uppercase">Memory lock active</span>
            </div>
          </div>
        </MotionReveal>

        <MotionReveal className="space-y-6">
          <h2 className="text-2xl font-bold text-white text-center">Factory Core Modules</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Scale", desc: "Horizontal auto-scaling agent clustering with isolated CPU and memory groups." },
              { title: "Monitor", desc: "Real-time SLA telemetry, active compliance auditing, and threat logs." },
              { title: "Operate", desc: "Backup states, Human-in-the-Loop manager approval gates, and hot-updates." },
              { title: "Monetize", desc: "Multi-tenant cost attribution logs, token volume logs, and attribution metrics." }
            ].map((m) => (
              <div key={m.title} className="p-6 rounded-xl border border-white/5 bg-black/40 hover:border-[#FF3B30]/20 transition-all">
                <h3 className="font-bold text-white text-sm mb-2">{m.title}</h3>
                <p className="text-xs text-white/50 leading-relaxed font-light">{m.desc}</p>
              </div>
            ))}
          </div>
        </MotionReveal>

        <PremiumCTA
          title="Architect Your Sovereign Operation"
          description="Schedule a technical consultation to scope, design, and deploy private agent grids with GFF engineers."
          primaryLabel="Contact Systems Engineers"
          primaryHref="/contact"
        />
      </div>
    </InnerPageShell>
  );
}