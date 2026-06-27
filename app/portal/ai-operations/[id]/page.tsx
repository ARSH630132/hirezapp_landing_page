"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Bot, Shield, Cpu } from "lucide-react";

export default function ClientAiOperationsDetailPage() {
  const router = useRouter();
  const { id } = useParams();

  const agentName = typeof id === "string" ? id : "RETAIL-CORE-A1";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/portal/ai-operations")}
          className="p-1.5 rounded border border-white/5 bg-white/[0.01] text-white/50 hover:text-white cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <span className="text-[10px] font-mono font-bold text-[#009DFF] bg-[#009DFF]/5 border border-[#009DFF]/20 px-2 py-0.5 rounded uppercase">
            Agent Runtime telemetry
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight font-mono uppercase mt-1">Runtime detail: {agentName}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-5 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Bot className="w-5 h-5 text-[#009DFF]" />
              <h3 className="text-sm font-bold text-white font-mono uppercase">Neural Parameter Mapping</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[12px] font-mono text-white/70">
              <div className="p-3 bg-black/30 border border-white/5 rounded-lg flex justify-between">
                <span className="text-white/40">Model Architecture:</span>
                <span className="text-white font-bold">GFF-Llama-70B-v4</span>
              </div>
              <div className="p-3 bg-black/30 border border-white/5 rounded-lg flex justify-between">
                <span className="text-white/40">Context State Cache:</span>
                <span className="text-emerald-400 font-bold">DECOUPLED (128k)</span>
              </div>
              <div className="p-3 bg-black/30 border border-white/5 rounded-lg flex justify-between">
                <span className="text-white/40">Inference Thread Pool:</span>
                <span className="text-white">32 Parallel Workers</span>
              </div>
              <div className="p-3 bg-black/30 border border-white/5 rounded-lg flex justify-between">
                <span className="text-white/40">Temperature Enclave:</span>
                <span className="text-white">0.15 Enforced</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm space-y-4">
            <h3 className="text-sm font-bold text-white font-mono uppercase border-b border-white/5 pb-2">eBPF Telemetry Event Streams</h3>
            <div className="space-y-2.5 font-mono text-[11px] text-white/50">
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>[06:12:15] Context cache sync handshake initiated</span>
                <span className="text-emerald-400 font-bold text-[10px]">SUCCESS</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>[06:12:15] Guardrail safety policy matching score: 1.0</span>
                <span className="text-emerald-400 font-bold text-[10px]">VERIFIED</span>
              </div>
              <div className="flex justify-between">
                <span>[06:12:16] Token count: 1.2M. Spend budget caps verified</span>
                <span className="text-emerald-400 font-bold text-[10px]">OK</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-5 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm space-y-4">
            <div className="flex items-center gap-1.5 border-b border-white/5 pb-2">
              <Shield className="w-4 h-4 text-green-400" />
              <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">Guardrail Shield</h3>
            </div>
            <div className="space-y-3 font-mono text-[11px]">
              <div className="p-3 bg-green-500/5 border border-green-500/20 text-green-400 font-bold rounded flex items-center justify-between">
                <span>OVERRIDE SHIELD:</span>
                <span>ACTIVE</span>
              </div>
              <p className="text-[10px] text-white/40 leading-relaxed">
                All sensory outputs of this agent run are bound within secure sandbox overlays, fully protected against system privilege escalations or compliance drift.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
