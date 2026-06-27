"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { 
  Search, Filter, ArrowRight, Check, CheckCircle2, X, Play, 
  Server, Terminal, Activity, Database, ShieldCheck, Layers, 
  Settings, Cpu, Plus, RefreshCw, MessageSquare, ShieldAlert, Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import MotionReveal from "@/components/inner-pages/MotionReveal";
import { BentoGrid, BentoCard } from "@/components/inner-pages/BentoGrid";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";
import NextBestAction from "@/components/build/NextBestAction";
import RelatedPagesGrid from "@/components/inner-pages/RelatedPagesGrid";

import { getToolState, saveToolState } from "@/components/build/workspaceUtility";

interface SandboxQA {
  prompt: string;
  answer: string;
}

interface AgentBlueprint {
  id: string;
  name: string;
  category: "Knowledge Agents" | "Operations Agents" | "Compliance Agents" | "Customer Experience Agents" | "Executive Agents" | "Document Intelligence Agents" | "Procurement Agents" | "HR Agents";
  desc: string;
  useCase: string;
  gffFit: "Garage" | "Foundry" | "Factory";
  relatedCapabilities: string[];
  industry: string;
  function: string;
  maturityStage: "Production-Ready" | "Pilot Active" | "In-Design";
  platformFit: "Sovereign Stack" | "Hybrid Cloud" | "On-Premises";
  stages: string[];
  datasources: string;
  perfMetric: string;
  systemPrompt: string;
  sandboxResponse: SandboxQA[];
}

const CATEGORIES = [
  "All Patterns",
  "Knowledge Agents",
  "Operations Agents",
  "Compliance Agents",
  "Customer Experience Agents",
  "Executive Agents",
  "Document Intelligence Agents",
  "Procurement Agents",
  "HR Agents"
] as const;

const INDUSTRIES = [
  "All Industries", "Financial Services", "Healthcare & Life Sciences", 
  "Manufacturing", "Retail & E-Commerce", "Energy & Utilities", 
  "Telecommunications", "Logistics & Transport", "Cross-Industry"
];

const FUNCTIONS = [
  "All Functions", "Legal & Compliance", "Research & Development", 
  "Logistics", "Inventory Operations", "Information Security", 
  "Finance & Accounting", "Customer Service", "Account Management", 
  "Executive Strategy", "Mergers & Acquisitions", "Engineering Operations", 
  "Procurement & Sourcing", "Human Resources"
];

const MATURITIES = ["All Stages", "Production-Ready", "Pilot Active", "In-Design"];
const PLATFORM_FITS = ["All Fits", "Sovereign Stack", "Hybrid Cloud", "On-Premises"];

const BLUEPRINTS: AgentBlueprint[] = [
  {
    id: "sovereign-research-synth",
    name: "Sovereign Research Synthesizer",
    category: "Knowledge Agents",
    desc: "Integrates R&D databases, scientific archives, and semantic graph layers into an enterprise real-time intelligence hub, safely synthesizing multi-vector context.",
    useCase: "Multi-vector intelligence parsing for clinical trials and R&D divisions.",
    gffFit: "Foundry",
    relatedCapabilities: ["Semantic Parsing", "Context Stitching", "Vector Graph Alignment"],
    industry: "Healthcare & Life Sciences",
    function: "Research & Development",
    maturityStage: "Production-Ready",
    platformFit: "Sovereign Stack",
    stages: ["Doc Ingest", "Hierarchical Embedding", "Ontology Linking", "Context Synthesis"],
    datasources: "Local PDF Repositories, Internal Confluence, Neo4j Ontology Store",
    perfMetric: "98.7% Synthesis Accuracy",
    systemPrompt: "Synthesize scientific R&D documentation. Strictly reject speculative interpretations. Include absolute source citations.",
    sandboxResponse: [
      {
        prompt: "Summarize latest vector movements in R&D transcripts.",
        answer: "[QUERY PARSING... OK]\n[SEMANTIC EMBEDDING RETRIEVAL: Match threshold 0.91]\n\nBased on certified research documentation from Q1-2026, two key vector movements have stabilized:\n1. High-fidelity CRISP modifications show a 40% reduction in off-target cleavages.\n2. Polymeric nanoparticle carriers demonstrate a 94% transfection rate.\n\nConfidence: 98.7% | Sources: bio-vault-01.pdf"
      }
    ]
  },
  {
    id: "supply-chain-optimizer",
    name: "Supply Chain Resiliency Optimizer",
    category: "Operations Agents",
    desc: "Monitors supply chain logs, parses logistics anomalies, simulates impact boundaries, and commits mitigation transactions back to SAP/ERP cores.",
    useCase: "Predictive logistical disruption mitigation and automated shipment re-routing.",
    gffFit: "Factory",
    relatedCapabilities: ["Logistical Event Parsing", "Temporal Planning", "ERP Write-Back"],
    industry: "Manufacturing",
    function: "Logistics",
    maturityStage: "Pilot Active",
    platformFit: "Hybrid Cloud",
    stages: ["Kafka Log Stream", "Temporal Impact Parse", "Simulation Engine", "SAP ERP Gateway"],
    datasources: "SAP S/4HANA, Kafka Event Bus, Global Weather Feeds",
    perfMetric: "94.2% Disruption Mitigation",
    systemPrompt: "Evaluate logistical alternatives strictly under margin safety bounds. Draft SAP transaction updates with approval seals.",
    sandboxResponse: [
      {
        prompt: "Simulate impact of Rotterdam harbor delays.",
        answer: "[KAFKA INGESTION ACTIVE - 3 ACTIVE ALERTS]\n[SIMULATING SCENARIO: Rotterdam Transit Delay +48 hrs]\n\nScenario Results:\n- Shipments Impacted: 3 containers of catalyst.\n- Plant Impact: Inventory at Dusseldorf will drop below safety reserve in 14 hours.\n- Mitigating Action: Redirect to Antwerp depot.\n\nAction: TRANSACTION PREPPED (Pending SAP Commit)."
      }
    ]
  },
  {
    id: "zero-trust-pii-guard",
    name: "Zero-Trust Sovereign PII Guard",
    category: "Compliance Agents",
    desc: "Inspects agent system calls, sanitizes outbound telemetry, dynamically masks sensitive personal data, and intercepts potential prompt-injection patterns.",
    useCase: "Real-time automated sanitization of agent query streams in regulated sectors.",
    gffFit: "Factory",
    relatedCapabilities: ["eBPF Interception", "Dynamic Entity Masking", "Policy Auditing"],
    industry: "Cross-Industry",
    function: "Information Security",
    maturityStage: "Production-Ready",
    platformFit: "On-Premises",
    stages: ["eBPF Intercept", "Dynamic Redaction Filter", "Policy Engine Match", "Sanitized Gateway"],
    datasources: "HashiCorp Vault Secrets, GFF Gateway Logs, Kubernetes ConfigMaps",
    perfMetric: "<8ms Interception Latency",
    systemPrompt: "Intercept and redact SSNs, banking credentials, and private keys. Throw exceptions if safety policies are breached.",
    sandboxResponse: [
      {
        prompt: "Ingest prompt containing SSN: 000-12-3456.",
        answer: "[eBPF LAYER DETECTED SENSITIVE INFO]\n[REDACTION EXECUTED]\n\nInbound prompt sanitized:\n- SSN: [REDACTED_SSN_MASK_001]\n\nClean stream dispatched to core language model."
      }
    ]
  },
  {
    id: "personalized-cx-broker",
    name: "Hyper-Personalized CX Broker",
    category: "Customer Experience Agents",
    desc: "Classifies customer intent markers, orchestrates personalized resolutions, and drafts highly accurate, policy-approved drafts for service desks.",
    useCase: "Multi-channel B2C customer service resolution and automated ticket processing.",
    gffFit: "Foundry",
    relatedCapabilities: ["Intent Multi-Classification", "Persona Adaptation", "Human-in-the-Loop Gate"],
    industry: "Retail & E-Commerce",
    function: "Customer Service",
    maturityStage: "Production-Ready",
    platformFit: "Hybrid Cloud",
    stages: ["Omnichannel Hook", "Intent Classifier", "Knowledge Fetch", "Human Gate Route"],
    datasources: "Zendesk Webhooks, Salesforce CRM, Braze Messaging Hub",
    perfMetric: "84.5% Automated Resolution Rate",
    systemPrompt: "Address customer inquiries while strictly enforcing return policy parameters. Never exceed validated invoice thresholds.",
    sandboxResponse: [
      {
        prompt: "Inbound ticket: 'I ordered a GFF-Node-V2 and it arrived cracked.'",
        answer: "[INTENT CLASSIFIER: Damaged Item / Replacement Request]\n[RETURNS POLICY CHECK: Valid within 30 days]\n\nDraft Resolution:\n'Hello. We are sorry to hear your node was damaged in transit. You are fully eligible for a priority replacement at zero additional cost.'\n\n[HUMAN GATEWAY ENFORCED] Sent to success desk for review."
      }
    ]
  },
  {
    id: "scenario-modeler-agent",
    name: "Scenario Modeler & Corporate Risk Agent",
    category: "Executive Agents",
    desc: "Performs strategic board-level strategic risk simulations, aggregates multi-departmental financial forecasts, and structures secure briefing reports.",
    useCase: "Simulating market variance projections and writing board-level decision reports.",
    gffFit: "Garage",
    relatedCapabilities: ["Monte Carlo Aggregation", "Macro-Economic Synthesis", "Briefing Compilation"],
    industry: "Cross-Industry",
    function: "Executive Strategy",
    maturityStage: "Pilot Active",
    platformFit: "Sovereign Stack",
    stages: ["Snowflake Ingestion", "Risk Modeler Engine", "Summarizer Node", "Sovereign PDF Compile"],
    datasources: "Snowflake Data Warehouse, General Ledger, Macro Feeds",
    perfMetric: "99.5% Trend Projection Matching",
    systemPrompt: "Simulate macro-economic scenarios. Restrict focus to liquidity ratios and capital reserves. Include confidence metrics.",
    sandboxResponse: [
      {
        prompt: "Simulate a 15% increase in commodity procurement costs.",
        answer: "[RUNNING MONTE CARLO SIMULATION: 10,000 iterations]\n\nSimulation Results under 1 surge:\n- Net Margin Impact: -2.4% EBITDA across Manufacturing.\n- Capital Reserves: Liquidity ratio decreases from 2.1 to 1.85.\n\nConfidence: 94% | Report prepped: executive-commodity-impact.pdf"
      }
    ]
  },
  {
    id: "multi-format-doc-analyzer",
    name: "Multi-Format Technical Document Analyzer",
    category: "Document Intelligence Agents",
    desc: "Parses complex technical engineering diagrams, SOX spreadsheets, and CAD schematics, aligning structural layout patterns with technical specifications.",
    useCase: "Extracting metadata and compliance flags from complex engineering design blueprints.",
    gffFit: "Foundry",
    relatedCapabilities: ["Hierarchical Blueprint Reading", "Engineering Spec Extraction", "CAD-Reference Mapping"],
    industry: "Energy & Utilities",
    function: "Engineering Operations",
    maturityStage: "Production-Ready",
    platformFit: "On-Premises",
    stages: ["S3 CAD Inbound", "Layout Parser", "Structural Extraction", "Spec Reconciliation"],
    datasources: "S3 Document Bucket, Engineering Spec Database, PLM Repository",
    perfMetric: "97.9% Key-Value Extraction Accuracy",
    systemPrompt: "Extract operational limits from technical diagrams. Flag any structural variances that deviate from GFF tolerances.",
    sandboxResponse: [
      {
        prompt: "Analyze CAD Spec Sheet: GFF-Turbine-V4.pdf.",
        answer: "[INGESTING S3 METADATA... OK]\n[RUNNING LAYOUT PARSER]\n\nExtracted Parameters:\n- Rotor Diameter: 14.2m (Complies with Spec)\n- Core Operating Temperature: Up to 410C (WARNING: Exceeds standard GFF thermal guideline of 395C by 15C).\n\nThermal tolerance deviation has been logged."
      }
    ]
  },
  {
    id: "freight-audit-agent",
    name: "Global Freight Audit Agent",
    category: "Procurement Agents",
    desc: "Audits high-volume carrier bills of lading against rate cards, identifies tariff discrepancies, and drafts dispute filings automatically.",
    useCase: "Continuous automated carrier invoice reconciliation and freight dispute resolution.",
    gffFit: "Factory",
    relatedCapabilities: ["Invoice Reconciliation", "Tariff Matching", "Dispute Resolution Engine"],
    industry: "Logistics & Transport",
    function: "Procurement & Sourcing",
    maturityStage: "Production-Ready",
    platformFit: "Sovereign Stack",
    stages: ["Invoice Parser", "BOL Cross-Check", "Tariff Verifier", "Payment Dispatcher"],
    datasources: "Carrier Logistics Portals, TMS Database, Tariff Agreement Repositories",
    perfMetric: "100% Rate Error Identification Rate",
    systemPrompt: "Compare bill of lading charges against approved contract tariff sheets. Initiate dispute files for discrepancies exceeding $10.",
    sandboxResponse: [
      {
        prompt: "Audit carrier invoice: INV-99214-Oceanic.csv.",
        answer: "[INGESTING OCEANIC INVOICE LINES... OK]\n[CROSS-REFERENCING RATES AGAINST TARIFFS]\n\nAudit Results:\n- Total Invoices Audited: 42 lines\n- Error Found: Line #18 (Fuel Surcharge) matches at 14.5% ($1,850). Approved rate card limits fuel surcharge to 12% ($1,531).\n\nAction: Flagged $319 overcharge. Dispute letter prepped."
      }
    ]
  },
  {
    id: "talent-alignment-planner",
    name: "Talent Alignment & Org Planner",
    category: "HR Agents",
    desc: "Maps anonymized employee profiles and professional credentials to internal capability gaps, prioritizing talent mobility in full data privacy.",
    useCase: "Internal talent matching, career pathing, and privacy-preserving org design.",
    gffFit: "Garage",
    relatedCapabilities: ["Skill Ontology Mapping", "Internal Mobility Matching", "Privacy-Preserving Semantics"],
    industry: "Cross-Industry",
    function: "Human Resources",
    maturityStage: "Pilot Active",
    platformFit: "On-Premises",
    stages: ["Anonymize Profiles", "Ontology Alignment", "Opportunity Matcher", "Advisory Compiler"],
    datasources: "Workday HCM, Internal Skill Matrices, Learning Management Systems",
    perfMetric: "3.2x Internal Talent Mobility Uplift",
    systemPrompt: "Analyze career trajectories and internal credentials in an anonymized sandbox. Avoid references to demographics.",
    sandboxResponse: [
      {
        prompt: "Find candidate profiles suited for Senior AI opening.",
        answer: "[SCANNING SKILL MATRICES: Anonymized Profile Pool]\n\nTop Matches Found:\n1. Profile ID: #ANON-99021 (Alignment: 94% - matches lead Next.js framework qualifications and GFF Certs).\n\nRecommendations compiled in secure portal."
      }
    ]
  }
];



export default function BuildMarketplacePage() {
  // State variables
  const [activeTab, setActiveTab] = useState<string>("All Patterns");
  const [industryFilter, setIndustryFilter] = useState<string>("All Industries");
  const [functionFilter, setFunctionFilter] = useState<string>("All Functions");
  const [maturityFilter, setMaturityFilter] = useState<string>("All Stages");
  const [platformFilter, setPlatformFilter] = useState<string>("All Fits");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [toastError, setToastError] = useState<string | null>(null);

  const [isHydrated, setIsHydrated] = useState(false);

  // Load from GFF Workspace on mount
  useEffect(() => {
    const saved = getToolState("marketplace");
    if (saved) {
      if (saved.activeTab) setActiveTab(saved.activeTab);
      if (saved.industryFilter) setIndustryFilter(saved.industryFilter);
      if (saved.functionFilter) setFunctionFilter(saved.functionFilter);
      if (saved.maturityFilter) setMaturityFilter(saved.maturityFilter);
      if (saved.platformFilter) setPlatformFilter(saved.platformFilter);
      if (typeof saved.searchQuery === "string") setSearchQuery(saved.searchQuery);
      if (Array.isArray(saved.compareIds)) setCompareIds(saved.compareIds);
    }
    setIsHydrated(true);
  }, []);

  // Save to GFF Workspace on changes
  useEffect(() => {
    if (isHydrated) {
      saveToolState("marketplace", {
        activeTab,
        industryFilter,
        functionFilter,
        maturityFilter,
        platformFilter,
        searchQuery,
        compareIds
      });
    }
  }, [
    isHydrated,
    activeTab,
    industryFilter,
    functionFilter,
    maturityFilter,
    platformFilter,
    searchQuery,
    compareIds
  ]);

  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);

  // Handle ?compare=true URL deep-action
  useEffect(() => {
    if (isHydrated && typeof window !== "undefined") {
      try {
        const params = new URLSearchParams(window.location.search);
        if (params.get("compare") === "true") {
          setIsCompareOpen(true);
          setCompareIds(prev => {
            if (prev.length === 0) {
              return ["sovereign-research-synth", "supply-chain-optimizer"];
            }
            return prev;
          });
        }
      } catch (e) {
        console.error("Failed to parse compare param from URL:", e);
      }
    }
  }, [isHydrated]);

  const [sandboxId, setSandboxId] = useState<string | null>(null);
  const [sandboxLogs, setSandboxLogs] = useState<string[]>([]);
  const [sandboxInput, setSandboxInput] = useState<string>("");
  const [sandboxIsBooting, setSandboxIsBooting] = useState<boolean>(false);
  const [sandboxIsSuccess, setSandboxIsSuccess] = useState<boolean>(false);
  
  const [chatId, setChatId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "agent"; text: string }>>([]);
  const [chatInput, setChatInput] = useState<string>("");

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const totalCertifiedCount = BLUEPRINTS.length;
  const prodReadyCount = BLUEPRINTS.filter(b => b.maturityStage === "Production-Ready").length;


  // Computed variables and filtering
  const filteredBlueprints = useMemo(() => {
    return BLUEPRINTS.filter((bp) => {
      if (activeTab !== "All Patterns" && bp.category !== activeTab) return false;
      if (industryFilter !== "All Industries" && bp.industry !== industryFilter) return false;
      if (functionFilter !== "All Functions" && bp.function !== functionFilter) return false;
      if (maturityFilter !== "All Stages" && bp.maturityStage !== maturityFilter) return false;
      if (platformFilter !== "All Fits" && bp.platformFit !== platformFilter) return false;

      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesName = bp.name.toLowerCase().includes(query);
        const matchesDesc = bp.desc.toLowerCase().includes(query);
        const matchesUseCase = bp.useCase.toLowerCase().includes(query);
        const matchesCapabilities = bp.relatedCapabilities.some((cap) => cap.toLowerCase().includes(query));
        return matchesName || matchesDesc || matchesUseCase || matchesCapabilities;
      }

      return true;
    });
  }, [activeTab, industryFilter, functionFilter, maturityFilter, platformFilter, searchQuery]);

  const isFilterActive = useMemo(() => {
    return (
      activeTab !== "All Patterns" ||
      industryFilter !== "All Industries" ||
      functionFilter !== "All Functions" ||
      maturityFilter !== "All Stages" ||
      platformFilter !== "All Fits" ||
      searchQuery !== ""
    );
  }, [activeTab, industryFilter, functionFilter, maturityFilter, platformFilter, searchQuery]);

  const resetAllFilters = () => {
    setActiveTab("All Patterns");
    setIndustryFilter("All Industries");
    setFunctionFilter("All Functions");
    setMaturityFilter("All Stages");
    setPlatformFilter("All Fits");
    setSearchQuery("");
  };

  const comparedAgents = useMemo(() => {
    return BLUEPRINTS.filter((bp) => compareIds.includes(bp.id));
  }, [compareIds]);


  // Core handlers
  const toggleCompare = (id: string) => {
    if (compareIds.includes(id)) {
      setCompareIds((prev) => prev.filter((item) => item !== id));
    } else {
      if (compareIds.length >= 3) {
        setToastError("Maximum comparison limit reached. Please remove an agent before adding another.");
        setTimeout(() => setToastError(null), 4000);
        return;
      }
      setCompareIds((prev) => [...prev, id]);
    }
  };

  const clearComparison = () => {
    setCompareIds([]);
    setIsCompareOpen(false);
  };

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [sandboxLogs, sandboxIsBooting]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  const handleOpenSandbox = (id: string) => {
    const bp = BLUEPRINTS.find((b) => b.id === id);
    if (!bp) return;

    setSandboxId(id);
    setSandboxIsBooting(true);
    setSandboxIsSuccess(false);
    setSandboxLogs([]);
    setSandboxInput("");

    const bootLogs = [
      `Initializing secure OCI container for ${bp.id}_v1.0...`,
      `Enforcing Context Boundary Spec (VPC: isolated-gff, RAM: 16GB, GPU Allocation: 2x Nvidia H100)...`,
      `Activating Safety Redaction filters (Zero-Trust eBPF Packet Inspector)...`,
      `Establishing cryptographic connections to local adapters: [${bp.datasources}]...`,
      `Injecting Sovereign System Directives into local context pipeline...`,
      `[SUCCESS] Safe containment boundaries established. Sandbox online.`
    ];

    let timer = 0;
    bootLogs.forEach((log, index) => {
      setTimeout(() => {
        setSandboxLogs((prev) => [...prev, `> ${log}`]);
        if (index === bootLogs.length - 1) {
          setSandboxIsBooting(false);
          setSandboxIsSuccess(true);
        }
      }, timer);
      timer += 400;
    });
  };

  const handleSandboxSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!sandboxInput.trim() || !sandboxId) return;

    const bp = BLUEPRINTS.find((b) => b.id === sandboxId);
    if (!bp) return;

    const userPrompt = sandboxInput;
    setSandboxLogs((prev) => [...prev, `$ ${userPrompt}`]);
    setSandboxInput("");

    setTimeout(() => {
      const matchedQA = bp.sandboxResponse.find(
        (qa) => qa.prompt.toLowerCase().includes(userPrompt.toLowerCase()) || 
                userPrompt.toLowerCase().includes(qa.prompt.toLowerCase())
      );

      if (matchedQA) {
        setSandboxLogs((prev) => [...prev, matchedQA.answer]);
      } else {
        setSandboxLogs((prev) => [
          ...prev, 
          `[EVALUATING SEMANTIC GRAPH VECTOR... OK]\n[MATCH CRITERIA MET WITH LOW THRESHOLD]\n\nReceived: "${userPrompt}"\n\n[COMPLIANCE GATE NOTICE] Standard safety instruction intercepts any raw query not predefined inside this demo terminal. To execute custom queries, deploy this blueprint inside GFF Foundry Studio or consult with an integration engineer.\n\nSovereign System Directives are active: Zero risk of data leaks.`
        ]);
      }
    }, 800);
  };

  const handlePresetSandboxQuery = (queryText: string) => {
    setSandboxInput(queryText);
    setTimeout(() => {
      setSandboxLogs((prev) => [...prev, `$ ${queryText}`]);
      setSandboxInput("");
      const bp = BLUEPRINTS.find((b) => b.id === sandboxId);
      if (!bp) return;
      const matchedQA = bp.sandboxResponse.find((qa) => qa.prompt === queryText);
      if (matchedQA) {
        setSandboxLogs((prev) => [...prev, matchedQA.answer]);
      }
    }, 200);
  };

  const handleOpenChat = (id: string) => {
    const bp = BLUEPRINTS.find((b) => b.id === id);
    if (!bp) return;

    setChatId(id);
    setChatInput("");
    setChatMessages([
      {
        sender: "agent",
        text: `Secure connection established with ${bp.name} (ID: ${bp.id}_v1.0). I am running within a sovereign execution enclave. How can I assist you with your integration blueprint or structural architecture today?`
      }
    ]);
  };

  const handleChatSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || !chatId) return;

    const userMsg = chatInput;
    setChatMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setChatInput("");

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "agent",
          text: `Understood. Your inquiry regarding "${userMsg}" relates directly to GFF ${
            BLUEPRINTS.find((b) => b.id === chatId)?.gffFit
          } deployment guidelines. Every transaction is governed by strict local context constraints. For detailed topology maps and integration templates, let's schedule a dedicated GFF Systems Engineer Sync.`
        }
      ]);
    }, 600);
  };


  return (
    <InnerPageShell>
      {/* Background Dots */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <InnerPageHero
        category="Sovereign Assets"
        title="Agent Blueprint Registry and Architecture Catalog"
        highlightedWord="Registry"
        highlightColor="blue"
        description="Explore GFF's catalog of certified multi-agent patterns, workflows, and accelerators. Every blueprint is pre-engineered with strict input/output boundaries, static integration boundaries, and dedicated safety enclaves for secure, localized execution."
        breadcrumbs={[
          { label: "Build Suite", href: "/build" },
          { label: "Blueprint Registry" }
        ]}
      />

      {/* REGISTRY TELEMETRY BANNERS */}
      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 -mt-8 mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-[#040405] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[20%] h-[100%] bg-gradient-to-l from-blue-500/5 to-transparent blur-[40px] pointer-events-none" />
          
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest font-bold">BLUEPRINTS ACTIVE</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white font-mono">{totalCertifiedCount}</span>
              <span className="text-[10px] text-green-400 font-mono flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3 inline" /> CERTIFIED
              </span>
            </div>
            <p className="text-xs text-white/50 font-light">Verified sovereign standards</p>
          </div>

          <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-white/5 pt-4 sm:pt-0 sm:pl-6">
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest font-bold">DEPLOYMENT BASELINE</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#009DFF] font-mono">OCI</span>
              <span className="text-[11px] text-white/70 font-mono font-semibold">Containerized</span>
            </div>
            <p className="text-xs text-white/50 font-light">Air-gapped VPC enclaves</p>
          </div>

          <div className="space-y-1 border-t lg:border-t-0 lg:border-l border-white/5 pt-4 lg:pt-0 lg:pl-6">
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest font-bold">PRODUCTION READY</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white font-mono">{prodReadyCount}</span>
              <span className="text-[11px] text-white/50 font-semibold">/ {totalCertifiedCount} Ready</span>
            </div>
            <p className="text-xs text-white/50 font-light">Immediate node orchestration</p>
          </div>

          <div className="space-y-1 border-t lg:border-t-0 lg:border-l border-white/5 pt-4 lg:pt-0 lg:pl-6">
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest font-bold">COMPLIANCE ASSURANCE</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-green-400 font-mono">100%</span>
              <span className="text-[11px] text-green-400/80 font-mono font-bold">REGULATED</span>
            </div>
            <p className="text-xs text-white/50 font-light">Zero-data-leakage guarantee</p>
          </div>
        </div>
      </div>

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 space-y-12 pb-24 relative">
        {/* INTERACTIVE FILTERS BLOCK */}
        <MotionReveal className="bg-[#030304]/80 backdrop-blur-md rounded-2xl border border-white/5 p-6 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:max-w-md">
              <Search className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                id="marketplace-search-input"
                aria-label="Search blueprints, capabilities, keywords"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search blueprints, capabilities, keywords..."
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#009DFF]/50 focus:ring-1 focus:ring-[#009DFF]/20 transition-all font-light"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-white/40 flex items-center gap-1.5 uppercase">
                <Filter className="w-3.5 h-3.5" /> Parameters
              </span>
              {isFilterActive && (
                <button
                  onClick={resetAllFilters}
                  className="text-xs font-semibold text-red-500 hover:text-red-400 transition-colors flex items-center gap-1 cursor-pointer bg-red-500/5 px-2.5 py-1 rounded border border-red-500/10"
                >
                  <RefreshCw className="w-3 h-3" /> Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* ADVANCED SELECTORS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-white/5">
            {/* Industry */}
            <div className="space-y-1.5">
              <label htmlFor="industry-filter" className="text-[10px] font-mono text-white/40 uppercase tracking-widest font-bold cursor-pointer">Industry Scope</label>
              <select
                id="industry-filter"
                value={industryFilter}
                onChange={(e) => setIndustryFilter(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white/80 focus:outline-none focus:border-[#009DFF]/50 transition-all cursor-pointer font-light font-sans"
              >
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind} className="bg-black text-white">{ind}</option>
                ))}
              </select>
            </div>

            {/* Function */}
            <div className="space-y-1.5">
              <label htmlFor="function-filter" className="text-[10px] font-mono text-white/40 uppercase tracking-widest font-bold cursor-pointer">Operational Function</label>
              <select
                id="function-filter"
                value={functionFilter}
                onChange={(e) => setFunctionFilter(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white/80 focus:outline-none focus:border-[#009DFF]/50 transition-all cursor-pointer font-light font-sans"
              >
                {FUNCTIONS.map((f) => (
                  <option key={f} value={f} className="bg-black text-white">{f}</option>
                ))}
              </select>
            </div>

            {/* Maturity */}
            <div className="space-y-1.5">
              <label htmlFor="maturity-filter" className="text-[10px] font-mono text-white/40 uppercase tracking-widest font-bold cursor-pointer">Maturity Stage</label>
              <select
                id="maturity-filter"
                value={maturityFilter}
                onChange={(e) => setMaturityFilter(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white/80 focus:outline-none focus:border-[#009DFF]/50 transition-all cursor-pointer font-light font-sans"
              >
                {MATURITIES.map((m) => (
                  <option key={m} value={m} className="bg-black text-white">{m}</option>
                ))}
              </select>
            </div>

            {/* Platform Fit */}
            <div className="space-y-1.5">
              <label htmlFor="platform-filter" className="text-[10px] font-mono text-white/40 uppercase tracking-widest font-bold cursor-pointer">Enclave Fit</label>
              <select
                id="platform-filter"
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white/80 focus:outline-none focus:border-[#009DFF]/50 transition-all cursor-pointer font-light font-sans"
              >
                {PLATFORM_FITS.map((p) => (
                  <option key={p} value={p} className="bg-black text-white">{p}</option>
                ))}
              </select>
            </div>
          </div>

          {/* HORIZONTAL CATEGORY TABS */}
          <div className="pt-4 border-t border-white/5">
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-3 font-bold">Agent Family Category</span>
            <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap border ${
                    activeTab === cat
                      ? "bg-white/10 text-white border-white/20 shadow-sm"
                      : "text-white/40 border-transparent hover:text-white hover:bg-white/5"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </MotionReveal>

        {/* ACTIVE FILTERS SUMMARY */}
        {isFilterActive && (
          <div className="flex items-center justify-between text-xs text-white/50 bg-[#009DFF]/5 border border-[#009DFF]/10 rounded-xl px-5 py-3 font-light">
            <div className="flex items-center gap-1.5">
              <Info className="w-4 h-4 text-[#009DFF]" />
              <span>Showing <strong>{filteredBlueprints.length}</strong> of <strong>{totalCertifiedCount}</strong> blueprints matching parameters.</span>
            </div>
            <button onClick={resetAllFilters} className="text-[#009DFF] hover:underline font-semibold cursor-pointer">Clear Filters</button>
          </div>
        )}
        {/* BLUEPRINTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {filteredBlueprints.length > 0 ? (
            filteredBlueprints.map((bp) => {
              const isCompareChecked = compareIds.includes(bp.id);
              const gffTiers = {
                Garage: { text: "text-teal-400", bg: "bg-teal-500/5", border: "border-teal-500/20" },
                Foundry: { text: "text-purple-400", bg: "bg-purple-500/5", border: "border-purple-500/20" },
                Factory: { text: "text-red-400", bg: "bg-red-500/5", border: "border-red-500/20" }
              };
              const tierColor = gffTiers[bp.gffFit];
              return (
                <MotionReveal 
                  key={bp.id}
                  className="group relative overflow-hidden rounded-[24px] border border-white/5 bg-[#050507]/90 p-6 lg:p-8 flex flex-col justify-between transition-all duration-300 hover:border-white/15 hover:shadow-[0_0_30px_rgba(0,0,0,0.4)]"
                >
                  <div className="space-y-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-mono font-semibold tracking-wider text-white/40 uppercase">
                          {bp.category}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded border uppercase font-bold tracking-widest ${tierColor.text} ${tierColor.bg} ${tierColor.border}`}>
                            GFF: {bp.gffFit}
                          </span>
                          <span className="text-[10px] text-white/30 font-mono tracking-tight">{bp.platformFit}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleCompare(bp.id)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 border transition-all cursor-pointer ${
                          isCompareChecked
                            ? "bg-[#009DFF]/15 text-[#009DFF] border-[#009DFF]/35"
                            : "bg-white/5 text-white/50 border-white/10 hover:text-white hover:border-white/20"
                        }`}
                      >
                        {isCompareChecked ? <Check className="w-3.5 h-3.5 animate-pulse" /> : <Plus className="w-3.5 h-3.5" />}
                        Compare
                      </button>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-[#009DFF] transition-colors duration-300">
                        {bp.name}
                      </h3>
                      <p className="mt-2 text-xs text-white/50 leading-relaxed font-light font-mono">
                        Use Case: <span className="text-white/80 font-sans italic">"{bp.useCase}"</span>
                      </p>
                      <p className="mt-3 text-sm leading-[1.6] text-white/70 font-light font-sans">
                        {bp.desc}
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-white/30 block">SYSTEM MATRICES</span>
                      <div className="flex flex-wrap gap-1.5">
                        {bp.relatedCapabilities.map((cap) => (
                          <span key={cap} className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-white/5 text-white/60 border border-white/5">
                            {cap}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 pt-5 border-t border-white/5 flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-mono text-white/30">TELEMETRY BASE</span>
                      <span className="text-[11px] font-semibold text-green-400 font-mono tracking-tight">{bp.perfMetric}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenSandbox(bp.id)}
                        className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#009DFF] text-white hover:bg-[#009DFF]/90 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <Play className="w-3 h-3 fill-current" /> Run Sandbox
                      </button>
                      <button
                        onClick={() => handleOpenChat(bp.id)}
                        className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/5 text-white border border-white/10 hover:bg-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" /> Talk to Agent
                      </button>
                    </div>
                  </div>
                </MotionReveal>
              );
            })
          ) : (
            <div className="col-span-2 py-20 text-center space-y-4 rounded-3xl border border-white/5 bg-black/40">
              <ShieldAlert className="w-12 h-12 text-red-500 mx-auto" />
              <h3 className="text-lg font-bold text-white">No Blueprints Match Your Criteria</h3>
              <p className="text-xs text-white/50 max-w-sm mx-auto font-light">We specialize in designing bespoke, highly tailored sovereign architectures. Connect with our principal systems architects to design custom templates.</p>
              <button
                onClick={resetAllFilters}
                className="px-5 py-2 text-xs font-semibold text-white bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all cursor-pointer"
              >
                Reset Filter Settings
              </button>
            </div>
          )}
        </div>
        {/* FLOATING COMPARISON DRAWER */}
        <AnimatePresence>
          {compareIds.length > 0 && (
            <motion.div
              initial={{ y: 50, x: "-50%", opacity: 0 }}
              animate={{ y: 0, x: "-50%", opacity: 1 }}
              exit={{ y: 50, x: "-50%", opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed bottom-6 left-1/2 z-50 w-full max-w-2xl px-4"
            >
              <div className="bg-[#050508]/95 backdrop-blur-xl border border-white/15 rounded-2xl p-4 shadow-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 overflow-x-auto max-w-full sm:max-w-[65%] scrollbar-none">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">COMPARISON</span>
                    <span className="text-xs font-bold text-white font-mono">{compareIds.length}/3 Blueprints</span>
                  </div>
                  
                  <div className="h-6 w-[1px] bg-white/10 shrink-0" />

                  <div className="flex items-center gap-2 shrink-0">
                    {comparedAgents.map((agent) => (
                      <div 
                        key={agent.id}
                        className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[10px] text-white/80 font-mono flex items-center gap-1.5"
                      >
                        <span className="truncate max-w-[120px]">{agent.name}</span>
                        <button 
                          onClick={() => toggleCompare(agent.id)}
                          className="text-white/40 hover:text-white cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                  <button
                    onClick={clearComparison}
                    className="text-[11px] font-mono text-white/40 hover:text-white cursor-pointer"
                  >
                    Clear
                  </button>

                  <button
                    onClick={() => setIsCompareOpen(true)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#009DFF] text-white hover:bg-[#009DFF]/90 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    Analyze Specs <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* COMPARATIVE SPECIFICATIONS MODAL */}
        <AnimatePresence>
          {isCompareOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 overflow-y-auto flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, y: 15, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 15, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="bg-[#050508] border border-white/10 rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden relative"
              >
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/40">
                  <div>
                    <span className="text-[10px] font-mono text-[#009DFF] uppercase tracking-widest font-bold">Registry Inspector</span>
                    <h2 className="text-xl font-bold text-white tracking-tight mt-1">Side-by-Side Architectural Matrix</h2>
                  </div>
                  <button onClick={() => setIsCompareOpen(false)} className="p-2 text-white/50 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
                </div>
                <div className="overflow-x-auto p-6 scrollbar-none">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="py-4 pr-6 text-xs font-mono text-white/40 uppercase tracking-wider w-[20%]">Specification</th>
                        {comparedAgents.map((agent) => (
                          <th key={agent.id} className="py-4 px-6 text-sm font-bold text-white w-[26%]">
                            <span className="text-[9px] font-mono text-[#009DFF] uppercase font-bold block mb-1">{agent.category}</span>
                            {agent.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-xs font-sans">
                      <tr>
                        <td className="py-4 pr-6 text-xs font-mono text-white/40 uppercase tracking-widest font-bold">GFF Framework Tier</td>
                        {comparedAgents.map((agent) => (
                          <td key={agent.id} className="py-4 px-6 font-semibold"><span className="px-2.5 py-0.5 rounded font-mono border border-white/10 bg-white/5 uppercase">GFF: {agent.gffFit}</span></td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-4 pr-6 text-xs font-mono text-white/40 uppercase tracking-widest font-bold">Use Case Focus</td>
                        {comparedAgents.map((agent) => (
                          <td key={agent.id} className="py-4 px-6 text-white/80 italic leading-relaxed">"{agent.useCase}"</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-4 pr-6 text-xs font-mono text-white/40 uppercase tracking-widest font-bold">Target Scope</td>
                        {comparedAgents.map((agent) => (
                          <td key={agent.id} className="py-4 px-6 text-white/80 leading-relaxed">
                            <p><strong>Industry:</strong> {agent.industry}</p>
                            <p className="mt-1"><strong>Function:</strong> {agent.function}</p>
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-4 pr-6 text-xs font-mono text-white/40 uppercase tracking-widest font-bold">System Prompt</td>
                        {comparedAgents.map((agent) => (
                          <td key={agent.id} className="py-4 px-6 text-[10px] font-mono text-white/70 bg-black/30 p-3 rounded border border-white/5 leading-relaxed"><span className="text-red-400 font-bold"># SYSTEM: </span>{agent.systemPrompt}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-4 pr-6 text-xs font-mono text-white/40 uppercase tracking-widest font-bold">Performance</td>
                        {comparedAgents.map((agent) => (
                          <td key={agent.id} className="py-4 px-6 text-green-400 font-mono font-bold font-mono">{agent.perfMetric}</td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="p-6 border-t border-white/5 bg-black/40 flex items-center justify-between">
                  <button onClick={clearComparison} className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-all cursor-pointer">Clear Deck</button>
                  <button onClick={() => setIsCompareOpen(false)} className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 text-white border border-white/10 hover:bg-white/10 transition-all cursor-pointer">Close</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* INTERACTIVE SANDBOX TERMINAL MODAL */}
        <AnimatePresence>
          {sandboxId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 lg:p-8"
            >
              <motion.div
                initial={{ scale: 0.95, y: 15, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 15, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="bg-[#050508] border border-white/10 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col h-[85vh] lg:h-[75vh]"
              >
              <div className="bg-black border-b border-white/5 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="h-4 w-[1px] bg-white/10" />
                  <span className="text-xs font-mono text-white/60">GFF Sandbox Terminal v1.02</span>
                </div>
                <button onClick={() => setSandboxId(null)} className="p-1 rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
              </div>
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
                <div className="lg:col-span-8 bg-black/80 p-6 flex flex-col justify-between font-mono text-[11px] leading-relaxed text-teal-400 overflow-y-auto border-r border-white/5 scrollbar-none">
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      {sandboxLogs.map((log, i) => (
                        <div key={i} className={`whitespace-pre-line ${log.startsWith("$") ? "text-white font-bold" : log.startsWith(">") ? "text-teal-400/80 font-light" : "text-green-300 font-light bg-white/[0.01] p-3 border border-white/5 rounded-lg my-1.5"}`}>{log}</div>
                      ))}
                    </div>
                    {sandboxIsBooting && <div className="text-teal-400 font-bold flex items-center gap-2 animate-pulse mt-4"><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Booting Containment Enclave...</div>}
                    <div ref={terminalEndRef} />
                  </div>
                  {sandboxIsSuccess && (
                    <form onSubmit={handleSandboxSubmit} className="mt-6 border-t border-white/10 pt-4 flex items-center gap-2">
                      <span className="text-white font-bold shrink-0">$</span>
                      <input type="text" value={sandboxInput} onChange={(e) => setSandboxInput(e.target.value)} placeholder="Type command..." className="flex-1 bg-transparent text-white outline-none placeholder-white/20 select-all border-b border-transparent focus:border-white/10 pb-0.5" />
                      <button type="submit" className="px-3 py-1 bg-[#009DFF]/20 text-[#009DFF] border border-[#009DFF]/40 rounded hover:bg-[#009DFF]/30 text-[10px] uppercase font-bold tracking-wider cursor-pointer font-mono">Enter</button>
                    </form>
                  )}
                </div>
                <div className="lg:col-span-4 bg-[#050508] p-6 flex flex-col justify-between overflow-y-auto space-y-6">
                  <div className="space-y-5">
                    <div>
                      <span className="text-[9px] font-mono text-[#009DFF] uppercase tracking-widest font-bold">CONTAINER PROFILE</span>
                      <h3 className="text-base font-bold text-white mt-1">{BLUEPRINTS.find((b) => b.id === sandboxId)?.name}</h3>
                      <p className="text-[11px] text-white/50 font-light mt-1.5 leading-relaxed">This sandbox models local container performance without accessing physical APIs or exposing client context.</p>
                    </div>
                    <div className="border border-white/5 bg-black/40 p-3.5 rounded-xl space-y-2 text-[10px] font-mono">
                      <div className="flex justify-between"><span className="text-white/40">CONTAINER:</span><span className="text-white/80">{sandboxId}_v1.0</span></div>
                      <div className="flex justify-between"><span className="text-white/40">MEM LIMIT:</span><span className="text-white/80">16 GB (Isolated)</span></div>
                      <div className="flex justify-between"><span className="text-white/40">EBPF SHIELD:</span><span className="text-green-400 font-bold">LOADED</span></div>
                    </div>
                    <div className="space-y-2">
                      <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest block font-bold">PRESET TEST PROMPTS</span>
                      <div className="flex flex-col gap-2">
                        {BLUEPRINTS.find((b) => b.id === sandboxId)?.sandboxResponse.map((qa, i) => (
                          <button key={i} disabled={sandboxIsBooting} onClick={() => handlePresetSandboxQuery(qa.prompt)} className="text-left p-3 rounded-lg bg-white/5 border border-white/10 text-[11px] text-white/70 hover:text-white hover:border-[#009DFF]/40 hover:bg-white/[0.07] transition-all cursor-pointer font-light leading-snug">"{qa.prompt}"</button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-white/5"><button onClick={() => setSandboxId(null)} className="w-full py-2.5 rounded-xl text-xs font-semibold bg-white/5 text-white border border-white/10 hover:bg-white/10 transition-all cursor-pointer">Disconnect Sandbox</button></div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

        {/* INTERACTIVE TALK-TO-AGENT CHAT CONSOLE */}
        <AnimatePresence>
          {chatId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, y: 15, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 15, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="bg-[#050508] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col h-[80vh] lg:h-[70vh]"
              >
              <div className="p-5 border-b border-white/5 flex items-center justify-between bg-black/40">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#009DFF]/10 border border-[#009DFF]/20 flex items-center justify-center text-[#009DFF]"><Cpu className="w-4 h-4 animate-pulse" /></div>
                  <div>
                    <span className="text-[9px] font-mono text-[#009DFF] uppercase tracking-widest font-bold">SOVEREIGN AGENT CONSOLE</span>
                    <h3 className="text-sm font-bold text-white leading-tight">{BLUEPRINTS.find((b) => b.id === chatId)?.name}</h3>
                  </div>
                </div>
                <button onClick={() => setChatId(null)} className="p-1 rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
              </div>
              <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#030304] scrollbar-none">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${msg.sender === "user" ? "bg-[#009DFF] text-white rounded-tr-none" : "bg-white/5 text-white/80 border border-white/10 rounded-tl-none font-mono"}`}>
                      {msg.sender === "agent" && (
                        <div className="text-[8px] font-bold text-[#009DFF] uppercase tracking-widest mb-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping inline-block mr-1" /> SYSTEM ID: secure-agent</div>
                      )}
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <div className="p-4 border-t border-white/5 bg-[#050508] space-y-4">
                <div className="flex flex-wrap gap-1.5">
                  <button onClick={() => setChatInput("How does GFF guarantee data privacy?")} className="px-2.5 py-1 rounded bg-white/5 border border-white/5 text-[9px] text-white/50 hover:text-white cursor-pointer font-mono"># Data Privacy</button>
                  <button onClick={() => setChatInput("What are integration boundaries?")} className="px-2.5 py-1 rounded bg-white/5 border border-white/5 text-[9px] text-white/50 hover:text-white cursor-pointer font-mono"># Integration Boundaries</button>
                </div>
                <form onSubmit={handleChatSubmit} className="flex gap-2">
                  <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Ask about operational specs..." className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#009DFF]/50 transition-all" />
                  <button type="submit" className="px-5 py-3 rounded-xl bg-[#009DFF] text-white hover:bg-[#009DFF]/90 font-bold text-xs cursor-pointer">Send</button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

        {/* STRUCTURED SOVEREIGN ANATOMY */}
        <MotionReveal className="space-y-12 pt-16 border-t border-white/5">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono text-[#009DFF] uppercase tracking-widest font-bold">Standardized Anatomy</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Structured Sovereign Anatomy</h2>
            <p className="text-white/50 text-sm font-light">Every blueprint certified within our catalog is strictly engineered across three foundational layers of secure orchestration.</p>
          </div>
          <BentoGrid>
            <BentoCard title="1. Context Boundary Spec" description="Defines localized parameters, token utilization thresholds, temperature bounds, and static system context caps to guarantee complete deterministic execution." icon={<Settings className="w-5 h-5 text-red-500" />} badge="Deterministic Engine" glowColor="red" />
            <BentoCard title="2. Zero-Trust Safety Shields" description="Enforces continuous, sub-8ms policy auditing on inbound prompts and outbound telemetry streams, preventing leakage, injection attacks, and drift." icon={<ShieldCheck className="w-5 h-5 text-blue-500" />} badge="Security Filter" glowColor="blue" />
            <BentoCard title="3. Cryptographic Connectors" description="Registers static local tools and cryptographically signed webhooks, enabling highly auditable, safe operations inside enterprise SAP/ERP backend environments." icon={<Layers className="w-5 h-5 text-purple-500" />} badge="Integration Lock" glowColor="purple" />
          </BentoGrid>
        </MotionReveal>

        {/* Strategic Pathways & Related Links */}
        <div className="pt-12 mt-12 border-t border-white/5 print:hidden">
          <RelatedPagesGrid links={[
            {
              title: "Execution Sandbox",
              tag: "Next Step • Safe Simulations",
              desc: "Simulate certified marketplace agent recipes inside our isolated, zero-retention execution sandbox environments.",
              href: "/build/sandbox"
            },
            {
              title: "Proposal Builder",
              tag: "Next Step • Commercial Studio",
              desc: "Convert your curated agent requirements into a formal Statement of Work (SOW) and commercial presentation.",
              href: "/build/proposal"
            },
            {
              title: "Agent Marketplace Platform",
              tag: "GFF Platform Module",
              desc: "Deploy custom pre-validated multi-system connector nodes mapped directly to your internal secure clusters.",
              href: "/platforms/agent-marketplace"
            },
            {
              title: "Sovereign Cognitive Agents",
              tag: "Core GFF Capability",
              desc: "Explore how we engineer and deploy highly robust decision agents inside single-tenant secure enclaves.",
              href: "/capabilities/agents"
            }
          ]} />
        </div>

        <NextBestAction currentTool="marketplace" />

        {/* Premium CTA */}
        <PremiumCTA title="Architect a Bespoke Sovereign Multi-Agent Blueprint" description="Have complex legacy backends, air-gapped security protocols, or custom compliance parameters? Collaborate with GFF lead systems engineers to design, simulate, and lock a custom enterprise blueprint." primaryLabel="Connect with Lead Systems Architects" primaryHref="/build/talk" />
      </div>

      {/* TOAST ERRORS FOR COMPARISON BOUNDARIES */}
      <AnimatePresence>
        {toastError && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 z-50 p-4 rounded-xl border border-red-500/25 bg-black/95 backdrop-blur-md text-xs text-white max-w-sm shadow-[0_0_20px_rgba(228,0,15,0.15)] flex gap-3 items-center"
          >
            <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <span className="font-mono font-bold text-red-500 block text-[9px] uppercase tracking-wider mb-0.5">COMPARISON ERROR</span>
              <p className="text-white/80 leading-normal">{toastError}</p>
            </div>
            <button onClick={() => setToastError(null)} className="text-white/40 hover:text-white ml-auto">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </InnerPageShell>
  );

}
