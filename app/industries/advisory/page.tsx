"use client";
import { useState } from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";
import Carousel from "@/components/inner-pages/Carousel";

const CHALLENGES = [
  { title: "Research Acceleration", desc: "Synthesizing macroeconomic data and technical specs." },
  { title: "Proposal Development", desc: "Aggregating credentials and schedules under tight deadlines." },
  { title: "Knowledge Reuse", desc: "Locating historical deliverables and papers across legacies." },
  { title: "Delivery Operations", desc: "Managing resource assignments, milestones, and workstreams." },
  { title: "Executive Reporting", desc: "Consolidating performance metrics and stakeholder updates." }
];

const AGENTS = [
  { name: "Advisory Copilot", role: "Assists teams by drafting methodologies and credentials." },
  { name: "Advisory Research Agent", role: "Performs secure searches to index industrial trends." },
  { name: "Proposal Copilot", role: "Formats RFP responses from capability documents." },
  { name: "Delivery Operations Agent", role: "Monitors milestones, budgets, and resource allocation." },
  { name: "Executive Dashboard Agent", role: "Synthesizes multi-project metrics into clear updates." }
];

export default function AdvisoryPage() {
  const [log, setLog] = useState("System ready. Select a task.");
  const [running, setRunning] = useState(false);

  const runDemo = (type: string) => {
    setRunning(true);
    setLog(type === "proposal" ? "Retrieving credentials..." : "Compiling progress brief...");
    setTimeout(() => {
      setLog(type === "proposal" ? "DRAFT GENERATED: Formatted Section 3.1." : "BRIEF COMPLETE: Consolidated active workstreams.");
      setRunning(false);
    }, 400);
  };

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Vertical Solutions"
        title="Enterprise Advisory Performance Layers"
        highlightedWord="Advisory"
        description="Accelerate research, streamline delivery operations, and scale proposal pipelines using private enterprise copilots."
        breadcrumbs={[{ label: "Industries", href: "/industries" }, { label: "Advisory" }]}
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
        <h2 className="text-xl font-bold text-white mb-4">The Advisory Agent Map</h2>
        <Carousel items={AGENTS.map((a) => ({ title: a.name, tag: "Advisory Agent", desc: a.role, metric: "Secure Hub" }))} />
      </div>
      <div className="max-w-[1795px] mx-auto px-6 pb-12 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-6">
          <h2 className="text-xl font-bold text-white mb-3">Interactive Advisory Simulator</h2>
          <p className="text-xs text-white/60 leading-relaxed mb-4">Simulate operational consulting workflows inside high-fidelity sandboxes.</p>
          <div className="flex gap-2">
            <button onClick={() => runDemo("proposal")} disabled={running} className="px-4 py-2 rounded-full text-xs font-semibold bg-white text-black">Draft RFP</button>
            <button onClick={() => runDemo("brief")} disabled={running} className="px-4 py-2 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-white">Compile Brief</button>
          </div>
        </div>
        <div className="lg:col-span-6 p-4 rounded-xl border border-white/5 bg-black/40 min-h-[120px] flex flex-col justify-between font-mono">
          <span className="text-[9px] text-white/40 block border-b border-white/5 pb-1 uppercase tracking-wider">ADVISORY LOGS</span>
          <p className="text-xs text-[#009DFF] my-2">{log}</p>
          <span className="text-[8px] text-white/30 text-right">ADVISORY // COGNITIVE CORE</span>
        </div>
      </div>
      <div className="max-w-[1795px] mx-auto px-6 pb-12">
        <h2 className="text-xl font-bold text-white mb-4">Outcome Levers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-white/5 bg-[#050507]/60">
            <h3 className="text-xs font-bold text-white uppercase mb-1">Proposal Velocity</h3>
            <p className="text-xs text-white/60 leading-relaxed">Scale draft response quality by instantly mapping credentials.</p>
          </div>
          <div className="p-4 rounded-xl border border-white/5 bg-[#050507]/60">
            <h3 className="text-xs font-bold text-white uppercase mb-1">Delivery Excellence</h3>
            <p className="text-xs text-white/60 leading-relaxed">Unify project metrics and maintain standard execution across practices.</p>
          </div>
          <div className="p-4 rounded-xl border border-white/5 bg-[#050507]/60">
            <h3 className="text-xs font-bold text-white uppercase mb-1">Unstructured Search</h3>
            <p className="text-xs text-white/60 leading-relaxed">Capture insights from historical decks, PDFs, and client workshops.</p>
          </div>
        </div>
      </div>
      <div className="max-w-[1795px] mx-auto px-6 pb-12">
        <PremiumCTA title="Build AI for Your Practice" description="Consult with our engineers to map custom sandbox deployments." primaryLabel="Connect with GFF AI" primaryHref="/contact" />
      </div>
    </InnerPageShell>
  );
}
