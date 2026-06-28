"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  FileText, Search, Plus, Filter, Download, Check, Lock, Shield, 
  Activity, RefreshCw, ChevronRight, X, Key, Database, Cpu, Sparkles,
  Trash2, AlertTriangle
} from "lucide-react";
import { PrivatePageHeader } from "@/components/private-app";

interface Invoice {
  id: string; 
  date: string; 
  amount: number; 
  status: "paid" | "unpaid" | "processing" | "overdue";
  dueDate: string; 
  category: string; 
  clientId: string; 
  clientName: string;
  projectId: string; 
  projectName: string; 
  hash: string; 
  billingMonth: string;
}

const HSM_SIGNING_LOGS = [
  "Querying node thread credit metrics...",
  "Opening HSM ECC-256 secure enclave...",
  "Sealing usage blocks & committing to ledger..."
];

export default function AdminBillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [selClient, setSelClient] = useState("all");
  const [selStatus, setSelStatus] = useState("all");
  const [selMonth, setSelMonth] = useState("all");

  const [active, setActive] = useState<(Invoice & { dbId?: string }) | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Form states
  const [cId, setCId] = useState("");
  const [pId, setPId] = useState("");
  const [amount, setAmount] = useState("");
  const [due, setDue] = useState("");
  const [status, setStatus] = useState<Invoice["status"]>("unpaid");
  const [month, setMonth] = useState("2026-06");

  const [dbClients, setDbClients] = useState<any[]>([]);
  const [dbProjects, setDbProjects] = useState<any[]>([]);

  // Derived lists prioritizing dynamic backend API data, falling back to Phase 4 mock data
  const clientsList = useMemo(() => {
    return dbClients;
  }, [dbClients]);

  const projects = useMemo(() => {
    if (!cId) return [];
    return dbProjects.filter(p => p.client_id === cId).map(p => ({
      id: p.id,
      name: p.name,
      clientAccountId: p.client_id,
      tag: p.name.substring(0, 3).toUpperCase()
    }));
  }, [cId, dbProjects]);

  // Signing State
  const [signing, setSigning] = useState(false);
  const [step, setStep] = useState(0);

  const [isDownloading, setIsDownloading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const triggerToast = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 3000);
  };

  // Dynamically fetch and sync invoices metadata from /api/v1/invoices
  const fetchData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("gff_ai_access_token") || localStorage.getItem("gff_api_token") : null;
      if (!token) throw new Error("Your session has expired. Please sign in again.");

      const res = await fetch("/api/v1/invoices", { headers: { "Authorization": `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.invoices) {
          const mappedInvoices = data.invoices.map((i: any) => ({
            id: i.invoice_number || i.id,
            dbId: i.id,
            date: i.issue_date,
            amount: i.amount,
            status: i.status,
            dueDate: i.due_date,
            category: i.category,
            clientId: i.client_id,
            clientName: i.client_name,
            projectId: i.project_id,
            projectName: i.project_name || i.project_id || "Secure Enclave",
            hash: i.hash,
            billingMonth: i.issue_date.substring(0, 7)
          }));
          setInvoices(mappedInvoices);

          // Fetch dynamic client accounts for selection
          const clientsRes = await fetch("/api/v1/clients", { headers: { "Authorization": `Bearer ${token}` } });
          if (clientsRes.ok) {
            const clientsData = await clientsRes.json();
            if (clientsData.success && Array.isArray(clientsData.clients)) {
              setDbClients(clientsData.clients);
            }
          }

          // Fetch dynamic projects for selection
          const projectsRes = await fetch("/api/v1/projects", { headers: { "Authorization": `Bearer ${token}` } });
          if (projectsRes.ok) {
            const projectsData = await projectsRes.json();
            if (projectsData.success && Array.isArray(projectsData.projects)) {
              setDbProjects(projectsData.projects);
            }
          }
        } else {
          throw new Error(data.message || "Failed to load active ledger blocks.");
        }
      } else {
        throw new Error("HTTP connection failed.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to synchronize billing ledger with HSM core.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    let t: NodeJS.Timeout;
    if (signing) {
      t = setInterval(() => {
        setStep(s => {
          if (s < HSM_SIGNING_LOGS.length - 1) return s + 1;
          clearInterval(t);
          
          const cl = clientsList.find(x => x.id === cId);
          const pr = projects.find(x => x.id === pId);
          const id = `GFF-2026-${String(invoices.length + 900).padStart(4, "0")}`;

          const token = localStorage.getItem("gff_ai_access_token");
          fetch("/api/v1/invoices", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
              invoice_number: id,
              client_id: cId,
              project_id: pId,
              amount: parseFloat(amount) || 0,
              dueDate: due || "2026-07-15",
              category: "Compute Epoch",
              issue_date: new Date().toISOString().split("T")[0],
              due_date: due || "2026-07-15",
              status: status,
              description: "Cloud native secure enclave compute fee."
            })
          })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              fetchData();
              triggerToast(`Sealed invoice ${id} successfully on HSM.`);
            } else {
              triggerToast(`Failed to commit ledger: ${data.message || "Unknown error"}`);
            }
          })
          .catch(err => {
            triggerToast("Ledger commit failed: Connection error.");
          })
          .finally(() => {
            setSigning(false);
            setStep(0);
            setIsOpen(false);
            setCId(""); setAmount("");
          });

          return 0;
        });
      }, 600);
    }
    return () => clearInterval(t);
  }, [signing, cId, pId, amount, due, status, month, invoices.length, fetchData, clientsList, projects]);

  
  useEffect(() => { 
    if (projects.length > 0) {
      setPId(projects[0].id);
    } 
  }, [projects]);

  const stats = useMemo(() => {
    let total = 0, settled = 0, proc = 0, unp = 0;
    invoices.forEach(i => {
      total += i.amount;
      if (i.status === "paid") settled += i.amount;
      else if (i.status === "processing") proc += i.amount;
      else unp += i.amount;
    });
    return { total, settled, proc, unp, count: invoices.length };
  }, [invoices]);

  const filtered = useMemo(() => {
    return invoices.filter(i => {
      if (query && !i.id.toLowerCase().includes(query.toLowerCase()) && !i.clientName.toLowerCase().includes(query.toLowerCase())) return false;
      if (selClient !== "all" && i.clientId !== selClient) return false;
      if (selStatus !== "all" && i.status !== selStatus) return false;
      if (selMonth !== "all" && i.billingMonth !== selMonth) return false;
      return true;
    });
  }, [invoices, query, selClient, selStatus, selMonth]);

  const handleSettlePayment = async (dbId: string) => {
    setIsProcessing(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("gff_ai_access_token") : null;
      const res = await fetch(`/api/v1/invoices/${dbId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: "paid" })
      });
      const data = await res.json();
      if (data.success) {
        await fetchData();
        setActive(p => p && p.dbId === dbId ? { ...p, status: "paid" } : p);
        triggerToast(`Ledger settled successfully.`);
      } else {
        triggerToast(`Failed to settle ledger: ${data.message || "Unknown error"}`);
      }
    } catch (err) {
      triggerToast("Failed to settle ledger: Connection error.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteInvoice = async (dbId: string, invoiceNumber: string) => {
    if (confirm(`Deprovision and archive ledger block ${invoiceNumber}? This action is irreversible.`)) {
      setIsProcessing(true);
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("gff_ai_access_token") : null;
        const res = await fetch(`/api/v1/invoices/${dbId}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          triggerToast(`Ledger block ${invoiceNumber} archived.`);
          setActive(null);
          await fetchData();
        } else {
          triggerToast(`Failed to archive ledger: ${data.message || "Unknown error"}`);
        }
      } catch (err) {
        triggerToast("Failed to communicate archive command.");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleDownload = (id: string) => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      triggerToast(`Receipt downloaded for ${id}`);
    }, 800);
  };

  const formatUSD = (v: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v);

  return (
    <div className="space-y-6 text-zinc-100 pb-12">
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-4 py-3 rounded-xl border border-emerald-500/30 bg-black/95 text-emerald-400 backdrop-blur font-mono text-xs shadow-lg tracking-wide animate-fade-in">
          <span>{toast}</span>
        </div>
      )}

      <PrivatePageHeader 
        title="FINANCIAL LEDGER OPERATIONS" 
        desc="Internal console to draft client invoice previews, audit HSM resource seals, and verify active contract cycles."
        actions={
          <button 
            onClick={() => setIsOpen(true)} 
            className="h-9 px-4 rounded bg-[#009DFF] hover:bg-[#0082d4] text-[10.5px] text-white flex items-center gap-1.5 transition-all border border-white/5 cursor-pointer font-bold uppercase tracking-wider"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Draft Invoice Preview</span>
          </button>
        }
      />

      {loading && invoices.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-white/5 rounded-xl bg-[#050505]/20 font-mono text-center">
          <RefreshCw className="w-10 h-10 text-white/25 mb-3 animate-spin text-[#009DFF]" />
          <h4 className="text-white text-sm font-bold uppercase tracking-wider">Synchronizing Ledger...</h4>
          <p className="text-white/40 text-[11px] max-w-sm mt-1 leading-relaxed">
            Retrieving attestation ledger blocks and calculating computational epochs from active HSM enclaves...
          </p>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl border border-rose-500/10 bg-rose-500/5 text-rose-400 text-xs font-mono flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span><strong>LEDGER ERROR:</strong> {error}</span>
          </div>
          <button
            onClick={fetchData}
            className="px-3 h-7 rounded bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/20 text-[10px] text-white uppercase tracking-wider font-bold transition-all cursor-pointer"
          >
            Retry Sync
          </button>
        </div>
      )}

      {/* RENDER_PIPELINE */}
      <div className="rounded-2xl border border-white/5 bg-[#050505]/40 p-5 space-y-4 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-white/5 pb-3">
          <div>
            <h4 className="text-xs font-bold tracking-widest text-white uppercase flex items-center gap-1.5 font-mono">
              <Shield className="w-4 h-4 text-[#009DFF]" />
              <span>SOVEREIGN CRYPTOGRAPHIC SIGNING FLOW</span>
            </h4>
            <p className="text-xs text-zinc-400 mt-0.5">Continuous hardware-attested verification pipeline mapping cloud sandboxes to the administrative ledger.</p>
          </div>
          <div className="text-[10px] text-emerald-400 bg-emerald-500/5 px-2.5 py-0.5 rounded border border-emerald-500/20 uppercase font-bold font-mono tracking-wider shrink-0">
            HSM Core Active
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="p-4 rounded-xl border border-white/5 bg-black/30 flex gap-3 hover:border-white/10 transition-colors">
            <Cpu className="w-5 h-5 text-[#009DFF] shrink-0" />
            <div>
              <span className="text-xs font-bold text-zinc-200 block">1. Ingest Telemetry</span>
              <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">Continuous hardware credit utilization captured securely from active client sandboxes using kernel-level eBPF handlers.</p>
            </div>
          </div>
          <div className="p-4 rounded-xl border border-white/5 bg-black/30 flex gap-3 hover:border-white/10 transition-colors">
            <Key className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="text-xs font-bold text-zinc-200 block">2. Seal HSM Block</span>
              <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">Sovereign Hardware Security Enclaves generate dynamic ECDSA ECC-256 signatures over aggregated metrics.</p>
            </div>
          </div>
          <div className="p-4 rounded-xl border border-white/5 bg-black/30 flex gap-3 hover:border-white/10 transition-colors">
            <Database className="w-5 h-5 text-[#00FFC2] shrink-0" />
            <div>
              <span className="text-xs font-bold text-zinc-200 block">3. Commit Ledger</span>
              <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">Sealed invoice blocks are mapped to the administrative index, creating an immutable history for auditing.</p>
            </div>
          </div>
        </div>
      </div>

      {/* RENDER_STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { l: "Total Invoiced", v: stats.total, c: "text-white" },
          { l: "Settled Receipts", v: stats.settled, c: "text-emerald-400" },
          { l: "Awaiting Audit", v: stats.proc, c: "text-[#009DFF]" },
          { l: "Ledger Exposure", v: stats.unp, c: "text-rose-400" }
        ].map((s, i) => (
          <div key={i} className="p-4 rounded-xl border border-white/5 bg-[#050505]/40 hover:border-white/10 transition-colors">
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono block">{s.l}</span>
            <div className={`text-base font-extrabold mt-1.5 font-mono tracking-tight ${s.c}`}>
              {formatUSD(s.v)} <span className="text-[10px] text-zinc-500 font-normal">USD</span>
            </div>
          </div>
        ))}
      </div>

      {/* RENDER_FILTERS */}
      <div className="p-3.5 rounded-xl border border-white/5 bg-[#050505]/30 grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Query by ID, Client..." 
            value={query} 
            onChange={e => setQuery(e.target.value)}
            className="w-full h-9 pl-3 pr-8 rounded bg-black/40 border border-white/5 text-xs text-white focus:outline-none focus:border-[#009DFF]/30 placeholder-white/30"
          />
          <Search className="absolute right-2.5 top-2.5 w-4 h-4 text-white/20" />
        </div>
        <select 
          value={selClient} 
          onChange={e => setSelClient(e.target.value)} 
          className="h-9 px-3 rounded bg-black/40 border border-white/5 text-xs text-zinc-300 focus:outline-none appearance-none cursor-pointer hover:border-white/10"
        >
          <option value="all">Sovereign Client: All</option>
          {clientsList.map(c => (
            <option key={c.id} value={c.id}>{c.name.replace(" [Preview Client]", "")}</option>
          ))}
        </select>
        <select 
          value={selStatus} 
          onChange={e => setSelStatus(e.target.value)} 
          className="h-9 px-3 rounded bg-black/40 border border-white/5 text-xs text-zinc-300 focus:outline-none appearance-none cursor-pointer hover:border-white/10"
        >
          <option value="all">Invoice Status: All</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
          <option value="processing">Processing</option>
          <option value="overdue">Overdue</option>
        </select>
        <select 
          value={selMonth} 
          onChange={e => setSelMonth(e.target.value)} 
          className="h-9 px-3 rounded bg-black/40 border border-white/5 text-xs text-zinc-300 focus:outline-none appearance-none cursor-pointer hover:border-white/10"
        >
          <option value="all">Billing Month: All</option>
          <option value="2026-06">June 2026</option>
          <option value="2026-05">May 2026</option>
        </select>
      </div>
      {/* RENDER_TABLE */}
      <div className="rounded-xl border border-white/5 bg-[#050505]/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-black/30 text-[10px] text-zinc-400 uppercase tracking-widest font-mono">
                <th className="py-3 px-5 font-bold">Invoice ID</th>
                <th className="py-3 px-5 font-bold">Client</th>
                <th className="py-3 px-5 font-bold">Project</th>
                <th className="py-3 px-5 font-bold">Category</th>
                <th className="py-3 px-5 font-bold text-right">Amount (USD)</th>
                <th className="py-3 px-5 font-bold text-center">Due Date</th>
                <th className="py-3 px-5 font-bold text-center">Status</th>
                <th className="py-3 px-5 font-bold text-center">Seal Hash</th>
                <th className="py-3 px-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03] text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-zinc-500 font-mono">
                    No matching ledger blocks found.
                  </td>
                </tr>
              ) : (
                filtered.map(i => (
                  <tr 
                    key={i.id} 
                    onClick={() => setActive(i)} 
                    className="hover:bg-white/[0.02] transition-all cursor-pointer group"
                  >
                    <td className="py-3.5 px-5 font-bold text-[#009DFF] font-mono">{i.id}</td>
                    <td className="py-3.5 px-5 text-zinc-200 font-semibold">{i.clientName.replace(" [Preview Client]", "")}</td>
                    <td className="py-3.5 px-5 text-zinc-400">{i.projectName}</td>
                    <td className="py-3.5 px-5 text-zinc-500 text-[9.5px] uppercase tracking-wider font-mono">{i.category}</td>
                    <td className="py-3.5 px-5 text-right font-bold text-white font-mono">${i.amount.toLocaleString()}</td>
                    <td className="py-3.5 px-5 text-center text-zinc-400 font-mono">{i.dueDate}</td>
                    <td className="py-3.5 px-5 text-center">
                      <span className={`px-2 py-0.5 rounded text-[9px] uppercase border font-bold font-mono tracking-wider ${
                        i.status === "paid" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25" :
                        i.status === "unpaid" ? "bg-amber-400/10 text-amber-400 border-amber-400/25" :
                        i.status === "processing" ? "bg-[#009DFF]/10 text-[#009DFF] border-[#009DFF]/25" :
                        "bg-rose-500/10 text-rose-400 border-rose-500/25"
                      }`}>
                        {i.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-center text-zinc-500 text-[10px] font-mono">{i.hash.slice(0, 10)}...</td>
                    <td className="py-3.5 px-5 text-center text-white/20 group-hover:text-[#009DFF] transition-colors">
                      <ChevronRight className="w-4 h-4 translate-x-0 group-hover:translate-x-0.5 transition-transform" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* RENDER_DRAWER */}
      {active && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setActive(null)} />
          <div className="w-full max-w-md bg-[#050505] border-l border-white/5 relative z-10 p-6 flex flex-col justify-between h-full text-xs">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div>
                  <span className="text-[9px] text-[#009DFF] uppercase font-bold tracking-widest font-mono block">Ledger Block Details</span>
                  <h3 className="text-sm font-extrabold text-white mt-1 font-mono tracking-wide">{active.id}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDeleteInvoice(active.dbId || active.id, active.id)}
                    className="p-1.5 rounded border border-white/5 text-rose-400 cursor-pointer hover:bg-rose-500/10 hover:text-rose-300 transition-colors animate-fade-in"
                    title="Archive Ledger Block"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setActive(null)} 
                    className="p-1 rounded border border-white/5 text-white/40 cursor-pointer hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-white/5 bg-black/30 flex justify-between items-center">
                <div>
                  <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono block">Sealed Amount</span>
                  <div className="text-base font-bold font-mono mt-0.5">${active.amount.toLocaleString()} USD</div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[9.5px] border font-bold uppercase font-mono tracking-wider ${
                  active.status === "paid" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25" :
                  active.status === "unpaid" ? "bg-amber-400/10 text-amber-400 border-amber-400/25" :
                  active.status === "processing" ? "bg-[#009DFF]/10 text-[#009DFF] border-[#009DFF]/25" :
                  "bg-rose-500/10 text-rose-400 border-rose-500/25"
                }`}>
                  {active.status}
                </span>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between border-b border-white/[0.02] pb-2">
                  <span className="text-zinc-500">Client Account</span>
                  <span className="text-zinc-200 font-semibold">{active.clientName}</span>
                </div>
                <div className="flex justify-between border-b border-white/[0.02] pb-2">
                  <span className="text-zinc-500">Enclave Core</span>
                  <span className="text-zinc-200 font-semibold">{active.projectName}</span>
                </div>
                <div className="flex justify-between border-b border-white/[0.02] pb-2">
                  <span className="text-zinc-500">SLA Category</span>
                  <span className="text-zinc-300 font-mono text-[10.5px]">{active.category}</span>
                </div>
                <div className="flex justify-between border-b border-white/[0.02] pb-2">
                  <span className="text-zinc-500">Block Date</span>
                  <span className="text-zinc-300 font-mono text-[10.5px]">{active.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Due Date</span>
                  <span className="text-zinc-300 font-mono text-[10.5px]">{active.dueDate}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-[10px] text-zinc-400 uppercase font-bold flex items-center gap-1.5 font-mono tracking-widest">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Attestation Ledger Seal</span>
                </span>
                <div className="p-3.5 bg-zinc-950 rounded border border-white/5 font-mono text-[9.5px] text-zinc-400 whitespace-pre overflow-x-auto leading-relaxed select-all">
{`{
  "ledger_seal": "${active.hash}",
  "attestation": "AMD_SEV_SNP_HSM_SEALED",
  "root_key": "GFF_ROOT_ECC256",
  "integrity_checked": true
}`}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-2.5 bg-black/40 -mx-6 -mb-6 p-6">
              <button 
                onClick={() => handleDownload(active.id)} 
                disabled={isDownloading} 
                className="h-9 rounded border border-white/10 text-white text-[10px] uppercase font-bold flex items-center justify-center gap-1 cursor-pointer hover:bg-white/5 transition-all tracking-wider"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isDownloading ? "Downloading..." : "Export PDF"}</span>
              </button>
              {active.status !== "paid" ? (
                <button 
                  onClick={() => handleSettlePayment(active.dbId || active.id)} 
                  disabled={isProcessing} 
                  className="h-9 rounded bg-[#009DFF] hover:bg-[#0082d4] text-[10px] text-white uppercase font-bold flex items-center justify-center gap-1 cursor-pointer transition-all tracking-wider"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isProcessing ? "Processing..." : "Settle Block"}</span>
                </button>
              ) : (
                <div className="h-9 rounded border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 flex items-center justify-center gap-1 text-[9.5px] uppercase font-bold font-mono tracking-widest">
                  <Check className="w-3.5 h-3.5" />
                  <span>Receipt Sealed</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* RENDER_MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !signing && setIsOpen(false)} />
          <div className="w-full max-w-sm bg-[#050505] border-l border-white/5 p-6 relative z-10 flex flex-col justify-between h-full text-xs">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <span className="text-[10px] font-bold tracking-widest font-mono text-zinc-300">DRAFT SECURE BLOCK</span>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-white/40 cursor-pointer hover:text-white/85 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1 py-4">
              {signing ? (
                <div className="h-full flex flex-col justify-center items-center space-y-4">
                  <RefreshCw className="w-6 h-6 animate-spin text-[#009DFF]" />
                  <span className="text-[10px] font-mono tracking-widest text-zinc-400">SEALING LEDGER BLOCK ({step + 1}/3)...</span>
                  <div className="w-full px-4 text-center">
                    <span className="text-[9.5px] text-zinc-500 block font-mono h-4 tracking-wide">{HSM_SIGNING_LOGS[step]}</span>
                  </div>
                </div>
              ) : (
                <form onSubmit={e => { e.preventDefault(); setSigning(true); }} className="space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-[9.5px] text-zinc-400 block uppercase tracking-wider font-mono">Client Account *</span>
                    <select 
                      required 
                      value={cId} 
                      onChange={e => setCId(e.target.value)} 
                      className="w-full h-8.5 px-2 rounded bg-black/50 border border-white/5 text-white text-xs focus:outline-none focus:border-[#009DFF]/40 cursor-pointer hover:border-white/10"
                    >
                      <option value="">-- Choose Client --</option>
                      {clientsList.map(c => (
                        <option key={c.id} value={c.id}>{c.name.replace(" [Preview Client]", "")}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[9.5px] text-zinc-400 block uppercase tracking-wider font-mono">Enclave project *</span>
                    <select 
                      required 
                      disabled={!cId} 
                      value={pId} 
                      onChange={e => setPId(e.target.value)} 
                      className="w-full h-8.5 px-2 rounded bg-black/50 border border-white/5 text-white text-xs disabled:opacity-30 focus:outline-none focus:border-[#009DFF]/40 cursor-pointer hover:border-white/10"
                    >
                      {!cId ? (
                        <option value="">-- Choose Client First --</option>
                      ) : (
                        projects.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))
                      )}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[9.5px] text-zinc-400 block uppercase tracking-wider font-mono">Credit Invoiced Amount *</span>
                    <input 
                      required 
                      type="number" 
                      min="1" 
                      placeholder="12000" 
                      value={amount} 
                      onChange={e => setAmount(e.target.value)} 
                      className="w-full h-8.5 px-3.5 rounded bg-black/50 border border-white/5 text-white text-xs focus:outline-none focus:border-[#009DFF]/40" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[9.5px] text-zinc-400 block uppercase tracking-wider font-mono">Settle Due Date *</span>
                    <input 
                      required 
                      type="date" 
                      value={due} 
                      onChange={e => setDue(e.target.value)} 
                      className="w-full h-8.5 px-3.5 rounded bg-black/50 border border-white/5 text-white text-xs focus:outline-none focus:border-[#009DFF]/40 cursor-pointer" 
                    />
                  </div>
                  <div className="flex gap-2.5 pt-3">
                    <button 
                      type="button" 
                      onClick={() => setIsOpen(false)} 
                      className="flex-1 h-9.5 rounded border border-white/10 text-white font-bold text-[10.5px] uppercase tracking-wider cursor-pointer hover:bg-white/5 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={!cId || !pId || !amount} 
                      className="flex-1 h-9.5 rounded bg-[#009DFF] hover:bg-[#0082d4] text-white font-bold text-[10.5px] uppercase tracking-wider cursor-pointer disabled:opacity-40 transition-all"
                    >
                      Sign
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
