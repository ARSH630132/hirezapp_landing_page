"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import SectionHeading from "@/components/SectionHeading";

const CATS = [
  { name: "Articles", desc: "Detailed technical analyses of multi-agent orchestration and security boundaries.", color: "#E98828" },
  { name: "Videos", desc: "Watch terminal demonstrations and engineering walkthroughs of agentic runtimes.", color: "#009DFF" },
  { name: "Podcasts", desc: "Listen to leads discuss compliance, safety loops, and design principles.", color: "#9D00FF" },
  { name: "Whitepapers", desc: "Access verified specifications, design standards, and verification frameworks.", color: "#F74539" }
];

const SPECS = [
  { id: "orch", title: "GFF Heuristic Agent Orchestration Framework v1.4", size: "2.4 MB SPEC" },
  { id: "sec", title: "Zero-Trust Agentic Security: Multi-Layer Sandboxing", size: "4.1 MB SPEC" }
];

const CHANNELS = [
  "Blog", "Research", "Case Studies", "Architecture Library", "Webinars", "Events",
  "Developer Docs", "Downloads", "Reports", "Newsroom", "Thought Leadership", "Patterns of Intelligence"
];

export default function LatestResearchSection() {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState<string | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [sub, setSub] = useState<"idle" | "submitting" | "success">("idle");

  useEffect(() => {
    if (!downloading) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setSuccess(downloading);
          setDownloading(null);
          setTimeout(() => setSuccess(null), 3500);
          return 100;
        }
        return p + 25;
      });
    }, 120);
    return () => clearInterval(interval);
  }, [downloading]);

  const handleSub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setSub("submitting");
    setTimeout(() => setSub("success"), 1200);
  };

  const close = () => { setActive(null); setEmail(""); setSub("idle"); };

  return (
    <motion.section 
      id="research" 
      initial={{ opacity: 0 }} 
      whileInView={{ opacity: 1 }} 
      viewport={{ once: true }} 
      transition={{ duration: 0.8 }} 
      className="w-full bg-[#030303] text-white px-6 lg:px-16 py-24 border-t border-white/5 relative overflow-hidden"
    >
      <div className="max-w-[1795px] mx-auto relative z-10">
        
        {/* Header Block */}
<div className="mb-16">
  <SectionHeading
    title={
      <h2 className="text-[30px] sm:text-[40px] font-bold uppercase tracking-wide text-left whitespace-nowrap">
        LATEST <span className="text-[#009DFF]">RESEARCH</span> & INTEL
      </h2>
      
    }
    titleClassName="text-left"
    dividerWidthClassName="w-[180px]"
  />
  <p className="mt-5 text-center text-[#A0A0A0] text-[14px] sm:text-[16px] leading-relaxed max-w-[900px] mx-auto font-light">
  Access GFF's verified design paradigms, structural blueprints,
  and operational safety standards for enterprise execution.
</p>
</div>

        {/* 1. Core Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {CATS.map((c) => (
            <div key={c.name} className="relative rounded-[16px] bg-[#070707] p-6 border border-white/5 flex flex-col justify-between min-h-[220px] group">
              <div>
                <div className="w-3 h-3 rounded-full mb-4 group-hover:scale-110 transition-transform" style={{ backgroundColor: c.color }} />
                <h3 className="text-[18px] font-bold tracking-tight text-white">{c.name}</h3>
                <p className="text-[13px] text-white/55 mt-2 font-light leading-relaxed">{c.desc}</p>
              </div>
              <span className="text-[11px] font-mono mt-4 block cursor-pointer" style={{ color: c.color }}>Browse Category →</span>
            </div>
          ))}
        </div>

        {/* 2. Split Workspace */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Panel: Verified Specifications */}
          <div className="xl:col-span-7 flex flex-col justify-between">
            <h3 className="text-xl font-bold tracking-tight uppercase mb-4 text-white/80">Enterprise Specifications</h3>
            <div className="space-y-4">
              {SPECS.map((s) => (
                <div key={s.id} className="rounded-[12px] bg-[#070707] border border-white/5 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="text-[9px] font-mono text-white/40 uppercase tracking-wider block mb-1">{s.size}</span>
                    <h4 className="text-[15px] font-bold text-white tracking-tight">{s.title}</h4>
                  </div>
                  <div className="min-w-[120px] text-right">
                    {downloading === s.id ? (
                      <span className="text-[#009DFF] text-[10.5px] font-mono animate-pulse block">STREAMING {progress}%</span>
                    ) : success === s.id ? (
                      <span className="text-emerald-400 font-mono text-[10.5px] uppercase block">✓ Streamed</span>
                    ) : (
                      <button 
                        onClick={() => { setProgress(0); setDownloading(s.id); }} 
                        className="bg-white/5 hover:bg-white/10 text-white border border-white/10 font-mono text-[10.5px] uppercase tracking-wider px-3.5 py-1.5 rounded-full cursor-pointer transition-all duration-300 block w-full md:w-auto text-center"
                      >
                        Stream Spec
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel: Hub Registry */}
          <div className="xl:col-span-5">
            <h3 className="text-xl font-bold tracking-tight uppercase mb-4 text-white/80">Intelligence Channels</h3>
            <div className="grid grid-cols-2 gap-3">
              {CHANNELS.map((ch) => (
                <button 
                  key={ch} 
                  onClick={() => setActive(ch)} 
                  className="rounded-xl border border-white/5 bg-[#070707] hover:bg-[#0c0c0c] hover:border-white/15 p-4 text-left transition-all flex items-center justify-between min-h-[60px] cursor-pointer group"
                >
                  <span className="text-[13px] font-bold text-white group-hover:text-[#E98828] transition-colors leading-tight">{ch}</span>
                  <span className="text-[8.5px] font-mono text-white/30 group-hover:text-white/60">ACCESS</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Gateway Dialog Overlay */}
      <AnimatePresence>
        {active && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} className="absolute inset-0 bg-black/80 backdrop-blur-[10px]" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.96 }} 
              className="relative w-full max-w-[440px] rounded-[20px] border border-white/10 bg-[#0a0a0a] p-6 shadow-2xl text-left"
            >
              <button onClick={close} className="absolute top-4 right-4 text-white/40 hover:text-white text-xs cursor-pointer">✕</button>
              
              <span className="text-[#E98828] font-mono text-[9px] uppercase tracking-widest font-semibold block mb-2">GFF Gateway Security</span>
              <h3 className="text-lg font-bold text-white uppercase">Route: {active}</h3>
              <p className="text-[12.5px] text-white/55 leading-relaxed mt-2 font-light">
                This channel is undergoing formal compliance evaluation. Secure access for <strong className="text-[#E98828] font-medium">{active}</strong> is scheduled for the GFF Q3 2026 update.
              </p>
              
              <div className="h-[1px] bg-white/10 my-4" />
              
              {sub === "idle" && (
                <form onSubmit={handleSub} className="space-y-3">
                  <p className="text-[10px] font-mono uppercase text-white/40">Request Pre-Release Spec Draft</p>
                  <input 
                    type="email" 
                    required 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="Enter enterprise email..." 
                    className="w-full bg-black border border-white/10 rounded-lg px-3.5 py-2.5 text-[12.5px] text-white focus:outline-none focus:border-[#E98828] transition-all" 
                  />
                  <button type="submit" className="w-full bg-white text-black font-mono text-[10.5px] uppercase tracking-wider py-2.5 rounded-lg cursor-pointer font-bold transition-all">Queue Request</button>
                </form>
              )}

              {sub === "submitting" && (
                <div className="text-center py-4">
                  <div className="w-6 h-6 rounded-full border-2 border-white/5 border-t-[#E98828] animate-spin mb-3 mx-auto" />
                  <span className="text-[#E98828] text-[10px] font-mono animate-pulse uppercase">Establishing Clearance Route...</span>
                </div>
              )}

              {sub === "success" && (
                <div className="text-center space-y-3 py-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 mx-auto text-md">✓</div>
                  <h4 className="text-[13.5px] font-bold text-white uppercase">Request Logged</h4>
                  <p className="text-[12px] text-white/55 leading-relaxed font-light">
                    System security validation for <span className="text-emerald-400 font-mono">{email}</span> has been queued. Notification will be sent upon publication.
                  </p>
                  <button onClick={close} className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-[10px] uppercase tracking-wider py-2 rounded-lg cursor-pointer">Dismiss Console</button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
