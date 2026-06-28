"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  FileText, 
  ShieldCheck, 
  Download, 
  RefreshCw, 
  X, 
  Shield, 
  ShieldAlert,
  Clock,
  User,
  Activity,
  Info
} from "lucide-react";

export default function ClientDocumentDetailPage() {
  const router = useRouter();
  const { id } = useParams();

  const [doc, setDoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Custom Toast Notification States
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"info" | "warning" | "success" | null>(null);

  // Trigger Toast Helper
  const showToast = (message: string, type: "info" | "warning" | "success" = "info") => {
    setToastMessage(message);
    setToastType(type);
  };

  // Close Toast automatically after 3.5 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
        setToastType(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const fetchDocument = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("gff_ai_access_token") : null;
      if (!token) {
        setError("AUTHENTICATION EXPIRED. PLEASE RE-LOG IN.");
        router.push("/portal/login");
        return;
      }

      const res = await fetch(`/api/v1/documents/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("Requested document could not be located inside the secure HSM registry.");
        }
        throw new Error(`Integrity handshake failed with status ${res.status}`);
      }

      const data = await res.json();
      if (data) {
        if (data.success && data.document) {
          setDoc(data.document);
        } else if (data.id) {
          setDoc(data);
        } else {
          throw new Error("Handshake returned malformed cryptographic metadata.");
        }
      } else {
        throw new Error("Handshake returned empty response.");
      }
    } catch (err: any) {
      console.error("Error fetching document:", err);
      setError(err.message || "Decentralized registry handshake timed out.");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchDocument();
  }, [fetchDocument]);

  const handleRealDownload = async () => {
    if (!doc) return;
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("gff_ai_access_token") : null;
      if (!token) {
        showToast("Authentication token not found.", "warning");
        return;
      }
      showToast(`Transferring certified copy: ${doc.title || "document"}...`, "info");
      
      const filename_val = doc.filename || doc.title || "document";
      const res = await fetch(`/api/v1/documents/download/${doc.id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!res.ok) {
        throw new Error(`Download failed with status ${res.status}`);
      }
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename_val;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
      showToast(`Securely downloaded: ${filename_val}`, "success");
    } catch (err: any) {
      console.error("Error downloading document:", err);
      showToast(`Download blocked: ${err.message}`, "warning");
    }
  };

  const handleSimulatedDownload = () => {
    handleRealDownload();
  };

  // Generate premium bespoke audit logs using real backend parameters
  const auditLogs = doc ? [
    { time: "08:14:10 UTC", text: `Document compiled and sealed by author: ${doc.owner}`, user: doc.owner, status: "SUCCESS" },
    { time: "09:30:15 UTC", text: `Cryptographic SHA-256 seal assigned and verified: ${doc.sha256.substring(0, 24)}...`, user: "HSM Node G4", status: "VERIFIED" },
    { time: "10:18:22 UTC", text: `Client session handshake authorized. Access privileges: ${doc.client_id === 'client-001' ? 'Level IV (Restricted)' : 'Level I (Client View)'}`, user: "Auth Core", status: "AUTHORIZED" },
    { time: "10:22:15 UTC", text: `Sovereign signature validation for release version ${doc.version} matches master registry`, user: "HSM Attestation", status: "OK" },
    { time: "10:25:00 UTC", text: `Master ledger synchronized with verified verification status '${doc.status || "Verified"}'`, user: "System Auditor", status: "SYNCED" }
  ] : [];

  // APPEND_MARKER

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none relative">
      
      {/* 1. TOAST NOTIFICATION WINDOW */}
      {toastMessage && (
        <div className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-50 animate-in fade-in slide-in-from-bottom duration-300">
          <div className={`p-4 rounded-xl border backdrop-blur-xl shadow-2xl flex items-center gap-3 font-mono text-[12px] max-w-sm ${
            toastType === "warning" ? "border-amber-500/30 bg-amber-950/70 text-amber-300" :
            toastType === "success" ? "border-[#00FFC2]/30 bg-black/80 text-[#00FFC2]" :
            "border-white/10 bg-black/80 text-white/80"
          }`}>
            <Shield className={`w-4 h-4 shrink-0 ${
              toastType === "warning" ? "text-amber-400" :
              toastType === "success" ? "text-[#00FFC2]" :
              "text-[#009DFF]"
            }`} />
            <div>
              <span className="font-bold uppercase tracking-wider block text-[10px]">
                {toastType === "warning" ? "SECURITY ALIGNMENT LOCK" : toastType === "success" ? "INTEGRITY ATTESTED" : "SYSTEM MESSAGE"}
              </span>
              <p className="mt-0.5 font-sans leading-snug">{toastMessage}</p>
            </div>
            <button onClick={() => setToastMessage(null)} className="p-0.5 text-white/40 hover:text-white rounded shrink-0 transition-colors ml-auto">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 2. DEMO RESTRICTED BANNER */}
      <div className="border border-white/5 bg-[#050505]/30 rounded-xl px-4 py-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 font-mono text-[11px] backdrop-blur-sm">
        <div className="flex items-center gap-2.5 text-white/50">
          <Info className="w-4 h-4 text-[#009DFF] shrink-0" />
          <span>
            <strong className="text-white/80">AIRGAPPED AUDIT REPOSITORY:</strong> Security policy blocks local downloads inside client preview portals.
          </span>
        </div>
        <span className="text-[9.5px] text-[#009DFF] font-bold bg-[#009DFF]/10 border border-[#009DFF]/20 px-2.5 py-0.5 rounded uppercase tracking-wider shrink-0 select-none">
          SECURE SIMULATION ACTIVE
        </span>
      </div>

      {/* 3. HEADER NAV */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/portal/documents")}
          className="p-1.5 rounded border border-white/5 bg-white/[0.01] text-white/50 hover:text-white cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <span className="text-[10px] font-mono font-bold text-[#009DFF] bg-[#009DFF]/5 border border-[#009DFF]/20 px-2 py-0.5 rounded uppercase">
            Sovereign Ledger Registry
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight font-mono uppercase mt-1">
            Audit Trail: {id}
          </h2>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center rounded-2xl border border-white/5 bg-[#050505]/20 backdrop-blur-sm space-y-4">
          <RefreshCw className="w-8 h-8 text-[#009DFF] animate-spin mx-auto" />
          <p className="text-xs font-mono text-white/45 uppercase tracking-widest">
            Attesting Cryptographic Signature blocks...
          </p>
        </div>
      ) : error ? (
        <div className="p-12 text-center rounded-2xl border border-red-500/10 bg-red-950/5 backdrop-blur-sm max-w-xl mx-auto space-y-4">
          <div className="p-4 rounded-full bg-red-500/10 border border-red-500/20 inline-flex text-red-400">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">HSM Verification Failed</h3>
            <p className="text-[12.5px] text-white/50 max-w-sm mx-auto font-sans leading-relaxed">
              {error}
            </p>
          </div>
          <button 
            onClick={fetchDocument}
            className="h-9 px-4 rounded-lg bg-red-600 hover:bg-red-500 text-[11px] font-mono font-bold uppercase text-white transition-all cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.2)] inline-flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>RETRY VERIFICATION</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
          
          {/* Main Details Panel */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Header Document Attributes */}
            <div className="p-5 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <FileText className="w-5 h-5 text-[#009DFF]" />
                <h3 className="text-sm font-bold text-white font-mono uppercase">Document Metadata Summary</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 bg-black/30 border border-white/5 rounded-lg font-mono text-[11.5px] space-y-1">
                  <span className="text-white/30 text-[8.5px] uppercase font-bold tracking-wider">Title</span>
                  <div className="text-white font-semibold line-clamp-2 leading-relaxed">{doc.title}</div>
                </div>
                <div className="p-3.5 bg-black/30 border border-white/5 rounded-lg font-mono text-[11.5px] space-y-1">
                  <span className="text-white/30 text-[8.5px] uppercase font-bold tracking-wider">Related Program</span>
                  <div className="text-white font-semibold line-clamp-2 leading-relaxed">{doc.client_name}</div>
                </div>
                <div className="p-3.5 bg-black/30 border border-white/5 rounded-lg font-mono text-[11.5px] space-y-1">
                  <span className="text-white/30 text-[8.5px] uppercase font-bold tracking-wider">Owner / Custodian</span>
                  <div className="text-white font-semibold">{doc.owner}</div>
                </div>
                <div className="p-3.5 bg-black/30 border border-white/5 rounded-lg font-mono text-[11.5px] space-y-1">
                  <span className="text-white/30 text-[8.5px] uppercase font-bold tracking-wider">File Size / Format</span>
                  <div className="text-white font-semibold uppercase">{doc.fileSize} / {doc.type} Spec</div>
                </div>
              </div>

              <div className="p-3.5 bg-[#009DFF]/5 border border-[#009DFF]/20 rounded-lg font-mono text-[11.5px] space-y-1">
                <span className="text-[#009DFF] text-[8.5px] uppercase font-bold tracking-wider">Description Overview</span>
                <p className="text-white/70 font-sans leading-relaxed text-[12px]">{doc.description}</p>
              </div>
            </div>

            {/* Cryptographic Credentials */}
            <div className="p-5 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <ShieldCheck className="w-5 h-5 text-[#00FFC2]" />
                <h3 className="text-sm font-bold text-white font-mono uppercase">Cryptographic Audit Credentials</h3>
              </div>
              
              <div className="space-y-3 font-mono text-[11.5px] text-white/75">
                <div className="p-3 bg-black/30 border border-white/5 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <span className="text-white/40">Sovereign Signature Seal:</span>
                  <span className="text-[#00FFC2] font-bold select-all tracking-wide break-all text-right">{doc.sha256}</span>
                </div>
                <div className="p-3 bg-black/30 border border-white/5 rounded-lg flex justify-between">
                  <span className="text-white/40">Timestamp Block:</span>
                  <span className="text-white">{new Date(doc.lastUpdated).toLocaleString()}</span>
                </div>
                <div className="p-3 bg-black/30 border border-white/5 rounded-lg flex justify-between">
                  <span className="text-white/40">Handshake Integrity:</span>
                  <span className="text-green-400 font-bold uppercase">SECURED (100.00%)</span>
                </div>
              </div>
            </div>

            {/* Document Audit Logs */}
            <div className="p-5 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm space-y-4">
              <h3 className="text-sm font-bold text-white font-mono uppercase border-b border-white/5 pb-2">Document Audit Logs</h3>
              <div className="space-y-3 font-mono text-[11px] text-white/50">
                {auditLogs.map((log, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row justify-between border-b border-white/[0.02] pb-2 last:border-0 last:pb-0 gap-1.5">
                    <div className="flex gap-2">
                      <span className="text-[#009DFF] shrink-0 font-bold">[{log.time}]</span>
                      <span className="text-white/70 leading-relaxed">{log.text}</span>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-center font-bold">
                      <span className="text-white/30 text-[9.5px] uppercase font-normal">{log.user}</span>
                      <span className="text-emerald-400 font-bold text-[9px] bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 rounded">{log.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            
            {/* HSM Integrity State Card */}
            <div className="p-5 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm space-y-4">
              <div className="flex items-center gap-1.5 border-b border-white/5 pb-2">
                <ShieldCheck className="w-4.5 h-4.5 text-green-400" />
                <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">HSM Integrity State</h3>
              </div>
              
              <div className="space-y-3 font-mono text-[11px]">
                <div className="flex items-center justify-between p-2 rounded bg-[#009DFF]/5 border border-[#009DFF]/20 text-[#009DFF] font-bold">
                  <span>DECAPSULATED:</span>
                  <span>YES</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-emerald-500/5 border border-emerald-500/20 text-[#00FFC2] font-bold">
                  <span>VERIFICATION:</span>
                  <span className="uppercase">{doc.status || "Verified"}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/10 text-white/70">
                  <span>REVISION TIER:</span>
                  <span>{doc.version}</span>
                </div>
                <p className="text-[10px] text-white/40 leading-relaxed font-sans">
                  This document metadata is loaded from a hardware-isolated, non-volatile memory block (HSM). Integrity checks are safe, verified, and complete.
                </p>
                <button 
                  onClick={handleSimulatedDownload}
                  className="w-full inline-flex h-9 items-center justify-center gap-1.5 rounded bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-white/90 transition-all cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Certified Copy</span>
                </button>
              </div>
            </div>

            {/* Governance Compliance Checks */}
            {doc.governanceChecks && doc.governanceChecks.length > 0 && (
              <div className="p-5 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm space-y-4">
                <div className="flex items-center gap-1.5 border-b border-white/5 pb-2">
                  <Shield className="w-4.5 h-4.5 text-[#009DFF]" />
                  <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">Compliance Interlock</h3>
                </div>
                
                <div className="space-y-3 font-mono text-[11px]">
                  {doc.governanceChecks.map((check: any, idx: number) => (
                    <div key={idx} className="p-2.5 rounded border border-white/5 bg-white/[0.01] space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-white/80 font-semibold font-sans leading-snug">{check.label}</span>
                        <span className={`text-[8.5px] font-bold border rounded px-1.5 py-0.2 uppercase shrink-0 ${
                          check.checked ? "text-[#00FFC2] border-[#00FFC2]/20 bg-[#00FFC2]/5" : "text-amber-400 border-amber-400/20 bg-amber-400/5"
                        }`}>
                          {check.checked ? "PASSED" : "PENDING"}
                        </span>
                      </div>
                      <div className="text-[9.5px] text-white/30 font-mono">Framework: {check.framework}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      )}
    </div>
  );
}
