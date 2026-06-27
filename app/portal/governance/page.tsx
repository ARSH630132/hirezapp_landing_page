"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ShieldAlert, ShieldCheck, CheckCircle, AlertCircle, FileText, Copy, Search, 
  X, ChevronRight, ChevronDown, Download, Lock, RefreshCw, UserCheck, 
  ThumbsUp, ThumbsDown, Layers, Cpu, SlidersHorizontal, ExternalLink, RotateCcw, Info
} from "lucide-react";
import { WorkspaceCard, StatusBadge } from "@/components/private-app";

const generateToastId = () => {
  return Math.random().toString(36).substring(2, 9);
};

interface PolicyItem {
  id: string;
  name: string;
  standard: "ISO-27001" | "SOC2 Type II" | "HIPAA" | "GDPR Enclave" | "NIST AI RMF";
  status: "compliant" | "warning" | "critical";
  severity: "high" | "medium" | "low";
  projectId: string;
  projectName: string;
  agentId: string;
  agentName: string;
  desc: string;
  lastChecked: string;
  logs: string[];
}

interface OversightItem {
  id: string;
  title: string;
  project: string;
  projectId: string;
  agent: string;
  agentId: string;
  requester: string;
  status: "pending" | "approved" | "rejected";
  severity: "high" | "medium" | "low";
  requestDate: string;
  category: "Access Elevation" | "Model Boundary Shift" | "HSM Seal Rollover";
  desc: string;
}

interface DocItem {
  id: string;
  name: string;
  size: string;
  format: "PDF" | "YAML" | "CSV";
  projectId: string;
  projectName: string;
  agentId: string;
  agentName: string;
  status: "compliant" | "warning";
  hash: string;
  uploadedAt: string;
  category: "audit" | "governance";
  clearanceLevel: string;
}

export default function ClientGovernancePage() {
  // -----------------------------------------------------------------------------
  // MOCK DATASETS (Enriched with project, agent, status, and severity)
  // -----------------------------------------------------------------------------
  const [policies, setPolicies] = useState<PolicyItem[]>([
    {
      id: "GOV-27001-A",
      name: "ISO-27001 Key Hygiene",
      standard: "ISO-27001",
      status: "compliant",
      severity: "high",
      projectId: "proj-001",
      projectName: "Sovereign Core Sandbox 02",
      agentId: "agent-001",
      agentName: "RETAIL-CORE-A1",
      desc: "Enforces 30-day automatic key rotation inside isolated HSM pools to ensure credential isolation.",
      lastChecked: "11:00 AM",
      logs: [
        "Initializing key rotation handshake with hardware module...",
        "Cryptographic root keys verified via zero-knowledge proof.",
        "Rotation completed successfully. Signature logged."
      ]
    },
    {
      id: "GOV-SOC2-B",
      name: "eBPF Host Isolation Gate",
      standard: "SOC2 Type II",
      status: "compliant",
      severity: "high",
      projectId: "proj-001",
      projectName: "Sovereign Core Sandbox 02",
      agentId: "agent-001",
      agentName: "RETAIL-CORE-A1",
      desc: "Kernel-level monitoring ensuring sandbox containers cannot inspect host memory.",
      lastChecked: "11:30 AM",
      logs: [
        "Streaming eBPF ring buffer events...",
        "Verifying isolation: Host syscall table locked.",
        "No boundary leaks detected in current epoch."
      ]
    },
    {
      id: "GOV-NIST-C",
      name: "Sovereign Compliance Model Audit Range",
      standard: "NIST AI RMF",
      status: "warning",
      severity: "medium",
      projectId: "proj-002",
      projectName: "Model Guardrail Sandbox 04",
      agentId: "agent-002",
      agentName: "ALIGN-GUARD-A2",
      desc: "Continuous filtering log stream audits. Warning: Telemetry storage approaching threshold.",
      lastChecked: "10:15 AM",
      logs: [
        "Analyzing prompt distribution...",
        "Telemetry logs approaching local warning threshold (88%).",
        "Action: Trigger compression / archival routines."
      ]
    },
    {
      id: "GOV-HIPAA-D",
      name: "Patient Identity Sandbox Redact",
      standard: "HIPAA",
      status: "compliant",
      severity: "high",
      projectId: "proj-001",
      projectName: "Sovereign Core Sandbox 02",
      agentId: "agent-004",
      agentName: "MED-CLINIC-H9",
      desc: "Cryptographically redacts high-risk fields inside secure enclave boundaries.",
      lastChecked: "09:00 AM",
      logs: [
        "Intercepted clinical payload...",
        "PII fields redacted successfully."
      ]
    },
    {
      id: "GOV-EXEC-F",
      name: "Thread Leak-Gate Monitor",
      standard: "NIST AI RMF",
      status: "critical",
      severity: "high",
      projectId: "proj-001",
      projectName: "Sovereign Core Sandbox 02",
      agentId: "agent-004",
      agentName: "MED-CLINIC-H9",
      desc: "Monitors context thread limits. CPU threshold exceeded safe boundary limit.",
      lastChecked: "11:58 AM",
      logs: [
        "Core utilization spike (94.5%).",
        "Alert: Manual scale-out recommended."
      ]
    }
  ]);

  const [oversights, setOversights] = useState<OversightItem[]>([
    {
      id: "OVS-01",
      title: "Temporary Level IV Clearance",
      project: "Sovereign Core Sandbox 02",
      projectId: "proj-001",
      agent: "RETAIL-CORE-A1",
      agentId: "agent-001",
      requester: "Apex Group",
      status: "pending",
      severity: "high",
      requestDate: "2026-06-27T11:15:00Z",
      category: "Access Elevation",
      desc: "Context elevation request to inspect active HSM enclave raw decryption socket."
    },
    {
      id: "OVS-02",
      title: "Adjust Alignment Threshold",
      project: "Model Guardrail Sandbox 04",
      projectId: "proj-002",
      agent: "ALIGN-GUARD-A2",
      agentId: "agent-002",
      requester: "Alexander Mercer",
      status: "pending",
      severity: "medium",
      requestDate: "2026-06-27T10:45:00Z",
      category: "Model Boundary Shift",
      desc: "Approve shifting semantic boundary from 0.85 to 0.75 for geological analysis."
    },
    {
      id: "OVS-03",
      title: "HSM Key Manual Key Rollover",
      project: "Sovereign Core Sandbox 02",
      projectId: "proj-001",
      agent: "RETAIL-CORE-A1",
      agentId: "agent-001",
      requester: "Dr. Sarah Vance",
      status: "approved",
      severity: "high",
      requestDate: "2026-06-25T09:00:00Z",
      category: "HSM Seal Rollover",
      desc: "Manual signature to roll cryptographic keys and resolve interlock timers."
    }
  ]);

  const [documents, setDocuments] = useState<DocItem[]>([
    {
      id: "DOC-01",
      name: "ISO27001_Sandbox_Audit.pdf",
      size: "4.8 MB",
      format: "PDF",
      projectId: "proj-001",
      projectName: "Sovereign Core Sandbox 02",
      agentId: "agent-001",
      agentName: "RETAIL-CORE-A1",
      status: "compliant",
      hash: "0x8FDE3102C130D7B2D26788AB0E8A850CE3207FFCDE10B74E824A45B12A4F23AA",
      uploadedAt: "2026-05-12",
      category: "audit",
      clearanceLevel: "LEVEL_III"
    },
    {
      id: "DOC-02",
      name: "Ruleset_SOC2_Compliance.yaml",
      size: "24 KB",
      format: "YAML",
      projectId: "proj-002",
      projectName: "Model Guardrail Sandbox 04",
      agentId: "agent-002",
      agentName: "ALIGN-GUARD-A2",
      status: "compliant",
      hash: "0x3FBC128EE809FF9CC9810A88AA11B8FFFA02CE8274A08B0192A45C89FBC10492",
      uploadedAt: "2026-06-01",
      category: "governance",
      clearanceLevel: "LEVEL_IV"
    }
  ]);

  // Filters State
  const [selProj, setSelProj] = useState("");
  const [selAgent, setSelAgent] = useState("");
  const [selStatus, setSelStatus] = useState("");
  const [selSeverity, setSelSeverity] = useState("");
  const [search, setSearch] = useState("");

  const [tab, setTab] = useState<"pols" | "oversight" | "docs">("pols");
  const [expId, setExpId] = useState<string | null>("GOV-27001-A");
  const [step, setStep] = useState("step-4");
  const [toasts, setToasts] = useState<{ id: string; msg: string; type: "success" | "info" | "warning" }[]>([]);
  const [verId, setVerId] = useState<string | null>(null);
  const [expIdDoc, setExpIdDoc] = useState<string | null>(null);

  const triggerToast = (msg: string, type: "success" | "info" | "warning" = "success") => {
    const id = generateToastId();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  // Dynamic filter application across all categories
  const filteredPols = policies.filter(p => {
    if (selProj && p.projectId !== selProj) return false;
    if (selAgent && p.agentId !== selAgent) return false;
    if (selStatus && p.status !== selStatus) return false;
    if (selSeverity && p.severity !== selSeverity) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const filteredOversights = oversights.filter(o => {
    if (selProj && o.projectId !== selProj) return false;
    if (selAgent && o.agentId !== selAgent) return false;
    if (selStatus && o.status !== selStatus) return false;
    if (selSeverity && o.severity !== selSeverity) return false;
    if (search && !o.title.toLowerCase().includes(search.toLowerCase()) && !o.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const filteredDocs = documents.filter(d => {
    if (selProj && d.projectId !== selProj) return false;
    if (selAgent && d.agentId !== selAgent) return false;
    if (selSeverity && d.clearanceLevel !== selSeverity) return false;
    if (search && !d.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // Extract select options dynamically
  const projectOptions = Array.from(new Set([
    ...policies.map(p => JSON.stringify({ id: p.projectId, name: p.projectName })),
    ...oversights.map(a => JSON.stringify({ id: a.projectId, name: a.project })),
    ...documents.map(d => JSON.stringify({ id: d.projectId, name: d.projectName }))
  ])).map(str => JSON.parse(str)) as { id: string; name: string }[];

  const agentOptions = Array.from(new Set([
    ...policies.map(p => JSON.stringify({ id: p.agentId, name: p.agentName })),
    ...oversights.map(a => JSON.stringify({ id: a.agentId, name: a.agent })),
    ...documents.map(d => JSON.stringify({ id: d.agentId, name: d.agentName }))
  ])).map(str => JSON.parse(str)) as { id: string; name: string }[];

  // Calculate dynamic trust index in real time
  const criticalCount = policies.filter(p => p.status === "critical").length;
  const warningCount = policies.filter(p => p.status === "warning").length;
  const pendingCount = oversights.filter(o => o.status === "pending").length;
  const approvedCount = oversights.filter(o => o.status === "approved").length;
  const trustScore = Math.min(100, Math.max(0, 99 - (criticalCount * 7.5) - (warningCount * 3) - (pendingCount * 1.5) + (approvedCount * 0.8))).toFixed(1);

  const resetAll = () => {
    setSelProj(""); setSelAgent(""); setSelStatus(""); setSelSeverity(""); setSearch("");
    triggerToast("Filters cleared", "info");
  };

  // Enclave Handshake Simulations
  const handleVerify = (id: string) => {
    if (verId) return;
    setVerId(id);
    triggerToast(`Cryptographic handshake check running for ${id}...`, "info");
    setTimeout(() => {
      setPolicies(prev => prev.map(p => p.id === id ? { ...p, status: "compliant", logs: [`[${new Date().toLocaleTimeString()}] RE-VERIFIED: Validated via hardware proof.`, ...p.logs] } : p));
      setVerId(null);
      triggerToast(`Boundary verified: ${id} is locked and fully compliant.`, "success");
    }, 1200);
  };

  const handleResolveOversight = (id: string, state: "approved" | "rejected") => {
    setOversights(prev => prev.map(o => o.id === id ? { ...o, status: state } : o));
    if (state === "approved") triggerToast(`Signature committed. Interlock ${id} approved.`, "success");
    else triggerToast(`Interlock request ${id} rejected by client keys.`, "warning");
  };

  const handleDocExport = (id: string) => {
    if (expIdDoc) return;
    setExpIdDoc(id);
    triggerToast(`Compiling signed attestation file for ${id}...`, "info");
    setTimeout(() => {
      setExpIdDoc(null);
      triggerToast(`Certified file package compiled and downloaded successfully.`, "success");
    }, 1500);
  };

  const steps = [
    { id: "step-1", title: "1. Prompt Ingress Node", val: "0.4ms latency", desc: "Inference transaction streams are parsed inside localized secure process loops." },
    { id: "step-2", title: "2. Guardrail Interceptor", val: "99.8% pass rate", desc: "Validates payload streams against active compliance rulesets and redacts PII." },
    { id: "step-3", title: "3. Isolated Secure Enclave", val: "AMD SEV Locked", desc: "Executes model operations inside physically decoupled memory enclaves." },
    { id: "step-4", title: "4. Human Oversight Interlock", val: `${pendingCount} Pending Sign`, desc: "Sensitive boundary actions pause at hardware layer awaiting administrator credentials." },
    { id: "step-5", title: "5. Sealed State Ledger", val: "SHA-256 Verified", desc: "Logs physical transactions into an immutable, client-managed auditing ledger." }
  ];

  return (
    <div className="space-y-6 max-w-[1700px] mx-auto pb-16 animate-slide-up select-none">
      
      {/* Disclaimer Notice */}
      <div className="border border-[#009DFF]/20 bg-[#009DFF]/5 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-[11px] leading-relaxed">
        <div className="flex items-start gap-2.5 text-white/80">
          <ShieldAlert className="w-5 h-5 text-[#009DFF] shrink-0 mt-0.5" />
          <span>
            <strong className="text-white">WORKFLOW COMPANION SYSTEM:</strong> This interface is <strong className="text-[#009DFF]">designed to support governance workflows</strong>. All assertions, guardrails, and compliance logs are simulated sandbox boundaries built to assist your auditing processes, and do not constitute formal legal or regulatory guarantees.
          </span>
        </div>
        <span className="text-[9px] text-[#009DFF]/90 font-bold bg-[#009DFF]/15 border border-[#009DFF]/30 px-2 py-0.5 rounded uppercase tracking-wider shrink-0 font-mono">
          SUPPORT ACTIVE
        </span>
      </div>

      {/* Page Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-white/5 pb-5 select-none font-mono">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white uppercase">Sovereign Governance</h1>
            <span className="inline-flex rounded bg-[#00FFC2]/10 border border-[#00FFC2]/20 px-1.5 py-0.5 text-[9px] font-bold uppercase text-[#00FFC2]">
              LOCKED STATE
            </span>
          </div>
          <p className="text-[12px] text-white/50 mt-1">
            Real-time telemetry, automated guardrail verification blocks, human interlock points, and certified document audit records.
          </p>
        </div>
        <div className="text-[10px] text-white/45 bg-white/[0.01] border border-white/5 px-2.5 py-1.5 rounded-lg">
          Enclave Epoch: <span className="text-white font-bold font-mono">2026.E3</span>
        </div>
      </div>

      {/* Bento Grid: Metrics and Interceptor Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Metric Cards */}
        <div className="flex flex-col gap-4">
          <WorkspaceCard className="flex flex-col justify-between h-[105px] border-[#00FFC2]/10">
            <div className="flex justify-between items-start font-mono text-[10px]">
              <span className="text-white/45 uppercase tracking-wider">Dynamic Trust Index</span>
              <StatusBadge state="active" label="continuous check" />
            </div>
            <div className="flex items-end justify-between mt-1 font-mono">
              <div className="text-3xl font-bold text-white font-mono">{trustScore}%</div>
              <span className="text-[9.5px] text-emerald-400 flex items-center gap-1">
                Optimized <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </span>
            </div>
          </WorkspaceCard>

          <WorkspaceCard className="flex flex-col justify-between h-[105px]">
            <div className="flex justify-between items-start font-mono text-[10px]">
              <span className="text-white/45 uppercase tracking-wider">AI Guardrails & Policies</span>
              <span className="text-[#009DFF] bg-[#009DFF]/10 px-1.5 py-0.5 rounded border border-[#009DFF]/20">ACTIVE</span>
            </div>
            <div className="flex items-end justify-between mt-1 font-mono">
              <div className="text-3xl font-bold text-white">{policies.length}</div>
              <span className="text-[9.5px] text-white/40">
                {policies.filter(p => p.status === "compliant").length} Safe • {policies.filter(p => p.status !== "compliant").length} Alerts
              </span>
            </div>
          </WorkspaceCard>

          <WorkspaceCard className={`flex flex-col justify-between h-[105px] transition-all ${pendingCount > 0 ? "border-amber-500/20 bg-amber-500/[0.01]" : ""}`}>
            <div className="flex justify-between items-start font-mono text-[10px]">
              <span className="text-white/45 uppercase tracking-wider">Pending Interlocks</span>
              {pendingCount > 0 ? (
                <span className="text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20 animate-pulse">SIGN REQUIRED</span>
              ) : (
                <span className="text-white/30">ALL SIGNED</span>
              )}
            </div>
            <div className="flex items-end justify-between mt-1 font-mono">
              <div className="text-3xl font-bold text-white">{pendingCount}</div>
              <span className="text-[9.5px] text-white/40">Awaiting client credentials</span>
            </div>
          </WorkspaceCard>
        </div>

        {/* Dynamic Topology Flow Diagram */}
        <div className="lg:col-span-2">
          <div className="p-5 rounded-2xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm flex flex-col md:flex-row gap-5 items-stretch h-full">
            <style dangerouslySetInnerHTML={{ __html: `
              @keyframes flow { to { stroke-dashoffset: -20; } }
              .animate-flow-line { stroke-dasharray: 6, 4; animation: flow 1.1s linear infinite; }
            `}} />

            <div className="flex-grow flex flex-col justify-between gap-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <div className="flex items-center gap-1.5 font-mono text-[11px]">
                  <Layers className="w-3.5 h-3.5 text-[#009DFF]" />
                  <span className="font-bold text-white uppercase tracking-wider">Enclave Interceptor Pipeline</span>
                </div>
                <span className="text-[9px] font-mono text-white/30 uppercase">Topology</span>
              </div>

              <div className="grid grid-cols-5 gap-2 relative py-4 select-none">
                <div className="absolute top-[34px] left-[10%] right-[10%] h-[2px] z-0 hidden sm:block">
                  <svg className="w-full h-[2px] overflow-visible">
                    <line x1="0" y1="1" x2="100%" y2="1" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
                    <line x1="0" y1="1" x2="100%" y2="1" stroke="#00FFC2" strokeWidth="1.5" className="animate-flow-line opacity-25" />
                  </svg>
                </div>

                {steps.map((st, idx) => {
                  const isActive = step === st.id;
                  const clr = 
                    st.id === "step-1" ? "border-sky-500/10 text-sky-400" :
                    st.id === "step-2" ? "border-cyan-500/10 text-cyan-400" :
                    st.id === "step-3" ? "border-violet-500/10 text-violet-400" :
                    st.id === "step-4" ? "border-amber-500/10 text-amber-400" : "border-emerald-500/10 text-emerald-400";
                  
                  const activeStyle = isActive 
                    ? "shadow-[0_0_12px_rgba(255,255,255,0.02)] border-white/20 bg-white/[0.02] scale-102" 
                    : "bg-black/45 hover:border-white/10";

                  return (
                    <button 
                      key={st.id} 
                      onClick={() => setStep(st.id)}
                      className={`z-10 flex flex-col items-center gap-1.5 p-1.5 rounded-xl border transition-all cursor-pointer ${clr} ${activeStyle}`}
                    >
                      <div className={`w-8.5 h-8.5 rounded-full flex items-center justify-center border transition-all ${isActive ? "border-current bg-white/[0.01]" : "border-white/5"}`}>
                        {st.id === "step-1" && <Cpu className="w-3.5 h-3.5" />}
                        {st.id === "step-2" && <ShieldCheck className="w-3.5 h-3.5" />}
                        {st.id === "step-3" && <Lock className="w-3.5 h-3.5" />}
                        {st.id === "step-4" && <UserCheck className="w-3.5 h-3.5" />}
                        {st.id === "step-5" && <FileText className="w-3.5 h-3.5" />}
                      </div>
                      <div className="text-center font-mono select-none">
                        <span className="block text-[7.5px] uppercase text-white/30">Node 0{idx+1}</span>
                        <span className="hidden sm:inline-block font-bold text-[8.5px] mt-0.5 truncate max-w-[60px] text-white/80">{st.id === "step-1" ? "Ingress" : st.id === "step-2" ? "Guardrail" : st.id === "step-3" ? "Enclave" : st.id === "step-4" ? "Oversight" : "Ledger"}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Node Telemetry Details card */}
            <div className="w-full md:w-[240px] shrink-0 p-3.5 rounded-xl border border-white/5 bg-[#020202]/80 flex flex-col justify-between font-mono text-xs select-text">
              {(() => {
                const info = steps.find(s => s.id === step) || steps[0];
                return (
                  <div className="space-y-3 h-full flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <span className="text-[8px] text-[#009DFF] font-bold tracking-wider uppercase">REALTIME METRICS</span>
                      <p className="text-white font-bold text-[11px] leading-tight">{info.title}</p>
                      
                      <div className="flex items-center gap-1.5 py-0.5 px-2 rounded bg-white/[0.02] border border-white/5 text-[9px]">
                        <span className={`w-1 h-1 rounded-full ${step === "step-4" && pendingCount > 0 ? "bg-amber-400" : "bg-green-400"}`} />
                        <span className="text-white/40">Status:</span>
                        <span className={`font-bold ${step === "step-4" && pendingCount > 0 ? "text-amber-400" : "text-green-400"}`}>{info.val}</span>
                      </div>
                      <p className="text-[10px] text-white/50 leading-normal pt-1">{info.desc}</p>
                    </div>
                    
                    <div className="text-[8px] text-white/30 border-t border-white/5 pt-1.5 flex items-center gap-1 select-none">
                      <Lock className="w-3 h-3 text-[#00FFC2]" />
                      <span>Mathematical boundary verified</span>
                    </div>
                  </div>
                );
              })()}
            </div>

          </div>
        </div>

      </div>

      {/* Dynamic Filters panel */}
      <div className="p-4 rounded-xl border border-white/5 bg-[#070707]/60 backdrop-blur-sm space-y-3 font-mono">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-white/50" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Workspace Filters</h3>
          </div>
          {(selProj || selAgent || selStatus || selSeverity || search) && (
            <button onClick={resetAll} className="flex items-center gap-1 text-[10px] text-amber-500 hover:text-amber-400 cursor-pointer">
              <RotateCcw className="w-3 h-3" /> Reset Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          <div>
            <label className="block text-[8px] text-white/40 uppercase mb-0.5">Project Target</label>
            <select 
              value={selProj} 
              onChange={(e) => { setSelProj(e.target.value); triggerToast("Filter: Project target updated", "info"); }}
              className="w-full h-8.5 rounded-lg border border-white/5 bg-white/[0.02] px-2.5 text-[10.5px] text-white/80 focus:text-white outline-none cursor-pointer appearance-none"
            >
              <option value="" className="bg-[#0c0c0c] text-white/40">ALL PROJECTS</option>
              {projectOptions.map(p => <option key={p.id} value={p.id} className="bg-[#0c0c0c] text-white">{p.name.toUpperCase()}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[8px] text-white/40 uppercase mb-0.5">Sovereign Agent</label>
            <select 
              value={selAgent} 
              onChange={(e) => { setSelAgent(e.target.value); triggerToast("Filter: Agent target updated", "info"); }}
              className="w-full h-8.5 rounded-lg border border-white/5 bg-white/[0.02] px-2.5 text-[10.5px] text-white/80 focus:text-white outline-none cursor-pointer appearance-none"
            >
              <option value="" className="bg-[#0c0c0c] text-white/40">ALL AGENTS</option>
              {agentOptions.map(a => <option key={a.id} value={a.id} className="bg-[#0c0c0c] text-white">{a.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[8px] text-white/40 uppercase mb-0.5">Compliance State</label>
            <select 
              value={selStatus} 
              onChange={(e) => { setSelStatus(e.target.value); triggerToast("Filter: State updated", "info"); }}
              className="w-full h-8.5 rounded-lg border border-white/5 bg-white/[0.02] px-2.5 text-[10.5px] text-white/80 focus:text-white outline-none cursor-pointer appearance-none"
            >
              <option value="" className="bg-[#0c0c0c] text-white/40">ALL STATES</option>
              <option value="compliant" className="bg-[#0c0c0c] text-green-400">COMPLIANT</option>
              <option value="warning" className="bg-[#0c0c0c] text-amber-400">WARNING ALERT</option>
              <option value="critical" className="bg-[#0c0c0c] text-red-400">CRITICAL FAULT</option>
            </select>
          </div>

          <div>
            <label className="block text-[8px] text-white/40 uppercase mb-0.5">Risk Severity</label>
            <select 
              value={selSeverity} 
              onChange={(e) => { setSelSeverity(e.target.value); triggerToast("Filter: Severity updated", "info"); }}
              className="w-full h-8.5 rounded-lg border border-white/5 bg-white/[0.02] px-2.5 text-[10.5px] text-white/80 focus:text-white outline-none cursor-pointer appearance-none"
            >
              <option value="" className="bg-[#0c0c0c] text-white/40">ALL SEVERITIES</option>
              <option value="high" className="bg-[#0c0c0c] text-red-400 font-bold">HIGH RISK</option>
              <option value="medium" className="bg-[#0c0c0c] text-amber-400">MEDIUM RISK</option>
              <option value="low" className="bg-[#0c0c0c] text-blue-400">LOW RISK</option>
            </select>
          </div>

          <div>
            <label className="block text-[8px] text-white/40 uppercase mb-0.5">Log Search</label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 w-3.5 h-3.5 text-white/35 font-mono" />
              <input 
                type="text" 
                value={search} 
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search rule standard or ID..."
                className="w-full h-8.5 rounded-lg border border-white/5 bg-white/[0.02] pl-7.5 pr-7 text-[10.5px] text-white outline-none focus:border-white/10"
              />
              {search && <X className="absolute right-2 top-2.5 w-3.5 h-3.5 text-white/40 cursor-pointer font-mono" onClick={() => setSearch("")} />}
            </div>
          </div>

        </div>
      </div>

      {/* Tabs list */}
      <div className="space-y-4 font-mono">
        <div className="flex border-b border-white/5 gap-6 select-none text-xs">
          <button onClick={() => setTab("pols")} className={`py-2 font-bold uppercase transition-all relative flex items-center gap-1.5 cursor-pointer ${tab === "pols" ? "text-white" : "text-white/40 hover:text-white/70"}`}>
            <span>AI Checks & Policies</span>
            <span className="px-1 rounded text-[9px] bg-white/5 text-white/50">{filteredPols.length}</span>
            {tab === "pols" && <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#00FFC2]" />}
          </button>
          
          <button onClick={() => setTab("oversight")} className={`py-2 font-bold uppercase transition-all relative flex items-center gap-1.5 cursor-pointer ${tab === "oversight" ? "text-white" : "text-white/40 hover:text-white/70"}`}>
            <span>Human Oversight Interlocks</span>
            <span className={`px-1 rounded text-[9px] ${pendingCount > 0 ? "bg-amber-400/10 text-amber-500" : "bg-white/5 text-white/50"}`}>{filteredOversights.length}</span>
            {tab === "oversight" && <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#00FFC2]" />}
          </button>

          <button onClick={() => setTab("docs")} className={`py-2 font-bold uppercase transition-all relative flex items-center gap-1.5 cursor-pointer ${tab === "docs" ? "text-white" : "text-white/40 hover:text-white/70"}`}>
            <span>Document Ledger</span>
            <span className="px-1 rounded text-[9px] bg-white/5 text-white/50">{filteredDocs.length}</span>
            {tab === "docs" && <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#00FFC2]" />}
          </button>
        </div>

        {/* Tab interiors */}
        <div className="space-y-3 font-mono">
          
          {tab === "pols" && (
            <div className="space-y-3">
              {filteredPols.length === 0 ? (
                <div className="p-10 border border-dashed border-white/5 rounded-2xl text-center max-w-md mx-auto space-y-2">
                  <ShieldAlert className="w-6 h-6 text-white/20 mx-auto" />
                  <p className="text-white font-bold text-xs">NO POLICIES MATCH FILTERS</p>
                  <p className="text-white/40 text-[10px]">Try adjusting your active workspace filters.</p>
                </div>
              ) : (
                filteredPols.map(policy => {
                  const isExp = expId === policy.id;
                  return (
                    <div key={policy.id} className={`rounded-xl border transition-all ${isExp ? "border-white/10 bg-white/[0.02]" : "border-white/5 bg-[#050505]/20"}`}>
                      <div onClick={() => setExpId(isExp ? null : policy.id)} className="p-3.5 flex items-center justify-between gap-3 cursor-pointer text-xs select-none">
                        <div className="flex items-center gap-2.5 min-w-0">
                          {policy.status === "compliant" ? <CheckCircle className="w-4 h-4 text-[#00FFC2] shrink-0" /> : policy.status === "warning" ? <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" /> : <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />}
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] text-white/40 font-bold shrink-0">{policy.id}</span>
                              <span className="text-white font-bold truncate">{policy.name}</span>
                              <span className={`text-[8.5px] px-1 border rounded shrink-0 ${policy.severity === "high" ? "text-red-400 border-red-500/10 bg-red-500/5" : "text-amber-400 border-amber-500/10 bg-amber-500/5"}`}>{policy.severity.toUpperCase()}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 text-[9.5px] text-white/45 flex-wrap">
                              <span>Std: <strong className="text-white/70">{policy.standard}</strong></span>
                              <span>•</span>
                              <span>Project: <strong className="text-white/70">{policy.projectName}</strong></span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className={`text-[9px] font-bold uppercase ${policy.status === "compliant" ? "text-[#00FFC2]" : "text-amber-400"}`}>{policy.status.toUpperCase()}</span>
                          {isExp ? <ChevronDown className="w-4 h-4 text-white/40" /> : <ChevronRight className="w-4 h-4 text-white/40" />}
                        </div>
                      </div>

                      {isExp && (
                        <div className="px-3.5 pb-4.5 border-t border-white/5 pt-3.5 text-xs text-white/80 space-y-3 select-text">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="md:col-span-2 p-3 rounded-lg border border-white/5 bg-[#020202]/60">
                              <span className="text-[8.5px] text-[#009DFF] font-bold uppercase block mb-1">Enforcement Boundary Spec</span>
                              <p className="text-[11px] leading-relaxed text-white/70">{policy.desc}</p>
                            </div>
                            <div className="p-3 rounded-lg border border-white/5 bg-[#020202]/60 flex flex-col justify-between">
                              <div className="text-[10px] space-y-0.5 text-white/60 mb-2">
                                <div className="flex justify-between"><span>Audit Scope:</span> <span className="text-white">{policy.agentName}</span></div>
                                <div className="flex justify-between"><span>Last Checked:</span> <span className="text-white">{policy.lastChecked}</span></div>
                              </div>
                              <button 
                                onClick={() => handleVerify(policy.id)} 
                                disabled={verId !== null}
                                className="w-full h-7.5 rounded bg-white/5 hover:bg-white/10 text-[10px] font-bold uppercase text-white border border-white/10 flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40"
                              >
                                {verId === policy.id ? <RefreshCw className="w-3 h-3 animate-spin text-[#00FFC2]" /> : <ShieldCheck className="w-3.5 h-3.5 text-[#00FFC2]" />}
                                {verId === policy.id ? "Checking..." : "Recheck Boundary"}
                              </button>
                            </div>
                          </div>

                          <div className="space-y-1 bg-[#020202] p-3 rounded-lg border border-white/5">
                            <div className="flex justify-between text-[8px] text-white/35 font-bold uppercase pb-1 border-b border-white/5">
                              <span>Secure Telemetry Log Stream</span>
                              <span>Enclave Assertions</span>
                            </div>
                            <div className="space-y-1 max-h-[100px] overflow-y-auto text-[10px] text-white/60 pt-1.5 select-text">
                              {policy.logs.map((log, idx) => (
                                <div key={idx} className="truncate"><span className="text-[#009DFF]">&gt;</span> {log}</div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {tab === "oversight" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredOversights.length === 0 ? (
                <div className="col-span-full p-10 border border-dashed border-white/5 rounded-2xl text-center max-w-md mx-auto space-y-2">
                  <UserCheck className="w-6 h-6 text-white/20 mx-auto" />
                  <p className="text-white font-bold text-xs">NO INTERLOCKS REQUIRING ATTENTION</p>
                  <p className="text-white/40 text-[10px]">All human oversight points are verified and signed off.</p>
                </div>
              ) : (
                filteredOversights.map(item => (
                  <div key={item.id} className="p-4 rounded-xl border border-white/5 bg-[#050505]/40 flex flex-col justify-between gap-3 text-xs leading-relaxed">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="text-[8px] text-[#009DFF] font-bold uppercase block">{item.category} • {item.id}</span>
                          <h4 className="text-[12px] font-bold text-white select-text">{item.title}</h4>
                        </div>
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border uppercase ${item.status === "pending" ? "text-amber-400 border-amber-400/20 bg-amber-400/5 animate-pulse" : "text-green-400 border-green-500/20 bg-green-500/5"}`}>{item.status}</span>
                      </div>
                      <p className="text-[10px] text-white/50 pt-1 select-text">{item.desc}</p>
                      <div className="text-[9.5px] text-white/40 space-y-0.5 bg-black/40 p-2 rounded border border-white/5 select-text">
                        <div>Scope: <strong className="text-white/70">{item.project}</strong></div>
                        <div>Requester: <strong className="text-white/70">{item.requester}</strong></div>
                      </div>
                    </div>

                    {item.status === "pending" ? (
                      <div className="grid grid-cols-2 gap-2 pt-1 select-none">
                        <button onClick={() => handleResolveOversight(item.id, "rejected")} className="h-7.5 rounded border border-red-500/20 hover:border-red-500/30 text-[9.5px] font-bold text-red-400 flex items-center justify-center gap-1 cursor-pointer">
                          <ThumbsDown className="w-3 h-3" /> Decline
                        </button>
                        <button onClick={() => handleResolveOversight(item.id, "approved")} className="h-7.5 rounded bg-[#00FFC2] hover:bg-[#00e0aa] text-[#020202] text-[9.5px] font-bold flex items-center justify-center gap-1 cursor-pointer">
                          <ThumbsUp className="w-3 h-3" /> Sign & Approve
                        </button>
                      </div>
                    ) : (
                      <div className="text-[9px] text-white/35 pt-1 flex items-center gap-1.5 select-none border-t border-white/5">
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Approved. Request handshake sealed with HSM token.</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {tab === "docs" && (
            <div className="space-y-2">
              {filteredDocs.length === 0 ? (
                <div className="p-10 border border-dashed border-white/5 rounded-2xl text-center max-w-md mx-auto space-y-2">
                  <FileText className="w-6 h-6 text-white/20 mx-auto" />
                  <p className="text-white font-bold text-xs">NO DOCUMENTS MATCH FILTERS</p>
                  <p className="text-white/40 text-[10px]">No active governance documents match your selections.</p>
                </div>
              ) : (
                filteredDocs.map(doc => (
                  <div key={doc.id} className="p-3 rounded-xl border border-white/5 bg-[#050505]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded bg-white/[0.02] border border-white/5 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-white/50" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-white text-[12px] truncate select-text">{doc.name}</span>
                          <span className="text-[8.5px] px-1.5 py-0.2 rounded bg-white/5 border border-white/10 text-white/50">{doc.format}</span>
                          <span className="text-[8px] px-1.5 py-0.2 rounded bg-[#009DFF]/10 border border-[#009DFF]/20 text-[#009DFF]">{doc.clearanceLevel}</span>
                        </div>
                        <div className="text-[9.5px] text-white/40 mt-0.5">Size: {doc.size} • Category: {doc.category.toUpperCase()}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button 
                        onClick={() => { navigator.clipboard.writeText(doc.hash); triggerToast("Hash seal copied", "success"); }}
                        className="h-7.5 rounded bg-black border border-white/5 hover:border-white/10 px-2 text-[9.5px] text-white/50 hover:text-white flex items-center gap-1 cursor-pointer"
                        title="Copy hash seal"
                      >
                        <Lock className="w-3 h-3 text-[#00FFC2]" />
                        <span>{doc.hash.substring(0, 8)}...</span>
                        <Copy className="w-3 h-3 text-white/30" />
                      </button>

                      <button 
                        onClick={() => handleDocExport(doc.id)} 
                        disabled={expIdDoc !== null}
                        className="h-7.5 px-3 rounded bg-white/5 hover:bg-white/10 text-[9.5px] font-bold uppercase text-white border border-white/10 flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40"
                      >
                        {expIdDoc === doc.id ? <RefreshCw className="w-3 h-3 animate-spin text-[#00FFC2]" /> : <Download className="w-3 h-3" />}
                        {expIdDoc === doc.id ? "Compiling..." : "Export"}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>
      </div>

      {/* Consult CTA */}
      <WorkspaceCard className="mt-6 border-[#009DFF]/10 text-center font-mono">
        <div className="max-w-xl mx-auto space-y-2.5 p-1">
          <ShieldCheck className="w-6 h-6 text-[#00FFC2] mx-auto animate-pulse-glow" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Custom Enclave Architecture</h3>
          <p className="text-[11px] text-white/50 leading-relaxed max-w-lg mx-auto">
            Do your operations require hardware interlock integrations, custom security rulebooks, or physical HSM configurations? Our sovereign systems support custom governance.
          </p>
          <div className="pt-1.5">
            <Link href="/portal/support" className="inline-flex h-8 items-center gap-1 px-3 rounded bg-white/5 hover:bg-white/10 text-[10px] font-bold uppercase text-white border border-white/10 transition-colors">
              <span>Consult Sovereign Architects</span>
              <ExternalLink className="w-3.5 h-3.5 text-white/40" />
            </Link>
          </div>
        </div>
      </WorkspaceCard>

      {/* Toast Notifications */}
      <div className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-50 flex flex-col gap-2 pointer-events-none select-none font-mono">
        {toasts.map(t => (
          <div 
            key={t.id} 
            className={`p-3 rounded-xl shadow-2xl border text-[10px] font-bold flex items-center gap-2.5 pointer-events-auto max-w-xs animate-slide-up ${
              t.type === "success" ? "bg-black border-[#00FFC2]/30 text-[#00FFC2] shadow-[0_4px_15px_rgba(0,255,194,0.1)]" :
              t.type === "warning" ? "bg-black border-amber-500/30 text-amber-500 shadow-[0_4px_15px_rgba(245,158,11,0.1)]" :
              "bg-black border-[#009DFF]/30 text-[#009DFF] shadow-[0_4px_15px_rgba(0,157,255,0.1)]"
            }`}
          >
            {t.type === "success" && <CheckCircle className="w-3.5 h-3.5 shrink-0" />}
            {t.type === "warning" && <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
            {t.type === "info" && <Info className="w-3.5 h-3.5 shrink-0" />}
            <span className="leading-tight">{t.msg}</span>
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes glow { 0%, 100% { filter: drop-shadow(0 0 3px rgba(0,255,194,0.2)); } 50% { filter: drop-shadow(0 0 8px rgba(0,255,194,0.4)); } }
        .animate-pulse-glow { animation: glow 2.5s infinite ease-in-out; }
      `}} />

    </div>
  );
}
