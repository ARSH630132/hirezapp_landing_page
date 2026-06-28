"use client";

import { useState } from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";

const CHALLENGES = [
  { title: "Legacy Systems", desc: "Monolithic ledger networks and historical databases isolated from modern intelligence APIs." },
  { title: "Compliance Pressure", desc: "Ever-shifting sovereign frameworks (SEC, FINRA, MiFID II) require instant, error-free auditing." },
  { title: "Fragmented Data", desc: "Portfolio specs, transaction listings, and market briefs scattered across isolated silos." },
  { title: "Manual Documentation", desc: "Trade reconciliations, investor onboarding, and contract reviews locked in paperwork." },
  { title: "Risk Visibility", desc: "Delayed ledger settlement audits leave institutions blind to high-velocity anomaly patterns." }
];

const AGENTS = [
  { name: "Compliance Assistant", role: "Continuous audit of trading & regulatory records." },
  { name: "Customer Intelligence Agent", role: "Consolidated client portfolio and market trend synthesis." },
  { name: "Risk Review Agent", role: "Real-time ledger and transaction pattern threat auditing." },
  { name: "Knowledge Search Agent", role: "Instant retrieval across institutional policy archives." },
  { name: "Executive Dashboard Agent", role: "Synthesizes cross-departmental operations and KPIs." }
];

export default function FinancialServicesPage() {
  const [demoLog, setDemoLog] = useState("System idle. Ready to initiate audit.");
  const [running, setRunning] = useState(false);

  const runDemo = () => {
    setRunning(true);
    setDemoLog("Connecting to secure trade ledger mirror...");
    setTimeout(() => {
      setDemoLog("Analyzing 1,250 transactions against SEC rulebooks...");
      setTimeout(() => {
        setDemoLog("Flagged 0 critical violations. 1 compliance warning drafted for human review.");
        setRunning(false);
      }, 800);
    }, 800);
  };

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Vertical Solutions"
        title="Financial Services AI Architectures"
        highlightedWord="Financial"
        description="Deploy secure, regulatory-compliant multi-agent cognitive layers over complex capital markets ledger systems."
        breadcrumbs={[{ label: "Industries", href: "/industries" }, { label: "Financial Services" }]}
      />

      <div className="max-w-[1795px] mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-white mb-6">Challenge Landscape</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {CHALLENGES.map((c, i) => (
            <div key={i} className="p-5 rounded-xl border border-white/5 bg-[#050507]/60">
              <span className="text-[#E4000F] font-mono text-xs block mb-2">0{i+1}{"."} {c.title}</span>
              <p className="text-xs text-white/60 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[1795px] mx-auto px-6 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-5">
          <h2 className="text-2xl font-bold text-white mb-4">Reference Solution</h2>
          <p className="text-xs text-white/70 leading-relaxed mb-4">
            Our multi-agent architectures decouple transaction books from modern intelligence APIs using read-only mirrors and isolated sandbox layers.
          </p>
          <p className="text-xs text-white/60 leading-relaxed">
            By coordinating purpose-built agents, financial institutions automate heavy compliance reporting and transaction threat auditing while maintaining absolute sovereign isolation.
          </p>
        </div>
        <div className="lg:col-span-7 p-6 rounded-2xl border border-white/5 bg-[#050506]/60">
          <span className="text-[10px] font-mono text-[#009DFF] uppercase block mb-4">System Flow Visualization</span>
          <div className="flex flex-col gap-3">
            {["Data Ingestion Hub (Ledgers, PDFs)", "Cognitive Isolation & Routing Layer", "Sovereign Audit Sandbox (SEC/FINRA Checked)", "Secure Dispatch Ledger"].map((step, idx) => (
              <div key={idx} className="p-3 rounded-lg border border-white/5 bg-black/40 text-xs font-mono text-white/80 flex items-center justify-between">
                <span>0{idx+1}. {step}</span>
                <span className="text-[10px] text-green-500 uppercase">✓ Isolated</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1795px] mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-white mb-6">Active Agent Blueprints</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AGENTS.map((a, i) => (
            <div key={i} className="p-6 rounded-2xl border border-white/5 bg-[#050507]/60">
              <h3 className="text-sm font-bold text-white">{a.name}</h3>
              <p className="text-xs text-white/60 mt-2 leading-relaxed">{a.role}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[1795px] mx-auto px-6 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6">
          <h2 className="text-2xl font-bold text-white mb-4">Interactive Audit Simulator</h2>
          <p className="text-xs text-white/60 leading-relaxed mb-4">
            Simulate a secure, local Compliance Assistant executing ledger trade audits in GFF's isolated memory sandboxes.
          </p>
          <button onClick={runDemo} disabled={running} className="px-5 py-2.5 rounded-full text-xs font-semibold bg-white text-black hover:bg-white/90 disabled:opacity-50">
            {running ? "Analyzing..." : "Initiate Compliance Audit"}
          </button>
        </div>
        <div className="lg:col-span-6 p-5 rounded-xl border border-white/5 bg-black/40 min-h-[140px] flex flex-col justify-between font-mono">
          <span className="text-[10px] text-white/40 block border-b border-white/5 pb-2">AUDIT SYSTEM LOGS</span>
          <p className="text-xs text-[#009DFF] mt-2">{demoLog}</p>
          {/* <span className="text-[9px] text-white/30 text-right block pt-2">COMPLIANCE SECTOR // ISOLATED</span> */}
        </div>
      </div>

      <div className="max-w-[1795px] mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-white mb-6">Structural ROI & Outcome Levers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl border border-white/5 bg-[#050507]/60">
            <h3 className="text-xs font-bold text-white uppercase mb-2">Audit Velocity</h3>
            <p className="text-xs text-white/60 leading-relaxed">Transition compliance checks from retroactive end-of-quarter samples to real-time, comprehensive continuous reviews.</p>
          </div>
          <div className="p-5 rounded-xl border border-white/5 bg-[#050507]/60">
            <h3 className="text-xs font-bold text-white uppercase mb-2">Information Accessibility</h3>
            <p className="text-xs text-white/60 leading-relaxed">Instantly synthesize unstructured records and documents without custom mainframe connectors.</p>
          </div>
          <div className="p-5 rounded-xl border border-white/5 bg-[#050507]/60">
            <h3 className="text-xs font-bold text-white uppercase mb-2">Complete Audit Trails</h3>
            <p className="text-xs text-white/60 leading-relaxed">Systematically record execution metadata and security logs for every automated query and document check.</p>
          </div>
        </div>
      </div>

      <div className="max-w-[1795px] mx-auto px-6 pb-16 border-t border-white/5 pt-12">
        <h3 className="text-xs font-mono text-white/40 uppercase tracking-widest mb-4">Related Capabilities & Platforms</h3>
        <div className="flex flex-wrap gap-3">
          {["Foundry Visual Studio", "Marketplace Blueprints", "Managed Infrastructure", "Governance & Safety"].map((cap, i) => (
            <span key={i} className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/70">{cap}</span>
          ))}
        </div>
      </div>

      <div className="max-w-[1795px] mx-auto px-6 pb-16">
        <PremiumCTA
          title="Discuss Your Custom Sovereign Capital Architecture"
          description="Speak with our compliance-certified systems engineers to map your sovereign framework, ledger mirror requirements, and audit sandboxes."
          primaryLabel="Connect with GFF AI"
          primaryHref="/contact"
        />
      </div>
    </InnerPageShell>
  );
}
