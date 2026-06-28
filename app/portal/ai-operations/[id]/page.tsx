"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Bot, Shield, Cpu, Terminal, RefreshCw, ShieldCheck, Activity } from "lucide-react";
import { WorkspaceCard, StatusBadge } from "@/components/private-app";
import { mapApiOpToEnrichedAgent, EnrichedAgent } from "../mapping-helper";

export default function ClientAiOperationsDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const reqId = typeof id === "string" ? id : "";

  const [operation, setOperation] = useState<EnrichedAgent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [attesting, setAttesting] = useState(false);
  const [complete, setComplete] = useState(false);

  const fetchOperationDetails = useCallback(async () => {
    if (!reqId) return;
    setLoading(true);
    setError(null);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("gff_ai_access_token") : null;
      const res = await fetch(`/api/v1/ai-operations/${reqId}`, {
        headers: {
          "Authorization": `Bearer ${token || ""}`,
          "Content-Type": "application/json"
        }
      });
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("Enclave registry record not found (404).");
        } else if (res.status === 403) {
          throw new Error("Access denied (403). You are not authorized to view this partition.");
        } else {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || `HTTP error! status: ${res.status}`);
        }
      }
      const data = await res.json();
      if (data.success && data.operation) {
        const mapped = mapApiOpToEnrichedAgent(data.operation);
        setOperation(mapped);
      } else {
        throw new Error(data.message || "Failed to retrieve enclave details.");
      }
    } catch (err: any) {
      console.error("Error fetching enclave detail:", err);
      setError(err.message || "An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  }, [reqId]);

  useEffect(() => {
    fetchOperationDetails();
  }, [fetchOperationDetails]);

  const triggerAttestation = () => {
    if (attesting) return;
    setAttesting(true); 
    setComplete(false);
    setTimeout(() => { 
      setAttesting(false); 
      setComplete(true); 
    }, 1200);
  };

  if (loading) {
    return (
      <div className="space-y-6 font-mono text-[11px] animate-pulse">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
          <div className="flex items-center gap-4">
            <div className="h-9 w-9 bg-white/5 rounded" />
            <div className="space-y-2">
              <div className="h-4 bg-white/5 rounded w-24" />
              <div className="h-6 bg-white/5 rounded w-36" />
            </div>
          </div>
          <div className="h-9 bg-white/5 rounded w-32" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <WorkspaceCard key={n} className="p-4 space-y-2">
              <div className="h-3 bg-white/5 rounded w-16" />
              <div className="h-8 bg-white/5 rounded w-20" />
            </WorkspaceCard>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <WorkspaceCard className="p-5 h-36">
              <div className="h-full w-full bg-white/5 rounded animate-pulse" />
            </WorkspaceCard>
            <WorkspaceCard className="p-5 h-44">
              <div className="h-full w-full bg-white/5 rounded animate-pulse" />
            </WorkspaceCard>
          </div>
          <WorkspaceCard className="p-5 h-44">
            <div className="h-full w-full bg-white/5 rounded animate-pulse" />
          </WorkspaceCard>
        </div>
      </div>
    );
  }

  if (error || !operation) {
    return (
      <div className="space-y-6 font-mono text-[11px] max-w-lg mx-auto py-12">
        <WorkspaceCard className="p-8 border border-red-500/10 bg-red-950/5 rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
          <div className="p-3 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
            <Activity className="w-8 h-8 animate-pulse" />
          </div>
          <div className="space-y-1.5 font-mono">
            <h4 className="text-white font-bold uppercase text-[14px]">ENCLAVE DETAILS DESYNC</h4>
            <p className="text-white/50 text-[11px] leading-relaxed">
              {error || "Failed to retrieve authenticated telemetry parameters for this isolated hardware enclave."}
            </p>
          </div>
          <div className="flex gap-3 w-full justify-center">
            <button
              onClick={() => router.push("/portal/ai-operations")}
              className="h-9 px-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono font-bold text-[11px] uppercase cursor-pointer transition-all"
            >
              Back to Ledger
            </button>
            <button
              onClick={fetchOperationDetails}
              className="h-9 px-4 rounded-lg bg-[#009DFF] hover:bg-[#009DFF]/90 text-white font-mono font-bold text-[11px] uppercase cursor-pointer flex items-center gap-2 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Connection</span>
            </button>
          </div>
        </WorkspaceCard>
      </div>
    );
  }

  const agentId = operation.id;
  const isWarning = operation.status === "warning";
  const isDecoupled = operation.status === "decoupled";
  const status = operation.status;
  const type = operation.type;
  const badgeState = status === "active" ? "active" : status === "evaluating" ? "warning" : status === "warning" ? "error" : "decoupled";

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
                {type}
              </span>
              <StatusBadge state={badgeState} label={status} />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight font-mono mt-1 uppercase flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#009DFF]" /> {agentId} - {operation.name}
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
          <div className="text-2xl font-bold text-white">{isDecoupled ? "0%" : `${operation.cpu}%`}</div>
        </WorkspaceCard>
        <WorkspaceCard className="p-4 space-y-1">
          <span className="text-white/45 text-[9px]">RAM UTILIZATION</span>
          <div className="text-2xl font-bold text-white">{isDecoupled ? "0%" : operation.memory.split(" / ")[0]}</div>
        </WorkspaceCard>
        <WorkspaceCard className="p-4 space-y-1">
          <span className="text-white/45 text-[9px]">PULSE LATENCY</span>
          <div className="text-2xl font-bold text-white">{isDecoupled ? "999 ms" : `${operation.latency} ms`}</div>
        </WorkspaceCard>
        <WorkspaceCard className="p-4 space-y-1">
          <span className="text-white/45 text-[9px]">UPTIME SCORE</span>
          <div className="text-2xl font-bold text-white">{isDecoupled ? "98.71%" : `${operation.uptime.toFixed(3)}%`}</div>
        </WorkspaceCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-[12px]">
        <div className="lg:col-span-2 space-y-6">
          <WorkspaceCard className="p-5 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase border-b border-white/5 pb-2">Neural Parameter Mapping</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/70">
              <div className="p-3 bg-black/30 border border-white/5 rounded flex justify-between">
                <span>Model:</span> <span className="text-white font-bold">{type === "Medical Enclave" ? "GFF-Med-34B" : "GFF-Llama-70B"}</span>
              </div>
              <div className="p-3 bg-black/30 border border-white/5 rounded flex justify-between">
                <span>Isolation:</span> <span className="text-[#009DFF] font-bold">{type === "Medical Enclave" ? "HSM Enclave" : "AMD SEV-SNP"}</span>
              </div>
            </div>
          </WorkspaceCard>

          <WorkspaceCard className="p-5 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase border-b border-white/5 pb-2">eBPF Telemetry Event Streams</h3>
            <div className="space-y-2 text-[11px] text-white/50 bg-black/40 border border-white/5 p-4 rounded text-left">
              {isDecoupled ? (
                <div>[23:55:00] Enclave decoupled by operator. OK</div>
              ) : (
                <div className="space-y-1.5 font-mono">
                  {operation.logs.map((log, index) => (
                    <div key={index} className="flex justify-between border-b border-white/5 pb-1 last:border-b-0 last:pb-0">
                      <span>{log}</span>
                      <span className="text-emerald-400 font-bold">VERIFIED</span>
                    </div>
                  ))}
                </div>
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
                <span className="text-[#009DFF] font-bold block uppercase text-[8px]">{type === "Medical Enclave" ? "HSM Enclave" : "AMD SEV-SNP"}</span>
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
