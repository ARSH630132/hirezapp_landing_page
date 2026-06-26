"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ToolPageShell, ToolHero } from "@/components/build/components";
import { Industry, CompanySize } from "@/components/build/types";
import { getToolState, saveToolState, clearToolState } from "@/components/build/workspaceUtility";

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
  const [exportToast, setExportToast] = useState<string | null>(null);

  const handleExportClick = (type: string) => {
    setExportToast(`Premium Feature Sandbox: Exporting as ${type} requires a GFF Enterprise Control Center gateway cloud connection. This offline terminal runs in strict zero-retention memory isolation.`);
    setTimeout(() => setExportToast(null), 6000);
  };

  useEffect(() => {
    setMounted(true);
    const draft = getToolState("proposal");
    if (draft) {
      setHasSavedDraft(true);
    }
  }, []);

  // Auto-save on input changes
  useEffect(() => {
    if (mounted) {
      saveToolState("proposal", inputs);
    }
  }, [inputs, mounted]);

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
    saveToolState("proposal", inputs);
    setSaved(true);
    setHasSavedDraft(false); // No need to prompt to restore if we just explicitly saved/synced
    setTimeout(() => setSaved(false), 2000);
  };

  const handleRestoreDraft = () => {
    const draft = getToolState("proposal");
    if (draft) {
      setInputs(draft as any);
      setHasSavedDraft(false);
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
    clearToolState("proposal");
    setHasSavedDraft(false);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  const handleCopyOutline = () => {
    const data = generateProposalData();
    const p1 = data.p1;
    const p2 = data.p2;
    const p3 = data.p3;
    const weeks = data.weeks;

    const outlineText = `GFF AI SOVEREIGN INTEGRATION PROPOSAL & OUTLINE (FRONTEND PREVIEW ONLY)
======================================================================
CLIENT: ${data.org} | VERTICAL: ${data.industryLabel}
OPERATIONAL SCALE: ${data.companySizeLabel} (${data.companySizeRange})
VPC DEPLOYMENT REGION: ${data.geographyLabel}
PREFERRED ENGAGEMENT PATHWAY: ${data.engagementPathObj.label} (${data.engagementPathObj.badge})
CALCULATED SOW TIMELINE: ${weeks} Weeks | BUDGET: ${data.budgetLabel}
STAKEHOLDER SPONSORS: ${data.stakeholdersLabel}

SECTION I: EXECUTIVE SUMMARY
GFF AI recommends deploying a dedicated ${data.engagementPathObj.label} framework inside the single-tenant VPC perimeter for ${data.org} to address strategic bottlenecks in the ${data.industryLabel} sector. Over ${weeks} Weeks, GFF establishes isolated secure pipelines, delivering sovereign capabilities like ${data.selectedOutcomeLabels.join(", ")}.

SECTION II: CHALLENGE STATEMENT
Third-party cloud-hosted AI APIs introduce severe compliance risks and telemetry leaks. The core technical bottleneck to resolve for ${data.org} is "${data.challengeLabel}". Left unmitigated, data fragmentation and cost explosion will slow down operational cycles.

SECTION III: RECOMMENDED GFF PATH
We recommend the ${data.engagementPathObj.label} path (${data.engagementPathObj.badge}) deployed completely isolated on single-tenant architecture within ${data.geographyLabel} with a strict zero data-retention layer.

SECTION IV: PROPOSED WORKSTREAMS
- Workstream A: Hardened Perimeter Setup (Weeks 1 - ${p1}): Configure VPC boundaries and verify zero-retention.
- Workstream B: Pipeline Core Integration (Weeks ${p1 + 1} - ${p1 + p2}): Deploy OmniMesh read-only connectors and metadata layers.
- Workstream C: Agent Orchestration & Tuning (Weeks ${p1 + p2 + 1} - ${p1 + p2 + p3}): Standardize agent configurations and workflow guardrails.
- Workstream D: Telemetry Logging & Handoff (Weeks ${p1 + p2 + p3 + 1} - ${weeks}): Integrate real-time audit ledgers and operator dashboards.

SECTION V: 90-DAY ROADMAP
- Day 1-30: Perimeter Isolation: Connect legacy data silos via OmniMesh read-only boundaries.
- Day 31-60: Agent Workflow Design: Orchestrate multi-agent decision nodes and feedback loops.
- Day 61-90: Go-Live & Certification: Scale the agent fleet and complete sovereign compliance certification.

SECTION VI: SUGGESTED SQUAD
Squad cohort: ${data.engagementPathObj.squad}
- Lead Solutions Architect (VPC & data boundary configuration)
- Systems Engineers (local weight tuning & pipeline performance)
- Security Compliance Auditor (zero-retention validation logging)

SECTION VII: GOVERNANCE APPROACH
GFF enforces a "Zero Trust, Zero Retention" sovereign AI governance framework. Prompt-history is instantly zeroed out post-execution, and telemetry logs are recorded to a read-only audit ledger.

SECTION VIII: SUCCESS MEASURES
- Latency: Sub-150ms dynamic cognitive decision loops.
- IP Safety: Absolute zero external IP leaks or SaaS memory retention logs.
- OpEx Reclamation: 30%+ reclaimed external SaaS token and licensing expenses.
- Telemetry Auditing: 100% logging coverage verified by the secure audit ledger.

SECTION IX: ASSUMPTIONS
- Read-only database access is granted via VPC boundaries within 7 business days.
- Stakeholders listed (${data.stakeholdersLabel}) participate in weekly 15-minute syncs.

SECTION X: RISKS & MITIGATIONS
- Risk: Legacy silo schema complexity. Mitigation: GFF OmniMesh builds semantic indices without altering original sources.
- Risk: Isolated hardware lead-times. Mitigation: Prototype on staging enclaves.

SECTION XI: NEXT STEPS
1. Complete digital sign-off.
2. VPC configurations & discovery call.
3. Mobilize co-innovation squad (${data.engagementPathObj.squad}) in 7 days.
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
                  <span className="text-[8px] font-mono text-[#009DFF] font-bold block mb-3 uppercase tracking-widest">Dossier Index</span>
                  <nav className="space-y-0.5">
                    {[
                      { id: "executive-summary", label: "Executive Summary", icon: "📄" },
                      { id: "challenge-statement", label: "Challenge Statement", icon: "⚠️" },
                      { id: "recommended-gff-path", label: "Recommended GFF Path", icon: "🚀" },
                      { id: "proposed-workstreams", label: "Proposed Workstreams", icon: "🗺️" },
                      { id: "ninety-day-roadmap", label: "90-Day Roadmap", icon: "📅" },
                      { id: "suggested-squad", label: "Suggested Squad", icon: "👥" },
                      { id: "governance-approach", label: "Governance Approach", icon: "⚖️" },
                      { id: "success-measures", label: "Success Measures", icon: "📈" },
                      { id: "assumptions", label: "Assumptions", icon: "📝" },
                      { id: "risks-mitigations", label: "Risks & Mitigations", icon: "🔒" },
                      { id: "next-steps", label: "Next Steps", icon: "🏁" }
                    ].map((sec, idx) => (
                      <button
                        key={sec.id}
                        onClick={() => {
                          setActivePreviewSection(sec.id);
                          const el = document.getElementById(sec.id);
                          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded text-[10px] font-mono transition flex items-center gap-2 ${activePreviewSection === sec.id ? "bg-[#009DFF]/10 text-[#009DFF] font-bold border-l border-[#009DFF]" : "text-white/40 hover:text-white"}`}
                      >
                        <span>{sec.icon}</span>
                        <span>{String(idx + 1).padStart(2, "0")}. {sec.label}</span>
                      </button>
                    ))}
                  </nav>

                  <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
                    <button onClick={handleCopyOutline} className="w-full py-1.5 rounded bg-white/5 text-[#00FF9D] border border-white/10 hover:bg-[#00FF9D]/10 hover:text-[#00FF9D] transition text-[9px] font-mono uppercase font-semibold">
                      {copied ? "✓ Copied" : "Copy Outline"}
                    </button>
                    <button onClick={handlePrint} className="w-full py-1.5 rounded bg-[#009DFF]/10 text-[#009DFF] border border-[#009DFF]/20 hover:bg-[#009DFF]/20 transition text-[9px] font-mono uppercase font-semibold">
                      Print Spec Preview
                    </button>
                    <button onClick={handleSaveDraft} className="w-full py-1.5 rounded bg-white/5 text-white/85 border border-white/10 hover:bg-white/10 transition text-[9px] font-mono uppercase font-semibold">
                      {saved ? "✓ Saved" : "Save SOW Draft"}
                    </button>
                    <button onClick={handleReset} className="w-full py-1 text-center text-white/30 text-[8.5px] font-mono hover:text-[#E4000F] block uppercase mt-1">
                      [ Reset & Restart ]
                    </button>
                  </div>

                  {/* PREMIUM INTEGRATIONS CARD LIST */}
                  <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
                    <span className="text-[7.5px] font-mono text-white/35 font-bold uppercase block tracking-wider">PREMIUM EXPORTS</span>
                    {[
                      { id: "PDF", label: "Export PDF Dossier", color: "hover:border-[#00FF9D]/20 group-hover:text-[#00FF9D]" },
                      { id: "PPTX", label: "Export PPT Briefing", color: "hover:border-[#009DFF]/20 group-hover:text-[#009DFF]" },
                      { id: "DOCX", label: "Generate SOW DOCX", color: "hover:border-[#9D00FF]/20 group-hover:text-[#9D00FF]" }
                    ].map((exp) => (
                      <button 
                        key={exp.id}
                        onClick={() => handleExportClick(exp.id)}
                        className={`w-full text-left p-1.5 rounded border border-white/5 bg-white/[0.01] ${exp.color} transition group`}
                      >
                        <div className="flex justify-between items-center font-mono text-[8.5px]">
                          <span className="font-bold text-white/60 group-hover:text-white">{exp.label}</span>
                          <span className="text-[6px] bg-white/5 text-white/40 px-1 rounded">OFFLINE</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* CENTER COLUMN: FULL SOW PREVIEW (9 columns) */}
              <div className="lg:col-span-9 p-6 lg:p-10 rounded-2xl border border-white/5 bg-[#030306]/85 shadow-2xl relative overflow-hidden print:bg-white print:text-black print:p-0 print:border-none" id="proposal-document-content">
                <div className="hidden print:block text-right text-[8px] font-mono text-black/40 mb-6 border-b border-black/10 pb-1">
                  <span>GFF AI CONFIDENTIAL PORTFOLIO // SOVEREIGN SPECIFICATION ARCHITECTURE</span>
                </div>

                {/* FRONTEND PREVIEW ONLY DISCLAIMER BANNER */}
                <div className="mb-6 p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/[0.03] text-left print:border-black/10 print:bg-black/5">
                  <div className="flex gap-2.5 items-start font-mono text-[9px]">
                    <span className="text-amber-500 mt-0.5">⚠️</span>
                    <div className="space-y-0.5">
                      <span className="text-[8px] font-bold text-amber-500 uppercase tracking-wider block">FRONTEND SPECIFICATION PREVIEW ONLY</span>
                      <p className="text-white/50 print:text-black/80 leading-relaxed font-light font-mono">
                        This document represents a deterministic co-innovation draft outline compiled locally inside your secure offline browser session. It is for visualization and technical planning purposes only and does NOT constitute a final legally binding commercial proposal or master contract agreement.
                      </p>
                    </div>
                  </div>
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
                        GFF AI recommends deploying a dedicated <strong className="text-white print:text-black font-semibold">{pData.engagementPathObj.label}</strong> architecture inside the single-tenant VPC perimeter for <strong className="text-white print:text-black font-semibold">{pData.org}</strong>. Operating inside the <strong className="text-white print:text-black font-semibold">{pData.industryLabel}</strong> vertical, GFF AI will deploy a dedicated single-tenant enclave designed to resolve the primary challenge: <strong className="text-white print:text-black font-semibold">{pData.challengeLabel}</strong>.
                      </p>
                      <p>
                        Over an implementation lifecycle of <strong className="text-white print:text-black font-semibold">{pData.weeks} Weeks</strong>, GFF will establish isolated secure pipelines under the guidance of key stakeholders (<strong className="text-white print:text-black font-semibold">{pData.stakeholdersLabel}</strong>), delivering sovereign capabilities like:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                        {pData.selectedOutcomeLabels.map((outcome, idx) => (
                          <div key={idx} className="p-3 rounded-lg border border-white/5 bg-white/[0.01] print:bg-black/5 print:border-black/10 flex items-center gap-2">
                            <span className="text-[#00FF9D] font-mono text-[10px]">✓</span>
                            <span className="text-[10px] font-mono text-white/80 print:text-black">{outcome}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: CHALLENGE STATEMENT */}
                  <div id="challenge-statement" className="scroll-mt-10 space-y-4">
                    <div className="border-b border-white/5 pb-1 print:border-black/10">
                      <span className="text-[8px] font-mono text-[#009DFF] font-bold uppercase print:text-black/50">SECTION II</span>
                      <h2 className="text-sm font-bold text-white print:text-black flex items-center gap-1.5 font-bold">⚠️ Challenge Statement</h2>
                    </div>
                    <div className="text-xs text-white/70 font-light leading-relaxed space-y-4 print:text-black/85">
                      <p>
                        For a <strong className="text-white print:text-black font-semibold">{pData.companySizeLabel}</strong> operation, legacy or third-party cloud-hosted AI APIs introduce severe compliance risks and telemetry leaks. Private company IP can be used for public third-party model tuning. The primary bottleneck identified in this intake session is:
                      </p>
                      <div className="p-4 rounded-xl border border-red-500/10 bg-red-500/[0.02] print:border-black/10 print:bg-black/5">
                        <div className="flex gap-2 items-start">
                          <span className="text-red-400 mt-0.5">⚠️</span>
                          <div>
                            <h4 className="text-xs font-bold text-red-400 print:text-black uppercase tracking-wider font-mono">PRIORITY FRICTION DETECTED</h4>
                            <p className="text-[11px] text-white/80 print:text-black mt-1 leading-relaxed">
                              "{pData.challengeLabel}" is trapping valuable context inside isolated legacy silos, while exposing telemetry interfaces. This operational latency blocks prompt-chain efficiency and increases licensing costs.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3: RECOMMENDED GFF PATH */}
                  <div id="recommended-gff-path" className="scroll-mt-10 space-y-4">
                    <div className="border-b border-white/5 pb-1 print:border-black/10">
                      <span className="text-[8px] font-mono text-[#009DFF] font-bold uppercase print:text-black/50">SECTION III</span>
                      <h2 className="text-sm font-bold text-white print:text-black flex items-center gap-1.5 font-bold">🚀 Recommended GFF Path</h2>
                    </div>
                    <div className="text-xs text-white/70 font-light leading-relaxed space-y-4 print:text-black/85">
                      <p>
                        GFF AI recommends the <strong className="text-[#00FF9D] font-extrabold">{pData.engagementPathObj.label}</strong> engagement path (Model: <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/5 print:bg-black/5 print:text-black text-white">{pData.engagementPathObj.badge}</span>) to deliver secure, industrialized cognitive capabilities within your environment:
                      </p>
                      
                      <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] print:bg-black/5 print:border-black/10 space-y-3">
                        <div className="flex justify-between items-center text-[8px] font-mono text-white/30 uppercase tracking-widest">
                          <span>SOVEREIGN ACTIVE DEPLOYMENT ARCHITECTURE</span>
                          <span className="text-[#00FF9D] font-bold">VPC PERIMETER STAGED</span>
                        </div>
                        
                        {/* Premium Topology map inline */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-3">
                          <div className="flex-1 w-full p-2.5 rounded border border-white/5 bg-black/40 text-center print:border-black/15">
                            <span className="text-[7.5px] font-mono text-white/40 block mb-0.5">LOCAL INGEST</span>
                            <span className="text-[9px] font-bold text-white uppercase print:text-black">{pData.industryLabel} Context</span>
                          </div>
                          <div className="text-[#009DFF] text-xs font-mono hidden md:block select-none">▶▶</div>
                          <div className="flex-1 w-full p-3 rounded border border-[#009DFF]/30 bg-[#009DFF]/5 text-center shadow-[0_0_10px_rgba(0,157,255,0.05)] print:border-black/15">
                            <span className="text-[7.5px] font-mono text-[#009DFF] block mb-0.5">VPC ENCLAVE</span>
                            <span className="text-[10px] font-black text-white uppercase print:text-black">{pData.engagementPathObj.badge} NODE</span>
                          </div>
                          <div className="text-[#00FF9D] text-xs font-mono hidden md:block select-none">▶▶</div>
                          <div className="flex-1 w-full p-2.5 rounded border border-[#00FF9D]/30 bg-[#00FF9D]/5 text-center shadow-[0_0_10px_rgba(0,255,157,0.05)] print:border-black/15">
                            <span className="text-[7.5px] font-mono text-[#00FF9D] block mb-0.5">COMPLIANCE EDGE</span>
                            <span className="text-[9px] font-bold text-white uppercase print:text-black">ZERO RETENTION</span>
                          </div>
                        </div>
                        <p className="text-[9px] text-white/40 leading-snug font-mono print:text-black/60">
                          Workloads are deployed completely within single-tenant VPC boundaries in <strong>{pData.geographyLabel}</strong>. Memory arrays clear prompt logs instantly.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 4: PROPOSED WORKSTREAMS */}
                  <div id="proposed-workstreams" className="scroll-mt-10 space-y-4">
                    <div className="border-b border-white/5 pb-1 print:border-black/10">
                      <span className="text-[8px] font-mono text-[#009DFF] font-bold uppercase print:text-black/50">SECTION IV</span>
                      <h2 className="text-sm font-bold text-white print:text-black flex items-center gap-1.5 font-bold">🗺️ Proposed Workstreams</h2>
                    </div>
                    <div className="text-xs text-white/70 font-light leading-relaxed space-y-4 print:text-black/85">
                      <p>
                        The technical integration of your sovereign AI nodes is divided into four distinct phases spanning the <strong className="text-white print:text-black font-semibold">{pData.weeks} Weeks</strong> schedule:
                      </p>
                      
                      <div className="relative pl-6 border-l border-white/5 space-y-6 print:border-black/10">
                        <div className="relative text-left">
                          <span className="absolute -left-[29px] top-0.5 w-3.5 h-3.5 rounded-full bg-[#009DFF] border-2 border-black flex items-center justify-center text-[7px] font-bold text-black font-mono">A</span>
                          <h4 className="text-xs font-bold text-white print:text-black font-mono">Phase A: Hardened Perimeter Setup <span className="text-[#009DFF] text-[10px] font-normal ml-2">(Weeks 1 - {pData.p1})</span></h4>
                          <p className="text-[11px] text-white/50 print:text-black/70 mt-1 leading-relaxed font-sans">
                            Configure single-tenant geographic VPC rules inside {pData.geographyLabel}, stand up secure isolated container layers, and test zero-retention logging firewalls.
                          </p>
                        </div>
                        <div className="relative text-left">
                          <span className="absolute -left-[29px] top-0.5 w-3.5 h-3.5 rounded-full bg-[#009DFF] border-2 border-black flex items-center justify-center text-[7px] font-bold text-black font-mono">B</span>
                          <h4 className="text-xs font-bold text-white print:text-black font-mono">Phase B: Pipeline Core Integration <span className="text-[#009DFF] text-[10px] font-normal ml-2">(Weeks {pData.p1 + 1} - {pData.p1 + pData.p2})</span></h4>
                          <p className="text-[11px] text-white/50 print:text-black/70 mt-1 leading-relaxed font-sans font-light">
                            Establish OmniMesh read-only adapters connecting unindexed silos, map structured database schemas to semantic search index structures, and configure context vectors.
                          </p>
                        </div>
                        <div className="relative text-left">
                          <span className="absolute -left-[29px] top-0.5 w-3.5 h-3.5 rounded-full bg-[#009DFF] border-2 border-black flex items-center justify-center text-[7px] font-bold text-black font-mono">C</span>
                          <h4 className="text-xs font-bold text-white print:text-black font-mono">Phase C: Agent Orchestration & Tuning <span className="text-[#009DFF] text-[10px] font-normal ml-2">(Weeks {pData.p1 + pData.p2 + 1} - {pData.p1 + pData.p2 + pData.p3})</span></h4>
                          <p className="text-[11px] text-white/50 print:text-black/70 mt-1 leading-relaxed font-sans font-light">
                            Configure local agent node consensus workflows, program target priority outcome loops, fine-tune model parameters on domain schemas, and apply strict safety watchdogs.
                          </p>
                        </div>
                        <div className="relative text-left">
                          <span className="absolute -left-[29px] top-0.5 w-3.5 h-3.5 rounded-full bg-[#00FF9D] border-2 border-black flex items-center justify-center text-[7px] font-bold text-black font-mono">D</span>
                          <h4 className="text-xs font-bold text-white print:text-black font-mono">Phase D: Telemetry Logging & Handoff <span className="text-[#00FF9D] text-[10px] font-normal ml-2">(Weeks {pData.p1 + pData.p2 + pData.p3 + 1} - {pData.weeks})</span></h4>
                          <p className="text-[11px] text-white/50 print:text-black/70 mt-1 leading-relaxed font-sans font-light">
                            Integrate the real-time compliance audit ledger system, customize user control-center dashboards, conduct team compliance training, and finalize administrative handoff.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 5: 90-DAY ROADMAP */}
                  <div id="ninety-day-roadmap" className="scroll-mt-10 space-y-4">
                    <div className="border-b border-white/5 pb-1 print:border-black/10">
                      <span className="text-[8px] font-mono text-[#009DFF] font-bold uppercase print:text-black/50">SECTION V</span>
                      <h2 className="text-sm font-bold text-white print:text-black flex items-center gap-1.5 font-bold">📅 90-Day Roadmap</h2>
                    </div>
                    <div className="text-xs text-white/70 font-light leading-relaxed space-y-4 print:text-black/85">
                      <p>GFF coordinates all physical deployments within a tactical 90-Day Integration Roadmap framework. This ensures quick wins and step-by-step security audits:</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.005] print:border-black/10 print:bg-black/5 relative overflow-hidden text-left">
                          <div className="text-[10px] font-mono text-[#009DFF] font-black mb-1 uppercase tracking-wide">DAY 01 - 30</div>
                          <h4 className="text-xs font-bold text-white print:text-black mb-1">Isolation & Foundation</h4>
                          <p className="text-[10px] text-white/50 print:text-black/70 leading-relaxed font-light mt-1">Configure VPC boundaries, install OmniMesh data pipelines, and test first in-memory token execution pipelines with zero log leaks.</p>
                        </div>
                        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.005] print:border-black/10 print:bg-black/5 relative overflow-hidden text-left">
                          <div className="text-[10px] font-mono text-[#009DFF] font-black mb-1 uppercase tracking-wide">DAY 31 - 60</div>
                          <h4 className="text-xs font-bold text-white print:text-black mb-1">Agent Fleet Assembly</h4>
                          <p className="text-[10px] text-white/50 print:text-black/70 leading-relaxed font-light mt-1">Orchestrate agent fleets inside the secure sandbox, wire prompt chains to outcomes, and establish user authorization dashboard interfaces.</p>
                        </div>
                        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.005] print:border-black/10 print:bg-black/5 relative overflow-hidden text-left">
                          <div className="text-[10px] font-mono text-[#00FF9D] font-black mb-1 uppercase tracking-wide">DAY 61 - 90</div>
                          <h4 className="text-xs font-bold text-white print:text-black mb-1">Federated Go-Live</h4>
                          <p className="text-[10px] text-white/50 print:text-black/70 leading-relaxed font-light mt-1">Run stress-testing of loops, perform end-to-end telemetry audits, and handover local administrative control keys to client operators.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 6: SUGGESTED SQUAD */}
                  <div id="suggested-squad" className="scroll-mt-10 space-y-4">
                    <div className="border-b border-white/5 pb-1 print:border-black/10">
                      <span className="text-[8px] font-mono text-[#009DFF] font-bold uppercase print:text-black/50">SECTION VI</span>
                      <h2 className="text-sm font-bold text-white print:text-black flex items-center gap-1.5 font-bold">👥 Suggested Squad</h2>
                    </div>
                    <div className="text-xs text-white/70 font-light leading-relaxed space-y-4 print:text-black/85">
                      <p>Based on your path, we propose allocating co-innovation cohort <strong className="text-white print:text-black font-semibold font-mono text-[10px]">{pData.engagementPathObj.squad}</strong>:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                        <div className="p-3 rounded border border-white/5 bg-white/[0.01]">
                          <span className="text-[7.5px] font-mono text-white/30 uppercase block">01 / ARCHITECT</span>
                          <p className="text-[9.5px] text-white/40 leading-snug mt-1 font-light">Designs VPC peering, geography boundaries, and single-tenant clusters.</p>
                        </div>
                        <div className="p-3 rounded border border-white/5 bg-white/[0.01]">
                          <span className="text-[7.5px] font-mono text-white/30 uppercase block">02 / ENGINEER</span>
                          <p className="text-[9.5px] text-white/40 leading-snug mt-1 font-light">Programs read-only OmniMesh data adapters, model local tuning, and loop optimizations.</p>
                        </div>
                        <div className="p-3 rounded border border-white/5 bg-white/[0.01]">
                          <span className="text-[7.5px] font-mono text-white/30 uppercase block">03 / AUDITOR</span>
                          <p className="text-[9.5px] text-white/40 leading-snug mt-1 font-light">Vulnerability audits and continuous zero persistent retention verification.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 7: GOVERNANCE APPROACH */}
                  <div id="governance-approach" className="scroll-mt-10 space-y-4">
                    <div className="border-b border-white/5 pb-1 print:border-black/10">
                      <span className="text-[8px] font-mono text-[#009DFF] font-bold uppercase print:text-black/50">SECTION VII</span>
                      <h2 className="text-sm font-bold text-white print:text-black flex items-center gap-1.5 font-bold font-sans">⚖️ Governance Approach</h2>
                    </div>
                    <div className="text-xs text-white/70 font-light leading-relaxed space-y-4 print:text-black/85 text-left font-sans">
                      <p>
                        Sovereign AI deployments mandate strict, zero-trust governance protocols to eliminate data leakage. GFF enforces safety policies directly at the runtime layer:
                      </p>
                      
                      <div className="p-4 rounded-xl border border-white/5 bg-[#030305] print:border-black/10 print:bg-black/5 font-mono text-[9px] space-y-2.5">
                        <div className="flex justify-between items-center text-[7px] text-white/30 uppercase tracking-widest">
                          <span>GOVERNANCE PROTOCOL CHECKS</span>
                          <span className="text-[#00FF9D]">ENFORCED AT RUNTIME</span>
                        </div>
                        <ul className="space-y-1.5 text-white/60 print:text-black/80 font-light font-mono leading-relaxed">
                          <li className="flex items-start gap-2">
                            <span className="text-[#00FF9D]">»</span>
                            <span><strong>Boundary Isolation:</strong> No prompts or weight matrices leave the single-tenant VPC environment. All model inferences are computed locally.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#00FF9D]">»</span>
                            <span><strong>Memory Scrubbing:</strong> In-memory buffers are hard-flushed instantly after query completion to maintain absolute zero data retention.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#00FF9D]">»</span>
                            <span><strong>Immutable Audit Logs:</strong> Live user transactions generate trace receipts written to a secure read-only compliance ledger.</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 8: SUCCESS MEASURES */}
                  <div id="success-measures" className="scroll-mt-10 space-y-4">
                    <div className="border-b border-white/5 pb-1 print:border-black/10">
                      <span className="text-[8px] font-mono text-[#009DFF] font-bold uppercase print:text-black/50">SECTION VIII</span>
                      <h2 className="text-sm font-bold text-white print:text-black flex items-center gap-1.5 font-bold font-sans">📈 Success Measures</h2>
                    </div>
                    <div className="text-xs text-white/70 font-light leading-relaxed space-y-3 print:text-black/85 text-left font-sans">
                      <p>Operational performance metrics and compliance SLAs are tracked in real-time inside the control center:</p>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
                        <div className="p-3 rounded border border-white/5 bg-white/[0.005] print:border-black/10">
                          <span className="text-xs font-bold text-[#00FF9D] block print:text-black">&gt; 99.9%</span>
                          <span className="text-[7px] text-white/35 uppercase mt-1 block">Task Efficacy</span>
                        </div>
                        <div className="p-3 rounded border border-white/5 bg-white/[0.005] print:border-black/10">
                          <span className="text-xs font-bold text-[#009DFF] block print:text-black">&lt; 150ms</span>
                          <span className="text-[7px] text-white/35 uppercase mt-1 block">Decision Latency</span>
                        </div>
                        <div className="p-3 rounded border border-white/5 bg-white/[0.005] print:border-black/10">
                          <span className="text-xs font-bold text-[#9D00FF] block print:text-black">0 Trace</span>
                          <span className="text-[7px] text-white/35 uppercase mt-1 block">Retention</span>
                        </div>
                        <div className="p-3 rounded border border-white/5 bg-white/[0.005] print:border-black/10">
                          <span className="text-xs font-bold text-[#E5A93C] block print:text-black">30%+ Saved</span>
                          <span className="text-[7px] text-white/35 uppercase mt-1 block">API OpEx Saved</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* SECTION 9: ASSUMPTIONS */}
                  <div id="assumptions" className="scroll-mt-10 space-y-4">
                    <div className="border-b border-white/5 pb-1 print:border-black/10">
                      <span className="text-[8px] font-mono text-[#009DFF] font-bold uppercase print:text-black/50">SECTION IX</span>
                      <h2 className="text-sm font-bold text-white print:text-black flex items-center gap-1.5 font-bold font-sans">📝 Assumptions</h2>
                    </div>
                    <div className="text-xs text-white/70 font-light leading-relaxed space-y-3 print:text-black/85 text-left font-sans">
                      <p>To guarantee target timeline delivery within the calculated <strong className="text-white print:text-black font-semibold">{pData.weeks} Weeks</strong> window, we assume:</p>
                      <ul className="space-y-1 list-disc pl-4 text-white/60 print:text-black/80 font-light">
                        <li>Read-only VPC network interfaces to unindexed legacy database silos are provisioned within 7 business days.</li>
                        <li>Key stakeholder sponsors listed (specifically: <strong className="text-white print:text-black font-semibold">{pData.stakeholdersLabel}</strong>) participate in weekly alignment syncs.</li>
                        <li>Isolated staging clusters are pre-cleared for local sandbox simulation.</li>
                      </ul>
                    </div>
                  </div>

                  {/* SECTION 10: RISKS & MITIGATIONS */}
                  <div id="risks-mitigations" className="scroll-mt-10 space-y-4">
                    <div className="border-b border-white/5 pb-1 print:border-black/10">
                      <span className="text-[8px] font-mono text-[#009DFF] font-bold uppercase print:text-black/50">SECTION X</span>
                      <h2 className="text-sm font-bold text-white print:text-black flex items-center gap-1.5 font-bold font-sans font-bold">🔒 Risks & Mitigations</h2>
                    </div>
                    <div className="text-xs text-white/70 font-light leading-relaxed space-y-4 print:text-black/85">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                        <div className="p-3 rounded border border-white/5 bg-white/[0.005] print:border-black/10 space-y-1">
                          <h4 className="text-xs font-bold text-white print:text-black font-mono flex items-center gap-1">⚡ Schema Fragmentation</h4>
                          <p className="text-[10px] text-white/50 print:text-black/70">Legacy silos inside {pData.org} might contain poorly indexed database schemas, causing query lookup delays.</p>
                          <div className="pt-1.5 border-t border-white/5 text-[9.5px] text-[#00FF9D] font-mono">Mitigation: GFF OmniMesh automatically creates a read-only local semantic layer without altering physical tables.</div>
                        </div>
                        <div className="p-3 rounded border border-white/5 bg-white/[0.005] print:border-black/10 space-y-1">
                          <h4 className="text-xs font-bold text-white print:text-black font-mono flex items-center gap-1">⚡ Provisioning Bottlenecks</h4>
                          <p className="text-[10px] text-white/50 print:text-black/70">Lead times for single-tenant cloud instance clearance might delay core systems setup.</p>
                          <div className="pt-1.5 border-t border-white/5 text-[9.5px] text-[#00FF9D] font-mono">Mitigation: GFF runs lightweight containerized prototypes on isolated local staging nodes immediately.</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 11: NEXT STEPS */}
                  <div id="next-steps" className="scroll-mt-10 space-y-4">
                    <div className="border-b border-white/5 pb-1 print:border-black/10">
                      <span className="text-[8px] font-mono text-[#00FF9D] font-bold uppercase print:text-black/50">SECTION XI</span>
                      <h2 className="text-sm font-bold text-white print:text-black flex items-center gap-1.5 font-bold font-sans">🏁 Next Steps</h2>
                    </div>
                    <div className="text-xs text-white/70 font-light leading-relaxed space-y-4 print:text-black/85">
                      <p className="text-left font-sans font-light">To begin the co-innovation deployment of GFF AI within your single-tenant infrastructure, we propose:</p>
                      <ol className="space-y-2 font-mono text-[9.5px] text-white/60 print:text-black/80 list-decimal pl-4 text-left">
                        <li><strong>Complete SOW Sign-off:</strong> Apply your secure signature stamp using the executive authorization panel below.</li>
                        <li><strong>Boundary Discovery Session:</strong> Conduct a 1-hour secure VPC routing and credential clearance call with our Lead Architect.</li>
                        <li><strong>Squad Mobilization:</strong> Finalize resource provisioning of suggested squad cohort (<strong className="text-white print:text-black font-semibold">{pData.engagementPathObj.squad}</strong>) in 7 days.</li>
                      </ol>
                    </div>
                  </div>
                  {/* EXECUTIVE SOW AUTHORIZATION */}
                  <div id="sign-off-block" className="scroll-mt-10 space-y-4">
                    <div className="border-b border-white/5 pb-1 print:border-black/10">
                      <span className="text-[8px] font-mono text-[#00FF9D] font-bold uppercase print:text-black/50 font-bold">AUTHORIZATION</span>
                      <h2 className="text-sm font-bold text-[#00FF9D] print:text-black flex items-center gap-1.5 font-bold">✍️ SOW Stamp Sign-Off</h2>
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
        {/* PREMIUM TOAST NOTIFICATION FOR OFFLINE EXPORT ATTEMPTS */}
        <AnimatePresence>
          {exportToast && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.95 }}
              className="fixed bottom-6 right-6 z-50 max-w-sm p-4 rounded-xl border border-[#009DFF]/30 bg-black/95 backdrop-blur-xl shadow-2xl text-left font-mono"
            >
              <div className="flex items-start gap-2.5">
                <span className="text-[#009DFF] text-xs">ℹ️</span>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-[#009DFF] uppercase tracking-wider block">ENTERPRISE GATEWAY MESSAGE</span>
                  <p className="text-[9.5px] text-white/80 leading-relaxed">{exportToast}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </AnimatePresence>

    </ToolPageShell>
  );
}
