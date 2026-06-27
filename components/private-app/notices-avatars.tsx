"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UserProfile } from "./types";
import { useRouter } from "next/navigation";
import { clearPreviewSession } from "@/lib/preview-auth";

// ==========================================
// 1. SECURE PREVIEW NOTICE
// ==========================================
export function SecurePreviewNotice({ className = "" }: { className?: string }) {
  return (
    <div className={`relative w-full overflow-hidden border-b border-amber-500/10 bg-amber-950/20 px-4 py-2 text-center backdrop-blur-sm ${className}`}>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(245,158,11,0.02),transparent_50%,rgba(245,158,11,0.02))]" />
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-2.5 text-[11px] font-mono tracking-wider text-amber-400">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        </span>
        <span className="font-bold uppercase">ZERO-TRUST SANDBOX ENCLAVE</span>
        <span className="hidden md:inline text-white/30">•</span>
        <span className="text-white/70">Cryptographically isolated preview environment. State alterations are simulated local loops.</span>
      </div>
    </div>
  );
}

// ==========================================
// 2. USER AVATAR
// ==========================================
export function UserAvatar({ 
  user, 
  showDetails = false 
}: { 
  user: UserProfile; 
  showDetails?: boolean;
}) {
  const [showCard, setShowCard] = useState(false);
  const router = useRouter();

  return (
    <div className="relative">
      <button 
        onClick={() => setShowCard(!showCard)}
        className="flex items-center gap-3 text-left focus:outline-none focus:ring-1 focus:ring-[#009DFF]/40 rounded-lg p-1.5 transition-colors hover:bg-white/[0.03] group cursor-pointer"
        aria-label="User profile settings"
      >
        <div className="relative h-9 w-9 shrink-0 rounded-full border border-white/10 bg-white/[0.02] flex items-center justify-center font-mono text-[12px] font-bold text-[#009DFF] group-hover:border-[#009DFF]/30 transition-all shadow-[0_0_15px_rgba(0,157,255,0.05)]">
          {user.name.split(" ").map(n => n[0]).join("")}
          <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-[#050505] bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
        </div>
        {showDetails && (
          <div className="hidden md:block select-none font-sans">
            <div className="text-[12.5px] font-bold text-white leading-tight group-hover:text-[#009DFF] transition-colors">{user.name}</div>
            <div className="text-[10px] font-mono text-white/45 mt-0.5">{user.clearance}</div>
          </div>
        )}
      </button>

      <AnimatePresence>
        {showCard && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowCard(false)} />
            <motion.div 
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 z-50 w-64 rounded-xl border border-white/5 bg-[#0a0a0a] p-4 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-md"
            >
              <div className="border-b border-white/5 pb-3 font-sans">
                <div className="text-[13px] font-bold text-white">{user.name}</div>
                <div className="text-[11px] text-white/50 font-mono mt-0.5">{user.email}</div>
                <div className="mt-2 inline-flex items-center gap-1.5 rounded bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase text-emerald-400">
                  {user.clearance}
                </div>
              </div>
              <div className="py-2 space-y-1 text-[11.5px] font-mono">
                <div className="flex justify-between items-center px-2 py-1.5 text-white/60">
                  <span>Authorized:</span>
                  <span className="text-white font-bold">{user.role}</span>
                </div>
                <div className="flex justify-between items-center px-2 py-1.5 text-white/60">
                  <span>Latency:</span>
                  <span className="text-emerald-400 font-bold">14ms</span>
                </div>
                <div className="flex justify-between items-center px-2 py-1.5 text-white/60">
                  <span>Enclave:</span>
                  <span className="text-white/40">GFF_0x7FFA</span>
                </div>
              </div>

              <div className="border-t border-white/5 pt-3 mt-1.5">
                <button
                  onClick={() => {
                    clearPreviewSession();
                    setShowCard(false);
                    router.push("/login");
                  }}
                  className="w-full h-8 rounded-lg bg-red-950/15 hover:bg-red-950/30 border border-red-500/10 hover:border-red-500/20 text-red-400 font-mono text-[9px] uppercase font-bold tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  Deauthenticate Session
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
