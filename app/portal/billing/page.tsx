"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowRight, CreditCard, ShieldCheck, RefreshCw, Briefcase, 
  Download, Copy, Check, Activity, Cpu, ExternalLink, Info 
} from "lucide-react";

const PROJECTS_DATA: Record<string, {
  name: string;
  invoiceId: string;
  spend: string;
  quotaUsed: string;
  cores: number;
  graphColor: string;
  points: number[];
  dates: string[];
  description: string;
}> = {
  "GFF-2026-0899": {
    name: "Retail Mesh Core A1",
    invoiceId: "GFF-2026-0899",
    spend: "$14,820.00 USD",
    quotaUsed: "84.2%",
    cores: 4,
    graphColor: "#009DFF",
    points: [20, 35, 45, 30, 55, 75, 84],
    dates: ["Jun 1", "Jun 5", "Jun 10", "Jun 15", "Jun 20", "Jun 25", "Jun 27"],
    description: "Continuous real-time point-of-sale edge nodes and retail data synchronization."
  },
  "GFF-2026-0914": {
    name: "Sovereign Mining Loop",
    invoiceId: "GFF-2026-0914",
    spend: "$3,500.00 USD",
    quotaUsed: "15.0%",
    cores: 2,
    graphColor: "#00FFC2",
    points: [10, 12, 11, 15, 14, 15, 15],
    dates: ["Jun 1", "Jun 5", "Jun 10", "Jun 15", "Jun 20", "Jun 25", "Jun 27"],
    description: "SLA priority mining telemetry pipelines and threat protection modules."
  },
  "GFF-2026-0945": {
    name: "Singapore Sandbox Enclave",
    invoiceId: "GFF-2026-0945",
    spend: "$24,900.00 USD",
    quotaUsed: "92.6%",
    cores: 8,
    graphColor: "#A855F7",
    points: [40, 55, 60, 75, 80, 85, 92],
    dates: ["Jun 1", "Jun 5", "Jun 10", "Jun 15", "Jun 20", "Jun 25", "Jun 27"],
    description: "High-inference LLM sandbox environment with isolated security guardrails."
  },
  "GFF-2026-0988": {
    name: "Multi-Agent Inference Cluster",
    invoiceId: "GFF-2026-0988",
    spend: "$8,250.00 USD",
    quotaUsed: "41.3%",
    cores: 4,
    graphColor: "#F59E0B",
    points: [15, 22, 30, 28, 35, 39, 41],
    dates: ["Jun 1", "Jun 5", "Jun 10", "Jun 15", "Jun 20", "Jun 25", "Jun 27"],
    description: "Distributed AI agent system executing asynchronous regulatory compliance runs."
  }
};

const PROJECTS: Record<string, string> = {
  "GFF-2026-0899": "Retail Mesh Core A1",
  "GFF-2026-0914": "Sovereign Mining Loop",
  "GFF-2026-0945": "Singapore Sandbox Enclave",
  "GFF-2026-0988": "Multi-Agent Inference Cluster",
};

export default function ClientBillingPage() {
  const [verifying, setVerifying] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selInvoice, setSelInvoice] = useState<any | null>(null);
  const [inquirySent, setInquirySent] = useState(false);
  const [selProjectKey, setSelProjectKey] = useState<string>("GFF-2026-0899");

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

  const selectedProj = PROJECTS_DATA[selProjectKey];

  const generatePathData = (pts: number[]) => {
    const width = 500;
    const height = 120;
    const step = width / (pts.length - 1);
    const scale = height / 100;
    let path = `M 0,${height - pts[0] * scale}`;
    for (let i = 1; i < pts.length; i++) {
      const x = i * step;
      const y = height - pts[i] * scale;
      const prevX = (i - 1) * step;
      const prevY = height - pts[i - 1] * scale;
      const cpX1 = prevX + step / 2;
      const cpY1 = prevY;
      const cpX2 = prevX + step / 2;
      const cpY2 = y;
      path += ` C ${cpX1},${cpY1} ${cpX2},${cpY2} ${x},${y}`;
    }
    return path;
  };

  const pathString = generatePathData(selectedProj.points);
  const areaPathString = `${pathString} L 500,120 L 0,120 Z`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight font-mono uppercase">Sovereign Spend & Bill Ledger</h2>
          <p className="text-xs text-white/50 mt-1">Cryptographically certified enterprise commitments, real-time SLA compute quotas, and verified epoch statements.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/portal/billing/invoices"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.02] px-4 text-xs font-semibold text-white hover:bg-white/[0.06] hover:border-white/20 transition-all"
          >
            <span>Invoice Ledger</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#009DFF]" />
          </Link>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Plan Parameters */}
        <div className="p-5 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-2">
            <CreditCard className="w-4 h-4 text-[#009DFF]" />
            <h3 className="text-xs font-bold text-white font-mono uppercase">Plan Parameters</h3>
          </div>
          <div className="space-y-2.5 font-mono text-[11px] text-white/70">
            <div className="flex justify-between border-b border-white/[0.02] pb-1.5">
              <span className="text-white/40">Active Tier:</span>
              <span className="text-white font-bold">Enterprise Infinite</span>
            </div>
            <div className="flex justify-between border-b border-white/[0.02] pb-1.5">
              <span className="text-white/40">Compute Quota Limit:</span>
              <span className="text-[#009DFF] font-bold">100,000.00 USD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">Isolated Sandboxes:</span>
              <span className="text-white">4 Active Enclaves</span>
            </div>
          </div>
        </div>

        {/* Card 2: Ledger Summary */}
        <div className="p-5 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-2">
            <Briefcase className="w-4 h-4 text-[#00FFC2]" />
            <h3 className="text-xs font-bold text-white font-mono uppercase">Ledger Summary</h3>
          </div>
          <div className="space-y-2.5 font-mono text-[11px] text-white/70">
            <div className="flex justify-between border-b border-white/[0.02] pb-1.5">
              <span className="text-white/40">Total Committed:</span>
              <span className="text-[#009DFF] font-bold">$51,470.00 USD</span>
            </div>
            <div className="flex justify-between border-b border-white/[0.02] pb-1.5">
              <span className="text-white/40">Settled (Paid):</span>
              <span className="text-emerald-400 font-bold">$18,320.00 USD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">Pending Clearance:</span>
              <span className="text-amber-400 font-bold">$33,150.00 USD</span>
            </div>
          </div>
        </div>

        {/* Card 3: Ledger Integrity */}
        <div className="p-5 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2">
              <ShieldCheck className="w-4 h-4 text-[#00FFC2]" />
              <h3 className="text-xs font-bold text-white font-mono uppercase">Ledger Integrity</h3>
            </div>
            <p className="text-[10px] text-white/50 leading-relaxed font-mono">
              Invoices are cryptographically co-signed under isolated hardware security. Instant zero-knowledge verification status.
            </p>
          </div>
          <button 
            onClick={() => {
              setVerifying(true);
              setTimeout(() => setVerifying(false), 1200);
            }}
            disabled={verifying}
            className="w-full h-8.5 flex items-center justify-center gap-1.5 rounded border border-white/10 bg-white/[0.02] text-[10px] font-mono font-bold text-white hover:bg-white/[0.05] hover:border-white/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {verifying ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#009DFF]" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5 text-[#00FFC2]" />
            )}
            <span>{verifying ? "VERIFYING SEALS..." : "LEDGER COVENANT VERIFIED"}</span>
          </button>
        </div>
      </div>

      {/* Invoice Ledger Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Certified Invoices */}
        <div className="lg:col-span-2 p-5 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">Epoch Statements</h3>
            <Link 
              href="/portal/billing/invoices" 
              className="text-[10px] font-mono text-[#009DFF] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {invoices.map((inv) => (
              <div 
                key={inv.id} 
                className={`p-3 rounded-lg border transition-all font-mono text-[10.5px] cursor-pointer ${
                  selProjectKey === inv.id 
                    ? "bg-white/[0.03] border-white/15" 
                    : "bg-[#020202]/30 border-white/5 hover:border-white/10"
                }`}
                onClick={() => setSelProjectKey(inv.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-white block">{inv.id}</span>
                    <span className="text-[9.5px] text-white/40 block mt-0.5">{PROJECTS[inv.id]}</span>
                  </div>
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                    inv.status === "paid" ? "bg-green-500/10 border border-green-500/20 text-green-400" :
                    inv.status === "processing" ? "bg-blue-500/10 border border-blue-500/20 text-[#009DFF]" :
                    "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                  }`}>
                    {inv.status}
                  </span>
                </div>
                
                <div className="flex justify-between items-center mt-3 pt-2 border-t border-white/[0.03] text-[9.5px]">
                  <span className="text-white/40">{inv.category}</span>
                  <span className="text-white font-semibold">{inv.amount}</span>
                </div>

                <div className="flex justify-between items-center mt-2 text-[9.5px]">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelInvoice(inv);
                    }}
                    className="text-[#009DFF] hover:underline font-bold"
                  >
                    Audit Drawer &gt;
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(inv.hash, inv.id);
                    }}
                    className="text-white/30 hover:text-white"
                  >
                    {copiedId === inv.id ? "Copied Hash" : "Copy Hash"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Treasury Card */}
        <div className="p-5 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm space-y-4">
          <div className="border-b border-white/5 pb-2">
            <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">Treasury Liaison Desk</h3>
            <p className="text-[10px] text-white/40 font-mono mt-0.5">Encrypted non-automated wire support.</p>
          </div>

          <div className="p-4 rounded border border-white/5 bg-black space-y-2 font-mono text-[10.5px]">
            <div>
              <span className="text-white/30 block text-[9px]">SWIFT ROUTER CODE</span>
              <span className="text-white font-bold">GFF-AI-TREAS-BER</span>
            </div>
            <div>
              <span className="text-white/30 block text-[9px]">SECURE EMAIL CHANNEL</span>
              <span className="text-white">treasury@gff.ai</span>
            </div>
          </div>

          {inquirySent ? (
            <div className="p-2 text-center rounded border border-green-500/20 bg-green-500/5 text-green-400 font-mono text-[10.5px]">
              Inquiry registered. GFF desk notified.
            </div>
          ) : (
            <button 
              onClick={() => {
                setInquirySent(true);
                setTimeout(() => setInquirySent(false), 3000);
              }}
              className="w-full h-8 bg-white hover:bg-white/90 text-black text-[10.5px] font-bold uppercase rounded transition-all cursor-pointer"
            >
              Contact GFF Treasury Desk
            </button>
          )}
          
          <p className="text-[9.5px] text-white/30 leading-relaxed font-mono">
            Always specify invoice ledger references in SWIFT metadata to enable instant enclave matching.
          </p>
        </div>
      </div>

      {/* Invoice Detail Slide-out Drawer overlay */}
      {selInvoice && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-end animate-[fadeIn_0.15s_ease-out]">
          <div className="w-full max-w-md h-full bg-[#050505] border-l border-white/10 p-6 overflow-y-auto space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex justify-between items-start border-b border-white/5 pb-3">
                <div>
                  <span className="text-[9px] bg-blue-500/10 border border-blue-500/20 text-[#009DFF] px-1.5 py-0.5 rounded font-mono font-bold uppercase">Statement preview</span>
                  <h3 className="text-lg font-bold text-white font-mono mt-1">{selInvoice.id}</h3>
                  <span className="text-[10px] text-white/40 font-mono block mt-0.5 font-bold">Project: {PROJECTS[selInvoice.id]}</span>
                </div>
                <button 
                  onClick={() => setSelInvoice(null)}
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
                  <h4 className="text-[10.5px] font-bold text-white uppercase border-b border-white/5 pb-1">Resource Cost Allocation</h4>
                  <div className="space-y-1.5 text-white/70">
                    <div className="flex justify-between">
                      <span>{selInvoice.category} SLA Allocation</span>
                      <span className="text-white font-bold">{selInvoice.amount}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded border border-white/[0.03] bg-white/[0.01] space-y-2 text-[10.5px] text-white/50">
                  <div className="flex justify-between">
                    <span>Invoice Timestamp:</span>
                    <span className="text-white">{selInvoice.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Epoch Due Date:</span>
                    <span className="text-white">{selInvoice.dueDate}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-white/5">
              <button 
                onClick={() => alert("Simulated PDF export initiated for ledger ID: " + selInvoice.id)}
                className="w-full h-9 rounded bg-white hover:bg-white/95 text-black font-semibold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Certified PDF receipt</span>
              </button>
              <button 
                onClick={() => {
                  setInquirySent(true);
                  setSelInvoice(null);
                  setTimeout(() => setInquirySent(false), 3000);
                }}
                className="w-full h-9 rounded border border-white/10 hover:border-white/20 bg-white/[0.01] text-white font-semibold text-[11px] uppercase tracking-wider transition-all cursor-pointer"
              >
                Contact Finance Desk
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
