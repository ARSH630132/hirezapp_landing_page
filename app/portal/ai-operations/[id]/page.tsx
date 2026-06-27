"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Bot, Shield, Cpu, Terminal, RefreshCw, ShieldCheck } from "lucide-react";
import { WorkspaceCard, StatusBadge } from "@/components/private-app";

export default function ClientAiOperationsDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const agentId = typeof id === "string" ? id : "RETAIL-CORE-A1";
  const [attesting, setAttesting] = useState(false);
  const [complete, setComplete] = useState(false);

  const triggerAttestation = () => {
    if (attesting) return;
    setAttesting(true); setComplete(false);
    setTimeout(() => { setAttesting(false); setComplete(true); }, 1200);
  };

  const isWarning = agentId.includes("H9") || agentId.includes("004");
  const isDecoupled = agentId.includes("Z1") || agentId.includes("005");
  const status = isDecoupled ? "decoupled" : isWarning ? "warning" : "active";

  return (
    <div className="space-y-6 font-mono text-[11px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/portal/ai-operations")} className="p-2 rounded bg-white/5 text-white/50 hover:text-white cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#009DFF] bg-[#009DFF]/5 px-2 py-0.5 rounded uppercase font-semibold">
                {isWarning ? "Medical Enclave" : isDecoupled ? "Transport Node" : "Core Telemetry"}
              </span>
              <StatusBadge state={status} label={status} />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight font-mono mt-1 uppercase flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#009DFF]" /> {agentId}
            </h2>
          </div>
        </div>
        <button onClick={triggerAttestation} disabled={attesting} className="inline-flex h-9 px-4 items-center justify-center gap-2 rounded bg-[#009DFF] text-white uppercase font-bold text-[11px]">
          {attesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
          {attesting ? "Attesting..." : "Verify Attestation"}
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <WorkspaceCard className="p-4 space-y-1">
          <span className="text-white/45 text-[9px]">CPU ALLOCATION</span>
          <div className="text-2xl font-bold text-white">{isDecoupled ? "0%" : isWarning ? "94%" : "42%"}</div>
        </WorkspaceCard>
        <WorkspaceCard className="p-4 space-y-1">
          <span className="text-white/45 text-[9px]">RAM UTILIZATION</span>
          <div className="text-2xl font-bold text-white">{isDecoupled ? "0%" : isWarning ? "89%" : "52%"}</div>
        </WorkspaceCard>
        <WorkspaceCard className="p-4 space-y-1">
          <span className="text-white/45 text-[9px]">PULSE LATENCY</span>
          <div className="text-2xl font-bold text-white">{isDecoupled ? "999 ms" : isWarning ? "88 ms" : "12 ms"}</div>
        </WorkspaceCard>
        <WorkspaceCard className="p-4 space-y-1">
          <span className="text-white/45 text-[9px]">UPTIME SCORE</span>
          <div className="text-2xl font-bold text-white">{isDecoupled ? "98.71%" : isWarning ? "99.95%" : "99.99%"}</div>
        </WorkspaceCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-[12px]">
        <div className="lg:col-span-2 space-y-6">
          <WorkspaceCard className="p-5 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase border-b border-white/5 pb-2">Neural Parameter Mapping</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/70">
              <div className="p-3 bg-black/30 border border-white/5 rounded flex justify-between">
                <span>Model:</span> <span className="text-white font-bold">{isWarning ? "GFF-Med-34B" : "GFF-Llama-70B"}</span>
              </div>
              <div className="p-3 bg-black/30 border border-white/5 rounded flex justify-between">
                <span>Isolation:</span> <span className="text-[#009DFF] font-bold">{isWarning ? "HSM Enclave" : "AMD SEV-SNP"}</span>
              </div>
            </div>
          </WorkspaceCard>

          <WorkspaceCard className="p-5 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase border-b border-white/5 pb-2">eBPF Telemetry Event Streams</h3>
            <div className="space-y-2 text-[11px] text-white/50 bg-black/40 border border-white/5 p-4 rounded">
              {isDecoupled ? (
                <div>[23:55:00] Enclave decoupled by operator. OK</div>
              ) : (
                <>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span>[06:12:15] Context cache sync handshake completed</span> <span className="text-emerald-400 font-bold">SUCCESS</span>
                  </div>
                  <div className="flex justify-between">
                    <span>[06:12:16] Token count verification complete</span> <span className="text-emerald-400 font-bold">VERIFIED</span>
                  </div>
                </>
              )}
            </div>
          </WorkspaceCard>

          {complete && (
            <WorkspaceCard className="border border-[#00FFC2]/20 bg-emerald-950/5 p-5 space-y-4 rounded">
              <h4 className="text-xs font-bold text-white uppercase">Attestation Results</h4>
              <div className="bg-black/50 p-4 rounded text-white/60 space-y-1">
                <div>✔ Silicon registers accessed successfully.</div>
                <div>✔ Hardware cryptographic signature matches ledger.</div>
                <div className="text-emerald-400 font-bold text-center pt-2 uppercase">Secure Enclave Genuine & Verified</div>
              </div>
            </WorkspaceCard>
          )}
        </div>

        <div className="space-y-6">
          <WorkspaceCard className="p-5 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase border-b border-white/5 pb-2">Silicon Enclave Map</h3>
            <div className="border border-white/5 bg-black/40 rounded p-4 text-[9px] space-y-3">
              <div className="border border-white/10 p-2 rounded text-center">
                <span className="text-white/45 block uppercase text-[8px]">HOST LAYER</span>
                <span className="text-white font-medium">Bare-Metal Sovereign Node</span>
              </div>
              <div className="border border-[#009DFF]/30 p-2 rounded bg-[#009DFF]/5 text-center">
                <span className="text-[#009DFF] font-bold block uppercase text-[8px]">{isWarning ? "HSM Enclave" : "AMD SEV-SNP"}</span>
                <span className="text-white/60 block mt-1">Cryptographic RAM Segment</span>
              </div>
            </div>
          </WorkspaceCard>

          <WorkspaceCard className="p-5 space-y-4 bg-gradient-to-br from-[#02050e] to-[#010204] border border-[#009DFF]/15">
            <h4 className="text-[12px] font-bold text-white uppercase">Maintenance</h4>
            <p className="text-[10px] text-white/50 leading-relaxed">
              Need physical intervention? Submit requests to GFF AI Operations Support.
            </p>
            <Link href="/portal/support" className="w-full inline-flex h-8 px-4 items-center justify-center rounded bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-[10px] uppercase tracking-wider transition-all">
              Contact Support
            </Link>
          </WorkspaceCard>
        </div>
      </div>
    </div>
  );
}
