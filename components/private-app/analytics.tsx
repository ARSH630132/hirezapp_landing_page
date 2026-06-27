"use client";

import React, { useState, useEffect } from "react";
import { WorkspaceCard } from "./cards-metrics-badges";

export function AnalyticsPanel() {
  const [computeUsage, setComputeUsage] = useState<number[]>([32, 45, 38, 52, 48, 65, 58, 72, 69, 85, 78, 82]);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setComputeUsage(prev => {
        const nextVal = Math.min(100, Math.max(10, prev[prev.length - 1] + (Math.floor(Math.random() * 12) - 6)));
        return [...prev.slice(1), nextVal];
      });
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const width = 600;
  const height = 180;
  const max = Math.max(...computeUsage);
  const min = Math.min(...computeUsage);
  const range = max - min || 1;

  const areaPoints = [
    `0,${height}`,
    ...computeUsage.map((val, idx) => {
      const x = (idx / (computeUsage.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 24) - 12;
      return `${x},${y}`;
    }),
    `${width},${height}`
  ].join(" ");

  const linePoints = computeUsage.map((val, idx) => {
    const x = (idx / (computeUsage.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 24) - 12;
    return `${x},${y}`;
  }).join(" ");

  return (
    <WorkspaceCard className="space-y-5">
      <div className="flex flex-wrap justify-between items-start gap-4 select-none">
        <div>
          <h4 className="text-[14px] font-bold text-white font-mono tracking-wider uppercase">Enclave Computing Matrix</h4>
          <p className="text-[11px] font-mono text-white/45 mt-1">Sovereign thread capacity and memory boundaries over active epoch.</p>
        </div>
        <div className="flex gap-4 font-mono text-[11px]">
          <div>
            <span className="text-white/30 block text-[9.5px] uppercase">Peak Load</span>
            <span className="text-white font-bold">{max}%</span>
          </div>
          <div>
            <span className="text-white/30 block text-[9.5px] uppercase">Base Load</span>
            <span className="text-white font-bold">{min}%</span>
          </div>
          <div>
            <span className="text-white/30 block text-[9.5px] uppercase">State Cache</span>
            <span className="text-emerald-400 font-bold">100% SECURE</span>
          </div>
        </div>
      </div>

      <div className="relative w-full overflow-hidden select-none">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible" preserveAspectRatio="none">
          {[0.25, 0.5, 0.75].map((pct, idx) => (
            <line 
              key={idx}
              x1="0" y1={height * pct} x2={width} y2={height * pct}
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          ))}
          <polygon 
            fill="url(#sparkGradient)" 
            points={areaPoints} 
            className="transition-all duration-500"
          />
          <polyline 
            fill="none" 
            stroke="#009DFF" 
            strokeWidth="2" 
            points={linePoints} 
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-500"
          />
          <polyline 
            fill="none" 
            stroke="#009DFF" 
            strokeWidth="6" 
            points={linePoints} 
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-15 blur-sm transition-all duration-500"
          />

          <defs>
            <linearGradient id="sparkGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#009DFF" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#009DFF" stopOpacity="0.00" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="flex justify-between items-center text-[10px] font-mono text-white/30 pt-2 border-t border-white/5 select-none">
        <span>EPOCH ACTIVE: 14:22:00 -&gt; PRESENT</span>
        <span>TELEMETRY POLLING INTERVAL: 2000MS</span>
      </div>
    </WorkspaceCard>
  );
}
