"use client";

import { useState } from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";

export default function FoundryPage() {
  const [selected, setSelected] = useState("core");
  const [log, setLog] = useState("Status: Ready to execute flow.");
  const [running, setRunning] = useState(false);

  const triggerFlow = () => {
    setRunning(true);
    setLog("Compiling multi-agent DAG structure...");
    setTimeout(() => {
      setLog("[Node 1] Ingesting telemetry logs from postgresql database...");
      setTimeout(() => {
        setLog("[Node 2] Cognitive core processing reasoning loop (ReAct loop)...");
        setTimeout(() => {
          setLog("[Node 3] Security guardrail scanning active profiles. Remediated 1 threat.");
          setTimeout(() => {
            setLog("Flow Execution complete. Latency: 420ms. Total token cost: $0.0034.");
            setRunning(false);
          }, 600);
        }, 600);
      }, 600);
    }, 600);
  };

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Interactive Tool"
        title="Foundry Visual Studio"
        description="Connect data structures, cognitive reasoning supervisors, and compliance guardrails in an integrated visual DAG workspace."
      />
      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Visualizer Canvas */}
        <div className="lg:col-span-8 h-[360px] rounded-2xl border border-white/10 bg-black/60 relative flex items-center justify-around overflow-hidden">
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <line x1="10%" y1="50%" x2="50%" y2="50%" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="50%" y1="50%" x2="90%" y2="50%" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="4 4" />
          </svg>
          <button onClick={() => setSelected("db")} className={`z-10 w-16 h-16 rounded-xl border flex flex-col items-center justify-center transition-all ${selected === "db" ? "border-[#00FF9D] bg-[#00FF9D]/5" : "border-white/10 bg-white/[0.02]"}`}>
            <span className="text-xl">📥</span>
            <span className="text-[9px] font-bold mt-1">DB INGEST</span>
          </button>
          <button onClick={() => setSelected("core")} className={`z-10 w-16 h-16 rounded-xl border flex flex-col items-center justify-center transition-all ${selected === "core" ? "border-[#00FF9D] bg-[#00FF9D]/5" : "border-white/10 bg-white/[0.02]"}`}>
            <span className="text-xl">🧠</span>
            <span className="text-[9px] font-bold mt-1">COGNITIVE</span>
          </button>
          <button onClick={() => setSelected("out")} className={`z-10 w-16 h-16 rounded-xl border flex flex-col items-center justify-center transition-all ${selected === "out" ? "border-[#00FF9D] bg-[#00FF9D]/5" : "border-white/10 bg-white/[0.02]"}`}>
            <span className="text-xl">📤</span>
            <span className="text-[9px] font-bold mt-1">DISPATCHER</span>
          </button>
        </div>

        {/* Configuration Pane & Logs */}
        <div className="lg:col-span-4 flex flex-col justify-between p-6 rounded-2xl border border-white/10 bg-[#04060b] min-h-[360px]">
          <div>
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-4">Node Configuration</h3>
            {selected === "db" && <p className="text-xs text-white/70">Source: PostgreSQL Database. Dynamic interval fetching enabled.</p>}
            {selected === "core" && <p className="text-xs text-white/70">Orchestrator: GFF Cognitive Core. Reasoning pattern: ReAct feedback loop.</p>}
            {selected === "out" && <p className="text-xs text-white/70">Action Target: REST Webhook API Dispatcher with active logging.</p>}
          </div>

          <div className="mt-6 space-y-4">
            <div className="p-3 rounded-lg border border-white/5 bg-black/40 text-[11px] font-mono text-white/60 min-h-[60px]">
              {log}
            </div>
            <button onClick={triggerFlow} disabled={running} className="w-full h-[40px] rounded-lg bg-[#00FF9D]/15 border border-[#00FF9D]/30 text-xs font-bold text-[#00FF9D] hover:bg-[#00FF9D]/25 transition-all">
              {running ? "Executing..." : "Execute Flow Test"}
            </button>
          </div>
        </div>
      </div>
    </InnerPageShell>
  );
}
