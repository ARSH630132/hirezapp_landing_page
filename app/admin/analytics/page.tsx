"use client";

import React, { useState, useEffect } from "react";
import { BarChart3, RefreshCw, Cpu, Activity } from "lucide-react";

export default function AdminAnalyticsPage() {
  const [dataPoints, setDataPoints] = useState([45, 52, 48, 65, 58, 72, 69, 85, 78, 82]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDataPoints(prev => {
        const nextVal = Math.min(100, Math.max(30, prev[prev.length - 1] + (Math.floor(Math.random() * 16) - 8)));
        return [...prev.slice(1), nextVal];
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight font-mono uppercase">Global Analytics</h2>
        <p className="text-xs text-white/50 mt-1">Cross-cluster CPU thread streams, network latencies, and memory boundaries.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-5 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#009DFF]" />
              <h3 className="text-sm font-bold text-white font-mono uppercase">Global Active Threads Stream</h3>
            </div>
            <span className="text-[9px] font-mono text-emerald-400 font-bold bg-emerald-400/5 border border-emerald-400/20 px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
              LIVE TELEMETRY
            </span>
          </div>

          <div className="h-32 flex items-end justify-between gap-1 bg-black/40 border border-white/5 rounded-xl p-4 relative">
            <svg className="absolute inset-x-0 bottom-0 h-full w-full pointer-events-none" viewBox="0 0 500 120" preserveAspectRatio="none">
              <path
                d={`M ${dataPoints.map((val, idx) => `${idx * 55}, ${112 - (val * 0.9)}`).join(" L ")}`}
                fill="none"
                stroke="#009DFF"
                strokeWidth="2.5"
                className="transition-all duration-500 ease-in-out"
              />
              <circle
                cx="500"
                cy={112 - (dataPoints[dataPoints.length - 1] * 0.9)}
                r="4"
                className="fill-[#009DFF]"
              />
            </svg>
            <div className="absolute top-3 left-3 text-[10px] font-mono text-white/20 select-none">
              Cross-cluster Threads Load: {dataPoints[dataPoints.length - 1]}% CPU
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm space-y-4">
          <div className="flex items-center gap-1.5 border-b border-white/5 pb-2">
            <Cpu className="w-5 h-5 text-[#009DFF]" />
            <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">Cluster workloads</h3>
          </div>
          
          <div className="space-y-2.5 font-mono text-[11px] text-white/60">
            {[
              { label: "RETAIL-CORE-A1", usage: "42.1% CPU" },
              { label: "ORE-TUNNEL-X4", usage: "18.4% CPU" },
              { label: "GOV-SYSTEM-G2", usage: "89.2% CPU" },
              { label: "MED-CLINIC-H9", usage: "94.5% CPU (HIGH)" }
            ].map((cluster) => (
              <div key={cluster.label} className="flex justify-between border-b border-white/5 pb-2 last:border-b-0 last:pb-0">
                <span className="text-white font-bold">{cluster.label}</span>
                <span className="text-emerald-400 font-bold">{cluster.usage}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
