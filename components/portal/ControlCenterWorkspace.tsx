"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ShieldCheck, Activity, Send, Lock, RefreshCw, BarChart3, 
  Settings, CheckCircle, Database, HelpCircle, ArrowLeft, Cpu, Globe 
} from "lucide-react";

export default function ControlCenterWorkspace() {
  const [activeModule, setActiveModule] = useState("agent_health");
  const [selectedNode, setSelectedNode] = useState("retail");

  const nodesInfo: Record<string, { name: string; status: string; load: string; mem: string; enclave: string; threads: number; logs: string[] }> = {
    retail: {
      name: "RETAIL-CORE-A1",
      status: "Verified & Decoupled",
      load: "42.1%",
      mem: "4.2 GB / 8.0 GB",
      enclave: "0x7FFA",
      threads: 24,
      logs: [
        "[07:22:11] Core check: OK (SHA-256: FF81)",
        "[07:22:13] Local state synced successfully",
        "[07:22:15] eBPF telemetry boundary verified"
      ]
    },
    ore: {
      name: "ORE-TUNNEL-X4",
      status: "Sovereign Loop",
      load: "18.4%",
      mem: "1.8 GB / 4.0 GB",
      enclave: "0x0F2C",
      threads: 16,
      logs: [
        "[07:22:09] Telemetry loop active (SHA-256: AB11)",
        "[07:22:12] Sensory node heartbeat registered",
        "[07:22:14] Isolated frame check successful"
      ]
    },
    governance: {
      name: "GOV-SYSTEM-G2",
      status: "Encapsulated Guardrails",
      load: "89.2%",
      mem: "12.4 GB / 16.0 GB",
      enclave: "0x992B",
      threads: 32,
      logs: [
        "[07:22:08] Compliance engine active (SHA-256: 09DE)",
        "[07:22:10] eBPF kernel events mapped with zero ruleset violations",
        "[07:22:15] Security boundary verified successfully"
      ]
    }
  };

  return (
    <div className="space-y-8">
      {/* Back button to Portal */}
      <div className="flex justify-between items-center">
        <Link 
          href="/portal"
          className="inline-flex items-center gap-2 text-[12px] font-mono uppercase tracking-widest text-white/50 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Client Portal</span>
        </Link>
        <span className="text-[11px] font-mono text-white/30">Secure Core Console v2.6.1</span>
      </div>

      {/* Workspace Wrapper */}
      <div className="rounded-[24px] border border-white/5 bg-[#050505]/40 backdrop-blur-[12px] overflow-hidden min-h-[580px] flex flex-col lg:flex-row">
        
        {/* Sidebar Selector for 5 requested modules */}
        <div className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-white/5 bg-black/40 p-5 shrink-0 flex flex-col gap-1.5">
          <div className="px-2 py-1 mb-3 border-b border-white/5 pb-4">
            <span className="text-[9px] font-mono text-[#009DFF] font-bold bg-[#009DFF]/5 border border-[#009DFF]/20 px-2 py-0.5 rounded-full uppercase tracking-wider">Control Center</span>
            <div className="text-[11px] font-mono text-white/40 mt-2">Active Sandbox Terminal</div>
          </div>

          {[
            { id: "agent_health", label: "Agent Health", desc: "Diagnostic & threads", icon: Activity },
            { id: "delivery", label: "Delivery", desc: "Continuous delivery state", icon: Send },
            { id: "spend", label: "Spend", desc: "Token bounds & billing", icon: BarChart3 },
            { id: "adoption", label: "Adoption", desc: "Integration endpoints", icon: Globe },
            { id: "governance", label: "Governance", desc: "Guardrails & audit logs", icon: ShieldCheck }
          ].map(mod => {
            const Icon = mod.icon;
            const active = mod.id === activeModule;
            return (
              <button
                key={mod.id}
                onClick={() => setActiveModule(mod.id)}
                className={"w-full text-left px-3.5 py-3 rounded-lg font-mono transition-all cursor-pointer flex items-center gap-3 border " + (
                  active 
                    ? "bg-white/5 text-white border-white/10" 
                    : "text-white/50 hover:text-white/80 hover:bg-white/[0.01] border-transparent"
                )}
              >
                <Icon className="w-4.5 h-4.5 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[13px] font-semibold block">{mod.label}</div>
                  <div className="text-[10px] text-white/30 truncate">{mod.desc}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Console Panel Area */}
        <div className="flex-grow p-6 lg:p-8 overflow-x-hidden">
          
          {/* MODULE 1: Agent Health */}
          {activeModule === "agent_health" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Agent Health Monitor</h3>
                <p className="text-sm text-white/60">Sovereign diagnostic states and decoupled thread-level audit boundaries.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] font-mono space-y-1">
                  <span className="text-[10px] text-white/45 uppercase block mb-1">eBPF Telemetry Core</span>
                  <div className="text-green-400 text-xs font-bold flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5" /> Enforced & Encapsulated</div>
                  <div className="text-[11px] text-white/35 mt-1">Direct kernel event instrumentation active.</div>
                </div>
                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] font-mono space-y-1">
                  <span className="text-[10px] text-white/45 uppercase block mb-1">Active Sandbox Pings</span>
                  <div className="text-white text-xs font-bold">100% Node Handshake Integrity</div>
                  <div className="text-[11px] text-white/35 mt-1">Multi-core cluster loop responding within latency parameters.</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-2">
                <div className="md:col-span-5 p-4 rounded-xl border border-white/5 bg-black/40 flex flex-col justify-between">
                  <span className="text-[10px] font-mono text-[#009DFF] uppercase block mb-2">Lattice Topology (Interactive)</span>
                  <svg className="w-full h-32" viewBox="0 0 200 100">
                    <line x1="50" y1="30" x2="100" y2="70" stroke="#009DFF" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="3,3" />
                    <line x1="150" y1="30" x2="100" y2="70" stroke="#E4000F" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="3,3" />
                    {[
                      { id: "retail", cx: 50, cy: 30, color: "#009DFF", label: "RETAIL" },
                      { id: "ore", cx: 150, cy: 30, color: "#E4000F", label: "ORE" },
                      { id: "governance", cx: 100, cy: 70, color: "#a855f7", label: "GOV" }
                    ].map(n => {
                      const active = selectedNode === n.id;
                      return (
                        <g key={n.id} className="cursor-pointer" onClick={() => setSelectedNode(n.id)}>
                          {active && <circle cx={n.cx} cy={n.cy} r="12" fill={n.color} fillOpacity="0.1" className="animate-pulse" />}
                          <circle cx={n.cx} cy={n.cy} r={active ? "8" : "5"} fill="#000" stroke={active ? n.color : "rgba(255,255,255,0.2)"} strokeWidth="1.5" />
                          <circle cx={n.cx} cy={n.cy} r="2.5" fill={n.color} />
                          <text x={n.cx} y={n.cy - 11} textAnchor="middle" fill={active ? "white" : "rgba(255,255,255,0.4)"} className="text-[7px] font-mono font-bold tracking-wider">{n.label}</text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
                <div className="md:col-span-7 p-4 rounded-xl border border-white/5 bg-[#020202]/50 font-mono space-y-3">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-[11px] text-white font-bold">{nodesInfo[selectedNode].name}</span>
                    <span className="px-1.5 py-0.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded text-[8px] font-bold uppercase">{nodesInfo[selectedNode].status}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div><span className="text-white/40 uppercase block">Load</span><span className="text-white font-bold">{nodesInfo[selectedNode].load}</span></div>
                    <div><span className="text-white/40 uppercase block">Memory</span><span className="text-white font-bold">{nodesInfo[selectedNode].mem}</span></div>
                  </div>
                  <div className="p-2 bg-black/60 rounded border border-white/5 space-y-1 text-[10px] text-white/50">
                    {nodesInfo[selectedNode].logs.map((log, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span className="truncate">{log.split(" (")[0]}</span>
                        <span className="text-[#009DFF] shrink-0 font-bold">{log.split(" (")[1]?.replace(")", "")}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 2: Delivery */}
          {activeModule === "delivery" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Continuous Delivery Pipeline</h3>
                <p className="text-sm text-white/60">Audit deployment logs, pipeline code state, and environment consistency checklists.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] font-mono space-y-1">
                  <span className="text-[10px] text-white/45 uppercase block mb-1">Delivery Pipeline Deployer</span>
                  <div className="text-white text-xs font-bold">Decoupled Orchestrator v2.1.0</div>
                  <div className="text-[11px] text-white/35 mt-1">Local isolated deployment loop verified.</div>
                </div>
                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] font-mono space-y-1">
                  <span className="text-[10px] text-white/45 uppercase block mb-1">Last Verified Compilation State</span>
                  <div className="text-[#009DFF] text-xs font-bold font-mono">BUILD-HASH: SHA-256: FE812A...C88</div>
                  <div className="text-[11px] text-white/35 mt-1">Cryptographically matched with remote cluster.</div>
                </div>
              </div>

              <div className="border border-white/5 rounded-xl overflow-hidden mt-4">
                <div className="bg-white/[0.02] border-b border-white/5 px-4 py-2 text-[10.5px] font-mono text-white/40 uppercase">Sovereign Target Environments</div>
                <div className="p-4 space-y-2 font-mono text-[11px] text-white/50">
                  <div className="flex justify-between"><span>Singapore Regional Core Node 1</span><span className="text-green-400 font-bold">DEPLOYED</span></div>
                  <div className="flex justify-between"><span>London Core Enclave Node 3</span><span className="text-green-400 font-bold">SYNCED</span></div>
                  <div className="flex justify-between"><span>Americas Private Cloud Core</span><span className="text-white/30">SANDBOX_ONLY</span></div>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 3: Spend */}
          {activeModule === "spend" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Token Bounds & Spend Quota</h3>
                <p className="text-sm text-white/60">Evaluate compute resource allocation parameters, budget ledgers, and rate limits.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] font-mono space-y-1">
                  <span className="text-[10px] text-white/45 uppercase block mb-1">Maximum Quota Limit</span>
                  <div className="text-white text-xs font-bold">10,000,000 Tokens / Cycle</div>
                  <div className="text-[11px] text-white/35 mt-1">Strict limit enforced at sandbox hardware boundary.</div>
                </div>
                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] font-mono space-y-1">
                  <span className="text-[10px] text-white/45 uppercase block mb-1">Sovereign Credit Ledger</span>
                  <div className="text-green-400 text-xs font-bold font-mono">Credit Handshake Enforced</div>
                  <div className="text-[11px] text-white/35 mt-1">Subscription parameters audited by GFF billing core.</div>
                </div>
              </div>

              <div className="border border-white/5 rounded-xl overflow-hidden mt-4">
                <div className="bg-white/[0.02] border-b border-white/5 px-4 py-2 text-[10.5px] font-mono text-white/40 uppercase">Enforced Rate-Limiting Parameters</div>
                <div className="p-4 space-y-2 font-mono text-[11px] text-white/50">
                  <div className="flex justify-between"><span>Tokens per Minute Cap</span><span className="text-white">100,000 Tokens</span></div>
                  <div className="flex justify-between"><span>Burst Threshold Buffer</span><span className="text-white">20,000 Tokens</span></div>
                  <div className="flex justify-between"><span>Rate Limit Compliance Response</span><span className="text-[#E4000F] font-bold">DECOUPLING_TRIGGERED</span></div>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 4: Adoption */}
          {activeModule === "adoption" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Client Adoption & Integration</h3>
                <p className="text-sm text-white/60">Audited organizational departments and active API access token handshakes.</p>
              </div>

              <div className="border border-white/5 rounded-xl overflow-hidden">
                <div className="bg-white/[0.02] border-b border-white/5 px-4 py-2 text-[10.5px] font-mono text-white/40 uppercase">Integrated Organizational Units</div>
                <div className="p-4 space-y-3 font-mono text-[11px] text-white/60">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0 last:pb-0">
                    <div>
                      <span className="text-white font-bold block">Risk Management Unit</span>
                      <span className="text-[10px] text-white/30 mt-0.5 block">Integration endpoint: SECURE_API_09</span>
                    </div>
                    <span className="px-2 py-0.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded font-bold uppercase text-[9px]">Fully Integrated</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0 last:pb-0">
                    <div>
                      <span className="text-white font-bold block">Operations & Logistics Core</span>
                      <span className="text-[10px] text-white/30 mt-0.5 block">Integration endpoint: SANDBOX_LOOP_3</span>
                    </div>
                    <span className="px-2 py-0.5 bg-white/5 text-white/50 border border-white/10 rounded font-bold uppercase text-[9px]">Active Sandbox</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 5: Governance */}
          {activeModule === "governance" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Governance Auditing Console</h3>
                <p className="text-sm text-white/60">Compliance guardrails ledger, active policy rulebooks, and security logs.</p>
              </div>

              <div className="border border-white/5 rounded-xl overflow-hidden">
                <div className="bg-white/[0.02] border-b border-white/5 px-4 py-2 text-[10.5px] font-mono text-white/40 uppercase">Compliance Policy Audit Checklist</div>
                <div className="p-4 space-y-2.5 font-mono text-[11.5px] text-white/60">
                  <div className="flex items-center gap-2.5"><CheckCircle className="w-4 h-4 text-green-400" /> <span>ISO-27001 Cryptographic Enclave boundaries strictly verified.</span></div>
                  <div className="flex items-center gap-2.5"><CheckCircle className="w-4 h-4 text-green-400" /> <span>SOC2 Type II Administrative access decoupled from host.</span></div>
                  <div className="flex items-center gap-2.5"><CheckCircle className="w-4 h-4 text-green-400" /> <span>eBPF Runtime event triggers matched with compliance rulesets.</span></div>
                </div>
              </div>

              <div className="border border-white/5 rounded-xl overflow-hidden mt-4">
                <div className="bg-white/[0.02] border-b border-white/5 px-4 py-2 text-[10.5px] font-mono text-white/40 uppercase">Recent Guardrail Violations Ledger (Simulated)</div>
                <div className="p-4 text-center text-[11px] font-mono text-white/40 py-6">
                  <span className="block font-bold text-green-400 mb-1">✓ No violations detected</span>
                  All agent parameters operating safely within compliance boundaries.
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
