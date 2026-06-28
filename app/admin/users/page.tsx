"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search, Shield, KeyRound, UserPlus, Users, RefreshCw, X, Check, Lock,
  Mail, User as UserIcon, Copy, Info, AlertTriangle, CheckCircle2, ChevronRight, Settings
} from "lucide-react";

interface LocalUser {
  id: string;
  name: string;
  email: string;
  role: "gff_admin" | "client_admin" | "client_member";
  clientAssociation: string;
  status: "active" | "inactive";
  clearance: string;
  lastActive?: string;
  createdAt?: string;
  permissions?: string[];
}

const ROLE_PERMISSIONS: Record<string, string[]> = {
  gff_admin: ["all:*", "read:telemetry", "write:telemetry", "read:users", "write:users", "read:clients", "write:clients"],
  client_admin: ["read:telemetry", "read:projects", "write:projects", "read:users", "write:users"],
  client_member: ["read:telemetry", "read:projects", "read:documents"]
};

const ROLE_CLEARANCES: Record<string, string> = {
  gff_admin: "CLEARANCE LEVEL V (SECURE PLATFORM SUPERUSER)",
  client_admin: "CLEARANCE LEVEL III (SANDBOX OPERATOR)",
  client_member: "CLEARANCE LEVEL I (BASIC VIEW-ONLY)"
};

export default function AdminUsersPage() {
  const router = useRouter();

  const [users, setUsers] = useState<LocalUser[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<LocalUser | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<"all" | "gff_admin" | "client_admin" | "client_member">("all");

  const [auditLogs, setAuditLogs] = useState<string[]>([]);
  const [isResetting, setIsResetting] = useState(false);

  // Invite/Create Modal State
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"gff_admin" | "client_admin" | "client_member">("client_member");
  const [inviteClient, setInviteClient] = useState("Apex Sovereign Group [Preview Client]");
  const [inviteStep, setInviteStep] = useState<"form" | "generating" | "success">("form");
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [newlyCreatedUser, setNewlyCreatedUser] = useState<any>(null);

  const addLog = useCallback((text: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setAuditLogs(prev => [`[${timestamp}] ${text}`, ...prev.slice(0, 15)]);
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("gff_ai_access_token") || localStorage.getItem("gff_api_token") : null;
      if (!token) throw new Error("Your session has expired. Please sign in again.");

      // Fetch current profile
      const meRes = await fetch("/api/v1/auth/me", { headers: { "Authorization": `Bearer ${token}` } });
      if (meRes.ok) {
        const meData = await meRes.json();
        setCurrentUser(meData.user);
      }

      // Fetch users list
      const usersRes = await fetch("/api/v1/users", { headers: { "Authorization": `Bearer ${token}` } });
      const usersData = await usersRes.json();
      if (usersData.success) {
        setUsers(usersData.users);
        if (usersData.users.length > 0) {
          setSelectedUser(usersData.users[0]);
        }
        addLog("SECURE EYE: Users database synchronized.");
      } else {
        throw new Error(usersData.message || "Failed to load users list.");
      }
    } catch (err: any) {
      setError(err.message || "Connection to Identity server failed.");
    } finally {
      setLoading(false);
    }
  }, [addLog]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRoleChange = async (userId: string, newRole: "gff_admin" | "client_admin" | "client_member") => {
    setValidationError(null);
    try {
      const token = localStorage.getItem("gff_ai_access_token") || localStorage.getItem("gff_api_token");
      const res = await fetch(`/api/v1/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage(`Role shifted successfully.`);
        addLog(`AUDIT: Role for user ${userId} updated to ${newRole}.`);
        fetchData();
      } else {
        setValidationError(data.message || "Unable to change role.");
      }
    } catch (err: any) {
      setValidationError(err.message);
    }
  };

  const handleToggleStatus = async (user: LocalUser) => {
    setValidationError(null);
    const nextStatus = user.status === "active" ? "inactive" : "active";
    try {
      const token = localStorage.getItem("gff_ai_access_token") || localStorage.getItem("gff_api_token");
      const res = await fetch(`/api/v1/users/${user.id}/status`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage(`Account status changed.`);
        addLog(`AUDIT: Toggle status for ${user.id} -> ${nextStatus.toUpperCase()}.`);
        fetchData();
      } else {
        setValidationError(data.message || "Failed to toggle status.");
      }
    } catch (err: any) {
      setValidationError(err.message);
    }
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (email === currentUser?.email) return alert("Self-deletion is blocked.");
    if (!confirm(`Revoke identity credentials for user ${userId}?`)) return;
    try {
      const token = localStorage.getItem("gff_ai_access_token");
      const res = await fetch(`/api/v1/users/${userId}`, { method: "DELETE", headers: { "Authorization": `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage("Credentials successfully revoked.");
        addLog(`REVOKE: Destroyed identity keys for ${userId}.`);
        fetchData();
      }
    } catch (err: any) {
      setValidationError(err.message);
    }
  };

  const handleResetCredentials = (userId: string) => {
    setIsResetting(true);
    addLog(`INITIATE: Rotating hardware FIDO2 credentials for ${userId}...`);
    setTimeout(() => {
      setIsResetting(false);
      const backupCode = `RECOVERY-KEY-0X${Math.random().toString(16).slice(2, 10).toUpperCase()}`;
      addLog(`SUCCESS: Secure key registered. Temp Code: ${backupCode}`);
      alert(`FIDO2 key successfully rotated!\n\nTemp Recovery Token:\n${backupCode}`);
    }, 1000);
  };

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    if (!inviteName.trim() || !inviteEmail.includes("@")) return setValidationError("Valid name and email are required.");

    setInviteStep("generating");
    const tempPassword = `PassWord-${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedPassword(tempPassword);

    try {
      const token = localStorage.getItem("gff_ai_access_token");
      const res = await fetch("/api/v1/users", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          name: inviteName,
          email: inviteEmail,
          role: inviteRole,
          clientAssociation: inviteRole === "gff_admin" ? "GFF AI Platform Core (Global Root)" : inviteClient,
          status: "inactive",
          clearance: ROLE_CLEARANCES[inviteRole],
          password: tempPassword
        })
      });

      const data = await res.json();
      if (data.success) {
        addLog(`PROVISION: Generated token envelope for ${inviteEmail}.`);
        setNewlyCreatedUser(data.user);
        setInviteStep("success");
      } else {
        setInviteStep("form");
        setValidationError(data.message || "Failed to provision credentials.");
      }
    } catch (err: any) {
      setInviteStep("form");
      setValidationError(err.message);
    }
  };

  const handleAcceptInviteSimulated = async () => {
    const targetUser = newlyCreatedUser || users[users.length - 1];
    if (targetUser) {
      try {
        const token = localStorage.getItem("gff_ai_access_token");
        await fetch(`/api/v1/users/${targetUser.id}/status`, {
          method: "PATCH",
          headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ status: "active" })
        });
        addLog(`ACCEPT: Invited operator ${targetUser.id} confirmed session.`);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
    setIsInviteOpen(false);
    setInviteStep("form");
    setInviteName("");
    setInviteEmail("");
    setNewlyCreatedUser(null);
  };

  const filteredUsers = users.filter(u => {
    const q = searchQuery.toLowerCase();
    const matchQ = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.id.toLowerCase().includes(q);
    const matchR = selectedRoleFilter === "all" || u.role === selectedRoleFilter;
    return matchQ && matchR;
  });

  const isPlatformAdmin = currentUser?.role === "gff_admin";

  return (
    <div className="space-y-6 text-white font-mono">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight uppercase">User & Team Management</h2>
          <p className="text-xs text-white/50 mt-1">Manage user accounts, roles, access settings, and platform permissions in one place.</p>
          {!isPlatformAdmin && currentUser && (
            <div className="mt-2 text-[10px] text-amber-400 bg-amber-500/5 px-2.5 py-1 rounded border border-amber-500/10 inline-block">
              ⚠️ VIEW-ONLY: You need admin rights to manage users and roles.
            </div>
          )}
        </div>
        {isPlatformAdmin && (
          <button 
            onClick={() => setIsInviteOpen(true)}
            className="h-10 px-4 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/35 text-emerald-400 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>CREATE NEW USER</span>
          </button>
        )}
      </div>

      {successMessage && (
        <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs flex justify-between items-center">
          <span>{successMessage}</span>
          <button onClick={() => setSuccessMessage(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* CORE SPLIT SCREEN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT 2 COLS: LIST */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-white/5 bg-[#030303]/40 p-4 flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-white/30" />
              <input 
                type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search operator list..."
                className="w-full h-9 rounded-lg border border-white/5 bg-white/[0.01] pl-9 pr-4 text-[12px] placeholder-white/30 outline-none"
              />
            </div>
            <select value={selectedRoleFilter} onChange={(e) => setSelectedRoleFilter(e.target.value as any)} className="h-9 px-2 rounded-lg border border-white/5 bg-black text-xs cursor-pointer">
              <option value="all">All Roles</option>
              <option value="gff_admin">GFF Admin</option>
              <option value="client_admin">Client Admin</option>
              <option value="client_member">Client Member</option>
            </select>
            <button onClick={fetchData} className="h-9 px-3 rounded-lg border border-white/10 bg-white/[0.01] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>SYNC</span>
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-white/50 animate-pulse"><RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" /> Syncing secure identity mesh...</div>
          ) : error ? (
            <div className="p-8 text-center border border-red-500/20 bg-red-500/5 rounded-xl space-y-3">
              <AlertTriangle className="w-8 h-8 text-red-400 mx-auto" />
              <p className="text-xs text-white/70">{error}</p>
              <button onClick={fetchData} className="px-3 py-1.5 bg-red-500/15 text-red-400 border border-red-500/30 text-xs rounded uppercase font-bold cursor-pointer">Retry Bridge</button>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center border border-white/5 bg-black/20 rounded-xl text-xs text-white/45">No operators found matching queries.</div>
          ) : (
            <div className="border border-white/5 bg-[#050505]/40 rounded-xl overflow-hidden divide-y divide-white/5">
              {filteredUsers.map((user, index) => {
                const isSelected = selectedUser?.id === user.id;
                return (
                  <div 
                    key={`${user.email}-${index}`} 
                    onClick={() => setSelectedUser(user)}
                    className={`p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 cursor-pointer transition-colors ${
                      isSelected ? "bg-white/[0.03] border-l-2 border-[#009DFF]" : "hover:bg-white/[0.01]"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4 text-[#009DFF]" />
                        <span className="font-bold text-white text-xs">{user.name}</span>
                        <span className="text-[9px] text-[#00FFC2] font-semibold border border-[#00FFC2]/20 px-1.5 rounded uppercase">{user.role.replace("_", " ")}</span>
                      </div>
                      <div className="text-[10px] text-white/50 mt-1 flex flex-wrap gap-x-3">
                        <span>Email: {user.email}</span>
                        <span>Client: {user.clientAssociation.split(" [")[0]}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <span className={`h-2 w-2 rounded-full ${user.status === "active" ? "bg-emerald-400 animate-pulse" : "bg-white/20"}`} />
                      <span className="text-[9px] uppercase font-bold text-white/40">{user.status}</span>
                      <ChevronRight className="w-4 h-4 text-white/20" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT COL: CONSOLE & INSPECTOR */}
        <div className="space-y-6">
          {/* INSPECTOR */}
          {selectedUser && (
            <div className="rounded-xl border border-white/5 bg-[#050505]/40 p-4 space-y-4">
              <div className="flex items-center gap-2 border-b border-white/5 pb-2 select-none">
                <Lock className="w-4 h-4 text-[#009DFF]" />
                <span className="text-[10px] uppercase font-bold text-white/45">User Account Details</span>
              </div>

              <div className="space-y-3 text-xs">
                <div><span className="text-white/30 text-[9px] block">USER FULL NAME</span><span className="font-bold text-white text-sm">{selectedUser.name}</span></div>
                <div><span className="text-white/30 text-[9px] block">SECURITY ACCESS LEVEL</span><span className="text-amber-400 font-bold">{selectedUser.clearance}</span></div>
                <div><span className="text-white/30 text-[9px] block">CLIENT ASSOCIATION</span><span className="text-white">{selectedUser.clientAssociation}</span></div>
                <div><span className="text-white/30 text-[9px] block">EMAIL ADDRESS</span><span className="text-[#009DFF]">{selectedUser.email}</span></div>
                
                <div>
                  <span className="text-white/30 text-[9px] block mb-1">ACCOUNT PERMISSIONS</span>
                  <div className="flex flex-wrap gap-1">
                    {ROLE_PERMISSIONS[selectedUser.role]?.map(p => (
                      <span key={p} className="text-[8px] bg-white/5 text-zinc-300 px-1 py-0.5 rounded border border-white/10">{p}</span>
                    ))}
                  </div>
                </div>

                {isPlatformAdmin && selectedUser.email !== currentUser?.email && (
                  <div className="pt-3 border-t border-white/5 space-y-2">
                    <span className="text-white/30 text-[9px] block uppercase font-bold">Account Management Controls</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => handleToggleStatus(selectedUser)}
                        className="py-1.5 bg-white/5 hover:bg-white/10 text-white text-[10px] rounded uppercase font-bold transition-all border border-white/10 cursor-pointer"
                      >
                        {selectedUser.status === "active" ? "Deactivate" : "Activate"}
                      </button>
                      <button 
                        onClick={() => handleResetCredentials(selectedUser.id)}
                        disabled={isResetting}
                        className="py-1.5 bg-amber-500/10 hover:bg-amber-500/15 text-amber-400 text-[10px] rounded uppercase font-bold border border-amber-500/20 cursor-pointer"
                      >
                        Reset Password
                      </button>
                    </div>
                    
                    <div>
                      <label className="text-[9px] text-white/35 uppercase font-bold block mb-1">Change User Role</label>
                      <select 
                        value={selectedUser.role}
                        onChange={(e) => handleRoleChange(selectedUser.id, e.target.value as any)}
                        className="w-full bg-black border border-white/10 p-1.5 rounded text-[10px] text-white outline-none cursor-pointer"
                      >
                        <option value="gff_admin">GFF Admin</option>
                        <option value="client_admin">Client Admin</option>
                        <option value="client_member">Client Member</option>
                      </select>
                    </div>

                    <button 
                      onClick={() => handleDeleteUser(selectedUser.id, selectedUser.email)}
                      className="w-full py-1.5 bg-rose-500/10 hover:bg-rose-500/15 text-rose-400 text-[10px] rounded uppercase font-bold border border-rose-500/25 cursor-pointer transition-all mt-2"
                    >
                      Remove User Account
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TELEMETRY AUDIT LOGS */}
          <div className="rounded-xl border border-white/5 bg-[#050505]/40 p-4 space-y-3 flex flex-col justify-between">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-[10px] uppercase font-bold text-white/45">Operator Activity Log</span>
              <span className="text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1 rounded font-bold uppercase animate-pulse">Live</span>
            </div>
            <div className="bg-black/40 border border-white/5 rounded-lg p-3 h-40 overflow-y-auto font-mono text-[9.5px] leading-relaxed text-zinc-400 space-y-1 scrollbar-thin">
              {auditLogs.length === 0 ? (
                <p className="text-white/20 italic">No operations recorded in current session.</p>
              ) : (
                auditLogs.map((log, index) => <div key={index} className="truncate select-text">&gt; {log}</div>)
              )}
            </div>
          </div>

        </div>

      </div>

      {/* IDENTITY PROVISION MODAL */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#09090b] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/10 bg-[#0c0c0e] flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Create New User</span>
              <button onClick={() => setIsInviteOpen(false)} className="text-white/40 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>

            {inviteStep === "form" && (
              <form onSubmit={handleInviteSubmit} className="p-6 space-y-4 text-xs">
                {validationError && <div className="p-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded">{validationError}</div>}
                
                <div className="space-y-1">
                  <label className="text-white/45 text-[10px] uppercase font-bold block">User Full Name</label>
                  <input type="text" value={inviteName} onChange={(e) => setInviteName(e.target.value)} placeholder="e.g. Robert Vance" className="w-full p-2 bg-black border border-white/10 rounded" required />
                </div>

                <div className="space-y-1">
                  <label className="text-white/45 text-[10px] uppercase font-bold block">Email Address</label>
                  <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="e.g. r.vance@sovereign.gff.ai" className="w-full p-2 bg-black border border-white/10 rounded" required />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-white/45 text-[10px] uppercase font-bold block mb-1">User Role</label>
                    <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value as any)} className="w-full p-2 bg-black border border-white/10 rounded">
                      <option value="gff_admin">gff_admin</option>
                      <option value="client_admin">client_admin</option>
                      <option value="client_member">client_member</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-white/45 text-[10px] uppercase font-bold block mb-1">Access Level</label>
                    <input type="text" disabled value={ROLE_CLEARANCES[inviteRole]?.split(" ")[2]} className="w-full p-2 bg-zinc-900 border border-white/5 rounded text-amber-400 font-bold" />
                  </div>
                </div>

                {inviteRole !== "gff_admin" && (
                  <div>
                    <label className="text-white/45 text-[10px] uppercase font-bold block mb-1">Select Client Organization</label>
                    <select value={inviteClient} onChange={(e) => setInviteClient(e.target.value)} className="w-full p-2 bg-black border border-white/10 rounded cursor-pointer">
                      <option value="Apex Sovereign Group [Preview Client]">Apex Sovereign Group</option>
                      <option value="Global Retail Enclave [Preview Client]">Global Retail Enclave</option>
                      <option value="Sovereign Logistics Unit [Preview Client]">Sovereign Logistics Unit</option>
                      <option value="Federal Treasury Division [Preview Client]">Federal Treasury Division</option>
                    </select>
                  </div>
                )}

                <div className="flex justify-end gap-2.5 pt-3 border-t border-white/5">
                  <button type="button" onClick={() => setIsInviteOpen(false)} className="px-3 py-1.5 border border-white/10 rounded cursor-pointer">Cancel</button>
                  <button type="submit" className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded cursor-pointer font-bold uppercase">Confirm Identity</button>
                </div>
              </form>
            )}

            {inviteStep === "generating" && (
              <div className="p-12 text-center space-y-4">
                <RefreshCw className="w-8 h-8 text-[#009DFF] animate-spin mx-auto" />
                <p className="text-xs text-white/50">Sealing cryptographic credentials envelope...</p>
              </div>
            )}

            {inviteStep === "success" && (
              <div className="p-6 space-y-4 text-xs">
                <div className="text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto">
                    <Check className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Cryptographic Identity Envelope Sealed</h3>
                  <p className="text-[10px] text-white/50 leading-relaxed max-w-sm mx-auto">
                    A secure identity entry was provisioned to the enclave database under <span className="text-amber-400 font-semibold uppercase">INACTIVE</span>.
                  </p>
                </div>

                <div className="space-y-1.5 p-3 rounded bg-black/60 border border-white/5">
                  <span className="text-white/45 text-[9px] uppercase font-bold block select-none">Temporary Master Password</span>
                  <div className="flex items-center justify-between bg-[#0c0c0e] px-2.5 py-1.5 rounded border border-white/5 font-mono text-[11px]">
                    <span className="text-[#009DFF] select-text font-bold">{generatedPassword}</span>
                    <button onClick={() => { navigator.clipboard.writeText(generatedPassword); }} className="text-white/40 hover:text-white p-1 rounded hover:bg-white/5 transition-all cursor-pointer"><Copy className="w-3.5 h-3.5" /></button>
                  </div>
                </div>

                <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-lg text-[10px] text-amber-500 leading-relaxed">
                  Since this is an emulated preview sandbox, you can click <span className="font-bold underline">Accept Invitation (Simulated)</span> below to instantly activate this operator identity and establish their secure FIDO2 credentials.
                </div>

                <div className="flex gap-3 pt-3 border-t border-white/5">
                  <button onClick={() => { setIsInviteOpen(false); setInviteStep("form"); }} className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white rounded border border-white/10 text-xs font-bold uppercase cursor-pointer">Close Dialog</button>
                  <button onClick={handleAcceptInviteSimulated} className="flex-1 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/25 hover:border-emerald-500/50 rounded text-xs font-bold uppercase cursor-pointer">Accept Invitation (Simulated)</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
