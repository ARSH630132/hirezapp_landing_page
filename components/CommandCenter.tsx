"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function CommandCenter({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const list = [
    { id: "talk", t: "Talk to Agent", d: "Interact with our multi-agent cognitive supervisors.", h: "/build/talk", c: "Simulation", cl: "text-[#009DFF]" },
    { id: "blueprint", t: "Generate Blueprint", d: "Create custom multi-agent execution roadmaps.", h: "/build/blueprint", c: "Engineering", cl: "text-purple-400" },
    { id: "roi", t: "Estimate ROI", d: "Calculate compute savings and staff efficiency multipliers.", h: "/build/roi", c: "Strategy", cl: "text-emerald-400" },
    { id: "sandbox", t: "Launch Sandbox", d: "Stress-test autonomous DAG execution in secure enclave.", h: "/build/sandbox", c: "Engineering", cl: "text-amber-400" },
    { id: "workshop", t: "Book Workshop", d: "Schedule a systems architectural review & consultation.", h: "/contact", c: "Consultation", cl: "text-[#E4000F]" }
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

  useEffect(() => {
    const handleKD = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") { e.preventDefault(); onClose(); }
      else if (e.key === "ArrowDown") { e.preventDefault(); setSel(p => filtered.length ? (p + 1) % filtered.length : 0); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setSel(p => filtered.length ? (p - 1 + filtered.length) % filtered.length : 0); }
      else if (e.key === "Enter") { e.preventDefault(); if (filtered[sel]) { router.push(filtered[sel].h); onClose(); } }
      else if (e.key === "Tab") {
        e.preventDefault();
        setSel(p => filtered.length ? (p + (e.shiftKey ? -1 : 1) + filtered.length) % filtered.length : 0);
      }
    };
    window.addEventListener("keydown", handleKD);
    return () => window.removeEventListener("keydown", handleKD);
  }, [isOpen, filtered, sel, onClose, router]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-black/75 backdrop-blur-md flex items-start justify-center pt-24 px-4" onClick={onClose} role="dialog" aria-modal="true" aria-label="Command Center">
      <div onClick={e => e.stopPropagation()} className="w-full max-w-2xl bg-[#09090b]/95 border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        <div className="flex items-center px-4 py-4 border-b border-white/5 gap-3 bg-white/[0.02]">
          <span className="text-white/30 shrink-0">🔍</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search command center..."
            value={q}
            onChange={e => { setQ(e.target.value); setSel(0); }}
            role="combobox"
            aria-expanded={isOpen ? "true" : "false"}
            aria-autocomplete="list"
            aria-controls="command-center-list"
            aria-activedescendant={filtered[sel] ? `cmd-${filtered[sel].id}` : undefined}
            className="flex-grow bg-transparent text-white text-[15px] outline-none placeholder-white/30 border-none ring-0 focus:ring-0"
          />
          <button onClick={onClose} aria-label="Close Command Center" className="text-white/40 text-[11px] font-mono border border-white/10 px-2 py-0.5 rounded-md bg-white/[0.02]">ESC</button>
        </div>
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-white/30 text-xs font-mono">No commands matched &ldquo;{q}&rdquo;</div>
        ) : (
          <div id="command-center-list" role="listbox" aria-label="Search results" className="max-h-[360px] overflow-y-auto p-2.5 space-y-1 bg-black/40">
            {filtered.map((cmd, idx) => {
              const active = idx === sel;
              return (
                <button
                  key={cmd.id}
                  id={`cmd-${cmd.id}`}
                  role="option"
                  aria-selected={active ? "true" : "false"}
                  onClick={() => { router.push(cmd.h); onClose(); }}
                  onMouseEnter={() => setSel(idx)}
                  className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-all border ${
                    active ? "bg-white/[0.04] border-white/10 text-white" : "bg-transparent border-transparent text-white/60"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span className={`text-[14px] ${cmd.cl} font-mono w-4 text-center`}>●</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] font-semibold tracking-tight">{cmd.t}</span>
                        <span className="text-[9px] uppercase tracking-wider text-white/30 font-semibold bg-white/[0.03] px-1.5 py-0.5 rounded border border-white/5 font-mono">{cmd.c}</span>
                      </div>
                      <p className="text-[12px] text-white/40 mt-0.5 font-light">{cmd.d}</p>
                    </div>
                  </div>
                  {active && <span className="text-white/40 text-[10px] font-mono mr-2 bg-white/[0.05] border border-white/10 px-2 py-0.5 rounded">Enter ↵</span>}
                </button>
              );
            })}
          </div>
        )}
        <div className="px-5 py-3 bg-white/[0.01] border-t border-white/5 flex items-center justify-between text-[11px] text-white/30 font-mono">
          <div className="flex items-center gap-4">
            <span><kbd className="bg-white/5 border border-white/10 px-1 rounded">↑↓</kbd> Navigate</span>
            <span><kbd className="bg-white/5 border border-white/10 px-1.5 rounded">↵</kbd> Select</span>
          </div>
          <span className="text-[9px] text-white/20">GFF COMMAND CENTER</span>
        </div>
      </div>
    </div>
  );
}
