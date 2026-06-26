"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  getFullWorkspace,
  purgeAllWorkspace,
  getBlueprintHistory,
  hasAnyWorkspace
} from "./workspaceUtility";

interface ToolMeta {
  id: string;
  name: string;
  sub: string;
  href: string;
  color: string;
  desc: (ws: any, bp: any[]) => string;
}

export const TOOLS_META: ToolMeta[] = [
  {
    id: "blueprint",
    name: "Blueprint Generator",
    sub: "Architect Diagram",
    href: "/build/blueprint",
    color: "#9D00FF",
    desc: (ws, bp) => bp.length > 0 ? `${bp.length} saved blueprint(s). Latest: ${bp[0]?.data?.company || "Custom"} (${bp[0]?.score}%)` : "No saved topology roadmap."
  },
  {
    id: "assessment",
    name: "Readiness Assessor",
    sub: "Maturity Index",
    href: "/build/assessment",
    color: "#00FF9D",
    desc: (ws) => ws.assessment ? `${Object.keys(ws.assessment.answers || {}).length} segment answers compiled.` : "No readiness answers recorded."
  },
  {
    id: "roi",
    name: "ROI Calculator",
    sub: "Savings Model",
    href: "/build/roi",
    color: "#E4000F",
    desc: (ws) => ws.roi ? `Sovereign TCO for ${ws.roi.companySize}. Baseline: $${(ws.roi.annualCostBaseline / 1000000).toFixed(1)}M/yr.` : "No economic variables modeled."
  },
  {
    id: "proposal",
    name: "Proposal Studio",
    sub: "SOW Specifications",
    href: "/build/proposal",
    color: "#3B82F6",
    desc: (ws) => ws.proposal ? `Draft Statement of Work for ${ws.proposal.companyName || "Client Entity"}.` : "No proposal metadata compiled."
  },
  {
    id: "talk",
    name: "Talk to Agent",
    sub: "Intake Mapping",
    href: "/build/talk",
    color: "#00FF9D",
    desc: (ws) => ws.talk ? `Sync intake saved. Primary challenge: ${ws.talk.data?.urgency || "In-Design"}` : "No agentic conversations saved."
  },
  {
    id: "sandbox",
    name: "Execution Sandbox",
    sub: "Simulation Spec",
    href: "/build/sandbox",
    color: "#009DFF",
    desc: (ws) => ws.sandbox ? `Active agent: ${ws.sandbox.activeAgentId}. Category: ${ws.sandbox.selectedFunction}.` : "No simulation templates run."
  },
  {
    id: "marketplace",
    name: "Agent Marketplace",
    sub: "Model Comparisons",
    href: "/build/marketplace",
    color: "#EC4899",
    desc: (ws) => ws.marketplace?.compareIds?.length > 0 ? `${ws.marketplace.compareIds.length} agent recipes compared.` : "No compared agent recipes."
  },
  {
    id: "foundryStudio",
    name: "Foundry Studio",
    sub: "Custom Workflow DAG",
    href: "/build/foundry-studio",
    color: "#00FF9D",
    desc: (ws) => ws.foundryStudio ? `Active pattern: ${ws.foundryStudio.selectedPattern}. Stages: ${ws.foundryStudio.stages?.length || 0}.` : "No customized execution flows."
  }
];

export default function WorkspaceContinuityPanel() {
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
    const mock = {
      assessment: { answers: { "strategy-q1": 4 } },
      roi: { companySize: "enterprise", annualCostBaseline: 1500000 },
      proposal: { companyName: "Enterprise Vanguard Corp" },
      talk: { currentStep: 2, data: { urgency: "Immediate" } },
      sandbox: { selectedFunction: "Knowledge Search", activeAgentId: "knowledge-search" },
      marketplace: { compareIds: ["agent-01", "agent-02"] },
      foundryStudio: { selectedPattern: "hierarchical", stages: [{ id: "node-0" }] }
    };
    localStorage.setItem("gff_local_workspace_continuity", JSON.stringify(mock));
    localStorage.setItem("gff_proposal_draft_intake", JSON.stringify(mock.proposal));

    const mockBlueprintHistory = [
      { id: "bp-mock-2026", score: 84, timestamp: new Date().toLocaleTimeString(), data: { company: "Enterprise Vanguard Corp" } }
    ];
    localStorage.setItem("gff_blueprint_history", JSON.stringify(mockBlueprintHistory));
    refreshWorkspace();
  };

  const handleClearSessions = () => {
    purgeAllWorkspace();
    refreshWorkspace();
  };

  if (!isClient) return null;

  return (
    <section className="p-6 lg:p-8 rounded-[24px] border border-white/5 bg-[#030408]/90 relative overflow-hidden space-y-6">
      <div className="absolute top-0 left-0 w-[40%] h-[40%] bg-[#009DFF]/5 blur-3xl pointer-events-none" />
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00FF9D] animate-pulse" />
            <span className="text-[10px] font-mono text-[#009DFF] font-semibold uppercase tracking-widest">Sovereign Client-Edge Sandbox Cache</span>
          </div>
          <h2 className="text-xl lg:text-2xl font-extrabold text-white tracking-tight">
            Your Active Workspace Continuity
          </h2>
          <p className="text-white/60 text-xs font-light max-w-[800px] leading-relaxed">
            Active diagnostic models, sandboxed flows, and customized architectural configurations are auto-saved directly inside this browser. No server-side transmission or persistent storage occurs in this phase.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
          {hasAny ? (
            <button
              onClick={handleClearSessions}
              className="px-4 py-2 rounded-lg border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 text-xs font-mono font-bold transition-all active:scale-95 cursor-pointer"
            >
              Purge Local Workspace
            </button>
          ) : (
            <button
              onClick={handleCreateMockSession}
              className="px-4 py-2 rounded-lg border border-[#009DFF]/30 bg-[#009DFF]/10 hover:bg-[#009DFF]/20 text-[#009DFF] text-xs font-mono font-bold transition-all active:scale-95 cursor-pointer"
            >
              Initialize Mock Workspace Demo
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        {TOOLS_META.map((tool, idx) => {
          const isBlueprint = tool.id === "blueprint";
          const isActive = isBlueprint ? blueprintHistory.length > 0 : !!workspace[tool.id];
          return (
            <div
              key={tool.id}
              className={`p-4 rounded-xl border flex flex-col justify-between min-h-[140px] transition-all duration-300 ${
                isActive
                  ? "bg-white/[0.02] border-white/10 shadow-[0_4px_20px_rgba(255,255,255,0.02)]"
                  : "border-white/5 bg-[#010102]/20"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[9px] font-mono font-bold uppercase" style={{ color: tool.color }}>
                    0{idx + 1}. {tool.name}
                  </span>
                  <span
                    className={`text-[8px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      isActive ? "bg-white/10 text-white" : "bg-white/5 text-white/35"
                    }`}
                  >
                    {isActive ? "ACTIVE" : "EMPTY"}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white mt-3">{tool.sub}</h4>
                <p className="text-[10px] text-white/50 font-light mt-1 min-h-[30px] line-clamp-2">
                  {tool.desc(workspace, blueprintHistory)}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[8px] font-mono text-white/30">CLIENT-EDGE CACHE</span>
                <Link
                  href={tool.href}
                  className="text-[10px] font-bold text-white hover:text-[#009DFF] transition flex items-center gap-1 group"
                >
                  <span>{isActive ? "RESUME" : "START"}</span>
                  <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
