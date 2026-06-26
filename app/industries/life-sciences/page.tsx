"use client";

import { useState } from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";
import Carousel from "@/components/inner-pages/Carousel";

const CHALLENGES = [
  { title: "Research Documentation", desc: "Manually digesting and indexing lab notes, compound dossiers, and intellectual property files." },
  { title: "Regulatory Workflows", desc: "Sifting through FDA and EMA guidance changes and cross-referencing complex submissions." },
  { title: "Knowledge Management", desc: "Scientific knowledge buried in scattered folders and proprietary data formats." },
  { title: "Trial Operations Support", desc: "Tracking patient enrollment dropouts, trial site backlogs, and protocol deviations." },
  { title: "Cross-Functional Collaboration", desc: "Bridging communication and research handoffs between clinical, legal, and manufacturing teams." }
];

const AGENTS = [
  { name: "Research Knowledge Agent", role: "Indexes deep clinical journals, compound dossiers, and intellectual assets." },
  { name: "Regulatory Document Assistant", role: "Unifies checklists for compliance structures, formatting draft submission books." },
  { name: "Trial Operations Copilot", role: "Monitors trial site enrollment metrics, flagging bottleneck sites." },
  { name: "Contract Intelligence Agent", role: "Audits joint development agreements, patent filings, and supplier specs." }
];

const OUTCOMES = [
  { title: "R&D Discovery Speed", desc: "Empower research teams to retrieve multi-modal literature summaries in seconds instead of days." },
  { title: "Submission Streamlining", desc: "Draft and structure regulatory pre-submission packets against dynamic global checklists." },
  { title: "Operational Visibility", desc: "Gain real-time foresight into site-level trial enrollment anomalies to optimize timelines." }
];

export default function LifeSciencesPage() {
  const [demoOutput, setDemoOutput] = useState("System ready. Select an operational query below to simulate.");
  const [running, setRunning] = useState(false);
  const [activeTab, setActiveTab] = useState("orchestrator");

  const runDemo = (type: "trial" | "reg") => {
    setRunning(true);
    if (type === "trial") {
      setDemoOutput("Querying clinical trial ops metrics for Site #104... Checking enrollment drops...");
      setTimeout(() => {
        setDemoOutput("SUCCESS: Identified Berlin Site #104 is 15% behind enrollment targets. Generating site-balancing recommendations...");
        setRunning(false);
      }, 500);
    } else {
      setDemoOutput("Scanning CMC dossier draft against latest FDA pre-submission checklist...");
      setTimeout(() => {
        setDemoOutput("RESULT: Audit complete. chemistry/manufacturing/controls data has been parsed. Missing cross-reference on section 4.3 flagged.");
        setRunning(false);
      }, 500);
    }
  };

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Vertical Solutions"
        title="Cognitive Compute for Life Sciences"
        highlightedWord="Life Sciences"
        description="Accelerate regulatory compilation, secure compound search, and trial operations with sovereign, high-throughput cognitive architectures."
        breadcrumbs={[{ label: "Industries", href: "/industries" }, { label: "Life Sciences" }]}
      />

      {/* Challenge Landscape */}
      <div className="max-w-[1795px] mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-white mb-6">Challenge Landscape</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {CHALLENGES.map((c, i) => (
            <div key={i} className="p-5 rounded-xl border border-white/5 bg-[#050507]/60">
              <span className="text-[#009DFF] font-mono text-xs block mb-2">0{i+1} {"//"} {c.title}</span>
              <p className="text-xs text-white/60 leading-relaxed font-light">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[1795px] mx-auto px-6 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-5 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-white mb-4">Reference Solution</h2>
          <p className="text-xs text-white/70 leading-relaxed font-light mb-6">
            Life sciences research requires strict separation between raw experimental datasets, trial metadata, and external agency interfaces. Our reference solution creates secure sandbox boundaries for search operations, document parsing, and audit trails.
          </p>
          <div className="space-y-2">
            {[
              { id: "gateway", name: "Sovereign Search Gateway", desc: "Retrieves literature and compound data through vector structures." },
              { id: "orchestrator", name: "Trial & Regulatory Router", desc: "Routes documentation tasks to secure pre-configured agents." },
              { id: "audit", name: "Immutable Audit Registry", desc: "Records compound searches and regulatory pre-assessments." }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full p-3 rounded-xl text-left border text-xs transition-all ${
                  activeTab === tab.id ? "bg-white/5 border-white/10 text-white" : "border-transparent text-white/50 hover:text-white"
                }`}
              >
                <span className="font-bold uppercase tracking-wider">{tab.name}</span>
                {activeTab === tab.id && <p className="text-[11px] text-white/60 leading-normal font-light mt-1">{tab.desc}</p>}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7 p-6 rounded-2xl border border-white/5 bg-[#050507]/40 backdrop-blur-[12px] flex flex-col items-center">
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-4">Interactive Life Sciences Architecture Blueprint</span>
          <div className="w-full max-w-[420px] h-[280px] relative">
            <svg className="w-full h-full" viewBox="0 0 500 340" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M250 40 L250 110 M250 150 L250 200 M250 240 L250 290" stroke="url(#pipeGlow)" strokeWidth="1.5" strokeDasharray="6 4" />
              <g onClick={() => setActiveTab("gateway")} className="cursor-pointer">
                <rect x="100" y="20" width="300" height="40" rx="8" fill={activeTab === "gateway" ? "#009DFF" : "#0A0A0C"} stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
                <text x="250" y="44" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">1. SOVEREIGN SEARCH GATEWAY</text>
              </g>
              <g onClick={() => setActiveTab("orchestrator")} className="cursor-pointer">
                <rect x="80" y="110" width="340" height="40" rx="8" fill={activeTab === "orchestrator" ? "url(#brandG)" : "#0A0A0C"} stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
                <text x="250" y="134" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">2. REGULATORY & TRIAL ROUTER</text>
              </g>
              <g className="opacity-70">
                <rect x="50" y="190" width="400" height="50" rx="8" fill="#050507" stroke="#009DFF" strokeWidth="1" strokeDasharray="4 4" />
                <text x="250" y="210" fill="#009DFF" fontSize="9" fontWeight="bold" textAnchor="middle">Research Knowledge // Regulatory Document Agents // Trial Ops</text>
                <text x="250" y="228" fill="white" fontSize="8" textAnchor="middle" className="opacity-60">Executing computation inside sandboxed security boundaries</text>
              </g>
              <g onClick={() => setActiveTab("audit")} className="cursor-pointer">
                <rect x="100" y="280" width="300" height="40" rx="8" fill={activeTab === "audit" ? "#E4000F" : "#0A0A0C"} stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
                <text x="250" y="304" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">3. SECURE PHARMA AUDIT REGISTRY</text>
              </g>
              <defs>
                <linearGradient id="brandG" x1="0" y1="0" x2="340" y2="0" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#E4000F" /><stop offset="1" stopColor="#009DFF" />
                </linearGradient>
                <linearGradient id="pipeGlow" x1="0" y1="0" x2="0" y2="340" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#E4000F" /><stop offset="0.5" stopColor="#FFFFFF" /><stop offset="1" stopColor="#009DFF" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      <div className="max-w-[1795px] mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-white mb-6">The Life Sciences Agent Map</h2>
        <Carousel
          items={AGENTS.map((a) => ({
            title: a.name,
            tag: "Life Sciences Agent",
            desc: a.role,
            metric: "Latency: <140ms"
          }))}
        />
      </div>

      <div className="max-w-[1795px] mx-auto px-6 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-5 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-white mb-4">Interactive Trial & Regulatory Simulator</h2>
          <p className="text-xs text-white/70 leading-relaxed font-light mb-6">
            Execute mock search routines across preclinical catalogs or review trial site enrollment balances inside an ephemeral, non-persisted workspace.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => runDemo("trial")}
              disabled={running}
              className="px-4 py-2 rounded-full text-xs font-semibold bg-white text-black hover:bg-white/90 disabled:opacity-50 transition-all"
            >
              {running ? "Simulating..." : "Audit Trial Operations"}
            </button>
            <button
              onClick={() => runDemo("reg")}
              disabled={running}
              className="px-4 py-2 rounded-full text-xs font-semibold bg-white/5 border border-white/10 hover:bg-white/10 text-white disabled:opacity-50 transition-all"
            >
              {running ? "Scanning..." : "Check FDA Submission Guide"}
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 p-5 rounded-xl border border-white/5 bg-black/40 min-h-[160px] flex flex-col justify-between font-mono relative overflow-hidden">
          <span className="text-[10px] text-[#009DFF] block border-b border-white/5 pb-2 uppercase tracking-wider font-bold">SIMULATION LOGS</span>
          <p className="text-xs text-green-400 mt-3 leading-relaxed font-mono">{demoOutput}</p>
          <span className="text-[9px] text-white/30 text-right block pt-3">GFF LIFE SCIENCES WORKSPACE // SANDBOX MODE</span>
        </div>
      </div>

      <div className="max-w-[1795px] mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-white mb-6">Structural ROI & Outcome Levers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {OUTCOMES.map((o, i) => (
            <div key={i} className="p-5 rounded-xl border border-white/5 bg-[#050507]/60 hover:border-white/10 transition-all">
              <h3 className="text-xs font-mono font-bold text-white uppercase mb-2 tracking-wider">{o.title}</h3>
              <p className="text-xs text-white/60 leading-relaxed font-light">{o.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[1795px] mx-auto px-6 pb-16 border-t border-white/5 pt-12">
        <h3 className="text-xs font-mono text-white/40 uppercase tracking-widest mb-4">Related Capabilities & Platforms</h3>
        <div className="flex flex-wrap gap-3">
          {["Sovereign Memory Store", "Foundry Core Gateway", "Agentic Security Sandboxes", "University OneVerse Network", "GFF AI Academy"].map((cap, i) => (
            <span key={i} className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/70 font-mono">{cap}</span>
          ))}
        </div>
      </div>

      <div className="max-w-[1795px] mx-auto px-6 pb-16">
        <PremiumCTA
          title="Blueprint Sovereign Life Sciences Infrastructure"
          description="Schedule a technical consultation with our engineering team to outline cleanroom environments, HIPAA-aligned vector indices, and submission-drafting copilots."
          primaryLabel="Talk to GFF Systems Architect"
          primaryHref="/contact"
        />
      </div>
    </InnerPageShell>
  );
}
