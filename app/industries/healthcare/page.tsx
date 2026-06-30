"use client";

import { useState } from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";
import Carousel from "@/components/inner-pages/Carousel";

const CHALLENGES = [
  { title: "Operational Complexity", desc: "Clinician fatigue, administrative overhead, and delayed patient transitions." },
  { title: "Patient Communications", desc: "Non-clinical scheduling bottlenecks and manual follow-ups strain care teams." },
  { title: "Staff Knowledge Access", desc: "Clinical guidelines scattered across fragmented internal databases." },
  { title: "Administrative Burden", desc: "Heavy documentation requirements and EHR entry overhead." },
  { title: "Compliance Boundaries", desc: "Strict HIPAA & PHI safety regulations requiring isolated data pipelines." }
];

const AGENTS = [
  { name: "Care Operations Copilot", role: "Synthesizes discharge timelines and coordinates non-clinical workflows." },
  { name: "Knowledge Search Agent", role: "Locates precise internal hospital bylaws and policy sheets." },
  { name: "Document Intelligence Agent", role: "Pre-processes incoming insurance claims and pre-authorizations." },
  { name: "Scheduling Assistant", role: "Coordinates clinic slots and dynamic physician shift updates." },
  { name: "Executive Dashboard Agent", role: "Aggregates anonymous operational KPIs and bed occupancy metrics." }
];

const OUTCOMES = [
  { title: "Administrative Velocity", desc: "Drastically reduce time spent compiling administrative pre-authorization packets." },
  { title: "Staff Cognitive Relief", desc: "Provide care teams with an instant, unified operational knowledge index." },
  { title: "PHI Security Guardrails", desc: "Isolate text pipelines through high-security airgapped gateways with zero-retention." }
];

export default function HealthcarePage() {
  const [demoOutput, setDemoOutput] = useState("System ready. Select a workflow to simulate.");
  const [running, setRunning] = useState(false);
  const [activeTab, setActiveTab] = useState("orchestrator");

  const runDemo = (type: "preauth" | "knowledge") => {
    setRunning(true);
    if (type === "preauth") {
      setDemoOutput("Parsing administrative pre-auth request... Verifying PPI therapy logs...");
      setTimeout(() => {
        setDemoOutput("SUCCESS: Documented 6-week therapy matches protocol. Pre-auth compiled.");
        setRunning(false);
      }, 500);
    } else {
      setDemoOutput("Scanning Hospital Policy Bylaws... Searching outpatient discharge accompaniment rules...");
      setTimeout(() => {
        setDemoOutput("RESULT: Outpatient sedation requires an adult discharge escort. Policy Book v4.2.");
        setRunning(false);
      }, 500);
    }
  };

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Vertical Solutions"
        title="Enterprise Healthcare Cognitive Systems"
        highlightedWord="Healthcare"
        visualType="healthcareCognitive"
        description="Deploy high-security, HIPAA-aligned cognitive routing layers to automate complex administrative workflows, unify internal knowledge, and streamline non-clinical operations."
        breadcrumbs={[{ label: "Industries", href: "/industries" }, { label: "Healthcare" }]}
      />

      {/* Challenge Landscape */}
      <div className="max-w-[1795px] mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-white mb-6">Challenge Landscape</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {CHALLENGES.map((c, i) => (
            <div key={i} className="p-5 rounded-xl border border-white/5 bg-[#050507]/60">
              <span className="text-[#009DFF] font-mono text-xs block mb-2">0{i+1}{"."} {c.title}</span>
              <p className="text-xs text-white/60 leading-relaxed font-light">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[1795px] mx-auto px-6 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-5 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-white mb-4">Reference Solution</h2>
          <p className="text-xs text-white/70 leading-relaxed font-light mb-6">
            Connecting medical systems of record with natural language orchestrators requires secure, airgapped boundaries. Our reference solution routes non-clinical inquiries through isolated cognitive layers, ensuring patient records are scrubbed of PHI before any agent processing.
          </p>
          <div className="space-y-2">
            {[
              { id: "gateway", name: "PHI Scrubbing Gateway", desc: "Zero-retention proxy cleans data of HIPAA identifiers." },
              { id: "orchestrator", name: "Cognitive Care Orchestrator", desc: "Semantic routing engine directs operational intents." },
              { id: "audit", name: "Immutable Care Logs", desc: "Every search is recorded in high-security, tamper-evident audit logs." }
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
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-4">Interactive Healthcare Architecture Blueprint</span>
          <div className="w-full max-w-[420px] h-[280px] relative">
            <svg className="w-full h-full" viewBox="0 0 500 340" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M250 40 L250 110 M250 150 L250 200 M250 240 L250 290" stroke="url(#pipeGlow)" strokeWidth="1.5" strokeDasharray="6 4" />
              <g onClick={() => setActiveTab("gateway")} className="cursor-pointer">
                <rect x="100" y="20" width="300" height="40" rx="8" fill={activeTab === "gateway" ? "#009DFF" : "#0A0A0C"} stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
                <text x="250" y="44" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">1. SECURE EHR GATEWAY (HIPAA-ALIGNMENT)</text>
              </g>
              <g onClick={() => setActiveTab("orchestrator")} className="cursor-pointer">
                <rect x="80" y="110" width="340" height="40" rx="8" fill={activeTab === "orchestrator" ? "url(#brandG)" : "#0A0A0C"} stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
                <text x="250" y="134" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">2. COGNITIVE CARE ORCHESTRATOR</text>
              </g>
              <g className="opacity-70">
                <rect x="50" y="190" width="400" height="50" rx="8" fill="#050507" stroke="#009DFF" strokeWidth="1" strokeDasharray="4 4" />
                <text x="250" y="210" fill="#009DFF" fontSize="9" fontWeight="bold" textAnchor="middle">Care Copilots // Knowledge Search // Document Intelligence</text>
                <text x="250" y="228" fill="white" fontSize="8" textAnchor="middle" className="opacity-60">Executing administrative tasks inside secured runtime environments</text>
              </g>
              <g onClick={() => setActiveTab("audit")} className="cursor-pointer">
                <rect x="100" y="280" width="300" height="40" rx="8" fill={activeTab === "audit" ? "#E4000F" : "#0A0A0C"} stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
                <text x="250" y="304" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">3. IMMUTABLE CARE AUDIT TRAIL</text>
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
        <h2 className="text-2xl font-bold text-white mb-6">The Healthcare Agent Map</h2>
        <Carousel
          items={AGENTS.map((a) => ({
            title: a.name,
            tag: "Healthcare Agent",
            desc: a.role,
            metric: "Latency: <150ms"
          }))}
        />
      </div>

      <div className="max-w-[1795px] mx-auto px-6 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-5 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-white mb-4">Interactive Care Operations Simulator</h2>
          <p className="text-xs text-white/70 leading-relaxed font-light mb-6">
            Test our Document Intelligence and Knowledge Search engines. Simulate real-time parsing of pre-authorization requests and guideline queries safely.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => runDemo("preauth")}
              disabled={running}
              className="px-4 py-2 rounded-full text-xs font-semibold bg-white text-black hover:bg-white/90 disabled:opacity-50 transition-all"
            >
              {running ? "Executing..." : "Pre-auth Document Check"}
            </button>
            <button
              onClick={() => runDemo("knowledge")}
              disabled={running}
              className="px-4 py-2 rounded-full text-xs font-semibold bg-white/5 border border-white/10 hover:bg-white/10 text-white disabled:opacity-50 transition-all"
            >
              {running ? "Searching..." : "Hospital Guidelines Search"}
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 p-5 rounded-xl border border-white/5 bg-black/40 min-h-[160px] flex flex-col justify-between font-mono relative overflow-hidden">
          <span className="text-[10px] text-[#009DFF] block border-b border-white/5 pb-2 uppercase tracking-wider font-bold">KNOWLEDGE RETRIEVAL LOG</span>
          <p className="text-xs text-green-400 mt-3 leading-relaxed font-mono">{demoOutput}</p>
          <span className="text-[9px] text-white/30 text-right block pt-3">GFF HEALTHCARE PORTAL</span>
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
          title="Architect Your Hospital's Cognitive Tier"
          description="Schedule a technical workspace review to design isolated EHR connections, vector knowledge grids, and pre-auth pipelines under complete sandboxed compliance."
          primaryLabel="Talk to GFF Systems Architect"
          primaryHref="/contact"
        />
      </div>
    </InnerPageShell>
  );
}
