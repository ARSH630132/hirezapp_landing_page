"use client";

import Link from "next/link";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import MotionReveal from "@/components/inner-pages/MotionReveal";
import EnterpriseFlowDiagram from "@/components/inner-pages/EnterpriseFlowDiagram";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";

export default function PlatformsHubPage() {
  const stack = [
    { name: "FACTORY LAYER (Tier 3)", spec: "Scale, Monitor, Operate, Monetize", path: "/platforms/factory" },
    { name: "FOUNDRY LAYER (Tier 2)", spec: "Build Agents, Runtime, Data Fabric, AI Eng", path: "/platforms/foundry" },
    { name: "GARAGE LAYER (Tier 1)", spec: "Discover AI, Workshops, AI Labs, Exp Zone", path: "/platforms/garage" }
  ];

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Productized Assets"
        title="Enterprise Platforms"
        highlightedWord="Platforms"
        description="Sovereign software platform suite to co-create and operate multi-agent systems."
      />
      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-24 space-y-20">
        <MotionReveal className="space-y-6">
          <h2 className="text-2xl font-bold text-white text-center">GFF Operating Stack</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {stack.map((s) => (
              <div key={s.name} className="p-6 rounded-2xl border border-white/5 bg-black/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-bold text-white text-lg">{s.name}</h3>
                  <p className="text-sm text-white/50">{s.spec}</p>
                </div>
                <Link href={s.path} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm border border-white/10 text-white shrink-0">Specs →</Link>
              </div>
            ))}
          </div>
        </MotionReveal>

        <MotionReveal className="space-y-6">
          <h2 className="text-2xl font-bold text-white text-center">Industry Mesh Platforms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {["Finance Sovereign Mesh", "Healthcare Secure Mesh", "Government Sovereign Mesh", "Energy Mesh"].map((mesh) => (
              <div key={mesh} className="p-6 rounded-2xl border border-white/5 bg-black/60">
                <h3 className="font-bold text-white mb-2">{mesh}</h3>
                <p className="text-xs text-white/50 leading-relaxed">Hardened industry-grade compliance mesh layers for secure on-premise execution.</p>
              </div>
            ))}
          </div>
        </MotionReveal>

        <div className="max-w-[1100px] mx-auto space-y-4">
          <h2 className="text-2xl font-bold text-white text-center">Control & Governance</h2>
          <EnterpriseFlowDiagram />
        </div>

        <PremiumCTA
          title="Design Your Multi-Agent Topology"
          description="Consult with GFF systems architects to prototype a private sovereign cluster."
          primaryLabel="Schedule Deep-Dive"
          primaryHref="/contact"
        />
      </div>
    </InnerPageShell>
  );
}