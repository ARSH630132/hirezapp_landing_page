"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Layers, ShieldCheck, Cpu } from "lucide-react";

export default function AdminProjectDetailPage() {
  const router = useRouter();
  const { id } = useParams();

  const projectId = typeof id === "string" ? id : "PROJ-101";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/admin/projects")}
          className="p-1.5 rounded border border-white/5 bg-white/[0.01] text-white/50 hover:text-white cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <span className="text-[10px] font-mono font-bold text-[#009DFF] bg-[#009DFF]/5 border border-[#009DFF]/20 px-2 py-0.5 rounded uppercase">
            Administrative Oversight
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight font-mono uppercase mt-1">Project Detail: {projectId}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-5 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Cpu className="w-5 h-5 text-[#009DFF]" />
              <h3 className="text-sm font-bold text-white font-mono uppercase">Decoupled Architecture Specs</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[12px] font-mono text-white/70">
              <div className="p-3 bg-black/30 border border-white/5 rounded-lg flex justify-between">
                <span className="text-white/40">Node Hash Identifier:</span>
                <span className="text-white font-bold">FF-8821A-09</span>
              </div>
              <div className="p-3 bg-black/30 border border-white/5 rounded-lg flex justify-between">
                <span className="text-white/40">Context State Cache:</span>
                <span className="text-emerald-400 font-bold">DECOUPLED (64k)</span>
              </div>
              <div className="p-3 bg-black/30 border border-white/5 rounded-lg flex justify-between">
                <span className="text-white/40">Dedicated CPUs:</span>
                <span className="text-white">32 Parallel Workers</span>
              </div>
              <div className="p-3 bg-black/30 border border-white/5 rounded-lg flex justify-between">
                <span className="text-white/40">Data Boundary Isolation:</span>
                <span className="text-white">eBPF Kernel Audited</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-5 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm space-y-4">
            <div className="flex items-center gap-1.5 border-b border-white/5 pb-2">
              <ShieldCheck className="w-4.5 h-4.5 text-green-400" />
              <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">HSM Security State</h3>
            </div>
            <div className="space-y-3 font-mono text-[11px]">
              <div className="p-3 bg-green-500/5 border border-green-500/20 text-green-400 font-bold rounded flex items-center justify-between">
                <span>SOC2 CERTIFICATION:</span>
                <span>VERIFIED</span>
              </div>
              <p className="text-[10px] text-white/40 leading-relaxed">
                Dual-layer micro-enclave bounds verified on non-volatile hardware secure enclaves. Automatic decoupling overrides enabled.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
