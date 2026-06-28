"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ToolPageShell, ToolCTA } from "@/components/build/components";
import NextBestAction from "@/components/build/NextBestAction";
import RelatedPagesGrid from "@/components/inner-pages/RelatedPagesGrid";

import Link from "next/link";
import { DIMENSIONS, Dimension } from "./data";
import { getToolState, saveToolState, clearToolState } from "@/components/build/workspaceUtility";

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
  const [isFlushing, setIsFlushing] = useState<boolean>(false);

  // Hydrate from GFF Local Workspace on mount
  useEffect(() => {
    const savedState = getToolState("assessment");
    if (savedState) {
      if (savedState.answers) setAnswers(savedState.answers);
      if (typeof savedState.activeDimensionIndex === "number") {
        setActiveDimensionIndex(savedState.activeDimensionIndex);
      }
      if (typeof savedState.showResult === "boolean") {
        setShowResult(savedState.showResult);
      }
    }
  }, []);

  // Save changes to GFF Local Workspace
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      saveToolState("assessment", { answers, activeDimensionIndex, showResult });
    }
  }, [answers, activeDimensionIndex, showResult]);

  // Local interaction states for results
  const [copied, setCopied] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  const [hoveredRadarIdx, setHoveredRadarIdx] = useState<number | null>(null);

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
    setIsFlushing(true);
    setTimeout(() => {
      setAnswers({});
      setActiveDimensionIndex(0);
      setValidationError(null);
      setIsCompiling(false);
      setShowResult(false);
      setCompilingStep(0);
      clearToolState("assessment");
      setIsFlushing(false);
    }, 450);
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

    // Dynamic Strengths mapping based on actual scores
    const strengths = dimensionBreakdowns
      .filter(d => d.avg >= 2.5)
      .map(d => {
        let desc = "";
        if (d.id === "strategy") desc = "High alignment ensures capital allocation tracks execution metrics closely.";
        else if (d.id === "data") desc = "Clean unstructured semantic storage structures simplify embedding enclaves.";
        else if (d.id === "process") desc = "Clear manual decision handoffs prevent deadlocks during agent execution loops.";
        else if (d.id === "talent") desc = "Internal prompt literacy minimizes transitional engineering blockages.";
        else if (d.id === "governance") desc = "Existing boundary structures satisfy core regulatory redaction standards.";
        else if (d.id === "techstack") desc = "Private server architectures support fully containerized local execution environments.";
        else if (d.id === "leadership") desc = "Calculated risk tolerance empowers engineering to pilot proprietary adaptors.";
        else desc = "Centralized templates standardise pipelines and facilitate sandbox promotion.";
        
        return { name: d.name, desc };
      });

    // Dynamic Risks mapping based on actual scores
    const risks = dimensionBreakdowns
      .filter(d => d.avg < 2.5)
      .map(d => {
        let desc = "";
        if (d.id === "strategy") desc = "Fragmented ad-hoc prioritizing risks budget drift and redundant departmental tooling.";
        else if (d.id === "data") desc = "Legacy database structures introduce hallucination variables and slow context ingestion.";
        else if (d.id === "process") desc = "High manual latency and unmapped workflows choke autonomous multi-agent scaling.";
        else if (d.id === "talent") desc = "Lack of dedicated prompt modeling capacity slows platform integration.";
        else if (d.id === "governance") desc = "Standard API endpoints with open access keys risk accidental telemetry leaks.";
        else if (d.id === "techstack") desc = "Third-party model dependencies expose enterprise systems to latency fluctuations.";
        else if (d.id === "leadership") desc = "Risk-averse capital allocation parameters threaten competitive multi-year stagnation.";
        else desc = "Siloed delivery channels delay software deployment cycles past 6 months.";

        return { name: d.name, desc };
      });

    // Recommended GFF pathway details
    let recommendedPath = {
      id: "garage",
      name: "GFF Garage",
      badge: "Rapid Sandbox & Pilot Scaling",
      color: "text-[#E4000F]",
      borderColor: "border-[#E4000F]/30",
      glowBg: "bg-[#E4000F]/5",
      desc: "Perfect for organizations in early strategic stages. GFF Garage provides rapid, risk-insulated Web Sandboxes and prompt literacy modules. Start by modeling isolated workflows, validating key decision barriers, and securing dedicated executive sponsorship without extensive capital exposure.",
      focus: "Ideation, Pilot Scoping, Basic Sandboxing, and Executive Alignment."
    };

    if (percentage >= 85) {
      recommendedPath = {
        id: "operate",
        name: "GFF Operate",
        badge: "Continuous Symbiosis & Autonomy",
        color: "text-[#00FF9D]",
        borderColor: "border-[#00FF9D]/30",
        glowBg: "bg-[#00FF9D]/5",
        desc: "Designed for world-class digital grids. GFF Operate launches full-duplex human-agent collaborative queues, deploys active security supervisor nodes to constantly inspect schemas at runtime, and runs continuous model guardrails to prevent token drift at 99.9% telemetry success.",
        focus: "Full-Duplex Handoffs, Real-Time Guardrails, Dynamic Optimization, and Active Supervisors."
      };
    } else if (percentage >= 60) {
      recommendedPath = {
        id: "factory",
        name: "GFF Factory",
        badge: "Production Scaling & Fleet Orchestration",
        color: "text-[#3B82F6]",
        borderColor: "border-[#3B82F6]/30",
        glowBg: "bg-[#3B82F6]/5",
        desc: "Tailored for organizations with proven data context and private cloud enclaves. GFF Factory coordinates high-velocity agent fleets, deploys advanced semantic orchestration gateways, and standardizes continuous deployment (CI/CD) of secure agentic microservices across systems.",
        focus: "Multi-Agent Fleet Coordination, Routing Gateways, and Continuous Compliance Integration."
      };
    } else if (percentage >= 35) {
      recommendedPath = {
        id: "foundry",
        name: "GFF Foundry",
        badge: "Contextual Enclaves & Secure Ingestion",
        color: "text-[#E5A93C]",
        borderColor: "border-[#E5A93C]/30",
        glowBg: "bg-[#E5A93C]/5",
        desc: "Optimized for bridging the gap between isolated scripts and standardized platforms. GFF Foundry constructs enterprise-grade private cloud enclaves, implements Context Knowledge Graphs, and sets up secure vector cache servers to ingest legacy repositories cleanly.",
        focus: "Contextual Databases, Sovereign VPC Boundaries, Model Adapters, and Secure Gateways."
      };
    }

    const nextActions = [
      "Launch a local GFF Zero-Trust Sandbox session to safely trace sample multi-system agentic handoffs.",
      "Conduct a structured diagnostic scan of structured and unstructured context repositories to identify vector database prerequisites.",
      "Sync with GFF Labs to explore custom proprietary model adapters designed for strict local data retention rules.",
      "Generate an automated Topological Blueprint and draft an Algorithmic SOW to establish operational milestones."
    ];

    return { percentage, tierName, tierColor, borderAccent, commentary, dimensionBreakdowns, strengths, risks, recommendedPath, nextActions };
  };

  const report = showResult ? calculateResults() : null;

  // Local-only handlers
  const handleCopyReport = () => {
    if (!report) return;
    const dimensionText = report.dimensionBreakdowns.map((d: any) => 
      `- ${d.name}: ${d.avg}/4.0 (${d.status})\n  Recommendation: ${d.rec}`
    ).join("\n");
    const strengthsText = report.strengths.map((s: any) => `- ${s.name}: ${s.desc}`).join("\n");
    const risksText = report.risks.map((r: any) => `- ${r.name}: ${r.desc}`).join("\n");
    const pathText = `Recommended GFF Pathway: ${report.recommendedPath.name}\n${report.recommendedPath.desc}`;

    const reportMarkdown = `
# GFF AI READINESS ASSESSMENT REPORT
Generated on: ${new Date().toLocaleDateString()}
Security Context: LOCAL SECURED TELEMETRY

## OVERALL READINESS SCORE: ${report.percentage}%
Maturity Band: ${report.tierName}

## KEY METRIC DIAGNOSIS
${dimensionText}

## KEY STRENGTHS
${strengthsText || "None identified with average score >= 2.5."}

## DETECTED RISKS
${risksText || "None identified with average score < 2.5."}

## STRATEGIC GFF PATHWAY
${pathText}

---
CONFIDENTIALITY NOTICE: This report was compiled locally in a zero-retention environment and is for directional planning only. No outcomes are guaranteed.
    `.trim();

    navigator.clipboard.writeText(reportMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportArchive = () => {
    if (!report) return;
    const payload = {
      timestamp: new Date().toISOString(),
      score: report.percentage,
      maturity: report.tierName,
      answers,
      dimensionBreakdowns: report.dimensionBreakdowns.map((d: any) => ({
        id: d.id,
        name: d.name,
        score: d.avg,
        status: d.status,
        recommendation: d.rec
      })),
      strengths: report.strengths,
      risks: report.risks,
      path: report.recommendedPath,
      security: "LOCAL VPC COMPLIANT"
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `gff_ai_readiness_report_${report.percentage}pct.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Helper arrays for Native SVG Radar Chart
  const getRadarCoordinates = (dimensionBreakdowns: any[]) => {
    const center = 150;
    const radius = 95;
    return dimensionBreakdowns.map((res, i) => {
      const angleRad = (i * 45 - 90) * (Math.PI / 180);
      const factor = res.avg / 4.0;
      const r = factor * radius;
      const x = center + r * Math.cos(angleRad);
      const y = center + r * Math.sin(angleRad);
      return { x, y, name: res.shortName, score: res.avg, color: res.color, id: res.id };
    });
  };

  const getGridOctagons = () => {
    const center = 150;
    const radius = 95;
    const levels = [0.25, 0.5, 0.75, 1.0];
    return levels.map((level) => {
      const points = Array.from({ length: 8 }).map((_, i) => {
        const angleRad = (i * 45 - 90) * (Math.PI / 180);
        const r = level * radius;
        const x = center + r * Math.cos(angleRad);
        const y = center + r * Math.sin(angleRad);
        return `${x},${y}`;
      }).join(" ");
      return { points, levelLabel: level * 4 };
    });
  };

  const getRadarSpokes = () => {
    const center = 150;
    const radius = 95;
    return Array.from({ length: 8 }).map((_, i) => {
      const angleRad = (i * 45 - 90) * (Math.PI / 180);
      const x = center + radius * Math.cos(angleRad);
      const y = center + radius * Math.sin(angleRad);
      return { x1: center, y1: center, x2: x, y2: y };
    });
  };


  return (
    <ToolPageShell showContact={!showResult}>
      <AnimatePresence mode="wait">
        {/* SECURE CACHE PURGING SCREEN */}
        {isFlushing && (
          <motion.div
            key="flushing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-[550px] flex flex-col items-center justify-center py-16 text-center space-y-5"
          >
            <div className="relative w-14 h-14 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-dashed border-red-500/40 animate-spin" style={{ animationDuration: '8s' }} />
              <div className="absolute inset-2 rounded-full border border-solid border-red-500/15 animate-ping" />
              <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                <svg className="w-4.5 h-4.5 text-red-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest">Wiping Diagnostic Workspace</h3>
              <p className="text-[10px] text-red-500 font-mono">PURGING_SECURE_CLIENT_CACHE</p>
            </div>
            
            {/* Zeroization Telemetry Log */}
            <div className="font-mono text-[9px] text-red-500/60 max-w-md mx-auto space-y-0.5 mt-2 bg-black/40 p-3.5 rounded-xl border border-red-500/10 w-64 text-left">
              <p className="flex justify-between"><span>&gt; WIPING VARIABLE BUFFER...</span><span className="text-red-500 font-bold">OK</span></p>
              <p className="flex justify-between"><span>&gt; ZEROING LOCALSTORE KEYS...</span><span className="text-red-500 font-bold">OK</span></p>
              <p className="flex justify-between"><span>&gt; DE-ALLOCATING MEMORY...</span><span className="text-red-500 font-bold">OK</span></p>
              <p className="text-center text-[8px] text-red-500/40 mt-1 border-t border-red-500/10 pt-1 tracking-wider uppercase">SHIELD ENFORCED</p>
            </div>
          </motion.div>
        )}

        {/* COMPILED LOADING SCREEN */}
        {isCompiling && !isFlushing && (
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
        {!isCompiling && !showResult && !isFlushing && (
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
                {/* <span className="text-[10px] font-mono text-[#009DFF] font-bold uppercase tracking-widest block">
                  BUILD-WITH-GFF // INTERACTIVE DIAGNOSTIC
                </span> */}
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
              <div className="lg:col-span-3 space-y-4 order-2 lg:order-1">
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
              <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
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
                                <motion.button
                                  key={opt.score}
                                  type="button"
                                  onClick={() => handleSelectOption(q.id, opt.score)}
                                  whileHover={{ y: -0.5, scale: 1.005 }}
                                  whileTap={{ scale: 0.995 }}
                                  transition={{ duration: 0.15 }}
                                  className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 group relative cursor-pointer ${
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
                                </motion.button>
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
              {/* <div className="lg:col-span-3 space-y-4 order-3 lg:order-3">
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
                </div> */}

                {/* <div className="p-4 rounded-xl border border-white/5 bg-white/[0.005] text-xs text-white/50 space-y-2">
                  <span className="text-[9px] font-mono text-white/30 uppercase block font-semibold">QUICK JUMP GATES</span>
                  <div className="grid grid-cols-2 gap-1.5 font-mono text-[9px] font-bold">
                    <button type="button" onClick={() => { setValidationError(null); setActiveDimensionIndex(0); }} className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-center uppercase border border-white/5 text-white/70">01. STRATEGY</button>
                    <button type="button" onClick={() => { setValidationError(null); setActiveDimensionIndex(1); }} className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-center uppercase border border-white/5 text-white/70">02. DATA</button>
                    <button type="button" onClick={() => { setValidationError(null); setActiveDimensionIndex(4); }} className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-center uppercase border border-white/5 text-white/70">05. SECURITY</button>
                    <button type="button" onClick={() => { setValidationError(null); setActiveDimensionIndex(5); }} className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-center uppercase border border-white/5 text-white/70">06. STACK</button>
                  </div>
                </div>
              </div> */}
            </div>
          </motion.div>
        )}

        {/* DETAILED RESULTS DASHBOARD */}
        {showResult && report && !isFlushing && (
          <motion.div
            key="results"
            role="region"
            aria-live="polite"
            aria-label="Sovereign AI Readiness Maturity Report"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            {/* Report Header Metadata */}
            <div className="border-b border-white/5 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2 max-w-3xl">
                <span className="text-[10px] font-mono text-[#00FF9D] font-bold uppercase tracking-widest block">
                  DIAGNOSTIC ARCHIVE // SECURED TELEMETRY ANALYTICS
                </span>
                <h1 className="text-3xl lg:text-5xl font-extrabold text-white tracking-tight leading-none">
                  AI Readiness <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#009DFF] via-white to-[#00FF9D]">Maturity Report</span>
                </h1>
                <p className="text-white/50 text-xs font-light leading-relaxed">
                  Enterprise-grade readiness footprint mapped deterministically across all eight technical and strategic operational dimensions. Utilize these metrics to configure local enclaves.
                </p>
              </div>
              
              {/* Local utilities section */}
              <div className="flex flex-wrap gap-2.5 flex-shrink-0 font-mono">
                <button
                  type="button"
                  onClick={handleCopyReport}
                  className="px-4 h-9 rounded-lg border border-white/10 text-[10px] text-white hover:bg-white/5 font-bold uppercase tracking-wider flex items-center gap-1.5 transition"
                >
                  <svg className="w-3.5 h-3.5 text-[#009DFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  <span>{copied ? "COPIED SECURELY" : "COPY REPORT MD"}</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportArchive}
                  className="px-4 h-9 rounded-lg border border-white/10 text-[10px] text-white hover:bg-white/5 font-bold uppercase tracking-wider flex items-center gap-1.5 transition"
                >
                  <svg className="w-3.5 h-3.5 text-[#00FF9D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>{saved ? "ARCHIVE DOWNLOADED" : "EXPORT CONFIG"}</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 h-9 rounded-lg border border-white/10 text-[10px] text-white hover:bg-white/5 font-bold uppercase tracking-wider flex items-center gap-1.5 transition"
                >
                  <svg className="w-3.5 h-3.5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 15H18" />
                  </svg>
                  <span>RE-RUN</span>
                </button>
              </div>
            </div>

            {/* TOP CARD GRID: Score Ring & Maturity Ladder */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Overall Score Ring */}
              <div className="lg:col-span-4 p-6 rounded-2xl border border-white/5 bg-[#030306]/95 flex flex-col items-center justify-center text-center space-y-5 font-mono relative overflow-hidden group">
                {/* Decorative mesh glows */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#009DFF]/4 via-transparent to-transparent pointer-events-none" />
                <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#00FF9D]/3 rounded-full blur-2xl pointer-events-none group-hover:bg-[#00FF9D]/6 transition-all duration-500" />
                
                {/* Header spec tags */}
                <div className="w-full flex items-center justify-between border-b border-white/[0.04] pb-2 z-10">
                  <span className="text-[8px] text-white/40 uppercase tracking-wider font-semibold">DIAGNOSTIC RADIAL GAUGE</span>
                  <span className="text-[8px] text-[#00FF9D] font-bold flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-[#00FF9D] animate-ping" />
                    LIVE MODEL V2.8
                  </span>
                </div>
                
                <span className="text-[9px] text-white/50 uppercase tracking-widest font-bold z-10">OVERALL INTEGRATION SCORE</span>
                
                <div className="relative w-48 h-48 flex items-center justify-center">
                  {/* Outer digital tick marks */}
                  <div className="absolute inset-0 w-full h-full rounded-full border border-dashed border-white/[0.02] animate-spin" style={{ animationDuration: '40s' }} />
                  
                  <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                    {/* Outer Calibration Ring */}
                    <circle cx="96" cy="96" r="88" stroke="rgba(255,255,255,0.02)" strokeWidth="1" fill="transparent" />
                    <circle cx="96" cy="96" r="84" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="3 3" fill="transparent" />
                    
                    {/* Base circle track */}
                    <circle cx="96" cy="96" r="76" stroke="rgba(255,255,255,0.03)" strokeWidth="8" fill="transparent" />
                    
                    {/* Active score ring */}
                    <motion.circle 
                      cx="96" 
                      cy="96" 
                      r="76" 
                      stroke="url(#scoreRingGradientPremium)" 
                      strokeWidth="8" 
                      fill="transparent" 
                      strokeDasharray={477.5}
                      initial={{ strokeDashoffset: 477.5 }}
                      animate={{ strokeDashoffset: 477.5 - (477.5 * report.percentage) / 100 }}
                      transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                      strokeLinecap="round"
                      style={{ filter: "drop-shadow(0 0 4px rgba(0, 255, 157, 0.15))" }}
                    />
                    
                    {/* Inner tracking dotted ring */}
                    <circle cx="96" cy="96" r="66" stroke="rgba(0, 157, 255, 0.08)" strokeWidth="1" strokeDasharray="2 4" fill="transparent" />
                    <circle cx="96" cy="96" r="62" stroke="rgba(255,255,255,0.02)" strokeWidth="1" fill="transparent" />
                    
                    <defs>
                      <linearGradient id="scoreRingGradientPremium" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#009DFF" />
                        <stop offset="60%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#00FF9D" />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  {/* Glowing center text readouts */}
                  <div className="text-center z-10 space-y-0.5">
                    <span className="text-5xl font-black text-white block tracking-tighter drop-shadow-md">
                      {report.percentage}%
                    </span>
                    <span className="text-[8px] text-white/40 uppercase tracking-widest block font-extrabold">READINESS METRIC</span>
                  </div>
                  
                  {/* Decorative Corner crosshair ticks */}
                  <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t border-l border-white/25" />
                  <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t border-r border-white/25" />
                  <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b border-l border-white/25" />
                  <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b border-r border-white/25" />
                </div>

                <div className="text-center space-y-1 z-10 pt-2 border-t border-white/[0.04] w-full">
                  <span className={`text-xs font-extrabold tracking-wide uppercase block ${report.tierColor}`}>
                    {report.tierName}
                  </span>
                  <div className="flex items-center justify-center gap-4 text-[7px] text-white/35 font-mono pt-1">
                    <span>SECTOR: ENCLAVE VPC</span>
                    <span className="w-1 h-1 rounded-full bg-white/15" />
                    <span>CALIBRATION: ACTIVE</span>
                  </div>
                </div>
              </div>
              {/* Maturity Ladder Visual */}
              <div className="lg:col-span-4 p-6 rounded-2xl border border-white/5 bg-[#030306]/95 flex flex-col justify-between space-y-4 font-mono">
                <span className="text-[9px] text-white/40 uppercase tracking-widest font-semibold">MATURITY TIER LADDER</span>
                
                <div className="space-y-2.5 my-auto">
                  {[
                    { level: "IV", name: "Sovereign Agentic Grid", range: "85% - 100%", color: "text-[#00FF9D]", active: report.percentage >= 85 },
                    { level: "III", name: "Strategic Federated Mesh", range: "60% - 84%", color: "text-[#3B82F6]", active: report.percentage >= 60 && report.percentage < 85 },
                    { level: "II", name: "Experimental Siloed Enclave", range: "35% - 59%", color: "text-[#E5A93C]", active: report.percentage >= 35 && report.percentage < 60 },
                    { level: "I", name: "Reactive Discovery Sandbox", range: "0% - 34%", color: "text-[#E4000F]", active: report.percentage < 35 }
                  ].map((tier) => (
                    <div 
                      key={tier.level}
                      className={`p-2.5 rounded-xl border flex items-center justify-between transition-all relative ${
                        tier.active 
                          ? "bg-white/[0.02] border-white/10" 
                          : "border-transparent opacity-30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded border flex items-center justify-center text-[10px] font-extrabold ${
                          tier.active ? "bg-white/5 border-white/15" : "border-white/5"
                        }`}>
                          {tier.level}
                        </span>
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-white font-bold block leading-none">{tier.name}</span>
                          <span className="text-[8px] text-white/30 block leading-none">{tier.range} range</span>
                        </div>
                      </div>

                      {tier.active && (
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00FF9D] animate-pulse" />
                          <span className="text-[8px] font-bold text-[#00FF9D] tracking-tighter">CURRENT</span>
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Executive Commentary Card */}
              <div className="lg:col-span-4 p-6 rounded-2xl border border-white/5 bg-[#030306]/95 flex flex-col justify-between space-y-4">
              </div>
            </div>

            {/* INTERACTIVE RADAR CHART SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Radar Chart SVG panel */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl border border-white/5 bg-[#030306]/95 relative overflow-hidden min-h-[360px]">
                <div className="absolute top-4 left-4 font-mono text-[9px] text-white/35 uppercase tracking-wider">
                  8-DIMENSIONAL MATURITY RADAR
                </div>

                <div className="w-full max-w-[280px] aspect-square relative z-10">
                  <svg className="w-full h-full" viewBox="0 0 300 300">
                    <defs>
                      <radialGradient id="radarCenterGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#009DFF" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                      </radialGradient>
                    </defs>

                    <circle cx="150" cy="150" r="100" fill="url(#radarCenterGlow)" />

                    {getGridOctagons().map((oct, oIdx) => (
                      <polygon 
                        key={oIdx}
                        points={oct.points}
                        fill="none"
                        stroke="rgba(255,255,255,0.03)"
                        strokeWidth="1"
                      />
                    ))}

                    {getRadarSpokes().map((spoke, sIdx) => (
                      <line 
                        key={sIdx}
                        x1={spoke.x1}
                        y1={spoke.y1}
                        x2={spoke.x2}
                        y2={spoke.y2}
                        stroke="rgba(255,255,255,0.02)"
                        strokeWidth="1.5"
                        strokeDasharray={sIdx % 2 === 1 ? "2,2" : undefined}
                      />
                    ))}

                    <motion.polygon 
                      points={getRadarCoordinates(report.dimensionBreakdowns).map(c => `${c.x},${c.y}`).join(" ")}
                      fill="rgba(0, 157, 255, 0.12)"
                      stroke="#009DFF"
                      strokeWidth="2.5"
                      initial={{ opacity: 0, scale: 0.85, originX: "150px", originY: "150px" }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    />

                    {getRadarCoordinates(report.dimensionBreakdowns).map((c, idx) => {
                      const isHovered = hoveredRadarIdx === idx;
                      return (
                        <g key={idx}>
                          <motion.circle 
                            cx={c.x}
                            cy={c.y}
                            r={isHovered ? "7" : "4"}
                            fill={c.color}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.4 + idx * 0.08, type: "spring", stiffness: 180, damping: 15 }}
                            className="transition-all duration-300 cursor-pointer"
                            onMouseEnter={() => setHoveredRadarIdx(idx)}
                            onMouseLeave={() => setHoveredRadarIdx(null)}
                          />
                          <circle 
                            cx={c.x}
                            cy={c.y}
                            r="1.5"
                            fill="#020204"
                            pointerEvents="none"
                          />
                        </g>
                      );
                    })}
                    {getRadarCoordinates(report.dimensionBreakdowns).map((c, idx) => {
                      const angleRad = (idx * 45 - 90) * (Math.PI / 180);
                      const labelRadius = 114;
                      const lx = 150 + labelRadius * Math.cos(angleRad);
                      const ly = 150 + labelRadius * Math.sin(angleRad);
                      const isHovered = hoveredRadarIdx === idx;

                      return (
                        <text
                          key={idx}
                          x={lx}
                          y={ly + 3}
                          textAnchor="middle"
                          className={`font-mono text-[8px] font-bold transition-all ${
                            isHovered ? "fill-white" : "fill-white/30"
                          }`}
                        >
                          {c.name.toUpperCase()}
                        </text>
                      );
                    })}

                    <circle 
                      cx="150" 
                      cy="150" 
                      r="32" 
                      fill="#020204" 
                      stroke="rgba(255,255,255,0.08)"
                      strokeWidth="1.5"
                    />

                    {hoveredRadarIdx !== null ? (
                      <>
                        <text x="150" y="145" textAnchor="middle" className="font-mono text-[7px] fill-white/40 tracking-wider">
                          {report.dimensionBreakdowns[hoveredRadarIdx].shortName.toUpperCase()}
                        </text>
                        <text 
                          x="150" 
                          y="159" 
                          textAnchor="middle" 
                          className="font-mono text-xs font-extrabold"
                          style={{ fill: report.dimensionBreakdowns[hoveredRadarIdx].color }}
                        >
                          {report.dimensionBreakdowns[hoveredRadarIdx].avg} / 4.0
                        </text>
                      </>
                    ) : (
                      <>
                        <text x="150" y="146" textAnchor="middle" className="font-mono text-[7px] fill-white/30 tracking-widest uppercase">
                          GFF DIAG
                        </text>
                        <text x="150" y="157" textAnchor="middle" className="font-mono text-[9px] font-bold fill-white tracking-tight">
                          METRIC INDEX
                        </text>
                      </>
                    )}
                  </svg>
                </div>

                <div className="absolute bottom-4 text-[9px] font-mono text-white/20">
                  HOVER MARKERS TO QUERY DIMENSION OVERLAYS
                </div>
              </div>
              {/* Strengths & Risks */}
              <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                {/* Column 1: Strengths */}
                <div className="p-6 rounded-2xl border border-white/5 bg-[#030306]/95 flex flex-col space-y-4 h-full">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                    <span className="p-1 rounded bg-[#00FF9D]/10 border border-[#00FF9D]/20 text-[#00FF9D]">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </span>
                    <span className="text-xs font-bold text-white font-mono tracking-wider">KEY STRENGTHS</span>
                  </div>

                  <div className="space-y-4 overflow-y-auto max-h-[250px] pr-1 scrollbar-thin">
                    {report.strengths.length > 0 ? (
                      report.strengths.map((str, sIdx) => (
                        <div key={sIdx} className="space-y-1">
                          <span className="text-[10px] font-bold text-white block font-mono">{str.name}</span>
                          <p className="text-white/50 text-[11px] leading-relaxed font-light">{str.desc}</p>
                        </div>
                      ))
                    ) : (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-white block font-mono">POTENTIAL DISCOVERY</span>
                        <p className="text-white/50 text-[11px] leading-relaxed font-light">
                          Your active participation in compiling this local assessment shows critical risk foresight before committing enterprise capital.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Column 2: Risks */}
                <div className="p-6 rounded-2xl border border-white/5 bg-[#030306]/95 flex flex-col space-y-4 h-full">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                    <span className="p-1 rounded bg-[#E4000F]/10 border border-[#E4000F]/20 text-[#E4000F]">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </span>
                    <span className="text-xs font-bold text-white font-mono tracking-wider">DETECTED RISKS</span>
                  </div>

                  <div className="space-y-4 overflow-y-auto max-h-[250px] pr-1 scrollbar-thin">
                    {report.risks.length > 0 ? (
                      report.risks.map((risk, rIdx) => (
                        <div key={rIdx} className="space-y-1">
                          <span className="text-[10px] font-bold text-amber-500 block font-mono">{risk.name}</span>
                          <p className="text-white/50 text-[11px] leading-relaxed font-light">{risk.desc}</p>
                        </div>
                      ))
                    ) : (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-white block font-mono">RESIDUAL PLATFORM DRIFT</span>
                        <p className="text-white/50 text-[11px] leading-relaxed font-light">
                          Even optimized structures carry risk. Ongoing third-party API model changes and latency shifts require continuous guardrails.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>



            {/* Bento Grid layout */}
            {/* RECOMMENDED GFF ENGAGEMENT MATRIX */}
            <div className="space-y-4">
              <div className="flex items-baseline justify-between border-b border-white/5 pb-3">
                <h3 className="text-xs font-mono text-white/40 uppercase tracking-widest font-semibold">
                  RECOMMENDED GFF PATHWAY MATRIX
                </h3>
                <span className="text-[9px] font-mono text-white/30 uppercase">4 STAGES OF ENGAGEMENT</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    id: "garage",
                    name: "GFF Garage",
                    accent: "#E4000F",
                    badge: "Rapid Pilot Scoping",
                    desc: "Construct high-impact proofs of value in quick, risk-insulated sandboxes to establish operational blueprints before committing high CAPEX.",
                    focus: "Sovereign Blueprints, Prompt Modules, Sandbox Trials"
                  },
                  {
                    id: "foundry",
                    name: "GFF Foundry",
                    accent: "#E5A93C",
                    badge: "Context & Ingestion",
                    desc: "Integrate specialized local vector cache nodes and model enclaves, preparing context boundaries to prevent public leakage risks.",
                    focus: "Contextual Graphs, Sovereign VPCs, Secure Gateways"
                  },
                  {
                    id: "factory",
                    name: "GFF Factory",
                    accent: "#3B82F6",
                    badge: "Fleet Deployment",
                    desc: "Scale multi-agent fleets with custom semantic routing gateways, establishing robust CI/CD sandboxes to compress release cycles.",
                    focus: "Fleet DAG Orchestration, Containerization, Automated Tests"
                  },
                  {
                    id: "operate",
                    name: "GFF Operate",
                    accent: "#00FF9D",
                    badge: "Continuous Guardrails",
                    desc: "Deploy full-duplex human-agent networks supported by active security supervisor nodes to constantly inspect schemas at 99.9% uptime.",
                    focus: "Live Schema Supervision, Drift Inspection, Feedback Loops"
                  }
                ].map((path) => {
                  const isRecommended = report.recommendedPath.id === path.id;

                  return (
                    <div
                      key={path.id}
                      className={`p-6 rounded-2xl border transition-all flex flex-col justify-between space-y-4 relative overflow-hidden group ${
                        isRecommended 
                          ? "bg-white/[0.03] border-white/15 shadow-[0_0_20px_rgba(255,255,255,0.01)]" 
                          : "bg-[#030306]/90 border-white/5 opacity-50 hover:opacity-75"
                      }`}
                      style={isRecommended ? { borderColor: `${path.accent}30` } : undefined}
                    >
                      {/* Recommended Header Overlay Badge */}
                      {isRecommended && (
                        <div 
                          className="absolute top-0 right-0 left-0 py-1 text-center font-mono text-[7px] font-extrabold tracking-widest text-black uppercase"
                          style={{ backgroundColor: path.accent }}
                        >
                          RECOMMENDED ENGAGEMENT PATHWAY
                        </div>
                      )}

                      <div className="space-y-2 pt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white tracking-tight">{path.name}</span>
                          <span className="text-[7.5px] font-mono px-1.5 py-0.5 rounded border border-white/10 uppercase text-white/50">
                            {path.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-white/50 leading-relaxed font-light">
                          {path.desc}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-white/5 space-y-1">
                        <span className="text-[7px] font-mono uppercase tracking-widest block" style={{ color: path.accent }}>
                          CORE OPERATIONAL FOCUS
                        </span>
                        <p className="text-[10px] text-white/70 font-mono tracking-tight leading-normal font-light">
                          {path.focus}
                        </p>
                      </div>

                      {/* Small glowing strip in recommended card */}
                      {isRecommended && (
                        <div 
                          className="absolute bottom-0 left-0 right-0 h-[2px]"
                          style={{ backgroundColor: path.accent }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

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

            {/* ACTIONABLE NEXT STEPS ROADMAP */}
            <div className="p-6 lg:p-8 rounded-2xl border border-white/5 bg-[#030306]/95 space-y-6">
              <div className="border-b border-white/5 pb-3">
                <span className="text-[9px] font-mono text-[#00FF9D] font-bold uppercase tracking-widest block">
                  ACTIONABLE IMPLEMENTATION ROADMAP
                </span>
                <h4 className="text-lg font-bold text-white tracking-tight mt-1">
                  Immediate Directional Steps
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {report.nextActions.map((action, aIdx) => (
                  <div key={aIdx} className="flex gap-4 p-4 rounded-xl border border-white/[0.03] bg-white/[0.005] items-start">
                    <span className="font-mono text-xs font-bold text-[#009DFF] bg-[#009DFF]/5 border border-[#009DFF]/10 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                      0{aIdx + 1}
                    </span>
                    <p className="text-[11px] text-white/75 leading-relaxed font-light pt-0.5">
                      {action}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* PRE-GOVERNED CALLS TO ACTIONS */}
            <div className="p-8 rounded-2xl border border-white/5 bg-[#030305] flex flex-col md:flex-row items-center justify-between gap-8 group overflow-hidden relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#009DFF]/5 blur-3xl pointer-events-none rounded-full" />
              <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

              <div className="space-y-2 max-w-2xl relative z-10 text-center md:text-left font-sans">
                <span className="text-[9px] font-mono text-[#00FF9D] font-bold uppercase tracking-widest block">
                  SOVEREIGN SYSTEM ELEVATION
                </span>
                <h3 className="text-xl lg:text-2xl font-bold text-white tracking-tight">
                  Ready to Configure Your Topological Blueprint?
                </h3>
                <p className="text-white/50 text-xs font-light leading-relaxed">
                  Map custom multi-agent execution graphs, compile detailed proposal statements of work, or sync with GFF AI engineers to construct your private enterprise fleet.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 relative z-10 w-full md:w-auto justify-center md:justify-end font-sans">
                <Link 
                  href="/build/blueprint"
                  className="px-6 h-12 rounded-xl text-xs font-bold uppercase font-mono bg-gradient-to-r from-[#009DFF] to-[#00FF9D] text-black hover:opacity-90 flex items-center justify-center gap-1.5 transition shadow-[0_0_20px_rgba(0,157,255,0.15)] min-w-[170px]"
                >
                  <span>GENERATE BLUEPRINT</span>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
                <Link 
                  href="/build/talk"
                  className="px-6 h-12 rounded-xl text-xs font-bold uppercase font-mono border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white flex items-center justify-center min-w-[170px] transition"
                >
                  TALK TO AGENT
                </Link>
              </div>
            </div>

            <NextBestAction currentTool="assessment" />
            <ToolCTA />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Strategic Pathways & Related Links */}
      <div className="pt-12 mt-12 border-t border-white/5 print:hidden">
        <RelatedPagesGrid links={[
          {
            title: "Blueprint Generator",
            tag: "Next Step • Architect Graph",
            desc: "Translate your readiness scores into a functional, secure agentic orchestration diagram with exact node routing.",
            href: "/build/blueprint"
          },
          {
            title: "Talk to Agent",
            tag: "Next Step • Interactive Synapse",
            desc: "Sync directly with GFF AI lead engineers to review core architecture blueprints and secure integration strategies.",
            href: "/build/talk"
          },
          {
            title: "Assessment Mesh Platform",
            tag: "GFF Platform Module",
            desc: "Continuous sovereign validation framework auditing and tracing organizational readiness metrics.",
            href: "/platforms/assessment-mesh"
          },
          {
            title: "Sovereign Compliance & Governance",
            tag: "Core GFF Capability",
            desc: "Zero-retention data filtering and enterprise-grade policy auditing protocols.",
            href: "/capabilities/governance"
          }
        ]} />
      </div>
    </ToolPageShell>
  );
}
