"use client";

import { useState } from "react";
import { Sliders, Shield, Cpu, Terminal, ArrowRight, CheckCircle2, AlertTriangle, Layers, Activity } from "lucide-react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import MotionReveal from "@/components/inner-pages/MotionReveal";
import { BentoGrid, BentoCard } from "@/components/inner-pages/BentoGrid";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";

const FOCUS_DIMENSIONS = [
  {
    id: "data",
    title: "Data Surface Density",
    badge: "Information Integrity",
    desc: "Evaluates standard legacy data structures, vector readiness, and semantic-graph ingestion schemas across private servers."
  },
  {
    id: "compliance",
    title: "Sovereign Compliance & Guardrails",
    badge: "Risk Minimization",
    desc: "Audits vulnerability to prompt injections, PII leakage surfaces, and evaluates kernel-level eBPF monitoring capabilities."
  },
  {
    id: "compute",
    title: "Elastic Compute Overhead",
    badge: "Resource Efficiency",
    desc: "Profiles existing container scaling, CPU/GPU utilization limits, and latency tolerances for real-time model routing."
  }
];

export default function AssessmentMeshPage() {
  const [dataDensity, setDataDensity] = useState(40);
  const [complianceScore, setComplianceScore] = useState(50);
  const [computeScalability, setComputeScalability] = useState(60);

  // Math calculation of the composite GFF Readiness score
  const readinessIndex = Math.round((dataDensity * 0.3) + (complianceScore * 0.4) + (computeScalability * 0.3));

  const getDiagnostics = () => {
    if (readinessIndex < 45) {
      return {
        status: "Critical Architecture Risk",
        color: "text-red-400 border-red-500/20 bg-red-500/5",
        icon: AlertTriangle,
        desc: "Siloed data repositories and unprotected API routes detected. High risk of IP or PII leakage under standard public LLMs. Recommendation: Immediately deploy GFF Diagnostic Probes inside local test environments."
      };
    } else if (readinessIndex < 75) {
      return {
        status: "Transitional Hybrid Model",
        color: "text-amber-400 border-amber-500/20 bg-amber-500/5",
        icon: Activity,
        desc: "Structured APIs are partially mapped, but semantic synchronizations and local eBPF compliance logs are offline. Recommendation: Adopt GFF Foundry (Tier 2) visual DAG controls to secure logic state routing."
      };
    } else {
      return {
        status: "Sovereign Production Optimal",
        color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
        icon: CheckCircle2,
        desc: "High-density data indexing and zero-trust telemetry guardrails successfully established. Sovereign models ready for deployment. Recommendation: Scale workloads dynamically inside GFF Factory (Tier 3) container environments."
      };
    }
  };

  const diag = getDiagnostics();
  const DiagIcon = diag.icon;

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Sovereign Diagnostics"
        title="GFF Assessment Mesh Engine"
        highlightedWord="Mesh"
        description="A quantitative diagnostic system scanning corporate metadata, security perimeters, and database topology to compile deterministic readiness roadmaps."
        breadcrumbs={[{ label: "Platforms", href: "/platforms" }, { label: "Assessment Mesh" }]}
      />

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-24 space-y-24">
        {/* Editorial Introduction */}
        <MotionReveal className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-10 border-y border-white/5 items-center">
          <div className="lg:col-span-5">
            {/* <span className="text-xs font-mono text-[#009DFF] uppercase tracking-widest font-bold">Rigorous Diagnostics</span> */}
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2 leading-tight">Quantitative Risk Mapping</h2>
          </div>
          <div className="lg:col-span-7">
            <p className="text-white/70 font-light text-sm sm:text-base leading-relaxed">
              Enterprise AI execution is not a matter of sentiment; it requires mathematical verification. The GFF Assessment Mesh runs non-invasive monitoring sweeps, auditing local database endpoints, kernel tracking layers, and workflow overhead. It builds a concrete strategic blueprint with clear, automated solutions.
            </p>
          </div>
        </MotionReveal>
        {/* Interactive Calculator Scorecard */}
        <MotionReveal className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            {/* <span className="text-xs font-mono text-[#009DFF] uppercase tracking-widest font-semibold">Simulate Your Infrastructure</span> */}
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Interactive Readiness Assessor</h2>
            <p className="text-white/50 text-xs sm:text-sm font-light">
              Adjust the operational metrics below to compile your sovereign risk indicators and GFF Readiness Score.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto items-stretch">
            {/* Left Sliders Control */}
            <div className="lg:col-span-7 p-6 rounded-2xl border border-white/5 bg-black/40 flex flex-col justify-around gap-6">
              <h3 className="text-sm font-semibold uppercase text-white/80 tracking-wide border-b border-white/5 pb-2">Operational Sliders</h3>
              
              {/* Slider 1 */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-white/70">Data Architecture Density</span>
                  <span className="text-[#009DFF] font-bold">{dataDensity}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={dataDensity}
                  onChange={(e) => setDataDensity(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#009DFF]"
                />
                <p className="text-[10px] text-white/40 leading-normal">
                  Reflects standard database silos versus semantic graph-vector index synchronization.
                </p>
              </div>

              {/* Slider 2 */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-white/70">Sovereign Compliance & Guardrails</span>
                  <span className="text-[#009DFF] font-bold">{complianceScore}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={complianceScore}
                  onChange={(e) => setComplianceScore(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#009DFF]"
                />
                <p className="text-[10px] text-white/40 leading-normal">
                  Measures PII isolation layers, prompt redaction guards, and active kernel-level eBPF audits.
                </p>
              </div>

              {/* Slider 3 */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-white/70">Elastic Compute Scalability</span>
                  <span className="text-[#009DFF] font-bold">{computeScalability}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={computeScalability}
                  onChange={(e) => setComputeScalability(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#009DFF]"
                />
                <p className="text-[10px] text-white/40 leading-normal">
                  Measures container scaling automation, queue limits, and GPU infrastructure optimization.
                </p>
              </div>
            </div>

            {/* Right Results Dashboard */}
            <div className="lg:col-span-5 p-6 rounded-2xl border border-white/10 bg-[#04060b] flex flex-col justify-between relative overflow-hidden min-h-[350px]">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#009DFF]/10 to-transparent pointer-events-none rounded-tr-2xl" />
              
              <div className="text-center py-4 flex flex-col items-center">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">GFF Readiness Index</span>
                
                {/* Advanced SVG Radial Gauge Meter */}
                <div className="mt-5 relative inline-flex items-center justify-center">
                  <svg className="w-32 h-32 transform -rotate-90 filter drop-shadow-[0_0_15px_rgba(0,157,255,0.05)]" viewBox="0 0 100 100">
                    {/* Outer Track */}
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      className="stroke-white/5"
                      strokeWidth="5"
                      fill="transparent"
                    />
                    {/* Dynamic Gauge Fill */}
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      stroke={
                        readinessIndex < 45 
                          ? "#E4000F" 
                          : readinessIndex < 75 
                            ? "#F59E0B" 
                            : "#10B981"
                      }
                      strokeWidth="5"
                      strokeDasharray={2 * Math.PI * 42}
                      strokeDashoffset={(2 * Math.PI * 42) * (1 - readinessIndex / 100)}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-500 ease-out"
                    />
                    {/* Inner Dashed Dial Ring */}
                    <circle
                      cx="50"
                      cy="50"
                      r="34"
                      className="stroke-white/10"
                      strokeWidth="1.5"
                      strokeDasharray="4 6"
                      fill="transparent"
                    />
                  </svg>
                  
                  {/* Digital value center overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-white tracking-tight leading-none">{readinessIndex}</span>
                    <span className="text-[9px] uppercase text-white/30 mt-1 font-mono tracking-wider">Ready / 100</span>
                  </div>
                </div>
              </div>

              {/* Diagnostic Box */}
              <div className={`p-4 rounded-xl border ${diag.color} space-y-2 mt-2 transition-all duration-300`}>
                <div className="flex items-center gap-2">
                  <DiagIcon className="w-4 h-4 shrink-0" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">{diag.status}</h4>
                </div>
                <p className="text-[11px] leading-relaxed font-light opacity-90">{diag.desc}</p>
              </div>
            </div>
          </div>
        </MotionReveal>
        {/* Quantitative Scanning Bento Grid */}
        <MotionReveal className="space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            {/* <span className="text-xs font-mono text-[#009DFF] uppercase tracking-widest font-semibold">Active Diagnostics</span> */}
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">Audit Coverage Dimensions</h2>
          </div>

          <BentoGrid>
            <BentoCard
              title="Passive eBPF Probe Sweep"
              description="Performs non-invasive, zero-trust telemetry scans at the Linux kernel level, cataloging database connections and API endpoints."
              badge="Network Scan"
              glowColor="blue"
              icon={<Layers className="w-5 h-5 text-[#009DFF]" />}
              metric={{ value: "Non-Invasive", label: "Kernel-Level Telemetry" }}
            />
            <BentoCard
              title="PII Redaction Quality Index"
              description="Evaluates context data surfaces, grading the effectiveness of prompt sanitization, pattern masks, and compliance redactions."
              badge="Security Grade"
              glowColor="purple"
              icon={<Shield className="w-5 h-5 text-purple-400" />}
              metric={{ value: "SOC2 Audited", label: "Data Leak Guard" }}
            />
            <BentoCard
              title="Compute Latency & Queue Limits"
              description="Simulates scaling stresses on local containers, mapping request bottlenecks and profiling compute efficiency gains."
              badge="Resource Audit"
              glowColor="red"
              icon={<Activity className="w-5 h-5 text-[#E4000F]" />}
              metric={{ value: "<15ms", label: "SLA Queue Guarantee" }}
            />
          </BentoGrid>
        </MotionReveal>
        {/* Scanning Lifecycle Timeline */}
        <MotionReveal className="space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            {/* <span className="text-xs font-mono text-[#E4000F] uppercase tracking-widest font-semibold">Active Scan Lifecycle</span> */}
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">Four-Step Scanning Process</h2>
            <p className="text-white/50 text-xs sm:text-sm font-light mt-2">
              How the GFF Assessment Mesh runs quantitative diagnostics to build your sovereign strategic blueprint.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4 relative">
            {/* Timeline Vertical bar */}
            <div className="absolute left-6 top-6 bottom-6 w-[1px] bg-white/5 hidden sm:block" />

            {[
              {
                step: "Phase 1: Probe Injection",
                title: "EBPF Telemetry Initialization",
                desc: "Secure, passive kernel hooks are injected into target microservice systems without disrupting production application workloads."
              },
              {
                step: "Phase 2: Metadata Aggregation",
                title: "Data Surface Mapping",
                desc: "Our automated analyzer maps structural database hierarchies, profiling silo densities and pattern-matching existing PII leakage loops."
              },
              {
                step: "Phase 3: Structural Threat Modeling",
                title: "Compliance Risk Compilation",
                desc: "We run deterministic stress tests to evaluate prompt injection resilience and compute scaling delays under simulated workloads."
              },
              {
                step: "Phase 4: Blueprint Synthesis",
                title: "Sovereign Roadmap Generation",
                desc: "The diagnostic mesh processes the compiled operational signals, outputting an immutable GFF Readiness Blueprint."
              }
            ].map((p, idx) => (
              <div key={idx} className="relative pl-0 sm:pl-12 flex flex-col sm:flex-row items-start gap-4 p-5 rounded-2xl border border-white/5 bg-black/40 hover:border-[#009DFF]/20 transition-all">
                {/* Visual Circle Marker on line */}
                <div className="absolute left-[20px] top-[26px] w-[9px] h-[9px] rounded-full bg-[#009DFF] border-2 border-black hidden sm:block" />
                
                <div className="flex-grow">
                  <span className="text-[10px] font-mono text-[#009DFF] uppercase tracking-wider font-bold">{p.step}</span>
                  <h4 className="text-base font-bold text-white mt-0.5">{p.title}</h4>
                  <p className="text-xs text-white/50 leading-relaxed font-light mt-1.5">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </MotionReveal>

        {/* Premium CTA */}
        <PremiumCTA
          title="Audit Your Enterprise Systems Today"
          description="Identify operational inefficiencies, protect intellectual property, and secure your data boundaries. Schedule a live Assessment Mesh scan."
          primaryLabel="Schedule Infrastructure Diagnostics"
          primaryHref="/contact"
        />
      </div>
    </InnerPageShell>
  );
}
