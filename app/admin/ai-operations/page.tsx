"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { 
  Bot, Cpu, Layers, Activity, AlertTriangle, CheckCircle2, Clock, 
  SlidersHorizontal, Search, User, X, ExternalLink, ShieldAlert, 
  RefreshCw, Sliders, HelpCircle, History, UserCheck, Users, 
  Settings, ShieldCheck, ChevronRight, AlertCircle, PlayCircle,
  TrendingUp, Terminal, Shield, Check, Plus, Edit2, Trash2
} from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { 
  WorkspaceCard, 
  MetricTile, 
  StatusBadge, 
  BadgeState 
} from "@/components/private-app";
import { motion, AnimatePresence } from "motion/react";

// ============================================================================
// 1. DATA MODELS & STATIC SELECTION ARRAYS
// ============================================================================

interface RichAgentOperation {
  id: string;
  name: string;
  projectId: string;
  projectName: string;
  clientName: string;
  status: "active" | "evaluating" | "decoupled" | "warning";
  threads: number;
  memory: string;
  cpu: number;
  latencyMs: number;
  uptime: number;
  enclaveType: "Intel SGX" | "AMD SEV-SNP" | "AWS Nitro Enclave";
  agentType: "Core Model" | "Alignment Filter" | "Sensory Map" | "Fintech Ledger";
  severity: "Low" | "Medium" | "High" | "Critical";
  owner: string;
  logs: string[];
  lastHeartbeat: string;
}

interface RichAlert {
  id: string;
  title: string;
  agentId?: string;
  agentName?: string;
  clientName: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  status: "Open" | "Investigating" | "Resolved";
  owner: string;
  timestamp: string;
  desc: string;
}

const OWNERS = [
  "Unassigned",
  "Dr. Sarah Vance",
  "Alexander Mercer",
  "Marcus Vance",
  "Evelyn Carter",
  "Sarah Jenkins",
  "Auditor Jenkins"
];

const UNIQUE_CLIENTS = [
  "Apex Sovereign Group [Preview Client]",
  "Global Retail Enclave [Preview Client]",
  "Sovereign Logistics Unit [Preview Client]",
  "Federal Treasury Division [Preview Client]"
];

const UNIQUE_PROJECTS = [
  "Sovereign Core Sandbox 02",
  "Model Guardrail Sandbox 04",
  "Sovereign Mining Intel Loop",
  "Federal Ledger Enclave Alpha"
];

const UNIQUE_TYPES = [
  "Core Model",
  "Alignment Filter",
  "Sensory Map",
  "Fintech Ledger"
];

const UNIQUE_STATUSES = [
  "active",
  "evaluating",
  "warning",
  "decoupled"
];

const UNIQUE_SEVERITIES = [
  "Low",
  "Medium",
  "High",
  "Critical"
];

// Helper functions for safe badge states and dynamic UI indicators
const getBadgeState = (status: "active" | "evaluating" | "decoupled" | "warning"): BadgeState => {
  switch (status) {
    case "active": return "active";
    case "evaluating": return "stable"; // Stable is the blue state which fits evaluating nicely
    case "warning": return "warning";
    case "decoupled": return "decoupled";
    default: return "stable";
  }
};

const getStatusDotColor = (status: "active" | "evaluating" | "decoupled" | "warning") => {
  switch (status) {
    case "active": return "bg-emerald-500";
    case "evaluating": return "bg-[#009DFF]";
    case "warning": return "bg-amber-400";
    case "decoupled": return "bg-white/30";
    default: return "bg-[#009DFF]";
  }
};

const getStatusStreamText = (status: "active" | "evaluating" | "decoupled" | "warning") => {
  switch (status) {
    case "active": return "Enclave Core Telemetry Stream (Active)";
    case "evaluating": return "Evaluating Sandbox Security Boundaries";
    case "warning": return "Enclave Decoupled or High Load Pulse (Warning)";
    case "decoupled": return "Enclave Decoupled — Connection Volatile";
    default: return "Enclave Stream Connected";
  }
};


const getProjectNameFromId = (id: string): string => {
  switch (id.toLowerCase()) {
    case "proj-001": return "Sovereign Core Sandbox 02";
    case "proj-002": return "Model Guardrail Sandbox 04";
    case "proj-003": return "Sovereign Mining Intel Loop";
    case "proj-004": return "Federal Ledger Enclave Alpha";
    default: return "Sovereign Core Sandbox 02";
  }
};

const getClientIdFromName = (name: string): string => {
  const normalized = name.toLowerCase();
  if (normalized.includes("apex")) return "client-001";
  if (normalized.includes("retail") || normalized.includes("global")) return "client-002";
  if (normalized.includes("logistics")) return "client-003";
  if (normalized.includes("treasury") || normalized.includes("federal")) return "client-004";
  return "client-001";
};

const mapApiToRichAgent = (op: any): RichAgentOperation => {
  let extra: any = {};
  try {
    if (op.desc && op.desc.startsWith("{")) {
      extra = JSON.parse(op.desc);
    }
  } catch (e) {}

  return {
    id: op.id,
    name: op.name,
    projectId: op.project_id,
    projectName: extra.projectName || getProjectNameFromId(op.project_id),
    clientName: op.client_name,
    status: (op.status as any) || "active",
    threads: typeof extra.threads === 'number' ? extra.threads : (op.status === "decoupled" ? 0 : 16 + (op.id.charCodeAt(op.id.length - 1) % 4) * 8),
    memory: extra.memory || (op.status === "decoupled" ? "0.0 GB / 8.0 GB" : "7.5 GB / 8.0 GB"),
    cpu: typeof extra.cpu === 'number' ? extra.cpu : (op.status === "decoupled" ? 0 : (op.status === "warning" ? 92 : 45 + (op.id.charCodeAt(op.id.length - 1) % 10) * 4)),
    latencyMs: typeof extra.latencyMs === 'number' ? extra.latencyMs : (op.status === "decoupled" ? 0 : (op.status === "warning" ? 95 : 12 + (op.id.charCodeAt(op.id.length - 1) % 15))),
    uptime: typeof extra.uptime === 'number' ? extra.uptime : 99.0 + (op.id.charCodeAt(op.id.length - 1) % 100) / 100,
    enclaveType: extra.enclaveType || "Intel SGX",
    agentType: (op.agent_type as any) || "Core Model",
    severity: (op.governance_status as any) || "Low",
    owner: op.owner,
    logs: extra.logs || [
      "Zero-Trust telemetry handshake established.",
      "Hardware enclave decoupled."
    ],
    lastHeartbeat: op.lastUpdated || new Date().toISOString()
  };
};


// ============================================================================
// 2. CORE COMPONENT
// ============================================================================

export default function AdminAiOperationsPage() {
  // --- 2.1 LOCAL VOLATILE STATES (REACTION LAB) ---
  const [agents, setAgents] = useState<RichAgentOperation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editAgentForm, setEditAgentForm] = useState<RichAgentOperation | null>(null);

  const [newAgent, setNewAgent] = useState({
    name: "",
    projectId: "proj-001",
    clientName: "Apex Sovereign Group [Preview Client]",
    status: "active" as const,
    agentType: "Core Model" as const,
    severity: "Low" as const,
    owner: "Unassigned",
    enclaveType: "Intel SGX" as const,
    desc: ""
  });

  const [alerts, setAlerts] = useState<RichAlert[]>(() => [
    {
      id: "alt-001",
      title: "HSM Cryptographic Key Rotation Delay",
      agentId: "agent-001",
      agentName: "RETAIL-CORE-A1",
      clientName: "Apex Sovereign Group [Preview Client]",
      severity: "Critical",
      status: "Open",
      owner: "Dr. Sarah Vance",
      timestamp: "10 mins ago",
      desc: "Enclave hardware is reporting socket timeout while performing automatic HSM roll-key rotation with Sovereign Core Sandbox 02."
    },
    {
      id: "alt-002",
      title: "eBPF Telemetry Thread Limit Exceeded",
      agentId: "agent-004",
      agentName: "MED-CLINIC-H9",
      clientName: "Apex Sovereign Group [Preview Client]",
      severity: "High",
      status: "Investigating",
      owner: "Alexander Mercer",
      timestamp: "25 mins ago",
      desc: "Node MED-CLINIC-H9 CPU utilization hit 94.5% during diagnostic prompt scan lifecycle."
    },
    {
      id: "alt-003",
      title: "Unauthorized Prompt Injection Scan Blocked",
      agentId: "agent-002",
      agentName: "ALIGN-GUARD-A2",
      clientName: "Apex Sovereign Group [Preview Client]",
      severity: "Medium",
      status: "Resolved",
      owner: "Marcus Vance",
      timestamp: "1 hour ago",
      desc: "Model Guardrail Sandbox 04 detected and successfully blocked direct model manipulation request. Sandbox integrity preserved."
    },
    {
      id: "alt-004",
      title: "AMD SEV Memory Boundary Anomaly",
      agentId: "agent-007",
      agentName: "SENSORY-LOOP-X1",
      clientName: "Global Retail Enclave [Preview Client]",
      severity: "High",
      status: "Open",
      owner: "Unassigned",
      timestamp: "3 hours ago",
      desc: "Host reported high telemetry packet loss and 110ms latency spike in AMD SEV memory partitions."
    }
  ]);

  const [agentLogs, setAgentLogs] = useState<Record<string, string[]>>(() => {
    const initialLogs: Record<string, string[]> = {};
    const agentsSource = [
      { id: "agent-001", logs: ["Core verification complete (SHA-256: FF81)", "Local memory state synchronized successfully", "eBPF telemetry boundary active"] },
      { id: "agent-002", logs: ["Policy verification pass 99.8%", "No direct model manipulation requests detected.", "Syncing guardrail ledger block..."] },
      { id: "agent-003", logs: ["Seismic array map loaded successfully.", "AMD SEV memory block verified securely.", "Telemetry streaming active: 45.2 MB/s"] },
      { id: "agent-004", logs: ["Warning: Thread load above safety line (85%)", "Triggered telemetry frame check...", "Awaiting auto-scaling context re-allocator"] },
      { id: "agent-005", logs: ["Thread execution terminated gracefully by operator.", "State dumped to local cryptographic storage block.", "Hardware enclave decoupled."] },
      { id: "agent-006", logs: ["NIST key verified securely", "Sovereign HSM sync in progress", "Active high-throughput thread pooling"] },
      { id: "agent-007", logs: ["Warning: Delay in sensory synchronization", "Retrying socket connection...", "Host reporting packet loss"] }
    ];
    agentsSource.forEach(a => {
      initialLogs[a.id] = [...a.logs];
    });
    return initialLogs;
  });

  const fetchOperations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.aiOperations.list();
      if (res.success && res.operations) {
        const mapped = res.operations.map(mapApiToRichAgent);
        setAgents(mapped);
        
        // Build initial logs
        const logsMap: Record<string, string[]> = {};
        mapped.forEach(a => {
          logsMap[a.id] = a.logs;
        });
        setAgentLogs(logsMap);
      } else {
        setError("Failed to fetch running AI Operations from secure ledger.");
      }
    } catch (err: any) {
      setError(err?.message || "Secure endpoint connection timeout.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOperations();
  }, [fetchOperations]);

  // --- 2.2 OBSERVED STATES (FILTERS) ---
  const [searchQuery, setSearchQuery] = useState("");
  const [clientFilter, setClientFilter] = useState("All");
  const [projectFilter, setProjectFilter] = useState("All");
  const [agentTypeFilter, setAgentTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [ownerFilter, setOwnerFilter] = useState("All");

  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  // --- 2.3 SIMULATION STATES ---
  const [isVerifying, setIsVerifying] = useState(false);
  const [isDumping, setIsDumping] = useState(false);
  const [simulationPulse, setSimulationPulse] = useState(true);
  const logsContainerRef = useRef<HTMLDivElement>(null);

  // Pulse effect simulation representing telemetric sweep
  useEffect(() => {
    const interval = setInterval(() => {
      setSimulationPulse(prev => !prev);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll logs window when logs are updated
  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [agentLogs, selectedAgentId]);

  // --- 2.4 DYNAMIC TELEMETRY CALCULATIONS (HEALTH CARDS) ---
  const overallStats = useMemo(() => {
    const totalCount = agents.length;
    const healthyCount = agents.filter(a => a.status === "active" || a.status === "evaluating").length;
    const healthIndex = totalCount > 0 ? Math.round((healthyCount / totalCount) * 100) : 0;
    
    const totalThreads = agents.reduce((acc, a) => acc + a.threads, 0);
    const activeAlertsCount = alerts.filter(a => a.status !== "Resolved").length;
    
    const activeLatencies = agents.filter(a => a.latencyMs > 0).map(a => a.latencyMs);
    const meanLatency = activeLatencies.length > 0 
      ? Math.round(activeLatencies.reduce((acc, val) => acc + val, 0) / activeLatencies.length) 
      : 0;

    return {
      healthIndex,
      totalThreads,
      meanLatency,
      activeAlertsCount
    };
  }, [agents, alerts]);

  // --- 2.5 REAL-TIME MATCHING / REACTION ENGINE ---
  const filteredAgents = useMemo(() => {
    return agents.filter(agent => {
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchesSearch = 
          agent.name.toLowerCase().includes(q) ||
          agent.id.toLowerCase().includes(q) ||
          agent.projectName.toLowerCase().includes(q) ||
          agent.clientName.toLowerCase().includes(q) ||
          agent.agentType.toLowerCase().includes(q) ||
          agent.logs.some(log => log.toLowerCase().includes(q));
        if (!matchesSearch) return false;
      }

      if (clientFilter !== "All" && agent.clientName !== clientFilter) return false;
      if (projectFilter !== "All" && agent.projectName !== projectFilter) return false;
      if (agentTypeFilter !== "All" && agent.agentType !== agentTypeFilter) return false;
      if (statusFilter !== "All" && agent.status !== statusFilter) return false;
      if (severityFilter !== "All" && agent.severity !== severityFilter) return false;
      if (ownerFilter !== "All" && agent.owner !== ownerFilter) return false;

      return true;
    });
  }, [agents, searchQuery, clientFilter, projectFilter, agentTypeFilter, statusFilter, severityFilter, ownerFilter]);

  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchesSearch = 
          alert.title.toLowerCase().includes(q) ||
          alert.id.toLowerCase().includes(q) ||
          alert.clientName.toLowerCase().includes(q) ||
          alert.desc.toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }

      if (clientFilter !== "All" && alert.clientName !== clientFilter) return false;
      
      if (projectFilter !== "All") {
        const matchingAgent = agents.find(a => a.id === alert.agentId);
        if (!matchingAgent || matchingAgent.projectName !== projectFilter) return false;
      }

      if (severityFilter !== "All" && alert.severity !== severityFilter) return false;
      if (ownerFilter !== "All" && alert.owner !== ownerFilter) return false;

      return true;
    });
  }, [alerts, agents, searchQuery, clientFilter, projectFilter, severityFilter, ownerFilter]);

  const selectedAgent = useMemo(() => {
    return agents.find(a => a.id === selectedAgentId) || null;
  }, [agents, selectedAgentId]);



  // --- 2.6 LOCAL MUTATIVE ACTIONS (REST BACKEND CRUD CONNECTED) ---
  const handleAssignOwner = async (agentId: string, newOwner: string) => {
    try {
      const res = await apiClient.aiOperations.update(agentId, {
        owner: newOwner
      });
      if (res.success) {
        setAgents(prev => prev.map(a => a.id === agentId ? { ...a, owner: newOwner } : a));
        setAlerts(prev => prev.map(al => al.agentId === agentId ? { ...al, owner: newOwner } : al));
        appendLogMessage(agentId, `Security clearance validated. Re-assigned owner bounds to: ${newOwner}`);
      }
    } catch (err: any) {
      console.error("Failed to assign owner on backend:", err);
    }
  };

  const handleCreateAgentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgent.name) {
      alert("Please provide an Agent name.");
      return;
    }

    try {
      const extraPayload = {
        projectName: getProjectNameFromId(newAgent.projectId),
        threads: 24,
        memory: "4.0 GB / 8.0 GB",
        cpu: 35,
        latencyMs: 15,
        uptime: 99.98,
        enclaveType: newAgent.enclaveType,
        logs: [
          "Zero-Trust verification complete.",
          "Secure isolated telemetry stream initiated."
        ]
      };

      const payload = {
        name: newAgent.name,
        client_id: getClientIdFromName(newAgent.clientName),
        project_id: newAgent.projectId,
        status: newAgent.status,
        health: "healthy",
        agent_type: newAgent.agentType,
        governance_status: newAgent.severity,
        owner: newAgent.owner,
        desc: JSON.stringify(extraPayload)
      };

      const res = await apiClient.aiOperations.create(payload);
      if (res.success && res.operation) {
        const op = res.operation;
        const mapped = mapApiToRichAgent(op);
        setAgents(prev => [mapped, ...prev]);
        setAgentLogs(prev => ({ ...prev, [mapped.id]: mapped.logs }));
        setIsCreateModalOpen(false);
        setNewAgent({
          name: "",
          projectId: "proj-001",
          clientName: "Apex Sovereign Group [Preview Client]",
          status: "active",
          agentType: "Core Model",
          severity: "Low",
          owner: "Unassigned",
          enclaveType: "Intel SGX",
          desc: ""
        });
      } else {
        alert("Failed to register operational agent on backend.");
      }
    } catch (err: any) {
      alert(`Error: ${err.message || "Failed to sync enclave database."}`);
    }
  };

  const handleEditAgentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editAgentForm) return;

    try {
      const extraPayload = {
        projectName: getProjectNameFromId(editAgentForm.projectId),
        threads: editAgentForm.threads,
        memory: editAgentForm.memory,
        cpu: editAgentForm.cpu,
        latencyMs: editAgentForm.latencyMs,
        uptime: editAgentForm.uptime,
        enclaveType: editAgentForm.enclaveType,
        logs: agentLogs[editAgentForm.id] || []
      };

      const payload = {
        name: editAgentForm.name,
        client_id: getClientIdFromName(editAgentForm.clientName),
        project_id: editAgentForm.projectId,
        status: editAgentForm.status,
        agent_type: editAgentForm.agentType,
        governance_status: editAgentForm.severity,
        owner: editAgentForm.owner,
        desc: JSON.stringify(extraPayload)
      };

      const res = await apiClient.aiOperations.update(editAgentForm.id, payload);
      if (res.success && res.operation) {
        const mapped = mapApiToRichAgent(res.operation);
        setAgents(prev => prev.map(a => a.id === editAgentForm.id ? mapped : a));
        setIsEditModalOpen(false);
        setEditAgentForm(null);
      } else {
        alert("Failed to update operational agent.");
      }
    } catch (err: any) {
      alert(`Error: ${err.message || "Failed to update agent."}`);
    }
  };

  const handleTerminateAgent = async (id: string) => {
    if (confirm(`Terminate running operational agent ${id}? This halts and deallocates all enclave memory blocks.`)) {
      try {
        const res = await apiClient.aiOperations.delete(id);
        if (res.success) {
          setAgents(prev => prev.filter(a => a.id !== id));
          if (selectedAgentId === id) setSelectedAgentId(null);
        } else {
          alert("Failed to terminate running agent on the backend.");
        }
      } catch (err: any) {
        alert(`Error: ${err.message || "Failed to connect to supervisor."}`);
      }
    }
  };

  const handleAlertAssignOwner = (alertId: string, newOwner: string) => {
    setAlerts(prev => prev.map(al => {
      if (al.id === alertId) {
        if (al.agentId) {
          setAgents(prevAg => prevAg.map(a => {
            if (a.id === al.agentId) return { ...a, owner: newOwner };
            return a;
          }));
          appendLogMessage(al.agentId, `Governance alert mitigation bound to owner: ${newOwner}`);
        }
        return { ...al, owner: newOwner };
      }
      return al;
    }));
  };

  const handleUpdateAlertStatus = (alertId: string, newStatus: "Open" | "Investigating" | "Resolved") => {
    setAlerts(prev => prev.map(al => {
      if (al.id === alertId) {
        if (al.agentId) {
          appendLogMessage(al.agentId, `Governance Alert (${al.id}) status transitioned to: ${newStatus.toUpperCase()}`);
        }
        return { ...al, status: newStatus };
      }
      return al;
    }));
  };

  const appendLogMessage = (agentId: string, message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setAgentLogs(prev => ({
      ...prev,
      [agentId]: [...(prev[agentId] || []), `[${timestamp}] ${message}`]
    }));
  };

  const handleTriggerIntegrityCheck = (agentId: string) => {
    if (isVerifying) return;
    setIsVerifying(true);
    appendLogMessage(agentId, "INTEGRITY INITIATED: Locking enclave heap structure...");
    
    setTimeout(() => {
      appendLogMessage(agentId, "INTEGRITY SCANNING: Correlating zero-trust hardware keys against HSM storage...");
    }, 600);

    setTimeout(() => {
      appendLogMessage(agentId, "INTEGRITY OK: SHA-256 kernel signatures VERIFIED. (0x7FFA8F)");
      setIsVerifying(false);
    }, 1500);
  };

  const handleTriggerThreadDump = (agentId: string) => {
    if (isDumping) return;
    setIsDumping(true);
    appendLogMessage(agentId, "THREAD DUMP INITIATED: Terminating transient context frames...");

    setTimeout(() => {
      appendLogMessage(agentId, "THREAD DUMP PROGRESS: Dumping execution trace (128 KB written to compliance vault)...");
    }, 800);

    setTimeout(() => {
      appendLogMessage(agentId, "THREAD DUMP OK: Sandbox registers re-synchronized. All threads resumed gracefully.");
      setIsDumping(false);
    }, 1800);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setClientFilter("All");
    setProjectFilter("All");
    setAgentTypeFilter("All");
    setStatusFilter("All");
    setSeverityFilter("All");
    setOwnerFilter("All");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-6 max-w-[1600px] mx-auto pb-12"
    >
      {/* --- SECTION 1: NARRATIVE HEADER & COMPLIANCE STITCH --- */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-2 w-2 rounded-full bg-[#009DFF] relative flex shrink-0">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-[#009DFF] opacity-75 ${simulationPulse ? "scale-150" : "scale-100"}`}></span>
            </div>
            <span className="text-[10px] font-mono tracking-widest text-[#009DFF] uppercase font-bold">SOVEREIGN CORE TELEMETRY</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight font-mono uppercase mt-1">AI Operations Command Center</h2>
          <p className="text-xs text-white/55 mt-1 leading-relaxed max-w-2xl">
            Global administrative terminal. Audit multi-agent runtimes, monitor context frame load indices, and coordinate incident ownership across verified hardware enclaves.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 self-start md:self-auto">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="h-9 px-4 rounded bg-[#009DFF] hover:bg-[#0082d4] text-[11px] font-mono font-bold uppercase tracking-wider text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_20px_rgba(0,157,255,0.2)]"
          >
            <Plus className="w-4 h-4" />
            <span>Create Operational Agent</span>
          </button>

          <div className="flex items-center gap-3 font-mono text-[11px] border border-white/5 bg-[#050505]/35 rounded-lg px-3 py-2 text-white/60">
            <Activity className={`w-3.5 h-3.5 text-[#00FFC2] shrink-0 ${simulationPulse ? "opacity-100" : "opacity-40"}`} />
            <span className="text-white/30 uppercase">Telemetry state:</span>
            <span className="text-[#00FFC2] font-semibold uppercase tracking-wider">SYNCED</span>
            <span className="text-white/20">•</span>
            <span className="text-[10px] text-white/40">EPOCH SEC_2026_A</span>
          </div>
        </div>
      </div>

      {/* --- COMPLIANCE NOTICE BANNER (DO NOT CLAIM LIVE TELEMETRY) --- */}
      <div className="border border-white/5 rounded-xl bg-gradient-to-r from-blue-500/5 to-emerald-500/5 p-4 flex items-start gap-3.5">
        <Shield className="w-5 h-5 text-[#009DFF] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="text-[11px] font-mono uppercase font-bold text-[#009DFF] tracking-wider">SIMULATION TELEMETRY STREAM ONLY — Standard sandbox compliance auditing mode active.</div>
          <p className="text-[11px] text-white/45 font-mono leading-relaxed max-w-5xl">
            This administrative control console operates inside isolated volatile memory spaces. Telemetric streams, CPU partitions (Intel SGX / AMD SEV-SNP), and hardware logs represent verified GFF AI preview models. Actions taken (e.g., owner assignment, diagnostic checks) are modeled locally inside the browser context to demonstrate governance alignment.
          </p>
        </div>
      </div>


      {/* --- SECTION 2: HEALTH KPI CARDS GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <WorkspaceCard className="relative overflow-hidden group">
          <div className="flex flex-col h-full justify-between gap-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[9.5px] font-mono tracking-widest text-white/35 uppercase block">Global Health Index</span>
                <span className="text-2xl font-bold text-white tracking-tight font-mono mt-1 block">{overallStats.healthIndex}%</span>
              </div>
              <div className="p-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            
            <div className="space-y-1.5 mt-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-white/40 uppercase">
                <span>Core Status Pulse</span>
                <span className="text-emerald-400 font-bold">{overallStats.healthIndex === 100 ? "OPTIMAL" : "STABLE BOUNDS"}</span>
              </div>
              <div className="flex items-center gap-[2.5px] h-2.5 w-full">
                {Array.from({ length: 24 }).map((_, idx) => {
                  let bg = "bg-[#00FFC2]";
                  if (idx === 15) bg = "bg-amber-400";
                  if (idx === 21) bg = "bg-white/10";
                  return (
                    <div 
                      key={idx} 
                      className={`h-full flex-1 rounded-[1.5px] ${bg} opacity-80 hover:opacity-100 transition-opacity`} 
                      title="Micro-Node Telemetry Integrity Check"
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </WorkspaceCard>

        <WorkspaceCard className="relative overflow-hidden group">
          <div className="flex flex-col h-full justify-between gap-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[9.5px] font-mono tracking-widest text-white/35 uppercase block">Compute Core Allocation</span>
                <span className="text-2xl font-bold text-white tracking-tight font-mono mt-1 block">{overallStats.totalThreads} Threads</span>
              </div>
              <div className="p-1.5 rounded-lg border border-[#009DFF]/20 bg-[#009DFF]/10 text-[#009DFF]">
                <Cpu className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1 mt-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-white/40">
                <span>SANDBOX CLUSTERS</span>
                <span className="text-[#009DFF] font-semibold">{agents.length} Active Runtimes</span>
              </div>
              <div className="text-[10px] font-mono text-white/30 flex items-center gap-1.5 leading-none">
                <TrendingUp className="w-3.5 h-3.5 text-[#00FFC2]" />
                <span className="text-[#00FFC2] font-bold">+12 Cores</span>
                <span>since last epoch rotation</span>
              </div>
            </div>
          </div>
        </WorkspaceCard>

        <WorkspaceCard className="relative overflow-hidden group">
          <div className="flex flex-col h-full justify-between gap-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[9.5px] font-mono tracking-widest text-white/35 uppercase block">Mean Heartbeat Latency</span>
                <span className="text-2xl font-bold text-white tracking-tight font-mono mt-1 block">{overallStats.meanLatency} ms</span>
              </div>
              <div className="p-1.5 rounded-lg border border-[#00FFC2]/20 bg-[#00FFC2]/10 text-[#00FFC2]">
                <Clock className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1 mt-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-white/40">
                <span>ZERO-TRUST TLS WIRE</span>
                <span className="text-white/60 font-medium">99.998% Uptime</span>
              </div>
              <div className="text-[10px] font-mono text-white/30 leading-none">
                Isolated HSM key signatures delay &lt; 2ms
              </div>
            </div>
          </div>
        </WorkspaceCard>

        <WorkspaceCard className="relative overflow-hidden group">
          <div className="flex flex-col h-full justify-between gap-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[9.5px] font-mono tracking-widest text-white/35 uppercase block">Unresolved Governance Incidents</span>
                <span className="text-2xl font-bold text-[#E4000F] tracking-tight font-mono mt-1 block">{overallStats.activeAlertsCount} Alerts</span>
              </div>
              <div className="p-1.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1 mt-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-white/40">
                <span>AUDIT ESCALATIONS</span>
                <span className="text-red-400 font-bold">1 HIGH PRIORITY</span>
              </div>
              <div className="text-[10px] font-mono text-white/30 leading-none">
                Awaiting administrative owner sign-off
              </div>
            </div>
          </div>
        </WorkspaceCard>
      </div>

      {/* --- SECTION 3: MASTER INTERACTIVE FILTER CONTROL BAR --- */}
      <div className="border border-white/5 rounded-2xl bg-[#050505]/20 backdrop-blur-sm p-4 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-white/45" />
            <h3 className="text-xs font-mono font-bold uppercase text-white/70 tracking-wider">Telemetry Routing Filters</h3>
          </div>
          {(searchQuery || clientFilter !== "All" || projectFilter !== "All" || agentTypeFilter !== "All" || statusFilter !== "All" || severityFilter !== "All" || ownerFilter !== "All") && (
            <button
              onClick={handleResetFilters}
              className="text-[10px] font-mono text-[#009DFF] hover:text-white flex items-center gap-1 transition-colors uppercase font-bold cursor-pointer"
            >
              <X className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          <div className="col-span-2 md:col-span-2 flex flex-col gap-1.5">
            <label className="text-[9px] font-mono text-white/30 uppercase font-bold tracking-wider font-semibold">Search Node Parameters</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-white/35 pointer-events-none" />
              <input
                type="text"
                placeholder="Search agent name, ID, logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.01] hover:bg-white/[0.03] focus:bg-white/[0.05] border border-white/5 focus:border-[#009DFF]/30 rounded-lg pl-8 pr-3 py-1.5 text-[11px] font-mono text-white outline-none placeholder:text-white/25 transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-mono text-white/30 uppercase font-bold tracking-wider font-semibold">Client Account</label>
            <select
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
              className="w-full bg-[#050505] hover:bg-white/[0.04] border border-white/5 hover:border-white/10 rounded-lg px-2.5 py-1.5 text-[11px] font-mono text-white/70 hover:text-white transition-all outline-none cursor-pointer"
            >
              <option value="All">ALL CLIENTS</option>
              {UNIQUE_CLIENTS.map(c => (
                <option key={c} value={c}>
                  {c.replace(" [Preview Client]", "")}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-mono text-white/30 uppercase font-bold tracking-wider font-semibold">Project Layer</label>
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="w-full bg-[#050505] hover:bg-white/[0.04] border border-white/5 hover:border-white/10 rounded-lg px-2.5 py-1.5 text-[11px] font-mono text-white/70 hover:text-white transition-all outline-none cursor-pointer"
            >
              <option value="All">ALL PROJECTS</option>
              {UNIQUE_PROJECTS.map(p => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-mono text-white/30 uppercase font-bold tracking-wider font-semibold">Classification</label>
            <select
              value={agentTypeFilter}
              onChange={(e) => setAgentTypeFilter(e.target.value)}
              className="w-full bg-[#050505] hover:bg-white/[0.04] border border-white/5 hover:border-white/10 rounded-lg px-2.5 py-1.5 text-[11px] font-mono text-white/70 hover:text-white transition-all outline-none cursor-pointer"
            >
              <option value="All">ALL CLASSIFICATIONS</option>
              {UNIQUE_TYPES.map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-mono text-white/30 uppercase font-bold tracking-wider font-semibold">Telemetry Pulse</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[#050505] hover:bg-white/[0.04] border border-white/5 hover:border-white/10 rounded-lg px-2.5 py-1.5 text-[11px] font-mono text-white/70 hover:text-white transition-all outline-none cursor-pointer"
            >
              <option value="All">ALL PULSES</option>
              {UNIQUE_STATUSES.map(s => (
                <option key={s} value={s} className="uppercase font-mono">
                  {s.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-mono text-white/30 uppercase font-bold tracking-wider font-semibold">Assigned Operator</label>
            <select
              value={ownerFilter}
              onChange={(e) => setOwnerFilter(e.target.value)}
              className="w-full bg-[#050505] hover:bg-white/[0.04] border border-white/5 hover:border-white/10 rounded-lg px-2.5 py-1.5 text-[11px] font-mono text-white/70 hover:text-white transition-all outline-none cursor-pointer"
            >
              <option value="All">ALL OPERATORS</option>
              {OWNERS.map(o => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>


      {/* --- SECTION 4: DOUBLE CORRELATION BOARD (AGENTS TABLE & ALERTS SIDEBAR) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* LEFT COLUMN (COLSPAN 3): ACTIVE AGENTS OPERATION TERMINAL */}
        <div className="lg:col-span-3 border border-white/5 rounded-2xl bg-[#050505]/40 backdrop-blur-sm overflow-hidden flex flex-col">
          <div className="bg-white/[0.02] border-b border-white/5 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] font-mono text-white/40 uppercase font-bold tracking-wider">
              <Bot className="w-4 h-4 text-[#009DFF]" />
              <span>Multi-Agent Sovereign Runtimes ({filteredAgents.length})</span>
            </div>
            <div className="text-[10.5px] font-mono text-white/30 flex items-center gap-1.5">
              <RefreshCw className={`w-3 h-3 text-[#009DFF] ${simulationPulse ? "animate-spin" : ""}`} />
              <span>Real-time sweep active</span>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center p-24 font-mono text-center space-y-4">
              <RefreshCw className="w-10 h-10 text-[#009DFF] animate-spin" />
              <h4 className="text-white text-xs font-bold uppercase tracking-widest">Routing Telemetric Stream...</h4>
              <p className="text-white/40 text-[10px] max-w-sm">
                Authenticating context frame connections to running sovereign agent clusters. Maintain bypass clearance.
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center p-20 border border-red-500/10 rounded-xl bg-red-950/5 font-mono text-center space-y-4">
              <AlertTriangle className="w-10 h-10 text-red-500 animate-pulse" />
              <h4 className="text-red-400 text-xs font-bold uppercase tracking-widest">Connection Failure Blocked</h4>
              <p className="text-white/50 text-[10px] max-w-sm leading-relaxed">
                {error}
              </p>
              <button
                onClick={fetchOperations}
                className="h-8 px-4 rounded border border-red-500/20 hover:border-red-500/40 bg-red-500/10 text-[10px] font-bold text-red-400 hover:bg-red-500/20 transition-all uppercase tracking-wider cursor-pointer"
              >
                Reconnect Wire
              </button>
            </div>
          ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left font-mono text-[11px] text-white/70">
              <thead>
                <tr className="border-b border-white/5 text-white/35 text-[9.5px] uppercase font-bold bg-white/[0.01]">
                  <th className="p-4">Agent ID / Name</th>
                  <th className="p-4">Enterprise Bounds</th>
                  <th className="p-4">Classification</th>
                  <th className="p-4">Compute allocation</th>
                  <th className="p-4">Pulse State</th>
                  <th className="p-4">Severity</th>
                  <th className="p-4">Local Assignee</th>
                  <th className="p-4 text-right">Oversight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">

                {filteredAgents.map(agent => {
                  const isSelected = agent.id === selectedAgentId;
                  
                  return (
                    <tr 
                      key={agent.id} 
                      onClick={() => setSelectedAgentId(agent.id)}
                      className={`hover:bg-white/[0.015] cursor-pointer transition-all ${isSelected ? "bg-[#009DFF]/5 text-white" : ""}`}
                    >
                      {/* Agent ID & Name */}
                      <td className="p-4">
                        <div className="font-bold text-white tracking-tight text-[11.5px] flex items-center gap-1">
                          {agent.name.replace(" [Preview Agent]", "")}
                        </div>
                        <div className="text-[10px] text-white/30 font-mono tracking-wider mt-0.5">{agent.id}</div>
                      </td>

                      {/* Client & Project Links */}
                      <td className="p-4 max-w-[200px]">
                        <div className="font-bold text-white/80 truncate text-[11.5px]">{agent.clientName.replace(" [Preview Client]", "")}</div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Layers className="w-3 h-3 text-[#00FFC2] shrink-0" />
                          <Link 
                            href={`/admin/projects`} 
                            onClick={(e) => e.stopPropagation()}
                            className="text-[#00FFC2] text-[10px] hover:underline hover:text-white font-medium transition-all inline-flex items-center gap-0.5"
                          >
                            <span>{agent.projectName}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </Link>
                        </div>
                      </td>

                      {/* Agent Type */}
                      <td className="p-4">
                        <span className="px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase border border-white/5 bg-white/[0.02] text-white/70 rounded">
                          {agent.agentType}
                        </span>
                        <div className="text-[9.5px] text-white/35 mt-1 font-mono tracking-wider">{agent.enclaveType}</div>
                      </td>

                      {/* Threads & Memory */}
                      <td className="p-4">
                        <div className="text-white/85 font-semibold text-[11.5px] flex items-center gap-1">
                          <Cpu className="w-3 h-3 text-[#009DFF]" />
                          <span>{agent.threads} Cores</span>
                        </div>
                        <div className="text-[10px] text-white/35 mt-0.5 font-mono">{agent.memory.split("/")[0].trim()} RAM</div>
                      </td>

                      {/* Pulse Status */}
                      <td className="p-4">
                        <StatusBadge state={getBadgeState(agent.status)} label={agent.status} />
                      </td>

                      {/* Severity */}
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold ${
                          agent.severity === "Critical" ? "text-red-400" :
                          agent.severity === "High" ? "text-amber-400" :
                          agent.severity === "Medium" ? "text-[#009DFF]" : "text-emerald-400"
                        }`}>
                          <AlertTriangle className="w-3 h-3 shrink-0" />
                          <span>{agent.severity}</span>
                        </span>
                      </td>

                      {/* Local Assignee */}
                      <td className="p-4" onClick={(e) => e.stopPropagation()}>
                        <div className="relative inline-block">
                          <select
                            value={agent.owner}
                            onChange={(e) => handleAssignOwner(agent.id, e.target.value)}
                            className="bg-[#050505]/60 hover:bg-white/[0.04] border border-white/5 hover:border-white/10 rounded-lg px-2 py-1 text-[11px] font-mono text-white/85 transition-all outline-none cursor-pointer appearance-none text-left"
                          >
                            {OWNERS.map(owner => (
                              <option key={owner} value={owner} className="bg-[#0b0b0c] text-white/80 font-mono">
                                {owner === "Unassigned" ? "⚠️ Unassigned" : `👤 ${owner.replace("Dr. ", "").replace("Auditor ", "")}`}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>

                      {/* Oversight Link */}
                      <td className="p-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAgentId(agent.id);
                          }}
                          className="h-7 px-2 border border-white/5 hover:border-[#009DFF]/30 hover:bg-[#009DFF]/10 rounded font-mono text-[#009DFF] hover:text-white transition-all text-[10px] uppercase font-bold tracking-wider inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>TML_LOG</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {filteredAgents.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-12 text-center">
                      <div className="flex flex-col items-center justify-center font-mono max-w-sm mx-auto">
                        <AlertCircle className="w-10 h-10 text-white/20 mb-3 animate-pulse" />
                        <h4 className="text-white text-xs font-bold uppercase tracking-wider">No Matching Runtimes Found</h4>
                        <p className="text-white/40 text-[10.5px] mt-1 leading-relaxed">
                          Your active telemetric sweeps resolved to 0 matching sandboxed systems. Clear or relax filtering parameters to restart enclave tracking.
                        </p>
                        <button
                          onClick={handleResetFilters}
                          className="mt-4 px-3 py-1.5 rounded border border-white/5 hover:border-[#009DFF]/20 bg-white/[0.01] text-xs text-white/70 hover:text-[#009DFF] transition-all cursor-pointer"
                        >
                          Clear Filtering Metrics
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          )}
        </div>

        {/* RIGHT COLUMN (COLSPAN 1): GOVERNANCE INCIDENTS LEDGER */}
        <div className="lg:col-span-1 border border-white/5 rounded-2xl bg-[#050505]/40 backdrop-blur-sm overflow-hidden flex flex-col">
          <div className="bg-white/[0.02] border-b border-white/5 px-4 py-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#00FFC2]" />
            <span className="text-[10px] font-mono text-white/40 uppercase font-bold tracking-wider">Governance Alerts Ledger</span>
          </div>

          <div className="p-4 divide-y divide-white/5 space-y-4 max-h-[600px] overflow-y-auto">
            {filteredAlerts.map(alert => (
              <div key={alert.id} className="pt-3 first:pt-0 space-y-2.5 font-mono text-[11px]">
                <div className="flex items-start justify-between gap-2">
                  <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                    alert.severity === "Critical" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                    alert.severity === "High" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                    "bg-[#009DFF]/10 text-[#009DFF] border-[#009DFF]/20"
                  }`}>
                    {alert.severity.toUpperCase()}
                  </span>
                  <span className="text-white/30 text-[9.5px]">{alert.timestamp}</span>
                </div>

                <div>
                  <h4 className="text-white font-bold leading-snug tracking-tight text-[11.5px] hover:text-[#009DFF] transition-all cursor-pointer">
                    {alert.title}
                  </h4>
                  {alert.agentName && (
                    <div className="text-[9.5px] text-[#00FFC2] mt-0.5 flex items-center gap-1">
                      <Bot className="w-3 h-3" />
                      <span className="cursor-pointer hover:underline" onClick={() => setSelectedAgentId(alert.agentId || null)}>
                        Linked Agent: {alert.agentName}
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-white/45 text-[10px] leading-relaxed">
                  {alert.desc}
                </p>

                <div className="flex flex-col gap-2 pt-1">
                  <div className="flex items-center justify-between gap-1 text-[10px]">
                    <span className="text-white/30 uppercase text-[9px]">Mitigation Status</span>
                    <select
                      value={alert.status}
                      onChange={(e) => handleUpdateAlertStatus(alert.id, e.target.value as "Open" | "Investigating" | "Resolved")}
                      className="bg-[#050505] border border-white/5 rounded text-[10px] text-white/70 px-1 py-0.5 outline-none cursor-pointer"
                    >
                      <option value="Open">OPEN</option>
                      <option value="Investigating">INVESTIGATING</option>
                      <option value="Resolved">RESOLVED</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between gap-1 text-[10px]">
                    <span className="text-white/30 uppercase text-[9px]">Owner</span>
                    <select
                      value={alert.owner}
                      onChange={(e) => handleAlertAssignOwner(alert.id, e.target.value)}
                      className="bg-[#050505] border border-white/5 rounded text-[10px] text-white/70 px-1 py-0.5 outline-none cursor-pointer"
                    >
                      {OWNERS.map(o => (
                        <option key={o} value={o}>
                          {o === "Unassigned" ? "⚠️ Unassigned" : o.replace("Dr. ", "").replace("Auditor ", "")}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}

            {filteredAlerts.length === 0 && (
              <div className="py-8 text-center font-mono text-white/30 text-[10.5px]">
                No active governance alerts mapped under selected filters.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- SECTION 5: PREMIUM DETAIL DRAWER (SLIDE-OUT INTEL PANEL) --- */}
      <AnimatePresence>
        {selectedAgent && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-end font-mono">
            {/* Frosted glass backdrop overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedAgentId(null)}
            />

            {/* Sliding panel content */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="relative w-full max-w-[460px] h-full bg-[#070708] border-l border-white/10 shadow-2xl flex flex-col z-10 p-6 space-y-5 text-white"
            >
              
              {/* Drawer Header */}
              <div className="flex items-start justify-between pb-4 border-b border-white/5">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${getStatusDotColor(selectedAgent.status)} animate-pulse shrink-0`} />
                    <span className="text-[10px] text-white/35 uppercase tracking-wider font-semibold">{getStatusStreamText(selectedAgent.status)}</span>
                  </div>
                <h3 className="text-lg font-bold tracking-tight text-white uppercase mt-0.5 leading-tight">
                  {selectedAgent.name.replace(" [Preview Agent]", "")}
                </h3>
                <div className="text-[10px] text-[#009DFF] font-semibold">{selectedAgent.id}</div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setEditAgentForm({ ...selectedAgent });
                    setIsEditModalOpen(true);
                  }}
                  className="px-2 py-1 rounded border border-white/5 bg-white/[0.01] hover:bg-[#009DFF]/10 text-[#009DFF] hover:text-white transition-all cursor-pointer flex items-center gap-1 text-[9px] uppercase font-mono font-bold"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit</span>
                </button>

                <button 
                  onClick={() => setSelectedAgentId(null)}
                  className="p-1.5 rounded hover:bg-white/5 text-white/40 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-white/5 bg-white/[0.01] rounded-xl p-3 space-y-1">
                <span className="text-[9px] text-white/30 uppercase font-bold">CPU Partition</span>
                <div className="flex items-center justify-between text-xs text-white/85">
                  <span className="font-semibold">{selectedAgent.cpu}%</span>
                  <span className="text-white/20">•</span>
                  <span className="text-[9.5px] text-white/40">Active Heap</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${selectedAgent.status === "warning" ? "bg-amber-400" : "bg-[#009DFF]"}`}
                    style={{ width: `${selectedAgent.cpu}%` }}
                  />
                </div>
              </div>

              <div className="border border-white/5 bg-white/[0.01] rounded-xl p-3 space-y-1">
                <span className="text-[9px] text-white/30 uppercase font-bold">Uptime Ledger</span>
                <div className="flex items-center justify-between text-xs text-[#00FFC2]">
                  <span className="font-semibold">{selectedAgent.uptime}%</span>
                  <span className="text-white/20">•</span>
                  <span className="text-[9.5px] text-white/40">Epoch OK</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div 
                    className="h-full bg-[#00FFC2] rounded-full transition-all duration-500"
                    style={{ width: `${selectedAgent.uptime}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Interactive Assignment Widget */}
            <div className="border border-white/5 bg-white/[0.01] rounded-xl p-4 space-y-3">
              <span className="text-[9.5px] text-white/35 uppercase font-bold block tracking-wider font-semibold">Operational Handshake Assignee</span>
              
              <div className="space-y-1.5">
                <label className="text-[9px] text-white/40 block">Assigned Incident Owner</label>
                <div className="relative">
                  <select
                    value={selectedAgent.owner}
                    onChange={(e) => handleAssignOwner(selectedAgent.id, e.target.value)}
                    className="w-full bg-[#0b0b0c] hover:bg-white/[0.02] border border-white/10 hover:border-white/20 rounded-lg px-3 py-2 text-[11.5px] font-mono text-white transition-all outline-none cursor-pointer"
                  >
                    {OWNERS.map(o => (
                      <option key={o} value={o} className="bg-[#0b0b0c] text-white/80">
                        {o === "Unassigned" ? "⚠️ Unassigned (Volatile Alert)" : `👤 ${o}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="text-[9.5px] text-white/30 leading-normal flex items-start gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-[#009DFF] shrink-0 mt-0.5" />
                <span>Assigning an operator bounds zero-trust cryptographic keys to their clearance level and automatically transitions connected governance alerts.</span>
              </div>
            </div>

            {/* Metadata / Technical Specifications */}
            <div className="space-y-2 border border-white/5 bg-white/[0.01] rounded-xl p-4 text-[10.5px]">
              <span className="text-[9.5px] text-white/35 uppercase font-bold block tracking-wider pb-1 border-b border-white/5 font-semibold">Enclave Core Mappings</span>
              
              <div className="flex justify-between">
                <span className="text-white/40">Enterprise Client</span>
                <span className="text-white/85 font-bold">{selectedAgent.clientName.replace(" [Preview Client]", "")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Project Layer</span>
                <div className="flex items-center gap-1">
                  <Layers className="w-3 h-3 text-[#00FFC2]" />
                  <Link href="/admin/projects" className="text-[#00FFC2] font-semibold hover:underline">
                    {selectedAgent.projectName}
                  </Link>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Hardware Boundary</span>
                <span className="text-white/70">{selectedAgent.enclaveType} Enclave</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Core Allotment</span>
                <span className="text-white/70">{selectedAgent.threads} active threads ({selectedAgent.memory})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Latency Delay</span>
                <span className="text-white/70">{selectedAgent.latencyMs} ms mean heartbeat</span>
              </div>
            </div>

            {/* Diagnostic Action Block */}
            <div className="space-y-2.5">
              <span className="text-[9.5px] text-white/35 uppercase font-bold block tracking-wider font-semibold">Manual Intervention Controls</span>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleTriggerIntegrityCheck(selectedAgent.id)}
                  disabled={isVerifying}
                  className="h-9 rounded-lg border border-white/5 hover:border-[#00FFC2]/20 bg-white/[0.01] hover:bg-[#00FFC2]/5 text-[10px] text-white/70 hover:text-[#00FFC2] font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <ShieldCheck className={`w-3.5 h-3.5 ${isVerifying ? "animate-spin" : ""}`} />
                  <span>{isVerifying ? "Verifying..." : "Verify Integrity"}</span>
                </button>

                <button
                  onClick={() => handleTriggerThreadDump(selectedAgent.id)}
                  disabled={isDumping}
                  className="h-9 rounded-lg border border-white/5 hover:border-[#009DFF]/20 bg-white/[0.01] hover:bg-[#009DFF]/5 text-[10px] text-white/70 hover:text-[#009DFF] font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Cpu className={`w-3.5 h-3.5 ${isDumping ? "animate-spin" : ""}`} />
                  <span>{isDumping ? "Dumping..." : "Thread Dump"}</span>
                </button>
              </div>
            </div>

            {/* Live Monospaced Logs Window */}
            <div className="flex-1 flex flex-col min-h-[160px] border border-white/10 bg-black/50 rounded-xl overflow-hidden">
              <div className="bg-white/[0.02] border-b border-white/5 px-3 py-1.5 flex items-center justify-between text-[9px] font-mono text-white/30 uppercase">
                <div className="flex items-center gap-1.5">
                  <Terminal className="w-3 h-3 text-[#009DFF]" />
                  <span>Enclave Telemetry Logger</span>
                </div>
                <span>Sec_Wire_Active</span>
              </div>
              
              <div 
                ref={logsContainerRef}
                className="flex-1 p-3 overflow-y-auto text-[9.5px] text-white/75 font-mono space-y-1.5 scrollbar-thin select-all"
              >
                {(agentLogs[selectedAgent.id] || []).map((log, idx) => (
                  <div key={idx} className="leading-relaxed border-l-2 border-white/5 pl-2 hover:border-l-2 hover:border-[#009DFF]/30 hover:bg-white/[0.01] transition-all">
                    {log}
                  </div>
                ))}
                
                {isVerifying && (
                  <div className="text-[#00FFC2] text-[9px] font-semibold animate-pulse">
                    &gt;&gt; SECURE HSM VERIFICATION CORRELATION MATRIX RUNNING...
                  </div>
                )}
                
                {isDumping && (
                  <div className="text-[#009DFF] text-[9px] font-semibold animate-pulse">
                    &gt;&gt; CONTEXT STACK DUMP TO LOCAL AUDIT VAULT IN PROGRESS...
                  </div>
                )}
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>

    {isCreateModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 font-mono text-xs text-white">
        <div className="w-full max-w-lg rounded-xl border border-white/10 bg-[#090909] p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <h3 className="text-sm font-bold uppercase text-[#009DFF]">Register Agent</h3>
            <button onClick={() => setIsCreateModalOpen(false)} className="text-white/40 hover:text-white">✕</button>
          </div>
          <form onSubmit={handleCreateAgentSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-white/40 uppercase block text-[9.5px] font-bold">Agent Name *</label>
              <input
                type="text" required placeholder="e.g., RISK-ENGINE-V2" value={newAgent.name}
                onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                className="w-full h-9 rounded border border-white/5 bg-[#050505] px-3 text-white outline-none focus:border-[#009DFF]/30 font-mono"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-white/40 uppercase block text-[9.5px] font-bold">Project Link</label>
                <select value={newAgent.projectId} onChange={(e) => setNewAgent({ ...newAgent, projectId: e.target.value })} className="w-full h-9 rounded border border-white/5 bg-[#050505] px-2 text-white outline-none font-mono">
                  <option value="proj-001">Sovereign Core Sandbox 02</option>
                  <option value="proj-002">Model Guardrail Sandbox 04</option>
                  <option value="proj-003">Sovereign Mining Intel Loop</option>
                  <option value="proj-004">Federal Ledger Enclave Alpha</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-white/40 uppercase block text-[9.5px] font-bold">Client</label>
                <select value={newAgent.clientName} onChange={(e) => setNewAgent({ ...newAgent, clientName: e.target.value })} className="w-full h-9 rounded border border-white/5 bg-[#050505] px-2 text-white outline-none font-mono">
                  {UNIQUE_CLIENTS.map(c => <option key={c} value={c}>{c.replace(" [Preview Client]", "")}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-white/40 uppercase block text-[9.5px] font-bold">Type</label>
                <select value={newAgent.agentType} onChange={(e) => setNewAgent({ ...newAgent, agentType: e.target.value as any })} className="w-full h-9 rounded border border-white/5 bg-[#050505] px-2 text-white outline-none font-mono">
                  {UNIQUE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-white/40 uppercase block text-[9.5px] font-bold">Hardware Enclave</label>
                <select value={newAgent.enclaveType} onChange={(e) => setNewAgent({ ...newAgent, enclaveType: e.target.value as any })} className="w-full h-9 rounded border border-white/5 bg-[#050505] px-2 text-white outline-none font-mono">
                  <option value="Intel SGX">Intel SGX</option>
                  <option value="AMD SEV-SNP">AMD SEV-SNP</option>
                  <option value="AWS Nitro Enclave">AWS Nitro Enclave</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-white/40 uppercase block text-[9.5px] font-bold">State</label>
                <select value={newAgent.status} onChange={(e) => setNewAgent({ ...newAgent, status: e.target.value as any })} className="w-full h-9 rounded border border-white/5 bg-[#050505] px-1 text-white outline-none font-mono">
                  <option value="active">Active</option>
                  <option value="evaluating">Evaluating</option>
                  <option value="warning">Warning</option>
                  <option value="decoupled">Decoupled</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-white/40 uppercase block text-[9.5px] font-bold">Severity</label>
                <select value={newAgent.severity} onChange={(e) => setNewAgent({ ...newAgent, severity: e.target.value as any })} className="w-full h-9 rounded border border-white/5 bg-[#050505] px-1 text-white outline-none font-mono">
                  {UNIQUE_SEVERITIES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-white/40 uppercase block text-[9.5px] font-bold">Assignee</label>
                <select value={newAgent.owner} onChange={(e) => setNewAgent({ ...newAgent, owner: e.target.value })} className="w-full h-9 rounded border border-white/5 bg-[#050505] px-1 text-white outline-none font-mono">
                  {OWNERS.map(o => <option key={o} value={o}>{o.replace("Dr. ", "").replace("Auditor ", "")}</option>)}
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
              <button type="button" onClick={() => setIsCreateModalOpen(false)} className="h-8 px-4 rounded border border-white/10 hover:bg-white/5 text-white/70">Cancel</button>
              <button type="submit" className="h-8 px-4 rounded bg-[#009DFF] hover:bg-[#0082d4] text-white font-bold">Register Agent</button>
            </div>
          </form>
        </div>
      </div>
    )}

    {isEditModalOpen && editAgentForm && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 font-mono text-xs text-white">
        <div className="w-full max-w-lg rounded-xl border border-white/10 bg-[#090909] p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <h3 className="text-sm font-bold uppercase text-[#009DFF]">Edit Agent: {editAgentForm.id}</h3>
            <button onClick={() => { setIsEditModalOpen(false); setEditAgentForm(null); }} className="text-white/40 hover:text-white">✕</button>
          </div>
          <form onSubmit={handleEditAgentSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-white/40 uppercase block text-[9.5px] font-bold">Agent Name *</label>
              <input
                type="text" required value={editAgentForm.name}
                onChange={(e) => setEditAgentForm({ ...editAgentForm, name: e.target.value })}
                className="w-full h-9 rounded border border-white/5 bg-[#050505] px-3 text-white outline-none focus:border-[#009DFF]/30 font-mono"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-white/40 uppercase block text-[9.5px] font-bold">Project Link</label>
                <select value={editAgentForm.projectId} onChange={(e) => setEditAgentForm({ ...editAgentForm, projectId: e.target.value })} className="w-full h-9 rounded border border-white/5 bg-[#050505] px-2 text-white outline-none font-mono">
                  <option value="proj-001">Sovereign Core Sandbox 02</option>
                  <option value="proj-002">Model Guardrail Sandbox 04</option>
                  <option value="proj-003">Sovereign Mining Intel Loop</option>
                  <option value="proj-004">Federal Ledger Enclave Alpha</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-white/40 uppercase block text-[9.5px] font-bold">Client</label>
                <select value={editAgentForm.clientName} onChange={(e) => setEditAgentForm({ ...editAgentForm, clientName: e.target.value })} className="w-full h-9 rounded border border-white/5 bg-[#050505] px-2 text-white outline-none font-mono">
                  {UNIQUE_CLIENTS.map(c => <option key={c} value={c}>{c.replace(" [Preview Client]", "")}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-white/40 uppercase block text-[9.5px] font-bold">Type</label>
                <select value={editAgentForm.agentType} onChange={(e) => setEditAgentForm({ ...editAgentForm, agentType: e.target.value as any })} className="w-full h-9 rounded border border-white/5 bg-[#050505] px-2 text-white outline-none font-mono">
                  {UNIQUE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-white/40 uppercase block text-[9.5px] font-bold">Hardware Enclave</label>
                <select value={editAgentForm.enclaveType} onChange={(e) => setEditAgentForm({ ...editAgentForm, enclaveType: e.target.value as any })} className="w-full h-9 rounded border border-white/5 bg-[#050505] px-2 text-white outline-none font-mono">
                  <option value="Intel SGX">Intel SGX</option>
                  <option value="AMD SEV-SNP">AMD SEV-SNP</option>
                  <option value="AWS Nitro Enclave">AWS Nitro Enclave</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-white/40 uppercase block text-[9.5px] font-bold">State</label>
                <select value={editAgentForm.status} onChange={(e) => setEditAgentForm({ ...editAgentForm, status: e.target.value as any })} className="w-full h-9 rounded border border-white/5 bg-[#050505] px-1 text-white outline-none font-mono">
                  <option value="active">Active</option>
                  <option value="evaluating">Evaluating</option>
                  <option value="warning">Warning</option>
                  <option value="decoupled">Decoupled</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-white/40 uppercase block text-[9.5px] font-bold">Severity</label>
                <select value={editAgentForm.severity} onChange={(e) => setEditAgentForm({ ...editAgentForm, severity: e.target.value as any })} className="w-full h-9 rounded border border-white/5 bg-[#050505] px-1 text-white outline-none font-mono">
                  {UNIQUE_SEVERITIES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-white/40 uppercase block text-[9.5px] font-bold">Assignee</label>
                <select value={editAgentForm.owner} onChange={(e) => setEditAgentForm({ ...editAgentForm, owner: e.target.value })} className="w-full h-9 rounded border border-white/5 bg-[#050505] px-1 text-white outline-none font-mono">
                  {OWNERS.map(o => <option key={o} value={o}>{o.replace("Dr. ", "").replace("Auditor ", "")}</option>)}
                </select>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <button
                type="button"
                onClick={() => handleTerminateAgent(editAgentForm.id)}
                className="h-8 px-3 rounded border border-red-500/20 hover:border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all uppercase tracking-wider font-bold cursor-pointer inline-flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Terminate</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditAgentForm(null);
                  }}
                  className="h-8 px-4 rounded border border-white/10 hover:border-white/20 bg-transparent text-white/70"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-8 px-4 rounded bg-[#009DFF] hover:bg-[#0082d4] text-white font-bold"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    )}
  </motion.div>
  );
}








