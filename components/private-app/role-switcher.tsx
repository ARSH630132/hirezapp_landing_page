"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { RefreshCw, Check } from "lucide-react";

export function RoleSwitcherPreview({ 
  currentRole, 
  onRoleChange 
}: { 
  currentRole: "Client" | "Administrator";
  onRoleChange: (role: "Client" | "Administrator") => void;
}) {
  const [switching, setSwitching] = useState(false);
  const [scanStep, setScanStep] = useState(0);

  const triggerSwitch = (role: "Client" | "Administrator") => {
    if (role === currentRole) return;
    setSwitching(true);
    setScanStep(0);
    const interval = setInterval(() => {
      setScanStep(prev => {
        if (prev < 3) return prev + 1;
        return prev;
      });
    }, 350);

    setTimeout(() => {
      clearInterval(interval);
      setSwitching(false);
      onRoleChange(role);
    }, 1400);
  };

  return (
    <div className="relative">
      <div className="inline-flex rounded-lg border border-white/5 bg-black/40 p-0.5">
        <button 
          onClick={() => triggerSwitch("Client")}
          disabled={switching}
          className={`px-3 py-1 rounded-md text-[10.5px] font-mono tracking-wider transition-all cursor-pointer ${currentRole === "Client" ? "bg-white/10 text-white font-bold" : "text-white/40 hover:text-white/75"}`}
        >
          CLIENT
        </button>
        <button 
          onClick={() => triggerSwitch("Administrator")}
          disabled={switching}
          className={`px-3 py-1 rounded-md text-[10.5px] font-mono tracking-wider transition-all cursor-pointer ${currentRole === "Administrator" ? "bg-white/10 text-white font-bold" : "text-white/40 hover:text-white/75"}`}
        >
          ADMIN
        </button>
      </div>

      <AnimatePresence>
        {switching && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md"
          >
            <div className="w-80 p-6 rounded-2xl border border-white/10 bg-[#080808] text-center shadow-[0_0_50px_rgba(0,157,255,0.1)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#009DFF] via-purple-500 to-[#E4000F]" />
              <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center mx-auto mb-4 text-[#009DFF] animate-spin">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h4 className="text-[14px] font-bold font-mono tracking-widest text-white uppercase">RENEGOTIATING COMPLIANCE KEY</h4>
              <p className="text-[11px] font-mono text-white/45 mt-2">Isolating local thread stack and validating clearances...</p>
              
              <div className="mt-4 border border-white/5 rounded-lg p-2.5 bg-black/50 text-left font-mono text-[10px] space-y-1">
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className={scanStep >= 0 ? "text-emerald-400" : "text-white/30"}>Resetting core local memory stack</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {scanStep >= 1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <div className="h-1.5 w-1.5 rounded-full bg-[#009DFF] animate-ping mx-1" />}
                  <span className={scanStep >= 1 ? "text-emerald-400" : "text-white/30"}>Exchanging GFF_SHA256_PRIVATE_KEY</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {scanStep >= 2 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <div className="h-1.5 w-1.5 rounded-full bg-[#009DFF] mx-1" />}
                  <span className={scanStep >= 2 ? "text-emerald-400" : "text-white/30"}>Compiling role permissions</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
