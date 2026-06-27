"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Layers, Cpu } from "lucide-react";

export default function AdminProjectsPage() {
  const projects = [
    { id: "PROJ-101", client: "Sovereign Retail Group", name: "Alpha Agent Lattice", core: "RetailMesh Core", status: "STABLE" },
    { id: "PROJ-102", client: "Sovereign Mining Corp", name: "Sovereign Logistics Core", core: "TelecomVerse Engine", status: "STABLE" },
    { id: "PROJ-103", client: "Federal Treasury Division", name: "Secure Ledger Audit", core: "Foundry Studio", status: "ACTIVE" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight font-mono uppercase">Global Projects Registry</h2>
          <p className="text-xs text-white/50 mt-1">Cross-cluster oversight of sandbox projects and multi-agent lattices.</p>
        </div>
      </div>

      <div className="border border-white/5 rounded-xl bg-[#050505]/40 backdrop-blur-sm overflow-hidden mt-4">
        <div className="bg-white/[0.02] border-b border-white/5 px-4 py-3 text-[10px] font-mono text-white/40 uppercase font-bold tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#009DFF]" />
          <span>Global Sandbox Projects</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left font-mono text-[12px] text-white/70">
            <thead>
              <tr className="border-b border-white/5 text-white/40 text-[10px] uppercase">
                <th className="p-4">Project ID</th>
                <th className="p-4">Enterprise Client</th>
                <th className="p-4">Project Name</th>
                <th className="p-4">Platform Core</th>
                <th className="p-4 text-right">Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {projects.map(p => (
                <tr key={p.id} className="hover:bg-white/[0.01]">
                  <td className="p-4 text-[#009DFF] font-bold">{p.id}</td>
                  <td className="p-4 text-white font-semibold">{p.client}</td>
                  <td className="p-4 text-white/70">{p.name}</td>
                  <td className="p-4 text-white/40">{p.core}</td>
                  <td className="p-4 text-right">
                    <span className="px-2 py-0.5 text-[9px] font-bold bg-[#009DFF]/10 text-[#009DFF] rounded border border-[#009DFF]/20 uppercase tracking-wide">
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <Link
                      href={`/admin/projects/${p.id}`}
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
