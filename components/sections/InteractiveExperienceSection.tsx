"use client";

import { useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import Link from "next/link";

export default function InteractiveExperienceSection() {
  const [tab, setTab] = useState(0);
  const [chat, setChat] = useState([{ s: "agent", t: "Supervisor online. Query cloud spend or compliance." }]);
  const [inVal, setInVal] = useState("");
  const [bp, setBp] = useState(false);
  const [rd, setRd] = useState(3);
  const [size, setSize] = useState(250);
  const [inst, setInst] = useState<Record<string, boolean>>({});
  const [flow, setFlow] = useState("Status: Idle");

  const tools = [
    { name: "Talk to Agent", link: "/build/talk" },
    { name: "Blueprint Generator", link: "/build/blueprint" },
    { name: "AI Readiness", link: "/build/assessment" },
    { name: "ROI Calculator", link: "/build/roi" },
    { name: "Marketplace", link: "/platforms/marketplace" },
    { name: "Foundry Studio", link: "/platforms/foundry" },
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const ans = text.toLowerCase().includes("cloud") ? "Cloud Auditor: Optimized resources saved $45k/yr." : "Supervisor: Context mounted in secure local sandbox.";
    setChat((p) => [...p, { s: "user", t: text }, { s: "agent", t: ans }]);
    setInVal("");
  };

  return (
    <section className="w-full bg-[#020202] px-6 lg:px-16 py-16 relative overflow-hidden">
      <div className="max-w-[1795px] mx-auto relative z-10">
        <SectionHeading
          title={<h2 className="text-[26px] sm:text-[32px] font-semibold text-center uppercase text-white">INTERACTIVE <span className="text-[#009DFF]">EXPERIENCE</span></h2>}
          titleClassName="text-center"
          dividerWidthClassName="w-[260px]"
        />
        <p className="mt-4 text-center text-xs sm:text-sm text-white/45 max-w-2xl mx-auto uppercase tracking-[0.2em] mb-12">
          Hands-on simulation tools. Preview GFF multi-agent capabilities in secure client-side sandboxes.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 flex lg:flex-col gap-3 overflow-x-auto pb-4 lg:pb-0 scrollbar-none">
            {tools.map((t, idx) => (
              <button
                key={t.name}
                type="button"
                onClick={() => setTab(idx)}
                className={`flex-shrink-0 w-[190px] lg:w-full text-left rounded-xl border p-4 transition-all cursor-pointer ${
                  tab === idx ? "bg-[#050B18] border-[#009DFF]/40" : "bg-[#010101]/60 border-white/5 hover:bg-white/[0.02]"
                }`}
              >
                <span className="text-[9px] font-mono text-white/30">0{idx + 1} / tool</span>
                <h3 className="text-[14px] font-semibold text-white/90 mt-1">{t.name}</h3>
              </button>
            ))}
          </div>

          <div className="lg:col-span-8">
            <div className="w-full min-h-[360px] rounded-2xl border border-white/10 bg-[#04060b] p-6 sm:p-8 flex flex-col justify-between shadow-2xl">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-4">
                  <div>
                    <span className="px-2 py-0.5 text-[9px] font-mono rounded bg-white/5 text-white/60 border border-white/10 uppercase">{tools[tab].name}</span>
                    <h2 className="mt-2 text-lg font-semibold text-white">
                      {tab === 0 && "Autonomous Multi-Agent Chat Studio"}
                      {tab === 1 && "Enterprise Infrastructure Blueprint Generator"}
                      {tab === 2 && "Infrastructure AI Readiness Evaluator"}
                      {tab === 3 && "Productivity & Operational ROI Calculator"}
                      {tab === 4 && "Enterprise Secure Plug-In Registry"}
                      {tab === 5 && "Foundry Workflow Visual Studio"}
                    </h2>
                  </div>
                  <Link href={tools[tab].link} className="shrink-0 text-xs font-semibold px-4 py-2 rounded-lg text-white border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-center">Launch Tool &rarr;</Link>
                </div>

                <div className="mt-6 text-sm text-white/80">
                  {tab === 0 && (
                    <div className="space-y-4">
                      <div className="h-[120px] rounded border border-white/5 bg-black/50 p-3 overflow-y-auto font-mono text-[11px] space-y-1">
                        {chat.map((m, i) => <p key={i} className={m.s === "user" ? "text-[#009DFF]" : "text-white/80"}>{m.s === "user" ? "> " : ""}{m.t}</p>)}
                      </div>
                      <div className="flex gap-2">
                        <input type="text" value={inVal} onChange={(e) => setInVal(e.target.value)} placeholder="Type cloud spend..." aria-label="Cloud spend query text" className="flex-grow h-[32px] rounded border border-white/10 bg-[#010101]/60 px-3 text-xs text-white focus:outline-none" />
                        <button type="button" onClick={() => handleSend(inVal)} className="px-4 rounded bg-[#009DFF] text-xs font-semibold text-white">Send</button>
                      </div>
                    </div>
                  )}

                  {tab === 1 && (
                    <div className="space-y-4">
                      <p className="text-xs text-white/60">Simulate structural DAG mapping. Choose a target VPC architecture.</p>
                      <button type="button" onClick={() => setBp(true)} className="h-[36px] px-4 rounded bg-[#E98828] text-xs font-semibold text-white">Generate Preview</button>
                      {bp && <p className="text-xs text-[#E98828] font-bold">Blueprint Generated. Scroll down to full generator &darr;</p>}
                    </div>
                  )}

                  {tab === 2 && (
                    <div className="space-y-4">
                      <div className="flex justify-between text-xs"><span>Data Integration Layer</span><span className="text-[#9D00FF] font-bold">LVL {rd}</span></div>
                      <input type="range" min="1" max="5" value={rd} onChange={(e) => setRd(Number(e.target.value))} aria-label="Data Integration Layer level slider" className="w-full accent-[#9D00FF]" />
                      <div className="p-3 rounded bg-white/[0.02] text-center mt-2 text-xl font-bold text-[#9D00FF]">{rd * 20}% Readiness</div>
                    </div>
                  )}

                  {tab === 3 && (
                    <div className="space-y-4">
                      <div className="flex justify-between text-xs"><span>Team Size</span><span className="text-[#E4000F] font-bold">{size} employees</span></div>
                      <input type="range" min="10" max="1000" step="10" value={size} onChange={(e) => setSize(Number(e.target.value))} aria-label="Team size slider for ROI calculation" className="w-full accent-[#E4000F]" />
                      <div className="p-3 rounded bg-[#050101] text-center text-lg font-bold text-[#00FF9D]">${Math.round(size * 8 * 52 * 65 * 0.85).toLocaleString()} / yr savings</div>
                    </div>
                  )}

                  {tab === 4 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-3 rounded border border-white/5 bg-white/[0.01]">
                        <h4 className="text-xs font-bold">Compliance Auditor</h4>
                        <button type="button" onClick={() => setInst(p => ({ ...p, c: true }))} className={`mt-2 w-full h-[26px] rounded text-xs ${inst.c ? "bg-[#00FF9D]/10 text-[#00FF9D]" : "bg-[#0186E4] text-white"}`}>{inst.c ? "✓ Sandbox Active" : "Activate"}</button>
                      </div>
                      <div className="p-3 rounded border border-white/5 bg-white/[0.01]">
                        <h4 className="text-xs font-bold">Supply Chain Sync</h4>
                        <button type="button" onClick={() => setInst(p => ({ ...p, s: true }))} className={`mt-2 w-full h-[26px] rounded text-xs ${inst.s ? "bg-[#00FF9D]/10 text-[#00FF9D]" : "bg-[#0186E4] text-white"}`}>{inst.s ? "✓ Sandbox Active" : "Activate"}</button>
                      </div>
                    </div>
                  )}

                  {tab === 5 && (
                    <div className="space-y-4">
                      <div className="h-[60px] rounded border border-white/5 bg-black/60 flex items-center justify-around">
                        <span className="text-xs">📥 Ingest</span><span className="text-xs text-[#00FF9D]">🧠 Core</span><span className="text-xs">📤 Output</span>
                      </div>
                      <div className="flex justify-between items-center bg-white/[0.02] p-2 rounded border border-white/5">
                        <span className="text-xs text-white/50 font-mono">{flow}</span>
                        <button type="button" onClick={() => { setFlow("Processing..."); setTimeout(() => setFlow("Done (420ms)"), 600); }} className="px-3 py-1 bg-white/5 rounded text-xs text-white hover:bg-white/10">Run Test</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-[10px] text-white/40">
                <span>* Simulated. Dedicated sandbox routes contain interactive panels.</span>
                <Link href={tools[tab].link} className="shrink-0 text-[#009DFF] font-bold hover:underline">Launch Sandbox &rarr;</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
