"use client";

import { useState } from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";
import Carousel from "@/components/inner-pages/Carousel";

const CHALLENGES = [
  { title: "Asset Operations", desc: "Analyzing power plant telemetry manually slows response to critical deviations." },
  { title: "Field Service", desc: "Disconnected dispatch logs and remote sites lead to prolonged maintenance turnaround times." },
  { title: "Regulatory Documentation", desc: "Navigating safety, environmental, and federal compliance rules causes friction." },
  { title: "Grid & Plant Knowledge", desc: "Operational wisdom and standard operating manuals are locked in fragmented PDF handbooks." },
  { title: "Operational Optimization", desc: "Optimizing plant dispatch and load matching dynamically requires significant engineering hours." }
];

const AGENTS = [
  { name: "Asset Operations Agent", role: "Synthesizes power plant telemetry and flags mechanical deviations." },
  { name: "Field Service Copilot", role: "Coordinates technical dispatches, extracts wiring schematics, and drafts checklists." },
  { name: "Document Intelligence Agent", role: "Parses environmental regulations and flags compliance risks instantly." },
  { name: "Knowledge Search Agent", role: "Retrieves localized procedures and operator manuals across remote sites." },
  { name: "Executive Dashboard Agent", role: "Aggregates localized generation stats and maintenance logs." }
];

const OUTCOMES = [
  { title: "Predictive Asset Upkeep", desc: "Identify equipment anomalies and dispatch preventive maintenance orders before mechanical failures disrupt the grid." },
  { title: "Zero-Delay Compliance Search", desc: "Enable compliance managers to instantly verify regional energy policies, reducing regulatory penalty exposure." },
  { title: "Unified Plant Knowledge Access", desc: "Equip room engineers and remote field technicians with immediate access to complex procedural blueprints." }
];


export default function EnergyPage() {
  const [demoOutput, setDemoOutput] = useState("System ready. Select an operational query below to test GFF Control Center.");
  const [running, setRunning] = useState(false);
  const [activeTab, setActiveTab] = useState("gateway");

  const runDemo = (type: "telemetry" | "compliance") => {
    setRunning(true);
    if (type === "telemetry") {
      setDemoOutput("Streaming real-time turbine logs for Substation 4B... Scanning telemetry...");
      setTimeout(() => {
        setDemoOutput("SUCCESS: Substation 4B turbine vibration is within normal range (0.05 mm/s). Mechanical parameters stable.");
        setRunning(false);
      }, 600);
    } else {
      setDemoOutput("Scanning EPA environmental files... Matching emissions data against federal standards...");
      setTimeout(() => {
        setDemoOutput("SUCCESS: Emissions 12% below regional thresholds. Compliance logged in GFF Control Center.");
        setRunning(false);
      }, 600);
    }
  };

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Vertical Solutions"
        title="Energy & Grid Cognitive Systems"
        highlightedWord="Energy"
        description="Deploy real-time plant telemetry processing, field service coordination, and secure compliance search engines under isolated security."
        breadcrumbs={[{ label: "Industries", href: "/industries" }, { label: "Energy" }]}
      />

      <div className="max-w-[1795px] mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-white mb-6">Challenge Landscape</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {CHALLENGES.map((c, i) => (
            <div key={i} className="p-5 rounded-xl border border-white/5 bg-[#050507]/60 hover:border-white/10 transition-all duration-300">
              <span className="text-[#009DFF] font-mono text-xs block mb-2">0{i+1}{"."} {c.title}</span>
              <p className="text-xs text-white/60 leading-relaxed font-light">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[1795px] mx-auto px-6 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-5 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-white mb-4">Enterprise Reference Blueprint</h2>
          <p className="text-xs text-white/70 leading-relaxed font-light mb-6">
            We deploy secure ingestion gateways to capture telemetry streams and regulatory manuals. Workflows are processed by the GFF Control Center.
          </p>
          <div className="space-y-2">
            {[
              { id: "gateway", name: "Sovereign Ingestion Gateway", desc: "Isolates and encrypts real-time SCADA telemetry." },
              { id: "control_center", name: "Control Center Engine", desc: "Coordinates Asset Operations Agents and schedules field maintenance copilots." },
              { id: "governance", name: "Runtime Governance", desc: "Enforces continuous compliance validations with audit-ready logs." }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full p-3 rounded-xl text-left border text-xs transition-all ${
                  activeTab === tab.id ? "bg-white/5 border-white/10 text-white" : "border-transparent text-white/50 hover:text-white"
                }`}
              >
                <span className="font-bold uppercase tracking-wider font-mono">{tab.name}</span>
                {activeTab === tab.id && <p className="text-[11px] text-white/60 leading-normal font-light mt-1">{tab.desc}</p>}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7 p-6 rounded-2xl border border-white/5 bg-[#050507]/40 backdrop-blur-[12px] flex flex-col items-center">
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-4">Interactive Energy Architecture Blueprint</span>
          <div className="w-full max-w-[420px] h-[280px] relative">
            <svg className="w-full h-full" viewBox="0 0 500 340" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M250 40 L250 110 M250 150 L250 200 M250 240 L250 290" stroke="url(#pipeGlow)" strokeWidth="1.5" strokeDasharray="6 4" />
              <g onClick={() => setActiveTab("gateway")} className="cursor-pointer">
                <rect x="100" y="20" width="300" height="40" rx="8" fill={activeTab === "gateway" ? "#009DFF" : "#0A0A0C"} stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
                <text x="250" y="44" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle" className="font-mono">1. SOVEREIGN INGESTION GATEWAY</text>
              </g>
              <g onClick={() => setActiveTab("control_center")} className="cursor-pointer">
                <rect x="80" y="110" width="340" height="40" rx="8" fill={activeTab === "control_center" ? "url(#brandG)" : "#0A0A0C"} stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
                <text x="250" y="134" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle" className="font-mono">2. CONTROL CENTER ENGINE</text>
              </g>
              <g className="opacity-70">
                <rect x="50" y="190" width="400" height="50" rx="8" fill="#050507" stroke="#009DFF" strokeWidth="1" strokeDasharray="4 4" />
                <text x="250" y="212" fill="#009DFF" fontSize="9" fontWeight="bold" textAnchor="middle" className="font-mono">Asset Operations // Field Service // Document Intel</text>
                <text x="250" y="228" fill="white" fontSize="8" textAnchor="middle" className="opacity-60">Cognitive agents dispatching field checklists and turbine audits</text>
              </g>
              <g onClick={() => setActiveTab("governance")} className="cursor-pointer">
                <rect x="100" y="280" width="300" height="40" rx="8" fill={activeTab === "governance" ? "#E4000F" : "#0A0A0C"} stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
                <text x="250" y="304" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle" className="font-mono">3. RUNTIME GOVERNANCE LAYER</text>
              </g>
              <defs>
                <linearGradient id="brandG" x1="0" y1="0" x2="340" y2="0" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#E4000F" />
                  <stop offset="1" stopColor="#009DFF" />
                </linearGradient>
                <linearGradient id="pipeGlow" x1="0" y1="0" x2="0" y2="340" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#E4000F" />
                  <stop offset="0.5" stopColor="#FFFFFF" />
                  <stop offset="1" stopColor="#009DFF" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      <div className="max-w-[1795px] mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-white mb-6">The Energy Agent Map</h2>
        <Carousel
          items={AGENTS.map((a) => ({
            title: a.name,
            tag: "Energy Agent",
            desc: a.role,
            metric: "Latency: <200ms"
          }))}
        />
      </div>

      <div className="max-w-[1795px] mx-auto px-6 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-5 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-white mb-4">Interactive Control Center Simulator</h2>
          <p className="text-xs text-white/70 leading-relaxed font-light mb-6">
            Test the Asset Operations and Document Intelligence modules below. Query telemetry diagnostic anomalies or scan a regional compliance standard safely inside our local sandbox.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => runDemo("telemetry")}
              disabled={running}
              className="px-4 py-2 rounded-full text-xs font-semibold bg-white text-black hover:bg-white/90 disabled:opacity-50 transition-all font-mono"
            >
              {running ? "Processing..." : "Run Telemetry Diagnostics"}
            </button>
            <button
              onClick={() => runDemo("compliance")}
              disabled={running}
              className="px-4 py-2 rounded-full text-xs font-semibold bg-white/5 border border-white/10 hover:bg-white/10 text-white disabled:opacity-50 transition-all font-mono"
            >
              {running ? "Processing..." : "Search Compliance Documents"}
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 p-5 rounded-xl border border-white/5 bg-black/40 min-h-[160px] flex flex-col justify-between font-mono relative overflow-hidden">
          <span className="text-[10px] text-[#009DFF] block border-b border-white/5 pb-2 uppercase tracking-wider font-bold font-mono">GFF CONTROL CENTER STATUS LOG</span>
          <p className="text-xs text-green-400 mt-3 leading-relaxed font-mono">{demoOutput}</p>
          {/* <span className="text-[9px] text-white/30 text-right block pt-3 font-mono">SOVEREIGN RUNTIME // EN-4B-GRID</span> */}
        </div>
      </div>

      <div className="max-w-[1795px] mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-white mb-6">Structural Outcomes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {OUTCOMES.map((o, i) => (
            <div key={i} className="p-5 rounded-xl border border-white/5 bg-[#050507]/60 hover:border-white/10 transition-all duration-300">
              <h3 className="text-xs font-mono font-bold text-white uppercase mb-2 tracking-wider">{o.title}</h3>
              <p className="text-xs text-white/60 leading-relaxed font-light">{o.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[1795px] mx-auto px-6 pb-16 border-t border-white/5 pt-12">
        <h3 className="text-xs font-mono text-white/40 uppercase tracking-widest mb-4">Related Capabilities & Platforms</h3>
        <div className="flex flex-wrap gap-3">
          {["GFF Control Center", "Foundational Ingestion", "Marketplace Blueprints", "Private Vector Memory", "Sovereign Governance"].map((cap, i) => (
            <span key={i} className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/70 font-mono">{cap}</span>
          ))}
        </div>
      </div>

      <div className="max-w-[1795px] mx-auto px-6 pb-16">
        <PremiumCTA
          title="Secure Your Energy Infrastructure Operations"
          description="Schedule a technical workspace review with our grid architects to secure telemetry streams, isolate standard operating manuals, and deploy secure sandbox environments."
          primaryLabel="Connect with GFF AI"
          primaryHref="/contact"
        />
      </div>
    </InnerPageShell>
  );
}


