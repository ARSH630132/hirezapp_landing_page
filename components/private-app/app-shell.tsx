"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { UserProfile, BreadcrumbItem, SidebarLink } from "./types";
import { SecurePreviewNotice } from "./notices-avatars";
import { PrivateSidebar, PrivateTopbar } from "./sidebar-topbar";
import { CommandPalette } from "./command-palette";

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
                className="fixed inset-y-0 left-0 z-50 w-72 bg-[#050505] border-r border-white/5 flex flex-col pt-8"
              >
                <div className="h-14 border-b border-white/5 flex items-center justify-between px-5 select-none">
                  <span className="text-[14px] font-black font-mono tracking-widest text-white leading-none">
                    GFF <span className="text-[#009DFF]">AI</span>
                  </span>
                  <button 
                    onClick={() => setMobileSidebarOpen(false)}
                    className="text-white/40 hover:text-white cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex-grow p-4 overflow-y-auto space-y-4">
                  <div className="space-y-1">
                    {links.map((link) => {
                      const Icon = link.icon;
                      const isActive = activeLink === link.id;
                      return (
                        <button
                          key={link.id}
                          onClick={() => {
                            onLinkChange(link.id);
                            setMobileSidebarOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${isActive ? "bg-white/10 text-[#009DFF] border border-[#009DFF]/15" : "text-white/60 hover:text-white"}`}
                        >
                          <Icon className="w-4.5 h-4.5 text-white/40" />
                          <div>
                            <span className="text-[12.5px] font-bold block">{link.label}</span>
                            <span className="text-[10px] font-mono text-white/30 block mt-0.5 font-normal">{link.desc}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
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

          <main className="flex-grow p-4 md:p-6 lg:p-8 space-y-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>

      <CommandPalette 
        isOpen={commandPaletteOpen} 
        onClose={() => setCommandPaletteOpen(false)} 
        onNavigate={onLinkChange}
      />
    </div>
  );
}
