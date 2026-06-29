"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, ChevronDown, Layers, Shield, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { getPreviewSession, setPreviewSession, PreviewRole } from "@/lib/preview-auth";

export function RoleSwitcherPreview({
  currentRole,
  onRoleChange,
}: {
  currentRole: "Client" | "Administrator";
  onRoleChange: (role: "Client" | "Administrator") => void;
}) {
  const router = useRouter();
  const [activeRole, setActiveRole] = useState<PreviewRole>("client_admin");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const session = getPreviewSession();
    if (session) setActiveRole(session.role);
  }, []);

  const rolesList: { id: PreviewRole; label: string; clearance: string; icon: any; color: string }[] = [
    { id: "client_admin", label: "Client Admin", clearance: "L3", icon: Users, color: "text-cyan-400" },
    { id: "client_member", label: "Client Member", clearance: "L2", icon: Layers, color: "text-slate-300" },
    { id: "gff_admin", label: "GFF Admin", clearance: "L5", icon: Shield, color: "text-red-400" },
  ];

  const triggerSwitch = (role: PreviewRole) => {
    if (role === activeRole) return;
    setDropdownOpen(false);
    setActiveRole(role);
    setPreviewSession(role);
    onRoleChange(role.startsWith("client_") ? "Client" : "Administrator");
    router.push(role.startsWith("client_") ? "/portal/dashboard" : "/admin/dashboard");
  };

  const currentRoleObj = rolesList.find((role) => role.id === activeRole) || rolesList[0];
  const CurrentIcon = currentRoleObj.icon;

  return (
    <div className="relative font-mono select-none">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/5 bg-black/40 text-[10px] hover:border-white/10 transition-all cursor-pointer text-white/80 focus:outline-none focus:ring-1 focus:ring-[#009DFF]"
        aria-expanded={dropdownOpen}
        aria-haspopup="listbox"
        aria-label="Role selection"
      >
        <CurrentIcon className={`w-3.5 h-3.5 ${currentRoleObj.color}`} />
        <span className="font-bold hidden sm:inline">{currentRoleObj.label.toUpperCase()}</span>
        <span className="font-bold sm:hidden">{currentRoleObj.clearance}</span>
        <ChevronDown className="w-3 h-3 text-white/40 shrink-0" />
      </button>

      <AnimatePresence>
        {dropdownOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} aria-hidden="true" />
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              role="listbox"
              aria-label="Role list"
              className="absolute right-0 top-full mt-2 z-50 w-52 rounded-xl border border-white/5 bg-[#0a0a0a] p-1.5 shadow-2xl backdrop-blur-md"
              style={{ colorScheme: "dark" }}
            >
              <div className="px-2 py-1 text-[8px] font-bold text-white/30 uppercase border-b border-white/5 mb-1">
                MVP Roles
              </div>
              <div className="space-y-0.5">
                {rolesList.map((role) => {
                  const RoleIcon = role.icon;
                  const isSelected = activeRole === role.id;
                  return (
                    <button
                      key={role.id}
                      onClick={() => triggerSwitch(role.id)}
                      role="option"
                      aria-selected={isSelected}
                      className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left transition-colors cursor-pointer text-[10px] focus:outline-none focus:ring-1 focus:ring-[#009DFF] ${
                        isSelected ? "bg-white/5 text-[#009DFF]" : "text-white/60 hover:text-white hover:bg-white/[0.02]"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <RoleIcon className={`w-3.5 h-3.5 shrink-0 ${role.color}`} />
                        <span className="font-bold truncate">{role.label}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-[7px] text-white/30 px-1 border border-white/10 rounded-sm">{role.clearance}</span>
                        {isSelected && <Check className="w-3 h-3 text-[#009DFF]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
