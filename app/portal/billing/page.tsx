"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CreditCard, ShieldCheck } from "lucide-react";

export default function ClientBillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight font-mono uppercase">Billing & Quotas</h2>
        <p className="text-xs text-white/50 mt-1">Manage sovereign subscription metrics, quota caps, and view settled epoch invoices.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-2">
            <CreditCard className="w-5 h-5 text-[#009DFF]" />
            <h3 className="text-sm font-bold text-white font-mono uppercase">Sovereign Plan Parameters</h3>
          </div>
          
          <div className="space-y-3 font-mono text-[11.5px] text-white/70">
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-white/45">Active Subscription Plan:</span>
              <span className="text-white font-bold">Enterprise Infinite</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-white/45">Billing Interval:</span>
              <span className="text-white">Monthly Enclave Invoice</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-white/45">Allocated Sandbox Cores:</span>
              <span className="text-white">4 Active Cores</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-white/45">Payment Status:</span>
              <span className="text-green-400 font-bold uppercase text-[11px] bg-green-400/5 border border-green-400/25 px-1.5 py-0.5 rounded">Good Standing</span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2">
              <ShieldCheck className="w-5 h-5 text-green-400" />
              <h3 className="text-sm font-bold text-white font-mono uppercase">Cryptographic Invoices</h3>
            </div>
            <p className="text-xs text-white/50 leading-relaxed">
              Every billing cycle is cryptographically verified and signed by the GFF Treasury. Inspect settled epoch invoices, verify ledger references, and pull verified PDF receipts.
            </p>
          </div>
          <div className="pt-4">
            <Link
              href="/portal/billing/invoices"
              className="inline-flex h-10 px-5 rounded bg-white hover:bg-white/90 text-black font-semibold text-[11px] uppercase tracking-wider items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>View Invoice Ledger</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
