"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, ShieldCheck } from "lucide-react";

export default function ClientInvoiceDetailPage() {
  const router = useRouter();
  const { id } = useParams();

  const invoiceId = typeof id === "string" ? id : "INV-9981-01";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/portal/billing/invoices")}
          className="p-1.5 rounded border border-white/5 bg-white/[0.01] text-white/50 hover:text-white cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <span className="text-[10px] font-mono font-bold text-[#009DFF] bg-[#009DFF]/5 border border-[#009DFF]/20 px-2 py-0.5 rounded uppercase">
            Treasury Ledger Audit
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight font-mono uppercase mt-1">Audit Invoice: {invoiceId}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-5 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <CreditCard className="w-5 h-5 text-[#009DFF]" />
              <h3 className="text-sm font-bold text-white font-mono uppercase">Detailed Line Items</h3>
            </div>
            
            <div className="space-y-2 font-mono text-[11.5px] text-white/70">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Decoupled Sandbox Compute (Singapore Zone A)</span>
                <span>$4,200.00</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Multi-Agent Neural Inference (3.2M Tokens)</span>
                <span>$6,800.00</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>eBPF Telemetry Hook Boundaries (4 Cores)</span>
                <span>$1,450.00</span>
              </div>
              <div className="flex justify-between font-bold text-white text-[13px] pt-1">
                <span>Total Settled USD:</span>
                <span className="text-[#009DFF]">$12,450.00</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm space-y-4">
            <h3 className="text-sm font-bold text-white font-mono uppercase border-b border-white/5 pb-2">Payment Details</h3>
            <div className="space-y-2.5 font-mono text-[11px] text-white/50">
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span className="text-white">Corporate Wire Transfer</span>
              </div>
              <div className="flex justify-between">
                <span>Reference Hash:</span>
                <span className="text-white font-bold">0xWIRE-GFF-2026-0899</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-5 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm space-y-4">
            <div className="flex items-center gap-1.5 border-b border-white/5 pb-2">
              <ShieldCheck className="w-4.5 h-4.5 text-green-400" />
              <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">Treasury Clearance</h3>
            </div>
            
            <div className="space-y-3 font-mono text-[11px]">
              <div className="flex items-center justify-between p-2 rounded bg-green-500/5 border border-green-500/20 text-green-400 font-bold">
                <span>SIGNATURE SEAL:</span>
                <span>VERIFIED</span>
              </div>
              <p className="text-[10px] text-white/40 leading-relaxed">
                This transaction ledger has been verified and cryptographically signed using GFF's secure corporate key. No pending audits remain.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
