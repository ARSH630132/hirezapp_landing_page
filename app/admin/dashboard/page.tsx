"use client";

import React, { useState } from "react";
import { Server, Activity, Clock, ShieldCheck, CornerDownRight } from "lucide-react";
import { previewClientAccounts, previewProjects, previewSupportTickets, previewInvoices, previewGovernanceItems } from "@/lib/mock-data-model";
import { PrivatePageHeader } from "@/components/private-app";

export default function AdminDashboardPage() {
  const [ack, setAck] = useState<Record<string, boolean>>({});
  const [gov, setGov] = useState<Record<string, boolean>>({});
  const [shell, setShell] = useState<string[]>(["eBPF telemetry streaming online."]);

  const log = (msg: string) => setShell(p => [`[system] ${msg}`, ...p]);

  return (
    <div className="space-y-6 font-mono text-[11px] text-white">
      <PrivatePageHeader title="OVERSIGHT DECK" desc="GFF Internal Operations Control Center." />
      
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { l: "Sandboxes", v: `${previewClientAccounts.length} Clusters`, i: Server },
          { l: "eBPF Telemetry", v: "48 Loops", i: Activity },
          { l: "Pending SLA", v: `${previewSupportTickets.filter(t => !ack[t.id]).length} Wires`, i: Clock },
          { l: "ISO Status", v: "100% SECURE", i: ShieldCheck }
        ].map((k, idx) => {
          const Icon = k.i;
          return (
            <div key={idx} className="p-4 rounded-xl border border-white/5 bg-[#050505]/40 flex justify-between">
              <div><span className="text-[9px] text-white/35 uppercase">{k.l}</span><div className="text-base font-bold">{k.v}</div></div>
              <Icon className="w-4 h-4 text-emerald-400" />
            </div>
          );
        })}
      </div>

      {/* BENTO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Clients & Projects Overview */}
        <div className="rounded-xl border border-white/5 bg-[#050505]/40 p-4 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider block border-b border-white/5 pb-2">Clients & Projects</span>
          <div className="space-y-1">
            {previewClientAccounts.slice(0, 3).map(c => (
              <div key={c.id} className="flex justify-between items-center text-[10px]">
                <span>{c.name}</span><span className="text-[8.5px] text-[#009DFF] font-bold">{c.region}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Operations */}
        <div className="rounded-xl border border-white/5 bg-[#050505]/40 p-4 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider block border-b border-white/5 pb-2">AI Operations</span>
          <div className="p-2 rounded bg-black/20 border border-white/5 flex justify-between text-[10px]">
            <div><span className="text-white/30 block text-[8px] uppercase">Active model</span><span className="font-bold">GFF-Llama-70B-Gov</span></div>
            <span className="text-[#009DFF] font-bold text-right">78% GPU</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => log("Wiped volatile memory cache.")} className="flex-1 h-7 rounded border border-white/5 bg-white/[0.01] text-[9.5px] font-bold uppercase cursor-pointer">Purge</button>
            <button onClick={() => log("Calibrated agent weights and parameters.")} className="flex-1 h-7 rounded bg-[#009DFF]/10 text-[#009DFF] border border-[#009DFF]/20 text-[9.5px] font-bold uppercase cursor-pointer">Align</button>
          </div>
        </div>

        {/* SLA Tickets & Governance Alerts */}
        <div className="rounded-xl border border-white/5 bg-[#050505]/40 p-4 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider block border-b border-white/5 pb-2">Wires & Governance</span>
          <div className="space-y-2 text-[10px]">
            {previewSupportTickets.slice(0, 1).map(t => (
              <div key={t.id} className={`p-2 rounded border ${ack[t.id] ? "border-white/5 opacity-50" : "bg-rose-500/5 border-rose-500/10"} flex justify-between items-center`}>
                <span className="truncate max-w-[120px] font-bold">{t.title}</span>
                {!ack[t.id] && <button onClick={() => { setAck(p => ({ ...p, [t.id]: true })); log(`Ack support wire: ${t.id}`); }} className="h-5 px-1.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/25 text-[8.5px] font-bold uppercase cursor-pointer">Ack</button>}
              </div>
            ))}
            {previewGovernanceItems.slice(0, 1).map(g => (
              <div key={g.id} className={`p-2 rounded border ${gov[g.id] ? "border-white/5 opacity-50" : "bg-red-500/5 border-red-500/10"} flex justify-between items-center`}>
                <span className="truncate max-w-[120px] font-bold">{g.standard}</span>
                {!gov[g.id] && <button onClick={() => { setGov(p => ({ ...p, [g.id]: true })); log(`Verify compliance policy: ${g.standard}`); }} className="h-5 px-1.5 rounded bg-white/5 border border-white/10 text-[8.5px] cursor-pointer">Verify</button>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. LOWER STRIP: BILLING LEDGER & COMMAND CONSOLE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-xl border border-white/5 bg-[#050505]/40 p-4 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider block border-b border-white/5 pb-2">Financial Ledger</span>
          <div className="space-y-2">
            {previewInvoices.slice(0, 2).map(inv => (
              <div key={inv.id} className="p-2 rounded bg-black/10 border border-white/5 text-[9.5px] flex justify-between font-mono">
                <span>{inv.id}</span>
                <span className="text-[#009DFF] font-bold">{inv.amount}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 rounded-xl border border-white/5 bg-[#050505]/40 p-4 space-y-3">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Internal Operations Shell</span>
            <div className="flex gap-2">
              <button onClick={() => log("Initiated diagnostic core scan across all clusters.")} className="h-6 px-2 rounded border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] text-[9.5px] cursor-pointer">Probe</button>
              <button onClick={() => log("⚠️ Emergency lockdown activated. Local namespaces isolated.")} className="h-6 px-2 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[9.5px] cursor-pointer">Lockdown</button>
            </div>
          </div>
          <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-lg text-[9.5px] text-zinc-400 h-[65px] overflow-y-auto leading-relaxed">
            {shell.map((s, i) => (
              <div key={i} className="flex gap-1.5 items-start font-mono text-zinc-400">
                <CornerDownRight className="w-3.5 h-3.5 text-[#009DFF] shrink-0 mt-0.5" />
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
