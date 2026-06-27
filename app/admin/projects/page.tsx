"use client";

import React, { useState, useMemo } from "react";
import { 
  Search, Plus, SlidersHorizontal, Check, RefreshCw, X, AlertTriangle, 
  Layers, User, Activity, Briefcase, ChevronRight, ShieldAlert, 
  Cpu, Clock, Edit2, CheckCircle2, AlertCircle, Trash2, ExternalLink
} from "lucide-react";
import Link from "next/link";

interface AdminProject {
  id: string;
  name: string;
  client: string;
  phase: string;
  status: string;
  owner: string;
  nodesCount: number;
  enclaveType: string;
  desc: string;
  lastUpdated: string;
}

const INITIAL_PROJECTS: AdminProject[] = [
  {
    id: "PROJ-201",
    name: "Apex Sovereign Multi-Agent Lattice",
    client: "Apex Sovereign Group [Preview Client]",
    phase: "Phase V: Production-Live",
    status: "On Track",
    owner: "Dr. Sarah Vance",
    nodesCount: 8,
    enclaveType: "Intel SGX",
    desc: "High-throughput isolated core loop with secure localized kernel telemetry and dual-layer TLS 1.3 socket.",
    lastUpdated: "2026-06-27T15:20:00Z"
  },
  {
    id: "PROJ-202",
    name: "Global Retail Real-Time Audit Ring",
    client: "Global Retail Enclave [Preview Client]",
    phase: "Phase IV: User Acceptance Testing",
    status: "At Risk",
    owner: "Alexander Mercer",
    nodesCount: 5,
    enclaveType: "AMD SEV-SNP",
    desc: "Continuous model alignment sandbox simulating extreme load, prompt injections, and runtime governance audits.",
    lastUpdated: "2026-06-27T14:10:00Z"
  },
  {
    id: "PROJ-203",
    name: "Sovereign Logistics AI Route Optimizer",
    client: "Sovereign Logistics Unit [Preview Client]",
    phase: "Phase III: Agent Alignment",
    status: "Paused",
    owner: "Marcus Vance",
    nodesCount: 4,
    enclaveType: "AWS Nitro Enclave",
    desc: "Airgapped telemetry network running geological route optimizations inside ephemeral containerized enclaves.",
    lastUpdated: "2026-06-26T18:05:00Z"
  },
  {
    id: "PROJ-204",
    name: "Federal Treasury Multi-Enclave Ledger",
    client: "Federal Treasury Division [Preview Client]",
    phase: "Phase II: Sandbox Provisioning",
    status: "Delayed",
    owner: "Evelyn Carter",
    nodesCount: 12,
    enclaveType: "Intel SGX",
    desc: "NIST-compliant hardware enclave isolating state estimation and cryptographic treasury signatures from host execution.",
    lastUpdated: "2026-06-27T09:30:00Z"
  },
  {
    id: "PROJ-205",
    name: "National Health Secure Diagnostics Loop",
    client: "Apex Sovereign Group [Preview Client]",
    phase: "Phase I: Planning",
    status: "On Track",
    owner: "Auditor Jenkins",
    nodesCount: 3,
    enclaveType: "AMD SEV-SNP",
    desc: "Zero-Trust medical agent handshake validating eBPF kernel event streams on medical imaging diagnostic models.",
    lastUpdated: "2026-06-27T11:45:00Z"
  }
];

const AVAILABLE_CLIENTS = [
  "Apex Sovereign Group [Preview Client]",
  "Global Retail Enclave [Preview Client]",
  "Sovereign Logistics Unit [Preview Client]",
  "Federal Treasury Division [Preview Client]",
  "National Health Enclave [Preview Client]"
];

const AVAILABLE_PHASES = [
  "Phase I: Planning",
  "Phase II: Sandbox Provisioning",
  "Phase III: Agent Alignment",
  "Phase IV: User Acceptance Testing",
  "Phase V: Production-Live"
];

const AVAILABLE_STATUSES = [
  "On Track",
  "At Risk",
  "Delayed",
  "Paused"
];

const AVAILABLE_OWNERS = [
  "Dr. Sarah Vance",
  "Alexander Mercer",
  "Evelyn Carter",
  "Marcus Vance",
  "Auditor Jenkins"
];

const ENCLAVE_TYPES = [
  "Intel SGX",
  "AMD SEV-SNP",
  "AWS Nitro Enclave"
];

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<AdminProject[]>(INITIAL_PROJECTS);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedPhase, setSelectedPhase] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedOwner, setSelectedOwner] = useState("");

  // Dropdown States for Inline Editing
  const [openStatusDropdownId, setOpenStatusDropdownId] = useState<string | null>(null);
  const [openPhaseDropdownId, setOpenPhaseDropdownId] = useState<string | null>(null);

  // Modals States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<AdminProject | null>(null);

  // Toast State
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: "", visible: false });

  const [newProject, setNewProject] = useState({
    name: "",
    client: AVAILABLE_CLIENTS[0],
    phase: AVAILABLE_PHASES[0],
    status: AVAILABLE_STATUSES[0],
    owner: AVAILABLE_OWNERS[0],
    nodesCount: 4,
    enclaveType: ENCLAVE_TYPES[0],
    desc: ""
  });

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3500);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedClient("");
    setSelectedPhase("");
    setSelectedStatus("");
    setSelectedOwner("");
  };

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, status: newStatus, lastUpdated: new Date().toISOString() } : p));
    showToast(`Project ${id} status updated: ${newStatus}`);
  };

  const handleUpdatePhase = (id: string, newPhase: string) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, phase: newPhase, lastUpdated: new Date().toISOString() } : p));
    showToast(`Project ${id} phase updated: ${newPhase}`);
  };

  const handleDeprovision = (id: string) => {
    if (confirm(`Deprovision hardware enclave registry ${id}? This halts active telemetry flows.`)) {
      setProjects(prev => prev.filter(p => p.id !== id));
      showToast(`Deprovisioned hardware enclave ${id}`);
    }
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name || !newProject.desc) {
      alert("Please fill in project name and description.");
      return;
    }

    const id = `PROJ-${Math.floor(206 + Math.random() * 700)}`;
    const created: AdminProject = {
      id,
      name: newProject.name,
      client: newProject.client,
      phase: newProject.phase,
      status: newProject.status,
      owner: newProject.owner,
      nodesCount: Number(newProject.nodesCount) || 4,
      enclaveType: newProject.enclaveType,
      desc: newProject.desc,
      lastUpdated: new Date().toISOString()
    };

    setProjects(prev => [created, ...prev]);
    setIsCreateModalOpen(false);
    
    // Reset Form
    setNewProject({
      name: "",
      client: AVAILABLE_CLIENTS[0],
      phase: AVAILABLE_PHASES[0],
      status: AVAILABLE_STATUSES[0],
      owner: AVAILABLE_OWNERS[0],
      nodesCount: 4,
      enclaveType: ENCLAVE_TYPES[0],
      desc: ""
    });

    showToast(`Successfully registered and isolated enclave ${id}`);
  };

  const handleEditProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm) return;

    setProjects(prev => prev.map(p => p.id === editForm.id ? { ...editForm, lastUpdated: new Date().toISOString() } : p));
    setIsEditModalOpen(false);
    setEditForm(null);
    showToast(`Updated enclave parameter mappings for project ${editForm.id}`);
  };

  // Memoized Filtered Projects List
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = query === "" ||
        p.name.toLowerCase().includes(query) ||
        p.id.toLowerCase().includes(query) ||
        p.owner.toLowerCase().includes(query) ||
        p.desc.toLowerCase().includes(query);

      const matchesClient = selectedClient === "" || p.client === selectedClient;
      const matchesPhase = selectedPhase === "" || p.phase === selectedPhase;
      const matchesStatus = selectedStatus === "" || p.status === selectedStatus;
      const matchesOwner = selectedOwner === "" || p.owner === selectedOwner;

      return matchesSearch && matchesClient && matchesPhase && matchesStatus && matchesOwner;
    });
  }, [projects, searchQuery, selectedClient, selectedPhase, selectedStatus, selectedOwner]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "On Track":
        return "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/15";
      case "At Risk":
        return "bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/15";
      case "Delayed":
        return "bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/15";
      case "Paused":
        return "bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/15";
      default:
        return "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10";
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case "Phase I: Planning":
        return { border: "rgba(255, 255, 255, 0.1)", dot: "rgba(255, 255, 255, 0.6)" };
      case "Phase II: Sandbox Provisioning":
        return { border: "rgba(59, 130, 246, 0.2)", dot: "rgb(59, 130, 246)" };
      case "Phase III: Agent Alignment":
        return { border: "rgba(0, 157, 255, 0.3)", dot: "rgb(0, 157, 255)" };
      case "Phase IV: User Acceptance Testing":
        return { border: "rgba(99, 102, 241, 0.3)", dot: "rgb(99, 102, 241)" };
      case "Phase V: Production-Live":
        return { border: "rgba(0, 255, 194, 0.3)", dot: "rgb(0, 255, 194)" };
      default:
        return { border: "rgba(255, 255, 255, 0.1)", dot: "rgba(255, 255, 255, 0.4)" };
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <span className="text-[10px] font-mono font-bold text-[#009DFF] bg-[#009DFF]/5 border border-[#009DFF]/15 px-2 py-0.5 rounded uppercase tracking-wider">
            Sovereign Admin Panel
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight font-mono uppercase mt-1.5">
            Internal Project Delivery
          </h2>
          <p className="text-xs text-white/50 mt-1 max-w-2xl font-mono leading-relaxed">
            Administrative flight deck for auditing multi-agent alignment phases, cluster isolated nodes, and deployment owners across global sovereign client tenants.
          </p>
        </div>
        <div className="shrink-0">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="h-9 px-4 rounded bg-[#009DFF] hover:bg-[#0082d4] text-[11px] font-mono font-bold uppercase tracking-wider text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_20px_rgba(0,157,255,0.2)]"
          >
            <Plus className="w-4 h-4" />
            <span>Create Sandbox Preview</span>
          </button>
        </div>
      </div>

      {/* 2. Metrics Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="border border-white/5 rounded-xl bg-[#050505]/40 backdrop-blur-sm p-4.5 space-y-2 relative overflow-hidden group shadow-[0_0_15px_rgba(0,157,255,0.01)] hover:border-white/10 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-white/40 tracking-wider uppercase">Active Enclaves</span>
            <Layers className="w-4 h-4 text-[#009DFF] opacity-80" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-mono font-bold text-white tracking-tight">{projects.length}</span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">LIVE TELEMETRY</span>
          </div>
          <div className="text-[9.5px] font-mono text-white/30 truncate">Isolated client lattices monitored</div>
          <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#009DFF]/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <div className="border border-white/5 rounded-xl bg-[#050505]/40 backdrop-blur-sm p-4.5 space-y-2 relative overflow-hidden group shadow-[0_0_15px_rgba(0,157,255,0.01)] hover:border-white/10 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-white/40 tracking-wider uppercase">Live Deployments</span>
            <CheckCircle2 className="w-4 h-4 text-[#00FFC2] opacity-80" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-mono font-bold text-[#00FFC2] tracking-tight">
              {projects.filter(p => p.phase === "Phase V: Production-Live").length}
            </span>
            <span className="text-[10px] font-mono text-[#00FFC2]/75 font-semibold">PHASE V STATE</span>
          </div>
          <div className="text-[9.5px] font-mono text-white/30 truncate">Enclaves in full production delivery</div>
          <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#00FFC2]/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <div className="border border-white/5 rounded-xl bg-[#050505]/40 backdrop-blur-sm p-4.5 space-y-2 relative overflow-hidden group shadow-[0_0_15px_rgba(0,157,255,0.01)] hover:border-white/10 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-white/40 tracking-wider uppercase">Active Delivery Risks</span>
            <ShieldAlert className="w-4 h-4 text-rose-400 opacity-80" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-mono font-bold tracking-tight ${projects.filter(p => p.status === "At Risk" || p.status === "Delayed").length > 0 ? "text-rose-400" : "text-white"}`}>
              {projects.filter(p => p.status === "At Risk" || p.status === "Delayed").length}
            </span>
            <span className={`text-[10px] font-mono font-bold ${projects.filter(p => p.status === "At Risk" || p.status === "Delayed").length > 0 ? "text-rose-400/80" : "text-white/40"}`}>
              {projects.filter(p => p.status === "At Risk" || p.status === "Delayed").length > 0 ? "SLA BREACH RISK" : "NOMINAL"}
            </span>
          </div>
          <div className="text-[9.5px] font-mono text-white/30 truncate">At-risk and delayed projects active</div>
          <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-rose-500/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <div className="border border-white/5 rounded-xl bg-[#050505]/40 backdrop-blur-sm p-4.5 space-y-2 relative overflow-hidden group shadow-[0_0_15px_rgba(0,157,255,0.01)] hover:border-white/10 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-white/40 tracking-wider uppercase">SLA Owners Active</span>
            <User className="w-4 h-4 text-purple-400 opacity-80" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-mono font-bold text-white tracking-tight">
              {new Set(projects.map(p => p.owner)).size}
            </span>
            <span className="text-[10px] font-mono text-purple-400 font-bold">ON DUTY</span>
          </div>
          <div className="text-[9.5px] font-mono text-white/30 truncate">Sovereign engineering delivery staff</div>
          <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-purple-500/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* 3. Search and Dynamic Filtering Control Deck */}
      <div className="p-4 rounded-xl border border-white/5 bg-[#030303]/40 space-y-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {/* Text search */}
          <div className="relative md:col-span-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search registry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 rounded-lg border border-white/5 bg-white/[0.02] pl-9 pr-4 text-[12px] font-mono text-white placeholder-white/30 outline-none focus:border-white/15 focus:bg-white/[0.04] transition-all"
            />
          </div>

          {/* Client filter */}
          <div className="relative">
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="w-full h-9 rounded-lg border border-white/5 bg-[#030303] px-3 pr-8 text-[11px] font-mono text-white/70 focus:text-white outline-none transition-all cursor-pointer appearance-none"
            >
              <option value="" className="text-white/50">ALL CLIENTS</option>
              {AVAILABLE_CLIENTS.map((c) => (
                <option key={c} value={c} className="text-white">
                  {c.replace(" [Preview Client]", "").toUpperCase()}
                </option>
              ))}
            </select>
            <SlidersHorizontal className="absolute right-3 top-3 w-3 h-3 text-white/40 pointer-events-none" />
          </div>

          {/* Phase filter */}
          <div className="relative">
            <select
              value={selectedPhase}
              onChange={(e) => setSelectedPhase(e.target.value)}
              className="w-full h-9 rounded-lg border border-white/5 bg-[#030303] px-3 pr-8 text-[11px] font-mono text-white/70 focus:text-white outline-none transition-all cursor-pointer appearance-none"
            >
              <option value="" className="text-white/50">ALL PHASES</option>
              {AVAILABLE_PHASES.map((p) => (
                <option key={p} value={p} className="text-white">
                  {p.toUpperCase()}
                </option>
              ))}
            </select>
            <SlidersHorizontal className="absolute right-3 top-3 w-3 h-3 text-white/40 pointer-events-none" />
          </div>

          {/* Status filter */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full h-9 rounded-lg border border-white/5 bg-[#030303] px-3 pr-8 text-[11px] font-mono text-white/70 focus:text-white outline-none transition-all cursor-pointer appearance-none"
            >
              <option value="" className="text-white/50">ALL STATUSES</option>
              {AVAILABLE_STATUSES.map((s) => (
                <option key={s} value={s} className="text-white">
                  {s.toUpperCase()}
                </option>
              ))}
            </select>
            <SlidersHorizontal className="absolute right-3 top-3 w-3 h-3 text-white/40 pointer-events-none" />
          </div>

          {/* Owner filter */}
          <div className="relative">
            <select
              value={selectedOwner}
              onChange={(e) => setSelectedOwner(e.target.value)}
              className="w-full h-9 rounded-lg border border-white/5 bg-[#030303] px-3 pr-8 text-[11px] font-mono text-white/70 focus:text-white outline-none transition-all cursor-pointer appearance-none"
            >
              <option value="" className="text-white/50">ALL OWNERS</option>
              {AVAILABLE_OWNERS.map((o) => (
                <option key={o} value={o} className="text-white">
                  {o.toUpperCase()}
                </option>
              ))}
            </select>
            <SlidersHorizontal className="absolute right-3 top-3 w-3 h-3 text-white/40 pointer-events-none" />
          </div>
        </div>

        {/* Filters Active Pill Indicator */}
        {(searchQuery || selectedClient || selectedPhase || selectedStatus || selectedOwner) && (
          <div className="flex items-center justify-between px-3.5 py-2 rounded-lg border border-dashed border-white/10 bg-white/[0.01] text-[10.5px] font-mono text-white/50 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#009DFF]" />
              <span className="truncate">
                Active filters applied:{" "}
                {[
                  searchQuery && `"${searchQuery}"`,
                  selectedClient && `Client: ${selectedClient.replace(" [Preview Client]", "")}`,
                  selectedPhase && `Phase: ${selectedPhase}`,
                  selectedStatus && `Status: ${selectedStatus}`,
                  selectedOwner && `Owner: ${selectedOwner}`
                ].filter(Boolean).join(" | ")}
              </span>
            </div>
            <button
              onClick={handleResetFilters}
              className="text-[#009DFF] hover:text-[#0082d4] font-bold uppercase transition-colors shrink-0 outline-none"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* 4. Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto rounded-xl border border-white/5 bg-[#020202]/40 backdrop-blur-sm shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
        <table className="w-full border-collapse text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.01] text-[10.5px] uppercase text-white/40 tracking-wider">
              <th className="py-3 px-4 font-semibold">Project & ID</th>
              <th className="py-3 px-4 font-semibold">Tenant Client</th>
              <th className="py-3 px-4 font-semibold">Delivery Phase</th>
              <th className="py-3 px-4 font-semibold">SLA Status</th>
              <th className="py-3 px-4 font-semibold">Owner</th>
              <th className="py-3 px-4 font-semibold">Cluster Nodes</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project) => (
              <tr key={project.id} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors group">
                {/* Name & Desc */}
                <td className="py-4 px-4 align-top">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[9.5px] font-mono font-bold text-[#009DFF] bg-[#009DFF]/5 border border-[#009DFF]/15 px-1.5 py-0.5 rounded">
                        {project.id}
                      </span>
                      <h3 className="text-[12px] font-mono font-bold text-white group-hover:text-[#009DFF] transition-colors">
                        {project.name}
                      </h3>
                    </div>
                    <p className="text-[11px] text-white/50 leading-relaxed max-w-sm">
                      {project.desc}
                    </p>
                  </div>
                </td>

                {/* Tenant Client */}
                <td className="py-4 px-4 align-top font-mono text-[11px] text-white/70">
                  <div className="flex items-center gap-1.5 mt-1">
                    <Briefcase className="w-3.5 h-3.5 text-white/30 shrink-0" />
                    <span>{project.client.replace(" [Preview Client]", "")}</span>
                  </div>
                </td>

                {/* Delivery Phase (Clickable inline selector) */}
                <td className="py-4 px-4 align-top relative">
                  <div className="relative inline-block mt-0.5">
                    <button
                      onClick={() => {
                        setOpenPhaseDropdownId(openPhaseDropdownId === project.id ? null : project.id);
                        setOpenStatusDropdownId(null);
                      }}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border bg-white/[0.01] hover:bg-white/[0.03] text-[10px] font-mono transition-all text-white/80 cursor-pointer"
                      style={{ borderColor: getPhaseColor(project.phase).border }}
                    >
                      <span className="w-1 h-1 rounded-full" style={{ backgroundColor: getPhaseColor(project.phase).dot }} />
                      <span>{project.phase}</span>
                    </button>

                    {openPhaseDropdownId === project.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setOpenPhaseDropdownId(null)} />
                        <div className="absolute left-0 mt-1.5 w-56 rounded-lg border border-white/10 bg-[#0c0c0c]/95 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.8)] py-1 z-20 font-mono text-[10px]">
                          {AVAILABLE_PHASES.map((p) => (
                            <button
                              key={p}
                              onClick={() => {
                                handleUpdatePhase(project.id, p);
                                setOpenPhaseDropdownId(null);
                              }}
                              className={`w-full text-left px-3 py-1.5 hover:bg-white/5 transition-colors flex items-center justify-between ${project.phase === p ? "text-[#009DFF]" : "text-white/60"}`}
                            >
                              <span>{p}</span>
                              {project.phase === p && <Check className="w-3.5 h-3.5" />}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </td>

                {/* SLA Status (Clickable inline selector) */}
                <td className="py-4 px-4 align-top relative">
                  <div className="relative inline-block mt-0.5">
                    <button
                      onClick={() => {
                        setOpenStatusDropdownId(openStatusDropdownId === project.id ? null : project.id);
                        setOpenPhaseDropdownId(null);
                      }}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-mono font-semibold transition-all cursor-pointer ${getStatusStyle(project.status)}`}
                    >
                      <span className="relative flex h-1.5 w-1.5">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${project.status === "On Track" ? "bg-emerald-400" : project.status === "At Risk" ? "bg-amber-400" : project.status === "Delayed" ? "bg-rose-400" : "bg-purple-400"}`}></span>
                        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${project.status === "On Track" ? "bg-emerald-500" : project.status === "At Risk" ? "bg-amber-500" : project.status === "Delayed" ? "bg-rose-500" : "bg-purple-500"}`}></span>
                      </span>
                      <span>{project.status}</span>
                    </button>

                    {openStatusDropdownId === project.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setOpenStatusDropdownId(null)} />
                        <div className="absolute left-0 mt-1.5 w-40 rounded-lg border border-white/10 bg-[#0c0c0c]/95 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.8)] py-1 z-20 font-mono text-[10px]">
                          {AVAILABLE_STATUSES.map((s) => (
                            <button
                              key={s}
                              onClick={() => {
                                handleUpdateStatus(project.id, s);
                                setOpenStatusDropdownId(null);
                              }}
                              className={`w-full text-left px-3 py-1.5 hover:bg-white/5 transition-colors flex items-center justify-between ${project.status === s ? "text-[#009DFF]" : "text-white/60"}`}
                            >
                              <span>{s}</span>
                              {project.status === s && <Check className="w-3.5 h-3.5" />}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </td>

                {/* Owner */}
                <td className="py-4 px-4 align-top font-mono text-[11px] text-white/70">
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#009DFF]/20 to-[#009DFF]/5 flex items-center justify-center border border-[#009DFF]/20 text-[8.5px] font-bold text-[#009DFF] shrink-0">
                      {project.owner.split(" ").pop()?.substring(0, 2).toUpperCase()}
                    </div>
                    <span>{project.owner}</span>
                  </div>
                </td>

                {/* Cluster Nodes */}
                <td className="py-4 px-4 align-top text-[11px] font-mono text-white/60">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-white/80">
                      <Cpu className="w-3.5 h-3.5 text-[#00FFC2] shrink-0" />
                      <span>{project.enclaveType}</span>
                    </div>
                    <div className="text-[10px] text-white/40 flex items-center gap-1">
                      <span>Telemetry:</span>
                      <span className="text-[#00FFC2] font-semibold">{project.nodesCount} Nodes</span>
                    </div>
                  </div>
                </td>

                {/* Action Buttons */}
                <td className="py-4 px-4 align-top text-right">
                  <div className="flex items-center justify-end gap-1.5 mt-0.5">
                    <button
                      onClick={() => {
                        setEditForm({ ...project });
                        setIsEditModalOpen(true);
                      }}
                      className="p-1.5 rounded border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] text-white/45 hover:text-white transition-colors cursor-pointer"
                      title="Quick Edit Project"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="p-1.5 rounded border border-white/5 bg-white/[0.01] hover:bg-[#009DFF]/10 hover:border-[#009DFF]/20 text-white/45 hover:text-[#009DFF] transition-colors"
                      title="View Enclave Telemetry"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      onClick={() => handleDeprovision(project.id)}
                      className="p-1.5 rounded border border-white/5 bg-white/[0.01] hover:bg-rose-500/10 hover:border-rose-500/20 text-white/45 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Deprovision Enclave"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 5. Mobile Fallback Cards Grid View (< lg) */}
      <div className="lg:hidden space-y-4">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="p-4 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm space-y-4 shadow-[0_0_15px_rgba(0,157,255,0.01)] hover:border-white/10 transition-all group"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-mono font-bold text-[#009DFF] bg-[#009DFF]/5 border border-[#009DFF]/15 px-1.5 py-0.5 rounded">
                  {project.id}
                </span>
                <span className="text-[10px] font-mono text-white/40">
                  {project.enclaveType}
                </span>
              </div>

              {/* Status drop selector */}
              <div className="relative">
                <button
                  onClick={() => {
                    setOpenStatusDropdownId(openStatusDropdownId === project.id ? null : project.id);
                    setOpenPhaseDropdownId(null);
                  }}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9.5px] font-mono font-semibold transition-all cursor-pointer ${getStatusStyle(project.status)}`}
                >
                  <span className="relative flex h-1.5 w-1.5">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${project.status === "On Track" ? "bg-emerald-400" : project.status === "At Risk" ? "bg-amber-400" : project.status === "Delayed" ? "bg-rose-400" : "bg-purple-400"}`}></span>
                    <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${project.status === "On Track" ? "bg-emerald-500" : project.status === "At Risk" ? "bg-amber-500" : project.status === "Delayed" ? "bg-rose-500" : "bg-purple-500"}`}></span>
                  </span>
                  <span>{project.status}</span>
                </button>

                {openStatusDropdownId === project.id && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpenStatusDropdownId(null)} />
                    <div className="absolute right-0 mt-1.5 w-36 rounded-lg border border-white/10 bg-[#0c0c0c]/95 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.8)] py-1 z-20 font-mono text-[9.5px]">
                      {AVAILABLE_STATUSES.map((s) => (
                        <button
                          key={s}
                          onClick={() => {
                            handleUpdateStatus(project.id, s);
                            setOpenStatusDropdownId(null);
                          }}
                          className={`w-full text-left px-3 py-1.5 hover:bg-white/5 transition-colors flex items-center justify-between ${project.status === s ? "text-[#009DFF]" : "text-white/60"}`}
                        >
                          <span>{s}</span>
                          {project.status === s && <Check className="w-3 h-3" />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-[12.5px] font-mono font-bold text-white group-hover:text-[#009DFF] transition-colors leading-tight">
                {project.name}
              </h3>
              <p className="text-[11px] text-white/50 leading-relaxed">
                {project.desc}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2.5 border-t border-white/5 text-[10.5px] font-mono text-white/60">
              <div className="space-y-0.5">
                <span className="text-[8.5px] text-white/30 uppercase block font-bold">Client Tenant</span>
                <div className="flex items-center gap-1 text-white/85">
                  <Briefcase className="w-3 h-3 text-white/30 shrink-0" />
                  <span className="truncate">{project.client.replace(" [Preview Client]", "")}</span>
                </div>
              </div>

              <div className="space-y-0.5">
                <span className="text-[8.5px] text-white/30 uppercase block font-bold">Delivery Owner</span>
                <div className="flex items-center gap-1.5 text-white/85">
                  <div className="w-4 h-4 rounded-full bg-[#009DFF]/10 flex items-center justify-center border border-[#009DFF]/20 text-[7.5px] font-bold text-[#009DFF] shrink-0">
                    {project.owner.split(" ").pop()?.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="truncate">{project.owner}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5 text-[10.5px] font-mono text-white/60">
              <div className="space-y-0.5 relative">
                <span className="text-[8.5px] text-white/30 uppercase block font-bold">Active Phase</span>
                <button
                  onClick={() => {
                    setOpenPhaseDropdownId(openPhaseDropdownId === project.id ? null : project.id);
                    setOpenStatusDropdownId(null);
                  }}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full border bg-white/[0.01] hover:bg-white/[0.03] text-[9.5px] font-mono transition-all text-white/80 cursor-pointer"
                  style={{ borderColor: getPhaseColor(project.phase).border }}
                >
                  <span className="w-1 h-1 rounded-full" style={{ backgroundColor: getPhaseColor(project.phase).dot }} />
                  <span>{project.phase}</span>
                </button>

                {openPhaseDropdownId === project.id && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpenPhaseDropdownId(null)} />
                    <div className="absolute left-0 mt-1 w-44 rounded-lg border border-white/10 bg-[#0c0c0c]/95 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.8)] py-1 z-20 font-mono text-[9.5px]">
                      {AVAILABLE_PHASES.map((p) => (
                        <button
                          key={p}
                          onClick={() => {
                            handleUpdatePhase(project.id, p);
                            setOpenPhaseDropdownId(null);
                          }}
                          className={`w-full text-left px-3 py-1.5 hover:bg-white/5 transition-colors flex items-center justify-between ${project.phase === p ? "text-[#009DFF]" : "text-white/60"}`}
                        >
                          <span>{p}</span>
                          {project.phase === p && <Check className="w-3 h-3" />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-0.5">
                <span className="text-[8.5px] text-white/30 uppercase block font-bold">Active Sandbox</span>
                <div className="flex items-center gap-1 text-white/80 mt-0.5">
                  <Cpu className="w-3 h-3 text-[#00FFC2] shrink-0" />
                  <span className="text-[#00FFC2] font-semibold">{project.nodesCount} Nodes</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
              <button
                onClick={() => {
                  setEditForm({ ...project });
                  setIsEditModalOpen(true);
                }}
                className="h-8 px-2.5 rounded border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] text-[10px] font-mono text-white/75 hover:text-white transition-all flex items-center gap-1 cursor-pointer"
              >
                <Edit2 className="w-3 h-3 text-[#009DFF]" />
                <span>Edit</span>
              </button>

              <Link
                href={`/admin/projects/${project.id}`}
                className="h-8 px-2.5 rounded border border-white/5 bg-white/[0.01] hover:bg-[#009DFF]/10 hover:border-[#009DFF]/20 text-[10px] font-mono text-white/75 hover:text-[#009DFF] transition-all flex items-center gap-1"
              >
                <ExternalLink className="w-3 h-3 text-[#00FFC2]" />
                <span>Oversight</span>
              </Link>

              <button
                onClick={() => handleDeprovision(project.id)}
                className="h-8 w-8 rounded border border-white/5 bg-white/[0.01] hover:bg-rose-500/10 hover:border-rose-500/20 text-white/45 hover:text-rose-400 flex items-center justify-center transition-all cursor-pointer"
                title="Deprovision Enclave"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 6. Empty State Fallback */}
      {filteredProjects.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-white/5 rounded-xl bg-[#050505]/20 font-mono text-center">
          <AlertCircle className="w-10 h-10 text-white/25 mb-3 animate-pulse" />
          <h4 className="text-white text-sm font-bold uppercase tracking-wider">No Isolated Enclaves Found</h4>
          <p className="text-white/40 text-[11px] max-w-sm mt-1 leading-relaxed">
            Your filter metrics did not resolve to any active sovereign integration programs. Reset filtering parameters to restore cluster tracking.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-4 h-8 px-4 rounded border border-white/10 hover:border-white/20 bg-white/[0.01] text-[10px] font-bold text-white hover:bg-white/[0.03] transition-all uppercase tracking-wider cursor-pointer"
          >
            Restore Telemetry View
          </button>
        </div>
      )}

      {/* ============================================================================ */}
      {/* MODAL 1: PROVISION NEW PROJECT PREVIEW */}
      {/* ============================================================================ */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-xl border border-white/10 bg-[#090909] shadow-[0_10px_50px_rgba(0,157,255,0.15)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
              <div className="flex items-center gap-2">
                <Layers className="w-4.5 h-4.5 text-[#009DFF]" />
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  Provision New Delivery Enclave
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded hover:bg-white/5 text-white/40 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="p-6 space-y-4 text-xs font-mono">
              <div className="space-y-1.5">
                <label className="text-white/40 uppercase block text-[9.5px] font-bold">Project / Enclave Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Sovereign Threat Defense Matrix"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full h-9 rounded border border-white/5 bg-white/[0.02] px-3 text-white placeholder-white/20 outline-none focus:border-[#009DFF]/30 focus:bg-white/[0.04] transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-white/40 uppercase block text-[9.5px] font-bold">Project Scope & Sandbox Description *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Describe the multi-agent isolated execution and compliance ruleset..."
                  value={newProject.desc}
                  onChange={(e) => setNewProject({ ...newProject, desc: e.target.value })}
                  className="w-full rounded border border-white/5 bg-white/[0.02] p-3 text-white placeholder-white/20 outline-none focus:border-[#009DFF]/30 focus:bg-white/[0.04] transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-white/40 uppercase block text-[9.5px] font-bold">Client Account</label>
                  <select
                    value={newProject.client}
                    onChange={(e) => setNewProject({ ...newProject, client: e.target.value })}
                    className="w-full h-9 rounded border border-white/5 bg-[#090909] px-2 text-white outline-none focus:border-[#009DFF]/30 transition-all cursor-pointer"
                  >
                    {AVAILABLE_CLIENTS.map(c => (
                      <option key={c} value={c}>{c.replace(" [Preview Client]", "")}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-white/40 uppercase block text-[9.5px] font-bold">Delivery Owner</label>
                  <select
                    value={newProject.owner}
                    onChange={(e) => setNewProject({ ...newProject, owner: e.target.value })}
                    className="w-full h-9 rounded border border-white/5 bg-[#090909] px-2 text-white outline-none focus:border-[#009DFF]/30 transition-all cursor-pointer"
                  >
                    {AVAILABLE_OWNERS.map(o => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-white/40 uppercase block text-[9.5px] font-bold">Operational Phase</label>
                  <select
                    value={newProject.phase}
                    onChange={(e) => setNewProject({ ...newProject, phase: e.target.value })}
                    className="w-full h-9 rounded border border-white/5 bg-[#090909] px-2 text-white outline-none focus:border-[#009DFF]/30 transition-all cursor-pointer"
                  >
                    {AVAILABLE_PHASES.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-white/40 uppercase block text-[9.5px] font-bold">Delivery Status</label>
                  <select
                    value={newProject.status}
                    onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
                    className="w-full h-9 rounded border border-white/5 bg-[#090909] px-2 text-white outline-none focus:border-[#009DFF]/30 transition-all cursor-pointer"
                  >
                    {AVAILABLE_STATUSES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-white/40 uppercase block text-[9.5px] font-bold">Isolation Mode</label>
                  <select
                    value={newProject.enclaveType}
                    onChange={(e) => setNewProject({ ...newProject, enclaveType: e.target.value })}
                    className="w-full h-9 rounded border border-white/5 bg-[#090909] px-2 text-white outline-none focus:border-[#009DFF]/30 transition-all cursor-pointer"
                  >
                    {ENCLAVE_TYPES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-white/40 uppercase block text-[9.5px] font-bold">Sandbox Nodes Active</label>
                  <input
                    type="number"
                    min={1}
                    max={64}
                    required
                    value={newProject.nodesCount}
                    onChange={(e) => setNewProject({ ...newProject, nodesCount: Number(e.target.value) })}
                    className="w-full h-9 rounded border border-white/5 bg-white/[0.02] px-3 text-white outline-none focus:border-[#009DFF]/30 transition-all"
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg border border-yellow-500/10 bg-yellow-500/5 text-yellow-400/90 text-[10px] leading-relaxed flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-yellow-400" />
                <span>
                  <strong>TELEMETRY NOTICE:</strong> Creating a project preview registers its isolated multi-agent namespace and mock execution bounds locally. No real cloud resources are consumed.
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="h-9 px-4 rounded border border-white/10 hover:border-white/20 bg-transparent text-white/80 hover:text-white transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 px-4 rounded bg-[#009DFF] hover:bg-[#0082d4] text-white font-bold transition-all shadow-[0_0_15px_rgba(0,157,255,0.3)] cursor-pointer"
                >
                  Deploy Sandbox Preview
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================================ */}
      {/* MODAL 2: EDIT DELIVERY CONFIGURATION */}
      {/* ============================================================================ */}
      {isEditModalOpen && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-xl border border-white/10 bg-[#090909] shadow-[0_10px_50px_rgba(0,157,255,0.15)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
              <div className="flex items-center gap-2">
                <Edit2 className="w-4.5 h-4.5 text-[#009DFF]" />
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  Modify Delivery Configuration: {editForm.id}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditForm(null);
                }}
                className="p-1 rounded hover:bg-white/5 text-white/40 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditProjectSubmit} className="p-6 space-y-4 text-xs font-mono">
              <div className="space-y-1.5">
                <label className="text-white/40 uppercase block text-[9.5px] font-bold">Project / Enclave Name *</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full h-9 rounded border border-white/5 bg-white/[0.02] px-3 text-white outline-none focus:border-[#009DFF]/30 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-white/40 uppercase block text-[9.5px] font-bold">Project Scope & Sandbox Description *</label>
                <textarea
                  required
                  rows={2}
                  value={editForm.desc}
                  onChange={(e) => setEditForm({ ...editForm, desc: e.target.value })}
                  className="w-full rounded border border-white/5 bg-white/[0.02] p-3 text-white outline-none focus:border-[#009DFF]/30 transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-white/40 uppercase block text-[9.5px] font-bold">Client Account</label>
                  <select
                    value={editForm.client}
                    onChange={(e) => setEditForm({ ...editForm, client: e.target.value })}
                    className="w-full h-9 rounded border border-white/5 bg-[#090909] px-2 text-white outline-none focus:border-[#009DFF]/30 transition-all cursor-pointer"
                  >
                    {AVAILABLE_CLIENTS.map(c => (
                      <option key={c} value={c}>{c.replace(" [Preview Client]", "")}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-white/40 uppercase block text-[9.5px] font-bold">Delivery Owner</label>
                  <select
                    value={editForm.owner}
                    onChange={(e) => setEditForm({ ...editForm, owner: e.target.value })}
                    className="w-full h-9 rounded border border-white/5 bg-[#090909] px-2 text-white outline-none focus:border-[#009DFF]/30 transition-all cursor-pointer"
                  >
                    {AVAILABLE_OWNERS.map(o => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-white/40 uppercase block text-[9.5px] font-bold">Operational Phase</label>
                  <select
                    value={editForm.phase}
                    onChange={(e) => setEditForm({ ...editForm, phase: e.target.value })}
                    className="w-full h-9 rounded border border-white/5 bg-[#090909] px-2 text-white outline-none focus:border-[#009DFF]/30 transition-all cursor-pointer"
                  >
                    {AVAILABLE_PHASES.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-white/40 uppercase block text-[9.5px] font-bold">Delivery Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full h-9 rounded border border-white/5 bg-[#090909] px-2 text-white outline-none focus:border-[#009DFF]/30 transition-all cursor-pointer"
                  >
                    {AVAILABLE_STATUSES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-white/40 uppercase block text-[9.5px] font-bold">Isolation Mode</label>
                  <select
                    value={editForm.enclaveType}
                    onChange={(e) => setEditForm({ ...editForm, enclaveType: e.target.value })}
                    className="w-full h-9 rounded border border-white/5 bg-[#090909] px-2 text-white outline-none focus:border-[#009DFF]/30 transition-all cursor-pointer"
                  >
                    {ENCLAVE_TYPES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-white/40 uppercase block text-[9.5px] font-bold">Sandbox Nodes Active</label>
                  <input
                    type="number"
                    min={1}
                    max={64}
                    required
                    value={editForm.nodesCount}
                    onChange={(e) => setEditForm({ ...editForm, nodesCount: Number(e.target.value) })}
                    className="w-full h-9 rounded border border-white/5 bg-white/[0.02] px-3 text-white outline-none focus:border-[#009DFF]/30 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditForm(null);
                  }}
                  className="h-9 px-4 rounded border border-white/10 hover:border-white/20 bg-transparent text-white/80 hover:text-white transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 px-4 rounded bg-[#009DFF] hover:bg-[#0082d4] text-white font-bold transition-all shadow-[0_0_15px_rgba(0,157,255,0.3)] cursor-pointer"
                >
                  Save Enclave Config
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================================ */}
      {/* 7. PREVIEW LIVE TOAST ALERTS */}
      {/* ============================================================================ */}
      {toast.visible && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg border border-emerald-500/30 bg-[#050505]/95 text-[#00FFC2] font-mono text-xs shadow-[0_0_20px_rgba(0,255,194,0.15)] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
