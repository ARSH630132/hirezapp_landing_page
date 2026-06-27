"use client";

import { useState, useEffect } from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import MotionReveal from "@/components/inner-pages/MotionReveal";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";

export default function ScalePage() {
  const [regions, setRegions] = useState(12);
  const [agents, setAgents] = useState(1240);
  const [syncStatus, setSyncStatus] = useState("Ready to propagate templates.");

  useEffect(() => {
    const interval = setInterval(() => {
      setRegions((prev) => Math.min(24, Math.max(8, prev + Math.floor(Math.random() * 3) - 1)));
      setAgents((prev) => Math.min(1800, Math.max(900, prev + Math.floor(Math.random() * 81) - 40)));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const runScaleSync = () => {
    setSyncStatus("Preparing rollout package...");
    setTimeout(() => {
      setSyncStatus("[Scale] Template propagation started.\n[Region Mesh] Policies synchronized.\n[Status] Enterprise rollout ready.");
    }, 400);
  };

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Expansion Layer"
        title="GFF AI Scale"
        highlightedWord="Scale"
        description="Propagate proven agent templates across departments, geographies, and hybrid enterprise environments."
      />

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-24 space-y-16">
        <MotionReveal className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-10 border-y border-white/5">
          <div className="lg:col-span-5">
            <span className="text-xs font-mono text-[#FF3B30] uppercase tracking-widest font-bold">
              Enterprise Expansion
            </span>
            <h2 className="text-3xl font-bold text-white mt-2">
              The Expansion Layer
            </h2>
          </div>

          <div className="lg:col-span-7">
            <p className="text-white/70 font-light leading-relaxed text-sm">
              Scale is the final expansion layer of GFF's Operating Model. It extends validated agent systems beyond a single team or pilot, standardizing rollout across departments, regions, business units, and hybrid cloud environments.
            </p>
          </div>
        </MotionReveal>

        <MotionReveal className="space-y-6">
          <h2 className="text-2xl font-bold text-white text-center">
            Scale Deployment Monitor
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-6 rounded-2xl border border-white/5 bg-black/40 flex flex-col justify-between">
              <span className="text-xs font-mono text-white/40 uppercase">
                Active Regions
              </span>
              <span className="text-3xl font-mono font-bold text-[#FF3B30] mt-3">
                {regions}
              </span>
              <span className="text-[10px] text-white/40 mt-1 uppercase">
                synchronized deployment zones
              </span>
            </div>

            <div className="p-6 rounded-2xl border border-white/5 bg-black/40 flex flex-col justify-between">
              <span className="text-xs font-mono text-white/40 uppercase">
                Agent Fleet Size
              </span>
              <span className="text-3xl font-mono font-bold text-[#FF3B30] mt-3">
                {agents}
              </span>
              <span className="text-[10px] text-white/40 mt-1 uppercase">
                active enterprise agents
              </span>
            </div>

            <div className="p-6 rounded-2xl border border-white/5 bg-black/40 flex flex-col justify-between">
              <span className="text-xs font-mono text-white/40 uppercase">
                Template Integrity
              </span>
              <span className="text-3xl font-mono font-bold text-green-500 mt-3">
                100%
              </span>
              <span className="text-[10px] text-white/40 mt-1 uppercase">
                policy version locked
              </span>
            </div>
          </div>
        </MotionReveal>

        <MotionReveal className="space-y-6 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center">
            Rollout Control Console
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-black/40 p-6 rounded-2xl border border-white/5">
            <div className="space-y-4">
              {[
                "Department Rollout",
                "Regional Expansion",
                "Hybrid Cloud Propagation",
              ].map((item) => (
                <div
                  key={item}
                  className="p-4 rounded-xl border border-white/5 bg-white/[0.02]"
                >
                  <h3 className="text-sm font-bold text-white">{item}</h3>
                  <p className="text-xs text-white/50 mt-1 leading-relaxed font-light">
                    Apply validated templates with controlled governance, cost routing, and operational safeguards.
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-[#04060b] rounded-xl border border-white/10 p-5 flex flex-col justify-between min-h-[220px]">
              <span className="text-[10px] font-mono text-white/40">
                Scale Trace Output
              </span>

              <pre className="font-mono text-xs text-white/70 leading-relaxed whitespace-pre-wrap my-4 flex-grow font-light">
                {syncStatus}
              </pre>

              <button
                type="button"
                onClick={runScaleSync}
                className="w-full py-2 rounded bg-[#FF3B30]/10 border border-[#FF3B30]/20 text-xs font-bold text-[#FF3B30] hover:bg-[#FF3B30]/20 transition-all"
              >
                Run Scale Sync
              </button>
            </div>
          </div>
        </MotionReveal>

        <MotionReveal className="space-y-6">
          <h2 className="text-2xl font-bold text-white text-center">
            Scale Core Modules
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Template Propagation",
                desc: "Reuse proven agent blueprints across teams without rebuilding from scratch.",
              },
              {
                title: "Regional Deployment",
                desc: "Expand validated systems across geographies while preserving local compliance boundaries.",
              },
              {
                title: "Fleet Governance",
                desc: "Manage versioning, policy locks, access permissions, and rollout approvals centrally.",
              },
              {
                title: "Performance Scaling",
                desc: "Maintain SLA performance as workloads grow across departments and hybrid clouds.",
              },
            ].map((m) => (
              <div
                key={m.title}
                className="p-6 rounded-xl border border-white/5 bg-black/40 hover:border-[#FF3B30]/20 transition-all"
              >
                <h3 className="font-bold text-white text-sm mb-2">{m.title}</h3>
                <p className="text-xs text-white/50 leading-relaxed font-light">
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </MotionReveal>

        <PremiumCTA
          title="Expand Your Proven Agent Systems"
          description="Ready to scale validated agent templates across departments, geographies, and enterprise environments?"
          primaryLabel="Plan Scale Rollout"
          primaryHref="/contact"
        />
      </div>
    </InnerPageShell>
  );
}