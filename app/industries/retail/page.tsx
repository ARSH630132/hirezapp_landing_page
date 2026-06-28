"use client";

import { useState } from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";
import Carousel from "@/components/inner-pages/Carousel";

const CHALLENGES = [
  { title: "Customer Experience", desc: "High response latency and disconnected service layers dilute brand loyalty and slow customer resolution times." },
  { title: "Merchandising Operations", desc: "Manual visual merchandising audits and delayed display performance reporting lead to inconsistent store layout compliance." },
  { title: "Store Support", desc: "Scattered internal operational protocols, returns procedures, and task lists make policy lookup slow and error-prone for store staff." },
  { title: "Inventory Visibility", desc: "Unsynchronized stock channels and latent inventory tracking create stockouts and prevent unified omnichannel fulfillment." },
  { title: "Employee Knowledge Access", desc: "Frontline retail associates struggle to quickly fetch return policies or training documentation during live client checkout." }
];

const AGENTS = [
  { name: "Customer Experience Agent", role: "Processes multi-channel customer inquiries, summarizes sentiment trends, and executes isolated resolution flows." },
  { name: "Store Operations Copilot", role: "Acts as an instant conversational guide for store managers, retrieving visual compliance guidelines and store policy sheets." },
  { name: "Merchandising Intelligence Agent", role: "Tracks visual layout consistency, display campaign performance, and product placement analytics." }
];

const OUTCOMES = [
  { title: "Enhanced Omnichannel Velocity", desc: "Sync physical store inventory with digital platforms, reducing delivery mismatches and item stockouts." },
  { title: "Instant Frontline Empowerment", desc: "Provide checkout staff and floor associates with immediate mobile answers, lowering checkout queue latency." },
  { title: "Consistent Display Compliance", desc: "Automate visual merchandising verification, ensuring coordinated promotional displays across all locations." }
];

export default function RetailPage() {
  const [demoOutput, setDemoOutput] = useState("System ready. Select a store support task to simulate.");
  const [running, setRunning] = useState(false);
  const [activeTab, setActiveTab] = useState("orchestrator");

  const runDemo = (type: "policy" | "audit") => {
    setRunning(true);
    if (type === "policy") {
      setDemoOutput("Searching store returns policy for active order query... Ingesting associate terminal logs...");
      setTimeout(() => {
        setDemoOutput("SUCCESS: Associate query resolved. Return policy for open-box electronics: 14-day store credit limit. Verified in RetailMesh Store Portal.");
        setRunning(false);
      }, 600);
    } else {
      setDemoOutput("Retrieving store display checklist for Summer Campaign v2... Verifying aisle visual metrics...");
      setTimeout(() => {
        setDemoOutput("COMPLIANCE CHECK: Visual layout matches criteria. Stockout detected on Aisle 3. Merchandising Intelligence Agent has queued restock ticket.");
        setRunning(false);
      }, 600);
    }
  };

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Vertical Solutions"
        title="Enterprise Retail Solutions"
        highlightedWord="Retail"
        description="Orchestrate customer journeys, synchronize omnichannel merchandising standards, and empower store associates with secure retail computing networks."
        breadcrumbs={[{ label: "Industries", href: "/industries" }, { label: "Retail" }]}
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
            Our RetailMesh solution architecture unifies inventory, point-of-sale, and employee support systems. By orchestrating Customer Experience Agents and Store Copilots, retail brands unify customer touchpoints and visual compliance checks into one high-availability, high-security dashboard.
          </p>
          <div className="space-y-2">
            {[
              { id: "gateway", name: "RetailMesh Ingestion Core", desc: "Aggregates raw transaction log, stock, and CRM telemetry securely." },
              { id: "orchestrator", name: "RetailMesh Agent Router", desc: "Orchestrates instant customer sentiment checks and direct employee policy lookups." },
              { id: "audit", name: "Store Operations Portal", desc: "Consolidates floor task sheets, layout compliance reports, and stock warnings." }
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
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-4">RetailMesh Architecture Blueprint</span>
          <div className="w-full max-w-[420px] h-[280px] relative">
            <svg className="w-full h-full" viewBox="0 0 500 340" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M250 40 L250 110 M250 150 L250 200 M250 240 L250 290" stroke="url(#pipeGlow)" strokeWidth="1.5" strokeDasharray="6 4" />
              <g onClick={() => setActiveTab("gateway")} className="cursor-pointer">
                <rect x="100" y="20" width="300" height="40" rx="8" fill={activeTab === "gateway" ? "#009DFF" : "#0A0A0C"} stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
                <text x="250" y="44" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">1. RETAILMESH INGESTION CORE</text>
              </g>
              <g onClick={() => setActiveTab("orchestrator")} className="cursor-pointer">
                <rect x="80" y="110" width="340" height="40" rx="8" fill={activeTab === "orchestrator" ? "url(#brandG)" : "#0A0A0C"} stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
                <text x="250" y="134" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">2. RETAILMESH AGENT ROUTER</text>
              </g>
              <g className="opacity-70">
                <rect x="50" y="190" width="400" height="50" rx="8" fill="#050507" stroke="#009DFF" strokeWidth="1" strokeDasharray="4 4" />
                <text x="250" y="210" fill="#009DFF" fontSize="9" fontWeight="bold" textAnchor="middle">Customer Experience // Store Copilot // Merchandising Agent</text>
                <text x="250" y="228" fill="white" fontSize="8" textAnchor="middle" className="opacity-60">Executing secure, omnichannel service pipelines globally</text>
              </g>
              <g onClick={() => setActiveTab("audit")} className="cursor-pointer">
                <rect x="100" y="280" width="300" height="40" rx="8" fill={activeTab === "audit" ? "#E4000F" : "#0A0A0C"} stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
                <text x="250" y="304" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">3. STORE OPERATIONS PORTAL</text>
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
        <h2 className="text-2xl font-bold text-white mb-6">The Retail Agent Map</h2>
        <Carousel
          items={AGENTS.map((a) => ({
            title: a.name,
            tag: "Retail Agent",
            desc: a.role,
            metric: "Availability: 99.95%"
          }))}
        />
      </div>

      {/* Interactive Simulator */}
      <div className="max-w-[1795px] mx-auto px-6 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-5 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-white mb-4">Interactive RetailMesh Simulator</h2>
          <p className="text-xs text-white/70 leading-relaxed font-light mb-6">
            Test our frontline and operations intelligence systems. Query a standard return policy or simulate a remote display campaign compliance audit directly within our secure client sandbox.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => runDemo("policy")}
              disabled={running}
              className="px-4 py-2 rounded-full text-xs font-semibold bg-white text-black hover:bg-white/90 disabled:opacity-50 transition-all"
            >
              {running ? "Searching..." : "Query Returns Policy"}
            </button>
            <button
              onClick={() => runDemo("audit")}
              disabled={running}
              className="px-4 py-2 rounded-full text-xs font-semibold bg-white/5 border border-white/10 hover:bg-white/10 text-white disabled:opacity-50 transition-all"
            >
              {running ? "Auditing..." : "Run Layout Compliance Audit"}
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 p-5 rounded-xl border border-white/5 bg-black/40 min-h-[160px] flex flex-col justify-between font-mono relative overflow-hidden">
          <span className="text-[10px] text-[#009DFF] block border-b border-white/5 pb-2 uppercase tracking-wider font-bold">RETAILMESH SYSTEM LOGS</span>
          <p className="text-xs text-green-400 mt-3 leading-relaxed font-mono">{demoOutput}</p>
          {/* <span className="text-[9px] text-white/30 text-right block pt-3">RETAILMESH PORTAL // INSTANCE #104</span> */}
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
          {["RetailMesh Network", "POS Data Gateway", "Enterprise Retail Core", "GFF AI Academy", "Omnichannel Router"].map((cap, i) => (
            <span key={i} className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/70 font-mono">{cap}</span>
          ))}
        </div>
      </div>

      {/* Premium CTA */}
      <div className="max-w-[1795px] mx-auto px-6 pb-16">
        <PremiumCTA
          title="Optimize Your Retail Footprint"
          description="Schedule a technical engineering workshop with our retail solutions architects to secure your POS integrations and deploy associate sandboxes."
          primaryLabel="Connect with GFF AI"
          primaryHref="/contact"
        />
      </div>

    </InnerPageShell>
  );
}