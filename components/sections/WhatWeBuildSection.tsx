"use client";

import SectionHeading from "@/components/SectionHeading";
import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";

const items = [
  {
    name: 'AI Strategy',
    href: '/capabilities/strategy',
    icon: '/what_we_build/strategy.svg',
    color: '#F74539',
    desc: 'Maturity roadmaps and capability modeling with University Platforms R&D.',
    tags: ['Advisory', 'University Platforms']
  },
  {
    name: 'AI Engineering',
    href: '/capabilities/engineering',
    icon: '/what_we_build/engineering.svg',
    color: '#E98828',
    desc: 'Production-grade LLM pipeline architectures built on top of Data Platforms.',
    tags: ['Fine-Tuning', 'Data Platforms']
  },
  {
    name: 'Agentic AI',
    href: '/capabilities/agents',
    icon: '/what_we_build/agentic-ai.svg',
    color: '#0186E4',
    desc: 'Autonomous multi-agent ecosystems integrated with Knowledge Graph indexers.',
    tags: ['Orchestration', 'Knowledge Graph']
  },
  {
    name: 'AI Governance',
    href: '/capabilities/governance',
    icon: '/what_we_build/governance.svg',
    color: '#009DFF',
    desc: 'Transparent model auditing, compliance automation, and safety guardrails.',
    tags: ['Risk Control', 'Compliance']
  },
  {
    name: 'AI Labs',
    href: '/capabilities/labs',
    icon: '/what_we_build/labs.svg',
    color: '#9D00FF',
    desc: 'Sandbox incubation for advanced emerging AI and Digital Twins simulations.',
    tags: ['R&D Sandbox', 'Digital Twins']
  },
  {
    name: 'AI Factory',
    href: '/platforms/factory',
    icon: '/ai_foundary/factory.svg',
    color: '#E4000F',
    desc: 'Industrialized model assembly lines and automated training/eval loops.',
    tags: ['CI/CD Assembly', 'Automated Eval']
  },
  {
    name: 'AI Marketplace',
    href: '/platforms/marketplace',
    icon: '/intellegent_enterprise/internet.svg',
    color: '#0186E4',
    desc: 'Registry for neural assets, secure enterprise licensing, and agent plugins.',
    tags: ['Neural Assets', 'Plugins']
  },
  {
    name: 'AI Operations',
    href: '/capabilities/operations',
    icon: '/intellegent_enterprise/robot.svg',
    color: '#E98828',
    desc: 'Telemetry, active monitoring, and orchestration under Managed Services.',
    tags: ['Telemetry', 'Managed Services']
  }
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
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-gradient-to-r from-[#009DFF]/5 to-transparent blur-[120px] pointer-events-none rounded-full" />
      <div className="max-w-[1795px] mx-auto relative z-10">
        <SectionHeading
          title={
            <h2 className="text-[28px] sm:text-[36px] leading-none font-semibold text-center uppercase text-white tracking-wide">
              WHAT WE <span className="text-[#009DFF]">BUILD</span>
            </h2>
          }
          titleClassName="text-center"
          dividerWidthClassName="w-[200px]"
        />
        <p className="mt-4 text-center text-xs sm:text-sm text-white/45 max-w-2xl mx-auto font-medium uppercase tracking-[0.2em]">
          HIGH-PERFORMANCE AI INFRASTRUCTURES, PLATFORMS, AND STRATEGIC CAPABILITIES
        </p>
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((c, i) => (
            <Link key={c.name} href={c.href} className="block group">
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="relative rounded-[24px] p-[1px] bg-gradient-to-b from-white/10 to-transparent hover:from-white/20 transition-all duration-500 h-full hover:-translate-y-2"
              >
                <div className="absolute inset-0 rounded-[24px] opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none blur-lg" style={{ backgroundColor: c.color }} />
                <div className="h-full rounded-[23px] bg-[#050505] p-8 flex flex-col justify-between min-h-[350px] relative overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: `radial-gradient(circle at 50% 20%, ${c.color}15 0%, transparent 60%)` }} />
                  <div>
                    <div className="relative w-12 h-12 mb-6 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center p-2.5 transition-all duration-500 group-hover:bg-white/[0.05] group-hover:border-white/10 group-hover:scale-105">
                      <div className="relative w-full h-full opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                        <Image src={c.icon} alt={c.name} fill className="object-contain" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold tracking-wide uppercase text-white group-hover:text-transparent group-hover:bg-clip-text transition-all duration-300" style={{ backgroundImage: `linear-gradient(90deg, #fff 30%, ${c.color} 100%)` }}>
                      {c.name}
                    </h3>
                    <p className="mt-3 text-sm text-white/50 leading-relaxed font-normal group-hover:text-white/75 transition-colors duration-300">
                      {c.desc}
                    </p>
                  </div>
                  <div>
                    <div className="flex flex-wrap gap-1.5 mt-6 relative z-10">
                      {c.tags.map(tag => (
                        <span key={tag} className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-white/[0.02] border border-white/[0.05] text-white/40 group-hover:text-white/70 group-hover:border-white/10 group-hover:bg-white/[0.04] transition-all duration-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-white/[0.04] flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-white/40 group-hover:text-white transition-colors duration-300 relative z-10">
                      <span>Explore Capability</span>
                      <span className="text-base transform group-hover:translate-x-1.5 transition-transform duration-300" style={{ color: c.color }}>→</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
