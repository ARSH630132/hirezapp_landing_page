"use client";

import React, { useState } from "react";

const INDUSTRIES = [
  {
    id: "finance",
    name: "Financial Services",
    nodes: [
      { name: "Liquidity Rebalancing Agent", desc: "Monitors asset reserves and triggers automated rebalancing events." },
      { name: "Anti-Money Laundering Heuristic", desc: "Flags anomalous trade patterns across multi-asset ledgers." },
      { name: "Compliance Copilot", desc: "Automates real-time SEC and MiFID II policy audits." }
    ],
    color: "#E4000F"
  },
  {
    id: "manufacturing",
    name: "Advanced Manufacturing",
    nodes: [
      { name: "Predictive Maintenance Hub", desc: "Analyzes IoT vibration telemetry to predict spindle failures." },
      { name: "Supply Demand Coordinator", desc: "Syncs real-time raw materials orders with production runs." },
      { name: "Quality Defect Vision", desc: "Computer-vision agent categorizes anomalies on active assembly lines." }
    ],
    color: "#FFFFFF"
  },
  {
    id: "logistics",
    name: "Supply Chain & Logistics",
    nodes: [
      { name: "Autonomous Routing System", desc: "Calculates optimal multi-stop transit routes during weather events." },
      { name: "Warehouse Inventory Planner", desc: "Generates optimal slotting policies using product velocity." },
      { name: "Customs Clearance Parsing", desc: "Extracts bill of lading and manifest files dynamically." }
    ],
    color: "#009DFF"
  }
];

export default function IndustrySolutionMap() {
  const [activeInd, setActiveInd] = useState("finance");
  const data = INDUSTRIES.find((ind) => ind.id === activeInd) || INDUSTRIES[0];

  return (
    <div className="w-full rounded-[24px] border border-white/5 bg-[#050505]/40 backdrop-blur-[12px] p-6 lg:p-8">
      <div className="flex flex-col gap-6">
        <div>
          <span className="text-[10px] uppercase font-mono text-white/40 tracking-wider">Industry Automation Maps</span>
          <h3 className="text-[20px] font-bold text-white tracking-tight mt-1">Autonomous Hotspots Map</h3>
        </div>

        {/* Industry selection tab pills */}
        <div className="flex flex-wrap gap-2">
          {INDUSTRIES.map((ind) => (
            <button
              key={ind.id}
              onClick={() => setActiveInd(ind.id)}
              className={`px-4 py-2 rounded-full text-[12px] font-semibold transition-all duration-300 border ${
                activeInd === ind.id
                  ? "bg-white text-black border-white"
                  : "bg-white/5 text-white/60 border-white/5 hover:text-white hover:border-white/15"
              }`}
            >
              {ind.name}
            </button>
          ))}
        </div>

        {/* Grid mapping out the active nodes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          {data.nodes.map((node, i) => (
            <div
              key={i}
              className="relative p-5 rounded-[16px] border border-white/5 bg-black/40 hover:border-white/10 transition-all duration-300 group flex flex-col justify-between"
            >
              <div
                className="absolute top-0 left-0 w-1.5 h-full rounded-l-[16px]"
                style={{ backgroundColor: data.color }}
              />
              <div>
                <h4 className="text-[14px] font-bold text-white tracking-tight group-hover:text-[#009DFF] transition-colors">
                  {node.name}
                </h4>
                <p className="mt-2 text-[12px] leading-[1.5] text-white/60 font-light">
                  {node.desc}
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-[9px] font-mono text-white/30 uppercase">
                <span>DEPLOYED</span>
                <span>•</span>
                <span>LATENCY: 40MS</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
