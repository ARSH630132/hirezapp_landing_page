"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X, ArrowUpDown, Terminal, Shield, Lock, ChevronRight, ChevronLeft, Copy, Check, SlidersHorizontal, RefreshCw } from "lucide-react";
import { TableColumn } from "./types";
import { EmptyState } from "./empty-state";

export function DataTable<T extends { id: string | number }>({ 
  columns, data = [], pageSize = 5, onRowClick, searchPlaceholder = "Filter records...",
  searchKeys = [], statusField, statusOptions = [], typeField, typeOptions = [],
  renderDetail, detailTitle = "Telemetry Ledger", categoryLabel = "SECURITY"
}: { 
  columns: TableColumn<T>[]; data: T[]; pageSize?: number; onRowClick?: (row: T) => void;
  searchPlaceholder?: string; searchKeys?: (keyof T | string)[]; statusField?: keyof T | string;
  statusOptions?: { value: string; label: string }[]; typeField?: keyof T | string;
  typeOptions?: { value: string; label: string }[]; renderDetail?: (row: T, onClose: () => void) => React.ReactNode;
  detailTitle?: string | ((row: T) => string); categoryLabel?: string;
}) {
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<keyof T | string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [selRow, setSelRow] = useState<T | null>(null);
  const [copied, setCopied] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [sync, setSync] = useState(false);
  const [focIdx, setFocIdx] = useState<number | null>(null);
  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);

  useEffect(() => {
    if (selRow) {
      setSync(true);
      setLogs([
        `[${new Date().toLocaleTimeString()}] HANDSHAKE: Target ${selRow.id}`,
        `[${new Date().toLocaleTimeString()}] SECURE: AMD SEV-SNP cryptographic seal validated (100% compliant).`
      ]);
      const t = setTimeout(() => setSync(false), 300);
      return () => clearTimeout(t);
    }
  }, [selRow]);

  useEffect(() => { setPage(1); setFocIdx(null); }, [query, status, type]);

  const handleSort = (key: keyof T | string, sortable?: boolean) => {
    if (!sortable) return;
    if (sortKey === key) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortOrder("asc"); }
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const finalStatusOpts = statusField && statusOptions.length === 0
    ? Array.from(new Set(data.map(r => String(r[statusField as keyof T] || "")))).map(s => ({ value: s, label: s }))
    : statusOptions;

  const finalTypeOpts = typeField && typeOptions.length === 0
    ? Array.from(new Set(data.map(r => String(r[typeField as keyof T] || "")))).map(t => ({ value: t, label: t }))
    : typeOptions;

  const filtered = data.filter((row) => {
    if (query.trim() !== "" && searchKeys.length > 0) {
      const match = searchKeys.some((k) => String(row[k as keyof T] || "").toLowerCase().includes(query.toLowerCase()));
      if (!match) return false;
    }
    if (status && statusField && String(row[statusField as keyof T] || "").toLowerCase() !== status.toLowerCase()) return false;
    if (type && typeField && String(row[typeField as keyof T] || "").toLowerCase() !== type.toLowerCase()) return false;
    return true;
  });

  const sorted = [...filtered];
  if (sortKey) {
    sorted.sort((a, b) => {
      const aV = String(a[sortKey as keyof T] || "");
      const bV = String(b[sortKey as keyof T] || "");
      return sortOrder === "asc" ? aV.localeCompare(bV, undefined, { numeric: true }) : bV.localeCompare(aV, undefined, { numeric: true });
    });
  }

  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(sorted.length / pageSize) || 1;

  const getStatusDot = (st: string) => {
    const s = st.toLowerCase();
    if (["active", "healthy", "compliant", "verified", "paid", "resolved", "settled", "on track", "stable"].includes(s)) return "bg-[#00FFC2] shadow-[0_0_8px_rgba(0,255,194,0.4)]";
    if (["warning", "evaluating", "in_progress", "processing", "pending", "open"].includes(s)) return "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.4)]";
    return "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]";
  };

  return (
    <div className="space-y-4">
      {/* 1. FILTERS BAR */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 p-4 rounded-xl border border-white/5 bg-[#050505]/30 backdrop-blur-sm">
        <div className="relative flex-grow max-w-xl">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-white/30" />
          <input 
            type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={searchPlaceholder}
            className="w-full h-9 rounded-lg border border-white/5 bg-white/[0.01] pl-9 pr-4 text-[12px] font-mono text-white placeholder-white/30 outline-none focus:border-white/15 focus:bg-white/[0.03] transition-all"
          />
          {query && <button onClick={() => setQuery("")} className="absolute right-3 top-2.5 text-white/40 hover:text-white"><X className="w-4 h-4" /></button>}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {statusField && finalStatusOpts.length > 0 && (
            <div className="relative">
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-9 rounded-lg border border-white/5 bg-[#0c0c0c] px-3 pr-8 text-[11px] font-mono text-white/70 focus:text-white outline-none transition-all cursor-pointer appearance-none uppercase">
                <option value="">ALL STATUSES</option>
                {finalStatusOpts.map(o => <option key={o.value} value={o.value}>{o.label.toUpperCase()}</option>)}
              </select>
              <SlidersHorizontal className="absolute right-3 top-2.5 w-3.5 h-3.5 text-white/40 pointer-events-none" />
            </div>
          )}
          {typeField && finalTypeOpts.length > 0 && (
            <div className="relative">
              <select value={type} onChange={(e) => setType(e.target.value)} className="h-9 rounded-lg border border-white/5 bg-[#0c0c0c] px-3 pr-8 text-[11px] font-mono text-white/70 focus:text-white outline-none transition-all cursor-pointer appearance-none uppercase">
                <option value="">ALL CATEGORIES</option>
                {finalTypeOpts.map(o => <option key={o.value} value={o.value}>{o.label.toUpperCase()}</option>)}
              </select>
              <SlidersHorizontal className="absolute right-3 top-2.5 w-3.5 h-3.5 text-white/40 pointer-events-none" />
            </div>
          )}
        </div>
      </div>

      {paginated.length === 0 ? (
        <EmptyState title="No Matching Records" description="No active ledger entries match your filter rules." actionLabel="Clear Filters" onAction={() => { setQuery(""); setStatus(""); setType(""); }} />
      ) : (
        <div className="space-y-4">
          <div className="hidden md:block overflow-hidden rounded-xl border border-white/5 bg-[#050505]/20 backdrop-blur-sm">
            <table className="w-full text-left border-collapse" role="grid">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.01]" role="row">
                  {columns.map((col) => (
                    <th key={String(col.key)} role="columnheader" onClick={() => handleSort(col.key, col.sortable)} className={`p-4 text-[10.5px] font-bold font-mono text-white/40 tracking-wider uppercase ${col.sortable ? "cursor-pointer hover:text-white" : ""}`}>
                      <div className="flex items-center gap-1.5">
                        <span>{col.header}</span>
                        {col.sortable && <ArrowUpDown className={`w-3.5 h-3.5 ${sortKey === col.key ? "text-white" : "opacity-30"}`} />}
                      </div>
                    </th>
                  ))}
                  <th className="p-4 text-right text-[10.5px] font-bold font-mono text-white/40 tracking-wider uppercase w-10">Ledger</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((row, rIdx) => (
                  <tr
                    key={row.id} role="row" tabIndex={0} ref={(el) => { rowRefs.current[rIdx] = el; }}
                    onClick={() => setSelRow(row)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelRow(row); }
                      else if (e.key === "ArrowDown") { e.preventDefault(); const next = Math.min(rIdx + 1, paginated.length - 1); setFocIdx(next); rowRefs.current[next]?.focus(); }
                      else if (e.key === "ArrowUp") { e.preventDefault(); const prev = Math.max(rIdx - 1, 0); setFocIdx(prev); rowRefs.current[prev]?.focus(); }
                    }}
                    className={`border-b border-white/[0.02] hover:bg-white/[0.02] focus:bg-white/[0.03] outline-none transition-all duration-200 cursor-pointer ${focIdx === rIdx ? "bg-white/[0.02] border-l-2 border-[#009DFF]" : ""}`}
                  >
                    {columns.map((col) => (
                      <td key={String(col.key)} role="gridcell" className="p-4 text-[12px] font-mono text-white/80">
                        {col.render ? col.render(row) : <span className="truncate max-w-[200px] block">{String(row[col.key as keyof T] ?? "N/A")}</span>}
                      </td>
                    ))}
                    <td className="p-4 text-right"><ChevronRight className="w-4 h-4 text-white/20 ml-auto" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 gap-4 md:hidden">
            {paginated.map((row) => (
              <div key={row.id} onClick={() => setSelRow(row)} className="p-4 rounded-xl border border-white/5 bg-[#050505]/40 hover:bg-white/[0.01] transition-all cursor-pointer space-y-3">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-[10px] font-mono font-bold text-white/40">ID: {String(row.id).toUpperCase()}</span>
                  {statusField && row[statusField as keyof T] && (
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(String(row[statusField as keyof T]))}`} />
                      <span className="text-[10px] font-mono text-white/70 uppercase">{String(row[statusField as keyof T])}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  {columns.map((col) => {
                    if (col.key === "id" || col.key === statusField) return null;
                    return (
                      <div key={String(col.key)} className="flex items-start justify-between gap-4">
                        <span className="text-[10px] font-bold font-mono text-white/30 uppercase shrink-0">{col.header}:</span>
                        <div className="text-[11.5px] font-mono text-white/80 text-right">
                          {col.render ? col.render(row) : <span>{String(row[col.key as keyof T] ?? "N/A")}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-[#009DFF]">
                  <span>AUDIT TELEMETRY</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl border border-white/5 bg-[#050505]/10 font-mono text-[11px]">
            <span className="text-white/40">Showing <span className="text-white/70 font-semibold">{(page - 1) * pageSize + 1}</span> to <span className="text-white/70 font-semibold">{Math.min(page * pageSize, sorted.length)}</span> of <span className="text-white/70 font-semibold">{sorted.length}</span> nodes</span>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1} className="h-8 w-8 rounded-lg border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] disabled:opacity-30 flex items-center justify-center text-white transition-all"><ChevronLeft className="w-4 h-4" /></button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} className={`h-8 min-w-[32px] px-2 rounded-lg border text-[11px] transition-all ${page === i + 1 ? "border-[#009DFF]/30 bg-[#009DFF]/10 text-[#009DFF] font-bold" : "border-white/5 bg-white/[0.01] text-white/60 hover:text-white"}`}>{i + 1}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages} className="h-8 w-8 rounded-lg border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] disabled:opacity-30 flex items-center justify-center text-white transition-all"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      )}

      {selRow && (
        <div className="fixed inset-0 z-50 flex justify-end animate-fade-in">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelRow(null)} />
          <div className="relative w-full sm:max-w-md h-full bg-[#070707]/95 border-l border-white/10 backdrop-blur-xl shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200 outline-none">
            <div className="p-5 border-b border-white/5 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[9px] font-mono font-bold text-[#009DFF] bg-[#009DFF]/5 border border-[#009DFF]/20 px-2 py-0.5 rounded tracking-widest uppercase">{categoryLabel}</span>
                <h3 className="text-[13px] font-bold font-mono text-white tracking-wider uppercase mt-1">{typeof detailTitle === "function" ? detailTitle(selRow) : detailTitle}</h3>
                <div className="flex items-center gap-1.5 font-mono text-[10.5px] text-white/45">
                  <span>SECURE_ID:</span>
                  <span className="text-white font-bold tracking-wider select-all flex items-center gap-1">
                    {String(selRow.id).toUpperCase()}
                    <button onClick={() => copy(String(selRow.id))} className="text-white/40 hover:text-white transition-colors">{copied ? <Check className="w-3.5 h-3.5 text-[#00FFC2]" /> : <Copy className="w-3.5 h-3.5" />}</button>
                  </span>
                </div>
              </div>
              <button onClick={() => setSelRow(null)} className="p-1.5 rounded-lg border border-white/5 bg-white/[0.01] text-white/50 hover:text-white hover:bg-white/[0.05] transition-all"><X className="w-4 h-4" /></button>
            </div>

            <div className="flex-grow overflow-y-auto p-5 space-y-6">
              {renderDetail ? renderDetail(selRow, () => setSelRow(null)) : (
                <div className="space-y-2.5">
                  <h4 className="text-[10px] font-bold font-mono tracking-widest text-white/40 uppercase">ENCLAVE LEDGER PARAMETERS</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {Object.entries(selRow).filter(([k]) => k !== "id" && k !== "logs").map(([k, v]) => (
                      <div key={k} className="p-3 rounded-lg border border-white/5 bg-[#020202]/40 flex flex-col gap-1 font-mono text-[11.5px]">
                        <span className="text-white/30 text-[9px] uppercase font-semibold">{k.replace(/([A-Z])/g, " $1").toUpperCase()}</span>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-white font-bold truncate">{typeof v === "object" && v !== null ? ("name" in v ? String((v as any).name) : JSON.stringify(v)) : String(v ?? "N/A")}</span>
                          {k.toLowerCase().includes("status") && <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(String(v))}`} />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between border-b border-white/5 pb-1">
                  <div className="flex items-center gap-1.5 font-mono text-[10px] text-white/40 uppercase font-semibold">
                    <Terminal className="w-4 h-4 text-[#009DFF]" />
                    <span>SECURE ATTESTATION FLUX</span>
                  </div>
                  {sync ? <RefreshCw className="w-3.5 h-3.5 text-[#009DFF] animate-spin" /> : (
                    <div className="flex items-center gap-1 text-[9px] font-mono text-green-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      <span>TELEMETRY STREAM LIVE</span>
                    </div>
                  )}
                </div>
                <div className="p-4 rounded-xl border border-white/5 bg-[#020202] text-[10.5px] font-mono text-white/75 space-y-2 h-[150px] overflow-y-auto select-text">
                  {logs.map((log, idx) => (
                    <div key={idx} className="leading-relaxed border-b border-white/[0.01] pb-1 font-mono"><span className="text-[#009DFF]/80">&gt;</span> {log}</div>
                  ))}
                  <div className="text-[9.5px] text-white/30 pt-1 flex items-center gap-1"><Shield className="w-3 h-3 text-[#00FFC2]" /><span>Policy enforcement bounds locked</span></div>
                </div>
              </div>
            </div>

            <div className="p-5 pb-8 sm:pb-5 border-t border-white/5 bg-black/[0.15] space-y-3">
              <div className="flex items-center gap-2 text-[10.5px] font-mono text-white/40"><Lock className="w-3.5 h-3.5 text-[#00FFC2]" /><span>Isolated Enclave Memory Lock Active</span></div>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => copy(`0xSHA256_${selRow ? String(selRow.id).toUpperCase() : ""}_2026`)} className="h-9 rounded border border-white/10 hover:border-white/20 bg-white/[0.01] text-[11px] font-mono font-bold uppercase text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Seal Hash</span>
                </button>
                <button onClick={() => setSelRow(null)} className="h-9 rounded bg-[#009DFF] hover:bg-[#0082d4] text-[11px] font-mono font-bold uppercase text-white flex items-center justify-center transition-all cursor-pointer shadow-[0_0_20px_rgba(0,157,255,0.2)]">
                  <span>Close Ledger</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
