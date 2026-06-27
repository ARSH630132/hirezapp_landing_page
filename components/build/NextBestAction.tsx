"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { getFullWorkspace, getBlueprintHistory } from "./workspaceUtility";

const CONFIGS: Record<string, any> = {
  assessment: {
    next: "blueprint",
    title: "Generate Sovereign Architectural Blueprint",
    desc: "Translate your compiled 8-dimensional readiness scores into a functional, secure agentic orchestration diagram with exact routing boundaries.",
    alt: "ROI Calculator",
    altHref: "/build/roi",
    color: "#9D00FF"
  },
  blueprint: {
    next: "roi",
    title: "Model Sovereign Economic Impact (ROI)",
    desc: "Translate your completed architectural topology diagram into a precise multi-year cost saving and efficiency multiplier baseline.",
    alt: "Proposal Studio",
    altHref: "/build/proposal",
    color: "#E4000F"
  },
  roi: {
    next: "proposal",
    title: "Compile Enterprise Statement of Work",
    desc: "Convert your modeled economic variables and cost efficiency baseline into an executive-ready Statement of Work detailing licensing structures.",
    alt: "Execution Sandbox",
    altHref: "/build/sandbox",
    color: "#3B82F6"
  },
  talk: {
    next: "blueprint",
    title: "Convert Intake into Blueprint Diagram",
    desc: "Transform your mapped legacy process variables and priority urgency indexes into a functional, secure visual agentic deployment graph.",
    alt: "Readiness Assessor",
    altHref: "/build/assessment",
    color: "#9D00FF"
  },
  sandbox: {
    next: "foundryStudio",
    title: "Construct Customized Multi-Agent DAGs",
    desc: "Graduate from sandbox simulation directly into designing bespoke agent state transition workflows, task nodes, and private vector storage enclaves.",
    alt: "Agent Marketplace",
    altHref: "/build/marketplace",
    color: "#00FF9D"
  },
  marketplace: {
    next: "sandbox",
    title: "Simulate Marketplace Recipes in Sandbox",
    desc: "Deploy your compared agent recipes directly into our zero-retention execution sandbox to evaluate transactional speeds and security guardrails.",
    alt: "Proposal Studio",
    altHref: "/build/proposal",
    color: "#009DFF"
  }
};

const NAMES: Record<string, string> = {
  assessment: "Readiness Assessor",
  blueprint: "Blueprint Generator",
  roi: "ROI Calculator",
  proposal: "Proposal Studio",
  talk: "Talk to Agent",
  sandbox: "Execution Sandbox",
  marketplace: "Agent Marketplace",
  foundryStudio: "Foundry Studio"
};

const ROUTES: Record<string, string> = {
  assessment: "/build/assessment",
  blueprint: "/build/blueprint",
  roi: "/build/roi",
  proposal: "/build/proposal",
  talk: "/build/talk",
  sandbox: "/build/sandbox",
  marketplace: "/build/marketplace",
  foundryStudio: "/build/foundry-studio"
};

export default function NextBestAction({ currentTool, completed = false }: { currentTool: string; completed?: boolean }) {
  const [visible, setVisible] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const [glow, setGlow] = useState({ x: 0, y: 0, hover: false });

  useEffect(() => {
    if (completed) {
      setVisible(true);
      return;
    }
    const check = () => {
      try {
        if (currentTool === "blueprint") return getBlueprintHistory().length > 0;
        const ws = getFullWorkspace() as any;
        const state = ws[currentTool];
        if (!state) return false;
        if (currentTool === "assessment") return !!state?.showResult;
        if (currentTool === "talk") return !!state?.showResults || !!state?.data;
        return true;
      } catch { return false; }
    };
    setVisible(check());
    const h = () => setVisible(check());
    window.addEventListener("storage", h);
    return () => window.removeEventListener("storage", h);
  }, [currentTool, completed]);

  const cfg = CONFIGS[currentTool];
  if (!visible || !cfg) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="w-full mt-12">
        <div
          ref={container}
          onMouseMove={(e) => {
            if (!container.current) return;
            const r = container.current.getBoundingClientRect();
            setGlow({ x: e.clientX - r.left, y: e.clientY - r.top, hover: true });
          }}
          onMouseLeave={() => setGlow((p) => ({ ...p, hover: false }))}
          className="relative w-full rounded-2xl border border-white/5 bg-[#030305]/95 p-6 md:p-8 shadow-xl hover:border-white/10 text-left overflow-hidden"
        >
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              background: glow.hover
                ? `radial-gradient(circle 350px at ${glow.x}px ${glow.y}px, ${cfg.color}15, transparent 80%)`
                : `radial-gradient(circle 350px at 50% 50%, ${cfg.color}08, transparent 80%)`
            }}
          />
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="space-y-4 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: cfg.color }} />
                <span className="text-[10px] font-mono text-white/40 uppercase">GFF Recommendation Engine</span>
              </div>
              <h3 className="text-lg md:text-2xl font-bold text-white tracking-tight leading-tight">{cfg.title}</h3>
              <p className="text-xs md:text-sm text-white/60 font-light leading-relaxed">{cfg.desc}</p>
              <div className="text-[10px] font-mono uppercase tracking-wider text-white/30 flex items-center gap-2">
                <span>Recommended: {NAMES[currentTool]}</span>
                <span style={{ color: cfg.color }}>➔</span>
                <span className="font-bold" style={{ color: cfg.color }}>{NAMES[cfg.next]}</span>
              </div>
            </div>
            <div className="shrink-0 flex items-center justify-center border border-white/5 bg-black/40 px-6 h-20 rounded-xl relative min-w-[280px]">
              <div className="flex justify-between items-center w-full z-10 text-[10px] font-mono uppercase font-bold">
                <span className="text-white/40">{NAMES[currentTool]}</span>
                <span className="text-xs mx-4" style={{ color: cfg.color }}>➔</span>
                <span style={{ color: cfg.color }}>{NAMES[cfg.next]}</span>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap justify-between items-center gap-4">
            <span className="text-[9px] font-mono text-white/25">LOCAL CLIENT-EDGE DATA • 0% CLOUD LEAK RISK</span>
            <div className="flex flex-wrap gap-3 w-full sm:w-auto justify-end">
              <Link href={cfg.altHref} className="px-4 py-2 rounded-lg text-xs font-mono text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-center w-full sm:w-auto">[Alt Path: {cfg.alt}]</Link>
              <Link href={ROUTES[cfg.next] || `/build/${cfg.next}`} className="px-6 py-2.5 rounded-lg text-xs font-mono font-bold text-black hover:scale-[1.01] transition-all text-center w-full sm:w-auto" style={{ backgroundColor: cfg.color, boxShadow: `0 4px 12px ${cfg.color}30` }}>Launch {NAMES[cfg.next]} →</Link>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
