"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, Lock, Terminal, Send, RefreshCw, X, ShieldCheck } from "lucide-react";
import { previewProjects, previewSupportTickets, SupportTicket } from "@/lib/mock-data-model";
import { StatusBadge } from "@/components/private-app";

export default function ClientSupportDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const ticketId = typeof id === "string" ? id : "";
  const [tickets, setTickets] = useState<any[]>([]);
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("gff_support_tickets");
      if (saved) setTickets(JSON.parse(saved));
    }
  }, []);

  const activeTicket = tickets.find(t => t.id === ticketId);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicket) return;
    const currentReply = replyText;
    setReplyText("");
    setIsReplying(true);
    const userReply = { sender: "Alexander Mercer (Client)", text: currentReply, timestamp: new Date().toISOString() };
    const updatedReplies = [...(activeTicket.replies || []), userReply];
    const updatedTickets = tickets.map(t => t.id === ticketId ? { ...t, replies: updatedReplies, status: "in_progress" } : t);
    setTickets(updatedTickets);
    localStorage.setItem("gff_support_tickets", JSON.stringify(updatedTickets));

    setTimeout(() => {
      const botReply = { sender: "GFF Support Sentinel", text: `Handshake acknowledged. Our systems engineers are reviewing your trace reports for ${activeTicket.category}.`, timestamp: new Date().toISOString() };
      const withBot = updatedTickets.map(t => t.id === ticketId ? { ...t, replies: [...updatedReplies, botReply] } : t);
      setTickets(withBot);
      localStorage.setItem("gff_support_tickets", JSON.stringify(withBot));
      setIsReplying(false);
    }, 1200);
  };

  if (!activeTicket) return <div className="text-white p-8 text-center font-mono">Loading enclave...</div>;

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
