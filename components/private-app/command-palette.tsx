"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Terminal } from "lucide-react";

export function CommandPalette({ 
  isOpen, 
  onClose,
  onNavigate
}: { 
  isOpen: boolean; 
  onClose: () => void;
  onNavigate?: (tab: string) => void;
}) {
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const items = [
    { category: "DIAGNOSTICS", label: "Inspect Agent Health Stack", shortcut: "H", tab: "agent_health" },
    { category: "DIAGNOSTICS", label: "Live Thread CPU Metrics", shortcut: "M", tab: "agent_health" },
    { category: "OPERATIONS", label: "Continuous Delivery Pipeline", shortcut: "D", tab: "delivery" },
    { category: "OPERATIONS", label: "Integration Node Endpoint map", shortcut: "E", tab: "adoption" },
    { category: "FINANCIALS", label: "Cryptographic Invoice Ledger", shortcut: "I", tab: "spend" },
    { category: "FINANCIALS", label: "Compute and Token Spend parameters", shortcut: "S", tab: "spend" },
    { category: "COMPLIANCE", label: "ISO-27001 Audit checklist", shortcut: "G", tab: "governance" },
    { category: "COMPLIANCE", label: "Recent eBPF Guardrail Violations", shortcut: "V", tab: "governance" },
    { category: "SUPPORT", label: "Open Secure Messaging Terminal", shortcut: "T", tab: "support" }
  ];

  const filtered = items.filter(item => 
    item.label.toLowerCase().includes(search.toLowerCase()) || 
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-start justify-center bg-black/85 p-4 pt-[10vh] backdrop-blur-md">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative w-full max-w-xl rounded-2xl border border-white/10 bg-[#080808]/95 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-md">
        <div className="flex items-center gap-3 border-b border-white/5 pb-3">
          <Search className="w-4 h-4 text-white/40 shrink-0" />
          <input 
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type a command or module name..."
            className="w-full bg-transparent text-[13.5px] font-mono text-white placeholder-white/35 outline-none"
          />
          <button 
            onClick={onClose}
            className="text-[10px] font-mono text-white/30 border border-white/10 rounded px-1.5 py-0.5 hover:bg-white/5 transition-all cursor-pointer"
          >
            ESC
          </button>
        </div>

        <div className="mt-3 max-h-72 overflow-y-auto pr-1">
          {filtered.length === 0 ? (
            <div className="py-6 text-center text-[12px] font-mono text-white/30">
              No results found matching &ldquo;{search}&rdquo;
            </div>
          ) : (
            <div className="space-y-3">
              {["DIAGNOSTICS", "OPERATIONS", "FINANCIALS", "COMPLIANCE", "SUPPORT"].map(cat => {
                const catItems = filtered.filter(i => i.category === cat);
                if (catItems.length === 0) return null;
                return (
                  <div key={cat} className="space-y-1">
                    <div className="text-[9px] font-mono font-bold tracking-widest text-white/25 px-2">{cat}</div>
                    {catItems.map((item, idx) => (
                      <button 
                        key={idx}
                        onClick={() => {
                          if (onNavigate) onNavigate(item.tab);
                          onClose();
                        }}
                        className="w-full flex justify-between items-center px-2 py-1.5 rounded-lg text-left text-[12px] font-mono text-white/70 hover:text-white hover:bg-white/[0.04] transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Terminal className="w-3.5 h-3.5 text-[#009DFF]/70" />
                          <span>{item.label}</span>
                        </div>
                        <kbd className="h-5 select-none items-center gap-0.5 rounded border border-white/5 bg-white/[0.02] px-1.5 text-[9px] text-white/30">
                          {item.shortcut}
                        </kbd>
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
