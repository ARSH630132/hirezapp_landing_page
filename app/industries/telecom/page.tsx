"use client";

import { useState } from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";
import Carousel from "@/components/inner-pages/Carousel";

const CHALLENGES = [
  { title: "Network Operations", desc: "Isolating silent fiber cuts and core network bottlenecks manually takes hours, degrading carrier QoS." },
  { title: "Customer Service", desc: "Spikes in support ticket queues lead to customer churn and high customer care agent fatigue." },
  { title: "Field Operations", desc: "Coordinating dispatching, local equipment inventories, and cell tower schematics is slow and manual." },
  { title: "Knowledge Fragmentation", desc: "Critical cell site configurations and network operating guides are scattered across siloed wikis." },
  { title: "Service Delivery Visibility", desc: "No single, low-latency, readable summary of ongoing trunk outages and fiber installation status." }
];

const AGENTS = [
  { name: "Network Operations Copilot", role: "Analyzes telemetry across cell towers and automatically reraises routing configurations." },
  { name: "Customer Experience Agent", role: "Handles common billing queries and classifies complex outages for high-priority routing." },
  { name: "Field Service Copilot", role: "Compiles tower checklists, checks equipment stocks, and matches dispatches." },
  { name: "Knowledge Search Agent", role: "Pulls network engineering schematics and standard operating logs." },
  { name: "Executive Dashboard Agent", role: "Unifies service delivery statistics and active maintenance schedules." }
];

const OUTCOMES = [
  { title: "Predictive Network Rerouting", desc: "Automatically flag latency spikes and reroute core fiber lines before subscribers experience dropped connections." },
  { title: "Direct Intent Support", desc: "Leverage intelligent ticket triage to classify and resolve support issues with near-zero queue delays." },
  { title: "Unified Field Checklists", desc: "Equip cell-tower engineers with comprehensive diagrams and tools, ensuring higher first-visit fix rates." }
];


export default function TelecomPage() {
  const [demoOutput, setDemoOutput] = useState("System ready. Select a query option below to test TelecomVerse.");
  const [running, setRunning] = useState(false);
  const [activeTab, setActiveTab] = useState("gateway");

  const runDemo = (type: "network" | "routing") => {
    setRunning(true);
    if (type === "network") {
      setDemoOutput("Scanning local fiber networks and cell tower links... Identifying drops...");
      setTimeout(() => {
        setDemoOutput("SUCCESS: Outage localized to Tower 104-A. Rerouted bandwidth to backup microwave link. Latency stable at 14ms.");
        setRunning(false);
      }, 600);
    } else {
      setDemoOutput("Analyzing support queue... Mapping semantic category of ticket #T-8841...");
      setTimeout(() => {
        setDemoOutput("SUCCESS: Ticket classified as high-priority regional fiber outage. Escalated to Local Field Dispatch.");
        setRunning(false);
      }, 600);
    }
  };

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Vertical Solutions"
        title="Telecom Network & Customer Cognitive Layers"
        highlightedWord="Telecom"
        description="Optimize network operations, resolve customer inquiries with direct intent, and streamline field dispatches securely using the TelecomVerse core platform."
        breadcrumbs={[{ label: "Industries", href: "/industries" }, { label: "Telecom" }]}
      />

      <div className="max-w-[1795px] mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-white mb-6">Challenge Landscape</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {CHALLENGES.map((c, i) => (
            <div key={i} className="p-5 rounded-xl border border-white/5 bg-[#050507]/60 hover:border-white/10 transition-all duration-300">
              <span className="text-[#009DFF] font-mono text-xs block mb-2">0{i+1} {"//"} {c.title}</span>
              <p className="text-xs text-white/60 leading-relaxed font-light">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[1795px] mx-auto px-6 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-5 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-white mb-4">TelecomVerse Core Blueprint</h2>
          <p className="text-xs text-white/70 leading-relaxed font-light mb-6">
            Our telecom integration layer leverages GFF TelecomVerse to safely process core telemetry and high-volume customer intent streams.
          </p>
          <div className="space-y-2">
            {[
              { id: "gateway", name: "Sovereign Ingestion Gateway", desc: "Isolates cell tower telemetry and CRM ticketing queues securely." },
              { id: "telecomverse", name: "TelecomVerse Orchestrator", desc: "Handles cell load routing, predictive reroutes, and technician dispatch checkouts." },
              { id: "governance", name: "Runtime Governance", desc: "Enforces data retention borders and sovereign compliance rules." }
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
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-4">Interactive Telecom Architecture Blueprint</span>
          <div className="w-full max-w-[420px] h-[280px] relative">
            <svg className="w-full h-full" viewBox="0 0 500 340" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M250 40 L250 110 M250 150 L250 200 M250 240 L250 290" stroke="url(#pipeGlow)" strokeWidth="1.5" strokeDasharray="6 4" />
              <g onClick={() => setActiveTab("gateway")} className="cursor-pointer">
                <rect x="100" y="20" width="300" height="40" rx="8" fill={activeTab === "gateway" ? "#009DFF" : "#0A0A0C"} stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
                <text x="250" y="44" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle" className="font-mono">1. SOVEREIGN TELEMETRY GATEWAY</text>
              </g>
              <g onClick={() => setActiveTab("telecomverse")} className="cursor-pointer">
                <rect x="80" y="110" width="340" height="40" rx="8" fill={activeTab === "telecomverse" ? "url(#brandG)" : "#0A0A0C"} stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
                <text x="250" y="134" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle" className="font-mono">2. TELECOMVERSE ORCHESTRATOR</text>
              </g>
              <g className="opacity-70">
                <rect x="50" y="190" width="400" height="50" rx="8" fill="#050507" stroke="#009DFF" strokeWidth="1" strokeDasharray="4 4" />
                <text x="250" y="212" fill="#009DFF" fontSize="9" fontWeight="bold" textAnchor="middle" className="font-mono">Network Copilot // CX Agent // Field Copilot</text>
                <text x="250" y="228" fill="white" fontSize="8" textAnchor="middle" className="opacity-60">Cognitive agents dispatching field dispatches and routing network cells</text>
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
        <h2 className="text-2xl font-bold text-white mb-6">The Telecom Agent Map</h2>
        <Carousel
          items={AGENTS.map((a) => ({
            title: a.name,
            tag: "Telecom Agent",
            desc: a.role,
            metric: "Latency: <180ms"
          }))}
        />
      </div>

      <div className="max-w-[1795px] mx-auto px-6 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-5 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-white mb-4">Interactive TelecomVerse Simulator</h2>
          <p className="text-xs text-white/70 leading-relaxed font-light mb-6">
            Test the TelecomVerse automated operations. Run cell network traffic diagnostics or test intent classification rules for support ticket routing.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => runDemo("network")}
              disabled={running}
              className="px-4 py-2 rounded-full text-xs font-semibold bg-white text-black hover:bg-white/90 disabled:opacity-50 transition-all font-mono"
            >
              {running ? "Scanning..." : "Run Network Diagnostics"}
            </button>
            <button
              onClick={() => runDemo("routing")}
              disabled={running}
              className="px-4 py-2 rounded-full text-xs font-semibold bg-white/5 border border-white/10 hover:bg-white/10 text-white disabled:opacity-50 transition-all font-mono"
            >
              {running ? "Classifying..." : "Route Service Ticket"}
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 p-5 rounded-xl border border-white/5 bg-black/40 min-h-[160px] flex flex-col justify-between font-mono relative overflow-hidden">
          <span className="text-[10px] text-[#009DFF] block border-b border-white/5 pb-2 uppercase tracking-wider font-bold font-mono">TELECOMVERSE NETWORK STREAM</span>
          <p className="text-xs text-green-400 mt-3 leading-relaxed font-mono">{demoOutput}</p>
          <span className="text-[9px] text-white/30 text-right block pt-3 font-mono">SOVEREIGN RUNTIME // TEL-NODE-809</span>
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
          {["TelecomVerse", "Foundational Ingestion", "Marketplace Blueprints", "Private Vector Memory", "Sovereign Governance"].map((cap, i) => (
            <span key={i} className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/70 font-mono">{cap}</span>
          ))}
        </div>
      </div>

      <div className="max-w-[1795px] mx-auto px-6 pb-16">
        <PremiumCTA
          title="Secure Your Telecom Core Operations"
          description="Schedule a technical engineering assessment with our telecom systems engineers to secure telemetry streams, automate routing checks, and configure sovereign airgaps."
          primaryLabel="Connect with GFF AI"
          primaryHref="/contact"
        />
      </div>
    </InnerPageShell>
  );
}


