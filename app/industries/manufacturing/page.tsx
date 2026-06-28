"use client";

import { useState } from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";
import Carousel from "@/components/inner-pages/Carousel";

const CHALLENGES = [
  { title: "Production Visibility", desc: "Decoupled SCADA, MES, and ERP systems obscure operational efficiency and block real-time yield optimization." },
  { title: "Maintenance Workflows", desc: "Reactive maintenance loops result in unexpected downtime, parts backlog, and manual technician routing bottlenecks." },
  { title: "Quality Management", desc: "Manual inspection audits and fragmented defect logs delay compliance validation and standard correction loops." },
  { title: "Supplier Coordination", desc: "Inefficient supplier coordination, unaligned delivery schedules, and complex procurement specifications increase lead times." },
  { title: "Operational Knowledge Transfer", desc: "Bridging the knowledge gap between veteran plant operators and new technicians leads to operational latency and error risks." }
];

const AGENTS = [
  { name: "Maintenance Copilot", role: "Monitors factory sensor streams, flags performance degradation, and generates field repair guides." },
  { name: "Quality Intelligence Agent", role: "Analyzes assembly camera feeds and defect logs to trigger instant compliance alerts and non-conformance reports." },
  { name: "Procurement Copilot", role: "Monitors supplier delivery schedules, flags logistics discrepancies, and audits material compliance." }
];

const OUTCOMES = [
  { title: "Reduced Assembly Downtime", desc: "Automate anomaly detection and repair dispatch before micro-stoppages cascade into line-wide outages." },
  { title: "Standardized Defect Mitigation", desc: "Accelerate non-conformance loops through real-time quality audits, ensuring compliance with global manufacturing regulations." },
  { title: "Seamless Knowledge Retention", desc: "Preserve decades of machine-specific operating procedures, translating manual notes into high-speed mobile technician guidance." }
];

export default function ManufacturingPage() {
  const [demoOutput, setDemoOutput] = useState("System ready. Select a control center task to simulate.");
  const [running, setRunning] = useState(false);
  const [activeTab, setActiveTab] = useState("orchestrator");

  const runDemo = (type: "telemetry" | "quality") => {
    setRunning(true);
    if (type === "telemetry") {
      setDemoOutput("Analyzing vibration spikes on Line 4 Lathe... Accessing Maintenance Copilot telemetry...");
      setTimeout(() => {
        setDemoOutput("WARNING: Bearing temp at 92°C (threshold: 85°C). Maintenance Copilot generated Work Order #8204. Scheduled replacement.");
        setRunning(false);
      }, 600);
    } else {
      setDemoOutput("Scanning Quality Control logs for batch #M-402... Running compliance check...");
      setTimeout(() => {
        setDemoOutput("SUCCESS: Batch #M-402 passes all QA tolerance checks. ISO-9001 quality certificate generated.");
        setRunning(false);
      }, 600);
    }
  };

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Vertical Solutions"
        title="Industrial Manufacturing Solutions"
        highlightedWord="Manufacturing"
        description="Deploy real-time factory floor cognitive systems, automated maintenance routing, and supplier orchestration layers on safe, high-availability computing infrastructure."
        breadcrumbs={[{ label: "Industries", href: "/industries" }, { label: "Manufacturing" }]}
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
            Our industrial framework unifies SCADA, MES, and ERP datasets. By marrying telemetry streams with cognitive search, factory managers instantly extract diagnostic insights and automate maintenance orders without manual translation delays.
          </p>
          <div className="space-y-2">
            {[
              { id: "gateway", name: "Industrial Ingestion Engine", desc: "Aggregates raw PLC and SCADA sensor telemetry securely at the edge." },
              { id: "orchestrator", name: "Cognitive Factory Orchestrator", desc: "Routes operations queries and alert states directly to active agent workflows." },
              { id: "audit", name: "Factory Control Center", desc: "Consolidates work orders, supplier specs, and ISO compliance logs." }
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
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-4">Factory Mesh Architecture Blueprint</span>
          <div className="w-full max-w-[420px] h-[280px] relative">
            <svg className="w-full h-full" viewBox="0 0 500 340" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M250 40 L250 110 M250 150 L250 200 M250 240 L250 290" stroke="url(#pipeGlow)" strokeWidth="1.5" strokeDasharray="6 4" />
              <g onClick={() => setActiveTab("gateway")} className="cursor-pointer">
                <rect x="100" y="20" width="300" height="40" rx="8" fill={activeTab === "gateway" ? "#009DFF" : "#0A0A0C"} stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
                <text x="250" y="44" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">1. INDUSTRIAL INGESTION ENGINE</text>
              </g>
              <g onClick={() => setActiveTab("orchestrator")} className="cursor-pointer">
                <rect x="80" y="110" width="340" height="40" rx="8" fill={activeTab === "orchestrator" ? "url(#brandG)" : "#0A0A0C"} stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
                <text x="250" y="134" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">2. COGNITIVE FACTORY ORCHESTRATOR</text>
              </g>
              <g className="opacity-70">
                <rect x="50" y="190" width="400" height="50" rx="8" fill="#050507" stroke="#009DFF" strokeWidth="1" strokeDasharray="4 4" />
                <text x="250" y="210" fill="#009DFF" fontSize="9" fontWeight="bold" textAnchor="middle">Maintenance Copilot // Quality Intelligence // Procurement Copilot</text>
                <text x="250" y="228" fill="white" fontSize="8" textAnchor="middle" className="opacity-60">Executing machine-level automation loops in secure containers</text>
              </g>
              <g onClick={() => setActiveTab("audit")} className="cursor-pointer">
                <rect x="100" y="280" width="300" height="40" rx="8" fill={activeTab === "audit" ? "#E4000F" : "#0A0A0C"} stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
                <text x="250" y="304" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">3. FACTORY CONTROL CENTER</text>
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
        <h2 className="text-2xl font-bold text-white mb-6">The Manufacturing Agent Map</h2>
        <Carousel
          items={AGENTS.map((a) => ({
            title: a.name,
            tag: "Manufacturing Agent",
            desc: a.role,
            metric: "Response Time: <200ms"
          }))}
        />
      </div>

      {/* Interactive Simulator */}
      <div className="max-w-[1795px] mx-auto px-6 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-5 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-white mb-4">Interactive Factory Control Center Simulator</h2>
          <p className="text-xs text-white/70 leading-relaxed font-light mb-6">
            Interact with our Maintenance and Quality Intelligence loops. Trigger a live vibration telemetry query or run a digital quality standard audit across isolated manufacturing pipelines.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => runDemo("telemetry")}
              disabled={running}
              className="px-4 py-2 rounded-full text-xs font-semibold bg-white text-black hover:bg-white/90 disabled:opacity-50 transition-all"
            >
              {running ? "Analyzing..." : "Simulate Telemetry Spike"}
            </button>
            <button
              onClick={() => runDemo("quality")}
              disabled={running}
              className="px-4 py-2 rounded-full text-xs font-semibold bg-white/5 border border-white/10 hover:bg-white/10 text-white disabled:opacity-50 transition-all"
            >
              {running ? "Auditing..." : "Run Quality Standard Audit"}
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 p-5 rounded-xl border border-white/5 bg-black/40 min-h-[160px] flex flex-col justify-between font-mono relative overflow-hidden">
          <span className="text-[10px] text-[#009DFF] block border-b border-white/5 pb-2 uppercase tracking-wider font-bold">CONTROL CENTER SYSTEM STREAM</span>
          <p className="text-xs text-green-400 mt-3 leading-relaxed font-mono">{demoOutput}</p>
          {/* <span className="text-[9px] text-white/30 text-right block pt-3">FACTORYMESH CONTROLLER // LINE 4 PORTAL</span> */}
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
          {["Factory Control Center", "Sovereign IoT Hub", "Enterprise Data Core", "GFF AI Academy", "Predictive Guardrails"].map((cap, i) => (
            <span key={i} className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/70 font-mono">{cap}</span>
          ))}
        </div>
      </div>

      {/* Premium CTA */}
      <div className="max-w-[1795px] mx-auto px-6 pb-16">
        <PremiumCTA
          title="Optimize Your Manufacturing Pipeline"
          description="Schedule a technical architecture review with our industrial automation engineers to secure your edge SCADA interfaces and deploy agent sandboxes."
          primaryLabel="Connect with GFF AI"
          primaryHref="/contact"
        />
      </div>

    </InnerPageShell>
  );
}