"use client";

import SectionHeading from "@/components/SectionHeading";
import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";

const items = [
  { name: 'AI Strategy', href: '/capabilities/strategy', icon: '/what_we_build/strategy.svg', color: '#F74539' },
  { name: 'AI Engineering', href: '/capabilities/engineering', icon: '/what_we_build/engineering.svg', color: '#E98828' },
  { name: 'Agentic AI', href: '/capabilities/agents', icon: '/what_we_build/agentic-ai.svg', color: '#0186E4' },
  { name: 'AI Governance', href: '/capabilities/governance', icon: '/what_we_build/governance.svg', color: '#009DFF' },
  { name: 'AI Labs', href: '/capabilities/labs', icon: '/what_we_build/labs.svg', color: '#9d00ff' },
  { name: 'AI Factory', href: '/platforms/factory', icon: '/ai_foundary/factory.svg', color: '#E4000F' },
  { name: 'AI Marketplace', href: '/platforms/marketplace', icon: '/intellegent_enterprise/internet.svg', color: '#0186E4' },
  { name: 'AI Operations', href: '/capabilities/operations', icon: '/intellegent_enterprise/robot.svg', color: '#E98828' }
];

export default function WhatWeBuildSection() {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="w-full bg-black px-6 lg:px-16 lg:py-24 py-16 relative overflow-hidden"
    >
      <SectionHeading
        title={
          <h2 className="text-[28px] sm:text-[36px] leading-none font-semibold text-center uppercase text-white tracking-wide">
            WHAT WE <span className="text-[#009DFF]">BUILD</span>
          </h2>
        }
        titleClassName="text-center"
        dividerWidthClassName="w-[200px]"
      />
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1795px] mx-auto relative z-10">
        {items.map((c, i) => (
          <Link key={c.name} href={c.href} className="block group">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative rounded-[20px] p-[1px] bg-gradient-to-b from-white/10 to-transparent hover:from-white/30 transition-all duration-300 h-full hover:-translate-y-2"
            >
              <div className="h-full rounded-[19px] bg-[#050505] p-8 flex flex-col items-center justify-between min-h-[220px] text-center overflow-hidden shadow-2xl">
                
                <div className="relative z-10 w-16 h-16 mb-6 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                  <Image src={c.icon} alt={c.name} fill className="object-contain" />
                </div>
                
                <div className="relative z-10">
                  <h3 className="text-xl font-bold tracking-wide uppercase text-white group-hover:text-transparent group-hover:bg-clip-text transition-all" style={{ backgroundImage: `linear-gradient(90deg, #fff 0%, ${c.color} 100%)` }}>
                    {c.name}
                  </h3>
                  <div className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0" style={{ color: c.color }}>
                    Explore <span className="text-[16px]">→</span>
                  </div>
                </div>

              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.section>
  )
}
