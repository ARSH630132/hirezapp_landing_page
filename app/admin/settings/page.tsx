"use client";

import React from "react";
import { Key, Lock, ShieldCheck } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight font-mono uppercase">Oversight Settings</h2>
        <p className="text-xs text-white/50 mt-1">Manage administrative credentials, HSM physical security module handshakes, and access logs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-5 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <Key className="w-5 h-5 text-[#009DFF]" />
            <h3 className="text-sm font-bold text-white font-mono uppercase">Master Administrative Tokens</h3>
          </div>

          <div className="space-y-4 font-mono text-[11.5px] text-white/70">
            <div className="p-4 rounded-lg bg-black/40 border border-white/5 space-y-2">
              <span className="text-[10px] text-white/35 block font-bold uppercase">Admin Session Enclave Key</span>
              <div className="flex justify-between items-center bg-[#050505] p-2.5 rounded border border-white/5">
                <span className="text-[#00FFC2] font-bold truncate pr-3">gff_admin_0x7FFA89112B10</span>
                <button
                  onClick={() => alert("Copied administrator enclave key to clipboard!")}
                  className="px-2.5 py-1 text-[10px] font-bold bg-white/5 border border-white/10 rounded hover:bg-white/10 text-white cursor-pointer shrink-0 transition-colors"
                >
                  COPY
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm space-y-4">
          <div className="flex items-center gap-1.5 border-b border-white/5 pb-2">
            <Lock className="w-5 h-5 text-[#009DFF]" />
            <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">HSM Verification</h3>
          </div>
          
          <div className="space-y-3 font-mono text-[11px]">
            <div className="flex items-center justify-between p-2 rounded bg-red-500/5 border border-red-500/20 text-red-400 font-bold">
              <span>HSM LEVEL V:</span>
              <span>SECURED</span>
            </div>
            <p className="text-[10px] text-white/40 leading-relaxed">
              Administrative credentials are bound directly to hardware enclaves. Session duration is strictly capped at 2 hours under ISO-27001 requirements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
