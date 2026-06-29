"use client";

import { useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import Link from "next/link";
import { Activity, ArrowUpRight, Bot, Calculator, Layers, Network, Sparkles, Workflow } from "lucide-react";

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
    {
      name: "Talk to Agent",
      link: "/build/talk",
      desc: "Consult strategy, governance, and architecture agents.",
      status: "Live Synapse",
      accent: "#009DFF",
      Icon: Bot,
    },
    {
      name: "Blueprint Generator",
      link: "/build/blueprint",
      desc: "Generate sovereign multi-agent roadmaps and DAGs.",
      status: "Topology",
      accent: "#9D00FF",
      Icon: Network,
    },
    {
      name: "AI Readiness",
      link: "/build/assessment",
      desc: "Score data, governance, infrastructure, and workflow maturity.",
      status: "Diagnostic",
      accent: "#00FF9D",
      Icon: Activity,
    },
    {
      name: "ROI Calculator",
      link: "/build/roi",
      desc: "Model savings, productivity lift, and delivery economics.",
      status: "Forecast",
      accent: "#E4000F",
      Icon: Calculator,
    },
    {
      name: "Marketplace",
      link: "/platforms/marketplace",
      desc: "Explore certified enterprise agent blueprints and recipes.",
      status: "Registry",
      accent: "#E98828",
      Icon: Layers,
    },
    {
      name: "Foundry Studio",
      link: "/platforms/foundry",
      desc: "Design deterministic workflows in the co-creation layer.",
      status: "DAG Studio",
      accent: "#00C2FF",
      Icon: Workflow,
    },
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const ans = text.toLowerCase().includes("cloud") ? "Cloud Auditor: Optimized resources saved $45k/yr." : "Supervisor: Context mounted in secure local sandbox.";
    setChat((p) => [...p, { s: "user", t: text }, { s: "agent", t: ans }]);
    setInVal("");
  };

  return (
    <section id="experience" className="w-full bg-[#020202] px-6 lg:px-16 py-16 relative overflow-hidden">
      <div className="max-w-[1795px] mx-auto relative z-10">
        <SectionHeading
          title={<h2 className="text-[26px] sm:text-[32px] font-semibold text-center uppercase text-white">INTERACTIVE <span className="text-[#009DFF]">EXPERIENCE</span></h2>}
          titleClassName="text-center"
          dividerWidthClassName="w-[260px]"
        />
        <p className="mt-4 text-center text-xs sm:text-sm text-white/45 max-w-2xl mx-auto uppercase tracking-[0.2em] mb-12">
          Hands-on simulation tools. Preview GFF multi-agent capabilities in secure client-side sandboxes.
        </p>

        <div className="relative">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(0,157,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(157,0,255,0.08)_1px,transparent_1px)] bg-[size:42px_42px] opacity-40" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tools.map((t, idx) => (
              <Link
                key={t.name}
                href={t.link}
                onClick={() => setTab(idx)}
                className="group relative min-h-[196px] overflow-hidden rounded-2xl border border-white/10 bg-[#030509]/90 p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-[#060a12]"
                style={{
                  boxShadow: tab === idx ? `0 0 0 1px ${t.accent}80, 0 22px 70px ${t.accent}26` : undefined,
                }}
              >
                <span className="absolute -right-14 -top-14 h-36 w-36 rounded-full blur-3xl opacity-20 transition-opacity duration-300 group-hover:opacity-45" style={{ backgroundColor: t.accent }} />
                <span className="absolute inset-x-0 top-0 h-px opacity-60" style={{ background: `linear-gradient(90deg, transparent, ${t.accent}, transparent)` }} />
                <span className="absolute left-0 top-0 h-full w-full translate-x-[-120%] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent transition-transform duration-700 group-hover:translate-x-[120%]" />

                <span className="relative flex items-start justify-between gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl border bg-white/[0.03] transition-transform duration-300 group-hover:scale-105" style={{ borderColor: `${t.accent}55`, color: t.accent }}>
                    <t.Icon className="h-5 w-5" />
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[9px] font-mono uppercase tracking-[0.18em] text-white/45">
                    0{idx + 1} / tool
                  </span>
                </span>

                <span className="relative mt-6 block">
                  <span className="mb-2 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em]" style={{ color: t.accent }}>
                    <Sparkles className="h-3 w-3 animate-pulse" />
                    {t.status}
                  </span>
                  <h3 className="text-xl font-semibold tracking-tight text-white transition-colors duration-300 group-hover:text-white">{t.name}</h3>
                  <p className="mt-3 min-h-[42px] text-sm leading-relaxed text-white/55">{t.desc}</p>
                </span>

                <span className="relative mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="flex items-center gap-1.5">
                    {[0, 1, 2].map((dot) => (
                      <span key={dot} className="h-1.5 w-1.5 rounded-full opacity-70" style={{ backgroundColor: t.accent }} />
                    ))}
                    <span className="ml-2 text-[10px] font-mono uppercase tracking-[0.16em] text-white/35">Open Workspace</span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-white/45 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
                </span>
              </Link>
            ))}
          </div>

          {/* <div className="lg:col-span-8">
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
                        <button type="button" onClick={() => handleSend(inVal)} className="px-4 rounded bg-[#009DFF] text-xs font-semibold text-white cursor-pointer">Send</button>
                      </div>
                    </div>
                  )}

                  {tab === 1 && (
                    <div className="space-y-4">
                      <p className="text-xs text-white/60">Simulate structural DAG mapping. Choose a target VPC architecture.</p>
                      <button type="button" onClick={() => setBp(true)} className="h-[36px] px-4 rounded bg-[#E98828] text-xs font-semibold text-white cursor-pointer">Generate Preview</button>
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
                        <button type="button" onClick={() => setInst(p => ({ ...p, c: true }))} className={`mt-2 w-full h-[26px] rounded text-xs cursor-pointer ${inst.c ? "bg-[#00FF9D]/10 text-[#00FF9D]" : "bg-[#0186E4] text-white"}`}>{inst.c ? "✓ Sandbox Active" : "Activate"}</button>
                      </div>
                      <div className="p-3 rounded border border-white/5 bg-white/[0.01]">
                        <h4 className="text-xs font-bold">Supply Chain Sync</h4>
                        <button type="button" onClick={() => setInst(p => ({ ...p, s: true }))} className={`mt-2 w-full h-[26px] rounded text-xs cursor-pointer ${inst.s ? "bg-[#00FF9D]/10 text-[#00FF9D]" : "bg-[#0186E4] text-white"}`}>{inst.s ? "✓ Sandbox Active" : "Activate"}</button>
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
                        <button type="button" onClick={() => { setFlow("Processing..."); setTimeout(() => setFlow("Done (420ms)"), 600); }} className="px-3 py-1 bg-white/5 rounded text-xs text-white hover:bg-white/10 cursor-pointer">Run Test</button>
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
          </div> */}
        </div>
      </div>
    </section>
  );
}
