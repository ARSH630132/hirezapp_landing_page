"use client";

import React, { useState } from "react";
import { MessageSquare } from "lucide-react";
import { DataTable, previewSupportTickets, TableColumn, SupportTicket } from "@/components/private-app";

export default function ClientSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>(previewSupportTickets);
  const [newSubject, setNewSubject] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const handleAddTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim()) return;
    
    const newTicket: SupportTicket = {
      id: `SLA-TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newSubject,
      status: "open",
      priority: "high",
      createdAt: new Date().toISOString(),
      desc: newDesc || "No additional logs provided.",
      replies: []
    };

    setTickets([newTicket, ...tickets]);
    setNewSubject("");
    setNewDesc("");
  };

  const columns: TableColumn<SupportTicket>[] = [
    { key: "id", header: "Ticket ID", sortable: true },
    { key: "title", header: "Subject", sortable: true },
    { key: "priority", header: "Priority", sortable: true },
    { key: "createdAt", header: "Created At" },
    { key: "status", header: "Status", sortable: true }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight font-mono uppercase">Secure Support Wire</h2>
        <p className="text-xs text-white/50 mt-1">Communicate directly with GFF core systems engineers through hardware-isolated zero-trust support logs.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 pt-2">
        <div className="xl:col-span-1 p-5 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm space-y-4 h-fit">
          <div className="flex items-center gap-2 border-b border-white/5 pb-2">
            <MessageSquare className="w-5 h-5 text-[#009DFF]" />
            <h3 className="text-sm font-bold text-white font-mono uppercase">Launch New Support Wire</h3>
          </div>
          <form onSubmit={handleAddTicket} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase text-white/40 font-bold">Ticket Subject</label>
              <input
                required
                placeholder="Enter summary (e.g. key replication delay)..."
                value={newSubject}
                onChange={e => setNewSubject(e.target.value)}
                className="w-full h-10 rounded-lg border border-white/10 bg-black/40 px-4 text-white text-[12px] outline-none font-mono focus:border-[#009DFF]/30"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase text-white/40 font-bold">Detailed Telemetry Diagnostics</label>
              <textarea
                placeholder="Paste enclave error codes or describe boundary issues..."
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
                className="w-full h-24 rounded-lg border border-white/10 bg-black/40 p-4 text-white text-[12px] outline-none font-mono focus:border-[#009DFF]/30 resize-none"
              />
            </div>

            <button type="submit" className="w-full h-10 rounded bg-white hover:bg-white/90 text-black font-semibold text-xs tracking-wider uppercase transition-all cursor-pointer">
              Submit Secure Wire
            </button>
          </form>
        </div>

        <div className="xl:col-span-2 space-y-4">
          <DataTable 
            columns={columns}
            data={tickets}
            pageSize={5}
            searchPlaceholder="Search secure wires by subject or ID..."
            searchKeys={["id", "title", "priority", "status"]}
            statusField="status"
            typeField="priority"
            categoryLabel="SUPPORT HANDSHAKE"
            detailTitle={(row) => `Wire: ${row.id}`}
            renderDetail={(row) => (
              <div className="space-y-5 font-mono text-[11.5px]">
                <div className="p-4 rounded-lg border border-white/5 bg-[#020202]/40 space-y-2">
                  <span className="text-white/30 text-[9px] uppercase font-bold">Diagnostic Subject</span>
                  <p className="text-white font-bold text-[13px]">{row.title}</p>
                </div>
                
                <div className="p-4 rounded-lg border border-white/5 bg-[#020202]/40 space-y-2">
                  <span className="text-white/30 text-[9px] uppercase font-bold">Detailed Wire Description</span>
                  <p className="text-white/75 leading-relaxed">{row.desc}</p>
                </div>

                <div className="p-4 rounded-lg border border-white/5 bg-[#020202]/40 space-y-2">
                  <span className="text-white/30 text-[9px] uppercase font-bold">Wire Parameters</span>
                  <div className="grid grid-cols-2 gap-2 text-[10.5px]">
                    <div className="flex justify-between"><span className="text-white/40">Priority:</span><span className="text-amber-400 font-bold">{row.priority.toUpperCase()}</span></div>
                    <div className="flex justify-between"><span className="text-white/40">Status:</span><span className="text-[#00FFC2] font-bold">{row.status.toUpperCase()}</span></div>
                    <div className="flex justify-between col-span-2 pt-1 border-t border-white/5"><span className="text-white/40">Created:</span><span className="text-white/60">{new Date(row.createdAt).toLocaleDateString()}</span></div>
                  </div>
                </div>

                {row.replies && row.replies.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-bold tracking-widest text-white/40 uppercase">Secured Reply Thread</h4>
                    <div className="space-y-2.5">
                      {row.replies.map((reply, idx) => (
                        <div key={idx} className="p-3 rounded-lg border border-white/5 bg-[#020202]/80 space-y-1">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="text-[#009DFF] font-bold">{reply.sender}</span>
                            <span className="text-white/30">{reply.timestamp}</span>
                          </div>
                          <p className="text-white/80 leading-relaxed text-[11px]">{reply.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
}
