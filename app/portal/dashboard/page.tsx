"use client";

import React from "react";
import { CheckCircle, ShieldCheck, Activity, Cpu } from "lucide-react";

export default function ClientDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight font-mono uppercase">Client Workspace Dashboard</h2>
        <p className="text-xs text-white/50 mt-1">Unified operational intelligence summary of active multi-agent sandboxes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
        <div className="p-5 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm space-y-2">
          <span className="text-[9px] font-mono text-white/40 uppercase block">ACTIVE PROTOCOLS</span>
          <div className="text-white font-mono text-[14px] font-bold">Sovereign Core Sandbox 02</div>
          <div className="text-[11px] text-white/50 leading-relaxed">Verified eBPF kernel event tracking boundary.</div>
        </div>

        <div className="p-5 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm space-y-2">
          <span className="text-[9px] font-mono text-white/40 uppercase block">COMPLIANCE STANDARDS</span>
          <div className="text-green-400 font-mono text-[14px] font-bold flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-400" /> SOC2 Type II Certified
          </div>
          <div className="text-[11px] text-white/50 leading-relaxed">Isolated administrative boundaries enforced.</div>
        </div>

        <div className="p-5 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm space-y-2">
          <span className="text-[9px] font-mono text-white/40 uppercase block">ACTIVE ENCLAVES</span>
          <div className="text-[#009DFF] font-mono text-[14px] font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> 3 Live Clusters
          </div>
          <div className="text-[11px] text-white/50 leading-relaxed">Cryptographic enclaves running.</div>
        </div>
      </div>

      <div className="border border-white/5 rounded-xl bg-[#050505]/40 backdrop-blur-sm overflow-hidden mt-4">
        <div className="bg-white/[0.02] border-b border-white/5 px-4 py-3 text-[10px] font-mono text-white/40 uppercase font-bold tracking-wider">
          Recent System Handshakes
        </div>
        <div className="p-4 space-y-3 font-mono text-[11px] text-white/50">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span>[07:18:24] Handshake initiated with MED-CLINIC-H9</span>
            <span className="text-green-400 font-bold uppercase text-[10px] bg-green-400/5 border border-green-400/25 px-1.5 py-0.5 rounded">SUCCESS</span>
          </div>
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span>[07:18:24] Cryptographic key exchange verified</span>
            <span className="text-white/30 text-[10px] font-bold">AES-256 SECURE</span>
          </div>
          <div className="flex justify-between items-center">
            <span>[07:18:25] Enclave decapsulated directly on hardware module</span>
            <span className="text-white/30 text-[10px] font-mono">ID: 9810</span>
          </div>
        </div>
      </div>
    </div>
  );
}
