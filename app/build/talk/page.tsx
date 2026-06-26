"use client";

import { useState } from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";

export default function TalkToAgentPage() {
  const [ind, setInd] = useState("Finance");
  const [size, setSize] = useState("100-1000");
  const [desc, setDesc] = useState("Automate transaction reconciliation and real-time compliance auditing.");
  const [analyzing, setAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<"proposal" | "squad" | "timeline">("proposal");

  const [messages, setMessages] = useState([{ s: "agent", t: "GFF Supervisor online. Sandboxed instruction terminal ready." }]);
  const [inVal, setInVal] = useState("");

  const handleIntake = (e: React.FormEvent) => {
    e.preventDefault();
    setAnalyzing(true);
    setTimeout(() => setAnalyzing(false), 800);
  };

  const handleSendTerminal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inVal.trim()) return;
    setMessages((p) => [...p, { s: "user", t: inVal }, { s: "agent", t: `[Supervisor] Isolated dry-run execution successful for objective: "${inVal}"` }]);
    setInVal("");
  };

  const getOutput = () => {
    if (ind === "Retail") {
      return {
        proposal: "Sovereign SAP freight ledger auditing. Syncs inventory routes to reduce port bottleneck overhead by 22%.",
        squad: [{ r: "AS-02 Supervisor", d: "Decomposes container and carrier logs." }, { r: "Route Optimizer", d: "Maps overland cargo bottlenecks." }],
        timeline: ["Day 1-15: Map SAP connectors", "Day 16-45: Configure workflow DAGs", "Day 46-90: Air-gapped pilot launch"]
      };
    }
    if (ind === "Healthcare") {
      return {
        proposal: "HIPAA-compliant medical record parsing and continuous FDA compliance telemetry without data retention.",
        squad: [{ r: "Privacy Watchdog", d: "Enforces air-gapped memory locks." }, { r: "Note Synthesizer", d: "Parses clinical notes to vector schemas." }],
        timeline: ["Day 1-20: Establish hardware VPC", "Day 21-50: Tune parser neural weights", "Day 51-90: HIPAA-certified deployment"]
      };
    }
    return {
      proposal: "Automated ledger reconciliation and real-time security auditing. Implements multi-system Consensus DAG structures.",
      squad: [{ r: "AS-09 Auditor", d: "Orchestrates database balance sweeps." }, { r: "Policy Guardrail", d: "Isolates and alerts cloud configuration drift." }],
      timeline: ["Day 1-10: Connect database mirrors", "Day 11-40: Establish reconciliation logic", "Day 41-90: Live transaction sandbox and automated SOC2 auditing"]
    };
  };

  const sim = getOutput();


  return (
    <InnerPageShell>
      <InnerPageHero
        category="Intake & Simulator"
        title="AI Challenge Intake Console"
        highlightedWord="Challenge Intake"
        description="Submit your enterprise operational bottleneck context to generate tailored squad configurations, proposal briefs, and sandboxed trace timelines."
      />

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-24 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT Form & Simulator */}
          <div className="lg:col-span-5 p-6 rounded-2xl border border-white/5 bg-[#04060b] space-y-6">
            <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono">Intake Control Panel</h2>
            <form onSubmit={handleIntake} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-white/50 uppercase">Industry</label>
                <select value={ind} onChange={(e) => setInd(e.target.value)} className="w-full h-10 rounded-lg border border-white/10 bg-black text-xs text-white px-3 focus:border-[#009DFF] outline-none">
                  <option value="Finance">Banking & Finance</option>
                  <option value="Retail">Retail & Supply Chain</option>
                  <option value="Healthcare">Healthcare & Biotech</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-white/50 uppercase">Company Size</label>
                <select value={size} onChange={(e) => setSize(e.target.value)} className="w-full h-10 rounded-lg border border-white/10 bg-black text-xs text-white px-3 focus:border-[#009DFF] outline-none">
                  <option value="<100">&lt; 100 employees</option>
                  <option value="100-1000">100 - 1,000 employees</option>
                  <option value="1000+">1,000+ employees</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-white/50 uppercase">Describe Core Problem</label>
                <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} className="w-full rounded-lg border border-white/10 bg-black text-xs text-white p-3 focus:border-[#009DFF] outline-none resize-none leading-relaxed" />
              </div>
              <button type="submit" disabled={analyzing} className="w-full h-10 rounded-lg text-xs font-bold text-white uppercase tracking-wider bg-gradient-to-r from-[#E4000F] to-[#009DFF] hover:opacity-90 transition disabled:opacity-50">
                {analyzing ? "Synthesizing Solutions..." : "Analyze Corporate Challenge"}
              </button>
            </form>

            <div className="pt-6 border-t border-white/5 space-y-4">
              <h3 className="text-xs font-mono font-bold text-white/40 uppercase">Sandbox Command Instruction</h3>
              <div className="h-32 rounded-lg border border-white/5 bg-black/60 p-3 overflow-y-auto font-mono text-[10px] space-y-1">
                {messages.map((m, idx) => (
                  <div key={idx} className={m.s === "user" ? "text-right" : "text-left"}>
                    <span className={m.s === "user" ? "text-[#009DFF]" : "text-white/60"}>{m.s === "user" ? "> " : "[SUPERVISOR] "}{m.t}</span>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendTerminal} className="flex gap-2">
                <input type="text" value={inVal} onChange={(e) => setInVal(e.target.value)} placeholder="Type sandbox objective..." className="flex-grow h-9 rounded-lg border border-[#ffffff15] bg-black px-3 text-[11px] text-white focus:outline-none" />
                <button type="submit" className="px-4 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-white hover:bg-white/10">Execute</button>
              </form>
            </div>
          </div>

          {/* RIGHT Results Display */}
          <div className="lg:col-span-7 p-6 rounded-2xl border border-white/5 bg-[#04060b] flex flex-col justify-between min-h-[500px]">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Framework Preview</h3>
                <div className="flex gap-1">
                  {(["proposal", "squad", "timeline"] as const).map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`px-2.5 py-1 rounded text-[10px] font-mono uppercase transition ${activeTab === tab ? "bg-[#009DFF]/10 text-[#009DFF] border border-[#009DFF]/20" : "text-white/40 hover:text-white"}`}>
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {activeTab === "proposal" && (
                <div className="space-y-3">
                  <span className="text-[9px] font-mono text-[#00FF9D] uppercase tracking-wider">Statement of Work Preview</span>
                  <h4 className="text-lg font-bold text-white">Autonomous Operational Proposal</h4>
                  <p className="text-white/70 text-xs leading-relaxed font-light">{sim.proposal}</p>
                  <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5">
                    <span className="text-[9px] text-white/30 font-mono block">COMMERCIAL BASIS</span>
                    <p className="text-xs text-[#009DFF] font-semibold mt-1">Sovereign Deployment Plan • Standard SLAs</p>
                  </div>
                </div>
              )}

              {activeTab === "squad" && (
                <div className="space-y-3">
                  <span className="text-[9px] font-mono text-[#9D00FF] uppercase tracking-wider">Cohort Topology</span>
                  <h4 className="text-lg font-bold text-white">Recommended Agent Squad</h4>
                  <div className="space-y-2">
                    {sim.squad.map((member, i) => (
                      <div key={i} className="p-3 rounded-lg bg-white/[0.01] border border-white/5 flex flex-col">
                        <span className="text-xs font-bold text-white">{member.r}</span>
                        <span className="text-[10px] text-white/50 mt-0.5">{member.d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "timeline" && (
                <div className="space-y-3">
                  <span className="text-[9px] font-mono text-[#E4000F] uppercase tracking-wider">Gated Deliverables</span>
                  <h4 className="text-lg font-bold text-white">90-Day Execution roadmap</h4>
                  <div className="space-y-2">
                    {sim.timeline.map((item, i) => (
                      <div key={i} className="flex gap-3 text-xs text-white/80 font-light items-center">
                        <span className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-mono font-bold text-[#009DFF]">{i+1}</span>
                        <p>{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-white/5 pt-4 flex justify-between items-center text-[9px] font-mono text-white/30">
              <span>SOCIETY STANDARDS SOC2</span>
              <span>ENCLAVE PRIVATE SECURE</span>
            </div>
          </div>
        </div>

        <PremiumCTA />
      </div>
    </InnerPageShell>
  );
}
