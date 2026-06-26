"use client";

import { useState } from "react";
import { 
  Shield, 
  ShieldAlert, 
  UserCheck, 
  FileCheck, 
  Lock, 
  Cpu, 
  Eye, 
  Activity, 
  CheckCircle2, 
  ChevronRight, 
  ArrowRight,
  Sliders,
  Sparkles,
  Database,
  History,
  XCircle,
  AlertTriangle
} from "lucide-react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import MotionReveal from "@/components/inner-pages/MotionReveal";
import { BentoGrid, BentoCard } from "@/components/inner-pages/BentoGrid";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";

const GOVERNANCE_STEPS = [
  {
    id: "ingress",
    title: "1. Prompt Ingress",
    subtitle: "Input Interception",
    desc: "Every interaction is intercepted at the kernel gateway, sanitizing incoming query schemas before any cognitive processing occurs."
  },
  {
    id: "guardrails",
    title: "2. Guardrail Audit",
    subtitle: "Sovereign Shield",
    desc: "Active zero-trust firewalls scan for prompt injections, toxicity, and proprietary intellectual property leaks."
  },
  {
    id: "human-loop",
    title: "3. Human-in-the-Loop Gate",
    subtitle: "Manual Oversight",
    desc: "Actions exceeding predefined risk bounds are frozen, routing to authorized administrators for manual review."
  },
  {
    id: "execution",
    title: "4. Sandbox Execution",
    subtitle: "Hermetic Sandbox",
    desc: "The agent executes inside an isolated container with read-only system memory and restricted database connection pools."
  },
  {
    id: "ledger",
    title: "5. Immutable Log",
    subtitle: "Cryptographic Audit",
    desc: "All queries, state changes, and human approvals are written to an immutable, cryptographically-signed execution ledger."
  }
];

export default function RuntimeGovernancePage() {
  const [activeTab, setActiveTab] = useState<"firewalls" | "oversight" | "ledger">("firewalls");
  const [activeStep, setActiveStep] = useState("guardrails");
  const [policies, setPolicies] = useState({
    pii: true,
    injection: true,
    boundary: true,
    toxicity: false
  });
  
  // Human approval simulation states
  const [pendingActions, setPendingActions] = useState([
    {
      id: "ACT-841",
      agent: "Operations Broker",
      action: "Initiate SAP freight update for $48,200 invoice variance",
      status: "pending",
      severity: "high"
    },
    {
      id: "ACT-842",
      agent: "Knowledge Synthesizer",
      action: "Export client contract summary to S3 bucket",
      status: "pending",
      severity: "medium"
    }
  ]);

  const handleAction = (id: string, approve: boolean) => {
    setPendingActions(prev => 
      prev.map(act => act.id === id ? { ...act, status: approve ? "approved" : "rejected" } : act)
    );
  };

  const currentStepData = GOVERNANCE_STEPS.find(s => s.id === activeStep) || GOVERNANCE_STEPS[1];

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Platforms & Modules"
        title="Continuous Runtime Governance and Risk Firewalls"
        highlightedWord="Governance"
        highlightColor="gradient"
        description="Enforce strict operational boundaries, deterministic human-in-the-loop oversight, and immutable cryptographic ledgers over multi-agent workflows."
        breadcrumbs={[{ label: "Platforms", href: "/platforms" }, { label: "Runtime Governance" }]}
      />

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-24 space-y-24">
        
        {/* Board Alignment Editorial Banner */}
        <MotionReveal className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-12 border-y border-white/5 items-center bg-white/[0.01] px-8 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[30%] h-full bg-gradient-to-l from-[#E4000F]/5 to-transparent pointer-events-none" />
          <div className="lg:col-span-5">
            <span className="text-xs font-mono text-red-500 uppercase tracking-widest font-bold">The Boardroom Challenge</span>
            <h2 className="text-3xl font-semibold text-white tracking-tight mt-2">Guarding Enterprise Integrity</h2>
          </div>
          <div className="lg:col-span-7">
            <p className="text-white/70 font-light text-sm sm:text-base leading-relaxed">
              True corporate automation requires rigorous risk mitigation. Rather than hoping that foundational models remain safe, GFF enforces a <strong className="text-white font-medium">governance-first paradigm</strong>. By isolating cognitive modeling inside secure containers and intercepting prompts and tools at the network level, we isolate threats, preserve system integrity, and provide auditability—without guaranteeing compliance or offering fake legal checklists.
            </p>
          </div>
        </MotionReveal>

        {/* Section 1: Interactive Governance Shield Diagram */}
        <MotionReveal className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono text-[#009DFF] uppercase tracking-widest font-bold">The Gatekeeper Stack</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Active Sequence Flow</h2>
            <p className="text-white/50 text-sm font-light">Trace the life of an execution payload from ingress interception to cryptographic archival.</p>
          </div>

          <div className="bg-[#050505]/60 border border-white/5 p-6 lg:p-8 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[1px] bg-gradient-to-r from-transparent via-[#E4000F]/30 to-transparent" />
            
            {/* Horizontal Timeline Graph for Desktop, Stacking on Mobile */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10 pb-8 border-b border-white/5">
              {GOVERNANCE_STEPS.map((step) => {
                const isActive = step.id === activeStep;
                return (
                  <div
                    key={step.id}
                    onClick={() => setActiveStep(step.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer text-center group ${
                      isActive 
                        ? "border-[#E4000F] bg-[#E4000F]/5" 
                        : "border-white/5 bg-black hover:border-white/10"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center text-xs font-bold font-mono transition-colors ${
                      isActive ? "bg-[#E4000F] text-white" : "bg-white/5 text-white/50 group-hover:text-white"
                    }`}>
                      {step.id === "ingress" && "1"}
                      {step.id === "guardrails" && "2"}
                      {step.id === "human-loop" && "3"}
                      {step.id === "execution" && "4"}
                      {step.id === "ledger" && "5"}
                    </div>
                    <h3 className="text-xs font-bold text-white mt-3 uppercase tracking-wider">{step.subtitle}</h3>
                    <span className="text-[10px] font-mono text-white/30 block mt-1">{step.title}</span>
                  </div>
                );
              })}
            </div>

            {/* Selected Step Inspector Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8 relative z-10 min-h-[160px]">
              <div className="lg:col-span-8 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[9px] bg-[#E4000F]/15 text-[#E4000F] font-mono font-bold uppercase tracking-widest border border-[#E4000F]/20">
                    Active Step Inspector
                  </span>
                  <span className="text-xs font-mono text-white/40">{"// SYSTEM_FLOW_"}{activeStep.toUpperCase()}</span>
                </div>
                <h4 className="text-xl font-bold text-white tracking-tight">{currentStepData.title} — {currentStepData.subtitle}</h4>
                <p className="text-sm text-white/70 font-light leading-relaxed max-w-3xl">{currentStepData.desc}</p>
              </div>

              <div className="lg:col-span-4 flex justify-end">
                <div className="border border-white/5 bg-black/60 rounded-xl p-4 w-full max-w-[320px] font-mono text-[10px] text-white/60 space-y-1.5 shadow-inner">
                  <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-white/40">GATEWAY_STATUS</span><span className="text-emerald-400 font-bold">SECURED</span></div>
                  <div className="flex justify-between"><span className="text-white/40">OVERHEAD_LATENCY</span><span className="text-white font-semibold">1.8ms</span></div>
                  <div className="flex justify-between"><span className="text-white/40">INTERCEPT_HOOK</span><span className="text-[#009DFF] font-semibold">eBPF_probe</span></div>
                  <div className="flex justify-between"><span className="text-white/40">INTEGRITY_SHIELD</span><span className="text-[#E4000F] font-semibold">GFF_Shield_v4</span></div>
                </div>
              </div>
            </div>
          </div>
        </MotionReveal>

        {/* Section 2: Interactive Operational Console Tabs */}
        <MotionReveal className="space-y-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-6">
            <div>
              <span className="text-xs font-mono text-red-500 uppercase tracking-widest font-bold">Dynamic Console</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">Operational Governance Centre</h2>
              <p className="text-white/50 text-xs sm:text-sm font-light mt-1.5 font-sans">Simulate policy configurations, authorize pending actions, and inspect live blockchain-style hashes.</p>
            </div>

            {/* Tab Selectors */}
            <div className="flex gap-1 p-1 bg-white/5 rounded-xl border border-white/10 w-full md:w-auto overflow-x-auto">
              {[
                { id: "firewalls", label: "Risk Firewalls", icon: <Sliders className="w-3.5 h-3.5" /> },
                { id: "oversight", label: "Human Oversight", icon: <UserCheck className="w-3.5 h-3.5" /> },
                { id: "ledger", label: "Audit Ledger", icon: <History className="w-3.5 h-3.5" /> }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    activeTab === t.id 
                      ? "bg-white/10 text-white shadow-sm border border-white/10" 
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Box: Active Tool Surface */}
            <div className="lg:col-span-8 bg-[#04060b] rounded-xl border border-white/10 p-6 shadow-2xl relative min-h-[360px] flex flex-col justify-between">
              
              {/* TAB 1: RISK FIREWALLS */}
              {activeTab === "firewalls" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Active Policy Firewalls</h4>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">ACTIVE</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { id: "pii", title: "PII Obfuscation Shield", desc: "Redacts SSNs, client names, and keys prior to prompt serialization.", val: policies.pii },
                      { id: "injection", title: "Prompt Injection Filter", desc: "Intercepts recursive system instruction overrides.", val: policies.injection },
                      { id: "boundary", title: "Payload Data Isolation", desc: "Clamps database reads to regional subnets.", val: policies.boundary },
                      { id: "toxicity", title: "Automated Toxicity Filter", desc: "Blocks non-professional vocabulary and tone slips.", val: policies.toxicity }
                    ].map((p) => (
                      <div key={p.id} className="p-4 rounded-lg bg-black border border-white/5 flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <h5 className="text-xs font-semibold text-white">{p.title}</h5>
                          <p className="text-[10px] text-white/40 leading-relaxed font-light">{p.desc}</p>
                        </div>
                        <button
                          onClick={() => setPolicies(prev => ({ ...prev, [p.id]: !p.val as any }))}
                          className={`w-8 h-5 rounded-full p-0.5 relative transition-colors shrink-0 cursor-pointer ${p.val ? "bg-[#E4000F]" : "bg-white/10"}`}
                        >
                          <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${p.val ? "translate-x-3" : "translate-x-0"}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: HUMAN OVERSIGHT */}
              {activeTab === "oversight" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Pending Action Approvals</h4>
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">AWAITING DECISION</span>
                  </div>

                  <div className="space-y-4">
                    {pendingActions.map((act) => (
                      <div key={act.id} className="p-4 rounded-lg bg-black border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-1.5 max-w-xl">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-mono text-[#009DFF] bg-[#009DFF]/10 px-1.5 py-0.5 rounded border border-[#009DFF]/20 uppercase font-semibold">{act.agent}</span>
                            <span className="text-[10px] font-mono text-white/30">{act.id}</span>
                            {act.severity === "high" && <span className="text-[8px] font-mono text-red-400 bg-red-400/10 px-1 rounded uppercase border border-red-400/20">Critical</span>}
                          </div>
                          <p className="text-xs text-white/80 leading-relaxed">{act.action}</p>
                        </div>

                        <div className="flex gap-2 shrink-0">
                          {act.status === "pending" ? (
                            <>
                              <button
                                onClick={() => handleAction(act.id, false)}
                                className="px-2.5 py-1 text-[10px] font-bold text-red-400 border border-red-500/20 hover:bg-red-500/10 rounded cursor-pointer transition-all"
                              >
                                Reject
                              </button>
                              <button
                                onClick={() => handleAction(act.id, true)}
                                className="px-3 py-1 text-[10px] font-bold text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/10 rounded cursor-pointer transition-all"
                              >
                                Approve
                              </button>
                            </>
                          ) : (
                            <span className={`text-[10px] font-mono font-bold flex items-center gap-1 px-2 py-1 rounded ${
                              act.status === "approved" ? "text-emerald-400 bg-emerald-500/5 border border-emerald-500/15" : "text-red-400 bg-red-500/5 border border-red-500/15"
                            }`}>
                              {act.status === "approved" ? "✓ APPROVED" : "✗ REJECTED"}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: AUDIT LEDGER */}
              {activeTab === "ledger" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Cryptographic Audit Ledger</h4>
                    <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">IMMUTABLE</span>
                  </div>

                  <div className="space-y-3 font-mono text-[10px]">
                    {[
                      { index: "184,102", hash: "sha256:d8a2bf48f710b2ef4", desc: "Auth SAP freight sync - OK", sign: "GFF_SIGN_0x71" },
                      { index: "184,101", hash: "sha256:c0a4e760bf2d5efd3", desc: "PII Scrubbing Validation - PII Masked", sign: "GFF_SIGN_0x94" },
                      { index: "184,100", hash: "sha256:a41f98d02df0e7b29", desc: "Reject DB Outflow - Mismatched Region", sign: "SYS_HALT_0x12" }
                    ].map((row, i) => (
                      <div key={i} className="p-3 rounded-lg bg-black border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div className="flex items-center gap-3">
                          <span className="text-[#009DFF] font-semibold">Block #{row.index}</span>
                          <span className="text-white/40">{row.hash}</span>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                          <span className="text-white/80">{row.desc}</span>
                          <span className="px-1.5 py-0.5 rounded bg-white/5 text-[8px] border border-white/10 text-white/50">{row.sign}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Console Footing Note */}
              <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] text-white/30 font-mono">
                <span>GATEWAY SYSTEM V4.1.2</span>
                <span>NO COMPLIANCE GUARANTEE IMPLIED</span>
              </div>
            </div>


            {/* Right Box: Live Metrics Gauge */}
            <div className="lg:col-span-4 bg-gradient-to-br from-black to-[#050505] rounded-xl border border-white/10 p-6 flex flex-col justify-between shadow-xl relative overflow-hidden">
              <div className="space-y-6">
                <div>
                  <span className="text-[9px] font-mono text-red-500 uppercase tracking-widest font-bold">Telemetry Output</span>
                  <h4 className="text-base font-bold text-white tracking-tight mt-0.5">Continuous Monitoring</h4>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-black/40 border border-white/5 space-y-1">
                    <span className="text-[10px] text-white/40 font-mono">MITIGATION RATE</span>
                    <div className="flex items-end justify-between">
                      <span className="text-2xl font-bold text-white font-mono">99.99%</span>
                      <span className="text-[9px] text-[#009DFF] font-mono font-semibold flex items-center gap-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" /> Live
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-black/40 border border-white/5 space-y-1">
                    <span className="text-[10px] text-white/40 font-mono">OVERHEAD LATENCY</span>
                    <div className="flex items-end justify-between">
                      <span className="text-2xl font-bold text-white font-mono">&lt; 11.4ms</span>
                      <span className="text-[9px] text-white/30 font-mono">99th %</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-black/40 border border-white/5 space-y-1">
                    <span className="text-[10px] text-white/40 font-mono">ACTIVE POLICIES</span>
                    <div className="flex items-end justify-between">
                      <span className="text-2xl font-bold text-white font-mono">
                        {Object.values(policies).filter(Boolean).length} / 4
                      </span>
                      <span className="text-[9px] text-white/30 font-mono">Tuned</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 text-[10px] text-white/40 font-light leading-relaxed">
                Policy updates are hot-reloadable and push immediately to isolated edge containers.
              </div>
            </div>

          </div>
        </MotionReveal>

        {/* Section 3: Technical Bento Grid mapping out our corporate risk architecture */}
        <MotionReveal className="space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono text-[#009DFF] uppercase tracking-widest font-bold">The Shield Philosophy</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Enterprise Safety Enforcements</h2>
            <p className="text-white/50 text-sm font-light">Underpinning our architecture is a commitment to isolation, cryptographic certainty, and zero trust.</p>
          </div>

          <BentoGrid>
            <BentoCard
              title="State Isolation"
              description="Agents operate with ephemeral memory blocks. Data schemas are scrubbed after every transaction commit, preventing leakage across sessions."
              icon={<Lock className="w-5 h-5 text-red-500" />}
              badge="Hardware Isolation"
              glowColor="red"
            />
            <BentoCard
              title="Static Restrictions"
              description="Tools are declared statically in signed manifests. Agents cannot compile dynamic execution scripts or invoke external domains."
              icon={<Cpu className="w-5 h-5 text-blue-500" />}
              badge="Deterministic Bounds"
              glowColor="blue"
            />
            <BentoCard
              title="Continuous Audit Logs"
              description="Every trace, input token, and validation outcome is securely archived with cryptographic signatures, providing an untampered paper trail."
              icon={<FileCheck className="w-5 h-5 text-purple-500" />}
              badge="Immutability"
              glowColor="purple"
            />
          </BentoGrid>
        </MotionReveal>

        {/* Coherent related navigation */}
        <MotionReveal className="border-t border-white/5 pt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <a 
            href="/platforms/agent-marketplace"
            className="group p-8 rounded-2xl border border-white/5 bg-gradient-to-br from-black to-[#050505] hover:border-white/10 transition-all flex flex-col justify-between min-h-[160px]"
          >
            <div>
              <span className="text-[10px] font-mono text-[#009DFF] uppercase tracking-widest">Sovereign Directory</span>
              <h4 className="text-lg font-bold text-white group-hover:text-[#009DFF] transition-colors mt-2 flex items-center gap-1.5">
                Agent Blueprint Marketplace <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </h4>
              <p className="text-xs text-white/50 font-light mt-1">Deploy validated, deterministic multi-agent patterns with embedded system boundaries.</p>
            </div>
          </a>

          <a 
            href="/platforms/developer-platform"
            className="group p-8 rounded-2xl border border-white/5 bg-gradient-to-br from-black to-[#050505] hover:border-white/10 transition-all flex flex-col justify-between min-h-[160px]"
          >
            <div>
              <span className="text-[10px] font-mono text-red-500 uppercase tracking-widest">Architect Surface</span>
              <h4 className="text-lg font-bold text-white group-hover:text-red-500 transition-colors mt-2 flex items-center gap-1.5">
                Developer Platform CLI & SDK <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </h4>
              <p className="text-xs text-white/50 font-light mt-1">Explore sandbox simulation, compiler workflows, and raw container telemetry logs.</p>
            </div>
          </a>
        </MotionReveal>

        {/* Premium CTA Section */}
        <PremiumCTA
          title="Review Your Cognitive Risk Surface"
          description="Design risk models aligned directly with your board's risk posture. Speak with our Principal Governance Engineers to evaluate and simulate multi-agent boundaries."
          primaryLabel="Connect with Governance Team"
          primaryHref="/contact"
        />

      </div>
    </InnerPageShell>
  );
}

