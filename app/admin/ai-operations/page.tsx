"use client";

import React from "react";
import { Bot, Cpu, Layers } from "lucide-react";

export default function AdminAiOperationsPage() {
  const runtimes = [
    { client: "Sovereign Retail Group", name: "RETAIL-CORE-A1", sensory: "Local API Node", cache: "Decoupled (128k)", status: "VERIFIED" },
    { client: "Sovereign Mining Corp", name: "ORE-TUNNEL-X4", sensory: "Industrial Sensors", cache: "Isolated (64k)", status: "VERIFIED" },
    { client: "Federal Treasury Division", name: "GOV-SYSTEM-G2", sensory: "Audit Log Collector", cache: "Sovereign (256k)", status: "VERIFIED" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight font-mono uppercase">AI Operations Oversight</h2>
        <p className="text-xs text-white/50 mt-1">Cross-cluster coordinator to audit and monitor active multi-agent runtimes, sensory inputs, and context frames.</p>
      </div>

      <div className="border border-white/5 rounded-xl bg-[#050505]/40 backdrop-blur-sm overflow-hidden mt-4">
        <div className="bg-white/[0.02] border-b border-white/5 px-4 py-3 text-[10px] font-mono text-white/40 uppercase font-bold tracking-wider flex items-center gap-2">
          <Bot className="w-4 h-4 text-[#009DFF]" />
          <span>Cross-Client Agent Runtimes</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left font-mono text-[12px] text-white/70">
            <thead>
              <tr className="border-b border-white/5 text-white/40 text-[10px] uppercase">
                <th className="p-4">Enterprise Client</th>
                <th className="p-4">Agent Identifier</th>
                <th className="p-4">Sensory Mesh Bounds</th>
                <th className="p-4">Context State Cache</th>
                <th className="p-4 text-right">Integrity Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {runtimes.map(agent => (
                <tr key={agent.name} className="hover:bg-white/[0.01]">
                  <td className="p-4 text-white font-bold">{agent.client}</td>
                  <td className="p-4 text-[#009DFF]">{agent.name}</td>
                  <td className="p-4 text-white/55">{agent.sensory}</td>
                  <td className="p-4 text-white/40">{agent.cache}</td>
                  <td className="p-4 text-right text-green-400 font-bold">
                    <span className="px-2 py-0.5 text-[9px] font-bold bg-green-500/10 text-green-400 rounded border border-green-500/20">
                      {agent.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
