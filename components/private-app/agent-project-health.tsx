"use client";

import React, { useState } from "react";
import { RefreshCw, Layers } from "lucide-react";
import { WorkspaceCard, StatusBadge } from "./cards-metrics-badges";
import { AgentSpec, ProjectSpec } from "./types";

// ==========================================
// 1. AGENT HEALTH CARD
// ==========================================
export function AgentHealthCard({ 
  agent,
  onRestart
}: { 
  agent: AgentSpec;
  onRestart?: () => void;
}) {
  const [rebooting, setRebooting] = useState(false);
  const [activeLogs, setActiveLogs] = useState<string[]>(agent.logs);

  const triggerReboot = () => {
    setRebooting(true);
    setActiveLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] INITIATING HARDWARE REBOOT SEQUENCE...`]);
    
    setTimeout(() => {
      setRebooting(false);
      setActiveLogs(prev => [
        ...prev, 
        `[${new Date().toLocaleTimeString()}] REBOOT COMPLETED SUCCESSFULLY`,
        `[${new Date().toLocaleTimeString()}] MEMORY SECTORS RE-ALIGNED`,
        `[${new Date().toLocaleTimeString()}] CRYPTOGRAPHIC BOUNDARY LOCK ESTABLISHED`
      ]);
      if (onRestart) onRestart();
    }, 1800);
  };

  return (
    <WorkspaceCard className="space-y-4">
      <div className="flex justify-between items-start border-b border-white/5 pb-3.5 select-none">
        <div>
          <span className="text-[9px] font-mono font-bold text-[#009DFF] bg-[#009DFF]/5 border border-[#009DFF]/20 px-1.5 py-0.5 rounded">
            AGENT DIAGNOSTIC
          </span>
          <h4 className="text-[14px] font-bold text-white font-mono mt-1.5">{agent.name}</h4>
        </div>
        <StatusBadge 
          state={rebooting ? "warning" : agent.status === "verified" ? "active" : "decoupled"} 
          label={rebooting ? "REBOOTING" : agent.status} 
        />
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-[11px] select-none">
        <div className="p-2.5 rounded border border-white/5 bg-white/[0.01]">
          <span className="text-white/35 block text-[9px] uppercase">Active Threads</span>
          <span className="text-white font-bold block mt-0.5">{agent.threads} CORE LOOPS</span>
        </div>
        <div className="p-2.5 rounded border border-white/5 bg-white/[0.01]">
          <span className="text-white/35 block text-[9px] uppercase">Context Cache</span>
          <span className="text-white font-bold block mt-0.5">{agent.memory}</span>
        </div>
      </div>

      <div className="border border-white/5 rounded-lg overflow-hidden bg-black/60 p-3 h-32 overflow-y-auto font-mono text-[10px] text-white/60 space-y-1">
        {activeLogs.map((log, idx) => (
          <div key={idx} className="leading-relaxed">
            <span className="text-white/30 mr-1.5 select-none">&gt;&gt;</span>
            <span className={log.includes("REBOOT") || log.includes("EXCHANGING") ? "text-[#009DFF] font-bold" : log.includes("SUCCESSFULLY") ? "text-emerald-400 font-bold" : ""}>
              {log}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button 
          onClick={triggerReboot}
          disabled={rebooting}
          className="flex-grow inline-flex h-8 items-center justify-center gap-1.5 rounded border border-white/10 bg-white/[0.01] text-[10.5px] font-bold text-white hover:bg-white/[0.04] hover:border-white/25 transition-all disabled:opacity-50 cursor-pointer select-none font-mono"
        >
          {rebooting ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#009DFF]" />
              <span>CYCLING HARDWARE...</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-3.5 h-3.5" />
              <span>RECYCLE CORE ENCLAVE</span>
            </>
          )}
        </button>
      </div>
    </WorkspaceCard>
  );
}

// ==========================================
// 2. PROJECT CARD
// ==========================================
export function ProjectCard({ 
  project 
}: { 
  project: ProjectSpec;
}) {
  return (
    <WorkspaceCard className="flex flex-col h-full justify-between">
      <div className="space-y-3">
        <div className="flex justify-between items-start select-none">
          <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Layers className="w-5 h-5" />
          </div>
          <StatusBadge state={project.status === "verified" ? "active" : "warning"} label={project.status} />
        </div>
        <div>
          <h4 className="text-[13.5px] font-bold text-white font-mono tracking-tight">{project.name.toUpperCase()}</h4>
          <p className="text-[11px] font-mono text-white/50 mt-1 leading-relaxed">{project.desc}</p>
        </div>
      </div>

      <div className="border-t border-white/5 pt-3 mt-4 space-y-2 font-mono text-[10.5px] select-none">
        <div className="flex justify-between">
          <span className="text-white/40">Registered Nodes:</span>
          <span className="text-white font-bold">{project.nodesCount} CLUSTERS</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/40">Sync State:</span>
          <span className="text-emerald-400 font-bold uppercase">Synced</span>
        </div>
        <div className="flex justify-between text-[9.5px] text-white/35 pt-1.5">
          <span>LAST COMPLIANCE RUN:</span>
          <span>{project.lastUpdated}</span>
        </div>
      </div>
    </WorkspaceCard>
  );
}
