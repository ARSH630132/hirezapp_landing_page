"use client";

import { motion } from "motion/react";
import SectionHeading from "@/components/SectionHeading";
import Link from "next/link";

const steps = [
  {
    name: "Garage",
    href: "/platforms/garage",
    color: "#F74539",
    icon: "/ai_foundary/garage.svg",
    desc: "Map critical high-value business cases and design interactive rapid prototypes.",
    outcome: "Validated sandbox prototypes and clear production ROI roadmap.",
    status: "DISCOVER",
  },
  {
    name: "Foundry",
    href: "/platforms/foundry",
    color: "#E98828",
    icon: "/ai_foundary/foundry.svg",
    desc: "Architect resilient multi-agent systems with secure enterprise containerization.",
    outcome: "Hardened, SOC2-ready agent endpoints and telemetry pipelines.",
    status: "BUILD",
  },
  {
    name: "Factory",
    href: "/platforms/factory",
    color: "#0186E4",
    icon: "/ai_foundary/factory.svg",
    desc: "Deploy robust agent workloads to high-availability production clusters.",
    outcome: "Automated, elastic-scaling instances with 24/7 self-healing loops.",
    status: "PRODUCTION",
  },
  {
    name: "Operate",
    href: "/capabilities/operations",
    color: "#F74539",
    icon: "/intellegent_enterprise/robot.svg",
    desc: "Supervise system execution, govern model performance, and track token usage.",
    outcome: "Real-time cost optimization and strict SLA compliance.",
    status: "MANAGED",
  },
  {
    name: "Optimize",
    href: "/platforms/control-center",
    color: "#e23f34",
    icon: "/intellegent_enterprise/blueprint.svg",
    desc: "Refine cognitive workflows, tune weights, and improve agentic behaviors.",
    outcome: "Lowered token spend, maximized accuracy, and strategic alignment.",
    status: "GOVERNED",
  },
  {
    name: "Scale",
    href: "/platforms/scale",
    color: "#dd2531",
    icon: "/intellegent_enterprise/industry.svg",
    desc: "Propagate proven templates across departments, geos, and hybrid clouds.",
    outcome: "Global omnipresent agent fleet running at industrial throughput.",
    status: "EXPAND",
  },
];

export default function JourneySection() {
  return (
    <motion.section
      id="journey"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="w-full bg-[#020202] px-6 lg:px-16 lg:py-14 py-12 overflow-hidden relative"
    >
      <SectionHeading
        title={
          <h2 className="text-[28px] sm:text-[36px] leading-none font-semibold text-center uppercase text-white tracking-wide">
            ENTERPRISE <span className="text-[#E98828]">TRANSFORMATION</span> JOURNEY
          </h2>
        }
        titleClassName="text-center"
        dividerWidthClassName="w-[300px]"
      />

      <div className="mt-12 max-w-[1795px] mx-auto relative">
        {/* Animated Connecting Line - Desktop */}
        <div className="absolute top-1/2 left-[5%] right-[5%] h-[2px] bg-white/10 -translate-y-1/2 hidden lg:block shadow-[0_0_24px_rgba(255,255,255,0.12)]">
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="h-full bg-gradient-to-r from-[#F74539] via-[#0186E4] to-[#E4000F] origin-left"
          />
        </div>

        {/* Animated Connecting Line - Mobile */}
        <div 
          className="absolute top-4 bottom-4 w-[2px] bg-white/10 lg:hidden"
          style={{ left: "18px" }}
        >
          <motion.div 
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="w-full h-full bg-gradient-to-b from-[#F74539] via-[#0186E4] to-[#E4000F] origin-top"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 relative z-10 pl-10 lg:pl-0">
          {steps.map((step, i) => (
            <Link key={step.name} href={step.href} className="block group relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-[22px]">
              
              {/* Node Dot (Visible on Mobile to connect to line) */}
              <div 
                className="lg:hidden absolute top-10 w-4 h-4 rounded-full bg-[#050505] border-[3px] z-20 group-hover:scale-125 transition-transform duration-300" 
                style={{ borderColor: step.color, left: "-22px" }}
              >
                <div className="absolute inset-0 rounded-full animate-ping opacity-40" style={{ backgroundColor: step.color }} />
              </div>

              {/* Link Dot (Desktop) */}
              {i < steps.length - 1 && (
                <div
                  className="hidden lg:block absolute top-1/2 right-[-19px] z-30 h-4 w-4 -translate-y-1/2 rounded-full border-[3px] bg-[#050505] shadow-[0_0_18px_currentColor] transition-transform duration-300 group-hover:scale-125"
                  style={{ borderColor: step.color, color: step.color }}
                >
                  <div className="absolute inset-0 rounded-full animate-ping opacity-45" style={{ backgroundColor: step.color }} />
                </div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
transition={{
  duration: 0.15,
  delay: i * 0.1,
  type: "spring",
  stiffness: 600,
  damping: 30,
}}
                whileHover={{ y: -8, scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                className="relative rounded-[22px] p-[1px] bg-gradient-to-b from-white/10 to-transparent group-hover:from-[var(--step-color)] group-hover:to-[var(--step-color)] transition-transform duration-150 h-full cursor-pointer shadow-none group-hover:shadow-[inset_0_0_38px_var(--step-shadow)]"
style={{
  "--step-color": `${step.color}80`,
  "--step-shadow": `${step.color}24`,
} as React.CSSProperties}
              >
                <div className="relative h-full rounded-[21px] bg-[#050505] p-5 lg:p-6 flex flex-col justify-between overflow-hidden shadow-2xl before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-200 group-hover:before:opacity-100"
style={{
  background: `
    radial-gradient(
      circle at 50% 0%,
      ${step.color}20 0%,
      transparent 45%
    ),
    #050505
  `,
}}><div
  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none animate-pulse"
  style={{
    background: `
      radial-gradient(circle at 50% 20%, ${step.color}22 0%, transparent 35%),
      radial-gradient(circle at 20% 80%, ${step.color}10 0%, transparent 30%),
      radial-gradient(circle at 80% 80%, ${step.color}10 0%, transparent 30%)
    `,
    filter: "blur(28px)",
  }}
/>
                  <div
                    className="absolute inset-x-8 top-0 h-px opacity-0 blur-sm transition-opacity duration-500 group-hover:opacity-100"
                    style={{ backgroundColor: step.color }}
                  />
                  
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[34px] font-extrabold text-white/10 group-hover:text-white/30 transition-colors tracking-tight">
                      0{i + 1}
                    </span>
                    <span 
                      className="text-[10px] font-mono tracking-widest px-2.5 py-1 rounded-full border border-white/5 bg-white/[0.02]"
                      style={{ color: step.color }}
                    >
                      {step.status}
                    </span>
                  </div>

                  {/* Node Dot (Visible on Desktop to connect to line) */}
                  {/* <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#050505] border-[3px] z-20 group-hover:scale-150 transition-transform duration-300" style={{ borderColor: step.color }}>
                    <div className="absolute inset-0 rounded-full animate-ping opacity-50" style={{ backgroundColor: step.color }} />
                  </div> */}

                  {/* Graphic/Icon */}
<div className="relative z-10 flex justify-center py-3 opacity-80 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">

                    <img src={step.icon} alt={step.name} className="w-[58px] h-[58px] object-contain drop-shadow-md" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 mt-auto pt-4 text-center">
                    <h3 className="text-[18px] font-bold tracking-widest uppercase transition-colors" style={{ color: step.color }}>
                      {step.name}
                    </h3>
                    <p className="mt-2 text-[13.5px] leading-[1.5] text-[#D1D1D1] min-h-[56px] lg:h-[82px] flex items-center justify-center">
                      {step.desc}
                    </p>

                    {/* Outcome row */}
                    <div className="mt-3 pt-3 border-t border-white/5 flex flex-col items-center gap-1">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-white/40">
                        Outcome
                      </span>
                      <p className="text-[12px] font-medium text-white/80 group-hover:text-white transition-colors leading-[1.45] min-h-[32px] flex items-center justify-center">
                        {step.outcome}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
