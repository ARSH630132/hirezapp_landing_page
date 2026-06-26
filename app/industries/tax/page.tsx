"use client";
import { useState } from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";
import Carousel from "@/components/inner-pages/Carousel";

const CHALLENGES = [
  { title: "Document-Heavy Workflows", desc: "Processing corporate schedules, K-1s, and general ledgers." },
  { title: "Knowledge Search", desc: "Navigating shifting state and federal tax laws and treaty details." },
  { title: "Advisory Support", desc: "Aggregating complex histories to draft research memos." },
  { title: "Compliance Tracking", desc: "Monitoring filing calendars and regional tax revisions." },
  { title: "Client Response Time", desc: "Addressing time-sensitive inquiries and gathering documents." }
];

const AGENTS = [
  { name: "Tax Knowledge Agent", role: "Queries tax codes and regional regulatory updates." },
  { name: "Compliance Assistant", role: "Traces dynamic filing checklists to preempt deadlines." },
  { name: "Document Intelligence Agent", role: "Parses dense schedules and unstructured tables." }
];

export default function TaxPage() {
  const [log, setLog] = useState("System ready. Select a query option.");
  const [running, setRunning] = useState(false);

  const runDemo = (type: string) => {
    setRunning(true);
    setLog(type === "code" ? "Searching tax regulations..." : "Restructuring asset schedule...");
    setTimeout(() => {
      setLog(type === "code" ? "FOUND: Code Sec. 163(j). Limit is 30% of adjusted taxable income." : "SUCCESS: Extracted 140 entries from schedules. Reconciled.");
      setRunning(false);
    }, 400);
  };

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Vertical Solutions"
        title="Sovereign Tax Intelligence Architectures"
        highlightedWord="Tax"
        description="Integrate high-accuracy document intelligence layers and dynamic compliance search networks over secure corporate records."
        breadcrumbs={[{ label: "Industries", href: "/industries" }, { label: "Tax" }]}
      />
      <div className="max-w-[1795px] mx-auto px-6 pb-12">
        <h2 className="text-xl font-bold text-white mb-6">Challenge Landscape</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {CHALLENGES.map((c, i) => (
            <div key={i} className="p-4 rounded-xl border border-white/5 bg-[#050507]/60">
              <span className="text-[#009DFF] font-mono text-xs block mb-1">0{i+1} {"//"} {c.title}</span>
              <p className="text-[11px] text-white/60 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="max-w-[1795px] mx-auto px-6 pb-12">
        <h2 className="text-xl font-bold text-white mb-4">The Tax Agent Map</h2>
        <Carousel items={AGENTS.map((a) => ({ title: a.name, tag: "Tax Suite Agent", desc: a.role, metric: "Secure Ingestion" }))} />
      </div>
      <div className="max-w-[1795px] mx-auto px-6 pb-12 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-6">
          <h2 className="text-xl font-bold text-white mb-3">Interactive Tax Sandbox</h2>
          <p className="text-xs text-white/60 leading-relaxed mb-4">Simulate secure, read-only queries of corporate records and tax codes inside sandboxes.</p>
          <div className="flex gap-2">
            <button onClick={() => runDemo("code")} disabled={running} className="px-4 py-2 rounded-full text-xs font-semibold bg-white text-black">Query Tax Code</button>
            <button onClick={() => runDemo("doc")} disabled={running} className="px-4 py-2 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-white">Parse Document</button>
          </div>
        </div>
        <div className="lg:col-span-6 p-4 rounded-xl border border-white/5 bg-black/40 min-h-[120px] flex flex-col justify-between font-mono">
          <span className="text-[9px] text-white/40 block border-b border-white/5 pb-1 uppercase tracking-wider">TAX SANDBOX LOGS</span>
          <p className="text-xs text-[#009DFF] my-2">{log}</p>
          <span className="text-[8px] text-white/30 text-right">TAX CONTEXT // SANDBOX</span>
        </div>
      </div>
      <div className="max-w-[1795px] mx-auto px-6 pb-12">
        <h2 className="text-xl font-bold text-white mb-4">Outcome Levers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-white/5 bg-[#050507]/60">
            <h3 className="text-xs font-bold text-white uppercase mb-1">Processing Speed</h3>
            <p className="text-xs text-white/60 leading-relaxed">Extract and reconcile data from complex schedules without manual intervention.</p>
          </div>
          <div className="p-4 rounded-xl border border-white/5 bg-[#050507]/60">
            <h3 className="text-xs font-bold text-white uppercase mb-1">Compliance Safety</h3>
            <p className="text-xs text-white/60 leading-relaxed">Map updates across regional codes preemptively, minimizing filing errors.</p>
          </div>
          <div className="p-4 rounded-xl border border-white/5 bg-[#050507]/60">
            <h3 className="text-xs font-bold text-white uppercase mb-1">Knowledge Access</h3>
            <p className="text-xs text-white/60 leading-relaxed">Index historic briefs and memorandum files to scale consulting response times.</p>
          </div>
        </div>
      </div>
      <div className="max-w-[1795px] mx-auto px-6 pb-12">
        <PremiumCTA title="Architect Your Private Tax Intelligence Layer" description="Consult with GFF AI systems engineers to map your document ingestion loops." primaryLabel="Connect with GFF AI" primaryHref="/contact" />
      </div>
    </InnerPageShell>
  );
}
