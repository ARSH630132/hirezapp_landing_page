"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  FolderGit, 
  CreditCard, 
  HelpCircle, 
  FileText, 
  Cpu, 
  BarChart3, 
  Shield, 
  ArrowRight, 
  Lock, 
  Terminal, 
  CheckCircle,
  Activity,
  ShieldAlert,
  Server,
  Database,
  Fingerprint,
  RefreshCw,
  Check,
  ChevronRight,
  Zap,
  CheckSquare
} from "lucide-react";
import { InnerPageShell, BentoGrid, BentoCard, SecurePortalPreview } from "@/components/inner-pages";
import { MODULES } from "@/components/portal/modulesData";
import PortalHero from "@/components/portal/PortalHero";

export default function ClientPortalLandingPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const activeModule = MODULES.find(m => m.id === activeTab) || MODULES[0];
  
  // States for interactive panel items inside visualizers
  const [isToolSandboxOn, setIsToolSandboxOn] = useState(true);
  const [modelSelector, setModelSelector] = useState("GFF Sovereign-70B");

  // Smooth scroll handler
  const handleScrollToSuite = () => {
    const el = document.getElementById("workspace-suite");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <InnerPageShell showContact={true}>
      
      {/* 1. CUSTOM HERO SECTION */}
      <PortalHero onExploreClick={handleScrollToSuite} />

      {/* 2. SECURE DECOUPLED ARCHITECTURE DIAGRAM */}
      <section className="relative w-full px-6 lg:px-16 py-16 bg-[#030303]/50 border-t border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        
        <div className="max-w-[1795px] mx-auto">
          <div className="text-center space-y-4 mb-16">
            <span className="text-[11px] font-bold tracking-[0.15em] text-[#E4000F] uppercase">
              Decoupled Architecture
            </span>
            <h2 className="text-[28px] sm:text-[40px] font-bold text-white tracking-tight">
              A Decoupled Sandbox Built for Boardroom Confidence
            </h2>
            <p className="text-[14px] sm:text-[16px] text-white/60 font-light max-w-[740px] mx-auto leading-relaxed font-sans">
              To guarantee total privacy, GFF AI separates live production multi-agent compute kernels from the presentation workspace. Our client portal operates strictly as an auditing handshake interface.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center pt-4">
            
            {/* Block 1: Client Portal */}
            <div className="p-6 rounded-2xl border border-white/5 bg-[#050505]/40 backdrop-blur-md relative group">
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/20 rounded-tl-2xl" />
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-lg bg-[#009DFF]/5 border border-[#009DFF]/20 flex items-center justify-center">
                  <LayoutDashboard className="w-4 h-4 text-[#009DFF]" />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold uppercase tracking-wider text-white">Client Portal Presentation</h4>
                  {/* <span className="text-[9px] font-mono text-[#009DFF]">BROWSER / SECURE SOCKET</span> */}
                </div>
              </div>
              <p className="text-[12.5px] text-white/50 leading-relaxed font-light font-sans">
                An isolated web console to review task reports, invoices, milestones, and audit trails. Execution logs are loaded on-demand and cached strictly in local transient memory.
              </p>
            </div>

            {/* Block 2: Handshake / Decoupling Tunnel */}
            <div className="flex flex-col items-center justify-center p-4">
              <div className="w-full flex items-center justify-center gap-2 mb-2">
                <span className="h-[1px] flex-grow bg-gradient-to-r from-[#009DFF]/30 to-[#E4000F]/30" />
                <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-mono text-white/60 uppercase tracking-widest flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-[#E4000F]" /> Zero-Trust Handshake
                </div>
                <span className="h-[1px] flex-grow bg-gradient-to-r from-[#E4000F]/30 to-[#009DFF]/30" />
              </div>
              <p className="text-[11px] text-white/40 text-center max-w-[280px] font-mono leading-relaxed mt-2">
                AES-256 session token pathways keep client secrets invisible to presentation networks.
              </p>
            </div>

            {/* Block 3: Live Sovereign Enclaves */}
            <div className="p-6 rounded-2xl border border-white/5 bg-[#050505]/40 backdrop-blur-md relative group">
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/20 rounded-tr-2xl" />
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-lg bg-[#E4000F]/5 border border-[#E4000F]/20 flex items-center justify-center">
                  <Server className="w-4 h-4 text-[#E4000F]" />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold uppercase tracking-wider text-white">Sovereign Model Enclaves</h4>
                  {/* <span className="text-[9px] font-mono text-[#E4000F]">HYPERVISOR REINFORCED / eBPF</span> */}
                </div>
              </div>
              <p className="text-[12.5px] text-white/50 leading-relaxed font-light font-sans">
                The actual agent brains and workflows. Active model parameters, memory maps, and tool executables run in isolated enclaves protected by hardware seed security boundaries.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE MODULE PREVIEW SYSTEM */}
      <section id="workspace-suite" className="relative w-full px-6 lg:px-16 py-20 lg:py-28 overflow-hidden">
        <div className="max-w-[1795px] mx-auto space-y-16">
          
          {/* Section Heading */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end border-b border-white/5 pb-8">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-[11px] font-bold tracking-[0.15em] text-[#009DFF] uppercase">
                Interactive Suite Overview
              </span>
              <h2 className="text-[32px] sm:text-[44px] font-bold text-white tracking-tight leading-none">
                The Sovereign Workspace Suite
              </h2>
              <p className="text-[14px] sm:text-[16px] text-white/60 font-light max-w-[640px] leading-relaxed font-sans">
                Explore each system module pre-integrated into our secure presentation layer. Click a module below to inspect real-time system behaviors, specifications, and simulated terminal outputs.
              </p>
            </div>
            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[11px] font-mono text-white/60 flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                Live Handshake Handled
              </span>
            </div>
          </div>

          {/* Interactive tab selector and preview terminal */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left selectors */}
            <div className="lg:col-span-4 space-y-2">
              {/* <span className="text-[10px] font-mono font-bold tracking-wider text-white/30 uppercase pl-3 block mb-3">WORKSPACE MODULES</span> */}
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                {MODULES.map((mod) => {
                  const IconComp = mod.icon;
                  const isActive = activeTab === mod.id;
                  return (
                    <button
                      key={mod.id}
                      onClick={() => setActiveTab(mod.id)}
                      className={`w-full text-left p-3 lg:p-4 rounded-xl border transition-all duration-200 flex items-center justify-between group cursor-pointer ${
                        isActive
                          ? "bg-white/[0.04] border-white/15 text-white shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
                          : "bg-transparent border-transparent text-white/50 hover:text-white hover:bg-white/[0.015]"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`h-8 w-8 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                          isActive 
                            ? "border-[#009DFF]/30 bg-[#009DFF]/10 text-[#009DFF]" 
                            : "border-white/5 bg-white/[0.01] text-white/40 group-hover:text-white"
                        }`}>
                          <IconComp className="w-4 h-4" />
                        </div>
                        <span className="text-[13px] font-medium uppercase tracking-wider truncate">{mod.name}</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${
                        isActive ? "text-[#009DFF] translate-x-0.5" : "text-white/10 group-hover:text-white/30"
                      }`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right preview terminal screen */}
            <div className="lg:col-span-8">
              <div className="w-full rounded-2xl border border-white/10 bg-[#050507]/90 shadow-[0_15px_50px_rgba(0,0,0,0.8)] overflow-hidden">
                
                {/* Header controls bar */}
                <div className="bg-[#0b0b0f] border-b border-white/5 px-4 py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E4000F]/60" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                    <span className="text-[10px] font-mono text-white/40 ml-3 truncate select-none">
                      gff-gateway://secure-enclave/workspace/{activeModule.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest hidden sm:inline">SHA-256 COMPLIANT</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 space-y-6">
                  
                  {/* Module Title row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
                    <div>
                      <span className="text-[10px] font-mono font-bold tracking-[0.1em] text-[#009DFF] bg-[#009DFF]/5 border border-[#009DFF]/20 px-2.5 py-0.5 rounded uppercase">
                        {activeModule.tag}
                      </span>
                      <h3 className="text-[20px] sm:text-[24px] font-bold text-white tracking-tight mt-3">
                        {activeModule.title}
                      </h3>
                      <p className="text-[13px] text-white/60 font-light mt-1 max-w-[580px] leading-relaxed font-sans">
                        {activeModule.description}
                      </p>
                    </div>

                    <Link 
                      href="/portal/login" 
                      className="shrink-0 self-start sm:self-center px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-[11px] font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5 transition-colors group"
                    >
                      <span>Simulate Access</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-[#009DFF]" />
                    </Link>
                  </div>

                  {/* Bullets & Technical Specs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <span className="text-[9.5px] font-mono font-bold text-white/30 uppercase tracking-wider block">Operational Deliverables</span>
                      <div className="space-y-3">
                        {activeModule.bullets.map((bullet, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <div className="h-5 w-5 rounded-md bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center shrink-0 mt-0.5">
                              <Check className="w-3 h-3 text-emerald-400" />
                            </div>
                            <span className="text-[13px] text-white/70 leading-[1.4] font-light font-sans">{bullet}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-white/5 bg-black/40 space-y-3">
                      <span className="text-[9.5px] font-mono font-bold text-white/30 uppercase tracking-wider block">Technical Parameters</span>
                      <div className="grid grid-cols-2 gap-4">
                        {activeModule.specs.map((spec, i) => (
                          <div key={i} className="flex flex-col">
                            <span className="text-[10px] text-white/40 uppercase tracking-wider truncate font-mono">{spec.label}</span>
                            <span className="text-[12.5px] text-white font-semibold mt-0.5 truncate">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* CUSTOM WORKSPACE MOCK DEMOS */}
                  <div className="border border-white/5 bg-black/20 rounded-xl p-5 relative overflow-hidden">
                    <span className="text-[9.5px] font-mono font-bold text-white/30 uppercase tracking-wider block mb-4">Workspace Sandbox Preview</span>
                    
                    {activeModule.id === "dashboard" && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                        <div className="p-3.5 rounded-lg border border-white/5 bg-white/[0.01] flex items-center gap-3">
                          <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
                          <div>
                            <span className="block text-[10px] text-white/40 uppercase font-mono">Kernel Core</span>
                            <span className="text-[13px] font-bold text-white font-mono">NOMINAL UPTIME</span>
                          </div>
                        </div>
                        <div className="p-3.5 rounded-lg border border-white/5 bg-white/[0.01] flex items-center gap-3">
                          <Lock className="w-5 h-5 text-[#009DFF]" />
                          <div>
                            <span className="block text-[10px] text-white/40 uppercase font-mono">Socket State</span>
                            <span className="text-[13px] font-bold text-white font-mono">ENCRYPTED</span>
                          </div>
                        </div>
                        <div className="p-3.5 rounded-lg border border-white/5 bg-white/[0.01] flex items-center gap-3">
                          <Cpu className="w-5 h-5 text-[#E4000F]" />
                          <div>
                            <span className="block text-[10px] text-white/40 uppercase font-mono">Enclave Link</span>
                            <span className="text-[13px] font-bold text-white font-mono">3 LIVE CLUSTERS</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeModule.id === "projects" && (
                      <div className="space-y-3.5 pt-1">
                        {[
                          { name: "Accounting Ledger Auditor Enclave", status: "84% Complied", color: "bg-[#009DFF]" },
                          { name: "Legal Document Redactor Engine", status: "62% Parsed", color: "bg-purple-500" },
                          { name: "Strategic Intelligence Index Tracker", status: "ACTIVE", color: "bg-emerald-400" }
                        ].map((proj, i) => (
                          <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 border border-white/5 rounded-lg bg-white/[0.01]">
                            <span className="text-[12px] font-bold text-white truncate font-sans">{proj.name}</span>
                            <div className="flex items-center gap-3 shrink-0">
                              <span className="text-[10px] font-mono text-white/50">{proj.status}</span>
                              <div className="w-16 h-1.5 rounded-full bg-white/5 overflow-hidden">
                                <div className={`h-full ${proj.color}`} style={{ width: proj.status.includes("%") ? proj.status.split("%")[0] + "%" : "100%" }} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {activeModule.id === "billing" && (
                      <div className="overflow-x-auto pt-1">
                        <table className="w-full text-left font-mono text-[11px] text-white/60">
                          <thead>
                            <tr className="border-b border-white/5 text-white/40 text-[9px] uppercase">
                              <th className="pb-2">COMPUTATION ENGINE</th>
                              <th className="pb-2">ALLOCATION QUANTITY</th>
                              <th className="pb-2 text-right">EPOCH RATE</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-white/5">
                              <td className="py-2 text-white">Llama-3-70B Prompt Pipeline</td>
                              <td className="py-2">1,248,391 Tokens</td>
                              <td className="py-2 text-right text-white font-bold">$12.48</td>
                            </tr>
                            <tr className="border-b border-white/5">
                              <td className="py-2 text-white">Isolated Hypervisor Sandbox Compute</td>
                              <td className="py-2">14.5 Enclave Hours</td>
                              <td className="py-2 text-right text-white font-bold">$29.00</td>
                            </tr>
                            <tr>
                              <td className="py-2 text-white">Zero-Trust Memory Sync Pathways</td>
                              <td className="py-2">Unlimited Syncs</td>
                              <td className="py-2 text-right text-emerald-400 font-bold">SLA INCLUDED</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}

                    {activeModule.id === "support" && (
                      <div className="space-y-3 pt-1">
                        <div className="p-3 rounded-lg border border-white/5 bg-white/[0.01] max-w-[85%]">
                          <span className="block text-[8px] font-mono text-[#009DFF] mb-1">CLIENT AUDITOR [08:04:12]</span>
                          <p className="text-[11.5px] text-white/80 leading-relaxed font-sans">We noticed an error in validating custom tools execution constraints on the eBPF sandbox interface. Please advise on policy settings.</p>
                        </div>
                        <div className="p-3 rounded-lg border border-[#E4000F]/10 bg-[#E4000F]/5 max-w-[85%] ml-auto text-right">
                          <span className="block text-[8px] font-mono text-[#E4000F] mb-1">GFF LEVEL IV OPERATOR [08:06:45]</span>
                          <p className="text-[11.5px] text-white/80 leading-relaxed font-sans text-left sm:text-right">Acknowledge. We have successfully adjusted the eBPF hypervisor memory bounds. The policy mismatch is cleared. Reload to sync.</p>
                        </div>
                      </div>
                    )}

                    {activeModule.id === "documents" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        {[
                          { name: "GFF_AI_Sovereign_Blueprint_v4.2.pdf", size: "14.8 MB", hash: "0x3F882C" },
                          { name: "SG_PDPA_Safety_Compliance_Audits.pdf", size: "4.2 MB", hash: "0x9B10CE" },
                          { name: "Master_Sovereign_Services_SLA.pdf", size: "1.8 MB", hash: "0x1A22BF" },
                          { name: "eBPF_Isolated_Enclave_Specs.pdf", size: "3.2 MB", hash: "0xBF92A4" }
                        ].map((doc, i) => (
                          <div key={i} className="p-3 border border-white/5 rounded-lg bg-white/[0.01] flex items-center justify-between gap-4">
                            <div className="min-w-0">
                              <span className="block text-[11.5px] font-bold text-white truncate font-sans">{doc.name}</span>
                              <span className="block text-[9px] text-white/40 font-mono mt-0.5">SIZE: {doc.size} | SHA-256: {doc.hash}...</span>
                            </div>
                            <FileText className="w-4 h-4 text-white/30 shrink-0" />
                          </div>
                        ))}
                      </div>
                    )}

                    {activeModule.id === "ai-operations" && (
                      <div className="pt-1 flex flex-col sm:flex-row gap-6 justify-between items-center">
                        <div className="space-y-4 w-full sm:w-1/2">
                          <div className="flex items-center justify-between p-2.5 border border-white/5 rounded-lg bg-white/[0.01]">
                            <span className="text-[11px] text-white/60 font-mono">Tool Execution Sandbox</span>
                            <button 
                              type="button"
                              onClick={() => setIsToolSandboxOn(!isToolSandboxOn)}
                              className={`h-5 w-10 rounded-full border p-0.5 transition-colors cursor-pointer ${
                                isToolSandboxOn ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : "bg-white/5 border-white/10 text-white/30"
                              }`}
                            >
                              <div className={`h-3.5 w-3.5 rounded-full bg-white transition-transform duration-200 ${isToolSandboxOn ? "translate-x-5" : "translate-x-0"}`} />
                            </button>
                          </div>

                          <div className="flex items-center justify-between p-2.5 border border-white/5 rounded-lg bg-white/[0.01]">
                            <span className="text-[11px] text-white/60 font-mono">Engine Base Model</span>
                            <select 
                              value={modelSelector} 
                              onChange={(e) => setModelSelector(e.target.value)}
                              className="bg-black border border-white/10 rounded px-2 py-0.5 text-[10px] text-white font-mono focus:outline-none focus:border-white/30"
                            >
                              <option value="GFF Sovereign-70B">GFF Sovereign-70B</option>
                              <option value="Llama-3-70B-Instruct">Llama-3-70B</option>
                              <option value="Qwen-2.5-Coder-72B">Qwen-2.5-Coder</option>
                            </select>
                          </div>
                        </div>

                        <div className="p-4 rounded-lg border border-[#009DFF]/10 bg-[#009DFF]/5 w-full sm:w-1/2 flex flex-col justify-center text-center">
                          <span className="text-[9px] font-mono text-[#009DFF] uppercase tracking-wider block">Sandbox Status</span>
                          <span className="text-[22px] font-bold text-white tracking-tight font-mono mt-1">SB-ENFORCED</span>
                          <span className="text-[10px] text-white/40 font-light mt-1 font-sans">pgvector similarity metrics sync active.</span>
                        </div>
                      </div>
                    )}

                    {activeModule.id === "analytics" && (
                      <div className="pt-1 flex flex-col sm:flex-row gap-6 justify-between items-center">
                        <div className="space-y-4 w-full sm:w-1/2">
                          <div>
                            <span className="text-[9px] font-mono text-white/40 uppercase block">Labor Substitution Gains</span>
                            <span className="text-[26px] font-bold text-emerald-400 tracking-tight flex items-baseline gap-1.5 mt-0.5 font-mono">
                              41.2% <span className="text-[11px] font-light text-white/40 font-sans">vs Manual Baseline</span>
                            </span>
                          </div>
                          <div>
                            <span className="text-[9px] font-mono text-white/40 uppercase block">Productivity Velocity Multiplier</span>
                            <span className="text-[26px] font-bold text-[#009DFF] tracking-tight flex items-baseline gap-1.5 mt-0.5 font-mono">
                              1.42x <span className="text-[11px] font-light text-white/40 font-sans">SLA Output Gain</span>
                            </span>
                          </div>
                        </div>

                        {/* Custom SVG line graph */}
                        <div className="w-full sm:w-1/2 h-28 border border-white/5 rounded-lg bg-black/40 relative p-2 flex items-end">
                          <svg className="w-full h-full absolute inset-0 p-3" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M0 80 Q25 70, 50 45 T100 15" fill="none" stroke="url(#lineGradient)" strokeWidth="3" />
                            <path d="M0 80 Q25 70, 50 45 T100 15 L100 100 L0 100 Z" fill="url(#fillGradient)" opacity="0.15" />
                            <defs>
                              <linearGradient id="lineGradient" x1="0" y1="100" x2="100" y2="0">
                                <stop offset="0%" stopColor="#E4000F" />
                                <stop offset="100%" stopColor="#009DFF" />
                              </linearGradient>
                              <linearGradient id="fillGradient" x1="0" y1="100" x2="100" y2="0">
                                <stop offset="0%" stopColor="#E4000F" />
                                <stop offset="100%" stopColor="#009DFF" />
                              </linearGradient>
                            </defs>
                          </svg>
                          <span className="absolute bottom-2 left-2 text-[8px] font-mono text-white/30">WEEK 1</span>
                          <span className="absolute bottom-2 right-2 text-[8px] font-mono text-[#009DFF] font-bold">WEEK 26 (ACTIVE)</span>
                        </div>
                      </div>
                    )}

                    {activeModule.id === "governance" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                        <div className="p-4 rounded-lg border border-white/5 bg-white/[0.01]">
                          <span className="block text-[9px] font-mono text-white/40 uppercase">Real-Time Toxicity Check</span>
                          <span className="text-[20px] font-bold text-emerald-400 tracking-tight block mt-1 font-mono">100% ACTIVE</span>
                          <span className="text-[10px] text-white/50 leading-relaxed font-light mt-0.5 block font-sans">Zero hazardous or out-of-bounds agent operations permitted.</span>
                        </div>
                        <div className="p-4 rounded-lg border border-white/5 bg-white/[0.01]">
                          <span className="block text-[9px] font-mono text-white/40 uppercase">eBPF Security Guardrail Status</span>
                          <span className="text-[20px] font-bold text-[#E4000F] tracking-tight block mt-1 font-mono">FULLY ENFORCED</span>
                          <span className="text-[10px] text-white/50 leading-relaxed font-light mt-0.5 block font-sans">Automated hypervisor process auditing validated daily.</span>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Terminal Log Console */}
                  <div className="p-4 rounded-xl border border-white/5 bg-black/80 font-mono text-[10.5px] leading-relaxed text-white/50 space-y-1 relative">
                    <div className="absolute top-3 right-4 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#009DFF] animate-pulse" />
                      <span className="text-[8.5px] text-white/30 uppercase tracking-widest font-bold">LIVE TELEMETRY</span>
                    </div>
                    {activeModule.terminalOutput.map((log, i) => (
                      <div key={i} className="flex gap-2 select-all">
                        <span className="text-[#009DFF] shrink-0 font-bold">&gt;</span>
                        <span className="break-all">{log}</span>
                      </div>
                    ))}
                  </div>

                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. COMPLIANCE & SANDBOX LOCK INTERACTION */}
      <section className="relative w-full px-6 lg:px-16 py-16 bg-[#030303]/50 border-t border-b border-white/5 overflow-hidden">
        <div className="max-w-[1795px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6">
            <SecurePortalPreview />
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="px-3 py-1 text-[11px] font-bold tracking-[0.12em] text-[#E4000F] border border-[#E4000F]/25 bg-[#E4000F]/5 rounded-full uppercase">
                Gateway Trust & Compliance
              </span>
              <h3 className="text-[28px] sm:text-[36px] font-bold text-white tracking-tight mt-4">
                Enterprise Integrity, Decoupled Safely
              </h3>
              <p className="text-[14px] sm:text-[16px] leading-[1.6] text-white/60 font-light mt-3 font-sans">
                GFF AI PTE LTD. does not store client credentials or live processing variables on third-party analytical engines. This architecture allows audit groups and risk compliance teams to inspect execution states without creating a single vector of entry.
              </p>
            </div>

            {/* Sandbox Simulation Notice */}
            <div className="p-5 rounded-xl border border-[#009DFF]/20 bg-[#009DFF]/5 text-[#009DFF] space-y-2 font-sans">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 shrink-0 text-[#009DFF]" />
                <h4 className="text-[13px] font-bold uppercase tracking-wider text-white font-mono">PREVIEW GATEWAY SIMULATION NOTICE</h4>
              </div>
              <p className="text-[11.5px] leading-relaxed text-white/70 font-light">
                <strong>Authentication & Database States are Localized Sandbox Previews.</strong> To permit complete corporate evaluations of GFF AI's suite interfaces, all database reads, live milestones, invoice generation, support triage, and model parameters operate within a client-side sandbox environment. No actual production connections or API requests are performed during this executive walkthrough.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 font-sans">
              <div className="flex items-center gap-2.5">
                <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-[12.5px] text-white/80 font-light">No credentials cached on disk</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-[12.5px] text-white/80 font-light">Safe compliance simulation</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. COMPLIANCE BENTO GRID */}
      <section className="relative w-full px-6 lg:px-16 py-20 lg:py-24">
        <div className="max-w-[1795px] mx-auto space-y-12">
          <div className="text-center space-y-4">
            {/* <span className="text-[11px] font-bold tracking-[0.15em] text-[#009DFF] uppercase">
              Security Frameworks
            </span> */}
            <h2 className="text-[28px] sm:text-[40px] font-bold text-white tracking-tight">
              Cryptographically Isolated Deliverables
            </h2>
            <p className="text-[14px] sm:text-[16px] text-white/60 font-light max-w-[620px] mx-auto font-sans">
              Our platform adheres strictly to elite secure software execution practices. We focus on transparent architecture over opaque, unverified badges.
            </p>
          </div>

          <BentoGrid>
            <BentoCard
              title="Secure handshakes isolate live systems"
              description="Sovereign presentation paths ensure that visual audits are Decoupled. Handshake protocols verify sessions using transient single-use key enclaves."
              badge="HANDSHAKE GATEWAY"
              icon={<Fingerprint className="w-5 h-5 text-[#009DFF]" />}
              glowColor="blue"
              metric={{ value: "0x7FFA", label: "HANDSHAKE SECURITY LEVEL" }}
            />
            <BentoCard
              title="eBPF OS kernel telemetry"
              description="Deep process tracking and automated risk policies are evaluated at the hardware core, eliminating runtime container leaks or out-of-bounds requests."
              badge="TELEMETRY LAYER"
              icon={<Cpu className="w-5 h-5 text-[#E4000F]" />}
              glowColor="red"
              metric={{ value: "eBPF", label: "KERNEL ISOLATION PROTOCOL" }}
            />
            <BentoCard
              title="Transient database boundaries"
              description="No analytical or administrative user secrets are stored on general presentation servers. Database instances are fully sandboxed and transient."
              badge="DATA SOVEREIGNTY"
              icon={<Database className="w-5 h-5 text-purple-400" />}
              glowColor="purple"
              metric={{ value: "AES-256", label: "ENVELOPED ENCRYPTION" }}
            />
          </BentoGrid>
        </div>
      </section>

      {/* 6. PREMIUM CALL TO ACTION */}
      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 py-16">
        <div className="w-full rounded-[24px] border border-white/5 bg-gradient-to-br from-[#0c0c0f] to-[#040405] p-8 sm:p-12 lg:p-16 relative overflow-hidden group text-center space-y-6">
          <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full bg-[#009DFF]/5 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-[#E4000F]/3 blur-[100px] pointer-events-none" />
          
          <span className="inline-flex px-3 py-1 text-[11px] font-bold tracking-[0.12em] text-[#009DFF] border border-[#009DFF]/25 bg-[#009DFF]/5 rounded-full uppercase">
            AUDIT ENCLAVE ACCESS
          </span>

          <h2 className="text-[32px] sm:text-[46px] lg:text-[54px] font-bold text-white tracking-tight leading-none max-w-[800px] mx-auto">
            Ready to Begin Sovereign Simulation?
          </h2>

          <p className="text-[14px] sm:text-[16px] text-white/60 font-light max-w-[620px] mx-auto leading-relaxed font-sans">
            If you are an authorized partner representative or executive board auditor, launch our secure sandbox gateway to simulate active workspaces.
          </p>

          <div className="flex justify-center pt-4">
            <Link 
              href="/portal/login"
              className="group relative h-12 px-8 rounded-xl bg-[#E4000F] hover:bg-[#E4000F]/90 text-white font-bold text-[13px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.98] hover:shadow-[0_0_30px_rgba(228,0,15,0.4)] cursor-pointer"
            >
              <Fingerprint className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
              Launch Secure Handshake
              <ArrowRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="pt-6 font-mono text-[9px] text-white/30 uppercase tracking-widest">
            Sovereign Gateway • UEN 202621347N • Built for 2026
          </div>
        </div>
      </div>
    </InnerPageShell>
  );
}
