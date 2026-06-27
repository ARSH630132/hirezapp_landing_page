"use client";

import React from "react";
import Link from "next/link";
import { InvoiceCard } from "@/components/private-app";
import { ArrowLeft, ArrowRight, Receipt } from "lucide-react";

export default function ClientInvoicesPage() {
  const invoices = [
    { invoiceNo: "INV-9981-01", issueDate: "Jun 2026", amount: "$12,450.00", status: "settled", signature: "0xSHA_FF8911C02D3E" },
    { invoiceNo: "INV-9981-02", issueDate: "May 2026", amount: "$12,450.00", status: "settled", signature: "0xSHA_AB11D921C229" }
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/portal/billing"
          className="p-1.5 rounded border border-white/5 bg-white/[0.01] text-white/50 hover:text-white cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight font-mono uppercase">Invoice Ledger</h2>
          <p className="text-xs text-white/50 mt-1">Verified billing statements and commercial transaction receipts.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {invoices.map((inv) => (
          <div key={inv.invoiceNo} className="relative group">
            <InvoiceCard
              invoiceNo={inv.invoiceNo}
              issueDate={inv.issueDate}
              amount={inv.amount}
              status={inv.status}
              signature={inv.signature}
            />
            <div className="absolute top-3.5 right-24 z-20">
              <Link
                href={`/portal/billing/invoices/${inv.invoiceNo}`}
                className="inline-flex h-6 items-center gap-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 px-2 text-[9.5px] font-bold font-mono text-white/80 transition-all cursor-pointer"
              >
                <span>audit</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
