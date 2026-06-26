"use client";

import { useState, useEffect, useRef } from "react";
import { GraduationCap, Shield, Cpu, Terminal, ArrowRight, Network, Database, BookOpen, Activity } from "lucide-react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import MotionReveal from "@/components/inner-pages/MotionReveal";
import { BentoGrid, BentoCard } from "@/components/inner-pages/BentoGrid";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";

const ROLES = [
  {
    id: "student",
    title: "Student Lifecycle & Learning",
    icon: GraduationCap,
    badge: "Student OS Core",
    description: "Provide students with individualized, secure computational sandboxes, intelligent advising agents, and automated campus service gateways.",
    protocols: [
      { name: "Academic Sandbox Routing", desc: "Launches personal isolated environments for coding and research assignments." },
      { name: "Registrar Co-Pilot", desc: "Automates course eligibility check-ins and schedules appointments." },
      { name: "Privacy Guardrail", desc: "Redacts individual student PII on query submissions to keep records completely private." }
    ],
    consoleLabel: "Student Assistant Agent",
    initialLog: "Console: Awaiting query from student terminal...",
    runLog: "Incoming Query: 'Optimize my autumn schedule for AI Ethics and GPU Compute Labs.'\n[Resolver] Loading academic curriculum catalog...\n[Solver] Resolving scheduling conflicts...\n[Audit] PII Redacted. Query cleared.\n[Status] Proposed schedule compiled. Routing to advisor approval."
  },
  {
    id: "faculty",
    title: "Research & Faculty Sandboxes",
    icon: BookOpen,
    badge: "Sovereign Academic Compute",
    description: "Empower academic researchers and laboratory directors with sovereign sandboxed clusters, automated grant pre-auditing, and intellectual property guards.",
    protocols: [
      { name: "IP Guard Protocol", desc: "Prevents research outputs and un-published datasets from leaking to third-party public models." },
      { name: "Grant Compliance Audit", desc: "Pre-checks research proposals against governmental and foundation submission guidelines." },
      { name: "High-Throughput Sandboxing", desc: "Allocates compartmentalized GPU compute lanes for secure model fine-tuning." }
    ],
    consoleLabel: "Academic IP Sandbox Controller",
    initialLog: "Console: Standing by to run research data sanitization loop.",
    runLog: "Ingesting un-published manuscript: 'Sovereign-Edge Agent Architectures'...\n[Vector-Scanner] Scanning local metadata and bibliography...\n[Check] Validating proprietary training datasets...\n[Status] IP Sanitized. Safe for local model ingestion."
  },
  {
    id: "ops",
    title: "Campus Operations & Facilities",
    icon: Activity,
    badge: "Campus Operations Hub",
    description: "Optimize facility scheduling, analyze energy density, and orchestrate campus logistics using interconnected agent nodes.",
    protocols: [
      { name: "Classroom Allocation Mesh", desc: "Dynamically matches lecture space requirements to student enrollment streams." },
      { name: "Energy Grid Broker", desc: "Monitors classroom occupancy and dials down HVAC systems dynamically." },
      { name: "Logistics Router", desc: "Orchestrates campus shuttle paths and supply chains during institutional events." }
    ],
    consoleLabel: "Campus Operations Engine",
    initialLog: "Console: Telemetry idle. Launch energy-efficiency loop.",
    runLog: "Loading real-time campus occupancy telemetry...\n[Sensor] Empty lecture halls detected: Hall A, Lab 4...\n[Command] Adjusting climate control outputs by -35%...\n[Status] Saved 142kWh. Continuous grid monitoring active."
  },
  {
    id: "registry",
    title: "Administration & Registry Hub",
    icon: Database,
    badge: "Zero-Trust Records Core",
    description: "Maintain absolute records integrity, streamline administrative compliance workflows, and deploy immutable registrar databases.",
    protocols: [
      { name: "Transcript Ledger Validation", desc: "Uses local cryptographic signatures to verify grade reports and transcript requests." },
      { name: "eBPF Student Data Shield", desc: "Injects kernel-level logging to track unauthorized administrative record reads." },
      { name: "State Audit Stream", desc: "Generates tamper-evident metadata streams for state accreditation audits." }
    ],
    consoleLabel: "Registry Integrity Guard",
    initialLog: "Console: Active ledger scanning inactive.",
    runLog: "Initiating cryptographic transcript check...\n[Signature] Matching local campus key hashes...\n[Ledger] Scanning academic block indexes...\n[Status] Integrity verification SUCCESS. Transcript certified."
  }
];

export default function UniversityOneversePage() {
  const [activeTab, setActiveTab] = useState("student");
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activeRole = ROLES.find((r) => r.id === activeTab) || ROLES[0];
  const IconComponent = activeRole.icon;

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setTerminalLines(activeRole.initialLog.split("\n"));
    setIsRunning(false);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeTab, activeRole.initialLog]);

  const handleAction = () => {
    if (isRunning) return;
    setIsRunning(true);
    setTerminalLines(["[Sys] Opening encrypted session stream to local node...", "[Sys] Verifying Zero-Trust identity parameters..."]);
    
    const fullLog = activeRole.runLog.split("\n");
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
        setIsRunning(false);
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
        category="Academic Sovereign OS"
        title="University OneVerse AI OS"
        highlightedWord="OneVerse"
        description="A secure, sovereign, and unified enterprise AI operating platform built to connect students, academic researchers, campus operations, and administrative registries in a single zero-trust ecosystem."
        breadcrumbs={[{ label: "Platforms", href: "/platforms" }, { label: "University OneVerse" }]}
      />

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-24 space-y-24">
        {/* Editorial Introduction */}
        <MotionReveal className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-10 border-y border-white/5 items-center">
          <div className="lg:col-span-5">
            <span className="text-xs font-mono text-[#009DFF] uppercase tracking-widest font-bold">Unified Campus Mesh</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2 leading-tight">Institutional Sovereign Intelligence</h2>
          </div>
          <div className="lg:col-span-7">
            <p className="text-white/70 font-light text-sm sm:text-base leading-relaxed">
              Modern academic systems are overwhelmed by fragmented, un-secured public AI tools that compromise intellectual property and expose student records. University OneVerse unifies campus life, research compute, facility operations, and institutional records inside a hardened, sovereign computational fabric.
            </p>
          </div>
        </MotionReveal>

        {/* Interactive Workspace Console */}
        <MotionReveal className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono text-[#009DFF] uppercase tracking-widest font-semibold">Institutional Control Hub</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">University OneVerse Portal Simulator</h2>
            <p className="text-white/50 text-xs sm:text-sm font-light">
              Select an institutional domain to preview sovereign security protocols, active agent networks, and test real-time workflow simulations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto items-stretch">
            {/* Left Column Tabs */}
            <div className="lg:col-span-4 flex flex-col gap-3 justify-center">
              {ROLES.map((role) => {
                const TabIcon = role.icon;
                const isSelected = activeTab === role.id;
                return (
                  <button
                    key={role.id}
                    onClick={() => handleTabChange(role.id)}
                    className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 group ${
                      isSelected
                        ? "border-[#009DFF] bg-[#009DFF]/5 text-white"
                        : "border-white/5 bg-black/40 text-white/50 hover:bg-white/[0.02] hover:border-white/10"
                    }`}
                  >
                    <TabIcon className={`w-5 h-5 shrink-0 mt-0.5 ${isSelected ? "text-[#009DFF]" : "text-white/30 group-hover:text-white/50"}`} />
                    <div>
                      <h4 className="font-bold text-sm text-white">{role.title}</h4>
                      <p className="text-[11px] text-white/50 font-light mt-0.5 leading-tight">{role.badge}</p>
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
                  <h3 className="text-base font-bold text-white tracking-tight">{activeRole.title} Node</h3>
                </div>

                <p className="text-xs text-white/70 font-light leading-relaxed">
                  {activeRole.description}
                </p>

                {/* Sub-protocols */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  {activeRole.protocols.map((p, idx) => (
                    <div key={idx} className="p-3 rounded-lg border border-white/5 bg-white/[0.01]">
                      <h5 className="text-[11px] font-bold text-[#009DFF] tracking-wide uppercase">{p.name}</h5>
                      <p className="text-[10px] text-white/50 font-light leading-snug mt-1">{p.desc}</p>
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
                    <span className="text-[10px] font-mono uppercase text-white/40 tracking-wider">gff-node-terminal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full animate-ping ${isRunning ? "bg-amber-500" : "bg-[#009DFF]"}`} />
                    <span className="text-[10px] font-mono text-white/40">Agent: {activeRole.consoleLabel}</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-white/5 bg-black/80 min-h-[140px] flex flex-col justify-start overflow-y-auto max-h-[220px] font-mono scrollbar-thin select-text">
                  {terminalLines.map((line, idx) => renderConsoleLine(line, idx))}
                  {isRunning && (
                    <div className="flex gap-3 py-0.5 leading-relaxed">
                      <span className="text-[10px] text-white/10 select-none w-5 text-right font-mono">
                        {String(terminalLines.length + 1).padStart(2, '0')}
                      </span>
                      <span className="text-[#009DFF] font-mono text-xs animate-pulse">█</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleAction}
                  disabled={isRunning}
                  className={`w-full py-2.5 rounded-lg border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    isRunning 
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-500 cursor-not-allowed" 
                      : "bg-[#009DFF]/15 border-[#009DFF]/30 text-[#009DFF] hover:bg-[#009DFF]/25 shadow-[0_0_15px_rgba(0,157,255,0.05)] hover:shadow-[0_0_20px_rgba(0,157,255,0.15)]"
                  }`}
                >
                  {isRunning ? "Running Agent Pipeline..." : `Activate ${activeRole.consoleLabel}`}
                </button>
              </div>
            </div>
          </div>
        </MotionReveal>
        {/* Technical Architecture Bento Grid */}
        <MotionReveal className="space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-mono text-[#009DFF] uppercase tracking-widest font-semibold">Mesh Architecture</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">Platform Core Integrity</h2>
          </div>

          <BentoGrid>
            <BentoCard
              title="Federated Research Fabric"
              description="A multi-agent, semantic-graph vector mesh indexing department papers, grant guidelines, and academic records across internal storage without public model leakage."
              badge="Knowledge Mesh"
              glowColor="blue"
              icon={<Network className="w-5 h-5 text-[#009DFF]" />}
              metric={{ value: "Zero-Leak", label: "Intellectual Property Guard" }}
            />
            <BentoCard
              title="Sovereign Compute Allocator"
              description="Dynamically allocates and schedules private GPU compute container lanes for intensive machine learning and research workloads."
              badge="Sovereign Compute"
              glowColor="purple"
              icon={<Cpu className="w-5 h-5 text-purple-400" />}
              metric={{ value: "vLLM-Ready", label: "Elastic Sandboxing" }}
            />
            <BentoCard
              title="eBPF Registry Shield"
              description="Hardened, kernel-level telemetry logging scanning and auditing administrative database operations to ensure absolute student record compliance."
              badge="Registry Audit"
              glowColor="red"
              icon={<Shield className="w-5 h-5 text-[#E4000F]" />}
              metric={{ value: "SOC2-Grade", label: "Administrative Telemetry" }}
            />
          </BentoGrid>
        </MotionReveal>
        {/* Academic Integration Timeline */}
        <MotionReveal className="space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-mono text-[#E4000F] uppercase tracking-widest font-semibold">Deployment Blueprint</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">Multi-Phase Integration Timeline</h2>
            <p className="text-white/50 text-xs sm:text-sm font-light mt-2">
              Our systematic approach guarantees institutional records security and seamless departmental sandbox configurations.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4 relative">
            {/* Timeline Vertical bar */}
            <div className="absolute left-6 top-6 bottom-6 w-[1px] bg-white/5 hidden sm:block" />

            {[
              {
                step: "Phase 1: Discovery & API Audit",
                title: "Administrative Systems Analysis",
                desc: "Identify active database structures, student record compliance requirements, and institutional storage security boundaries."
              },
              {
                step: "Phase 2: Local Cluster Provisioning",
                title: "Sovereign Node Deployment",
                desc: "Install localized GFF Node clusters on secure university hardware, configuring student, faculty, and administrative compartmentalization."
              },
              {
                step: "Phase 3: Departmental Sandbox Rollout",
                title: "Knowledge Base Federation",
                desc: "Map internal data vectors and instantiate dedicated sandbox models for laboratory researchers and administrative registrars."
              },
              {
                step: "Phase 4: Full Campus Lifecycle Operations",
                title: "Multi-Agent System Orchestration",
                desc: "Launch campus-wide operational loops, connecting classroom scheduling, student helper portals, and ledger audit monitors."
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
          title="Modernize Your University Infrastructure"
          description="Establish absolute records security and empower departmental researchers. Book an engineering deep-dive with our Academic Systems leads."
          primaryLabel="Connect with Academic Architects"
          primaryHref="/contact"
        />
      </div>
    </InnerPageShell>
  );
}
