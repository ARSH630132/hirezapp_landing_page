"use client";

import { useState } from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";

export default function MarketplacePage() {
  const [activated, setActivated] = useState<Record<string, boolean>>({});

  const items = [
    { id: "auditor", name: "Sovereign Compliance Guard", desc: "Runs continuous, real-time scans on active cloud database schemas to prevent credential leakage.", category: "Security" },
    { id: "sap", name: "ERP Freight Sync Agent", desc: "Directly re-routes inland shipping and port logistics pipelines via custom SAP system integration.", category: "Logistics" },
    { id: "digest", name: "Quarterly Executive Digest", desc: "Compiles fragmented departmental CSV streams into executive slide decks automatically.", category: "Finance" },
    { id: "sla", name: "SLA Evaluator Node", desc: "Monitors non-production cluster compute workloads to automatically down-scale on off-peak hours.", category: "Infrastructure" }
  ];

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Interactive Tool"
        title="Secure Neural Registry"
        description="Browse and deploy pre-validated multi-agent pipeline templates and policy guardrail modules to your local cluster sandbox."
      />
      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-24 space-y-8">
        <h3 className="text-sm font-bold text-white/40 uppercase tracking-wider">Available Modules</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.id} className="p-6 rounded-2xl border border-white/10 bg-[#04060b] flex flex-col justify-between h-[240px]">
              <div>
                <span className="px-2 py-0.5 rounded text-[9px] bg-[#0186E4]/10 text-[#0186E4] border border-[#0186E4]/25 uppercase font-bold">{item.category}</span>
                <h4 className="mt-3 text-sm font-bold text-white">{item.name}</h4>
                <p className="mt-2 text-xs text-white/50 leading-relaxed line-clamp-3">{item.desc}</p>
              </div>
              <button
                onClick={() => setActivated((p) => ({ ...p, [item.id]: true }))}
                className={`w-full h-[34px] rounded-lg text-xs font-semibold transition-all ${
                  activated[item.id] ? "bg-[#00FF9D]/10 text-[#00FF9D] border border-[#00FF9D]/20" : "bg-[#0186E4] text-white hover:bg-[#0186E4]/80"
                }`}
              >
                {activated[item.id] ? "✓ Active in Sandbox" : "Deploy Sandbox"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </InnerPageShell>
  );
}
