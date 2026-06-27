"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import SectionHeading from "@/components/SectionHeading";
import Link from "next/link";

interface OutcomeThemes {
  fasterDecisionMaking: string;
  reducedManualEffort: string;
  betterKnowledgeAccess: string;
  improvedComplianceWorkflows: string;
  improvedEmployeeExperience: string;
}

interface ArchitectureNode {
  id: string;
  label: string;
  desc: string;
  x: number;
  y: number;
}

interface ConsoleLog {
  time: string;
  type: "system" | "event" | "agent" | "success";
  msg: string;
}

interface RepresentativePattern {
  id: string;
  name: string;
  category: string;
  description: string;
  outcomeThemes: OutcomeThemes;
  nodes: ArchitectureNode[];
  connections: { from: string; to: string }[];
  logs: ConsoleLog[];
}

const REPRESENTATIVE_PATTERNS: RepresentativePattern[] = [
  {
    id: "banking",
    name: "Global Banking Transformation",
    category: "Financial Operations & Sovereignty",
    description: "Standardizing stateful multi-agent architectures to orchestrate cross-border trade confirmation desk operations, collateral cycles, and compliance protocols across legacy banking ledgers.",
    outcomeThemes: {
      fasterDecisionMaking: "Automated credit review latency is minimized via parallel ledger analysis and risk lookups.",
      reducedManualEffort: "Sovereign validation agents directly parse multi-currency transaction records, eliminating document entry.",
      betterKnowledgeAccess: "Consolidates compliance histories across cross-border desks into a single semantic lookup system.",
      improvedComplianceWorkflows: "Enforces continuous checks on international transactions against current Basel regulations.",
      improvedEmployeeExperience: "Risk administrators shift from paper checklists to strategic exception resolution queues."
    },
    nodes: [
      { id: "ing", label: "Core Banking Gateway", desc: "Ingests transaction files and ledger triggers safely.", x: 15, y: 50 },
      { id: "orch", label: "Multi-Agent Coordinator", desc: "Manages concurrent validation and consensus nodes.", x: 40, y: 50 },
      { id: "guard", label: "Sovereignty Compliance", desc: "Runs continuous policy and regulation validations.", x: 65, y: 50 },
      { id: "exec", label: "Automated Writeback", desc: "Executes final transactional writebacks to core ledgers.", x: 90, y: 50 }
    ],
    connections: [
      { from: "ing", to: "orch" },
      { from: "orch", to: "guard" },
      { from: "guard", to: "exec" }
    ],
    logs: [
      { time: "09:04:12", type: "system", msg: "Establishing secure session with Core Ledger API..." },
      { time: "09:04:13", type: "event", msg: "Inbound trade request received: EUR transaction ID #TX-9418" },
      { time: "09:04:15", type: "agent", msg: "[Credit Agent] Inquiring liquidity from regional vaults..." },
      { time: "09:04:17", type: "agent", msg: "[Compliance Agent] Querying Basel III rules engines..." },
      { time: "09:04:20", type: "system", msg: "Consensus validated. Triggering trade writebacks." },
      { time: "09:04:21", type: "success", msg: "Ledger writeback successful. Transaction closed." }
    ]
  },
  {
    id: "healthcare",
    name: "Healthcare Knowledge Operations",
    category: "Clinical Intelligence & Graphs",
    description: "Unifying fragmented patient data records, pharmacology registries, and active clinical trial databases into a highly secured semantic patient knowledge graph environment.",
    outcomeThemes: {
      fasterDecisionMaking: "Enables clinical teams to immediately assess experimental trial criteria against composite patient records.",
      reducedManualEffort: "Automates complex patient history parsing and structures clinical observations directly into registries.",
      betterKnowledgeAccess: "Synthesizes disconnected scientific publications and health records into a single traversable graph.",
      improvedComplianceWorkflows: "Strict data privacy layers ensure every patient query complies with HIPAA guidelines automatically.",
      improvedEmployeeExperience: "Relieves clinical investigators from hours of manual cross-referencing, providing citation links."
    },
    nodes: [
      { id: "ehr", label: "EHR Secure Gateway", desc: "Integrates patient records with high-security privacy filters.", x: 15, y: 50 },
      { id: "graph", label: "Semantic Mapping Engine", desc: "Extracts clinical entities and links relationships.", x: 40, y: 50 },
      { id: "repo", label: "Knowledge Graph", desc: "Traverses active treatments, medications, and clinical profiles.", x: 65, y: 50 },
      { id: "triage", label: "Investigator Dashboard", desc: "Secure portal for unified clinical queries and provenance.", x: 90, y: 50 }
    ],
    connections: [
      { from: "ehr", to: "graph" },
      { from: "graph", to: "repo" },
      { from: "repo", to: "triage" }
    ],
    logs: [
      { time: "11:20:01", type: "system", msg: "Connecting to EHR secure registry..." },
      { time: "11:20:03", type: "event", msg: "Query ingested: Trial eligibility for patient #PX-8821" },
      { time: "11:20:04", type: "agent", msg: "[Extraction Agent] Aggregating biomarkers and lab histories..." },
      { time: "11:20:06", type: "agent", msg: "[Semantic Graph] Traversing clinical knowledge graph (420K nodes)..." },
      { time: "11:20:10", type: "agent", msg: "[Privacy Guard] Enforcing data consent boundary checks..." },
      { time: "11:20:11", type: "success", msg: "Inquiry resolved. Synthesis delivered with provenance links." }
    ]
  },
  {
    id: "manufacturing",
    name: "Manufacturing AI Factory",
    category: "IoT Telemetry & Industrial Automation",
    description: "Modernizing manufacturing assembly pipelines and global logistics networks by deploying agent networks directly onto shop-floor edge computing servers and machine telemetry gateways.",
    outcomeThemes: {
      fasterDecisionMaking: "Processes live edge telemetry in milliseconds to execute safety shutoffs and routing changes instantly.",
      reducedManualEffort: "Automates parts reservation lists, repair ticket drafts, and warehouse stock requisitions.",
      betterKnowledgeAccess: "Centralizes machine logs, enabling technical staff to search machine historical anomalies in normal language.",
      improvedComplianceWorkflows: "Ensures continuous safety monitoring against strict environmental and operational guidelines.",
      improvedEmployeeExperience: "Maintenance technicians receive automated troubleshooting briefs, sparing them from sorting through PDFs."
    },
    nodes: [
      { id: "edge", label: "Industrial IoT Gateway", desc: "Streams live high-frequency telemetry from sensors.", x: 15, y: 50 },
      { id: "diag", label: "Predictive Diagnosis Agent", desc: "Identifies anomalies and computes wear indicators.", x: 40, y: 50 },
      { id: "stock", label: "Logistics Coordinator", desc: "Coordinates parts inventory across regional nodes.", x: 65, y: 50 },
      { id: "maint", label: "ERP Maintenance Bridge", desc: "Generates automated work orders and dispatches.", x: 90, y: 50 }
    ],
    connections: [
      { from: "edge", to: "diag" },
      { from: "diag", to: "stock" },
      { from: "stock", to: "maint" }
    ],
    logs: [
      { time: "14:15:30", type: "system", msg: "Connected to Factory Assembly Line 4 Edge Gateway..." },
      { time: "14:15:32", type: "event", msg: "Telemetry alert: Turbine vibration spike registered (490Hz)" },
      { time: "14:15:33", type: "agent", msg: "[Diagnostics] Analyzing vibration curves against machine logs..." },
      { time: "14:15:36", type: "agent", msg: "[Logistics] Interrogating local warehouse replacement registries..." },
      { time: "14:15:39", type: "system", msg: "OSHA safety verified. Dispatched preventive work order." },
      { time: "14:15:40", type: "success", msg: "Work order confirmed. Parts reserved in Row 4. Zero downtime." }
    ]
  },
  {
    id: "retail",
    name: "Retail Agent Operations",
    category: "Omnichannel Logic & Forecasting",
    description: "Aligning digital shopper behavior tracking, inventory redistribution pipelines, and automated multi-channel localized promotions into a cohesive retail demand fulfillment system.",
    outcomeThemes: {
      fasterDecisionMaking: "Reroutes supply-chain shipments dynamically based on localized retail demand fluctuations.",
      reducedManualEffort: "Replaces traditional manual inventory reports with autonomous re-routing distribution lists.",
      betterKnowledgeAccess: "Bridges logistics databases, historical promotions, and online search metrics into one engine.",
      improvedComplianceWorkflows: "Ensures automated compliance audits on localized promotional pricing rules dynamically.",
      improvedEmployeeExperience: "Fulfillment planners manage inventory via natural language inquiries rather than dense sheets."
    },
    nodes: [
      { id: "omni", label: "Omnichannel Ingestion", desc: "Integrates point-of-sale data and online cart feeds.", x: 15, y: 50 },
      { id: "demand", label: "Demand Forecaster Agent", desc: "Predicts local depletion risk and behavior trends.", x: 40, y: 50 },
      { id: "logis", label: "Fulfillment Logic Core", desc: "Optimizes warehouse inventory reallocations.", x: 65, y: 50 },
      { id: "promo", label: "Sovereign Campaign Optimizer", desc: "Triggers and optimizes local marketing messages.", x: 90, y: 50 }
    ],
    connections: [
      { from: "omni", to: "demand" },
      { from: "demand", to: "logis" },
      { from: "logis", to: "promo" }
    ],
    logs: [
      { time: "16:40:45", type: "system", msg: "Syncing regional omnichannel demand registers..." },
      { time: "16:40:46", type: "event", msg: "Sales spike detected: winter outerwear range (Northeast Hub)" },
      { time: "16:40:48", type: "agent", msg: "[Forecaster] Stock depletion risk forecasted within 72 hours." },
      { time: "16:40:49", type: "agent", msg: "[Logistics] Re-routing 1,400 surplus units from East Hub." },
      { time: "16:40:53", type: "agent", msg: "[Promo] Deploying local targeted consumer campaigns." },
      { time: "16:40:55", type: "success", msg: "Logistics update confirmed. Target campaign activated." }
    ]
  }
];

export default function ClientSuccessSection() {
  const [activePatternId, setActivePatternId] = useState<string>("banking");
  const [activeTab, setActiveTab] = useState<"architecture" | "video">("architecture");
  const [hoveredNode, setHoveredNode] = useState<ArchitectureNode | null>(null);
  
  const [streamedLogs, setStreamedLogs] = useState<ConsoleLog[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playSpeed, setPlaySpeed] = useState<number>(1000);
  const logIndexRef = useRef<number>(0);
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);

  const activePattern = REPRESENTATIVE_PATTERNS.find(p => p.id === activePatternId) || REPRESENTATIVE_PATTERNS[0];

  useEffect(() => {
    setHoveredNode(null);
  }, [activePatternId]);

  const startLogStream = useCallback(() => {
    if (timerIdRef.current) clearInterval(timerIdRef.current);

    timerIdRef.current = setInterval(() => {
      const logs = activePattern.logs;
      const index = logIndexRef.current;

      if (index < logs.length) {
        setStreamedLogs(prev => [...prev, logs[index]]);
        logIndexRef.current = index + 1;
      } else {
        setStreamedLogs([logs[0]]);
        logIndexRef.current = 1;
      }
    }, playSpeed);
}, [playSpeed, activePatternId]);
  useEffect(() => {
  setStreamedLogs([activePattern.logs[0]]);
  logIndexRef.current = 1;

  if (timerIdRef.current) {
    clearInterval(timerIdRef.current);
  }

  if (isPlaying) {
    startLogStream();
  }

  return () => {
    if (timerIdRef.current) {
      clearInterval(timerIdRef.current);
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [activePatternId, isPlaying, playSpeed]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      if (timerIdRef.current) clearInterval(timerIdRef.current);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
  };

  const handleResetStream = () => {
    setStreamedLogs([activePattern.logs[0]]);
    logIndexRef.current = 1;
    if (isPlaying) {
      startLogStream();
    }
  };

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
className="w-full bg-[#020202] px-6 lg:px-16 mt-25 lg:pt-0 lg:pb-24 py-10 relative overflow-hidden">      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 100% 50%, #E9882805 0%, transparent 40%)" }} />
      
      <div className="max-w-[1795px] mx-auto relative z-10">
        
        {/* Section Heading */}
        <div className="mb-10">
  <SectionHeading
    title={
      <h2 className="text-[32px] sm:text-[44px] leading-none font-bold text-center uppercase text-white tracking-widest whitespace-nowrap">
        CLIENT <span className="text-[#E98828]">SUCCESS</span>
      </h2>
    }
    titleClassName="text-center"
    dividerWidthClassName="w-[300px]"
  />

  <div className="mt-5 max-w-[900px] mx-auto text-center">
    {/* <span className="text-[10px] font-mono uppercase tracking-widest text-[#E98828] border border-[#E98828]/20 px-2 py-0.5 rounded bg-[#E98828]/5 inline-block">
      REPRESENTATIVE BLUEPRINTS
    </span> */}

    <p className="mt-4 text-[#A0A0A0] text-[14px] sm:text-[16px] font-light leading-relaxed">
      To safeguard client confidentiality, we publish exclusively anonymized
      representative architecture blueprints actively deployed in sovereign
      enterprise operations. No fictional client entities, no inflated marketing
      stats.
    </p>
  </div>
</div>

        {/* Categories Tab Selector */}
        <div className="border-b border-white/5 mb-12 overflow-x-auto scrollbar-none flex gap-2 md:gap-4 pb-2">
          {REPRESENTATIVE_PATTERNS.map((pattern) => {
            const isActive = pattern.id === activePatternId;
            return (
              <button
                key={pattern.id}
                onClick={() => setActivePatternId(pattern.id)}
                className={`flex items-center gap-3 px-5 py-3.5 rounded-t-xl border-t border-x transition-all shrink-0 cursor-pointer text-left ${
                  isActive 
                    ? "bg-[#0A0A0A] border-white/10 text-[#E98828] shadow-lg" 
                    : "bg-transparent border-transparent text-[#707070] hover:text-[#A0A0A0]"
                }`}
              >
                <div className="text-sm">
                  <span className="text-[10px] font-mono tracking-widest uppercase block text-[#707070]">
                    {pattern.category}
                  </span>
                  <span className="text-[14px] font-bold tracking-tight">
                    {pattern.name}
                  </span>
                </div>
                {isActive && (
                  <span className="relative flex h-2 w-2 ml-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E98828] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E98828]"></span>
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Main Grid Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left panel: Narrative Case Study Details and Outcomes Matrix */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
            
            {/* Case Study Details */}
            <div className="bg-[#060606] border border-white/5 rounded-2xl p-6 lg:p-8">
              <span className="text-[10px] font-mono text-[#E98828] tracking-widest uppercase block mb-1">
                REPRESENTATIVE CASE STUDY
              </span>
              <h3 className="text-2xl font-bold tracking-tight text-white mb-4">
                {activePattern.name}
              </h3>
              <p className="text-[#A0A0A0] text-[15px] font-light leading-relaxed">
                {activePattern.description}
              </p>
            </div>

            {/* Outcome Matrix Block */}
            <div className="bg-[#060606] border border-white/5 rounded-2xl p-6 lg:p-8">
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                <h4 className="text-xs font-mono uppercase tracking-widest text-[#707070]">
                  BUSINESS OUTCOME THEMES
                </h4>
                <span className="text-[10px] font-mono text-[#707070]">
                  VERIFIED DEPLOYED SYSTEM CAPABILITIES
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {Object.entries(activePattern.outcomeThemes).map(([key, outcome]) => {
                  let title = "";
                  switch (key) {
                    case "fasterDecisionMaking":
                      title = "Faster Decision Making";
                      break;
                    case "reducedManualEffort":
                      title = "Reduced Manual Effort";
                      break;
                    case "betterKnowledgeAccess":
                      title = "Better Knowledge Access";
                      break;
                    case "improvedComplianceWorkflows":
                      title = "Improved Compliance Workflows";
                      break;
                    case "improvedEmployeeExperience":
                      title = "Improved Employee Experience";
                      break;
                  }

                  return (
                    <div key={key} className="p-4 rounded-xl border border-white/5 bg-[#0A0A0A] hover:border-white/10 hover:bg-[#0E0E0E] transition-all group">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E98828]" />
                        <h5 className="text-[13px] font-bold tracking-tight text-white group-hover:text-[#E98828] transition-colors">
                          {title}
                        </h5>
                      </div>
                      <p className="text-[12px] text-[#808080] font-light leading-relaxed">
                        {outcome}
                      </p>
                    </div>
                  );
                })}

                {/* Directory Link Card */}
                <div className="p-4 rounded-xl border border-[#E98828]/10 bg-gradient-to-br from-[#E98828]/5 to-transparent flex flex-col justify-between min-h-[110px] group">
                  <div>
                    <h5 className="text-[13px] font-bold text-white tracking-tight uppercase">
                      Architecture Library
                    </h5>
                    <p className="text-[11px] text-[#A0A0A0] font-light mt-1">
                      Explore detailed blueprints and agent profiles across the full library.
                    </p>
                  </div>
                  <Link 
                    href="/resources/case-studies"
                    className="text-[11px] font-mono text-[#E98828] group-hover:text-white transition-colors flex items-center gap-1 mt-3"
                  >
                    Browse Case Studies Directory <span>→</span>
                  </Link>
                </div>

              </div>
            </div>

          </div>

          {/* Right panel: Active Preview Workspace (Architecture SVG or Live Simulation Video) */}
          <div className="lg:col-span-5 flex flex-col bg-[#060606] border border-white/5 rounded-2xl overflow-hidden min-h-[480px]">
            {/* Header */}
            <div className="border-b border-white/5 px-4 py-3 bg-[#0A0A0A] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#707070] tracking-widest uppercase">
                <span className="w-2 h-2 rounded-full bg-emerald-500/50 animate-pulse" />
                DEPLOYMENT WORKSPACE
              </div>
              <div className="flex bg-[#020202] rounded-lg p-0.5 border border-white/5 font-mono text-[9px]">
                <button 
                  onClick={() => setActiveTab("architecture")} 
                  className={`px-2.5 py-1 rounded cursor-pointer transition-colors ${activeTab === "architecture" ? "bg-white/10 text-[#E98828]" : "text-[#707070] hover:text-[#A0A0A0]"}`}
                >
                  BLUEPRINT
                </button>
                <button 
                  onClick={() => setActiveTab("video")} 
                  className={`px-2.5 py-1 rounded cursor-pointer transition-colors ${activeTab === "video" ? "bg-white/10 text-[#E98828]" : "text-[#707070] hover:text-[#A0A0A0]"}`}
                >
                  SIMULATOR
                </button>
              </div>
            </div>

            {/* Content: Architecture */}
            {activeTab === "architecture" ? (
              <div className="p-6 flex flex-col justify-between flex-grow">
                <div>
                  <span className="text-[10px] font-mono text-[#707070] tracking-widest uppercase block mb-1">SYSTEM TOPOLOGY</span>
                  <p className="text-[12px] text-[#808080] font-light leading-relaxed mb-4">Hover nodes to inspect runtime boundaries.</p>
                  <div className="bg-[#020202] rounded-xl border border-white/5 p-4 flex items-center justify-center min-h-[160px]">
                    <svg width="100%" height="100" viewBox="0 0 100 100" className="w-full h-auto overflow-visible select-none">
                      <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 2 L 8 5 L 0 8 z" fill="#303030" /></marker>
                      {activePattern.connections.map((conn, idx) => {
                        const fromNode = activePattern.nodes.find(n => n.id === conn.from);
                        const toNode = activePattern.nodes.find(n => n.id === conn.to);
                        if (!fromNode || !toNode) return null;
                        return (
                          <g key={idx}>
                            <line x1={`${fromNode.x}%`} y1={`${fromNode.y}%`} x2={`${toNode.x}%`} y2={`${toNode.y}%`} stroke="#1A1A1A" strokeWidth="2" markerEnd="url(#arrow)" />
                            <line x1={`${fromNode.x}%`} y1={`${fromNode.y}%`} x2={`${toNode.x}%`} y2={`${toNode.y}%`} stroke="#E98828" strokeWidth="1.5" strokeDasharray="4 12" className="animate-[dash_4s_linear_infinite]" />
                          </g>
                        );
                      })}
                      {activePattern.nodes.map((node) => {
                        const isHovered = hoveredNode?.id === node.id;
                        return (
                          <g key={node.id} className="cursor-help" onMouseEnter={() => setHoveredNode(node)} onMouseLeave={() => setHoveredNode(null)}>
                            <circle cx={`${node.x}%`} cy={`${node.y}%`} r={isHovered ? "7%" : "4.5%"} fill={isHovered ? "rgba(233, 136, 40, 0.15)" : "rgba(255, 255, 255, 0.02)"} stroke={isHovered ? "#E98828" : "#303030"} strokeWidth="1" className="transition-all duration-300" />
                            <circle cx={`${node.x}%`} cy={`${node.y}%`} r="1.5%" fill={isHovered ? "#E98828" : "#A0A0A0"} />
                            <text x={`${node.x}%`} y={`${node.y - 7}%`} textAnchor="middle" fill={isHovered ? "#E98828" : "#606060"} className="text-[3.5px] font-mono uppercase font-bold">{node.label.split(" ")[0]}</text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                </div>
                <div className="bg-[#020202] border border-white/5 rounded-xl p-4 min-h-[120px] flex flex-col justify-center mt-4">
                  <AnimatePresence mode="wait">
                    {hoveredNode ? (
                      <motion.div key={hoveredNode.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.15 }}>
                        <h4 className="text-[12px] font-mono uppercase text-[#E98828] font-bold mb-1">{hoveredNode.label}</h4>
                        <p className="text-[11px] text-[#A0A0A0] leading-relaxed">{hoveredNode.desc}</p>
                      </motion.div>
                    ) : (
                      <div className="text-center py-2">
                        <span className="text-[10px] font-mono text-[#505050] uppercase tracking-wider block">HOVER BLUEPRINT NODES TO INSPECT LOGIC</span>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              /* Content: Video simulator console */
              <div className="p-6 flex flex-col justify-between flex-grow">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-[#707070] tracking-widest uppercase">AGENT EXECUTION STREAM</span>
                    <span className="text-[9px] font-mono text-[#E98828] animate-pulse">● LIVE OPERATIONAL</span>
                  </div>
                  <p className="text-[12px] text-[#808080] font-light leading-relaxed mb-4">Simulated agent runtime execution demonstrating continuous multi-agent system handoffs.</p>
                  <div className="bg-[#020202] rounded-xl border border-white/5 p-4 min-h-[190px] max-h-[190px] overflow-y-auto font-mono text-[10px] leading-relaxed flex flex-col justify-end">
                    <div className="space-y-1">
                      {streamedLogs.map((log, index) => {
                        let clr = "text-white/60";
                        if (log.type === "event") clr = "text-[#E98828] font-semibold";
                        else if (log.type === "agent") clr = "text-sky-400";
                        else if (log.type === "success") clr = "text-emerald-400 font-semibold";
                        return (
                          <div key={index} className="flex gap-2 items-start text-left text-[10px]">
                            <span className="text-[#404040] select-none shrink-0">{log.time}</span>
                            <span className={`${clr} shrink-0`}>[{log.type.slice(0,3).toUpperCase()}]</span>
                            <span className="text-white/80">{log.msg}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="bg-[#020202] border border-white/5 rounded-xl p-3 flex items-center justify-between gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <button onClick={handleTogglePlay} className="w-7 h-7 rounded-full border border-white/10 hover:border-[#E98828] bg-white/5 flex items-center justify-center cursor-pointer text-white">
                      {isPlaying ? <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg> : <svg className="w-3 h-3 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>}
                    </button>
                    <button onClick={handleResetStream} className="w-7 h-7 rounded-full border border-white/10 hover:border-white/30 bg-white/5 flex items-center justify-center cursor-pointer text-[#A0A0A0]">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 6H16" /></svg>
                    </button>
                    <div className="h-4 w-[1px] bg-white/10" />
                    <div className="flex gap-1">
                      {[1500, 1000, 400].map((spd, i) => (
                        <button key={spd} onClick={() => setPlaySpeed(spd)} className={`px-1.5 py-0.5 text-[8px] font-mono rounded cursor-pointer ${playSpeed === spd ? "bg-[#E98828]/20 text-[#E98828] border border-[#E98828]/30" : "bg-white/5 text-[#707070]"}`}>
                          {i === 0 ? "0.5x" : i === 1 ? "1.0x" : "2.5x"}
                        </button>
                      ))}
                    </div>
                  </div>
                  <span className="text-[9px] font-mono text-[#505050]">PLAYING EXECUTOR v2.04</span>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </motion.section>
  );
}

