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
      className="w-full bg-[#020202] px-6 lg:px-16 lg:py-24 py-16 overflow-hidden relative"
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

      <div className="mt-20 max-w-[1795px] mx-auto relative">
        {/* Animated Connecting Line - Desktop */}
        <div className="absolute top-1/2 left-[5%] right-[5%] h-[2px] bg-white/10 -translate-y-1/2 hidden lg:block">
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
            <Link key={step.name} href={step.href} className="block group relative">
              
              {/* Node Dot (Visible on Mobile to connect to line) */}
              <div 
                className="lg:hidden absolute top-10 w-4 h-4 rounded-full bg-[#050505] border-[3px] z-20 group-hover:scale-125 transition-transform duration-300" 
                style={{ borderColor: step.color, left: "-22px" }}
              >
                <div className="absolute inset-0 rounded-full animate-ping opacity-40" style={{ backgroundColor: step.color }} />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative rounded-[24px] p-[1px] bg-gradient-to-b from-white/10 to-transparent group-hover:from-[#E4000F]/40 group-hover:to-[#009DFF]/40 transition-all duration-500 h-full cursor-pointer group-hover:-translate-y-3"
              >
                <div className="relative h-full rounded-[23px] bg-[#050505] p-6 lg:p-8 flex flex-col justify-between overflow-hidden shadow-2xl">
                  
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[40px] font-extrabold text-white/10 group-hover:text-white/30 transition-colors tracking-tight">
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
<div className="relative z-10 flex justify-center py-4 lg:py-6 opacity-80 group-hover:opacity-100 transition-opacity duration-300">

                    <img src={step.icon} alt={step.name} className="w-[70px] h-[70px] object-contain drop-shadow-md" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 mt-auto pt-6 text-center">
                    <h3 className="text-[20px] font-bold tracking-widest uppercase transition-colors" style={{ color: step.color }}>
                      {step.name}
                    </h3>
                    <p className="mt-3 text-[14.5px] leading-[1.6] text-[#D1D1D1] min-h-[64px] lg:h-[104px] flex items-center justify-center">
                      {step.desc}
                    </p>

                    {/* Outcome row */}
                    <div className="mt-4 pt-4 border-t border-white/5 flex flex-col items-center gap-1.5">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-white/40">
                        Outcome
                      </span>
                      <p className="text-[12.5px] font-medium text-white/80 group-hover:text-white transition-colors leading-[1.5] min-h-[38px] flex items-center justify-center">
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
