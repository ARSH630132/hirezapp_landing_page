"use client";

import { useState } from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import MotionReveal from "@/components/inner-pages/MotionReveal";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";

export default function FoundryPage() {
  const [selected, setSelected] = useState("core");
  const [log, setLog] = useState("Status: Ready to execute flow.");
  const [running, setRunning] = useState(false);

  const triggerFlow = () => {
    setRunning(true);
    setLog("Compiling...");
    setTimeout(() => {
      setLog("[Node] Ingesting database stream...\n[Engine] Cognitive loops.\n[Status] Complete.");
      setRunning(false);
    }, 400);
  };

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Co-Creation Layer"
        title="Foundry Studio"
        highlightedWord="Foundry"
        description="Design deterministic multi-agent architectures with visual DAG orchestration."
      />
      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-24 space-y-16">
        <MotionReveal className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-10 border-y border-white/5">
          <div className="lg:col-span-5">
            <span className="text-xs font-mono text-[#009DFF] uppercase tracking-widest font-bold">Systems Co-Creation</span>
            <h2 className="text-3xl font-bold text-white mt-2">The Co-Creation Layer</h2>
          </div>
          <div className="lg:col-span-7">
            <p className="text-white/70 font-light text-sm">
              The Foundry represents Tier 2 of GFF's Operating Model. Developers build real-world cognitive agents using visual DAG pipelines, connect datasets, and execute.
            </p>
          </div>
        </MotionReveal>

        {/* <MotionReveal className="space-y-6">
          <h2 className="text-2xl font-bold text-white text-center">Interactive Workspace</h2>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-4xl mx-auto items-stretch">
            <div className="lg:col-span-7 h-[200px] rounded-2xl border border-white/10 bg-black/60 relative flex items-center justify-around overflow-hidden p-4">
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <line x1="15%" y1="50%" x2="85%" y2="50%" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="4 4" />
              </svg>
              {["db", "core", "out"].map((node) => (
                <button key={node} onClick={() => setSelected(node)} className={`z-10 w-20 h-20 rounded-xl border flex flex-col items-center justify-center capitalize transition-all ${selected === node ? "border-[#009DFF] bg-[#009DFF]/5 text-[#009DFF]" : "border-white/10 bg-white/[0.02]"}`}>
                  <span className="text-xl">{node === "db" ? "📥" : node === "core" ? "🧠" : "📤"}</span>
                  <span className="text-[9px] font-bold mt-1 text-white">{node}</span>
                </button>
              ))}
            </div>

            <div className="lg:col-span-5 flex flex-col justify-between p-6 rounded-2xl border border-white/10 bg-[#04060b] min-h-[200px]">
              <h3 className="text-xs font-bold text-[#009DFF] uppercase tracking-wider">Node Configurator</h3>
              <p className="text-xs text-white/70 font-light leading-relaxed my-1">
                {selected === "db" && "Source: Relational Database Fabric delta-stream indexing."}
                {selected === "core" && "Engine: GFF Cognitive Supervisor reasoning loop."}
                {selected === "out" && "Dispatcher: Webhook Secure Relay blockchain audit."}
              </p>
              <pre className="p-3 rounded-lg border border-white/5 bg-black/40 text-[11px] font-mono text-white/60 whitespace-pre-wrap">{log}</pre>
              <button onClick={triggerFlow} disabled={running} className="w-full py-2 rounded bg-[#009DFF]/15 border border-[#009DFF]/30 text-xs font-bold text-[#009DFF] hover:bg-[#009DFF]/25 transition-all">
                {running ? "Compiling..." : "Compile & Run DAG"}
              </button>
            </div>
          </div>
        </MotionReveal> */}

        <MotionReveal className="space-y-6">
          <h2 className="text-2xl font-bold text-white text-center">Foundry Capabilities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Build Agents", desc: "Build rich cognitive supervisors with deterministic branching policies." },
              { title: "Secure Runtime", desc: "Run high-throughput agent nodes inside locally sandboxed container environments." },
              { title: "Data Fabric Ingest", desc: "Ingest structured relational streams and orchestrate vector index updates." },
              { title: "AI Engineering", desc: "Enterprise evaluation loops, regression checks, and performance metrics." }
            ].map((c) => (
              <div key={c.title} className="p-6 rounded-xl border border-white/5 bg-black/40 hover:border-[#009DFF]/20 transition-all">
                <h3 className="font-bold text-white text-sm mb-2">{c.title}</h3>
                <p className="text-xs text-white/50 leading-relaxed font-light">{c.desc}</p>
              </div>
            ))}
          </div>
        </MotionReveal>

        <PremiumCTA
          title="Scale Your Engineered DAG to Production"
          description="Ready to elevate your validated agent pipelines? Transition seamlessly to the industrialization layer with Factory."
          primaryLabel="Explore Scaling Factory"
          primaryHref="/platforms/factory"
        />
      </div>
    </InnerPageShell>
  );
}