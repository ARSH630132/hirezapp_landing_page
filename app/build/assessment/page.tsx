"use client";

import { useState } from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";

export default function AssessmentPage() {
  const [data, setData] = useState(3);
  const [sec, setSec] = useState(2);
  const [governance, setGovernance] = useState(3);
  const [agents, setAgents] = useState(2);

  const totalScore = Math.round(((data + sec + governance + agents) / 20) * 100);

  const getReport = (score: number) => {
    if (score >= 80) return { name: "Optimized Enterprise Fleet Ready", color: "#00FF9D", r: "Your data ingestion nodes and compliance policies are fully prepared for highly autonomous multi-agent systems." };
    if (score >= 50) return { name: "Scale Phase Strategic Incubation", color: "#E98828", r: "Your infrastructure possesses solid base layers, but lacks active compliance telemetry and secure model shielding." };
    return { name: "Discovery Phase Advisory Sandbox", color: "#E4000F", r: "Your data is currently siloed and compliance scanning is manual. Sandbox validation in GFF Labs is highly recommended." };
  };

  const report = getReport(totalScore);

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Interactive Tool"
        title="AI Readiness Assessor"
        description="Verify your organization's data, security, auditing, and execution layers against best-in-class multi-agent frameworks."
      />
      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Levers */}
        <div className="lg:col-span-7 space-y-6 p-6 rounded-2xl border border-white/10 bg-[#04060b]">
          <h3 className="text-sm font-bold text-white/40 uppercase tracking-wider">Evaluation Levers</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-white/80">Data Pipelines Integration</span>
              <span className="text-[#9D00FF] font-bold">Level {data} / 5</span>
            </div>
            <input type="range" min="1" max="5" value={data} onChange={(e) => setData(Number(e.target.value))} className="w-full accent-[#9D00FF]" />
            <div className="flex justify-between text-[10px] text-white/30"><span>Siloed databases</span><span>Unified vector cache</span></div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-white/80">Security & Isolation Subnet</span>
              <span className="text-[#9D00FF] font-bold">Level {sec} / 5</span>
            </div>
            <input type="range" min="1" max="5" value={sec} onChange={(e) => setSec(Number(e.target.value))} className="w-full accent-[#9D00FF]" />
            <div className="flex justify-between text-[10px] text-white/30"><span>Ad-hoc cloud services</span><span>Hardened private VPC</span></div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-white/80">Compliance & Auditing telemetry</span>
              <span className="text-[#9D00FF] font-bold">Level {governance} / 5</span>
            </div>
            <input type="range" min="1" max="5" value={governance} onChange={(e) => setGovernance(Number(e.target.value))} className="w-full accent-[#9D00FF]" />
            <div className="flex justify-between text-[10px] text-white/30"><span>Manual audits</span><span>Real-time agent logging</span></div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-white/80">Agent Deployments Strategy</span>
              <span className="text-[#9D00FF] font-bold">Level {agents} / 5</span>
            </div>
            <input type="range" min="1" max="5" value={agents} onChange={(e) => setAgents(Number(e.target.value))} className="w-full accent-[#9D00FF]" />
            <div className="flex justify-between text-[10px] text-white/30"><span>Isolated scripts</span><span>Autonomous fleet graphs</span></div>
          </div>
        </div>

        {/* Report Card */}
        <div className="lg:col-span-5 p-6 rounded-2xl border border-white/10 bg-[#04060b] flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white/40 uppercase tracking-wider mb-6">Maturity Report</h3>
            <div className="text-center py-6 border-b border-white/5">
              <span className="text-[10px] text-white/40 uppercase tracking-wider block">Estimated Readiness Score</span>
              <span className="text-4xl sm:text-5xl font-extrabold text-[#9D00FF] block mt-2">{totalScore}%</span>
            </div>
            <div className="mt-6 space-y-3">
              <span className="text-xs font-bold block" style={{ color: report.color }}>{report.name}</span>
              <p className="text-xs text-white/60 leading-relaxed">{report.r}</p>
            </div>
          </div>
          <button className="w-full h-[42px] rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-white hover:bg-white/10 mt-6">
            Download Custom Advisory PDF
          </button>
        </div>
      </div>
    </InnerPageShell>
  );
}
