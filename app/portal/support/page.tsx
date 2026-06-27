"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SupportTicketCard } from "@/components/private-app";
import { ArrowRight, MessageSquare } from "lucide-react";

export default function ClientSupportPage() {
  const [tickets, setTickets] = useState<{
    id: string;
    subject: string;
    slaTimer: string;
    priority: "P1" | "P2" | "P3";
    status: string;
  }[]>([
    { id: "T-882", subject: "London core replication delay", slaTimer: "01:45:12", priority: "P1", status: "OPEN" },
    { id: "T-883", subject: "Sovereign HSM Key expired warning", slaTimer: "04:12:00", priority: "P2", status: "RESOLVED" }
  ]);
  const [newSubject, setNewSubject] = useState("");

  const handleAddTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim()) return;
    setTickets([
      ...tickets,
      {
        id: "T-" + Math.floor(100 + Math.random() * 900),
        subject: newSubject,
        slaTimer: "08:00:00",
        priority: "P3" as const,
        status: "SUBMITTED"
      }
    ]);
    setNewSubject("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight font-mono uppercase">Secure Support Wire</h2>
        <p className="text-xs text-white/50 mt-1">Communicate directly with our systems engineers through a secure decoupled loop.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <div className="p-5 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-2">
            <MessageSquare className="w-5 h-5 text-[#009DFF]" />
            <h3 className="text-sm font-bold text-white font-mono uppercase">Launch New Support Wire</h3>
          </div>
          <form onSubmit={handleAddTicket} className="space-y-3">
            <input
              required
              placeholder="Enter technical query or ticket subject..."
              value={newSubject}
              onChange={e => setNewSubject(e.target.value)}
              className="w-full h-10 rounded-lg border border-white/10 bg-black/40 px-4 text-white text-[12.5px] outline-none font-mono focus:border-[#009DFF]/30"
            />
            <button type="submit" className="w-full h-10 rounded bg-white hover:bg-white/90 text-black font-semibold text-xs tracking-wider uppercase cursor-pointer">
              Submit Secure Wire
            </button>
          </form>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-white/40 font-mono uppercase tracking-wider">Active Priority Wires</h3>
          <div className="grid grid-cols-1 gap-4">
            {tickets.map((t) => (
              <div key={t.id} className="relative">
                <SupportTicketCard
                  ticketId={t.id}
                  subject={t.subject}
                  slaTimer={t.slaTimer}
                  priority={t.priority}
                  status={t.status}
                />
                <div className="absolute top-4 right-16 z-20">
                  <Link
                    href={`/portal/support/${t.id}`}
                    className="inline-flex h-6 items-center gap-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 px-2 text-[9.5px] font-bold font-mono text-white/80 transition-all cursor-pointer"
                  >
                    <span>view</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
