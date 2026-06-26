"use client";

import React from "react";
import { ToolPageShell, ToolInputGroup, ToolCTA, ToolOptionGrid } from "@/components/build/components";
import { WizardStepperSystem } from "@/components/build/WizardStepperSystem";
import { calculateAssessmentScore } from "@/components/build/services";
import { AssessmentAnswers, AssessmentResult, Industry } from "@/components/build/types";

export default function AssessmentPage() {
  const initialData: AssessmentAnswers = {
    dataIntegration: 3, vpcIsolation: 3, complianceTelemetry: 3, fleetStrategy: 3, industry: "banking"
  };

  const industryOptions = [
    {
      id: "banking",
      title: "Banking & Finance",
      description: "Hardened ledgers, high-frequency compliance checks, and secure enclaves.",
      accentColor: "#009DFF",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: "healthcare",
      title: "Healthcare & Biotech",
      description: "HIPAA-compliant processing, local clinical vectors, zero log retention.",
      accentColor: "#00FF9D",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    },
    {
      id: "telecom",
      title: "Telecom Networks",
      description: "High-volume operational routing, fraud watchdog, and minimal latency.",
      accentColor: "#9D00FF",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: "retail",
      title: "Retail & Supply Chain",
      description: "SAP ERP integration, routing heuristics, and cargo route optimizations.",
      accentColor: "#E4000F",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    },
    {
      id: "energy",
      title: "Energy & Utilities",
      description: "Grid telemetries, resource scaling algorithms, SOC2-verified operations.",
      accentColor: "#3B82F6",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      id: "public-sector",
      title: "Public Sector & Gov",
      description: "Air-gapped national sovereign node baselines with single-tenant VPC.",
      accentColor: "#EC4899",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      )
    }
  ];

  const steps = [
    {
      id: "data", label: "Data Pipelines", description: "Inbound schema.",
      render: ({ data, onChange }: any) => (
        <ToolInputGroup label="Data Integration" valueDisplay={`Level ${data.dataIntegration}`}>
          <input type="range" min="1" max="5" value={data.dataIntegration} onChange={(e) => onChange({ dataIntegration: Number(e.target.value) })} className="w-full accent-[#009DFF]" />
        </ToolInputGroup>
      )
    },
    {
      id: "vpc", label: "VPC Network", description: "Enclave isolation.",
      render: ({ data, onChange }: any) => (
        <ToolInputGroup label="Network Isolation" valueDisplay={`Level ${data.vpcIsolation}`} accentColor="#9D00FF">
          <input type="range" min="1" max="5" value={data.vpcIsolation} onChange={(e) => onChange({ vpcIsolation: Number(e.target.value) })} className="w-full accent-[#9D00FF]" />
        </ToolInputGroup>
      )
    },
    {
      id: "compliance", label: "Compliance", description: "Log rules.",
      render: ({ data, onChange }: any) => (
        <ToolInputGroup label="Telemetry Observability" valueDisplay={`Level ${data.complianceTelemetry}`} accentColor="#E4000F">
          <input type="range" min="1" max="5" value={data.complianceTelemetry} onChange={(e) => onChange({ complianceTelemetry: Number(e.target.value) })} className="w-full accent-[#E4000F]" />
        </ToolInputGroup>
      )
    },
    {
      id: "fleet", label: "Agentic Fleet", description: "DAG orchestration.",
      render: ({ data, onChange }: any) => (
        <ToolInputGroup label="Fleet Strategy" valueDisplay={`Level ${data.fleetStrategy}`} accentColor="#00FF9D">
          <input type="range" min="1" max="5" value={data.fleetStrategy} onChange={(e) => onChange({ fleetStrategy: Number(e.target.value) })} className="w-full accent-[#00FF9D]" />
        </ToolInputGroup>
      )
    },
    {
      id: "industry", label: "Sector Selection", description: "Select domain.",
      render: ({ data, onChange }: any) => (
        <div className="space-y-4">
          <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider block">CHOOSE PRIMARY FIELD</span>
          <ToolOptionGrid
            options={industryOptions}
            selectedId={data.industry}
            onChange={(id) => onChange({ industry: id as Industry })}
          />
        </div>
      )
    }
  ];

  return (
    <ToolPageShell>
      <WizardStepperSystem
        toolName="Sovereign AI Readiness Assessor"
        category="Interactive Diagnostic"
        toolDescription="Benchmark secure readiness metrics deterministically."
        steps={steps}
        initialData={initialData}
        summaryItems={(d: AssessmentAnswers) => [
          { label: "Data", value: `Level ${d.dataIntegration}` },
          { label: "VPC", value: `Level ${d.vpcIsolation}` },
          { label: "Compliance", value: `Level ${d.complianceTelemetry}` },
          { label: "Fleet", value: `Level ${d.fleetStrategy}` },
          { label: "Industry", value: d.industry.toUpperCase(), color: "#009DFF" }
        ]}
        onCompile={(d: AssessmentAnswers) => calculateAssessmentScore(d)}
        renderResult={(data: AssessmentAnswers, res: AssessmentResult, onReset: () => void) => (
          <div className="space-y-6 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-4 p-5 rounded-2xl border border-white/5 bg-[#04060b] text-center space-y-4">
                <span className="text-[10px] font-mono text-white/40 block">MATURITY SCORE</span>
                <span className="text-4xl font-extrabold font-mono text-[#009DFF] block">{res.score}%</span>
                <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl text-left">
                  <span className="text-xs font-mono font-bold uppercase block" style={{ color: res.color }}>{res.level}</span>
                  <p className="text-[11px] text-white/50 leading-relaxed mt-1.5 font-light">{res.description}</p>
                </div>
              </div>
              <div className="lg:col-span-8 p-5 rounded-2xl border border-white/5 bg-[#04060b] space-y-3">
                <h3 className="text-xs font-mono text-white/40 uppercase">Vectors</h3>
                {res.dimensionScores.map((dim, idx) => (
                  <div key={idx} className="p-2.5 rounded bg-white/[0.005] border border-white/5 text-xs flex justify-between">
                    <span className="font-bold">{dim.label}</span>
                    <span className="text-[#00FF9D] font-mono">Maturity {dim.score}/5</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-white/5">
              <span className="text-[10px] text-white/30 font-mono">0% Retention local audits</span>
              <button type="button" onClick={onReset} className="px-4 h-8 rounded border border-white/10 text-xs text-white hover:bg-white/5 font-mono uppercase">Reconfigure</button>
            </div>
            <ToolCTA />
          </div>
        )}
        metricLabel="READINESS SCORE"
        metricValue="AIR-SECURE"
      />
    </ToolPageShell>
  );
}
