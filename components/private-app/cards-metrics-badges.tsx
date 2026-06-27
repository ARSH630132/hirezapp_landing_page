"use client";

import React, { useState, useRef } from "react";
import { BadgeState } from "./types";

// ==========================================
// 1. WORKSPACE CARD
// ==========================================
export function WorkspaceCard({ 
  children, 
  className = "",
  spotlightColor = "rgba(0,157,255,0.05)"
}: { 
  children: React.ReactNode; 
  className?: string;
  spotlightColor?: string;
}) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div 
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden rounded-2xl border border-white/5 bg-[#050505]/30 backdrop-blur-sm p-5 transition-all hover:border-white/10 ${className}`}
    >
      <div 
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(350px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// ==========================================
// 2. METRIC TILE
// ==========================================
export function MetricTile({ 
  title, 
  value, 
  delta, 
  direction, 
  status = "stable", 
  sparkPoints = [30, 40, 35, 50, 45, 60, 55, 70, 65, 80]
}: { 
  title: string; 
  value: string; 
  delta: string; 
  direction: "up" | "down" | "neutral"; 
  status?: "normal" | "warning" | "error" | "stable";
  sparkPoints?: number[];
}) {
  const width = 120;
  const height = 40;
  const maxVal = Math.max(...sparkPoints);
  const minVal = Math.min(...sparkPoints);
  const range = maxVal - minVal || 1;

  const points = sparkPoints.map((val, idx) => {
    const x = (idx / (sparkPoints.length - 1)) * width;
    const y = height - ((val - minVal) / range) * (height - 8) - 4;
    return `${x},${y}`;
  }).join(" ");

  const deltaColor = direction === "up" ? "text-emerald-400" : direction === "down" ? "text-[#E4000F]" : "text-white/40";
  const strokeColor = direction === "up" ? "#10b981" : direction === "down" ? "#E4000F" : "#009DFF";

  return (
    <WorkspaceCard className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1">
        <span className="text-[10.5px] font-mono tracking-widest text-white/35 uppercase block">{title}</span>
        <div className="text-[22px] font-bold tracking-tight text-white">{value}</div>
        <div className="flex items-center gap-1.5 text-[11px] font-mono leading-none">
          <span className={`font-bold ${deltaColor}`}>
            {direction === "up" ? "+" : ""}{delta}
          </span>
          <span className="text-white/20">•</span>
          <span className="text-white/40 uppercase text-[9.5px]">vs last cycle</span>
        </div>
      </div>

      <div className="flex flex-col items-end shrink-0 select-none">
        <svg width={width} height={height} className="overflow-visible">
          <polyline 
            fill="none" 
            stroke={strokeColor} 
            strokeWidth="1.5" 
            points={points} 
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-500"
          />
          <polyline 
            fill="none" 
            stroke={strokeColor} 
            strokeWidth="4" 
            points={points} 
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-15 blur-sm transition-all duration-500"
          />
        </svg>
        <div className="mt-1 flex items-center gap-1">
          <span className={`h-1.5 w-1.5 rounded-full ${
            status === "normal" ? "bg-emerald-500" :
            status === "warning" ? "bg-amber-400" :
            status === "error" ? "bg-[#E4000F]" : "bg-[#009DFF]"
          }`} />
          <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">{status}</span>
        </div>
      </div>
    </WorkspaceCard>
  );
}

// ==========================================
// 3. STATUS BADGE
// ==========================================
export function StatusBadge({ 
  state, 
  label 
}: { 
  state: BadgeState; 
  label: string;
}) {
  const styles = {
    active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
    warning: "bg-amber-400/10 text-amber-400 border-amber-400/25",
    error: "bg-red-500/10 text-red-400 border-red-500/25",
    stable: "bg-[#009DFF]/10 text-[#009DFF] border-[#009DFF]/25",
    decoupled: "bg-white/5 text-white/50 border-white/10"
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-[10px] font-mono font-bold uppercase border ${styles[state]}`}>
      {state === "active" && (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
        </span>
      )}
      <span>{label}</span>
    </span>
  );
}
