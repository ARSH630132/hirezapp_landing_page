"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  Clock, 
  Cpu, 
  ShieldCheck, 
  Activity, 
  ArrowUpRight, 
  Calendar, 
  User, 
  Send, 
  CheckCircle2, 
  Terminal, 
  ChevronRight, 
  RefreshCw, 
  MessageSquare,
  Sparkles,
  HelpCircle,
  FolderOpen,
  ArrowRight
} from "lucide-react";

import { 
  MetricTile, 
  WorkspaceCard, 
  StatusBadge, 
  PrivatePageHeader,
  EmptyState,
  InfoTooltip
} from "@/components/private-app";

interface ClientProject {
  id: string;
  name: string;
  phase: "Garage" | "Foundry" | "Factory" | "Operate";
  owner: {
    name: string;
    role: string;
    avatarInitials: string;
  };
  timeline: string;
  progress: number;
  nextMilestone: string;
  healthStatus: "On Track" | "Warning" | "Critical";
  description: string;
  env: string;
  platformCore: string;
  specs: {
    nodeId: string;
    cores: string;
    memory: string;
    complianceScore: number;
    securityLevel: string;
  };
}

interface ApiProject {
  id: string;
  name: string;
  client_id: string;
  client_name: string;
  phase: string;
  status: string;
  health: string;
  owner: string;
  nodesCount: number;
  enclaveType: string;
  desc: string;
  lastUpdated: string;
}

function mapPhaseToLifecycle(backendPhase: string): "Garage" | "Foundry" | "Factory" | "Operate" {
  const p = (backendPhase || "").toLowerCase();
  if (p.includes("planning") || p.includes("garage") || p.includes("phase i")) return "Garage";
  if (p.includes("provisioning") || p.includes("foundry") || p.includes("phase ii")) return "Foundry";
  if (p.includes("alignment") || p.includes("factory") || p.includes("phase iii") || p.includes("phase iv") || p.includes("testing") || p.includes("user acceptance")) return "Factory";
  return "Operate";
}

function mapHealthToUi(backendHealth: string): "On Track" | "Warning" | "Critical" {
  const h = (backendHealth || "").toLowerCase();
  if (h.includes("track") || h.includes("ok") || h.includes("healthy") || h.includes("active")) return "On Track";
  if (h.includes("critical") || h.includes("risk")) return "Critical";
  return "Warning"; // "Delayed", "Paused", "Warning", etc.
}

function mapApiProjectToClientProject(p: ApiProject): ClientProject {
  const envMap: Record<string, string> = {
    "proj-001": "Switzerland Enclave 01",
    "proj-002": "Singapore West Grid",
    "proj-003": "US Federal Enclave",
    "proj-004": "London Central Core",
    "proj-005": "Tokyo East Enclave"
  };

  const platformMap: Record<string, string> = {
    "proj-001": "Foundry Studio",
    "proj-002": "RetailMesh Core",
    "proj-003": "Control Center Node",
    "proj-004": "TelecomVerse Engine"
  };

  const nodeMap: Record<string, string> = {
    "proj-001": "FF-701A-CH",
    "proj-002": "RM-404B-SG",
    "proj-003": "CC-302F-US",
    "proj-004": "TV-209O-UK",
    "proj-005": "ND-318E-JP"
  };

  const milestoneMap: Record<string, string> = {
    "proj-001": "Phase Gate 1: Threat Model Sign-off",
    "proj-002": "Agent Handshake Telemetry Benchmark",
    "proj-003": "Sovereign Air-Gap Decoupling Test",
    "proj-004": "Federal Ledger Security Seal Audit",
    "proj-005": "Zero-Trust medical agent verification"
  };

  const ownerRoles: Record<string, string> = {
    "Dr. Sarah Vance": "Chief Governance Director",
    "Alexander Mercer": "Orchestration Architect",
    "Marcus Vance": "Principal AI Lead",
    "Evelyn Carter": "Sovereign Systems Lead"
  };

  const idStr = p.id !== undefined && p.id !== null ? String(p.id) : "";
  const idUpper = idStr.toUpperCase();
  const env = envMap[idStr] || `${p.enclaveType} Node`;
  const platformCore = platformMap[idStr] || "GFF AI Platform Core";
  const nodeId = nodeMap[idStr] || `${idUpper}-NODE`;
  const nextMilestone = milestoneMap[idStr] || "Continuous Compliance Audit Review";
  
  // Progress based on phase
  let progress = 50;
  const lowerPhase = p.phase ? p.phase.toLowerCase() : "";
  if (lowerPhase.includes("phase i:") || lowerPhase.includes("planning") || lowerPhase.includes("garage")) {
    progress = 18;
  } else if (lowerPhase.includes("phase ii:") || lowerPhase.includes("provisioning") || lowerPhase.includes("foundry")) {
    progress = 48;
  } else if (lowerPhase.includes("phase iii:") || lowerPhase.includes("alignment") || lowerPhase.includes("factory")) {
    progress = 74;
  } else if (lowerPhase.includes("phase iv:") || lowerPhase.includes("testing") || lowerPhase.includes("uat")) {
    progress = 90;
  } else if (lowerPhase.includes("phase v:") || lowerPhase.includes("live") || lowerPhase.includes("production") || lowerPhase.includes("operate")) {
    progress = 100;
  }

  const healthStatus = mapHealthToUi(p.health);
  const phase = mapPhaseToLifecycle(p.phase);

  const initials = p.owner && p.owner.trim()
    ? p.owner.trim().split(/\s+/).map(n => n[0] ? n[0].toUpperCase() : "").join("").substring(0, 2)
    : "AI";

  const ownerRole = ownerRoles[p.owner] || "Delivery Project Lead";

  const timelineMap: Record<string, string> = {
    "proj-001": "June 2026 - Aug 2026",
    "proj-002": "May 2026 - Oct 2026",
    "proj-003": "Mar 2026 - Nov 2026",
    "proj-004": "Jan 2026 - Ongoing"
  };
  const timeline = timelineMap[idStr] || "April 2026 - Ongoing";

  const complianceScore = 95.0 + ((p.nodesCount * 7) % 5) * 0.9;

  return {
    id: idUpper,
    name: p.name,
    phase,
    owner: {
      name: p.owner || "Unassigned",
      role: ownerRole,
      avatarInitials: initials
    },
    timeline,
    progress,
    nextMilestone,
    healthStatus,
    description: p.desc || "Sovereign platform enclave running continuous container policies.",
    env,
    platformCore,
    specs: {
      nodeId,
      cores: `${p.nodesCount * 8} vCPU Cores`,
      memory: `${p.nodesCount * 16} GB Isolation RAM`,
      complianceScore: parseFloat(complianceScore.toFixed(1)),
      securityLevel: `${p.enclaveType} Hardware Enclave`
    }
  };
}

const LIFECYCLE_PHASES: Array<"Garage" | "Foundry" | "Factory" | "Operate"> = [
  "Garage", "Foundry", "Factory", "Operate"
];

function ProjectsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((n) => (
        <WorkspaceCard key={n} className="flex flex-col h-full border border-white/5 bg-[#050505]/20 p-5 rounded-2xl relative animate-pulse">
          <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
            <div className="h-4 bg-white/5 rounded w-1/4 animate-pulse" />
            <div className="h-4 bg-white/5 rounded w-1/5 animate-pulse" />
          </div>
          <div className="mt-4 space-y-2 flex-grow">
            <div className="h-5 bg-white/5 rounded w-3/4 animate-pulse" />
            <div className="h-3 bg-white/5 rounded w-full animate-pulse" />
            <div className="h-3 bg-white/5 rounded w-5/6 animate-pulse" />
          </div>
          <div className="mt-4 h-10 bg-white/5 rounded-lg w-full animate-pulse" />
          <div className="mt-4 h-8 bg-white/5 rounded-lg w-full animate-pulse" />
        </WorkspaceCard>
      ))}
    </div>
  );
}

function ProjectsErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <WorkspaceCard className="p-8 border border-red-500/10 bg-red-950/5 rounded-2xl flex flex-col items-center justify-center text-center space-y-4 max-w-lg mx-auto my-12">
      <div className="p-3 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
        <Activity className="w-8 h-8 animate-pulse" />
      </div>
      <div className="space-y-1.5 font-mono">
        <h4 className="text-white font-bold uppercase text-[14px]">ENCLAVE SYNC FAILURE</h4>
        <p className="text-white/50 text-[11px] leading-relaxed">{message || "Unable to establish handshake with global sandbox registry."}</p>
      </div>
      <button
        onClick={onRetry}
        className="h-9 px-6 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono font-bold text-[11px] uppercase cursor-pointer flex items-center gap-2 transition-all"
      >
        <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} />
        <span>RE-ESTABLISH HANDSHAKE</span>
      </button>
    </WorkspaceCard>
  );
}

export default function ClientProjectsPage() {
  const router = useRouter();

  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPhase, setSelectedPhase] = useState<string>("");
  const [selectedHealth, setSelectedHealth] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Selected project for details drawer
  const [selectedProject, setSelectedProject] = useState<ClientProject | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("gff_ai_access_token") : null;
      if (!token) {
        setError("AUTHENTICATION EXPIRED. PLEASE RE-LOG IN.");
        router.push("/portal/login");
        return;
      }

      const res = await fetch("/api/v1/projects", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) {
        throw new Error(`Enclave sync failed with status ${res.status}`);
      }

      const data = await res.json();
      if (data.success && Array.isArray(data.projects)) {
        const mapped = data.projects.map((p: any) => mapApiProjectToClientProject(p));
        setProjects(mapped);
      } else {
        throw new Error("Handshake returned malformed enclave register.");
      }
    } catch (err: any) {
      console.error("Error fetching projects:", err);
      setError(err.message || "Decentralized ledger handshake timed out.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Simulated Telemetry logs state
  const [logs, setLogs] = useState<string[]>([]);
  const [isLogSyncing, setIsLogSyncing] = useState(false);

  // Simulated Dispatch update request states
  const [isRequestingUpdate, setIsRequestingUpdate] = useState(false);
  const [dispatchStep, setDispatchStep] = useState(0);
  const [dispatchLogs, setDispatchLogs] = useState<string[]>([]);
  const [dispatchSuccess, setDispatchSuccess] = useState(false);

  // Dynamic visual notification banner
  const [notification, setNotification] = useState<string | null>(null);

  // Initialize and simulate logs
  useEffect(() => {
    if (selectedProject) {
      setLogs([
        `[${new Date().toLocaleTimeString()}] INITIATING TELMETRY SYNC FOR ${selectedProject.id}...`,
        `[${new Date().toLocaleTimeString()}] Connected to active host node: ${selectedProject.specs.nodeId}`,
        `[${new Date().toLocaleTimeString()}] Secure sandbox context state: ACTIVE`,
        `[${new Date().toLocaleTimeString()}] Memory footprint: ${selectedProject.specs.memory}`,
      ]);
    }
  }, [selectedProject]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isDrawerOpen && selectedProject && !isRequestingUpdate) {
      interval = setInterval(() => {
        const templates = [
          "Attesting sandbox kernel memory isolation boundaries...",
          "Running cryptographic binary verification handshake...",
          "Loading localized model weights into dedicated secure RAM...",
          "Establishing transient eBPF socket listener on port 443...",
          "Zero-Trust isolation check: SECURE (100% compliant)..."
        ];
        const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
        setLogs(prev => [...prev.slice(-4), `[${new Date().toLocaleTimeString()}] ${randomTemplate}`]);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isDrawerOpen, selectedProject, isRequestingUpdate]);

  const handleSyncTelemetry = () => {
    setIsLogSyncing(true);
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] MANUAL RE-SYNC INITIATED...`]);
    setTimeout(() => {
      setIsLogSyncing(false);
      setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] RE-SYNC COMPLETE. SECURITY ENCLAVE NOMINAL.`]);
    }, 1200);
  };

  const triggerUpdateRequest = (projId: string) => {
    setIsRequestingUpdate(true);
    setDispatchStep(1);
    setDispatchSuccess(false);
    setDispatchLogs(["Initializing sovereign socket handshake..."]);
    setTimeout(() => {
      setDispatchStep(2);
      setDispatchLogs(prev => [...prev, "Broadcasting PRIORITY LEVEL ALPHA dispatch to GFF Engineering Guild..."]);
    }, 1000);
    setTimeout(() => {
      setDispatchSuccess(true);
      setNotification(`Emergency program status update requested for project ${projId}`);
    }, 2200);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setIsRequestingUpdate(false);
    setDispatchStep(0);
    setDispatchLogs([]);
    setDispatchSuccess(false);
  };

  const handleOpenProjectDetails = (proj: ClientProject) => {
    setSelectedProject(proj);
    setIsDrawerOpen(true);
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const filteredProjects = projects.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.owner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPhase = selectedPhase ? p.phase === selectedPhase : true;
    const matchesHealth = selectedHealth ? p.healthStatus === selectedHealth : true;
    return matchesSearch && matchesPhase && matchesHealth;
  });

  const onTrackCount = projects.filter(p => p.healthStatus === "On Track").length;
  const warningCount = projects.filter(p => p.healthStatus === "Warning").length;
  const criticalCount = projects.filter(p => p.healthStatus === "Critical").length;

  const garageCount = projects.filter(p => p.phase === "Garage").length;
  const foundryCount = projects.filter(p => p.phase === "Foundry").length;
  const factoryCount = projects.filter(p => p.phase === "Factory").length;
  const operateCount = projects.filter(p => p.phase === "Operate").length;
  const lifecycleBalance = `${garageCount}G | ${foundryCount}F | ${factoryCount}F | ${operateCount}O`;

  const avgCompliance = projects.length > 0 
    ? (projects.reduce((acc, p) => acc + p.specs.complianceScore, 0) / projects.length).toFixed(2) + "%"
    : "97.53%";

  return (
    <div className="space-y-6 max-w-[1750px] mx-auto pb-16 select-none relative">
      
      {/* 0. FLOATING NOTIFICATION */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top duration-300">
          <div className="border border-emerald-500/20 bg-emerald-950/70 backdrop-blur-md text-emerald-300 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 font-mono text-[11.5px]">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notification}</span>
            <button onClick={() => setNotification(null)} className="ml-2 hover:text-white text-emerald-300/60">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 1. SECURE DISCLOSURE BANNER */}
      <div className="border border-[#009DFF]/20 bg-[#009DFF]/5 rounded-xl px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-[11px]">
        <div className="flex items-center gap-2.5 text-white/70">
          <Activity className="w-4 h-4 text-[#009DFF] shrink-0" />
          <span>
            <strong className="text-white">SYSTEM CONNECTION ACTIVE:</strong> Live monitoring of your active systems is online. Details show your active system workspaces.
          </span>
        </div>
        <span className="text-[9.5px] text-[#009DFF]/80 font-bold bg-[#009DFF]/10 border border-[#009DFF]/20 px-2 py-0.5 rounded uppercase tracking-wider shrink-0 select-none">
          SYSTEM ACTIVE
        </span>
      </div>

      {/* 2. PRIVATE PAGE WELCOME HEADER */}
      <PrivatePageHeader
        title="Project Tracking Dashboard"
        desc="Track active projects, setup progress, and system health status."
        badgeLabel="Projects Monitor"
        actions={
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <button
              onClick={() => {
                triggerUpdateRequest("GLOBAL-COCKPIT");
                setIsDrawerOpen(true);
              }}
              className="flex-grow md:flex-grow-0 inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.02] px-4 text-[11px] font-mono font-bold text-white hover:bg-white/[0.06] hover:border-white/20 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-white/60" />
              <span>RUN COMPREHENSIVE SCAN</span>
            </button>
            <button
              onClick={() => router.push("/portal/support")}
              className="flex-grow md:flex-grow-0 inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-[#009DFF] px-4 text-[11px] font-mono font-bold text-white hover:bg-[#009DFF]/90 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,157,255,0.2)]"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>GET HELP / SUPPORT</span>
            </button>
          </div>
        }
      />

      {/* 3. REAL-TIME PROGRAM HEALTH METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricTile
          title="Active Engagements"
          value={`${projects.length} Enclaves`}
          delta={projects.length > 0 ? `+${projects.length}` : "0"}
          direction="up"
          status="stable"
          sparkPoints={[4, 5, 5, 5, 5, 6, 6, 6, 6, projects.length]}
        />
        <MetricTile
          title="Lifecycle Balance"
          value={lifecycleBalance}
          delta="NOMINAL"
          direction="neutral"
          status="normal"
          sparkPoints={[10, 15, 12, 18, 20, 24, 22, 28, 30, 32]}
        />
        <MetricTile
          title="Program Health Ratio"
          value={`${onTrackCount} OK / ${warningCount} WRN` + (criticalCount > 0 ? ` / ${criticalCount} CRT` : "")}
          delta="STABLE"
          direction="neutral"
          status={criticalCount > 0 ? "warning" : "normal"}
          sparkPoints={[90, 92, 88, 93, 91, 95, 94, 96, 96, 96]}
        />
        <MetricTile
          title="Avg Compliance Guard"
          value={avgCompliance}
          delta="+0.82%"
          direction="up"
          status="stable"
          sparkPoints={[95.1, 95.8, 96.2, 96.0, 96.9, 97.2, 97.0, 97.4, 97.5, parseFloat(avgCompliance)]}
        />
      </div>

      {/* 4. FILTER & VIEW CONTROL BAR */}
      <WorkspaceCard className="p-4 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-grow max-w-lg">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-white/30" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, program name, owner, description..."
            className="w-full h-9 rounded-lg border border-white/5 bg-white/[0.02] pl-9 pr-4 text-[12px] font-mono text-white placeholder-white/30 outline-none focus:border-white/15 focus:bg-white/[0.04] transition-all"
          />
        </div>

        {/* Filter Selectors */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Phase Filter */}
          <div className="relative">
            <select
              value={selectedPhase}
              onChange={(e) => setSelectedPhase(e.target.value)}
              className="h-9 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] px-3 pr-8 text-[11px] font-mono text-white/70 focus:text-white outline-none transition-all cursor-pointer appearance-none uppercase"
            >
              <option value="" className="bg-[#0c0c0c] text-white">ALL LIFECYCLE PHASES</option>
              {LIFECYCLE_PHASES.map(ph => (
                <option key={ph} value={ph} className="bg-[#0c0c0c] text-white">{ph.toUpperCase()}</option>
              ))}
            </select>
            <SlidersHorizontal className="absolute right-3 top-2.5 w-3.5 h-3.5 text-white/40 pointer-events-none" />
          </div>

          {/* Health Status Filter */}
          <div className="relative">
            <select
              value={selectedHealth}
              onChange={(e) => setSelectedHealth(e.target.value)}
              className="h-9 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] px-3 pr-8 text-[11px] font-mono text-white/70 focus:text-white outline-none transition-all cursor-pointer appearance-none uppercase"
            >
              <option value="" className="bg-[#0c0c0c] text-white">ALL HEALTH STATUSES</option>
              <option value="On Track" className="bg-[#0c0c0c] text-white">ON TRACK</option>
              <option value="Warning" className="bg-[#0c0c0c] text-white">WARNING</option>
              <option value="Critical" className="bg-[#0c0c0c] text-white">CRITICAL</option>
            </select>
            <SlidersHorizontal className="absolute right-3 top-2.5 w-3.5 h-3.5 text-white/40 pointer-events-none" />
          </div>

          {/* Toggle View Mode Buttons */}
          <div className="flex border border-white/5 rounded-lg overflow-hidden shrink-0">
            <button
              onClick={() => setViewMode("grid")}
              className={`h-9 px-3 text-[11px] font-mono font-bold uppercase transition-all ${
                viewMode === "grid" 
                  ? "bg-white/5 text-white" 
                  : "bg-transparent text-white/40 hover:text-white/60"
              }`}
            >
              GRID
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`h-9 px-3 text-[11px] font-mono font-bold uppercase transition-all ${
                viewMode === "table" 
                  ? "bg-white/5 text-white" 
                  : "bg-transparent text-white/40 hover:text-white/60"
              }`}
            >
              TABLE
            </button>
          </div>

          {/* Reset Filters Option */}
          {(searchQuery || selectedPhase || selectedHealth) && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedPhase("");
                setSelectedHealth("");
              }}
              className="text-[10px] font-mono text-red-400 hover:text-red-300 uppercase tracking-wider underline cursor-pointer"
            >
              Clear Filters
            </button>
          )}
        </div>
      </WorkspaceCard>

      {/* 5. MAIN CONTENT */}
      {loading ? (
        <ProjectsSkeleton />
      ) : error ? (
        <ProjectsErrorState message={error} onRetry={fetchProjects} />
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          title="No Sandbox Program Records Match"
          description="Clear filters to restore telemetry."
          actionLabel="RESET FILTERS"
          onAction={() => { setSearchQuery(""); setSelectedPhase(""); setSelectedHealth(""); }}
          icon={FolderOpen}
        />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((p) => (
            <WorkspaceCard 
              key={p.id} 
              className="flex flex-col h-full border border-white/5 bg-[#050505]/40 hover:border-white/10 transition-all p-5 rounded-2xl relative"
              spotlightColor={p.healthStatus === "On Track" ? "rgba(16,185,129,0.03)" : p.healthStatus === "Warning" ? "rgba(251,191,36,0.03)" : "rgba(228,0,15,0.03)"}
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-mono font-bold text-[#009DFF]">{p.id}</span>
                  <span className="text-[9px] text-white/20 font-mono">•</span>
                  <span className="text-[9.5px] font-mono text-white/40 bg-white/5 border border-white/10 px-1 py-0.2 rounded uppercase">{p.env}</span>
                </div>
                <StatusBadge state={p.healthStatus === "On Track" ? "stable" : p.healthStatus === "Warning" ? "warning" : "error"} label={p.healthStatus} />
              </div>
              
              <div className="mt-3 flex-grow space-y-1">
                <h3 className="text-[13.5px] font-bold text-white font-mono uppercase truncate">{p.name}</h3>
                <p className="text-[11px] text-white/50 leading-relaxed font-mono font-light min-h-[50px]">{p.description}</p>
              </div>
              
              <div className="mt-3 flex items-center gap-2 p-2 rounded-lg bg-white/[0.01] border border-white/5 text-[11px] font-mono">
                <div className="h-6 w-6 rounded bg-[#009DFF]/10 flex items-center justify-center text-[9px] font-bold text-[#009DFF]">{p.owner.avatarInitials}</div>
                <div>
                  <div className="text-[8px] font-mono text-white/30 uppercase">Delivery Lead</div>
                  <div className="text-[10.5px] text-white/80 font-bold">{p.owner.name}</div>
                </div>
              </div>
              
              <div className="mt-3 space-y-1.5 p-2.5 bg-white/[0.01] border border-white/5 rounded-lg">
                <div className="flex items-center gap-1.5">
                  <span className="text-[8.5px] font-mono text-white/30 uppercase block font-bold font-sans">Lifecycle Stage</span>
                  <InfoTooltip content="GFF Lifecycle Stages: 1. Garage (Planning & Threat Modeling), 2. Foundry (Secure Enclave Setup), 3. Factory (AI Agent Alignment & UAT), 4. Operate (Live Production with Active Telemetry)." />
                </div>
                <div className="relative flex justify-between px-1">
                  <div className="absolute left-2 right-2 top-1/2 -translate-y-1/2 h-0.5 border-t border-dashed border-white/10" />
                  {LIFECYCLE_PHASES.map((phase, idx) => {
                    const isCurrent = p.phase === phase;
                    const isPast = LIFECYCLE_PHASES.indexOf(p.phase) > idx;
                    return (
                      <div key={phase} className="flex flex-col items-center relative z-10">
                        <div className={`h-4 w-4 rounded-full flex items-center justify-center text-[8px] font-bold border ${isCurrent ? "bg-[#009DFF]/20 border-[#009DFF] text-[#009DFF] shadow-[0_0_8px_rgba(0,157,255,0.4)]" : isPast ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-[#050505] border-white/5 text-white/20"}`}>{isPast ? "✓" : idx + 1}</div>
                        <span className={`text-[8.5px] font-mono mt-0.5 ${isCurrent ? "text-white font-bold" : isPast ? "text-white/50" : "text-white/20"}`}>{phase}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-3 space-y-1">
                <div className="flex justify-between items-center text-[9.5px] font-mono text-white/40">
                  <span>DEPLOYMENT PROGRESS</span>
                  <span className="text-white/80 font-bold">{p.progress}%</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${p.healthStatus === "On Track" ? "bg-[#009DFF]" : p.healthStatus === "Warning" ? "bg-amber-400" : "bg-red-500"}`} style={{ width: `${p.progress}%` }} />
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-white/5 flex items-start gap-2 text-[10px] font-mono text-white/45">
                <Calendar className="w-3.5 h-3.5 text-white/30 shrink-0" />
                <div className="space-y-0.5">
                  <span className="text-white/20 text-[8px] block font-bold">NEXT TARGET GATE</span>
                  <span className="text-white/80 font-medium block leading-tight truncate max-w-[200px]">{p.nextMilestone}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 grid grid-cols-2 gap-2">
                <button onClick={() => triggerUpdateRequest(p.id)} className="h-7.5 rounded border border-white/5 hover:bg-white/5 text-[9.5px] font-mono text-white/50 hover:text-white uppercase tracking-wider cursor-pointer">Request Update</button>
                <button onClick={() => handleOpenProjectDetails(p)} className="h-7.5 rounded bg-[#009DFF]/10 text-[9.5px] font-mono text-[#009DFF] hover:text-white flex items-center justify-center gap-1 cursor-pointer"><span>Inspect</span><ArrowUpRight className="w-3 h-3" /></button>
              </div>
            </WorkspaceCard>
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="border border-white/5 rounded-xl bg-[#050505]/40 backdrop-blur-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left font-mono text-[11.5px] text-white/70">
              <thead>
                <tr className="border-b border-white/5 text-white/30 text-[9px] uppercase">
                  <th className="p-3 pl-5">ID</th>
                  <th className="p-3">Program / Project</th>
                  <th className="p-3">Phase</th>
                  <th className="p-3">Delivery Lead</th>
                  <th className="p-3 text-center">Progress</th>
                  <th className="p-3">Health</th>
                  <th className="p-3 text-right pr-5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredProjects.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.01]">
                    <td className="p-3 pl-5 text-[#009DFF] font-bold">{p.id}</td>
                    <td className="p-3">
                      <div className="font-semibold text-white uppercase text-[11px]">{p.name}</div>
                      <div className="text-[9px] text-white/30">{p.env}</div>
                    </td>
                    <td className="p-3">
                      <span className="px-1.5 py-0.2 text-[8.5px] font-bold bg-[#009DFF]/10 text-[#009DFF] rounded border border-[#009DFF]/20 uppercase">
                        {p.phase}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="text-white/80 font-bold text-[10px]">{p.owner.name}</div>
                    </td>
                    <td className="p-3 text-center font-bold text-white">{p.progress}%</td>
                    <td className="p-3">
                      <StatusBadge state={p.healthStatus === "On Track" ? "stable" : p.healthStatus === "Warning" ? "warning" : "error"} label={p.healthStatus} />
                    </td>
                    <td className="p-3 text-right pr-5 space-x-1.5">
                      <button onClick={() => triggerUpdateRequest(p.id)} className="h-6 px-2 text-[9px] font-bold text-white/40 hover:text-white bg-white/5 border border-white/5 rounded cursor-pointer">Update</button>
                      <button onClick={() => handleOpenProjectDetails(p)} className="h-6 px-2 text-[9px] font-bold text-[#009DFF] bg-[#009DFF]/5 border border-[#009DFF]/10 rounded cursor-pointer">Inspect</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. SLIDE-OVER TELEMETRY & SPECS DRAWER */}
      <div className={`fixed inset-0 z-50 overflow-hidden transition-all duration-300 ${isDrawerOpen ? "visible" : "invisible pointer-events-none"}`}>
        <div onClick={closeDrawer} className={`absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 ${isDrawerOpen ? "opacity-100" : "opacity-0"}`} />
        <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-gradient-to-b from-[#0a0a0a] to-[#040404] border-l border-white/10 shadow-2xl flex flex-col transition-transform duration-300 ease-out transform ${isDrawerOpen ? "translate-x-0" : "translate-x-full"}`}>
          {selectedProject ? (
            <div className="flex flex-col h-full overflow-y-auto p-4 space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <div>
                  <span className="text-[9px] font-mono font-bold text-[#009DFF] bg-[#009DFF]/5 border border-[#009DFF]/20 px-1.5 py-0.5 rounded">{selectedProject.id}</span>
                  <h3 className="text-sm font-bold text-white font-mono uppercase mt-1">{selectedProject.name}</h3>
                </div>
                <button onClick={closeDrawer} className="text-white/40 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
              </div>

              {isRequestingUpdate && (
                <div className="p-3 rounded border border-[#009DFF]/20 bg-[#009DFF]/5 space-y-1 font-mono text-[9.5px]">
                  <div className="flex items-center gap-1.5 text-[#009DFF] animate-pulse"><span>Handshake Active...</span></div>
                  {dispatchSuccess && <div className="text-emerald-400 font-bold">Dispatch complete. ETA &lt; 15 mins.</div>}
                </div>
              )}

              <div className="space-y-1 text-[10px] font-mono">
                <span className="text-white/30 text-[8.5px] uppercase block font-bold">Enclave Parameters</span>
                <div className="grid grid-cols-2 gap-1.5">
                  <div className="p-2 bg-black/40 border border-white/5 rounded">Node: <span className="text-white font-bold">{selectedProject.specs.nodeId}</span></div>
                  <div className="p-2 bg-black/40 border border-white/5 rounded">Cores: <span className="text-white font-bold">{selectedProject.specs.cores}</span></div>
                  <div className="p-2 bg-black/40 border border-white/5 rounded">RAM: <span className="text-white font-bold">{selectedProject.specs.memory}</span></div>
                  <div className="p-2 bg-black/40 border border-white/5 rounded">Compliance: <span className="text-emerald-400 font-bold">{selectedProject.specs.complianceScore}%</span></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-[9px] font-mono"><span className="text-white/40 block font-bold">Diagnostics Stream</span><button onClick={handleSyncTelemetry} disabled={isLogSyncing} className="text-[#009DFF] hover:underline cursor-pointer">RE-SYNC</button></div>
                <div className="p-2 rounded bg-black border border-white/5 text-[9px] font-mono text-emerald-400 h-28 overflow-y-auto">
                  {logs.map((log, idx) => ( <div key={idx}>{log}</div> ))}
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 flex gap-2 mt-auto">
                <Link href={`/portal/projects/${selectedProject.id}`} className="flex-1 h-8 inline-flex items-center justify-center border border-white/10 text-white font-mono font-bold text-[9.5px] uppercase hover:bg-white/5 rounded"><span>Open Sandbox</span></Link>
                <button onClick={() => triggerUpdateRequest(selectedProject.id)} className="flex-1 h-8 rounded bg-[#009DFF] text-white font-mono font-bold text-[9.5px] uppercase cursor-pointer">Request Update</button>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center font-mono text-[11px] space-y-2 flex flex-col justify-center h-full">
              <Terminal className="w-8 h-8 text-[#009DFF] mx-auto" />
              <h4 className="text-white font-bold uppercase">GLOBAL COCKPIT ACTIVE</h4>
              <button onClick={() => triggerUpdateRequest("GLOBAL")} className="h-8 rounded bg-[#009DFF] text-white font-bold text-[9.5px] uppercase cursor-pointer">Run Global Audit</button>
              <button onClick={closeDrawer} className="text-white/40 underline cursor-pointer">Close</button>
            </div>
          )}
        </div>
      </div>

      {/* 7. PREMIUM COMPREHENSIVE SLA ACTION BANNER */}
      <WorkspaceCard className="border border-[#009DFF]/20 bg-gradient-to-br from-[#040914] to-[#010307] p-5 rounded-2xl relative overflow-hidden mt-6">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><ShieldCheck className="w-40 h-40 text-[#009DFF]" /></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-1.5 text-[#009DFF]"><Sparkles className="w-3.5 h-3.5 animate-pulse" /><span className="text-[9px] font-mono font-bold tracking-widest uppercase">GFF AI Delivery Assurance</span></div>
            <h4 className="text-[13.5px] font-bold text-white font-mono uppercase">Need to accelerate development or adjust sandbox specifications?</h4>
            <p className="text-[11px] text-white/60 font-mono">All enclaves are backed by our enterprise Delivery Service Level Agreement (SLA). Request compute upgrades or invoke support over our secure wire.</p>
          </div>
          <div className="shrink-0 flex gap-2 w-full md:w-auto">
            <button onClick={() => { triggerUpdateRequest("SLA-UPGRADE"); setIsDrawerOpen(true); }} className="h-8.5 px-4 rounded-lg border border-white/10 hover:bg-white/5 text-white font-mono font-bold text-[10px] uppercase cursor-pointer">Request Scope Shift</button>
            <button onClick={() => router.push("/portal/support")} className="h-8.5 px-4 rounded-lg bg-[#009DFF] text-white font-mono font-bold text-[10px] uppercase cursor-pointer">Contact Delivery Lead</button>
          </div>
        </div>
      </WorkspaceCard>

    </div>
  );
}

