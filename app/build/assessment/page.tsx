"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ToolPageShell, ToolCTA } from "@/components/build/components";
import Link from "next/link";
import { DIMENSIONS, Dimension } from "./data";

// SVG Icon mapper for 8 dimensions
const getDimensionIcon = (id: string) => {
  const css = "w-4 h-4";
  switch (id) {
    case "strategy":
      return (
        <svg className={css} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      );
    case "data":
      return (
        <svg className={css} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      );
    case "process":
      return (
        <svg className={css} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      );
    case "talent":
      return (
        <svg className={css} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    case "governance":
      return (
        <svg className={css} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    case "techstack":
      return (
        <svg className={css} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case "leadership":
      return (
        <svg className={css} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    case "operating":
    default:
      return (
        <svg className={css} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
  }
};

const COMPILING_MESSAGES = [
  "Establishing encrypted diagnostic workspace...",
  "Scanning Strategy & Corporate Alignment telemetry...",
  "Analyzing context structures & vector schema drift...",
  "Auditing workflow processes & decision latencies...",
  "Verifying talent proficiency & engineering runway...",
  "Assessing private VPC boundaries & zero-retention logging rules...",
  "Evaluating sovereign technology stack hosting setups...",
  "Reconciling compliance, risk structures, and red-teaming sets...",
  "Compiling custom multi-dimensional bento report..."
];

export default function AssessmentPage() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [activeDimensionIndex, setActiveDimensionIndex] = useState<number>(0);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [compilingStep, setCompilingStep] = useState<number>(0);
  const [showResult, setShowResult] = useState<boolean>(false);

  const activeDimension = DIMENSIONS[activeDimensionIndex];

  // Scoring details
  const totalQuestions = DIMENSIONS.reduce((acc, dim) => acc + dim.questions.length, 0);
  const answeredQuestionsCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredQuestionsCount / totalQuestions) * 100);

  const getDimensionAnsweredCount = (dim: Dimension) => {
    return dim.questions.filter(q => answers[q.id] !== undefined).length;
  };

  const isDimensionComplete = (dim: Dimension) => {
    return getDimensionAnsweredCount(dim) === dim.questions.length;
  };

  const getLiveLevelEstimate = () => {
    if (answeredQuestionsCount === 0) return { name: "Awaiting Input", color: "text-white/40" };
    
    const sum = Object.values(answers).reduce((acc, val) => acc + val, 0);
    const avg = sum / answeredQuestionsCount;
    
    if (avg >= 3.4) return { name: "Sovereign Mesh (Level IV)", color: "text-[#00FF9D]" };
    if (avg >= 2.5) return { name: "Federated Mesh (Level III)", color: "text-[#3B82F6]" };
    if (avg >= 1.7) return { name: "Siloed Enclave (Level II)", color: "text-[#E5A93C]" };
    return { name: "Reactive Sandbox (Level I)", color: "text-[#E4000F]" };
  };

  useEffect(() => {
    if (!isCompiling) return;
    const interval = setInterval(() => {
      setCompilingStep((prev) => {
        if (prev < COMPILING_MESSAGES.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setIsCompiling(false);
          setShowResult(true);
          return prev;
        }
      });
    }, 350);
    return () => clearInterval(interval);
  }, [isCompiling]);

  const handleSelectOption = (questionId: string, score: number) => {
    setValidationError(null);
    setAnswers(prev => ({ ...prev, [questionId]: score }));
  };

  const handleCompileTrigger = () => {
    setValidationError(null);
    const incompleteDims: string[] = [];
    
    DIMENSIONS.forEach(dim => {
      if (!isDimensionComplete(dim)) {
        incompleteDims.push(dim.shortName);
      }
    });

    if (incompleteDims.length > 0) {
      setValidationError(
        `VALIDATION ALERT: Please resolve all diagnostic segments before compiling. Incomplete categories: ${incompleteDims.join(", ")}.`
      );
      return;
    }

    setIsCompiling(true);
    setCompilingStep(0);
  };

  const handleReset = () => {
    setAnswers({});
    setActiveDimensionIndex(0);
    setValidationError(null);
    setIsCompiling(false);
    setShowResult(false);
    setCompilingStep(0);
  };

  // Generate dynamic results
  const calculateResults = () => {
    const totalScore = Object.values(answers).reduce((acc, val) => acc + val, 0);
    const percentage = Math.round(((totalScore - 24) / (96 - 24)) * 100);

    let tierName = "";
    let tierColor = "";
    let borderAccent = "";
    let commentary = "";

    if (percentage >= 85) {
      tierName = "Maturity Level IV: Sovereign Agentic Grid";
      tierColor = "text-[#00FF9D]";
      borderAccent = "border-[#00FF9D]/30 shadow-[0_0_20px_rgba(0,255,157,0.03)]";
      commentary = "Your organization exhibits world-class capabilities tailored to host autonomous multi-agent systems inside isolated network subnets. Your data pipelines feature semantic linking and real-time context ingestion. We recommend establishing custom local vector nodes and deploying sovereign supervisor enclaves to transition your pilot workflows into immediate production lines with zero data retention risks.";
    } else if (percentage >= 60) {
      tierName = "Maturity Level III: Strategic Federated Mesh";
      tierColor = "text-[#3B82F6]";
      borderAccent = "border-[#3B82F6]/30 shadow-[0_0_20px_rgba(59,130,246,0.03)]";
      commentary = "You have established strong structural foundations. Your private cloud setups and operational documentation are highly mature, but data pipelines lack clean semantic structure and legacy writebacks remain constrained by human latency. Implementing localized vector cache enclaves and a federated AI Center of Excellence can resolve these bottlenecks and compress deployment timelines down to 30 days.";
    } else if (percentage >= 35) {
      tierName = "Maturity Level II: Experimental Siloed Enclave";
      tierColor = "text-[#E5A93C]";
      borderAccent = "border-[#E5A93C]/30 shadow-[0_0_20px_rgba(229,169,60,0.03)]";
      commentary = "Your AI efforts are fragmented, relying on cloud endpoints with manual review workflows and isolated scripts. While individual talent exists, the lack of centralized governance and structured vector data pipelines limits your ability to scale. Establishing a standardized sandbox environment is an essential next gate to coordinate telemetry protocols and secure a dedicated capital runway.";
    } else {
      tierName = "Maturity Level I: Reactive Discovery Sandbox";
      tierColor = "text-[#E4000F]";
      borderAccent = "border-[#E4000F]/30 shadow-[0_0_20px_rgba(228,0,15,0.03)]";
      commentary = "Your systems are locked in legacy databases with siloed, undocumented processes and minimal in-house AI engineering capabilities. Running unstructured commercial chatbots introduces high data-leakage and regulatory risks. We strongly suggest launching a controlled GFF Labs sandbox trial to securely model your security schemas before attempting any cloud or on-premises deployments.";
    }

    const dimensionBreakdowns = DIMENSIONS.map(dim => {
      const qIds = dim.questions.map(q => q.id);
      const scores = qIds.map(id => answers[id] || 1);
      const avg = Number((scores.reduce((a, b) => a + b, 0) / qIds.length).toFixed(1));

      let status = "GAP IDENTIFIED";
      let statusStyle = "text-[#E5A93C] bg-[#E5A93C]/5 border-[#E5A93C]/15";
      let rec = "";

      if (avg >= 3.5) {
        status = "OPTIMIZED";
        statusStyle = "text-[#00FF9D] bg-[#00FF9D]/5 border-[#00FF9D]/15";
      } else if (avg >= 2.5) {
        status = "STABLE";
        statusStyle = "text-[#3B82F6] bg-[#3B82F6]/5 border-[#3B82F6]/15";
      }

      if (dim.id === "strategy") {
        rec = avg >= 2.5 
          ? "Establish continuous strategy discovery boards mapping specific business bottlenecks to complex Multi-Agent DAG blueprints."
          : "Secure executive board-level sponsorship to align corporate multi-year capital directly with structured pilot outcomes.";
      } else if (dim.id === "data") {
        rec = avg >= 2.5
          ? "Integrate GFF Context Knowledge Graphs to feed your active local agent enclaves with synchronized contextual context mapping."
          : "Construct automated data ingestion pipelines using semantic chunkers to process legacy PDFs, SOPs, and manual logs securely.";
      } else if (dim.id === "process") {
        rec = avg >= 2.5
          ? "Deploy passive supervisor nodes to constantly measure multi-agent DAG latency bottlenecks and optimize step executions."
          : "Digitize core manual workflows and document decision state boundaries before modeling autonomous handoffs.";
      } else if (dim.id === "talent") {
        rec = avg >= 2.5
          ? "Adopt Platform-as-a-Product structures to let internal engineering teams spin up isolated, pre-governed agents independently."
          : "Roll out GFF AI Academy modules across target divisions to improve prompt literacy and reduce digital-transition friction.";
      } else if (dim.id === "governance") {
        rec = avg >= 2.5
          ? "Implement zero-retention boundary policies and cryptographically sign execution steps for high-integrity regulatory audits."
          : "Install automated input/output security middleware to detect and redact sensitive customer identifiers (PII) at the edge.";
      } else if (dim.id === "techstack") {
        rec = avg >= 2.5
          ? "Introduce GFF Orchestration Gateways to dynamically route model calls based on cost, latency thresholds, and residency rules."
          : "Transition operational workloads from public cloud API keys to private cloud enclaves or local containerized serving structures.";
      } else if (dim.id === "leadership") {
        rec = avg >= 2.5
          ? "Co-develop custom proprietary model adapters and pioneer topologies in collaborative syncs with GFF Labs."
          : "Secure protected, multi-year CAPEX reserves to insulate early-stage pilot models from short-term financial fluctuations.";
      } else {
        rec = avg >= 2.5
          ? "Design full-duplex human-agent queues allowing operators and active supervisor bots to collaboratively resolve complex tasks."
          : "Adopt a federated Center of Excellence (CoE) to streamline compliance clearances and standardize deployable templates.";
      }

      return { ...dim, avg, status, statusStyle, rec };
    });

    return { percentage, tierName, tierColor, borderAccent, commentary, dimensionBreakdowns };
  };

  const report = showResult ? calculateResults() : null;

  return (
    <ToolPageShell showContact={!showResult}>
      <AnimatePresence mode="wait">
        {/* COMPILED LOADING SCREEN */}
        {isCompiling && (
          <motion.div
            key="compiling"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-[550px] flex flex-col items-center justify-center py-16 text-center space-y-8"
          >
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-[#009DFF]/20 animate-ping" />
              <div className="absolute inset-2 rounded-full border border-[#00FF9D]/30 animate-pulse" />
              <div className="w-12 h-12 rounded-full bg-[#030306] border border-white/10 flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-[#009DFF] animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            </div>
            <div className="space-y-2 max-w-lg">
              <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest block">TELEMETRY SECURE SCAN</span>
              <p className="text-white text-base font-semibold h-12 flex items-center justify-center leading-relaxed">
                {COMPILING_MESSAGES[compilingStep]}
              </p>
            </div>
            <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden relative">
              <div 
                className="h-full bg-gradient-to-r from-[#009DFF] to-[#00FF9D] transition-all duration-300"
                style={{ width: `${((compilingStep + 1) / COMPILING_MESSAGES.length) * 100}%` }}
              />
            </div>
          </motion.div>
        )}

        {/* ACTIVE DIAGNOSTIC RUNNER */}
        {!isCompiling && !showResult && (
          <motion.div
            key="diagnostics"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            {/* Header section */}
            <div className="border-b border-white/5 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2 max-w-3xl">
                <span className="text-[10px] font-mono text-[#009DFF] font-bold uppercase tracking-widest block">
                  BUILD-WITH-GFF // INTERACTIVE DIAGNOSTIC
                </span>
                <h1 className="text-3xl lg:text-5xl font-extrabold text-white tracking-tight leading-none">
                  Sovereign AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#009DFF] via-white to-[#00FF9D]">Readiness Assessor</span>
                </h1>
                <p className="text-white/50 text-xs font-light leading-relaxed">
                  Evaluate your organization’s strategic alignments, data pipeline security, process bottlenecks, governance compliance, and technology parameters. Establish a certified maturity baseline before scheduling agentic deployments.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-white/5 bg-[#030306]/90 min-w-[200px] flex items-center justify-between gap-4 font-mono">
                <div>
                  <span className="text-[9px] text-white/40 block uppercase">BUFFER SYNC</span>
                  <span className="text-xs font-bold text-[#00FF9D]">GATEWAY {answeredQuestionsCount} / {totalQuestions} READY</span>
                </div>
                <div className="text-xl font-extrabold text-white">
                  {progressPercent}%
                </div>
              </div>
            </div>

            {/* Main panel layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Nav list of dimensions */}
              <div className="lg:col-span-3 space-y-4">
                <div className="p-4 rounded-xl border border-white/5 bg-[#030306]/90 space-y-3">
                  <div className="border-b border-white/5 pb-2">
                    <span className="text-[9px] font-mono text-white/40 uppercase tracking-wider block">SEGMENT GATEWAYS</span>
                  </div>
                  <div className="space-y-1.5">
                    {DIMENSIONS.map((dim, idx) => {
                      const done = isDimensionComplete(dim);
                      const count = getDimensionAnsweredCount(dim);
                      const isCurrent = idx === activeDimensionIndex;
                      
                      return (
                        <button
                          key={dim.id}
                          type="button"
                          onClick={() => {
                            setValidationError(null);
                            setActiveDimensionIndex(idx);
                          }}
                          className={`w-full p-2.5 rounded-lg border text-left flex items-center justify-between transition-all ${
                            isCurrent 
                              ? "bg-white/[0.03] border-white/10 text-white" 
                              : "bg-transparent border-transparent text-white/50 hover:text-white/90 hover:bg-white/[0.01]"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span 
                              className="p-1 rounded-md border flex-shrink-0" 
                              style={{ 
                                color: isCurrent ? dim.color : "inherit", 
                                borderColor: isCurrent ? `${dim.color}35` : "rgba(255,255,255,0.05)"
                              }}
                            >
                              {getDimensionIcon(dim.id)}
                            </span>
                            <span className="text-xs font-bold truncate tracking-tight">{dim.name}</span>
                          </div>
                          <div className="font-mono text-[9px] flex-shrink-0 text-white/40">
                            {done ? (
                              <span className="text-[#00FF9D] font-bold">✓</span>
                            ) : count > 0 ? (
                              <span>{count}/3</span>
                            ) : (
                              <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-white/5 bg-[#030306]/80 text-xs text-white/50 space-y-2">
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#009DFF] transition-all duration-300" style={{ width: `${progressPercent}%` }} />
                  </div>
                  <div className="flex justify-between text-[9px] font-mono">
                    <span>OVERALL COMPILATION STATUS</span>
                    <span className="text-white font-bold">{progressPercent}%</span>
                  </div>
                </div>
              </div>

              {/* Center Column: Questions form */}
              <div className="lg:col-span-6 space-y-6">
                <div className="p-6 rounded-2xl border border-white/5 bg-[#030306]/95 space-y-6">
                  <div className="border-b border-white/5 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 text-[#009DFF] border border-white/10 uppercase tracking-wider font-bold">
                        SECTOR {activeDimensionIndex + 1} OF {DIMENSIONS.length}
                      </span>
                      {isDimensionComplete(activeDimension) && (
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#00FF9D]/10 text-[#00FF9D] border border-[#00FF9D]/20 uppercase tracking-wider font-bold">
                          GATE COMPLETE
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-bold tracking-tight mt-2 text-white" style={{ color: activeDimension.color }}>
                      {activeDimension.name}
                    </h2>
                    <p className="text-white/50 text-xs mt-1.5 font-light leading-relaxed">
                      {activeDimension.description}
                    </p>
                  </div>

                  <div className="space-y-6">
                    {activeDimension.questions.map((q, qIdx) => {
                      const selectedScore = answers[q.id];
                      return (
                        <div key={q.id} className="space-y-3">
                          <h3 className="text-xs font-bold text-white tracking-tight flex gap-2">
                            <span className="text-white/30 font-mono">{qIdx + 1}.</span>
                            <span>{q.text}</span>
                          </h3>
                          <div className="grid grid-cols-1 gap-2">
                            {q.options.map((opt) => {
                              const selected = selectedScore === opt.score;
                              return (
                                <button
                                  key={opt.score}
                                  type="button"
                                  onClick={() => handleSelectOption(q.id, opt.score)}
                                  className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 group relative ${
                                    selected 
                                      ? "bg-white/[0.02] text-white" 
                                      : "bg-[#040609] border-white/5 text-white/60 hover:text-white/95 hover:bg-white/[0.005] hover:border-white/10"
                                  }`}
                                  style={selected ? { borderColor: `${activeDimension.color}40` } : undefined}
                                >
                                  <div 
                                    className={`w-5 h-5 rounded-md border flex items-center justify-center font-mono text-[10px] font-bold flex-shrink-0 transition-all ${
                                      selected ? "text-black" : "border-white/10 text-white/30 group-hover:border-white/20"
                                    }`}
                                    style={selected ? { backgroundColor: activeDimension.color, borderColor: activeDimension.color } : undefined}
                                  >
                                    {opt.score}
                                  </div>
                                  <div className="space-y-0.5 min-w-0">
                                    <span className="text-xs font-bold tracking-tight block">{opt.label}</span>
                                    <span className="text-[11px] text-white/40 block leading-relaxed font-light">{opt.description}</span>
                                  </div>
                                  {selected && (
                                    <div className="absolute left-0 top-3 bottom-3 w-[2px] rounded-r" style={{ backgroundColor: activeDimension.color }} />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      disabled={activeDimensionIndex === 0}
                      onClick={() => {
                        setValidationError(null);
                        setActiveDimensionIndex(prev => prev - 1);
                      }}
                      className={`px-4 h-9 rounded-lg border text-xs font-semibold uppercase font-mono flex items-center gap-1.5 transition-colors ${
                        activeDimensionIndex === 0 
                          ? "border-white/5 text-white/10 cursor-not-allowed" 
                          : "border-white/10 text-white hover:bg-white/5"
                      }`}
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                      </svg>
                      <span>BACK</span>
                    </button>

                    <div className="flex gap-2">
                      {activeDimensionIndex < DIMENSIONS.length - 1 ? (
                        <button
                          type="button"
                          onClick={() => {
                            setValidationError(null);
                            setActiveDimensionIndex(prev => prev + 1);
                          }}
                          className="px-4 h-9 rounded-lg border border-[#009DFF]/20 text-xs font-bold uppercase font-mono bg-[#009DFF]/5 text-white hover:bg-[#009DFF]/10 flex items-center gap-1.5 transition-colors"
                        >
                          <span>NEXT CATEGORY</span>
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleCompileTrigger}
                          className="px-5 h-9 rounded-lg text-xs font-bold uppercase font-mono bg-gradient-to-r from-[#009DFF] to-[#00FF9D] text-black hover:opacity-90 flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,157,255,0.2)] transition-opacity"
                        >
                          <span>COMPILE TELEMETRY</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {validationError && (
                  <div className="p-4 rounded-xl bg-[#E4000F]/5 border border-[#E4000F]/15 text-xs text-white/80 font-mono leading-relaxed">
                    <span className="text-[#E4000F] font-bold block mb-1">DATA SEGMENT INCOMPLETE</span>
                    {validationError}
                  </div>
                )}
              </div>

              {/* Right Column: Live summaries (Desktop only) */}
              <div className="lg:col-span-3 space-y-4">
                <div className="p-4 rounded-xl border border-white/5 bg-[#030306]/90 relative overflow-hidden space-y-3">
                  <div className="border-b border-white/5 pb-2">
                    <span className="text-[9px] font-mono text-[#00FF9D] font-bold block uppercase tracking-wider">LIVE TELEMETRY PANEL</span>
                  </div>
                  <div className="space-y-3">
                    <div className="py-1.5 border-b border-white/[0.02] flex justify-between items-baseline text-xs">
                      <span className="text-white/40 font-mono text-[9px] uppercase">GATES COMPLETED</span>
                      <span className="font-mono font-bold text-white">{answeredQuestionsCount} / {totalQuestions}</span>
                    </div>
                    <div className="py-1.5 border-b border-white/[0.02] flex justify-between items-baseline text-xs">
                      <span className="text-white/40 font-mono text-[9px] uppercase">LIVE LEVEL</span>
                      <span className={`font-mono font-bold ${getLiveLevelEstimate().color}`}>
                        {getLiveLevelEstimate().name}
                      </span>
                    </div>
                    <div className="py-1.5 border-b border-white/[0.02] flex justify-between items-baseline text-xs">
                      <span className="text-white/40 font-mono text-[9px] uppercase">VPC ISOLATION DEVIANCE</span>
                      <span className="font-mono font-bold text-[#009DFF]">0.0% SECURE BOUND</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <div className="p-2.5 rounded-lg bg-white/[0.01] border border-white/5 text-[10px] text-white/40 leading-relaxed font-light">
                      <span className="font-mono text-[#009DFF] font-semibold block uppercase text-[8px] tracking-wider mb-1">LOCAL TELEMETRY ONLY</span>
                      Your response parameters remain local. No compliance or organizational details leave your terminal session.
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.005] text-xs text-white/50 space-y-2">
                  <span className="text-[9px] font-mono text-white/30 uppercase block font-semibold">QUICK JUMP GATES</span>
                  <div className="grid grid-cols-2 gap-1.5 font-mono text-[9px] font-bold">
                    <button type="button" onClick={() => { setValidationError(null); setActiveDimensionIndex(0); }} className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-center uppercase border border-white/5 text-white/70">01. STRATEGY</button>
                    <button type="button" onClick={() => { setValidationError(null); setActiveDimensionIndex(1); }} className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-center uppercase border border-white/5 text-white/70">02. DATA</button>
                    <button type="button" onClick={() => { setValidationError(null); setActiveDimensionIndex(4); }} className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-center uppercase border border-white/5 text-white/70">05. SECURITY</button>
                    <button type="button" onClick={() => { setValidationError(null); setActiveDimensionIndex(5); }} className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-center uppercase border border-white/5 text-white/70">06. STACK</button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* DETAILED RESULTS DASHBOARD */}
        {showResult && report && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="border-b border-white/5 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2 max-w-3xl">
                <span className="text-[10px] font-mono text-[#00FF9D] font-bold uppercase tracking-widest block">
                  DIAGNOSTIC ARCHIVE // VERIFIED REPORT
                </span>
                <h1 className="text-3xl lg:text-5xl font-extrabold text-white tracking-tight leading-none">
                  Sovereign Maturity <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#009DFF] via-white to-[#00FF9D]">Maturity Index</span>
                </h1>
                <p className="text-white/50 text-xs font-light leading-relaxed">
                  Cryptographically secure evaluation report mapped across all eight dimensions of enterprise capability. Align these scores to configure your custom agentic workspace.
                </p>
              </div>
              <div className="flex gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-5 h-10 rounded-lg border border-white/10 text-xs text-white hover:bg-white/5 font-mono uppercase font-bold tracking-wider"
                >
                  RE-RUN DIAGNOSTICS
                </button>
              </div>
            </div>

            {/* Core Score Summary Block */}
            <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 rounded-2xl border bg-[#030306]/95 items-center ${report.borderAccent}`}>
              <div className="lg:col-span-4 flex flex-col items-center text-center p-4 border-b lg:border-b-0 lg:border-r border-white/5 space-y-4 font-mono">
                <span className="text-[10px] text-white/40 uppercase tracking-widest">ORGANIZATIONAL MATURITY PROFILE</span>
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                    <circle cx="72" cy="72" r="64" stroke="rgba(255,255,255,0.02)" strokeWidth="6" fill="transparent" />
                    <circle 
                      cx="72" 
                      cy="72" 
                      r="64" 
                      stroke="url(#resultScoreGradient)" 
                      strokeWidth="6" 
                      fill="transparent" 
                      strokeDasharray={402}
                      strokeDashoffset={402 - (402 * report.percentage) / 100}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="resultScoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#009DFF" />
                        <stop offset="100%" stopColor="#00FF9D" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="text-center">
                    <span className="text-4xl font-extrabold text-white block">{report.percentage}%</span>
                    <span className="text-[8px] text-white/30 uppercase tracking-widest block mt-0.5">READINESS</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className={`text-sm font-bold tracking-wide uppercase ${report.tierColor}`}>
                    {report.tierName}
                  </span>
                  <span className="text-[9px] text-white/30 uppercase block">COMPLIANCE Telemetry: SECURED</span>
                </div>
              </div>

              <div className="lg:col-span-8 p-4 space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-[#009DFF] font-bold uppercase tracking-wider block">EXECUTIVE EVALUATION SUMMARY</span>
                  <p className="text-white text-base font-semibold tracking-tight leading-relaxed">
                    Sovereign operations baselines established with key infrastructural gaps highlighted below.
                  </p>
                  <p className="text-white/60 text-xs font-light leading-relaxed">
                    {report.commentary}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/5 flex flex-wrap gap-4 text-xs font-mono">
                  <Link 
                    href="/build/blueprint"
                    className="flex items-center gap-1.5 px-4 h-9 rounded-lg bg-[#009DFF] text-black font-bold hover:bg-[#009DFF]/90 transition-colors"
                  >
                    <span>CONFIGURE BLUEPRINT ARCHITECT</span>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                  <Link 
                    href="/build/proposal"
                    className="flex items-center gap-1.5 px-4 h-9 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors"
                  >
                    <span>COMPILE COMMERCIAL PROPOSAL</span>
                  </Link>
                  <Link 
                    href="/build/sandbox"
                    className="flex items-center gap-1.5 px-4 h-9 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                  >
                    <span>RUN SECURE TRACE SANDBOX</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Bento Grid layout */}
            <div className="space-y-4">
              <div className="flex items-baseline justify-between">
                <h3 className="text-xs font-mono text-white/40 uppercase tracking-widest font-semibold">SEGMENT EVALUATION BREAKDOWN</h3>
                <span className="text-[9px] font-mono text-white/30 uppercase">8 SEGMENTS VERIFIED</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {report.dimensionBreakdowns.map((res) => (
                  <div 
                    key={res.id} 
                    className="p-5 rounded-2xl border border-white/5 bg-[#030306]/95 hover:border-white/10 transition-all flex flex-col justify-between space-y-4 relative overflow-hidden group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="p-1 rounded bg-white/5 border border-white/10 flex-shrink-0" style={{ color: res.color }}>
                            {getDimensionIcon(res.id)}
                          </span>
                          <span className="text-xs font-bold text-white tracking-tight truncate">{res.shortName}</span>
                        </div>
                        <span className={`text-[8px] font-mono font-extrabold px-1.5 py-0.5 rounded border ${res.statusStyle}`}>
                          {res.status}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-baseline font-mono text-xs">
                          <span className="text-white/30 text-[9px]">SEGMENT SCORE</span>
                          <span className="font-bold text-white">{res.avg} / 4.0</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full transition-all duration-500"
                            style={{ width: `${(res.avg / 4) * 100}%`, backgroundColor: res.color }}
                          />
                        </div>
                      </div>

                      <p className="text-[11px] text-white/50 leading-relaxed font-light pt-1">
                        {res.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/5 space-y-1 bg-white/[0.005] p-2.5 rounded-lg border border-white/[0.02]">
                      <span className="text-[8px] font-mono text-[#009DFF] font-extrabold uppercase tracking-widest block">TACTICAL RECOMMENDATION</span>
                      <p className="text-[10px] text-white/70 leading-normal font-light">
                        {res.rec}
                      </p>
                    </div>

                    <div className="absolute right-0 top-0 bottom-0 w-[1px] opacity-0 group-hover:opacity-10 transition-opacity" style={{ backgroundColor: res.color }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="p-6 rounded-2xl border border-white/5 bg-[#030306]/90 flex flex-col md:flex-row items-center justify-between gap-6 font-mono">
              <div className="space-y-1.5 max-w-xl text-center md:text-left">
                <span className="text-[9px] text-[#00FF9D] font-bold uppercase tracking-widest block">SECURE PROCESS ENVELOPE</span>
                <p className="text-xs text-white/80 font-light leading-relaxed font-sans">
                  Want to explore your custom topologies and run localized trace simulation runs? Enter our zero-trust sandbox to observe agent interactions.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 font-sans">
                <Link 
                  href="/build/sandbox"
                  className="px-5 h-10 rounded-lg bg-white/5 hover:bg-white/10 text-white hover:border-white/20 border border-white/10 transition text-xs font-bold uppercase flex items-center justify-center"
                >
                  LAUNCH SANDBOX NODE
                </Link>
                <Link 
                  href="/build/talk"
                  className="px-5 h-10 rounded-lg bg-[#009DFF]/10 hover:bg-[#009DFF]/20 text-[#009DFF] hover:border-[#009DFF]/30 border border-[#009DFF]/20 transition text-xs font-bold uppercase flex items-center justify-center"
                >
                  SYNC WITH AN ENGINEER
                </Link>
              </div>
            </div>

            <ToolCTA />
          </motion.div>
        )}
      </AnimatePresence>
    </ToolPageShell>
  );
}
