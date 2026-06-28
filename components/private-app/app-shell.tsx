"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, MoreHorizontal, Lock } from "lucide-react";
import { UserProfile, BreadcrumbItem, SidebarLink } from "./types";
import { SecurePreviewNotice } from "./notices-avatars";
import { PrivateSidebar, PrivateTopbar } from "./sidebar-topbar";
import { CommandPalette } from "./command-palette";

const clientGroups = [
  { name: "CORE OVERSIGHT", linkIds: ["dashboard"] },
  { name: "OPERATIONS & INTEL", linkIds: ["projects", "ai-operations", "documents"] },
  { name: "TELEMETRY & POLICIES", linkIds: ["analytics", "governance"] },
  { name: "ADMIN", linkIds: ["billing", "support"] },
];

const adminGroups = [
  { name: "CORE OVERSIGHT", linkIds: ["dashboard"] },
  { name: "REGISTRY & USERS", linkIds: ["clients", "projects", "users"] },
  { name: "OPERATIONS & CONTROL", linkIds: ["ai-operations", "documents"] },
  { name: "TELEMETRY & AUDIT", linkIds: ["analytics", "governance"] },
  { name: "SYSTEM CONFIG", linkIds: ["billing", "support"] },
];


export function PrivateAppShell({ 
  children,
  user,
  breadcrumbs,
  links,
  activeLink,
  onLinkChange,
  role,
  onRoleChange
}: { 
  children: React.ReactNode;
  user: UserProfile;
  breadcrumbs: BreadcrumbItem[];
  links: SidebarLink[];
  activeLink: string;
  onLinkChange: (id: string) => void;
  role: "Client" | "Administrator";
  onRoleChange: (role: "Client" | "Administrator") => void;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const groups = role === "Client" ? clientGroups : adminGroups;

  // Resolve mobile bottom navigation primary links (top 4 links + 'More' button)
  const primaryMobileIds = role === "Client" 
    ? ["dashboard", "projects", "ai-operations", "support"]
    : ["dashboard", "clients", "projects", "support"];

  const primaryMobileLinks = primaryMobileIds
    .map(id => links.find(link => link.id === id))
    .filter(Boolean) as SidebarLink[];

  return (
    <div className="min-h-screen flex bg-[#030303] text-white overflow-x-hidden">
      <div className="fixed top-0 left-0 right-0 z-50">
        <SecurePreviewNotice />
      </div>

      <div className="pt-8 w-full flex">
        <PrivateSidebar 
          links={links}
          activeLink={activeLink}
          onLinkChange={(id) => {
            onLinkChange(id);
            setMobileSidebarOpen(false);
          }}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          user={user}
          role={role}
        />

        <AnimatePresence>
          {mobileSidebarOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black lg:hidden"
                onClick={() => setMobileSidebarOpen(false)}
              />
              <motion.div 
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                role="navigation"
                aria-label="Mobile drawer navigation"
                className="fixed inset-y-0 left-0 z-50 w-72 bg-[#050505] border-r border-white/5 flex flex-col pt-8"
              >
                <div className="h-14 border-b border-white/5 flex items-center justify-between px-5 select-none shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="h-5.5 w-5.5 rounded border border-[#009DFF]/30 bg-[#009DFF]/5 flex items-center justify-center text-[#009DFF]">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[13px] font-black font-mono tracking-widest text-white leading-none">
                      GFF <span className="text-[#009DFF]">AI</span>
                    </span>
                  </div>
                  <button 
                    onClick={() => setMobileSidebarOpen(false)}
                    className="text-white/40 hover:text-white cursor-pointer p-1"
                    aria-label="Close menu"
                  >
                    <X className="w-4.5 h-4.5" />
                  </button>
                </div>

                {/* Grouped Mobile Navigation */}
                <div className="flex-grow p-4 overflow-y-auto space-y-5 scrollbar-thin">
                  {groups.map((group) => {
                    const groupLinks = group.linkIds
                      .map(id => links.find(l => l.id === id))
                      .filter(Boolean) as SidebarLink[];

                    if (groupLinks.length === 0) return null;

                    return (
                      <div key={group.name} className="space-y-1.5">
                        <span className="text-[8.5px] font-mono font-extrabold tracking-widest text-white/20 px-2 block select-none uppercase">
                          {group.name}
                        </span>
                        <div className="space-y-0.5">
                          {groupLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive = activeLink === link.id;
                            return (
                              <button
                                key={link.id}
                                onClick={() => {
                                  onLinkChange(link.id);
                                  setMobileSidebarOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors relative ${
                                  isActive 
                                    ? "bg-white/[0.04] text-[#009DFF] border border-[#009DFF]/15 font-semibold" 
                                    : "text-white/60 hover:text-white"
                                }`}
                              >
                                {isActive && (
                                  <div className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r bg-[#009DFF]" />
                                )}
                                <Icon className="w-4 h-4 text-white/40 shrink-0" />
                                <div className="min-w-0 flex-grow">
                                  <span className="text-[12px] block truncate leading-tight">{link.label}</span>
                                  <span className="text-[9px] font-mono text-white/35 block mt-0.5 font-normal leading-none truncate">{link.desc}</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Mobile Drawer Enclave Indicator */}
                <div className="p-4 border-t border-white/5 bg-black/10 text-center font-mono text-[8.5px] text-white/20 select-none uppercase tracking-wider shrink-0">
                  SECURE WORKSPACE
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="flex-grow flex flex-col min-h-[calc(100vh-2rem)] min-w-0">
          <PrivateTopbar 
            user={user}
            breadcrumbs={breadcrumbs}
            onSearchClick={() => setCommandPaletteOpen(true)}
            role={role}
            onRoleChange={onRoleChange}
            onToggleSidebar={() => setMobileSidebarOpen(true)}
          />

          {/* Adjusted padding bottom pb-20 on mobile to leave room for Mobile Bottom Nav */}
          <main className="flex-grow p-4 md:p-6 lg:p-8 pb-20 lg:pb-8 space-y-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Bottom Floating Navigation Bar */}
      <nav 
        aria-label="Mobile bottom navigation" 
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-[#050505]/95 border-t border-white/5 backdrop-blur-md px-2.5 flex items-center justify-around select-none shadow-[0_-5px_25px_rgba(0,0,0,0.8)]"
      >
        {primaryMobileLinks.map((link) => {
          const Icon = link.icon;
          const isActive = activeLink === link.id;
          return (
            <button
              key={link.id}
              onClick={() => onLinkChange(link.id)}
              className={`flex-grow flex flex-col items-center justify-center gap-1.5 py-1.5 transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#009DFF] ${
                isActive ? "text-[#009DFF]" : "text-white/45 hover:text-white"
              }`}
            >
              <Icon className={`w-4.5 h-4.5 transition-transform ${isActive ? "scale-105" : ""}`} />
              <span className="text-[8.5px] font-mono tracking-wider font-extrabold uppercase leading-none">
                {link.id === "ai-operations" ? "OPS" : link.id === "dashboard" ? "CORE" : link.label.split(" ")[0]}
              </span>
            </button>
          );
        })}
        {/* Toggle full drawer More button */}
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="flex-grow flex flex-col items-center justify-center gap-1.5 py-1.5 text-white/45 hover:text-white transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#009DFF]"
          aria-label="Open more options"
        >
          <MoreHorizontal className="w-4.5 h-4.5" />
          <span className="text-[8.5px] font-mono tracking-wider font-extrabold uppercase leading-none">MORE</span>
        </button>
      </nav>

      <CommandPalette 
        isOpen={commandPaletteOpen} 
        onClose={() => setCommandPaletteOpen(false)} 
        onNavigate={onLinkChange}
      />
    </div>
  );
}
