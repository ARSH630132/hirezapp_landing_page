"use client";

import { useState } from "react";
import { 
  ShieldCheck, 
  Layers, 
  Play, 
  CheckCircle2, 
  ChevronRight, 
  Settings, 
  Server, 
  Search, 
  HelpCircle,
  Database,
  Cpu,
  Terminal,
  Activity,
  FileText,
  UserCheck,
  Compass,
  ArrowRight
} from "lucide-react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import MotionReveal from "@/components/inner-pages/MotionReveal";
import { BentoGrid, BentoCard } from "@/components/inner-pages/BentoGrid";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";

const CATEGORIES = ["All", "Knowledge", "Operations", "Compliance", "Customer Experience", "Executive", "Document Intelligence"];

const AGENT_PATTERNS = [
  {
    id: "knowledge-synth",
    name: "Sovereign Knowledge Synthesis Agent",
    category: "Knowledge",
    desc: "Integrates siloed databases, SharePoint archives, and semantic graph layers into an enterprise-wide real-time intelligence hub, synthesizing multi-vector context safely.",
    schema: "Archival Ingest -> pgvector Embedding -> Graph Link Evaluation -> Context Synthesis",
    systemPrompt: "Answer user query strictly using the provided vector search context chunks. Flag any information gaps instead of generating speculative default suggestions.",
    datasources: "Confluence, SharePoint, Neo4j Graph DB, pgvector Database",
    stages: ["Archival Ingest", "pgvector Embedding", "Graph Link Eval", "Context Synthesis"],
    perfMetric: "98.4% Synthesis Recall"
  },
  {
    id: "erp-sync",
    name: "ERP Operations Orchestrator",
    category: "Operations",
    desc: "Synchronizes high-frequency inventory thresholds, logistical freight schedules, and supply chain demands directly with corporate ERP and SAP backends.",
    schema: "Kafka Trigger -> Event Schema Validation -> Temporal State Machine -> Signed SAP Gateway",
    systemPrompt: "Enforce absolute transactional idempotency. Do not fire secondary REST requests unless the payload is cryptographically signed and transaction ID is validated.",
    datasources: "SAP S/4HANA, Kafka Event Bus, Oracle DB Cluster",
    stages: ["Kafka Trigger", "Schema Validator", "Temporal SM", "SAP Gateway Commit"],
    perfMetric: "100% Idempotent Run Rate"
  },
  {
    id: "pii-masker",
    name: "Zero-Trust Compliance & PII Guard",
    category: "Compliance",
    desc: "Inspects inbound and outbound agent system calls to mask sensitive personal identifiable information (PII), redact proprietary IP, and prevent prompt injections.",
    schema: "Agent Inbound -> eBPF Kernel Redaction -> Policy Audit Engine -> Safe Outbound Sanitization",
    systemPrompt: "Intercept prompt stream. Redact matches for SSN, passport numbers, API keys, and internal source code blocks prior to model ingestion.",
    datasources: "GFF API Gateway, Local Config Map, Vault Secret Engine",
    stages: ["Agent Inbound", "eBPF Filter", "Policy Audit Engine", "Sanitized Gateway"],
    perfMetric: "<12ms Interception Latency"
  },
  {
    id: "cx-orchestrator",
    name: "Hyper-Personalized CX Orchestrator",
    category: "Customer Experience",
    desc: "Orchestrates complex multi-channel corporate outreach, classifying real-time user intents and drafting highly accurate, policy-approved responses.",
    schema: "Zendesk Webhook -> Classification Classifier -> Draft Synthesis -> Human Approval Gate",
    systemPrompt: "Evaluate intent markers. Match drafts strictly against active subscription packages. Escalate multi-variable disputes to Tier 2 agents.",
    datasources: "Salesforce CRM, Braze, Zendesk Support Hub",
    stages: ["Zendesk Webhook", "Intent Classify", "Draft Gen Engine", "Human-in-the-Loop Gate"],
    perfMetric: "82% Automated Resolution Rate"
  },
  {
    id: "executive-advisor",
    name: "Scenario Modeler & Executive Briefing Agent",
    category: "Executive",
    desc: "Generates multi-variable risk simulations, financial variance analyses, and secure briefing reports for board-level decision-making.",
    schema: "Snowflake Ingest -> Monte Carlo Risk Simulation -> Metric Summarizer -> Signed Executive PDF",
    systemPrompt: "Synthesize operational risk models. Restrict focus to cash flow margins and infrastructure security indexes. Include raw data source citations.",
    datasources: "Grafana Telemetry, Snowflake, Workday Ledger",
    stages: ["Snowflake Ingest", "Risk Simulation", "Briefing Generator", "Signed PDF Compile"],
    perfMetric: "99.2% Trend Match Accuracy"
  },
  {
    id: "doc-intel",
    name: "Sovereign Multi-Format Document Analyzer",
    category: "Document Intelligence",
    desc: "Extracts, parses, and audits unstructured multi-page legal documents and SOX balance sheets, flagging ledger discrepancies in seconds.",
    schema: "S3 Pipeline -> OCR Schema Normalizer -> Structural Matcher -> Discrepancy Ledger Export",
    systemPrompt: "Perform cell-by-cell reconciliation on all tables. Highlight any department ledger mismatch exceeding 0.05% margin.",
    datasources: "Amazon S3 Buckets, Legal DocuVault, ERP Local Cache",
    stages: ["S3 PDF Pipeline", "OCR Schema Norm", "Structural Match", "Discrepancy Audit"],
    perfMetric: "99.8% Extraction Accuracy"
  }
];

export default function AgentMarketplacePage() {
  const [activeCat, setActiveCat] = useState("All");
  const [selectedId, setSelectedId] = useState("knowledge-synth");
  const [sandboxActive, setSandboxActive] = useState<Record<string, boolean>>({});
  const [deployingId, setDeployingId] = useState<string | null>(null);

  const filtered = AGENT_PATTERNS.filter(
    (acc) => activeCat === "All" || acc.category === activeCat
  );

  const activeAcc = AGENT_PATTERNS.find((acc) => acc.id === selectedId) || AGENT_PATTERNS[0];

  const handleDeploySandbox = (id: string) => {
    setDeployingId(id);
    setTimeout(() => {
      setSandboxActive((prev) => ({ ...prev, [id]: true }));
      setDeployingId(null);
    }, 1500);
  };

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Platforms & Modules"
        title="Agent Marketplace and Enterprise Blueprint Registry"
        highlightedWord="Marketplace"
        highlightColor="blue"
        description="Deploy verified, pre-scoped sovereign agent patterns designed for secure, autonomous operations across knowledge synthesis, deep regulatory auditing, complex supply chains, and executive decision-making."
        breadcrumbs={[{ label: "Platforms", href: "/platforms" }, { label: "Agent Marketplace" }]}
      />

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-24 space-y-24">
        
        {/* Editorial Strategy Narrative */}
        <MotionReveal className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-12 border-y border-white/5 items-center bg-white/[0.01] px-8 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-[30%] h-full bg-gradient-to-r from-[#009DFF]/5 to-transparent pointer-events-none" />
          <div className="lg:col-span-5 relative z-10">
            <span className="text-xs font-mono text-[#009DFF] uppercase tracking-widest font-bold">Standardized Autonomy</span>
            <h2 className="text-3xl font-semibold text-white tracking-tight mt-2">Zero-Trust Deterministic Blueprints</h2>
          </div>
          <div className="lg:col-span-7 relative z-10">
            <p className="text-white/70 font-light text-sm sm:text-base leading-relaxed">
              Autonomous digital labor shouldn't be built from chaotic, unguided models. The GFF Agent Marketplace delivers certified multi-agent blueprints engineered with strict input/output schemas, static tool bindings, and integrated system-level guardrails. This eliminates hallucination risk, sandbox jailbreaks, and configuration drift, enabling immediate integration into sovereign enterprise environments.
            </p>
          </div>
        </MotionReveal>

        {/* Core Registry Explorer Section */}
        <MotionReveal className="space-y-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-white/5 pb-6">
            <div>
              <div className="flex items-center gap-2 text-white/40 text-[11px] font-mono uppercase tracking-widest">
                <Compass className="w-3.5 h-3.5 text-[#009DFF]" />
                Interactive Registry Explorer
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">Sovereign Patterns</h2>
              <p className="text-white/50 text-xs sm:text-sm font-light mt-1.5">Select and inspect verified architectures ready for containerized sandbox deployments.</p>
            </div>
            
            {/* Horizontal Scrollable Categories Filter */}
            <div className="flex gap-1.5 p-1 bg-white/5 rounded-xl border border-white/10 overflow-x-auto w-full lg:w-auto scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCat(cat);
                    const firstOfCat = AGENT_PATTERNS.find(a => cat === "All" || a.category === cat);
                    if (firstOfCat) setSelectedId(firstOfCat.id);
                  }}
                  className={`px-3 py-1.5 text-[11px] font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    activeCat === cat 
                      ? "bg-white/10 text-white shadow-sm border border-white/10" 
                      : "text-white/50 hover:text-white border border-transparent"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left side: Grid of Filtered Cards */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 h-fit">
              {filtered.map((acc) => {
                const isSelected = acc.id === selectedId;
                const isStaged = sandboxActive[acc.id];
                return (
                  <div
                    key={acc.id}
                    onClick={() => setSelectedId(acc.id)}
                    className={`p-6 rounded-xl border flex flex-col justify-between min-h-[220px] transition-all cursor-pointer relative group ${
                      isSelected 
                        ? "border-[#009DFF] bg-[#009DFF]/5 shadow-[0_0_20px_rgba(0,157,255,0.05)]" 
                        : "border-white/5 bg-black/40 hover:border-white/15"
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <span className="px-2 py-0.5 rounded text-[8px] bg-white/5 text-white/50 border border-white/10 uppercase font-mono tracking-widest">
                          {acc.category}
                        </span>
                        {isStaged ? (
                          <span className="text-[9px] font-mono font-bold text-green-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> STAGED
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono text-white/30">{acc.perfMetric}</span>
                        )}
                      </div>
                      <h3 className="text-base font-semibold text-white mt-4 group-hover:text-[#009DFF] transition-colors">{acc.name}</h3>
                      <p className="text-xs text-white/50 font-light mt-2 line-clamp-3 leading-relaxed">{acc.desc}</p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-white/40">
                      <span className="font-mono">Inspect Blueprint Schema</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#009DFF]" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right side: Large Interactive Inspector Panel */}
            <div className="lg:col-span-6 bg-[#04060b] rounded-xl border border-white/10 p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden min-h-[500px]">
              <div className="absolute top-0 right-0 w-[50%] h-[40%] bg-gradient-to-bl from-[#009DFF]/10 to-transparent blur-[50px] pointer-events-none" />
              
              <div className="space-y-6 relative z-10">
                <div className="flex items-start justify-between border-b border-white/5 pb-4">
                  <div>
                    <span className="text-[9px] uppercase font-mono tracking-widest text-[#009DFF] font-bold">Dynamic Inspector</span>
                    <h3 className="text-lg font-bold text-white mt-1">{activeAcc.name}</h3>
                  </div>
                  <Server className="w-5 h-5 text-[#009DFF] shrink-0" />
                </div>

                <div className="border border-white/5 bg-black/60 rounded-xl p-4 flex flex-col items-center justify-center relative min-h-[140px]">
                  <span className="text-[8px] font-mono text-white/40 absolute top-2 right-3 uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" /> Execution DAG
                  </span>
                  
                  <div className="w-full flex flex-col sm:flex-row items-center justify-between px-2 mt-4 text-[9px] font-mono text-white/60 text-center gap-4 relative">
                    {activeAcc.stages.map((st, i) => (
                      <div key={i} className="flex flex-col items-center flex-1 z-10">
                        <div className="w-7 h-7 rounded-full border border-white/15 bg-black flex items-center justify-center mb-2 text-xs font-bold text-[#009DFF]">
                          {i + 1}
                        </div>
                        <span className="text-[9px] font-medium text-white/80">{st}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-white/40 uppercase tracking-wider">
                    <Terminal className="w-3.5 h-3.5 text-red-500" /> Embedded Safety Directives
                  </div>
                  <div className="bg-black/80 rounded-lg p-4 border border-white/5 font-mono text-[11px] leading-relaxed text-white/80 relative">
                    <span className="text-red-400"># SYSTEM: </span>{activeAcc.systemPrompt}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#009DFF] uppercase tracking-wider">
                      <Database className="w-3.5 h-3.5" /> Integrations
                    </div>
                    <div className="bg-black/40 px-3 py-2 rounded-lg border border-white/5 text-xs text-white/80 font-mono">
                      {activeAcc.datasources}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-teal-400 uppercase tracking-wider">
                      <Activity className="w-3.5 h-3.5" /> Performance Metrics
                    </div>
                    <div className="bg-black/40 px-3 py-2 rounded-lg border border-white/5 text-xs text-teal-400 font-mono flex items-center justify-between">
                      <span>Telemetry</span>
                      <span>{activeAcc.perfMetric}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 relative z-10 flex items-center justify-between flex-wrap gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] text-white/30 font-mono">MANIFEST ID</span>
                  <span className="text-[11px] text-white/60 font-mono font-semibold">{activeAcc.id}_v1.0</span>
                </div>
                
                <button
                  onClick={() => handleDeploySandbox(activeAcc.id)}
                  disabled={sandboxActive[activeAcc.id] || deployingId === activeAcc.id}
                  className={`px-5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                    sandboxActive[activeAcc.id]
                      ? "bg-green-500/10 text-green-400 border border-green-500/30 cursor-default"
                      : deployingId === activeAcc.id
                      ? "bg-white/5 text-white/50 border border-white/10 cursor-not-allowed"
                      : "bg-[#009DFF] text-white hover:bg-[#009DFF]/90"
                  }`}
                >
                  {sandboxActive[activeAcc.id] ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-green-400" /> Active in Sandbox
                    </>
                  ) : deployingId === activeAcc.id ? (
                    <>Deploying...</>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" /> Deploy Sandbox
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </MotionReveal>

        {/* Section 2: Technical Bento Grid mapping out the anatomy of GFF agents */}
        <MotionReveal className="space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono text-[#009DFF] uppercase tracking-widest font-bold">Standardized Blueprint Anatomy</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Structured Agent Architecture</h2>
            <p className="text-white/50 text-sm font-light">Every component in our registry is engineered across three foundational compliance and integration layers.</p>
          </div>

          <BentoGrid>
            <BentoCard
              title="1. Context Boundary Spec"
              description="Defines precise model parameters, token utilization thresholds, temperature limitations, and strict system context-window caps to guarantee deterministic outputs."
              icon={<Settings className="w-5 h-5 text-red-500" />}
              badge="Deterministic Engine"
              glowColor="red"
            />
            <BentoCard
              title="2. Dynamic Safety Shields"
              description="Enforces continuous, near-zero-latency policy checks on raw prompts, parsing and sanitizing personal data, code injections, and operational policy deviations."
              icon={<ShieldCheck className="w-5 h-5 text-blue-500" />}
              badge="Security Filter"
              glowColor="blue"
            />
            <BentoCard
              title="3. Cryptographic Integrations"
              description="Declares static tools and signed system webhooks, enabling highly auditable interactions with internal ERP portals, microservices, and databases."
              icon={<Layers className="w-5 h-5 text-purple-500" />}
              badge="Integration Interface"
              glowColor="purple"
            />
          </BentoGrid>
        </MotionReveal>

        {/* Related platform links to make navigation easy */}
        <MotionReveal className="border-t border-white/5 pt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <a 
            href="/platforms/runtime-governance"
            className="group p-8 rounded-2xl border border-white/5 bg-gradient-to-br from-black to-[#050505] hover:border-white/10 transition-all flex flex-col justify-between min-h-[160px]"
          >
            <div>
              <span className="text-[10px] font-mono text-[#009DFF] uppercase tracking-widest">Next Chapter</span>
              <h4 className="text-lg font-bold text-white group-hover:text-[#009DFF] transition-colors mt-2 flex items-center gap-1.5">
                Runtime Governance Platform <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </h4>
              <p className="text-xs text-white/50 font-light mt-1">Explore human oversight, permissions, real-time auditing, and behavior boundaries.</p>
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
              <p className="text-xs text-white/50 font-light mt-1">Leverage robust testing environments, agent simulations, and container telemetry.</p>
            </div>
          </a>
        </MotionReveal>

        {/* Premium CTA Section */}
        <PremiumCTA
          title="Collaborate on a Custom Sovereign Blueprint"
          description="Have specific regulatory schemas or complex legacy portals? Work with GFF principal systems architects to map, simulate, and lock a custom agent blueprint."
          primaryLabel="Connect with Systems Engineers"
          primaryHref="/contact"
        />

      </div>
    </InnerPageShell>
  );
}

