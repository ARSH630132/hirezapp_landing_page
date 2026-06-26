"use client";

import React, { useState } from "react";

const LAYERS = [
  {
    id: "ingest",
    name: "Data Ingestion & Gateway",
    shortDesc: "Secure, high-throughput pipelines for enterprise data, files, and live APIs.",
    features: ["Real-time CDC Sync", "JWT & TLS 1.3 Gateways", "Multi-modal pre-processing"],
    tech: ["gRPC", "Kafka", "eBPF"],
  },
  {
    id: "cognitive",
    name: "Orchestration & Agentic Layer",
    shortDesc: "The cognitive hub coordinating routing, tool execution, and safety guardrail checks.",
    features: ["Semantic Routing", "Self-Correction Loops", "PII & Toxicity Guardrails"],
    tech: ["GFF Custom Router", "vLLM", "Guardrails SDK"],
  },
  {
    id: "memory",
    name: "Enterprise Knowledge & Memory",
    shortDesc: "Long-term and short-term state managers keeping track of client context safely.",
    features: ["Hybrid Graph-Vector Search", "Role-Based Access Memory", "Cold storage backup"],
    tech: ["pgvector", "Neo4j", "Redis"],
  },
  {
    id: "action",
    name: "Action Gateways & Outbound",
    shortDesc: "Secure execution modules delivering payloads back to legacy systems or clients.",
    features: ["Human-in-the-Loop Audit", "Idempotent Webhooks", "OAuth Sandbox Execution"],
    tech: ["K8s", "Temporal", "Webhooks"],
  },
];

export default function ArchitectureDiagram() {
  const [active, setActive] = useState("cognitive");
  const data = LAYERS.find((l) => l.id === active) || LAYERS[1];

  return (
    <div className="w-full rounded-[24px] border border-white/5 bg-[#050505]/40 backdrop-blur-[12px] p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        <div className="lg:col-span-7 flex flex-col items-center">
          <p className="text-[11px] font-bold tracking-[0.15em] text-[#009DFF] uppercase mb-4 text-center">
            INTERACTIVE SYSTEM BLUEPRINT (CLICK TO INSPECT)
          </p>

          <svg className="w-full max-w-[450px] h-auto aspect-[500/320]" viewBox="0 0 500 320" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M250 50 L250 110 M250 150 L250 190 M250 230 L250 270" stroke="url(#pipeGlow)" strokeWidth="1.5" strokeDasharray="6 4" />
            
            {[
              { id: "ingest", y: 20, num: "1", txt: "Data Ingestion & Gateway", color: "#E4000F" },
              { id: "cognitive", y: 100, num: "2", txt: "Orchestration & Agentic Layer", color: "url(#brandG)", xW: 340, xX: 80 },
              { id: "memory", y: 180, num: "3", txt: "Enterprise Knowledge & Memory", color: "#009DFF" },
              { id: "action", y: 260, num: "4", txt: "Action Gateways & Outbound", color: "#E4000F" }
            ].map((layer) => (
              <g 
                key={layer.id} 
                onClick={() => setActive(layer.id)} 
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActive(layer.id);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-pressed={active === layer.id}
                className="cursor-pointer group focus:outline-none"
              >
                <rect 
                  x={layer.xX || 100} y={layer.y} width={layer.xW || 300} height="40" rx="10" 
                  fill={active === layer.id ? layer.color : "#0A0A0C"} 
                  stroke={active === layer.id ? "white" : "rgba(255,255,255,0.08)"} 
                  strokeWidth="1.5" className="transition-all duration-300 group-focus-visible:stroke-white group-focus-visible:stroke-[2px]" 
                />
                <text x="250" y={layer.y + 24} fill="white" fontSize="11" fontWeight="600" textAnchor="middle" className="pointer-events-none uppercase tracking-[0.05em]">
                  {layer.num}. {layer.txt}
                </text>
              </g>
            ))}

            <defs>
              <linearGradient id="brandG" x1="0" y1="0" x2="340" y2="0" gradientUnits="userSpaceOnUse">
                <stop stopColor="#E4000F" /><stop offset="1" stopColor="#009DFF" />
              </linearGradient>
              <linearGradient id="pipeGlow" x1="0" y1="0" x2="0" y2="320" gradientUnits="userSpaceOnUse">
                <stop stopColor="#E4000F" /><stop offset="0.5" stopColor="#FFFFFF" /><stop offset="1" stopColor="#009DFF" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="lg:col-span-5 flex flex-col border-t lg:border-t-0 lg:border-l border-white/5 pt-6 lg:pt-0 lg:pl-6 min-h-[220px] justify-between">
          <div>
            <span className="px-2 py-0.5 text-[9px] font-bold text-white/50 bg-white/5 rounded-full uppercase tracking-widest">Blueprint Inspector</span>
            <h4 className="mt-2 text-[17px] font-semibold text-white tracking-tight">{data.name}</h4>
            <p className="mt-1.5 text-[13px] leading-[1.5] text-white/60 font-light">{data.shortDesc}</p>
            <ul className="mt-3 flex flex-col gap-1.5">
              {data.features.map((feat, i) => (
                <li key={i} className="flex items-center gap-2 text-[11px] text-white/80 font-mono">
                  <span className="w-1 h-1 rounded-full bg-[#E4000F]" />{feat}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5">
            <span className="text-[9px] uppercase text-white/30 tracking-wider">Engineered With</span>
            <div className="mt-1 flex flex-wrap gap-1">
              {data.tech.map((t, i) => (
                <span key={i} className="px-1.5 py-0.5 rounded-[4px] bg-white/5 border border-white/10 text-[10px] font-mono text-white/70">{t}</span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
