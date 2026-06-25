"use client";

import { motion } from "motion/react";
import SectionHeading from "@/components/SectionHeading";

export default function LiveDashboardSection() {
  const metrics = [
    { label: 'Global Active Clients', subLabel: 'Cross-Industry', value: 'Live', color: '#0186E4', desc: 'Securely monitored transformations' },
    { label: 'Autonomous Agents', subLabel: 'Running in Production', value: 'Live', color: '#E98828', desc: 'Agentic workflows actively managed' },
    { label: 'AI Projects', subLabel: 'Foundry & Factory', value: 'Live', color: '#F74539', desc: 'Blueprints actively deployed' }
  ];

  return (
    <motion.section 
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
              MANAGED AI <span className="text-[#009DFF]">OPERATIONS</span>
            </h2>
          }
          titleClassName="text-center"
          dividerWidthClassName="w-[300px]"
        />
        
        <p className="mt-6 text-center text-[16px] lg:text-[18px] text-[#A0A0A0] max-w-3xl mx-auto">
          Monitor your enterprise AI portfolio in real-time. Our central command center tracks agent health, adoption curves, and operational spend continuously.
        </p>

        <div className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {metrics.map((m, i) => (
            <motion.div 
              key={m.label} 
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative group rounded-[24px] bg-[#050505] border border-white/5 hover:border-white/15 transition-all duration-500 overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: m.color }} />
              
              <div className="p-8 lg:p-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/20 bg-green-500/10">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-green-500 text-[11px] font-bold uppercase tracking-widest">{m.value}</span>
                  </div>
                  {/* Subtle graph-like decoration */}
                  <div className="flex gap-1 h-6 items-end opacity-40">
                    {[40, 70, 45, 90, 60, 100].map((h, index) => (
                      <div key={index} className="w-1.5 rounded-t-sm bg-white/20 group-hover:bg-white/40 transition-colors" style={{ height: `${h}%`, transitionDelay: `${index * 50}ms` }} />
                    ))}
                  </div>
                </div>

                <h3 className="text-[28px] font-bold text-white leading-tight">{m.label}</h3>
                <h4 className="text-[14px] font-bold uppercase tracking-wider mt-2 mb-6" style={{ color: m.color }}>{m.subLabel}</h4>
                <p className="text-[15px] text-[#A0A0A0] leading-relaxed border-t border-white/10 pt-6">
                  {m.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
