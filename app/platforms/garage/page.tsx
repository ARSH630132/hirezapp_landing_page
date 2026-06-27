"use client";

import { useState } from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import MotionReveal from "@/components/inner-pages/MotionReveal";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";

export default function GaragePage() {
  const [activeZone, setActiveZone] = useState("audit");
  const [simLog, setSimLog] = useState("Status: Idle. Select simulator...");
  const [simulating, setSimulating] = useState(false);

  const runSimulation = (type: string) => {
    setSimulating(true);
    setSimLog("Connecting...");
    setTimeout(() => {
      if (type === "audit") {
        setSimLog("[Agent] HIPAA scan active.\n[Compliance] Redacted PII.");
      } else if (type === "scada") {
        setSimLog("[Sensor] SCADA online.\n[Telemetry] matched SCADA rule (0.042).");
      } else {
        setSimLog("[Audit] SEC ledger scan active.\n[Compliance] Verified block signature.");
      }
      setSimulating(false);
    }, 400);
  };

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Innovation Layer"
        title="GFF AI Garage"
        highlightedWord="Garage"
        description="Transform objectives into software blueprints in our strategic co-design space."
      />
      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-24 space-y-16">
        <MotionReveal className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-10 border-y border-white/5">
          <div className="lg:col-span-5">
            <span className="text-xs font-mono text-[#00FF9D] uppercase tracking-widest font-bold">Innovation Framework</span>
            <h2 className="text-3xl font-bold text-white mt-2">The Innovation Layer</h2>
          </div>
          <div className="lg:col-span-7">
            <p className="text-white/70 font-light leading-relaxed text-sm">
              The Garage represents Tier 1 of GFF's Operating Model. Rather than jumping straight to complex coding, we scope governance boundaries, design cognitive topologies, and validate compliance.
            </p>
          </div>
        </MotionReveal>

        <MotionReveal className="space-y-6">
          <h2 className="text-2xl font-bold text-white text-center">Co-Design Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Discover AI Portal", tagline: "Strategic Scoping", desc: "Collaborative portal to map business objectives into agent capabilities." },
              { title: "Architectural Workshops", tagline: "Alignment & Design", desc: "Collaborative sessions where engineers and compliance officers outline boundaries." },
              { title: "AI Prototyping Labs", tagline: "Prototyping Sandbox", desc: "Isolated spaces to build initial scoped pipelines and validate guardrails." }
            ].map((p) => (
              <div key={p.title} className="p-6 rounded-2xl border border-white/5 bg-black/40 hover:border-[#00FF9D]/20 transition-all duration-300">
                <span className="text-[10px] font-mono text-[#00FF9D] uppercase tracking-wider">{p.tagline}</span>
                <h3 className="text-lg font-bold text-white mt-2 mb-3">{p.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed font-light">{p.desc}</p>
              </div>
            ))}
          </div>
        </MotionReveal>

        {/* <MotionReveal className="space-y-6 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center">Experiment Zone Sandbox</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-black/40 p-6 rounded-2xl border border-white/5">
            <div className="flex flex-col gap-3 justify-center">
              {["audit", "scada", "sec"].map((zone) => (
                <button key={zone} onClick={() => { setActiveZone(zone); runSimulation(zone); }} className={`p-4 rounded-xl border text-left transition-all capitalize font-bold text-sm text-white ${activeZone === zone ? "border-[#00FF9D] bg-[#00FF9D]/5" : "border-white/5 bg-white/[0.02]"}`}>
                  {zone === "audit" ? "PII Redactor Core" : zone === "scada" ? "SCADA Telemetry Parser" : "SEC Audit Agent"}
                </button>
              ))}
            </div>
            <div className="bg-[#04060b] rounded-xl border border-white/10 p-5 flex flex-col justify-between min-h-[180px]">
              <span className="text-[10px] font-mono text-white/40">Terminal Trace Output</span>
              <pre className="font-mono text-xs text-white/70 leading-relaxed whitespace-pre-wrap my-4 flex-grow font-light">{simLog}</pre>
              <button disabled={simulating} onClick={() => runSimulation(activeZone)} className="w-full py-2 rounded bg-[#00FF9D]/10 border border-[#00FF9D]/20 text-xs font-bold text-[#00FF9D] hover:bg-[#00FF9D]/20 transition-all">
                {simulating ? "Executing..." : "Re-Run Sandbox Trace"}
              </button>
            </div>
          </div>
        </MotionReveal> */}

        <PremiumCTA
          title="Start Joint Discovery in the Garage"
          description="Ready to frame your enterprise challenge? Contact us to map security, design topologies, and test in our labs."
          primaryLabel="Schedule Scoping Call"
          primaryHref="/contact"
        />
      </div>
    </InnerPageShell>
  );
}