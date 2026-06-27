"use client";

import React from "react";
import { FolderOpen, ArrowUpRight } from "lucide-react";
import { WorkspaceCard } from "./cards-metrics-badges";

export function EmptyState({
  title = "No Core Records Found",
  desc,
  description = desc || "No active sandbox boundaries or telemetry events match the current query in this enclave.",
  actionLabel,
  onAction,
  icon: Icon = FolderOpen
}: {
  title?: string;
  desc?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <WorkspaceCard className="flex flex-col items-center justify-center text-center p-8 md:p-12 min-h-[320px] max-w-xl mx-auto space-y-5">
      <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/5 bg-white/[0.02] text-[#009DFF] shadow-[0_0_20px_rgba(0,157,255,0.05)] select-none">
        <Icon className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/20 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white/10"></span>
        </span>
      </div>

      <div className="space-y-1.5 select-none">
        <h4 className="text-[14px] font-bold font-mono tracking-wider uppercase text-white">
          {title}
        </h4>
        <p className="text-[11.5px] font-mono text-white/45 max-w-sm leading-relaxed mx-auto">
          {description}
        </p>
      </div>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="h-8 px-4 rounded bg-[#009DFF] hover:bg-[#0082d4] text-[10.5px] font-mono font-bold uppercase tracking-wider text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,157,255,0.15)]"
        >
          <span>{actionLabel}</span>
          <ArrowUpRight className="w-3 h-3" />
        </button>
      )}
    </WorkspaceCard>
  );
}

