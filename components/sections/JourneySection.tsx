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
    desc: "Discover AI opportunities, workshops, labs, and experiments.",
    status: "DISCOVER",
  },
  {
    name: "Foundry",
    href: "/platforms/foundry",
    color: "#E98828",
    icon: "/ai_foundary/foundry.svg",
    desc: "Build agents, runtime, data fabric, and AI engineering systems.",
    status: "BUILD",
  },
  {
    name: "Factory",
    href: "/platforms/factory",
    color: "#0186E4",
    icon: "/ai_foundary/factory.svg",
    desc: "Scale AI into production with monitoring, governance, and rollout.",
    status: "PRODUCTION",
  },
  {
    name: "Operate",
    href: "/capabilities/operations",
    color: "#009DFF",
    icon: "/intellegent_enterprise/robot.svg",
    desc: "Manage adoption, delivery, spend, agent health, and outcomes.",
    status: "MANAGED",
  },
  {
    name: "Optimize",
    href: "/capabilities/governance",
    color: "#9d00ff",
    icon: "/intellegent_enterprise/blueprint.svg",
    desc: "Improve performance, governance, ROI, and business alignment.",
    status: "GOVERNED",
  },
  {
    name: "Scale",
    href: "/platforms/factory",
    color: "#E4000F",
    icon: "/intellegent_enterprise/industry.svg",
    desc: "Expand across industries, functions, regions, and platforms.",
    status: "EXPAND",
  },
];

export default function JourneySection() {
  return (
    <motion.section
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
        {/* Animated Connecting Line */}
        <div className="absolute top-1/2 left-[5%] right-[5%] h-[2px] bg-white/10 -translate-y-1/2 hidden lg:block">
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="h-full bg-gradient-to-r from-[#F74539] via-[#0186E4] to-[#E4000F] origin-left"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 relative z-10">
          {steps.map((step, i) => (
            <Link key={step.name} href={step.href} className="block group">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative rounded-[24px] p-[1px] bg-gradient-to-b from-white/10 to-transparent hover:from-white/30 transition-all duration-500 h-full cursor-pointer hover:-translate-y-3"
              >
                <div className="relative h-full rounded-[23px] bg-[#050505] p-6 lg:p-8 flex flex-col justify-between overflow-hidden shadow-2xl">
                  
                  <div className="flex justify-start items-start mb-4">
                    <span className="text-[40px] font-extrabold text-white/10 group-hover:text-white/30 transition-colors tracking-tight">
                      0{i + 1}
                    </span>
                  </div>

                  {/* Node Dot (Visible on Desktop to connect to line) */}
                  <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#050505] border-[3px] z-20 group-hover:scale-150 transition-transform duration-300" style={{ borderColor: step.color }}>
                    <div className="absolute inset-0 rounded-full animate-ping opacity-50" style={{ backgroundColor: step.color }} />
                  </div>

                  {/* Graphic/Icon */}
                  <div className="relative z-10 flex justify-center py-4 lg:py-6 opacity-80 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300">
                    <img src={step.icon} alt={step.name} className="w-[70px] h-[70px] object-contain drop-shadow-md" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 mt-auto pt-4 text-center">
                    <h3 className="text-[20px] font-bold tracking-widest text-white uppercase" style={{ color: step.color }}>
                      {step.name}
                    </h3>
                    <p className="mt-3 text-[15px] leading-[1.6] text-[#D1D1D1]">
                      {step.desc}
                    </p>
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