"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, Cpu, ShieldCheck } from "lucide-react";

export default function ClientProjectDetailPage() {
  const router = useRouter();
  const { id } = useParams();

  const projectId = typeof id === "string" ? id : "PROJ-101";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/portal/projects")}
          className="p-1.5 rounded border border-white/5 bg-white/[0.01] text-white/50 hover:text-white cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <span className="text-[10px] font-mono font-bold text-[#009DFF] bg-[#009DFF]/5 border border-[#009DFF]/20 px-2 py-0.5 rounded uppercase">
            Active Sandbox Project
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight font-mono uppercase mt-1">Project Detail: {projectId}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-5 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Cpu className="w-5 h-5 text-[#009DFF]" />
              <h3 className="text-sm font-bold text-white font-mono uppercase">Enclave Node Specifications</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[12px] font-mono text-white/70">
              <div className="p-3 bg-black/30 border border-white/5 rounded-lg flex justify-between">
                <span className="text-white/40">Node Hash Identifier:</span>
                <span className="text-white font-bold">FF-8821A-09</span>
              </div>
              <div className="p-3 bg-black/30 border border-white/5 rounded-lg flex justify-between">
                <span className="text-white/40">Context State Frame:</span>
                <span className="text-emerald-400 font-bold">DECOUPLED</span>
              </div>
              <div className="p-3 bg-black/30 border border-white/5 rounded-lg flex justify-between">
                <span className="text-white/40">Dedicated Sandbox CPU:</span>
                <span className="text-white">16 Core Threads</span>
              </div>
              <div className="p-3 bg-black/30 border border-white/5 rounded-lg flex justify-between">
                <span className="text-white/40">Memory Isolation Bounds:</span>
                <span className="text-white">8.0 GB / 8.0 GB</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm space-y-4">
            <h3 className="text-sm font-bold text-white font-mono uppercase border-b border-white/5 pb-2">Active Telemetry Diagnostic stream</h3>
            <div className="space-y-2 font-mono text-[11px] text-white/50">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>[04:22:10] eBPF socket listening...</span>
                <span className="text-emerald-400 font-bold uppercase text-[10px]">ACTIVE</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>[04:22:15] Verify cryptographic key handshake...</span>
                <span className="text-emerald-400 font-bold uppercase text-[10px]">VERIFIED</span>
              </div>
              <div className="flex justify-between">
                <span>[04:22:18] Sandbox container policy checks complete</span>
                <span className="text-emerald-400 font-bold uppercase text-[10px]">VERIFIED</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-5 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm space-y-4">
            <div className="flex items-center gap-1.5 border-b border-white/5 pb-2">
              <ShieldCheck className="w-4.5 h-4.5 text-green-400" />
              <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">Security State</h3>
            </div>
            
            <div className="space-y-3 font-mono text-[11px]">
              <div className="flex items-center justify-between p-2 rounded bg-green-500/5 border border-green-500/20 text-green-400 font-bold">
                <span>COMPLIANCE LEVEL:</span>
                <span>SECURE</span>
              </div>
              <div className="space-y-1.5 text-white/50 text-[10px] leading-relaxed">
                <p>This sandbox project conforms entirely to sovereign zero-trust requirements including TLS 1.3 dual-layer sockets and micro-enclave memory boundaries.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
