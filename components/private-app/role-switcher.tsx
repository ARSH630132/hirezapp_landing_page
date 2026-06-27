"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { RefreshCw, Check, ChevronDown, Shield, Cpu, Layers, Users, FileText, Eye, HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { getPreviewSession, setPreviewSession, PreviewRole } from "@/lib/preview-auth";

export function RoleSwitcherPreview({ 
  currentRole, 
  onRoleChange 
}: { 
  currentRole: "Client" | "Administrator";
  onRoleChange: (role: "Client" | "Administrator") => void;
}) {
  const router = useRouter();
  const [activeRole, setActiveRole] = useState<PreviewRole>("client_admin");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [scanStep, setScanStep] = useState(0);

  useEffect(() => {
    const s = getPreviewSession();
    if (s) setActiveRole(s.role);
  }, []);

  const rolesList: { id: PreviewRole; label: string; clearance: string; icon: any; color: string }[] = [
    { id: "client_admin", label: "Client Admin", clearance: "L3", icon: Users, color: "text-cyan-400" },
    { id: "client_member", label: "Client Member", clearance: "L2", icon: Layers, color: "text-slate-400" },
    { id: "gff_admin", label: "GFF Admin", clearance: "L5", icon: Shield, color: "text-red-400" },
    { id: "gff_operator", label: "GFF Operator", clearance: "L4", icon: Cpu, color: "text-purple-400" },
    { id: "finance_admin", label: "Finance Admin", clearance: "L3", icon: FileText, color: "text-emerald-400" },
    { id: "support_agent", label: "Support Agent", clearance: "L3", icon: HelpCircle, color: "text-orange-400" },
    { id: "viewer", label: "Global Auditor", clearance: "L1", icon: Eye, color: "text-gray-400" },
  ];

  const triggerSwitch = (role: PreviewRole) => {
    if (role === activeRole) return;
    setDropdownOpen(false);
    setSwitching(true);
    setScanStep(0);
    const interval = setInterval(() => setScanStep(p => p < 3 ? p + 1 : p), 200);

    setTimeout(() => {
      clearInterval(interval);
      setSwitching(false);
      setActiveRole(role);
      setPreviewSession(role);
      onRoleChange(role.startsWith("client_") ? "Client" : "Administrator");
      router.push(role.startsWith("client_") ? "/portal/dashboard" : "/admin/dashboard");
    }, 800);
  };

  const currentRoleObj = rolesList.find(r => r.id === activeRole) || rolesList[0];
  const CurrentIcon = currentRoleObj.icon;

  return (
    <div className="relative font-mono select-none">
      <button onClick={() => setDropdownOpen(!dropdownOpen)} disabled={switching} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/5 bg-black/40 text-[10px] hover:border-white/10 transition-all cursor-pointer text-white/80">
        <CurrentIcon className={`w-3.5 h-3.5 ${currentRoleObj.color}`} />
        <span className="font-bold hidden sm:inline">{currentRoleObj.label.toUpperCase()}</span>
        <span className="font-bold sm:hidden">{currentRoleObj.clearance}</span>
        <ChevronDown className="w-3 h-3 text-white/40 shrink-0" />
      </button>

      <AnimatePresence>
        {dropdownOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="absolute right-0 top-full mt-2 z-50 w-52 rounded-xl border border-white/5 bg-[#0a0a0a] p-1.5 shadow-2xl backdrop-blur-md">
              <div className="px-2 py-1 text-[8px] font-bold text-white/30 uppercase border-b border-white/5 mb-1">Simulated Clearances</div>
              <div className="space-y-0.5">
                {rolesList.map((r) => {
                  const RoleIcon = r.icon;
                  const isSel = activeRole === r.id;
                  return (
                    <button key={r.id} onClick={() => triggerSwitch(r.id)} className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left transition-colors cursor-pointer text-[10px] ${isSel ? "bg-white/5 text-[#009DFF]" : "text-white/60 hover:text-white hover:bg-white/[0.02]"}`}>
                      <div className="flex items-center gap-2 truncate">
                        <RoleIcon className={`w-3.5 h-3.5 shrink-0 ${r.color}`} />
                        <span className="font-bold truncate">{r.label}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-[7px] text-white/30 px-1 border border-white/10 rounded-sm">{r.clearance}</span>
                        {isSel && <Check className="w-3 h-3 text-[#009DFF]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {switching && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md">
            <div className="w-80 p-5 rounded-2xl border border-white/10 bg-[#080808] text-center shadow-2xl relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#009DFF]" />
              <RefreshCw className="w-5 h-5 text-[#009DFF] animate-spin mx-auto mb-3" />
              <h4 className="text-[11px] font-bold tracking-widest text-white uppercase">RENEGOTIATING COMPLIANCE KEY</h4>
              <p className="text-[9px] text-white/45 mt-1">Isolating local thread stack and validating clearances...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
