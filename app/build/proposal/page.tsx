"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ToolPageShell, ToolHero } from "@/components/build/components";
import { Industry, CompanySize } from "@/components/build/types";

// ==========================================
// 1. Metadata & Definitions for Intake Flow
// ==========================================

const INDUSTRIES: { id: Industry; label: string; icon: string; desc: string }[] = [
  { id: "banking", label: "Banking & Finance", icon: "🏦", desc: "Sovereign ledgers, AML auditing, and transaction validation." },
  { id: "insurance", label: "Insurance", icon: "🛡️", desc: "Automated underwriting, fraud context extraction, and risk auditing." },
  { id: "healthcare", label: "Healthcare & Pharma", icon: "🏥", desc: "HIPAA pipeline guardrails, clinical context synthesis, and EMR search." },
  { id: "telecom", label: "Telecom & Networks", icon: "📡", desc: "Telemetry monitoring, real-time SLA watchdogs, and routing orchestration." },
  { id: "public-sector", label: "Public Sector & Defense", icon: "🏛️", desc: "Sovereign cloud administration, air-gapped enclaves, and policy compliance." },
  { id: "energy", label: "Energy & Mining", icon: "⚡", desc: "IoT grid optimization, physical asset telemetry, and predictive safety models." }
];

const COMPANY_SIZES: { id: CompanySize; label: string; desc: string; range: string }[] = [
  { id: "small", label: "Sandbox Incubator", desc: "Rapid validation, low-overhead deployments, focused pilot scope.", range: "1 - 99 Members" },
  { id: "medium", label: "Mid-Market Growth", desc: "Regional enterprise coverage, cross-system compliance pipelines.", range: "100 - 999 Members" },
  { id: "enterprise", label: "Enterprise Scale", desc: "Global multi-region infrastructure, advanced compliance boundaries.", range: "1,000 - 9,999 Members" },
  { id: "global-conglomerate", label: "Global Conglomerate", desc: "Air-gapped security enclaves, multi-tenant network partitioning.", range: "10,000+ Members" }
];

const CHALLENGES = [
  { id: "data-fragmentation", label: "Data Fragmentation", icon: "🗄️", desc: "Metrics trapped inside unindexed legacy silos blocking AI access." },
  { id: "compliance-risk", label: "Compliance & Leakage Risk", icon: "🔒", desc: "External SaaS telemetry leaks private IP. Mandates single-tenant isolated enclaves." },
  { id: "operational-latency", label: "Operational Loop Latency", icon: "⏳", desc: "Manual document routing, verification steps, and reporting slowing down cycles." },
  { id: "cost-explosion", label: "API & SaaS Cost Explosion", icon: "📈", desc: "Skyrocketing token consumption fees, unstructured billing, and overlapping tooling." },
  { id: "other", label: "Custom Strategic Obstacle", icon: "⚙️", desc: "Provide a custom corporate obstacle or technical constraint to resolve." }
];

const OUTCOMES = [
  { id: "zero-retention", label: "Zero Retention VPC", desc: "Absolute secure pipelines with zero memory logging boundaries." },
  { id: "sub-150ms-latency", label: "Sub-150ms Execution", desc: "Dynamic cognitive agents performing sub-second decision loops." },
  { id: "cost-reclamation", label: "30%+ Expense Reclamation", desc: "Replace fragile external APIs with highly optimized local open models." },
  { id: "telemetry-audit", label: "Real-Time Telemetry Audit", desc: "Continuous, automatic compliance validation ledger tracks all queries." },
  { id: "fleet-orchestration", label: "Multi-Agent Fleet Orchestration", desc: "Deploy interconnected cognitive nodes working across corporate layers." }
];

const TIMELINES = [
  { id: "30-days", label: "30-Day Sandbox Pilot", desc: "High-speed validation, limited sandbox scope, co-innovation sprint.", weeks: 4 },
  { id: "90-days", label: "90-Day Production SOW", desc: "Full-scale core deployment, VPC isolation, primary systems integration.", weeks: 12 },
  { id: "180-days", label: "180-Day Federated Rollout", desc: "Multi-department rollout, custom fine-tuning, cross-region peering.", weeks: 24 },
  { id: "continuous", label: "Continuous SLA Co-Run", desc: "Persistent system optimization, regular compliance updates, proactive tuning.", weeks: 52 }
];

const ENGAGEMENT_PATHS = [
  {
    id: "garage" as const,
    label: "GFF Garage",
    badge: "Co-Innovation Sprint",
    desc: "Rapid discovery, sandboxed design, and validation proof-of-concept. Perfect for high-speed strategic alignment.",
    weeks: "2 - 4 Weeks",
    squad: "1 Architect, 1 Engineer",
    outcome: "Validated Interactive Prototype & Baseline Architecture Blueprint",
    accent: "#009DFF"
  },
  {
    id: "foundry" as const,
    label: "GFF Foundry",
    badge: "Bespoke Platform Build",
    desc: "Custom engineering, model optimization, and private VPC deployment. The standard choice for secure systems construction.",
    weeks: "6 - 12 Weeks",
    squad: "1 Lead Architect, 2 Systems Engineers, 1 Security Specialist",
    outcome: "Hardened Single-Tenant Platform deployed inside private cloud",
    accent: "#00FF9D"
  },
  {
    id: "factory" as const,
    label: "GFF Factory",
    badge: "Industrial Scale Fleets",
    desc: "High-volume cognitive agent orchestration, automated pipelines, and enterprise-wide federated data mesh networks.",
    weeks: "12 - 24 Weeks",
    squad: "2 Architects, 4 Core Engineers, 1 QA Auditor, 1 Delivery Director",
    outcome: "Multi-agent automated workforce operating across production databases",
    accent: "#9D00FF"
  },
  {
    id: "operate" as const,
    label: "GFF Operate",
    badge: "SLA-Driven Co-Run",
    desc: "Continuous proactive monitoring, scheduled compliance updates, model weight updates, and guaranteed performance SLAs.",
    weeks: "Ongoing Execution",
    squad: "Dedicated Site Reliability Fleet, Lead AI Performance Engineer",
    outcome: "Guaranteed 99.9% uptime, compliance reports, and proactive optimizations",
    accent: "#E5A93C"
  }
];

const BUDGET_RANGES = [
  { id: "tier-1", label: "Discovery Capital ($50K - $250K)", desc: "Suited for GFF Garage exploration and sandbox verification." },
  { id: "tier-2", label: "Strategic Platform ($250K - $1M)", desc: "Optimal for core GFF Foundry setup and VPC deployments." },
  { id: "tier-3", label: "Industrial Scale ($1M+)", desc: "Required for GFF Factory federated rollouts and persistent co-run." }
];

// ==========================================
// 2. Types & Interface
// ==========================================

interface ProposalIntakeInputs {
  companyName: string;
  industry: Industry;
  companySize: CompanySize;
  primaryChallenge: string;
  customChallenge: string;
  priorityOutcomes: string[];
  targetTimeline: string;
  preferredEngagementPath: "garage" | "foundry" | "factory" | "operate";
  budgetRange: string;
  geography: string;
  stakeholders: string;
}

const INITIAL_INTAKE_INPUTS: ProposalIntakeInputs = {
  companyName: "",
  industry: "banking",
  companySize: "enterprise",
  primaryChallenge: "compliance-risk",
  customChallenge: "",
  priorityOutcomes: ["zero-retention", "sub-150ms-latency"],
  targetTimeline: "90-days",
  preferredEngagementPath: "foundry",
  budgetRange: "tier-2",
  geography: "",
  stakeholders: ""
};

const compilingMessages = [
  "Spinning up local compiler sandbox...",
  "Querying GFF strategic taxonomy parameters...",
  "Applying regulatory compliance standards override...",
  "Sizing GFF delivery squad parameters...",
  "Configuring isolated virtual boundary rules...",
  "Enforcing strict zero-data retention pipelines...",
  "Generating premium SOW specifications..."
];

export default function ProposalBuilderPage() {
  const [inputs, setInputs] = useState<ProposalIntakeInputs>(INITIAL_INTAKE_INPUTS);
  const [step, setStep] = useState<"configure" | "compiling" | "preview">("configure");
  const [activeStepGate, setActiveStepGate] = useState<1 | 2 | 3>(1);
  const [compilingStepIndex, setCompilingStepIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [hasSavedDraft, setHasSavedDraft] = useState(false);
  const [activePreviewSection, setActivePreviewSection] = useState<string>("executive-summary");
  const [signName, setSignName] = useState("");
  const [signTitle, setSignTitle] = useState("");
  const [isSigned, setIsSigned] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const draft = localStorage.getItem("gff_proposal_draft_intake");
      if (draft) setHasSavedDraft(true);
    }
  }, []);

  const validateStep = (gate: 1 | 2 | 3): boolean => {
    const errors: Record<string, string> = {};
    if (gate === 1) {
      if (!inputs.industry) errors.industry = "Please select a primary industry vertical.";
      if (!inputs.companySize) errors.companySize = "Please specify company scale.";
    } else if (gate === 2) {
      if (!inputs.primaryChallenge) errors.primaryChallenge = "Please identify your primary business challenge.";
      if (inputs.primaryChallenge === "other" && !inputs.customChallenge.trim()) {
        errors.customChallenge = "Please specify your custom corporate obstacle.";
      }
      if (inputs.priorityOutcomes.length === 0) {
        errors.priorityOutcomes = "Please select at least one priority target outcome.";
      }
      if (!inputs.targetTimeline) errors.targetTimeline = "Please select a target timeline.";
    } else if (gate === 3) {
      if (!inputs.preferredEngagementPath) errors.preferredEngagementPath = "Please select an engagement pathway.";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextGate = () => {
    if (validateStep(activeStepGate)) {
      setActiveStepGate((prev) => (prev + 1) as 1 | 2 | 3);
    }
  };

  const handleCompile = () => {
    if (!validateStep(3)) return;
    setStep("compiling");
    setCompilingStepIndex(0);
  };

  useEffect(() => {
    if (step !== "compiling") return;
    const interval = setInterval(() => {
      setCompilingStepIndex((prev) => {
        if (prev < compilingMessages.length - 1) return prev + 1;
        clearInterval(interval);
        setStep("preview");
        return prev;
      });
    }, 450);
    return () => clearInterval(interval);
  }, [step]);

  const handleSaveDraft = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("gff_proposal_draft_intake", JSON.stringify(inputs));
      setSaved(true);
      setHasSavedDraft(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleRestoreDraft = () => {
    if (typeof window !== "undefined") {
      const draft = localStorage.getItem("gff_proposal_draft_intake");
      if (draft) {
        setInputs(JSON.parse(draft));
        setHasSavedDraft(false);
      }
    }
  };

  const handleReset = () => {
    setInputs(INITIAL_INTAKE_INPUTS);
    setStep("configure");
    setActiveStepGate(1);
    setIsSigned(false);
    setSignName("");
    setSignTitle("");
    setValidationErrors({});
    if (typeof window !== "undefined") {
      localStorage.removeItem("gff_proposal_draft_intake");
      setHasSavedDraft(false);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  const handleCopyOutline = () => {
    const data = generateProposalData();
    const outlineText = `GFF AI SOVEREIGN INTEGRATION PROPOSAL
----------------------------------------
Organization Name: ${data.org}
Sector Vertical: ${data.industryLabel}
Operational Footprint: ${data.companySizeLabel}
Geographic Deployment: ${data.geographyLabel}
Priority Challenge: ${data.challengeLabel}
Target Path: ${data.engagementPathObj.label} (${data.engagementPathObj.badge})
Project Scope Timeline: ${data.timelineLabel} (${data.weeks} Weeks)
Core Squad Config: ${data.engagementPathObj.squad}
Capital Allocation Range: ${data.budgetLabel}
Sponsor Stakeholders: ${data.stakeholdersLabel}

KEY DELIVERABLES:
${data.deliverables.map((d, i) => `${i + 1}. ${d}`).join("\n")}
`;
    navigator.clipboard.writeText(outlineText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateProposalData = () => {
    const org = inputs.companyName.trim() || "Enterprise Client";
    const indObj = INDUSTRIES.find((i) => i.id === inputs.industry) || INDUSTRIES[0];
    const sizeObj = COMPANY_SIZES.find((s) => s.id === inputs.companySize) || COMPANY_SIZES[2];
    const pathObj = ENGAGEMENT_PATHS.find((p) => p.id === inputs.preferredEngagementPath) || ENGAGEMENT_PATHS[1];
    const timelineObj = TIMELINES.find((t) => t.id === inputs.targetTimeline) || TIMELINES[1];
    const budgetObj = BUDGET_RANGES.find((b) => b.id === inputs.budgetRange) || BUDGET_RANGES[1];

    const challengeLabel = inputs.primaryChallenge === "other" && inputs.customChallenge.trim()
      ? inputs.customChallenge.trim()
      : (CHALLENGES.find((c) => c.id === inputs.primaryChallenge)?.label || "Sovereign Integration");

    const geographyLabel = inputs.geography.trim() || "Global Private VPC Network Perimeter";
    const stakeholdersLabel = inputs.stakeholders.trim() || "Chief Technology Officer, Compliance Committee";

    const selectedOutcomeLabels = inputs.priorityOutcomes.map(
      (out) => OUTCOMES.find((o) => o.id === out)?.label || out
    );

    let calculatedWeeks = timelineObj.weeks;
    if (inputs.preferredEngagementPath === "garage") calculatedWeeks = 4;
    else if (inputs.preferredEngagementPath === "operate") calculatedWeeks = 52;
    else {
      if (inputs.companySize === "small") calculatedWeeks = Math.max(4, calculatedWeeks - 4);
      else if (inputs.companySize === "global-conglomerate") calculatedWeeks = calculatedWeeks + 4;
    }

    const p1 = Math.max(1, Math.round(calculatedWeeks * 0.15));
    const p2 = Math.max(1, Math.round(calculatedWeeks * 0.30));
    const p3 = Math.max(1, Math.round(calculatedWeeks * 0.40));
    const p4 = Math.max(1, calculatedWeeks - (p1 + p2 + p3));

    let deliverables: string[] = [];
    if (inputs.preferredEngagementPath === "garage") {
      deliverables = [
        "Interactive high-velocity client sandbox prototype",
        "Strategic SOW architecture topology outline schema",
        "Initial data pipeline schema risk audit assessment",
        "Targeted performance benchmarking telemetry sheet"
      ];
    } else if (inputs.preferredEngagementPath === "foundry") {
      deliverables = [
        "Fully provisioned, isolated single-tenant private VPC perimeter",
        "Tailored multi-agent consensus network and workflow configurations",
        "Hardened OmniMesh read-only legacy data connector pipelines",
        "Enterprise-wide compliance audit ledger logging software"
      ];
    } else if (inputs.preferredEngagementPath === "factory") {
      deliverables = [
        "Industrial-scale federated data mesh network connectors",
        "Autonomous auto-scaling cross-department agent fleet systems",
        "Highly integrated compliance watchdog and safety enforcer software",
        "Sovereign multi-region VPC peering configurations"
      ];
    } else {
      deliverables = [
        "Active monitoring uptime and model performance telemetry panels",
        "Guaranteed 99.9% operational performance SLA monitoring setup",
        "Proactive scheduled compliance and data policy updates",
        "Weekly technical optimization analysis reports and audit files"
      ];
    }

    return {
      org,
      industryLabel: indObj.label,
      industryDesc: indObj.desc,
      industryIcon: indObj.icon,
      companySizeLabel: sizeObj.label,
      companySizeDesc: sizeObj.desc,
      companySizeRange: sizeObj.range,
      challengeLabel,
      timelineLabel: timelineObj.label,
      weeks: calculatedWeeks,
      engagementPathObj: pathObj,
      budgetLabel: inputs.budgetRange ? budgetObj.label : "Tailored Strategic Budget",
      geographyLabel,
      stakeholdersLabel,
      selectedOutcomeLabels,
      deliverables,
      p1, p2, p3, p4
    };
  };

  const pData = generateProposalData();

  const renderTopologyDiagram = (path: "garage" | "foundry" | "factory" | "operate") => {
    return (
      <div className="p-4 rounded-xl bg-[#030305] border border-white/5 font-mono text-[9px] text-white/50 space-y-3">
        <div className="flex justify-between items-center text-[7px] text-white/30 uppercase tracking-widest">
          <span>DEPLOYMENT TOPOLOGY MAP</span>
          <span className="text-[#00FF9D] font-bold">{path.toUpperCase()}_ACTIVE_NODE</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center text-center">
          <div className="p-2 border border-white/10 rounded bg-white/[0.01]">📥 LOCAL INGEST</div>
          <div className="text-white/20 text-[8px] hidden sm:block">────────▶</div>
          <div className="p-2.5 border border-[#009DFF]/30 rounded bg-[#009DFF]/5 font-bold text-white uppercase">GFF_{path}</div>
          <div className="text-white/20 text-[8px] hidden sm:block">────────▶</div>
          <div className="p-2 border border-[#00FF9D]/30 rounded bg-[#00FF9D]/5">🛡️ SECURE ENCLAVE</div>
        </div>
        <p className="text-[8px] text-white/30 leading-snug">
          <strong>COMPLIANCE SUMMARY:</strong> Workloads are fully orchestrated inside single-tenant enclaves inside the geographical boundary. Memory queues are cleared instantly post-token processing with absolute zero persistent retention pipelines.
        </p>
      </div>
    );
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#020204] flex items-center justify-center text-white font-mono text-xs">
        Booting GFF Enterprise proposal workspace...
      </div>
    );
  }

  return (
    <ToolPageShell showContact={step !== "preview"}>
      
      <ToolHero
        category="PHASE 3 // STRATEGIC ADVISORY SOW BUILDER"
        title="Sovereign AI Proposal"
        highlightedWord="Proposal"
        description="Configure strategic integration models, design multi-agent topologies, and compile localized statement of work (SOW) blueprints completely offline."
      />

      <AnimatePresence mode="wait">
        
        {step === "configure" && (
          <motion.div
            key="configure"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            <div className="lg:col-span-8 space-y-6">
              {hasSavedDraft && (
                <div className="p-4 rounded-xl border border-[#009DFF]/20 bg-[#009DFF]/5 flex items-center justify-between text-xs text-white animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#009DFF] animate-pulse" />
                    <span>In-progress draft detected from your previous workspace session.</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleRestoreDraft} className="px-3 py-1.5 bg-[#009DFF]/20 border border-[#009DFF]/40 text-[#009DFF] text-[10px] font-mono hover:bg-[#009DFF]/40 transition uppercase font-bold rounded">Restore Draft</button>
                    <button onClick={() => setHasSavedDraft(false)} className="px-2 py-1.5 text-white/40 text-[10px] font-mono hover:text-white uppercase">Ignore</button>
                  </div>
                </div>
              )}

              {/* STEP TIMELINE GATE HEADER */}
              <div className="p-1 rounded-lg bg-black/45 border border-white/5 flex text-center text-[10px] font-mono">
                {[1, 2, 3].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => { if (validateStep(1) && (g < 3 || validateStep(2))) setActiveStepGate(g as 1 | 2 | 3); }}
                    className={`flex-1 py-2 rounded transition font-semibold uppercase ${activeStepGate === g ? "bg-white/5 text-[#009DFF] border border-white/10" : "text-white/40 hover:text-white"}`}
                    disabled={g > activeStepGate && !validateStep(activeStepGate)}
                  >
                    0{g} {"//"} {g === 1 ? "Baseline Profile" : g === 2 ? "Strategy & Outcomes" : "Deployment Pathway"}
                  </button>
                ))}
              </div>

              {/* FORM WRAPPER CARD */}
              <div className="p-6 lg:p-8 rounded-2xl border border-white/5 bg-[#030306]/95 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 font-mono text-[8px] text-white/20">
                  GFF_PROPOSAL_STUDIO // REV_2026
                </div>

                {/* GATE 1: BASELINE */}
                {activeStepGate === 1 && (
                  <div className="space-y-5 animate-fadeIn">
                    <div className="border-b border-white/5 pb-3">
                      <span className="text-[9px] font-mono text-[#009DFF] uppercase tracking-wider font-bold">GATE 01 OF 03</span>
                      <h2 className="text-lg font-bold text-white mt-1">Corporate Baseline Profile</h2>
                      <p className="text-white/40 text-[10px] font-light">Specify your organization, vertical sector, operational scale, and target regional boundary constraints.</p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-white/50 uppercase tracking-wide block">Organization Name (Optional)</label>
                      <input
                        type="text"
                        value={inputs.companyName}
                        onChange={(e) => setInputs({ ...inputs, companyName: e.target.value })}
                        placeholder="e.g. Sovereign Global Mainframes"
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 h-11 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#009DFF]/60 transition"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <label className="text-[10px] font-mono text-white/50 uppercase tracking-wide block">Industry Vertical</label>
                        {validationErrors.industry && <span className="text-[9px] font-mono text-[#E4000F] font-bold">{validationErrors.industry}</span>}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {INDUSTRIES.map((ind) => (
                          <button
                            key={ind.id}
                            type="button"
                            onClick={() => { setInputs({ ...inputs, industry: ind.id }); setValidationErrors((prev) => ({ ...prev, industry: "" })); }}
                            className={`p-3 rounded-xl border text-left transition flex gap-3 items-start min-h-[60px] ${inputs.industry === ind.id ? "border-[#009DFF] bg-[#009DFF]/5 shadow-[0_0_12px_rgba(0,157,255,0.1)]" : "border-white/5 bg-black/40 hover:border-white/10 hover:bg-black/60"}`}
                          >
                            <span className="text-base mt-0.5">{ind.icon}</span>
                            <div>
                              <h4 className="text-xs font-bold text-white leading-none">{ind.label}</h4>
                              <p className="text-[9px] text-white/40 leading-snug font-light mt-1">{ind.desc}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <label className="text-[10px] font-mono text-white/50 uppercase tracking-wide block">Enterprise Operational Scale</label>
                        {validationErrors.companySize && <span className="text-[9px] font-mono text-[#E4000F] font-bold">{validationErrors.companySize}</span>}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {COMPANY_SIZES.map((size) => (
                          <button
                            key={size.id}
                            type="button"
                            onClick={() => { setInputs({ ...inputs, companySize: size.id }); setValidationErrors((prev) => ({ ...prev, companySize: "" })); }}
                            className={`p-3 rounded-xl border text-left transition flex flex-col justify-between min-h-[105px] ${inputs.companySize === size.id ? "border-[#009DFF] bg-[#009DFF]/5" : "border-white/5 bg-black/40 hover:border-white/10"}`}
                          >
                            <div>
                              <h4 className="text-xs font-bold text-white leading-tight">{size.label}</h4>
                              <span className="text-[8px] font-mono text-white/40 mt-0.5 block">{size.range}</span>
                            </div>
                            <p className="text-[9px] text-white/30 leading-tight mt-1.5">{size.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-white/50 uppercase tracking-wide block">Deployment Geography (Optional)</label>
                      <input
                        type="text"
                        value={inputs.geography}
                        onChange={(e) => setInputs({ ...inputs, geography: e.target.value })}
                        placeholder="e.g. EU Sovereign Boundary (VPC Frankfurt), AWS us-east-1 VPC"
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 h-11 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#009DFF]/60 transition"
                      />
                    </div>
                  </div>
                )}

                {/* GATE 2: STRATEGY & OUTCOMES */}
                {activeStepGate === 2 && (
                  <div className="space-y-5 animate-fadeIn">
                    <div className="border-b border-white/5 pb-3">
                      <span className="text-[9px] font-mono text-[#009DFF] uppercase tracking-wider font-bold">GATE 02 OF 03</span>
                      <h2 className="text-lg font-bold text-white mt-1">Strategic Friction & Outcomes</h2>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <label className="text-[10px] font-mono text-white/50 uppercase block">Primary Obstacle</label>
                        {validationErrors.primaryChallenge && <span className="text-[9px] font-mono text-[#E4000F] font-bold">{validationErrors.primaryChallenge}</span>}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {CHALLENGES.map((chal) => (
                          <button
                            key={chal.id}
                            type="button"
                            onClick={() => { setInputs({ ...inputs, primaryChallenge: chal.id }); setValidationErrors((prev) => ({ ...prev, primaryChallenge: "" })); }}
                            className={`p-2 rounded-xl border text-left transition flex gap-2 items-start min-h-[60px] ${inputs.primaryChallenge === chal.id ? "border-[#009DFF] bg-[#009DFF]/5" : "border-white/5 bg-black/40"}`}
                          >
                            <span className="text-sm mt-0.5">{chal.icon}</span>
                            <div>
                              <h4 className="text-xs font-bold text-white leading-none">{chal.label}</h4>
                              <p className="text-[8.5px] text-white/35 leading-tight mt-1 font-light">{chal.desc}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {inputs.primaryChallenge === "other" && (
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-white/50 uppercase block">Specify Custom Obstacle</label>
                        <textarea
                          rows={2}
                          value={inputs.customChallenge}
                          onChange={(e) => { setInputs({ ...inputs, customChallenge: e.target.value }); setValidationErrors((prev) => ({ ...prev, customChallenge: "" })); }}
                          placeholder="Describe the custom strategic obstacle..."
                          className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-[#009DFF]"
                        />
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <label className="text-[10px] font-mono text-white/50 uppercase block">Priority Outcomes</label>
                        {validationErrors.priorityOutcomes && <span className="text-[9px] font-mono text-[#E4000F] font-bold">{validationErrors.priorityOutcomes}</span>}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {OUTCOMES.map((out) => {
                          const isSelected = inputs.priorityOutcomes.includes(out.id);
                          return (
                            <button
                              key={out.id}
                              type="button"
                              onClick={() => {
                                let list = [...inputs.priorityOutcomes];
                                if (isSelected) list = list.filter((id) => id !== out.id);
                                else list.push(out.id);
                                setInputs({ ...inputs, priorityOutcomes: list });
                              }}
                              className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between gap-4 ${isSelected ? "border-[#009DFF] bg-[#009DFF]/5" : "border-white/5 bg-black/40"}`}
                            >
                              <div>
                                <h4 className="text-xs font-bold text-white leading-tight">{out.label}</h4>
                                <p className="text-[8.5px] text-white/35 font-light leading-tight mt-0.5">{out.desc}</p>
                              </div>
                              <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${isSelected ? "bg-[#009DFF] border-[#009DFF]" : "border-white/20"}`}>
                                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-white/50 uppercase block">Target Project Timeline</label>
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                        {TIMELINES.map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setInputs({ ...inputs, targetTimeline: t.id })}
                            className={`p-2 rounded-xl border text-left transition flex flex-col justify-between min-h-[75px] ${inputs.targetTimeline === t.id ? "border-[#009DFF] bg-[#009DFF]/5" : "border-white/5 bg-black/40 hover:border-white/10"}`}
                          >
                            <h4 className="text-[10px] font-bold text-white leading-tight">{t.label}</h4>
                            <p className="text-[8px] text-white/35 leading-snug mt-1 font-light">{t.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* GATE 3: PATHWAY */}
                {activeStepGate === 3 && (
                  <div className="space-y-5 animate-fadeIn">
                    <div className="border-b border-white/5 pb-3">
                      <span className="text-[9px] font-mono text-[#009DFF] uppercase tracking-wider font-bold">GATE 03 OF 03</span>
                      <h2 className="text-lg font-bold text-white mt-1">Sovereign Engagement Pathway</h2>
                      <p className="text-white/40 text-[10px] font-light">Select the engagement structure, target capital ranges, and specify sponsor stakeholders.</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-[10px] font-mono text-white/50 uppercase tracking-wide block">Strategic Integration Path</label>
                        {validationErrors.preferredEngagementPath && <span className="text-[9px] font-mono text-[#E4000F] font-bold">{validationErrors.preferredEngagementPath}</span>}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {ENGAGEMENT_PATHS.map((path) => {
                          const isSelected = inputs.preferredEngagementPath === path.id;
                          return (
                            <button
                              key={path.id}
                              type="button"
                              onClick={() => { setInputs({ ...inputs, preferredEngagementPath: path.id }); setValidationErrors((prev) => ({ ...prev, preferredEngagementPath: "" })); }}
                              className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between min-h-[160px] relative overflow-hidden ${isSelected ? "border-[#009DFF] bg-[#030307]" : "border-white/5 bg-black/40 hover:border-white/10"}`}
                            >
                              <div className="absolute top-0 left-0 w-1.5 h-full" style={{ backgroundColor: path.accent }} />
                              <div className="pl-1.5 space-y-1">
                                <div className="flex justify-between items-center text-[7.5px] font-mono uppercase font-bold">
                                  <span style={{ color: path.accent }}>{path.badge}</span>
                                  <span className="text-white/40">{path.weeks}</span>
                                </div>
                                <h3 className="text-xs font-extrabold text-white mt-1">{path.label}</h3>
                                <p className="text-[9.5px] text-white/45 leading-relaxed font-light">{path.desc}</p>
                              </div>
                              <div className="pl-1.5 pt-2 mt-2 border-t border-white/5 text-[8.5px] font-mono text-white/30">
                                <div><span className="text-white/40">SQUAD:</span> {path.squad}</div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-white/50 uppercase tracking-wide block">Capital Allocation Target (Optional)</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {BUDGET_RANGES.map((b) => (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => setInputs({ ...inputs, budgetRange: b.id })}
                            className={`p-3 rounded-xl border text-left transition ${inputs.budgetRange === b.id ? "border-[#009DFF] bg-[#009DFF]/5" : "border-white/5 bg-black/40 hover:border-white/10"}`}
                          >
                            <h4 className="text-xs font-bold text-white leading-tight">{b.label}</h4>
                            <p className="text-[9px] text-white/35 leading-tight mt-1 font-light">{b.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-white/50 uppercase tracking-wide block">Sponsor Stakeholders (Optional)</label>
                      <input
                        type="text"
                        value={inputs.stakeholders}
                        onChange={(e) => setInputs({ ...inputs, stakeholders: e.target.value })}
                        placeholder="e.g. VP of Security, Lead Compliance Architect"
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 h-11 text-xs text-white placeholder-white/25 focus:outline-none focus:border-[#009DFF] transition"
                      />
                    </div>
                  </div>
                )}

                {/* BOTTOM STEPS BUTTONS */}
                <div className="border-t border-white/5 pt-5 mt-6 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setActiveStepGate((prev) => (prev - 1) as 1 | 2 | 3)}
                    disabled={activeStepGate === 1}
                    className={`px-4 h-9 rounded-lg border text-xs font-mono uppercase transition ${activeStepGate === 1 ? "border-white/5 text-white/10 cursor-not-allowed" : "border-white/10 text-white hover:bg-white/5"}`}
                  >
                    Back
                  </button>
                  <div className="flex gap-2.5">
                    <button
                      type="button"
                      onClick={handleSaveDraft}
                      className="px-3.5 h-9 rounded-lg border border-white/10 text-xs font-mono text-white hover:bg-white/5 transition uppercase"
                    >
                      {saved ? "✓ Saved" : "[ Save Draft ]"}
                    </button>
                    {activeStepGate < 3 ? (
                      <button
                        type="button"
                        onClick={handleNextGate}
                        className="px-4 h-9 rounded-lg text-xs font-bold uppercase bg-[#009DFF] text-black hover:bg-[#009DFF]/90 font-mono"
                      >
                        Next Gate
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleCompile}
                        className="px-4 h-9 rounded-lg text-xs font-bold uppercase bg-[#00FF9D] text-black hover:bg-[#00FF9D]/90 font-mono"
                      >
                        Compile SOW Blueprint
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-4 lg:sticky lg:top-8 space-y-4 hidden lg:block">
              <div className="p-4 rounded-xl border border-white/5 bg-[#030306]/95 text-left relative animate-fadeIn">
                {/* Telemetry flashing dot */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00FF9D] animate-ping" />
                  <span className="text-[8px] font-mono text-white/40 uppercase">LIVE COMPILING</span>
                </div>

                <span className="text-[8px] font-mono text-white/35 font-bold uppercase block mb-3">SOW compilation blueprint</span>

                <div className="space-y-4">
                  {/* Entity Metadata */}
                  <div className="p-3.5 rounded-lg bg-black/60 border border-white/5 font-mono text-[9.5px] leading-relaxed space-y-1.5 text-white/60">
                    <div>
                      <span className="text-white/30 uppercase">ENTITY:</span>{" "}
                      <span className="text-white font-bold">{pData.org}</span>
                    </div>
                    <div>
                      <span className="text-white/30 uppercase">VERTICAL:</span>{" "}
                      <span className="text-[#009DFF] font-semibold">{pData.industryLabel}</span>
                    </div>
                    <div>
                      <span className="text-white/30 uppercase">SCALE RANGE:</span>{" "}
                      <span className="text-white/80">{pData.companySizeLabel} ({pData.companySizeRange})</span>
                    </div>
                    <div>
                      <span className="text-white/30 uppercase">VPC REGION:</span>{" "}
                      <span className="text-[#00FF9D]">{inputs.geography.trim() ? pData.geographyLabel : "Unspecified VPC boundary"}</span>
                    </div>
                  </div>

                  {/* SOW Draft Checklist */}
                  <div className="space-y-2.5">
                    <span className="text-[7.5px] font-mono text-white/30 uppercase tracking-wider block">INTEGRATION GATEWAYS STATUS</span>
                    <ul className="space-y-1.5 font-mono text-[9px] text-white/50">
                      <li className="flex items-center gap-2">
                        <span className="text-[#00FF9D]">✓</span>
                        <span className="text-white/85">Gate 1: Baseline established</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className={activeStepGate >= 2 ? "text-[#00FF9D]" : "text-white/20"}>
                          {activeStepGate >= 2 ? "✓" : "○"}
                        </span>
                        <span className={activeStepGate >= 2 ? "text-white/85" : "text-white/30"}>Gate 2: Friction & Priorities configured</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className={activeStepGate >= 3 ? "text-[#00FF9D]" : "text-white/20"}>
                          {activeStepGate >= 3 ? "✓" : "○"}
                        </span>
                        <span className={activeStepGate >= 3 ? "text-white/85" : "text-white/30"}>Gate 3: Engagement path resolved</span>
                      </li>
                    </ul>
                  </div>

                  {/* live outline draft list */}
                  <div className="pt-3.5 border-t border-white/5 space-y-2">
                    <span className="text-[7.5px] font-mono text-white/30 uppercase tracking-wider block">PROPOSAL SOW OUTLINE</span>
                    <div className="space-y-1 text-[10px] text-white/40 leading-snug">
                      <div className="flex gap-2">
                        <span className="font-mono text-[#009DFF]">SEC I.</span>
                        <span className="text-white/70">Executive Summary // {pData.industryLabel} Context</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-mono text-[#009DFF]">SEC II.</span>
                        <span className="text-white/70">Hardened Boundary ({pData.geographyLabel.substring(0, 14)}...)</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-mono text-[#009DFF]">SEC III.</span>
                        <span className="text-white/70">Deployment Model // {pData.engagementPathObj.label} Model</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-mono text-[#009DFF]">SEC IV.</span>
                        <span className="text-white/70">Workstreams & Milestones ({pData.weeks} Weeks)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === "compiling" && (
          <motion.div key="compiling" className="max-w-xl mx-auto text-center py-16">
            <div className="relative w-16 h-16 mb-6 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-[#00FF9D]/20 animate-ping" />
              <div className="absolute inset-2 rounded-full border border-[#009DFF]/30 animate-pulse" />
              <div className="w-8 h-8 rounded-full bg-black border border-[#00FF9D]/80 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00FF9D] animate-ping" />
              </div>
            </div>
            <span className="text-[9px] font-mono text-[#00FF9D] font-bold tracking-widest block mb-1">SOVEREIGN COMPILER v4.26</span>
            <h2 className="text-base font-bold text-white mb-4">Compiling Strategic SOW Blueprint</h2>
            <div className="w-full p-4 rounded-xl bg-[#030305] border border-white/5 text-left mb-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 h-0.5 bg-[#009DFF] transition-all duration-300" style={{ width: `${((compilingStepIndex + 1) / compilingMessages.length) * 100}%` }} />
              <div className="flex gap-2 font-mono text-[9px] text-white/50">
                <span className="text-[#009DFF]">&gt;</span>
                <p className="text-[#00FF9D] font-semibold leading-relaxed">{compilingMessages[compilingStepIndex]}</p>
              </div>
            </div>
            <p className="text-white/30 text-[8px] font-mono uppercase tracking-widest">ZERO DATA RETENTION LAYER ACTIVATED</p>
          </motion.div>
        )}

        {step === "preview" && (
          <motion.div key="preview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* INDEX COLUMN (3 columns) */}
              <div className="lg:col-span-3 space-y-4 sticky top-6 print:hidden">
                <div className="p-4 rounded-2xl border border-white/5 bg-[#030306]/95 text-left">
                  <span className="text-[8px] font-mono text-white/35 font-bold block mb-3">DOSSIER INDEX</span>
                  <nav className="space-y-0.5">
                    {[
                      { id: "executive-summary", label: "Executive Summary", icon: "📄" },
                      { id: "geographical-scope", label: "Hardened Perimeter Setup", icon: "🔍" },
                      { id: "recommended-gff-path", label: "Deployment Model", icon: "🚀" },
                      { id: "proposed-workstreams", label: "Delivery Phases", icon: "🗺️" }
                    ].map((sec, idx) => (
                      <button
                        key={sec.id}
                        onClick={() => {
                          setActivePreviewSection(sec.id);
                          const el = document.getElementById(sec.id);
                          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded text-[11px] transition flex items-center gap-2 ${activePreviewSection === sec.id ? "bg-white/5 text-[#009DFF] font-bold border-l border-[#009DFF]" : "text-white/50 hover:text-white"}`}
                      >
                        <span>{sec.icon}</span>
                        <span>{idx + 1}. {sec.label}</span>
                      </button>
                    ))}
                  </nav>

                  <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
                    <button onClick={handleCopyOutline} className="w-full py-1.5 rounded bg-white/5 text-white border border-white/10 hover:bg-white/10 transition text-[9px] font-mono uppercase font-semibold">
                      {copied ? "✓ Copied" : "Copy Outline"}
                    </button>
                    <button onClick={handlePrint} className="w-full py-1.5 rounded bg-white/5 text-white border border-white/10 hover:bg-white/10 transition text-[9px] font-mono uppercase font-semibold">
                      Print Spec Preview
                    </button>
                    <button onClick={handleReset} className="w-full py-1 text-center text-white/30 text-[9px] font-mono hover:text-white block uppercase">
                      [ Clear Form & Restart ]
                    </button>
                  </div>
                </div>
              </div>

              {/* CENTER COLUMN: FULL SOW PREVIEW (9 columns) */}
              <div className="lg:col-span-9 p-6 lg:p-10 rounded-2xl border border-white/5 bg-[#030306]/85 shadow-2xl relative overflow-hidden print:bg-white print:text-black print:p-0 print:border-none" id="proposal-document-content">
                <div className="hidden print:block text-right text-[8px] font-mono text-black/40 mb-6 border-b border-black/10 pb-1">
                  <span>GFF AI CONFIDENTIAL PORTFOLIO // SOVEREIGN SPECIFICATION ARCHITECTURE</span>
                </div>

                <div className="border-b border-white/10 pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 print:border-black/20">
                  <div className="space-y-2 text-left">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00FF9D] print:bg-black" />
                      <span className="text-[8px] font-mono text-[#009DFF] uppercase tracking-widest font-bold print:text-black/60">STATEMENT OF WORK OUTLINE</span>
                    </div>
                    <h1 className="text-xl lg:text-3xl font-extrabold text-white print:text-black tracking-tight leading-none">
                      {pData.org} Sovereign Integration
                    </h1>
                    <p className="text-white/60 text-xs font-light max-w-lg print:text-black/70">
                      Tailored SOW outline and strategic delivery blueprint for <strong className="text-white print:text-black font-semibold">{pData.org}</strong>.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/[0.01] border border-white/5 flex flex-col items-end text-right min-w-[170px] print:border-black/10 print:bg-black/5">
                    <span className="text-[7px] font-mono text-white/40 uppercase">IMPLEMENTATION HORIZON</span>
                    <span className="text-base font-bold text-white font-mono print:text-black">{pData.weeks} WEEKS</span>
                    <span className="text-[8px] font-mono text-[#00FF9D] mt-0.5 uppercase font-bold">{pData.budgetLabel}</span>
                  </div>
                </div>

                <div className="space-y-12 print:space-y-10 text-left">
                  {/* SECTION 1: EXECUTIVE SUMMARY */}
                  <div id="executive-summary" className="scroll-mt-10 space-y-4">
                    <div className="border-b border-white/5 pb-1 print:border-black/10">
                      <span className="text-[8px] font-mono text-[#009DFF] font-bold uppercase print:text-black/50">SECTION I</span>
                      <h2 className="text-sm font-bold text-white print:text-black flex items-center gap-1.5 font-bold">📄 Executive Summary</h2>
                    </div>
                    <div className="text-xs text-white/70 font-light leading-relaxed space-y-3 print:text-black/85">
                      <p>
                        This SOW details the strategic sovereign integration architecture mapped for deploying GFF AI systems inside the boundary of <strong className="text-white print:text-black font-semibold">{pData.org}</strong>. Operating inside the <strong className="text-white print:text-black font-semibold">{pData.industryLabel}</strong> vertical, GFF AI will deploy a dedicated single-tenant enclave designed to resolve the primary challenge: <strong className="text-white print:text-black font-semibold">{pData.challengeLabel}</strong>.
                      </p>
                      <p>
                        Our integration guarantees complete compliance with zero data retention logging metrics, running completely in-memory inside custom partitioned secure workspaces.
                      </p>
                    </div>
                  </div>

                  {/* SECTION 2: GEOGRAPHICAL & STAKEHOLDER SCOPE */}
                  <div id="geographical-scope" className="scroll-mt-10 space-y-4">
                    <div className="border-b border-white/5 pb-1 print:border-black/10">
                      <span className="text-[8px] font-mono text-[#009DFF] font-bold uppercase print:text-black/50">SECTION II</span>
                      <h2 className="text-sm font-bold text-white print:text-black flex items-center gap-1.5 font-bold">🔍 Hardened Perimeter Setup</h2>
                    </div>
                    <div className="text-xs text-white/70 font-light leading-relaxed space-y-3 print:text-black/85">
                      <p>
                        To ensure absolute compliance, all operations and data pipeline queries will be configured exclusively within the geographic parameters: <strong className="text-white print:text-black font-semibold">{pData.geographyLabel}</strong>.
                      </p>
                      <div className="p-3.5 rounded-lg border border-white/5 bg-black/40 print:border-black/10 text-[9.5px]">
                        <h4 className="font-bold text-white print:text-black mb-1.5 uppercase font-mono tracking-wide">ADMINISTRATIVE BOUNDS & SPONSORS</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <span className="text-white/30 font-mono block">SPONSOR STAKEHOLDERS:</span>
                            <span className="text-white font-medium print:text-black">{pData.stakeholdersLabel}</span>
                          </div>
                          <div>
                            <span className="text-white/30 font-mono block">OPERATIONAL SCOPE:</span>
                            <span className="text-white font-medium print:text-black">{pData.industryLabel} Context // {pData.companySizeLabel} Scale</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3: RECOMMENDED GFF DEPLOYMENT MODEL */}
                  <div id="recommended-gff-path" className="scroll-mt-10 space-y-4">
                    <div className="border-b border-white/5 pb-1 print:border-black/10">
                      <span className="text-[8px] font-mono text-[#009DFF] font-bold uppercase print:text-black/50">SECTION III</span>
                      <h2 className="text-sm font-bold text-white print:text-black flex items-center gap-1.5 font-bold">🚀 Deployment & Engagement Model</h2>
                    </div>
                    <div className="text-xs text-white/70 font-light leading-relaxed space-y-4 print:text-black/85">
                      <p>
                        GFF AI recommends the <strong className="text-white print:text-black font-semibold">{pData.engagementPathObj.label}</strong> engagement model to deliver secure, industrialized cognitive capabilities within your environment:
                      </p>

                      <div className="space-y-2">
                        <span className="text-[7.5px] font-mono text-white/30 uppercase tracking-widest block font-bold">SOVEREIGN ACTIVE DEPLOYMENT ARCHITECTURE PLAN</span>
                        {renderTopologyDiagram(inputs.preferredEngagementPath)}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                        <div className="p-3 rounded-lg border border-white/5 bg-black/30 print:border-black/10 text-left">
                          <h4 className="text-[10px] font-bold text-white print:text-black mb-1 uppercase font-mono tracking-wide">Delivery Fleet Sizing</h4>
                          <p className="text-[9.5px] text-white/40 leading-relaxed print:text-black/70">
                            Our team configuration targets rapid engineering, assigning: <strong className="text-white print:text-black font-semibold">{pData.engagementPathObj.squad}</strong>.
                          </p>
                        </div>
                        <div className="p-3 rounded-lg border border-white/5 bg-black/30 print:border-black/10 text-left">
                          <h4 className="text-[10px] font-bold text-white print:text-black mb-1 uppercase font-mono tracking-wide">Core Objective Delivery</h4>
                          <p className="text-[9.5px] text-white/40 leading-relaxed print:text-black/70">
                            The milestone outcome of this contract phase is: <strong className="text-white print:text-black font-semibold">{pData.engagementPathObj.outcome}</strong>.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 4: PROJECT WORKSTREAMS & DELIVERABLES */}
                  <div id="proposed-workstreams" className="scroll-mt-10 space-y-4">
                    <div className="border-b border-white/5 pb-1 print:border-black/10">
                      <span className="text-[8px] font-mono text-[#009DFF] font-bold uppercase print:text-black/50">SECTION IV</span>
                      <h2 className="text-sm font-bold text-white print:text-black flex items-center gap-1.5 font-bold">🗺️ Strategic Delivery Phases</h2>
                    </div>
                    <div className="text-xs text-white/70 font-light leading-relaxed space-y-4 print:text-black/85">
                      <p>
                        Technical delivery objectives are divided into four clear workstreams mapped to your target timeline of <strong className="text-white print:text-black font-semibold">{pData.weeks} Weeks</strong>:
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg border border-white/5 bg-black/45 space-y-1 print:border-black/10 text-left">
                          <div className="flex justify-between items-center border-b border-white/5 pb-1">
                            <span className="text-[9.5px] font-bold text-white print:text-black">Workstream A: Hardened Perimeter Setup</span>
                            <span className="text-[8.5px] font-mono text-[#009DFF] font-bold">WEEKS 1 - {pData.p1}</span>
                          </div>
                          <p className="text-[9px] text-white/40 print:text-black/70 font-light">Provision isolated enclaves, establish secure networking perimeters, and verify local data retention compliance rules.</p>
                        </div>

                        <div className="p-3 rounded-lg border border-white/5 bg-black/45 space-y-1 print:border-black/10 text-left">
                          <div className="flex justify-between items-center border-b border-white/5 pb-1">
                            <span className="text-[9.5px] font-bold text-white print:text-black">Workstream B: Ingestion Integration</span>
                            <span className="text-[8.5px] font-mono text-[#009DFF] font-bold">WEEKS {pData.p1 + 1} - {pData.p1 + pData.p2}</span>
                          </div>
                          <p className="text-[9px] text-white/40 print:text-black/70 font-light">Establish OmniMesh read-only connections to local databases and structured schemas.</p>
                        </div>

                        <div className="p-3 rounded-lg border border-white/5 bg-black/45 space-y-1 print:border-black/10 text-left">
                          <div className="flex justify-between items-center border-b border-white/5 pb-1">
                            <span className="text-[9.5px] font-bold text-white print:text-black">Workstream C: Fine-Tuning</span>
                            <span className="text-[8.5px] font-mono text-[#009DFF] font-bold">WEEKS {pData.p1 + pData.p2 + 1} - {pData.p1 + pData.p2 + pData.p3}</span>
                          </div>
                          <p className="text-[9px] text-white/40 print:text-black/70 font-light">Configure customized agent topologies, compile consensus decision-loop modules, and validate response safety.</p>
                        </div>

                        <div className="p-3 rounded-lg border border-white/5 bg-black/45 space-y-1 print:border-black/10 text-left">
                          <div className="flex justify-between items-center border-b border-white/5 pb-1">
                            <span className="text-[9.5px] font-bold text-white print:text-black">Workstream D: Validation & SLA Lock</span>
                            <span className="text-[8.5px] font-mono text-[#009DFF] font-bold">WEEKS {pData.p1 + pData.p2 + pData.p3 + 1} - {pData.weeks}</span>
                          </div>
                          <p className="text-[9px] text-white/40 print:text-black/70 font-light font-sans">Enforce target compliance policies, measure execution rates under high volume, and initiate co-innovation handoff.</p>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl border border-white/5 bg-white/[0.005] print:border-black/10">
                        <h4 className="text-[10px] font-bold text-white print:text-black mb-1.5 font-mono uppercase tracking-wider">CONTRACTUAL DELIVERABLES LOG:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-[9.5px] text-white/50 print:text-black/80 font-light">
                          {pData.deliverables.map((del, idx) => (
                            <li key={idx}><strong>Deliverable {idx + 1}:</strong> {del}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 5: SUCCESS MEASURES */}
                  <div id="success-measures" className="scroll-mt-10 space-y-4">
                    <div className="border-b border-white/5 pb-1 print:border-black/10">
                      <span className="text-[8px] font-mono text-[#009DFF] font-bold uppercase print:text-black/50">SECTION V</span>
                      <h2 className="text-sm font-bold text-white print:text-black flex items-center gap-1.5 font-bold">📈 Strategic Success Measures</h2>
                    </div>
                    <div className="text-xs text-white/70 font-light leading-relaxed space-y-3 print:text-black/85">
                      <p>Compliance and operational performance targets are tracked dynamically using our sovereign consensus dashboard system:</p>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
                        <div className="p-2.5 rounded border border-white/5 bg-white/[0.005] print:border-black/10">
                          <span className="text-xs font-bold text-[#00FF9D] block print:text-black">&gt; 99.9%</span>
                          <span className="text-[6.5px] text-white/35 uppercase mt-1 block">Task Success</span>
                        </div>
                        <div className="p-2.5 rounded border border-white/5 bg-white/[0.005] print:border-black/10">
                          <span className="text-xs font-bold text-[#009DFF] block print:text-black">&lt; 150ms</span>
                          <span className="text-[6.5px] text-white/35 uppercase mt-1 block">Latency</span>
                        </div>
                        <div className="p-2.5 rounded border border-white/5 bg-white/[0.005] print:border-black/10">
                          <span className="text-xs font-bold text-[#9D00FF] block print:text-black">0</span>
                          <span className="text-[6.5px] text-white/35 uppercase mt-1 block">IP Leaks</span>
                        </div>
                        <div className="p-2.5 rounded border border-white/5 bg-white/[0.005] print:border-black/10">
                          <span className="text-xs font-bold text-[#E5A93C] block print:text-black">30%+</span>
                          <span className="text-[6.5px] text-white/35 uppercase mt-1 block">Reclaimed Exp</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 6: EXECUTIVE SIGNATURE */}
                  <div id="sign-off-block" className="scroll-mt-10 space-y-4">
                    <div className="border-b border-white/5 pb-1 print:border-black/10">
                      <span className="text-[8px] font-mono text-[#009DFF] font-bold uppercase print:text-black/50">SECTION VI</span>
                      <h2 className="text-sm font-bold text-white print:text-black flex items-center gap-1.5 font-bold">✍️ SOW Authorization</h2>
                    </div>
                    
                    <div className="p-4 rounded-xl border border-white/5 bg-black/40 space-y-4 print:border-black/10">
                      <p className="text-[10px] text-white/40 leading-snug">
                        By entering your signature below, you endorse the draft SOW outline. This is a secure local simulation of the strategic roadmap setup; no contract data is retained.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-white/30 uppercase block">Authorized Signatory Name</label>
                          <input
                            type="text"
                            value={signName}
                            onChange={(e) => setSignName(e.target.value)}
                            placeholder="e.g. Dr. Catherine Vance"
                            className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00FF9D] print:hidden"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-white/30 uppercase block">Corporate Title</label>
                          <input
                            type="text"
                            value={signTitle}
                            onChange={(e) => setSignTitle(e.target.value)}
                            placeholder="e.g. VP of Security Compliance"
                            className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00FF9D] print:hidden"
                          />
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        {!isSigned ? (
                          <button
                            type="button"
                            onClick={() => {
                              if (signName.trim() && signTitle.trim()) setIsSigned(true);
                              else alert("Please enter both Signatory Name and Title.");
                            }}
                            className="px-4 py-2 rounded bg-[#00FF9D] text-black text-xs font-mono font-bold uppercase hover:bg-[#00FF9D]/95 transition print:hidden"
                          >
                            Sign strategic SOW
                          </button>
                        ) : (
                          <div className="w-full space-y-2">
                            <div className="p-3.5 border border-dashed border-[#00FF9D]/30 bg-[#00FF9D]/5 rounded flex justify-between items-center font-mono text-[9px] text-[#00FF9D]">
                              <div>
                                <span className="font-bold uppercase block tracking-wider text-[10px]">SOVEREIGN SIGNATURE STAMP APPLIED</span>
                                <div className="mt-1 font-light space-y-0.5">
                                  <div>SIGNATORY: {signName}</div>
                                  <div>TITLE: {signTitle}</div>
                                  <div>TIMESTAMP: {new Date().toLocaleString()}</div>
                                </div>
                              </div>
                              <div className="text-[8px] border border-[#00FF9D]/40 px-2 py-1 rotate-6 rounded font-extrabold uppercase">
                                GFF SIGNED
                              </div>
                            </div>
                            <button onClick={() => setIsSigned(false)} className="text-[8px] font-mono text-[#E4000F] uppercase hover:underline print:hidden">[ Clear Signature ]</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </ToolPageShell>
  );
}
