"use client";

import { useState } from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";

const CHALLENGES = [
  { title: "Customer Service Scale", desc: "Front-line inquiry spikes overwhelm support centers, leading to long queue holds." },
  { title: "Compliance Review", desc: "Rigorous KYC, AML, and credit risk evaluations require extensive manual data cross-referencing." },
  { title: "Knowledge Fragmentation", desc: "Internal policies, underwriting criteria, and product features scattered across outdated wikis." },
  { title: "Manual Back-Office", desc: "Manual data entry for corporate loans, collateral approvals, and credit line updates." },
  { title: "Product & Policy Search", desc: "Branch managers spend substantial time locating specific mortgage rules and deposit specs." }
];

const AGENTS = [
  { name: "Banking Knowledge Agent", role: "Retrieves context from internal policy sheets and regulatory codes." },
  { name: "Relationship Manager Copilot", role: "Drafts comprehensive client portfolios and investment recommendations." },
  { name: "Contract Intelligence Agent", role: "Audits complex commercial loan contracts and collateral files." },
  { name: "Customer Intelligence Agent", role: "Traces customer queries and guides them to correct product answers." }
];

export default function BankingPage() {
  const [demoOutput, setDemoOutput] = useState("Select a query option below to test the Banking Knowledge Agent.");
  const [running, setRunning] = useState(false);

  const triggerQuery = (type: string) => {
    setRunning(true);
    if (type === "policy") {
      setDemoOutput("Searching mortgage rules database for 'LTV limits on secondary homes'...");
      setTimeout(() => {
        setDemoOutput("FOUND: Mortgage Section 4.2. Secondary home limit is 80% LTV, requiring a minimum credit score of 720. Audit Trail: SOC-2 Verified.");
        setRunning(false);
      }, 700);
    } else {
      setDemoOutput("Auditing commercial loan file #9410A for 'interest rate indexing provisions'...");
      setTimeout(() => {
        setDemoOutput("FOUND: Page 14. SOFR index peg with 150bps margin. Human audit checkpoint triggered for risk approval.");
        setRunning(false);
      }, 700);
    }
  };

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Vertical Solutions"
        title="Enterprise Banking Cognitive Layers"
        highlightedWord="Banking"
        description="Connect core mainframes with conversational AI interfaces, policy retrieval networks, and relationship copilots."
        breadcrumbs={[{ label: "Industries", href: "/industries" }, { label: "Banking" }]}
      />

      <div className="max-w-[1795px] mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-white mb-6">Challenge Landscape</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {CHALLENGES.map((c, i) => (
            <div key={i} className="p-5 rounded-xl border border-white/5 bg-[#050507]/60">
              <span className="text-[#009DFF] font-mono text-xs block mb-2">0{i+1} {"//"} {c.title}</span>
              <p className="text-xs text-white/60 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[1795px] mx-auto px-6 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-5">
          <h2 className="text-2xl font-bold text-white mb-4">Reference Solution</h2>
          <p className="text-xs text-white/70 leading-relaxed mb-4">
            Our reference banking architecture establishes read-only core mainframe caches combined with high-accuracy vector semantic indexes.
          </p>
          <p className="text-xs text-white/60 leading-relaxed">
            By keeping reasoning isolated from core transactional databases, GFF AI enables bank branch networks and support desks to query complex guidelines instantly without risk.
          </p>
        </div>
        <div className="lg:col-span-7 p-6 rounded-2xl border border-white/5 bg-[#050506]/60">
          <span className="text-[10px] font-mono text-[#E4000F] uppercase block mb-4">Banking Architecture Map</span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-white/5 bg-black/40">
              <span className="text-[10px] font-mono text-[#009DFF] uppercase block mb-2">Core Mainframe Cache</span>
              <p className="text-[11px] text-white/50 leading-relaxed">Secure transaction and client static records mapping.</p>
            </div>
            <div className="p-4 rounded-xl border border-white/5 bg-black/40">
              <span className="text-[10px] font-mono text-[#E4000F] uppercase block mb-2">Semantic Router</span>
              <p className="text-[11px] text-white/50 leading-relaxed">Validates and routes query intent to sandboxed context sheets.</p>
            </div>
            <div className="p-4 rounded-xl border border-white/5 bg-black/40">
              <span className="text-[10px] font-mono text-[#009DFF] uppercase block mb-2">Secure API Dispatch</span>
              <p className="text-[11px] text-white/50 leading-relaxed">Human-approved webhooks for legacy back-office actions.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1795px] mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-white mb-6">Active Agent Blueprints</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {AGENTS.map((a, i) => (
            <div key={i} className="p-5 rounded-2xl border border-white/5 bg-[#050507]/60">
              <h3 className="text-xs font-mono font-bold text-[#009DFF] uppercase">{a.name}</h3>
              <p className="text-xs text-white/60 mt-2 leading-relaxed">{a.role}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[1795px] mx-auto px-6 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6">
          <h2 className="text-2xl font-bold text-white mb-4">Interactive Knowledge Sandbox</h2>
          <p className="text-xs text-white/60 leading-relaxed mb-6">
            Test the Banking Knowledge Agent below by executing sample operational or document-audit tasks.
          </p>
          <div className="flex gap-3">
            <button onClick={() => triggerQuery("policy")} disabled={running} className="px-4 py-2 rounded-full text-xs font-semibold bg-white text-black hover:bg-white/90">
              Check Mortgage Rules
            </button>
            <button onClick={() => triggerQuery("loan")} disabled={running} className="px-4 py-2 rounded-full text-xs font-semibold bg-white/5 border border-white/10 hover:bg-white/10 text-white">
              Audit Commercial Loan
            </button>
          </div>
        </div>
        <div className="lg:col-span-6 p-5 rounded-xl border border-white/5 bg-black/40 min-h-[140px] flex flex-col justify-between font-mono">
          <span className="text-[10px] text-white/40 block border-b border-white/5 pb-2">KNOWLEDGE RETRIEVAL LOG</span>
          <p className="text-xs text-green-400 mt-2 leading-relaxed">{demoOutput}</p>
          <span className="text-[9px] text-white/30 text-right block pt-2">BANKING SECTOR // SANDBOX ACTIVE</span>
        </div>
      </div>

      <div className="max-w-[1795px] mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-white mb-6">Structural ROI & Outcome Levers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl border border-white/5 bg-[#050507]/60">
            <h3 className="text-xs font-bold text-white uppercase mb-2">Resolution Velocity</h3>
            <p className="text-xs text-white/60 leading-relaxed">Empower front-line branch networks and call center managers to answer complex product and policy guidelines immediately.</p>
          </div>
          <div className="p-5 rounded-xl border border-white/5 bg-[#050507]/60">
            <h3 className="text-xs font-bold text-white uppercase mb-2">Audit Traceability</h3>
            <p className="text-xs text-white/60 leading-relaxed">Establish continuous records for risk evaluations, ensuring full compliance tracks are immediately auditable.</p>
          </div>
          <div className="p-5 rounded-xl border border-white/5 bg-[#050507]/60">
            <h3 className="text-xs font-bold text-white uppercase mb-2">Scale Independent Ops</h3>
            <p className="text-xs text-white/60 leading-relaxed">Manage higher commercial volume without linear back-office resource scaling or support backlogs.</p>
          </div>
        </div>
      </div>

      <div className="max-w-[1795px] mx-auto px-6 pb-16 border-t border-white/5 pt-12">
        <h3 className="text-xs font-mono text-white/40 uppercase tracking-widest mb-4">Related Capabilities & Platforms</h3>
        <div className="flex flex-wrap gap-3">
          {["Foundry Visual Studio", "Marketplace Blueprints", "Private Vector Memory", "Secure Mainframe Gateway"].map((cap, i) => (
            <span key={i} className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/70">{cap}</span>
          ))}
        </div>
      </div>

      <div className="max-w-[1795px] mx-auto px-6 pb-16">
        <PremiumCTA
          title="Architect Your Custom Banking AI Tier"
          description="Schedule a technical workspace review to design high-throughput mainframe caches and vector search indexes for your branch network."
          primaryLabel="Connect with GFF AI"
          primaryHref="/contact"
        />
      </div>
    </InnerPageShell>
  );
}
