"use client";

import Link from "next/link";
import { motion } from "motion/react";
import SectionHeading from "@/components/SectionHeading";
import { dashboardCardLinks } from "@/lib/cta-links";

// Visual component for Active Clients
const RadarVisual = () => (
  <div className="relative w-full h-32 bg-black/40 rounded-xl overflow-hidden border border-white/5 flex items-center justify-center">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,157,255,0.05)_0%,transparent_70%)]" />
    <svg className="w-24 h-24 text-blue-500/30" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="10" className="stroke-current fill-none stroke-[1]" />
      <circle cx="50" cy="50" r="25" className="stroke-current fill-none stroke-[1] stroke-dashed" strokeDasharray="3 3" />
      <circle cx="50" cy="50" r="40" className="stroke-current fill-none stroke-[1]" />
      
      <motion.line
        x1="50" y1="50" x2="50" y2="10"
        className="stroke-blue-500 stroke-[1.5] origin-[50px_50px]"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
      />
      
      <circle cx="50" cy="50" r="4" className="fill-blue-500 animate-pulse" />
      
      <circle cx="28" cy="35" r="2" className="fill-blue-400/80 animate-ping" style={{ animationDuration: "3s" }} />
      <circle cx="72" cy="65" r="2" className="fill-blue-400/80 animate-ping" style={{ animationDuration: "4s" }} />
    </svg>
  </div>
);

// Visual component for Agents Running
const NodesVisual = () => (
  <div className="relative w-full h-32 bg-black/40 rounded-xl overflow-hidden border border-white/5 flex items-center justify-center p-4">
    <div className="grid grid-cols-4 gap-4 w-fit">
      {[...Array(12)].map((_, i) => {
        const delays = ["0s", "0.5s", "1s", "1.5s", "0.2s", "0.8s", "1.2s", "0.4s", "0.6s", "1.1s", "1.4s", "0.7s"];
        const color = i % 3 === 0 ? "bg-orange-500" : "bg-white/10";
        const border = i % 3 === 0 ? "border-orange-500/30" : "border-white/5";
        return (
          <div key={i} className="flex flex-col items-center justify-center relative">
            <div 
              className={`w-3 h-3 rounded-full ${color} border ${border} transition-all duration-1000 relative`}
            >
              {i % 3 === 0 && (
                <span className="absolute -inset-1 rounded-full bg-orange-500/30 animate-ping" style={{ animationDelay: delays[i], animationDuration: "2s" }} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

// Visual component for AI Projects
const ProjectsVisual = () => (
  <div className="relative w-full h-32 bg-black/40 rounded-xl overflow-hidden border border-white/5 flex items-center justify-center">
    <svg className="w-full h-full p-4" viewBox="0 0 160 100">
      <line x1="20" y1="30" x2="60" y2="20" className="stroke-white/10 stroke-[0.5]" />
      <line x1="20" y1="30" x2="60" y2="50" className="stroke-white/10 stroke-[0.5]" />
      <line x1="20" y1="70" x2="60" y2="50" className="stroke-white/10 stroke-[0.5]" />
      <line x1="20" y1="70" x2="60" y2="80" className="stroke-white/10 stroke-[0.5]" />
      
      <line x1="60" y1="20" x2="100" y2="30" className="stroke-white/10 stroke-[0.5]" />
      <line x1="60" y1="50" x2="100" y2="30" className="stroke-white/10 stroke-[0.5]" />
      <line x1="60" y1="50" x2="100" y2="70" className="stroke-white/10 stroke-[0.5]" />
      <line x1="60" y1="80" x2="100" y2="70" className="stroke-white/10 stroke-[0.5]" />
      
      <line x1="100" y1="30" x2="140" y2="50" className="stroke-white/10 stroke-[0.5]" />
      <line x1="100" y1="70" x2="140" y2="50" className="stroke-white/10 stroke-[0.5]" />

      <circle cx="20" cy="30" r="2.5" className="fill-red-500/80" />
      <circle cx="20" cy="70" r="2.5" className="fill-red-500/80" />
      
      <motion.circle cx="60" cy="20" r="3" className="fill-red-500" animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 2 }} />
      <circle cx="60" cy="50" r="3" className="fill-red-500/40" />
      <motion.circle cx="60" cy="80" r="3" className="fill-red-500" animate={{ scale: [1.3, 1, 1.3] }} transition={{ repeat: Infinity, duration: 2.5 }} />
      
      <circle cx="100" cy="30" r="3" className="fill-red-500/40" />
      <motion.circle cx="100" cy="70" r="3" className="fill-red-500" animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.8 }} />
      
      <circle cx="140" cy="50" r="3.5" className="fill-red-500" />
      
      <motion.path
        d="M 20,30 L 60,20 L 100,30 L 140,50"
        fill="none"
        stroke="rgba(247,69,57,0.3)"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: [0, 1, 1] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      />
    </svg>
  </div>
);

// Visual component for Countries
const WorldVisual = () => (
  <div className="relative w-full h-32 bg-black/40 rounded-xl overflow-hidden border border-white/5 flex items-center justify-center">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,194,0.03)_0%,transparent_75%)]" />
    <svg className="w-24 h-24 text-[#00FFC2]/20" viewBox="0 0 100 100">
      <ellipse cx="50" cy="50" rx="40" ry="40" className="stroke-current fill-none stroke-[0.75]" />
      <ellipse cx="50" cy="50" rx="40" ry="16" className="stroke-current fill-none stroke-[0.75]" />
      <ellipse cx="50" cy="50" rx="40" ry="4" className="stroke-current fill-none stroke-[0.75]" />
      <line x1="50" y1="10" x2="50" y2="90" className="stroke-current stroke-[0.75]" />
      <line x1="10" y1="50" x2="90" y2="50" className="stroke-current stroke-[0.75]" />
      
      <motion.circle cx="35" cy="40" r="2.5" className="fill-[#00FFC2]" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 2 }} />
      <motion.circle cx="65" cy="60" r="2.5" className="fill-[#00FFC2]" animate={{ opacity: [1, 0.2, 1] }} transition={{ repeat: Infinity, duration: 2.2 }} />
      <circle cx="50" cy="30" r="2" className="fill-[#00FFC2]" />
      
      <motion.path
        d="M 35,40 Q 50,20 65,60"
        fill="none"
        stroke="#00FFC2"
        strokeWidth="1"
        strokeDasharray="2 2"
        animate={{ strokeDashoffset: [-10, 10] }}
        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
      />
    </svg>
  </div>
);

// Visual component for Industries
const IndustriesVisual = () => (
  <div className="relative w-full h-32 bg-black/40 rounded-xl overflow-hidden border border-white/5 flex flex-col justify-center gap-3 px-6">
    {[
      { label: "Vertical Core", width: 80, delay: 0 },
      { label: "Cross-Industry", width: 65, delay: 0.2 },
      { label: "Sovereign Framework", width: 50, delay: 0.4 },
    ].map((bar, idx) => (
      <div key={idx} className="space-y-1">
        <div className="flex justify-between text-[9px] text-white/30 uppercase tracking-widest font-mono">
          <span>{bar.label}</span>
        </div>
        <div className="w-full h-1.5 bg-white/[0.03] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#8E55FF] to-[#b38cff] rounded-full"
            initial={{ width: "0%" }}
            whileInView={{ width: `${bar.width}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: bar.delay }}
          />
        </div>
      </div>
    ))}
  </div>
);

// Visual component for Agent Health
const PulseVisual = () => (
  <div className="relative w-full h-32 bg-black/40 rounded-xl overflow-hidden border border-white/5 flex items-center justify-center">
    <svg className="w-full h-full" viewBox="0 0 200 100">
      <line x1="0" y1="50" x2="200" y2="50" className="stroke-white/[0.03] stroke-[1]" />
      <line x1="0" y1="25" x2="200" y2="25" className="stroke-white/[0.015] stroke-[1]" />
      <line x1="0" y1="75" x2="200" y2="75" className="stroke-white/[0.015] stroke-[1]" />

      <motion.path
        d="M 0,50 L 30,50 L 40,50 L 48,20 L 55,80 L 62,50 L 70,50 L 100,50 L 110,50 L 118,15 L 125,85 L 132,50 L 140,50 L 200,50"
        fill="none"
        stroke="#10B981"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ strokeDasharray: "400", strokeDashoffset: "400" }}
        animate={{ strokeDashoffset: 0 }}
        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
      />
      <circle cx="125" cy="85" r="2" className="fill-emerald-400 animate-ping" />
    </svg>
  </div>
);

// Visual component for Delivery
const PipelineVisual = () => (
  <div className="relative w-full h-32 bg-black/40 rounded-xl overflow-hidden border border-white/5 flex items-center justify-center px-4">
    <div className="flex items-center justify-between w-full relative">
      <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-white/5 -translate-y-1/2 z-0" />
      <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#06B6D4]/30 to-transparent -translate-y-1/2 z-0" />
      
      {[
        { step: "INGEST" },
        { step: "EVAL" },
        { step: "DEPLOY" }
      ].map((item, idx) => (
        <div key={idx} className="flex flex-col items-center gap-1.5 z-10 relative">
          <div className="w-10 h-10 rounded-lg bg-[#050505] border border-white/10 flex items-center justify-center">
            <span className="text-[10px] font-mono font-bold text-[#06B6D4]">{item.step[0]}</span>
          </div>
          <span className="text-[9px] font-mono text-white/30 tracking-wider">{item.step}</span>
        </div>
      ))}
      
      <motion.div
        className="absolute w-2 h-2 rounded-full bg-[#06B6D4] shadow-[0_0_8px_#06B6D4] z-20"
        style={{ top: "calc(50% - 13px)" }}
        animate={{
          left: ["0%", "45%", "90%", "0%"]
        }}
        transition={{
          repeat: Infinity,
          duration: 4,
          ease: "easeInOut"
        }}
      />
    </div>
  </div>
);

// Visual component for Spend
const DonutVisual = () => (
  <div className="relative w-full h-32 bg-black/40 rounded-xl overflow-hidden border border-white/5 flex items-center justify-center">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.03)_0%,transparent_75%)]" />
    <svg className="w-24 h-24 text-amber-500/20" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="35" className="stroke-current fill-none stroke-[2]" />
      <motion.circle
        cx="50"
        cy="50"
        r="35"
        className="stroke-amber-500 fill-none stroke-[3]"
        strokeDasharray="220"
        strokeLinecap="round"
        initial={{ strokeDashoffset: "220" }}
        animate={{ strokeDashoffset: "80" }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
      <circle cx="50" cy="50" r="22" className="stroke-white/5 fill-none stroke-[1]" strokeDasharray="3 3" />
      <circle cx="50" cy="50" r="4" className="fill-amber-500/80" />
      <text x="50" y="54" className="text-[7px] font-mono fill-white/40 font-semibold" textAnchor="middle">LIMIT</text>
    </svg>
  </div>
);

// Visual component for Adoption
const CurveVisual = () => (
  <div className="relative w-full h-32 bg-black/40 rounded-xl overflow-hidden border border-white/5 flex items-center justify-center">
    <svg className="w-full h-full" viewBox="0 0 200 100">
      <path d="M 20,10 L 20,90 M 60,10 L 60,90 M 100,10 L 100,90 M 140,10 L 140,90 M 180,10 L 180,90" className="stroke-white/[0.02] stroke-[0.5]" />
      <path d="M 10,20 L 190,20 M 10,50 L 190,50 M 10,80 L 190,80" className="stroke-white/[0.02] stroke-[0.5]" />

      <motion.path
        d="M 10,85 Q 70,80 120,45 T 190,15"
        fill="none"
        stroke="#EC4899"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      <motion.circle
        cx="190"
        cy="15"
        r="3"
        className="fill-pink-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 2 }}
      />
    </svg>
  </div>
);

// Visual component for Governance
const ShieldVisual = () => (
  <div className="relative w-full h-32 bg-black/40 rounded-xl overflow-hidden border border-white/5 flex items-center justify-center">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03)_0%,transparent_75%)]" />
    <svg className="w-20 h-20 text-blue-500/20" viewBox="0 0 100 100">
      <path
        d="M 50,15 L 80,25 L 80,55 C 80,75 50,85 50,85 C 50,85 20,75 20,55 L 20,25 Z"
        className="stroke-blue-500 fill-none stroke-[1.5]"
      />
      <path
        d="M 50,22 L 73,29 L 73,53 C 73,69 50,77 50,77 C 50,77 27,69 27,53 L 27,29 Z"
        className="stroke-blue-400/30 fill-none stroke-[1] stroke-dashed"
        strokeDasharray="2 2"
      />
      <circle cx="50" cy="50" r="5" className="fill-blue-500" />
      <motion.circle
        cx="50"
        cy="50"
        r="9"
        className="stroke-blue-500 fill-none stroke-[1]"
        animate={{ scale: [1, 1.4, 1], opacity: [1, 0, 1] }}
        transition={{ repeat: Infinity, duration: 2.5 }}
      />
    </svg>
  </div>
);

export default function LiveDashboardSection() {
  const dashboardItems = [
    {
      id: "active-clients",
      label: "Active Clients",
      status: "Connected in Control Center",
      color: "#009DFF",
      desc: "Enterprise client tunnels securely connected to GFF central operations.",
      iconType: "radar",
    },
    {
      id: "agents-running",
      label: "Agents Running",
      status: "Monitoring-ready",
      color: "#E98828",
      desc: "Autonomous multi-agent systems executing live production workflows.",
      iconType: "nodes",
    },
    {
      id: "ai-projects",
      label: "AI Projects",
      status: "500+ AI Use Cases",
      color: "#F74539",
      desc: "Validated business-grade AI blueprints deployed across functional areas.",
      iconType: "projects",
    },
    {
      id: "countries",
      label: "Countries",
      status: "Connected in Control Center",
      color: "#00FFC2",
      desc: "Multi-region global coverage adhering to localized sovereign AI regulations.",
      iconType: "world",
    },
    {
      id: "industries",
      label: "Industries",
      status: "20+ Industries",
      color: "#8E55FF",
      desc: "Tailored neural networks and vertical-specific models running in parallel.",
      iconType: "industries",
    }
    // {
    //   id: "agent-health",
    //   label: "Agent Health",
    //   status: "Monitoring-ready",
    //   color: "#10B981",
    //   desc: "System telemetry, token limits, latency controls, and model health status.",
    //   iconType: "pulse",
    // },
    // {
    //   id: "delivery",
    //   label: "Delivery",
    //   status: "Frontend preview",
    //   color: "#06B6D4",
    //   desc: "Model evaluation pipelines and automated assembly loops operational.",
    //   iconType: "pipeline",
    // },
    // {
    //   id: "spend",
    //   label: "Spend",
    //   status: "Frontend preview",
    //   color: "#F59E0B",
    //   desc: "Resource token boundaries, compute budgets, and operational cost management.",
    //   iconType: "donut",
    // },
    // {
    //   id: "adoption",
    //   label: "Adoption",
    //   status: "Frontend preview",
    //   color: "#EC4899",
    //   desc: "Enterprise uptake metrics and multi-department usage telemetry.",
    //   iconType: "curve",
    // },
    // {
    //   id: "governance",
    //   label: "Governance",
    //   status: "Governance-ready",
    //   color: "#3B82F6",
    //   desc: "Real-time compliance guardrails, transparent model auditing, and safety layers.",
    //   iconType: "shield",
    // }
  ];

  const renderVisual = (iconType: string) => {
    switch (iconType) {
      case "radar":
        return <RadarVisual />;
      case "nodes":
        return <NodesVisual />;
      case "projects":
        return <ProjectsVisual />;
      case "world":
        return <WorldVisual />;
      case "industries":
        return <IndustriesVisual />;
      case "pulse":
        return <PulseVisual />;
      case "pipeline":
        return <PipelineVisual />;
      case "donut":
        return <DonutVisual />;
      case "curve":
        return <CurveVisual />;
      case "shield":
        return <ShieldVisual />;
      default:
        return null;
    }
  };

  return (
    <motion.section 
      id="live-dashboard"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className="w-full bg-[#010101] px-6 lg:px-16 lg:py-32 py-20 relative overflow-hidden"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="max-w-[1795px] mx-auto relative z-10">
        <SectionHeading
          title={
            <h2 className="text-[32px] sm:text-[44px] leading-none font-bold text-center uppercase text-white tracking-widest">
              LIVE <span className="text-[#009DFF]">DASHBOARD</span>
            </h2>
          }
          titleClassName="text-center"
          dividerWidthClassName="w-[300px]"
        />
        
        <p className="mt-6 text-center text-[16px] lg:text-[18px] text-[#A0A0A0] max-w-3xl mx-auto font-light leading-relaxed">
          Monitor your enterprise AI portfolio in real-time. Our central control center tracks agent health, adoption curves, and operational spend continuously across all departments.
        </p>

        {/* Console Header Status Bar */}
        <div className="mt-16 max-w-5xl mx-auto bg-[#050505] border border-white/5 rounded-xl px-6 py-4 flex flex-wrap justify-between items-center gap-4 text-xs font-mono tracking-wider text-white/40">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-white/70 uppercase">SYSTEMS HEALTH:</span>
            <span className="text-emerald-400 font-bold">ALL PLATFORMS OPERATIONAL</span>
          </div>
          <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-white/70 uppercase">TELEMETRY SECURE:</span>
            <span className="text-blue-400 font-bold">ACTIVE</span>
          </div>
          <div className="h-4 w-[1px] bg-white/10 hidden md:block" />
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-white/70 uppercase">CONSOLE:</span>
            <span className="text-blue-400 font-bold">CONTROL CENTER PREVIEW</span>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {dashboardItems.map((item, i) => (
            <motion.div 
              key={item.id} 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="h-full"
            >
              <Link
                href={dashboardCardLinks[item.id] ?? "/platforms/control-center"}
                className="relative group rounded-[20px] bg-[#050505] border border-white/5 hover:border-white/15 hover:bg-[#070707] transition-all duration-500 overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.4)] flex h-full flex-col justify-between"
              >
                <div className="absolute top-0 left-0 right-0 h-[1.5px] opacity-40 group-hover:opacity-100 transition-opacity duration-500" style={{ backgroundColor: item.color }} />
                
                <div className="p-6 flex flex-col gap-5 flex-grow">
                  <div className="group-hover:scale-[1.02] transition-transform duration-500">
                    {renderVisual(item.iconType)}
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-[15px] font-bold uppercase tracking-wider text-white/90 font-mono">
                        {item.label}
                      </h3>
                    </div>

                    <div className="inline-flex w-fit items-center gap-1.5 px-2.5 py-0.5 rounded-md border text-[10px] font-mono font-semibold" style={{ borderColor: `${item.color}30`, backgroundColor: `${item.color}08`, color: item.color }}>
                      <span className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: item.color }} />
                      {item.status}
                    </div>
                  </div>

                  <p className="text-[12px] text-[#808080] leading-relaxed font-normal group-hover:text-white/70 transition-colors duration-300">
                    {item.desc}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
