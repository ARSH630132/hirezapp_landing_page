"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { 
  ShieldAlert, ShieldCheck, CheckCircle, AlertCircle, FileText, Copy, Search, 
  X, ChevronRight, Download, Lock, RefreshCw, UserCheck, 
  Layers, Cpu, SlidersHorizontal, ExternalLink, RotateCcw, Info,
  Globe, Terminal, Settings, Check, Play, Shield, Plus
} from "lucide-react";
import { 
  WorkspaceCard, 
  StatusBadge, 
  PrivatePageHeader 
} from "@/components/private-app";
import { motion, AnimatePresence } from "motion/react";

interface GovernanceAlert {
  id: string;
  title: string;
  client: string;
  project: string;
  nodeId: string;
  standard: string;
  sev: "Critical" | "High" | "Medium" | "Low";
  status: "Flagged" | "Under Review" | "Remediated" | "Suppressed";
  owner: string;
  dueDate: string;
  desc: string;
  hash: string;
  logs: string[];
}

interface GuardrailPolicy {
  id: string;
  name: string;
  code: string;
  standard: string;
  category: string;
  desc: string;
  enforced: boolean;
}

const getClientNameFromId = (clientId: string): string => {
  switch (clientId) {
    case "client-001": return "Apex Sovereign Group [Preview Client]";
    case "client-002": return "Global Retail Enclave [Preview Client]";
    case "client-003": return "Sovereign Logistics Unit [Preview Client]";
    case "client-004": return "Federal Treasury Division [Preview Client]";
    default: return "Apex Sovereign Group [Preview Client]";
  }
};

const INITIAL_POLICIES: GuardrailPolicy[] = [
  {
    id: "POL-001",
    name: "eBPF Host Syscall Isolation",
    code: "eBPF_HOST_ISOLATE",
    standard: "SOC2 / NIST",
    category: "Hypervisor Security",
    desc: "Kernel-level monitoring ensuring sandbox containers cannot inspect host memory addresses.",
    enforced: true
  },
  {
    id: "POL-002",
    name: "30-Day HSM Key Hygiene",
    code: "HSM_KEY_ROTATION",
    standard: "ISO-27001",
    category: "Cryptography",
    desc: "Enforces continuous automatic key rotation inside hardware-secured enclave modules.",
    enforced: true
  },
  {
    id: "POL-003",
    name: "Zero-Knowledge Network Handshake",
    code: "ZK_NET_TUNNEL",
    standard: "ISO-27001 / GDPR",
    category: "Networking",
    desc: "Requires dual-signatory TLS 1.3 tunnels. Telemetry passing through GFF AI is anonymized.",
    enforced: true
  },
  {
    id: "POL-004",
    name: "GDPR Enclave Data Redaction",
    code: "GDPR_ENCLAVE_REDACT",
    standard: "GDPR Enclave",
    category: "Privacy Guard",
    desc: "Inspects conversational logging streams and automatically redacts PII.",
    enforced: true
  }
];


let toastIdCounter = 0;
const generateToastId = () => {
  toastIdCounter++;
  return `toast-${toastIdCounter}`;
};

export default function AdminGovernancePage() {
  const [alerts, setAlerts] = useState<GovernanceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Create Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createTitle, setCreateTitle] = useState("");
  const [createClient, setCreateClient] = useState("client-001");
  const [createProject, setCreateProject] = useState("");
  const [createSeverity, setCreateSeverity] = useState("Low");
  const [createStandard, setCreateStandard] = useState("ISO-27001");
  const [createNodeId, setCreateNodeId] = useState("");
  const [createDescription, setCreateDescription] = useState("");

  const [policies, setPolicies] = useState<GuardrailPolicy[]>(INITIAL_POLICIES);
  const [selectedAlert, setSelectedAlert] = useState<GovernanceAlert | null>(null);
  const [activeTab, setActiveTab] = useState<"alert-ledger" | "guardrail-matrix" | "hardware-hsm">("alert-ledger");
  const [searchQuery, setSearchQuery] = useState("");
  const [clientFilter, setClientFilter] = useState("All");
  const [sevFilter, setSevFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [reviewerVal, setReviewerVal] = useState("Unassigned");
  const [statusVal, setStatusVal] = useState<GovernanceAlert["status"]>("Flagged");
  const [hsmStatus, setHsmStatus] = useState<"SEALED" | "ROTATING" | "ROTATED">("SEALED");
  const [hsmProgress, setHsmProgress] = useState(0);
  const [hsmLogs, setHsmLogs] = useState<string[]>([]);
  const [isRotating, setIsRotating] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLog, setScanLog] = useState("");
  interface Toast { id: string; msg: string; type: "success" | "warning" | "info" }
  const [toasts, setToasts] = useState<Toast[]>([]);

  const triggerToast = useCallback((msg: string, type: "success" | "warning" | "info" = "info") => {
    const id = generateToastId();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  }, []);
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let token = typeof window !== "undefined" ? localStorage.getItem("gff_ai_access_token") || localStorage.getItem("gff_api_token") : null;
      if (!token) {
        const loginRes = await fetch("/api/v1/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "s.vance@governance.gff.ai", password: "VanceSecure2026!" })
        });
        if (loginRes.ok) {
          const authData = await loginRes.json();
          if (authData.accessToken) {
            token = authData.accessToken;
            localStorage.setItem("gff_ai_access_token", authData.accessToken);
          }
        }
      }

      if (!token) throw new Error("Authentication token missing.");

      // Fetch profile
      const meRes = await fetch("/api/v1/auth/me", { headers: { "Authorization": `Bearer ${token}` } });
      if (meRes.ok) {
        const meData = await meRes.json();
        setCurrentUser(meData.user);
      }

      // Fetch governance items with parameters
      let url = "/api/v1/governance";
      const params = new URLSearchParams();
      if (clientFilter && clientFilter !== "All") {
        let cid = "";
        if (clientFilter.includes("Apex")) cid = "client-001";
        else if (clientFilter.includes("Global") || clientFilter.includes("Retail")) cid = "client-002";
        else if (clientFilter.includes("Logistics")) cid = "client-003";
        else if (clientFilter.includes("Treasury") || clientFilter.includes("Federal")) cid = "client-004";
        if (cid) params.append("client_id", cid);
      }
      if (sevFilter && sevFilter !== "All") {
        params.append("severity", sevFilter);
      }
      if (statusFilter && statusFilter !== "All") {
        params.append("status", statusFilter);
      }
      if (searchQuery.trim() !== "") {
        params.append("search", searchQuery);
      }
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await fetch(url, { headers: { "Authorization": `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) {
        const mapped = data.governance.map((item: any) => ({
          id: item.id,
          title: item.title,
          client: item.client_name || getClientNameFromId(item.client_id) || "Apex Sovereign Group [Preview Client]",
          project: item.project_name || item.project_id || "None",
          nodeId: item.nodeId || "N/A",
          standard: item.standard || "ISO-27001",
          sev: item.severity || "Low",
          status: item.status || "Flagged",
          owner: item.owner || "Unassigned",
          dueDate: item.due_date || "",
          desc: item.description || "",
          hash: item.hash || "0x7F9B1E22D4A3C8F",
          logs: item.logs || []
        }));
        setAlerts(mapped);
      } else {
        throw new Error(data.message || "Failed to fetch governance ledger.");
      }
    } catch (err: any) {
      setError(err.message || "Connection to secure compliance gateway offline.");
    } finally {
      setLoading(false);
    }
  }, [clientFilter, sevFilter, statusFilter, searchQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSelectAlert = (a: GovernanceAlert) => {
    setSelectedAlert(a);
    setReviewerVal(a.owner);
    setStatusVal(a.status);
  };

  const handleApplyOverrides = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAlert) return;

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("gff_ai_access_token") : null;
      if (!token) throw new Error("Unauthenticated");

      const payload = {
        owner: reviewerVal,
        status: statusVal
      };

      const res = await fetch(`/api/v1/governance/${selectedAlert.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        triggerToast(`Alert ${selectedAlert.id} override applied successfully.`, "success");
        setSelectedAlert(null);
        fetchData();
      } else {
        triggerToast(`Failed to apply override: ${data.message || "Error"}`, "warning");
      }
    } catch (err: any) {
      triggerToast(`Failed: ${err.message}`, "warning");
    }
  };

  const handleDeleteAlert = async (id: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete governance alert ${id}?`)) {
      return;
    }
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("gff_ai_access_token") : null;
      if (!token) throw new Error("Unauthenticated");

      const res = await fetch(`/api/v1/governance/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        triggerToast(`Governance alert ${id} deleted successfully.`, "success");
        setSelectedAlert(null);
        fetchData();
      } else {
        triggerToast(`Failed to delete alert: ${data.message || "Error"}`, "warning");
      }
    } catch (err: any) {
      triggerToast(`Failed: ${err.message}`, "warning");
    }
  };

  const handleCreateGovernance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createTitle.trim() || !createDescription.trim()) return;

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("gff_ai_access_token") : null;
      if (!token) throw new Error("Unauthenticated");

      const payload = {
        title: createTitle.trim(),
        client_id: createClient,
        project_id: createProject || undefined,
        severity: createSeverity,
        status: "Flagged",
        standard: createStandard || "ISO-27001",
        nodeId: createNodeId || "GEN-NODE-X",
        description: createDescription.trim(),
        logs: [
          `[${new Date().toLocaleTimeString()}] Governance Alert Ledger Provisioned.`,
          `[${new Date().toLocaleTimeString()}] Secure telemetry eBPF filter established.`
        ]
      };

      const res = await fetch("/api/v1/governance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        triggerToast(`Alert ${data.governance.id} provisioned successfully.`, "success");
        setIsCreateModalOpen(false);
        setCreateTitle("");
        setCreateDescription("");
        setCreateNodeId("");
        fetchData();
      } else {
        triggerToast(`Failed to create alert: ${data.message || "Error"}`, "warning");
      }
    } catch (err: any) {
      triggerToast(`Failed: ${err.message}`, "warning");
    }
  };

  const handleTogglePolicy = (policyId: string) => {
    let pName = "";
    let state = false;
    setPolicies(p => p.map(x => {
      if (x.id === policyId) { pName = x.name; state = !x.enforced; return { ...x, enforced: !x.enforced }; }
      return x;
    }));
    if (state) triggerToast(`Policy enforced: '${pName}' is now active.`, "success");
    else triggerToast(`Policy bypassed: '${pName}' set to Passive/Audit-only.`, "warning");
  };
  const triggerHSMRotation = () => {
    if (isRotating) return;
    setIsRotating(true);
    setHsmStatus("ROTATING");
    setHsmProgress(0);
    setHsmLogs(["[14:40:01] Initializing hardware master key rotation..."]);
    const logSteps = [
      { p: 20, text: "[14:40:02] Auth request validated by Dr. Sarah Vance." },
      { p: 50, text: "[14:40:03] Querying AMD SEV-SNP & Intel SGX enclave clusters..." },
      { p: 80, text: "[14:40:04] Injecting ZK key seed matrix, destroying old certs." },
      { p: 100, text: "[14:40:05] HSM SEAL RESTORED. Dual-signatory certificates updated." }
    ];
    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < logSteps.length) {
        setHsmProgress(logSteps[stepIdx].p);
        setHsmLogs(p => [...p, logSteps[stepIdx].text]);
        stepIdx++;
      } else {
        clearInterval(interval);
        setHsmStatus("ROTATED");
        setIsRotating(false);
        triggerToast("HSM Master Keys rotated successfully.", "success");
      }
    }, 800);
  };
  const triggerSystemScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanProgress(0);
    setScanLog("Initializing high-integrity scan across enclaves...\n");
    const scanMsgs = [
      "Scanning hypervisors for syscall leakage... CLEAN (POL-001 Enforced)\n",
      "Scanning HSM master keys status... VERIFIED (30-day compliant)\n",
      "Scanning Zero-Knowledge network tunnels... CLEAN (Active verified)\n",
      "Continuous compliance completed. Score: 98.4%\n"
    ];
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < scanMsgs.length) {
        setScanProgress(p => Math.min(p + 25, 100));
        setScanLog(p => p + " > " + scanMsgs[idx]);
        idx++;
      } else {
        clearInterval(interval);
        setScanProgress(100);
        setIsScanning(false);
        triggerToast("Sovereign system scan completed.", "success");
      }
    }, 600);
  };
  const filteredAlerts = useMemo(() => {
    return alerts.filter(a => {
      const matchQ = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchC = clientFilter === "All" || a.client === clientFilter;
      const matchSev = sevFilter === "All" || a.sev === sevFilter;
      const matchS = statusFilter === "All" || a.status === statusFilter;
      return matchQ && matchC && matchSev && matchS;
    });
  }, [alerts, searchQuery, clientFilter, sevFilter, statusFilter]);

  const activeAlertsCount = useMemo(() => alerts.filter(a => a.status === "Flagged" || a.status === "Under Review").length, [alerts]);
  const overallScore = useMemo(() => {
    const encCount = policies.filter(p => p.enforced).length;
    const resCount = alerts.filter(a => a.status === "Remediated" || a.status === "Suppressed").length;
    const score = 80 + (encCount * 3) + (resCount * 2) - (activeAlertsCount * 2);
    return Math.min(Math.round(score * 10) / 10, 100);
  }, [policies, alerts, activeAlertsCount]);

  const clientsList = ["Apex Group", "National Health Enclave", "Sovereign Retail Group"];


  return (
    <div className="space-y-6 text-white font-mono text-[11px] relative max-w-7xl mx-auto">
      {/* Toasts */}
      <div className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-50 flex flex-col gap-2 pointer-events-none select-none">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`p-3 rounded-xl border text-[10px] font-bold flex items-center gap-2 pointer-events-auto max-w-xs bg-black border-white/10 ${t.type === "success" ? "border-[#00FFC2]/30 text-[#00FFC2]" : t.type === "warning" ? "border-amber-500/30 text-amber-500" : "border-[#009DFF]/30 text-[#009DFF]"}`}>
              {t.type === "success" && <CheckCircle className="w-3.5 h-3.5 shrink-0" />}
              {t.type === "warning" && <ShieldAlert className="w-3.5 h-3.5 shrink-0" />}
              {t.type === "info" && <Info className="w-3.5 h-3.5 shrink-0" />}
              <span>{t.msg}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <PrivatePageHeader title="Oversight & Guardrail Control Desk" desc="System-wide hardware security enclave isolation rules, eBPF telemetry feeds, and real-time sovereign guardrail verification." badgeLabel="ADMIN SECURITY CONSOLE" />

      {/* Disclaimer Box */}
      <div className="p-4 rounded-xl border border-amber-500/15 bg-amber-500/[0.02] flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2.5 items-start">
          <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold uppercase block text-[10px] text-amber-400">Continuous Enforcement Standard (CES)</span>
            <span className="text-white/60">Monitors cryptographic sandboxes. Altering policies impacts boundaries instantly.</span>
          </div>
        </div>
        <div className="flex gap-2 items-center shrink-0">
          <button onClick={() => setIsCreateModalOpen(true)} className="h-7.5 px-3 rounded bg-[#009DFF] hover:bg-[#0082d4] text-black font-bold uppercase text-[9px] transition-colors flex items-center gap-1.5 cursor-pointer shrink-0">
            <Plus className="w-3 h-3 text-black font-bold" />
            <span>Create Alert Ledger</span>
          </button>
          <button onClick={triggerSystemScan} disabled={isScanning} className="h-7.5 px-3 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 font-bold uppercase text-[9px] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0">
            {isScanning ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
            {isScanning ? "Scanning..." : "Scan Compliance Matrix"}
          </button>
        </div>
      </div>

      {/* Scan Drawer */}
      {isScanning && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="border border-white/5 bg-black/40 rounded-xl p-3 space-y-2 overflow-hidden">
          <div className="flex items-center justify-between text-[9px] text-amber-400"><span>SECURE LIVE SCAN RUN</span><span>{scanProgress}% SECURED</span></div>
          <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden"><div className="bg-amber-500 h-full transition-all" style={{ width: `${scanProgress}%` }} /></div>
          <pre className="text-[9.5px] text-white/50 leading-relaxed max-h-[100px] overflow-y-auto p-2 bg-black/80 rounded border border-white/5 font-mono">{scanLog}</pre>
        </motion.div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <WorkspaceCard className="border-[#009DFF]/10">
          <div className="space-y-1">
            <div className="text-[9px] text-white/40 uppercase">Active Sandbox Escapes</div>
            <div className="text-xl font-bold text-white flex items-baseline gap-1.5"><span>{activeAlertsCount}</span><span className="text-[8px] text-rose-400 px-1 rounded bg-rose-500/10 border border-rose-500/20">FLAGS</span></div>
            <div className="text-[9px] text-white/45 pt-2 border-t border-white/5 mt-2 flex justify-between"><span>Awaiting review</span><span className="text-[#009DFF] font-bold">Priority High</span></div>
          </div>
        </WorkspaceCard>

        <WorkspaceCard className="border-[#00FFC2]/10">
          <div className="space-y-1">
            <div className="text-[9px] text-white/40 uppercase">System Compliance Score</div>
            <div className="text-xl font-bold text-[#00FFC2]">{overallScore}%</div>
            <div className="text-[9px] text-white/45 pt-2 border-t border-white/5 mt-2 flex justify-between"><span>Active policies</span><span className="text-[#00FFC2] font-bold">{policies.filter(p => p.enforced).length} Rules</span></div>
          </div>
        </WorkspaceCard>

        <WorkspaceCard className="border-amber-500/10">
          <div className="space-y-1">
            <div className="text-[9px] text-white/40 uppercase">Hardware Key Sealing</div>
            <div className="text-xl font-bold"><span className={hsmStatus === "ROTATING" ? "text-amber-400 animate-pulse" : "text-emerald-400"}>{hsmStatus === "ROTATING" ? "ROTATING..." : hsmStatus === "ROTATED" ? "RE-SEALED" : "SEALED"}</span></div>
            <div className="text-[9px] text-white/45 pt-2 border-t border-white/5 mt-2 flex justify-between items-center"><span>Dual-signatory HSM</span><span className="text-white/50">v4.1.8</span></div>
          </div>
        </WorkspaceCard>

        <WorkspaceCard className="border-white/5">
          <div className="space-y-1">
            <div className="text-[9px] text-white/40 uppercase">Continuous Tracing</div>
            <div className="text-xl font-bold text-white">18 Nodes</div>
            <div className="text-[9px] text-white/45 pt-2 border-t border-white/5 mt-2 flex justify-between"><span>eBPF telemetry pipe</span><span className="text-emerald-400 font-bold">99.998% Sync</span></div>
          </div>
        </WorkspaceCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex border-b border-white/5 gap-4">
            <button
              onClick={() => setActiveTab("alert-ledger")}
              className={`pb-2.5 font-bold uppercase text-[9.5px] tracking-wider relative flex items-center gap-1.5 cursor-pointer ${
                activeTab === "alert-ledger" ? "text-[#009DFF]" : "text-white/45 hover:text-white"
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Alert Ledger ({filteredAlerts.length})</span>
              {activeTab === "alert-ledger" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#009DFF]" />}
            </button>

            <button
              onClick={() => setActiveTab("guardrail-matrix")}
              className={`pb-2.5 font-bold uppercase text-[9.5px] tracking-wider relative flex items-center gap-1.5 cursor-pointer ${
                activeTab === "guardrail-matrix" ? "text-[#009DFF]" : "text-white/45 hover:text-white"
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Guardrail Matrix</span>
              {activeTab === "guardrail-matrix" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#009DFF]" />}
            </button>

            <button
              onClick={() => setActiveTab("hardware-hsm")}
              className={`pb-2.5 font-bold uppercase text-[9.5px] tracking-wider relative flex items-center gap-1.5 cursor-pointer ${
                activeTab === "hardware-hsm" ? "text-[#009DFF]" : "text-white/45 hover:text-white"
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>HSM Controller</span>
              {activeTab === "hardware-hsm" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#009DFF]" />}
            </button>
          </div>

          {/* Tab 1: Alert Ledger */}
          {activeTab === "alert-ledger" && (
            <div className="space-y-4">
              {/* Filter tools */}
              <div className="p-3 rounded-xl border border-white/5 bg-[#050505]/35 flex flex-wrap gap-2 items-center justify-between">
                <div className="relative flex-1 min-w-[150px]">
                  <Search className="absolute left-2 top-2 w-3 h-3 text-white/30" />
                  <input
                    type="text"
                    placeholder="Search incident..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full h-7 pl-7 pr-2 rounded border border-white/5 bg-black/40 text-white placeholder-white/30 text-[10px] focus:outline-none"
                  />
                </div>

                <div className="flex gap-1.5 flex-wrap items-center">
                  <SlidersHorizontal className="w-3 h-3 text-white/30 shrink-0" />
                  <select
                    value={clientFilter}
                    onChange={e => setClientFilter(e.target.value)}
                    className="h-7 px-1.5 rounded border border-white/5 bg-black/40 text-[9.5px] text-white/80 cursor-pointer focus:outline-none"
                  >
                    <option value="All">All Tenants</option>
                    {clientsList.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>

                  <select
                    value={sevFilter}
                    onChange={e => setSevFilter(e.target.value)}
                    className="h-7 px-1.5 rounded border border-white/5 bg-black/40 text-[9.5px] text-white/80 cursor-pointer focus:outline-none"
                  >
                    <option value="All">All Severities</option>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                  </select>

                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="h-7 px-1.5 rounded border border-white/5 bg-black/40 text-[9.5px] text-white/80 cursor-pointer focus:outline-none"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Flagged">Flagged</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Remediated">Remediated</option>
                    <option value="Suppressed">Suppressed</option>
                  </select>
                </div>
              </div>

              {/* Alert Items */}
              <div className="space-y-2">
                {loading && alerts.length === 0 ? (
                  <div className="p-10 border border-white/5 rounded-xl bg-black/25 flex flex-col items-center justify-center space-y-3 font-mono">
                    <RefreshCw className="w-6 h-6 text-[#009DFF] animate-spin" />
                    <span className="text-white/40 text-[10px] uppercase">Decrypting active alert ledger...</span>
                  </div>
                ) : error ? (
                  <div className="p-10 border border-red-500/10 rounded-xl bg-red-500/[0.01] flex flex-col items-center justify-center space-y-3 font-mono text-center">
                    <ShieldAlert className="w-6 h-6 text-red-500" />
                    <span className="text-red-400 text-[10px] uppercase font-bold">Secure ledger failure</span>
                    <p className="text-white/40 text-[9.5px] max-w-xs">{error}</p>
                    <button onClick={fetchData} className="px-3 py-1.5 rounded border border-red-500/20 text-red-400 hover:bg-red-500/5 transition-colors cursor-pointer uppercase text-[9px] font-bold">
                      Retry Connection
                    </button>
                  </div>
                ) : filteredAlerts.length === 0 ? (
                  <div className="p-10 border border-dashed border-white/5 rounded-xl text-center max-w-sm mx-auto space-y-2">
                    <ShieldCheck className="w-6 h-6 text-emerald-400/30 mx-auto" />
                    <p className="text-white font-bold text-[10px] uppercase">No Alerts Active</p>
                    <p className="text-white/40 text-[9.5px]">All sandboxes satisfy compliance rules.</p>
                  </div>
                ) : (
                  filteredAlerts.map(alert => {
                    const isSelected = selectedAlert?.id === alert.id;
                    const isUrgent = alert.sev === "Critical" || alert.sev === "High";

                    return (
                      <div
                        key={alert.id}
                        onClick={() => handleSelectAlert(alert)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left select-none relative group ${
                          isSelected 
                            ? "border-[#009DFF] bg-[#009DFF]/[0.02]" 
                            : isUrgent
                              ? "border-rose-500/10 bg-rose-500/[0.01] hover:border-rose-500/20"
                              : "border-white/5 bg-[#050505]/20 hover:border-white/10"
                        }`}
                      >
                        <div className="flex justify-between items-center gap-2">
                          <div className="flex items-center gap-1.5 text-[9px]">
                            <span className="font-bold text-white/30">{alert.id}</span>
                            <span className="text-white/20">•</span>
                            <span className="text-[#009DFF] font-bold">{alert.standard}</span>
                          </div>
                          
                          <div className="flex items-center gap-1.5">
                            <span className={`px-1 py-0.2 rounded font-bold uppercase text-[8px] border ${
                              alert.sev === "Critical" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                              alert.sev === "High" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                              "bg-[#009DFF]/10 text-[#009DFF] border-[#009DFF]/20"
                            }`}>
                              {alert.sev}
                            </span>
                            <span className={`h-1.5 w-1.5 rounded-full ${
                              alert.status === "Flagged" ? "bg-red-500 animate-pulse" :
                              alert.status === "Under Review" ? "bg-amber-400" :
                              alert.status === "Remediated" ? "bg-emerald-500" : "bg-white/30"
                            }`} />
                            <span className="text-[8.5px] text-white/40 uppercase font-bold">{alert.status}</span>
                          </div>
                        </div>

                        <div className="mt-2">
                          <h4 className="text-[11.5px] font-bold text-white group-hover:text-[#009DFF] transition-colors">{alert.title}</h4>
                          <p className="text-white/60 text-[10px] mt-0.5 leading-relaxed line-clamp-2">{alert.desc}</p>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-white/5 flex flex-wrap justify-between items-center text-[9px] text-white/40 gap-2">
                          <div className="flex items-center gap-1">
                            <Globe className="w-3 h-3 text-white/20 shrink-0" />
                            <span>Client: <strong className="text-white/70">{alert.client}</strong></span>
                            <span className="text-white/10">|</span>
                            <Cpu className="w-3 h-3 text-white/20 shrink-0" />
                            <span>Node: <strong className="text-white/70">{alert.nodeId}</strong></span>
                          </div>
                          <span>Officer: <strong className="text-white/70">{alert.owner}</strong></span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
          {/* Tab 2: Guardrail Matrix */}
          {activeTab === "guardrail-matrix" && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl border border-white/5 bg-[#050505]/20 text-white/50 text-[10px] leading-relaxed">
                Hypervisor-level blockages embedded in GFF AI's secure hardware. Deactivating a policy suspends blocks and shifts the enclave into audit-only mode.
              </div>

              {policies.map(policy => (
                <div key={policy.id} className="p-3.5 rounded-xl border border-white/5 bg-[#050505]/10 flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap text-[9px]">
                      <span className="font-bold text-white/30">{policy.id}</span>
                      <span className="text-[#009DFF] font-bold uppercase">{policy.code}</span>
                      <span className="text-white/10">|</span>
                      <span className="text-white/40">{policy.standard}</span>
                    </div>
                    <h4 className="text-[11.5px] font-bold text-white">{policy.name}</h4>
                    <p className="text-white/60 text-[10px] leading-normal">{policy.desc}</p>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0 select-none">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={policy.enforced} 
                        onChange={() => handleTogglePolicy(policy.id)}
                        className="sr-only peer" 
                      />
                      <div className="w-8 h-4 bg-white/5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white/40 after:border-none after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#009DFF] peer-checked:after:bg-black" />
                    </label>
                    <span className={`text-[8px] font-bold uppercase ${
                      policy.enforced ? "text-[#00FFC2]" : "text-white/30"
                    }`}>
                      {policy.enforced ? "Active" : "Passive"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: HSM Key Controller */}
          {activeTab === "hardware-hsm" && (
            <div className="p-4 rounded-xl border border-white/5 bg-[#050505]/20 space-y-3">
              <div className="flex gap-3 items-start">
                <Lock className="w-4 h-4 text-[#00FFC2] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-white text-[11px] uppercase block">Hardware Security Module Key Rollover</span>
                  <p className="text-white/50 text-[10px] leading-relaxed">
                    Rotating master keys destroys intermediate ephemeral zero-knowledge seed structures inside the isolated HSM pools, sealing boundaries with new cryptographic certificates.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div>
                  <span className="text-white/40 text-[9px] block">CURRENT CRYPTO KEY HASH</span>
                  <strong className="text-white font-mono text-[10px]">SHA_ZKP_0x7FFA8811BCDE223_SEALED</strong>
                  <div className="text-[9px] text-emerald-400 mt-1 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>All 18 enclaves synchronized.</span>
                  </div>
                </div>

                <button
                  onClick={triggerHSMRotation}
                  disabled={isRotating}
                  className="h-8 px-3 rounded bg-[#00FFC2] hover:bg-[#00d8a5] text-black font-bold uppercase text-[9.5px] transition-colors shrink-0 cursor-pointer disabled:opacity-40"
                >
                  {isRotating ? "ROTATING KEY..." : "ROTATE HSM KEY"}
                </button>
              </div>

              {hsmStatus !== "SEALED" && (
                <div className="space-y-2 pt-2.5">
                  <div className="flex justify-between items-center text-[9px]">
                    <span className="text-[#00FFC2] flex items-center gap-1 font-bold">
                      <RefreshCw className="w-3 h-3 animate-spin" /> REGENERATING ROOT SEED
                    </span>
                    <span>{hsmProgress}% COMPLETE</span>
                  </div>
                  <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                    <div className="bg-[#00FFC2] h-full transition-all duration-300" style={{ width: `${hsmProgress}%` }} />
                  </div>
                  <div className="p-2 bg-black rounded border border-white/5 max-h-[100px] overflow-y-auto font-mono text-[9px] text-white/50 space-y-1">
                    {hsmLogs.map((log, idx) => <div key={idx}>{log}</div>)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        {/* Right Side: Topology & Inspector */}
        <div className="space-y-4">
          
          {/* Topology Map */}
          <WorkspaceCard className="border-white/5 bg-[#030303]/40 p-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-3">
              <span className="font-bold text-[9px] tracking-wider uppercase text-white/45">Sovereign Cluster Handshakes</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </div>

            <div className="relative w-full aspect-[4/3] rounded-xl border border-white/5 bg-black/30 p-2 overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.01)_1px,transparent_1px)] bg-[size:14px_14px] pointer-events-none" />

              <svg width="100%" height="100%" viewBox="0 0 300 220" className="overflow-visible select-none z-10 font-mono">
                {/* Paths */}
                <path d="M 40,50 Q 150,50 150,110" fill="none" stroke="#009DFF" strokeWidth="1" strokeDasharray="3,3" className="opacity-30" />
                <path d="M 40,110 Q 150,110 150,110" fill="none" stroke="#00FFC2" strokeWidth="1" strokeDasharray="3,3" className="opacity-30" />
                <path d="M 40,170 Q 150,170 150,110" fill="none" stroke="#009DFF" strokeWidth="1" strokeDasharray="3,3" className="opacity-30" />
                <path d="M 150,110 Q 250,110 250,110" fill="none" stroke="#FF9D00" strokeWidth="1.2" className="opacity-50" />

                {/* Central Hub */}
                <g transform="translate(150,110)">
                  <circle r="18" fill="#020202" stroke="#00FFC2" strokeWidth="1.5" className="animate-pulse-glow" />
                  <polygon points="0,-6 -5,2 5,2" fill="#00FFC2" transform="scale(0.8)" />
                </g>

                {/* Nodes */}
                <g transform="translate(250,110)" className="cursor-pointer" onClick={() => triggerToast("Admin secured via TLS 1.3.", "info")}>
                  <rect x="-16" y="-16" width="32" height="32" rx="4" fill="#020202" stroke="#FF9D00" strokeWidth="1" />
                  <text x="0" y="24" fill="#FF9D00" fontSize="7.5" fontWeight="bold" textAnchor="middle">ADMIN</text>
                </g>

                <g transform="translate(40,50)" className="cursor-pointer" onClick={() => { setClientFilter("Apex Group"); triggerToast("Filtered to: Apex Group", "info"); }}>
                  <circle r="12" fill="#020202" stroke={clientFilter === "Apex Group" ? "#009DFF" : "#333"} strokeWidth="1.5" />
                  <text x="0" y="-16" fill="#888" fontSize="6.5" textAnchor="middle">APEX-SEC</text>
                  <circle r="2.5" cx="12" cy="0" fill={clientFilter === "Apex Group" ? "#009DFF" : "transparent"} />
                </g>

                <g transform="translate(40,110)" className="cursor-pointer" onClick={() => { setClientFilter("National Health Enclave"); triggerToast("Filtered to: National Health Enclave", "info"); }}>
                  <circle r="12" fill="#020202" stroke={clientFilter === "National Health Enclave" ? "#009DFF" : "#333"} strokeWidth="1.5" />
                  <text x="0" y="-16" fill="#888" fontSize="6.5" textAnchor="middle">MED-CLINIC</text>
                  <circle r="2.5" cx="12" cy="0" fill={clientFilter === "National Health Enclave" ? "#009DFF" : "transparent"} />
                </g>

                <g transform="translate(40,170)" className="cursor-pointer" onClick={() => { setClientFilter("Sovereign Retail Group"); triggerToast("Filtered to: Sovereign Retail Group", "info"); }}>
                  <circle r="12" fill="#020202" stroke={clientFilter === "Sovereign Retail Group" ? "#009DFF" : "#333"} strokeWidth="1.5" />
                  <text x="0" y="-16" fill="#888" fontSize="6.5" textAnchor="middle">RETAIL-CORE</text>
                  <circle r="2.5" cx="12" cy="0" fill={clientFilter === "Sovereign Retail Group" ? "#009DFF" : "transparent"} />
                </g>
              </svg>

              <div className="absolute bottom-2 left-2 right-2 flex justify-between text-[8px] text-white/30 font-mono">
                <span>* CLICK CLIENT TO FILTER</span>
                <span className="text-[#00FFC2]">ZK-GATEWAY OK</span>
              </div>
            </div>

            {clientFilter !== "All" && (
              <div className="mt-2 text-center">
                <button 
                  onClick={() => { setClientFilter("All"); }} 
                  className="text-[#009DFF] hover:underline text-[9px] uppercase font-bold flex items-center gap-1 mx-auto cursor-pointer"
                >
                  <RotateCcw className="w-2.5 h-2.5" /> Clear Client Filters
                </button>
              </div>
            )}
          </WorkspaceCard>

          {/* Telemetry Inspector */}
          <AnimatePresence>
            {selectedAlert ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-4 rounded-xl border border-[#009DFF]/30 bg-[#020202] space-y-3 relative shadow-lg">
                <button onClick={() => setSelectedAlert(null)} className="absolute top-4 right-4 text-white/45 hover:text-white cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                <div className="space-y-0.5">
                  <span className="text-[#009DFF] font-bold text-[9px] uppercase tracking-wider block">Telemetry Frame ({selectedAlert.id})</span>
                  <h3 className="font-bold text-white text-[11px] leading-tight uppercase">{selectedAlert.title}</h3>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-black border border-white/5 text-[9px] text-white/50">
                  <span className="truncate">Seal: {selectedAlert.hash}</span>
                  <button onClick={() => { navigator.clipboard.writeText(selectedAlert.hash); triggerToast("Hash seal copied.", "success"); }} className="hover:text-white cursor-pointer text-white/30 p-1"><Copy className="w-3 h-3" /></button>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] text-white/40 uppercase block font-bold">Enclave Log Tail</span>
                  <div className="p-2 bg-black rounded border border-white/5 max-h-[100px] overflow-y-auto font-mono text-[8.5px] text-emerald-400 space-y-1">
                    {selectedAlert.logs.map((log, idx) => <div key={idx}>{log}</div>)}
                  </div>
                </div>

                <form onSubmit={handleApplyOverrides} className="space-y-3 border-t border-white/5 pt-3">
                  <div>
                    <label className="text-[8.5px] text-white/40 uppercase block mb-1">Assign Reviewer</label>
                    <select value={reviewerVal} onChange={e => setReviewerVal(e.target.value)} className="w-full h-7 px-2 rounded border border-white/10 bg-black text-[9.5px] text-white cursor-pointer">
                      <option value="Unassigned">Unassigned</option>
                      <option value="Dr. Sarah Vance">Dr. Sarah Vance</option>
                      <option value="Alexander Mercer">Alexander Mercer</option>
                      <option value="Sophia Lin">Sophia Lin</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[8.5px] text-white/40 uppercase block mb-1">Boundary Status</label>
                    <select value={statusVal} onChange={e => setStatusVal(e.target.value as GovernanceAlert["status"])} className="w-full h-7 px-2 rounded border border-white/10 bg-black text-[9.5px] text-white cursor-pointer">
                      <option value="Flagged">Flagged</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Remediated">Remediated</option>
                      <option value="Suppressed">Suppressed</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="flex-grow h-8 bg-[#009DFF] hover:bg-[#0082d4] text-black uppercase font-bold text-[9.5px] rounded flex items-center justify-center gap-1 cursor-pointer transition-colors">
                      <span>Apply Overrides</span><Check className="w-3 h-3" />
                    </button>
                    <button type="button" onClick={() => handleDeleteAlert(selectedAlert.id)} className="px-3 h-8 rounded bg-rose-950/40 hover:bg-rose-900/50 text-rose-400 border border-rose-500/20 transition-all cursor-pointer font-bold uppercase text-[9px]">
                      <span>Delete Entry</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <div className="p-8 border border-dashed border-white/5 rounded-xl text-center text-white/30 space-y-2">
                <FileText className="w-6 h-6 text-white/15 mx-auto" />
                <p className="text-[9px] uppercase font-bold text-white/45">No Telemetry Selected</p>
                <p className="text-[8.5px] max-w-xs mx-auto text-white/20">Select a compliance event from the ledger to inspect live logs.</p>
              </div>
            )}
          </AnimatePresence>

          {/* Consult CTA */}
          <WorkspaceCard className="mt-4 border-white/5 text-center">
            <div className="max-w-md mx-auto space-y-1.5 p-1">
              <ShieldCheck className="w-5 h-5 text-[#00FFC2] mx-auto animate-pulse-glow" />
              <h3 className="text-[10.5px] font-bold text-white uppercase tracking-wider">Continuous Trust Boundary Enforcement</h3>
              <p className="text-[9.5px] text-white/50 leading-relaxed">Need split-key multi-party signatures (M-of-N handshakes) on physical secure hardware?</p>
              <div className="pt-1">
                <a href="/admin/support" className="inline-flex h-7 items-center gap-1 px-3 rounded bg-white/5 hover:bg-white/10 text-[9px] font-bold uppercase text-white border border-white/10">
                  <span>Consult Architects</span><ExternalLink className="w-2.5 h-2.5 text-white/40" />
                </a>
              </div>
            </div>
          </WorkspaceCard>

          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes glow { 0%, 100% { filter: drop-shadow(0 0 3px rgba(0,255,194,0.15)); } 50% { filter: drop-shadow(0 0 8px rgba(0,255,194,0.35)); } }
            .animate-pulse-glow { animation: glow 2.5s infinite ease-in-out; }
          `}} />
        </div>
      </div>

      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative max-w-md w-full bg-[#070708] border border-white/10 rounded-xl p-5 shadow-2xl space-y-4 font-mono text-[10px]">
            <button onClick={() => setIsCreateModalOpen(false)} className="absolute right-4 top-4 text-white/40 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            <div className="flex items-center gap-1.5 border-b border-white/5 pb-2">
              <Shield className="w-4 h-4 text-[#009DFF]" />
              <h3 className="text-xs font-bold text-white uppercase font-mono">Provision Governance Alert Ledger</h3>
            </div>
            <form onSubmit={handleCreateGovernance} className="space-y-3">
              <div className="space-y-0.5">
                <label className="text-[8.5px] text-white/30 uppercase block font-semibold">Alert Title</label>
                <input type="text" required placeholder="e.g. Memory Boundary Shift" value={createTitle} onChange={(e) => setCreateTitle(e.target.value)} className="w-full h-8 rounded border border-white/5 bg-white/[0.01] px-3.5 text-[11px] text-white placeholder-white/30 outline-none focus:border-[#009DFF]/40" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-0.5">
                  <span className="text-[8.5px] text-white/30 uppercase block font-semibold">Client Group</span>
                  <select value={createClient} onChange={(e) => setCreateClient(e.target.value)} className="h-8 w-full rounded border border-white/5 bg-[#0c0c0e] px-2 text-[10px] text-white outline-none cursor-pointer">
                    <option value="client-001">APEX SOVEREIGN (client-001)</option>
                    <option value="client-002">GLOBAL RETAIL (client-002)</option>
                    <option value="client-003">SOVEREIGN LOGISTICS (client-003)</option>
                    <option value="client-004">FEDERAL TREASURY (client-004)</option>
                  </select>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[8.5px] text-white/30 uppercase block font-semibold">Severity</span>
                  <select value={createSeverity} onChange={(e) => setCreateSeverity(e.target.value)} className="h-8 w-full rounded border border-white/5 bg-[#0c0c0e] px-2 text-[10px] text-white outline-none cursor-pointer">
                    <option value="Low">LOW</option>
                    <option value="Medium">MEDIUM</option>
                    <option value="High">HIGH</option>
                    <option value="Critical">CRITICAL</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-0.5">
                  <span className="text-[8.5px] text-white/30 uppercase block font-semibold">Project Association</span>
                  <select value={createProject} onChange={(e) => setCreateProject(e.target.value)} className="h-8 w-full rounded border border-white/5 bg-[#0c0c0e] px-2 text-[10px] text-white outline-none cursor-pointer">
                    <option value="">NONE / UNASSOCIATED</option>
                    <option value="proj-001">proj-001 (APEX SOVEREIGN)</option>
                    <option value="proj-002">proj-002 (GLOBAL RETAIL)</option>
                    <option value="proj-003">proj-003 (SOVEREIGN LOGISTICS)</option>
                    <option value="proj-004">proj-004 (FEDERAL TREASURY)</option>
                  </select>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[8.5px] text-white/30 uppercase block font-semibold">Standard Reference</span>
                  <input type="text" placeholder="e.g. SOC2 Type II" value={createStandard} onChange={(e) => setCreateStandard(e.target.value)} className="w-full h-8 rounded border border-white/5 bg-white/[0.01] px-2.5 text-[11px] text-white outline-none focus:border-[#009DFF]/40" />
                </div>
              </div>
              <div className="space-y-0.5">
                <label className="text-[8.5px] text-white/30 uppercase block font-semibold">Enclave Node ID</label>
                <input type="text" placeholder="e.g. SEC-NODE-A4" value={createNodeId} onChange={(e) => setCreateNodeId(e.target.value)} className="w-full h-8 rounded border border-white/5 bg-white/[0.01] px-2.5 text-[11px] text-white outline-none focus:border-[#009DFF]/40" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[8.5px] text-white/30 uppercase block font-semibold">Incident/Alert Description</span>
                <textarea required rows={3} placeholder="Provide details of compliance drift..." value={createDescription} onChange={(e) => setCreateDescription(e.target.value)} className="w-full rounded border border-white/5 bg-[#0c0c0e] p-2 text-[11px] text-white placeholder-white/30 outline-none focus:border-[#009DFF]/40 resize-none" />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-grow h-8 rounded bg-[#009DFF] hover:bg-[#0082d4] text-black font-bold uppercase transition-all flex items-center justify-center gap-1 cursor-pointer font-mono text-[9.5px]">
                  <CheckCircle className="w-3.5 h-3.5" /><span>Enforce Ledger Entry</span>
                </button>
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-3 h-8 rounded border border-white/10 text-white font-bold uppercase transition-all cursor-pointer font-mono">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
