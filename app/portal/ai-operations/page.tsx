"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Bot, Cpu } from "lucide-react";

export default function ClientAiOperationsPage() {
  const agents = [
    { name: "RETAIL-CORE-A1", sensory: "Local API Node", cache: "Decoupled Cache", status: "VERIFIED" },
    { name: "ORE-TUNNEL-X4", sensory: "Industrial Sensors", cache: "Isolated Frame", status: "VERIFIED" },
    { name: "GOV-SYSTEM-G2", sensory: "Audit Log Collector", cache: "Sovereign Cache", status: "VERIFIED" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight font-mono uppercase">AI Operations</h2>
        <p className="text-xs text-white/50 mt-1">Configure and coordinate active sandboxed multi-agent runtimes, context states, and memory allocations.</p>
      </div>

      <div className="border border-white/5 rounded-xl bg-[#050505]/40 backdrop-blur-sm overflow-hidden mt-4">
        <div className="bg-white/[0.02] border-b border-white/5 px-4 py-3 text-[10px] font-mono text-white/40 uppercase font-bold tracking-wider flex items-center gap-2">
          <Bot className="w-4 h-4 text-[#009DFF]" />
          <span>Active Agent Runtimes</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px] text-left font-mono text-[12px] text-white/70">
            <thead>
              <tr className="border-b border-white/5 text-white/40 text-[10px] uppercase">
                <th className="p-4">Agent Identifier</th>
                <th className="p-4">Sensory Mesh Bounds</th>
                <th className="p-4">Context State Cache</th>
                <th className="p-4 text-right">Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {agents.map(agent => (
                <tr key={agent.name} className="hover:bg-white/[0.01]">
                  <td className="p-4 text-white font-bold">{agent.name}</td>
                  <td className="p-4 text-white/55">{agent.sensory}</td>
                  <td className="p-4 text-white/40">{agent.cache}</td>
                  <td className="p-4 text-right text-green-400 font-bold">{agent.status}</td>
                  <td className="p-4 text-center">
                    <Link
                      href={`/portal/ai-operations/${agent.name}`}
                      className="inline-flex items-center gap-1 text-[10.5px] font-bold text-white/50 hover:text-white bg-white/5 border border-white/10 px-2.5 py-1 rounded transition-all cursor-pointer"
                    >
                      <span>inspect</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
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
