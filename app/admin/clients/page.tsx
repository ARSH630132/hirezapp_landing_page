"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  previewClientAccounts, 
  previewProjects, 
  previewAgentOperations,
  ClientAccount,
  Project,
  AgentOperation
} from "@/lib/mock-data-model";
import { 
  Search, Plus, User, ExternalLink, Shield, Check, Copy, 
  ChevronRight, Info, SlidersHorizontal, Clock, CreditCard, Layers, 
  Bot, AlertTriangle, CheckCircle2, X, Building, Globe, RefreshCw, Lock,
  ShieldAlert, BadgeCheck
} from "lucide-react";

// Extended Admin Client Interface to capture additional operational telemetry requested
interface AdminClient extends ClientAccount {
  industry: string;
  accountOwner: string;
  billingStatus: "Paid" | "Unpaid" | "Processing" | "Overdue";
  healthStatus: "Healthy" | "Warning" | "Critical" | "Offline";
}

export default function AdminClientsPage() {
  const router = useRouter();

  // ---------------------------------------------------------------------------
  // 1. STATE INITIALIZATION (ENRICHED PREVIEW CLIENT ACCOUNTS)
  // ---------------------------------------------------------------------------
  const [clients, setClients] = useState<AdminClient[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modals & Drawer State
  const [selectedClient, setSelectedClient] = useState<AdminClient | null>(null);
  const [drawerTab, setDrawerTab] = useState<"overview" | "projects" | "agents" | "billing">("overview");
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assigningClient, setAssigningClient] = useState<AdminClient | null>(null);
  
  // Handshake Connection State
  const [handshakeClient, setHandshakeClient] = useState<AdminClient | null>(null);
  const [handshakeStep, setHandshakeStep] = useState(0);

  // Form Fields for Add Client
  const [newName, setNewName] = useState("");
  const [newDomain, setNewDomain] = useState("");
  const [newIndustry, setNewIndustry] = useState("Cybersecurity & Defense");
  const [newTier, setNewTier] = useState<"Sovereign" | "Enterprise" | "Standard">("Sovereign");
  const [newRegion, setNewRegion] = useState("EU-West (Isolated)");
  const [newOwner, setNewOwner] = useState("Dr. Sarah Vance");
  const [newHealth, setNewHealth] = useState<"Healthy" | "Warning" | "Critical" | "Offline">("Healthy");
  const [newBilling, setNewBilling] = useState<"Paid" | "Unpaid" | "Processing" | "Overdue">("Paid");

  // Form Fields for Assign Owner
  const [assignedOwner, setAssignedOwner] = useState("Dr. Sarah Vance");

  // Load and enrich clients list on mount
  useEffect(() => {
    const enriched = previewClientAccounts.map(c => {
      let industry = "Cybersecurity & Defense";
      let healthStatus: "Healthy" | "Warning" | "Critical" | "Offline" = "Healthy";
      let billingStatus: "Paid" | "Unpaid" | "Processing" | "Overdue" = "Paid";
      let accountOwner = "Dr. Sarah Vance";

      if (c.id === "client-001") {
        industry = "Cybersecurity & Defense";
        healthStatus = "Healthy";
        billingStatus = "Paid";
        accountOwner = "Dr. Sarah Vance";
      } else if (c.id === "client-002") {
        industry = "E-Commerce & Retail";
        healthStatus = "Warning";
        billingStatus = "Overdue";
        accountOwner = "Alexander Mercer";
      } else if (c.id === "client-003") {
        industry = "Supply Chain & Logistics";
        healthStatus = "Offline";
        billingStatus = "Unpaid";
        accountOwner = "Sarah Jenkins";
      } else if (c.id === "client-004") {
        industry = "FinTech & Treasury";
        healthStatus = "Healthy";
        billingStatus = "Paid";
        accountOwner = "Marcus Vance";
      }

      return {
        ...c,
        industry,
        healthStatus,
        billingStatus,
        accountOwner
      };
    });
    setClients(enriched);
  }, []);

  // ---------------------------------------------------------------------------
  // 2. DATA QUERY HELPERS
  // ---------------------------------------------------------------------------
  const getProjectsForClient = (clientId: string): Project[] => {
    return previewProjects.filter(p => p.clientAccountId === clientId);
  };

  const getAgentOpsForClient = (clientId: string): AgentOperation[] => {
    const projectIds = getProjectsForClient(clientId).map(p => p.id);
    return previewAgentOperations.filter(op => projectIds.includes(op.projectId));
  };

  const handleCopyId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Unique lists for filters
  const uniqueRegions = Array.from(new Set(clients.map(c => c.region)));
  const uniqueIndustries = Array.from(new Set(clients.map(c => c.industry)));

  // ---------------------------------------------------------------------------
  // 3. FRONTEND-ONLY ACTIONS
  // ---------------------------------------------------------------------------
  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newDomain) return;

    const nextId = `client-00${clients.length + 1}`;
    const newClientObj: AdminClient = {
      id: nextId,
      name: `${newName} [Preview Client]`,
      domain: newDomain,
      status: "active",
      tier: newTier,
      createdAt: new Date().toISOString(),
      region: newRegion,
      complianceLevel: newTier === "Sovereign" ? "ISO-27001 Fully Certified" : "SOC2 Type II Assured",
      contactName: "Sovereign Operator",
      contactEmail: `operator@${newDomain}`,
      industry: newIndustry,
      accountOwner: newOwner,
      healthStatus: newHealth,
      billingStatus: newBilling
    };

    setClients([...clients, newClientObj]);
    setIsAddModalOpen(false);

    // Reset Form
    setNewName("");
    setNewDomain("");
    setNewIndustry("Cybersecurity & Defense");
    setNewTier("Sovereign");
    setNewRegion("EU-West (Isolated)");
    setNewOwner("Dr. Sarah Vance");
    setNewHealth("Healthy");
    setNewBilling("Paid");
  };

  const handleOpenAssignOwner = (client: AdminClient, e: React.MouseEvent) => {
    e.stopPropagation();
    setAssigningClient(client);
    setAssignedOwner(client.accountOwner);
    setIsAssignModalOpen(true);
  };

  const handleSaveOwner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningClient) return;

    const updated = clients.map(c => {
      if (c.id === assigningClient.id) {
        return { ...c, accountOwner: assignedOwner };
      }
      return c;
    });

    setClients(updated);
    
    // Also update current drawer client if selected
    if (selectedClient && selectedClient.id === assigningClient.id) {
      setSelectedClient({ ...selectedClient, accountOwner: assignedOwner });
    }

    setIsAssignModalOpen(false);
    setAssigningClient(null);
  };

  const handleInitiateHandshake = (client: AdminClient, e: React.MouseEvent) => {
    e.stopPropagation();
    setHandshakeClient(client);
    setHandshakeStep(1);

    // Step 1: Initial PKI binding
    setTimeout(() => {
      setHandshakeStep(2);
      // Step 2: Establish eBPF boundaries
      setTimeout(() => {
        setHandshakeStep(3);
        // Step 3: Mirror active session & redirect
        setTimeout(() => {
          const customSession = {
            name: client.contactName,
            email: client.contactEmail,
            role: "client_admin",
            clearance: "CLEARANCE LEVEL III (SANDBOX ADMIN)",
            isMock: true,
            label: `PORTAL PREVIEW - ${client.name.toUpperCase()}`
          };
          localStorage.setItem("gff_ai_preview_session_v1", JSON.stringify(customSession));
          window.dispatchEvent(new Event("gff_preview_session_changed"));
          router.push("/portal/dashboard");
        }, 1200);
      }, 1000);
    }, 800);
  };

  // ---------------------------------------------------------------------------
  // 4. FILTERED DATASETS
  // ---------------------------------------------------------------------------
  const filteredClients = clients.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.accountOwner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter ? c.status === statusFilter : true;
    const matchesRegion = regionFilter ? c.region === regionFilter : true;
    const matchesIndustry = industryFilter ? c.industry === industryFilter : true;

    return matchesSearch && matchesStatus && matchesRegion && matchesIndustry;
  });

  // Global Telemetry Summary Metrics
  const totalEnclaves = clients.length;
  const healthyCount = clients.filter(c => c.healthStatus === "Healthy").length;
  const totalProjects = clients.reduce((acc, c) => acc + getProjectsForClient(c.id).length, 0);
  const totalAgents = clients.reduce((acc, c) => acc + getAgentOpsForClient(c.id).length, 0);

  // Badge Styling Generators
  const getHealthBadge = (health: AdminClient["healthStatus"]) => {
    const styles = {
      Healthy: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      Warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      Critical: "bg-red-500/10 text-red-400 border-red-500/20",
      Offline: "bg-white/5 text-white/40 border-white/10"
    };
    return (
      <span className={`inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-[10px] font-mono font-bold uppercase border ${styles[health]}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${health === "Healthy" ? "bg-emerald-400 animate-pulse" : health === "Warning" ? "bg-amber-400 animate-pulse" : health === "Critical" ? "bg-red-500" : "bg-white/30"}`} />
        {health}
      </span>
    );
  };

  const getBillingBadge = (billing: AdminClient["billingStatus"]) => {
    const styles = {
      Paid: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      Unpaid: "bg-red-500/10 text-red-400 border-red-500/20",
      Processing: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      Overdue: "bg-amber-500/10 text-amber-400 border-amber-500/20"
    };
    return (
      <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-mono font-bold uppercase border ${styles[billing]}`}>
        {billing}
      </span>
    );
  };

  const getTierBadge = (tier: ClientAccount["tier"]) => {
    const styles = {
      Sovereign: "bg-amber-400/10 text-amber-300 border-amber-400/25",
      Enterprise: "bg-[#009DFF]/10 text-[#009DFF] border-[#009DFF]/25",
      Standard: "bg-white/5 text-white/60 border-white/15"
    };
    return (
      <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase border ${styles[tier]}`}>
        {tier}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight font-mono uppercase">Sovereign Tenant Registry</h2>
          <p className="text-xs text-white/50 mt-1 font-mono">
            Cryptographic tenant authorization, sandbox telemetry supervision, and continuous alignment verification.
          </p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="h-10 px-4 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/35 hover:border-emerald-500/50 text-emerald-400 font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.05)] hover:shadow-[0_0_25px_rgba(16,185,129,0.15)] cursor-pointer"
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>PROVISION TENANT ACCOUNT</span>
        </button>
      </div>

      {/* OVERVIEW METRICS DECK */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="rounded-xl border border-white/5 bg-[#050505]/40 p-4 font-mono space-y-1">
          <span className="text-[10px] text-white/40 uppercase tracking-widest block font-bold">Managed Enclaves</span>
          <div className="text-2xl font-bold text-white font-mono flex items-baseline gap-2">
            <span>{totalEnclaves}</span>
            <span className="text-[10px] text-emerald-400 font-semibold font-mono">+1 configured</span>
          </div>
          <div className="text-[10px] text-white/30 pt-1 border-t border-white/[0.03]">ISO-27001-A.9 Tenant isolation</div>
        </div>

        <div className="rounded-xl border border-white/5 bg-[#050505]/40 p-4 font-mono space-y-1">
          <span className="text-[10px] text-white/40 uppercase tracking-widest block font-bold">Health Level SLA</span>
          <div className="text-2xl font-bold text-emerald-400 font-mono flex items-baseline gap-2">
            <span>{totalEnclaves > 0 ? ((healthyCount / totalEnclaves) * 100).toFixed(0) : "0"}%</span>
            <span className="text-[10px] text-emerald-400/70 font-mono">operational</span>
          </div>
          <div className="text-[10px] text-white/30 pt-1 border-t border-white/[0.03]">{healthyCount} healthy tenants</div>
        </div>

        <div className="rounded-xl border border-white/5 bg-[#050505]/40 p-4 font-mono space-y-1">
          <span className="text-[10px] text-white/40 uppercase tracking-widest block font-bold">Sandbox Layers</span>
          <div className="text-2xl font-bold text-white font-mono flex items-baseline gap-2">
            <span>{totalProjects}</span>
            <span className="text-[10px] text-white/40 font-mono">active grids</span>
          </div>
          <div className="text-[10px] text-white/30 pt-1 border-t border-white/[0.03]">{totalAgents} agent workloads monitored</div>
        </div>

        <div className="rounded-xl border border-white/5 bg-[#050505]/40 p-4 font-mono space-y-1">
          <span className="text-[10px] text-white/40 uppercase tracking-widest block font-bold">Attestation Spends</span>
          <div className="text-2xl font-bold text-blue-400 font-mono flex items-baseline gap-2">
            <span>812K</span>
            <span className="text-[10px] text-white/40 font-mono">Epoch credits</span>
          </div>
          <div className="text-[10px] text-white/30 pt-1 border-t border-white/[0.03]">Continuous billing telemetry</div>
        </div>

      </div>

      {/* FILTER & CONTROL PANEL */}
      <div className="rounded-xl border border-white/5 bg-[#030303]/40 p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-white/30" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter sovereign registry by name, ID, domain, region, industry, or owner..."
              className="w-full h-9 rounded-lg border border-white/5 bg-white/[0.01] pl-9 pr-4 text-[12px] font-mono text-white placeholder-white/30 outline-none focus:border-white/15 focus:bg-white/[0.03] transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")} 
                className="absolute right-3 top-2.5 text-white/40 hover:text-white cursor-pointer border-none bg-transparent"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter options */}
          <div className="flex flex-wrap items-center gap-3">
            
            <div className="relative">
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 rounded-lg border border-white/5 bg-[#0c0c0c] pl-3 pr-8 text-[11px] font-mono text-white/70 focus:text-white outline-none transition-all cursor-pointer appearance-none uppercase"
              >
                <option value="">Status: All</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
              <SlidersHorizontal className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-white/40 pointer-events-none" />
            </div>

            <div className="relative">
              <select 
                value={regionFilter} 
                onChange={(e) => setRegionFilter(e.target.value)}
                className="h-9 rounded-lg border border-white/5 bg-[#0c0c0c] pl-3 pr-8 text-[11px] font-mono text-white/70 focus:text-white outline-none transition-all cursor-pointer appearance-none uppercase"
              >
                <option value="">Region: All</option>
                {uniqueRegions.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <SlidersHorizontal className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-white/40 pointer-events-none" />
            </div>

            <div className="relative">
              <select 
                value={industryFilter} 
                onChange={(e) => setIndustryFilter(e.target.value)}
                className="h-9 rounded-lg border border-white/5 bg-[#0c0c0c] pl-3 pr-8 text-[11px] font-mono text-white/70 focus:text-white outline-none transition-all cursor-pointer appearance-none uppercase"
              >
                <option value="">Industry: All</option>
                {uniqueIndustries.map(ind => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
              <SlidersHorizontal className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-white/40 pointer-events-none" />
            </div>

            {(statusFilter || regionFilter || industryFilter || searchQuery) && (
              <button 
                onClick={() => {
                  setStatusFilter("");
                  setRegionFilter("");
                  setIndustryFilter("");
                  setSearchQuery("");
                }}
                className="h-9 px-3 rounded-lg border border-red-500/20 hover:bg-red-500/5 text-red-400 font-mono text-[11px] transition-all cursor-pointer uppercase font-bold"
              >
                Reset Filters
              </button>
            )}

          </div>

        </div>
      </div>

      {/* TENANT REGISTRY TABLE */}
      {filteredClients.length === 0 ? (
        <div className="rounded-xl border border-white/5 bg-[#050505]/20 backdrop-blur-sm p-12 text-center font-mono space-y-3">
          <div className="mx-auto w-12 h-12 rounded-lg border border-white/5 bg-white/[0.01] flex items-center justify-center text-white/30">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h3 className="text-white font-semibold text-[13px] uppercase">No Matching Sovereign Tenants</h3>
          <p className="text-white/40 text-[11px] max-w-md mx-auto">
            No active administrative partitions meet the specified search query or enclave filter parameters.
          </p>
          <button 
            onClick={() => {
              setStatusFilter("");
              setRegionFilter("");
              setIndustryFilter("");
              setSearchQuery("");
            }}
            className="px-3 py-1.5 rounded border border-white/10 hover:bg-white/5 text-white text-[11px] transition-all cursor-pointer uppercase font-bold"
          >
            Clear Active Filter Parameters
          </button>
        </div>
      ) : (
        <>
          <div className="hidden lg:block overflow-hidden rounded-xl border border-white/5 bg-[#050505]/20 backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-[11.5px]" role="grid">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.01]" role="row">
                  <th className="p-4 text-[10.5px] font-bold text-white/40 uppercase tracking-wider">Tenant / Namespace</th>
                  <th className="p-4 text-[10.5px] font-bold text-white/40 uppercase tracking-wider">Industry</th>
                  <th className="p-4 text-[10.5px] font-bold text-white/40 uppercase tracking-wider">Region & Tier</th>
                  <th className="p-4 text-[10.5px] font-bold text-white/40 uppercase tracking-wider">Account Owner</th>
                  <th className="p-4 text-[10.5px] font-bold text-white/40 uppercase tracking-wider text-center">Enclaves</th>
                  <th className="p-4 text-[10.5px] font-bold text-white/40 uppercase tracking-wider text-center">Billing Preview</th>
                  <th className="p-4 text-[10.5px] font-bold text-white/40 uppercase tracking-wider text-center">Health Status</th>
                  <th className="p-4 text-[10.5px] font-bold text-white/40 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {filteredClients.map((client) => {
                  const projectsCount = getProjectsForClient(client.id).length;
                  const agentsCount = getAgentOpsForClient(client.id).length;

                  return (
                    <tr 
                      key={client.id}
                      onClick={() => {
                        setSelectedClient(client);
                        setDrawerTab("overview");
                      }}
                      className="hover:bg-white/[0.01] transition-all cursor-pointer group"
                      role="row"
                    >
                      
                      {/* Name / Domain */}
                      <td className="p-4">
                        <div className="space-y-1 max-w-[200px]">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white group-hover:text-[#009DFF] transition-colors">{client.name}</span>
                            {client.tier === "Sovereign" && <BadgeCheck className="w-4 h-4 text-amber-400 shrink-0" />}
                          </div>
                          <div className="text-[10px] text-white/40 flex items-center gap-1.5 font-mono">
                            <span className="text-[#009DFF]">{client.domain}</span>
                            <span>•</span>
                            <span 
                              onClick={(e) => handleCopyId(client.id, e)}
                              className="hover:text-white transition-colors cursor-pointer flex items-center gap-0.5"
                            >
                              {client.id.toUpperCase()}
                              {copiedId === client.id ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5 opacity-50 hover:opacity-100" />}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Industry */}
                      <td className="p-4 text-white/70">
                        <div className="flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-white/30" />
                          <span>{client.industry}</span>
                        </div>
                      </td>

                      {/* Region & Tier */}
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-white/80">
                            <Globe className="w-3.5 h-3.5 text-white/30" />
                            <span>{client.region}</span>
                          </div>
                          <div>{getTierBadge(client.tier)}</div>
                        </div>
                      </td>

                      {/* Account Owner */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 font-mono text-[9px] font-bold">
                            {client.accountOwner.split(" ").pop()?.[0]}
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-white font-medium">{client.accountOwner}</span>
                            <span 
                              onClick={(e) => handleOpenAssignOwner(client, e)}
                              className="text-[9px] text-[#009DFF] hover:underline cursor-pointer block"
                            >
                              Re-assign owner
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Active Counts */}
                      <td className="p-4 text-center">
                        <div className="inline-flex flex-col items-center gap-1">
                          <span className="text-white font-bold">{projectsCount}</span>
                          <span className="text-[9px] text-white/30 uppercase tracking-wider">{projectsCount === 1 ? "Project" : "Projects"}</span>
                          {agentsCount > 0 && (
                            <span className="text-[9px] text-emerald-400/80 font-semibold uppercase">
                              {agentsCount} Live {agentsCount === 1 ? "Agent" : "Agents"}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Billing Status */}
                      <td className="p-4 text-center">
                        {getBillingBadge(client.billingStatus)}
                      </td>

                      {/* Health Status */}
                      <td className="p-4 text-center">
                        {getHealthBadge(client.healthStatus)}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => handleInitiateHandshake(client, e)}
                            className="h-7 px-2.5 rounded border border-[#009DFF]/30 bg-[#009DFF]/5 hover:bg-[#009DFF]/15 text-[#009DFF] text-[10px] font-bold uppercase flex items-center gap-1 transition-all cursor-pointer"
                            title="Mirror Client Portal"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Preview Portal</span>
                          </button>
                          
                          <button
                            onClick={() => {
                              setSelectedClient(client);
                              setDrawerTab("overview");
                            }}
                            className="h-7 w-7 rounded border border-white/5 hover:border-white/15 hover:bg-white/5 text-white/50 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                            title="Open Telemetry Ledger"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-white/5 bg-[#050505]/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono">
            <span className="text-white/40">
              Showing <span className="text-white/70 font-semibold">{filteredClients.length}</span> of <span className="text-white/70 font-semibold">{clients.length}</span> sovereign domains configured
            </span>
            <div className="text-white/30 text-[10px] flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-[#00FFC2]" />
              <span>Attestation registry locked with administrative cryptographic keys</span>
            </div>
          </div>
        </div>

        {/* Mobile Card Layout */}
        <div className="lg:hidden space-y-4 animate-fade-in mt-4">
          {filteredClients.map((client) => {
            const projectsCount = getProjectsForClient(client.id).length;
            const agentsCount = getAgentOpsForClient(client.id).length;
            return (
              <div 
                key={client.id}
                onClick={() => {
                  setSelectedClient(client);
                  setDrawerTab("overview");
                }}
                className="p-4 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm space-y-3 font-mono text-[11px] cursor-pointer hover:border-white/10 transition-all text-left"
              >
                <div className="flex items-start justify-between border-b border-white/5 pb-2">
                  <div className="text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white text-[12px]">{client.name}</span>
                      {client.tier === "Sovereign" && <BadgeCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                    </div>
                    <span className="text-[9.5px] text-[#009DFF]">{client.domain}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {getTierBadge(client.tier)}
                    <span className="text-[8.5px] text-white/30">{client.id.toUpperCase()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-white/60 text-[10px] text-left">
                  <div className="space-y-1">
                    <span className="text-white/30 block uppercase text-[8px] font-bold">Industry & Region</span>
                    <div className="text-white/85 font-medium truncate">{client.industry}</div>
                    <div className="text-white/50 text-[9px]">{client.region}</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-white/30 block uppercase text-[8px] font-bold">Enclaves Status</span>
                    <div className="text-white font-bold">{projectsCount} {projectsCount === 1 ? "Project" : "Projects"}</div>
                    {agentsCount > 0 && <div className="text-emerald-400 text-[9px] font-semibold">{agentsCount} Live Agents</div>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-white/60 text-[10px] text-left border-t border-white/[0.03] pt-2">
                  <div className="space-y-1">
                    <span className="text-white/30 block uppercase text-[8px] font-bold">Billing & Health</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {getBillingBadge(client.billingStatus)}
                      {getHealthBadge(client.healthStatus)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-white/30 block uppercase text-[8px] font-bold">Account Owner</span>
                    <div className="text-white/80 font-medium truncate mt-0.5">{client.accountOwner}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[#009DFF]" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={(e) => handleInitiateHandshake(client, e)}
                    className="h-7 px-2.5 rounded border border-[#009DFF]/30 bg-[#009DFF]/5 hover:bg-[#009DFF]/15 text-[#009DFF] text-[9.5px] font-bold uppercase flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Preview Portal</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedClient(client);
                      setDrawerTab("overview");
                    }}
                    className="text-[10px] flex items-center gap-1 font-bold text-[#009DFF]"
                  >
                    <span>INSPECT</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        </>
      )}

      {/* -----------------------------------------------------------------------
          5. DETAILS SIDE-DRAWER
          ----------------------------------------------------------------------- */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 flex justify-end">
          
          {/* Backdrop */}
          <div 
            onClick={() => setSelectedClient(null)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
          />

          {/* Drawer Panel */}
          <div className="relative z-10 w-full sm:w-[500px] border-l border-white/10 bg-[#060606]/95 backdrop-blur-md shadow-2xl flex flex-col h-full overflow-hidden">
            
            {/* Drawer Header */}
            <div className="p-5 border-b border-white/5 bg-[#090909]">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono font-bold text-[#009DFF] uppercase tracking-widest px-1.5 py-0.5 bg-[#009DFF]/10 rounded border border-[#009DFF]/20">Sovereign Partition</span>
                    <span className="text-[10px] font-mono text-white/40">{selectedClient.id.toUpperCase()}</span>
                  </div>
                  <h3 className="text-base font-bold text-white font-mono">{selectedClient.name}</h3>
                  <div className="text-[11px] text-[#009DFF] font-mono">{selectedClient.domain}</div>
                </div>
                <button 
                  onClick={() => setSelectedClient(null)}
                  className="w-7 h-7 rounded border border-white/5 bg-white/[0.01] hover:bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Tabs */}
              <div className="grid grid-cols-4 gap-1 mt-6 border-b border-white/5 pb-px font-mono text-[10px]">
                {(["overview", "projects", "agents", "billing"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setDrawerTab(tab)}
                    className={`pb-2.5 font-bold uppercase transition-all border-b-2 text-center cursor-pointer bg-transparent border-none ${
                      drawerTab === tab 
                        ? "border-[#009DFF] text-white" 
                        : "border-transparent text-white/40 hover:text-white/70"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 font-mono text-[11.5px] text-left">
              
              {/* TAB 1: OVERVIEW */}
              {drawerTab === "overview" && (
                <div className="space-y-5">
                  
                  {/* Status telemetry block */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-lg border border-white/5 bg-[#020202]/40 space-y-1.5">
                      <span className="text-white/30 text-[9px] uppercase font-bold block">Telemetry Health</span>
                      <div>{getHealthBadge(selectedClient.healthStatus)}</div>
                    </div>
                    <div className="p-4 rounded-lg border border-white/5 bg-[#020202]/40 space-y-1.5">
                      <span className="text-white/30 text-[9px] uppercase font-bold block">Epoch Settlement</span>
                      <div>{getBillingBadge(selectedClient.billingStatus)}</div>
                    </div>
                  </div>

                  {/* Core parameters */}
                  <div className="p-4 rounded-lg border border-white/5 bg-[#020202]/40 space-y-3">
                    <div className="flex items-center gap-1.5 text-white/30 text-[9.5px] uppercase font-bold border-b border-white/5 pb-1">
                      <Shield className="w-3.5 h-3.5 text-[#00FFC2]" />
                      <span>Sovereign Identity Bounds</span>
                    </div>
                    <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-[11px]">
                      <div>
                        <span className="text-white/30 text-[9px] uppercase font-bold block">Account Custodian</span>
                        <span className="text-white font-semibold">{selectedClient.accountOwner}</span>
                      </div>
                      <div>
                        <span className="text-white/30 text-[9px] uppercase font-bold block">Enclave Tier</span>
                        <span className="text-amber-300 font-bold">{selectedClient.tier.toUpperCase()}</span>
                      </div>
                      <div>
                        <span className="text-white/30 text-[9px] uppercase font-bold block">Mapped Enclave Region</span>
                        <span className="text-white">{selectedClient.region}</span>
                      </div>
                      <div>
                        <span className="text-white/30 text-[9px] uppercase font-bold block">Created Epoch</span>
                        <span className="text-white">{new Date(selectedClient.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-white/30 text-[9px] uppercase font-bold block">Active Compliance Standard</span>
                        <span className="text-[#00FFC2] font-semibold">{selectedClient.complianceLevel}</span>
                      </div>
                    </div>
                  </div>

                  {/* Primary Contact */}
                  <div className="p-4 rounded-lg border border-white/5 bg-[#020202]/40 space-y-3">
                    <div className="flex items-center gap-1.5 text-white/30 text-[9.5px] uppercase font-bold border-b border-white/5 pb-1">
                      <User className="w-3.5 h-3.5 text-[#009DFF]" />
                      <span>Tenant Enclave Admin</span>
                    </div>
                    <div className="space-y-1">
                      <div className="text-white font-bold">{selectedClient.contactName}</div>
                      <div className="text-white/50 text-[10.5px]">{selectedClient.contactEmail}</div>
                    </div>
                  </div>

                  {/* Cryptographic Attestation Block */}
                  <div className="p-4 rounded-lg border border-white/5 bg-[#020202]/40 space-y-2">
                    <div className="flex items-center gap-1.5 text-white/30 text-[9.5px] uppercase font-bold">
                      <Lock className="w-3.5 h-3.5 text-amber-500" />
                      <span>PKI Root Attestation Seal</span>
                    </div>
                    <p className="text-[10px] text-white/50 leading-relaxed">
                      Sovereign partition cryptographic handshake bound to Hardware Security Module (HSM).
                    </p>
                    <div className="p-2.5 rounded bg-[#020202] border border-white/5 flex items-center justify-between text-[9.5px] font-mono text-[#009DFF] select-text">
                      <span className="truncate">0xSHA256_{selectedClient.id.toUpperCase()}_ROOT_CERTIFICATE_SEAL_V26</span>
                      <CheckCircle2 className="w-4 h-4 text-[#00FFC2] shrink-0" />
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: PROJECTS */}
              {drawerTab === "projects" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-white/40 text-[10px] uppercase font-bold border-b border-white/5 pb-1">
                    <span>Provisioned Enclaves</span>
                    <span>{getProjectsForClient(selectedClient.id).length} Active</span>
                  </div>

                  {getProjectsForClient(selectedClient.id).length === 0 ? (
                    <div className="p-8 text-center border border-dashed border-white/10 rounded-lg text-white/40 space-y-2">
                      <Layers className="w-8 h-8 mx-auto opacity-35" />
                      <div>No Hardware Sandbox Enclaves</div>
                      <p className="text-[10px] max-w-xs mx-auto">
                        This tenant account has no configured multi-agent sandbox layers yet. Submit a provisioning ticket via SLA support.
                      </p>
                    </div>
                  ) : (
                    getProjectsForClient(selectedClient.id).map((project) => (
                      <div 
                        key={project.id}
                        className="p-4 rounded-lg border border-white/5 bg-[#020202]/40 space-y-3"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-0.5">
                            <h4 className="text-[12px] font-bold text-white uppercase">{project.name}</h4>
                            <span className="text-[9.5px] text-[#009DFF] font-mono">{project.id.toUpperCase()}</span>
                          </div>
                          <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold">
                            {project.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-white/60 text-[10.5px] leading-relaxed">{project.desc}</p>
                        <div className="pt-2 border-t border-white/5 grid grid-cols-2 gap-2 text-[10px] text-white/40">
                          <div>Isolation Mode: <span className="text-white font-bold">{project.enclaveType}</span></div>
                          <div className="text-right">Active Nodes: <span className="text-[#00FFC2] font-bold">{project.nodesCount} Nodes</span></div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 3: AGENTS */}
              {drawerTab === "agents" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-white/40 text-[10px] uppercase font-bold border-b border-white/5 pb-1">
                    <span>Model Lattices / Multi-Agent Runs</span>
                    <span>{getAgentOpsForClient(selectedClient.id).length} Live</span>
                  </div>

                  {getAgentOpsForClient(selectedClient.id).length === 0 ? (
                    <div className="p-8 text-center border border-dashed border-white/10 rounded-lg text-white/40 space-y-2">
                      <Bot className="w-8 h-8 mx-auto opacity-35" />
                      <div>No Active AI Agent Instances</div>
                      <p className="text-[10px] max-w-xs mx-auto">
                        No active autonomous model operations are running inside this tenant's hardware security enclaves.
                      </p>
                    </div>
                  ) : (
                    getAgentOpsForClient(selectedClient.id).map((agent) => (
                      <div 
                        key={agent.id}
                        className="p-4 rounded-lg border border-white/5 bg-[#020202]/40 space-y-3"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-0.5">
                            <h4 className="text-[12px] font-bold text-white uppercase">{agent.name}</h4>
                            <span className="text-[9.5px] text-white/30">{agent.id.toUpperCase()}</span>
                          </div>
                          <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-bold border uppercase ${
                            agent.status === "active" 
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          }`}>
                            {agent.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[10px] text-white/50">
                          <div>Compute Threading: <span className="text-white font-bold">{agent.threads} Cores</span></div>
                          <div>Enclave Memory: <span className="text-white font-bold">{agent.memory}</span></div>
                        </div>

                        {/* Telemetry stream logs */}
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5 text-[9px] text-white/30 uppercase font-bold">
                            <Clock className="w-3 h-3 text-[#009DFF]" />
                            <span>eBPF Telemetry Event Ledger</span>
                          </div>
                          <div className="p-2.5 rounded bg-black/40 border border-white/5 font-mono text-[9px] text-emerald-400/80 space-y-1 overflow-hidden">
                            {agent.logs.map((log, lIdx) => (
                              <div key={lIdx} className="truncate">&gt; {log}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 4: BILLING */}
              {drawerTab === "billing" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-white/40 text-[10px] uppercase font-bold border-b border-white/5 pb-1">
                    <span>Bilateral Settlement & Epoch Ledgers</span>
                    <span>Monthly Billing telemetries</span>
                  </div>

                  {/* Plan specs */}
                  <div className="p-4 rounded-lg border border-white/5 bg-[#020202]/40 space-y-3">
                    <div className="flex items-center gap-1.5 text-white/30 text-[9.5px] uppercase font-bold border-b border-white/5 pb-1">
                      <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                      <span>Ledger Rate Limits</span>
                    </div>
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-[11px]">
                      <div className="flex justify-between"><span className="text-white/40">Tier level:</span><span className="text-amber-400 font-bold">{selectedClient.tier.toUpperCase()}</span></div>
                      <div className="flex justify-between"><span className="text-white/40">SLA priority:</span><span className="text-white font-semibold">24/7 SecWire</span></div>
                      <div className="flex justify-between col-span-2 pt-1 border-t border-white/5"><span className="text-white/40">Monthly compute limits:</span><span className="text-white font-bold">1,500,000 Epoch Credits</span></div>
                      <div className="flex justify-between col-span-2"><span className="text-white/40">Attestation ledger billing:</span><span className="text-[#00FFC2] font-semibold">Automatic via PKI key-count</span></div>
                    </div>
                  </div>

                  {/* Ledger logs */}
                  <div className="p-4 rounded-lg border border-white/5 bg-[#020202]/40 space-y-3">
                    <div className="flex items-center gap-1.5 text-white/30 text-[9.5px] uppercase font-bold">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>Simulation Invoice Telemetry</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 rounded bg-[#020202]/40 border border-white/5 text-[10.5px]">
                        <div>
                          <p className="text-white font-semibold uppercase">Epoch Q2 Spend</p>
                          <p className="text-[9px] text-white/30">Due on 2026-07-15</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold">$12,450.00</p>
                          <span className="text-[8.5px] px-1 py-0.5 rounded bg-blue-500/15 text-blue-400 uppercase font-bold font-mono">SEALED</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded bg-[#020202]/40 border border-white/5 text-[10.5px]">
                        <div>
                          <p className="text-white font-semibold uppercase">SLA SecWire Support</p>
                          <p className="text-[9px] text-white/30">Cleared 2026-06-15</p>
                        </div>
                        <div className="text-right">
                          <p className="text-emerald-400 font-bold">$2,500.00</p>
                          <span className="text-[8.5px] px-1 py-0.5 rounded bg-emerald-500/15 text-emerald-400 uppercase font-bold font-mono">PAID</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* Drawer Footer Actions */}
            <div className="p-5 border-t border-white/5 bg-[#090909] space-y-3">
              <button 
                onClick={(e) => handleInitiateHandshake(selectedClient, e)}
                className="w-full h-10 rounded bg-[#009DFF] hover:bg-[#0082d4] text-[11px] font-mono font-bold uppercase text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer border-none"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Establish Portal Mirror Handshake</span>
              </button>

              <button 
                onClick={() => router.push(`/admin/clients/${selectedClient.id}`)}
                className="w-full h-9 rounded border border-white/10 hover:border-white/20 bg-white/[0.01] hover:bg-white/[0.04] text-[11px] font-mono font-bold uppercase text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-[#009DFF]" />
                <span>Open Deep Audit Record</span>
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={(e) => handleOpenAssignOwner(selectedClient, e)}
                  className="h-9 rounded border border-white/10 hover:border-white/20 bg-white/[0.01] hover:bg-white/[0.03] text-[11px] font-mono font-bold uppercase text-white transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-white/60" />
                  <span>Assign Owner</span>
                </button>
                <button 
                  onClick={() => setSelectedClient(null)}
                  className="h-9 rounded border border-white/10 hover:bg-white/10 bg-white/[0.02] text-[11px] font-mono font-bold uppercase text-white/70 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                >
                  <span>Close Ledger</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* -----------------------------------------------------------------------
          6. ADD PREVIEW CLIENT MODAL
          ----------------------------------------------------------------------- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsAddModalOpen(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative z-10 w-full max-w-lg border border-white/10 bg-[#060606] rounded-xl overflow-hidden shadow-2xl flex flex-col font-mono text-[11.5px]">
            
            <div className="p-4 border-b border-white/5 bg-[#090909] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">PROVISION NEW PREVIEW TENANT</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-white/40 hover:text-white cursor-pointer bg-transparent border-none">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddClient} className="p-5 space-y-4 text-left">
              
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-white/40 block">Enterprise Corporate Name</label>
                <input 
                  type="text" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Sovereign Mining Corp"
                  required
                  className="w-full h-9 rounded bg-[#101010] border border-white/5 px-3 text-white outline-none focus:border-[#009DFF]/40 transition-all font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-white/40 block">Secure Domain Namespace</label>
                <input 
                  type="text" 
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  placeholder="e.g. sovereign-mining.gff.ai"
                  required
                  className="w-full h-9 rounded bg-[#101010] border border-white/5 px-3 text-white outline-none focus:border-[#009DFF]/40 transition-all font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-white/40 block">Industry Sector</label>
                  <select 
                    value={newIndustry}
                    onChange={(e) => setNewIndustry(e.target.value)}
                    className="w-full h-9 rounded bg-[#101010] border border-white/5 px-2 text-white outline-none focus:border-[#009DFF]/40 transition-all cursor-pointer"
                  >
                    <option value="Cybersecurity & Defense">Cybersecurity & Defense</option>
                    <option value="E-Commerce & Retail">E-Commerce & Retail</option>
                    <option value="Supply Chain & Logistics">Supply Chain & Logistics</option>
                    <option value="FinTech & Treasury">FinTech & Treasury</option>
                    <option value="Aerospace & Logistics">Aerospace & Logistics</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-white/40 block">Subscription Tier</label>
                  <select 
                    value={newTier}
                    onChange={(e) => setNewTier(e.target.value as any)}
                    className="w-full h-9 rounded bg-[#101010] border border-white/5 px-2 text-white outline-none focus:border-[#009DFF]/40 transition-all cursor-pointer"
                  >
                    <option value="Sovereign">Sovereign Tier</option>
                    <option value="Enterprise">Enterprise Tier</option>
                    <option value="Standard">Standard Tier</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-white/40 block">Enclave Region</label>
                  <select 
                    value={newRegion}
                    onChange={(e) => setNewRegion(e.target.value)}
                    className="w-full h-9 rounded bg-[#101010] border border-white/5 px-2 text-white outline-none focus:border-[#009DFF]/40 transition-all cursor-pointer"
                  >
                    <option value="EU-West (Isolated)">EU-West (Isolated)</option>
                    <option value="US-East (Dedicated)">US-East (Dedicated)</option>
                    <option value="APAC-South (Shared)">APAC-South (Shared)</option>
                    <option value="US-GovWest (Airgapped)">US-GovWest (Airgapped)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-white/40 block">Account Custodian</label>
                  <select 
                    value={newOwner}
                    onChange={(e) => setNewOwner(e.target.value)}
                    className="w-full h-9 rounded bg-[#101010] border border-white/5 px-2 text-white outline-none focus:border-[#009DFF]/40 transition-all cursor-pointer"
                  >
                    <option value="Dr. Sarah Vance">Dr. Sarah Vance</option>
                    <option value="Alexander Mercer">Alexander Mercer</option>
                    <option value="Sarah Jenkins">Sarah Jenkins</option>
                    <option value="Marcus Vance">Marcus Vance</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-white/40 block">Initial Health telemetry</label>
                  <select 
                    value={newHealth}
                    onChange={(e) => setNewHealth(e.target.value as any)}
                    className="w-full h-9 rounded bg-[#101010] border border-white/5 px-2 text-white outline-none focus:border-[#009DFF]/40 transition-all cursor-pointer"
                  >
                    <option value="Healthy">Healthy (Stable)</option>
                    <option value="Warning">Warning (Load)</option>
                    <option value="Critical">Critical (SLA Alert)</option>
                    <option value="Offline">Offline (Graceful)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-white/40 block">Billing Epoch Status</label>
                  <select 
                    value={newBilling}
                    onChange={(e) => setNewBilling(e.target.value as any)}
                    className="w-full h-9 rounded bg-[#101010] border border-white/5 px-2 text-white outline-none focus:border-[#009DFF]/40 transition-all cursor-pointer"
                  >
                    <option value="Paid">Paid Settlement</option>
                    <option value="Unpaid">Unpaid Invoices</option>
                    <option value="Overdue">Overdue Outstanding</option>
                    <option value="Processing">Epoch Processing</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded bg-amber-400/5 border border-amber-400/10 text-[10px] text-amber-300 flex items-start gap-2 leading-relaxed">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                <span>
                  ATTENTION: Creating a client account compiles transient hardware keys only. Simulated logs and billing epochs will be dynamically bound. No real cloud costs incurred.
                </span>
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="h-9 px-4 rounded border border-white/10 hover:bg-white/5 text-white/70 hover:text-white text-[11px] font-mono font-bold uppercase transition-all cursor-pointer bg-transparent"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="h-9 px-4 rounded bg-[#10b981] hover:bg-[#059669] text-white text-[11px] font-mono font-bold uppercase transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] cursor-pointer border-none"
                >
                  Confirm Provisioning
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* -----------------------------------------------------------------------
          7. ASSIGN ACCOUNT OWNER MODAL
          ----------------------------------------------------------------------- */}
      {isAssignModalOpen && assigningClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsAssignModalOpen(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative z-10 w-full max-w-sm border border-white/10 bg-[#060606] rounded-xl overflow-hidden shadow-2xl flex flex-col font-mono text-[11.5px]">
            
            <div className="p-4 border-b border-white/5 bg-[#090909] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#009DFF]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">RE-ASSIGN CUSTODIAN</h3>
              </div>
              <button onClick={() => setIsAssignModalOpen(false)} className="text-white/40 hover:text-white cursor-pointer bg-transparent border-none">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveOwner} className="p-5 space-y-4 text-left">
              
              <div className="space-y-1 bg-[#101010]/50 p-3 rounded border border-white/5">
                <span className="text-[10px] text-white/40 uppercase block font-bold">Selected Tenant</span>
                <p className="text-white font-bold">{assigningClient.name}</p>
                <p className="text-[10px] text-[#009DFF]">{assigningClient.domain}</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-white/40 block">Account Custodian Assigned</label>
                <select 
                  value={assignedOwner}
                  onChange={(e) => setAssignedOwner(e.target.value)}
                  className="w-full h-9 rounded bg-[#101010] border border-white/5 px-2 text-white outline-none focus:border-[#009DFF]/40 transition-all cursor-pointer font-mono text-[11px]"
                >
                  <option value="Dr. Sarah Vance">Dr. Sarah Vance (Lead Oversight)</option>
                  <option value="Alexander Mercer">Alexander Mercer (Sandbox Lead)</option>
                  <option value="Sarah Jenkins">Sarah Jenkins (GovWest Auditor)</option>
                  <option value="Marcus Vance">Marcus Vance (APAC Lead)</option>
                  <option value="Dr. Robert Chen">Dr. Robert Chen (SLA Architect)</option>
                  <option value="Director Ava Thorne">Director Ava Thorne (Operations Custodian)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="h-9 px-4 rounded border border-white/10 hover:bg-white/5 text-white/70 hover:text-white text-[11px] font-mono font-bold uppercase transition-all cursor-pointer bg-transparent"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="h-9 px-4 rounded bg-[#009DFF] hover:bg-[#0082d4] text-white text-[11px] font-mono font-bold uppercase transition-all shadow-[0_0_15px_rgba(0,157,255,0.2)] cursor-pointer border-none"
                >
                  Confirm Custodian
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* -----------------------------------------------------------------------
          8. SECURE PORTAL MIRROR CONNECTION LAYER (HANDSHAKE OVERLAY)
          ----------------------------------------------------------------------- */}
      {handshakeClient && handshakeStep > 0 && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full border border-white/10 bg-[#040404] p-8 rounded-2xl shadow-2xl text-center space-y-6 font-mono">
            
            {/* Hologram loading ring */}
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-white/5 border-t-2 border-t-[#009DFF] animate-spin" />
              <Shield className="w-7 h-7 text-[#009DFF]" />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Establishing Private Mirror Link</h3>
              <p className="text-[11px] text-white/50">
                Impersonating administrator context under ISO-27001 auditing guidelines.
              </p>
            </div>

            {/* Simulated Handshake Flow */}
            <div className="bg-black/60 border border-white/5 p-4 rounded-xl text-left space-y-3 font-mono text-[10px]">
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${handshakeStep >= 1 ? "bg-emerald-400" : "bg-white/10"}`} />
                <span className={handshakeStep >= 1 ? "text-white" : "text-white/30"}>[01] Mapping clearance credentials (Clearance V)</span>
                {handshakeStep >= 1 && <Check className="w-3.5 h-3.5 text-emerald-400 ml-auto shrink-0" />}
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${handshakeStep >= 2 ? "bg-emerald-400 animate-pulse" : "bg-white/10"}`} />
                <span className={handshakeStep >= 2 ? "text-white" : "text-white/30"}>[02] Binding TLS 1.3 socket to client HSM certificate</span>
                {handshakeStep >= 2 && <Check className="w-3.5 h-3.5 text-emerald-400 ml-auto shrink-0" />}
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${handshakeStep >= 3 ? "bg-emerald-400 animate-pulse" : "bg-white/10"}`} />
                <span className={handshakeStep >= 3 ? "text-white" : "text-white/30"}>[03] Redirecting mirror stream to telemetry workspace</span>
                {handshakeStep >= 3 && <RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin ml-auto shrink-0" />}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="flex items-start gap-2.5 text-[9.5px] text-white/30 leading-relaxed text-left bg-white/[0.01] p-3 rounded border border-white/5">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                All administrative access mimics real-world single sign-on (SSO) handshakes. Action logs are automatically sealed in the system activity log.
              </span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
