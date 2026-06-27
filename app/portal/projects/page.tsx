"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Cpu, Layers } from "lucide-react";

export default function ClientProjectsPage() {
  const projects = [
    { id: "PROJ-101", name: "Alpha Agent Lattice", core: "RetailMesh Core", env: "Singapore Zone A", status: "IN_SANDBOX" },
    { id: "PROJ-102", name: "Sovereign Logistics Core", core: "TelecomVerse Engine", env: "London Zone C", status: "IN_SANDBOX" },
    { id: "PROJ-103", name: "Secure Ledger Audit", core: "Foundry Studio", env: "Local Mesh", status: "IN_SANDBOX" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight font-mono uppercase">Multi-Agent Projects</h2>
          <p className="text-xs text-white/50 mt-1">Active sandbox projects, isolated model instances, and deployment frameworks.</p>
        </div>
      </div>

      <div className="border border-white/5 rounded-xl bg-[#050505]/40 backdrop-blur-sm overflow-hidden mt-4">
        <div className="bg-white/[0.02] border-b border-white/5 px-4 py-3 text-[10px] font-mono text-white/40 uppercase font-bold tracking-wider">
          Sandbox Project Registry
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left font-mono text-[12px] text-white/70">
            <thead>
              <tr className="border-b border-white/5 text-white/40 text-[10px] uppercase">
                <th className="p-4">Project ID</th>
                <th className="p-4">Project Name</th>
                <th className="p-4">Platform Core</th>
                <th className="p-4">Environment</th>
                <th className="p-4 text-right">Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {projects.map(p => (
                <tr key={p.id} className="hover:bg-white/[0.01]">
                  <td className="p-4 text-[#009DFF] font-bold">{p.id}</td>
                  <td className="p-4 text-white font-semibold">{p.name}</td>
                  <td className="p-4 text-white/60">{p.core}</td>
                  <td className="p-4 text-white/40">{p.env}</td>
                  <td className="p-4 text-right">
                    <span className="px-2 py-0.5 text-[9px] font-bold bg-green-500/10 text-green-400 rounded border border-green-500/20 uppercase tracking-wide">
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <Link
                      href={`/portal/projects/${p.id}`}
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
