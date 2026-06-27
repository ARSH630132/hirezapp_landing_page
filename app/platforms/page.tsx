"use client";

import Link from "next/link";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import MotionReveal from "@/components/inner-pages/MotionReveal";
import EnterpriseFlowDiagram from "@/components/inner-pages/EnterpriseFlowDiagram";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";

export default function PlatformsHubPage() {
const stack = [
  { name: "Garage", spec: "Discovery, workshops, AI labs, and experiment zones.", path: "/platforms/garage" },
  { name: "Foundry", spec: "Agent building, runtime design, data fabric, and AI engineering.", path: "/platforms/foundry" },
  { name: "Factory", spec: "Production scaling, monitoring, operations, and monetization.", path: "/platforms/factory" },
  { name: "Blueprint", spec: "Build a custom AI blueprint and readiness roadmap.", path: "/build/blueprint" },
  { name: "Marketplace", spec: "Explore reusable agents, templates, and platform assets.", path: "/platforms/marketplace" },
  { name: "Control Center", spec: "Govern, monitor, and control enterprise AI operations.", path: "/platforms/control-center" },
  { name: "AI Academy", spec: "Structured AI learning, enablement, and adoption programs.", path: "/platforms/ai-academy" },
  { name: "University OneVerse", spec: "AI platform layer for university operations and learning ecosystems.", path: "/platforms/university-oneverse" },
  { name: "Assessment Mesh", spec: "Evaluate readiness, workflows, governance, and AI maturity.", path: "/platforms/assessment-mesh" },
  { name: "OREMesh", spec: "Sovereign edge mesh for offline-first mining and remote operations.", path: "/platforms/oremesh" },
  { name: "RetailMesh", spec: "Omnichannel register ingestion and retail operations support.", path: "/platforms/retailmesh" },
  { name: "TelecomVerse", spec: "Carrier-grade signaling, automation, and field dispatch intelligence.", path: "/platforms/telecomverse" },
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: "OREMesh Edge Platform", desc: "Sovereign edge mesh for offline-first extraction and remote mining site dispatches.", path: "/platforms/oremesh" },
              { name: "RetailMesh Platform", desc: "Omnichannel high-availability register ingestion and retail support networks.", path: "/platforms/retailmesh" },
              { name: "TelecomVerse Core", desc: "Carrier-grade high-throughput optical signaling and field dispatch automation.", path: "/platforms/telecomverse" }
            ].map((mesh) => (
              <Link key={mesh.name} href={mesh.path} className="p-6 rounded-2xl border border-white/5 bg-black/60 hover:border-white/12 hover:bg-white/[0.02] transition-all block">
                <h3 className="font-bold text-white mb-2 flex items-center justify-between">
                  <span>{mesh.name}</span>
                  <span className="text-xs text-[#009DFF] font-mono font-bold">Specs →</span>
                </h3>
                <p className="text-xs text-white/50 leading-relaxed">{mesh.desc}</p>
              </Link>
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