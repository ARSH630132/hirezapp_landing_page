"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Copy, Check, Briefcase, Download, SlidersHorizontal, Mail, ExternalLink } from "lucide-react";

const PROJECTS: Record<string, string> = {
  "GFF-2026-0899": "Retail Mesh Core A1",
  "GFF-2026-0914": "Sovereign Mining Loop",
  "GFF-2026-0945": "Singapore Sandbox Enclave",
  "GFF-2026-0988": "Multi-Agent Inference Cluster",
};

export default function ClientInvoicesPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selInvoice, setSelInvoice] = useState<any | null>(null);
  const [contactSuccess, setContactSuccess] = useState(false);

  const invoices = [
    { id: "GFF-2026-0899", date: "2026-06-01", amount: "14,820.00 USD", status: "paid", dueDate: "2026-06-15", category: "Compute Epoch", hash: "0xDE897FF021BC8102C019FFAD998E1256E3B890CC7FFADE138EE87A02FF90A11B" },
    { id: "GFF-2026-0914", date: "2026-06-15", amount: "3,500.00 USD", status: "paid", dueDate: "2026-06-30", category: "SLA Support", hash: "0x11B8A02FEE907C10BDE8267FEE10BC91A23D4FFA289F02ECBC12A349CDE150FA" },
    { id: "GFF-2026-0945", date: "2026-06-25", amount: "24,900.00 USD", status: "processing", dueDate: "2026-07-10", category: "Telemetry Stream", hash: "0x8FDE3102C130D7B2D26788AB0E8A850CE3207FFCDE10B74E824A45B12A4F23AA" },
    { id: "GFF-2026-0988", date: "2026-06-27", amount: "8,250.00 USD", status: "unpaid", dueDate: "2026-07-15", category: "Compute Epoch", hash: "0x3FBC128EE809FF9CC9810A88AA11B8FFFA02CE8274A08B0192A45C89FBC10492" }
  ];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch = inv.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          inv.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          PROJECTS[inv.id].toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/portal/billing"
            className="p-1.5 rounded border border-white/10 bg-white/[0.01] text-white/50 hover:text-white cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight font-mono uppercase">Certified Invoice Ledger</h2>
            <p className="text-xs text-white/50 mt-1">Verified commercial statements registered on GFF secure enclaves.</p>
          </div>
        </div>
        <div className="text-[11px] font-mono text-white/40">
          TOTAL ENTRIES: {filteredInvoices.length} / 4
        </div>
      </div>

      {/* Multi-Filters and Search Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/[0.01] border border-white/5 p-4 rounded-xl">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search statement ID, project name, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded bg-black border border-white/10 text-[11px] font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-[#009DFF]/60"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-white/30 flex-shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full h-9 rounded bg-black border border-white/10 text-[11.5px] font-mono text-white px-2 focus:outline-none focus:border-[#009DFF]/60"
          >
            <option value="all">Status: All Ledgers</option>
            <option value="paid">Status: Settled (Paid)</option>
            <option value="processing">Status: Processing</option>
            <option value="unpaid">Status: Unpaid</option>
          </select>
        </div>
      </div>

      {/* Results Container */}
      {filteredInvoices.length === 0 ? (
        <div className="p-12 text-center rounded-xl border border-white/5 bg-[#050505]/40 font-mono text-xs text-white/40">
          No secure invoice receipts matched your filter parameters.
        </div>
      ) : (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-white/5 bg-[#050505]/20">
            <table className="w-full text-left border-collapse font-mono text-[11px]">
              <thead>
                <tr className="border-b border-white/5 bg-[#030303] text-white/45 uppercase text-[10px] tracking-wider">
                  <th className="p-4 font-semibold">Ledger ID</th>
                  <th className="p-4 font-semibold">Epoch Category</th>
                  <th className="p-4 font-semibold">Associated Project</th>
                  <th className="p-4 font-semibold">Billed Amount</th>
                  <th className="p-4 font-semibold">Due Date</th>
                  <th className="p-4 font-semibold">Integrity Seal</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-white/[0.01] transition-all">
                    <td className="p-4 font-bold text-white">{inv.id}</td>
                    <td className="p-4 text-white/70">{inv.category}</td>
                    <td className="p-4 text-white/85">
                      <span className="flex items-center gap-1.5">
                        <Briefcase className="w-3 h-3 text-white/30" />
                        <span>{PROJECTS[inv.id]}</span>
                      </span>
                    </td>
                    <td className="p-4 font-bold text-[#009DFF]">{inv.amount}</td>
                    <td className="p-4 text-white/50">{inv.dueDate}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleCopy(inv.hash, inv.id)}
                        className="text-[10px] text-green-400 hover:underline flex items-center gap-1.5 cursor-pointer"
                        title={inv.hash}
                      >
                        {copiedId === inv.id ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <span className="truncate max-w-[80px] block">{inv.hash}</span>
                        )}
                      </button>
                    </td>
                    <td className="p-4 text-right space-x-1">
                      <button
                        onClick={() => setSelInvoice(inv)}
                        className="p-1 px-2.5 rounded bg-white hover:bg-white/90 text-black text-[10px] font-bold uppercase cursor-pointer"
                      >
                        Audit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile responsive Card layout */}
          <div className="md:hidden space-y-4">
            {filteredInvoices.map((inv) => (
              <div 
                key={inv.id}
                className="p-4 rounded-xl border border-white/5 bg-[#050505]/40 space-y-3 font-mono text-[11px]"
              >
                <div className="flex justify-between items-start border-b border-white/5 pb-2">
                  <div>
                    <span className="text-[9px] text-white/30 block uppercase">Epoch Reference</span>
                    <span className="text-xs font-bold text-white">{inv.id}</span>
                  </div>
                  <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                    inv.status === "paid" ? "bg-green-500/10 border border-green-500/20 text-green-400" :
                    inv.status === "processing" ? "bg-blue-500/10 border border-blue-500/20 text-[#009DFF]" :
                    "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                  }`}>
                    {inv.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-white/60 text-[10.5px]">
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <span>{inv.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Due Date:</span>
                    <span>{inv.dueDate}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-white/[0.03]">
                    <span>Project:</span>
                    <span className="text-white font-bold">{PROJECTS[inv.id]}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span>Billed:</span>
                    <span className="text-[#009DFF] font-bold text-[12.5px]">{inv.amount}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-white/5">
                  <button
                    onClick={() => setSelInvoice(inv)}
                    className="h-8 rounded bg-white hover:bg-white/90 text-black text-[10px] font-bold uppercase cursor-pointer"
                  >
                    View details
                  </button>
                  <button
                    onClick={() => handleCopy(inv.hash, inv.id)}
                    className="h-8 rounded border border-white/5 hover:border-white/20 bg-white/[0.01] text-[10px] text-white/70 hover:text-white flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copiedId === inv.id ? (
                      <>
                        <Check className="w-3 h-3 text-[#00FFC2]" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Crypt</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Drawer Overlay for Single Invoice detailed audit */}
      {selInvoice && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-md h-full bg-[#050505] border-l border-white/10 p-6 overflow-y-auto space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex justify-between items-start border-b border-white/5 pb-3">
                <div>
                  <span className="text-[9px] bg-blue-500/10 border border-blue-500/20 text-[#009DFF] px-1.5 py-0.5 rounded font-mono font-bold uppercase">Enclave verification</span>
                  <h3 className="text-lg font-bold text-white font-mono mt-1">{selInvoice.id}</h3>
                  <span className="text-[10px] text-white/40 font-mono block mt-0.5 font-bold font-mono">Project: {PROJECTS[selInvoice.id]}</span>
                </div>
                <button 
                  onClick={() => {
                    setSelInvoice(null);
                    setContactSuccess(false);
                  }}
                  className="p-1 text-white/40 hover:text-white cursor-pointer text-sm font-mono"
                >
                  [CLOSE]
                </button>
              </div>

              <div className="space-y-4 font-mono text-[11px]">
                <div className="p-3.5 rounded bg-black border border-white/5 space-y-2">
                  <div className="flex justify-between text-white/40 text-[10px]">
                    <span>LEDGER CRYPTO SEAL</span>
                    <button onClick={() => handleCopy(selInvoice.hash, "sel")} className="text-[#009DFF] hover:underline font-bold">COPY</button>
                  </div>
                  <div className="text-[9px] text-white/80 break-all select-all leading-relaxed bg-white/[0.02] p-2 rounded">
                    {selInvoice.hash}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[10.5px] font-bold text-white uppercase border-b border-white/5 pb-1">Resource Breakdown</h4>
                  <div className="space-y-1.5 text-white/70">
                    <div className="flex justify-between">
                      <span>{selInvoice.category} SLA Allocation</span>
                      <span className="text-white font-bold">{selInvoice.amount}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded border border-white/[0.03] bg-white/[0.01] space-y-2 text-[10.5px] text-[#ffffff8c]">
                  <div className="flex justify-between">
                    <span>Settled Epoch Date:</span>
                    <span className="text-white">{selInvoice.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Due Date:</span>
                    <span className="text-white">{selInvoice.dueDate}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-white/5">
              <Link 
                href={`/portal/billing/invoices/${selInvoice.id}`}
                className="w-full h-9 rounded border border-[#009DFF]/30 hover:border-[#009DFF]/50 bg-[#009DFF]/5 text-[#009DFF] font-semibold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Deep Audit Ledger Enclave</span>
              </Link>
              
              {contactSuccess ? (
                <div className="p-2.5 rounded border border-green-500/20 bg-green-500/5 text-green-400 font-mono text-[10.5px] text-center">
                  Secure invoice channel initialized. Liaison notified.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => alert("Certified PDF invoice receipt exported for Ledger ID: " + selInvoice.id)}
                    className="w-full h-9 rounded bg-white hover:bg-white/95 text-black font-semibold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Receipt PDF</span>
                  </button>
                  <button 
                    onClick={() => {
                      setContactSuccess(true);
                      setTimeout(() => setContactSuccess(false), 3000);
                    }}
                    className="w-full h-9 rounded border border-white/10 hover:border-white/20 bg-white/[0.01] text-white font-semibold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Inquire</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
