"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Cpu, Activity, Clock, User, Briefcase, Network, Terminal, Lock, RefreshCw, Settings } from "lucide-react";

interface Proj { id: string; name: string; client: string; phase: string; status: string; owner: string; nodes: number; type: string; }

const REGISTRY: Record<string, Proj> = {
  "PROJ-201": { id: "PROJ-201", name: "Apex Sovereign Multi-Agent Lattice", client: "Apex Sovereign Group", phase: "Phase V: Production-Live", status: "On Track", owner: "Dr. Sarah Vance", nodes: 8, type: "Intel SGX" },
  "PROJ-202": { id: "PROJ-202", name: "Global Retail Real-Time Audit Ring", client: "Global Retail Enclave", phase: "Phase IV: UAT", status: "At Risk", owner: "Alexander Mercer", nodes: 5, type: "AMD SEV-SNP" },
  "PROJ-203": { id: "PROJ-203", name: "Sovereign Logistics Route Optimizer", client: "Sovereign Logistics Unit", phase: "Phase III: Alignment", status: "Paused", owner: "Marcus Vance", nodes: 4, type: "AWS Nitro" },
  "PROJ-204": { id: "PROJ-204", name: "Federal Treasury Multi-Enclave Ledger", client: "Federal Treasury Division", phase: "Phase II: Provisioning", status: "Delayed", owner: "Evelyn Carter", nodes: 12, type: "Intel SGX" },
  "PROJ-205": { id: "PROJ-205", name: "National Health Secure Diagnostics", client: "National Health Enclave", phase: "Phase I: Planning", status: "On Track", owner: "Auditor Jenkins", nodes: 3, type: "AMD SEV-SNP" }
};

export default function AdminProjectDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const p = REGISTRY[typeof id === "string" ? id : "PROJ-201"] || REGISTRY["PROJ-201"];

  const [logs, setLogs] = useState<string[]>([]);
  const [attests, setAttests] = useState(0);

  useEffect(() => {
    setLogs([
      `[${new Date().toLocaleTimeString()}] HARDWARE ROOT ACTIVE ON ${p.type.toUpperCase()}`,
      `[${new Date().toLocaleTimeString()}] TELEMETRY ONLINE WITH ${p.nodes} NODES`,
      `[${new Date().toLocaleTimeString()}] BOUND COMPLIANCE AUDIT RESOLVED: NOMINAL`
    ]);
  }, [p]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-mono text-xs text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="flex items-start gap-3">
          <button onClick={() => router.push("/admin/projects")} className="p-1.5 rounded border border-white/5 bg-white/[0.01] hover:text-white text-white/50 cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="text-[9px] font-bold text-[#009DFF] bg-[#009DFF]/5 border border-[#009DFF]/15 px-1.5 py-0.5 rounded uppercase">Oversight Deck</span>
            <h2 className="text-sm font-bold tracking-tight uppercase mt-1">{p.name} <span className="text-white/40">({p.id})</span></h2>
          </div>
        </div>
        <Link href="/admin/projects" className="h-8 px-3 rounded border border-white/10 hover:border-white/20 bg-white/[0.01] text-[10px] font-bold text-white/70 hover:text-white flex items-center justify-center transition-all">Return to Registry</Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Client Domain", val: p.client, desc: "Sovereign Isolated Tenant", icon: Briefcase },
          { label: "Silicon Nodes", val: `${p.nodes} nodes`, desc: `Isolated ${p.type}`, icon: Network, color: "text-[#00FFC2]" },
          { label: "SLA Compliance", val: p.status, desc: "Continuous policy verification", icon: Activity, pill: true },
          { label: "Lead Custodian", val: p.owner, desc: "Level V clearance superuser", icon: User, color: "text-purple-400" }
        ].map((stat, idx) => (
          <div key={idx} className="p-4 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm space-y-1">
            <div className="flex items-center justify-between text-white/40 text-[9px] font-bold uppercase tracking-wider">
              <span>{stat.label}</span>
              <stat.icon className="w-3.5 h-3.5 opacity-40" />
            </div>
            <div className={`text-xs font-bold truncate mt-1 ${stat.color || "text-white"}`}>
              {stat.pill ? (
                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold ${p.status === "On Track" ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20" : p.status === "At Risk" ? "text-amber-400 bg-amber-500/10 border border-amber-500/20" : "text-rose-400 bg-rose-500/10 border border-rose-500/20"}`}>
                  <span className="w-1 h-1 rounded-full bg-current animate-pulse" /> {stat.val.toUpperCase()}
                </span>
              ) : stat.val}
            </div>
            <div className="text-[10px] text-white/45">{stat.desc}</div>
          </div>
        ))}
      </div>

      {/* Content Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Active Nodes Topology Graphic */}
          <div className="p-4 border border-white/5 rounded-xl bg-[#020202]/40 backdrop-blur-sm space-y-4">
            <span className="font-bold text-white uppercase flex items-center gap-1.5 text-[10px]"><Network className="w-3.5 h-3.5 text-[#009DFF]" /> Active Silicon Lattice</span>
            <div className="relative py-6 rounded border border-white/5 bg-[#040404]/80 flex flex-wrap items-center justify-center gap-4 min-h-[110px]">
              {Array.from({ length: p.nodes }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-0.5">
                  <div className="w-8 h-8 rounded border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 flex items-center justify-center">
                    <Cpu className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[8px] text-white/30">N-0{i+1}</span>
                </div>
              ))}
              <span className="absolute bottom-1.5 left-2.5 text-[8px] text-[#00FFC2] flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-current animate-pulse" /> Telemetry pipeline: ONLINE</span>
            </div>
          </div>

          {/* eBPF Event Tracing Console */}
          <div className="p-4 border border-white/5 rounded-xl bg-[#020202]/40 backdrop-blur-sm space-y-2">
            <span className="font-bold text-white uppercase flex items-center gap-1.5 text-[10px]"><Terminal className="w-3.5 h-3.5 text-[#009DFF]" /> Active eBPF Kernel Event Trace</span>
            <div className="p-3 rounded bg-black border border-white/5 text-[9.5px] leading-relaxed text-white/70 h-28 overflow-y-auto space-y-1 scrollbar-thin select-all font-mono">
              {logs.map((log, idx) => (
                <div key={idx} className={log.includes("ONLINE") ? "text-[#00FFC2]" : "text-white/60"}>{log}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Controls Deck */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm space-y-3">
            <div className="flex items-center gap-1.5 border-b border-white/5 pb-2"><Settings className="w-3.5 h-3.5 text-[#009DFF]" /><h3 className="font-bold text-white uppercase">Control Deck</h3></div>
            <button onClick={() => { setLogs(prev => [`[${new Date().toLocaleTimeString()}] [ATTEST] Verifying hardware registers...`, `[${new Date().toLocaleTimeString()}] [ATTEST] Root keys certified (100% Match)`, ...prev]); setAttests(c => c + 1); }} className="w-full h-9 px-3 rounded border border-[#009DFF]/25 bg-[#009DFF]/5 text-[#009DFF] text-[10px] font-bold uppercase transition-all flex items-center justify-between cursor-pointer">
              <span className="flex items-center gap-1.5"><RefreshCw className="w-3.5 h-3.5" /> Re-Attest Cluster</span>
              <span className="text-[8px] px-1 bg-black/60 border border-white/5 rounded">{attests > 0 ? `PASS x${attests}` : "SEALED"}</span>
            </button>
          </div>

          <div className="p-4 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm space-y-3">
            <div className="flex items-center gap-1.5 border-b border-white/5 pb-1.5"><Lock className="w-3.5 h-3.5 text-purple-400" /><h3 className="font-bold text-white uppercase">Custodian Credentials</h3></div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-purple-500/10 border border-purple-500/20 text-[#009DFF] flex items-center justify-center font-bold text-[10px]">{p.owner.split(" ").pop()?.substring(0,2).toUpperCase()}</div>
              <div>
                <h4 className="font-bold text-white">{p.owner}</h4>
                <span className="text-[8px] text-purple-400 font-bold uppercase block">Clearance Level V</span>
              </div>
            </div>
            <p className="text-[9px] text-white/40 leading-normal border-t border-white/5 pt-2">Keys expire automatically after a 12-hour session window. Session is eBPF audited.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
