"use client";

import React from "react";
import { Terminal, ArrowRight, Lock, Cpu, FileText, Activity, Check, Clock } from "lucide-react";
import { ActivityItem, TimelineStep } from "./types";

// ==========================================
// 2. ACTIVITY FEED
// ==========================================
export function ActivityFeed({ 
  items 
}: { 
  items: ActivityItem[];
}) {
  const getIcon = (cat: string) => {
    switch (cat) {
      case "security": return <Lock className="w-3.5 h-3.5 text-[#009DFF]" />;
      case "compile": return <Cpu className="w-3.5 h-3.5 text-indigo-400" />;
      case "ledger": return <FileText className="w-3.5 h-3.5 text-emerald-400" />;
      default: return <Activity className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-3.5">
      {items.map((item) => (
        <div key={item.id} className="flex gap-3 items-start group">
          <div className="p-1.5 rounded-lg border border-white/5 bg-white/[0.02] mt-0.5 shrink-0 group-hover:border-white/15 transition-all">
            {getIcon(item.category)}
          </div>
          <div className="flex-grow pb-3.5 border-b border-white/5 last:border-0">
            <div className="flex flex-wrap justify-between items-baseline gap-2 select-none">
              <span className="text-[12px] font-bold text-white group-hover:text-[#009DFF] transition-colors">{item.title}</span>
              <span className="text-[9px] font-mono text-white/35">{item.timestamp}</span>
            </div>
            <p className="text-[11px] font-mono text-white/50 mt-1 leading-relaxed">{item.desc}</p>
            {item.meta && (
              <span className="mt-1.5 inline-block text-[9.5px] font-mono text-white/30 bg-white/[0.01] border border-white/5 rounded px-1.5 py-0.5 select-none">
                HASH: {item.meta}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ==========================================
// 3. TIMELINE
// ==========================================
export function Timeline({ 
  steps 
}: { 
  steps: TimelineStep[];
}) {
  return (
    <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-white/5 select-none">
      {steps.map((step, idx) => (
        <div key={idx} className="flex gap-4 relative">
          <div className="relative z-10 shrink-0">
            {step.status === "complete" && (
              <div className="h-6 w-6 rounded-full border border-emerald-500/30 bg-emerald-950/20 flex items-center justify-center text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.2)]">
                <Check className="w-3.5 h-3.5" />
              </div>
            )}
            {step.status === "current" && (
              <div className="h-6 w-6 rounded-full border border-[#009DFF]/30 bg-[#009DFF]/10 flex items-center justify-center text-[#009DFF] shadow-[0_0_8px_rgba(0,157,255,0.2)] animate-pulse">
                <Clock className="w-3.5 h-3.5" />
              </div>
            )}
            {step.status === "pending" && (
              <div className="h-6 w-6 rounded-full border border-white/10 bg-white/[0.01] flex items-center justify-center text-white/20">
                <div className="h-1.5 w-1.5 rounded-full bg-white/10" />
              </div>
            )}
          </div>

          <div className="flex-grow pt-0.5">
            <div className="flex justify-between items-baseline gap-2">
              <h5 className={`text-[12.5px] font-mono font-bold ${step.status === "complete" ? "text-white" : step.status === "current" ? "text-[#009DFF]" : "text-white/40"}`}>
                {step.title.toUpperCase()}
              </h5>
              {step.timestamp && (
                <span className="text-[9px] font-mono text-white/30">{step.timestamp}</span>
              )}
            </div>
            <p className="text-[11px] font-mono text-white/45 mt-1 leading-relaxed max-w-lg">{step.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
