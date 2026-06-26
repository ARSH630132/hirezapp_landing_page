"use client";

import { motion } from "motion/react";
import SectionHeading from "@/components/SectionHeading";
import Link from "next/link";

export default function ClientSuccessSection() {
  const items = [
    { 
      name: 'Global Banking Transformation', 
      color: '#0186E4', 
      tags: ['Agentic AI', 'Risk Ops'],
      metric: '35% Cost Reduction',
      desc: 'Scaled intelligent agents across compliance and trading workflows globally.' 
    },
    { 
      name: 'Healthcare Knowledge Operations', 
      color: '#E98828', 
      tags: ['Knowledge Graph', 'Clinical'],
      metric: '3x Faster Decisioning',
      desc: 'Unified fragmented patient records into a real-time intelligence layer.'
    },
    { 
      name: 'Manufacturing AI Factory', 
      color: '#E4000F', 
      tags: ['AI Factory', 'Supply Chain'],
      metric: 'Zero Downtime',
      desc: 'Deployed predictive maintenance agents directly onto the factory floor.'
    },
    { 
      name: 'Retail Agent Operations', 
      color: '#009DFF', 
      tags: ['Commerce', 'Personalization'],
      metric: '18% Revenue Lift',
      desc: 'Orchestrated customer journeys through autonomous service copilots.'
    }
  ];

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className="w-full bg-[#020202] px-6 lg:px-16 lg:py-32 py-20 relative overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 100% 50%, #E9882805 0%, transparent 40%)" }} />
      
      <div className="max-w-[1795px] mx-auto relative z-10">
        <SectionHeading
          title={
            <h2 className="text-[32px] sm:text-[44px] leading-none font-bold text-center uppercase text-white tracking-widest">
              CLIENT <span className="text-[#E98828]">SUCCESS</span>
            </h2>
          }
          titleClassName="text-center"
          dividerWidthClassName="w-[300px]"
        />
        
        <p className="mt-6 text-center text-[16px] lg:text-[18px] text-[#A0A0A0] max-w-3xl mx-auto">
          We don't just build POCs. We forge intelligent enterprises. Explore the architecture and outcomes behind our large-scale AI transformations.
        </p>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((c, i) => (
            <Link key={c.name} href="/resources/case-studies" className="group block h-full">
              <motion.div 
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="relative rounded-[20px] p-[1px] bg-gradient-to-b from-white/10 to-transparent group-hover:from-[#E4000F]/40 group-hover:to-[#009DFF]/40 transition-all duration-500 h-full hover:-translate-y-3"
              >
                <div className="relative h-full rounded-[19px] bg-[#050505] p-8 flex flex-col justify-between min-h-[340px] overflow-hidden shadow-xl">
                  
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none" style={{ background: `radial-gradient(circle at bottom right, ${c.color} 0%, transparent 70%)` }} />
                  
                  <div className="relative z-10 flex flex-wrap gap-2 mb-6">
                    {c.tags.map(t => (
                      <span key={t} className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-white/5 text-white/80 border border-white/10">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="relative z-10 mb-6">
                    <h3 className="text-[22px] font-bold text-white leading-tight group-hover:text-transparent group-hover:bg-clip-text transition-all" style={{ backgroundImage: `linear-gradient(90deg, #fff 0%, ${c.color} 150%)` }}>
                      {c.name}
                    </h3>
                    <p className="text-[14px] text-[#A0A0A0] mt-3 leading-relaxed">
                      {c.desc}
                    </p>
                  </div>

                  <div className="relative z-10 mt-auto border-t border-white/10 pt-4 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Key Outcome</span>
                      <span className="text-[16px] font-bold text-white tracking-wide">{c.metric}</span>
                    </div>
                    <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white/50 transition-colors" style={{ color: c.color }}>
                      →
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
