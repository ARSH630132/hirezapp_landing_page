"use client";

import { useState } from "react";
import { ShieldAlert, Activity, DollarSign, Sliders, CheckCircle, Radio, Settings, Server, Users } from "lucide-react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import MotionReveal from "@/components/inner-pages/MotionReveal";
import { BentoGrid, BentoCard } from "@/components/inner-pages/BentoGrid";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";

const FLEET_AGENTS = [
  { id: "tax", name: "Tax Auditor Node", status: "Active", latency: "124ms", check: "SEC Rule 14a Match", health: "100%" },
  { id: "telemetry", name: "SCADA Telemetry Parser", status: "Idling", latency: "84ms", check: "SLA Bounds Normal", health: "100%" },
  { id: "sla-coord", name: "SLA Compute Coordinator", status: "Active", latency: "210ms", check: "Cluster Scale Match", health: "98%" }
];

const POLICIES = [
  { id: "pii", title: "PII Masking Filter", desc: "Anonymize identity, PAN, and credentials before system routing." },
  { id: "ebpf", title: "eBPF Kernel Log Audit", desc: "Continuous operating system level telemetry matching compliance hashes." },
  { id: "soc2", title: "SOC2 Compliance Lock", desc: "Forbid non-production containers from executing outbound webhooks." }
];

export default function ControlCenterPage() {
  const [activeTab, setActiveTab] = useState<"fleet" | "gov" | "spend">("fleet");
  const [activeAgentId, setActiveAgentId] = useState("tax");
  const [toggledRules, setToggledRules] = useState<Record<string, boolean>>({
    pii: true,
    ebpf: true,
    soc2: false
  });

  const handleToggleRule = (id: string) => {
    setToggledRules((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const selectedAgent = FLEET_AGENTS.find((a) => a.id === activeAgentId) || FLEET_AGENTS[0];

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Tier 4 • Enterprise Cockpit"
        title="Unified AI Control Center"
        highlightedWord="Control Center"
        description="Monitor agent swarm health, enforce cryptographic compliance, track cloud compute spend, and audit system-wide delivery operations from a secure single-pane glass console."
        breadcrumbs={[{ label: "Platforms", href: "/platforms" }, { label: "Control Center" }]}
        visualType="optimize"
      />

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-24 space-y-20">
        
        {/* Core Mission Banner */}
        <MotionReveal className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-10 border-y border-white/5 items-center bg-white/[0.01] px-6 rounded-2xl">
          <div className="lg:col-span-5">
            {/* <span className="text-xs font-mono text-[#E4000F] uppercase tracking-widest font-bold">Cockpit Overview</span> */}
            <h2 className="text-2xl font-bold text-white mt-2">The Sovereign Control Surface</h2>
          </div>
          <div className="lg:col-span-7">
            <p className="text-white/70 font-light text-sm leading-relaxed">
              Managing enterprise AI requires absolute transparency. GFF Control Center grants CIOs, CISOs, and operational team leads full visibility into active multi-agent loops—enforcing strict, air-gapped sandboxes, auditing token usage, and preventing unchecked outbound executions.
            </p>
          </div>
        </MotionReveal>

        {/* Section 1: The Interactive Cockpit Console */}
        <MotionReveal className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Interactive Cockpit Simulator</h2>
            <p className="text-white/50 text-xs mt-2 font-light">
              Toggle between cockpit sub-interfaces to simulate fleet management, policy rules, and resource allocations.
            </p>
          </div>

          <div className="max-w-4xl mx-auto rounded-2xl border border-white/10 bg-[#04060b] overflow-hidden shadow-2xl flex flex-col md:flex-row items-stretch">
            {/* Sidebar Tabs */}
            <div className="w-full md:w-[220px] bg-black/40 border-r border-white/5 p-5 flex flex-col gap-1.5 shrink-0">
              <span className="text-[10px] font-mono font-bold text-white/30 uppercase tracking-wider mb-2">Control Subpanels</span>
              {[
                { id: "fleet", label: "Fleet Telemetry", icon: Activity },
                { id: "gov", label: "Governance Rules", icon: Sliders },
                { id: "spend", label: "Adoption & Spend", icon: DollarSign }
              ].map((tab) => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                      isSelected 
                        ? "bg-[#E4000F]/10 text-white border-l-2 border-[#E4000F]" 
                        : "text-white/50 hover:text-white hover:bg-white/[0.02]"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Subpanel Details Content */}
            <div className="flex-grow p-5 md:p-6 bg-black/10 min-h-[300px] flex flex-col justify-between">
              {activeTab === "fleet" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 text-green-400 animate-pulse" /> Active Swarm Telemetry
                    </h3>
                    {/* <span className="text-[10px] font-mono text-emerald-400 uppercase">3 Nodes Healthy</span> */}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {FLEET_AGENTS.map((agent) => (
                      <button
                        key={agent.id}
                        onClick={() => setActiveAgentId(agent.id)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          activeAgentId === agent.id 
                            ? "border-[#E4000F] bg-[#E4000F]/5" 
                            : "border-white/5 bg-black/20 hover:border-white/10"
                        }`}
                      >
                        <span className="text-[9px] font-mono text-white/40 uppercase">Instance</span>
                        <h4 className="text-xs font-bold text-white mt-1 truncate">{agent.name}</h4>
                        <span className="text-[9px] font-mono text-green-400 block mt-1.5">● {agent.status}</span>
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-7 p-3 rounded-xl bg-[#010101]/60 border border-white/5 space-y-1.5 text-xs">
                      <div className="flex justify-between border-b border-white/5 pb-1 text-white/40 font-mono text-[9px] uppercase">
                        <span>Telemetry Metric</span>
                        <span>Value</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Node Latency</span>
                        <span className="font-mono text-white font-semibold">{selectedAgent.latency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">SLA Scan Integrity</span>
                        <span className="font-mono text-[#009DFF] font-semibold">{selectedAgent.check}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Runtime Health</span>
                        <span className="font-mono text-green-400 font-semibold">{selectedAgent.health}</span>
                      </div>
                    </div>

                    {/* LIVE TELEMETRY WAVE */}
                    <div className="md:col-span-5 border border-white/5 bg-black/40 rounded-xl p-3 flex flex-col items-center justify-center min-h-[90px] relative overflow-hidden">
                      <span className="text-[8px] font-mono text-white/30 absolute top-2 right-2 uppercase">Real-Time Wave</span>
                      <svg className="w-full h-[40px] mt-4" viewBox="0 0 200 40">
                        {activeAgentId === "tax" && (
                          <path d="M0 20 L20 15 L40 25 L60 5 L80 35 L100 15 L120 25 L140 3 L160 30 L180 20 L200 20" fill="none" stroke="#E4000F" strokeWidth="1.5" />
                        )}
                        {activeAgentId === "telemetry" && (
                          <path d="M0 20 Q 25 10, 50 20 T 100 20 T 150 20 T 200 20" fill="none" stroke="#00FF9D" strokeWidth="1.5" />
                        )}
                        {activeAgentId === "sla-coord" && (
                          <path d="M0 20 Q 50 2, 100 20 T 200 20" fill="none" stroke="#009DFF" strokeWidth="1.5" />
                        )}
                      </svg>
                      <span className="text-[7.5px] font-mono text-white/40 mt-1 uppercase tracking-widest">Active Sensor Output</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "gov" && (
                <div className="space-y-4">
                  <div className="border-b border-white/5 pb-2">
                    <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-red-500" /> Active Governance Directives
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
                    <div className="md:col-span-7 space-y-2">
                      {POLICIES.map((p) => {
                        const active = toggledRules[p.id];
                        return (
                          <div key={p.id} className="flex items-center justify-between p-2.5 rounded-xl border border-white/5 bg-black/20 text-xs gap-4">
                            <div>
                              <h4 className="font-bold text-white text-xs">{p.title}</h4>
                              <p className="text-[10px] text-white/50 font-light mt-0.5">{p.desc}</p>
                            </div>
                            <button
                              onClick={() => handleToggleRule(p.id)}
                              className={`w-8 h-4.5 rounded-full p-0.5 relative transition-colors cursor-pointer shrink-0 ${
                                active ? "bg-red-600" : "bg-white/10"
                              }`}
                            >
                              <div className={`w-3.5 h-3.5 rounded-full bg-white transform transition-transform ${
                                active ? "translate-x-3.5" : "translate-x-0"
                              }`} />
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {/* GOVERNANCE MAP DIAGRAM */}
                    <div className="md:col-span-5 border border-white/5 bg-black/40 rounded-xl p-3 flex flex-col items-center justify-center min-h-[120px] relative overflow-hidden">
                      <span className="text-[8px] font-mono text-white/30 absolute top-2 right-2 uppercase">Firewall Guard</span>
                      <svg className="w-full h-[50px] mt-2" viewBox="0 0 150 50">
                        <rect x="5" y="15" width="30" height="20" rx="3" fill="#050505" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                        <text x="20" y="27" fill="white" fontSize="6" textAnchor="middle">Ingress</text>
                        <path d="M35 25 L55 25" stroke="#009DFF" strokeWidth="1" strokeDasharray="2 2" />
                        <circle cx="75" cy="25" r="12" fill="#050505" stroke={toggledRules.pii ? "#00FF9D" : "#E4000F"} strokeWidth="1.5" />
                        <text x="75" y="28" fill={toggledRules.pii ? "#00FF9D" : "#E4000F"} fontSize="8" textAnchor="middle" fontWeight="bold">🛡</text>
                        <path d="M95 25 L115 25" stroke="#009DFF" strokeWidth="1" />
                        <rect x="115" y="15" width="30" height="20" rx="3" fill="#050505" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                        <text x="130" y="27" fill="white" fontSize="6" textAnchor="middle">Egress</text>
                      </svg>
                      <span className="text-[7.5px] font-mono text-white/40 uppercase tracking-widest mt-1">
                        PII Filter: {toggledRules.pii ? "Enforced" : "Disabled"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "spend" && (
                <div className="space-y-4">
                  <div className="border-b border-white/5 pb-2">
                    <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-[#009DFF]" /> Computing Spend & Active Adoption
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl bg-black/30 border border-white/5">
                      <span className="text-[8.5px] uppercase tracking-wider font-mono text-white/40 block">Token Efficiency</span>
                      <span className="text-lg font-mono font-bold text-emerald-400 mt-1 block">94.2%</span>
                      <span className="text-[8.5px] text-white/30 block mt-0.5">Optimized routing paths</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-black/30 border border-white/5">
                      <span className="text-[8.5px] uppercase tracking-wider font-mono text-white/40 block">Active Swarms</span>
                      <span className="text-lg font-mono font-bold text-[#009DFF] mt-1 block">12 / 12</span>
                      <span className="text-[8.5px] text-white/30 block mt-0.5">Horizontal container pods</span>
                    </div>
                  </div>

                  <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl text-xs leading-relaxed text-white/50 font-light">
                    Cost attribution log updates automatically across cloud environments. Token budgets and core compute boundaries are locked per tenant space.
                  </div>
                </div>
              )}

              {/* <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-white/40">
                 <span>GFF Control Node: operational_gateway_v2</span> 
                <span className="font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> SECURE CONSOLE
                </span>
              </div> */}
            </div>
          </div>
        </MotionReveal>

        {/* Section 2: Under-the-Hood Governance Bento Grid */}
        <MotionReveal className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Enterprise Infrastructure Pillars</h2>
            <p className="text-white/50 text-xs mt-2 font-light">
              Standard compliance constructs securing every cluster in the GFF network.
            </p>
          </div>

          <BentoGrid>
            <BentoCard
              title="EBPF Kernel Telemetry"
              description="Monitors network traffic, socket connections, and system call loops directly in the OS kernel to detect credential leak risks instantly."
              badge="OS Guard"
              glowColor="red"
              icon={<Settings className="w-5 h-5 text-red-500" />}
            />
            <BentoCard
              title="Air-Gapped Isolation"
              description="Runs LLM reasoning pipelines and database indexing nodes within local Virtual Private Cloud network spaces to prevent public routing exposure."
              badge="Sandbox Security"
              glowColor="blue"
              icon={<Server className="w-5 h-5 text-blue-500" />}
            />
            <BentoCard
              title="Identity & RBAC Access"
              description="Restricts dashboard operations and model parameters via strict OAuth identity mappings, allowing safe role assignment across business units."
              badge="Access Matrix"
              glowColor="purple"
              icon={<Users className="w-5 h-5 text-purple-500" />}
            />
          </BentoGrid>
        </MotionReveal>

        {/* CTA Section */}
        <PremiumCTA
          title="Schedule an Operational Flight Deck Demo"
          description="Ready to observe and govern active agent loops within your secure network? Schedule a workspace deep-dive with GFF solutions architects."
          primaryLabel="Schedule Cockpit Demo"
          primaryHref="/contact"
        />

      </div>
    </InnerPageShell>
  );
}
