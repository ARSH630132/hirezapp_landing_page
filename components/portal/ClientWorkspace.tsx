"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Lock, Shield, Key, CheckCircle, RefreshCw, Layers, FileText, 
  CreditCard, CheckSquare, MessageSquare, BarChart3, ShieldCheck, 
  Cpu, ArrowRight, UserCheck, AlertCircle, HelpCircle, Download, Activity
} from "lucide-react";

export default function ClientWorkspace() {
  const [authed, setAuthed] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Scanning micro-interaction states
  const [scanStep, setScanStep] = useState(0);
  const scanMessages = [
    "Establishing zero-trust handshake...",
    "Scanning hardware security module...",
    "Verifying passkey signature (SHA-256)...",
    "Decapsulating session enclave..."
  ];

  // Fluctuating metric states for telemetry
  const [cpuSingapore, setCpuSingapore] = useState(42);
  const [cpuLondon, setCpuLondon] = useState(18);
  const [cpuNY, setCpuNY] = useState(89);
  const [dataPoints, setDataPoints] = useState([35, 42, 38, 48, 52, 45, 58, 62, 59, 64]);

  useEffect(() => {
    if (!authed) return;
    const interval = setInterval(() => {
      setCpuSingapore(prev => {
        const delta = Math.floor(Math.random() * 7) - 3;
        return Math.min(100, Math.max(10, prev + delta));
      });
      setCpuLondon(prev => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.min(100, Math.max(10, prev + delta));
      });
      setCpuNY(prev => {
        const delta = Math.floor(Math.random() * 9) - 4;
        return Math.min(100, Math.max(10, prev + delta));
      });
      setDataPoints(prev => {
        const nextVal = Math.min(100, Math.max(20, prev[prev.length - 1] + (Math.floor(Math.random() * 14) - 7)));
        return [...prev.slice(1), nextVal];
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [authed]);

  // Mock support ticket state
  const [tickets, setTickets] = useState([
    { id: "T-882", subject: "London core replication delay", status: "Investigating" }
  ]);
  const [newSubject, setNewSubject] = useState("");

  // Simulated authentication handler
  const handleAuth = async () => {
    setScanning(true);
    setScanStep(0);
    const interval = setInterval(() => {
      setScanStep(prev => {
        if (prev < 3) return prev + 1;
        return prev;
      });
    }, 450);

    await new Promise(r => setTimeout(r, 1800));
    clearInterval(interval);
    setScanning(false);
    setAuthed(true);
  };

  const handleAddTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim()) return;
    setTickets([...tickets, { id: "T-" + Math.floor(100 + Math.random() * 900), subject: newSubject, status: "Submitted" }]);
    setNewSubject("");
  };

  if (!authed) {
    return (
      <div className="max-w-[500px] mx-auto my-12 p-8 rounded-[24px] border border-white/5 bg-[#050505]/40 backdrop-blur-[12px] relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-[#009DFF]/10 blur-[60px]" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-[#E4000F]/10 blur-[60px]" />

        <div className="text-center relative z-10">
          <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5 text-[#009DFF]">
            <Lock className="w-5 h-5" />
          </div>
          <span className="px-2 py-0.5 text-[9px] font-mono font-bold text-[#009DFF] bg-[#009DFF]/5 border border-[#009DFF]/20 rounded-full uppercase tracking-wider">Zero-Trust Protocol</span>
          <h2 className="text-[22px] font-bold text-white tracking-tight mt-3">Access Portal Core</h2>
          <p className="text-[13px] text-white/50 font-light mt-2 max-w-[360px] mx-auto">
            Establish a secure single-session enclave to inspect active multi-agent sandbox parameters.
          </p>

          <div className="mt-8 space-y-3">
            <button 
              onClick={handleAuth}
              disabled={scanning}
              className="w-full h-11 rounded-lg bg-white hover:bg-white/90 text-black font-semibold text-[12px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {scanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                  <span>Authenticating Enclave Session...</span>
                </>
              ) : (
                <>
                  <Key className="w-4 h-4" />
                  <span>Authenticate SSO / Passkey</span>
                </>
              )}
            </button>

            {scanning && (
              <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-3 font-mono text-[11px] text-left transition-all duration-300">
                <div className="relative h-20 bg-black/40 border border-white/5 rounded-lg overflow-hidden flex items-center justify-center">
                  {/* Glowing Grid Scanner background */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:10px_10px]" />
                  {/* Moving scanning line */}
                  <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#009DFF] to-transparent shadow-[0_0_10px_#009DFF] animate-pulse" style={{ top: "45%" }} />
                  
                  {/* Animated target circle */}
                  <div className="w-10 h-10 rounded-full border border-dashed border-[#009DFF]/40 flex items-center justify-center animate-spin" style={{ animationDuration: "8s" }}>
                    <div className="w-6 h-6 rounded-full border border-solid border-[#009DFF]/20 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#009DFF]" />
                    </div>
                  </div>
                </div>
                
                {/* Dynamic messages */}
                <div className="space-y-1.5 min-h-[40px]">
                  {scanMessages.slice(0, scanStep + 1).map((msg, idx) => (
                    <div key={idx} className="flex gap-2 items-center text-white/80">
                      {idx < scanStep ? (
                        <CheckCircle className="w-3.5 h-3.5 text-green-400 shrink-0" />
                      ) : (
                        <RefreshCw className="w-3.5 h-3.5 text-[#009DFF] animate-spin shrink-0" />
                      )}
                      <span className={idx < scanStep ? "text-white/40 line-through" : "text-white"}>{msg}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="p-3.5 rounded-lg bg-white/[0.01] border border-white/5 text-left font-mono text-[10px] text-white/40 leading-relaxed">
              <span className="text-[#009DFF] font-semibold block mb-0.5 uppercase tracking-wide flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Enclave Specifications
              </span>
              Standard-compliant AES-256 decrypted handshake session. Secure connection is decapsulated directly in hardware.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active Enclave Header
  return (
    <div className="rounded-[24px] border border-white/5 bg-[#050505]/40 backdrop-blur-[12px] overflow-hidden min-h-[640px] flex flex-col lg:flex-row">
      {/* Sidebar navigation for 12 requested modules */}
      <div className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-white/5 bg-black/40 p-4 shrink-0 flex flex-col gap-1.5 overflow-y-auto">
        <div className="px-3 py-1.5 mb-2 border-b border-white/5 pb-3">
          <span className="text-[9px] font-mono text-green-400 font-bold bg-green-500/5 border border-green-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">Session Secure</span>
          <div className="text-[11px] font-mono text-white/50 mt-2">ID: GFF-ENCLAVE-9810</div>
        </div>

        {[
          { id: "dashboard", label: "Dashboard", icon: Layers },
          { id: "projects", label: "Projects", icon: Cpu },
          { id: "programs", label: "Programs", icon: ShieldCheck },
          { id: "documents", label: "Documents", icon: FileText },
          { id: "invoices", label: "Invoices", icon: FileText },
          { id: "billing", label: "Billing", icon: CreditCard },
          { id: "approvals", label: "Approvals", icon: CheckSquare },
          { id: "support", label: "Support", icon: MessageSquare },
          { id: "analytics", label: "Analytics", icon: BarChart3 },
          { id: "governance", label: "Governance", icon: Shield },
          { id: "ai_ops", label: "AI Operations", icon: Cpu },
          { id: "control_center", label: "Control Center", icon: Lock }
        ].map(tab => {
          const Icon = tab.icon;
          const active = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={"w-full text-left px-3 py-2.5 rounded-lg text-[13px] font-medium font-mono transition-all cursor-pointer flex items-center gap-2.5 " + (
                active ? "bg-white/5 text-white border border-white/10" : "text-white/50 hover:text-white/80 hover:bg-white/[0.01]"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}

        <button 
          onClick={() => setAuthed(false)}
          className="mt-6 w-full text-left px-3 py-2 rounded-lg text-[11px] font-mono text-white/30 hover:text-white/60 hover:bg-white/[0.01] transition-all cursor-pointer border border-dashed border-white/5 text-center"
        >
          Disconnect Enclave
        </button>
      </div>

      {/* Main Tab Workspace Content */}
      <div className="flex-grow p-6 lg:p-8 overflow-x-hidden">
        {/* TAB 1: Dashboard */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white tracking-tight">Client Workspace Dashboard</h3>
            <p className="text-sm text-white/60">Unified operational intelligence summary of active multi-agent sandboxes.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <div className="p-5 rounded-xl border border-white/5 bg-white/[0.01] space-y-2">
                <span className="text-[10px] font-mono text-white/40 uppercase">ACTIVE PROTOCOLS</span>
                <div className="text-white font-mono text-[14px]">Sovereign Core Sandbox 02</div>
                <div className="text-xs text-white/50">Verified eBPF kernel event tracking boundary.</div>
              </div>
              <div className="p-5 rounded-xl border border-white/5 bg-white/[0.01] space-y-2">
                <span className="text-[10px] font-mono text-white/40 uppercase">COMPLIANCE STANDARDS</span>
                <div className="text-green-400 font-mono text-[14px] flex items-center gap-1.5"><CheckCircle className="w-4 h-4" /> SOC2 Type II Certified</div>
                <div className="text-xs text-white/50">Isolated administrative boundaries enforced.</div>
              </div>
            </div>
            <div className="border border-white/5 rounded-xl overflow-hidden mt-4">
              <div className="bg-white/[0.02] border-b border-white/5 px-4 py-2 text-[10.5px] font-mono text-white/40 uppercase">Recent System Handshakes</div>
              <div className="p-4 space-y-2 font-mono text-[11px] text-white/50">
                <div className="flex justify-between"><span>[07:18:24] Handshake initiated</span><span className="text-green-400">SUCCESS</span></div>
                <div className="flex justify-between"><span>[07:18:24] Cryptographic key handshake verified</span><span className="text-white/30">AES-256</span></div>
                <div className="flex justify-between"><span>[07:18:25] Enclave decapsulated</span><span className="text-white/30">ID: 9810</span></div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Projects */}
        {activeTab === "projects" && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white tracking-tight">Multi-Agent Projects</h3>
            <p className="text-sm text-white/60">Active transformative agent sandboxes and delivery structures.</p>
            <div className="border border-white/5 rounded-xl overflow-hidden mt-4">
              <table className="w-full text-left font-mono text-[12px] text-white/70">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-white/5 text-white/40 text-[10px] uppercase">
                    <th className="p-4">Project ID</th>
                    <th className="p-4">Platform Core</th>
                    <th className="p-4">Environment</th>
                    <th className="p-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    { id: "P-MESH-10", core: "RetailMesh Core", env: "Global Sandbox", status: "ACTIVE_CORE" },
                    { id: "P-GOV-98", core: "Runtime Governance", env: "Regional Enclave", status: "VALIDATING" },
                    { id: "P-FOUND-04", core: "Foundry Sandbox", env: "Local Mesh", status: "IN_SANDBOX" }
                  ].map(p => (
                    <tr key={p.id} className="hover:bg-white/[0.01]">
                      <td className="p-4 text-white font-semibold">{p.id}</td>
                      <td className="p-4">{p.core}</td>
                      <td className="p-4 text-white/50">{p.env}</td>
                      <td className="p-4 text-right"><span className="px-2 py-0.5 text-[10px] font-bold bg-green-500/10 text-green-400 rounded border border-green-500/20">{p.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Programs */}
        {activeTab === "programs" && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white tracking-tight">Strategic Programs</h3>
            <p className="text-sm text-white/60">Transformation timelines, sandbox milestones, and compliance roadmaps.</p>
            <div className="space-y-4 pt-4">
              {[
                { phase: "Phase I: Core Decoupling", desc: "Isolate central databases and deploy local multi-agent listeners.", date: "Completed" },
                { phase: "Phase II: Sovereign Lattice Integration", desc: "Bridge Singapore and London cores via runtime compliance guardrails.", date: "In Progress" },
                { phase: "Phase III: Full Agent Autonomy", desc: "Graduate active multi-agent loops to production scale.", date: "Scheduled" }
              ].map((p, i) => (
                <div key={i} className="p-4 rounded-lg border border-white/5 bg-white/[0.01] flex justify-between items-center">
                  <div>
                    <h4 className="text-[13px] font-bold text-white">{p.phase}</h4>
                    <p className="text-xs text-white/50 mt-1">{p.desc}</p>
                  </div>
                  <span className="px-3 py-1 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-white/70">{p.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Documents */}
        {activeTab === "documents" && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white tracking-tight">Secure Documentation</h3>
            <p className="text-sm text-white/60">Cryptographically signed architectural blueprints and audit credentials.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              {[
                { name: "Sovereign Core Architectural Blueprint", hash: "SHA-256: AB98...22F" },
                { name: "SOC2 Compliance Enclave Certificate", hash: "SHA-256: FF41...390" },
                { name: "GFF AI Runtime Governance Rules", hash: "SHA-256: 01DE...A88" }
              ].map((doc, i) => (
                <div key={i} className="p-4 rounded-lg border border-white/5 bg-[#020202]/30 flex justify-between items-center group hover:border-white/10 transition-colors">
                  <div>
                    <h4 className="text-[13px] font-bold text-white group-hover:text-[#009DFF] transition-colors">{doc.name}</h4>
                    <span className="text-[10px] font-mono text-white/40 block mt-1">{doc.hash}</span>
                  </div>
                  <button className="p-2 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white cursor-pointer"><Download className="w-3.5 h-3.5" /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: Invoices */}
        {activeTab === "invoices" && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white tracking-tight">Invoice Ledger</h3>
            <p className="text-sm text-white/60">Verified billing statements and commercial transaction receipts.</p>
            <div className="border border-white/5 rounded-xl overflow-hidden mt-4">
              <table className="w-full text-left font-mono text-[12px] text-white/70">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-white/5 text-white/40 text-[10px] uppercase">
                    <th className="p-4">Invoice ID</th>
                    <th className="p-4">Billing Cycle</th>
                    <th className="p-4">Total USD</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    { id: "INV-9981-01", cycle: "Jun 2026", amount: "$12,450.00" },
                    { id: "INV-9981-02", cycle: "May 2026", amount: "$12,450.00" }
                  ].map(inv => (
                    <tr key={inv.id} className="hover:bg-white/[0.01]">
                      <td className="p-4 text-white font-semibold">{inv.id}</td>
                      <td className="p-4">{inv.cycle}</td>
                      <td className="p-4 text-white/50">{inv.amount}</td>
                      <td className="p-4 text-right"><button className="px-2.5 py-1 text-[10px] font-bold bg-white/5 border border-white/10 rounded hover:bg-white/10 text-white cursor-pointer">Signed Copy (PDF)</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: Billing */}
        {activeTab === "billing" && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white tracking-tight">Sovereign Billing Parameters</h3>
            <p className="text-sm text-white/60">Active subscription parameters, quota caps, and credit levels.</p>
            <div className="p-5 rounded-xl border border-white/5 bg-[#020202]/30 space-y-4 max-w-[500px]">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-xs text-white/55">Active Subscription Plan</span>
                <span className="text-sm text-white font-mono font-bold">Enterprise Infinite</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-xs text-white/55">Subscription Interval</span>
                <span className="text-sm text-white font-mono">Monthly Enclave Invoice</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-xs text-white/55">Subscribed Nodes</span>
                <span className="text-sm text-white font-mono">4 Active Cores</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-xs text-white/55">Billing Status</span>
                <span className="text-green-400 font-mono font-bold uppercase tracking-wider text-xs">Good Standing</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: Approvals */}
        {activeTab === "approvals" && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white tracking-tight">Active Approvals Queue</h3>
            <p className="text-sm text-white/60">Human-in-the-loop authorization gates for sensitive agent overrides.</p>
            <div className="space-y-3 pt-3">
              {[
                { rule: "Allow secondary ledger write privileges", agent: "RetailMesh-Agent-02A", time: "Pending approval" },
                { rule: "Alter maximum sensory memory cache bounds", agent: "Foundry-Agent-11", time: "Pending approval" }
              ].map((app, i) => (
                <div key={i} className="p-4 rounded-lg border border-white/5 bg-white/[0.01] flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-mono text-[#009DFF] uppercase tracking-wider">{app.agent}</span>
                    <h4 className="text-[13px] font-bold text-white mt-1">{app.rule}</h4>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 rounded text-[11px] font-mono bg-green-500/10 border border-green-500/20 text-green-400 cursor-pointer">Approve</button>
                    <button className="px-3 py-1.5 rounded text-[11px] font-mono bg-[#E4000F]/10 border border-[#E4000F]/20 text-[#E4000F] cursor-pointer">Deny</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: Support */}
        {activeTab === "support" && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white tracking-tight">Secure Technical Support</h3>
            <p className="text-sm text-white/60">Communicate directly with our systems engineers through a secure decoupled loop.</p>
            
            <form onSubmit={handleAddTicket} className="space-y-3 max-w-[500px]">
              <input 
                required 
                placeholder="Enter technical query or ticket subject..." 
                value={newSubject}
                onChange={e => setNewSubject(e.target.value)}
                className="w-full h-10 rounded-lg border border-white/10 bg-white/[0.01] px-4 text-white text-[12.5px] outline-none font-mono focus:border-white/20"
              />
              <button type="submit" className="px-4 h-9 rounded bg-white text-black font-semibold text-xs tracking-wider uppercase cursor-pointer">Submit Support Ticket</button>
            </form>

            <div className="border border-white/5 rounded-xl overflow-hidden mt-6">
              <div className="bg-white/[0.02] border-b border-white/5 px-4 py-2 text-[10.5px] font-mono text-white/40 uppercase">Sovereign Support Tickets</div>
              <div className="p-4 space-y-2.5 font-mono text-[11px]">
                {tickets.map((t, i) => (
                  <div key={i} className="flex justify-between border-b border-white/5 pb-2 last:border-b-0 last:pb-0">
                    <div>
                      <span className="text-[#009DFF] font-bold mr-2">{t.id}</span>
                      <span className="text-white/70">{t.subject}</span>
                    </div>
                    <span className="text-green-400">{t.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: Analytics */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Compute Telemetry</h3>
              <p className="text-sm text-white/60">Active operational logs and decoupled runtime performance benchmarks.</p>
            </div>

            {/* SVG Sparkline Sparking Live Grid */}
            <div className="p-5 rounded-xl border border-white/5 bg-white/[0.01] space-y-4">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div>
                  <h4 className="text-[13px] font-bold text-white font-mono uppercase tracking-wider">Live System Core Load Metrics</h4>
                  <p className="text-[11px] text-white/40 font-mono">Simulated multi-regional kernel compute latency metrics</p>
                </div>
                <div className="flex gap-4 font-mono text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#009DFF]" />
                    <span className="text-white/60">SG: </span>
                    <span className="text-white font-bold">{cpuSingapore}%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className="text-white/60">LDN: </span>
                    <span className="text-white font-bold">{cpuLondon}%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="text-white/60">NY: </span>
                    <span className="text-white font-bold">{cpuNY}%</span>
                  </div>
                </div>
              </div>

              {/* Sparkline Drawing */}
              <div className="relative h-28 border border-white/5 bg-black/40 rounded-lg p-2 flex items-end">
                {/* Horizontal Guide lines */}
                <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none opacity-20">
                  <div className="border-b border-white border-dashed w-full" />
                  <div className="border-b border-white border-dashed w-full" />
                  <div className="border-b border-white border-dashed w-full" />
                </div>
                
                {/* SVG path */}
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 112" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="sparklineGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#009DFF" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#009DFF" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Fill Area */}
                  <path
                    d={`M 0 112 ${dataPoints.map((val, idx) => `L ${(idx * 500) / (dataPoints.length - 1)} ${112 - (val * 0.9)}`).join(' ')} L 500 112 Z`}
                    fill="url(#sparklineGrad)"
                    stroke="none"
                    className="transition-all duration-500 ease-out"
                  />
                  
                  {/* Stroke Line */}
                  <path
                    d={dataPoints.map((val, idx) => `${idx === 0 ? 'M' : 'L'} ${(idx * 500) / (dataPoints.length - 1)} ${112 - (val * 0.9)}`).join(' ')}
                    fill="none"
                    stroke="#009DFF"
                    strokeWidth="1.5"
                    className="transition-all duration-500 ease-out"
                  />
                  
                  {/* Pulsing indicator dot on last point */}
                  <circle
                    cx="500"
                    cy={112 - (dataPoints[dataPoints.length - 1] * 0.9)}
                    r="4"
                    className="fill-[#009DFF]"
                  />
                </svg>
              </div>
            </div>

            <div className="border border-white/5 rounded-xl overflow-hidden">
              <table className="w-full text-left font-mono text-[12px] text-white/70">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-white/5 text-white/40 text-[10px] uppercase">
                    <th className="p-4">Node Hash</th>
                    <th className="p-4">eBPF Telemetry</th>
                    <th className="p-4">Allocated Threads</th>
                    <th className="p-4 text-right">Ping</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    { hash: "f3a8b291c9", eBPF: "Core Enforced", threads: "24 Threads", ping: "4ms" },
                    { hash: "e88d123880", eBPF: "Kernel Audited", threads: "16 Threads", ping: "3ms" },
                    { hash: "a01fe99211", eBPF: "Core Enforced", threads: "32 Threads", ping: "5ms" }
                  ].map(node => (
                    <tr key={node.hash} className="hover:bg-white/[0.01]">
                      <td className="p-4 text-[#009DFF]">{node.hash}</td>
                      <td className="p-4 text-white/55">{node.eBPF}</td>
                      <td className="p-4">{node.threads}</td>
                      <td className="p-4 text-right text-green-400 font-bold">{node.ping}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 10: Governance */}
        {activeTab === "governance" && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white tracking-tight">Sovereign Compliance & Policies</h3>
            <p className="text-sm text-white/60">Active guardrail rulebooks, sandbox boundaries, and policy compliance.</p>
            <div className="space-y-3 pt-3 font-mono text-[11px] text-white/60">
              <div className="p-4 rounded-lg border border-white/5 bg-[#020202]/30 flex justify-between">
                <span>[RULE_01] Block unauthorized external API calls</span>
                <span className="text-green-400 font-bold uppercase tracking-wider">Active</span>
              </div>
              <div className="p-4 rounded-lg border border-white/5 bg-[#020202]/30 flex justify-between">
                <span>[RULE_02] Enforce cryptographic verification hashes on ledger state</span>
                <span className="text-green-400 font-bold uppercase tracking-wider">Active</span>
              </div>
              <div className="p-4 rounded-lg border border-white/5 bg-[#020202]/30 flex justify-between">
                <span>[RULE_03] Decouple admin dashboard requests from production threads</span>
                <span className="text-green-400 font-bold uppercase tracking-wider">Active</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 11: AI Operations */}
        {activeTab === "ai_ops" && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white tracking-tight">Active Agent Runtimes</h3>
            <p className="text-sm text-white/60">Running instances, multi-agent sensory nodes, and memory parameters.</p>
            <div className="border border-white/5 rounded-xl overflow-hidden mt-4">
              <table className="w-full text-left font-mono text-[12px] text-white/70">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-white/5 text-white/40 text-[10px] uppercase">
                    <th className="p-4">Agent Identifier</th>
                    <th className="p-4">Sensory Mesh Bounds</th>
                    <th className="p-4">Context State Cache</th>
                    <th className="p-4 text-right">Integrity Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    { name: "RETAIL-CORE-A1", sensory: "Local API Node", cache: "Decoupled Cache", status: "VERIFIED" },
                    { name: "ORE-TUNNEL-X4", sensory: "Industrial Sensors", cache: "Isolated Frame", status: "VERIFIED" },
                    { name: "GOV-SYSTEM-G2", sensory: "Audit Log Collector", cache: "Sovereign Cache", status: "VERIFIED" }
                  ].map(agent => (
                    <tr key={agent.name} className="hover:bg-white/[0.01]">
                      <td className="p-4 text-white font-bold">{agent.name}</td>
                      <td className="p-4 text-white/55">{agent.sensory}</td>
                      <td className="p-4">{agent.cache}</td>
                      <td className="p-4 text-right text-green-400 font-bold">{agent.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 12: Control Center */}
        {activeTab === "control_center" && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white tracking-tight">Sovereign Control Center Gateway</h3>
            <p className="text-sm text-white/60">Full terminal interface to deploy, coordinate, and orchestrate secure sandbox multi-agents.</p>
            
            <div className="p-6 rounded-xl border border-white/5 bg-[#020202]/30 max-w-[560px] space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 text-[10px] font-mono text-white/25">SECURE CORE Console</div>
              <div className="flex gap-3 items-start">
                <div className="p-2 bg-white/5 rounded-lg border border-white/10 text-[#009DFF]"><Lock className="w-5 h-5" /></div>
                <div>
                  <h4 className="text-[14px] font-bold text-white">Full Control Center Portal</h4>
                  <p className="text-xs text-white/50 mt-1">Isolate your multi-agent configurations, monitor continuous delivery, evaluate token spends, track adoption metrics, and audit real-time governance parameters.</p>
                </div>
              </div>

              <div className="pt-2">
                <Link 
                  href="/portal/control-center"
                  className="inline-flex h-10 px-5 rounded bg-white hover:bg-white/90 text-black font-semibold text-[11.5px] uppercase tracking-wider items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Launch Control Center Console</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
