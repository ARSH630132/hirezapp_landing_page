"use client";

import { useState } from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";

const CHALLENGES = [
  { title: "Claims Operations", desc: "Manual, high-volume claims processing drains carrier operational resources and slows cycles." },
  { title: "Policy Search Latency", desc: "Locating precise coverage limits, riders, and exclusions across massive multi-page documents." },
  { title: "Risk Assessment", desc: "Inconsistent underwriting evaluations and dynamic risk profiling lead to margin leaks." },
  { title: "Document-Heavy Workflows", desc: "Parsing unstructured repair estimates, medical bills, and photos requires constant manual scanning." },
  { title: "Customer Response Time", desc: "Long settlement delays from receipt of claim to final payout lead to customer churn." }
];

const AGENTS = [
  { name: "Claims Triage Agent", role: "Extracts repair invoices, matches damage photos, and flags risk outliers." },
  { name: "Policy Intelligence Agent", role: "Instantly checks inbound claim details against customer policy exclusions." },
  { name: "Underwriting Copilot", role: "Aggregates third-party telemetry, assets, and past claims for risk profiling." },
  { name: "Contract Intelligence Agent", role: "Unifies legal terms and reinsurance clause validation." }
];

export default function InsurancePage() {
  const [demoLog, setDemoLog] = useState("System ready. Ingest a sample claim below.");
  const [running, setRunning] = useState(false);

  const startDemo = () => {
    setRunning(true);
    setDemoLog("Ingesting claims package (PDF Estimations + Photo Telemetry)...");
    setTimeout(() => {
      setDemoLog("OCR Complete. Parsed: 'Windshield Replacement', Amount: $950. Validating policy coverage...");
      setTimeout(() => {
        setDemoLog("SUCCESS: Policy covers glass damage with a $100 deductible. Auto-triage level: LOW RISK. Ready for dispatcher execution.");
        setRunning(false);
      }, 750);
    }, 750);
  };

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Vertical Solutions"
        title="Insurance Claims & Policy AI"
        highlightedWord="Insurance"
        description="Deploy secure document-parsing pipelines, instant policy validation, and underwriting copilots under strict safety guardrails."
        breadcrumbs={[{ label: "Industries", href: "/industries" }, { label: "Insurance" }]}
      />

      <div className="max-w-[1795px] mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-white mb-6">Challenge Landscape</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {CHALLENGES.map((c, i) => (
            <div key={i} className="p-5 rounded-xl border border-white/5 bg-[#050507]/60">
              <span className="text-[#E4000F] font-mono text-xs block mb-2">0{i+1} {"//"} {c.title}</span>
              <p className="text-xs text-white/60 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[1795px] mx-auto px-6 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-5">
          <h2 className="text-2xl font-bold text-white mb-4">Reference Solution</h2>
          <p className="text-xs text-white/70 leading-relaxed mb-4">
            Our insurance solution pairs high-accuracy OCR multi-modal pre-processing gateways with secure policy lookup tables.
          </p>
          <p className="text-xs text-white/60 leading-relaxed">
            By orchestrating the Claims Triage Agent and Policy Intelligence Agent, carriers automate basic intake sorting and exclude/limit checking before sending payloads to claims adjusters.
          </p>
        </div>
        <div className="lg:col-span-7 p-6 rounded-2xl border border-white/5 bg-[#050506]/60">
          <span className="text-[10px] font-mono text-[#009DFF] uppercase block mb-4">Intake Pipeline Flow</span>
          <div className="flex flex-col gap-3">
            {["Document & Photo OCR Ingestion", "Policy Limits & Exclusions Analysis", "Fraud & Telemetry Risk Profiling", "Manual Human-in-the-Loop Audit Gate"].map((step, idx) => (
              <div key={idx} className="p-3 rounded-lg border border-white/5 bg-black/40 text-xs font-mono text-white/80 flex items-center justify-between">
                <span>0{idx+1}. {step}</span>
                <span className="text-[10px] text-green-500 uppercase">✓ Verified</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1795px] mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-white mb-6">Active Agent Blueprints</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {AGENTS.map((a, i) => (
            <div key={i} className="p-5 rounded-2xl border border-white/5 bg-[#050507]/60">
              <h3 className="text-xs font-mono font-bold text-[#E4000F] uppercase">{a.name}</h3>
              <p className="text-xs text-white/60 mt-2 leading-relaxed">{a.role}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[1795px] mx-auto px-6 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6">
          <h2 className="text-2xl font-bold text-white mb-4">Interactive Claims Triage Simulator</h2>
          <p className="text-xs text-white/60 leading-relaxed mb-6">
            Ingest and triage an unstructured glass repair invoice through our simulated multi-agent OCR claims parser.
          </p>
          <button onClick={startDemo} disabled={running} className="px-5 py-2.5 rounded-full text-xs font-semibold bg-white text-black hover:bg-white/90 disabled:opacity-50">
            {running ? "Triaging..." : "Ingest Glass Repair Claim"}
          </button>
        </div>
        <div className="lg:col-span-6 p-5 rounded-xl border border-white/5 bg-black/40 min-h-[140px] flex flex-col justify-between font-mono">
          <span className="text-[10px] text-white/40 block border-b border-white/5 pb-2">TRIAGE PARSING STREAM</span>
          <p className="text-xs text-green-400 mt-2 leading-relaxed">{demoLog}</p>
          <span className="text-[9px] text-white/30 text-right block pt-2">INSURANCE PORTAL // ISOLATED PROCESSING</span>
        </div>
      </div>

      <div className="max-w-[1795px] mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-white mb-6">Structural ROI & Outcome Levers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl border border-white/5 bg-[#050507]/60">
            <h3 className="text-xs font-bold text-white uppercase mb-2">Claim Lifecycle Speed</h3>
            <p className="text-xs text-white/60 leading-relaxed">Transition basic glass, minor dent, or catalog claims to immediate, automated sorting, lowering carrier file holdtimes.</p>
          </div>
          <div className="p-5 rounded-xl border border-white/5 bg-[#050507]/60">
            <h3 className="text-xs font-bold text-white uppercase mb-2">Underwriting Support</h3>
            <p className="text-xs text-white/60 leading-relaxed">Equip underwriters with consolidated commercial history, geographic metrics, and asset specs instantly gathered by cognitive search.</p>
          </div>
          <div className="p-5 rounded-xl border border-white/5 bg-[#050507]/60">
            <h3 className="text-xs font-bold text-white uppercase mb-2">Immutable Audit Trails</h3>
            <p className="text-xs text-white/60 leading-relaxed">Ensure every automated check, OCR extraction, and policy limits audit is logged inside high-security compliance books.</p>
          </div>
        </div>
      </div>

      <div className="max-w-[1795px] mx-auto px-6 pb-16 border-t border-white/5 pt-12">
        <h3 className="text-xs font-mono text-white/40 uppercase tracking-widest mb-4">Related Capabilities & Platforms</h3>
        <div className="flex flex-wrap gap-3">
          {["Foundry Visual Studio", "Marketplace Blueprints", "Multi-modal OCR Engines", "Sovereign Governance Layer"].map((cap, i) => (
            <span key={i} className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/70">{cap}</span>
          ))}
        </div>
      </div>

      <div className="max-w-[1795px] mx-auto px-6 pb-16">
        <PremiumCTA
          title="Optimize Your Ingestion Lifecycle Today"
          description="Schedule a technical engineering session with our systems architects to map document OCR, auto-triage rules, and policy exclusions checking."
          primaryLabel="Connect with GFF AI"
          primaryHref="/contact"
        />
      </div>
    </InnerPageShell>
  );
}
