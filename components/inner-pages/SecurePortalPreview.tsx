"use client";

import React, { useState } from "react";

export default function SecurePortalPreview() {
  const [locked, setLocked] = useState(true);

  return (
    <div className="w-full rounded-[24px] border border-white/5 bg-[#050505]/40 backdrop-blur-[12px] p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Abstract Locking & Core Panel */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <p className="text-[11px] font-bold tracking-[0.15em] text-[#E4000F] uppercase mb-4 text-center">
            Zero-Trust Sandbox Boundary
          </p>

          <div className="relative w-full aspect-square max-w-[280px] rounded-[24px] border border-white/5 bg-black/60 p-6 flex flex-col items-center justify-center overflow-hidden group">
            {/* Pulsing ambient circle glow */}
            <div className={`absolute w-[60%] h-[60%] rounded-full blur-[40px] opacity-20 transition-all duration-300 ${
              locked ? "bg-[#E4000F]" : "bg-green-500"
            }`} />

            {/* Glowing Interactive Lock (SVG) */}
            <svg 
              onClick={() => setLocked(!locked)} 
              className="w-[100px] h-[100px] cursor-pointer z-10 select-none group-hover:scale-105 transition-transform duration-300" 
              viewBox="0 0 100 100" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Lock arc */}
              <path 
                d="M30 45 L30 35 A20 20 0 0 1 70 35 L70 45" 
                stroke={locked ? "#E4000F" : "#22C55E"} 
                strokeWidth="6" 
                strokeLinecap="round" 
                className="transition-all duration-500"
                style={{ transform: locked ? "none" : "translateY(-6px) rotate(-8deg)" }}
              />
              {/* Lock body */}
              <rect x="20" y="45" width="60" height="42" rx="12" fill="#0A0A0C" stroke={locked ? "#E4000F" : "#22C55E"} strokeWidth="4" />
              {/* Key hole */}
              <circle cx="50" cy="62" r="6" fill={locked ? "#E4000F" : "#22C55E"} />
              <path d="M50 68 L50 78" stroke={locked ? "#E4000F" : "#22C55E"} strokeWidth="3" strokeLinecap="round" />
            </svg>

            <span className="mt-4 text-[11px] font-mono tracking-widest text-white/50 uppercase select-none">
              Status: <span className={locked ? "text-[#E4000F]" : "text-green-400"}>{locked ? "SANDBOX ENFORCED" : "KEYS ENGAGED"}</span>
            </span>
          </div>
        </div>

        {/* Security Parameters Column */}
        <div className="lg:col-span-6 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/5 pt-6 lg:pt-0 lg:pl-8 min-h-[220px]">
          <div>
            <span className="px-2 py-0.5 text-[9px] font-bold text-white/50 bg-white/5 rounded-full uppercase tracking-widest">
              Zero-Trust Audit Specs
            </span>
            <h4 className="mt-3 text-[18px] font-semibold text-white tracking-tight">
              Isolated Client Sandbox Portal
            </h4>
            <p className="mt-2 text-[13px] leading-[1.6] text-white/60 font-light">
              Secure administrative access is cryptographically decoupled from live production agents, ensuring an impenetrable boundary.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
              {[
                { label: "ENCRYPTION", value: "AES-256-GCM" },
                { label: "COMPLIANCE", value: "SOC2 Type II" },
                { label: "IP WHITELIST", value: "Enforced" },
                { label: "AUDITING", value: "eBPF Kernel Logs" },
              ].map((spec, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-[10px] text-white/40 uppercase tracking-wider">{spec.label}</span>
                  <span className="text-[13px] text-white font-medium mt-0.5">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
