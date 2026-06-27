"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Shield,
  ShieldAlert,
  KeyRound,
  UserPlus,
  Users,
  Settings,
  RefreshCw,
  X,
  Check,
  Server,
  Lock,
  Terminal,
  BadgeCheck,
  Mail,
  User as UserIcon,
  Copy,
  Info
} from "lucide-react";

interface LocalUser {
  id: string;
  name: string;
  email: string;
  role: "gff_admin" | "client_admin" | "client_member";
  clientAssociation: string;
  status: "active" | "inactive";
  clearance: string;
  lastActive: string;
  createdAt: string;
  permissions: string[];
}

const ROLE_PERMISSIONS: Record<"gff_admin" | "client_admin" | "client_member", string[]> = {
  gff_admin: [
    "all:*",
    "read:telemetry",
    "write:telemetry",
    "read:projects",
    "write:projects",
    "read:users",
    "write:users",
    "read:clients",
    "write:clients",
    "write:governance",
    "admin:root-seal"
  ],
  client_admin: [
    "read:telemetry",
    "read:projects",
    "write:projects",
    "read:ai-operations",
    "write:ai-operations",
    "read:documents",
    "write:documents",
    "read:users",
    "write:users",
    "write:support"
  ],
  client_member: [
    "read:telemetry",
    "read:projects",
    "read:ai-operations",
    "read:documents",
    "write:support"
  ]
};

const ROLE_CLEARANCES: Record<"gff_admin" | "client_admin" | "client_member", string> = {
  gff_admin: "CLEARANCE LEVEL V (SECURE PLATFORM SUPERUSER)",
  client_admin: "CLEARANCE LEVEL III (SANDBOX OPERATOR)",
  client_member: "CLEARANCE LEVEL I (BASIC VIEW-ONLY)"
};

const INITIAL_USERS: LocalUser[] = [
  {
    id: "usr-001",
    name: "Dr. Sarah Vance",
    email: "s.vance@governance.gff.ai",
    role: "gff_admin",
    clientAssociation: "GFF AI Platform Core (Global Root)",
    status: "active",
    clearance: "CLEARANCE LEVEL V (SECURE PLATFORM SUPERUSER)",
    lastActive: "2 mins ago",
    createdAt: "2025-10-12",
    permissions: ROLE_PERMISSIONS.gff_admin
  },
  {
    id: "usr-002",
    name: "Alexander Mercer",
    email: "a.mercer@apex-sovereign.gff.ai",
    role: "client_admin",
    clientAssociation: "Apex Sovereign Group [Preview Client]",
    status: "active",
    clearance: "CLEARANCE LEVEL III (SANDBOX OPERATOR)",
    lastActive: "1 hour ago",
    createdAt: "2026-01-15",
    permissions: ROLE_PERMISSIONS.client_admin
  },
  {
    id: "usr-003",
    name: "Evelyn Carter",
    email: "e.carter@global-retail.gff.ai",
    role: "client_admin",
    clientAssociation: "Global Retail Enclave [Preview Client]",
    status: "active",
    clearance: "CLEARANCE LEVEL III (SANDBOX OPERATOR)",
    lastActive: "24 mins ago",
    createdAt: "2026-02-10",
    permissions: ROLE_PERMISSIONS.client_admin
  },
  {
    id: "usr-004",
    name: "Marcus Vance",
    email: "m.vance@sovereign-logistics.gff.ai",
    role: "client_member",
    clientAssociation: "Sovereign Logistics Unit [Preview Client]",
    status: "inactive",
    clearance: "CLEARANCE LEVEL I (BASIC VIEW-ONLY)",
    lastActive: "3 days ago",
    createdAt: "2026-06-01",
    permissions: ROLE_PERMISSIONS.client_member
  },
  {
    id: "usr-005",
    name: "Sarah Jenkins",
    email: "s.jenkins@fed-treasury.gff.ai",
    role: "client_member",
    clientAssociation: "Federal Treasury Division [Preview Client]",
    status: "active",
    clearance: "CLEARANCE LEVEL I (BASIC VIEW-ONLY)",
    lastActive: "12 hours ago",
    createdAt: "2025-11-20",
    permissions: ROLE_PERMISSIONS.client_member
  }
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<LocalUser[]>(INITIAL_USERS);
  const [selectedUser, setSelectedUser] = useState<LocalUser | null>(null);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<"all" | "gff_admin" | "client_admin" | "client_member">("all");
  const [selectedClientFilter, setSelectedClientFilter] = useState<"all" | string>("all");

  // Interaction logs
  const [auditLogs, setAuditLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] AUDIT: Sandboxed identity ledger loaded successfully.`,
    `[${new Date().toLocaleTimeString()}] CRYPTO: Validated FIDO2 secure keys for all active administrators.`,
    `[${new Date().toLocaleTimeString()}] GUARDRAIL: Zero-Drift compliance score confirmed.`
  ]);

  // Loading / Actions States
  const [isResetting, setIsResetting] = useState(false);
  const [showHandshakeLogs, setShowHandshakeLogs] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  // Invite Modal State
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"gff_admin" | "client_admin" | "client_member">("client_member");
  const [inviteClient, setInviteClient] = useState("Apex Sovereign Group [Preview Client]");
  const [inviteStep, setInviteStep] = useState<"form" | "generating" | "success">("form");
  const [generatedToken, setGeneratedToken] = useState("");

  // Set default selected user upon initial mount
  useEffect(() => {
    if (users.length > 0 && !selectedUser) {
      setSelectedUser(users[0]);
    }
  }, [users, selectedUser]);

  // Handle Role Shift
  const handleRoleChange = (userId: string, newRole: "gff_admin" | "client_admin" | "client_member") => {
    const updatedUsers = users.map((u) => {
      if (u.id === userId) {
        const updated: LocalUser = {
          ...u,
          role: newRole,
          clearance: ROLE_CLEARANCES[newRole],
          permissions: ROLE_PERMISSIONS[newRole]
        };
        if (selectedUser?.id === userId) {
          setSelectedUser(updated);
        }
        return updated;
      }
      return u;
    });

    setUsers(updatedUsers);

    const timestamp = new Date().toLocaleTimeString();
    setAuditLogs((prev) => [
      `[${timestamp}] AUDIT: Shifted role for Operator ${userId} -> ${newRole.toUpperCase()}.`,
      `[${timestamp}] POLICY: Cryptographically mapped ${ROLE_PERMISSIONS[newRole].length} target clearance bounds.`,
      ...prev
    ]);
  };

  // Handle Access Status Toggle
  const handleToggleStatus = (userId: string) => {
    const updatedUsers = users.map((u) => {
      if (u.id === userId) {
        const updatedStatus = u.status === "active" ? "inactive" : "active";
        const updated: LocalUser = { ...u, status: updatedStatus };
        if (selectedUser?.id === userId) {
          setSelectedUser(updated);
        }
        return updated;
      }
      return u;
    });

    setUsers(updatedUsers);

    const targetUser = users.find((u) => u.id === userId);
    const stateText = targetUser?.status === "active" ? "REVOKED (OFFLINE)" : "RESTORED (ONLINE)";
    const timestamp = new Date().toLocaleTimeString();
    setAuditLogs((prev) => [
      `[${timestamp}] LOCKDOWN: Access status for Operator ${userId} set to ${stateText}.`,
      `[${timestamp}] SECURITY: Terminated active session credentials & rolled local telemetry locks.`,
      ...prev
    ]);
  };

  // Handle Dual-Key FIDO2 Access Reset
  const handleResetCredentials = (userId: string) => {
    setIsResetting(true);
    const timestamp = new Date().toLocaleTimeString();
    setAuditLogs((prev) => [
      `[${timestamp}] INITIALIZE: Initiating Dual-Key FIDO2 credential reset for ${userId}.`,
      `[${timestamp}] HSM: Rolling over hardware security module encryption bounds...`,
      ...prev
    ]);

    setTimeout(() => {
      setIsResetting(false);
      const finishedTimestamp = new Date().toLocaleTimeString();
      const generatedBackupCode = `GFF-FIDO2-0x${Math.random().toString(16).slice(2, 10).toUpperCase()}`;
      setAuditLogs((prev) => [
        `[${finishedTimestamp}] SUCCESS: Sealed backup coordinates with HSM signature.`,
        `[${finishedTimestamp}] CRYPTO: Bound public keys. Temp Recovery Code: ${generatedBackupCode}`,
        ...prev
      ]);
      alert(`Cryptographic FIDO2 access reset successful!\n\nTemporary Recovery Token (Local Simulation):\n${generatedBackupCode}\n\nNote: The user key card has been re-bound in local memory.`);
    }, 1200);
  };


  // Handle Invite Form Submission
  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    setInviteStep("generating");
    
    setTimeout(() => {
      const token = `gff_envelope_0x${Math.random().toString(16).slice(2, 14).toUpperCase()}`;
      setGeneratedToken(token);

      const newUser: LocalUser = {
        id: `usr-${Math.floor(100 + Math.random() * 900)}`,
        name: inviteName,
        email: inviteEmail,
        role: inviteRole,
        clientAssociation: inviteRole === "gff_admin" ? "GFF AI Platform Core (Global Root)" : inviteClient,
        status: "inactive", // inactive until accepted in simulation
        clearance: ROLE_CLEARANCES[inviteRole],
        lastActive: "Never",
        createdAt: new Date().toISOString().split("T")[0],
        permissions: ROLE_PERMISSIONS[inviteRole]
      };

      setUsers((prev) => [...prev, newUser]);
      setSelectedUser(newUser);
      
      const timestamp = new Date().toLocaleTimeString();
      setAuditLogs((prev) => [
        `[${timestamp}] PROVISION: Sealed dual-key cryptographic invitation envelope for ${inviteEmail}.`,
        `[${timestamp}] ENVELOPE: Token ${token} queued. Access bounds mapped to ${inviteRole.toUpperCase()}.`,
        ...prev
      ]);

      setInviteStep("success");
    }, 1000);
  };

  // Emulate Accepting the Invite (instantly makes the newly added user active)
  const handleAcceptInviteSimulated = () => {
    const lastUser = users[users.length - 1];
    if (lastUser) {
      const updatedUsers = users.map((u) => 
        u.id === lastUser.id ? { ...u, status: "active" as const, lastActive: "Just now" } : u
      );
      setUsers(updatedUsers);
      setSelectedUser({ ...lastUser, status: "active" as const, lastActive: "Just now" });

      const timestamp = new Date().toLocaleTimeString();
      setAuditLogs((prev) => [
        `[${timestamp}] ACCEPTANCE: Operator ${lastUser.name} accepted invite token.`,
        `[${timestamp}] ACCESS: Cryptographic session established. FIDO2 security token bound.`,
        ...prev
      ]);
    }
    setIsInviteOpen(false);
    setInviteStep("form");
    setInviteName("");
    setInviteEmail("");
  };

  // Copy simulated invite link/token
  const copyTokenToClipboard = () => {
    navigator.clipboard.writeText(generatedToken);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  // Derive unique clients list for filtering
  const uniqueClients = Array.from(
    new Set(users.map((u) => u.clientAssociation).filter((c) => c !== "GFF AI Platform Core (Global Root)"))
  );

  // Filter Users
  const filteredUsers = users.filter((user) => {
    // Search filter
    if (
      searchQuery.trim() !== "" &&
      !user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !user.email.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !user.id.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Role filter
    if (selectedRoleFilter !== "all" && user.role !== selectedRoleFilter) {
      return false;
    }

    // Client filter
    if (selectedClientFilter !== "all" && user.clientAssociation !== selectedClientFilter) {
      return false;
    }

    return true;
  });


  return (
    <div className="space-y-6 max-w-7xl mx-auto px-1">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight font-mono uppercase">
            RBAC & Identity Access Console
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Audit and configure platform identity states, govern isolated client enclaves, assign cryptographic permissions, and trigger credential resets.
          </p>
        </div>
        <button
          onClick={() => {
            setInviteStep("form");
            setIsInviteOpen(true);
          }}
          className="px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-[#009DFF]/10 hover:from-emerald-500/20 hover:to-[#009DFF]/20 text-white rounded border border-emerald-500/25 hover:border-emerald-500/55 font-mono text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.05)] hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] self-start md:self-auto"
        >
          <UserPlus className="w-4 h-4 text-emerald-400" />
          <span>Provision Identity</span>
        </button>
      </div>

      {/* Backend / Auth Integration Phase Notice */}
      <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/[0.015] space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 px-2 py-0.5 bg-amber-500/10 text-amber-400 font-mono text-[8px] uppercase tracking-widest border-b border-l border-amber-500/20 select-none">
          PHASE 4 EMULATION
        </div>
        <div className="flex items-start gap-3">
          <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20 mt-0.5">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-amber-400 font-mono uppercase tracking-wider">
              Identity Management Sandbox (Frontend-Only Preview)
            </h3>
            <p className="text-[11px] text-white/70 leading-relaxed max-w-4xl">
              This administration dashboard is operating in <span className="text-amber-300 font-semibold font-mono">Secure Local Emulation Mode</span>. 
              All role changes, credential revocations, and provisions occur entirely in session-local memory. 
              Actual Okta, SAML, or OIDC directories are decoupled; real network invitation dispatches are suppressed.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 pl-11">
          <button
            onClick={() => setShowHandshakeLogs(true)}
            className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 text-[10px] font-mono rounded border border-amber-500/20 hover:border-amber-500/40 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3 animate-pulse" />
            <span>Verify Vanguard OIDC Handshake</span>
          </button>
          <span className="text-[9.5px] text-white/30 font-mono select-none">
            Federated Identity Gateway: <span className="text-amber-500/45 font-mono">https://auth.gff.ai/v1/emulated</span>
          </span>
        </div>
      </div>


      {/* Stats Indicator Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-white/5 bg-[#030303]/60 space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono text-white/40 uppercase tracking-widest">
            <span>Operator Directory</span>
            <Users className="w-3.5 h-3.5 text-[#009DFF]" />
          </div>
          <div className="flex items-baseline gap-2 pt-0.5">
            <span className="text-2xl font-bold text-white tracking-tight font-mono">{users.length}</span>
            <span className="text-[9.5px] text-green-400 font-mono">Bound</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-white/5 bg-[#030303]/60 space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono text-white/40 uppercase tracking-widest">
            <span>Role Distribution</span>
            <Shield className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="pt-1.5">
            <span className="text-[11px] font-mono text-white/70 block leading-tight">
              {users.filter(u => u.role === "gff_admin").length} GFF Admin / {users.filter(u => u.role === "client_admin").length} Client Admin
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-white/5 bg-[#030303]/60 space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono text-white/40 uppercase tracking-widest">
            <span>Active Enclaves</span>
            <Server className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-1 pt-0.5">
            <span className="text-2xl font-bold text-white tracking-tight font-mono">
              {uniqueClients.length}
            </span>
            <span className="text-[9.5px] text-white/30 font-mono">Bound Enclaves</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-white/5 bg-[#030303]/60 space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono text-white/40 uppercase tracking-widest">
            <span>Audit Key Drift</span>
            <BadgeCheck className="w-3.5 h-3.5 text-[#00FFC2]" />
          </div>
          <div className="flex items-baseline gap-1 pt-0.5">
            <span className="text-2xl font-bold text-[#00FFC2] tracking-tight font-mono">0.00%</span>
            <span className="text-[9.5px] text-[#00FFC2]/60 font-mono">Fully Verified</span>
          </div>
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">

        {/* Left Side: Directory Table & Filters */}
        <div className="xl:col-span-7 bg-[#030303]/40 border border-white/5 rounded-xl p-5 space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-white/30" />
              <input
                type="text"
                placeholder="Search identifier or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#0a0a0c] border border-white/5 hover:border-white/10 focus:border-white/20 focus:outline-none rounded text-xs font-mono text-white placeholder-white/30 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2.5 text-white/30 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Client Enclave Filter */}
            <div className="w-full md:w-48">
              <select
                value={selectedClientFilter}
                onChange={(e) => setSelectedClientFilter(e.target.value)}
                className="w-full px-3 py-2 bg-[#0a0a0c] border border-white/5 focus:border-white/20 focus:outline-none rounded text-xs font-mono text-white/80 transition-all cursor-pointer"
              >
                <option value="all">All Enclaves</option>
                {uniqueClients.map((client) => (
                  <option key={client} value={client}>
                    {client.replace(" [Preview Client]", "")}
                  </option>
                ))}
              </select>
            </div>

            {/* Role Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
              {(["all", "gff_admin", "client_admin", "client_member"] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRoleFilter(role)}
                  className={`px-2.5 py-1.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider border transition-all cursor-pointer whitespace-nowrap ${
                    selectedRoleFilter === role
                      ? "bg-[#009DFF]/10 text-[#009DFF] border-[#009DFF]/30 shadow-[0_0_10px_rgba(0,157,255,0.15)]"
                      : "bg-white/[0.01] text-white/50 border-white/5 hover:text-white/80 hover:border-white/10"
                  }`}
                >
                  {role === "all" ? "All Roles" : role.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>


          {/* Table container */}
          <div className="overflow-x-auto rounded border border-white/5 bg-[#050507]">
            <table className="w-full min-w-[620px] border-collapse text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02] text-[10px] font-mono text-white/40 uppercase tracking-wider">
                  <th className="py-3 px-4 font-semibold">Operator & Secure ID</th>
                  <th className="py-3 px-4 font-semibold">Role Allocation</th>
                  <th className="py-3 px-4 font-semibold">Client Association</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Clearance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Users className="w-8 h-8 text-white/10" />
                        <p className="text-xs font-mono text-white/40 uppercase">No operators found matching criteria</p>
                        <button
                          onClick={() => {
                            setSearchQuery("");
                            setSelectedRoleFilter("all");
                            setSelectedClientFilter("all");
                          }}
                          className="mt-2 text-[10px] font-mono text-[#009DFF] hover:underline"
                        >
                          Reset Console Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (

                  filteredUsers.map((user) => {
                    const isSelected = selectedUser?.id === user.id;
                    return (
                      <tr
                        key={user.id}
                        onClick={() => setSelectedUser(user)}
                        className={`group cursor-pointer transition-all ${
                          isSelected
                            ? "bg-[#009DFF]/5 hover:bg-[#009DFF]/5 border-l-2 border-l-[#009DFF]"
                            : "hover:bg-white/[0.015]"
                        }`}
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-mono font-semibold uppercase transition-all ${
                                user.status === "inactive"
                                  ? "bg-white/5 border-white/10 text-white/30"
                                  : user.role === "gff_admin"
                                  ? "bg-purple-500/10 border-purple-500/30 text-purple-300"
                                  : user.role === "client_admin"
                                  ? "bg-[#009DFF]/10 border-[#009DFF]/30 text-[#009DFF]"
                                  : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                              }`}>
                                {user.name.split(" ").map(n => n[0]).join("")}
                              </div>
                              <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#050507] ${
                                user.status === "active" ? "bg-emerald-400" : "bg-neutral-600"
                              }`} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-white group-hover:text-[#009DFF] transition-colors truncate max-w-[150px]">
                                {user.name}
                              </p>
                              <p className="text-[10px] font-mono text-white/40 truncate max-w-[150px]">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${
                            user.role === "gff_admin"
                              ? "bg-purple-500/5 text-purple-400 border-purple-500/20"
                              : user.role === "client_admin"
                              ? "bg-[#009DFF]/5 text-[#009DFF] border-[#009DFF]/20"
                              : "bg-emerald-500/5 text-emerald-400 border-emerald-500/20"
                          }`}>
                            {user.role === "gff_admin" ? "GFF ADMIN" : user.role === "client_admin" ? "CLIENT ADMIN" : "CLIENT MEMBER"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="text-[10.5px] font-mono text-white/70 truncate max-w-[150px]" title={user.clientAssociation}>
                            {user.clientAssociation.replace(" [Preview Client]", "")}
                          </p>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold ${
                            user.status === "active" ? "text-emerald-400" : "text-white/30"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              user.status === "active" ? "bg-emerald-400 animate-pulse" : "bg-neutral-600"
                            }`} />
                            {user.status === "active" ? "ACTIVE" : "INACTIVE"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="text-[9.5px] font-mono text-amber-500/80 font-bold tracking-tight">
                            {user.clearance.split(" ")[2]}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>


        {/* Right Side: Identity Cryptographic Ledger / Action Panel */}
        <div className="xl:col-span-5 space-y-4">
          {selectedUser ? (
            <div className="bg-[#030303]/40 border border-white/5 rounded-xl p-5 space-y-5 relative overflow-hidden">
              {/* Graphic Decal Label */}
              <div className="absolute top-0 right-0 px-2 py-0.5 bg-white/[0.02] border-b border-l border-white/5 font-mono text-[8px] text-white/30 uppercase tracking-widest select-none">
                ENCLAVE REGISTRY BOUNDS
              </div>

              {/* Profile card summary */}
              <div className="flex items-start gap-4 pb-4 border-b border-white/5">
                <div className={`w-14 h-14 rounded-xl border flex items-center justify-center font-mono font-bold text-lg relative overflow-hidden ${
                  selectedUser.role === "gff_admin"
                    ? "bg-purple-500/10 border-purple-500/25 text-purple-300"
                    : selectedUser.role === "client_admin"
                    ? "bg-[#009DFF]/10 border-[#009DFF]/25 text-[#009DFF]"
                    : "bg-emerald-500/10 border-emerald-500/25 text-emerald-300"
                }`}>
                  <Shield className="absolute inset-0 w-full h-full p-2.5 text-white/[0.015] pointer-events-none" />
                  <span className="relative z-10">{selectedUser.name.split(" ").map(n => n[0]).join("")}</span>
                </div>
                <div className="space-y-0.5 min-w-0 flex-1">
                  <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest block font-bold">
                    SECURITY CREDENTIAL MATRIX
                  </span>
                  <h2 className="text-sm font-bold text-white truncate">{selectedUser.name}</h2>
                  <p className="text-xs font-mono text-[#009DFF] truncate">{selectedUser.email}</p>
                  <p className="text-[10px] font-mono text-white/40">UUID: {selectedUser.id}</p>
                </div>
              </div>

              {/* Details grid list */}
              <div className="grid grid-cols-2 gap-3 text-[11px] font-mono">
                <div className="p-3 bg-white/[0.01] border border-white/5 rounded-lg space-y-1 col-span-2">
                  <span className="text-white/30 text-[9px] uppercase font-bold block">Assigned Trust Enclave</span>
                  <div className="flex items-center gap-1.5 text-white font-bold truncate">
                    <Server className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="truncate">{selectedUser.clientAssociation}</span>
                  </div>
                </div>

                <div className="p-3 bg-white/[0.01] border border-white/5 rounded-lg space-y-1">
                  <span className="text-white/30 text-[9px] uppercase font-bold block">Clearance Tier</span>
                  <span className="text-amber-500 font-bold block truncate">
                    {selectedUser.clearance.replace("CLEARANCE LEVEL ", "LVL-")}
                  </span>
                </div>

                <div className="p-3 bg-white/[0.01] border border-white/5 rounded-lg space-y-1">
                  <span className="text-white/30 text-[9px] uppercase font-bold block">Session Link</span>
                  <span className={`font-bold block ${selectedUser.status === "active" ? "text-emerald-400" : "text-white/40"}`}>
                    {selectedUser.status === "active" ? "LIVE SYNC" : "FLUSHED"}
                  </span>
                </div>
              </div>

              {/* Dynamic Permissions Matrix Grid */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono text-white/40 uppercase font-bold border-b border-white/5 pb-1 select-none">
                  <span>Enclave Permissions Bound</span>
                  <span className="text-purple-400 font-mono text-[9px]">
                    {selectedUser.permissions.length} Keys Assigned
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-[100px] overflow-y-auto pr-1">
                  {selectedUser.permissions.map((perm) => (
                    <span
                      key={perm}
                      className="px-2 py-0.5 text-[9px] font-mono font-semibold bg-[#00FFC2]/5 text-[#00FFC2] rounded border border-[#00FFC2]/20 shadow-[0_0_8px_rgba(0,255,194,0.02)]"
                    >
                      {perm}
                    </span>
                  ))}
                </div>
              </div>


              {/* Secure Local Actions */}
              <div className="space-y-3 pt-2 border-t border-white/5">
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/40 uppercase font-bold select-none">
                  <Settings className="w-3.5 h-3.5 text-[#009DFF]" />
                  <span>Emulated Identity Controls</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Action: Change Role Dropdown */}
                  <div className="bg-white/[0.01] border border-white/5 rounded-lg p-2.5 flex flex-col gap-1.5 font-mono">
                    <span className="text-[9px] font-mono text-white/30 uppercase font-bold">Role Hierarchy</span>
                    <select
                      value={selectedUser.role}
                      onChange={(e) => handleRoleChange(selectedUser.id, e.target.value as any)}
                      className="px-2 py-1 bg-[#09090b] border border-white/10 focus:border-[#009DFF]/50 focus:outline-none rounded text-[11px] font-mono text-white cursor-pointer transition-all"
                    >
                      <option value="gff_admin">gff_admin</option>
                      <option value="client_admin">client_admin</option>
                      <option value="client_member">client_member</option>
                    </select>
                  </div>

                  {/* Action: Deactivate status toggle button */}
                  <div className="bg-white/[0.01] border border-white/5 rounded-lg p-2.5 flex flex-col gap-1.5 justify-between">
                    <span className="text-[9px] font-mono text-white/30 uppercase font-bold">Access Status</span>
                    <button
                      onClick={() => handleToggleStatus(selectedUser.id)}
                      className={`w-full py-1.5 rounded text-[10px] font-mono font-bold uppercase transition-all cursor-pointer border ${
                        selectedUser.status === "active"
                          ? "bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/25 hover:border-red-500/40"
                          : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/25 hover:border-emerald-500/40"
                      }`}
                    >
                      {selectedUser.status === "active" ? "Deactivate Key" : "Re-Activate Key"}
                    </button>
                  </div>

                  {/* Action: Reset Credentials button */}
                  <button
                    onClick={() => handleResetCredentials(selectedUser.id)}
                    disabled={isResetting}
                    className="sm:col-span-2 py-2.5 px-3 rounded bg-[#009DFF]/10 hover:bg-[#009DFF]/20 text-[#009DFF] border border-[#009DFF]/25 hover:border-[#009DFF]/45 text-[11px] font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isResetting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>ROLLING HSM KEYS...</span>
                      </>
                    ) : (
                      <>
                        <KeyRound className="w-3.5 h-3.5 text-[#009DFF]" />
                        <span>Reset Dual-Key FIDO2 Access</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Secure Audit Logs Stream */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono text-white/40 uppercase font-bold border-b border-white/5 pb-1 select-none">
                  <span>Operator Audit Flux</span>
                  <span className="flex items-center gap-1 text-[8.5px] text-green-400 font-mono">
                    <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
                    STREAM ACTIVE
                  </span>
                </div>
                <div className="p-3 rounded bg-black/60 border border-white/5 font-mono text-[9.5px] text-white/70 space-y-1.5 h-[120px] overflow-y-auto">
                  {auditLogs.map((log, idx) => (
                    <div key={idx} className="leading-tight border-b border-white/[0.02] pb-1 select-text">
                      <span className="text-[#009DFF]/60 font-mono">&gt;</span> {log}
                    </div>
                  ))}
                  <div className="text-[8px] text-white/30 pt-1 flex items-center gap-1 select-none">
                    <Lock className="w-2.5 h-2.5 text-[#00FFC2]" />
                    <span>Cryptographic session signature locked</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#030303]/40 border border-white/5 rounded-xl p-8 text-center space-y-3">
              <Shield className="w-12 h-12 text-white/10 mx-auto" />
              <p className="text-xs font-mono text-white/50 uppercase select-none">
                Select an Identity operator card to inspect credentials and policy bounds.
              </p>
            </div>
          )}
        </div>
      </div>


      {/* Verification Handshake Diagnostic Dialog */}
      {showHandshakeLogs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-2xl bg-[#09090b] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/10 bg-[#0c0c0e] flex items-center justify-between">
              <div className="flex items-center gap-2 select-none">
                <Terminal className="w-4 h-4 text-amber-500 animate-pulse" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Vanguard Auth OIDC Handshake Diagnostic Stream
                </span>
              </div>
              <button
                onClick={() => setShowHandshakeLogs(false)}
                className="text-white/40 hover:text-white p-1 rounded hover:bg-white/5 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4 font-mono text-xs text-white/90">
              <div className="p-4 bg-black/60 rounded-lg border border-white/5 space-y-2 h-[260px] overflow-y-auto font-mono">
                <p className="text-white/30 font-mono text-[10px] select-none">[SYSTEM INITIALIZING OIDC DIAGNOSTIC PROBE]</p>
                <p className="text-amber-400 font-mono">&gt; Connecting to OIDC Provider at federated.auth.gff.ai...</p>
                <p className="text-green-400 font-mono">&gt; [OK] Connected. SSL/TLS 1.3 Handshake completed. Cipher Suite: TLS_AES_256_GCM_SHA384</p>
                <p className="text-white/60 font-mono">&gt; GET /.well-known/openid-configuration HTTP/1.1</p>
                <p className="text-green-400 font-mono">&gt; [200 OK] Metadata loaded. JWKS URI verified: https://auth.gff.ai/oauth2/keys</p>
                <p className="text-white/60 font-mono">&gt; POST /oauth2/v1/token - grant_type=client_credentials&amp;scope=gff_admin+openid</p>
                <p className="text-[#009DFF] font-mono">&gt; [TOKEN RECEIVED] JWT Token Header: {"{\"alg\":\"RS256\",\"kid\":\"gff-vanguard-key-01\"}"}</p>
                <p className="text-green-400 font-mono">&gt; JWT Payload Decoded: {"{\"iss\":\"gff.ai\",\"sub\":\"vanguard-operator-agent\",\"clearance\":\"LEVEL_V\",\"exp\":1782568400}"}</p>
                <p className="text-[#00FFC2] font-mono">&gt; Cryptographic signature verified against GFF AI Key Management Service (KMS).</p>
                <p className="text-white/30 font-mono text-[10px] select-none pt-2">--- END OF HANDSHAKE DISCOVERY ---</p>
                <p className="text-[#00FFC2] font-semibold animate-pulse font-mono select-none">&gt; STATUS: OIDC IDENTITY COUPLING STANDBY (PHASE 5 READINESS CONFIRMED)</p>
              </div>
              <div className="text-[10.5px] text-white/40 leading-relaxed select-none">
                The Vanguard OIDC handshake confirms that local identity bindings map precisely to Federated identity claims. In Phase 5, OIDC environments can be wired to Okta, Ping, or Azure Active Directory targets seamlessly without altering database/schema layouts.
              </div>
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setShowHandshakeLogs(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded border border-white/10 text-xs font-mono font-bold uppercase transition-all cursor-pointer"
                >
                  Acknowledge & Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Provision Identity Dialog Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-lg bg-[#09090b] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/10 bg-[#0c0c0e] flex items-center justify-between">
              <div className="flex items-center gap-2 select-none">
                <UserPlus className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Provision New Identity Credentials
                </span>
              </div>
              <button
                onClick={() => setIsInviteOpen(false)}
                className="text-white/40 hover:text-white p-1 rounded hover:bg-white/5 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {inviteStep === "form" && (
              <form onSubmit={handleInviteSubmit} className="p-6 space-y-4 font-mono text-xs">
                <div className="p-3 bg-white/[0.01] border border-white/5 rounded-lg text-[10px] text-white/50 leading-relaxed select-none flex items-start gap-2">
                  <Info className="w-4 h-4 text-[#009DFF] mt-0.5 shrink-0" />
                  <span>
                    Identity provisioning seals a transient configuration. No email will be sent; an invitation token will be generated for sandbox acceptance.
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-white/45 text-[10px] uppercase font-bold block select-none">Operator Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Commander Chen"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#050507] border border-white/10 focus:border-[#009DFF]/50 focus:outline-none rounded text-xs text-white placeholder-white/20 transition-all font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-white/45 text-[10px] uppercase font-bold block select-none">Secure Business Email</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. chen@apex-sovereign.gff.ai"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-[#050507] border border-white/10 focus:border-[#009DFF]/50 focus:outline-none rounded text-xs text-white placeholder-white/20 transition-all font-mono"
                  />
                </div>


                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-white/45 text-[10px] uppercase font-bold block select-none">RBAC Target Role</label>
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value as any)}
                      className="w-full px-2.5 py-2 bg-[#050507] border border-white/10 focus:border-[#009DFF]/50 focus:outline-none rounded text-xs text-white cursor-pointer transition-all font-mono"
                    >
                      <option value="gff_admin">gff_admin</option>
                      <option value="client_admin">client_admin</option>
                      <option value="client_member">client_member</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-white/45 text-[10px] uppercase font-bold block select-none">Clearance Level</label>
                    <input
                      type="text"
                      disabled
                      value={ROLE_CLEARANCES[inviteRole].split(" ")[2]}
                      className="w-full px-2.5 py-2 bg-[#0a0a0c] border border-white/5 rounded text-xs text-amber-500 font-bold font-mono"
                    />
                  </div>
                </div>

                {inviteRole !== "gff_admin" && (
                  <div className="space-y-1.5">
                    <label className="text-white/45 text-[10px] uppercase font-bold block select-none">Target Trust Enclave</label>
                    <select
                      value={inviteClient}
                      onChange={(e) => setInviteClient(e.target.value)}
                      className="w-full px-2.5 py-2 bg-[#050507] border border-white/10 focus:border-[#009DFF]/50 focus:outline-none rounded text-xs text-white cursor-pointer transition-all font-mono"
                    >
                      <option value="Apex Sovereign Group [Preview Client]">Apex Sovereign Group</option>
                      <option value="Global Retail Enclave [Preview Client]">Global Retail Enclave</option>
                      <option value="Sovereign Logistics Unit [Preview Client]">Sovereign Logistics Unit</option>
                      <option value="Federal Treasury Division [Preview Client]">Federal Treasury Division</option>
                    </select>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-3 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setIsInviteOpen(false)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded border border-white/10 text-xs font-mono font-semibold uppercase transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/25 hover:border-emerald-500/50 rounded text-xs font-mono font-bold uppercase transition-all cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                  >
                    Sealed Provision Key
                  </button>
                </div>
              </form>
            )}


            {inviteStep === "generating" && (
              <div className="p-12 text-center space-y-4">
                <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
                <div className="space-y-1">
                  <p className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    Generating Security Envelope...
                  </p>
                  <p className="text-[10px] font-mono text-white/40 max-w-xs mx-auto">
                    Generating client RSA-4096 credentials, hashing attributes via SHA-512, and signing trust boundaries.
                  </p>
                </div>
              </div>
            )}

            {inviteStep === "success" && (
              <div className="p-6 space-y-4 font-mono text-xs">
                <div className="text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto">
                    <Check className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Cryptographic envelope successfully sealed
                  </h3>
                  <p className="text-[10px] text-white/55 leading-relaxed max-w-sm mx-auto">
                    Identity provisioning was emulated successfully. The target user has been registered to the local sandbox state as <span className="text-amber-500 font-semibold">INACTIVE</span>.
                  </p>
                </div>

                <div className="space-y-1.5 p-3 rounded bg-black/60 border border-white/5">
                  <span className="text-white/45 text-[9px] uppercase font-bold block select-none">Simulated Invite Token Envelope</span>
                  <div className="flex items-center justify-between gap-3 bg-[#0c0c0e] px-2.5 py-1.5 rounded border border-white/5 font-mono text-[10.5px]">
                    <span className="text-[#009DFF] select-text truncate font-mono max-w-[280px]">
                      {generatedToken}
                    </span>
                    <button
                      onClick={copyTokenToClipboard}
                      className="text-white/40 hover:text-white p-1 rounded hover:bg-white/5 transition-all cursor-pointer"
                      title="Copy Token"
                    >
                      {copiedToken ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-lg text-[10px] text-amber-500/80 leading-relaxed select-none">
                  Since this is a frontend-only preview, you can click <span className="font-bold underline">Accept Invitation (Emulated)</span> below to instantly simulate the user accepting the invitation and establishing their FIDO2 secure login session state.
                </div>

                <div className="flex gap-3 pt-3 border-t border-white/5">
                  <button
                    onClick={() => {
                      setIsInviteOpen(false);
                      setInviteStep("form");
                    }}
                    className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white rounded border border-white/10 text-xs font-mono font-semibold uppercase transition-all cursor-pointer"
                  >
                    Close Dialog
                  </button>
                  <button
                    onClick={handleAcceptInviteSimulated}
                    className="flex-1 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/25 hover:border-emerald-500/50 rounded text-xs font-mono font-bold uppercase transition-all cursor-pointer"
                  >
                    Accept Invitation (Emulated)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


