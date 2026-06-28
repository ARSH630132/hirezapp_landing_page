"use client";

import { useState, useEffect, useRef } from "react";
import { BookOpen, Shield, Cpu, Terminal, ArrowRight, UserCheck, Award, GraduationCap } from "lucide-react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import MotionReveal from "@/components/inner-pages/MotionReveal";
import { BentoGrid, BentoCard } from "@/components/inner-pages/BentoGrid";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";

const CURRICULUMS = [
  {
    id: "tech",
    title: "Technical AI Engineering",
    subtitle: "For System Architects & Backend Engineers",
    icon: Cpu,
    description: "Master the mathematical structure of deterministic multi-agent graphs, secure container environments, and eBPF-based telemetry guardrails.",
    modules: [
      { name: "DAG Architecture", desc: "Modeling multi-agent structures with deterministic state recovery logic." },
      { name: "Sovereign Guardrails", desc: "Implementing real-time PII redaction and secure eBPF gateway intercepts." },
      { name: "Sovereign Compute Scaling", desc: "Dynamic container scheduling with vLLM runtimes on private clusters." }
    ],
    lab: "Compile & Dry-Run Sovereign Agent Nodes",
    initialLog: "Status: Awaiting engine configuration...\nRun GFF compiler to build agent topology.",
    runLog: "Initializing GFF Node Compiler...\n[Loader] Sourcing deterministic state schemas...\n[Sec] Verifying eBPF isolation sandbox...\n[Engine] Initializing cognitive Supervisor loop...\n[Status] Dry-run verification COMPLETE. Topology secure."
  },
  {
    id: "ops",
    title: "Operations & Risk Governance",
    subtitle: "For Security Officer & Compliance Teams",
    icon: Shield,
    description: "Align model outputs and sovereign workflows with strict industry regulations, risk protocols, and zero-trust verification chains.",
    modules: [
      { name: "Vulnerability Scanning", desc: "Automated probing of LLM contexts for prompt injections and leakages." },
      { name: "Regulatory Compliance Mapping", desc: "Auto-auditing model outputs against SOC2, ISO27001, and HIPAA frameworks." },
      { name: "Audit Trail Cryptography", desc: "Setting up immutable database ledgers for administrative query logging." }
    ],
    lab: "Initiate Cryptographic Audit Ledger",
    initialLog: "Status: Audit logging inactive.\nRun compliance probe to bind audit ledger.",
    runLog: "Deploying secure audit controller...\n[Schema] Generating ephemeral SHA-256 state hash...\n[Network] Binding read-only API gateway...\n[Status] Ledger ONLINE. Tamper-evident logging enabled."
  },
  {
    id: "exec",
    title: "Strategic Stewardship",
    subtitle: "For Enterprise Executive Leads",
    icon: GraduationCap,
    description: "Bridge the gap between strategic AI investment, workforce operational change, and structured roadmap blueprints.",
    modules: [
      { name: "Workforce Impact Mapping", desc: "Identifying workflow bottlenecks suitable for multi-agent delegation." },
      { name: "AI ROI Quantification", desc: "Evaluating compute cost optimization versus agent execution throughput." },
      { name: "Operational Adoption Timelines", desc: "Phased integration schedules with low-risk staging sandboxes." }
    ],
    lab: "Simulate Strategic Opportunity ROI Map",
    initialLog: "Status: ROI simulator ready.\nRun simulations to compile strategic opportunity projection.",
    runLog: "Mapping company-wide operational bottlenecks...\n[Compute] Base CPU overhead calculated...\n[Efficiency] Delegating 42% repetitive workflows to agents...\n[Status] Simulated ROI: 4.2x compute cost optimization. Roadmap mapped."
  }
];

export default function AiAcademyPage() {
  const [activeTab, setActiveTab] = useState("tech");
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [isCompiling, setIsCompiling] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activeCurriculum = CURRICULUMS.find((c) => c.id === activeTab) || CURRICULUMS[0];
  const IconComponent = activeCurriculum.icon;

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setTerminalLines(activeCurriculum.initialLog.split("\n"));
    setIsCompiling(false);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeTab, activeCurriculum.initialLog]);

  const triggerSimulation = () => {
    if (isCompiling) return;
    setIsCompiling(true);
    setTerminalLines(["[Sys] Establishing connection to sandbox container...", "[Sys] Authenticating workspace certificates..."]);
    
    const fullLog = activeCurriculum.runLog.split("\n");
    let currentLineIdx = 0;
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      if (currentLineIdx < fullLog.length) {
        const nextLine = fullLog[currentLineIdx];
        setTerminalLines(prev => {
          const filtered = prev.filter(l => !l.startsWith("[Sys]"));
          return [...filtered, nextLine];
        });
        currentLineIdx++;
      } else {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        setIsCompiling(false);
      }
    }, 450);
  };

  const handleTabChange = (id: string) => {
    setActiveTab(id);
  };

  const renderConsoleLine = (line: string, idx: number) => {
    if (!line) return null;
    
    const prefixRegex = /^(\[[a-zA-Z0-9\-]+\])(.*)$/;
    const match = line.match(prefixRegex);
    
    if (match) {
      const prefix = match[1];
      const rest = match[2];
      
      let prefixColor = "text-white/60";
      if (["[Loader]", "[Schema]", "[Resolver]"].includes(prefix)) {
        prefixColor = "text-[#009DFF] font-medium";
      } else if (["[Sec]", "[Audit]"].includes(prefix)) {
        prefixColor = "text-[#E4000F] font-medium";
      } else if (["[Engine]", "[Solver]"].includes(prefix)) {
        prefixColor = "text-purple-400 font-medium";
      } else if (prefix === "[Status]") {
        prefixColor = "text-emerald-400 font-bold";
      } else if (["[Compute]", "[Sensor]"].includes(prefix)) {
        prefixColor = "text-orange-400 font-medium";
      } else if (["[Efficiency]", "[Command]"].includes(prefix)) {
        prefixColor = "text-cyan-400 font-medium";
      } else if (["[Network]", "[Ledger]", "[Signature]"].includes(prefix)) {
        prefixColor = "text-teal-400 font-medium";
      } else if (prefix === "[Sys]") {
        prefixColor = "text-white/40 italic";
      }
      
      return (
        <div key={idx} className="flex gap-3 py-0.5 leading-relaxed select-all">
          <span className="text-[10px] text-white/10 select-none w-5 text-right font-mono">{String(idx + 1).padStart(2, '0')}</span>
          <span className="font-mono text-xs">
            <span className={prefixColor}>{prefix} </span>
            <span className="text-white/80">{rest.trim()}</span>
          </span>
        </div>
      );
    }
    
    const isNotice = line.toLowerCase().includes("status:") || line.toLowerCase().includes("console:") || line.toLowerCase().includes("incoming");
    return (
      <div key={idx} className="flex gap-3 py-0.5 leading-relaxed">
        <span className="text-[10px] text-white/10 select-none w-5 text-right font-mono">{String(idx + 1).padStart(2, '0')}</span>
        <span className={`font-mono text-xs ${isNotice ? "text-white/40 italic" : "text-white/70"}`}>{line}</span>
      </div>
    );
  };

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Enterprise Training"
        title="GFF AI Academy Enablement"
        highlightedWord="Academy"
        description="Empower your technical systems architects, compliance managers, and executive leaders with the structured engineering disciplines required to run sovereign multi-agent ecosystems."
        breadcrumbs={[{ label: "Platforms", href: "/platforms" }, { label: "AI Academy" }]}
      />

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-24 space-y-24">
        {/* Editorial Introduction */}
        <MotionReveal className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-10 border-y border-white/5 items-center">
          <div className="lg:col-span-5">
            {/* <span className="text-xs font-mono text-[#009DFF] uppercase tracking-widest font-bold">Human Operating Layer</span> */}
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2 leading-tight">Upskilling the Sovereign Enterprise</h2>
          </div>
          <div className="lg:col-span-7">
            <p className="text-white/70 font-light text-sm sm:text-base leading-relaxed">
              Enterprise AI transformations falter due to operational misalignment and a lack of engineering discipline, not model capability. The GFF AI Academy provides air-gapped container sandboxes, quantitative skill-mapping frameworks, and specialized structured curricula. We enable your team to take absolute, sovereign control of multi-agent architectures and security boundaries.
            </p>
          </div>
        </MotionReveal>

        {/* Interactive Workspace Console */}
        <MotionReveal className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            {/* <span className="text-xs font-mono text-[#009DFF] uppercase tracking-widest font-semibold">Custom Curriculum Workspace</span> */}
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Interactive Learning Console</h2>
            <p className="text-white/50 text-xs sm:text-sm font-light">
              Select an educational discipline to preview active learning modules, structured objectives, and run sandboxed CLI commands.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto items-stretch">
            {/* Left Column Tabs */}
            <div className="lg:col-span-4 flex flex-col gap-3">
              {CURRICULUMS.map((c) => {
                const TabIcon = c.icon;
                const isSelected = activeTab === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => handleTabChange(c.id)}
                    className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 group ${
                      isSelected
                        ? "border-[#009DFF] bg-[#009DFF]/5 text-white"
                        : "border-white/5 bg-black/40 text-white/50 hover:bg-white/[0.02] hover:border-white/10"
                    }`}
                  >
                    <TabIcon className={`w-5 h-5 shrink-0 mt-0.5 ${isSelected ? "text-[#009DFF]" : "text-white/30 group-hover:text-white/50"}`} />
                    <div>
                      <h4 className="font-bold text-sm text-white">{c.title}</h4>
                      <p className="text-[11px] text-white/50 font-light mt-0.5 leading-tight">{c.subtitle}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Column Detailed Sandbox */}
            <div className="lg:col-span-8 flex flex-col justify-between p-6 rounded-2xl border border-white/10 bg-[#04060b] relative overflow-hidden min-h-[350px]">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#009DFF]/10 to-transparent pointer-events-none rounded-tr-2xl" />
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <IconComponent className="w-5 h-5 text-[#009DFF]" />
                  <h3 className="text-base font-bold text-white tracking-tight">{activeCurriculum.title} Curriculum</h3>
                </div>

                <p className="text-xs text-white/70 font-light leading-relaxed">
                  {activeCurriculum.description}
                </p>

                {/* Sub-modules */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  {activeCurriculum.modules.map((m, idx) => (
                    <div key={idx} className="p-3 rounded-lg border border-white/5 bg-white/[0.01]">
                      <h5 className="text-[11px] font-bold text-[#009DFF] tracking-wide uppercase">{m.name}</h5>
                      <p className="text-[10px] text-white/50 font-light leading-snug mt-1">{m.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sandbox Terminal */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="flex gap-1.5 mr-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#E4000F]/60" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                    </div>
                    <span className="text-[10px] font-mono uppercase text-white/40 tracking-wider">gff-sandbox-shell</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full animate-ping ${isCompiling ? "bg-amber-500" : "bg-[#009DFF]"}`} />
                    <span className="text-[10px] font-mono text-white/40">Lab: {activeCurriculum.lab}</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-white/5 bg-black/80 min-h-[140px] flex flex-col justify-start overflow-y-auto max-h-[220px] font-mono scrollbar-thin select-text">
                  {terminalLines.map((line, idx) => renderConsoleLine(line, idx))}
                  {isCompiling && (
                    <div className="flex gap-3 py-0.5 leading-relaxed">
                      <span className="text-[10px] text-white/10 select-none w-5 text-right font-mono">
                        {String(terminalLines.length + 1).padStart(2, '0')}
                      </span>
                      <span className="text-[#009DFF] font-mono text-xs animate-pulse">█</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={triggerSimulation}
                  disabled={isCompiling}
                  className={`w-full py-2.5 rounded-lg border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    isCompiling 
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-500 cursor-not-allowed" 
                      : "bg-[#009DFF]/15 border-[#009DFF]/30 text-[#009DFF] hover:bg-[#009DFF]/25 shadow-[0_0_15px_rgba(0,157,255,0.05)] hover:shadow-[0_0_20px_rgba(0,157,255,0.15)]"
                  }`}
                >
                  {isCompiling ? "Compiling & Initializing GFF Sandbox..." : `Execute ${activeCurriculum.lab}`}
                </button>
              </div>
            </div>
          </div>
        </MotionReveal>
        {/* Structural Enablement Pillars (Bento Grid) */}
        <MotionReveal className="space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            {/* <span className="text-xs font-mono text-[#009DFF] uppercase tracking-widest font-semibold">Enterprise Pillars</span> */}
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">Sovereign Enablement Structure</h2>
          </div>

          <BentoGrid>
            <BentoCard
              title="Air-Gapped Sandbox Containers"
              description="Learn inside private, containerized deployment systems configured to execute GFF Agent pipelines with secure local sandboxing."
              badge="Environment Isolation"
              glowColor="blue"
              icon={<Cpu className="w-5 h-5 text-[#009DFF]" />}
              metric={{ value: "100%", label: "Air-gapped security" }}
            />
            <BentoCard
              title="Quantitative Readiness Audits"
              description="Measure technical skill scaling and compliance awareness across engineering departments with objective capability indices."
              badge="Skill Validation"
              glowColor="purple"
              icon={<Award className="w-5 h-5 text-purple-400" />}
              metric={{ value: "4-Level", label: "Skills Grading Index" }}
            />
            <BentoCard
              title="Sovereign Governance Guides"
              description="Deploy predefined SOC2-ready playbooks, local audit schemes, and data sanitization routines directly into sandbox setups."
              badge="Compliance Templates"
              glowColor="red"
              icon={<Shield className="w-5 h-5 text-[#E4000F]" />}
              metric={{ value: "Zero-Risk", label: "Policy Drift Guardrails" }}
            />
          </BentoGrid>
        </MotionReveal>
        {/* Rolling Enablement Timeline */}
        <MotionReveal className="space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            {/* <span className="text-xs font-mono text-[#E4000F] uppercase tracking-widest font-semibold">Enablement Lifecycle</span> */}
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">90-Day Academy Adoption Timeline</h2>
            <p className="text-white/50 text-xs sm:text-sm font-light mt-2">
              Our structured roadmap guarantees clear human readiness, secure sandbox environments, and rigorous validation.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4 relative">
            {/* Timeline Vertical bar */}
            <div className="absolute left-6 top-6 bottom-6 w-[1px] bg-white/5 hidden sm:block" />

            {[
              {
                step: "Phase 1: Days 1-30",
                title: "Departmental Capability Diagnostics",
                desc: "Assess development skill levels, security compliance profiles, and software tool landscapes to configure personalized academy sandboxes."
              },
              {
                step: "Phase 2: Days 31-60",
                title: "Sandboxed DAG Engineering Labs",
                desc: "Engineers construct and debug multi-agent graphs within GFF Foundry sandboxes, utilizing zero-trust eBPF compliance gates."
              },
              {
                step: "Phase 3: Days 61-90",
                title: "Operations & Governance Onboarding",
                desc: "Establish live audit configurations, run prompt injection simulations, and integrate automated legal/compliance redaction routines."
              },
              {
                step: "Phase 4: Day 91+",
                title: "Sovereign Production Integration",
                desc: "Upskilled technical leads promote validated sandbox configurations into GFF Factory cluster node operations."
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
          title="Onboard Your Enterprise Systems Teams"
          description="Transform your software and compliance architects into sovereign AI developers. Book a consultation to setup custom sandboxes."
          primaryLabel="Schedule Academy Workshop"
          primaryHref="/contact"
        />
      </div>
    </InnerPageShell>
  );
}
