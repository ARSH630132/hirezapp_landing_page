"use client";

import React from "react";
import { Clock, MessageSquare } from "lucide-react";
import { WorkspaceCard } from "./cards-metrics-badges";

export function SupportTicketCard({ 
  ticketId, 
  subject, 
  slaTimer, 
  priority = "P1", 
  status = "OPEN" 
}: { 
  ticketId: string; 
  subject: string; 
  slaTimer: string; 
  priority?: "P1" | "P2" | "P3";
  status?: string;
}) {
  return (
    <WorkspaceCard className="space-y-4 font-mono text-[11.5px]">
      <div className="flex justify-between items-start select-none">
        <div>
          <span className="text-[9.5px] text-[#009DFF] bg-[#009DFF]/10 border border-[#009DFF]/20 px-1.5 py-0.5 rounded font-bold">
            {ticketId}
          </span>
          <span className="ml-2 text-[9.5px] text-red-400 bg-red-400/10 border border-red-400/20 px-1.5 py-0.5 rounded font-bold">
            {priority} SLA
          </span>
        </div>
        <span className="text-[9.5px] text-white/35 uppercase tracking-widest">{status}</span>
      </div>

      <div>
        <h5 className="text-[12.5px] font-bold text-white leading-snug">{subject}</h5>
      </div>

      <div className="border-t border-white/5 pt-3.5 flex justify-between items-center select-none">
        <div className="flex items-center gap-1.5 text-white/40">
          <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>SLA EXPIRES IN:</span>
        </div>
        <span className="text-white font-bold font-mono text-[12px] text-amber-400">{slaTimer}</span>
      </div>

      <button className="w-full inline-flex h-8 items-center justify-center gap-1.5 rounded border border-white/10 bg-white/[0.01] text-[10.5px] font-bold text-white hover:bg-white/[0.04] hover:border-white/25 transition-all cursor-pointer select-none">
        <MessageSquare className="w-3.5 h-3.5 text-[#009DFF]" />
        <span>LAUNCH SECURE WIRE</span>
      </button>
    </WorkspaceCard>
  );
}
