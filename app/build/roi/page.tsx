"use client";

import { useState } from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";

type DeptKey = "finance" | "operations";

interface DeptDetail {
  title: string;
  bottleneck: string;
  agent: string;
  metrics: { label: string; value: string; color: string }[];
  description: string;
}

const DEPT_DETAILS: Record<DeptKey, DeptDetail> = {
  finance: {
    title: "Finance & Auditing",
    bottleneck: "Manual ledger reconciliation and anomaly sweeps are audited retrospectively, taking 40+ hours per week.",
    agent: "AS-09 Consensus Auditor",
    metrics: [
      { label: "Audit Accuracy Rate", value: "99.98%", color: "#00FF9D" },
      { label: "Deployment Horizon", value: "14 Days", color: "#009DFF" }
    ],
    description: "The AS-09 Auditor maps database mirrors directly inside private subnets, performing cryptographically secure checksum verification on high-throughput ledgers with absolute zero retention."
  },
  operations: {
    title: "Operations & Risk",
    bottleneck: "Tracking cloud infrastructure drift and mapping policies to SOC2 frameworks requires retrospective manual log tracing.",
    agent: "GFF Policy Watchdog",
    metrics: [
      { label: "Telemetry Coverage", value: "100.0%", color: "#00FF9D" },
      { label: "Incident Latency", value: "< 5 Sec", color: "#009DFF" }
    ],
    description: "Our compliance agents intercept active VPC configurations, blocking unauthorised policy drift and piping structured telemetry directly to high-fidelity audit reports."
  }
};


export default function ROICalculatorPage() {
  const [size, setSize] = useState(250);
  const [hours, setHours] = useState(8);
  const [rate, setRate] = useState(65);
  const [invest, setInvest] = useState(35000);
  const [activeDept, setActiveDept] = useState<DeptKey>("finance");

  const annualHours = Math.round(size * hours * 52 * 0.85);
  const grossSavings = annualHours * rate;
  const netSavings = Math.max(0, grossSavings - invest);
  const roi = invest > 0 ? Math.round((netSavings / invest) * 100) : 0;

  const currentDept = DEPT_DETAILS[activeDept];

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Executive Calculator"
        title="Operational ROI Calculator"
        highlightedWord="ROI Calculator"
        description="Quantify structural cost reductions, productivity reclaimed, and net financial ROI of deploying autonomous agent fleets."
      />

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-24 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sliders Control Board */}
          <div className="lg:col-span-6 space-y-6 p-6 rounded-2xl border border-white/5 bg-[#04060b]">
            <div className="border-b border-white/5 pb-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Financial Model Variables</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-white/80"><span>Enterprise Team Size</span><span className="text-[#E4000F] font-bold">{size} Employees</span></div>
                <input type="range" min="10" max="1000" step="10" value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full accent-[#E4000F]" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-white/80"><span>Weekly Process Hours Reclaimed</span><span className="text-[#E4000F] font-bold">{hours} Hours</span></div>
                <input type="range" min="2" max="20" step="1" value={hours} onChange={(e) => setHours(Number(e.target.value))} className="w-full accent-[#E4000F]" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-white/80"><span>Blended Hourly Labor Cost</span><span className="text-[#E4000F] font-bold">${rate}/Hour</span></div>
                <input type="range" min="25" max="150" step="5" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full accent-[#E4000F]" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-white/80"><span>Annual Licensing & Integration</span><span className="text-[#E4000F] font-bold">${invest.toLocaleString()}</span></div>
                <input type="range" min="15000" max="150000" step="5000" value={invest} onChange={(e) => setInvest(Number(e.target.value))} className="w-full accent-[#E4000F]" />
              </div>
            </div>
          </div>

          {/* Dynamic Financial Outputs */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="p-5 rounded-xl border border-white/5 bg-[#050101] flex flex-col justify-center">
              <span className="text-[10px] text-white/40 uppercase tracking-wider font-mono">Annual Labor Saved</span>
              <span className="text-2xl font-bold text-white mt-1">{annualHours.toLocaleString()} Hrs</span>
            </div>

            <div className="p-5 rounded-xl border border-white/5 bg-[#050101] flex flex-col justify-center">
              <span className="text-[10px] text-white/40 uppercase tracking-wider font-mono">Gross Productivity Value</span>
              <span className="text-2xl font-bold text-[#00FF9D] mt-1">${grossSavings.toLocaleString()}</span>
            </div>

            <div className="p-5 rounded-xl border border-white/5 bg-[#050101] flex flex-col justify-center">
              <span className="text-[10px] text-white/40 uppercase tracking-wider font-mono">Net Annual Cost Savings</span>
              <span className="text-2xl font-bold text-[#009DFF] mt-1">${netSavings.toLocaleString()}</span>
            </div>

            <div className="p-5 rounded-xl border border-white/5 bg-[#050101] flex flex-col justify-center">
              <span className="text-[10px] text-white/40 uppercase tracking-wider font-mono">Projected Investment ROI</span>
              <span className="text-2xl font-bold text-[#E4000F] mt-1">{roi}%</span>
            </div>

            <div className="col-span-2 p-4 rounded-xl bg-white/[0.01] border border-white/5 space-y-2">
              <span className="text-[10px] font-mono text-white/40 uppercase block">Model Allocation Guidelines</span>
              <div className="grid grid-cols-3 gap-2 text-[11px] text-white/60 font-light">
                <div><span className="font-bold text-[#009DFF]">15%</span> Compute cost</div>
                <div><span className="font-bold text-[#00FF9D]">45%</span> Compliance audits</div>
                <div><span className="font-bold text-white">40%</span> Active work-speed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Operational Impact matrix */}
        <div className="border border-white/5 bg-[#030408] rounded-2xl p-6 lg:p-8 space-y-6 animate-fadeIn">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-mono text-[#00FF9D] uppercase tracking-widest block">OPERATIONAL BLUEPRINT</span>
            <h3 className="text-lg font-bold text-white">Departmental Impact Matrix</h3>
            <p className="text-white/60 text-xs font-light max-w-[500px] mx-auto">See exactly where sovereign agent topologies remove process delays.</p>
          </div>

          <div className="flex gap-2 justify-center border-b border-white/5 pb-4">
            {(Object.keys(DEPT_DETAILS) as DeptKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setActiveDept(key)}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg border transition ${
                  activeDept === key ? "bg-[#009DFF]/10 text-[#009DFF] border-[#009DFF]/30" : "bg-white/[0.01] text-white/50 border-white/5 hover:text-white"
                }`}
              >
                {DEPT_DETAILS[key].title}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
            <div className="lg:col-span-7 space-y-4">
              <div>
                <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest block">THE CHALLENGE</span>
                <p className="text-xs text-white/80 leading-relaxed font-light">{currentDept.bottleneck}</p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 space-y-2">
                <span className="text-[9px] font-mono text-[#009DFF] uppercase tracking-widest block">GFF AUTONOMOUS NODE</span>
                <h4 className="text-sm font-bold text-white">{currentDept.agent}</h4>
                <p className="text-xs text-white/60 leading-relaxed font-light">{currentDept.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {currentDept.metrics.map((m, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-white/5 bg-black/40 text-center">
                    <span className="text-[9px] font-mono text-white/40 uppercase block mb-1">{m.label}</span>
                    <span className="text-sm font-bold font-mono" style={{ color: m.color }}>{m.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center items-center bg-black/40 border border-white/5 rounded-2xl p-6 min-h-[180px]">
              {activeDept === "finance" ? (
                <svg className="w-full max-w-[200px]" viewBox="0 0 200 120" fill="none">
                  <rect x="10" y="40" width="40" height="40" rx="6" fill="#04060b" stroke="#009DFF" strokeWidth="1.5" />
                  <text x="30" y="65" fill="#009DFF" fontSize="8" fontFamily="monospace" textAnchor="middle">DB IN</text>
                  <rect x="150" y="40" width="40" height="40" rx="6" fill="#04060b" stroke="#00FF9D" strokeWidth="1.5" />
                  <text x="170" y="65" fill="#00FF9D" fontSize="8" fontFamily="monospace" textAnchor="middle">AS-09</text>
                  <path d="M50 60 H150" stroke="white" strokeWidth="1.5" strokeDasharray="4 4" strokeOpacity="0.4" />
                  <path d="M50 60 H150" stroke="#00FF9D" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="12 40" strokeDashoffset="10">
                    <animate attributeName="stroke-dashoffset" values="40;0" dur="2s" repeatCount="indefinite" />
                  </path>
                </svg>
              ) : (
                <svg className="w-full max-w-[200px]" viewBox="0 0 200 120" fill="none">
                  <circle cx="100" cy="60" r="45" stroke="#009DFF" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.3" />
                  <circle cx="100" cy="60" r="15" fill="#04060b" stroke="#00FF9D" strokeWidth="2" />
                  <line x1="100" y1="60" x2="135" y2="25" stroke="#00FF9D" strokeWidth="1.5" strokeOpacity="0.7">
                    <animateTransform attributeName="transform" type="rotate" from="0 100 60" to="360 100 60" dur="4s" repeatCount="indefinite" />
                  </line>
                </svg>
              )}
            </div>
          </div>
        </div>

        <PremiumCTA />
      </div>
    </InnerPageShell>
  );
}
