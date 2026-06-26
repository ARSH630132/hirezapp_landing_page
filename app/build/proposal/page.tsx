"use client";

import { useState } from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";

export default function ProposalStudioPage() {
  const [scope, setScope] = useState("Enterprise Core Topology");
  const [budget, setBudget] = useState("$100k-$500k");
  const [compliance, setCompliance] = useState("SOC2 Hardened");
  const [exporting, setExporting] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const handleExport = (type: string) => {
    setExporting(type);
    setMsg(null);
    setTimeout(() => {
      setExporting(null);
      setMsg(`Algorithmic ${type} compiled in memory. Deliverables validated for compliance.`);
    }, 1000);
  };

  const cards = [
    { id: "sow", l: "Statement of Work (SOW)", d: "Formal legal and operational framework detailing service levels, security perimeters, and deliverables.", f: "SOW_Sovereign.pdf", c: "#009DFF" },
    { id: "ppt", l: "Executive Pitch Deck", d: "Strategic slide deck designed for leadership boards to illustrate ROI multipliers and cost saves.", f: "Board_Pitch.pptx", c: "#9D00FF" },
    { id: "nodes", l: "Architecture Blueprints", d: "Detailed technical schema maps outlining vector databases and Supervisor DAG topologies.", f: "DAG_Specs.pdf", c: "#E4000F" }
  ];

  return (
    <InnerPageShell>
      <InnerPageHero category="Interactive SOW Studio" title="Sovereign SOW Proposal Studio" highlightedWord="Proposal Studio" description="Instantly compile and preview strategic Statement of Work, slide-deck presentations, and architectural blueprints tailored to your organization." />

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-24 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 p-6 rounded-2xl border border-white/5 bg-[#04060b] space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono border-b border-white/5 pb-2">Scope Parameters</h3>
            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-white/50 uppercase">Scope Target</label>
                <select value={scope} onChange={(e) => { setScope(e.target.value); setMsg(null); }} className="w-full h-10 rounded-lg border border-white/10 bg-black text-white px-3 focus:border-[#009DFF] outline-none">
                  <option value="Enterprise Core Topology">Enterprise Core DAG Topology</option>
                  <option value="Local Compliance Mesh">Local Compliance Edge Mesh</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-white/50 uppercase">Budget Target</label>
                <select value={budget} onChange={(e) => { setBudget(e.target.value); setMsg(null); }} className="w-full h-10 rounded-lg border border-white/10 bg-black text-white px-3 focus:border-[#009DFF] outline-none">
                  <option value="$100k-$500k">$100k - $500k Tier</option>
                  <option value="$500k-$2M">$500k - $2M Tier</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-white/50 uppercase">Compliance Perimeter</label>
                <select value={compliance} onChange={(e) => { setCompliance(e.target.value); setMsg(null); }} className="w-full h-10 rounded-lg border border-white/10 bg-black text-white px-3 focus:border-[#009DFF] outline-none">
                  <option value="SOC2">SOC2 Type II Hardware Enclave</option>
                  <option value="HIPAA">HIPAA Private Subnet</option>
                </select>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono border-b border-white/5 pb-2">Downloadable Proposal Packages</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {cards.map((card) => (
                <div key={card.id} className="p-5 rounded-2xl border border-white/5 bg-[#030304]/80 flex flex-col justify-between hover:border-white/10 transition duration-300 relative group min-h-[260px]">
                  <div className="space-y-2">
                    <span className="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded" style={{ color: card.c, backgroundColor: `${card.c}10`, border: `1px solid ${card.c}20` }}>PREVIEW FILE</span>
                    <h4 className="text-xs font-bold text-white mt-3">{card.l}</h4>
                    <p className="text-[10px] text-white/50 leading-relaxed font-light">{card.d}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
                    <span className="text-[8px] font-mono text-white/30 block">FILENAME: {card.f}</span>
                    <button onClick={() => handleExport(card.l)} disabled={exporting !== null} className="w-full h-9 rounded-lg text-[10px] font-bold text-white border transition bg-white/5 border-white/10 hover:bg-white/10 disabled:opacity-50">
                      {exporting === card.l ? "Compiling..." : "Simulate Export"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {msg && (
              <div className="p-4 rounded-xl bg-[#00FF9D]/5 border border-[#00FF9D]/15 text-[11px] text-[#00FF9D] font-light leading-relaxed animate-fadeIn">
                <span className="font-bold uppercase font-mono block text-[9px] mb-1">Algorithmic Compiler Success</span>
                {msg}
              </div>
            )}
          </div>
        </div>

        <PremiumCTA />
      </div>
    </InnerPageShell>
  );
}