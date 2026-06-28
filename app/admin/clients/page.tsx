"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, Plus, User, ExternalLink, Shield, Check, Copy, 
  ChevronRight, Info, Clock, CreditCard, Layers, 
  Bot, AlertTriangle, CheckCircle2, X, Building, Globe, RefreshCw, Lock, Edit
} from "lucide-react";

interface AdminClient {
  id: string;
  name: string;
  domain: string;
  status: "active" | "suspended" | "pending" | "archived";
  tier: "Sovereign" | "Enterprise" | "Standard";
  createdAt: string;
  region: string;
  complianceLevel: string;
  contactName: string;
  contactEmail: string;
  industry: string;
  accountOwner: string;
  billingStatus: "Paid" | "Unpaid" | "Processing" | "Overdue";
  healthStatus: "Healthy" | "Warning" | "Critical" | "Offline";
}

export default function AdminClientsPage() {
  const router = useRouter();

  // state variables
  const [clients, setClients] = useState<AdminClient[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dbProjectsCount, setDbProjectsCount] = useState<number | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [selectedClient, setSelectedClient] = useState<AdminClient | null>(null);
  const [drawerTab, setDrawerTab] = useState<"overview" | "projects" | "agents" | "billing">("overview");
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<AdminClient | null>(null);
  
  const [handshakeClient, setHandshakeClient] = useState<AdminClient | null>(null);
  const [handshakeStep, setHandshakeStep] = useState(0);

  // Form states
  const [newName, setNewName] = useState("");
  const [newDomain, setNewDomain] = useState("");
  const [newIndustry, setNewIndustry] = useState("Cybersecurity & Defense");
  const [newTier, setNewTier] = useState<"Sovereign" | "Enterprise" | "Standard">("Sovereign");
  const [newRegion, setNewRegion] = useState("EU-West (Isolated)");
  const [newOwner, setNewOwner] = useState("Dr. Sarah Vance");
  const [newContactName, setNewContactName] = useState("");
  const [newContactEmail, setNewContactEmail] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("gff_ai_access_token") || localStorage.getItem("gff_api_token") : null;
      if (!token) throw new Error("Your session has expired. Please sign in again.");

      const meRes = await fetch("/api/v1/auth/me", { headers: { "Authorization": `Bearer ${token}` } });
      if (meRes.ok) {
        const meData = await meRes.json();
        setCurrentUser(meData.user);
      }

      const clientsRes = await fetch("/api/v1/clients", { headers: { "Authorization": `Bearer ${token}` } });
      const clientsData = await clientsRes.json();
      if (clientsData.success) {
        const mappedClients = clientsData.clients.map((c: any) => {
          const domain = c.domain || `${(c.name || "client").toLowerCase().replace(/\s+/g, "-")}.gff.ai`;
          return {
            id: String(c.id || c.client_id || ""),
            name: c.name || "",
            domain: domain,
            status: c.status || "active",
            tier: c.tier || (String(c.id) === "1" ? "Sovereign" : "Enterprise"),
            region: c.region || "North America",
            complianceLevel: c.complianceLevel || c.compliance_level || (String(c.id) === "1" ? "ISO-27001 Fully Certified" : "SOC2 Type II Assured"),
            industry: c.industry || "Technology",
            accountOwner: c.accountOwner || c.account_owner || "GFF Partner Team",
            contactName: c.contactName || c.contact_name || "Account Representative",
            contactEmail: c.contactEmail || c.contact_email || `admin@${domain}`,
            billingStatus: c.billingStatus || c.billing_status || "Paid",
            healthStatus: c.healthStatus || c.health_status || "Healthy",
            createdAt: c.createdAt || c.created_at || new Date().toISOString()
          };
        });
        setClients(mappedClients);

        // Fetch dynamic projects count
        const projectsRes = await fetch("/api/v1/projects", { headers: { "Authorization": `Bearer ${token}` } });
        if (projectsRes.ok) {
          const projectsData = await projectsRes.json();
          if (projectsData.success && Array.isArray(projectsData.projects)) {
            setDbProjectsCount(projectsData.projects.length);
          }
        }
      } else {
        throw new Error(clientsData.message || "Failed to load clients registry.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to sync client enclaves.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleInitiateHandshake = (client: AdminClient, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setHandshakeClient(client);
    setHandshakeStep(1);
  };

  useEffect(() => {
    if (handshakeStep > 0 && handshakeStep < 4) {
      const timer = setTimeout(() => setHandshakeStep(prev => prev + 1), 850);
      return () => clearTimeout(timer);
    }
  }, [handshakeStep]);

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    if (newName.trim().length < 3) return setValidationError("Name must be at least 3 characters.");
    if (!newDomain.includes(".") || newDomain.length < 4) return setValidationError("Invalid domain address.");

    try {
      const token = localStorage.getItem("gff_ai_access_token");
      const res = await fetch("/api/v1/clients", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName, domain: newDomain, tier: newTier, region: newRegion,
          industry: newIndustry, accountOwner: newOwner, contactName: newContactName, contactEmail: newContactEmail
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage(`Tenant "${newName}" provisioned.`);
        setIsAddModalOpen(false);
        setNewName(""); setNewDomain("");
        fetchData();
      } else {
        setValidationError(data.message || "Failed to register client.");
      }
    } catch (err: any) {
      setValidationError(err.message);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient) return;
    setValidationError(null);

    try {
      const token = localStorage.getItem("gff_ai_access_token");
      const res = await fetch(`/api/v1/clients/${editingClient.id}`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(editingClient)
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage(`Tenant "${editingClient.name}" updated.`);
        setIsEditModalOpen(false);
        setEditingClient(null);
        fetchData();
      } else {
        setValidationError(data.message || "Failed to save client.");
      }
    } catch (err: any) {
      setValidationError(err.message);
    }
  };

  const handleArchive = async (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Confirm suspension of "${name}"?`)) return;
    try {
      const token = localStorage.getItem("gff_ai_access_token");
      const res = await fetch(`/api/v1/clients/${id}`, { method: "DELETE", headers: { "Authorization": `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage(`Enclave for "${name}" suspended.`);
        fetchData();
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const filtered = clients.filter(c => {
    const q = searchQuery.toLowerCase();
    const matchQ = c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q) || c.domain.toLowerCase().includes(q);
    const matchS = !statusFilter || c.status === statusFilter;
    const matchR = !regionFilter || c.region === regionFilter;
    const matchI = !industryFilter || c.industry === industryFilter;
    return matchQ && matchS && matchR && matchI;
  });

  const isPlatformAdmin = currentUser?.role === "gff_admin";

  return (
    <div className="space-y-6 text-white font-mono">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight uppercase">Client Directory</h2>
          <p className="text-xs text-white/50 mt-1">Manage client accounts, setup details, and system configurations in one place.</p>
        </div>
        {isPlatformAdmin && (
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="h-10 px-4 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/35 text-emerald-400 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>ADD NEW CLIENT</span>
          </button>
        )}
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-white/5 bg-[#050505]/40 p-4 space-y-1">
          <span className="text-[10px] text-white/40 uppercase font-bold block font-mono">Total Clients</span>
          <div className="text-2xl font-bold">{loading ? "..." : clients.length}</div>
        </div>
        <div className="rounded-xl border border-white/5 bg-[#050505]/40 p-4 space-y-1">
          <span className="text-[10px] text-white/40 uppercase font-bold block font-mono">Active Projects</span>
          <div className="text-2xl font-bold">{loading ? "..." : (dbProjectsCount ?? 0)}</div>
        </div>
        <div className="rounded-xl border border-white/5 bg-[#050505]/40 p-4 space-y-1">
          <span className="text-[10px] text-white/40 uppercase font-bold block font-mono">Monitoring Status</span>
          <div className="text-2xl font-bold text-emerald-400">ACTIVE & SECURE</div>
        </div>
      </div>

      {successMessage && (
        <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs flex justify-between items-center">
          <span>{successMessage}</span>
          <button onClick={() => setSuccessMessage(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* FILTERS */}
      <div className="rounded-xl border border-white/5 bg-[#030303]/40 p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-white/30" />
          <input 
            type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search enclaves..."
            className="w-full h-9 rounded-lg border border-white/5 bg-white/[0.01] pl-9 pr-4 text-[12px] placeholder-white/30 outline-none"
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-9 px-2 rounded-lg border border-white/5 bg-black text-xs cursor-pointer">
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="pending">Pending</option>
        </select>
        <button onClick={() => { setSearchQuery(""); setStatusFilter(""); fetchData(); }} className="h-9 px-3 rounded-lg border border-white/10 bg-white/[0.01] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>SYNC</span>
        </button>
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="p-12 text-center text-xs text-white/50 animate-pulse"><RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" /> Loading Enclave Registry...</div>
      ) : error ? (
        <div className="p-8 text-center border border-red-500/20 bg-red-500/5 rounded-xl space-y-3">
          <AlertTriangle className="w-8 h-8 text-red-400 mx-auto" />
          <p className="text-xs text-white/70">{error}</p>
          <button onClick={fetchData} className="px-3 py-1.5 bg-red-500/15 text-red-400 border border-red-500/30 text-xs rounded uppercase font-bold cursor-pointer">Retry Connection</button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center border border-white/5 bg-black/20 rounded-xl text-xs text-white/45">No sovereign clients found matching queries.</div>
      ) : (
        <div className="border border-white/5 bg-[#050505]/40 rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01] text-white/40">
                <th className="p-3">Partition ID / Domain</th>
                <th className="p-3">Tenant Name</th>
                <th className="p-3">Status</th>
                <th className="p-3">Compliance</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((c, index) => (
                <tr key={`${c.id || index}-${index}`} onClick={() => setSelectedClient(c)} className="hover:bg-white/[0.02] transition-colors cursor-pointer">
                  <td className="p-3 font-bold text-white"><span className="text-[#009DFF]">{c.id}</span><div className="text-[9.5px] text-white/45 font-normal mt-0.5">{c.domain}</div></td>
                  <td className="p-3 font-bold">{c.name}<div className="text-[9.5px] text-white/45 font-normal mt-0.5">Owner: {c.accountOwner}</div></td>
                  <td className="p-3">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                      c.status === "active" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="p-3 text-[#00FFC2] font-semibold">{c.complianceLevel}<div className="text-[9.5px] text-white/35 font-normal mt-0.5">{c.region}</div></td>
                  <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleInitiateHandshake(c)} className="p-1 text-amber-400 hover:text-amber-300 hover:bg-white/5 rounded cursor-pointer animate-none" title="Diagnostics Handshake"><RefreshCw className="w-3.5 h-3.5" /></button>
                      {isPlatformAdmin && (
                        <>
                          <button onClick={() => { setEditingClient({ ...c }); setIsEditModalOpen(true); }} className="p-1 text-emerald-400 hover:text-emerald-300 hover:bg-white/5 rounded cursor-pointer animate-none" title="Edit Client"><Edit className="w-3.5 h-3.5" /></button>
                          <button onClick={(e) => handleArchive(c.id, c.name, e)} className="p-1 text-rose-500 hover:text-rose-400 hover:bg-white/5 rounded cursor-pointer animate-none" title="Archive Enclave"><X className="w-3.5 h-3.5" /></button>
                        </>
                      )}
                      <button onClick={() => setSelectedClient(c)} className="p-1 text-white/40 hover:text-white hover:bg-white/5 rounded cursor-pointer"><ChevronRight className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* DETAILS DRAWER */}
      {selectedClient && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#070709] border-l border-white/10 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="p-4 border-b border-white/10 bg-[#0a0a0d] flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#009DFF]">Client Account Monitor ({selectedClient.id})</span>
              <button onClick={() => setSelectedClient(null)} className="text-white/40 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-white/[0.01] border border-white/5 rounded-lg space-y-2">
                <span className="text-[10px] text-white/40 font-bold block uppercase border-b border-white/5 pb-1">Client Profile</span>
                <div><span className="text-white/30 text-[9px] block">Company Name</span><span className="font-bold text-white">{selectedClient.name}</span></div>
                <div><span className="text-white/30 text-[9px] block">Primary Domain</span><span className="text-white">{selectedClient.domain}</span></div>
                <div><span className="text-white/30 text-[9px] block">Service Tier</span><span className="text-amber-400 font-bold uppercase">{selectedClient.tier}</span></div>
                <div><span className="text-white/30 text-[9px] block">Hosting Region</span><span className="text-white">{selectedClient.region}</span></div>
                <div><span className="text-white/30 text-[9px] block">Compliance Level</span><span className="text-[#00FFC2] font-semibold">{selectedClient.complianceLevel}</span></div>
              </div>
              <div className="p-3 bg-white/[0.01] border border-white/5 rounded-lg space-y-2">
                <span className="text-[10px] text-white/40 font-bold block uppercase border-b border-white/5 pb-1">Contact Information</span>
                <div><span className="text-white/30 text-[9px] block">Account Representative</span><span className="text-white font-bold">{selectedClient.contactName}</span></div>
                <div><span className="text-white/30 text-[9px] block">Email Address</span><span className="text-white">{selectedClient.contactEmail}</span></div>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-white/5 bg-[#09090c] space-y-2">
            <button onClick={(e) => handleInitiateHandshake(selectedClient, e)} className="w-full py-2 bg-[#009DFF] text-white text-xs font-bold uppercase rounded cursor-pointer border-none">Test System Connection</button>
            <button onClick={() => router.push(`/admin/clients/${selectedClient.id}`)} className="w-full py-2 border border-white/10 hover:border-white/20 text-white text-xs font-bold uppercase rounded cursor-pointer">View Client Profile & Setup</button>
          </div>
        </div>
      )}

      {/* HANDSHAKE PROBE */}
      {handshakeStep > 0 && handshakeClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-[#09090b] border border-white/10 rounded-xl overflow-hidden shadow-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-amber-400">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>eBPF Telemetry Dial-In</span>
            </div>
            <div className="p-3 bg-black rounded border border-white/5 font-mono text-[10px] space-y-1 text-zinc-300 h-28 overflow-y-auto">
              <p className="text-white/30">[CONNECTING TO {handshakeClient.id.toUpperCase()}]</p>
              {handshakeStep >= 1 && <p>&gt; Resolving target boundary TLS certificate...</p>}
              {handshakeStep >= 2 && <p className="text-[#009DFF]">&gt; HSM PKI root certificate trusted.</p>}
              {handshakeStep >= 3 && <p className="text-[#00FFC2]">&gt; Hook successfully attached to kernel namespace.</p>}
            </div>
            {handshakeStep === 3 && (
              <div className="flex justify-end"><button onClick={() => setHandshakeStep(0)} className="px-3 py-1 bg-[#009DFF] text-white text-[10px] font-bold rounded uppercase cursor-pointer border-none">Close Diagnostics</button></div>
            )}
          </div>
        </div>
      )}

      {/* ADD MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#09090b] border border-white/10 rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-xs font-bold uppercase text-[#009DFF]">Add New Client</span>
              <button onClick={() => setIsAddModalOpen(false)}><X className="w-4 h-4 text-white/40" /></button>
            </div>
            <form onSubmit={handleAddClient} className="space-y-3 text-xs">
              {validationError && <div className="p-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded">{validationError}</div>}
              <div><label className="text-[10px] block mb-1">Company Name</label><input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full p-2 bg-black border border-white/10 rounded" required /></div>
              <div><label className="text-[10px] block mb-1">Domain Endpoint</label><input type="text" value={newDomain} onChange={(e) => setNewDomain(e.target.value)} className="w-full p-2 bg-black border border-white/10 rounded" required /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-[10px] block mb-1">Tier</label><select value={newTier} onChange={(e) => setNewTier(e.target.value as any)} className="w-full p-2 bg-black border border-white/10 rounded"><option value="Sovereign">Sovereign</option><option value="Enterprise">Enterprise</option></select></div>
                <div><label className="text-[10px] block mb-1">Region</label><input type="text" value={newRegion} onChange={(e) => setNewRegion(e.target.value)} className="w-full p-2 bg-black border border-white/10 rounded" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-[10px] block mb-1">Admin Representative</label><input type="text" value={newContactName} onChange={(e) => setNewContactName(e.target.value)} className="w-full p-2 bg-black border border-white/10 rounded" required /></div>
                <div><label className="text-[10px] block mb-1">Secure Email</label><input type="email" value={newContactEmail} onChange={(e) => setNewContactEmail(e.target.value)} className="w-full p-2 bg-black border border-white/10 rounded" required /></div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-white/5"><button type="button" onClick={() => setIsAddModalOpen(false)} className="px-3 py-1.5 border border-white/10 rounded cursor-pointer">Cancel</button><button type="submit" className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded cursor-pointer font-bold">Register Tenant</button></div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && editingClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#09090b] border border-white/10 rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-xs font-bold uppercase text-[#009DFF]">Edit Client Details ({editingClient.id})</span>
              <button onClick={() => setIsEditModalOpen(false)}><X className="w-4 h-4 text-white/40" /></button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-3 text-xs">
              {validationError && <div className="p-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded">{validationError}</div>}
              <div><label className="text-[10px] block mb-1">Company Name</label><input type="text" value={editingClient.name} onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })} className="w-full p-2 bg-black border border-white/10 rounded" required /></div>
              <div><label className="text-[10px] block mb-1">Domain Endpoint</label><input type="text" value={editingClient.domain} onChange={(e) => setEditingClient({ ...editingClient, domain: e.target.value })} className="w-full p-2 bg-black border border-white/10 rounded" required /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-[10px] block mb-1">Tier</label><select value={editingClient.tier} onChange={(e) => setEditingClient({ ...editingClient, tier: e.target.value as any })} className="w-full p-2 bg-black border border-white/10 rounded"><option value="Sovereign">Sovereign</option><option value="Enterprise">Enterprise</option></select></div>
                <div><label className="text-[10px] block mb-1">Region</label><input type="text" value={editingClient.region} onChange={(e) => setEditingClient({ ...editingClient, region: e.target.value })} className="w-full p-2 bg-black border border-white/10 rounded" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-[10px] block mb-1">Admin Delegate</label><input type="text" value={editingClient.contactName} onChange={(e) => setEditingClient({ ...editingClient, contactName: e.target.value })} className="w-full p-2 bg-black border border-white/10 rounded" /></div>
                <div><label className="text-[10px] block mb-1">Secure Email</label><input type="email" value={editingClient.contactEmail} onChange={(e) => setEditingClient({ ...editingClient, contactEmail: e.target.value })} className="w-full p-2 bg-black border border-white/10 rounded" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-[10px] block mb-1">Health Status</label><select value={editingClient.healthStatus} onChange={(e) => setEditingClient({ ...editingClient, healthStatus: e.target.value as any })} className="w-full p-2 bg-black border border-white/10 rounded"><option value="Healthy">Healthy</option><option value="Warning">Warning</option></select></div>
                <div><label className="text-[10px] block mb-1">Billing Status</label><select value={editingClient.billingStatus} onChange={(e) => setEditingClient({ ...editingClient, billingStatus: e.target.value as any })} className="w-full p-2 bg-black border border-white/10 rounded"><option value="Paid">Paid</option><option value="Unpaid">Unpaid</option></select></div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-white/5"><button type="button" onClick={() => setIsEditModalOpen(false)} className="px-3 py-1.5 border border-white/10 rounded cursor-pointer font-bold">Cancel</button><button type="submit" className="px-3 py-1.5 bg-[#009DFF] hover:bg-[#0082d4] text-white rounded cursor-pointer font-bold border-none">Save Changes</button></div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
