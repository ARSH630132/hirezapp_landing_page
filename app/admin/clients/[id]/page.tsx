"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Cpu, Layers, Terminal, RefreshCw } from "lucide-react";
import { previewClientAccounts, previewProjects } from "@/lib/mock-data-model";

export default function AdminClientDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const client = previewClientAccounts.find(c => c.id === id) || previewClientAccounts[0];
  const projects = previewProjects.filter(p => p.clientAccountId === client.id);
  const [rotating, setRotating] = useState(false);
  const [logs, setLogs] = useState<string[]>(["Secure link bound."]);
  return (
    <div className="space-y-6 font-mono text-xs text-white">
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div className="flex items-center gap-2">
          <button onClick={() => router.push("/admin/clients")} className="p-1 rounded border border-white/5 text-white/50 hover:text-white cursor-pointer"><ArrowLeft className="w-3.5 h-3.5" /></button>
          <div>
            <span className="text-[9px] text-[#009DFF] bg-[#009DFF]/10 px-1 py-0.2 rounded border border-[#009DFF]/20 uppercase">OVERSIGHT: {client.id.toUpperCase()}</span>
            <h2 className="text-sm font-bold uppercase mt-1">{client.name.replace(" [Preview Client]", "")}</h2>
          </div>
        </div>
        <button onClick={() => {
          localStorage.setItem("gff_ai_preview_session_v1", JSON.stringify({ name: client.contactName, email: client.contactEmail, role: "client_admin", clearance: "LEVEL III", isMock: true, label: `PREVIEW: ${client.name}` }));
          window.dispatchEvent(new Event("gff_preview_session_changed"));
          router.push("/portal/dashboard");
        }} className="h-7 px-2.5 rounded bg-[#009DFF] text-white cursor-pointer font-bold border-none text-[9px] uppercase">Mirror Portal</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 rounded border border-white/5 bg-black/40">
              <div>Tier: <span className="text-amber-300 font-bold uppercase">{client.tier}</span></div>
              <div className="truncate">Domain: <span className="text-[#009DFF]">{client.domain}</span></div>
            </div>
            <div className="p-3 rounded border border-white/5 bg-black/40">
              <div>Cores: <span className="text-[#00FFC2] font-bold">128 Cores</span></div>
              <div>Hardware: <span className="text-white/80">AMD SEV-SNP</span></div>
            </div>
          </div>
          <div className="p-3 rounded border border-white/5 bg-black/40 space-y-2">
            <span className="font-bold text-white/40 uppercase flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> Projects ({projects.length})</span>
            {projects.map(p => (
              <div key={p.id} className="flex justify-between items-center p-2 rounded bg-white/[0.01] border border-white/5">
                <div><div className="font-bold uppercase">{p.name}</div><span className="text-[#009DFF] text-[9px]">{p.id.toUpperCase()}</span></div>
                <span className="rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold uppercase">{p.status}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="p-3 rounded border border-white/5 bg-black/40 space-y-2">
            <span className="font-bold text-white/40 uppercase text-[9px] block">Controls</span>
            <button onClick={() => {
              if (rotating) return;
              setRotating(true);
              setLogs(p => [...p, "HSM_ROLLOVER: Run..."]);
              setTimeout(() => { setLogs(p => [...p, "SUCCESS: SHA-0x8A12FF"]); setRotating(false); }, 600);
            }} disabled={rotating} className="w-full h-8 rounded border border-white/10 text-[9px] font-bold uppercase text-white flex items-center justify-center gap-1 cursor-pointer bg-white/[0.01]">
              <RefreshCw className={`w-3 h-3 ${rotating ? "animate-spin" : ""}`} />
              <span>Rotate Keys</span>
            </button>
          </div>
          <div className="p-3 rounded border border-white/5 bg-black/40 space-y-2 flex flex-col h-[140px]">
            <span className="font-bold text-white/40 uppercase text-[9px] flex items-center gap-1"><Terminal className="w-3.5 h-3.5 text-emerald-400" /> Console</span>
            <div className="flex-1 bg-black/50 rounded p-1.5 text-[8.5px] text-emerald-400/80 space-y-1 overflow-y-auto font-mono text-left select-text">
              {logs.map((l, i) => <div key={i} className="truncate">&gt; {l}</div>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
