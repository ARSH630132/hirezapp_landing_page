"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { 
  Search, Plus, X, Check, Clock, Shield, 
  MessageSquare, Send, UserCheck, AlertTriangle, Copy, CheckCircle, Info, Radio
} from "lucide-react";
import { PrivatePageHeader } from "@/components/private-app";

interface Ticket {
  id: string;
  subject: string;
  client: string;
  priority: "P1" | "P2" | "P3";
  category: string;
  status: "OPEN" | "INVESTIGATING" | "RESOLVED" | "HOLD";
  assignedAgent: string;
  description: string;
  createdDate: string;
  wireFeed: { id: string; sender: "client" | "agent" | "system"; senderName: string; text: string; timestamp: string }[];
}

const AVAILABLE_CLIENTS = [
  "Acme Corp",
  "Global Retail",
  "Logistics Unit",
  "Federal Division",
  "National Health"
];

const AVAILABLE_CATEGORIES = ["Infrastructure", "Security", "General Support", "Billing"];
const AVAILABLE_AGENTS = ["Dr. Sarah Vance", "Alexander Mercer", "Marcus Vance", "Evelyn Carter", "Unassigned"];

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [copiedTicketId, setCopiedTicketId] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // New Ticket Modal Form
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newClient, setNewClient] = useState(AVAILABLE_CLIENTS[0]);
  const [newPriority, setNewPriority] = useState<"P1" | "P2" | "P3">("P2");
  const [newCategory, setNewCategory] = useState("Infrastructure");
  const [newAgent, setNewAgent] = useState("Unassigned");
  const [newDescription, setNewDescription] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [filterClient, setFilterClient] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [banner, setBanner] = useState<string | null>(null);

  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [selectedTicketId, tickets]);

  const selectedTicket = useMemo(() => tickets.find((t) => t.id === selectedTicketId) || null, [tickets, selectedTicketId]);

  const getPriorityBadgeStyles = (priority: "P1" | "P2" | "P3") => {
    switch (priority) {
      case "P1": return "text-red-400 border-red-500/20 bg-red-500/5";
      case "P2": return "text-amber-400 border-amber-500/20 bg-amber-500/5";
      case "P3": return "text-cyan-400 border-cyan-500/20 bg-cyan-500/5";
      default: return "text-white/40 border-white/10 bg-white/5";
    }
  };

  const getStatusStyles = (status: Ticket["status"]) => {
    switch (status) {
      case "RESOLVED": return { dotClass: "bg-emerald-500", textClass: "text-emerald-400", bgClass: "border-emerald-500/10 bg-emerald-500/5" };
      case "INVESTIGATING": return { dotClass: "bg-cyan-500", textClass: "text-cyan-400", bgClass: "border-cyan-500/10 bg-cyan-500/5" };
      case "HOLD": return { dotClass: "bg-amber-500", textClass: "text-amber-400", bgClass: "border-amber-500/10 bg-amber-500/5" };
      case "OPEN": default: return { dotClass: "bg-red-500", textClass: "text-red-400", bgClass: "border-red-500/10 bg-red-500/5" };
    }
  };

  const activeCount = useMemo(() => tickets.filter((t) => t.status !== "RESOLVED").length, [tickets]);
  const riskCount = useMemo(() => tickets.filter((t) => t.priority === "P1" && t.status !== "RESOLVED").length, [tickets]);
  const delegatedPercentage = useMemo(() => {
    const assigned = tickets.filter((t) => t.assignedAgent !== "Unassigned").length;
    return tickets.length ? Math.round((assigned / tickets.length) * 100) : 0;
  }, [tickets]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("gff_ai_access_token") || localStorage.getItem("gff_api_token") : null;
      if (!token) throw new Error("Your session has expired. Please sign in again.");

      let url = "/api/v1/support";
      const params = new URLSearchParams();
      if (filterClient) {
        let cid = "";
        if (filterClient.includes("Acme")) cid = "client-001";
        else if (filterClient.includes("Retail")) cid = "client-002";
        else if (filterClient.includes("Logistics")) cid = "client-003";
        else if (filterClient.includes("Federal")) cid = "client-004";
        if (cid) params.append("client_id", cid);
      }
      if (filterPriority) params.append("priority", filterPriority);
      if (filterCategory) params.append("category", filterCategory);
      if (filterStatus) params.append("status", filterStatus);
      if (searchQuery.trim() !== "") params.append("search", searchQuery);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await fetch(url, { headers: { "Authorization": `Bearer ${token}` } });
      const data = await res.json();
      
      if (data.success) {
        const mapped = data.tickets.map((t: any) => ({
          id: t.id,
          subject: t.subject || t.title || "No Subject",
          client: t.client_name || "Acme Corp",
          priority: t.priority || "P2",
          category: t.category || "General Support",
          status: t.status || "OPEN",
          assignedAgent: t.assignedAgent || t.assigned_to || "Unassigned",
          description: t.description || t.desc || "No Description",
          createdDate: t.createdDate || new Date().toISOString(),
          wireFeed: t.wireFeed || []
        }));
        setTickets(mapped);
      } else {
        throw new Error(data.message || "Failed to fetch support tickets.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to connect to support.");
    } finally {
      setLoading(false);
    }
  }, [filterClient, filterPriority, filterCategory, filterStatus, searchQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCopyId = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedTicketId(id);
    setTimeout(() => setCopiedTicketId(null), 1500);
  };

  const triggerBanner = (msg: string) => {
    setBanner(msg);
    setTimeout(() => setBanner(null), 3000);
  };

  const handleUpdateStatus = async (id: string, status: Ticket["status"]) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("gff_ai_access_token") : null;
      if (!token) throw new Error("Unauthenticated");

      const res = await fetch(`/api/v1/support/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        triggerBanner(`Ticket status updated to ${status}`);
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
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ assigned_to: agent })
      });
      const data = await res.json();
      if (data.success) {
        triggerBanner(`Ticket assigned to ${agent}`);
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
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
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

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newDescription.trim()) return;

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("gff_ai_access_token") : null;
      if (!token) throw new Error("Unauthenticated");

      let client_id = "client-001";
      if (newClient.includes("Acme")) client_id = "client-001";
      else if (newClient.includes("Retail")) client_id = "client-002";
      else if (newClient.includes("Logistics")) client_id = "client-003";
      else if (newClient.includes("Federal")) client_id = "client-004";

      const payload = {
        subject: newSubject.trim(),
        client_id,
        priority: newPriority,
        category: newCategory,
        assigned_to: newAgent,
        status: "OPEN",
        description: newDescription.trim()
      };

      const res = await fetch("/api/v1/support", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        triggerBanner(`Support ticket ${data.ticket.id} created successfully.`);
        setIsNewModalOpen(false);
        setNewSubject("");
        setNewDescription("");
        fetchData();
      } else {
        triggerBanner(`Failed to create ticket: ${data.message || "Error"}`);
      }
    } catch (err: any) {
      triggerBanner(`Failed: ${err.message}`);
    }
  };

  const handleDeleteTicket = async (id: string) => {
    if (!window.confirm(`Are you sure you want to delete ticket ${id}?`)) return;
    
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("gff_ai_access_token") : null;
      if (!token) throw new Error("Unauthenticated");

      const res = await fetch(`/api/v1/support/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        triggerBanner(`Ticket ${id} deleted.`);
        setSelectedTicketId(null);
        fetchData();
      } else {
        triggerBanner(`Failed to delete ticket: ${data.message || "Error"}`);
      }
    } catch (err: any) {
      triggerBanner(`Failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 relative min-h-screen text-white pb-10">
      {banner && (
        <div className="fixed top-20 right-6 z-50 max-w-sm bg-black border border-emerald-500/30 text-[11px] font-mono p-3 rounded-lg shadow-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{banner}</span>
        </div>
      )}

      <PrivatePageHeader 
        title="Support Tickets" 
        desc="Manage client support requests, assign agents, and respond to inquiries."
        badgeLabel="SUPPORT ACTIVE"
        actions={
          <button onClick={() => setIsNewModalOpen(true)} className="h-9 px-4 rounded bg-[#009DFF] hover:bg-[#0082d4] text-[10px] font-mono font-bold uppercase tracking-wider text-white flex items-center gap-1 transition-all cursor-pointer shadow-[0_0_20px_rgba(0,157,255,0.2)]">
            <Plus className="w-3.5 h-3.5" />
            <span>Create Ticket</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="rounded-xl border border-white/5 bg-[#050505]/40 p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-widest text-white/35 uppercase">Active Tickets</span>
            <div className="text-xl font-bold font-mono text-white flex items-center gap-2">
              <span>{activeCount} Tickets</span>
            </div>
          </div>
          <Radio className="w-8 h-8 text-cyan-500/40" />
        </div>

        <div className="rounded-xl border border-white/5 bg-[#050505]/40 p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-widest text-white/35 uppercase">Urgent Tickets</span>
            <div className="text-xl font-bold font-mono text-white">
              <span className={riskCount > 0 ? "text-amber-400 font-extrabold" : "text-white"}>{riskCount} High Priority</span>
            </div>
          </div>
          <AlertTriangle className="w-8 h-8 text-amber-500/40" />
        </div>

        <div className="rounded-xl border border-white/5 bg-[#050505]/40 p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-widest text-white/35 uppercase">Assigned Tickets</span>
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
            placeholder="Search tickets..."
            className="w-full h-9 rounded-lg border border-white/5 bg-white/[0.01] pl-9 pr-4 text-[11px] font-mono text-white placeholder-white/30 outline-none focus:border-white/10 focus:bg-white/[0.02]"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select value={filterClient} onChange={(e) => setFilterClient(e.target.value)} className="h-9 rounded-lg border border-white/5 bg-[#050505] px-2 text-[10px] font-mono text-white/70 outline-none cursor-pointer font-bold">
            <option value="">ALL CLIENTS</option>
            {AVAILABLE_CLIENTS.map((c) => <option key={c} value={c}>{c.toUpperCase()}</option>)}
          </select>
          <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="h-9 rounded-lg border border-white/5 bg-[#050505] px-2 text-[10px] font-mono text-white/70 outline-none cursor-pointer font-bold">
            <option value="">ALL PRIORITY</option>
            <option value="P1">P1 (Critical)</option>
            <option value="P2">P2 (High)</option>
            <option value="P3">P3 (Standard)</option>
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
          <span className="text-white/40 text-[10px] uppercase">Loading tickets...</span>
        </div>
      ) : error ? (
        <div className="p-10 border border-red-500/10 rounded-xl bg-red-500/[0.01] flex flex-col items-center justify-center space-y-3 font-mono text-center">
          <AlertTriangle className="w-6 h-6 text-red-500" />
          <span className="text-red-400 text-[10px] uppercase font-bold">Error loading tickets</span>
          <p className="text-white/40 text-[9.5px] max-w-xs">{error}</p>
          <button onClick={fetchData} className="px-3 py-1.5 rounded border border-red-500/20 text-red-400 hover:bg-red-500/5 transition-colors cursor-pointer uppercase text-[9px] font-bold">
            RELOAD
          </button>
        </div>
      ) : tickets.length === 0 ? (
        <div className="p-10 border border-dashed border-white/5 rounded-xl text-center space-y-2">
          <MessageSquare className="w-6 h-6 text-white/15 mx-auto" />
          <p className="text-[10px] uppercase font-bold text-white/45">No tickets found</p>
          <p className="text-[9.5px] max-w-xs mx-auto text-white/20">Try adjusting your filters or search query.</p>
        </div>
      ) : (
        <div className="border border-white/5 rounded-xl bg-[#050505]/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-[11px]">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.01] text-[9.5px] text-white/40 uppercase tracking-wider">
                  <th className="py-3 px-4 font-semibold">Ticket ID</th>
                  <th className="py-3 px-4 font-semibold">Subject</th>
                  <th className="py-3 px-4 font-semibold">Client</th>
                  <th className="py-3 px-4 font-semibold">Priority</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Assigned Agent</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                <tr 
                  key={t.id}
                  onClick={() => setSelectedTicketId(t.id)}
                  className={`border-b border-white/[0.02] last:border-0 hover:bg-white/[0.02] cursor-pointer transition-colors ${selectedTicketId === t.id ? "bg-white/[0.02]" : ""}`}
                >
                  <td className="py-3 px-4 font-bold text-[#009DFF]">
                    <div className="flex items-center gap-1.5">
                      <span>{t.id}</span>
                      <button 
                        onClick={(e) => handleCopyId(e, t.id)} 
                        className="opacity-40 hover:opacity-100 p-0.5 rounded hover:bg-white/5" 
                      >
                        {copiedTicketId === t.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-white font-semibold truncate max-w-[200px]">{t.subject}</td>
                  <td className="py-3 px-4 text-white/80">{t.client}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-1.5 py-0.5 rounded border text-[9px] font-bold ${getPriorityBadgeStyles(t.priority)}`}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-white/70">{t.category}</td>
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
                </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
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
                  <p className="text-[9.5px] font-mono text-white/40 uppercase mt-1">Client: {selectedTicket.client}</p>
                </div>
                <button onClick={() => setSelectedTicketId(null)} className="p-1 hover:bg-white/5 rounded text-white/40 cursor-pointer"><X className="w-5 h-5" /></button>
              </div>

              <div className="border border-white/5 rounded-lg p-3 bg-black/20 font-mono text-[10.5px]">
                <span className="text-[9px] text-white/30 uppercase block font-semibold mb-1">Description</span>
                <p className="text-white/80 leading-relaxed whitespace-pre-wrap">{selectedTicket.description}</p>
              </div>

              <div className="space-y-4 font-mono">
                <div className="border border-white/5 rounded-lg bg-black/40 p-3 h-[320px] overflow-y-auto space-y-2 text-[10.5px] flex flex-col">
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
                  <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Type a message..." className="flex-grow h-9 rounded border border-white/5 bg-white/[0.01] px-3 text-[11px] font-mono text-white placeholder-white/30 outline-none" />
                  <button type="submit" disabled={!chatInput.trim()} className="h-9 px-3 rounded bg-[#009DFF] text-white cursor-pointer hover:bg-[#0082d4] disabled:opacity-40"><Send className="w-3.5 h-3.5" /></button>
                </form>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 bg-black/20 mt-4 space-y-3 font-mono text-[10px]">
              <div className="flex items-center gap-1 text-white/40"><Info className="w-3.5 h-3.5 text-[#009DFF]" /><span>Ticket Controls</span></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-0.5">
                  <span className="text-[8.5px] text-white/30 uppercase block font-semibold">Assign Agent</span>
                  <select value={selectedTicket.assignedAgent} onChange={(e) => handleAssignAgent(selectedTicket.id, e.target.value)} className="h-8 w-full rounded border border-white/5 bg-[#0c0c0e] px-2 text-[10px] text-white outline-none cursor-pointer">
                    {AVAILABLE_AGENTS.map((a) => <option key={a} value={a}>{a.toUpperCase()}</option>)}
                  </select>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[8.5px] text-white/30 uppercase block font-semibold">Change Status</span>
                  <select value={selectedTicket.status} onChange={(e) => handleUpdateStatus(selectedTicket.id, e.target.value as Ticket["status"])} className="h-8 w-full rounded border border-white/5 bg-[#0c0c0e] px-2 text-[10px] text-white outline-none cursor-pointer">
                    <option value="OPEN">OPEN</option>
                    <option value="INVESTIGATING">INVESTIGATING</option>
                    <option value="HOLD">ON HOLD</option>
                    <option value="RESOLVED">RESOLVED</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 pt-1.5">
                <button onClick={() => handleDeleteTicket(selectedTicket.id)} className="px-2 h-8 rounded bg-rose-950/40 hover:bg-rose-900/50 text-rose-400 border border-rose-500/20 transition-all cursor-pointer font-bold uppercase text-[10px]">Delete Ticket</button>
                <button onClick={() => setSelectedTicketId(null)} className="px-3 h-8 flex-grow rounded border border-white/10 text-white hover:bg-white/[0.02] transition-all cursor-pointer font-bold uppercase text-[10px]">Close Sidebar</button>
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
              <MessageSquare className="w-4 h-4 text-[#009DFF]" />
              <h3 className="text-xs font-bold text-white uppercase font-mono">Create Support Ticket</h3>
            </div>
            <form onSubmit={handleCreateTicket} className="space-y-3 font-mono text-[10px]">
              <div className="space-y-0.5">
                <label className="text-[8.5px] text-white/30 uppercase block font-semibold">Subject</label>
                <input type="text" required placeholder="Brief description of the issue..." value={newSubject} onChange={(e) => setNewSubject(e.target.value)} className="w-full h-8 rounded border border-white/5 bg-white/[0.01] px-3.5 text-[11px] text-white placeholder-white/30 outline-none focus:border-[#009DFF]/40" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-0.5">
                  <span className="text-[8.5px] text-white/30 uppercase block font-semibold">Client Name</span>
                  <select value={newClient} onChange={(e) => setNewClient(e.target.value)} className="h-8 w-full rounded border border-white/5 bg-[#0c0c0e] px-2 text-[10px] text-white outline-none cursor-pointer">
                    {AVAILABLE_CLIENTS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[8.5px] text-white/30 uppercase block font-semibold">Priority</span>
                  <select value={newPriority} onChange={(e) => setNewPriority(e.target.value as "P1" | "P2" | "P3")} className="h-8 w-full rounded border border-white/5 bg-[#0c0c0e] px-2 text-[10px] text-white outline-none cursor-pointer">
                    <option value="P1">P1 (Critical)</option>
                    <option value="P2">P2 (High)</option>
                    <option value="P3">P3 (Standard)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-0.5">
                  <span className="text-[8.5px] text-white/30 uppercase block font-semibold">Category</span>
                  <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="h-8 w-full rounded border border-white/5 bg-[#0c0c0e] px-2 text-[10px] text-white outline-none cursor-pointer">
                    {AVAILABLE_CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[8.5px] text-white/30 uppercase block font-semibold">Assign Agent</span>
                  <select value={newAgent} onChange={(e) => setNewAgent(e.target.value)} className="h-8 w-full rounded border border-white/5 bg-[#0c0c0e] px-2 text-[10px] text-white outline-none cursor-pointer">
                    {AVAILABLE_AGENTS.map((a) => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-0.5">
                <span className="text-[8.5px] text-white/30 uppercase block font-semibold">Description</span>
                <textarea required rows={4} placeholder="Provide details about the issue..." value={newDescription} onChange={(e) => setNewDescription(e.target.value)} className="w-full rounded border border-white/5 bg-white/[0.01] p-2 text-[11px] text-white placeholder-white/30 outline-none focus:border-[#009DFF]/40 resize-none" />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-grow h-8 rounded bg-[#009DFF] hover:bg-[#0082d4] text-white font-bold uppercase transition-all flex items-center justify-center gap-1 cursor-pointer font-mono text-[10px]">
                  <CheckCircle className="w-3.5 h-3.5" /><span>Create Ticket</span>
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