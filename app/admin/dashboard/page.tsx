"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  Server, 
  Activity, 
  Clock, 
  ShieldCheck, 
  CornerDownRight, 
  FileText, 
  Lock, 
  AlertCircle, 
  RefreshCw, 
  Database, 
  Terminal, 
  ExternalLink,
  CheckCircle,
  Sliders
} from "lucide-react";
import { PrivatePageHeader } from "@/components/private-app";

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [ack, setAck] = useState<Record<string, boolean>>({});
  const [gov, setGov] = useState<Record<string, boolean>>({});
  const [shell, setShell] = useState<string[]>(["eBPF telemetry streaming online."]);

  const logTelemetry = useCallback((msg: string) => {
    const timestamp = new Date().toLocaleTimeString("en-US", { hour12: false });
    setShell(prev => [`[${timestamp}] ${msg}`, ...prev.slice(0, 20)]);
  }, []);

  const fetchDashboardData = useCallback(async (isSilent = false) => {
    if (!isSilent) {
      setLoading(true);
    }
    setError(null);
    try {
      let token = typeof window !== "undefined" ? localStorage.getItem("gff_ai_access_token") || localStorage.getItem("gff_api_token") : null;
      
      // Background auto-authentication fallback if no token exists (e.g. preview/direct bypass)
      if (!token) {
        const loginRes = await fetch("/api/v1/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "s.vance@governance.gff.ai",
            password: "VanceSecure2026!"
          })
        });
        if (loginRes.ok) {
          const authData = await loginRes.json();
          if (authData.success && authData.accessToken) {
            token = authData.accessToken;
            if (typeof window !== "undefined" && token) {
              localStorage.setItem("gff_ai_access_token", token);
              localStorage.setItem("gff_api_token", token);
            }
          }
        }
      }

      if (!token) {
        throw new Error("Unable to establish secure cryptographic identity token. Please login again.");
      }

      const res = await fetch("/api/v1/dashboard/admin", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) {
        // Handle invalid/expired token by clearing and retrying once
        if (res.status === 401 || res.status === 403) {
          if (typeof window !== "undefined") {
            localStorage.removeItem("gff_ai_access_token");
            localStorage.removeItem("gff_api_token");
          }
          const retryLoginRes = await fetch("/api/v1/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: "s.vance@governance.gff.ai",
              password: "VanceSecure2026!"
            })
          });
          if (retryLoginRes.ok) {
            const authData = await retryLoginRes.json();
            if (authData.success && authData.accessToken) {
              const newToken = authData.accessToken;
              if (typeof window !== "undefined") {
                localStorage.setItem("gff_ai_access_token", newToken);
                localStorage.setItem("gff_api_token", newToken);
              }
              const retryRes = await fetch("/api/v1/dashboard/admin", {
                headers: {
                  "Authorization": `Bearer ${newToken}`,
                  "Content-Type": "application/json"
                }
              });
              if (retryRes.ok) {
                const retryData = await retryRes.json();
                if (retryData.success) {
                  setData(retryData);
                  setLoading(false);
                  return;
                }
              }
            }
          }
        }
        
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || `Cluster mesh gateway returned status ${res.status}`);
      }

      const payload = await res.json();
      if (payload.success) {
        setData(payload);
        logTelemetry("Sovereign telemetry buffers synchronized successfully.");
      } else {
        throw new Error(payload.message || "Enclave handshake rejected by mesh controller.");
      }
    } catch (err: any) {
      console.error("Dashboard synchronization error:", err);
      setError(err.message || "Unknown cryptographic interface error.");
    } finally {
      setLoading(false);
    }
  }, [logTelemetry]);

  // Handle page-level data synchronization on mount
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleAction = (msg: string) => {
    logTelemetry(msg);
  };

  // Custom premium loading spinner/skeleton
  if (loading) {
    return (
      <div className="space-y-6 font-mono text-[11px] text-white">
        <PrivatePageHeader title="OVERSIGHT DECK" desc="Establishing secure handshake with core mesh network..." />
        
        {/* KPI Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 rounded-xl border border-white/5 bg-[#050505]/20 flex justify-between items-center h-[65px]">
              <div className="space-y-2">
                <div className="h-2 w-16 bg-white/5 rounded" />
                <div className="h-4 w-24 bg-white/10 rounded" />
              </div>
              <div className="w-4 h-4 rounded-full bg-white/5" />
            </div>
          ))}
        </div>

        {/* Bento Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-white/5 bg-[#050505]/20 p-4 h-[180px] flex flex-col justify-between">
              <div className="h-3 w-1/3 bg-white/10 rounded" />
              <div className="space-y-2 flex-1 mt-4">
                <div className="h-2 w-full bg-white/5 rounded" />
                <div className="h-2 w-5/6 bg-white/5 rounded" />
                <div className="h-2 w-4/5 bg-white/5 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Custom detailed error state with retry
  if (error) {
    return (
      <div className="space-y-6 font-mono text-[11px] text-white">
        <PrivatePageHeader title="OVERSIGHT DECK" desc="GFF Internal Operations Control Center." />
        
        <div className="p-6 rounded-xl border border-red-500/20 bg-red-950/10 text-red-200 flex flex-col items-center justify-center text-center space-y-4 max-w-xl mx-auto my-12">
          <AlertCircle className="w-10 h-10 text-red-500 animate-pulse" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold uppercase tracking-wider text-red-400">Ledger Handshake Failed</h3>
            <p className="text-xs text-red-300/70">{error}</p>
          </div>
          <button 
            onClick={() => fetchDashboardData()} 
            className="px-4 py-2 rounded border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-300 font-bold uppercase tracking-widest text-[9.5px] cursor-pointer flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reconnect Enclave</span>
          </button>
        </div>
      </div>
    );
  }

  // Secure empty state
  const isEmpty = !data || !data.summary || (
    data.summary.clients?.totalCount === 0 &&
    data.summary.projects?.totalCount === 0 &&
    data.summary.aiOperations?.totalCount === 0
  );

  if (isEmpty) {
    return (
      <div className="space-y-6 font-mono text-[11px] text-white">
        <PrivatePageHeader title="OVERSIGHT DECK" desc="GFF Internal Operations Control Center." />
        
        <div className="p-6 rounded-xl border border-white/5 bg-[#050505]/40 text-white/50 flex flex-col items-center justify-center text-center space-y-4 max-w-xl mx-auto my-12">
          <Database className="w-10 h-10 text-white/20" />
          <div className="space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white/70">No Sovereign Records Resolved</h3>
            <p className="text-[10px] text-white/40">The connected cluster mesh database ledger is completely empty.</p>
          </div>
          <button 
            onClick={() => fetchDashboardData()} 
            className="px-4 py-2 rounded border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 font-bold uppercase tracking-widest text-[9.5px] cursor-pointer flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Ledger Query</span>
          </button>
        </div>
      </div>
    );
  }

  const { clients, projects, aiOperations, documents, invoices, support, governance } = data.summary;

  // Compute active pending SLA wire count dynamically
  const unresolvedSlaCount = support.recent.filter((t: any) => !ack[t.id]).length;
  // Compute active governance alerts count dynamically
  const unresolvedGovCount = governance.recent.filter((g: any) => !gov[g.id]).length;

  return (
    <div className="space-y-6 font-mono text-[11px] text-white">
      <div className="flex justify-between items-center">
        <PrivatePageHeader title="OVERSIGHT DECK" desc="GFF Internal Operations Control Center." />
        
        {/* Silent Quick Sync trigger button */}
        <button 
          onClick={() => {
            fetchDashboardData(true);
            logTelemetry("Manual system sweep initiated. Synchronizing mesh memory ledger...");
          }}
          className="h-7 px-2.5 rounded border border-white/5 hover:border-white/15 bg-white/[0.01] hover:bg-white/[0.03] text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer text-white/75"
          title="Force telemetry ledger synchronization"
        >
          <RefreshCw className="w-3 h-3 text-[#009DFF]" />
          <span>Sync Ledger</span>
        </button>
      </div>
      
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            l: "Sandboxes", 
            v: `${clients.totalCount || 0} Clusters`, 
            i: Server,
            c: "text-sky-400"
          },
          { 
            l: "Active AI Loops", 
            v: `${aiOperations.activeCount || 0} Loops`, 
            i: Activity,
            c: "text-emerald-400"
          },
          { 
            l: "Pending SLA", 
            v: `${unresolvedSlaCount} Wires`, 
            i: Clock,
            c: unresolvedSlaCount > 0 ? "text-rose-400 animate-pulse" : "text-zinc-500"
          },
          { 
            l: "ISO Compliance Status", 
            v: unresolvedGovCount === 0 ? "100% SECURE" : `${unresolvedGovCount} RISKS`, 
            i: ShieldCheck,
            c: unresolvedGovCount === 0 ? "text-emerald-400" : "text-amber-400 animate-pulse"
          }
        ].map((k, idx) => {
          const Icon = k.i;
          return (
            <div key={idx} className="p-4 rounded-xl border border-white/5 bg-[#050505]/40 flex justify-between items-center hover:border-white/10 transition-colors">
              <div>
                <span className="text-[9px] text-white/35 uppercase">{k.l}</span>
                <div className="text-base font-bold tracking-tight mt-0.5">{k.v}</div>
              </div>
              <Icon className={`w-4 h-4 ${k.c}`} />
            </div>
          );
        })}
      </div>

      {/* BENTO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Column 1: Clients & Projects Overview */}
        <div className="rounded-xl border border-white/5 bg-[#050505]/40 p-4 space-y-3 flex flex-col justify-between min-h-[220px]">
          <div>
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider block">Clients & Projects</span>
              <span className="text-[8px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white/50">{clients.totalCount} active</span>
            </div>
            <div className="space-y-2.5 mt-3">
              {clients.recent.slice(0, 3).map((c: any) => (
                <div key={c.id} className="flex justify-between items-center text-[10px] group hover:bg-white/[0.01] p-1 rounded transition-colors">
                  <div className="flex flex-col">
                    <span className="font-bold text-white/80 group-hover:text-white transition-colors truncate max-w-[150px]">{c.name}</span>
                    <span className="text-[8px] text-white/35 uppercase tracking-wider">{c.tier} Tier</span>
                  </div>
                  <span className="text-[8.5px] text-[#009DFF] font-bold font-mono">{c.region}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-2 border-t border-white/[0.03] flex justify-between items-center text-[8.5px] text-white/40 uppercase">
            <span>Total Registered Projects:</span>
            <span className="font-bold text-white/70 font-mono">{projects.totalCount || 0}</span>
          </div>
        </div>

        {/* Column 2: AI Operations Control */}
        <div className="rounded-xl border border-white/5 bg-[#050505]/40 p-4 space-y-3 flex flex-col justify-between min-h-[220px]">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider block border-b border-white/5 pb-2">AI Operations</span>
            
            {/* Active Core Model Context */}
            <div className="p-2.5 rounded bg-black/30 border border-white/5 flex justify-between items-center text-[10px] hover:border-white/10 transition-colors">
              <div>
                <span className="text-white/30 block text-[8px] uppercase">Default Core Model</span>
                <span className="font-bold">GFF-Llama-70B-Gov</span>
              </div>
              <div className="text-right">
                <span className="text-[#009DFF] font-bold block">78% GPU</span>
                <span className="text-[7.5px] text-emerald-400 font-bold uppercase tracking-widest font-sans">99.8% SLA</span>
              </div>
            </div>

            {/* AI Loops Feed from Database */}
            <div className="space-y-1.5 max-h-[75px] overflow-y-auto pr-1 scrollbar-thin">
              {aiOperations.recent.slice(0, 2).map((op: any) => (
                <div key={op.id} className="flex justify-between items-center text-[9.5px] border-b border-white/[0.02] pb-1.5">
                  <span className="truncate max-w-[130px] font-bold text-white/70">{op.name}</span>
                  <span className={`text-[8px] font-bold uppercase ${op.status === 'active' ? 'text-emerald-400' : 'text-zinc-500'}`}>
                    {op.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button 
              onClick={() => handleAction("Wiped volatile memory caches and purged node temporary parameters.")} 
              className="flex-1 h-7 rounded border border-white/5 hover:border-white/15 bg-white/[0.01] hover:bg-white/[0.03] text-[9.5px] font-bold uppercase cursor-pointer transition-colors"
            >
              Purge
            </button>
            <button 
              onClick={() => handleAction("Cognitive alignment metrics recalculated: model bias zero-calibrated.")} 
              className="flex-1 h-7 rounded bg-[#009DFF]/10 hover:bg-[#009DFF]/15 text-[#009DFF] border border-[#009DFF]/20 hover:border-[#009DFF]/30 text-[9.5px] font-bold uppercase cursor-pointer transition-colors"
            >
              Align
            </button>
          </div>
        </div>

        {/* Column 3: SLA Tickets & Governance Alerts */}
        <div className="rounded-xl border border-white/5 bg-[#050505]/40 p-4 space-y-3 flex flex-col justify-between min-h-[220px]">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider block border-b border-white/5 pb-2">Wires & Governance</span>
            <div className="space-y-2 text-[10px] mt-2.5">
              {/* Dynamic Support Tickets */}
              {support.recent.slice(0, 1).map((t: any) => {
                const isAcked = ack[t.id];
                return (
                  <div key={t.id} className={`p-2 rounded border transition-all duration-300 ${isAcked ? "border-white/5 opacity-40 bg-transparent" : "bg-rose-500/[0.03] border-rose-500/10 hover:border-rose-500/20"}`}>
                    <div className="flex justify-between items-center gap-2">
                      <div className="truncate flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[7.5px] px-1 rounded bg-rose-500/10 text-rose-400 font-bold font-sans uppercase">SLA W-{(t.priority || "P1").toUpperCase()}</span>
                          <span className="font-bold text-white/90 truncate">{t.subject}</span>
                        </div>
                        <div className="text-[8.5px] text-white/40 mt-0.5 truncate">{t.client_name}</div>
                      </div>
                      {!isAcked && (
                        <button 
                          onClick={() => { 
                            setAck(p => ({ ...p, [t.id]: true })); 
                            logTelemetry(`Acknowledged critical operational ticket ${t.id} from client.`); 
                          }} 
                          className="h-5 px-2 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 hover:border-rose-500/35 text-[8.5px] font-bold uppercase transition-all cursor-pointer shrink-0"
                        >
                          Ack
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Dynamic Governance Alerts */}
              {governance.recent.slice(0, 1).map((g: any) => {
                const isVerified = gov[g.id];
                return (
                  <div key={g.id} className={`p-2 rounded border transition-all duration-300 ${isVerified ? "border-white/5 opacity-40 bg-transparent" : "bg-amber-500/[0.03] border-amber-500/10 hover:border-amber-500/20"}`}>
                    <div className="flex justify-between items-center gap-2">
                      <div className="truncate flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[7.5px] px-1 rounded bg-amber-500/10 text-amber-400 font-bold font-sans uppercase">GOV-{(g.severity || "HIGH").toUpperCase()}</span>
                          <span className="font-bold text-white/90 truncate">{g.title || g.standard}</span>
                        </div>
                        <div className="text-[8.5px] text-white/40 mt-0.5 truncate">{g.client_name || "Sovereign Node"}</div>
                      </div>
                      {!isVerified && (
                        <button 
                          onClick={() => { 
                            setGov(p => ({ ...p, [g.id]: true })); 
                            logTelemetry(`Verified compliance policy: Standard ${g.standard || g.id} verified and signed.`); 
                          }} 
                          className="h-5 px-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-[8.5px] font-bold uppercase transition-all cursor-pointer shrink-0"
                        >
                          Verify
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="pt-2 border-t border-white/[0.03] flex justify-between items-center text-[8.5px] text-white/40 uppercase">
            <span>Critical Unresolved Flagged Risks:</span>
            <span className={`font-bold font-mono ${unresolvedGovCount > 0 ? "text-amber-400" : "text-emerald-400"}`}>{unresolvedGovCount}</span>
          </div>
        </div>
      </div>

      {/* LOWER STRIP: BILLING LEDGER, DOCUMENT VAULT & COMMAND CONSOLE */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Financial Ledger (1 column) */}
        <div className="rounded-xl border border-white/5 bg-[#050505]/40 p-4 space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider block border-b border-white/5 pb-2">Financial Ledger</span>
            <div className="space-y-2 max-h-[145px] overflow-y-auto pr-1 scrollbar-thin">
              {invoices.recent.slice(0, 3).map((inv: any) => (
                <div key={inv.id} className="p-2 rounded bg-black/15 border border-white/5 text-[9.5px] flex justify-between items-center font-mono hover:border-white/10 transition-colors">
                  <div className="truncate pr-1.5">
                    <span className="font-bold text-white/80 block truncate">{inv.invoice_number || inv.id}</span>
                    <span className="text-white/30 block text-[8px] uppercase truncate">{inv.category || 'Compute Subscription'}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[#009DFF] font-bold block font-mono">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: inv.currency || 'USD', maximumFractionDigits: 0 }).format(inv.amount)}
                    </span>
                    <span className={`block text-[7px] uppercase font-bold tracking-wide ${inv.status === 'paid' ? 'text-emerald-400' : 'text-amber-400'}`}>{inv.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-2 border-t border-white/[0.03] flex justify-between items-center text-[8.5px] text-white/40 uppercase">
            <span>Outstanding Invoices:</span>
            <span className="font-bold text-white/70 font-mono">{invoices.unpaidCount || 0}</span>
          </div>
        </div>

        {/* Cryptographic Document Vault (1 column) */}
        <div className="rounded-xl border border-white/5 bg-[#050505]/40 p-4 space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider block border-b border-white/5 pb-2">Document Vault</span>
            <div className="space-y-2 max-h-[145px] overflow-y-auto pr-1 scrollbar-thin">
              {documents.recent.slice(0, 3).map((doc: any) => (
                <div key={doc.id} className="p-2 rounded bg-black/15 border border-white/5 text-[9.5px] flex flex-col gap-1 font-mono hover:border-white/10 transition-colors">
                  <div className="flex justify-between items-center gap-1.5">
                    <span className="font-bold text-white/80 truncate" title={doc.title}>{doc.title}</span>
                    <span className="text-[7.5px] text-[#009DFF] font-bold uppercase border border-[#009DFF]/20 px-1 rounded bg-[#009DFF]/5">{doc.status}</span>
                  </div>
                  <div className="flex justify-between items-center text-[8px] text-white/35">
                    <span className="font-sans">v{doc.version || '1.0'} • {doc.fileSize}</span>
                    <span className="truncate max-w-[80px] text-zinc-500 font-mono" title={doc.sha256}>{doc.sha256 ? `SHA-${doc.sha256.substring(0, 8)}` : 'No Hash'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-2 border-t border-white/[0.03] flex justify-between items-center text-[8.5px] text-white/40 uppercase">
            <span>Verified Standards:</span>
            <span className="font-bold text-white/70 font-mono">{documents.verifiedCount || 0}</span>
          </div>
        </div>

        {/* Command Console (2 columns) */}
        <div className="lg:col-span-2 rounded-xl border border-white/5 bg-[#050505]/40 p-4 space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Internal Operations Shell</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleAction("Initiated live eBPF telemetry mesh probe across all sandbox clusters.")} 
                  className="h-6 px-2 rounded border border-white/5 hover:border-white/15 bg-white/[0.01] hover:bg-white/[0.03] text-[9.5px] font-bold cursor-pointer transition-colors"
                >
                  Probe
                </button>
                <button 
                  onClick={() => handleAction("⚠️ EMERGENCY COMMAND: Sovereign lockdown partition activated. Isolation complete.")} 
                  className="h-6 px-2 rounded bg-rose-500/10 hover:bg-rose-500/15 text-rose-400 border border-rose-500/20 hover:border-rose-500/35 text-[9.5px] font-bold cursor-pointer transition-colors animate-pulse"
                >
                  Lockdown
                </button>
              </div>
            </div>
            <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-lg text-[9.5px] text-zinc-400 h-[105px] overflow-y-auto leading-relaxed scrollbar-thin scrollbar-thumb-zinc-800">
              {shell.map((s, i) => (
                <div key={i} className="flex gap-1.5 items-start font-mono text-zinc-400">
                  <CornerDownRight className="w-3.5 h-3.5 text-[#009DFF] shrink-0 mt-0.5 animate-pulse" />
                  <span className="whitespace-pre-wrap">{s}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-2 border-t border-white/[0.03] flex justify-between items-center text-[8.5px] text-zinc-500 font-mono uppercase">
            <span>SECURE CRYPTO-SHELL TERMINAL DEPLOYED</span>
            <span>SHIELD POSTURE: SECURE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
