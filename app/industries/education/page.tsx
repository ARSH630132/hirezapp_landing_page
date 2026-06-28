"use client";

import { useState } from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";
import Carousel from "@/components/inner-pages/Carousel";

const CHALLENGES = [
  { title: "Student Support", desc: "High student-to-advisor ratios leading to delayed operational answers, resource navigation struggles, and onboarding friction." },
  { title: "Faculty Enablement", desc: "Overwhelming administrative overhead, grading logs, curriculum scheduling, and manual teaching support tasks." },
  { title: "Knowledge Access", desc: "Academic policies, syllabus repositories, research papers, and course catalogs isolated across separate department wikis." },
  { title: "University Operations", desc: "Inefficient classroom allocation, waitlist management bottlenecks, and disjointed registrar systems of record." },
  { title: "AI Labs & Learning", desc: "Deploying secure sandbox environments for students to practice and experiment with advanced AI model architectures." }
];

const AGENTS = [
  { name: "Student Support Agent", role: "Unifies registrar schedules, campus resources, and enrollment navigation." },
  { name: "Faculty Assistant", role: "Drafts curriculum structures, structures assignments, and coordinates class waitlists." },
  { name: "Learning Assistant", role: "Guides student practice through interactive explanations of advanced subjects (e.g. AI and calculus)." },
  { name: "University Operations Copilot", role: "Coordinates dynamic classroom spaces and schedules in real-time." }
];

const OUTCOMES = [
  { title: "Frictionless Support", desc: "Deliver instant, accurate, registrar-aligned answers to common enrollment, parking, and policy queries." },
  { title: "Operational Automation", desc: "Automate room schedules, registrar queues, and teaching assistant workflows securely." },
  { title: "Next-Gen AI Learning", desc: "Deploy safe sandbox sandpits (via AI Academy and University OneVerse) for interactive, high-fidelity skill building." }
];

export default function EducationPage() {
  const [demoOutput, setDemoOutput] = useState("System ready. Select a workflow below to run the Education sandbox simulator.");
  const [running, setRunning] = useState(false);
  const [activeTab, setActiveTab] = useState("orchestrator");

  const runDemo = (type: "learn" | "ops") => {
    setRunning(true);
    if (type === "learn") {
      setDemoOutput("Initializing Learning Assistant... Querying AI Academy Knowledge Graph for backpropagation mechanics...");
      setTimeout(() => {
        setDemoOutput("SUCCESS: Sourced Lecture 3 chain-rule derivations. Explaining gradient updates. Practice steps compiled under student workspace.");
        setRunning(false);
      }, 500);
    } else {
      setDemoOutput("Querying registration databases... Checking waitlists for Fall Term Robotics...");
      setTimeout(() => {
        setDemoOutput("RESULT: Reallocated 4 overflow registrants to Room 302. Generated automated waitlist alerts for faculty approval.");
        setRunning(false);
      }, 500);
    }
  };

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Vertical Solutions"
        title="Enterprise Cognitive Platforms for Education"
        highlightedWord="Education"
        description="Empower academic institutions, automate administrative operations, and deploy high-fidelity interactive labs using GFF AI Academy and University OneVerse."
        breadcrumbs={[{ label: "Industries", href: "/industries" }, { label: "Education" }]}
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
            Educational ecosystems require high-volume, responsive, and completely secure processing of student profiles and academic resources. Our architecture uses role-based sandboxes to separate administrative registrar controls from open-ended student study copilots.
          </p>
          <div className="space-y-2">
            {[
              { id: "gateway", name: "Sovereign Ingestion Portal", desc: "Integrates with student information systems and registrar catalogs securely." },
              { id: "orchestrator", name: "Cognitive Academic Router", desc: "Maps educational queries, redirecting requests to specific micro-agents." },
              { id: "audit", name: "Institutional Registry", desc: "Audit trail tracks grading, enrollment actions, and workspace interactions." }
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
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-4">Interactive Education Architecture Blueprint</span>
          <div className="w-full max-w-[420px] h-[280px] relative">
            <svg className="w-full h-full" viewBox="0 0 500 340" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M250 40 L250 110 M250 150 L250 200 M250 240 L250 290" stroke="url(#pipeGlow)" strokeWidth="1.5" strokeDasharray="6 4" />
              <g onClick={() => setActiveTab("gateway")} className="cursor-pointer">
                <rect x="100" y="20" width="300" height="40" rx="8" fill={activeTab === "gateway" ? "#009DFF" : "#0A0A0C"} stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
                <text x="250" y="44" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">1. SOVEREIGN INGESTION PORTAL</text>
              </g>
              <g onClick={() => setActiveTab("orchestrator")} className="cursor-pointer">
                <rect x="80" y="110" width="340" height="40" rx="8" fill={activeTab === "orchestrator" ? "url(#brandG)" : "#0A0A0C"} stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
                <text x="250" y="134" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">2. COGNITIVE ACADEMIC ROUTER</text>
              </g>
              <g className="opacity-70">
                <rect x="50" y="190" width="400" height="50" rx="8" fill="#050507" stroke="#009DFF" strokeWidth="1" strokeDasharray="4 4" />
                <text x="250" y="210" fill="#009DFF" fontSize="9" fontWeight="bold" textAnchor="middle">Student Support // Faculty Assistants // Learning Sandboxes</text>
                <text x="250" y="228" fill="white" fontSize="8" textAnchor="middle" className="opacity-60">Delivering interactive services via safe runtime sandpits</text>
              </g>
              <g onClick={() => setActiveTab("audit")} className="cursor-pointer">
                <rect x="100" y="280" width="300" height="40" rx="8" fill={activeTab === "audit" ? "#E4000F" : "#0A0A0C"} stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
                <text x="250" y="304" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">3. SECURE INSTITUTIONAL REGISTRY</text>
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
        <h2 className="text-2xl font-bold text-white mb-6">The Education Agent Map</h2>
        <Carousel
          items={AGENTS.map((a) => ({
            title: a.name,
            tag: "Education Agent",
            desc: a.role,
            metric: "Latency: <150ms"
          }))}
        />
      </div>

      <div className="max-w-[1795px] mx-auto px-6 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-5 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-white mb-4">Interactive Education Simulator</h2>
          <p className="text-xs text-white/70 leading-relaxed font-light mb-6">
            Interact with our simulated academic sandboxes to explore instant grading/study assists or run Registrar room-waitlist reallocations instantly.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => runDemo("learn")}
              disabled={running}
              className="px-4 py-2 rounded-full text-xs font-semibold bg-white text-black hover:bg-white/90 disabled:opacity-50 transition-all"
            >
              {running ? "Querying..." : "Simulate Student Learning Assistant"}
            </button>
            <button
              onClick={() => runDemo("ops")}
              disabled={running}
              className="px-4 py-2 rounded-full text-xs font-semibold bg-white/5 border border-white/10 hover:bg-white/10 text-white disabled:opacity-50 transition-all"
            >
              {running ? "Balancing..." : "Simulate University Operations"}
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 p-5 rounded-xl border border-white/5 bg-black/40 min-h-[160px] flex flex-col justify-between font-mono relative overflow-hidden">
          <span className="text-[10px] text-[#009DFF] block border-b border-white/5 pb-2 uppercase tracking-wider font-bold">KNOWLEDGE RETRIEVAL LOG</span>
          <p className="text-xs text-green-400 mt-3 leading-relaxed font-mono">{demoOutput}</p>
          {/* <span className="text-[9px] text-white/30 text-right block pt-3">GFF ACADEMIC BLUEPRINT // ISOLATED SANDBOX</span> */}
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
          title="Architect Your University's Cognitive Infrastructure"
          description="Schedule a technical consultation with our engineering team to map student-record integration, AI Academy learning labs, and isolated workload routers."
          primaryLabel="Connect with GFF Academic Team"
          primaryHref="/contact"
        />
      </div>
    </InnerPageShell>
  );
}
