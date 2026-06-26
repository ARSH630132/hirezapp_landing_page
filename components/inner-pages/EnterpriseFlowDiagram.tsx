"use client";

import React, { useState } from "react";

const NODES = [
  { id: "route", title: "Semantic Router", desc: "Analyzes intent, security risk, and selects specialized agents.", role: "GATEWAY" },
  { id: "agent", title: "Multi-Agent Cluster", desc: "Executes computations, accesses vector memories, and generates payloads.", role: "COMPUTE" },
  { id: "guard", title: "AI Safety Guardrails", desc: "Heuristics & LLMs scan outputs for PII leaks, safety compliance, or format errors.", role: "COMPLIANCE" },
  { id: "audit", title: "Human-in-the-Loop Audit", desc: "Ensures critical actions (e.g. wire transfers, medical edits) are approved by managers.", role: "HUMAN BLOCK" },
  { id: "dispatch", title: "Gateway Dispatcher", desc: "Encrypts and safely executes validated actions on your database.", role: "EXECUTION" }
];

export default function EnterpriseFlowDiagram() {
  const [hovered, setHovered] = useState<string | null>(null);
  const node = NODES.find((n) => n.id === hovered) || NODES[0];

  return (
    <div className="w-full rounded-[24px] border border-white/5 bg-[#050505]/40 backdrop-blur-[12px] p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        <div className="lg:col-span-8 flex flex-col items-center">
          <p className="text-[11px] font-bold tracking-[0.15em] text-[#009DFF] uppercase mb-4 text-center">HOVER NODES TO INSPECT RUNTIME STATE</p>
          <svg className="w-full max-w-[500px] h-auto aspect-[550/280]" viewBox="0 0 550 280" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M70 140 L160 140 M240 140 L310 140 M390 140 L460 140 M480 120 L480 60 L200 60 L200 110" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
            <path d="M240 140 L310 140" stroke="#009DFF" strokeWidth="1.5" strokeDasharray="4 4" />
            <path d="M480 120 L480 60 L200 60 L200 110" stroke="#E4000F" strokeWidth="1" strokeDasharray="5 5" />

            <circle cx="40" cy="140" r="15" fill="#E4000F" />
            <text x="40" y="143" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle">IN</text>

            {[
              { id: "route", x: 130, txt: "Router", r: "GATEWAY" },
              { id: "agent", x: 280, txt: "Agent Pool", r: "COMPUTE", fill: "url(#lg)" },
              { id: "guard", x: 430, txt: "Guardrails", r: "SECURITY" }
            ].map((n) => (
              <g key={n.id} onMouseEnter={() => setHovered(n.id)} onMouseLeave={() => setHovered(null)} className="cursor-pointer">
                <rect x={n.x} y="110" width="100" height="60" rx="12" fill={hovered === n.id ? (n.id === "guard" ? "#E4000F" : "#009DFF") : "#0A0A0C"} stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
                <text x={n.x + 50} y="140" fill="white" fontSize="10" fontWeight="600" textAnchor="middle">{n.txt}</text>
                <text x={n.x + 50} y="152" fill="white" fontSize="7" opacity="0.5" textAnchor="middle">{n.r}</text>
              </g>
            ))}

            <path d="M480 170 L480 210 L310 210 M480 170 L480 250" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
            
            <g onMouseEnter={() => setHovered("audit")} onMouseLeave={() => setHovered(null)} className="cursor-pointer">
              <circle cx="310" cy="210" r="18" fill={hovered === "audit" ? "white" : "#0A0A0C"} stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
              <text x="310" y="213" fill={hovered === "audit" ? "black" : "white"} fontSize="8" fontWeight="bold" textAnchor="middle">AUDIT</text>
            </g>

            <g onMouseEnter={() => setHovered("dispatch")} onMouseLeave={() => setHovered(null)} className="cursor-pointer">
              <rect x="430" y="235" width="100" height="30" rx="6" fill={hovered === "dispatch" ? "#009DFF" : "#0A0A0C"} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <text x="480" y="253" fill="white" fontSize="9" fontWeight="600" textAnchor="middle">DISPATCH</text>
            </g>
          </svg>
        </div>

        <div className="lg:col-span-4 flex flex-col border-t lg:border-t-0 lg:border-l border-white/5 pt-6 lg:pt-0 lg:pl-6 min-h-[160px] justify-between">
          <div>
            <span className="text-[9px] font-mono tracking-widest text-[#009DFF] uppercase font-bold">{node.role} Node</span>
            <h4 className="text-[16px] font-semibold text-white mt-1">{node.title}</h4>
            <p className="text-[12.5px] leading-[1.45] text-white/60 mt-1.5 font-light">{node.desc}</p>
          </div>
          <div className="mt-3 pt-2 border-t border-white/5 text-[9px] text-white/30 font-mono">FLOW STATUS: ONLINE</div>
        </div>

      </div>
    </div>
  );
}
