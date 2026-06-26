"use client";

import React, { useState } from "react";
import { ToolPageShell, ToolCTA, ToolOptionGrid } from "@/components/build/components";
import { WizardStepperSystem } from "@/components/build/WizardStepperSystem";

interface ProposalInputs {
  scope: string;
  budget: string;
  compliance: string;
}

export default function ProposalStudioPage() {
  const initialData: ProposalInputs = {
    scope: "Enterprise Core Topology",
    budget: "$100k-$500k",
    compliance: "SOC2"
  };

  const scopeOptions = [
    {
      id: "Enterprise Core Topology",
      title: "Enterprise Core DAG",
      description: "Complete orchestrator setup for persistent multi-system agentic flows.",
      accentColor: "#009DFF",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      id: "Local Compliance Mesh",
      title: "Local Compliance Edge Mesh",
      description: "Air-gapped telemetry filters and sovereign consensus audit nodes.",
      accentColor: "#E4000F",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    }
  ];

  const budgetOptions = [
    {
      id: "$100k-$500k",
      title: "Strategic Incubation Tier",
      description: "Setup target for isolated MVP enclaves and localized modeling trials ($100k - $500k).",
      accentColor: "#00FF9D",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: "$500k-$2M",
      title: "Global Enterprise Scale",
      description: "Full production licensing, multi-region single-tenant VPC enclaves ($500k - $2M).",
      accentColor: "#9D00FF",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.5A1.5 1.5 0 0118 13.5v1a1.5 1.5 0 001.5 1.5h.5c.825 0 1.485.67 1.485 1.49C21.91 11.64 17.514 6 12 6c-1.42 0-2.77.297-4 .83M12 21a9 9 0 110-18 9 9 0 010 18z" />
        </svg>
      )
    }
  ];

  const complianceOptions = [
    {
      id: "SOC2",
      title: "SOC2 Type II Hardened",
      description: "Hardware-enforced zero persistence memory-locks with encrypted logging boundaries.",
      accentColor: "#3B82F6",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    },
    {
      id: "HIPAA",
      title: "HIPAA Protected Subnet",
      description: "Air-gapped PHI parsing nodes, private vector stores, complete single-tenant isolation.",
      accentColor: "#EC4899",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    }
  ];

  const steps = [
    {
      id: "scope", label: "Scope Target", description: "Select the target architectural coverage.",
      render: ({ data, onChange }: any) => (
        <div className="space-y-4">
          <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider block">Scope Target</span>
          <ToolOptionGrid
            options={scopeOptions}
            selectedId={data.scope}
            onChange={(id) => onChange({ scope: id })}
          />
        </div>
      )
    },
    {
      id: "budget", label: "Budget Tier", description: "Set the allocated setup budget constraint.",
      render: ({ data, onChange }: any) => (
        <div className="space-y-4">
          <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider block">Budget target</span>
          <ToolOptionGrid
            options={budgetOptions}
            selectedId={data.budget}
            onChange={(id) => onChange({ budget: id })}
          />
        </div>
      )
    },
    {
      id: "compliance", label: "Compliance", description: "Choose network boundary rules.",
      render: ({ data, onChange }: any) => (
        <div className="space-y-4">
          <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider block">Compliance boundary</span>
          <ToolOptionGrid
            options={complianceOptions}
            selectedId={data.compliance}
            onChange={(id) => onChange({ compliance: id })}
          />
        </div>
      )
    }
  ];

  const onCompile = (data: ProposalInputs) => {
    return {
      compiledAt: new Date().toLocaleTimeString(),
      hash: "SHA-256: 0x8a9bf3..."
    };
  };

  const ResultComponent = ({ data, result, onReset }: { data: ProposalInputs; result: any; onReset: () => void }) => {
    const [exporting, setExporting] = useState<string | null>(null);
    const [msg, setMsg] = useState<string | null>(null);

    const handleExport = (type: string) => {
      setExporting(type);
      setMsg(null);
      setTimeout(() => {
        setExporting(null);
        setMsg(`Algorithmic SOW for ${type} compiled in VPC memory. Delivery targets verified.`);
      }, 900);
    };

    const cards = [
      { id: "sow", l: "Statement of Work (SOW)", d: "Legal operational SLA enclaves framework.", f: "SOW_Sovereign.pdf", c: "#009DFF" },
      { id: "ppt", l: "Executive Pitch Deck", d: "Strategic Board slides showing ROI models.", f: "Board_Pitch.pptx", c: "#9D00FF" },
      { id: "nodes", l: "Architecture Blueprints", d: "DAG enclaves topological schema maps.", f: "DAG_Specs.pdf", c: "#E4000F" }
    ];

    return (
      <div className="space-y-6 text-white animate-fadeIn">
        <div className="space-y-3">
          <h3 className="text-xs font-mono text-white/40 uppercase">Compiled SOW Blueprint Bundles</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cards.map((card) => (
              <div key={card.id} className="p-5 rounded-2xl border border-white/5 bg-[#030304]/80 flex flex-col justify-between min-h-[220px]">
                <div className="space-y-2">
                  <span className="text-[8px] font-mono uppercase px-2 py-0.5 rounded" style={{ color: card.c, backgroundColor: `${card.c}10`, border: `1px solid ${card.c}20` }}>READY TO DOWNLOAD</span>
                  <h4 className="text-xs font-bold mt-2">{card.l}</h4>
                  <p className="text-[11px] text-white/50 leading-relaxed font-light">{card.d}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
                  <button onClick={() => handleExport(card.l)} disabled={exporting !== null} className="w-full h-8 rounded text-[10px] font-bold text-white transition bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50">
                    {exporting === card.l ? "Downloading..." : "Simulate Export"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {msg && (
          <div className="p-3.5 rounded-xl bg-[#00FF9D]/5 border border-[#00FF9D]/15 text-xs text-[#00FF9D] font-mono">
            {msg}
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t border-white/5">
          <span className="text-[10px] text-white/30 font-mono">Compiled: {result.compiledAt}</span>
          <button type="button" onClick={onReset} className="px-4 h-8 rounded border border-white/10 text-xs text-white hover:bg-white/5 font-mono uppercase">Reconfigure</button>
        </div>
        <ToolCTA />
      </div>
    );
  };

  return (
    <ToolPageShell>
      <WizardStepperSystem
        toolName="SOW Proposal Studio"
        category="Interactive SOW Studio"
        toolDescription="Instantly build Statement of Work, board-ready pitch deck, and architecture blueprints."
        steps={steps}
        initialData={initialData}
        summaryItems={(d: ProposalInputs) => [
          { label: "Scope", value: d.scope },
          { label: "Budget Tier", value: d.budget },
          { label: "Compliance", value: d.compliance.toUpperCase(), color: "#009DFF" }
        ]}
        onCompile={onCompile}
        renderResult={(data, result, onReset) => <ResultComponent data={data} result={result} onReset={onReset} />}
        metricLabel="PROPOSAL COMPLIANCE"
        metricValue="SOC2-VERIFIED"
      />
    </ToolPageShell>
  );
}