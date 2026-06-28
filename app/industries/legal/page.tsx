"use client";
import { useState } from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";
import Carousel from "@/components/inner-pages/Carousel";

const CHALLENGES = [
  { title: "Contract Review", desc: "Locating outliers, liabilities, and non-standard clauses across agreements." },
  { title: "Matter Knowledge", desc: "Synthesizing decades of litigation records and case archives across networks." },
  { title: "Document Intelligence", desc: "Extracting precise definitions, key dates, and indemnities from dense PDFs." },
  { title: "Research Workflows", desc: "Cross-referencing statutory frameworks, precedents, and regulatory briefs." },
  { title: "Risk Review", desc: "Identifying compliance deviations, governance slips, or outdated templates." }
];

const AGENTS = [
  { name: "Contract Intelligence Agent", role: "Audits agreements and flags liability cap anomalies." },
  { name: "Legal Knowledge Search Agent", role: "Performs absolute-accuracy searches across litigation portfolios." },
  { name: "Matter Assistant", role: "Drafts matter briefs and organizes core file indexes." }
];

export default function LegalPage() {
  const [log, setLog] = useState("System ready. Select a query option.");
  const [running, setRunning] = useState(false);

  const runDemo = (type: string) => {
    setRunning(true);
    setLog(type === "contract" ? "Auditing contract liability..." : "Scanning case archives...");
    setTimeout(() => {
      setLog(type === "contract" ? "FLAGGED: Liability cap exceeds limit. Drafted adjustment." : "SUCCESS: Found 3 Delaware non-compete precedents.");
      setRunning(false);
    }, 400);
  };

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Vertical Solutions"
        title="Enterprise Legal Document Intelligence"
        highlightedWord="Legal"
        description="Deploy secure corporate memory networks and private legal research workflows to analyze matters, contracts, and compliance risk."
        breadcrumbs={[{ label: "Industries", href: "/industries" }, { label: "Legal" }]}
      />
      <div className="max-w-[1795px] mx-auto px-6 pb-12">
        <h2 className="text-xl font-bold text-white mb-6">Challenge Landscape</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {CHALLENGES.map((c, i) => (
            <div key={i} className="p-4 rounded-xl border border-white/5 bg-[#050507]/60">
              <span className="text-[#E4000F] font-mono text-xs block mb-1">0{i+1}{"."} {c.title}</span>
              <p className="text-[11px] text-white/60 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="max-w-[1795px] mx-auto px-6 pb-12">
        <h2 className="text-xl font-bold text-white mb-4">The Legal Agent Map</h2>
        <Carousel items={AGENTS.map((a) => ({ title: a.name, tag: "Legal Agent", desc: a.role, metric: "On-Prem Memory" }))} />
      </div>
      <div className="max-w-[1795px] mx-auto px-6 pb-12 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-6">
          <h2 className="text-xl font-bold text-white mb-3">Interactive Legal Sandbox</h2>
          <p className="text-xs text-white/60 leading-relaxed mb-4">Simulate contract and matter review. No data is stored outside the active session.</p>
          <div className="flex gap-2">
            <button onClick={() => runDemo("contract")} disabled={running} className="px-4 py-2 rounded-full text-xs font-semibold bg-white text-black">Audit Liability</button>
            <button onClick={() => runDemo("precedent")} disabled={running} className="px-4 py-2 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-white">Search Precedents</button>
          </div>
        </div>
        <div className="lg:col-span-6 p-4 rounded-xl border border-white/5 bg-black/40 min-h-[120px] flex flex-col justify-between font-mono">
          <span className="text-[9px] text-white/40 block border-b border-white/5 pb-1 uppercase tracking-wider">REPOSITORIES</span>
          <p className="text-xs text-green-400 my-2">{log}</p>
          {/* <span className="text-[8px] text-white/30 text-right">LEGAL CONTEXT // MEMORY</span> */}
        </div>
      </div>
      <div className="max-w-[1795px] mx-auto px-6 pb-12">
        <h2 className="text-xl font-bold text-white mb-4">Outcome Levers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-white/5 bg-[#050507]/60">
            <h3 className="text-xs font-bold text-white uppercase mb-1">Contract Mitigation</h3>
            <p className="text-xs text-white/60 leading-relaxed">Flag non-standard provisions and liability deviations across deal rooms.</p>
          </div>
          <div className="p-4 rounded-xl border border-white/5 bg-[#050507]/60">
            <h3 className="text-xs font-bold text-white uppercase mb-1">Matter Synthesis</h3>
            <p className="text-xs text-white/60 leading-relaxed">Construct comprehensive chronological timelines of complex litigations.</p>
          </div>
          <div className="p-4 rounded-xl border border-white/5 bg-[#050507]/60">
            <h3 className="text-xs font-bold text-white uppercase mb-1">Sovereign Control</h3>
            <p className="text-xs text-white/60 leading-relaxed">Ensure isolation of confidential brief documents inside your network border.</p>
          </div>
        </div>
      </div>
      <div className="max-w-[1795px] mx-auto px-6 pb-12">
        <PremiumCTA title="Architect Your Private Legal Memory Layer" description="Map your document classification loops and secure air-gapped sandboxes." primaryLabel="Connect with GFF AI" primaryHref="/contact" />
      </div>
    </InnerPageShell>
  );
}
