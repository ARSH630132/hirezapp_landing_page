"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Lock, ChevronRight, ChevronDown, Menu } from "lucide-react";
import { SidebarLink, UserProfile, BreadcrumbItem } from "./types";
import { WorkspaceBreadcrumbs, WorkspaceCommandButton } from "./navigation";
import { RoleSwitcherPreview } from "./role-switcher";
import { NotificationBell } from "./notifications";
import { UserAvatar } from "./notices-avatars";

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

      <div className="flex-grow p-4 overflow-y-auto space-y-6">
        <div className="space-y-1.5">
          {!collapsed && (
            <span className="text-[9.5px] font-mono font-bold tracking-widest text-white/25 px-2 block select-none uppercase">
              {role === "Client" ? "Client Workspace" : "Oversight Console"}
            </span>
          )}
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = activeLink === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onLinkChange(link.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all cursor-pointer group ${isActive ? "bg-white/10 text-[#009DFF] border border-[#009DFF]/25 shadow-[0_0_15px_rgba(0,157,255,0.02)]" : "text-white/55 hover:text-white hover:bg-white/[0.02] border border-transparent"}`}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? "text-[#009DFF]" : "text-white/40 group-hover:text-white"}`} />
                {!collapsed && (
                  <div>
                    <span className="text-[12px] font-bold block">{link.label}</span>
                    <span className="text-[9.5px] font-mono text-white/30 block mt-0.5 leading-none font-normal">{link.desc}</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {!collapsed && (
        <div className="p-4 border-t border-white/5 bg-black/20 text-center font-mono text-[9px] text-white/25 select-none">
          SECURE CLOCK: 2026.06.27
        </div>
      )}
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
        <div className="border-l border-white/10 h-6 mx-0.5 hidden md:block" />
        <UserAvatar user={user} showDetails={true} />
      </div>
    </header>
  );
}
