"use client";

import React, { useState } from "react";

const HUBS = [
  {
    id: "ny",
    city: "New York",
    specialty: "High-Freq Ingestion & Strategy",
    nodes: "256 Active Clusters",
    sla: "99.999% SLA Guarantee",
    coords: { x: 140, y: 120 }
  },
  {
    id: "zh",
    city: "Zurich",
    specialty: "Zero-Trust Guardrail Systems",
    nodes: "512 Active Clusters",
    sla: "100% Cryptographic Isolation",
    coords: { x: 260, y: 110 }
  },
  {
    id: "tk",
    city: "Tokyo",
    specialty: "Autonomous Action Dispatchers",
    nodes: "180 Active Clusters",
    sla: "Sub-5ms Regional Latency",
    coords: { x: 420, y: 130 }
  },
  {
    id: "sg",
    city: "Singapore",
    specialty: "Distributed Memory Sync",
    nodes: "320 Active Clusters",
    sla: "Heuristic Active Backup",
    coords: { x: 380, y: 180 }
  }
];

export default function GlobalHubMap() {
  const [activeHub, setActiveHub] = useState("zh");
  const data = HUBS.find((h) => h.id === activeHub) || HUBS[1];

  return (
    <div className="w-full rounded-[24px] border border-white/5 bg-[#050505]/40 backdrop-blur-[12px] p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* SVG Map Display */}
        <div className="lg:col-span-8 flex flex-col items-center relative">
          <p className="text-[11px] font-bold tracking-[0.15em] text-[#009DFF] uppercase mb-4 text-center">
            GFF COGNITIVE COMPUTE MAP (HOVER LOCATIONS)
          </p>

          <div className="relative w-full max-w-[500px] aspect-[16/10] rounded-[16px] border border-white/5 bg-black/40 p-2 overflow-hidden flex items-center justify-center">
            {/* World background grids representing coordinates */}
            <svg className="w-full h-full opacity-35" viewBox="0 0 500 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Coordinate gridlines */}
              <path d="M 0 50 L 500 50 M 0 100 L 500 100 M 0 150 L 500 150 M 0 200 L 500 200 M 0 250 L 500 250" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
              <path d="M 100 0 L 100 300 M 200 0 L 200 300 M 300 0 L 300 300 M 400 0 L 400 300" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />

              {/* Abstract continent vectors */}
              <circle cx="150" cy="120" r="45" fill="rgba(255,255,255,0.015)" />
              <circle cx="260" cy="110" r="55" fill="rgba(255,255,255,0.015)" />
              <circle cx="400" cy="150" r="50" fill="rgba(255,255,255,0.015)" />

              {/* Connected Hub Pipelines */}
              <path d="M 140 120 Q 200 80 260 110" stroke="rgba(0,157,255,0.15)" strokeWidth="1" strokeDasharray="4 4" />
              <path d="M 260 110 Q 320 140 380 180" stroke="rgba(228,0,15,0.15)" strokeWidth="1" strokeDasharray="4 4" />
              <path d="M 380 180 Q 400 150 420 130" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="4 4" />

              {/* Interactive Markers */}
              {HUBS.map((hub) => (
                <g 
                  key={hub.id} 
                  onMouseEnter={() => setActiveHub(hub.id)}
                  onClick={() => setActiveHub(hub.id)}
                  className="cursor-pointer group"
                >
                  <circle cx={hub.coords.x} cy={hub.coords.y} r="5" fill={activeHub === hub.id ? "#E4000F" : "#009DFF"} />
                  {activeHub === hub.id && (
                    <circle cx={hub.coords.x} cy={hub.coords.y} r="12" stroke="#E4000F" strokeWidth="1" className="animate-ping" />
                  )}
                  <text x={hub.coords.x} y={hub.coords.y - 10} fill="white" fontSize="8" fontWeight="bold" textAnchor="middle" className="pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity uppercase font-mono tracking-widest">
                    {hub.city}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Info Column */}
        <div className="lg:col-span-4 flex flex-col border-t lg:border-t-0 lg:border-l border-white/5 pt-6 lg:pt-0 lg:pl-6 min-h-[180px] justify-between">
          <div>
            <span className="text-[9px] font-mono tracking-widest text-[#E4000F] uppercase font-bold">Node Cluster Status</span>
            <h4 className="text-[18px] font-semibold text-white mt-1.5">{data.city} Core Hub</h4>
            <p className="text-[13px] leading-[1.5] text-white/60 mt-2 font-light">{data.specialty}</p>

            <div className="mt-4 flex flex-col gap-1 text-[11px] font-mono text-white/80">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#009DFF]" /> {data.nodes}</span>
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-500" /> {data.sla}</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 text-[9px] text-white/30 font-mono">
            SECURE PORTAL CONNECTION: ESTABLISHED
          </div>
        </div>

      </div>
    </div>
  );
}
