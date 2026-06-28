"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { 
  Bot, 
  ShieldCheck, 
  Cpu, 
  RefreshCw, 
  Layers, 
  Clock, 
  ArrowUpRight, 
  Activity, 
  Search, 
  ChevronDown, 
  ShieldAlert, 
  SlidersHorizontal,
  Server,
  Lock,
  ArrowRight,
  Eye,
  Flame
} from "lucide-react";

import { 
  WorkspaceCard, 
  StatusBadge,
  PrivatePageHeader,
  Timeline,
  GovernancePanel,
  InfoTooltip
} from "@/components/private-app";

import { mapApiOpToEnrichedAgent, EnrichedAgent } from "./mapping-helper";

function OperationsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((n) => (
        <WorkspaceCard key={n} className="flex flex-col h-full border border-white/5 bg-[#050505]/20 p-5 rounded-2xl relative animate-pulse">
          <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
            <div className="h-4 bg-white/5 rounded w-1/3" />
            <div className="h-4 bg-white/5 rounded w-1/5" />
          </div>
          <div className="mt-4 space-y-3 flex-grow">
            <div className="h-5 bg-white/5 rounded w-3/4" />
            <div className="h-3 bg-white/5 rounded w-full" />
            <div className="h-3 bg-white/5 rounded w-5/6" />
          </div>
          <div className="mt-4 h-24 bg-white/5 rounded-lg w-full" />
          <div className="mt-4 flex gap-2">
            <div className="h-8 bg-white/5 rounded w-full" />
            <div className="h-8 bg-white/5 rounded w-12" />
          </div>
        </WorkspaceCard>
      ))}
    </div>
  );
}

function OperationsErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <WorkspaceCard className="p-8 border border-red-500/10 bg-red-950/5 rounded-2xl flex flex-col items-center justify-center text-center space-y-4 max-w-lg mx-auto my-12">
      <div className="p-3 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
        <Activity className="w-8 h-8 animate-pulse" />
      </div>
      <div className="space-y-1.5 font-mono">
        <h4 className="text-white font-bold uppercase text-[14px]">TELEMETRY DESYNC ERROR</h4>
        <p className="text-white/50 text-[11px] leading-relaxed">{message || "Failed to establish continuous secure channel with the telemetry ledger."}</p>
      </div>
      <button
        onClick={onRetry}
        className="h-9 px-6 rounded-lg bg-[#009DFF] hover:bg-[#009DFF]/90 text-white font-mono font-bold text-[11px] uppercase cursor-pointer flex items-center gap-2 transition-all"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span>RE-ESTABLISH HANDSHAKE</span>
      </button>
    </WorkspaceCard>
  );
}

function OperationsEmptyState() {
  return (
    <WorkspaceCard className="p-8 border border-white/5 bg-[#050505]/20 rounded-2xl flex flex-col items-center justify-center text-center space-y-4 max-w-lg mx-auto my-12">
      <div className="p-3 rounded-full bg-[#009DFF]/10 border border-[#009DFF]/20 text-[#009DFF]">
        <Bot className="w-8 h-8 animate-pulse" />
      </div>
      <div className="space-y-1.5 font-mono">
        <h4 className="text-white font-bold uppercase text-[14px]">NO AI OPERATIONS ENROLLED</h4>
        <p className="text-white/50 text-[11px] leading-relaxed">This client partition currently has no active or archived sandboxed runtime records in the registry.</p>
      </div>
    </WorkspaceCard>
  );
}


// Custom Health Ring Component
function HealthRing({ 
  percentage, 
  title, 
  value, 
  color = "#009DFF" 
}: { 
  percentage: number; 
  title: string; 
  value: string; 
  color?: string; 
}) {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-[#050505]/30 backdrop-blur-sm hover:border-white/10 transition-all select-none">
      <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
        <svg className="w-full h-full transform -rotate-90">
          <circle 
            cx="32" 
            cy="32" 
            r={radius} 
            stroke="rgba(255,255,255,0.03)" 
            strokeWidth="4" 
            fill="transparent" 
          />
          <circle 
            cx="32" 
            cy="32" 
            r={radius} 
            stroke={color} 
            strokeWidth="4" 
            fill="transparent" 
            strokeDasharray={circumference} 
            strokeDashoffset={strokeDashoffset} 
            strokeLinecap="round" 
            className="transition-all duration-1000 ease-out" 
          />
        </svg>
        <span className="absolute text-[10px] font-mono font-bold text-white">
          {percentage}%
        </span>
      </div>
      <div className="font-mono">
        <span className="text-[9px] uppercase tracking-wider text-white/35 block leading-none">{title}</span>
        <span className="text-[13px] font-bold text-white block mt-1.5 leading-none">{value}</span>
        <span className="text-[8.5px] text-[#009DFF] font-medium block mt-1 tracking-wide uppercase">SANDBOX REPL</span>
      </div>
    </div>
  );
}


export default function ClientAiOperationsPage() {
  const [agents, setAgents] = useState<EnrichedAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rebootingMap, setRebootingMap] = useState<Record<string, boolean>>({});
  
  // Interactive Filters State
  const [search, setSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedStage, setSelectedStage] = useState("all");

  // Tabs State
  const [activeTab, setActiveTab] = useState<"telemetry" | "hardware" | "governance">("telemetry");

  const fetchOperations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("gff_ai_access_token") : null;
      const res = await fetch("/api/v1/ai-operations", {
        headers: {
          "Authorization": `Bearer ${token || ""}`,
          "Content-Type": "application/json"
        }
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (data.success && Array.isArray(data.operations)) {
        const mapped = data.operations.map(mapApiOpToEnrichedAgent);
        setAgents(mapped);
      } else {
        throw new Error(data.message || "Failed to retrieve sandbox telemetry ledger.");
      }
    } catch (err: any) {
      console.error("Error fetching AI operations:", err);
      setError(err.message || "An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOperations();
  }, [fetchOperations]);

  // Dynamic Reboot Handler (Simulated Enclave Cycling)
  const handleRecycleEnclave = (agentId: string) => {
    if (rebootingMap[agentId]) return;

    setRebootingMap(prev => ({ ...prev, [agentId]: true }));
    
    // Log reboot sequence initiation
    setAgents(prev => prev.map(agent => {
      if (agent.id === agentId) {
        return {
          ...agent,
          logs: [
            ...agent.logs,
            `[${new Date().toLocaleTimeString()}] CRITICAL: INITIATING COLD REBOOT SEQUENCE...`,
            `[${new Date().toLocaleTimeString()}] INTERRUPT VECTOR SEALS TRIGGERED`,
            `[${new Date().toLocaleTimeString()}] RE-INITIALIZING CRYPTOGRAPHIC HARDWARE...`
          ]
        };
      }
      return agent;
    }));

    setTimeout(() => {
      setRebootingMap(prev => ({ ...prev, [agentId]: false }));
      setAgents(prev => prev.map(agent => {
        if (agent.id === agentId) {
          // If decoupled, return with active status on recycling
          const finalStatus = agent.status === "decoupled" ? "active" : agent.status;
          return {
            ...agent,
            status: finalStatus,
            logs: [
              ...agent.logs,
              `[${new Date().toLocaleTimeString()}] HARDWARE CORE RE-ALIGNED OK`,
              `[${new Date().toLocaleTimeString()}] ZERO-TRUST ATTESTATION INSTRUCTIONS INJECTED`,
              `[${new Date().toLocaleTimeString()}] TELEMETRY PORT STABLE (SHA256: 0x9AF8)`
            ]
          };
        }
        return agent;
      }));
    }, 1800);
  };

  // Filter Agents Logic
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(search.toLowerCase()) || 
                          agent.id.toLowerCase().includes(search.toLowerCase()) ||
                          agent.type.toLowerCase().includes(search.toLowerCase());
    const matchesProject = selectedProject === "all" || agent.projectId === selectedProject;
    const matchesType = selectedType === "all" || agent.type === selectedType;
    const matchesStatus = selectedStatus === "all" || agent.status === selectedStatus;
    const matchesStage = selectedStage === "all" || agent.stage === selectedStage;

    return matchesSearch && matchesProject && matchesType && matchesStatus && matchesStage;
  });

  const resetFilters = () => {
    setSearch("");
    setSelectedProject("all");
    setSelectedType("all");
    setSelectedStatus("all");
    setSelectedStage("all");
  };

  // Mock Timeline Steps for Governance
  const timelineSteps = [
    {
      title: "HARDWARE INTENT COMPLIANCE SECURED",
      desc: "Hardware attestation successfully verified signatures across 5 isolated AMD SEV-SNP and Intel SGX runtimes.",
      status: "complete" as const,
      timestamp: "2 hours ago"
    },
    {
      title: "PROMPT INJECTION BARRIER RE-SEALED",
      desc: "Local Model Guardrails completed continuous validation scan. Compliance score locked at 1.0/1.0.",
      status: "complete" as const,
      timestamp: "5 hours ago"
    },
    {
      title: "HSM COMPLIANCE ROOT CHECK",
      desc: "Ongoing zero-trust validation of isolated memory partitions and decoupled system interfaces.",
      status: "current" as const,
      timestamp: "Ongoing"
    },
    {
      title: "WEEKLY HARDWARE ENCLAVE ROTATION",
      desc: "Automated cryptographic key rollover and fresh partition reallocation for continuous sandbox integrity.",
      status: "pending" as const,
      timestamp: "Scheduled"
    }
  ];


  return (
    <div className="space-y-6 max-w-[1750px] mx-auto pb-12 select-none">
      
      {/* 1. SECURE DISCLOSURE BANNER */}
      <div className="border border-[#009DFF]/20 bg-[#009DFF]/5 rounded-xl px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-[11px]">
        <div className="flex items-center gap-2.5 text-white/70">
          <ShieldAlert className="w-4 h-4 text-[#009DFF] shrink-0 animate-pulse" />
          <span>
            <strong className="text-white">SYSTEM MONITOR:</strong> This dashboard shows simulated health metrics, logs, and active configurations of your AI systems.
          </span>
        </div>
        <span className="text-[9.5px] text-[#009DFF]/80 font-bold bg-[#009DFF]/10 border border-[#009DFF]/20 px-2 py-0.5 rounded uppercase tracking-wider shrink-0 select-none">
          SYSTEM SIMULATOR
        </span>
      </div>

      {/* 2. PAGE HEADER */}
      <PrivatePageHeader
        title="AI Agents & Systems Control Center"
        desc="Monitor your active AI agents, view live load metrics, and track system logs."
        badgeLabel="AI Systems Health"
        actions={
          <div className="flex gap-2 w-full md:w-auto">
            <Link
              href="/portal/control-center"
              className="flex-grow md:flex-grow-0 inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-[#009DFF] hover:bg-[#009DFF]/90 text-white font-mono font-bold text-[11px] px-4 uppercase tracking-wider transition-all hover:shadow-[0_0_12px_rgba(0,157,255,0.25)]"
            >
              Systems Control Center
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        }
      />


      {/* 3. MANAGED OPERATION STATUS RAIL */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 border border-white/5 rounded-xl bg-white/[0.01] p-3.5 font-mono text-[11px]">
        <div className="flex items-center gap-2.5 px-3 py-1 border-b md:border-b-0 md:border-r border-white/5">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-white/40">STATUS:</span>
          <span className="text-[#00FFC2] font-bold">RUNNING & HEALTHY</span>
        </div>
        <div className="flex items-center gap-2.5 px-3 py-1 border-b md:border-b-0 md:border-r border-white/5">
          <Cpu className="w-3.5 h-3.5 text-[#009DFF]" />
          <span className="text-white/40">AI AGENTS:</span>
          <span className="text-white font-bold">5 ACTIVE AGENTS</span>
        </div>
        <div className="flex items-center gap-2.5 px-3 py-1 border-b md:border-b-0 md:border-r border-white/5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-white/40">SECURITY STATUS:</span>
          <span className="text-emerald-400 font-bold">OPTIMAL</span>
        </div>
        <div className="flex items-center gap-2.5 px-3 py-1">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-white/40">SYSTEM CHECK:</span>
          <span className="text-white font-bold">AUTOMATED (EVERY 2H)</span>
        </div>
      </div>

      {/* 4. HEALTH OVERVIEW & RUNTIME STATUS (HEALTH RINGS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <HealthRing 
          percentage={68} 
          title="Avg Core CPU Load" 
          value="59.84 Gigaflops" 
          color="#10b981" 
        />
        <HealthRing 
          percentage={78} 
          title="Sandbox Memory Lock" 
          value="27.2 GB / 34.0 GB" 
          color="#009DFF" 
        />
        <HealthRing 
          percentage={100} 
          title="Guardrail Compliance" 
          value="4 / 4 Rules Enforced" 
          color="#00FFC2" 
        />
        
        {/* Rapid Overview Metric Tile */}
        <WorkspaceCard className="flex flex-col justify-between p-4 bg-[#050505]/20">
          <div className="flex justify-between items-start font-mono">
            <div>
              <span className="text-[9px] text-white/35 uppercase tracking-wider block">Aggregate Pulse Latency</span>
              <span className="text-[18px] font-bold text-white mt-1.5 block">16.42 ms</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#00FFC2]/5 border border-[#00FFC2]/20 text-[#00FFC2] font-bold">
              OPTIMAL
            </span>
          </div>
          <div className="border-t border-white/5 pt-2 mt-2 flex justify-between items-center text-[10px] font-mono text-white/45">
            <span>UPTIME SCORE:</span>
            <span className="text-white font-bold">99.998% CERTIFIED</span>
          </div>
        </WorkspaceCard>
      </div>

      {/* 5. TABS SYSTEM */}
      <div className="flex border-b border-white/5 font-mono text-[12px]">
        <button
          onClick={() => setActiveTab("telemetry")}
          className={`px-5 py-3 border-b-2 font-bold transition-all ${
            activeTab === "telemetry" 
              ? "border-[#009DFF] text-white bg-white/[0.02]" 
              : "border-transparent text-white/40 hover:text-white/70"
          }`}
        >
          ACTIVE TELEMETRY LEDGER
        </button>
        <button
          onClick={() => setActiveTab("hardware")}
          className={`px-5 py-3 border-b-2 font-bold transition-all ${
            activeTab === "hardware" 
              ? "border-[#009DFF] text-white bg-white/[0.02]" 
              : "border-transparent text-white/40 hover:text-white/70"
          }`}
        >
          HARDWARE & ENCLAVE ARCHITECTURE
        </button>
        <button
          onClick={() => setActiveTab("governance")}
          className={`px-5 py-3 border-b-2 font-bold transition-all ${
            activeTab === "governance" 
              ? "border-[#009DFF] text-white bg-white/[0.02]" 
              : "border-transparent text-white/40 hover:text-white/70"
          }`}
        >
          GOVERNANCE & ACTIVITY LOG
        </button>
      </div>

      {/* ==========================================
          TAB 1: TELEMETRY & ACTIVE AGENTS GRID
          ========================================== */}
      {activeTab === "telemetry" && (
        <div className="space-y-6">
          <WorkspaceCard className="p-4 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-white/5">
              <SlidersHorizontal className="w-4 h-4 text-[#009DFF]" />
              <h3 className="text-xs font-mono font-bold uppercase text-white tracking-widest">Interactive Telemetry Filters</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-white/30" />
                <input 
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search agent ID, name..."
                  className="w-full h-9 rounded-lg border border-white/5 bg-white/[0.02] pl-9 pr-4 text-[11px] font-mono text-white placeholder-white/30 outline-none focus:border-[#009DFF]/50 focus:bg-white/[0.04] transition-all"
                />
              </div>
              <div className="relative">
                <select 
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  aria-label="Filter by Project"
                  className="w-full h-9 rounded-lg border border-white/5 bg-[#080808] px-3 pr-8 text-[11px] font-mono text-white/70 focus:text-white outline-none cursor-pointer appearance-none"
                >
                  <option value="all">ALL PROJECTS</option>
                  {Array.from(new Set(agents.map(a => JSON.stringify({ id: a.projectId, name: a.projectName }))))
                    .map(str => JSON.parse(str) as { id: string; name: string })
                    .map(p => (
                      <option key={p.id} value={p.id}>{p.name.toUpperCase()}</option>
                    ))
                  }
                </select>
                <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-white/40 pointer-events-none" />
              </div>
              <div className="relative">
                <select 
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  aria-label="Filter by Agent Type"
                  className="w-full h-9 rounded-lg border border-white/5 bg-[#080808] px-3 pr-8 text-[11px] font-mono text-white/70 focus:text-white outline-none cursor-pointer appearance-none"
                >
                  <option value="all">ALL AGENT TYPES</option>
                  <option value="Core Telemetry">Core Telemetry</option>
                  <option value="Alignment Guard">Alignment Guard</option>
                  <option value="Seismic Processing">Seismic Processing</option>
                  <option value="Medical Enclave">Medical Enclave</option>
                  <option value="Transport Node">Transport Node</option>
                </select>
                <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-white/40 pointer-events-none" />
              </div>
              <div className="relative">
                <select 
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  aria-label="Filter by Status"
                  className="w-full h-9 rounded-lg border border-white/5 bg-[#080808] px-3 pr-8 text-[11px] font-mono text-white/70 focus:text-white outline-none cursor-pointer appearance-none"
                >
                  <option value="all">ALL PULSE STATES</option>
                  <option value="active">Active</option>
                  <option value="evaluating">Evaluating</option>
                  <option value="warning">Warning</option>
                  <option value="decoupled">Decoupled</option>
                </select>
                <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-white/40 pointer-events-none" />
              </div>
              <div className="relative">
                <select 
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value)}
                  aria-label="Filter by Operating Stage"
                  className="w-full h-9 rounded-lg border border-white/5 bg-[#080808] px-3 pr-8 text-[11px] font-mono text-white/70 focus:text-white outline-none cursor-pointer appearance-none"
                >
                  <option value="all">ALL SECURE STAGES</option>
                  <option value="Sandbox Emulation">Sandbox Emulation</option>
                  <option value="Staging Enclave">Staging Enclave</option>
                  <option value="Production Guardrail">Production Guardrail</option>
                </select>
                <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-white/40 pointer-events-none" />
              </div>
            </div>
            {(search || selectedProject !== "all" || selectedType !== "all" || selectedStatus !== "all" || selectedStage !== "all") && (
              <div className="flex justify-between items-center text-[10px] font-mono text-white/45 bg-white/[0.01] border border-white/5 px-3 py-1.5 rounded">
                <span>
                  Filtering active sandbox ledger: found <strong className="text-white">{filteredAgents.length}</strong> matching agent nodes.
                </span>
                <button onClick={resetFilters} className="text-[#009DFF] hover:underline uppercase font-bold cursor-pointer">
                  Reset Active Filters
                </button>
              </div>
            )}
          </WorkspaceCard>


          {loading ? (
            <OperationsSkeleton />
          ) : error ? (
            <OperationsErrorState message={error} onRetry={fetchOperations} />
          ) : agents.length === 0 ? (
            <OperationsEmptyState />
          ) : filteredAgents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAgents.map((agent) => {
                const isRebooting = rebootingMap[agent.id];
                const badgeState = isRebooting ? "warning" : agent.status === "active" ? "active" : agent.status === "evaluating" ? "warning" : agent.status === "warning" ? "error" : "decoupled";
                const badgeLabel = isRebooting ? "RECYCLING" : agent.status;

                return (
                  <WorkspaceCard key={agent.id} className="space-y-4">
                    <div className="flex justify-between items-start border-b border-white/5 pb-3">
                      <div>
                        <span className="text-[8.5px] font-mono font-bold text-[#009DFF] bg-[#009DFF]/5 border border-[#009DFF]/20 px-1.5 py-0.5 rounded">
                          {agent.id.toUpperCase()} • {agent.type.toUpperCase()}
                        </span>
                        <h4 className="text-[13.5px] font-bold text-white font-mono mt-1.5 tracking-tight">
                          {agent.name}
                        </h4>
                      </div>
                      <StatusBadge state={badgeState} label={badgeLabel} />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                      <div className="p-2 border border-white/5 rounded bg-white/[0.01]">
                        <span className="text-white/30 block uppercase text-[8.5px]">Project Bounds</span>
                        <span className="text-white font-medium truncate block mt-1">{agent.projectName}</span>
                      </div>
                      <div className="p-2 border border-white/5 rounded bg-white/[0.01]">
                        <span className="text-white/30 block uppercase text-[8.5px]">Enclave Stage</span>
                        <span className="text-white font-medium block mt-1">{agent.stage}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-center select-none">
                      <div className="py-1.5 border border-white/5 rounded bg-black/40">
                        <span className="text-white/35 block text-[8px] uppercase">Alloc CPU</span>
                        <span className="text-white font-bold block mt-0.5">
                          {isRebooting ? "--" : `${agent.cpu}%`}
                        </span>
                      </div>
                      <div className="py-1.5 border border-white/5 rounded bg-black/40">
                        <span className="text-white/35 block text-[8px] uppercase">Memory State</span>
                        <span className="text-white font-bold block mt-0.5">
                          {isRebooting ? "--" : agent.memory.split(" / ")[0]}
                        </span>
                      </div>
                      <div className="py-1.5 border border-white/5 rounded bg-black/40">
                        <span className="text-white/35 block text-[8px] uppercase">Core Threads</span>
                        <span className="text-[#009DFF] font-bold block mt-0.5">
                          {isRebooting ? "0" : `${agent.threads}`}
                        </span>
                      </div>
                    </div>

                    <div className="border border-white/5 rounded-lg overflow-hidden bg-black/70 p-3 h-28 overflow-y-auto font-mono text-[9px] text-white/50 space-y-1">
                      {agent.logs.map((log, index) => (
                        <div key={index} className="leading-normal flex">
                          <span className="text-white/20 mr-1 shrink-0">&gt;</span>
                          <span className={
                            log.includes("REBOOT") || log.includes("CRITICAL") ? "text-[#009DFF]" :
                            log.includes("Attestation") || log.includes("successfully") || log.includes("OK") ? "text-emerald-400 font-semibold" : 
                            log.includes("Warning") ? "text-amber-400" : ""
                          }>
                            {log}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2 font-mono">
                      <button
                        onClick={() => handleRecycleEnclave(agent.id)}
                        disabled={isRebooting}
                        className="flex-grow inline-flex h-8 items-center justify-center gap-1.5 rounded border border-white/10 bg-white/[0.01] hover:bg-white/[0.04] text-[10px] font-bold text-white transition-all cursor-pointer disabled:opacity-50"
                      >
                        {isRebooting ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin text-[#009DFF]" />
                            <span>CYCLING...</span>
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-3 h-3" />
                            <span>RECYCLE CORE</span>
                          </>
                        )}
                      </button>
                      <Link
                        href={`/portal/ai-operations/${agent.id}`}
                        className="inline-flex h-8 w-10 items-center justify-center rounded border border-white/10 bg-[#009DFF]/10 text-white hover:bg-[#009DFF]/20 transition-all"
                        title="Inspect Telemetry Details"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#009DFF]" />
                      </Link>
                    </div>
                  </WorkspaceCard>
                );
              })}
            </div>


          ) : (
            <div className="border border-white/5 rounded-2xl bg-white/[0.01] p-12 text-center max-w-xl mx-auto space-y-4">
              <div className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center mx-auto bg-black">
                <SlidersHorizontal className="w-4 h-4 text-white/30" />
              </div>
              <div className="space-y-1 font-mono">
                <h4 className="text-[13px] font-bold text-white">No Sandboxes Match Active Filters</h4>
                <p className="text-[11px] text-white/40">Adjust filter values above to find active enclaves.</p>
              </div>
              <button
                onClick={resetFilters}
                className="inline-flex h-8 px-4 items-center justify-center rounded bg-white/5 border border-white/10 hover:bg-white/10 text-white font-mono text-[10.5px] uppercase transition-all"
              >
                Clear Active Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* ==========================================
          TAB 2: HARDWARE & ENCLAVE ARCHITECTURE
          ========================================== */}
      {activeTab === "hardware" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <WorkspaceCard className="space-y-4">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <Server className="w-4 h-4 text-[#009DFF]" />
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-widest">
                  GFF Zero-Trust Multi-Agent Hardware Overlay
                </h3>
              </div>

              <p className="text-[11.5px] font-mono text-white/60 leading-relaxed">
                The architecture below maps our managed isolation layers. AI enclaves exist inside dedicated physical servers leveraging <strong className="text-white">AMD SEV-SNP</strong> and <strong className="text-white">Intel SGX</strong> hardware instructions. Decoupled from the parent host's kernel space, our platform prevents any memory snooping or administrative compromise.
              </p>

              <div className="border border-white/5 rounded-xl bg-black/60 p-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[300px]">
                <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
                <div className="relative z-10 w-full max-w-lg space-y-6 text-center text-[10px] font-mono">
                  <div className="border border-white/10 bg-white/[0.01] p-3 rounded-lg relative">
                    <span className="absolute -top-2 left-3 px-1.5 bg-black border border-white/10 text-[8px] text-white/40">
                      PHYSICAL HOST HARDWARE LAYER
                    </span>
                    <div className="text-white/40 text-left mb-2">Unsecured Host hypervisor Memory Space (Host-OS)</div>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div className="border border-[#009DFF]/30 bg-[#009DFF]/5 p-3.5 rounded-lg relative space-y-2 group hover:border-[#009DFF] transition-all">
                        <div className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-[#009DFF] animate-ping" />
                        <div className="flex items-center gap-1.5">
                          <span className="text-[#009DFF] font-bold block text-[9.5px]">INTEL SGX</span>
                          <InfoTooltip content="Intel Software Guard Extensions isolate user-space code and data in hardware-protected memory segments (enclaves) to prevent host snooping." />
                        </div>
                        <div className="text-[8.5px] text-white/50 leading-relaxed">
                          Isolated User-Space Enclave. Memory fully encrypted at silicon layer.
                        </div>
                        <div className="text-[7.5px] text-[#009DFF] font-semibold bg-[#009DFF]/10 px-1 rounded uppercase tracking-wider py-0.5 inline-block">
                          SEALED PARTITION
                        </div>
                      </div>
                      <div className="border border-emerald-500/30 bg-emerald-500/5 p-3.5 rounded-lg relative space-y-2 group hover:border-emerald-500 transition-all">
                        <div className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                        <div className="flex items-center gap-1.5">
                          <span className="text-emerald-400 font-bold block text-[9.5px]">AMD SEV-SNP</span>
                          <InfoTooltip content="AMD Secure Encrypted Virtualization-Secure Nested Paging uses hardware-level cryptography to protect VM registers and tables from administrative access." />
                        </div>
                        <div className="text-[8.5px] text-white/50 leading-relaxed">
                          Secure Nested Paging. Strict hardware CPU isolation and register lock.
                        </div>
                        <div className="text-[7.5px] text-emerald-400 font-semibold bg-emerald-500/10 px-1 rounded uppercase tracking-wider py-0.5 inline-block">
                          ATTESTATION ACTIVE
                        </div>
                      </div>
                    </div>
                    <div className="border border-white/5 bg-black/60 p-2.5 mt-4 rounded text-center flex items-center justify-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-[#00FFC2]" />
                      <span className="text-white/60">
                        CONTINUOUS ZERO-KNOWLEDGE LOG TELEMETRY: <strong className="text-white">ACTIVE</strong>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </WorkspaceCard>



            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <WorkspaceCard className="space-y-3 p-4">
                <span className="text-[9px] font-mono text-[#009DFF] tracking-wider uppercase block">Hardware Specs</span>
                <h4 className="text-[12.5px] font-bold text-white font-mono">Sovereign Cluster Node Specs</h4>
                <ul className="space-y-2 font-mono text-[10.5px] text-white/50">
                  <li className="flex justify-between border-b border-white/5 pb-1.5">
                    <span>Cluster Enclave Type:</span>
                    <span className="text-white font-bold">EPYC™ Dual 64-Core</span>
                  </li>
                  <li className="flex justify-between border-b border-white/5 pb-1.5">
                    <span>Memory Encryption:</span>
                    <span className="text-white">AES-128-XTS Hardware Engine</span>
                  </li>
                  <li className="flex justify-between border-b border-white/5 pb-1.5">
                    <span>Root Cert Key:</span>
                    <span className="text-[#00FFC2] font-semibold">2048-bit HSM signed</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Isolation Scale:</span>
                    <span className="text-white">Complete Decoupling</span>
                  </li>
                </ul>
              </WorkspaceCard>

              <WorkspaceCard className="space-y-3 p-4">
                <span className="text-[9px] font-mono text-emerald-400 tracking-wider uppercase block">Attestation Ledger</span>
                <h4 className="text-[12.5px] font-bold text-white font-mono">silicon-level verification</h4>
                <ul className="space-y-2 font-mono text-[10.5px] text-white/50">
                  <li className="flex justify-between border-b border-white/5 pb-1.5">
                    <span>Attestation State:</span>
                    <span className="text-emerald-400 font-bold uppercase">PASSED (Verified)</span>
                  </li>
                  <li className="flex justify-between border-b border-white/5 pb-1.5">
                    <span>Validation Authority:</span>
                    <span className="text-white">GFF Sovereign HSM</span>
                  </li>
                  <li className="flex justify-between border-b border-white/5 pb-1.5">
                    <span>Cert Fingerprint:</span>
                    <span className="text-white font-mono text-[9px] truncate max-w-[120px]">0xAFE991BC8841BEE8</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Audit Interval:</span>
                    <span className="text-white">Every 3600 Cycles</span>
                  </li>
                </ul>
              </WorkspaceCard>
            </div>
          </div>

          <div className="space-y-6">
            <WorkspaceCard className="p-5 space-y-4">
              <div className="flex items-center gap-1.5 border-b border-white/5 pb-3">
                <Lock className="w-4 h-4 text-green-400" />
                <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                  Hardware Security Modules (HSM)
                </h3>
                <InfoTooltip content="Physical cryptographic coprocessors safeguarding and managing GFF access keys for strong continuous attestation checks." />
              </div>
              <div className="p-3 bg-green-500/5 border border-green-500/20 text-green-400 font-bold rounded flex items-center justify-between font-mono text-[11px]">
                <span>HSM LOCK:</span>
                <span>ENGAGED</span>
              </div>
              <p className="text-[10.5px] font-mono text-white/45 leading-relaxed">
                All physical cryptographic keys are generated and rolled inside physical HSM bounds. Decoupled agents are granted dynamic temporary context decryption allocations only during scheduled compliance runs.
              </p>
              <div className="border-t border-white/5 pt-3.5 mt-3.5 space-y-3">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-white/40">Silicon Audit:</span>
                  <span className="text-white font-bold">100% OK</span>
                </div>
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-white/40">Drift Mitigation:</span>
                  <span className="text-emerald-400 font-bold uppercase">ENABLED</span>
                </div>
              </div>
            </WorkspaceCard>

            <WorkspaceCard className="border border-[#009DFF]/30 bg-gradient-to-br from-[#040914] to-[#010307] p-5 space-y-4 rounded-xl relative overflow-hidden">
              <div className="relative z-10 space-y-3 font-mono">
                <div className="flex items-center gap-2 text-[#009DFF]">
                  <Flame className="w-4 h-4" />
                  <span className="text-[9px] font-bold tracking-widest uppercase">Operator Actions</span>
                </div>
                <h4 className="text-[13px] font-bold text-white">Dedicated Terminal Enclave Access</h4>
                <p className="text-[10px] text-white/50 leading-relaxed">
                  Authorized operators can manage hardware credentials, rotate HSM keys, and scale physical memory allocations in the control center.
                </p>
                <Link 
                  href="/portal/control-center"
                  className="w-full inline-flex h-8 px-4 items-center justify-center gap-1.5 rounded-md bg-[#009DFF] hover:bg-[#009DFF]/90 text-white font-bold text-[10px] uppercase tracking-wider transition-all"
                >
                  Go to Control Center
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </WorkspaceCard>
          </div>
        </div>
      )}


      {/* ==========================================
          TAB 3: GOVERNANCE & ACTIVITY LEDGER
          ========================================== */}
      {activeTab === "governance" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <GovernancePanel />
          </div>

          <div>
            <WorkspaceCard className="space-y-4">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <Activity className="w-4 h-4 text-[#009DFF]" />
                <h3 className="text-xs font-mono font-bold uppercase text-white tracking-widest">
                  Compliance & Lifecycle Timeline
                </h3>
              </div>

              <Timeline steps={timelineSteps} />
            </WorkspaceCard>
          </div>
        </div>
      )}

      {/* 6. EXPENSIVE CALL-TO-ACTION FOR HARDWARE ENCLAVE PROVISIONING */}
      <WorkspaceCard className="border border-[#009DFF]/20 bg-gradient-to-br from-[#02050e] to-[#010204] p-6 space-y-4 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <ShieldCheck className="w-32 h-32 text-[#009DFF]" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 select-none">
          <div className="space-y-2 max-w-2xl font-mono">
            <div className="flex items-center gap-2 text-[#009DFF]">
              <ShieldCheck className="w-4 h-4 animate-pulse" />
              <span className="text-[9.5px] font-bold tracking-widest uppercase">Silicon-Level Sovereignty</span>
            </div>
            <h4 className="text-[14.5px] font-bold text-white">Need to provision a dedicated AMD SEV-SNP/Intel SGX cluster?</h4>
            <p className="text-[11px] text-white/50 leading-relaxed">
              Authorized sandbox administrators can request new isolated physical hardware nodes directly over the priority secure support wire. Memory blocks and zero-trust certificates are generated instantly.
            </p>
          </div>
          <div className="shrink-0 font-mono">
            <Link 
              href="/portal/support"
              className="inline-flex h-9 px-4 items-center justify-center gap-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-[10px] uppercase tracking-wider transition-all"
            >
              Request Hardware Nodes
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </WorkspaceCard>

    </div>
  );
}


