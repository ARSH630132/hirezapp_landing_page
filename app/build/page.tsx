"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";
import WorkspaceContinuityPanel from "@/components/build/WorkspaceContinuityPanel";
import {
  getFullWorkspace,
  purgeAllWorkspace,
  getBlueprintHistory,
  hasAnyWorkspace
} from "@/components/build/workspaceUtility";

interface Stage {
  n: number;
  name: string;
  desc: string;
  tool: string;
  btn: string;
  metric: string;
  artifact: string;
}

const JOURNEY: Stage[] = [
  { n: 1, name: "Visitor", desc: "Explore core reference blueprints and test cognitive flows in sandbox environments without credentials.", tool: "/build/sandbox", btn: "Sandbox", metric: "Free Access", artifact: "Interactive execution sandbox logs" },
  { n: 2, name: "AI Assessment", desc: "Evaluate organizational readiness, regulatory compliance thresholds, and legacy API telemetry pathways.", tool: "/build/assessment", btn: "Assessor", metric: "Readiness Index", artifact: "Sovereign Compliance Index Report" },
  { n: 3, name: "Blueprint", desc: "Architect personalized multi-agent execution roadmaps, custom DAG flows, and nodes connectivity diagrams.", tool: "/build/blueprint", btn: "Blueprint", metric: "Tailored Topologies", artifact: "Custom topological execution map" },
  { n: 4, name: "Workshop", desc: "Sync directly with GFF AI lead engineers to review core architecture blueprints and secure integration strategies.", tool: "/build/talk", btn: "Inquire", metric: "Architect Sync", artifact: "Co-engineering workshop schedule" },
  { n: 5, name: "Proposal", desc: "Compile custom commercial scoping metrics and download a formal executive execution presentation deck.", tool: "/build/proposal", btn: "Proposal Studio", metric: "Algorithmic SOW", artifact: "Custom commercial statement of work & PPT" },
  { n: 6, name: "Contract", desc: "Sign secure enterprise agreements. Establish dedicated sovereign physical air-gapped enclaves.", tool: "/build/sandbox", btn: "Sovereign Specs", metric: "SOC2 Audited", artifact: "Sovereign physical enclave definition" },
  { n: 7, name: "Delivery", desc: "Assemble and launch production multi-agent topologies inside our visual Foundry Workspace.", tool: "/build/foundry-studio", btn: "Foundry Studio", metric: "30-Day Launch", artifact: "Visual DAG deployment artifact" },
  { n: 8, name: "Operate", desc: "Execute complex cognitive workflows monitored dynamically by GFF Supervisor systems.", tool: "/build/talk", btn: "Chat Console", metric: "99.9% Success Rate", artifact: "Cognitive supervisor telemetry ledger" },
  { n: 9, name: "Expand", desc: "License new certified marketplace connector recipes to scale cognitive nodes securely.", tool: "/build/marketplace", btn: "Marketplace", metric: "Dynamic Multipliers", artifact: "Marketplace licensing entitlements" }
];
const SCENARIOS = [
  {
    id: "explore",
    title: "Exploring & Evaluating Readiness",
    summary: "I want to assess feasibility, operational readiness, and legacy API integration barriers.",
    recommendation: "AI Readiness Assessment",
    recHref: "/build/assessment",
    artifact: "Sovereign Compliance Index & Diagnostic Report",
    time: "5 minutes",
    badgeColor: "#009DFF",
    description: "Our core readiness scanner evaluates systems compatibility, security protocols, and operational gaps to establish your initial AI strategic maturity index."
  },
  {
    id: "challenge",
    title: "Specific Integration Challenge",
    summary: "I have a specific orchestration pain point and want to converse directly with an architect.",
    recommendation: "Talk to Agent",
    recHref: "/build/talk",
    artifact: "Real-time Multi-Agent Trace Log & Solution Chat Draft",
    time: "10 minutes",
    badgeColor: "#00FF9D",
    description: "Engage with our cognitive chat console to map out specific challenges, inspect mock system traces, and initiate architect reviews."
  },
  {
    id: "roadmap",
    title: "Need Structured Topological Roadmap",
    summary: "I want to construct a visual representation of agent DAG nodes and topological workflows.",
    recommendation: "Blueprint Generator",
    recHref: "/build/blueprint",
    artifact: "Custom Execution Diagram & Architecture Blueprint",
    time: "6 minutes",
    badgeColor: "#9D00FF",
    description: "Dynamically architect agent clusters, define supervisor governance nodes, and generate custom topology blueprints suited to your cloud profile."
  },
  {
    id: "economics",
    title: "Validating Investment Economics",
    summary: "I need to calculate potential hour savings, ROI multipliers, and project investment payback timelines.",
    recommendation: "ROI Calculator",
    recHref: "/build/roi",
    artifact: "FTE Savings Model & TCO Analysis Ledger",
    time: "3 minutes",
    badgeColor: "#E4000F",
    description: "Perform precise economic simulations based on task volume, human labor baseline costs, and sovereign licensing multipliers."
  },
  {
    id: "proposal",
    title: "Ready to Codify Proposal Scope",
    summary: "I need a formal Statement of Work, custom commercial scoping, and download files.",
    recommendation: "Proposal Builder",
    recHref: "/build/proposal",
    artifact: "Statement of Work (SOW) & Exportable PPT Deck Preview",
    time: "8 minutes",
    badgeColor: "#3B82F6",
    description: "Interactively choose cloud environments and integration phases to instantly build and download complete corporate proposal drafts."
  }
];

const TOOLS = [
  {
    title: "Talk to Agent",
    href: "/build/talk",
    desc: "Interface with our advanced multi-system cognitive supervisors to co-engineer and map direct system integrations.",
    cat: "COGNITIVE SYNAPSE",
    accent: "#00FF9D",
    output: "Trace Log & Chat History",
    status: "ONLINE",
    icon: (
      <svg className="w-8 h-8 text-[#00FF9D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v6m-3-3h6" className="opacity-40" />
      </svg>
    )
  },
  {
    title: "Blueprint Generator",
    href: "/build/blueprint",
    desc: "Architect tailored multi-agent execution roadmaps, custom DAG graphs, and specialized sovereign architectures.",
    cat: "ARCHITECT GRAPH",
    accent: "#9D00FF",
    output: "Visual DAG Schema",
    status: "DRAFT READY",
    icon: (
      <svg className="w-8 h-8 text-[#9D00FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    )
  },
  {
    title: "AI Readiness Assessment",
    href: "/build/assessment",
    desc: "Scan and evaluate your organizational readiness, VPC security baselines, and legacy system compatibility.",
    cat: "DIAGNOSTIC INDEX",
    accent: "#009DFF",
    output: "Sovereign Readiness Score",
    status: "STABLE",
    icon: (
      <svg className="w-8 h-8 text-[#009DFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
  {
    title: "ROI Calculator",
    href: "/build/roi",
    desc: "Calculate reclaimed human labor hours, sovereign license multipliers, and amortized multi-year cost reductions.",
    cat: "ECONOMIC ENGINE",
    accent: "#E4000F",
    output: "TCO Ledger Ledger",
    status: "ESTIMATED",
    icon: (
      <svg className="w-8 h-8 text-[#E4000F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
      </svg>
    )
  },
  {
    title: "Sandbox",
    href: "/build/sandbox",
    desc: "Run secure dry-run executions, inspect trace logs, and validate agent compliance in an isolated hardware enclave.",
    cat: "ZERO-TRUST LAB",
    accent: "#F59E0B",
    output: "VPC Simulation Trace",
    status: "SECURE",
    icon: (
      <svg className="w-8 h-8 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    )
  },
  {
    title: "Proposal Builder",
    href: "/build/proposal",
    desc: "Automate commercial Statements of Work, scope project sprints, and export formatted executive PowerPoint decks.",
    cat: "COMMERCIAL STUDIO",
    accent: "#3B82F6",
    output: "SOW & Presentation Deck",
    status: "DRAFT INTENT",
    icon: (
      <svg className="w-8 h-8 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  {
    title: "Marketplace",
    href: "/build/marketplace",
    desc: "Browse and acquire pre-configured sovereign node recipes, certified third-party platform connectors, and core cognitive packages.",
    cat: "DEPLOYABLE REGISTRY",
    accent: "#EC4899",
    output: "Integration YAML Specs",
    status: "RELEASED",
    icon: (
      <svg className="w-8 h-8 text-[#EC4899]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    )
  },
  {
    title: "Foundry Studio",
    href: "/build/foundry-studio",
    desc: "Visually assemble and edit production-grade multi-agent DAG execution layouts in our interactive workshop.",
    cat: "TOPOLOGY WORKSPACE",
    accent: "#10B981",
    output: "DAG Runtime Layout",
    status: "SIMULATOR ACTIVE",
    icon: (
      <svg className="w-8 h-8 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m2-1v2.5M6 18l-2-1v2.5M18 18l2-1v2.5" />
      </svg>
    )
  }
];




export default function BuildHubPage() {
  const [activeStage, setActiveStage] = useState<Stage>(JOURNEY[1]); // Focus on AI Assessment initially
  const [activeScenarioIdx, setActiveScenarioIdx] = useState<number>(0);

  // Local Workspace state checking
  const [workspace, setWorkspace] = useState<any>({});
  const [blueprintHistory, setBlueprintHistory] = useState<any[]>([]);
  const [hasAny, setHasAny] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const refreshWorkspace = () => {
    setWorkspace(getFullWorkspace());
    setBlueprintHistory(getBlueprintHistory());
    setHasAny(hasAnyWorkspace());
  };

  useEffect(() => {
    setIsClient(true);
    refreshWorkspace();
  }, []);

  const handleCreateMockSession = () => {
    if (typeof window !== "undefined") {
      const mockWorkspace = {
        assessment: {
          answers: { "strategy-q1": 4, "strategy-q2": 3, "data-q1": 5 },
          activeDimensionIndex: 1,
          showResult: false
        },
        roi: {
          industry: "financial_services",
          companySize: "enterprise",
          opFunction: "customer_operations",
          annualCostBaseline: 1500000,
          processVolume: 250000,
          avgHandlingTime: 15,
          automationTarget: 65,
          manualEffort: "high",
          productivityImprovement: 50,
          implementationHorizon: "6_months",
          initialInvestment: 350000,
          priority: "cost_reduction"
        },
        proposal: {
          companyName: "Enterprise Vanguard Corp",
          industry: "banking",
          companySize: "enterprise",
          primaryChallenge: "compliance-risk",
          customChallenge: "",
          priorityOutcomes: ["zero-retention", "sub-150ms-latency"],
          targetTimeline: "90-days",
          preferredEngagementPath: "foundry",
          budgetRange: "tier-2",
          geography: "NA",
          stakeholders: "CIO"
        },
        talk: {
          currentStep: 2,
          data: {
            desc: "Legacy core banking orchestration with autonomous risk compliance nodes",
            ind: "Finance",
            size: "100-1000",
            geography: "North America",
            urgency: "immediate",
            functionTeam: "Compliance Auditing",
            aiStage: "Exploring"
          },
          showResults: false
        },
        sandbox: {
          selectedIndustry: "Banking",
          selectedFunction: "Knowledge Search",
          selectedAgentType: "Deep Reasoning / DAG",
          searchQuery: "reconciliation",
          activeAgentId: "knowledge-search"
        },
        marketplace: {
          activeTab: "All Patterns",
          industryFilter: "All Industries",
          functionFilter: "All Functions",
          maturityFilter: "All Stages",
          platformFilter: "All Fits",
          searchQuery: "Watchdog",
          compareIds: ["agent-01", "agent-02"]
        },
        foundryStudio: {
          selectedPresetId: "banking",
          selectedPattern: "hierarchical",
          stages: [
            { id: "node-0", type: "trigger", label: "Consensus Ledger Hook", role: "Sovereign Ingress", latency: "2ms", isGated: false },
            { id: "node-1", type: "reasoning", label: "Audit Verification Agent", role: "Verification Node", latency: "45ms", isGated: false }
          ],
          knowledgeSources: ["ledger_rules.pdf", "compliance_framework.txt"]
        }
      };

      localStorage.setItem("gff_local_workspace_continuity", JSON.stringify(mockWorkspace));
      localStorage.setItem("gff_proposal_draft_intake", JSON.stringify(mockWorkspace.proposal));

      const mockBlueprintHistory = [
        {
          id: "bp-mock-2026",
          score: 84,
          timestamp: new Date().toLocaleTimeString(),
          category: "Maturity Level III: Strategic Federated Mesh",
          data: {
            email: "architect@vanguard.io",
            company: "Enterprise Vanguard Corp",
            cloud: "hybrid",
            agentsCount: "50-100 Autonomous Agents",
            urgency: "immediate"
          }
        }
      ];
      localStorage.setItem("gff_blueprint_history", JSON.stringify(mockBlueprintHistory));

      refreshWorkspace();
    }
  };

  const handleClearSessions = () => {
    purgeAllWorkspace();
    refreshWorkspace();
  };


  return (
    <InnerPageShell>
      {/* Premium Hero Area */}
      <InnerPageHero
        category="Build With GFF Hub"
        title="Sovereign Co-Engineering Workshop"
        highlightedWord="Sovereign"
        description="Construct, simulate, validate, and launch custom multi-agent execution systems using our self-service diagnostic suite, roadmap engines, and commercial scoping nodes."
      />

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-24 space-y-16">
        
        {/* Sovereign Workspace Continuity Control Panel */}
        <WorkspaceContinuityPanel />

        {/* SECTION 1: Sovereign Journey Timeline */}
        <section className="p-6 lg:p-10 rounded-[24px] border border-white/5 bg-[#04060b] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[30%] h-[30%] bg-[#E4000F]/5 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-[1400px] mx-auto space-y-8">
            <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-4">
              <div>
                <span className="text-xs font-mono text-[#009DFF] font-semibold uppercase tracking-wider block mb-1">
                  ENTERPRISE PROTOCOL PIPELINE
                </span>
                <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
                  The 9-Stage Sovereign Flow
                </h2>
                <p className="text-white/60 text-xs mt-1 max-w-[600px] font-light">
                  Inspect the structured deployment milestones GFF AI utilizes to scope, configure, and operate air-gapped cognitive fleets.
                </p>
              </div>
              <div className="text-xs font-mono text-[#009DFF] bg-[#009DFF]/10 px-3 py-1.5 rounded-full border border-[#009DFF]/20 self-start font-semibold">
                PHASE 0{activeStage.n}: {activeStage.name.toUpperCase()}
              </div>
            </div>

            {/* Scrollable Timeline Row */}
            <div className="relative overflow-x-auto pb-4 scrollbar-none border-b border-white/5">
              <div className="min-w-[940px] flex items-center justify-between relative px-2 py-4">
                <div className="absolute top-[38px] left-8 right-8 h-[2px] bg-white/5 z-0" />
                <div 
                  className="absolute top-[38px] left-8 h-[2px] bg-gradient-to-r from-[#E4000F] to-[#009DFF] z-0 transition-all duration-500" 
                  style={{ width: `${((activeStage.n - 1) / 8) * 100}%` }} 
                />
                
                {JOURNEY.map((stg) => {
                  const act = activeStage.n === stg.n;
                  return (
                    <button 
                      key={stg.n} 
                      onClick={() => setActiveStage(stg)} 
                      className="flex flex-col items-center relative z-10 group focus:outline-none w-[95px] shrink-0"
                    >
                      <div className={`w-11 h-11 rounded-full border-2 flex items-center justify-center text-xs font-mono font-bold transition-all duration-300 ${
                        act 
                          ? "bg-black border-[#009DFF] text-[#009DFF] shadow-[0_0_15px_rgba(0,157,255,0.4)] scale-110" 
                          : stg.n < activeStage.n 
                            ? "bg-gradient-to-r from-[#E4000F] to-[#009DFF] border-transparent text-white" 
                            : "bg-[#020202] border-white/10 text-white/40 group-hover:border-white/30"
                      }`}>
                        {stg.n}
                      </div>
                      <span className={`text-[10px] mt-2.5 font-bold tracking-tight truncate w-full text-center transition-colors ${
                        act ? "text-[#009DFF]" : "text-white/60 group-hover:text-white"
                      }`}>
                        {stg.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Stage Details Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center gap-2 text-[11px] font-mono text-white/50">
                  <span className="text-[#E4000F] font-bold">PHASE 0{activeStage.n}</span>
                  <span>|</span>
                  <span className="text-[#00FF9D] font-semibold">{activeStage.metric}</span>
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-white tracking-tight">
                  {activeStage.name} Milestone Target
                </h3>
                <p className="text-white/70 text-xs leading-relaxed max-w-[720px] font-light">
                  {activeStage.desc}
                </p>
                <div className="pt-2">
                  <Link 
                    href={activeStage.tool} 
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold text-white bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#009DFF]/30 transition group"
                  >
                    <span>Launch {activeStage.btn} Helper</span>
                    <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform text-[#009DFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
              
              <div className="lg:col-span-4 p-5 rounded-2xl bg-white/[0.01] border border-white/5 flex flex-col justify-between">
                <div>
                  <h4 className="text-[10px] font-mono text-white/40 uppercase tracking-wider mb-2">EXPECTED PIPELINE OUTCOME</h4>
                  <p className="text-xs text-white/80 font-light leading-relaxed">
                    {activeStage.artifact}
                  </p>
                </div>
                <div className="text-[9px] font-mono text-white/30 pt-4 mt-4 border-t border-white/5 flex justify-between items-center">
                  <span>DEPLOYMENT REGULATION</span>
                  <span className="text-[#00FF9D] font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00FF9D]" />
                    GUARANTEED SOVEREIGN
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Interactive Decision Guide: "Which tool should you use next?" */}
        <section className="p-6 lg:p-8 rounded-[24px] border border-white/5 bg-[#030305] relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] rounded-full blur-[100px] pointer-events-none opacity-5 transition-all duration-700" style={{ backgroundColor: SCENARIOS[activeScenarioIdx].badgeColor }} />
          
          <div className="relative z-10 max-w-[1400px] mx-auto space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-mono text-[#009DFF] font-semibold uppercase tracking-wider block">INTELLIGENT NAVIGATOR</span>
              <h2 className="text-xl lg:text-2xl font-bold text-white tracking-tight">Which Tool Should You Use Next?</h2>
              <p className="text-white/60 text-xs max-w-[650px] font-light">Select your primary operational objective to receive an instant co-engineering diagnostic recommendation.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-6 flex flex-col gap-2.5">
                {SCENARIOS.map((sc, idx) => {
                  const isActive = activeScenarioIdx === idx;
                  return (
                    <button
                      key={sc.id}
                      onClick={() => setActiveScenarioIdx(idx)}
                      className={`w-full p-3.5 text-left rounded-xl border transition-all duration-300 flex items-center justify-between gap-4 group relative overflow-hidden focus:outline-none ${
                        isActive ? "bg-white/[0.03] border-white/15" : "bg-[#010102] border-white/5 hover:border-white/10"
                      }`}
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ backgroundColor: sc.badgeColor, opacity: isActive ? 1 : 0 }} />
                      <div className="flex-1 space-y-1 pl-1">
                        <h4 className="text-xs font-semibold text-white tracking-tight group-hover:text-white/95 transition-colors">{sc.title}</h4>
                        <p className="text-[10px] text-white/50 font-light leading-snug group-hover:text-white/60 transition-colors">{sc.summary}</p>
                      </div>
                      <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${isActive ? "translate-x-1 text-white" : "text-white/20 group-hover:text-white/40"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  );
                })}
              </div>

              <div className="lg:col-span-6 flex flex-col justify-between p-5 rounded-xl border border-white/5 bg-[#010102] relative overflow-hidden">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded border font-semibold uppercase" style={{ color: SCENARIOS[activeScenarioIdx].badgeColor, borderColor: `${SCENARIOS[activeScenarioIdx].badgeColor}25`, backgroundColor: `${SCENARIOS[activeScenarioIdx].badgeColor}08` }}>RECOMMENDED STEP</span>
                    <span className="text-[9px] font-mono text-white/40">Est: {SCENARIOS[activeScenarioIdx].time}</span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white tracking-tight">Launch {SCENARIOS[activeScenarioIdx].recommendation}</h3>
                    <p className="text-white/60 text-xs font-light leading-relaxed">{SCENARIOS[activeScenarioIdx].description}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-white/[0.01] border border-white/5 space-y-1">
                    <span className="text-[9px] font-mono text-white/40 uppercase tracking-wider block">EXPECTED ARTIFACT</span>
                    <span className="text-xs text-white/80 font-medium">{SCENARIOS[activeScenarioIdx].artifact}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 mt-4 flex items-center justify-between gap-4">
                  <span className="text-[9px] font-mono text-white/35 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-[#00FF9D] animate-pulse" />READY</span>
                  <Link href={SCENARIOS[activeScenarioIdx].recHref} className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-white hover:bg-white/90 text-black text-xs font-bold transition">
                    <span>Launch Recommendation</span>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* 8 Premium Tool Launcher Cards Section */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono text-[#009DFF] font-semibold uppercase tracking-wider block">UTILITY TERMINAL</span>
            <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight font-semibold">Self-Service Co-Engineering Utility Suite</h2>
            <p className="text-white/60 text-xs max-w-[600px] mx-auto font-light">
              Engage with our core self-service diagnostics, financial models, sandbox environments, and live DAG creators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TOOLS.map((t) => (
              <div 
                key={t.title} 
                className="p-6 rounded-2xl border border-white/5 bg-[#030304]/80 flex flex-col justify-between hover:border-white/15 hover:shadow-[0_4px_30px_rgba(255,255,255,0.02)] transition-all group relative overflow-hidden"
              >
                {/* Custom top-corner glow effect based on accent */}
                <div 
                  className="absolute -top-12 -right-12 w-24 h-24 rounded-full blur-2xl pointer-events-none opacity-20 transition-opacity duration-300 group-hover:opacity-35" 
                  style={{ backgroundColor: t.accent }}
                />

                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span 
                      className="text-[9px] font-mono px-2 py-0.5 rounded border font-semibold" 
                      style={{ color: t.accent, borderColor: `${t.accent}25`, backgroundColor: `${t.accent}08` }}
                    >
                      {t.cat}
                    </span>
                    <span className="text-[9px] font-mono text-white/30 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-white/40" />
                      {t.status}
                    </span>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 group-hover:border-white/10 transition-colors shrink-0">
                      {t.icon}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-white tracking-tight group-hover:text-[#009DFF] transition-colors">
                        {t.title}
                      </h3>
                      <div className="text-[10px] font-mono text-white/40">
                        Outputs: <span className="text-white/70">{t.output}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-white/60 leading-relaxed font-light min-h-[48px]">
                    {t.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-white/35">FRONTEND SIMULATED</span>
                  <Link 
                    href={t.href} 
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-[#009DFF] transition"
                  >
                    <span>LAUNCH</span>
                    <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <PremiumCTA />
      </div>
    </InnerPageShell>
  );
}