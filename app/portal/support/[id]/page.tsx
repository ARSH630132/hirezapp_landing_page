"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, Lock, Terminal, Send, RefreshCw, X, ShieldCheck, ShieldAlert } from "lucide-react";
import { previewProjects, SupportTicket } from "@/lib/mock-data-model";
import { StatusBadge } from "@/components/private-app";

interface ClientSupportTicket extends SupportTicket {
  category: "Project Delivery" | "AI Operations" | "Billing" | "Documents" | "Access" | "Governance" | "General";
  projectId?: string;
}

export default function ClientSupportDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const ticketId = typeof id === "string" ? id : "";
  const [activeTicket, setActiveTicket] = useState<ClientSupportTicket | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const normalizeTicket = (t: any): ClientSupportTicket => {
    const mappedPriority = t.priority === "P1" ? "critical" : t.priority === "P2" ? "high" : t.priority === "P3" ? "medium" : (t.priority || "low");
    const mappedStatus = t.status === "OPEN" ? "open" : (t.status === "IN_PROGRESS" || t.status === "INVESTIGATING") ? "in_progress" : (t.status === "RESOLVED" ? "resolved" : "open");
    
    return {
      id: t.id,
      title: t.subject || t.title,
      desc: t.description || t.desc,
      status: mappedStatus as any,
      priority: mappedPriority as any,
      category: t.category || "General",
      projectId: t.linkedProjectId || t.projectId,
      createdAt: t.createdDate || t.createdAt,
      replies: t.replies || (t.wireFeed ? t.wireFeed.map((w: any) => ({
        sender: w.senderName,
        text: w.text,
        timestamp: w.timestamp.includes("-") ? w.timestamp : new Date().toISOString()
      })) : [])
    };
  };

  const fetchTicket = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("gff_ai_access_token") : null;
      if (!token) {
        setError("SESSION EXPIRED. PLEASE RE-LOG IN.");
        return;
      }
      const res = await fetch(`/api/v1/support/${ticketId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (!res.ok) {
        throw new Error(`Enclave ticket fetch failed with status ${res.status}`);
      }
      const data = await res.json();
      if (data.success && data.ticket) {
        setActiveTicket(normalizeTicket(data.ticket));
      } else {
        throw new Error("Returned invalid ticket data.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Ledger attestation handshake timed out.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ticketId) {
      fetchTicket();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketId]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicket) return;
    const currentReply = replyText;
    setReplyText("");
    setIsReplying(true);

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("gff_ai_access_token") : null;
      if (!token) {
        alert("Session expired. Please log in.");
        setIsReplying(false);
        return;
      }

      const res = await fetch(`/api/v1/support/${ticketId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: currentReply })
      });

      if (!res.ok) throw new Error(`Reply post failed status ${res.status}`);
      const data = await res.json();
      if (data.success && data.ticket) {
        setActiveTicket(normalizeTicket(data.ticket));
      } else {
        throw new Error("Malformed reply response.");
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to send reply.");
    } finally {
      setIsReplying(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-[1200px] mx-auto pb-12 text-white font-mono text-left animate-pulse p-8">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-white/5 rounded" />
          <div className="space-y-1.5">
            <div className="h-3 w-32 bg-white/5 rounded" />
            <div className="h-5 w-48 bg-white/5 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
          <div className="lg:col-span-2 bg-[#050505]/40 border border-white/5 rounded-xl animate-pulse" />
          <div className="bg-[#050505]/40 border border-white/5 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !activeTicket) {
    return (
      <div className="max-w-[600px] mx-auto my-12 p-8 rounded-xl border border-red-500/10 bg-red-500/[0.02] text-center space-y-4 font-mono">
        <ShieldAlert className="w-10 h-10 text-red-400 mx-auto animate-pulse" />
        <div className="space-y-1.5">
          <h4 className="text-sm font-bold text-red-400 uppercase tracking-wider">SECURE TUNNEL ATTESTATION FAILED</h4>
          <p className="text-xs text-white/45 leading-relaxed">{error || "Ticket not found inside the secure sandbox enclave."}</p>
        </div>
        <div className="flex items-center gap-3 justify-center pt-2">
          <button 
            onClick={() => router.push("/portal/support")} 
            className="px-4 h-9 rounded border border-white/10 hover:bg-white/5 text-[11px] text-white uppercase font-bold transition-all cursor-pointer flex items-center gap-1.5 font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Support Center</span>
          </button>
          <button 
            onClick={fetchTicket} 
            className="px-4 h-9 rounded border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-[11px] text-red-400 uppercase font-bold transition-all cursor-pointer flex items-center gap-1.5 font-mono"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Handshake</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto pb-12 text-white font-mono text-left">
      <div className="flex items-center gap-3">
        <button onClick={() => router.push("/portal/support")} className="p-1.5 rounded border border-white/5 bg-white/[0.01] hover:text-white cursor-pointer"><ArrowLeft className="w-4 h-4" /></button>
        <div>
          <span className="text-[10px] text-[#009DFF] bg-[#009DFF]/5 border border-[#009DFF]/20 px-2 py-0.5 rounded font-mono">ACTIVE SLA WIRE TUNNEL</span>
          <h2 className="text-xl font-bold tracking-tight uppercase font-sans">Audit Ticket: {ticketId}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
        <div className="lg:col-span-2 p-4 rounded-xl border border-white/10 bg-[#050505]/40 backdrop-blur-sm space-y-4 flex flex-col h-[500px] justify-between font-mono">
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            <p className="text-xs text-white/85 border-b border-white/5 pb-2 mb-2 font-mono">Diagnostic: {activeTicket.desc}</p>
            {activeTicket.replies?.map((r: any, idx: number) => (
              <div key={idx} className={`p-2.5 rounded border text-[10px] ${r.sender.includes("Client") ? "border-[#009DFF]/20 bg-[#009DFF]/5 ml-auto text-right font-mono" : "border-emerald-500/10 bg-emerald-500/[0.02] font-mono"}`}>
                <span className="font-bold text-[#009DFF] font-mono">{r.sender}</span>
                <p className="text-white/80 font-mono mt-1 leading-relaxed">{r.text}</p>
              </div>
            ))}
            {isReplying && (
              <div className="p-2.5 rounded border border-white/5 text-[9px] text-white/30 flex items-center gap-1.5 animate-pulse max-w-[80%] font-mono">
                <RefreshCw className="w-3 h-3 animate-spin text-emerald-400" />
                <span>Systems architect decoding signal...</span>
              </div>
            )}
          </div>
          <form onSubmit={handleSendReply} className="relative pt-2 border-t border-white/5 font-mono">
            <input value={replyText} disabled={isReplying} onChange={e => setReplyText(e.target.value)} placeholder="Type secured reply and press Enter..." className="w-full h-10 rounded bg-black/40 px-3 text-white text-[11px] outline-none border border-white/10 font-mono" />
          </form>
        </div>
        <div className="p-4 rounded-xl border border-white/5 bg-[#050505]/40 space-y-3 font-mono text-[11px]">
          <h3 className="font-bold border-b border-white/5 pb-1 flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-emerald-400" />Sovereign SLA Parameters</h3>
          <p>Priority: {activeTicket.priority?.toUpperCase()}</p>
          <p>Category: {activeTicket.category?.toUpperCase()}</p>
          <p>Enclave Status: Intel SGX Sealed</p>
          <div className="p-2.5 rounded bg-black/50 border border-white/5 text-[9px] text-white/50 leading-relaxed font-mono">
            <p className="font-bold text-[#009DFF]">Tunnel Signature</p>
            <span className="block truncate text-white/30">0xCRYPTOSIGN_L4_{activeTicket.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
