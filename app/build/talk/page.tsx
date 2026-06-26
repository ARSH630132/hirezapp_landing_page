"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ToolPageShell } from "@/components/build/components";
import Link from "next/link";

interface IntakeInputs {
  desc: string;
  ind: string;
  size: string;
  geography: string;
  urgency: string;
  functionTeam: string;
  aiStage: string;
}

export default function TalkToAgentPage() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [data, setData] = useState<IntakeInputs>({
    desc: "",
    ind: "Finance",
    size: "100-1000",
    geography: "",
    urgency: "",
    functionTeam: "",
    aiStage: "",
  });

  const [validationError, setValidationError] = useState<string | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compilerProgress, setCompilerProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState<"direction" | "squad" | "timeline">("direction");

  // References for accessibility focus management
  const stepHeaderRef = useRef<HTMLHeadingElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (stepHeaderRef.current) {
      stepHeaderRef.current.focus();
    }
  }, [currentStep]);

  // Clickable enterprise-level bottleneck examples
  const examples = [
    {
      title: "Information Access Gap",
      short: "Employees spend too much time searching...",
      full: "Employees spend too much time searching for information across disjointed legacy systems and multi-departmental files.",
    },
    {
      title: "Process Hand-off Friction",
      short: "Too many manual processes across departments...",
      full: "Too many manual processes across departments, causing long turnaround times and human copy-paste errors.",
    },
  ];

  const indOptions = [
    {
      id: "Finance",
      title: "Banking & Finance",
      description: "Secure balance ledgers, real-time auditing, regulatory compliance workflows.",
      accentColor: "#009DFF",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: "Retail",
      title: "Retail & Supply Chain",
      description: "Inventory route balancing, freight log parsing, automated supplier verification.",
      accentColor: "#E4000F",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
    },
    {
      id: "Healthcare",
      title: "Healthcare & Biotech",
      description: "HIPAA-compliant document parsing, clinical vector stores, zero memory retention.",
      accentColor: "#00FF9D",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      id: "Energy",
      title: "Energy & Utilities",
      description: "Sensing node logs, grid forecasting, active equipment supervisors.",
      accentColor: "#F59E0B",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      id: "Government",
      title: "Government & Regulated",
      description: "Sovereign secure enclaves, local record parsing, isolated systems.",
      accentColor: "#8B5CF6",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      id: "Technology",
      title: "Technology & Platforms",
      description: "Distributed code graphs, product sync nodes, platform integrations.",
      accentColor: "#EC4899",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
    },
  ];

  const sizeOptions = [
    {
      id: "<100",
      title: "Growth Venture (< 100)",
      description: "Rapid sovereign pilot deployments in isolated development enclaves.",
    },
    {
      id: "100-1000",
      title: "Mid-Market (100 - 1k)",
      description: "Department-level automation, workflow DAGs, and multi-system syncs.",
    },
    {
      id: "1000-5000",
      title: "Enterprise (1k - 5k)",
      description: "Dedicated single-tenant VPC enclaves, custom squads, and full SOC2 telemetry.",
    },
    {
      id: "5000+",
      title: "Global Scale (5k+)",
      description: "Dedicated hardware nodes, strict geographical compliance, and automated auditing.",
    },
  ];

  const geoOptions = [
    { id: "NA", label: "North America" },
    { id: "EMEA", label: "Europe & Middle East" },
    { id: "APAC", label: "Asia Pacific" },
    { id: "Global", label: "Global / Multi-Region" },
  ];

  const urgencyOptions = [
    { id: "Urgent", label: "Immediate Pilot (Next 30 Days)" },
    { id: "Strategic", label: "Strategic Rollout (Next 90 Days)" },
    { id: "Planning", label: "Planning & Scoping Phase" },
  ];

  const functionOptions = [
    { id: "Operations", label: "Operations & Supply Chain" },
    { id: "Finance", label: "Finance, Audit & Accounting" },
    { id: "CX", label: "Customer Experience & Support" },
    { id: "Legal", label: "Legal, Compliance & HR" },
    { id: "Engineering", label: "Engineering, Product & IT" },
  ];

  const aiStageOptions = [
    { id: "None", label: "Initial Exploration (No active AI)" },
    { id: "Wrappers", label: "Legacy API wrappers / Simple pilots" },
    { id: "Active", label: "Active proprietary models & vector databases" },
    { id: "Production", label: "Production-grade multi-agent swarms" },
  ];

  const compilerMessages = [
    "Establishing isolated client-side memory sandbox...",
    "Inspecting bottleneck description syntactic structures...",
    "Scanning selected industry domain compliance rules...",
    "Evaluating target scaling parameters and VPC constraints...",
    "Synthesizing customized multi-agent squad topology...",
    "Compiling indicative 90-day sandbox execution timeline...",
    "Sandbox telemetry finalized. Compiling output packages...",
  ];

  const handleNext = () => {
    setValidationError(null);
    if (currentStep === 1) {
      if (!data.desc || data.desc.trim().length < 15) {
        setValidationError("Please describe your bottleneck challenge (minimum 15 characters) so GFF can model a precise strategy.");
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    setValidationError(null);
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as any);
    }
  };

  const handleCompile = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!data.desc || data.desc.trim().length < 15) {
      setValidationError("Please describe your bottleneck challenge in Gate 1 before compiling.");
      setCurrentStep(1);
      return;
    }

    setIsCompiling(true);
    setCompilerProgress(0);
  };

  useEffect(() => {
    if (!isCompiling) return;

    const interval = setInterval(() => {
      setCompilerProgress((prev) => {
        if (prev < compilerMessages.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setIsCompiling(false);
            setShowResults(true);
          }, 450);
          return prev;
        }
      });
    }, 350);

    return () => clearInterval(interval);
  }, [isCompiling, compilerMessages.length]);

  const handleReset = () => {
    setData({
      desc: "",
      ind: "Finance",
      size: "100-1000",
      geography: "",
      urgency: "",
      functionTeam: "",
      aiStage: "",
    });
    setValidationError(null);
    setShowResults(false);
    setIsCompiling(false);
    setCurrentStep(1);
    setActiveTab("direction");
  };

  const handlePrefillExample = (fullText: string) => {
    setData((prev) => ({ ...prev, desc: fullText }));
    setValidationError(null);
  };

  // DETERMINISTIC OUTPUT COMPILER
  const compileDeterministicResults = () => {
    const isSearching = data.desc.toLowerCase().includes("search") || data.desc.toLowerCase().includes("find") || data.desc.toLowerCase().includes("access") || data.desc.toLowerCase().includes("accessing");
    const isManual = data.desc.toLowerCase().includes("manual") || data.desc.toLowerCase().includes("process") || data.desc.toLowerCase().includes("hand") || data.desc.toLowerCase().includes("departments");
    const matchedIndustry = indOptions.find((opt) => opt.id === data.ind) || indOptions[0];
    const industryName = matchedIndustry.title;

    let proposal = "";
    let squad: { name: string; subtitle: string; description: string; code: string }[] = [];
    let timeline: { phase: string; duration: string; details: string; target: string }[] = [];
    let roiEstimate = "";

    if (data.ind === "Finance") {
      proposal = "Deploy an air-gapped Transaction Reconciliation & Compliance Ledger inside a secure single-tenant enclave. The framework connects read-only transaction feeds to autonomous supervisor workers that execute continuous matching DAGs, auditing records in memory and alerting system deviations without storing sensitive banking PII.";
      roiEstimate = "Reduces ledger reconciliation validation times by 84% and flags ledger drift under 150ms.";
      squad = [
        { name: "AS-09 Balance Auditor", subtitle: "Ledger Reconciliation Node", description: "Performs continuous double-entry ledger sweeps and maps account discrepancies across legacy databases.", code: "ACTIVE_SWEEPER_NODE" },
        { name: "PL-02 Compliance Sentry", subtitle: "Regulated Telemetry Guardian", description: "Ensures compliance with standard auditing protocols, scrubbing transaction records before in-memory execution.", code: "SOC2_MEM_SHIELD" },
        { name: "SV-04 Consensus Orchestrator", subtitle: "Multi-Agent DAG Coordinator", description: "Coordinates operational validation handoffs, compiling verified state logs into encrypted database tables.", code: "SUPERVISOR_CORE" }
      ];
    } else if (data.ind === "Healthcare") {
      proposal = "Deploy a local HIPAA-Compliant Medical Note Parsing and Clinical Vector Mesh. Designed with absolute zero-retention memory locks, this system maps unstructured clinical records and medical charts to secure local vector stores, allowing diagnostic staff to query internal documents safely without cloud-transit leakage.";
      roiEstimate = "Saves medical analysts an average of 14 hours per week on document transcription and retrieval.";
      squad = [
        { name: "MD-05 Privacy Watchdog", subtitle: "PII Sanitizer & Log Anchor", description: "Scrubs sensitive clinical identifiers from ingestion memory buffers, locking data access profiles to on-prem VPCs.", code: "ZERO_KNOWLEDGE_PII" },
        { name: "NX-14 Clinical Synthesizer", subtitle: "Document Mapping Expert", description: "Parses complex handwritten and typed records, translating medical documentation into structured vector graphs.", code: "CLINICAL_GRAPH_MESH" },
        { name: "SV-12 Healthcare Supervisor", subtitle: "Medical SLA Evaluator", description: "Enforces diagnostic accuracy logs and verifies clinical taxonomy classifications before indexing database rows.", code: "ACCURACY_MONITOR" }
      ];
    } else if (data.ind === "Retail") {
      proposal = "Architect a Sovereign Freight Ledger & Logistics Auditing Pipeline. This optimization system analyzes carrier dispatch invoices, maps overland shipping manifests against GPS trackers, and detects inventory route delays. It automatically reports invoice anomalies and calculates shipping penalty credits.";
      roiEstimate = "Reclaims an estimated 4.2% of logistics expenditure by flagging duplicate billing and routing errors.";
      squad = [
        { name: "LG-03 Logistics Evaluator", subtitle: "Freight Manifest Parser", description: "Extracts container carrier specs and audits freight manifests across fragmented invoice formats.", code: "LOGISTICS_DAG" },
        { name: "RT-11 Route Optimization Node", subtitle: "Geospatial Delay Assessor", description: "Ingests route history and mapping metrics, flagging bottlenecks in active land-freight lanes.", code: "GEOSPATIAL_ANALYZER" },
        { name: "SV-05 Contract Guard", subtitle: "SLA Penalty Trigger", description: "Tracks carrier delivery contracts and compiles automated late-delivery reimbursement requests.", code: "SLA_ENFORCER" }
      ];
    } else if (isSearching) {
      proposal = `Deploy a local Semantic Knowledge Graph and Document Retrieval Mesh tailored for ${industryName}. The system implements private embedding models to index corporate documents, technical files, and siloed internal files, responding to employees with accurate, cited answers while enforcing strict role-based data access.`;
      roiEstimate = "Reduces time wasted searching for cross-department files by 78%, boosting operational agility.";
      squad = [
        { name: "KG-07 Graph Synthesizer", subtitle: "Semantic Mapping Node", description: "Constructs semantic nodes from siloed documentation, mapping internal database connections.", code: "SEMANTIC_INDEXER" },
        { name: "SV-04 Access Boundary Node", subtitle: "Security Credentials Watchdog", description: "Validates active corporate user access and filters query responses based on document clearance levels.", code: "IAM_GUARDRAIL" },
        { name: "AS-15 Semantic Retriever", subtitle: "Low-Latency Search Executor", description: "Executes in-memory semantic queries across enterprise documents, delivering synthesized, cited summaries.", code: "RETRIEVAL_SWARM" }
      ];
    } else if (isManual) {
      proposal = `Establish an Automated Multi-Agent Process Engine for ${industryName} workflows. This system deploys cooperative agents that replace manual file routing, cross-system copy-pasting, and repetitive review handoffs, recording all actions to an encrypted audit timeline.`;
      roiEstimate = "Cuts department process cycle-times by 62% and maintains absolute compliance tracking logs.";
      squad = [
        { name: "WF-12 Queue Master", subtitle: "Task Routing Agent", description: "Senses newly received files, checks payload integrity, and delegates assignments across specialized agents.", code: "QUEUE_ROUTER" },
        { name: "AS-08 Data Sync Agent", subtitle: "Multi-Platform Database Updater", description: "Safely reads and writes verified values across legacy ERPs and modern database clusters.", code: "LEGACY_CONNECTOR" },
        { name: "SV-02 Policy Guardian", subtitle: "Execution Authenticator", description: "Ensures every automated action matches organizational guidelines, raising flags on anomalous requests.", code: "POLICY_ENFORCER" }
      ];
    } else {
      proposal = `Configure a custom Sovereign Cognitive Swarm optimized for: "${data.desc.slice(0, 75)}...". The setup embeds dedicated agent pipelines inside a private environment, ensuring automated processing, safety checks, and strict data boundaries.`;
      roiEstimate = "Boosts execution throughput by 55% while maintaining single-tenant data isolation.";
      squad = [
        { name: "AS-01 Core Executor", subtitle: "Task Processing Worker", description: "Executes primary analytical steps and organizes processed database files.", code: "CORE_WORKER" },
        { name: "SV-08 Security Supervisor", subtitle: "Enclave Boundary Guardian", description: "Enforces air-gapped container boundaries, logging active agent statuses.", code: "ENCLAVE_SHIELD" },
        { name: "AN-10 Telemetry Collector", subtitle: "Performance & ROI Tracker", description: "Records token latency and operational savings metric points, rendering local telemetry reports.", code: "ANALYTICS_NODE" }
      ];
    }

    const phase1Duration = data.urgency === "Urgent" ? "7 Days" : "14 Days";
    const phase2Duration = data.urgency === "Urgent" ? "21 Days" : "30 Days";
    const phase3Duration = data.urgency === "Urgent" ? "30 Days" : "45 Days";

    const aiIntegrationFocus = data.aiStage === "Production" 
      ? "Integrate with active model mesh and existing vector stores."
      : "Establish core private LLM instances and local embedding pipelines.";

    timeline = [
      {
        phase: "Phase 1: GARAGE Co-Innovation",
        duration: phase1Duration,
        details: `Map existing legacy connectors and document schemas. Setup a zero-trust local prototype workspace in an isolated sandbox. Define API boundaries and secure data ingestion criteria.`,
        target: "Sovereign Proof-of-Concept blueprint and architectural clearance sign-off."
      },
      {
        phase: "Phase 2: FOUNDRY Core Assembly",
        duration: phase2Duration,
        details: `Deploy and calibrate your customized multi-agent squad. ${aiIntegrationFocus} Build secure workflow DAGs and wrap the deployment into dedicated single-tenant VPC containers.`,
        target: "Air-gapped pre-production environment with verified security guardrails."
      },
      {
        phase: "Phase 3: FACTORY Scale & Monitor",
        duration: phase3Duration,
        details: `Transition workflows into live operations. Activate supervisor nodes for continuous runtime compliance auditing, token telemetry, error-handling validation, and ROI monitoring.`,
        target: "Full production-grade launch with 24/7 sovereign telemetry logging and SLA compliance."
      }
    ];

    return { proposal, squad, timeline, roiEstimate };
  };

  const results = showResults ? compileDeterministicResults() : null;

  return (
    <ToolPageShell showContact={false}>
      {/* Title section */}
      <div className="border-b border-white/5 pb-8 mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-3 max-w-4xl">
          <span className="text-[10px] font-mono text-[#009DFF] font-bold uppercase tracking-widest block">
            INTAKE & ARCHITECTURE SIMULATOR
          </span>
          <h1 className="text-3xl lg:text-5xl font-extrabold text-white tracking-tight leading-none">
            AI Challenge <span className="text-[#009DFF]">Intake Console</span>
          </h1>
          <p className="text-white/50 text-xs lg:text-sm font-light leading-relaxed max-w-2xl">
            Submit your enterprise operational friction to compile optimized multi-agent squad layouts, strategic proposed directions, and a deterministic 90-day sandbox deployment timeline.
          </p>
        </div>
        <div className="p-4 px-6 rounded-xl bg-white/[0.01] border border-white/5 flex flex-col items-start min-w-[220px] shrink-0">
          <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">SECURE PORTAL STATUS</span>
          <span className="text-sm font-bold text-[#00FF9D] mt-1 font-mono tracking-tight flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF9D] animate-pulse" />
            LOCAL_SANDBOX_CONNECTED
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!showResults && !isCompiling && (
          <motion.div
            key="wizard"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start"
          >
            {/* Left Column: Form Steps */}
            <form onSubmit={handleCompile} className="lg:col-span-8 space-y-6">
              <div className="p-6 lg:p-8 rounded-2xl border border-white/5 bg-[#030306]/90 min-h-[480px] flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#009DFF]/30 to-transparent pointer-events-none" />

                <div className="space-y-6">
                  {/* Step Indicators */}
                  <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <div className="flex gap-1.5">
                      {([1, 2, 3] as const).map((step) => (
                        <button
                          key={step}
                          type="button"
                          onClick={() => {
                            if (step < currentStep || (step === 2 && data.desc.trim().length >= 15)) {
                              setCurrentStep(step);
                              setValidationError(null);
                            }
                          }}
                          className={`h-6 px-2.5 rounded text-[10px] font-mono font-bold uppercase transition flex items-center gap-1.5 border ${
                            currentStep === step
                              ? "bg-[#009DFF]/10 text-[#009DFF] border-[#009DFF]/25"
                              : step < currentStep
                              ? "bg-white/5 text-white/60 border-white/5 hover:text-white"
                              : "bg-transparent text-white/20 border-transparent cursor-not-allowed"
                          }`}
                          disabled={step > currentStep && (step === 3 || data.desc.trim().length < 15)}
                        >
                          <span>GATE 0{step}</span>
                          {step < currentStep && (
                            <svg className="w-2.5 h-2.5 text-[#00FF9D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
                      STEP {currentStep} OF 3
                    </span>
                  </div>

                  {/* Step 1: Bottleneck Details */}
                  {currentStep === 1 && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="space-y-1">
                        <h2
                          ref={stepHeaderRef}
                          tabIndex={-1}
                          className="text-lg font-bold text-white outline-none focus:ring-0"
                        >
                          Identify the Core Operational Friction
                        </h2>
                        <p className="text-xs text-white/45 font-light leading-relaxed">
                          Describe the manual bottlenecks, database search lags, or redundant process validation loops in your organization.
                        </p>
                      </div>

                      {/* Clickable Examples */}
                      <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-3">
                        <span className="text-[9px] font-mono text-white/45 uppercase tracking-wider block">
                          CHOOSE AN ENTERPRISE EXAMPLE TO PREFILL:
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {examples.map((ex, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handlePrefillExample(ex.full)}
                              className="text-left p-3.5 rounded-xl border border-white/5 bg-[#030305] hover:border-[#009DFF]/40 hover:bg-white/[0.02] transition-all group relative focus:outline-none focus:ring-1 focus:ring-[#009DFF] focus-visible:ring-2 focus-visible:ring-[#009DFF]"
                            >
                              <div
                                className="absolute top-0 left-0 w-1 h-full rounded-l transition-all bg-[#009DFF] group-hover:bg-[#009DFF]/80"
                              />
                              <h3 className="text-xs font-semibold text-white group-hover:text-[#009DFF] transition-colors ml-2">
                                {ex.title}
                              </h3>
                              <p className="text-[10px] text-white/40 font-light mt-1 line-clamp-1 ml-2">
                                {ex.short}
                              </p>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="challenge-desc" className="text-[10px] font-mono text-white/50 uppercase tracking-wider block">
                          Operational Friction Description <span className="text-[#E4000F] font-bold">*</span>
                        </label>
                        <div className="relative">
                          <textarea
                            id="challenge-desc"
                            ref={textareaRef}
                            rows={5}
                            value={data.desc}
                            onChange={(e) => {
                              setData((prev) => ({ ...prev, desc: e.target.value }));
                              if (validationError) setValidationError(null);
                            }}
                            placeholder="Describe the operational bottleneck (e.g. Employees spend too much time searching for information...)"
                            className="w-full rounded-xl border border-white/10 bg-black text-white p-4 focus:border-[#009DFF] focus:ring-1 focus:ring-[#009DFF]/30 outline-none text-xs resize-none leading-relaxed font-light transition-all"
                            aria-required="true"
                            maxLength={1000}
                          />
                          <div className="absolute bottom-3 right-3 text-[9px] font-mono text-white/30">
                            {data.desc.length} / 1000 CHARS
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Industry & Organization Size */}
                  {currentStep === 2 && (
                    <div className="space-y-6 animate-fadeIn">
                      <div className="space-y-1">
                        <h2 ref={stepHeaderRef} tabIndex={-1} className="text-lg font-bold text-white outline-none">
                          Organization & Domain Scope
                        </h2>
                        <p className="text-xs text-white/45 font-light leading-relaxed">
                          Define your operational domain and company bracket to shape the regulatory compliance constraints.
                        </p>
                      </div>

                      {/* Industry grid selector */}
                      <div className="space-y-3">
                        <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider block">
                          Select Industry Domain
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {indOptions.map((opt) => {
                            const isSelected = data.ind === opt.id;
                            return (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => setData((prev) => ({ ...prev, ind: opt.id }))}
                                className={`text-left p-4 rounded-xl border transition-all relative group flex gap-3 focus:outline-none focus:ring-1 focus:ring-[#009DFF] focus-visible:ring-2 focus-visible:ring-[#009DFF] ${
                                  isSelected
                                    ? "bg-white/[0.03] border-white/10"
                                    : "bg-white/[0.01] border-white/5 hover:border-white/10 hover:bg-white/[0.02]"
                                }`}
                                aria-pressed={isSelected}
                              >
                                {isSelected && (
                                  <div
                                    className="absolute inset-x-0 top-0 h-[1.5px]"
                                    style={{
                                      background: `linear-gradient(90deg, transparent, ${opt.accentColor}, transparent)`,
                                    }}
                                  />
                                )}
                                <div
                                  className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                                    isSelected
                                      ? "bg-white/5 border-white/10"
                                      : "bg-white/[0.01] border-white/5 text-white/30"
                                  }`}
                                  style={isSelected ? { color: opt.accentColor, borderColor: `${opt.accentColor}25` } : {}}
                                >
                                  {opt.icon}
                                </div>
                                <div className="space-y-0.5">
                                  <span className="text-xs font-bold text-white block">
                                    {opt.title}
                                  </span>
                                  <p className="text-[10px] text-white/40 leading-snug font-light">
                                    {opt.description}
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Company size selector */}
                      <div className="space-y-3 pt-2">
                        <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider block">
                          Company Size Bracket
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {sizeOptions.map((opt) => {
                            const isSelected = data.size === opt.id;
                            return (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => setData((prev) => ({ ...prev, size: opt.id }))}
                                className={`text-left p-3.5 rounded-xl border transition-all focus:outline-none focus:ring-1 focus:ring-[#009DFF] focus-visible:ring-2 focus-visible:ring-[#009DFF] ${
                                  isSelected
                                    ? "bg-white/[0.03] border-white/15"
                                    : "bg-white/[0.01] border-white/5 hover:border-white/10 hover:bg-white/[0.02]"
                                }`}
                                aria-pressed={isSelected}
                              >
                                <div className="flex justify-between items-center">
                                  <span className="text-xs font-bold text-white">{opt.title}</span>
                                  {isSelected && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#009DFF]" />
                                  )}
                                </div>
                                <p className="text-[10px] text-white/40 font-light mt-1 leading-snug">
                                  {opt.description}
                                </p>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Optional Strategic Parameters */}
                  {currentStep === 3 && (
                    <div className="space-y-6 animate-fadeIn">
                      <div className="space-y-1">
                        <h2 ref={stepHeaderRef} tabIndex={-1} className="text-lg font-bold text-white outline-none">
                          Tactical Deployment Settings
                        </h2>
                        <p className="text-xs text-white/45 font-light leading-relaxed">
                          Define optional scheduling, regional boundaries, and operational stages to complete the strategy compilation.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Geography Selection */}
                        <div className="space-y-2">
                          <label htmlFor="geo-select" className="text-[10px] font-mono text-white/50 uppercase tracking-wider block">
                            Target Geography (Optional)
                          </label>
                          <select
                            id="geo-select"
                            value={data.geography}
                            onChange={(e) => setData((prev) => ({ ...prev, geography: e.target.value }))}
                            className="w-full h-10 rounded-lg border border-white/10 bg-black text-white px-3 text-xs outline-none focus:border-[#009DFF] transition-all"
                          >
                            <option value="">No explicit geographical boundary</option>
                            {geoOptions.map((opt) => (
                              <option key={opt.id} value={opt.id}>{opt.label}</option>
                            ))}
                          </select>
                        </div>

                        {/* Deployment Urgency */}
                        <div className="space-y-2">
                          <label htmlFor="urgency-select" className="text-[10px] font-mono text-white/50 uppercase tracking-wider block">
                            Launch Schedule Urgency (Optional)
                          </label>
                          <select
                            id="urgency-select"
                            value={data.urgency}
                            onChange={(e) => setData((prev) => ({ ...prev, urgency: e.target.value }))}
                            className="w-full h-10 rounded-lg border border-white/10 bg-black text-white px-3 text-xs outline-none focus:border-[#009DFF] transition-all"
                          >
                            <option value="">Not strictly scheduled</option>
                            {urgencyOptions.map((opt) => (
                              <option key={opt.id} value={opt.id}>{opt.label}</option>
                            ))}
                          </select>
                        </div>

                        {/* Target Department / Function */}
                        <div className="space-y-2">
                          <label htmlFor="function-select" className="text-[10px] font-mono text-white/50 uppercase tracking-wider block">
                            Target Team Function (Optional)
                          </label>
                          <select
                            id="function-select"
                            value={data.functionTeam}
                            onChange={(e) => setData((prev) => ({ ...prev, functionTeam: e.target.value }))}
                            className="w-full h-10 rounded-lg border border-white/10 bg-black text-white px-3 text-xs outline-none focus:border-[#009DFF] transition-all"
                          >
                            <option value="">Cross-department focus</option>
                            {functionOptions.map((opt) => (
                              <option key={opt.id} value={opt.id}>{opt.label}</option>
                            ))}
                          </select>
                        </div>

                        {/* Current AI Stage */}
                        <div className="space-y-2">
                          <label htmlFor="stage-select" className="text-[10px] font-mono text-white/50 uppercase tracking-wider block">
                            Current AI Implementation Stage (Optional)
                          </label>
                          <select
                            id="stage-select"
                            value={data.aiStage}
                            onChange={(e) => setData((prev) => ({ ...prev, aiStage: e.target.value }))}
                            className="w-full h-10 rounded-lg border border-white/10 bg-black text-white px-3 text-xs outline-none focus:border-[#009DFF] transition-all"
                          >
                            <option value="">No current frameworks assessed</option>
                            {aiStageOptions.map((opt) => (
                              <option key={opt.id} value={opt.id}>{opt.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Summary recap box */}
                      <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] flex justify-between items-center">
                        <div className="space-y-1">
                          <span className="text-[9px] font-mono text-white/45 uppercase tracking-widest block">INTEGRATED RECAP</span>
                          <p className="text-[11px] text-white/70 leading-normal font-light">
                            Compiling strategy for <span className="text-white font-bold">{indOptions.find(o => o.id === data.ind)?.title}</span> ({data.size} bracket) addressing your manual friction details.
                          </p>
                        </div>
                        <span className="text-xs font-mono font-bold text-[#009DFF] ml-4 shrink-0">READY_FOR_COMPILE</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Validation and Navigation Actions */}
                <div className="space-y-4 border-t border-white/5 pt-6 mt-8">
                  {validationError && (
                    <div className="p-3 rounded-lg bg-[#E4000F]/5 border border-[#E4000F]/15 flex gap-2 text-xs text-white/95" role="alert">
                      <svg className="w-4 h-4 text-[#E4000F] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <p className="font-light">{validationError}</p>
                    </div>
                  )}

                  <div className="flex justify-between items-center gap-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      disabled={currentStep === 1}
                      className={`px-5 h-10 rounded-lg border text-xs font-semibold uppercase flex items-center gap-2 transition-all ${
                        currentStep === 1
                          ? "border-white/5 text-white/10 cursor-not-allowed"
                          : "border-white/10 text-white hover:bg-white/5 focus:outline-none focus:ring-1 focus:ring-[#009DFF]"
                      }`}
                    >
                      Back
                    </button>

                    {currentStep < 3 ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        className="px-6 h-10 rounded-lg text-xs font-bold uppercase bg-[#009DFF] text-black hover:bg-[#009DFF]/90 font-mono shadow-[0_0_15px_rgba(0,157,255,0.25)] flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#009DFF]"
                      >
                        Next Gate
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="px-6 h-10 rounded-lg text-xs font-bold uppercase bg-[#009DFF] text-black hover:bg-[#009DFF]/90 font-mono shadow-[0_0_15px_rgba(0,157,255,0.25)] flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#009DFF]"
                      >
                        Sovereign Compile
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </form>

            {/* Right Column: GFF Engagement Framework panel */}
            <aside className="lg:col-span-4 space-y-6">
              <div className="p-6 rounded-2xl border border-white/5 bg-[#04060b]/90 backdrop-blur-sm relative overflow-hidden space-y-6">
                <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                <div className="border-b border-white/5 pb-4">
                  <span className="text-[10px] font-mono text-[#00FF9D] font-bold tracking-widest uppercase block mb-1">
                    OPERATIONAL METHODOLOGY
                  </span>
                  <h3 className="text-base font-bold text-white tracking-tight">GFF Engagement Framework</h3>
                  <p className="text-white/40 text-[11px] font-light mt-1 leading-relaxed">
                    How Garage, Foundry, and Factory work sequentially to elevate your simulated blueprint parameters.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Garage */}
                  <div className="p-4 rounded-xl border border-white/5 bg-white/[0.005] hover:border-white/10 transition-colors space-y-1.5 relative group">
                    <div className="absolute top-0 left-0 w-1 h-12 bg-[#009DFF]/50 rounded-r" />
                    <div className="flex justify-between items-baseline pl-2">
                      <span className="text-xs font-bold text-white">1. GFF GARAGE</span>
                      <span className="text-[9px] font-mono text-[#009DFF] uppercase font-bold">WEEKS 1 - 2</span>
                    </div>
                    <p className="text-[11px] text-white/50 leading-relaxed font-light pl-2">
                      Collaborative co-innovation sprints to map operational bottlenecks, isolate integration endpoints, and draft custom topological execution diagrams.
                    </p>
                    <div className="text-[9px] font-mono text-white/30 pt-1 pl-2 border-t border-white/[0.02] flex justify-between">
                      <span>PRIMARY DELIVERABLE:</span>
                      <span className="text-white font-semibold">TACTICAL BLUEPRINT MAP</span>
                    </div>
                  </div>

                  {/* Foundry */}
                  <div className="p-4 rounded-xl border border-white/5 bg-white/[0.005] hover:border-white/10 transition-colors space-y-1.5 relative group">
                    <div className="absolute top-0 left-0 w-1 h-12 bg-[#9D00FF]/50 rounded-r" />
                    <div className="flex justify-between items-baseline pl-2">
                      <span className="text-xs font-bold text-white">2. GFF FOUNDRY</span>
                      <span className="text-[9px] font-mono text-[#9D00FF] uppercase font-bold">WEEKS 3 - 6</span>
                    </div>
                    <p className="text-[11px] text-white/50 leading-relaxed font-light pl-2">
                      Engineering assembly phase. We package specialized cognitive agents, design multi-agent communication schemas, and establish single-tenant VPC boundaries.
                    </p>
                    <div className="text-[9px] font-mono text-white/30 pt-1 pl-2 border-t border-white/[0.02] flex justify-between">
                      <span>PRIMARY DELIVERABLE:</span>
                      <span className="text-white font-semibold">COGNITIVE RUNTIME SQUAD</span>
                    </div>
                  </div>

                  {/* Factory */}
                  <div className="p-4 rounded-xl border border-white/5 bg-white/[0.005] hover:border-white/10 transition-colors space-y-1.5 relative group">
                    <div className="absolute top-0 left-0 w-1 h-12 bg-[#00FF9D]/50 rounded-r" />
                    <div className="flex justify-between items-baseline pl-2">
                      <span className="text-xs font-bold text-white">3. GFF FACTORY</span>
                      <span className="text-[9px] font-mono text-[#00FF9D] uppercase font-bold">ONGOING</span>
                    </div>
                    <p className="text-[11px] text-white/50 leading-relaxed font-light pl-2">
                      Continuous operation and optimization. Dedicated supervisor nodes monitor token logs, secure compliance protocols, and optimize processing heuristics.
                    </p>
                    <div className="text-[9px] font-mono text-white/30 pt-1 pl-2 border-t border-white/[0.02] flex justify-between">
                      <span>PRIMARY DELIVERABLE:</span>
                      <span className="text-white font-semibold">LIVE INTEGRITY TELEMETRY</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 flex gap-3 text-[10px] leading-relaxed text-white/40 font-mono">
                  <svg className="w-4 h-4 text-[#009DFF] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>
                    No analytical parameters or proprietary friction descriptions are transmitted outside this browser session. Sandboxed evaluation is processed deterministically.
                  </p>
                </div>
              </div>
            </aside>
          </motion.div>
        )}

        {/* COMPILING STATE */}
        {isCompiling && (
          <motion.div
            key="compiling"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-4xl mx-auto py-12"
          >
            <div className="p-8 rounded-2xl border border-white/5 bg-[#030305] space-y-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,157,255,0.03),transparent)] pointer-events-none" />

              <div className="flex flex-col items-center text-center space-y-4">
                {/* Custom radar graphic */}
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#009DFF]/30 animate-spin" style={{ animationDuration: '6s' }} />
                  <div className="absolute inset-2 rounded-full border border-solid border-[#00FF9D]/20 animate-ping" />
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#009DFF] to-[#00FF9D] opacity-20 blur-sm" />
                  <svg className="w-5 h-5 text-[#009DFF] absolute animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-mono text-white uppercase tracking-widest">Compiling Operational Topology</h3>
                  <p className="text-[11px] text-[#009DFF] font-mono">SANDBOX_TRACE_EXECUTION</p>
                </div>
              </div>

              {/* Pseudo-terminal line outputs */}
              <div className="h-56 rounded-xl border border-white/5 bg-black/80 p-5 font-mono text-[10px] text-white/70 space-y-2 overflow-y-auto select-none">
                {compilerMessages.map((msg, index) => {
                  const isFinished = index < compilerProgress;
                  const isCurrent = index === compilerProgress;
                  return (
                    <div
                      key={index}
                      className={`flex justify-between transition-opacity duration-300 ${
                        isFinished ? "text-[#00FF9D] opacity-100" : isCurrent ? "text-white opacity-100" : "text-white/20"
                      }`}
                    >
                      <span>
                        {isFinished ? "[SUCCESS] " : isCurrent ? "[RUNNING] " : "[PENDING] "}
                        {msg}
                      </span>
                      {isFinished && <span className="font-bold text-[#00FF9D]">OK</span>}
                      {isCurrent && <span className="animate-pulse text-[#009DFF]">LOADING</span>}
                    </div>
                  );
                })}
              </div>

              {/* Progress track */}
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#009DFF] to-[#00FF9D] transition-all duration-300"
                  style={{ width: `${((compilerProgress + 1) / compilerMessages.length) * 100}%` }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* DETERMINISTIC SMART RESULTS */}
        {showResults && results && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="space-y-8 animate-fadeIn"
          >
            {/* Local Preview Security Notice */}
            <div className="p-6 rounded-2xl border border-[#009DFF]/20 bg-[#04060b]/90 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="absolute inset-y-0 left-0 w-[3px] bg-[#009DFF]" />
              <div className="space-y-1.5 pl-2 max-w-3xl">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-[#009DFF]/10 text-[#009DFF] border border-[#009DFF]/25 uppercase tracking-wider">
                    FRONTEND LOCAL PREVIEW
                  </span>
                  <span className="text-[10px] font-mono text-white/40">SECURE MEMORY ENVIRONMENT</span>
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">Sovereign Simulation Formulated</h3>
                <p className="text-white/50 text-[11px] leading-relaxed font-light">
                  This architecture is computed deterministically in-browser. No API requests were triggered, guaranteeing zero data retention of your enterprise bottlenecks in compliance with our security charter.
                </p>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-lg border border-white/10 text-xs text-white hover:bg-white/5 font-mono uppercase tracking-wider shrink-0 transition-colors focus:outline-none focus:ring-1 focus:ring-[#009DFF]"
              >
                Reconfigure
              </button>
            </div>

            {/* Results main panel and side block */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Result Panels Tabs */}
              <div className="lg:col-span-8 p-6 lg:p-8 rounded-2xl border border-white/5 bg-[#030306]/90 space-y-6 relative overflow-hidden min-h-[500px]">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#009DFF]/30 to-transparent pointer-events-none" />

                {/* Tab Triggers */}
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <div className="flex gap-1 overflow-x-auto">
                    {(["direction", "squad", "timeline"] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-3 py-1.5 rounded text-[10px] font-mono uppercase transition flex items-center gap-1.5 border shrink-0 focus:outline-none focus:ring-1 focus:ring-[#009DFF] ${
                          activeTab === tab
                            ? "bg-[#009DFF]/10 text-[#009DFF] border-[#009DFF]/25 font-bold"
                            : "text-white/50 border-transparent hover:text-white"
                        }`}
                      >
                        {tab === "direction" && "Proposed Direction"}
                        {tab === "squad" && "Suggested Squad"}
                        {tab === "timeline" && "Indicative Timeline"}
                      </button>
                    ))}
                  </div>
                  <span className="text-[9px] font-mono text-white/30 hidden sm:inline uppercase">
                    COMPILED OK
                  </span>
                </div>

                {/* Tab 1: Proposed Direction */}
                {activeTab === "direction" && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="space-y-3">
                      <span className="text-[10px] font-mono text-[#00FF9D] uppercase tracking-wider block">
                        Architectural Concept Summary
                      </span>
                      <p className="text-white/85 text-xs lg:text-sm leading-relaxed font-light">
                        {results.proposal}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                      {/* ROI block */}
                      <div className="p-4 rounded-xl border border-white/5 bg-white/[0.005] space-y-1.5">
                        <span className="text-[9px] font-mono text-white/40 uppercase block">EXPECTED OPERATIONAL IMPACT</span>
                        <p className="text-white text-xs font-semibold leading-relaxed">
                          {results.roiEstimate}
                        </p>
                      </div>

                      {/* Design block */}
                      <div className="p-4 rounded-xl border border-white/5 bg-white/[0.005] space-y-1.5">
                        <span className="text-[9px] font-mono text-[#009DFF] uppercase block">ENCLAVE SECURE DESIGN</span>
                        <p className="text-white/70 text-xs font-light leading-relaxed">
                          Single-tenant isolated deployment with zero backend memory caching and fully audited transaction telemetry metrics.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 space-y-1.5 text-xs font-light leading-relaxed text-white/60">
                      <span className="text-[9px] font-mono text-white/40 block uppercase">BLUEPRINT CRITERIA VERIFIED:</span>
                      <p>
                        Our matching simulator verified compliance requirements for <span className="text-white font-semibold">{data.ind}</span> operations. This setup successfully handles localized database schema connections under the custom <span className="text-white font-semibold">Single-Tenant VPC</span> specification protocol.
                      </p>
                    </div>
                  </div>
                )}

                {/* Tab 2: Suggested Squad */}
                {activeTab === "squad" && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-[#9D00FF] uppercase tracking-wider block">
                        Recommended Multi-Agent Squad Configuration
                      </span>
                      <p className="text-xs text-white/45 font-light leading-relaxed">
                        Highly collaborative sovereign workers orchestrated under consensus supervisor parameters to solve the bottleneck safely.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                      {results.squad.map((member, i) => (
                        <div
                          key={i}
                          className="p-4 rounded-xl border border-white/5 bg-white/[0.005] flex flex-col justify-between group relative overflow-hidden"
                        >
                          <div className="absolute top-0 left-0 w-full h-[1.5px] bg-[#9D00FF]/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="space-y-2">
                            <div className="flex justify-between items-start">
                              <span className="text-[9px] font-mono text-[#9D00FF] px-1.5 py-0.5 rounded bg-[#9D00FF]/5 border border-[#9DFF00]/10 font-bold uppercase">
                                AGENT {i + 1}
                              </span>
                              <span className="text-[8px] font-mono text-white/30 truncate max-w-[80px]">
                                {member.code}
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-white tracking-tight mt-1">{member.name}</h4>
                            <span className="text-[9px] font-mono text-white/45 block">{member.subtitle}</span>
                            <p className="text-[10px] text-white/50 leading-relaxed font-light pt-2 border-t border-white/[0.03]">
                              {member.description}
                            </p>
                          </div>
                          <div className="text-[9px] font-mono text-white/20 pt-4 mt-auto">
                            STATUS: IN_MEMORY_STANDBY
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab 3: Indicative Timeline */}
                {activeTab === "timeline" && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-[#E4000F] uppercase tracking-wider block">
                        90-Day Sovereign Implementation Roadmap
                      </span>
                      <p className="text-xs text-white/45 font-light leading-relaxed">
                        A clear phase-by-phase chronological roadmap from initial scoping to live optimized scale.
                      </p>
                    </div>

                    {/* Timeline rail */}
                    <div className="space-y-6 relative pl-6 border-l border-white/5 pt-2 ml-2">
                      {results.timeline.map((item, i) => {
                        const colors = ["#009DFF", "#9D00FF", "#00FF9D"];
                        return (
                          <div key={i} className="relative space-y-1.5">
                            {/* Marker node */}
                            <div
                              className="absolute -left-[30px] top-1 w-4.5 h-4.5 rounded-full border bg-black flex items-center justify-center text-[8px] font-mono font-bold"
                              style={{ borderColor: colors[i], color: colors[i] }}
                            >
                              0{i + 1}
                            </div>

                            <div className="flex flex-wrap items-baseline gap-2">
                              <h4 className="text-xs font-bold text-white tracking-tight">{item.phase}</h4>
                              <span
                                className="text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase"
                                style={{ backgroundColor: `${colors[i]}10`, color: colors[i], border: `1px solid ${colors[i]}25` }}
                              >
                                {item.duration}
                              </span>
                            </div>

                            <p className="text-[11px] text-white/60 leading-relaxed font-light max-w-3xl">
                              {item.details}
                            </p>

                            <p className="text-[10px] font-mono text-white/35">
                              <span className="text-[#00FF9D]">EXPECTED TARGET:</span> {item.target}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Active parameters card */}
              <aside className="lg:col-span-4 space-y-6">
                <div className="p-6 rounded-2xl border border-white/5 bg-[#04060b]/90 space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                  <div className="border-b border-white/5 pb-4">
                    <span className="text-[10px] font-mono text-[#009DFF] font-bold tracking-widest uppercase block mb-1">
                      BLUEPRINT SPECIFICATIONS
                    </span>
                    <h3 className="text-base font-bold text-white tracking-tight">Active Sandbox Parameters</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs py-1.5 border-b border-white/[0.03]">
                      <span className="text-white/40 font-mono text-[9px] uppercase">SECTOR</span>
                      <span className="font-bold text-white font-mono uppercase">{data.ind}</span>
                    </div>

                    <div className="flex justify-between items-center text-xs py-1.5 border-b border-white/[0.03]">
                      <span className="text-white/40 font-mono text-[9px] uppercase">ORG SIZE</span>
                      <span className="font-bold text-white font-mono">{data.size}</span>
                    </div>

                    {data.geography && (
                      <div className="flex justify-between items-center text-xs py-1.5 border-b border-white/[0.03]">
                        <span className="text-white/40 font-mono text-[9px] uppercase">GEOGRAPHY</span>
                        <span className="font-bold text-white font-mono uppercase">{data.geography}</span>
                      </div>
                    )}

                    {data.urgency && (
                      <div className="flex justify-between items-center text-xs py-1.5 border-b border-white/[0.03]">
                        <span className="text-white/40 font-mono text-[9px] uppercase">URGENCY</span>
                        <span className="font-bold text-white font-mono uppercase">{data.urgency}</span>
                      </div>
                    )}

                    {data.functionTeam && (
                      <div className="flex justify-between items-center text-xs py-1.5 border-b border-white/[0.03]">
                        <span className="text-white/40 font-mono text-[9px] uppercase">FUNCTION TEAM</span>
                        <span className="font-bold text-white font-mono uppercase">{data.functionTeam}</span>
                      </div>
                    )}

                    {data.aiStage && (
                      <div className="flex justify-between items-center text-xs py-1.5 border-b border-white/[0.03]">
                        <span className="text-white/40 font-mono text-[9px] uppercase">CURRENT AI STAGE</span>
                        <span className="font-bold text-white font-mono uppercase">{data.aiStage}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-xs py-1.5">
                      <span className="text-white/40 font-mono text-[9px] uppercase">PRIVACY COMPLIANCE</span>
                      <span className="font-bold text-[#00FF9D] font-mono">100% AIR-GAPPED</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 space-y-2 text-[11px] text-white/50 leading-relaxed font-light">
                    <p>
                      We can compile this browser sandbox setup into a deep architectural mapping dashboard containing interactive flow charts, VPC specs, and custom data schemas.
                    </p>
                  </div>
                </div>
              </aside>
            </div>

            {/* Premium CTA Elevation Section */}
            <section className="relative p-8 lg:p-10 rounded-2xl border border-white/5 bg-[#030305] flex flex-col md:flex-row items-center justify-between gap-8 group overflow-hidden mt-12">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#009DFF]/5 blur-3xl pointer-events-none rounded-full" />
              <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

              <div className="space-y-3 max-w-2xl relative z-10 text-center md:text-left">
                <span className="text-[9px] font-mono text-[#00FF9D] font-bold uppercase tracking-widest block">
                  SOVEREIGN BLUEPRINT ELEVATION
                </span>
                <h3 className="text-xl lg:text-2xl font-bold text-white tracking-tight">
                  Ready to Deploy This Topology?
                </h3>
                <p className="text-white/50 text-xs font-light leading-relaxed max-w-lg">
                  Connect with a GFF Enterprise Architect to compile your simulated sandbox specifications into a production-ready private enclave, or expand your workflow layouts into custom interactive maps.
                </p>
              </div>

              <div className="relative z-10 shrink-0 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link
                  href="/build/blueprint"
                  className="px-5 py-3 rounded-xl text-xs font-semibold text-white bg-white/5 border border-white/10 hover:bg-white/10 text-center uppercase tracking-wider transition-all focus:outline-none focus:ring-1 focus:ring-white/20"
                >
                  Generate Deep Blueprint
                </Link>
                <Link
                  href="/contact"
                  className="px-5 py-3 rounded-xl text-xs font-bold text-black bg-[#009DFF] hover:bg-[#009DFF]/90 text-center uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,157,255,0.2)] focus:outline-none focus:ring-2 focus:ring-[#009DFF]"
                >
                  Secure Technical Sync
                </Link>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </ToolPageShell>
  );
}
