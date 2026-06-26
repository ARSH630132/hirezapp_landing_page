"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { purgeAllWorkspace } from "@/components/build/workspaceUtility";

export default function CommandCenter({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const [hasBlueprint, setHasBlueprint] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("gff_blueprint_history");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setHasBlueprint(true);
            return;
          }
        }
        setHasBlueprint(false);
      } catch (err) {
        console.error("Error reading blueprint history for CommandCenter:", err);
        setHasBlueprint(false);
      }
    }
  }, [isOpen]);

  const handleClearWorkspace = () => {
    if (confirm("Are you sure you want to clear all local diagnostic assessments, custom blueprints, and proposal data from this browser?")) {
      purgeAllWorkspace();
      setHasBlueprint(false);
      alert("Local workspace purged successfully.");
      onClose();
    }
  };

  const list = [
    { id: "start-blueprint", t: "Start Blueprint", d: "Architect custom multi-agent execution roadmaps and node DAG topologies.", h: "/build/blueprint", c: "Engineering", cl: "text-[#A855F7]" },
    ...(hasBlueprint ? [{ id: "continue-blueprint", t: "Continue Blueprint", d: "Resume your saved GFF AI execution roadmap.", h: "/build/blueprint?continue=true", c: "Engineering", cl: "text-purple-300" }] : []),
    { id: "start-assessment", t: "Start Assessment", d: "Evaluate organizational readiness, regulatory compliance, and legacy APIs.", h: "/build/assessment", c: "Strategy", cl: "text-[#009DFF]" },
    { id: "estimate-roi", t: "Estimate ROI", d: "Calculate compute savings, licensing discounts, and staff efficiency multipliers.", h: "/build/roi", c: "Strategy", cl: "text-emerald-400" },
    { id: "build-proposal", t: "Build Proposal", d: "Compile commercial scoping metrics and download custom pitch decks.", h: "/build/proposal", c: "Strategy", cl: "text-amber-400" },
    { id: "open-sandbox", t: "Open Sandbox", d: "Stress-test autonomous DAG execution in secure zero-retention enclaves.", h: "/build/sandbox", c: "Engineering", cl: "text-orange-400" },
    { id: "compare-agents", t: "Compare Agents", d: "Compare multi-agent system performance and topological attributes side-by-side.", h: "/build/marketplace?compare=true", c: "Engineering", cl: "text-pink-400" },
    { id: "open-foundry", t: "Open Foundry Studio", d: "Visually assemble and edit production-grade multi-agent DAG execution layouts.", h: "/build/foundry-studio", c: "Deployment", cl: "text-cyan-400" },
    { id: "clear-workspace", t: "Clear Local Workspace", d: "Purge all local session files, cached assessments, and proposal drafts from this browser.", action: handleClearWorkspace, c: "Workspace", cl: "text-red-500" },
    { id: "contact-sales", t: "Contact Sales", d: "Connect with our executive engineering team for dedicated SLA deployment.", h: "/contact", c: "Consultation", cl: "text-[#E4000F]" },
    { id: "book-workshop", t: "Book Workshop", d: "Schedule a systems architectural review & co-engineering sync.", h: "/build/talk", c: "Consultation", cl: "text-[#E4000F]" }
  ];

  const filtered = list.filter(c =>
    c.t.toLowerCase().includes(q.toLowerCase()) ||
    c.d.toLowerCase().includes(q.toLowerCase()) ||
    c.c.toLowerCase().includes(q.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQ("");
      setSel(0);
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const handleExecuteCommand = useCallback((cmd: any) => {
    if (cmd.action) {
      cmd.action();
    } else if (cmd.h) {
      router.push(cmd.h);
      onClose();
    }
  }, [router, onClose]);

  useEffect(() => {
    const handleKD = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") { e.preventDefault(); onClose(); }
      else if (e.key === "ArrowDown") { e.preventDefault(); setSel(p => filtered.length ? (p + 1) % filtered.length : 0); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setSel(p => filtered.length ? (p - 1 + filtered.length) % filtered.length : 0); }
      else if (e.key === "Enter") { e.preventDefault(); if (filtered[sel]) { handleExecuteCommand(filtered[sel]); } }
      else if (e.key === "Tab") {
        e.preventDefault();
        setSel(p => filtered.length ? (p + (e.shiftKey ? -1 : 1) + filtered.length) % filtered.length : 0);
      }
    };
    window.addEventListener("keydown", handleKD);
    return () => window.removeEventListener("keydown", handleKD);
  }, [isOpen, filtered, sel, onClose, handleExecuteCommand]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-black/75 backdrop-blur-md flex items-start justify-center pt-24 px-4" onClick={onClose} role="dialog" aria-modal="true" aria-label="Command Center">
      <div onClick={e => e.stopPropagation()} className="w-full max-w-2xl bg-[#09090b]/95 border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col relative">
        {/* Subtle top ambient glow */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
        
        <div className="flex items-center px-4 py-4 border-b border-white/5 gap-3 bg-white/[0.02]">
          <span className="text-white/30 shrink-0 text-lg">🔍</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search workspace..."
            value={q}
            onChange={e => { setQ(e.target.value); setSel(0); }}
            role="combobox"
            aria-expanded={isOpen ? "true" : "false"}
            aria-autocomplete="list"
            aria-controls="command-center-list"
            aria-activedescendant={filtered[sel] ? `cmd-${filtered[sel].id}` : undefined}
            className="flex-grow bg-transparent text-white text-[15px] outline-none placeholder-white/30 border-none ring-0 focus:ring-0"
          />
          <button onClick={onClose} aria-label="Close Command Center" className="text-white/40 text-[11px] font-mono border border-white/10 px-2 py-0.5 rounded-md bg-white/[0.02] hover:text-white transition-colors">ESC</button>
        </div>
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-white/30 text-xs font-mono">No commands matched &ldquo;{q}&rdquo;</div>
        ) : (
          <div id="command-center-list" role="listbox" aria-label="Search results" className="max-h-[380px] overflow-y-auto p-2.5 space-y-1 bg-black/40">
            {filtered.map((cmd, idx) => {
              const active = idx === sel;
              return (
                <button
                  key={cmd.id}
                  id={`cmd-${cmd.id}`}
                  role="option"
                  aria-selected={active ? "true" : "false"}
                  onClick={() => handleExecuteCommand(cmd)}
                  onMouseEnter={() => setSel(idx)}
                  className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-all border outline-none ${
                    active ? "bg-white/[0.04] border-white/10 text-white shadow-lg" : "bg-transparent border-transparent text-white/60 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span className={`text-[14px] ${cmd.cl} font-mono w-4 text-center transition-transform duration-200 ${active ? "scale-125" : ""}`}>●</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] font-semibold tracking-tight">{cmd.t}</span>
                        <span className="text-[9px] uppercase tracking-wider text-white/30 font-semibold bg-white/[0.03] px-1.5 py-0.5 rounded border border-white/5 font-mono">{cmd.c}</span>
                      </div>
                      <p className="text-[12px] text-white/40 mt-0.5 font-light leading-relaxed">{cmd.d}</p>
                    </div>
                  </div>
                  {active && (
                    <span className="text-white/40 text-[10px] font-mono mr-2 bg-white/[0.05] border border-white/10 px-2 py-0.5 rounded shrink-0">
                      Enter ↵
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
        <div className="px-5 py-3 bg-white/[0.01] border-t border-white/5 flex items-center justify-between text-[11px] text-white/30 font-mono">
          <div className="flex items-center gap-4">
            <span><kbd className="bg-white/5 border border-white/10 px-1 rounded">↑↓</kbd> Navigate</span>
            <span><kbd className="bg-white/5 border border-white/10 px-1.5 rounded">Tab</kbd> Cycle</span>
            <span><kbd className="bg-white/5 border border-white/10 px-1.5 rounded">↵</kbd> Execute</span>
          </div>
          <span className="text-[9px] text-white/20">GFF COGNITIVE WORKSPACE V2.6</span>
        </div>
      </div>
    </div>
  );
}
