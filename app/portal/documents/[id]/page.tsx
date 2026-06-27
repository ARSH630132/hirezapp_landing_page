"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, FileText, ShieldCheck, Download } from "lucide-react";

export default function ClientDocumentDetailPage() {
  const router = useRouter();
  const { id } = useParams();

  const docId = typeof id === "string" ? id : "DOC-01";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/portal/documents")}
          className="p-1.5 rounded border border-white/5 bg-white/[0.01] text-white/50 hover:text-white cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <span className="text-[10px] font-mono font-bold text-[#009DFF] bg-[#009DFF]/5 border border-[#009DFF]/20 px-2 py-0.5 rounded uppercase">
            Sovereign Ledger Registry
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight font-mono uppercase mt-1">Audit Trail: {docId}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-5 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <FileText className="w-5 h-5 text-[#009DFF]" />
              <h3 className="text-sm font-bold text-white font-mono uppercase">Cryptographic Audit Credentials</h3>
            </div>
            
            <div className="space-y-3 font-mono text-[11.5px] text-white/75">
              <div className="p-3 bg-black/30 border border-white/5 rounded-lg flex justify-between">
                <span className="text-white/40">Sovereign Signature Key:</span>
                <span className="text-white font-bold text-[#00FFC2]">VALID_SIG_0x7FFF98A</span>
              </div>
              <div className="p-3 bg-black/30 border border-white/5 rounded-lg flex justify-between">
                <span className="text-white/40">Timestamp Block:</span>
                <span className="text-white">2026.06.27 10:22:15 UTC</span>
              </div>
              <div className="p-3 bg-black/30 border border-white/5 rounded-lg flex justify-between">
                <span className="text-white/40">Handshake Integrity:</span>
                <span className="text-green-400 font-bold uppercase">SECURED (100.00%)</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm space-y-4">
            <h3 className="text-sm font-bold text-white font-mono uppercase border-b border-white/5 pb-2">Document Audit Logs</h3>
            <div className="space-y-2 font-mono text-[11px] text-white/50">
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>[08:14:10] Document compiled and sealed by GFF Admin</span>
                <span className="text-white/40 text-[10px]">Sarah Vance</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>[10:18:22] Client session handshake validated (Level III)</span>
                <span className="text-emerald-400 font-bold text-[10px]">AUTHORIZED</span>
              </div>
              <div className="flex justify-between">
                <span>[10:22:15] Crypto seal verified by hardware security module</span>
                <span className="text-emerald-400 font-bold text-[10px]">OK</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-5 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm space-y-4">
            <div className="flex items-center gap-1.5 border-b border-white/5 pb-2">
              <ShieldCheck className="w-4.5 h-4.5 text-green-400" />
              <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">HSM Integrity State</h3>
            </div>
            
            <div className="space-y-3 font-mono text-[11px]">
              <div className="flex items-center justify-between p-2 rounded bg-[#009DFF]/5 border border-[#009DFF]/20 text-[#009DFF] font-bold">
                <span>DECAPSULATED:</span>
                <span>YES</span>
              </div>
              <p className="text-[10px] text-white/40 leading-relaxed">
                This document exists inside a hardware-isolated, non-volatile memory block (HSM). Decapsulation is safe, valid, and cryptographically verified.
              </p>
              <button className="w-full inline-flex h-9 items-center justify-center gap-1.5 rounded bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-white/90 transition-all cursor-pointer">
                <Download className="w-4 h-4" />
                <span>Download Certified Copy</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
