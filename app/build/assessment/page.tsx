"use client";

import { useState } from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";

export default function AssessmentPage() {
  const [data, setData] = useState(3);
  const [sec, setSec] = useState(2);
  const [gov, setGov] = useState(3);
  const [agent, setAgent] = useState(2);
  const [downloading, setDownloading] = useState(false);
  const [previewReport, setPreviewReport] = useState(false);

  const totalScore = Math.round(((data + sec + gov + agent) / 20) * 100);

  const getAdvisory = (score: number) => {
    if (score >= 80) {
      return {
        level: "Sovereign Production Ready",
        color: "#00FF9D",
        desc: "Your network edge nodes and unified vector cash stores are fully optimized for autonomous agent deployment in hardened private subnets."
      };
    }
    if (score >= 50) {
      return {
        level: "Strategic Incubation Required",
        color: "#3B82F6",
        desc: "Solid infrastructural foundations exist, but real-time audit logs and single-tenant hardware isolation policies require further alignment."
      };
    }
    return {
      level: "Discovery Sandbox Phase",
      color: "#E4000F",
      desc: "Your data resides in disconnected legacy clusters. Running an isolated sandbox trace in GFF Labs is highly recommended to design security schemas."
    };
  };

  const advice = getAdvisory(totalScore);

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setPreviewReport(true);
    }, 1000);
  };

  return (
    <InnerPageShell>
      <InnerPageHero category="Interactive Diagnostic" title="AI Readiness Assessor" description="Benchmark database structures, VPC networks, and compliance schemas against autonomous standards." />
      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-24 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 p-6 rounded-2xl border border-white/5 bg-[#04060b] space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Evaluation Levers</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-white/80"><span>Data Pipelines Integration</span><span className="text-[#009DFF] font-bold">Level {data}</span></div>
                <input type="range" min="1" max="5" value={data} onChange={(e) => { setData(Number(e.target.value)); setPreviewReport(false); }} className="w-full accent-[#009DFF]" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-white/80"><span>VPC Network Isolation</span><span className="text-[#9D00FF] font-bold">Level {sec}</span></div>
                <input type="range" min="1" max="5" value={sec} onChange={(e) => { setSec(Number(e.target.value)); setPreviewReport(false); }} className="w-full accent-[#9D00FF]" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-white/80"><span>Compliance Telemetry</span><span className="text-[#3B82F6] font-bold">Level {gov}</span></div>
                <input type="range" min="1" max="5" value={gov} onChange={(e) => { setGov(Number(e.target.value)); setPreviewReport(false); }} className="w-full accent-[#3B82F6]" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-white/80"><span>Multi-Agent Fleet Strategy</span><span className="text-[#00FF9D] font-bold">Level {agent}</span></div>
                <input type="range" min="1" max="5" value={agent} onChange={(e) => { setAgent(Number(e.target.value)); setPreviewReport(false); }} className="w-full accent-[#00FF9D]" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 rounded-2xl border border-white/5 bg-[#04060b] flex flex-col justify-between min-h-[400px]">
            <div className="space-y-5">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Maturity Analysis</h3>
              <div className="text-center py-4 bg-white/[0.01] border border-white/5 rounded-xl">
                <span className="text-[10px] text-white/40 block font-mono">Index Score</span>
                <span className="text-3xl font-extrabold text-[#009DFF] block mt-1">{totalScore}%</span>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold uppercase tracking-wider" style={{ color: advice.color }}>{advice.level}</span>
                <p className="text-xs text-white/60 leading-relaxed font-light">{advice.desc}</p>
              </div>
              {previewReport && (
                <p className="text-xs text-[#00FF9D] bg-emerald-500/5 p-3 rounded-lg border border-emerald-500/10">Simulated PDF report compiled in memory. Schedule a Technical Consultation to retrieve.</p>
              )}
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 space-y-2">
              <button onClick={handleDownload} disabled={downloading} className="w-full h-10 rounded-lg text-xs font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition uppercase tracking-wider">{downloading ? "Compiling PDF..." : "Simulate Advisory PDF"}</button>
            </div>
          </div>
        </div>
        <PremiumCTA />
      </div>
    </InnerPageShell>
  );
}
