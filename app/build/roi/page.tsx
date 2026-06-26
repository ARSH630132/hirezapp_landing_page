"use client";

import React from "react";
import { ToolPageShell, ToolInputGroup, ToolCTA, ToolOptionGrid } from "@/components/build/components";
import { WizardStepperSystem } from "@/components/build/WizardStepperSystem";
import { calculateSharedROIEstimate } from "@/lib/shared-validation";
import { SharedROIInputs, SharedROIResult } from "@/lib/shared-validation";
import { SharedPriority } from "@/lib/shared-constants";

export default function ROICalculatorPage() {
  const initialData: SharedROIInputs = {
    teamSize: 250, avgHourlyRate: 65, inefficientHoursPerWeek: 8, initialInvestment: 35000, priority: "Reduce Costs"
  };

  const priorityOptions = [
    {
      id: "Reduce Costs",
      title: "Reduce Costs",
      description: "Optimize operations and eliminate infrastructure redundancies.",
      accentColor: "#E4000F",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
        </svg>
      )
    },
    {
      id: "Increase Revenue",
      title: "Increase Revenue",
      description: "Unlock sovereign AI transaction agents and new channels.",
      accentColor: "#00FF9D",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    },
    {
      id: "Improve Productivity",
      title: "Improve Productivity",
      description: "Automate repetitive administrative workflows and data collection.",
      accentColor: "#009DFF",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      id: "Improve Customer Experience",
      title: "Improve Customer Experience",
      description: "Deliver secure, ultra-low latency contextual service agents.",
      accentColor: "#3B82F6",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    },
    {
      id: "Automate Processes",
      title: "Automate Processes",
      description: "Orchestrate complex DAG models with continuous watchdog oversight.",
      accentColor: "#9D00FF",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.2 8H18" />
        </svg>
      )
    },
    {
      id: "Strengthen Compliance",
      title: "Strengthen Compliance",
      description: "Enforce zero data-retention and audit logs natively inside private VPCs.",
      accentColor: "#EC4899",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      id: "AI Transformation",
      title: "AI Transformation",
      description: "Transition enterprise systems to run-time sovereign agents.",
      accentColor: "#8B5CF6",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.663 17h4.673M12 3v1m6.364 .364l-.707 .707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    }
  ];

  const steps = [
    {
      id: "team", label: "Enterprise Scale", description: "Number of full-time employees impacted.",
      render: ({ data, onChange }: any) => (
        <ToolInputGroup label="Team Size" valueDisplay={`${data.teamSize} Employees`}>
          <input type="range" min="10" max="1000" step="10" value={data.teamSize} onChange={(e) => onChange({ teamSize: Number(e.target.value) })} className="w-full accent-[#E4000F]" />
        </ToolInputGroup>
      )
    },
    {
      id: "hours", label: "Operational Friction", description: "Inefficient hours spent per employee weekly.",
      render: ({ data, onChange }: any) => (
        <ToolInputGroup label="Friction Hours" valueDisplay={`${data.inefficientHoursPerWeek} Hours/Week`} accentColor="#009DFF">
          <input type="range" min="1" max="40" value={data.inefficientHoursPerWeek} onChange={(e) => onChange({ inefficientHoursPerWeek: Number(e.target.value) })} className="w-full accent-[#009DFF]" />
        </ToolInputGroup>
      )
    },
    {
      id: "rate", label: "Average Rate", description: "Blended hourly resource rate.",
      render: ({ data, onChange }: any) => (
        <ToolInputGroup label="Average Hourly Rate" valueDisplay={`${data.avgHourlyRate}/Hour`} accentColor="#00FF9D">
          <input type="range" min="25" max="250" step="5" value={data.avgHourlyRate} onChange={(e) => onChange({ avgHourlyRate: Number(e.target.value) })} className="w-full accent-[#00FF9D]" />
        </ToolInputGroup>
      )
    },
    {
      id: "invest", label: "Investment", description: "Initial setup allocation.",
      render: ({ data, onChange }: any) => (
        <ToolInputGroup label="Initial Investment" valueDisplay={`${data.initialInvestment.toLocaleString()}`} accentColor="#9D00FF">
          <input type="range" min="5000" max="250000" step="5000" value={data.initialInvestment} onChange={(e) => onChange({ initialInvestment: Number(e.target.value) })} className="w-full accent-[#9D00FF]" />
        </ToolInputGroup>
      )
    },
    {
      id: "priority", label: "Strategy Priority", description: "Choose target commercial focus.",
      render: ({ data, onChange }: any) => (
        <div className="space-y-4">
          <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider block">Select Enterprise Directive</span>
          <ToolOptionGrid
            options={priorityOptions}
            selectedId={data.priority}
            onChange={(id) => onChange({ priority: id as SharedPriority })}
          />
        </div>
      )
    }
  ];

  return (
    <ToolPageShell>
      <WizardStepperSystem
        toolName="Operational ROI Calculator"
        category="Executive Calculator"
        toolDescription="Quantify cost reductions, productivity reclaimed, and payback milestones of deploying autonomous enclaves."
        steps={steps}
        initialData={initialData}
        summaryItems={(d: SharedROIInputs) => [
          { label: "Scale", value: `${d.teamSize} FTEs` },
          { label: "Friction", value: `${d.inefficientHoursPerWeek} hrs` },
          { label: "Rate", value: `${d.avgHourlyRate}/hr` },
          { label: "Allocated", value: `${d.initialInvestment.toLocaleString()}` },
          { label: "Target Focus", value: d.priority, color: "#009DFF" }
        ]}
        onCompile={(d: SharedROIInputs) => calculateSharedROIEstimate(d)}
        renderResult={(data: SharedROIInputs, res: SharedROIResult, onReset: () => void) => (
          <div className="space-y-6 text-white animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl border border-white/5 bg-[#030304]/80 text-center">
                <span className="text-[10px] font-mono text-white/40 block">ANNUAL RESOURCE RECLAIMED</span>
                <span className="text-3xl font-extrabold font-mono text-[#00FF9D] mt-2 block">{res.annualHoursSaved.toLocaleString()} Hrs</span>
              </div>
              <div className="p-5 rounded-2xl border border-white/5 bg-[#030304]/80 text-center">
                <span className="text-[10px] font-mono text-white/40 block">NET COMMERCIAL SAVINGS</span>
                <span className="text-3xl font-extrabold font-mono text-[#009DFF] mt-2 block">${res.netSavings.toLocaleString()}</span>
              </div>
              <div className="p-5 rounded-2xl border border-white/5 bg-[#030304]/80 text-center">
                <span className="text-[10px] font-mono text-white/40 block">PAYBACK HORIZON</span>
                <span className="text-3xl font-extrabold font-mono text-white mt-2 block">{res.paybackMonths} Months</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-[#009DFF]/20 bg-[#009DFF]/5 text-center space-y-2">
              <span className="text-[10px] font-mono text-[#009DFF] uppercase tracking-widest block font-bold">MODELING METRIC PROJECTION</span>
              <h3 className="text-2xl font-bold font-mono">ESTIMATED FIRST-YEAR RETURN: {res.roiPercentage}% ROI</h3>
              <p className="text-xs text-white/60 font-light max-w-lg mx-auto">Calculated dynamically against zero-landing sovereign buffers. Deployment of autonomous nodes are modelled for near-zero compliance leakage.</p>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-white/5">
              <span className="text-[10px] text-white/30 font-mono">0% retention modeling</span>
              <button type="button" onClick={onReset} className="px-4 h-8 rounded border border-white/10 text-xs text-white hover:bg-white/5 font-mono uppercase">Reconfigure</button>
            </div>
            <ToolCTA />
          </div>
        )}
        metricLabel="RECOVER HORIZON"
        metricValue="100% LOCAL"
      />
    </ToolPageShell>
  );
}
