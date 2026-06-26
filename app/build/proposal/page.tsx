"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ToolPageShell, ToolHero } from "@/components/build/components";
import { Industry, CompanySize, DataReadiness, Priority, ProposalInputs } from "@/components/build/types";

// Metadata definitions
const INDUSTRIES: { id: Industry; label: string; icon: string; desc: string }[] = [
  { id: "banking", label: "Banking & Finance", icon: "🏦", desc: "Ledgers, compliance, AML auditing." },
  { id: "insurance", label: "Insurance", icon: "🛡️", desc: "Claims automation, risk validation." },
  { id: "healthcare", label: "Healthcare", icon: "🏥", desc: "HIPAA pipelines, EMR context search." },
  { id: "telecom", label: "Telecom", icon: "📡", desc: "Telemetry monitoring, SLA watchdogs." },
  { id: "public-sector", label: "Public Sector", icon: "🏛️", desc: "Sovereign admin, secure vaults." }
];

const COMPANY_SIZES: { id: CompanySize; label: string; desc: string }[] = [
  { id: "small", label: "Sandbox Incubator", desc: "Focused trials, fast cycles." },
  { id: "medium", label: "Mid-Market Growth", desc: "Regional networks." },
  { id: "enterprise", label: "Enterprise Scale", desc: "Global multi-region compliance." },
  { id: "global-conglomerate", label: "Global Conglomerate", desc: "Air-gapped security boundaries." }
];

const DATA_READINESS: { id: DataReadiness; label: string; level: string; desc: string }[] = [
  { id: "raw", label: "Raw Silos", level: "Low", desc: "Unstructured databases." },
  { id: "structured", label: "Relational Schemas", level: "Medium", desc: "Normalized SQL tables." },
  { id: "hybrid", label: "Federated Layers", level: "Moderate", desc: "Basic indexing layers." },
  { id: "vectorized", label: "Semantic Caches", level: "High", desc: "Vector indexes." },
  { id: "fully-governed", label: "Sovereign Vault", level: "Enterprise", desc: "Air-gapped policy-enforced." }
];

const PRIORITIES: { id: Priority; label: string; desc: string; icon: string; color: string }[] = [
  { id: "cost_reduction", label: "Cost Elimination", desc: "SaaS reduction.", icon: "📉", color: "#E4000F" },
  { id: "compliance_security", label: "Sovereign Security", desc: "VPC enclaves.", icon: "🔒", color: "#9D00FF" },
  { id: "operational_speed", label: "Latency Compression", desc: "Sub-second cycles.", icon: "⚡", color: "#00FF9D" },
  { id: "customer_experience", label: "Cognitive Operations", desc: "Customer fleets.", icon: "🤝", color: "#009DFF" },
  { id: "decision_automation", label: "Consensus Orchestration", desc: "Remove manual loops.", icon: "🧠", color: "#E5A93C" }
];

const INITIAL_INPUTS: ProposalInputs = {
  companyName: "",
  industry: "banking",
  companySize: "enterprise",
  dataReadiness: "hybrid",
  priorities: ["compliance_security"],
  budgetRange: "tier-2"
};

export default function ProposalBuilderPage() {
  const [inputs, setInputs] = useState<ProposalInputs>(INITIAL_INPUTS);
  const [step, setStep] = useState<"configure" | "compiling" | "preview">("configure");
  const [activeStepGate, setActiveStepGate] = useState<1 | 2>(1);
  const [compilingStepIndex, setCompilingStepIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [hasSavedDraft, setHasSavedDraft] = useState(false);
  const [activePreviewSection, setActivePreviewSection] = useState<string>("executive-summary");
  const [signName, setSignName] = useState("");
  const [isSigned, setIsSigned] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const draft = localStorage.getItem("gff_proposal_draft");
      if (draft) setHasSavedDraft(true);
    }
  }, []);

  const compilingMessages = [
    "Establishing secure local compiler enclave...",
    "Analyzing industry taxonomy and guidelines...",
    "Querying OmniMesh reference catalog...",
    "Structuring custom 90-Day timeline...",
    "Calculating GFF Squad allocation...",
    "Enforcing strict zero-retention policies...",
    "Synthesizing Strategic SOW Dossier..."
  ];

  const handleCompile = () => {
    if (!inputs.companyName.trim()) {
      alert("Please enter your organization name.");
      return;
    }
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
    }, 400);
    return () => clearInterval(interval);
  }, [step]);

  const handleSaveDraft = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("gff_proposal_draft", JSON.stringify(inputs));
      setSaved(true);
      setHasSavedDraft(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleRestoreDraft = () => {
    if (typeof window !== "undefined") {
      const draft = localStorage.getItem("gff_proposal_draft");
      if (draft) {
        setInputs(JSON.parse(draft));
        setHasSavedDraft(false);
      }
    }
  };

  const handleReset = () => {
    setInputs(INITIAL_INPUTS);
    setStep("configure");
    setActiveStepGate(1);
    setIsSigned(false);
    setSignName("");
    if (typeof window !== "undefined") {
      localStorage.removeItem("gff_proposal_draft");
      setHasSavedDraft(false);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  const getSelectedPrioritiesLabels = () => {
    return inputs.priorities
      .map((p) => PRIORITIES.find((item) => item.id === p)?.label || p)
      .join(", ");
  };

  const generateProposalData = () => {
    const org = inputs.companyName.trim() || "Enterprise Client";
    const indObj = INDUSTRIES.find((i) => i.id === inputs.industry) || INDUSTRIES[0];
    const sizeObj = COMPANY_SIZES.find((s) => s.id === inputs.companySize) || COMPANY_SIZES[2];
    const readObj = DATA_READINESS.find((d) => d.id === inputs.dataReadiness) || DATA_READINESS[2];

    let baseWeeks = 12;
    if (sizeObj.id === "small") baseWeeks = 6;
    else if (sizeObj.id === "medium") baseWeeks = 8;
    else if (sizeObj.id === "global-conglomerate") baseWeeks = 16;

    if (readObj.id === "raw") baseWeeks += 3;
    else if (readObj.id === "vectorized") baseWeeks -= 2;
    else if (readObj.id === "fully-governed") baseWeeks -= 3;

    const totalWeeks = Math.max(4, baseWeeks);
    const p1 = Math.max(1, Math.round(totalWeeks * 0.15));
    const p2 = Math.max(1, Math.round(totalWeeks * 0.25));
    const p3 = Math.max(1, Math.round(totalWeeks * 0.40));
    const p4 = totalWeeks - (p1 + p2 + p3);

    let licenseCost = "$45,000 / Year";
    if (sizeObj.id === "global-conglomerate") licenseCost = "$120,000 / Year (Sovereign Core)";
    else if (sizeObj.id === "small") licenseCost = "$15,000 / Year (Sandbox Dev)";
    else if (sizeObj.id === "medium") licenseCost = "$30,000 / Year (Foundry Standard)";

    const squadSize = sizeObj.id === "small" ? 2 : sizeObj.id === "medium" ? 3 : sizeObj.id === "enterprise" ? 4 : 5;

    return { org, industry: indObj.label, industryId: indObj.id, industryDesc: indObj.desc, companyScale: sizeObj.label, dataReadiness: readObj.label, dataReadinessId: readObj.id, totalWeeks, p1, p2, p3, p4, licenseCost, squadSize };
  };

  const pData = generateProposalData();

  const rawOutlineText = `
GFF AI PROPOSAL SPECIFICATION OUTLINE
Organization: ${pData.org}
Industry: ${pData.industry}
Scale: ${pData.companyScale}
Horizon Target: ${pData.totalWeeks} Weeks
License Plan: ${pData.licenseCost}

I. EXECUTIVE SUMMARY: Deploy single-tenant VPC sovereign GFF nodes inside local bounds.
II. CHALLENGE STATEMENT: Solve latency manual workflows and third-party data liabilities.
III. RECOMMENDED GFF PATH: Deploy GFF Agent enclaves (Policy Watchdog, AS-09 Auditor, OmniMesh Connectors).
IV. PROPOSED WORKSTREAMS: Setup (1-${pData.p1} Wks), Ingest (${pData.p1+1}-${pData.p1+pData.p2} Wks), Orchestrate (${pData.p1+pData.p2+1}-${pData.p1+pData.p2+pData.p3} Wks), Governance (${pData.p1+pData.p2+pData.p3+1}-${pData.totalWeeks} Wks).
V. 90-DAY ROADMAP: Day 1-30 Setup, Day 31-60 Peering, Day 61-90 Production Launch.
VI. SUGGESTED SQUAD: Dedicated strike team of ${pData.squadSize} experts.
VII. GOVERNANCE APPROACH: In-Memory zero disk storage, supervisor oversight.
VIII. SUCCESS MEASURES: >99.9% Success, <150ms execution latency, zero data leaks.
IX. ASSUMPTIONS: Cloud VPC credentials and relational local API access routes.
X. RISKS: Legacy database lags (mitigated via local vector caches).
XI. NEXT STEPS: Run technical workshops, boot sandboxes, mutually sign SOW tokens.
  `.trim();

  const handleCopyOutline = () => {
    navigator.clipboard.writeText(rawOutlineText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleScrollToSection = (id: string) => {
    setActivePreviewSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };


  return (
    <ToolPageShell showContact={true}>
      <ToolHero
        category="COMMERCIAL STUDIO"
        title="Autonomous SOW & Proposal Architect"
        highlightedWord="Proposal"
        description="Compile dynamic, enterprise-grade Statements of Work and strategic roadmap outlines derived from your infrastructure and regulatory parameters."
        metricLabel="ESTIMATION CONFIDENCE"
        metricValue="98.7% DETERMINISTIC"
      />
      {/* Floating Toolbar Preview Actions */}
      {step === "preview" && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl bg-[#030305]/95 border border-white/10 p-3 rounded-2xl backdrop-blur-md shadow-2xl flex flex-wrap items-center justify-between gap-3 px-6 animate-fadeIn print:hidden">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00FF9D] animate-pulse" />
            <span className="text-[10px] font-mono text-white/50 hidden sm:inline">
              PROPOSAL FOR: <span className="text-white font-bold">{pData.org.toUpperCase()}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleCopyOutline} className="px-3 py-1.5 rounded-lg border border-white/10 text-[10px] font-mono text-white hover:bg-white/5 transition flex items-center gap-1">
              {copied ? "✓ COPIED" : "📋 COPY OUTLINE"}
            </button>
            <button onClick={handlePrint} className="px-3 py-1.5 rounded-lg border border-white/10 text-[10px] font-mono text-white hover:bg-white/5 transition flex items-center gap-1">
              🖨️ PRINT
            </button>
            <button onClick={handleSaveDraft} className="px-3 py-1.5 rounded-lg border border-[#009DFF]/20 text-[10px] font-mono text-white bg-[#009DFF]/5 hover:bg-[#009DFF]/10 transition">
              {saved ? "✓ SAVED" : "💾 SAVE DRAFT"}
            </button>
            <button onClick={handleReset} className="px-3 py-1.5 rounded-lg border border-[#E4000F]/20 text-[10px] font-mono text-[#E4000F] hover:bg-[#E4000F]/5 transition">
              RESET
            </button>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === "configure" && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* CONFIGURATION SIDEBAR PLACEHOLDER */}
            <div className="lg:col-span-4 space-y-6" id="config-sidebar-container">
              {hasSavedDraft && (
                <div className="p-4 rounded-xl border border-[#009DFF]/20 bg-[#009DFF]/5 text-xs flex justify-between items-center gap-3">
                  <div className="flex gap-2 text-white/80">
                    <span>ℹ</span>
                    <p>Saved draft inputs detected.</p>
                  </div>
                  <button onClick={handleRestoreDraft} className="px-2.5 py-1 rounded bg-[#009DFF] text-black font-semibold text-[10px] hover:bg-[#009DFF]/90 uppercase">Restore</button>
                </div>
              )}

              <div className="p-5 rounded-2xl border border-white/5 bg-[#030306]/95">
                <span className="text-[9px] font-mono text-[#009DFF] font-bold tracking-widest block mb-4">WIZARD STEPS</span>
                <div className="space-y-4">
                  <button onClick={() => setActiveStepGate(1)} className={`w-full text-left p-3 rounded-xl border transition flex items-center gap-3 ${activeStepGate === 1 ? "border-[#009DFF]/35 bg-[#009DFF]/5" : "border-white/5 bg-transparent hover:border-white/10"}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${activeStepGate === 1 ? "bg-[#009DFF] text-black" : "bg-white/10"}`}>1</div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Firmographics</h4>
                      <p className="text-[10px] text-white/40 font-light mt-0.5">Corporate metadata.</p>
                    </div>
                  </button>
                  <button onClick={() => { if (!inputs.companyName.trim()) { alert("Enter company name first."); return; } setActiveStepGate(2); }} className={`w-full text-left p-3 rounded-xl border transition flex items-center gap-3 ${activeStepGate === 2 ? "border-[#009DFF]/35 bg-[#009DFF]/5" : "border-white/5 bg-transparent hover:border-white/10"}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${activeStepGate === 2 ? "bg-[#009DFF] text-black" : "bg-white/10"}`}>2</div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Technical Parameters</h4>
                      <p className="text-[10px] text-white/40 font-light mt-0.5">Priorities & Ingestion.</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Telemetry Log */}
              <div className="p-5 rounded-2xl border border-white/5 bg-[#030305]/95 text-xs">
                <span className="text-[9px] font-mono text-[#00FF9D] font-bold block border-b border-white/5 pb-2 mb-3">BUFFER TELEMETRY</span>
                <div className="space-y-2 font-mono text-[10px]">
                  <div className="flex justify-between py-1 border-b border-white/[0.02]">
                    <span className="text-white/40">ORGANIZATION:</span>
                    <span className="font-bold text-white max-w-[150px] truncate">{inputs.companyName || "AWAITING_INPUT"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/[0.02]">
                    <span className="text-white/40">INDUSTRY_ID:</span>
                    <span className="font-bold text-white">{inputs.industry.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/[0.02]">
                    <span className="text-white/40">SCALE:</span>
                    <span className="font-bold text-white">{inputs.companySize.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/[0.02]">
                    <span className="text-white/40">DATA_MATURITY:</span>
                    <span className="font-bold text-white">{inputs.dataReadiness.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-white/40">PRIORITY:</span>
                    <span className="font-bold text-[#00FF9D] truncate max-w-[130px]">{inputs.priorities.join(", ").toUpperCase() || "NONE"}</span>
                  </div>
                </div>
              </div>
            </div>


            {/* CONFIGURATION MAIN FORM PLACEHOLDER */}
            <div className="lg:col-span-8 p-6 lg:p-8 rounded-2xl border border-white/5 bg-[#030306]/90 min-h-[480px] flex flex-col justify-between" id="config-form-container">
              {activeStepGate === 1 ? (
                <div id="gate-1-fields" className="space-y-6">
                  <div className="border-b border-white/5 pb-4">
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#009DFF]/10 text-[#009DFF] border border-[#009DFF]/20 uppercase tracking-wider font-bold">GATE 1 OF 2</span>
                    <h2 className="text-xl font-extrabold tracking-tight mt-2 text-white">Establish Organization Context</h2>
                    <p className="text-white/50 text-xs mt-1 font-light">Input baseline coordinates to compile specific regulatory and compliance parameters.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-white/55 uppercase block">Organization / Company Name</label>
                    <input
                      type="text"
                      value={inputs.companyName}
                      onChange={(e) => setInputs({ ...inputs, companyName: e.target.value })}
                      placeholder="e.g. Acme Sovereign Holdings"
                      className="w-full h-11 px-4 rounded-lg bg-black border border-white/10 text-xs text-white placeholder-white/20 focus:border-[#009DFF] focus:outline-none transition"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-white/55 uppercase block">Target Operating Sector</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[160px] overflow-y-auto pr-1.5 custom-scrollbar text-left">
                      {INDUSTRIES.map((ind) => (
                        <button
                          key={ind.id}
                          type="button"
                          onClick={() => setInputs({ ...inputs, industry: ind.id })}
                          className={`p-3 rounded-lg border text-left transition flex flex-col justify-between ${inputs.industry === ind.id ? "border-[#009DFF]/50 bg-[#009DFF]/5" : "border-white/5 bg-black/50 hover:border-white/10"}`}
                        >
                          <span className="text-sm">{ind.icon}</span>
                          <div>
                            <h4 className="text-[11px] font-bold text-white mt-1 leading-none">{ind.label}</h4>
                            <p className="text-[8px] text-white/30 leading-none mt-1">{ind.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-white/55 uppercase block">Footprint & Scale</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {COMPANY_SIZES.map((size) => (
                        <button
                          key={size.id}
                          type="button"
                          onClick={() => setInputs({ ...inputs, companySize: size.id })}
                          className={`p-3 rounded-lg border text-left transition flex flex-col justify-between min-h-[90px] ${inputs.companySize === size.id ? "border-[#009DFF]/50 bg-[#009DFF]/5" : "border-white/5 bg-black/50 hover:border-white/10"}`}
                        >
                          <h4 className="text-[11px] font-bold text-white leading-tight">{size.label}</h4>
                          <p className="text-[8px] text-white/40 mt-1.5 leading-snug">{size.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

              ) : (
                <div id="gate-2-fields" className="space-y-6">
                  <div className="border-b border-white/5 pb-4">
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#009DFF]/10 text-[#009DFF] border border-[#009DFF]/20 uppercase tracking-wider font-bold">GATE 2 OF 2</span>
                    <h2 className="text-xl font-extrabold tracking-tight mt-2 text-white">Configure Ingestion & Priorities</h2>
                    <p className="text-white/50 text-xs mt-1">Isolate specific technical targets and security bounds.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-white/55 uppercase block">Existing Data Ingestion Level</label>
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
                      {DATA_READINESS.map((read) => (
                        <button
                          key={read.id}
                          type="button"
                          onClick={() => setInputs({ ...inputs, dataReadiness: read.id })}
                          className={`p-3 rounded-lg border text-left transition flex flex-col justify-between min-h-[95px] ${inputs.dataReadiness === read.id ? "border-[#009DFF]/50 bg-[#009DFF]/5" : "border-white/5 bg-black/50 hover:border-white/10"}`}
                        >
                          <div>
                            <span className="text-[7px] font-mono text-[#00FF9D]/85 uppercase font-bold block leading-none mb-1">{read.level}</span>
                            <h4 className="text-[10px] font-bold text-white leading-tight">{read.label}</h4>
                          </div>
                          <p className="text-[8px] text-white/40 leading-snug mt-1.5">{read.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-white/55 uppercase block">Focus Strategic Priorities (Select up to 3)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
                      {PRIORITIES.map((prio) => {
                        const isSelected = inputs.priorities.includes(prio.id);
                        return (
                          <button
                            key={prio.id}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                if (inputs.priorities.length > 1) {
                                  setInputs({ ...inputs, priorities: inputs.priorities.filter((p) => p !== prio.id) });
                                }
                              } else {
                                if (inputs.priorities.length < 3) {
                                  setInputs({ ...inputs, priorities: [...inputs.priorities, prio.id] });
                                } else {
                                  alert("Priority configurations: select up to 3 focus areas.");
                                }
                              }
                            }}
                            className="p-3 rounded-lg border text-left transition flex flex-col justify-between min-h-[95px]"
                            style={{ borderColor: isSelected ? prio.color : "rgba(255,255,255,0.05)", backgroundColor: isSelected ? `${prio.color}08` : "transparent" }}
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-xs">{prio.icon}</span>
                              {isSelected && <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: prio.color }} />}
                            </div>
                            <div>
                              <h4 className="text-[10px] font-bold text-white leading-tight mt-1">{prio.label}</h4>
                              <p className="text-[8px] text-white/35 leading-tight mt-1">{prio.desc}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-white/55 uppercase block">Target Capital Allocation Range</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {BUDGET_RANGES.map((b) => (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => setInputs({ ...inputs, budgetRange: b.id })}
                          className={`p-3 rounded-lg border text-left transition ${inputs.budgetRange === b.id ? "border-[#009DFF]/50 bg-[#009DFF]/5" : "border-white/5 bg-black/50 hover:border-white/10"}`}
                        >
                          <h4 className="text-[11px] font-bold text-white leading-tight">{b.label}</h4>
                          <p className="text-[9px] text-white/40 mt-1 leading-none">{b.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

              )}

              <div className="border-t border-white/5 pt-6 mt-8 flex justify-between items-center">
                <button type="button" onClick={() => setActiveStepGate(1)} disabled={activeStepGate === 1} className={`px-4 h-9 rounded-lg border text-xs font-semibold uppercase flex items-center gap-1 transition ${activeStepGate === 1 ? "border-white/5 text-white/10" : "border-white/10 text-white hover:bg-white/5"}`}>Back</button>
                {activeStepGate === 1 ? (
                  <button type="button" onClick={() => { if (!inputs.companyName.trim()) { alert("Please provide your Organization Name."); return; } setActiveStepGate(2); }} className="px-5 h-9 rounded-lg text-xs font-bold uppercase bg-[#009DFF] text-black hover:bg-[#009DFF]/90 font-mono shadow-[0_0_15px_rgba(0,157,255,0.25)]">Next Gate</button>
                ) : (
                  <button type="button" onClick={handleCompile} className="px-5 h-9 rounded-lg text-xs font-bold uppercase bg-[#00FF9D] text-black hover:bg-[#00FF9D]/90 font-mono shadow-[0_0_15px_rgba(0,255,157,0.25)]">Sovereign Compile</button>
                )}
              </div>
            </div>

          </motion.div>
        )}

        {step === "compiling" && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} className="max-w-xl mx-auto p-8 rounded-2xl border border-white/5 bg-[#030306]/95 flex flex-col items-center justify-center min-h-[380px] text-center" id="compiling-container">
            <div className="relative w-16 h-16 mb-6 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-[#00FF9D]/20 animate-ping" />
              <div className="absolute inset-2 rounded-full border border-[#009DFF]/30 animate-pulse" />
              <div className="w-8 h-8 rounded-full bg-black border border-[#00FF9D]/80 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00FF9D] animate-ping" />
              </div>
            </div>
            <span className="text-[9px] font-mono text-[#00FF9D] font-bold tracking-widest block mb-1">COMPILING SCHEMA</span>
            <h2 className="text-lg font-bold text-white mb-4">Structuring Strategic SOW</h2>
            <div className="w-full p-4 rounded-lg bg-black/60 border border-white/5 text-left mb-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 h-0.5 bg-[#009DFF] transition-all duration-300" style={{ width: `${((compilingStepIndex + 1) / compilingMessages.length) * 100}%` }} />
              <div className="flex gap-2 font-mono text-[9px] text-white/50">
                <span className="text-[#009DFF]">&gt;</span>
                <p className="text-[#00FF9D] font-semibold leading-relaxed">{compilingMessages[compilingStepIndex]}</p>
              </div>
            </div>
            <p className="text-white/30 text-[9px] font-mono">ZERO RETENTION LAYER ACTIVE</p>
          </motion.div>
        )}


        {step === "preview" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6" id="preview-workspace-container">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-3 space-y-4 sticky top-6 print:hidden" id="workspace-navigator">
                <div className="p-4 rounded-2xl border border-white/5 bg-[#030306]/95 text-left">
                  <span className="text-[8px] font-mono text-white/35 font-bold block mb-3">DOSSIER INDEX</span>
                  <nav className="space-y-0.5">
                    {[
                      "executive-summary", "challenge-statement", "recommended-gff-path", "proposed-workstreams",
                      "90-day-roadmap", "suggested-squad", "governance-approach", "success-measures",
                      "assumptions", "risks", "next-steps"
                    ].map((id, idx) => {
                      const label = id.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
                      const emojis = ["📄", "🔍", "🚀", "🗺️", "📅", "👥", "🛡️", "📈", "📝", "⚠️", "✍️"];
                      return (
                        <button
                          key={id}
                          onClick={() => handleScrollToSection(id)}
                          className={`w-full text-left px-3 py-1.5 rounded text-[11px] transition flex items-center gap-2 ${activePreviewSection === id ? "bg-white/5 text-[#009DFF] font-bold border-l border-[#009DFF]" : "text-white/50 hover:text-white"}`}
                        >
                          <span>{emojis[idx]}</span>
                          <span>{idx + 1}. {label}</span>
                        </button>
                      );
                    })}
                  </nav>

                  <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
                    <button onClick={handleCopyOutline} className="w-full py-1.5 rounded bg-white/5 text-white border border-white/10 hover:bg-white/10 transition text-[9px] font-mono uppercase">
                      {copied ? "✓ Copied" : "Copy Outline"}
                    </button>
                    <button onClick={handlePrint} className="w-full py-1.5 rounded bg-white/5 text-white border border-white/10 hover:bg-white/10 transition text-[9px] font-mono uppercase">
                      Print Spec Preview
                    </button>
                    <button onClick={handleReset} className="w-full py-1 text-center text-white/30 text-[9px] font-mono hover:text-white block uppercase">
                      [ Clear Forms ]
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-white/5 bg-[#030305]/80 text-[10px] text-white/40 space-y-2 text-left">
                  <div className="flex justify-between items-center">
                    <span className="text-[7px] font-mono text-white/30 uppercase">WORKSPACE</span>
                    <span className="text-[7px] font-mono bg-[#E4000F]/15 text-[#E4000F] px-1 rounded font-bold">LOCKED</span>
                  </div>
                  <h4 className="font-bold text-white">Full SOW & Presentation Exports</h4>
                  <p className="font-light leading-snug">Generate enterprise PPT slide decks and contract SOW templates matching your inputs.</p>
                  <div className="flex gap-2">
                    <button disabled className="flex-1 py-1 rounded bg-white/5 text-white/20 text-[8px] font-mono cursor-not-allowed">EXPORT PPT</button>
                    <button disabled className="flex-1 py-1 rounded bg-white/5 text-white/20 text-[8px] font-mono cursor-not-allowed">EXPORT PDF</button>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-9 p-6 lg:p-10 rounded-2xl border border-white/5 bg-[#030306]/85 shadow-2xl relative overflow-hidden print:bg-white print:text-black print:p-0" id="proposal-document-content">
                <div className="hidden print:block text-right text-[8px] font-mono text-black/40 mb-6 border-b border-black/10 pb-1">
                  <span>GFF AI CONFIDENTIAL PORTFOLIO // SOVEREIGN SPECIFICATION ARCHITECTURE</span>
                </div>

                <div className="border-b border-white/10 pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 print:border-black/20">
                  <div className="space-y-2 text-left">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00FF9D] print:bg-black" />
                      <span className="text-[8px] font-mono text-[#009DFF] font-bold tracking-widest uppercase print:text-black/60 font-semibold">PROPOSAL OUTLINE SPECIFICATION</span>
                    </div>
                    <h1 className="text-xl lg:text-3xl font-extrabold text-white tracking-tight leading-tight print:text-black font-bold">Sovereign Multi-Agent Topology</h1>
                    <p className="text-white/60 text-xs font-light max-w-lg print:text-black/70">
                      Tailored Technical deployment blueprint and SOW outline for <strong className="text-white print:text-black font-semibold">{pData.org}</strong>.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/[0.01] border border-white/5 flex flex-col items-end text-right min-w-[170px] print:border-black/10 print:bg-black/5">
                    <span className="text-[7px] font-mono text-white/40 uppercase">HORIZON TARGET</span>
                    <span className="text-base font-bold text-white font-mono print:text-black">{pData.totalWeeks} WEEKS</span>
                    <span className="text-[8px] font-mono text-[#00FF9D] mt-0.5 uppercase font-bold">{pData.licenseCost}</span>
                  </div>
                </div>

                <div className="space-y-12 print:space-y-10 text-left" id="document-sections-container">
                  <div id="executive-summary" className="scroll-mt-10 space-y-4">
                    <div className="border-b border-white/5 pb-1 print:border-black/10">
                      <span className="text-[8px] font-mono text-[#009DFF] font-bold uppercase print:text-black/50">SECTION I</span>
                      <h2 className="text-sm font-bold text-white print:text-black flex items-center gap-1.5 font-bold">📄 Executive Summary</h2>
                    </div>
                    <div className="text-xs text-white/70 font-light leading-relaxed space-y-3 print:text-black/85">
                      <p>
                        This document details the sovereign architecture mapped for deploying a custom GFF AI multi-agent cognitive fleet within the infrastructure boundary of <strong className="text-white print:text-black font-semibold">{pData.org}</strong>. Operating inside the <strong className="text-white print:text-black font-semibold">{pData.industry}</strong> sector, GFF will deploy a dedicated single-tenant virtual cloud boundary (VPC) that ensures complete compliance with zero data retention benchmarks.
                      </p>
                      <div className="p-4 rounded-xl border border-white/5 bg-white/[0.005] flex justify-between items-center print:border-black/10 print:bg-black/[0.01]">
                        <div className="text-left">
                          <span className="text-[7px] font-mono text-white/40 uppercase block print:text-black/50 font-semibold">SECURITY PROFILE ENFORCED</span>
                          <p className="text-white/80 text-[10px] font-light print:text-black">Hardened Single-Tenant Private VPC boundary featuring real-time telemetry consensus nodes.</p>
                        </div>
                        <div className="flex gap-2">
                          <div className="text-center p-2 rounded bg-black/40 min-w-[80px] border border-white/5 print:border-black/10">
                            <span className="text-xs font-bold text-[#00FF9D] block font-mono print:text-black">100%</span>
                            <span className="text-[6px] font-mono text-white/30 uppercase print:text-black/60">Isolated</span>
                          </div>
                          <div className="text-center p-2 rounded bg-black/40 min-w-[80px] border border-white/5 print:border-black/10">
                            <span className="text-xs font-bold text-[#009DFF] block font-mono print:text-black">0</span>
                            <span className="text-[6px] font-mono text-white/30 uppercase print:text-black/60">Persistent Logs</span>
                          </div>
                        </div>
                      </div>
                      <p>
                        Our proposal details a timeline of <strong className="text-white print:text-black font-semibold">{pData.totalWeeks} Weeks</strong> utilizing our standard Garage-Foundry-Factory methodology. By integrating local memory caching with GFF’s custom supervisor watchdog topologies, the system removes multi-tenant API dependencies, processing all corporate workloads entirely in-memory.
                      </p>
                    </div>
                  </div>

                  <div id="challenge-statement" className="scroll-mt-10 space-y-4">
                    <div className="border-b border-white/5 pb-1 print:border-black/10">
                      <span className="text-[8px] font-mono text-[#009DFF] font-bold uppercase print:text-black/50">SECTION II</span>
                      <h2 className="text-sm font-bold text-white print:text-black flex items-center gap-1.5 font-bold">🔍 Challenge Statement</h2>
                    </div>
                    <div className="text-xs text-white/70 font-light leading-relaxed space-y-3 print:text-black/85">
                      <p>
                        Organizations inside the <strong className="text-white print:text-black font-semibold">{pData.industry}</strong> sector face persistent constraints: high-frequency operational bottlenecks, legacy mainframes with manual query steps, and high compliance liabilities when processing customer identifiers in third-party clouds. At {pData.org}’s current <strong className="text-white print:text-black font-semibold">{pData.companyScale}</strong> footprint, this introduces severe coordination friction.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        <div className="p-3.5 rounded-lg border border-white/5 bg-black/30 print:border-black/10">
                          <h4 className="text-[10px] font-bold text-white print:text-black mb-1">Operational & Pipeline Inefficiencies</h4>
                          <p className="text-[9px] text-white/40 leading-relaxed print:text-black/77 text-left">
                            {pData.dataReadinessId === "raw" 
                              ? "Corporate metrics remain trapped in unindexed, unstructured legacy raw silos. This mandates high-latency manual context copying, slowing down standard decision cycles from minutes to days."
                              : "Despite existing database tables, lack of centralized semantic vector caches blocks cognitive models from immediate, clean context retrieval, resulting in slow relational query overrides."
                            }
                          </p>
                        </div>
                        <div className="p-3.5 rounded-lg border border-white/5 bg-black/30 print:border-black/10">
                          <h4 className="text-[10px] font-bold text-white print:text-black mb-1">Data Exposure & Retention Liability</h4>
                          <p className="text-[9px] text-white/40 leading-relaxed print:text-black/77 text-left">
                            Standard multi-tenant public AI configurations require client request payloads to persist on third-party servers for safety audits and fine-tuning. This constitutes a severe intellectual property compliance liability.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div id="recommended-gff-path" className="scroll-mt-10 space-y-4">
                    <div className="border-b border-white/5 pb-1 print:border-black/10">
                      <span className="text-[8px] font-mono text-[#009DFF] font-bold uppercase print:text-black/50">SECTION III</span>
                      <h2 className="text-sm font-bold text-white print:text-black flex items-center gap-1.5 font-bold">🚀 Recommended GFF Path</h2>
                    </div>
                    <div className="text-xs text-white/70 font-light leading-relaxed space-y-4 print:text-black/85">
                      <p>
                        GFF recommends configuring a private virtual enclave inside your single-tenant space. We deploy specialized GFF sovereign agent topologies that process transaction tokens directly inside isolated memory buffers with zero external persistence pipelines.
                      </p>

                      {/* DIAGRAM METAPHOR */}
                      <div className="p-4 rounded-xl border border-[#009DFF]/20 bg-[#030305] text-left relative print:border-black/10 print:bg-black/5">
                        <span className="text-[7px] font-mono text-white/30 uppercase tracking-widest absolute top-2 right-4">TOPOLOGY MAP</span>
                        <h4 className="text-[9px] font-mono text-white/50 mb-3 uppercase print:text-black/60 font-semibold">GFF ACTIVE DEPLOYMENT ARCHITECTURE SCHEMA</h4>
                        <div className="grid grid-cols-5 gap-1.5 items-center justify-center text-center font-mono text-[9px] text-white/70 print:text-black">
                          <div className="p-2 rounded border border-white/5 bg-white/[0.01]">
                            <span>📥 Ingestion</span>
                          </div>
                          <div className="text-white/25 text-xs select-none">──▶</div>
                          <div className="p-2 rounded border border-[#009DFF]/30 bg-[#009DFF]/5">
                            <span>🧠 GFF DAG Core</span>
                          </div>
                          <div className="text-white/25 text-xs select-none">──▶</div>
                          <div className="p-2 rounded border border-[#00FF9D]/30 bg-[#00FF9D]/5">
                            <span>🛡️ Supervisor</span>
                          </div>
                        </div>
                        <p className="text-[8px] text-white/30 leading-snug font-mono mt-3 print:text-black/50">
                          <strong>CONSENSUS KEY:</strong> Relational data is mapped via read-only OmniMesh pipelines. Workloads are orchestrated inside GFF enclaves and inspected by local watchdogs before execution.
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <h4 className="text-[10px] font-bold text-white print:text-black">Recommended Enclaves Included:</h4>
                        <ul className="list-disc pl-5 space-y-0.5 text-[10px] text-white/50 print:text-black/75">
                          <li><strong>GFF Policy Watchdog:</strong> Intercepts network tokens to block schema leaks and enforces compliance guidelines.</li>
                          <li><strong>AS-09 Consensus Auditor:</strong> Validates ledger transactions inside highly isolated local network namespaces.</li>
                          <li><strong>OmniMesh Connector:</strong> Bridges legacy relational mainframes to low-latency local in-memory vector spaces.</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div id="proposed-workstreams" className="scroll-mt-10 space-y-4">
                    <div className="border-b border-white/5 pb-1 print:border-black/10">
                      <span className="text-[8px] font-mono text-[#009DFF] font-bold uppercase print:text-black/50">SECTION IV</span>
                      <h2 className="text-sm font-bold text-white print:text-black flex items-center gap-1.5 font-bold">🗺️ Proposed Workstreams</h2>
                    </div>
                    <div className="text-xs text-white/70 font-light leading-relaxed space-y-3 print:text-black/85">
                      <p>
                        Technical delivery objectives are divided into four clear workstreams to ensure safe, concurrent deployment stages:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        <div className="p-3.5 rounded-lg border border-white/5 bg-black/40 space-y-1.5 print:border-black/10 text-left">
                          <div className="flex justify-between items-center border-b border-white/5 pb-0.5 print:border-black/10">
                            <span className="text-[10px] font-bold text-white print:text-black">Workstream A: Hardened VPC Setup</span>
                            <span className="text-[9px] font-mono text-[#009DFF] font-bold">WEEKS 1 - {pData.p1}</span>
                          </div>
                          <p className="text-[9px] text-white/40 print:text-black/70">Establish isolated virtual clouds, peer security perimeters, and initiate sandbox test logs.</p>
                          <span className="text-[8px] font-mono text-[#00FF9D] block font-semibold">DELIVERABLE: Active cloud VPC configuration file.</span>
                        </div>

                        <div className="p-3.5 rounded-lg border border-white/5 bg-black/40 space-y-1.5 print:border-black/10 text-left">
                          <div className="flex justify-between items-center border-b border-white/5 pb-0.5 print:border-black/10">
                            <span className="text-[10px] font-bold text-white print:text-black">Workstream B: OmniMesh Integration</span>
                            <span className="text-[9px] font-mono text-[#009DFF] font-bold">WEEKS {pData.p1 + 1} - {pData.p1 + pData.p2}</span>
                          </div>
                          <p className="text-[9px] text-white/40 print:text-black/70">Ingest database endpoints via secure read-only streams, structuring local vector caches.</p>
                          <span className="text-[8px] font-mono text-[#00FF9D] block font-semibold">DELIVERABLE: Operational in-memory vector database links.</span>
                        </div>

                        <div className="p-3.5 rounded-lg border border-white/5 bg-black/40 space-y-1.5 print:border-black/10 text-left">
                          <div className="flex justify-between items-center border-b border-white/5 pb-0.5 print:border-black/10">
                            <span className="text-[10px] font-bold text-white print:text-black">Workstream C: Agent Orchestration</span>
                            <span className="text-[9px] font-mono text-[#009DFF] font-bold">WEEKS {pData.p1 + pData.p2 + 1} - {pData.p1 + pData.p2 + pData.p3}</span>
                          </div>
                          <p className="text-[9px] text-white/40 print:text-black/70">Configure agent DAG topologies, decision consensus levels, and manual coordinator overrides.</p>
                          <span className="text-[8px] font-mono text-[#00FF9D] block font-semibold">DELIVERABLE: Compiled GFF Foundry agent topology schemas.</span>
                        </div>

                        <div className="p-3.5 rounded-lg border border-white/5 bg-black/40 space-y-1.5 print:border-black/10 text-left">
                          <div className="flex justify-between items-center border-b border-white/5 pb-0.5 print:border-black/10">
                            <span className="text-[10px] font-bold text-white print:text-black">Workstream D: Governance Handoff</span>
                            <span className="text-[9px] font-mono text-[#009DFF] font-bold">WEEKS {pData.p1 + pData.p2 + pData.p3 + 1} - {pData.totalWeeks}</span>
                          </div>
                          <p className="text-[9px] text-white/40 print:text-black/70">Deploy runtime security keys, activate supervisor telemetry feeds, and initiate AI Academy tracks.</p>
                          <span className="text-[8px] font-mono text-[#00FF9D] block font-semibold">DELIVERABLE: Deployed sovereign keys and technical manuals.</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div id="90-day-roadmap" className="scroll-mt-10 space-y-4">
                    <div className="border-b border-white/5 pb-1 print:border-black/10">
                      <span className="text-[8px] font-mono text-[#009DFF] font-bold uppercase print:text-black/50">SECTION V</span>
                      <h2 className="text-sm font-bold text-white print:text-black flex items-center gap-1.5 font-bold">📅 90-Day Roadmap</h2>
                    </div>
                    <div className="text-xs text-white/70 font-light leading-relaxed space-y-4 print:text-black/85">
                      <p>A structured strategic rollout schedule mapped across a classic 90-day corporate runway:</p>
                      <div className="space-y-3.5 relative before:absolute before:top-1 before:bottom-1 before:left-3 before:w-0.5 before:bg-white/5 print:before:bg-black/10">
                        <div className="relative pl-8 text-left">
                          <div className="absolute left-1 top-1 w-2.5 h-2.5 rounded-full bg-[#009DFF] print:bg-black" />
                          <span className="text-[8px] font-mono text-[#009DFF] font-bold uppercase print:text-black/60 font-semibold">DAY 1 - 30 // INCEPTION COGNITIVE DESIGNS</span>
                          <h4 className="text-[10.5px] font-bold text-white print:text-black">VPC Isolation & Testing</h4>
                          <p className="text-[9.5px] text-white/40 leading-relaxed print:text-black/70">Establish secure network bounds. Run transactional mock datasets inside GFF Sandbox environments to model appropriate DAG paths.</p>
                        </div>
                        <div className="relative pl-8 text-left">
                          <div className="absolute left-1 top-1 w-2.5 h-2.5 rounded-full bg-[#00FF9D] print:bg-black" />
                          <span className="text-[8px] font-mono text-[#00FF9D] font-bold uppercase print:text-black/60 font-semibold">DAY 31 - 60 // SYSTEM INTEGRATION</span>
                          <h4 className="text-[10.5px] font-bold text-white print:text-black">Database Peering & Caching</h4>
                          <p className="text-[9.5px] text-white/40 leading-relaxed print:text-black/70">Connect database endpoints via OmniMesh. Wire real-time in-memory vector database caches. Code specific override triggers.</p>
                        </div>
                        <div className="relative pl-8 text-left">
                          <div className="absolute left-1 top-1 w-2.5 h-2.5 rounded-full bg-[#E5A93C] print:bg-black" />
                          <span className="text-[8px] font-mono text-[#E5A93C] font-bold uppercase print:text-black/60 font-semibold">DAY 61 - 90 // PRODUCTION PROMOTION</span>
                          <h4 className="text-[10.5px] font-bold text-white print:text-black">Production Promotion & AI Training</h4>
                          <p className="text-[9.5px] text-white/40 leading-relaxed print:text-black/70">Promote sandbox scripts to production. Verify live supervisor telemetry guidelines. Provide sovereign administration keys and hold user training.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div id="suggested-squad" className="scroll-mt-10 space-y-4">
                    <div className="border-b border-white/5 pb-1 print:border-black/10">
                      <span className="text-[8px] font-mono text-[#009DFF] font-bold uppercase print:text-black/50">SECTION VI</span>
                      <h2 className="text-sm font-bold text-white print:text-black flex items-center gap-1.5 font-bold">👥 Suggested Squad</h2>
                    </div>
                    <div className="text-xs text-white/70 font-light leading-relaxed space-y-3 print:text-black/85">
                      <p>
                        To ensure fast implementation matching {pData.org}’s scale of <strong className="text-white print:text-black font-semibold">{pData.companyScale}</strong>, GFF recommends allocating a technical Strike Team containing <strong className="text-white print:text-black font-semibold">{pData.squadSize}</strong> experts:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                        <div className="p-3 rounded-lg border border-white/5 bg-white/[0.005] print:border-black/10 text-left">
                          <span className="text-sm">👔</span>
                          <h4 className="text-[10px] font-bold text-white print:text-black mt-1">1x Principal AI Architect</h4>
                          <p className="text-[9px] text-white/40 mt-1 print:text-black/60">Lead technical contact managing cognitive routing, custom DAG topologies, and VPC boundaries.</p>
                          <span className="text-[7px] font-mono text-[#00FF9D] font-bold block mt-2">100% Allocated</span>
                        </div>
                        <div className="p-3 rounded-lg border border-white/5 bg-white/[0.005] print:border-black/10 text-left">
                          <span className="text-sm">🛠️</span>
                          <h4 className="text-[10px] font-bold text-white print:text-black mt-1">1x Systems Specialist</h4>
                          <p className="text-[9px] text-white/40 mt-1 print:text-black/60">Dedicated virtual private cloud network configurations, encryption certificates, and key management.</p>
                          <span className="text-[7px] font-mono text-[#00FF9D] font-bold block mt-2">100% Allocated</span>
                        </div>
                        <div className="p-3 rounded-lg border border-white/5 bg-white/[0.005] print:border-black/10 text-left">
                          <span className="text-sm">🔗</span>
                          <h4 className="text-[10px] font-bold text-white print:text-black mt-1">1x Pipeline Integrator</h4>
                          <p className="text-[9px] text-white/40 mt-1 print:text-black/60">Bridges client relational databases with GFF local vector cache networks utilizing OmniMesh.</p>
                          <span className="text-[7px] font-mono text-[#00FF9D] font-bold block mt-2">50% Allocated</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div id="governance-approach" className="scroll-mt-10 space-y-4">
                    <div className="border-b border-white/5 pb-1 print:border-black/10">
                      <span className="text-[8px] font-mono text-[#009DFF] font-bold uppercase print:text-black/50">SECTION VII</span>
                      <h2 className="text-sm font-bold text-white print:text-black flex items-center gap-1.5 font-bold">🛡️ Governance Approach</h2>
                    </div>
                    <div className="text-xs text-white/70 font-light leading-relaxed space-y-3 print:text-black/85">
                      <p>
                        GFF enforces stringent compliance constraints via decentralized runtime monitoring protocols. All processing remains within {pData.org}'s VPC boundaries, precluding corporate data leaks.
                      </p>
                      <div className="p-4 rounded-xl border border-[#9D00FF]/25 bg-[#9D00FF]/5 print:border-black/10 print:bg-black/[0.01] text-left">
                        <h4 className="text-[10px] font-bold text-white print:text-black mb-2 font-bold">Sovereign Governance Constants:</h4>
                        <div className="grid grid-cols-2 gap-3 font-mono text-[9px] text-white/50 print:text-black/80">
                          <p>✓ <strong>ZERO_DISK_RETENTION:</strong> Enforced in-memory</p>
                          <p>✓ <strong>SUPERVISOR_WATCHDOG:</strong> Dynamic token inspection</p>
                          <p>✓ <strong>HUMAN_OVERRIDE:</strong> Multi-sig block triggers</p>
                          <p>✓ <strong>TELEMETRY_PIPELINES:</strong> Direct SOC2 alignment</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div id="success-measures" className="scroll-mt-10 space-y-4">
                    <div className="border-b border-white/5 pb-1 print:border-black/10">
                      <span className="text-[8px] font-mono text-[#009DFF] font-bold uppercase print:text-black/50">SECTION VIII</span>
                      <h2 className="text-sm font-bold text-white print:text-black flex items-center gap-1.5 font-bold">📈 Success Measures</h2>
                    </div>
                    <div className="text-xs text-white/70 font-light leading-relaxed space-y-3 print:text-black/85">
                      <p>Sovereign success targets are established as dynamic operational parameters:</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-center">
                        <div className="p-3 rounded border border-white/5 bg-white/[0.005] print:border-black/10">
                          <span className="text-sm font-bold text-[#00FF9D] font-mono block print:text-black">&gt; 99.9%</span>
                          <span className="text-[7.5px] font-mono text-white/30 uppercase mt-0.5 block print:text-black/60">Task Success</span>
                        </div>
                        <div className="p-3 rounded border border-white/5 bg-white/[0.005] print:border-black/10">
                          <span className="text-sm font-bold text-[#009DFF] font-mono block print:text-black">&lt; 150ms</span>
                          <span className="text-[7.5px] font-mono text-white/30 uppercase mt-0.5 block print:text-black/60">Latency</span>
                        </div>
                        <div className="p-3 rounded border border-white/5 bg-white/[0.005] print:border-black/10">
                          <span className="text-sm font-bold text-[#9D00FF] font-mono block print:text-black">0</span>
                          <span className="text-[7.5px] font-mono text-white/30 uppercase mt-0.5 block print:text-black/60">IP Leaks</span>
                        </div>
                        <div className="p-3 rounded border border-white/5 bg-white/[0.005] print:border-black/10">
                          <span className="text-sm font-bold text-[#E5A93C] font-mono block print:text-black">45%</span>
                          <span className="text-[7.5px] font-mono text-white/30 uppercase mt-0.5 block print:text-black/60">Reclaimed Time</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div id="assumptions" className="scroll-mt-10 space-y-4">
                    {/* Assumptions placeholder */}
                  </div>
                  <div id="risks" className="scroll-mt-10 space-y-4">
                    {/* Risks placeholder */}
                  </div>
                  <div id="next-steps" className="scroll-mt-10 space-y-4">
                    {/* Next steps placeholder */}
                  </div>
                </div>

                <div className="mt-12 pt-4 border-t border-white/5 text-center text-[8px] font-mono text-white/30 flex justify-between items-center print:border-black/10 print:text-black/50">
                  <span>GFF COGNITIVE PROPOSAL TERMINAL // v4.21-REV</span>
                  <span className="text-[#00FF9D] print:text-black font-semibold">SOVEREIGN COMPLIANT</span>
                </div>
              </div>

            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </ToolPageShell>
  );
}

