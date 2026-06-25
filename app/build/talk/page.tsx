"use client";

import { useState } from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";

export default function TalkToAgentPage() {
  const [messages, setMessages] = useState([
    { s: "agent", t: "GFF Autonomous Supervisor online. Welcome to the high-fidelity agent sandbox." }
  ]);
  const [inVal, setInVal] = useState("");
  const [activeAgent, setActiveAgent] = useState("supervisor");

  const agents = {
    supervisor: "Decomposes complex, multi-system objectives into specialized sub-tasks.",
    compliance: "Real-time auditing across database schemas and S3 policy logs.",
    logistics: "SAP freight tracking pipeline optimizer and routing agent."
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    let ans = "";
    if (activeAgent === "compliance") {
      ans = "[Compliance Auditor] Validated 42 IAM policies. Isolated and auto-remediated 3 configuration drift events in secure subnet.";
    } else if (activeAgent === "logistics") {
      ans = "[Logistics Advisor] Detected marine port congestion. Re-routing overland logistics via custom freight APIs in 320ms.";
    } else {
      ans = "[Supervisor] Parsing objective... Spawning specialized audit cohort. Local dry-run executed successfully.";
    }
    setMessages((p) => [...p, { s: "user", t: text }, { s: "agent", t: ans }]);
    setInVal("");
  };

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Interactive Tool"
        title="Agent Chat Console"
        description="Interact directly with our multi-agent cognitive supervisors in a secure, sandbox-ready simulation terminal."
      />
      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-sm font-bold text-white/40 uppercase tracking-wider">Select Context Profile</h3>
          {Object.entries(agents).map(([id, desc]) => (
            <button
              key={id}
              onClick={() => setActiveAgent(id)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                activeAgent === id ? "bg-[#050B18] border-[#009DFF]/40" : "bg-white/[0.02] border-white/5 hover:bg-white/5"
              }`}
            >
              <span className="text-xs font-bold text-[#009DFF] uppercase tracking-wider">{id} Agent</span>
              <p className="text-xs text-white/60 mt-1">{desc}</p>
            </button>
          ))}
        </div>

        {/* Terminal Chat */}
        <div className="lg:col-span-8 rounded-2xl border border-white/10 bg-[#04060b] p-6 flex flex-col justify-between h-[480px]">
          <div className="h-[360px] rounded-lg border border-white/5 bg-black/50 p-4 overflow-y-auto font-mono text-xs space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.s === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-md px-4 py-2 ${m.s === "user" ? "bg-[#009DFF]/20 text-white" : "bg-white/[0.03] text-white/80"}`}>
                  {m.s === "user" ? "> " : `[${activeAgent.toUpperCase()}] `}{m.t}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); handleSend(inVal); }} className="flex gap-3 mt-4">
            <input
              type="text"
              value={inVal}
              onChange={(e) => setInVal(e.target.value)}
              placeholder={`Send objective to ${activeAgent}... (e.g. Audit legacy DB clusters)`}
              className="flex-grow h-[42px] rounded-lg border border-white/10 bg-[#010101]/60 px-4 text-xs text-white focus:outline-none"
            />
            <button type="submit" className="px-6 h-[42px] rounded-lg bg-[#009DFF] text-xs font-semibold text-white hover:bg-[#009DFF]/80">Send Command</button>
          </form>
        </div>
      </div>
    </InnerPageShell>
  );
}
