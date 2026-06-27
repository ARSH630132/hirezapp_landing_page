"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { 
  Search, Plus, X, Check, Clock, Radio, Shield, 
  MessageSquare, Send, User, Folder, FileText, 
  RotateCcw, UserCheck, AlertTriangle, Terminal, Info, Copy, CheckCircle
} from "lucide-react";
import { PrivatePageHeader } from "@/components/private-app";

interface Ticket {
  id: string;
  subject: string;
  client: string;
  priority: "P1" | "P2" | "P3";
  category: "Infrastructure" | "Enclave Security" | "Model Drift" | "Compliance Audit";
  status: "OPEN" | "INVESTIGATING" | "RESOLVED" | "HOLD";
  assignedAgent: string;
  linkedProjectId: string;
  linkedDocId: string;
  slaSeconds: number;
  description: string;
  createdDate: string;
  wireFeed: { id: string; sender: "client" | "agent" | "system"; senderName: string; text: string; timestamp: string }[];
}

const AVAILABLE_CLIENTS = [
  "Apex Sovereign Group [Preview Client]",
  "Global Retail Enclave [Preview Client]",
  "Sovereign Logistics Unit [Preview Client]",
  "Federal Treasury Division [Preview Client]",
  "National Health Enclave [Preview Client]"
];

const AVAILABLE_CATEGORIES = ["Infrastructure", "Enclave Security", "Model Drift", "Compliance Audit"];
const AVAILABLE_AGENTS = ["Dr. Sarah Vance", "Alexander Mercer", "Marcus Vance", "Evelyn Carter", "Unassigned"];

const MOCK_PROJECTS = [
  { id: "PROJ-201", name: "Apex Sovereign Multi-Agent Lattice", client: "Apex Sovereign Group [Preview Client]", enclaveType: "Intel SGX", phase: "Phase V: Production-Live", status: "On Track" },
  { id: "PROJ-202", name: "Global Retail Real-Time Audit Ring", client: "Global Retail Enclave [Preview Client]", enclaveType: "AMD SEV-SNP", phase: "Phase IV: User Acceptance Testing", status: "At Risk" },
  { id: "PROJ-203", name: "Sovereign Logistics AI Route Optimizer", client: "Sovereign Logistics Unit [Preview Client]", enclaveType: "AWS Nitro Enclave", phase: "Phase III: Agent Alignment", status: "Paused" }
];

const MOCK_DOCUMENTS = [
  { id: "DOC-801", title: "Sovereign Core Architectural Blueprint", fileSize: "12.4 MB", type: "PDF", sha256: "0xAB9811C82FFD201A99E8F3C721A0C5E89812A" },
  { id: "DOC-802", title: "ISO-27001 Compliance Statement", fileSize: "1.8 MB", type: "JSON", sha256: "0xDF1183C902ADFE33100BCCF29A8871" }
];

const getClientNameFromId = (clientId: string): string => {
  switch (clientId) {
    case "client-001": return "Apex Sovereign Group [Preview Client]";
    case "client-002": return "Global Retail Enclave [Preview Client]";
    case "client-003": return "Sovereign Logistics Unit [Preview Client]";
    case "client-004": return "Federal Treasury Division [Preview Client]";
    default: return "Apex Sovereign Group [Preview Client]";
  }
};

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [copiedTicketId, setCopiedTicketId] = useState<string | null>(null);
  const [drawerTab, setDrawerTab] = useState<"wire" | "assets" | "diagnostic">("wire");
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // New Support Ticket modal form
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newClient, setNewClient] = useState(AVAILABLE_CLIENTS[0]);
  const [newPriority, setNewPriority] = useState<"P1" | "P2" | "P3">("P2");
  const [newCategory, setNewCategory] = useState<Ticket["category"]>("Infrastructure");
  const [newAgent, setNewAgent] = useState("Unassigned");
  const [newProject, setNewProject] = useState("None");
  const [newDoc, setNewDoc] = useState("None");
  const [newSlaHours, setNewSlaHours] = useState("4");
  const [newDescription, setNewDescription] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [filterClient, setFilterClient] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [banner, setBanner] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTickets((prev) => 
        prev.map((t) => (t.status === "RESOLVED" || t.slaSeconds <= 0 ? t : { ...t, slaSeconds: t.slaSeconds - 1 }))
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [selectedTicketId, tickets, drawerTab]);

  const selectedTicket = useMemo(() => tickets.find((t) => t.id === selectedTicketId) || null, [tickets, selectedTicketId]);

  const formatSla = (sec: number, status: string) => {
    if (status === "RESOLVED") return "RESOLVED";
    if (sec <= 0) return "SLA VIOLATED";
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h.toString().padStart(2, "0")}h:${m.toString().padStart(2, "0")}s`;
  };

  const getPriorityBadgeStyles = (priority: "P1" | "P2" | "P3") => {
    switch (priority) {
      case "P1":
        return "text-red-400 border-red-500/20 bg-red-500/5";
      case "P2":
        return "text-amber-400 border-amber-500/20 bg-amber-500/5";
      case "P3":
        return "text-cyan-400 border-cyan-500/20 bg-cyan-500/5";
      default:
        return "text-white/40 border-white/10 bg-white/5";
    }
  };

  const getStatusStyles = (status: Ticket["status"]) => {
    switch (status) {
      case "RESOLVED":
        return {
          dotClass: "bg-emerald-500",
          textClass: "text-emerald-400",
          bgClass: "border-emerald-500/10 bg-emerald-500/5",
        };
      case "INVESTIGATING":
        return {
          dotClass: "bg-cyan-500 animate-pulse",
          textClass: "text-cyan-400",
          bgClass: "border-cyan-500/10 bg-cyan-500/5",
        };
      case "HOLD":
        return {
          dotClass: "bg-amber-500 animate-pulse",
          textClass: "text-amber-400",
          bgClass: "border-amber-500/10 bg-amber-500/5",
        };
      case "OPEN":
      default:
        return {
          dotClass: "bg-red-500 animate-pulse",
          textClass: "text-red-400",
          bgClass: "border-red-500/10 bg-red-500/5",
        };
    }
  };

  const renderSlaBadge = (t: Ticket) => {
    if (t.status === "RESOLVED") {
      return (
        <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/5 border border-emerald-500/15 px-2 py-0.5 rounded text-[9.5px] font-bold font-mono">
          <Check className="w-3 h-3 text-emerald-400" />
          <span>RESOLVED</span>
        </span>
      );
    }
    if (t.slaSeconds <= 0) {
      return (
        <span className="inline-flex items-center gap-1 text-red-400 bg-red-500/5 border border-red-500/15 px-2 py-0.5 rounded text-[9.5px] font-bold font-mono animate-pulse">
          <AlertTriangle className="w-3 h-3 text-red-400" />
          <span>SLA BREACH</span>
        </span>
      );
    }
    if (t.slaSeconds < 3600) {
      return (
        <span className="inline-flex items-center gap-1 text-amber-400 bg-amber-500/5 border border-amber-500/15 px-2 py-0.5 rounded text-[9.5px] font-bold font-mono animate-pulse">
          <Clock className="w-3 h-3 text-amber-400" />
          <span>{formatSla(t.slaSeconds, t.status)}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-cyan-400 bg-cyan-500/5 border border-cyan-500/15 px-2 py-0.5 rounded text-[9.5px] font-mono">
        <Clock className="w-3 h-3 text-cyan-400" />
        <span>{formatSla(t.slaSeconds, t.status)}</span>
      </span>
    );
  };

  const activeCount = useMemo(() => tickets.filter((t) => t.status !== "RESOLVED").length, [tickets]);
  const riskCount = useMemo(() => tickets.filter((t) => t.priority === "P1" && t.status !== "RESOLVED" && t.slaSeconds < 3600).length, [tickets]);
  const delegatedPercentage = useMemo(() => {
    const assigned = tickets.filter((t) => t.assignedAgent !== "Unassigned").length;
    return tickets.length ? Math.round((assigned / tickets.length) * 100) : 0;
  }, [tickets]);

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

      // Fetch tickets list with parameters
      let url = "/api/v1/support";
      const params = new URLSearchParams();
      if (filterClient) {
        let cid = "";
        if (filterClient.includes("Apex")) cid = "client-001";
        else if (filterClient.includes("Global") || filterClient.includes("Retail")) cid = "client-002";
        else if (filterClient.includes("Logistics")) cid = "client-003";
        else if (filterClient.includes("Treasury") || filterClient.includes("Federal")) cid = "client-004";
        if (cid) params.append("client_id", cid);
      }
      if (filterPriority) {
        params.append("priority", filterPriority);
      }
      if (filterCategory) {
        params.append("category", filterCategory);
      }
      if (filterStatus) {
        params.append("status", filterStatus);
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
        const mapped = data.tickets.map((t: any) => ({
          id: t.id,
          subject: t.subject || t.title || "No Subject",
          client: t.client_name || getClientNameFromId(t.client_id) || "Apex Sovereign Group [Preview Client]",
          priority: t.priority || "P2",
          category: t.category || "Infrastructure",
          status: t.status || "OPEN",
          assignedAgent: t.assignedAgent || t.assigned_to || "Unassigned",
          linkedProjectId: t.linkedProjectId || t.project_id || "None",
          linkedDocId: t.linkedDocId || "None",
          slaSeconds: typeof t.slaSeconds === "number" ? t.slaSeconds : 14400,
          description: t.description || t.desc || "No Description",
          createdDate: t.createdDate || new Date().toISOString(),
          wireFeed: t.wireFeed || []
        }));
        setTickets(mapped);
        
        // Auto-select first ticket if none selected
        if (mapped.length > 0 && !selectedTicketId) {
          setSelectedTicketId(mapped[0].id);
        }
      } else {
        throw new Error(data.message || "Failed to fetch support tickets.");
      }
    } catch (err: any) {
      setError(err.message || "Connection to support desk offline.");
    } finally {
      setLoading(false);
    }
  }, [filterClient, filterPriority, filterCategory, filterStatus, searchQuery, selectedTicketId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredTickets = useMemo(() => {
    return tickets;
  }, [tickets]);

  const handleCopyId = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedTicketId(id);
    setTimeout(() => setCopiedTicketId(null), 1500);
  };

  const handleUpdateStatus = async (id: string, status: Ticket["status"]) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("gff_ai_access_token") : null;
      if (!token) throw new Error("Unauthenticated");

      const res = await fetch(`/api/v1/support/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        triggerBanner(`Status updated to ${status}`);
        fetchData();
      } else {
        triggerBanner(`Failed to update status: ${data.message || "Error"}`);
      }
    } catch (err: any) {
      triggerBanner(`Failed: ${err.message}`);
    }
  };

  const handleAssignAgent = async (id: string, agent: string) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("gff_ai_access_token") : null;
      if (!token) throw new Error("Unauthenticated");

      const res = await fetch(`/api/v1/support/${id}/assign`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ assigned_to: agent })
      });
      const data = await res.json();
      if (data.success) {
        triggerBanner(`Assigned to ${agent}`);
        fetchData();
      } else {
        triggerBanner(`Failed to assign: ${data.message || "Error"}`);
      }
    } catch (err: any) {
      triggerBanner(`Failed: ${err.message}`);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedTicketId) return;

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("gff_ai_access_token") : null;
      if (!token) throw new Error("Unauthenticated");

      const res = await fetch(`/api/v1/support/${selectedTicketId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ text: chatInput.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setChatInput("");
        fetchData();
      } else {
        triggerBanner(`Failed to send message: ${data.message || "Error"}`);
      }
    } catch (err: any) {
      triggerBanner(`Failed: ${err.message}`);
    }
  };

  const triggerBanner = (msg: string) => {
    setBanner(msg);
    setTimeout(() => setBanner(null), 3000);
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newDescription.trim()) return;

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("gff_ai_access_token") : null;
      if (!token) throw new Error("Unauthenticated");

      let client_id = "client-001";
      if (newClient.includes("Apex")) client_id = "client-001";
      else if (newClient.includes("Global") || newClient.includes("Retail")) client_id = "client-002";
      else if (newClient.includes("Logistics")) client_id = "client-003";
      else if (newClient.includes("Treasury") || newClient.includes("Federal")) client_id = "client-004";

      const payload = {
        subject: newSubject.trim(),
        client_id,
        priority: newPriority,
        category: newCategory,
        assigned_to: newAgent,
        status: "OPEN",
        description: newDescription.trim(),
        linkedProjectId: newProject !== "None" ? newProject : undefined,
        linkedDocId: newDoc !== "None" ? newDoc : undefined,
        slaSeconds: (parseInt(newSlaHours) || 4) * 3600,
      };

      const res = await fetch("/api/v1/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        triggerBanner(`Support wire ${data.ticket.id} securely provisioned.`);
        setIsNewModalOpen(false);
        setNewSubject("");
        setNewDescription("");
        fetchData();
      } else {
        triggerBanner(`Failed to create: ${data.message || "Error"}`);
      }
    } catch (err: any) {
      triggerBanner(`Failed: ${err.message}`);
    }
  };

  const handleDeleteTicket = async (id: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete support wire ${id}?`)) {
      return;
    }
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("gff_ai_access_token") : null;
      if (!token) throw new Error("Unauthenticated");

      const res = await fetch(`/api/v1/support/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        triggerBanner(`Support wire ${id} permanently deleted.`);
        setSelectedTicketId(null);
        fetchData();
      } else {
        triggerBanner(`Failed to delete support wire: ${data.message || "Error"}`);
      }
    } catch (err: any) {
      triggerBanner(`Failed: ${err.message}`);
    }
  };

  const connectedProject = useMemo(() => selectedTicket && MOCK_PROJECTS.find((p) => p.id === selectedTicket.linkedProjectId), [selectedTicket]);
  const connectedDoc = useMemo(() => selectedTicket && MOCK_DOCUMENTS.find((d) => d.id === selectedTicket.linkedDocId), [selectedTicket]);

  return (
    <div className="space-y-6 relative min-h-screen text-white pb-10">
      {banner && (
        <div className="fixed top-20 right-6 z-50 max-w-sm bg-black border border-emerald-500/30 text-[11px] font-mono p-3 rounded-lg shadow-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{banner}</span>
        </div>
      )}

      <PrivatePageHeader 
        title="Enterprise Priority Support Wires" 
        desc="Admin Operations Workspace. Monitor secure communications, triage hardware isolated sandboxes, and override SLA controls."
        badgeLabel="SECURE SLA MONITOR"
        actions={
          <>
            <button onClick={() => { setSearchQuery(""); setFilterClient(""); setFilterPriority(""); setFilterCategory(""); setFilterStatus(""); }} className="h-9 px-4 rounded border border-white/5 bg-white/[0.01] text-[10px] font-mono hover:bg-white/[0.03] transition-all cursor-pointer flex items-center gap-1">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button onClick={() => setIsNewModalOpen(true)} className="h-9 px-4 rounded bg-[#009DFF] hover:bg-[#0082d4] text-[10px] font-mono font-bold uppercase tracking-wider text-white flex items-center gap-1 transition-all cursor-pointer shadow-[0_0_20px_rgba(0,157,255,0.2)]">
              <Plus className="w-3.5 h-3.5" />
              <span>Provision Secure Wire</span>
            </button>
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="rounded-xl border border-white/5 bg-[#050505]/40 p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-widest text-white/35 uppercase">Active Secure Channels</span>
            <div className="text-xl font-bold font-mono text-white flex items-center gap-2">
              <span>{activeCount} Wires</span>
              {activeCount > 0 && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />}
            </div>
          </div>
          <Radio className="w-8 h-8 text-cyan-500/40" />
        </div>

        <div className="rounded-xl border border-white/5 bg-[#050505]/40 p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-widest text-white/35 uppercase">Critical SLA Expiry Risks</span>
            <div className="text-xl font-bold font-mono text-white">
              <span className={riskCount > 0 ? "text-amber-400 font-extrabold" : "text-white"}>{riskCount} High Risk</span>
            </div>
          </div>
          <AlertTriangle className="w-8 h-8 text-amber-500/40" />
        </div>

        <div className="rounded-xl border border-white/5 bg-[#050505]/40 p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-widest text-white/35 uppercase">Engineering Allocation</span>
            <div className="text-xl font-bold font-mono text-white">{delegatedPercentage}% Assigned</div>
          </div>
          <UserCheck className="w-8 h-8 text-emerald-500/40" />
        </div>
      </div>

      <div className="border border-white/5 rounded-xl bg-[#050505]/20 p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-white/30" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by SLA identifier, subject, or client..."
            className="w-full h-9 rounded-lg border border-white/5 bg-white/[0.01] pl-9 pr-4 text-[11px] font-mono text-white placeholder-white/30 outline-none focus:border-white/10 focus:bg-white/[0.02]"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select value={filterClient} onChange={(e) => setFilterClient(e.target.value)} className="h-9 rounded-lg border border-white/5 bg-[#050505] px-2 text-[10px] font-mono text-white/70 outline-none cursor-pointer font-bold">
            <option value="">ALL CLIENTS</option>
            {AVAILABLE_CLIENTS.map((c) => <option key={c} value={c}>{c.split(" [")[0].toUpperCase()}</option>)}
          </select>
          <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="h-9 rounded-lg border border-white/5 bg-[#050505] px-2 text-[10px] font-mono text-white/70 outline-none cursor-pointer font-bold">
            <option value="">ALL PRIORITY</option>
            <option value="P1">P1 SLA</option>
            <option value="P2">P2 SLA</option>
            <option value="P3">P3 SLA</option>
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="h-9 rounded-lg border border-white/5 bg-[#050505] px-2 text-[10px] font-mono text-white/70 outline-none cursor-pointer font-bold">
            <option value="">ALL STATUS</option>
            <option value="OPEN">OPEN</option>
            <option value="INVESTIGATING">INVESTIGATING</option>
            <option value="HOLD">ON HOLD</option>
            <option value="RESOLVED">RESOLVED</option>
          </select>
        </div>
      </div>

      {loading && tickets.length === 0 ? (
        <div className="p-10 border border-white/5 rounded-xl bg-black/25 flex flex-col items-center justify-center space-y-3 font-mono">
          <Clock className="w-6 h-6 text-[#009DFF] animate-spin" />
          <span className="text-white/40 text-[10px] uppercase">Decrypting active SLA support wires...</span>
        </div>
      ) : error ? (
        <div className="p-10 border border-red-500/10 rounded-xl bg-red-500/[0.01] flex flex-col items-center justify-center space-y-3 font-mono text-center">
          <AlertTriangle className="w-6 h-6 text-red-500" />
          <span className="text-red-400 text-[10px] uppercase font-bold">Secure connection failure</span>
          <p className="text-white/40 text-[9.5px] max-w-xs">{error}</p>
          <button onClick={fetchData} className="px-3 py-1.5 rounded border border-red-500/20 text-red-400 hover:bg-red-500/5 transition-colors cursor-pointer uppercase text-[9px] font-bold">
            Retry Secure Bridge
          </button>
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="p-10 border border-dashed border-white/5 rounded-xl text-center space-y-2">
          <MessageSquare className="w-6 h-6 text-white/15 mx-auto" />
          <p className="text-[10px] uppercase font-bold text-white/45">No support wires found</p>
          <p className="text-[9.5px] max-w-xs mx-auto text-white/20">All communication lines are clear or filters yielded no active handshakes.</p>
        </div>
      ) : (
        <>
          <div className="hidden md:block border border-white/5 rounded-xl bg-[#050505]/20 overflow-hidden">
          <table className="w-full text-left border-collapse font-mono text-[11px]">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01] text-[9.5px] text-white/40 uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">ID</th>
                <th className="py-3 px-4 font-semibold">Subject & Client</th>
                <th className="py-3 px-4 font-semibold">Priority</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Assigned Engineer</th>
                <th className="py-3 px-4 font-semibold">Assets</th>
                <th className="py-3 px-4 font-semibold text-right">SLA countdown</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((t) => (
              <tr 
                key={t.id}
                onClick={() => setSelectedTicketId(t.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedTicketId(t.id);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-pressed={selectedTicketId === t.id}
                className={`border-b border-white/[0.02] last:border-0 hover:bg-white/[0.02] focus:bg-white/[0.03] outline-none cursor-pointer transition-colors ${selectedTicketId === t.id ? "bg-white/[0.02]" : ""}`}
              >
                <td className="py-3 px-4 font-bold text-[#009DFF]">
                  <div className="flex items-center gap-1.5">
                    <span>{t.id}</span>
                    <button 
                      onClick={(e) => handleCopyId(e, t.id)} 
                      className="opacity-40 hover:opacity-100 p-0.5 focus:opacity-100 outline-none rounded hover:bg-white/5" 
                      title="Copy SLA Wire ID"
                    >
                      {copiedTicketId === t.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="space-y-0.5">
                    <span className="text-white font-semibold block truncate max-w-[250px]">{t.subject}</span>
                    <span className="text-white/30 text-[9.5px] block uppercase">{t.client.split(" [")[0]}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex px-1.5 py-0.5 rounded border text-[9px] font-bold ${getPriorityBadgeStyles(t.priority)}`}>
                    {t.priority} SLA
                  </span>
                </td>
                <td className="py-3 px-4 text-white/70">{t.category.toUpperCase()}</td>
                <td className="py-3 px-4">
                  {(() => {
                    const styles = getStatusStyles(t.status);
                    return (
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[9px] font-bold ${styles.bgClass} ${styles.textClass}`}>
                        <span className={`w-1 h-1 rounded-full ${styles.dotClass}`} />
                        <span>{t.status}</span>
                      </span>
                    );
                  })()}
                </td>
                <td className="py-3 px-4 text-white/80">{t.assignedAgent}</td>
                <td className="py-3 px-4">
                  <div className="flex gap-1.5 text-white/40">
                    {t.linkedProjectId !== "None" && (
                      <span title="Linked Project" className="flex items-center">
                        <Folder className="w-3.5 h-3.5 text-[#00FFC2]" />
                      </span>
                    )}
                    {t.linkedDocId !== "None" && (
                      <span title="Linked Document" className="flex items-center">
                        <FileText className="w-3.5 h-3.5 text-amber-400" />
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-right font-bold">
                  {renderSlaBadge(t)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
        {filteredTickets.map((t) => (
          <div 
            key={t.id} 
            onClick={() => setSelectedTicketId(t.id)} 
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSelectedTicketId(t.id);
              }
            }}
            tabIndex={0}
            role="button"
            aria-pressed={selectedTicketId === t.id}
            className={`border rounded-xl p-4 space-y-3 bg-[#050505]/40 backdrop-blur-sm cursor-pointer hover:bg-[#050505]/60 focus:border-[#009DFF] outline-none transition-all ${selectedTicketId === t.id ? "border-[#009DFF]" : "border-white/5"}`}
          >
            <div className="flex justify-between items-center">
              <span className="text-[#009DFF] font-bold font-mono text-[11px]">{t.id}</span>
              <span className={`inline-flex px-1.5 py-0.5 rounded border text-[8px] font-bold ${getPriorityBadgeStyles(t.priority)}`}>
                {t.priority}
              </span>
            </div>
            <h4 className="text-white font-semibold text-xs leading-snug">{t.subject}</h4>
            <p className="text-[9.5px] font-mono text-white/30 uppercase mt-1">{t.client.split(" [")[0]}</p>
            <div className="flex justify-between items-center pt-2 border-t border-white/5 font-mono text-[10px]">
              <span className="text-white/40 uppercase">STATUS: {t.status}</span>
              <span>{renderSlaBadge(t)}</span>
            </div>
          </div>
        ))}
      </div>
        </>
      )}

      {selectedTicket && (
        <>
          <div onClick={() => setSelectedTicketId(null)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all" />
          <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[500px] md:w-[600px] bg-[#070708] border-l border-white/10 shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex justify-between items-start border-b border-white/5 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-[#009DFF] bg-[#009DFF]/10 border border-[#009DFF]/20 px-2 py-0.5 rounded font-bold">{selectedTicket.id}</span>
                  <h3 className="text-sm font-bold text-white mt-2 leading-snug">{selectedTicket.subject}</h3>
                  <p className="text-[9.5px] font-mono text-white/40 uppercase mt-1">CLIENT: {selectedTicket.client}</p>
                </div>
                <button onClick={() => setSelectedTicketId(null)} className="p-1 hover:bg-white/5 rounded text-white/40 cursor-pointer"><X className="w-5 h-5" /></button>
              </div>

              {/* Secure Enclave Diagnostics Bridge Visualizer */}
              <div className="border border-white/5 rounded-xl bg-black/40 p-4 font-mono text-[10px] space-y-3 relative overflow-hidden">
                <style>{`
                  @keyframes flowP { to { stroke-dashoffset: -20; } }
                  .fl-f { stroke-dasharray:6,6; animation:flowP .6s linear infinite; }
                  .fl-n { stroke-dasharray:6,6; animation:flowP 1.5s linear infinite; }
                  .fl-s { stroke-dasharray:6,6; animation:flowP 3.5s linear infinite; }
                `}</style>
                
                <div className="flex justify-between items-center text-[8.5px] text-white/40 uppercase tracking-wider">
                  <span>Enclave Telemetry Bridge</span>
                  <span className="flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${selectedTicket.status === "RESOLVED" ? "bg-white/20" : selectedTicket.priority === "P1" ? "bg-red-500 animate-ping" : "bg-cyan-400 animate-pulse"}`} />
                    <span className={selectedTicket.status === "RESOLVED" ? "text-white/40" : selectedTicket.priority === "P1" ? "text-red-400 font-bold" : "text-cyan-400"}>
                      {selectedTicket.status === "RESOLVED" ? "TERMINATED" : `${selectedTicket.priority} STREAM ACTIVE`}
                    </span>
                  </span>
                </div>

                <div className="relative h-20 w-full flex items-center justify-center">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 400 80" fill="none">
                    <path d="M 40 40 Q 200 10 360 40" stroke="rgba(255,255,255,0.05)" strokeWidth="3" strokeLinecap="round" />
                    {selectedTicket.status !== "RESOLVED" && (
                      <path 
                        d="M 40 40 Q 200 10 360 40" 
                        stroke={selectedTicket.status === "HOLD" ? "#FBBF24" : selectedTicket.priority === "P1" ? "#F87171" : "#22D3EE"} 
                        strokeWidth="1.5" 
                        strokeLinecap="round"
                        className={selectedTicket.status === "HOLD" ? "fl-s" : selectedTicket.priority === "P1" ? "fl-f" : "fl-n"}
                      />
                    )}
                    <g transform="translate(40, 40)">
                      <circle r="12" fill="#070708" stroke={selectedTicket.status === "RESOLVED" ? "rgba(255,255,255,0.1)" : selectedTicket.priority === "P1" ? "#EF4444" : "#06B6D4"} strokeWidth="1.5" />
                      <circle r="6" fill={selectedTicket.status === "RESOLVED" ? "rgba(255,255,255,0.2)" : selectedTicket.priority === "P1" ? "#EF4444" : "#06B6D4"} className={selectedTicket.status !== "RESOLVED" ? "animate-pulse" : ""} />
                      {selectedTicket.status !== "RESOLVED" && selectedTicket.priority === "P1" && (
                        <circle r="18" fill="none" stroke="#EF4444" strokeWidth="1" className="animate-ping opacity-30" />
                      )}
                    </g>
                    <g transform="translate(360, 40)">
                      <circle r="12" fill="#070708" stroke={selectedTicket.status === "RESOLVED" ? "rgba(255,255,255,0.1)" : selectedTicket.assignedAgent === "Unassigned" ? "#F59E0B" : "#10B981"} strokeWidth="1.5" />
                      <circle r="6" fill={selectedTicket.status === "RESOLVED" ? "rgba(255,255,255,0.2)" : selectedTicket.assignedAgent === "Unassigned" ? "#F59E0B" : "#10B981"} />
                    </g>
                    <text x="40" y="68" fill="rgba(255,255,255,0.4)" fontSize="7" fontFamily="monospace" textAnchor="middle">ENCLAVE</text>
                    <text x="360" y="68" fill="rgba(255,255,255,0.4)" fontSize="7" fontFamily="monospace" textAnchor="middle">TERMINAL</text>
                    <rect x="150" y="28" width="100" height="14" rx="3" fill="#070708" stroke="rgba(255,255,255,0.1)" />
                    <text x="200" y="37" fill={selectedTicket.status === "RESOLVED" ? "rgba(255,255,255,0.3)" : "#00FFC2"} fontSize="6.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                      {selectedTicket.status === "RESOLVED" ? "ATTESTATION_OFF" : "TLS_1.3_SECURE"}
                    </text>
                  </svg>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1 border-t border-white/5 text-[9px] text-white/50">
                  <div>
                    <div>CLIENT: <span className="text-white font-bold">{selectedTicket.client.split(" [")[0]}</span></div>
                    <div>SEALING: <span className="text-white font-bold">Intel SGX v2</span></div>
                  </div>
                  <div className="text-right">
                    <div>GATEWAY: <span className="text-white font-bold">{selectedTicket.id}-GW</span></div>
                    <div>LATENCY: <span className="text-emerald-400 font-bold">{selectedTicket.priority === "P1" ? "145ms (HIGH)" : "42ms (NOMINAL)"}</span></div>
                  </div>
                </div>
              </div>

              <div className="flex border-b border-white/5 font-mono text-[9.5px] select-none">
                <button onClick={() => setDrawerTab("wire")} className={`px-3 py-2 border-b-2 font-bold uppercase flex items-center gap-1 ${drawerTab === "wire" ? "border-[#009DFF] text-[#009DFF]" : "border-transparent text-white/40"}`}>
                  <MessageSquare className="w-3.5 h-3.5" /><span>Secure wire</span>
                </button>
                <button onClick={() => setDrawerTab("assets")} className={`px-3 py-2 border-b-2 font-bold uppercase flex items-center gap-1 ${drawerTab === "assets" ? "border-[#009DFF] text-[#009DFF]" : "border-transparent text-white/40"}`}>
                  <Folder className="w-3.5 h-3.5" /><span>Sovereign assets</span>
                </button>
                <button onClick={() => setDrawerTab("diagnostic")} className={`px-3 py-2 border-b-2 font-bold uppercase flex items-center gap-1 ${drawerTab === "diagnostic" ? "border-[#009DFF] text-[#009DFF]" : "border-transparent text-white/40"}`}>
                  <Terminal className="w-3.5 h-3.5" /><span>Diagnostics</span>
                </button>
              </div>

              {drawerTab === "wire" && (
                <div className="space-y-4 font-mono">
                  <div className="border border-emerald-500/10 rounded-lg bg-emerald-500/[0.01] p-2.5 text-[10.5px] text-emerald-400 flex gap-1.5">
                    <Shield className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>Cryptographic Dual-Layer handshake verified. Communications airgapped.</span>
                  </div>
                  <div className="border border-white/5 rounded-lg bg-black/40 p-3 h-[240px] overflow-y-auto space-y-2 text-[10.5px] flex flex-col">
                    {selectedTicket.wireFeed.map((f) => (
                      <div key={f.id} className={`max-w-[85%] rounded p-2 space-y-0.5 ${f.sender === "system" ? "self-stretch bg-white/[0.01] text-white/35 border-b border-white/[0.02]" : f.sender === "agent" ? "self-end bg-[#009DFF]/10 text-white border border-[#009DFF]/20" : "self-start bg-white/[0.02] text-white/90"}`}>
                        <div className="flex justify-between text-[8px] opacity-40">
                          <span>{f.senderName.toUpperCase()}</span>
                          <span>{f.timestamp}</span>
                        </div>
                        <p className="whitespace-pre-wrap">{f.text}</p>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Type secure message..." className="flex-grow h-9 rounded border border-white/5 bg-white/[0.01] px-3 text-[11px] font-mono text-white placeholder-white/30 outline-none" />
                    <button type="submit" disabled={!chatInput.trim()} className="h-9 px-3 rounded bg-[#009DFF] text-white cursor-pointer hover:bg-[#0082d4] disabled:opacity-40"><Send className="w-3.5 h-3.5" /></button>
                  </form>
                </div>
              )}

              {drawerTab === "assets" && (
                <div className="space-y-4 font-mono text-[11px]">
                  <div>
                    <h4 className="text-[9.5px] text-white/30 uppercase font-semibold mb-1">Project Sandbox Details</h4>
                    {connectedProject ? (
                      <div className="border border-white/5 bg-[#020202]/50 p-3 rounded-lg space-y-2">
                        <div className="flex justify-between"><span className="font-bold text-[#00FFC2]">{connectedProject.id}</span><span>{connectedProject.enclaveType}</span></div>
                        <h5 className="text-white font-semibold">{connectedProject.name}</h5>
                        <div className="text-[10px] text-white/40">Status: {connectedProject.status} | Phase: {connectedProject.phase}</div>
                      </div>
                    ) : <p className="text-white/30 text-[10px]">No integration project linked.</p>}
                  </div>
                  <div>
                    <h4 className="text-[9.5px] text-white/30 uppercase font-semibold mb-1">Compliance Reference Docs</h4>
                    {connectedDoc ? (
                      <div className="border border-white/5 bg-[#020202]/50 p-3 rounded-lg space-y-2">
                        <div className="flex justify-between"><span className="font-bold text-amber-400">{connectedDoc.id}</span><span>{connectedDoc.type}</span></div>
                        <h5 className="text-white font-semibold">{connectedDoc.title}</h5>
                        <div className="text-[9px] text-[#00FFC2] truncate">{connectedDoc.sha256}</div>
                      </div>
                    ) : <p className="text-white/30 text-[10px]">No compliance document linked.</p>}
                  </div>
                </div>
              )}

              {drawerTab === "diagnostic" && (
                <div className="space-y-4 font-mono text-[10.5px]">
                  <div className="border border-white/5 rounded-lg p-3 bg-black/20">
                    <span className="text-[9px] text-white/30 uppercase block font-semibold mb-1">Specification description</span>
                    <p className="text-white/80 leading-relaxed">{selectedTicket.description}</p>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[9px] text-white/30 uppercase font-semibold block">Enclave Audit Metadata</span>
                    <div className="border border-white/5 rounded bg-black/20 p-2.5 space-y-1 select-text">
                      <div>Created: {selectedTicket.createdDate}</div>
                      <div>SLA Sec Remaining: {selectedTicket.slaSeconds}</div>
                      <div className="text-[#00FFC2] truncate">Hash: 0xSHA256_{selectedTicket.id}_{selectedTicket.slaSeconds}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-white/10 bg-black/20 mt-4 space-y-3 font-mono text-[10px]">
              <div className="flex items-center gap-1 text-white/40"><Info className="w-3.5 h-3.5 text-[#009DFF]" /><span>Administrative controls (Local settings)</span></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-0.5">
                  <span className="text-[8.5px] text-white/30 uppercase block font-semibold">Re-assign engineer</span>
                  <select value={selectedTicket.assignedAgent} onChange={(e) => handleAssignAgent(selectedTicket.id, e.target.value)} className="h-8 w-full rounded border border-white/5 bg-[#0c0c0e] px-2 text-[10px] text-white outline-none cursor-pointer">
                    {AVAILABLE_AGENTS.map((a) => <option key={a} value={a}>{a.toUpperCase()}</option>)}
                  </select>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[8.5px] text-white/30 uppercase block font-semibold">Change status</span>
                  <select value={selectedTicket.status} onChange={(e) => handleUpdateStatus(selectedTicket.id, e.target.value as Ticket["status"])} className="h-8 w-full rounded border border-white/5 bg-[#0c0c0e] px-2 text-[10px] text-white outline-none cursor-pointer">
                    <option value="OPEN">OPEN</option>
                    <option value="INVESTIGATING">INVESTIGATING</option>
                    <option value="HOLD">ON HOLD</option>
                    <option value="RESOLVED">RESOLVED</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 pt-1.5">
                <button onClick={() => handleUpdateStatus(selectedTicket.id, "RESOLVED")} disabled={selectedTicket.status === "RESOLVED"} className="flex-grow h-8 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase transition-all disabled:opacity-45 cursor-pointer text-[10px]">Resolve wire</button>
                <button onClick={() => handleDeleteTicket(selectedTicket.id)} className="px-2 h-8 rounded bg-rose-950/40 hover:bg-rose-900/50 text-rose-400 border border-rose-500/20 transition-all cursor-pointer font-bold uppercase text-[10px]">Delete wire</button>
                <button onClick={() => setSelectedTicketId(null)} className="px-3 h-8 rounded border border-white/10 text-white hover:bg-white/[0.02] transition-all cursor-pointer font-bold uppercase text-[10px]">Close</button>
              </div>
            </div>
          </div>
        </>
      )}

      {isNewModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative max-w-md w-full bg-[#070708] border border-white/10 rounded-xl p-5 shadow-2xl space-y-4">
            <button onClick={() => setIsNewModalOpen(false)} className="absolute right-4 top-4 text-white/40 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            <div className="flex items-center gap-1.5 border-b border-white/5 pb-2">
              <Terminal className="w-4 h-4 text-[#009DFF]" />
              <h3 className="text-xs font-bold text-white uppercase font-mono">Provision SLA Support wire</h3>
            </div>
            <form onSubmit={handleCreateTicket} className="space-y-3 font-mono text-[10px]">
              <div className="space-y-0.5">
                <label className="text-[8.5px] text-white/30 uppercase block font-semibold">Support wire subject</label>
                <input type="text" required placeholder="e.g. Node replication delay spike" value={newSubject} onChange={(e) => setNewSubject(e.target.value)} className="w-full h-8 rounded border border-white/5 bg-white/[0.01] px-3.5 text-[11px] text-white placeholder-white/30 outline-none focus:border-[#009DFF]/40" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-0.5">
                  <span className="text-[8.5px] text-white/30 uppercase block font-semibold">Sovereign Client</span>
                  <select value={newClient} onChange={(e) => setNewClient(e.target.value)} className="h-8 w-full rounded border border-white/5 bg-[#0c0c0e] px-2 text-[10px] text-white outline-none cursor-pointer">
                    {AVAILABLE_CLIENTS.map((c) => <option key={c} value={c}>{c.split(" [")[0].toUpperCase()}</option>)}
                  </select>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[8.5px] text-white/30 uppercase block font-semibold">Priority</span>
                  <select value={newPriority} onChange={(e) => setNewPriority(e.target.value as "P1" | "P2" | "P3")} className="h-8 w-full rounded border border-white/5 bg-[#0c0c0e] px-2 text-[10px] text-white outline-none cursor-pointer">
                    <option value="P1">P1 SLA CRITICAL (1H)</option>
                    <option value="P2">P2 SLA HIGH (4H)</option>
                    <option value="P3">P3 SLA STANDARD (12H)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-0.5">
                  <span className="text-[8.5px] text-white/30 uppercase block font-semibold">Category</span>
                  <select value={newCategory} onChange={(e) => setNewCategory(e.target.value as Ticket["category"])} className="h-8 w-full rounded border border-white/5 bg-[#0c0c0e] px-2 text-[10px] text-white outline-none cursor-pointer">
                    {AVAILABLE_CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat.toUpperCase()}</option>)}
                  </select>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[8.5px] text-white/30 uppercase block font-semibold">Lead engineer</span>
                  <select value={newAgent} onChange={(e) => setNewAgent(e.target.value)} className="h-8 w-full rounded border border-white/5 bg-[#0c0c0e] px-2 text-[10px] text-white outline-none cursor-pointer">
                    {AVAILABLE_AGENTS.map((a) => <option key={a} value={a}>{a.toUpperCase()}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-0.5">
                  <span className="text-[8.5px] text-white/30 uppercase block font-semibold">SLA limit (Hours)</span>
                  <input type="number" min="1" max="168" value={newSlaHours} onChange={(e) => setNewSlaHours(e.target.value)} className="w-full h-8 rounded border border-white/5 bg-white/[0.01] px-2.5 text-[11px] text-white outline-none focus:border-[#009DFF]/40" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[8.5px] text-white/30 uppercase block font-semibold">Link project</span>
                  <select value={newProject} onChange={(e) => setNewProject(e.target.value)} className="h-8 w-full rounded border border-white/5 bg-[#0c0c0e] px-2 text-[10px] text-white outline-none cursor-pointer">
                    <option value="None">NONE / UNASSIGNED</option>
                    {MOCK_PROJECTS.map((p) => <option key={p.id} value={p.id}>{p.id} - {p.name.substring(0, 20)}...</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-0.5">
                <span className="text-[8.5px] text-white/30 uppercase block font-semibold">Link document</span>
                <select value={newDoc} onChange={(e) => setNewDoc(e.target.value)} className="h-8 w-full rounded border border-white/5 bg-[#0c0c0e] px-2 text-[10px] text-white outline-none cursor-pointer">
                  <option value="None">NONE / UNASSIGNED</option>
                  {MOCK_DOCUMENTS.map((d) => <option key={d.id} value={d.id}>{d.id} - {d.title.substring(0, 25)}...</option>)}
                </select>
              </div>
              <div className="space-y-0.5">
                <span className="text-[8.5px] text-white/30 uppercase block font-semibold">Problem description</span>
                <textarea required rows={3} placeholder="Describe the system problem context..." value={newDescription} onChange={(e) => setNewDescription(e.target.value)} className="w-full rounded border border-white/5 bg-white/[0.01] p-2 text-[11px] text-white placeholder-white/30 outline-none focus:border-[#009DFF]/40 resize-none" />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-grow h-8 rounded bg-[#009DFF] hover:bg-[#0082d4] text-white font-bold uppercase transition-all flex items-center justify-center gap-1 cursor-pointer font-mono text-[10px]">
                  <CheckCircle className="w-3.5 h-3.5" /><span>Provision Wire</span>
                </button>
                <button type="button" onClick={() => setIsNewModalOpen(false)} className="px-3 h-8 rounded border border-white/10 text-white font-bold uppercase transition-all cursor-pointer font-mono">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
