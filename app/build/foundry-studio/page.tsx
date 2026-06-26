"use client";

import React, { useState, useEffect, useRef } from "react";
import { ToolPageShell, ToolHero } from "@/components/build/components";
import Link from "next/link";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";
import { getToolState, saveToolState } from "@/components/build/workspaceUtility";

// ==========================================
// 1. Type Definitions & Static Presets
// ==========================================

type ModuleType =
  | "trigger"
  | "reasoning"
  | "knowledge"
  | "action"
  | "review"
  | "governance"
  | "output"
  | "monitoring";

interface WorkflowStage {
  id: string;
  type: ModuleType;
  label: string;
  role: string;
  latency: string;
  isGated: boolean;
}

interface IndustryPreset {
  id: string;
  label: string;
  icon: string;
  title: string;
  pattern: "sequential" | "hierarchical" | "swarm" | "dag";
  stages: Omit<WorkflowStage, "id" | "isGated">[];
  sources: string[];
  approvalIndex: number;
  description: string;
}

const MODULE_DEFAULTS: Record<ModuleType, { label: string; role: string; latency: string; icon: string; color: string; desc: string }> = {
  trigger: {
    label: "Custom Trigger Pipeline",
    role: "Sovereign Ingress Hook",
    latency: "2ms",
    icon: "⚡",
    color: "#009DFF",
    desc: "Ingress listener that schedules single-tenant pipeline execution.",
  },
  reasoning: {
    label: "Cognitive Inference Agent",
    role: "Deep Reasoning LLM Orchestrator",
    latency: "45ms",
    icon: "🧠",
    color: "#8B5CF6",
    desc: "Evaluates context, weights decisions, and coordinates sub-agents.",
  },
  knowledge: {
    label: "Sovereign Knowledge Resolver",
    role: "Local Vector/Graph DB Query",
    latency: "15ms",
    icon: "🕸️",
    color: "#9D00FF",
    desc: "Resolves entity relations inside air-gapped knowledge layers.",
  },
  action: {
    label: "Encrypted Action Dispatch",
    role: "Secure ERP/DB RPC Hook",
    latency: "25ms",
    icon: "🛠️",
    color: "#E5A93C",
    desc: "Performs transactions or triggers systems of record.",
  },
  review: {
    label: "Human Gate Validator",
    role: "Human-in-the-Loop Enclave",
    latency: "Pending",
    icon: "👤",
    color: "#FBBF24",
    desc: "Cryptographically stalls workflow execution for physical validation.",
  },
  governance: {
    label: "Compliance Policy Guard",
    role: "Zero-Retention Privacy Filter",
    latency: "8ms",
    icon: "🔒",
    color: "#00FF9D",
    desc: "Scrubs PII and blocks raw token egress to external clouds.",
  },
  output: {
    label: "Sovereign Execution Receipt",
    role: "SOW/JSON Spec Compiler",
    latency: "2ms",
    icon: "📤",
    color: "#10B981",
    desc: "Compiles local artifacts, receipts, or schema packages.",
  },
  monitoring: {
    label: "Real-Time SLA Watchdog",
    role: "Continuous Telemetry Radar",
    latency: "1ms",
    icon: "📡",
    color: "#E4000F",
    desc: "Ships health metrics and transaction schemas to Control Center.",
  },
};


const INDUSTRY_PRESETS: IndustryPreset[] = [
  {
    id: "banking",
    label: "Banking",
    icon: "🏦",
    title: "Sovereign AML & Ledger Audit",
    pattern: "hierarchical",
    description: "Automate inbound high-value transaction risk scores, AML audits, and sovereign ledger entry committing under strict SOC2 zero-egress boundaries.",
    sources: [
      "OFAC Sanctions List v2026.4",
      "Internal KYC Cryptographic Vault",
      "Corporate SWIFT Ledger Database"
    ],
    approvalIndex: 3,
    stages: [
      { type: "trigger", label: "Wire Intake Trigger", role: "Sovereign SWIFT Webhook", latency: "2ms" },
      { type: "reasoning", label: "AML Inference Agent", role: "Dual-Path Auditing Model", latency: "42ms" },
      { type: "governance", label: "Sanctions Firewall Check", role: "Air-Gapped Compliance Guard", latency: "8ms" },
      { type: "review", label: "Compliance Board Sign-Off", role: "Human-in-the-Loop Gateway", latency: "Pending" },
      { type: "action", label: "Execute Ledger Credit", role: "Secure SAP Gateway Connector", latency: "12ms" },
      { type: "output", label: "Sovereign Audit Receipt", role: "Encrypted JSON Registry", latency: "1ms" }
    ]
  },
  {
    id: "healthcare",
    label: "Healthcare",
    icon: "🏥",
    title: "Clinical Pathway Synthesis",
    pattern: "dag",
    description: "Ingest unstructured EMR diagnostics, resolve oncology taxonomies, scrub patient identifiers, and compile secure HIPAA-compliant treatment proposals.",
    sources: [
      "UMLS Clinical Medical Ontology",
      "Oncology Treatment Consensus DB",
      "Sovereign Patient EMR Archive"
    ],
    approvalIndex: 4,
    stages: [
      { type: "trigger", label: "EMR Record Ingest", role: "HL7 Pipeline Inbound Webhook", latency: "3ms" },
      { type: "reasoning", label: "Clinical Context Synthesizer", role: "Deep Medical Reasoning Model", latency: "58ms" },
      { type: "knowledge", label: "Oncology Knowledge Graph", role: "Sovereign Medical Graph Node", latency: "15ms" },
      { type: "governance", label: "HIPAA PII Redaction Mask", role: "Zero-Retention Compliance Filter", latency: "5ms" },
      { type: "review", label: "Attending Physician Approval", role: "Clinical Sign-Off Gateway", latency: "Pending" },
      { type: "output", label: "FHIR Treatment Plan Specs", role: "Sovereign Medical Ledger Node", latency: "2ms" },
      { type: "monitoring", label: "Uptime Telemetry Radar", role: "GFF Control Center Watchdog", latency: "1ms" }
    ]
  },
  {
    id: "energy",
    label: "Energy",
    icon: "⚡",
    title: "SCADA Telemetry & Safety Loops",
    pattern: "sequential",
    description: "Listen to real-time SCADA grid telemetry spikes, assess failure modes, evaluate piping schematics, and execute automated hardware shutdown requests.",
    sources: [
      "ISO-14224 FMEA Diagnostics Rules",
      "Platform Active Sensor Schematics",
      "Offshore Valve Topology Database"
    ],
    approvalIndex: 3,
    stages: [
      { type: "trigger", label: "Grid Telemetry Sensor Spike", role: "SCADA Pipeline Ingress Gateway", latency: "1ms" },
      { type: "reasoning", label: "FMEA Failure Diagnostics", role: "Predictive Asset Model", latency: "35ms" },
      { type: "knowledge", label: "Turbine Grid Topology", role: "Sovereign Asset Graph Node", latency: "10ms" },
      { type: "action", label: "Pneumatic Safety Command", role: "Industrial SCADA Valve Hook", latency: "15ms" },
      { type: "monitoring", label: "SCADA Live Monitor Log", role: "Real-Time Site Reliability Log", latency: "1ms" }
    ]
  },
  {
    id: "telecom",
    label: "Telecom",
    icon: "📡",
    title: "Dynamic Congestion Swarm Routing",
    pattern: "swarm",
    description: "Detect live fiber routing drop rates, spin up federated bandwidth sub-agents, enforce SLA network thresholds, and redirect BGP packet pipelines.",
    sources: [
      "BGP Live Routing Archives",
      "Contractual SLA Metric Limits",
      "Sovereign Fiber Routing Layout"
    ],
    approvalIndex: -1,
    stages: [
      { type: "trigger", label: "Packet Drop Rate Event", role: "SLA Router Monitoring Hook", latency: "1ms" },
      { type: "reasoning", label: "Bandwidth Router Sub-Agent", role: "Dynamic Federated Model", latency: "22ms" },
      { type: "governance", label: "SLA Compliance Watchdog", role: "Network Performance Guard", latency: "4ms" },
      { type: "action", label: "Core Trunk Packet Re-route", role: "BGP Fiber Route Update API", latency: "18ms" },
      { type: "output", label: "Active Network Map", role: "JSON Routing Topology Speeds", latency: "2ms" }
    ]
  },
  {
    id: "retail",
    label: "Retail & Supply Chain",
    icon: "📦",
    title: "Supplier Contract Invoice Audit",
    pattern: "dag",
    description: "Ingest vendor PDF invoices, parse layout parameters with vision agents, compare items against Master SLA pricing matrices, and trigger ERP credits.",
    sources: [
      "Supplier Master Agreements DB",
      "SAP ERP Vendor Database ledger",
      "Global Shipping Port Logs"
    ],
    approvalIndex: 4,
    stages: [
      { type: "trigger", label: "Vendor PDF Invoice Ingress", role: "Sovereign File Inbound Hook", latency: "4ms" },
      { type: "reasoning", label: "Multimodal Invoice Parser", role: "VLM Layout Context Model", latency: "80ms" },
      { type: "knowledge", label: "SLA Pricing Rate Lookup", role: "Sovereign Contract Catalog", latency: "12ms" },
      { type: "governance", label: "Rate Variance Auditor", role: "Finance Variance Guard", latency: "6ms" },
      { type: "review", label: "Procurement Director Audit", role: "Finance Executive Gateway", latency: "Pending" },
      { type: "action", label: "Adjust SAP ERP Balances", role: "Direct SAP Ledger Connector", latency: "25ms" }
    ]
  }
];

const AGENT_PATTERNS = [
  { id: "sequential", label: "Sequential Chain", desc: "Linear workflow where each stage executes in a hard order." },
  { id: "hierarchical", label: "Hierarchical Supervisor", desc: "Central supervisor delegates tasks to isolated sub-agents." },
  { id: "swarm", label: "Federated Swarm", desc: "De-centralized sub-agents negotiate routing without a supervisor." },
  { id: "dag", label: "Cognitive DAG", desc: "Parallel branching paths connected dynamically based on conditions." },
];

interface ConsoleLog {
  time: string;
  type: "system" | "info" | "agent" | "success" | "warning";
  text: string;
}


// ==========================================
// 2. Component Implementation & Layout Mathematics
// ==========================================

interface NodePos {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
}

function getNodePositions(pattern: string, stagesList: any[]): NodePos[] {
  const N = stagesList.length;
  if (N === 0) return [];

  if (N === 1) {
    return [{ x: 50, y: 50 }];
  }

  const positions: NodePos[] = [];

  if (pattern === "sequential") {
    // Linear pipeline
    // Distribute evenly along the X axis from 14% to 86%
    for (let i = 0; i < N; i++) {
      const x = 14 + (i / (N - 1)) * 72;
      // Alternate wave pattern if there are many nodes (to prevent vertical or horizontal crowding)
      const y = N > 5 ? (i % 2 === 0 ? 38 : 62) : 50;
      positions.push({ x, y });
    }
  } else if (pattern === "hierarchical") {
    // Supervisor node (first reasoning node, or node 0)
    // Put Supervisor at top center (50%, 22%)
    // Put all other nodes (workers) in a horizontal row at (50% + offset, 72%)
    let supervisorIdx = stagesList.findIndex(s => s.type === "reasoning");
    if (supervisorIdx === -1) supervisorIdx = 0;

    const workerCount = N - 1;

    let workerJ = 0;
    for (let i = 0; i < N; i++) {
      if (i === supervisorIdx) {
        positions.push({ x: 50, y: 22 });
      } else {
        const x = workerCount > 1 
          ? 14 + (workerJ / (workerCount - 1)) * 72
          : 50;
        positions.push({ x, y: 72 });
        workerJ++;
      }
    }
  } else if (pattern === "swarm") {
    // Arranged in an ellipse
    const cx = 50;
    const cy = 48;
    const rx = 33;
    const ry = 25;

    for (let i = 0; i < N; i++) {
      const angle = (i / N) * 2 * Math.PI - Math.PI / 2; // start top-center
      const x = cx + rx * Math.cos(angle);
      const y = cy + ry * Math.sin(angle);
      positions.push({ x, y });
    }
  } else {
    // Cognitive DAG: Parallel layers
    const layers: { [key: number]: number[] } = { 0: [0], 1: [], 2: [], 3: [N - 1] };
    
    for (let i = 1; i < N - 1; i++) {
      if (i % 2 === 1) {
        layers[1].push(i);
      } else {
        layers[2].push(i);
      }
    }

    const layerX = { 0: 14, 1: 38, 2: 62, 3: 86 };
    const coordsMap = new Array<NodePos>(N);

    // Position node index 0
    coordsMap[0] = { x: layerX[0], y: 50 };
    // Position last node
    coordsMap[N - 1] = { x: layerX[3], y: 50 };

    // Position mid layers
    [1, 2].forEach((lNum) => {
      const indices = layers[lNum];
      const count = indices.length;
      indices.forEach((nodeIdx, k) => {
        const x = layerX[lNum as 1 | 2];
        const y = count > 1
          ? 50 + (k - (count - 1) / 2) * 28
          : 50;
        coordsMap[nodeIdx] = { x, y };
      });
    });

    for (let i = 0; i < N; i++) {
      positions.push(coordsMap[i]);
    }
  }

  return positions;
}

export default function FoundryStudioPage() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>("banking");
  const [selectedPattern, setSelectedPattern] = useState<string>("hierarchical");
  const [stages, setStages] = useState<WorkflowStage[]>([]);
  const [knowledgeSources, setKnowledgeSources] = useState<string[]>([]);

  const [isHydrated, setIsHydrated] = useState(false);

  // Load from GFF Workspace on mount
  useEffect(() => {
    const saved = getToolState("foundryStudio");
    if (saved) {
      if (saved.selectedPresetId) setSelectedPresetId(saved.selectedPresetId);
      if (saved.selectedPattern) setSelectedPattern(saved.selectedPattern);
      if (Array.isArray(saved.stages)) setStages(saved.stages);
      if (Array.isArray(saved.knowledgeSources)) setKnowledgeSources(saved.knowledgeSources);
    }
    setIsHydrated(true);
  }, []);

  // Save to GFF Workspace on changes
  useEffect(() => {
    if (isHydrated) {
      saveToolState("foundryStudio", {
        selectedPresetId,
        selectedPattern,
        stages,
        knowledgeSources
      });
    }
  }, [isHydrated, selectedPresetId, selectedPattern, stages, knowledgeSources]);
  const [newSourceInput, setNewSourceInput] = useState<string>("");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [nodeCounter, setNodeCounter] = useState<number>(10);
  
  // Custom Node Editor states (for editing the selected node)
  const [nodeLabel, setNodeLabel] = useState("");
  const [nodeRole, setNodeRole] = useState("");
  const [nodeLatency, setNodeLatency] = useState("");

  // Simulation & Logs states
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState<number>(-1);
  const [logs, setLogs] = useState<ConsoleLog[]>([]);
  const [consoleTab, setConsoleTab] = useState<"terminal" | "json" | "yaml">("terminal");

  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const logsEndRef = useRef<HTMLDivElement>(null);

  // Initialize preset on mount or change
  useEffect(() => {
    const preset = INDUSTRY_PRESETS.find((p) => p.id === selectedPresetId);
    if (preset) {
      const formattedStages = preset.stages.map((st, idx) => ({
        id: `node-${idx}-${st.type}`,
        type: st.type as ModuleType,
        label: st.label,
        role: st.role,
        latency: st.latency,
        isGated: idx === preset.approvalIndex,
      }));
      setStages(formattedStages);
      setKnowledgeSources(preset.sources);
      setSelectedPattern(preset.pattern);
      setSelectedNodeId(formattedStages[0]?.id || null);

      // Reset any active simulation
      setIsSimulating(false);
      setSimulationProgress(-1);
      
      // Load initial console log list
      const timestamp = new Date().toLocaleTimeString();
      setLogs([
        { time: timestamp, type: "system", text: `Loaded sovereign preset configuration: "${preset.title}".` },
        { time: timestamp, type: "info", text: `Enclave isolation set to AMD-SEV-SNP hardware boundary. Security parameters initialized.` }
      ]);
    }
  }, [selectedPresetId]);

  // Sync selected node's values into editor states
  useEffect(() => {
    if (selectedNodeId) {
      const node = stages.find((s) => s.id === selectedNodeId);
      if (node) {
        setNodeLabel(node.label);
        setNodeRole(node.role);
        setNodeLatency(node.latency);
      }
    } else {
      setNodeLabel("");
      setNodeRole("");
      setNodeLatency("");
    }
  }, [selectedNodeId, stages]);

  // Auto-scroll logs terminal
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  // Real-time live-typing synchronization handlers
  const handleLabelChange = (newVal: string) => {
    setNodeLabel(newVal);
    if (selectedNodeId) {
      setStages((prev) =>
        prev.map((s) => (s.id === selectedNodeId ? { ...s, label: newVal } : s))
      );
    }
  };

  const handleRoleChange = (newVal: string) => {
    setNodeRole(newVal);
    if (selectedNodeId) {
      setStages((prev) =>
        prev.map((s) => (s.id === selectedNodeId ? { ...s, role: newVal } : s))
      );
    }
  };

  const handleLatencyChange = (newVal: string) => {
    setNodeLatency(newVal);
    if (selectedNodeId) {
      setStages((prev) =>
        prev.map((s) => (s.id === selectedNodeId ? { ...s, latency: newVal } : s))
      );
    }
  };

  // Helper functions for desktop spatial layout
  const isSupervisorNode = (idx: number) => {
    if (selectedPattern !== "hierarchical") return false;
    let supervisorIdx = stages.findIndex((s) => s.type === "reasoning");
    if (supervisorIdx === -1) supervisorIdx = 0;
    return idx === supervisorIdx;
  };

  const getDesktopNodePos = (idx: number): { x: number; y: number } => {
    const positions = getNodePositions(selectedPattern, stages);
    return positions[idx] || { x: 50, y: 50 };
  };
  const renderDesktopConnections = () => {
    const N = stages.length;
    if (N <= 1) return null;
    const positions = getNodePositions(selectedPattern, stages);
    if (positions.length !== N) return null;
    const paths: React.JSX.Element[] = [];

    if (selectedPattern === "sequential") {
      for (let i = 0; i < N - 1; i++) {
        const pos1 = positions[i];
        const pos2 = positions[i + 1];
        const isCompleted = isSimulating && simulationProgress > i;
        const isActive = isSimulating && simulationProgress === i;
        const cx1 = pos1.x + (pos2.x - pos1.x) * 0.5;
        const cy1 = pos1.y;
        const cx2 = pos1.x + (pos2.x - pos1.x) * 0.5;
        const cy2 = pos2.y;
        const d = `M ${pos1.x} ${pos1.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${pos2.x} ${pos2.y}`;
        paths.push(
          <path
            key={`seq-${i}`}
            d={d}
            fill="none"
            stroke={isCompleted ? "#00FF9D" : isActive ? "#009DFF" : "rgba(255, 255, 255, 0.08)"}
            strokeWidth={isActive ? "2.5" : "1.5"}
            strokeLinecap="round"
            className={isActive ? "animate-flowDash" : ""}
            style={{
              filter: isActive ? "drop-shadow(0 0 3px rgba(0, 157, 255, 0.4))" : "",
              transition: "stroke 0.3s, stroke-width 0.3s",
            }}
          />
        );
      }
    } else if (selectedPattern === "hierarchical") {
      let supervisorIdx = stages.findIndex((s) => s.type === "reasoning");
      if (supervisorIdx === -1) supervisorIdx = 0;
      const posSup = positions[supervisorIdx];
      for (let i = 0; i < N; i++) {
        if (i === supervisorIdx) continue;
        const posWorker = positions[i];
        const isCompleted = isSimulating && simulationProgress > i;
        const isActive = isSimulating && simulationProgress === i;
        const cx1 = posSup.x;
        const cy1 = posSup.y + (posWorker.y - posSup.y) * 0.5;
        const cx2 = posWorker.x;
        const cy2 = posSup.y + (posWorker.y - posSup.y) * 0.5;
        const d = `M ${posSup.x} ${posSup.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${posWorker.x} ${posWorker.y}`;
        paths.push(
          <path
            key={`hier-${i}`}
            d={d}
            fill="none"
            stroke={isCompleted ? "#00FF9D" : isActive ? "#009DFF" : "rgba(255, 255, 255, 0.08)"}
            strokeWidth={isActive ? "2.5" : "1.5"}
            strokeLinecap="round"
            className={isActive ? "animate-flowDash" : ""}
            style={{
              filter: isActive ? "drop-shadow(0 0 3px rgba(0, 157, 255, 0.4))" : "",
              transition: "stroke 0.3s, stroke-width 0.3s",
            }}
          />
        );
      }
    } else if (selectedPattern === "swarm") {
      for (let i = 0; i < N; i++) {
        for (let j = i + 2; j < N; j++) {
          if (i === 0 && j === N - 1) continue;
          const pos1 = positions[i];
          const pos2 = positions[j];
          paths.push(
            <line
              key={`mesh-${i}-${j}`}
              x1={pos1.x}
              y1={pos1.y}
              x2={pos2.x}
              y2={pos2.y}
              stroke="rgba(255, 255, 255, 0.02)"
              strokeWidth="0.75"
              strokeDasharray="2 2"
            />
          );
        }
      }
      for (let i = 0; i < N; i++) {
        const pos1 = positions[i];
        const pos2 = positions[(i + 1) % N];
        const isCompleted = isSimulating && simulationProgress > i;
        const isActive = isSimulating && simulationProgress === i;
        paths.push(
          <path
            key={`swarm-${i}`}
            d={`M ${pos1.x} ${pos1.y} L ${pos2.x} ${pos2.y}`}
            fill="none"
            stroke={isCompleted ? "#00FF9D" : isActive ? "#009DFF" : "rgba(255, 255, 255, 0.08)"}
            strokeWidth={isActive ? "2.5" : "1.5"}
            strokeLinecap="round"
            className={isActive ? "animate-flowDash" : ""}
            style={{
              filter: isActive ? "drop-shadow(0 0 3px rgba(0, 157, 255, 0.4))" : "",
              transition: "stroke 0.3s, stroke-width 0.3s",
            }}
          />
        );
      }
    } else {
      const layers: { [key: number]: number[] } = { 0: [0], 1: [], 2: [], 3: [N - 1] };
      for (let i = 1; i < N - 1; i++) {
        if (i % 2 === 1) layers[1].push(i);
        else layers[2].push(i);
      }
      const drawCurve = (u: number, v: number, key: string) => {
        const pos1 = positions[u];
        const pos2 = positions[v];
        const isCompleted = isSimulating && simulationProgress > v;
        const isActive = isSimulating && simulationProgress === v;
        const cx1 = pos1.x + (pos2.x - pos1.x) * 0.5;
        const cy1 = pos1.y;
        const cx2 = pos1.x + (pos2.x - pos1.x) * 0.5;
        const cy2 = pos2.y;
        const d = `M ${pos1.x} ${pos1.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${pos2.x} ${pos2.y}`;
        return (
          <path
            key={key}
            d={d}
            fill="none"
            stroke={isCompleted ? "#00FF9D" : isActive ? "#009DFF" : "rgba(255, 255, 255, 0.08)"}
            strokeWidth={isActive ? "2.5" : "1.5"}
            strokeLinecap="round"
            className={isActive ? "animate-flowDash" : ""}
            style={{
              filter: isActive ? "drop-shadow(0 0 3px rgba(0, 157, 255, 0.4))" : "",
              transition: "stroke 0.3s, stroke-width 0.3s",
            }}
          />
        );
      };
      layers[0].forEach((u) => {
        layers[1].forEach((v) => {
          paths.push(drawCurve(u, v, `dag-0-1-${u}-${v}`));
        });
      });
      layers[1].forEach((u) => {
        layers[2].forEach((v) => {
          paths.push(drawCurve(u, v, `dag-1-2-${u}-${v}`));
        });
      });
      layers[2].forEach((u) => {
        layers[3].forEach((v) => {
          paths.push(drawCurve(u, v, `dag-2-3-${u}-${v}`));
        });
      });
    }
    return <>{paths}</>;
  };



  // Multi-step Simulation Execution logic
  useEffect(() => {
    if (!isSimulating) return;

    if (simulationProgress === -1) {
      // Begin simulation
      const timestamp = new Date().toLocaleTimeString();
      setLogs((prev) => [
        ...prev,
        { time: timestamp, type: "system", text: `==========================================================` },
        { time: timestamp, type: "system", text: `INITIATING SOVEREIGN WORKFLOW GRAPH SIMULATION [PATTERN: ${selectedPattern.toUpperCase()}]` },
        { time: timestamp, type: "info", text: `Bootstrapping secure memory registers... Sandbox initialized.` }
      ]);
      setSimulationProgress(0);
      return;
    }

    if (simulationProgress < stages.length) {
      const stage = stages[simulationProgress];
      const timer = setTimeout(() => {
        const timestamp = new Date().toLocaleTimeString();
        
        // Dynamic logs corresponding to active node execution
        const logEntries: ConsoleLog[] = [
          {
            time: timestamp,
            type: stage.type === "governance" ? "warning" : stage.type === "review" ? "info" : "agent",
            text: `[EXEC] [STAGE ${simulationProgress + 1}/${stages.length}] executing node: "${stage.label}" (${stage.role})`
          }
        ];

        // Specific detailed log lines to simulate deep operations
        if (stage.type === "trigger") {
          logEntries.push({
            time: timestamp,
            type: "system",
            text: `>> Listener captured inbound telemetry payload. Routing token streams internally.`
          });
        } else if (stage.type === "reasoning") {
          logEntries.push({
            time: timestamp,
            type: "agent",
            text: `>> Model evaluating context vectors. Context dimension: 1536. Anomaly score: 0.12 (Within healthy threshold).`
          });
        } else if (stage.type === "knowledge") {
          logEntries.push({
            time: timestamp,
            type: "info",
            text: `>> Querying Sovereign Knowledge database... Resolved 3 relative entities and 14 relational bounds. No data leaked.`
          });
        } else if (stage.type === "governance") {
          logEntries.push({
            time: timestamp,
            type: "warning",
            text: `>> HIPAA/SOC2 strict scrub triggered. Mapped 2 items containing proprietary codes. Masking in RAM.`
          });
        } else if (stage.type === "review") {
          logEntries.push({
            time: timestamp,
            type: "info",
            text: `>> Gated human approval breakpoint found. Stall verification ticket issued... Digital authority sign-off successfully bypass-simulated.`
          });
        } else if (stage.type === "action") {
          logEntries.push({
            time: timestamp,
            type: "agent",
            text: `>> Dispatched RPC transaction block to single-tenant ERP Ledger. Target server responded Code 200.`
          });
        } else if (stage.type === "output") {
          logEntries.push({
            time: timestamp,
            type: "success",
            text: `>> Document output specifications compiled. Writing cryptographically verified receipt JSON payload.`
          });
        } else if (stage.type === "monitoring") {
          logEntries.push({
            time: timestamp,
            type: "success",
            text: `>> Heartbeat verified. Active token latency: 142ms. SLA performance threshold: 100% compliant.`
          });
        }

        setLogs((prev) => [...prev, ...logEntries]);
        setSimulationProgress((prev) => prev + 1);
      }, 1500);

      return () => clearTimeout(timer);
    } else {
      // Completed simulation
      const timer = setTimeout(() => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs((prev) => [
          ...prev,
          { time: timestamp, type: "success", text: `GRAPH SIMULATION COMPLETED SUCCESSFULLY.` },
          { time: timestamp, type: "success", text: `Result output certified SHA-256: 0x8a92f03f7a8b... Transient memory arrays scrubbed clean.` },
          { time: timestamp, type: "system", text: `==========================================================` }
        ]);
        setIsSimulating(false);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [isSimulating, simulationProgress, stages, selectedPattern]);

  // Start / Cancel Simulation triggers
  const handleStartSimulation = () => {
    if (isSimulating) {
      setIsSimulating(false);
      setSimulationProgress(-1);
    } else {
      setSimulationProgress(-1);
      setIsSimulating(true);
    }
  };

  const handleResetSimulation = () => {
    setIsSimulating(false);
    setSimulationProgress(-1);
    setLogs([]);
    const timestamp = new Date().toLocaleTimeString();
    setLogs([
      { time: timestamp, type: "system", text: "Simulation logs flushed clean." },
      { time: timestamp, type: "info", text: "Ready for next diagnostic pipeline trigger." }
    ]);
  };


  // Node array modifications
  const handleAddModule = (type: ModuleType) => {
    const defaults = MODULE_DEFAULTS[type];
    const newStage: WorkflowStage = {
      id: `node-${nodeCounter}-${type}`,
      type,
      label: defaults.label,
      role: defaults.role,
      latency: defaults.latency,
      isGated: false,
    };
    setStages((prev) => [...prev, newStage]);
    setSelectedNodeId(newStage.id);
    setNodeCounter((prev) => prev + 1);
    
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [
      ...prev,
      { time: timestamp, type: "system", text: `Appended pipeline node stage: "${defaults.label}" of type [${type.toUpperCase()}].` }
    ]);
  };

  const handleDeleteStage = (id: string, label: string) => {
    if (stages.length <= 1) {
      alert("Sovereign architectures must retain at least 1 functional pipeline node.");
      return;
    }
    setStages((prev) => prev.filter((s) => s.id !== id));
    if (selectedNodeId === id) {
      setSelectedNodeId(null);
    }
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [
      ...prev,
      { time: timestamp, type: "system", text: `Removed node stage: "${label}". Adjusted topology.` }
    ]);
  };

  const handleMoveStage = (index: number, direction: "left" | "right") => {
    const newStages = [...stages];
    const targetIdx = direction === "left" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= stages.length) return;

    // Swap stages
    const temp = newStages[index];
    newStages[index] = newStages[targetIdx];
    newStages[targetIdx] = temp;
    setStages(newStages);
  };

  // Node form updates
  const handleSaveNodeChanges = () => {
    if (!selectedNodeId) return;
    setStages((prev) =>
      prev.map((s) =>
        s.id === selectedNodeId
          ? { ...s, label: nodeLabel, role: nodeRole, latency: nodeLatency }
          : s
      )
    );
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [
      ...prev,
      { time: timestamp, type: "system", text: `Updated node parameter configuration: "${nodeLabel}" successfully.` }
    ]);
  };

  const handleToggleGate = (id: string) => {
    setStages((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isGated: !s.isGated } : s))
    );
    const node = stages.find((s) => s.id === id);
    if (node) {
      const timestamp = new Date().toLocaleTimeString();
      setLogs((prev) => [
        ...prev,
        { time: timestamp, type: "info", text: `Toggled Human-in-the-Loop gate status for node: "${node.label}" (Active: ${!node.isGated}).` }
      ]);
    }
  };

  // Knowledge source tag additions
  const handleAddSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSourceInput.trim()) return;
    if (knowledgeSources.includes(newSourceInput.trim())) return;

    setKnowledgeSources((prev) => [...prev, newSourceInput.trim()]);
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [
      ...prev,
      { time: timestamp, type: "info", text: `Added custom vector/ontology knowledge label: "${newSourceInput.trim()}".` }
    ]);
    setNewSourceInput("");
  };

  const handleRemoveSource = (source: string) => {
    setKnowledgeSources((prev) => prev.filter((s) => s !== source));
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [
      ...prev,
      { time: timestamp, type: "info", text: `Removed knowledge reference source: "${source}".` }
    ]);
  };

  // Real-time generated Schemas formatting
  const generateJSONSchema = () => {
    const schemaObj = {
      $schema: "https://gff.ai/schemas/foundry-studio-v3.json",
      pipelineId: `gff-pipeline-${selectedPresetId}`,
      industry: selectedPresetId,
      topologyPattern: selectedPattern,
      knowledgeSovereignty: {
        zeroEgressEnforced: true,
        enclaveType: "AMD-SEV-SNP",
        localSources: knowledgeSources,
      },
      stages: stages.map((s, idx) => ({
        index: idx,
        type: s.type,
        label: s.label,
        role: s.role,
        latencyTarget: s.latency,
        humanGated: s.isGated,
      })),
    };
    return JSON.stringify(schemaObj, null, 2);
  };

  const generateYAMLManifest = () => {
    return `apiVersion: gff.ai/v1alpha1
kind: SovereignCognitiveDAG
metadata:
  name: ${selectedPresetId}-intelligence-pipeline
  namespace: sovereign-enclave-prod
spec:
  pattern: ${selectedPattern}
  isolationLevel: AMD-SEV-SNP
  telemetryStream: enabled
  knowledgeBases:
${knowledgeSources.map((s) => `    - name: "${s}"\n      isolation: EncryptedMemoryMapped`).join("\n")}
  pipeline:
${stages
  .map(
    (s, idx) => `    - step: ${idx + 1}
      type: ${s.type}
      label: "${s.label}"
      handler: "enclave://${s.type}/${s.id}"
      humanGated: ${s.isGated}`
  )
  .join("\n")}`;
  };

  // Clipboard copies & simulated downloads
  const handleCopyToClipboard = () => {
    const text = consoleTab === "json" ? generateJSONSchema() : generateYAMLManifest();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSpec = () => {
    const text = consoleTab === "json" ? generateJSONSchema() : generateYAMLManifest();
    const ext = consoleTab === "json" ? "json" : "yaml";
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `foundry-workflow-${selectedPresetId}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };


  return (
    <ToolPageShell>
      {/* CSS Animation Injector for custom dynamic SVG flow lines */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes flowDash {
          to {
            stroke-dashoffset: -20;
          }
        }
        .animate-flowDash {
          stroke-dasharray: 6 4;
          animation: flowDash 0.8s linear infinite;
        }
      `}} />

      {/* Tool Hero Intro Section */}
      <ToolHero
        category="WORKSPACE WORKBENCH"
        title="GFF Foundry Studio DAG Architect"
        highlightedWord="Foundry Studio"
        description="Configure and compile enterprise-grade multi-stage Directed Acyclic Graph (DAG) pipelines for sovereign cognitive agents. Shape sandboxed workflows with real-time SVG connection previews."
        metricLabel="PLATFORM MODE"
        metricValue="SIMULATION ACTIVE"
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
        {/* ==========================================
            LEFT COLUMN: Studio Configurator Panel (4 cols)
            ========================================== */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* Preset Selector */}
          <div className="p-6 rounded-2xl border border-white/5 bg-[#04060b]/80 backdrop-blur-sm space-y-4">
            <div>
              <span className="text-[10px] font-mono text-[#009DFF] font-bold uppercase tracking-widest block mb-1">
                PRESET TEMPLATES
              </span>
              <h2 className="text-lg font-bold text-white tracking-tight">Select Industry Domain</h2>
              <p className="text-white/40 text-xs font-light">Loading a preset instantly configures realistic domain workflow nodes.</p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {INDUSTRY_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPresetId(p.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all border ${
                    selectedPresetId === p.id
                      ? "bg-[#009DFF]/10 border-[#009DFF] text-white cursor-pointer"
                      : "bg-white/[0.02] border-white/5 text-white/50 hover:bg-white/[0.04] hover:text-white cursor-pointer"
                  }`}
                >
                  <span>{p.icon}</span>
                  <span>{p.label}</span>
                </button>
              ))}
            </div>

            {/* Display active preset description */}
            {INDUSTRY_PRESETS.map((p) => {
              if (p.id !== selectedPresetId) return null;
              return (
                <div key={p.id} className="pt-2 border-t border-white/5 mt-2 animate-fadeIn">
                  <h4 className="text-xs font-bold text-white/80 mb-1">{p.title}</h4>
                  <p className="text-[11px] text-white/50 leading-relaxed font-light">{p.description}</p>
                </div>
              );
            })}
          </div>


          {/* Cognitive Topology Selector */}
          <div className="p-6 rounded-2xl border border-white/5 bg-[#04060b]/80 backdrop-blur-sm space-y-4">
            <div>
              <span className="text-[10px] font-mono text-[#9D00FF] font-bold uppercase tracking-widest block mb-1">
                AGENT TOPOLOGY
              </span>
              <h2 className="text-lg font-bold text-white tracking-tight">Select Agent Pattern</h2>
              <p className="text-white/40 text-xs font-light">Determines routing and consensus mechanics across isolated nodes.</p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              {AGENT_PATTERNS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedPattern(p.id);
                    const timestamp = new Date().toLocaleTimeString();
                    setLogs((prev) => [
                      ...prev,
                      { time: timestamp, type: "info", text: `Switched topological schema routing pattern to: [${p.label.toUpperCase()}].` }
                    ]);
                  }}
                  className={`p-3 rounded-xl text-left transition-all border cursor-pointer ${
                    selectedPattern === p.id
                      ? "bg-[#9D00FF]/15 border-[#9D00FF] text-white"
                      : "bg-white/[0.02] border-white/5 text-white/40 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  <div className="font-semibold text-xs mb-1">{p.label}</div>
                  <div className="text-[9px] text-white/40 leading-normal font-light">{p.desc}</div>
                </button>
              ))}
            </div>
          </div>


          {/* Knowledge Sovereignty Sources */}
          <div className="p-6 rounded-2xl border border-white/5 bg-[#04060b]/80 backdrop-blur-sm space-y-4">
            <div>
              <span className="text-[10px] font-mono text-[#00FF9D] font-bold uppercase tracking-widest block mb-1">
                KNOWLEDGE INTEGRATION
              </span>
              <h2 className="text-lg font-bold text-white tracking-tight">Sovereign Data Sources</h2>
              <p className="text-white/40 text-xs font-light">Local vector index layers and custom schemas attached to the enclave.</p>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {knowledgeSources.map((src) => (
                <span
                  key={src}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-medium text-[#00FF9D] bg-[#00FF9D]/5 border border-[#00FF9D]/15"
                >
                  <span>{src}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSource(src)}
                    className="hover:text-red-400 transition-colors shrink-0 font-bold cursor-pointer text-[12px]"
                  >
                    ×
                  </button>
                </span>
              ))}
              {knowledgeSources.length === 0 && (
                <div className="text-[11px] text-white/30 italic">No custom sources assigned. Enclave will operate dry.</div>
              )}
            </div>

            <form onSubmit={handleAddSource} className="flex gap-2 mt-2">
              <input
                type="text"
                placeholder="Attach Custom Source Label..."
                value={newSourceInput}
                onChange={(e) => setNewSourceInput(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl text-xs bg-white/[0.02] border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-[#00FF9D]/50 font-mono"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#00FF9D]/10 hover:bg-[#00FF9D]/20 text-[#00FF9D] border border-[#00FF9D]/30 transition-all cursor-pointer"
              >
                + Add
              </button>
            </form>
          </div>


          {/* Dynamic Node Customizer Settings */}
          {selectedNodeId && (
            <div className="p-6 rounded-2xl border border-white/10 bg-[#070b13] space-y-4 animate-fadeIn shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
              <div>
                <span className="text-[10px] font-mono text-[#E5A93C] font-bold uppercase tracking-widest block mb-1">
                  NODE CONFIGURATOR
                </span>
                <h2 className="text-lg font-bold text-white tracking-tight">Configure Node Parameters</h2>
                <p className="text-white/40 text-xs font-light">Tweak selected stage label, role scope, and estimated delay values.</p>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-[9px] font-mono text-white/40 uppercase block mb-1">Node Title Label</label>
                  <input
                    type="text"
                    value={nodeLabel}
                    onChange={(e) => handleLabelChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-white/[0.02] border border-white/10 text-white focus:outline-none focus:border-[#E5A93C]/50"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-mono text-white/40 uppercase block mb-1">Execution Role / Process</label>
                  <input
                    type="text"
                    value={nodeRole}
                    onChange={(e) => handleRoleChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-white/[0.02] border border-white/10 text-white focus:outline-none focus:border-[#E5A93C]/50 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-mono text-white/40 uppercase block mb-1">Delay Target</label>
                    <input
                      type="text"
                      value={nodeLatency}
                      onChange={(e) => handleLatencyChange(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl text-xs bg-white/[0.02] border border-white/10 text-white focus:outline-none focus:border-[#E5A93C]/50 font-mono"
                    />
                  </div>
                  <div className="flex items-center justify-center border border-white/5 bg-white/[0.01] rounded-xl px-2 h-[38px] mt-auto">
                    <span className="text-[9px] font-mono text-[#00FF9D] font-bold flex items-center gap-1.5 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00FF9D]" />
                      STATE SYNCED
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 mt-2 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-white/40">HUMAN GATE LIMIT</span>
                  <button
                    type="button"
                    onClick={() => handleToggleGate(selectedNodeId)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
                      stages.find((s) => s.id === selectedNodeId)?.isGated
                        ? "bg-[#FBBF24]/10 border-[#FBBF24] text-[#FBBF24]"
                        : "bg-white/5 border-white/10 text-white/40 hover:text-white"
                    }`}
                  >
                    {stages.find((s) => s.id === selectedNodeId)?.isGated ? "🔒 Human Gated" : "🔓 Bypass Gate"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Toolbar Add Modules */}
          <div className="p-6 rounded-2xl border border-white/5 bg-[#04060b]/80 backdrop-blur-sm space-y-4">
            <div>
              <span className="text-[10px] font-mono text-white/40 font-bold uppercase tracking-widest block mb-1">
                GRAPH ASSEMBLY
              </span>
              <h2 className="text-lg font-bold text-white tracking-tight">Insert Pipeline Modules</h2>
              <p className="text-white/40 text-xs font-light">Append new building blocks to customize the execution graph topology.</p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              {Object.entries(MODULE_DEFAULTS).map(([type, meta]) => (
                <button
                  key={type}
                  onClick={() => handleAddModule(type as ModuleType)}
                  className="p-2.5 rounded-xl border border-white/5 bg-white/[0.01] hover:border-white/15 hover:bg-white/[0.03] transition text-left flex items-center gap-2 group cursor-pointer"
                >
                  <span
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-xs shrink-0 font-bold"
                    style={{ backgroundColor: `${meta.color}15`, color: meta.color, border: `1px solid ${meta.color}25` }}
                  >
                    {meta.icon}
                  </span>
                  <div>
                    <div className="text-[11px] font-bold text-white group-hover:text-[#009DFF] transition">{meta.label.split(" ")[0]} {meta.label.split(" ")[1] || ""}</div>
                    <div className="text-[9px] text-white/30 truncate max-w-[120px] font-light">{meta.role}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>


        {/* ==========================================
            RIGHT COLUMN: Live DAG Architectural Canvas (8 cols)
            ========================================== */}
        <div className="xl:col-span-8 space-y-6">
          
          {/* Main Visual Schema Board */}
          <div className="rounded-3xl border border-white/5 bg-[#030305] shadow-2xl overflow-hidden flex flex-col min-h-[580px]">
            
            {/* Board Header bar */}
            <div className="border-b border-white/5 px-6 py-4 flex flex-wrap items-center justify-between gap-4 bg-[#05070c]/50">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/30 border border-red-500/50" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/30 border border-yellow-500/50" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/30 border border-green-500/50" />
                </div>
                <div className="h-4 w-px bg-white/10" />
                <span className="text-[10px] font-mono text-white/60 tracking-wider">
                  CANVAS: <span className="text-white font-bold">{selectedPresetId.toUpperCase()}_WORKSPACE</span>
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[9px] font-mono text-white/40 border border-white/5 bg-white/[0.02]">
                  {stages.length} NODES
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleStartSimulation}
                  className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all shadow-lg cursor-pointer ${
                    isSimulating
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-[#009DFF] hover:bg-[#009DFF]/90 text-white"
                  }`}
                >
                  {isSimulating ? "🛑 HALT GRAPH" : "⚙️ SIMULATE WORKFLOW"}
                </button>
                <button
                  type="button"
                  onClick={handleResetSimulation}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 hover:bg-white/10 text-white/80 hover:text-white transition cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Architectural Grid Drawing Area */}
            <div className="relative p-6 sm:p-10 flex-1 flex flex-col justify-center bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:24px_24px]">
              
              {/* Overlay pulse if simulating */}
              {isSimulating && (
                <div className="absolute top-4 right-6 flex items-center gap-2 text-[10px] font-mono text-[#00FF9D] bg-[#00FF9D]/10 border border-[#00FF9D]/20 px-2.5 py-1 rounded-full animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00FF9D]" />
                  <span>EXECUTING ENCLAVE SIMULATION STEP {simulationProgress + 1}</span>
                </div>
              )}

              {/* MOBILE LAYOUT: Clean vertical list container */}
              <div className="xl:hidden p-6 space-y-6 flex flex-col items-center">
                {stages.map((stage, idx) => {
                  const meta = MODULE_DEFAULTS[stage.type];
                  const isNodeActive = isSimulating && simulationProgress === idx;
                  const isNodeCompleted = isSimulating ? simulationProgress > idx : false;
                  const isSelected = selectedNodeId === stage.id;

                  return (
                    <React.Fragment key={stage.id}>
                      {/* Node Card Core Container */}
                      <div
                        onClick={() => setSelectedNodeId(stage.id)}
                        className={`relative w-full xl:w-56 p-4 rounded-2xl border transition-all duration-300 cursor-pointer select-none group ${
                          isSelected
                            ? "bg-[#090f1a] border-[#009DFF] shadow-[0_0_20px_rgba(0,157,255,0.15)] scale-[1.02] z-10"
                            : isNodeActive
                            ? "bg-[#05110f] border-[#00FF9D] shadow-[0_0_20px_rgba(0,255,157,0.2)] scale-[1.02] z-10 animate-pulse"
                            : isNodeCompleted
                            ? "bg-[#020603]/90 border-[#00FF9D]/30"
                            : "bg-[#05070c]/90 border-white/5 hover:border-white/15"
                        }`}
                      >
                        
                        {/* Dynamic top node highlight */}
                        <div
                          className="absolute top-0 inset-x-0 h-1 rounded-t-2xl transition"
                          style={{
                            backgroundColor: isNodeActive
                              ? "#00FF9D"
                              : isSelected
                              ? "#009DFF"
                              : isNodeCompleted
                              ? "#00FF9D60"
                              : `${meta.color}35`,
                          }}
                        />

                        {/* Node Card Header */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="text-[10px] font-mono font-bold text-white/20">
                            {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                          </span>
                          <span
                            className="px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-wider"
                            style={{ backgroundColor: `${meta.color}15`, color: meta.color, border: `1px solid ${meta.color}25` }}
                          >
                            {stage.type}
                          </span>
                        </div>


                        {/* Node Title & Role */}
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-white truncate group-hover:text-[#009DFF] transition">
                            {stage.label}
                          </h4>
                          <p className="text-[9px] text-white/40 font-mono leading-normal truncate">
                            {stage.role}
                          </p>
                        </div>

                        {/* Node Details / Specifications Footer */}
                        <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[9px] font-mono">
                          <div className="text-white/30">
                            DELAY: <span className="text-white/70 font-semibold">{stage.latency}</span>
                          </div>
                          
                          <div className="flex items-center gap-1.5">
                            {isNodeActive ? (
                              <span className="flex items-center gap-1 text-[#00FF9D] font-bold animate-pulse">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#00FF9D]" />
                                RUN
                              </span>
                            ) : isNodeCompleted ? (
                              <span className="text-[#00FF9D] font-bold">✓ DONE</span>
                            ) : (
                              <span className="text-white/20">IDLE</span>
                            )}
                          </div>
                        </div>

                        {/* Human Gate Alert Badge */}
                        {stage.isGated && (
                          <div className="mt-2 py-1 px-2 rounded-lg bg-[#FBBF24]/5 border border-[#FBBF24]/10 flex items-center justify-center gap-1.5 text-[8px] font-bold text-[#FBBF24] tracking-wide uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FBBF24] animate-ping" />
                            <span>👤 HUMAN REVIEWS REQUIRED</span>
                          </div>
                        )}

                        {/* Floating Node Actions (Available on Hover) */}
                        <div className="absolute -top-3.5 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black border border-white/10 rounded-lg p-0.5 flex gap-1 shadow-xl z-20">
                          {idx > 0 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveStage(idx, "left");
                              }}
                              className="p-1 text-white/50 hover:text-white transition hover:bg-white/5 rounded"
                              title="Move Left"
                            >
                              ←
                            </button>
                          )}
                          {idx < stages.length - 1 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveStage(idx, "right");
                              }}
                              className="p-1 text-white/50 hover:text-white transition hover:bg-white/5 rounded"
                              title="Move Right"
                            >
                              →
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteStage(stage.id, stage.label);
                            }}
                            className="p-1 text-red-400 hover:text-red-500 transition hover:bg-white/5 rounded font-bold"
                            title="Delete Node"
                          >
                            ×
                          </button>
                        </div>

                      </div>


                      {/* Mobile vertical connection pipe */}
                      {idx < stages.length - 1 && (
                        <div className="w-0.5 h-6 flex items-center justify-center select-none">
                          <div className={`w-0.5 h-6 transition-colors duration-300 ${isNodeCompleted || isNodeActive ? "bg-[#00FF9D]" : "bg-white/10"}`} />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* DESKTOP LAYOUT: Beautiful spatial CAD Canvas */}
              <div className="hidden xl:block relative w-full h-[580px] flex-1">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none z-0">
                  {renderDesktopConnections()}
                </svg>
                {stages.map((stage, idx) => (
                  <SovereignNodeCard
                    key={stage.id}
                    stage={stage}
                    idx={idx}
                    pos={getDesktopNodePos(idx)}
                    isSimulating={isSimulating}
                    simulationProgress={simulationProgress}
                    selectedNodeId={selectedNodeId}
                    selectedPattern={selectedPattern}
                    stagesCount={stages.length}
                    onSelect={setSelectedNodeId}
                    onMove={handleMoveStage}
                    onDelete={handleDeleteStage}
                  />
                ))}

              </div>


            </div>

            {/* Board Footer / Controls explanation */}
            <div className="border-t border-white/5 px-6 py-4 bg-[#05070c]/30 text-[10px] font-mono text-white/30 flex flex-wrap gap-4 justify-between items-center">
              <span>PRO-TIP: HOVER ANY NODE TO REORDER OR REMOVE IT. CLICK A NODE TO ADJUST PARAMETERS.</span>
              <span className="text-white/40">ISOLATION: <span className="text-[#00FF9D] font-bold">AIR-GAPPED AMD-SEV</span></span>
            </div>

          </div>


          {/* Telemetry Log Terminal & Code Spec Exporter */}
          <div className="rounded-3xl border border-white/5 bg-[#030305] shadow-2xl overflow-hidden flex flex-col h-[320px]">
            
            {/* Terminal Tab Bar Headers */}
            <div className="border-b border-white/5 px-6 py-2.5 flex items-center justify-between gap-4 bg-[#05070c]/50 text-xs font-mono">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setConsoleTab("terminal")}
                  className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                    consoleTab === "terminal" ? "text-white bg-white/5 border border-white/10" : "text-white/40 hover:text-white"
                  }`}
                >
                  ⚡ LIVE TERMINAL TRACE
                </button>
                <button
                  type="button"
                  onClick={() => setConsoleTab("json")}
                  className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                    consoleTab === "json" ? "text-white bg-white/5 border border-white/10" : "text-white/40 hover:text-white"
                  }`}
                >
                  {`{ }`} JSON SCHEMA OUTPUT
                </button>
                <button
                  type="button"
                  onClick={() => setConsoleTab("yaml")}
                  className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer ${
                    consoleTab === "yaml" ? "text-white bg-white/5 border border-white/10" : "text-white/40 hover:text-white"
                  }`}
                >
                  📄 YAML GFF MANIFEST
                </button>
              </div>

              {/* Utility actions on code */}
              {consoleTab !== "terminal" && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyToClipboard}
                    className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-[10px] border border-white/5 hover:border-white/10 transition flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? "Copied! ✓" : "Copy to Clipboard"}
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadSpec}
                    className="px-3 py-1.5 rounded bg-[#009DFF]/15 hover:bg-[#009DFF]/25 text-[#009DFF] text-[10px] border border-[#009DFF]/20 hover:border-[#009DFF]/40 transition flex items-center gap-1 cursor-pointer"
                  >
                    {downloaded ? "Downloaded!" : "Download File"}
                  </button>
                </div>
              )}
            </div>

            {/* Panel Tab Viewports */}
            <div className="p-5 flex-1 overflow-y-auto bg-black/95 font-mono text-[11px] leading-relaxed select-text">
              {consoleTab === "terminal" ? (
                <div className="space-y-1 text-white/70">
                  {logs.map((log, idx) => {
                    const typeColors = {
                      system: "text-blue-400 font-bold",
                      info: "text-white/40",
                      agent: "text-purple-400",
                      success: "text-emerald-400 font-bold",
                      warning: "text-amber-400"
                    };
                    return (
                      <div key={idx} className="flex gap-4 items-start select-text">
                        <span className="text-white/20 shrink-0 select-none">[{log.time}]</span>
                        <span className={`${typeColors[log.type]} select-text`}>{log.text}</span>
                      </div>
                    );
                  })}
                  {isSimulating && (
                    <div className="flex items-center gap-2 text-white/30 pt-1 animate-pulse">
                      <span>_</span>
                    </div>
                  )}
                  <div ref={logsEndRef} />
                </div>
              ) : consoleTab === "json" ? (
                <pre className="text-blue-300 select-text overflow-x-auto whitespace-pre">{generateJSONSchema()}</pre>
              ) : (
                <pre className="text-emerald-300 select-text overflow-x-auto whitespace-pre">{generateYAMLManifest()}</pre>
              )}
            </div>

          </div>

        </div>
      </div>


      {/* Cross-Tool Navigator Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 max-w-6xl mx-auto">
        
        {/* Sandbox Link card */}
        <div className="p-6 rounded-2xl border border-white/5 bg-[#030304]/80 flex flex-col justify-between hover:border-white/10 transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#9D00FF]/5 to-transparent pointer-events-none" />
          <div>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded border border-[#9D00FF]/25 bg-[#9D00FF]/5 text-[#9D00FF]">SANDBOX DEPLOYER</span>
            <h3 className="text-lg font-bold text-white mt-4 group-hover:text-[#009DFF] transition-colors font-sans">Launch Zero-Trust Sandbox</h3>
            <p className="mt-2 text-xs text-white/50 leading-relaxed font-light font-sans">
              Transition your constructed visual DAG pipeline directly into an interactive trace logs simulator. Watch execution steps pass safely inside virtual cryptographic AMD SEV hardware boundaries.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-white/5">
            <Link href="/build/sandbox" className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-[#009DFF] transition font-sans">
              <span>OPEN SANDBOX SIMULATOR</span>
              <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Proposal Studio Link card */}
        <div className="p-6 rounded-2xl border border-white/5 bg-[#030304]/80 flex flex-col justify-between hover:border-white/10 transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#00FF9D]/5 to-transparent pointer-events-none" />
          <div>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded border border-[#00FF9D]/25 bg-[#00FF9D]/5 text-[#00FF9D]">COMMERCIAL SCOPING</span>
            <h3 className="text-lg font-bold text-white mt-4 group-hover:text-[#009DFF] transition-colors font-sans">Launch Proposal Studio</h3>
            <p className="mt-2 text-xs text-white/50 leading-relaxed font-light font-sans">
              Translate this technical topology diagram directly into professional commercials, implementation squad allocations, timeline models, and downloadable Statement of Work (SOW) decks.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-white/5">
            <Link href="/build/proposal" className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-[#009DFF] transition font-sans">
              <span>OPEN PROPOSAL BUILDER</span>
              <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

      </div>

      {/* Premium Call to Action */}
      <div className="mt-20">
        <PremiumCTA
          title="Ready to Build Your Sovereign Agent Workflow?"
          description="Engage our specialist engineering squad to instantiate this custom DAG architecture in a single-tenant, air-gapped VPC sandbox within 30 days."
          primaryLabel="Schedule Architecture Session"
          primaryHref="/#contact"
          secondaryLabel="Explore Sandbox Simulator"
          secondaryHref="/build/sandbox"
        />
      </div>

    </ToolPageShell>
  );
}


interface SovereignNodeCardProps {
  stage: WorkflowStage;
  idx: number;
  pos: NodePos;
  isSimulating: boolean;
  simulationProgress: number;
  selectedNodeId: string | null;
  selectedPattern: string;
  stagesCount: number;
  onSelect: (id: string) => void;
  onMove: (idx: number, dir: "left" | "right") => void;
  onDelete: (id: string, label: string) => void;
}

function SovereignNodeCard({
  stage,
  idx,
  pos,
  isSimulating,
  simulationProgress,
  selectedNodeId,
  selectedPattern,
  stagesCount,
  onSelect,
  onMove,
  onDelete,
}: SovereignNodeCardProps) {
  const meta = MODULE_DEFAULTS[stage.type];
  const isNodeActive = isSimulating && simulationProgress === idx;
  const isNodeCompleted = isSimulating ? simulationProgress > idx : false;
  const isSelected = selectedNodeId === stage.id;

  const isSupervisor = selectedPattern === "hierarchical" && stage.type === "reasoning";

  return (
    <div
      onClick={() => onSelect(stage.id)}
      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-[13.5rem] p-4 rounded-2xl border transition-all duration-300 cursor-pointer select-none group z-10 ${
        isSelected
          ? "bg-[#090f1a] border-[#009DFF] shadow-[0_0_20px_rgba(0,157,255,0.15)] scale-[1.02]"
          : isNodeActive
          ? "bg-[#05110f] border-[#00FF9D] shadow-[0_0_20px_rgba(0,255,157,0.2)] scale-[1.02] animate-pulse"
          : isNodeCompleted
          ? "bg-[#020603]/90 border-[#00FF9D]/20"
          : "bg-[#05070c]/95 border-white/5 hover:border-white/15"
      }`}
    >
      <div
        className="absolute top-0 inset-x-0 h-1 rounded-t-2xl transition"
        style={{
          backgroundColor: isNodeActive ? "#00FF9D" : isSelected ? "#009DFF" : isNodeCompleted ? "#00FF9D60" : `${meta.color}35`,
        }}
      />

      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-[10px] font-mono font-bold text-white/20">
          {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
        </span>
        {isSupervisor ? (
          <span className="px-2 py-0.5 rounded text-[8px] font-mono font-bold bg-[#9D00FF]/20 text-[#9D00FF] border border-[#9D00FF]/40 tracking-wider">
            👑 SUPERVISOR
          </span>
        ) : (
          <span
            className="px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-wider"
            style={{ backgroundColor: `${meta.color}15`, color: meta.color, border: `1px solid ${meta.color}25` }}
          >
            {stage.type}
          </span>
        )}
      </div>

      <div className="space-y-1">
        <h4 className="text-xs font-bold text-white truncate group-hover:text-[#009DFF] transition">
          {stage.label}
        </h4>
        <p className="text-[9px] text-white/40 font-mono leading-normal truncate">
          {stage.role}
        </p>
      </div>

      <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[9px] font-mono">
        <div className="text-white/30">
          DELAY: <span className="text-white/70 font-semibold">{stage.latency}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {isNodeActive ? (
            <span className="flex items-center gap-1 text-[#00FF9D] font-bold animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF9D]" />
              RUN
            </span>
          ) : isNodeCompleted ? (
            <span className="text-[#00FF9D] font-bold">✓ DONE</span>
          ) : (
            <span className="text-white/20">IDLE</span>
          )}
        </div>
      </div>

      {stage.isGated && (
        <div className="mt-2 py-1 px-2 rounded-lg bg-[#FBBF24]/5 border border-[#FBBF24]/10 flex items-center justify-center gap-1.5 text-[8px] font-bold text-[#FBBF24] tracking-wide uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FBBF24] animate-ping" />
          <span>👤 HUMAN REQUIRED</span>
        </div>
      )}

      <div className="absolute -top-3.5 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black border border-white/10 rounded-lg p-0.5 flex gap-1 shadow-xl z-20">
        {idx > 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMove(idx, "left");
            }}
            className="p-1 text-white/50 hover:text-white transition hover:bg-white/5 rounded text-[9px]"
            title="Move Left"
          >
            ←
          </button>
        )}
        {idx < stagesCount - 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMove(idx, "right");
            }}
            className="p-1 text-white/50 hover:text-white transition hover:bg-white/5 rounded text-[9px]"
            title="Move Right"
          >
            →
          </button>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(stage.id, stage.label);
          }}
          className="p-1 text-red-400 hover:text-red-500 transition hover:bg-white/5 rounded font-bold text-[9px]"
          title="Delete Node"
        >
          ×
        </button>
      </div>
    </div>
  );
}


