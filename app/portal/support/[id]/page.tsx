"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MessageSquare, ShieldCheck } from "lucide-react";

export default function ClientSupportDetailPage() {
  const router = useRouter();
  const { id } = useParams();

  const ticketId = typeof id === "string" ? id : "T-882";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/portal/support")}
          className="p-1.5 rounded border border-white/5 bg-white/[0.01] text-white/50 hover:text-white cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <span className="text-[10px] font-mono font-bold text-[#009DFF] bg-[#009DFF]/5 border border-[#009DFF]/20 px-2 py-0.5 rounded uppercase">
            Active Priority SLA Wire
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight font-mono uppercase mt-1">Audit Ticket: {ticketId}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-5 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <MessageSquare className="w-5 h-5 text-[#009DFF]" />
              <h3 className="text-sm font-bold text-white font-mono uppercase">Decoupled Secure Chat Thread</h3>
            </div>
            
            <div className="space-y-4 font-mono text-[11.5px]">
              <div className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-1">
                <div className="flex justify-between text-[10px] text-[#009DFF] font-bold">
                  <span>CLIENT OPERATOR (Alexander Mercer)</span>
                  <span>10:14:22 UTC</span>
                </div>
                <p className="text-white/80">Our Singapore Zone A secondary node replication shows an unexpected 14ms propagation delay. Is there a transient network bottleneck occurring inside the secure enclave boundary?</p>
              </div>

              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 space-y-1">
                <div className="flex justify-between text-[10px] text-[#00FFC2] font-bold">
                  <span>GFF SYSTEMS ENGINEER (Sarah Vance)</span>
                  <span>10:15:45 UTC</span>
                </div>
                <p className="text-white/80">Replication logs analyzed. Singapore Zone A established a dual-layer handshake successfully, but hardware security module (HSM) key rotations are causing transient buffers. We are re-routing standard telemetry overlays to mitigate this delay.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-5 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm space-y-4">
            <div className="flex items-center gap-1.5 border-b border-white/5 pb-2">
              <ShieldCheck className="w-4.5 h-4.5 text-green-400" />
              <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">SLA Status Parameters</h3>
            </div>
            
            <div className="space-y-3 font-mono text-[11px]">
              <div className="flex items-center justify-between p-2 rounded bg-[#009DFF]/5 border border-[#009DFF]/20 text-[#009DFF] font-bold">
                <span>PRIORITY:</span>
                <span>P1 CRITICAL</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/40">SLA Response Window:</span>
                <span className="text-white">15 minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Active Countdown:</span>
                <span className="text-amber-400 font-bold animate-pulse">01:45:12</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
