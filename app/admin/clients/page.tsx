"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Users, ShieldCheck } from "lucide-react";

export default function AdminClientsPage() {
  const clients = [
    { id: "CLI-101", name: "Sovereign Retail Group", domain: "sovereign-retail.gff.ai", status: "ACTIVE", load: "42.1%" },
    { id: "CLI-102", name: "Federal Treasury Division", domain: "treasury.gov.gff.ai", status: "ACTIVE", load: "89.2%" },
    { id: "CLI-103", name: "Sovereign Mining Corp", domain: "mining.corp.gff.ai", status: "STABLE", load: "18.4%" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight font-mono uppercase">Enterprise Clients</h2>
          <p className="text-xs text-white/50 mt-1">Manage active corporate domains, configure zero-trust sandboxes, and inspect live loads.</p>
        </div>
      </div>

      <div className="border border-white/5 rounded-xl bg-[#050505]/40 backdrop-blur-sm overflow-hidden mt-4">
        <div className="bg-white/[0.02] border-b border-white/5 px-4 py-3 text-[10px] font-mono text-white/40 uppercase font-bold tracking-wider flex items-center gap-2">
          <Users className="w-4 h-4 text-[#009DFF]" />
          <span>Active Enterprise Enclaves</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left font-mono text-[12px] text-white/70">
            <thead>
              <tr className="border-b border-white/5 text-white/40 text-[10px] uppercase">
                <th className="p-4">Client ID</th>
                <th className="p-4">Enterprise Name</th>
                <th className="p-4">Domain Namespace</th>
                <th className="p-4 text-right">CPU Thread Load</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {clients.map(c => (
                <tr key={c.id} className="hover:bg-white/[0.01]">
                  <td className="p-4 text-[#009DFF] font-bold">{c.id}</td>
                  <td className="p-4 text-white font-semibold">{c.name}</td>
                  <td className="p-4 text-white/50">{c.domain}</td>
                  <td className="p-4 text-right text-white/75">{c.load}</td>
                  <td className="p-4 text-center">
                    <span className="px-2 py-0.5 text-[9px] font-bold bg-green-500/10 text-green-400 rounded border border-green-500/20 uppercase tracking-wide">
                      {c.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <Link
                      href={`/admin/clients/${c.id}`}
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
