"use client";

import { useState } from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";
import Carousel from "@/components/inner-pages/Carousel";

const CHALLENGES = [
  { title: "Field Operations", desc: "Uncoordinated standard operating procedures across disconnected, remote extraction sites slow cycle times and operational safety handoffs." },
  { title: "Safety Workflows", desc: "Delayed lookup of local safety regulations, incident checklists, and hazard logs increases site liability risks." },
  { title: "Asset Visibility", desc: "Latent monitoring of heavy extraction machinery health, telemetry metrics, and parts availability triggers unexpected failures." },
  { title: "Remote Site Knowledge Access", desc: "Low-bandwidth environments prevent remote shaft engineers from instantly retrieving critical technical standard operating books." },
  { title: "Operational Reporting", desc: "Consolidating daily shift logs, drill output summaries, and ore grade logs manually requires substantial engineering resources." }
];

const AGENTS = [
  { name: "Field Operations Agent", role: "Coordinates remote-site tasks, matches heavy machinery work orders, and formats daily drill performance logs." },
  { name: "Safety Knowledge Agent", role: "Provides instant conversational lookup of critical mining safety bylaws, hazard logs, and emergency checklists in low-bandwidth sandboxes." },
  { name: "Executive Dashboard Agent", role: "Aggregates production outputs, machine telemetry alerts, and remote-site KPIs into an immutable operational audit stream." }
];

const OUTCOMES = [
  { title: "Zero-Delay Safety Auditing", desc: "Empower site managers to instantly verify safety compliance, reducing hazard exposure and maintaining regulatory standards." },
  { title: "Predictive Machine Upkeep", desc: "Detect machine anomalies and dispatch replacement work orders before heavy equipment failure disrupts extraction timelines." },
  { title: "Low-Bandwidth Knowledge Access", desc: "Ensure remote field engineers retain constant access to equipment specs and operating guides, even in isolated subterranean shafts." }
];

export default function MiningPage() {
  const [demoOutput, setDemoOutput] = useState("System ready. Select an OREMesh field task to simulate.");
  const [running, setRunning] = useState(false);
  const [activeTab, setActiveTab] = useState("orchestrator");

  const runDemo = (type: "safety" | "asset") => {
    setRunning(true);
    if (type === "safety") {
      setDemoOutput("Querying deep-shaft ventilation standards for Site #4... Searching OREMesh compliance index...");
      setTimeout(() => {
        setDemoOutput("SUCCESS: Safety check resolved. Shaft #4 requires a minimum flow rate of 350 m³/min. Guidelines verified under Bureau of Safety rules.");
        setRunning(false);
      }, 600);
    } else {
      setDemoOutput("Scanning heavy loader hydraulic pressure telemetry for Site #4... Checking pressure thresholds...");
      setTimeout(() => {
        setDemoOutput("WARNING: Loader #409 pressure drop of 12% detected. Field Operations Agent generated preventive maintenance ticket.");
        setRunning(false);
      }, 600);
    }
  };

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Vertical Solutions"
        title="Enterprise Extraction & Mining"
        highlightedWord="Mining"
        visualType="miningExtraction"
        description="Deploy field operations support, automated safety compliance audits, and real-time remote site asset visibility over high-reliability OREMesh platforms."
        breadcrumbs={[{ label: "Industries", href: "/industries" }, { label: "Mining" }]}
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
      {/* Reference Solution */}
      <div className="max-w-[1795px] mx-auto px-6 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-5 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-white mb-4">Reference Solution</h2>
          <p className="text-xs text-white/70 leading-relaxed font-light mb-6">
            Our OREMesh platform architecture links remote extraction networks with natural language routing layers. By leveraging Field Operations and Safety Knowledge Agents, extraction leads can fetch hazard reports and audit heavy machinery performance without latency or high bandwidth constraints.
          </p>
          <div className="space-y-2">
            {[
              { id: "gateway", name: "OREMesh Data Gateway", desc: "Aggregates edge machine diagnostics, haul-truck telemetry, and shift logs." },
              { id: "orchestrator", name: "OREMesh Cognitive Router", desc: "Coordinates low-bandwidth natural language search and remote-site safety alerts." },
              { id: "audit", name: "Site Operations Hub", desc: "Tracks daily geological grade reports, machinery upkeep orders, and hazard checklist logs." }
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

        {/* Interactive SVG Architecture */}
        <div className="lg:col-span-7 p-6 rounded-2xl border border-white/5 bg-[#050507]/40 backdrop-blur-[12px] flex flex-col items-center">
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-4">OREMesh Architecture Blueprint</span>
          <div className="w-full max-w-[420px] h-[280px] relative">
            <svg className="w-full h-full" viewBox="0 0 500 340" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M250 40 L250 110 M250 150 L250 200 M250 240 L250 290" stroke="url(#pipeGlow)" strokeWidth="1.5" strokeDasharray="6 4" />
              <g onClick={() => setActiveTab("gateway")} className="cursor-pointer">
                <rect x="100" y="20" width="300" height="40" rx="8" fill={activeTab === "gateway" ? "#009DFF" : "#0A0A0C"} stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
                <text x="250" y="44" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">1. OREMESH DATA GATEWAY</text>
              </g>
              <g onClick={() => setActiveTab("orchestrator")} className="cursor-pointer">
                <rect x="80" y="110" width="340" height="40" rx="8" fill={activeTab === "orchestrator" ? "url(#brandG)" : "#0A0A0C"} stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
                <text x="250" y="134" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">2. OREMESH COGNITIVE ROUTER</text>
              </g>
              <g className="opacity-70">
                <rect x="50" y="190" width="400" height="50" rx="8" fill="#050507" stroke="#009DFF" strokeWidth="1" strokeDasharray="4 4" />
                <text x="250" y="210" fill="#009DFF" fontSize="9" fontWeight="bold" textAnchor="middle">Field Operations // Safety Knowledge // Executive Dashboard</text>
                <text x="250" y="228" fill="white" fontSize="8" textAnchor="middle" className="opacity-60">Executing telemetry-audited extraction loops across edge stations</text>
              </g>
              <g onClick={() => setActiveTab("audit")} className="cursor-pointer">
                <rect x="100" y="280" width="300" height="40" rx="8" fill={activeTab === "audit" ? "#E4000F" : "#0A0A0C"} stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
                <text x="250" y="304" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">3. SITE OPERATIONS HUB</text>
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

      {/* Agent Map Carousel */}
      <div className="max-w-[1795px] mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-white mb-6">The Mining Agent Map</h2>
        <Carousel
          items={AGENTS.map((a) => ({
            title: a.name,
            tag: "Mining Agent",
            desc: a.role,
            metric: "Bandwidth: Low-BW (Edge)"
          }))}
        />
      </div>

      {/* Interactive Simulator */}
      <div className="max-w-[1795px] mx-auto px-6 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-5 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-white mb-4">Interactive OREMesh Simulator</h2>
          <p className="text-xs text-white/70 leading-relaxed font-light mb-6">
            Test our safety compliance and mechanical monitoring loops. Query a critical deep-shaft safety standard or run an asset health telemetry audit across remote, low-bandwidth mine sites.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => runDemo("safety")}
              disabled={running}
              className="px-4 py-2 rounded-full text-xs font-semibold bg-white text-black hover:bg-white/90 disabled:opacity-50 transition-all"
            >
              {running ? "Querying..." : "Query Safety Bylaws"}
            </button>
            <button
              onClick={() => runDemo("asset")}
              disabled={running}
              className="px-4 py-2 rounded-full text-xs font-semibold bg-white/5 border border-white/10 hover:bg-white/10 text-white disabled:opacity-50 transition-all"
            >
              {running ? "Auditing..." : "Run Asset Health Audit"}
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 p-5 rounded-xl border border-white/5 bg-black/40 min-h-[160px] flex flex-col justify-between font-mono relative overflow-hidden">
          <span className="text-[10px] text-[#009DFF] block border-b border-white/5 pb-2 uppercase tracking-wider font-bold">OREMESH SYSTEM LOGS</span>
          <p className="text-xs text-green-400 mt-3 leading-relaxed font-mono">{demoOutput}</p>
          {/* <span className="text-[9px] text-white/30 text-right block pt-3">OREMESH CONTROLLER // SITE #4</span> */}
        </div>
      </div>

      {/* Outcome Levers */}
      <div className="max-w-[1795px] mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-white mb-6">Structural Outcomes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {OUTCOMES.map((o, i) => (
            <div key={i} className="p-5 rounded-xl border border-white/5 bg-[#050507]/60 hover:border-white/10 transition-all">
              <h3 className="text-xs font-mono font-bold text-white uppercase mb-2 tracking-wider">{o.title}</h3>
              <p className="text-xs text-white/60 leading-relaxed font-light">{o.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Related Capabilities */}
      <div className="max-w-[1795px] mx-auto px-6 pb-16 border-t border-white/5 pt-12">
        <h3 className="text-xs font-mono text-white/40 uppercase tracking-widest mb-4">Related Capabilities & Platforms</h3>
        <div className="flex flex-wrap gap-3">
          {["OREMesh Platform", "Edge Machine Gateway", "Enterprise Mining Core", "GFF AI Academy", "Low-Bandwidth Router"].map((cap, i) => (
            <span key={i} className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/70 font-mono">{cap}</span>
          ))}
        </div>
      </div>

      {/* Premium CTA */}
      <div className="max-w-[1795px] mx-auto px-6 pb-16">
        <PremiumCTA
          title="Secure Your Extraction Operations"
          description="Schedule a technical engineering assessment with our mining systems leads to secure your low-bandwidth remote-site links and deploy sovereign sandboxes."
          primaryLabel="Connect with GFF AI"
          primaryHref="/contact"
        />
      </div>

    </InnerPageShell>
  );
}