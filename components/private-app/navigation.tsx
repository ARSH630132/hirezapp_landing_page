"use client";

import React from "react";
import Link from "next/link";
import { Shield, ChevronRight, Search } from "lucide-react";
import { BreadcrumbItem } from "./types";

// ==========================================
// 1. WORKSPACE BREADCRUMBS
// ==========================================
export function WorkspaceBreadcrumbs({ 
  items 
}: { 
  items: BreadcrumbItem[];
}) {
  return (
    <nav className="flex items-center space-x-2 text-[11px] font-mono text-white/40 select-none">
      <Link href="/portal" className="hover:text-white transition-colors flex items-center gap-1">
        <Shield className="w-3.5 h-3.5 text-[#009DFF]" />
        <span>GFF CORE</span>
      </Link>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-3 h-3 text-white/20 shrink-0" />
          {item.href ? (
            <Link href={item.href} className="hover:text-white transition-colors">
              {item.label.toUpperCase()}
            </Link>
          ) : (
            <span className="text-white font-bold tracking-wider">{item.label.toUpperCase()}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

// ==========================================
// 2. WORKSPACE COMMAND BUTTON
// ==========================================
export function WorkspaceCommandButton({ 
  onClick 
}: { 
  onClick: () => void;
}) {
  const isMac = typeof window !== "undefined" && window.navigator.platform.toUpperCase().indexOf("MAC") >= 0;

  return (
    <button 
      onClick={onClick}
      className="flex h-9 w-full md:w-56 items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 text-left hover:border-white/15 hover:bg-white/[0.04] transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#009DFF]/30 group"
    >
      <div className="flex items-center gap-2 text-white/40 group-hover:text-white/60 transition-colors">
        <Search className="w-3.5 h-3.5" />
        <span className="text-[11.5px] font-mono tracking-wider">SECURE SEARCH...</span>
      </div>
      <kbd className="hidden md:inline-flex h-5 select-none items-center gap-0.5 rounded border border-white/10 bg-white/[0.03] px-1.5 font-mono text-[9px] font-medium text-white/30">
        {isMac ? "⌘" : "Ctrl+"}K
      </kbd>
    </button>
  );
}
