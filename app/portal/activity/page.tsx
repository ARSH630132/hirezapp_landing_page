"use client";

import React from "react";
import { History, ShieldCheck, Cpu, RefreshCw } from "lucide-react";

export default function ClientActivityPage() {
  const events = [
    { id: "ACT-01", title: "Zero-Trust Handshake Established", desc: "Dual-layer TLS 1.3 socket established for Singapore Zone A.", time: "10 mins ago", hash: "SHA_0x11B8" },
    { id: "ACT-02", title: "System Compile Success", desc: "Re-allocation of local sensory cache bounds initiated by operator Alexander Mercer.", time: "45 mins ago", hash: "SHA_0x7FFA" },
    { id: "ACT-03", title: "Cryptographic Invoice Signed", desc: "Invoice Ledger Reference GFF-2026-0899 cryptographically sealed.", time: "2 hours ago", hash: "SHA_0xDE89" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight font-mono uppercase">Activity Ledger</h2>
        <p className="text-xs text-white/50 mt-1">Real-time cryptographic audit trail of all actions, logins, and system handshakes.</p>
      </div>

      <div className="border border-white/5 rounded-xl bg-[#050505]/40 backdrop-blur-sm overflow-hidden mt-4">
        <div className="bg-white/[0.02] border-b border-white/5 px-4 py-3 text-[10px] font-mono text-white/40 uppercase font-bold tracking-wider flex items-center gap-2">
          <History className="w-4 h-4 text-[#009DFF]" />
          <span>Sovereign Enclave Audit Stream</span>
        </div>

        <div className="p-4 space-y-4 font-mono text-[11.5px] text-white/70">
          {events.map((event) => (
            <div key={event.id} className="p-4 bg-black/30 border border-white/5 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] text-[#009DFF] font-bold block">[{event.id}] - {event.time}</span>
                <h4 className="text-[13px] font-bold text-white">{event.title}</h4>
                <p className="text-xs text-white/50 leading-relaxed max-w-xl">{event.desc}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-emerald-400 font-bold block bg-emerald-400/5 border border-emerald-400/20 px-2 py-0.5 rounded w-max ml-auto uppercase">
                  VERIFIED
                </span>
                <span className="text-[9px] text-white/30 block mt-1">{event.hash}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
