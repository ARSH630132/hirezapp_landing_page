"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, CreditCard, ShieldCheck, Copy, Check, Printer, 
  Landmark, Cpu, FileCheck, RefreshCw, Info 
} from "lucide-react";
import { DETAILED_INVOICES } from "../mock-billing-data";

export default function ClientInvoiceDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  
  const [copied, setCopied] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [sealStatus, setSealStatus] = useState<"verified" | "processing" | "idle">("idle");

  // API Integration States
  const [invoice, setInvoice] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoice = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("gff_ai_access_token") : null;
      if (!token) {
        setError("AUTHENTICATION TOKENS MISSING. SECURE SESSION EXPIRED.");
        return;
      }
      const res = await fetch(`/api/v1/invoices/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (res.status === 404) {
        throw new Error("Invoice statement not found in enclave registry.");
      }
      if (!res.ok) {
        throw new Error(`Enclave sync failed with status ${res.status}`);
      }
      const data = await res.json();
      if (data.success && data.invoice) {
        setInvoice(data.invoice);
      } else {
        throw new Error("Handshake returned malformed enclave register.");
      }
    } catch (err: any) {
      console.error("Error fetching invoice detail:", err);
      setError(err.message || "Decentralized ledger handshake timed out.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchInvoice();
  }, [fetchInvoice]);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 1500);
  };

  // Find match from DETAILED_INVOICES based on invoice_number, or fallback dynamically
  const invoiceData = invoice ? (DETAILED_INVOICES[invoice.invoice_number] || {
    projectName: invoice.project_name || "Sovereign Cluster Allocation",
    category: invoice.category || "Compute Epoch",
    date: invoice.issue_date,
    dueDate: invoice.due_date,
    amount: typeof invoice.amount === "number" ? invoice.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " " + invoice.currency : invoice.amount,
    hash: invoice.hash,
    signature: invoice.signature,
    items: [
      { desc: invoice.description || "Isolated Sovereign Node Compute Allocation", cost: typeof invoice.amount === "number" ? invoice.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " " + invoice.currency : invoice.amount }
    ],
    method: "Corporate Wire Transfer (SWIFT)",
    enclaveZone: "US-ZONE-E (VIRGINIA ENCLAVE)"
  }) : null;

  const triggerSealVerification = () => {
    setVerifying(true);
    setSealStatus("processing");
    setTimeout(() => {
      setVerifying(false);
      setSealStatus("verified");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/portal/billing/invoices")}
            className="p-1.5 rounded-lg border border-white/10 bg-white/[0.02] text-white/50 hover:text-white cursor-pointer transition-colors"
            aria-label="Back to Invoices Ledger"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="text-[10px] font-mono font-bold text-[#009DFF] bg-[#009DFF]/5 border border-[#009DFF]/20 px-2 py-0.5 rounded uppercase">
              Treasury Ledger Enclave
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight font-mono uppercase mt-1">Audit Enclave Statement</h2>
          </div>
        </div>
        
        <button
          onClick={() => window.print()}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.02] px-4 text-xs font-semibold text-white hover:bg-white/[0.06] hover:border-white/20 transition-all cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Audit Statement</span>
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4 border border-white/5 bg-[#050505]/40 backdrop-blur-sm rounded-xl">
          <RefreshCw className="w-10 h-10 animate-spin text-[#009DFF]" />
          <div className="text-center">
            <p className="text-sm font-mono font-semibold text-white tracking-wider uppercase">DECRYPTING ENCLAVE MEMORY...</p>
            <p className="text-xs text-white/40 font-mono mt-1">Establishing secure enclave connection for token {id}</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4 border border-red-500/10 bg-red-500/[0.01] rounded-xl">
          <Info className="w-10 h-10 text-red-400" />
          <div className="text-center">
            <p className="text-sm font-mono font-semibold text-red-400 tracking-wider uppercase">ENCLAVE DECRYPTION ERROR</p>
            <p className="text-xs text-white/40 font-mono mt-1 max-w-sm">{error}</p>
          </div>
          <button 
            onClick={fetchInvoice}
            className="px-4 py-2 border border-red-500/20 hover:border-red-500/40 bg-red-500/5 text-red-400 font-mono text-xs uppercase font-bold rounded cursor-pointer transition-all"
          >
            RE-INITIATE DECRYPTION HANDSHAKE
          </button>
        </div>
      ) : !invoiceData ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4 border border-white/5 bg-[#050505]/40 backdrop-blur-sm rounded-xl">
          <Info className="w-10 h-10 text-white/20" />
          <div className="text-center">
            <p className="text-sm font-mono font-semibold text-white tracking-wider uppercase">STATEMENT NOT FOUND</p>
            <p className="text-xs text-white/40 font-mono mt-1">The requested ledger statement could not be resolved.</p>
          </div>
        </div>
      ) : (
        /* Main Grid */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Columns: Invoice Details Receipt */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Receipt block */}
            <div className="p-6 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm space-y-6">
              
              {/* Logo and metadata */}
              <div className="flex justify-between items-start border-b border-white/5 pb-5 select-none">
                <div>
                  <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">GFF AI Systems</h3>
                  <p className="text-[10px] text-white/40 font-mono mt-0.5">Automated Enclave Settlement Ledger</p>
                </div>
                <div className="text-right font-mono text-[10.5px]">
                  <div className="text-white/40">STATEMENT REFERENCE</div>
                  <div className="text-[#009DFF] font-bold mt-0.5">{invoice?.invoice_number || id}</div>
                </div>
              </div>

              {/* Address Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-mono text-[11px] text-white/50 border-b border-white/5 pb-5 select-none">
                <div className="space-y-1">
                  <div className="text-white/30 text-[9.5px] uppercase">Issuer (Hardware Custodian)</div>
                  <div className="text-white font-semibold">GFF AI Global Treasury Corp</div>
                  <div>Berlin Secure Server Enclave 01</div>
                  <div>Hash Ring Corridor 4</div>
                </div>
                <div className="space-y-1 sm:text-right">
                  <div className="text-white/30 text-[9.5px] uppercase">Sovereign Client</div>
                  <div className="text-white font-semibold">Alexander Mercer</div>
                  <div>Apex Sovereign Sandbox</div>
                  <div>enclave-ref: apex-sovereign.gff.ai</div>
                </div>
              </div>

              {/* Dates & Billing Method */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-[11px] text-white/50 border-b border-white/5 pb-5 select-none">
                <div>
                  <span className="text-white/30 text-[9.5px] block uppercase">Epoch Date</span>
                  <span className="text-white font-semibold mt-0.5 block">{invoiceData.date}</span>
                </div>
                <div>
                  <span className="text-white/30 text-[9.5px] block uppercase">Due Date</span>
                  <span className="text-white font-semibold mt-0.5 block">{invoiceData.dueDate}</span>
                </div>
                <div>
                  <span className="text-white/30 text-[9.5px] block uppercase">Billing Category</span>
                  <span className="text-white font-semibold mt-0.5 block">{invoiceData.category}</span>
                </div>
                <div>
                  <span className="text-white/30 text-[9.5px] block uppercase">Hardware Zone</span>
                  <span className="text-white font-semibold mt-0.5 block">{invoiceData.enclaveZone}</span>
                </div>
              </div>

            {/* Detailed Line Items */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-white uppercase border-b border-white/5 pb-2">
                <CreditCard className="w-4 h-4 text-[#009DFF]" />
                <span>Resource Allocation Statement</span>
              </div>

              <div className="space-y-3 font-mono text-[11px] text-white/70 font-semibold">
                {invoiceData.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b border-white/[0.03] pb-2">
                    <span className="truncate pr-4">{item.desc}</span>
                    <span className="text-white font-bold shrink-0">{item.cost}</span>
                  </div>
                ))}

                {/* Total settled cost */}
                <div className="flex justify-between items-center text-sm font-bold text-white pt-2 select-none">
                  <span className="uppercase">Total Settled Amount:</span>
                  <span className="text-[#009DFF] text-lg font-mono">{invoiceData.amount}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Payment Details card */}
          <div className="p-5 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm space-y-4 font-mono text-[11px]">
            <h4 className="text-xs font-bold text-white uppercase border-b border-white/5 pb-2 flex items-center gap-2">
              <Landmark className="w-4 h-4 text-[#00FFC2]" />
              <span>Treasury Settlement Clearance</span>
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-white/50">
              <div>
                <span className="text-white/30 text-[9.5px] block uppercase">Settlement Method:</span>
                <span className="text-white font-semibold block mt-0.5">{invoiceData.method}</span>
              </div>
              <div>
                <span className="text-white/30 text-[9.5px] block uppercase">Transaction Reference Seal:</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[#00FFC2] font-semibold truncate block max-w-[200px]">
                    0xWIRE-{invoice?.invoice_number || id}
                  </span>
                  <button 
                    onClick={() => handleCopy(`0xWIRE-${invoice?.invoice_number || id}`, "ref")}
                    className="text-white/35 hover:text-white transition-all p-0.5 opacity-60 hover:opacity-100 cursor-pointer"
                    aria-label="Copy transaction reference"
                  >
                    {copied === "ref" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Cryptographic Seal Certification */}
        <div className="space-y-6">
          
          <div className="p-5 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm space-y-4">
            <div className="flex items-center gap-1.5 border-b border-white/5 pb-2 select-none">
              <ShieldCheck className="w-4.5 h-4.5 text-[#00FFC2]" />
              <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">Ledger Cryptography</h3>
            </div>

            <div className="space-y-4 font-mono text-[11px]">
              
              <div className="p-3 rounded-lg bg-black border border-white/5 space-y-2">
                <div className="flex justify-between items-center text-white/40 text-[9.5px]">
                  <span>ENCLAVE CRYPTO SEAL</span>
                  <button 
                    onClick={() => handleCopy(invoiceData.hash, "hash")}
                    className="text-[#009DFF] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {copied === "hash" ? "COPIED" : "COPY"}
                  </button>
                </div>
                <div className="text-[9px] text-white/80 break-all bg-white/[0.02] p-2 rounded leading-relaxed select-all">
                  {invoiceData.hash}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-black border border-white/5 space-y-2">
                <div className="flex justify-between items-center text-white/40 text-[9.5px]">
                  <span>HARDWARE SECURITY MODULE (HSM) KEY</span>
                  <span className="text-[#00FFC2] font-bold">{invoiceData.signature}</span>
                </div>
                <p className="text-[10px] text-white/40 leading-relaxed font-sans">
                  The HSM signature represents verified zero-knowledge proof generated by secure SGX enclaves upon final bank settlement detection.
                </p>
              </div>

              {/* Verify Interactive Seal Button */}
              {sealStatus === "verified" ? (
                <div className="flex items-center gap-2 p-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 font-bold justify-center select-none">
                  <FileCheck className="w-4 h-4 shrink-0" />
                  <span>STATEMENT CERTIFICATE VALID</span>
                </div>
              ) : (
                <button
                  onClick={triggerSealVerification}
                  disabled={verifying}
                  className="w-full h-9 flex items-center justify-center gap-2 rounded border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 text-white font-bold transition-all disabled:opacity-50 cursor-pointer"
                >
                  {verifying ? (
                    <>
                      <Cpu className="w-4 h-4 animate-spin text-[#009DFF]" />
                      <span>DECRYPTING SEALS...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-[#00FFC2]" />
                      <span>VALIDATE COVENANT PROOF</span>
                    </>
                  )}
                </button>
              )}

            </div>
          </div>

          {/* Secure Audit Notice */}
          <div className="p-4 rounded-xl border border-white/5 bg-[#050505]/20 font-mono text-[10px] text-white/40 leading-relaxed space-y-2 select-none">
            <div className="flex items-center gap-1.5 font-bold text-white/60">
              <Landmark className="w-3.5 h-3.5" />
              <span>REGULATORY DISCLAIMER</span>
            </div>
            <p>
              This document serves as an official proof of allocation for isolated sovereign container clusters.
            </p>
            <p>
              In accordance with ISO-27001 rulesets, all transactional traces are cryptographically co-signed under zero-trust memory limits and cannot be altered retroactively.
            </p>
          </div>

        </div>
      </div>
    )}
  </div>
  );
}
