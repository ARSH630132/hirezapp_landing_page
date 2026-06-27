"use client";

import React, { useState, useEffect } from "react";
import { BarChart3, RefreshCw, Cpu, Activity } from "lucide-react";

export default function ClientAnalyticsPage() {
  const [dataPoints, setDataPoints] = useState([35, 42, 38, 48, 52, 45, 58, 62, 59, 64]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDataPoints(prev => {
        const nextVal = Math.min(100, Math.max(20, prev[prev.length - 1] + (Math.floor(Math.random() * 14) - 7)));
        return [...prev.slice(1), nextVal];
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight font-mono uppercase">Telemetry Analytics</h2>
        <p className="text-xs text-white/50 mt-1">Real-time thread spends, hardware workloads, and eBPF network pings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-5 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#009DFF]" />
              <h3 className="text-sm font-bold text-white font-mono uppercase">Enclave CPU Load Stream</h3>
            </div>
            <span className="text-[9px] font-mono text-emerald-400 font-bold bg-emerald-400/5 border border-emerald-400/20 px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
              LIVE BROADCAST
            </span>
          </div>

          <div className="h-32 flex items-end justify-between gap-1 bg-black/40 border border-white/5 rounded-xl p-4 relative">
            {/* SVG graph line */}
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
              Mean Sandbox CPU: {dataPoints[dataPoints.length - 1]}%
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm space-y-4">
          <div className="flex items-center gap-1.5 border-b border-white/5 pb-2">
            <Cpu className="w-5 h-5 text-[#009DFF]" />
            <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">Network Latencies</h3>
          </div>
          
          <div className="space-y-2 font-mono text-[11px] text-white/60">
            {[
              { hash: "f3a8b291c9", label: "Singapore Zone A", ping: "4ms" },
              { hash: "e88d123880", label: "London Zone C", ping: "3ms" },
              { hash: "a01fe99211", label: "Local Enclave Mesh", ping: "5ms" }
            ].map((node) => (
              <div key={node.hash} className="flex justify-between border-b border-white/5 pb-2 last:border-b-0 last:pb-0">
                <div>
                  <span className="text-white block font-bold">{node.label}</span>
                  <span className="text-[9px] text-[#009DFF]/60 block">{node.hash}</span>
                </div>
                <span className="text-emerald-400 font-bold text-xs">{node.ping}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
