"use client";

import React, { useState } from "react";
import { ToolPageShell, ToolCTA, ToolOptionGrid } from "@/components/build/components";
import { WizardStepperSystem, WizardStep } from "@/components/build/WizardStepperSystem";

interface IntakeInputs {
  ind: string;
  size: string;
  desc: string;
}

export default function TalkToAgentPage() {
  const initialData: IntakeInputs = {
    ind: "Finance",
    size: "100-1000",
    desc: "Automate transaction reconciliation and real-time compliance auditing."
  };

  const indOptions = [
    {
      id: "Finance",
      title: "Banking & Finance",
      description: "Hardened ledgers, transaction auditing, and secure payment DAGs.",
      accentColor: "#009DFF",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: "Retail",
      title: "Retail & Supply Chain",
      description: "Inventory optimization, automated freight audits, ERP integrations.",
      accentColor: "#E4000F",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    },
    {
      id: "Healthcare",
      title: "Healthcare & Biotech",
      description: "HIPAA parsing, local clinical vector stores, zero data retention.",
      accentColor: "#00FF9D",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    }
  ];

  const sizeOptions = [
    {
      id: "<100",
      title: "Growth Venture (< 100)",
      description: "Rapid experimentation and swift sovereign pilot deployments.",
      accentColor: "#3B82F6",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      id: "100-1000",
      title: "Mid-Market Enterprise (100 - 1k)",
      description: "Coordinating multi-agent squads across growing departments.",
      accentColor: "#9D00FF",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      id: "1000+",
      title: "Global Conglomerate (1,000+)",
      description: "Single-tenant VPC enclaves with dedicated multi-region nodes.",
      accentColor: "#EC4899",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      )
    }
  ];

  const steps: WizardStep<IntakeInputs>[] = [
    {
      id: "ind", label: "Sector Focus", description: "Select target operational domain.",
      render: ({ data, onChange }: any) => (
        <div className="space-y-4">
          <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider block">Operational Domain</span>
          <ToolOptionGrid
            options={indOptions}
            selectedId={data.ind}
            onChange={(id) => onChange({ ind: id })}
          />
        </div>
      )
    },
    {
      id: "size", label: "Company Size", description: "Set organization size bracket.",
      render: ({ data, onChange }: any) => (
        <div className="space-y-4">
          <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider block">Company Size</span>
          <ToolOptionGrid
            options={sizeOptions}
            selectedId={data.size}
            onChange={(id) => onChange({ size: id })}
          />
        </div>
      )
    },
    {
      id: "desc", label: "Core Challenge", description: "Describe the primary bottleneck or process friction.",
      validate: (d) => (!d.desc || d.desc.trim().length < 10 ? "Please enter at least 10 characters to describe the core challenge." : null),
      render: ({ data, onChange, error }: any) => (
        <div className="space-y-2">
          <label className="text-[10px] font-mono text-white/50 uppercase">Operational Friction</label>
          <textarea value={data.desc} onChange={(e) => onChange({ desc: e.target.value })} rows={4} className="w-full rounded-xl border border-white/10 bg-black text-white p-3 focus:border-[#009DFF] outline-none text-xs resize-none leading-relaxed font-light" />
        </div>
      )
    }
  ];

  const onCompile = (data: IntakeInputs) => {
    if (data.ind === "Retail") {
      return {
        proposal: "Sovereign SAP freight ledger auditing. Syncs inventory routes to reduce port bottleneck overhead by 22%.",
        squad: [{ r: "AS-02 Supervisor", d: "Decomposes container and carrier logs." }, { r: "Route Optimizer", d: "Maps overland cargo bottlenecks." }],
        timeline: ["Day 1-15: Map SAP connectors", "Day 16-45: Configure workflow DAGs", "Day 46-90: Air-gapped pilot launch"]
      };
    }
    if (data.ind === "Healthcare") {
      return {
        proposal: "HIPAA-compliant medical record parsing and continuous FDA compliance telemetry without data retention.",
        squad: [{ r: "Privacy Watchdog", d: "Enforces air-gapped memory locks." }, { r: "Note Synthesizer", d: "Parses clinical notes to vector schemas." }],
        timeline: ["Day 1-20: Establish hardware VPC", "Day 21-50: Tune parser weights", "Day 51-90: HIPAA-certified deployment"]
      };
    }
    return {
      proposal: "Automated ledger reconciliation and real-time security auditing. Implements multi-system Consensus DAG structures.",
      squad: [{ r: "AS-09 Auditor", d: "Orchestrates database balance sweeps." }, { r: "Policy Guardrail", d: "Isolates and alerts cloud configuration drift." }],
      timeline: ["Day 1-10: Connect database mirrors", "Day 11-40: Establish reconciliation logic", "Day 41-90: Live transaction sandbox and automated SOC2 auditing"]
    };
  };

  const ResultComponent = ({ data, result, onReset }: { data: IntakeInputs; result: any; onReset: () => void }) => {
    const [activeTab, setActiveTab] = useState<"proposal" | "squad" | "timeline">("proposal");
    const [messages, setMessages] = useState([{ s: "agent", t: "GFF Supervisor online. Sandboxed instruction terminal ready." }]);
    const [inVal, setInVal] = useState("");

    const handleSendTerminal = (e: React.FormEvent) => {
      e.preventDefault();
      if (!inVal.trim()) return;
      setMessages((p) => [...p, { s: "user", t: inVal }, { s: "agent", t: `[Supervisor] Isolated dry-run execution successful for objective: "${inVal}"` }]);
      setInVal("");
    };

    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-white animate-fadeIn">
        <div className="lg:col-span-5 p-6 rounded-2xl border border-white/5 bg-[#04060b] space-y-4">
          <h3 className="text-xs font-mono text-white/40 uppercase">Sandbox Terminal Simulator</h3>
          <div className="h-40 rounded-lg border border-white/5 bg-black/60 p-3 overflow-y-auto font-mono text-[10px] space-y-1">
            {messages.map((m, idx) => (
              <div key={idx} className={m.s === "user" ? "text-right" : "text-left"}>
                <span className={m.s === "user" ? "text-[#009DFF]" : "text-white/60"}>
                  {m.s === "user" ? "> " : "[SUPERVISOR] "}{m.t}
                </span>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendTerminal} className="flex gap-2">
            <input type="text" value={inVal} onChange={(e) => setInVal(e.target.value)} placeholder="Type sandbox objective..." className="flex-grow h-9 rounded-lg border border-[#ffffff15] bg-black px-3 text-[11px] text-white focus:outline-none" />
            <button type="submit" className="px-4 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold hover:bg-white/10">Execute</button>
          </form>
        </div>

        <div className="lg:col-span-7 p-6 rounded-2xl border border-white/5 bg-[#04060b] space-y-6">
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <h3 className="text-xs font-mono text-white/40 uppercase">Framework Preview</h3>
            <div className="flex gap-1">
              {(["proposal", "squad", "timeline"] as const).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-2.5 py-1 rounded text-[10px] font-mono uppercase transition ${activeTab === tab ? "bg-[#009DFF]/10 text-[#009DFF] border border-[#009DFF]/20" : "text-white/40 hover:text-white"}`}>
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {activeTab === "proposal" && (
            <div className="space-y-3">
              <span className="text-[9px] font-mono text-[#00FF9D] uppercase block">Proposal Brief</span>
              <p className="text-white/80 text-xs leading-relaxed font-light">{result.proposal}</p>
            </div>
          )}

          {activeTab === "squad" && (
            <div className="space-y-3">
              <span className="text-[9px] font-mono text-[#9D00FF] uppercase block">Recommended Squad</span>
              <div className="space-y-2">
                {result.squad.map((m: any, i: number) => (
                  <div key={i} className="p-3 rounded bg-white/[0.01] border border-white/5">
                    <span className="text-xs font-bold text-white block">{m.r}</span>
                    <span className="text-[10px] text-white/50">{m.d}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "timeline" && (
            <div className="space-y-3">
              <span className="text-[9px] font-mono text-[#E4000F] uppercase block">90-Day Roadmap</span>
              <div className="space-y-2">
                {result.timeline.map((item: string, i: number) => (
                  <div key={i} className="flex gap-3 text-xs text-white/80 font-light items-center">
                    <span className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-mono font-bold text-[#009DFF]">{i+1}</span>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-white/5 flex justify-between items-center">
            <span className="text-[10px] text-white/30 font-mono">0% Retention sandbox</span>
            <button type="button" onClick={onReset} className="px-4 h-8 rounded border border-white/10 text-xs hover:bg-white/5 font-mono uppercase">Reconfigure</button>
          </div>
          <ToolCTA />
        </div>
      </div>
    );
  };

  return (
    <ToolPageShell>
      <WizardStepperSystem
        toolName="AI Challenge Intake Console"
        category="Intake & Simulator"
        toolDescription="Submit your enterprise operational bottleneck to generate tailored squad configurations, proposals, and sandboxed trace timelines."
        steps={steps}
        initialData={initialData}
        summaryItems={(d: IntakeInputs) => [
          { label: "Sector Focus", value: d.ind.toUpperCase() },
          { label: "Target Scope", value: d.size },
          { label: "Description Length", value: `${d.desc.length} chars`, color: "#009DFF" }
        ]}
        onCompile={(d: IntakeInputs) => onCompile(d)}
        renderResult={(data: IntakeInputs, res: any, onReset: () => void) => (
          <ResultComponent data={data} result={res} onReset={onReset} />
        )}
        metricLabel="SECURE ENCLAVE STATUS"
        metricValue="SANDBOX_ONLINE"
      />
    </ToolPageShell>
  );
}
