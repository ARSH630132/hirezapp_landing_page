"use client";

import React, { useState } from "react";

const STAGES = [
  {
    phase: "PHASE 01",
    title: "GARAGE",
    subtitle: "Rapid Prototyping",
    duration: "1 - 2 WEEKS",
    focus: "Discovery workshop, architectural sandbox framing, and live technical feasibility validation.",
    outputs: ["Interactive Architecture Blueprint", "High-fidelity UX mock sandbox", "Production ROI report"],
    color: "#E4000F",
  },
  {
    phase: "PHASE 02",
    title: "FOUNDRY",
    subtitle: "Secure Hardening",
    duration: "4 - 6 WEEKS",
    focus: "Concrete multi-agent engineering, zero-trust containerization, and continuous telemetry pipeline setup.",
    outputs: ["Production-ready API endpoints", "SOC2 security audit reports", "High-throughput performance logs"],
    color: "#FFFFFF",
  },
  {
    phase: "PHASE 03",
    title: "FACTORY",
    subtitle: "Continuous Scale",
    duration: "ENTERPRISE LIFECYCLE",
    focus: "Deploying models to production clusters with real-time heuristic monitoring, self-healing code, and automated updates.",
    outputs: ["24/7 autonomous node monitoring", "Dynamic compute provisioning", "Continuous learning updates"],
    color: "#009DFF",
  },
];

export default function OperatingModelTimeline() {
  const [active, setActive] = useState(0);
  const data = STAGES[active];

  return (
    <div className="w-full py-6">
      {/* Horizontal timeline (Hidden on mobile) */}
      <div className="hidden md:flex items-center justify-between relative max-w-[1000px] mx-auto mb-10">
        <div className="absolute top-[38px] left-[10%] right-[10%] h-[1px] bg-white/10 z-0">
          <div 
            className="h-full bg-gradient-to-r from-[#E4000F] via-white to-[#009DFF] transition-all duration-300"
            style={{ width: `${(active / (STAGES.length - 1)) * 100}%` }}
          />
        </div>

        {STAGES.map((stage, idx) => (
          <button key={stage.title} onClick={() => setActive(idx)} className="flex flex-col items-center relative z-10 w-[30%]">
            <span className="text-[10px] tracking-widest font-mono text-white/40">{stage.phase}</span>
            <div className="mt-2 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all bg-[#0c0c0e]" style={{ borderColor: active === idx ? stage.color : "rgba(255,255,255,0.15)" }}>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color }} />
            </div>
            <span className="mt-2 text-[13px] font-bold tracking-[0.05em] text-white">{stage.title}</span>
            <span className="text-[10px] text-white/50 font-mono mt-0.5">{stage.duration}</span>
          </button>
        ))}
      </div>

      {/* Details Card */}
      <div className="max-w-[800px] mx-auto rounded-[24px] border border-white/5 bg-[#050505]/65 backdrop-blur-[8px] p-6 lg:p-8 relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-20%] w-[50%] h-[50%] rounded-full blur-[80px] opacity-20 pointer-events-none" style={{ backgroundColor: data.color }} />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div>
            <span className="text-[10px] font-mono tracking-widest uppercase" style={{ color: data.color }}>{data.phase} — {data.duration}</span>
            <h3 className="text-[22px] lg:text-[25px] font-bold text-white tracking-tight mt-1 flex items-center gap-2">
              {data.title}
              <span className="text-[11px] font-normal text-white/50 font-mono">({data.subtitle})</span>
            </h3>
          </div>

          <div className="flex md:hidden gap-1 bg-white/5 p-1 rounded-full border border-white/10 self-start">
            {STAGES.map((s, i) => (
              <button key={s.title} onClick={() => setActive(i)} className={`px-2.5 py-1 text-[10px] font-bold rounded-full transition-colors ${active === i ? "bg-white text-black" : "text-white/60"}`}>{s.title}</button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-[11px] uppercase text-white/40 tracking-wider font-semibold">Strategic Focus</h4>
            <p className="mt-1.5 text-[13.5px] leading-[1.5] text-white/70 font-light">{data.focus}</p>
          </div>
          <div>
            <h4 className="text-[11px] uppercase text-white/40 tracking-wider font-semibold">Key Outputs</h4>
            <ul className="mt-2 flex flex-col gap-2">
              {data.outputs.map((out, i) => (
                <li key={i} className="flex items-center gap-2 text-[12.5px] text-white/80">
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: data.color }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4" />
                  </svg>
                  <span className="font-light">{out}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
