"use client";
import { useState } from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";
import Carousel from "@/components/inner-pages/Carousel";

const CHALLENGES = [
  { title: "Evidence Collection", desc: "Digesting heterogeneous document trails, logs, and system snapshots." },
  { title: "Documentation Review", desc: "Sifting through checklists and folders without single-schema formats." },
  { title: "Risk Assessment", desc: "Analyzing records and identifying anomaly gaps retroactively." },
  { title: "Workflow Consistency", desc: "Standardizing review parameters across global offices." },
  { title: "Knowledge Retrieval", desc: "Accessing auditing guidance, GAAP/IFRS, and sample reports." }
];

const AGENTS = [
  { name: "Evidence Review Agent", role: "Indexes unstructured evidence records inside isolated sandboxes." },
  { name: "Audit Knowledge Assistant", role: "Retrieves context from global GAAP/IFRS standards." },
  { name: "Risk Review Agent", role: "Scans ledger items and flags anomalies for human review." }
];

export default function AuditPage() {
  const [log, setLog] = useState("System ready. Select a query option.");
  const [running, setRunning] = useState(false);

  const runDemo = (type: string) => {
    setRunning(true);
    setLog(type === "evidence" ? "Evidence Review: Processing files..." : "GAAP Check: Scanning ASC 842...");
    setTimeout(() => {
      setLog(type === "evidence" ? "SUCCESS: Classified statements. No leaks." : "RESULT: Flagged 1 anomaly. GAAP ASC-842.");
      setRunning(false);
    }, 400);
  };

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Vertical Solutions"
        title="Enterprise Audit Cognitive Infrastructure"
        highlightedWord="Audit"
        description="Deploy secure, read-only sovereign agent systems to augment professional audit workflows."
        breadcrumbs={[{ label: "Industries", href: "/industries" }, { label: "Audit" }]}
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
        <h2 className="text-xl font-bold text-white mb-4">The Audit Agent Map</h2>
        <Carousel items={AGENTS.map((a) => ({ title: a.name, tag: "Audit Suite Agent", desc: a.role, metric: "Isolated Runtime" }))} />
      </div>
      <div className="max-w-[1795px] mx-auto px-6 pb-12 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-6">
          <h2 className="text-xl font-bold text-white mb-3">Interactive Audit Simulator</h2>
          <p className="text-xs text-white/60 leading-relaxed mb-4">Execute local, non-persistent simulations of audit cognitive steps inside secure browser contexts.</p>
          <div className="flex gap-2">
            <button onClick={() => runDemo("evidence")} disabled={running} className="px-4 py-2 rounded-full text-xs font-semibold bg-white text-black">Simulate Evidence Review</button>
            <button onClick={() => runDemo("gaap")} disabled={running} className="px-4 py-2 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-white">Check GAAP Reference</button>
          </div>
        </div>
        <div className="lg:col-span-6 p-4 rounded-xl border border-white/5 bg-black/40 min-h-[120px] flex flex-col justify-between font-mono">
          <span className="text-[9px] text-white/40 block border-b border-white/5 pb-1 uppercase tracking-wider">AUDIT LOGS</span>
          <p className="text-xs text-green-400 my-2">{log}</p>
          {/* <span className="text-[8px] text-white/30 text-right">AUDIT SYSTEM // SANDBOX</span> */}
        </div>
      </div>
      <div className="max-w-[1795px] mx-auto px-6 pb-12">
        <h2 className="text-xl font-bold text-white mb-4">Outcome Levers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-white/5 bg-[#050507]/60">
            <h3 className="text-xs font-bold text-white uppercase mb-1">Indexing Speed</h3>
            <p className="text-xs text-white/60 leading-relaxed">Reduce file categorization and checks from days to near-instantaneous search.</p>
          </div>
          <div className="p-4 rounded-xl border border-white/5 bg-[#050507]/60">
            <h3 className="text-xs font-bold text-white uppercase mb-1">Checklist Consistency</h3>
            <p className="text-xs text-white/60 leading-relaxed">Enforce programmatic consistency across client record sets, flagging anomalies instantly.</p>
          </div>
          <div className="p-4 rounded-xl border border-white/5 bg-[#050507]/60">
            <h3 className="text-xs font-bold text-white uppercase mb-1">Verification Log</h3>
            <p className="text-xs text-white/60 leading-relaxed">Maintain solid, compliant transaction traces, preserving human oversight.</p>
          </div>
        </div>
      </div>
      <div className="max-w-[1795px] mx-auto px-6 pb-12">
        <PremiumCTA title="Architect Your Private Audit Cognitive Layer" description="Consult with GFF AI systems engineers to outline secure document mirrors and sandboxes." primaryLabel="Consult with GFF AI" primaryHref="/contact" />
      </div>
    </InnerPageShell>
  );
}
