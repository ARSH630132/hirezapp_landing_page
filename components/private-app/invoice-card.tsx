"use client";

import React, { useState } from "react";
import { RefreshCw, ShieldCheck } from "lucide-react";
import { WorkspaceCard, StatusBadge } from "./cards-metrics-badges";

export function InvoiceCard({ 
  invoiceNo, 
  issueDate, 
  amount, 
  status = "verified",
  signature 
}: { 
  invoiceNo: string; 
  issueDate: string; 
  amount: string; 
  status?: "verified" | "settled" | "pending";
  signature: string;
}) {
  const [verifying, setVerifying] = useState(false);
  const [sigOk, setSigOk] = useState(true);

  const triggerVerification = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setSigOk(true);
    }, 1500);
  };

  return (
    <WorkspaceCard className="space-y-4 font-mono text-[11.5px]">
      <div className="flex justify-between items-start border-b border-white/5 pb-3 select-none">
        <div>
          <span className="text-[10px] text-white/35 block uppercase font-mono">Ledger Reference</span>
          <span className="text-[12.5px] font-bold text-white mt-0.5 block">{invoiceNo}</span>
        </div>
        <StatusBadge 
          state={status === "verified" || status === "settled" ? "active" : "warning"} 
          label={status} 
        />
      </div>

      <div className="space-y-2 select-none">
        <div className="flex justify-between">
          <span className="text-white/40">Timestamp Block:</span>
          <span className="text-white/70">{issueDate}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/40">Amount Settled:</span>
          <span className="text-white font-bold text-[#009DFF]">{amount}</span>
        </div>
        <div className="text-[9.5px] text-white/30 pt-1 border-t border-white/5 mt-1.5">
          <span className="block font-bold text-white/50 mb-0.5">CRYPTOGRAPHIC SIGNATURE:</span>
          <span className="truncate block text-[9px] text-[#00FFC2]/75">{signature}</span>
        </div>
      </div>

      <button 
        onClick={triggerVerification}
        disabled={verifying}
        className="w-full inline-flex h-8 items-center justify-center gap-1.5 rounded border border-white/10 bg-white/[0.01] text-[10.5px] font-bold text-white hover:bg-white/[0.04] hover:border-white/25 transition-all disabled:opacity-50 cursor-pointer select-none"
      >
        {verifying ? (
          <>
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#00FFC2]" />
            <span>EXCHANGING SEALS...</span>
          </>
        ) : sigOk ? (
          <>
            <ShieldCheck className="w-3.5 h-3.5 text-[#00FFC2]" />
            <span className="text-[#00FFC2]/90">CRYPTO SEAL VALID</span>
          </>
        ) : (
          <span>VALIDATE COVENANT</span>
        )}
      </button>
    </WorkspaceCard>
  );
}
