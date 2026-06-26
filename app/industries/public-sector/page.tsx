"use client";

import { useState } from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";
import Carousel from "@/components/inner-pages/Carousel";

const CHALLENGES = [
  { title: "Citizen Services", desc: "Long administrative wait times and manually driven portals lead to backlogs in processing civic inquiries." },
  { title: "Policy Search Friction", desc: "Retrieving accurate, contextual information across multi-thousand-page legislative records is extremely slow." },
  { title: "Case Workflows", desc: "Unstructured case intake folders, emails, and attachments require manual sorting and indexing." },
  { title: "Documentation Overhead", desc: "Staff spend critical hours organizing, summarizing, and matching cross-agency documents." },
  { title: "Transparency & Governance", desc: "Ensuring an auditable, secure, and compliant record of administrative decisions is highly complex." }
];

const AGENTS = [
  { name: "Citizen Service Agent", role: "Guides portal visitors to correct administrative procedures and answers basic civic FAQs." },
  { name: "Policy Intelligence Agent", role: "Instantly retrieves contextual rules and cross-agency legislative guidelines." },
  { name: "Case Triage Agent", role: "Parses inbound service application files, matches records, and routes files to correct divisions." },
  { name: "Document Intelligence Agent", role: "Ingests, classifies, and summarizes unstructured administrative files." },
  { name: "Executive Dashboard Agent", role: "Aggregates anonymous operational KPIs, case timelines, and audit trails." }
];

const OUTCOMES = [
  { title: "Accelerated Case Processing", desc: "Triage and index incoming civic applications near-instantly, reducing internal staff sorting queues." },
  { title: "Rapid Policy Search", desc: "Provide administrators and citizens with instant, accurate legislative references across complex municipal codes." },
  { title: "High-Transparency Logs", desc: "Log system searches and actions in highly secure, read-only audit streams to support administrative accountability." }
];


export default function PublicSectorPage() {
  const [demoOutput, setDemoOutput] = useState("System ready. Select an administrative query below to test GFF Public Sector solutions.");
  const [running, setRunning] = useState(false);
  const [activeTab, setActiveTab] = useState("gateway");

  const runDemo = (type: "records" | "audit") => {
    setRunning(true);
    if (type === "records") {
      setDemoOutput("Scanning administrative records database... Parsing semantic search keywords...");
      setTimeout(() => {
        setDemoOutput("SUCCESS: Public records index searched. Found 4 matches for local development. Search logged for transparency.");
        setRunning(false);
      }, 600);
    } else {
      setDemoOutput("Ingesting case application data... Validating standards against Runtime Governance...");
      setTimeout(() => {
        setDemoOutput("SUCCESS: Case forms validate against state standards. Audit trails generated. Ready for divisional dispatch.");
        setRunning(false);
      }, 600);
    }
  };

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Vertical Solutions"
        title="Public Sector Enterprise Administration"
        highlightedWord="Public Sector"
        description="Streamline public services, enhance legislative policy retrieval, and securely organize administrative records under sovereign, isolated security."
        breadcrumbs={[{ label: "Industries", href: "/industries" }, { label: "Public Sector" }]}
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
          <h2 className="text-2xl font-bold text-white mb-4">Secure Reference Blueprint</h2>
          <p className="text-xs text-white/70 leading-relaxed font-light mb-6">
            We deploy secure, airgapped ingestion gateways and local isolation using GFF Control Center and Runtime Governance.
          </p>
          <div className="space-y-2">
            {[
              { id: "gateway", name: "Sovereign Ingestion Gateway", desc: "Isolates and encrypts incoming case applications and administrative records." },
              { id: "control_center", name: "Control Center Core", desc: "Coordinates Citizen Service Agents and runs policy searches." },
              { id: "governance", name: "Runtime Governance", desc: "Secures processing boundaries and creates read-only operational audit trails." }
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
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-4">Interactive Public Sector Architecture Blueprint</span>
          <div className="w-full max-w-[420px] h-[280px] relative">
            <svg className="w-full h-full" viewBox="0 0 500 340" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M250 40 L250 110 M250 150 L250 200 M250 240 L250 290" stroke="url(#pipeGlow)" strokeWidth="1.5" strokeDasharray="6 4" />
              <g onClick={() => setActiveTab("gateway")} className="cursor-pointer">
                <rect x="100" y="20" width="300" height="40" rx="8" fill={activeTab === "gateway" ? "#009DFF" : "#0A0A0C"} stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
                <text x="250" y="44" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle" className="font-mono">1. SOVEREIGN RECORDS GATEWAY</text>
              </g>
              <g onClick={() => setActiveTab("control_center")} className="cursor-pointer">
                <rect x="80" y="110" width="340" height="40" rx="8" fill={activeTab === "control_center" ? "url(#brandG)" : "#0A0A0C"} stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
                <text x="250" y="134" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle" className="font-mono">2. CONTROL CENTER ORCHESTRATION</text>
              </g>
              <g className="opacity-70">
                <rect x="50" y="190" width="400" height="50" rx="8" fill="#050507" stroke="#009DFF" strokeWidth="1" strokeDasharray="4 4" />
                <text x="250" y="212" fill="#009DFF" fontSize="9" fontWeight="bold" textAnchor="middle" className="font-mono">Citizen Service // Case Triage // Document Intel</text>
                <text x="250" y="228" fill="white" fontSize="8" textAnchor="middle" className="opacity-60">Cognitive agents processing legislative records and triage folders</text>
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
        <h2 className="text-2xl font-bold text-white mb-6">The Public Sector Agent Map</h2>
        <Carousel
          items={AGENTS.map((a) => ({
            title: a.name,
            tag: "Public Sector Agent",
            desc: a.role,
            metric: "Latency: <150ms"
          }))}
        />
      </div>

      <div className="max-w-[1795px] mx-auto px-6 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-5 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-white mb-4">Interactive Public Sector Sandbox</h2>
          <p className="text-xs text-white/70 leading-relaxed font-light mb-6">
            Test the Citizen Service and Document Intelligence modules below. Run an automated administrative record search or simulate intake compliance auditing safely.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => runDemo("records")}
              disabled={running}
              className="px-4 py-2 rounded-full text-xs font-semibold bg-white text-black hover:bg-white/90 disabled:opacity-50 transition-all font-mono"
            >
              {running ? "Searching..." : "Process Public Record Search"}
            </button>
            <button
              onClick={() => runDemo("audit")}
              disabled={running}
              className="px-4 py-2 rounded-full text-xs font-semibold bg-white/5 border border-white/10 hover:bg-white/10 text-white disabled:opacity-50 transition-all font-mono"
            >
              {running ? "Auditing..." : "Audit Administrative Intake"}
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 p-5 rounded-xl border border-white/5 bg-black/40 min-h-[160px] flex flex-col justify-between font-mono relative overflow-hidden">
          <span className="text-[10px] text-[#009DFF] block border-b border-white/5 pb-2 uppercase tracking-wider font-bold font-mono">PUBLIC SECTOR RUNTIME LOGS</span>
          <p className="text-xs text-green-400 mt-3 leading-relaxed font-mono">{demoOutput}</p>
          <span className="text-[9px] text-white/30 text-right block pt-3 font-mono">SECURE SANDBOX // PUB-INT-14</span>
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
          {["Control Center", "Runtime Governance", "Foundational Ingestion", "Marketplace Blueprints", "Private Vector Memory"].map((cap, i) => (
            <span key={i} className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/70 font-mono">{cap}</span>
          ))}
        </div>
      </div>

      <div className="max-w-[1795px] mx-auto px-6 pb-16">
        <PremiumCTA
          title="Secure Your Administration Workflows"
          description="Schedule a technical discussion with our system architects to configure sovereign ingestion gateways, legislative indexing indexes, and secure operational audits."
          primaryLabel="Connect with GFF AI"
          primaryHref="/contact"
        />
      </div>
    </InnerPageShell>
  );
}


