"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Lock, ChevronRight, ChevronDown, Menu, 
  Building2, Check, Globe, Shield, RefreshCw, LogOut 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SidebarLink, UserProfile, BreadcrumbItem } from "./types";
import { WorkspaceBreadcrumbs, WorkspaceCommandButton } from "./navigation";
import { RoleSwitcherPreview } from "./role-switcher";
import { NotificationBell } from "./notifications";
import { UserAvatar } from "./notices-avatars";
import { clearPreviewSession } from "@/lib/preview-auth";

// Define logical grouping for links
interface LinkGroup {
  name: string;
  linkIds: string[];
}

const clientGroups: LinkGroup[] = [
  { name: "CORE OVERSIGHT", linkIds: ["dashboard"] },
  { name: "OPERATIONS & INTEL", linkIds: ["projects", "ai-operations", "documents"] },
  { name: "TELEMETRY & POLICIES", linkIds: ["analytics", "governance", "activity"] },
  { name: "ADMIN & SETTINGS", linkIds: ["billing", "support", "settings"] },
];

const adminGroups: LinkGroup[] = [
  { name: "CORE OVERSIGHT", linkIds: ["dashboard"] },
  { name: "REGISTRY & USERS", linkIds: ["clients", "projects", "users"] },
  { name: "OPERATIONS & CONTROL", linkIds: ["ai-operations", "documents"] },
  { name: "TELEMETRY & AUDIT", linkIds: ["analytics", "governance", "activity"] },
  { name: "SYSTEM CONFIG", linkIds: ["billing", "support", "settings"] },
];


// ==========================================
// 1. PRIVATE SIDEBAR
// ==========================================
export function PrivateSidebar({ 
  links,
  activeLink,
  onLinkChange,
  collapsed,
  onToggleCollapse,
  role
}: { 
  links: SidebarLink[];
  activeLink: string;
  onLinkChange: (id: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  user: UserProfile;
  role: "Client" | "Administrator";
}) {
  const [activeOrg, setActiveOrg] = useState(role === "Client" ? "Apex Sovereign" : "Global Oversight");
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
  const [isSwitchingOrg, setIsSwitchingOrg] = useState(false);

  // Sync active organization if role changes
  useEffect(() => {
    setActiveOrg(role === "Client" ? "Apex Sovereign" : "Global Oversight");
  }, [role]);

  const clientOrgs = [
    { name: "Apex Sovereign", id: "apex", label: "Production Enclave" },
    { name: "Alpha Sandbox Lab", id: "alpha", label: "Staging Sandbox" },
    { name: "Omega Beta Enclave", id: "omega", label: "Compliance Test" },
  ];

  const adminOrgs = [
    { name: "Global Oversight", id: "global", label: "Primary Enclave" },
    { name: "Defense Sector Enclave", id: "defense", label: "MIL-SPEC Tunnel" },
    { name: "Finance Sandbox", id: "finance", label: "FinReg Isolation" },
  ];

  const orgsList = role === "Client" ? clientOrgs : adminOrgs;
  const groups = role === "Client" ? clientGroups : adminGroups;

  const handleOrgChange = (name: string) => {
    if (name === activeOrg) return;
    setOrgDropdownOpen(false);
    setIsSwitchingOrg(true);
    setTimeout(() => {
      setActiveOrg(name);
      setIsSwitchingOrg(false);
    }, 600);
  };


  return (
    <aside 
      className={`hidden lg:flex flex-col h-screen shrink-0 border-r border-white/5 bg-[#050505]/65 backdrop-blur-md select-none transition-all duration-300 ${collapsed ? "w-20" : "w-64"}`}
    >
      <div className="h-14 border-b border-white/5 flex items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2 cursor-pointer group">
          <div className="h-6 w-6 rounded border border-[#009DFF]/30 bg-[#009DFF]/5 flex items-center justify-center text-[#009DFF] group-hover:border-[#009DFF]/50 transition-all">
            <Lock className="w-3.5 h-3.5" />
          </div>
          {!collapsed && (
            <span className="text-[14px] font-black font-mono tracking-widest text-white leading-none">
              GFF <span className="text-[#009DFF]">AI</span>
            </span>
          )}
        </Link>
        <button 
          onClick={onToggleCollapse}
          className="text-white/20 hover:text-white/50 text-[10px] hidden lg:block cursor-pointer"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 -rotate-90" />}
        </button>
      </div>

      {/* Workspace Selector / Organization Label */}
      <div className="px-4 py-3 border-b border-white/5">
        {collapsed ? (
          <div className="relative flex justify-center">
            <button 
              onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
              className="h-9 w-9 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] flex items-center justify-center text-[#009DFF] transition-all cursor-pointer"
              title={activeOrg}
            >
              <Building2 className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="relative">
            <button 
              onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-white/5 bg-[#0a0a0a]/50 hover:bg-[#0c0c0c] hover:border-white/10 transition-all text-left cursor-pointer group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-5.5 w-5.5 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                </div>
                <div className="min-w-0">
                  <span className="text-[9px] font-mono font-bold tracking-wider text-white/30 block leading-none">SECURE WORKSPACE</span>
                  <span className="text-[11.5px] font-sans font-extrabold text-white block mt-1 truncate group-hover:text-[#009DFF] transition-colors uppercase">
                    {activeOrg}
                  </span>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-white/30 group-hover:text-white/60 transition-colors shrink-0 ml-1" />
            </button>

            {/* Interactive Workspace Dropdown */}
            <AnimatePresence>
              {orgDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setOrgDropdownOpen(false)} />
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-xl border border-white/5 bg-[#0a0a0a] p-1.5 shadow-2xl backdrop-blur-md font-sans"
                  >
                    <div className="px-2.5 py-1 text-[8.5px] font-mono font-bold text-white/30 uppercase tracking-widest border-b border-white/5 mb-1.5">
                      Switch Enclave Workspace
                    </div>
                    <div className="space-y-0.5">
                      {orgsList.map((org) => {
                        const isSel = activeOrg === org.name;
                        return (
                          <button
                            key={org.id}
                            onClick={() => handleOrgChange(org.name)}
                            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-all cursor-pointer ${
                              isSel 
                                ? "bg-white/[0.04] text-[#009DFF] font-bold" 
                                : "text-white/60 hover:text-white hover:bg-white/[0.02]"
                            }`}
                          >
                            <div className="min-w-0 pr-2">
                              <span className="text-[12px] block truncate">{org.name}</span>
                              <span className="text-[9px] font-mono text-white/30 block mt-0.5">{org.label}</span>
                            </div>
                            {isSel && <Check className="w-3.5 h-3.5 text-[#009DFF] shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Main Grouped Navigation Section */}
      <div className="flex-grow p-4 overflow-y-auto space-y-6 scrollbar-thin">
        {groups.map((group, groupIndex) => {
          // Resolve links in this group
          const groupLinks = group.linkIds
            .map(id => links.find(l => l.id === id))
            .filter(Boolean) as SidebarLink[];

          if (groupLinks.length === 0) return null;

          return (
            <div key={group.name} className="space-y-1">
              {/* Group Title - Hidden when collapsed */}
              {!collapsed && (
                <span className="text-[9px] font-mono font-extrabold tracking-widest text-white/20 px-3 block select-none uppercase mb-2">
                  {group.name}
                </span>
              )}

              {/* Group Items */}
              <div className="space-y-0.5">
                {groupLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = activeLink === link.id;
                  return (
                    <button
                      key={link.id}
                      onClick={() => onLinkChange(link.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all cursor-pointer group relative ${
                        isActive 
                          ? "bg-white/[0.04] text-[#009DFF] border border-[#009DFF]/20 shadow-[0_0_15px_rgba(0,157,255,0.02)] font-semibold" 
                          : "text-white/50 hover:text-white hover:bg-white/[0.01] border border-transparent"
                      }`}
                    >
                      {/* Active Left Indicator Bar */}
                      {isActive && (
                        <div className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r bg-[#009DFF]" />
                      )}

                      <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? "text-[#009DFF]" : "text-white/40 group-hover:text-white"}`} />
                      {!collapsed && (
                        <div className="min-w-0 flex-grow">
                          <span className="text-[12px] font-bold block truncate leading-tight">{link.label}</span>
                          <span className="text-[9px] font-mono text-white/25 block mt-0.5 leading-none font-normal truncate group-hover:text-white/35 transition-colors">{link.desc}</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Faint divider between groups */}
              {!collapsed && groupIndex < groups.length - 1 && (
                <div className="h-px bg-white/[0.02] mt-4" />
              )}
            </div>
          );
        })}
      </div>

      <div className="p-3 border-t border-white/5 flex flex-col gap-2 shrink-0 bg-black/10">
        {!collapsed ? (
          <button 
            onClick={() => {
              clearPreviewSession();
              window.location.href = "/portal/login";
            }}
            className="w-full h-8 rounded-lg border border-red-500/10 hover:border-red-500/30 bg-red-950/5 hover:bg-red-950/15 text-red-400 hover:text-red-300 flex items-center justify-center gap-1.5 font-mono text-[9.5px] font-bold uppercase transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            <span>Sign Out</span>
          </button>
        ) : (
          <button 
            onClick={() => {
              clearPreviewSession();
              window.location.href = "/portal/login";
            }}
            className="h-8 w-8 mx-auto rounded-lg border border-red-500/10 hover:border-red-500/30 bg-red-950/5 hover:bg-red-950/15 text-red-400 hover:text-red-300 flex items-center justify-center transition-all cursor-pointer"
            title="Deauthenticate Session"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        )}
        {!collapsed && (
          <div className="text-center font-mono text-[8px] text-white/20 select-none uppercase tracking-widest mt-1">
            CLOCK: 2026.06.27
          </div>
        )}
      </div>
    </aside>
  );
}

// ==========================================
// 2. PRIVATE TOPBAR
// ==========================================
export function PrivateTopbar({ 
  user,
  breadcrumbs,
  onSearchClick,
  role,
  onRoleChange,
  onToggleSidebar
}: { 
  user: UserProfile;
  breadcrumbs: BreadcrumbItem[];
  onSearchClick: () => void;
  role: "Client" | "Administrator";
  onRoleChange: (role: "Client" | "Administrator") => void;
  onToggleSidebar: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-white/5 bg-[#050505]/80 px-4 md:px-6 backdrop-blur-md select-none">
      <div className="flex items-center gap-3">
        <button 
          onClick={onToggleSidebar}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/5 hover:border-white/15 hover:bg-white/[0.03] lg:hidden text-white/80 hover:text-white cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-4 h-4" />
        </button>
        <div className="hidden sm:block">
          <WorkspaceBreadcrumbs items={breadcrumbs} />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <WorkspaceCommandButton onClick={onSearchClick} />
        <RoleSwitcherPreview currentRole={role} onRoleChange={onRoleChange} />
        <NotificationBell />
        
        {/* Quick Sign Out Action */}
        <button 
          onClick={() => {
            clearPreviewSession();
            window.location.href = "/portal/login";
          }}
          className="h-8 w-8 md:w-auto md:px-2.5 flex items-center justify-center gap-1.5 rounded-lg border border-red-500/10 hover:border-red-500/30 bg-red-950/5 hover:bg-red-950/15 text-red-400 hover:text-red-300 transition-all cursor-pointer"
          title="Sign Out Session"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden md:inline font-mono text-[9.5px] font-bold uppercase tracking-wider">Sign Out</span>
        </button>

        <div className="border-l border-white/10 h-6 mx-0.5 hidden md:block" />
        <UserAvatar user={user} showDetails={true} />
      </div>
    </header>
  );
}
