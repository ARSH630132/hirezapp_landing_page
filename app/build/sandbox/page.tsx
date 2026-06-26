"use client";

import { useState, useEffect, useRef } from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";

type Log = { type: string; text: string; time: string };

const TEMPLATES = [
  {
    id: "finance",
    name: "Sovereign Core Auditing",
    desc: "Continuous multi-agent validation across transaction streams.",
    logs: [
      { type: "system", text: "Initializing cryptographic secure enclave..." },
      { type: "info", text: "Spawning Supervisor Agent [AS-09] on secure tenant boundary." },
      { type: "agent", text: "[Supervisor] Pulling daily ledger balance traces..." },
      { type: "success", text: "Consensus verified. Checksums match core database." }
    ]
  },
  {
    id: "supply-chain",
    name: "SAP ERP Pipeline Optimizer",
    desc: "Autonomous container routing and port congestion mitigation.",
    logs: [
      { type: "system", text: "Mounting SAP ERP connector interface..." },
      { type: "warning", text: "[Logistics] Congestion detected at Rotterdam port." },
      { type: "agent", text: "[Supervisor] Querying freight routing heuristics..." },
      { type: "success", text: "Alternate route locked. ETA reduced by 18 hours." }
    ]
  }
];

export default function SandboxPage() {
  const [sel, setSel] = useState(TEMPLATES[0]);
  const [run, setRun] = useState(false);
  const [logs, setLogs] = useState<Log[]>([]);
  const [pct, setPct] = useState(0);
  const logEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!run) return;
    setLogs([]);
    setPct(0);
    let step = 0;
    const interval = setInterval(() => {
      if (step < sel.logs.length) {
        const d = new Date();
        const tStr = `${d.getHours().toString().padStart(2,"0")}:${d.getMinutes().toString().padStart(2,"0")}:${d.getSeconds().toString().padStart(2,"0")}`;
        setLogs((p) => [...p, { type: sel.logs[step].type, text: sel.logs[step].text, time: tStr }]);
        setPct(Math.round(((step + 1) / sel.logs.length) * 100));
        step++;
      } else {
        clearInterval(interval);
        setRun(false);
      }
    }, 800);
    return () => clearInterval(interval);
  }, [run, sel]);

  useEffect(() => { logEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [logs]);

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Interactive Sandbox"
        title="Zero-Trust Simulation Enclave"
        highlightedWord="Simulation Enclave"
        description="Launch real-time local agent DAG simulations to stress-test your autonomous pipelines within a simulated secure hardware enclave."
      />

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-24 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-2xl border border-white/5 bg-[#04060b] p-6 space-y-4">
              <h3 className="text-xs font-mono font-bold text-white/40 uppercase tracking-wider">Select Enclave Profile</h3>
              <div className="space-y-3">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => { if (!run) { setSel(t); setLogs([]); } }}
                    disabled={run}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      sel.id === t.id ? "bg-[#009DFF]/10 border-[#009DFF]/40 text-white" : "bg-white/[0.01] border-white/5 text-white/70 hover:bg-white/[0.03] disabled:opacity-50"
                    }`}
                  >
                    <span className="text-xs font-bold text-[#009DFF] uppercase tracking-wider">{t.name}</span>
                    <p className="text-xs text-white/50 mt-1">{t.desc}</p>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setRun(true)}
                disabled={run}
                className="w-full h-11 rounded-lg text-xs font-bold uppercase bg-gradient-to-r from-[#E4000F] to-[#009DFF] text-white hover:opacity-95 disabled:opacity-50 tracking-wider"
              >
                {run ? `Simulation Active (${pct}%)` : "Launch Simulated Sandbox"}
              </button>
            </div>

            {/* Simulated Hardware Status Panel */}
            <div className="p-5 rounded-2xl border border-white/5 bg-[#04060b] space-y-3">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider block">HARDWARE STATUS METRICS</span>
              <div className="grid grid-cols-2 gap-3 text-[10px] font-mono font-bold text-white/80">
                <div className="p-2 rounded bg-white/[0.01] border border-white/5 flex flex-col"><span className="text-white/40 font-light">ISOLATION</span><span className="text-[#00FF9D] mt-0.5">HARDENED</span></div>
                <div className="p-2 rounded bg-white/[0.01] border border-white/5 flex flex-col"><span className="text-white/40 font-light">MEMORY LOCK</span><span className="text-[#009DFF] mt-0.5">AES-256</span></div>
                <div className="p-2 rounded bg-white/[0.01] border border-white/5 flex flex-col"><span className="text-white/40 font-light">SHIELDING</span><span className="text-[#9D00FF] mt-0.5">VPC ACTIVE</span></div>
                <div className="p-2 rounded bg-white/[0.01] border border-white/5 flex flex-col"><span className="text-white/40 font-light">CONSENSUS</span><span className="text-[#00FF9D] mt-0.5">VERIFIED</span></div>
              </div>
            </div>
          </div>

          {/* RIGHT Telemetry */}
          <div className="lg:col-span-8 flex flex-col h-[460px] rounded-2xl border border-white/10 bg-[#020202] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#04060b]">
              <span className="text-xs font-mono font-bold text-white/80 tracking-wider">SECURE ENCLAVE TELEMETRY STREAM</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="flex-1 p-6 overflow-y-auto font-mono text-xs space-y-3 bg-black">
              {logs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-white/30 space-y-2">
                  <svg className="w-8 h-8 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <p className="text-xs">Enclave ready. Select profile and click launch to simulate dry-run telemetry.</p>
                </div>
              ) : (
                logs.map((l, idx) => (
                  <div key={idx} className="flex gap-3 border-l-2 pl-3 border-white/5 text-[11px]">
                    <span className="text-white/30">{l.time}</span>
                    <span className={`font-semibold ${
                      l.type === "success" ? "text-[#00FF9D]" : l.type === "warning" ? "text-amber-400" : l.type === "agent" ? "text-[#009DFF]" : "text-purple-400"
                    }`}>{l.text}</span>
                  </div>
                ))
              )}
              <div ref={logEnd} />
            </div>
          </div>
        </div>

        <PremiumCTA />
      </div>
    </InnerPageShell>
  );
}
