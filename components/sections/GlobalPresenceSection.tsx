"use client";

import { motion } from "motion/react";
import SectionHeading from "@/components/SectionHeading";
import Image from "next/image";

export default function GlobalPresenceSection() {
  const locations = [
    { name: 'Singapore', role: 'Global HQ', color: '#F74539', delay: 0.1 },
    { name: 'India', role: 'Build Shop', color: '#0186E4', delay: 0.3 },
    { name: 'London', role: 'Client Center', color: '#E98828', delay: 0.5 },
  ];

  return (
    <motion.section 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="w-full bg-[#030303] px-6 lg:px-16 lg:py-32 py-20 relative overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <Image src="/globe.svg" alt="Globe Map Background" fill className="object-cover object-center" />
      </div>
      
      <div className="relative z-10 max-w-[1795px] mx-auto">
        <SectionHeading
          title={
            <h2 className="text-[32px] sm:text-[44px] leading-none font-bold text-center uppercase text-white tracking-widest">
              GLOBAL <span className="text-[#009DFF]">DELIVERY</span> MODEL
            </h2>
          }
          titleClassName="text-center"
          dividerWidthClassName="w-[300px]"
        />
        
        <p className="mt-6 text-center text-[16px] lg:text-[18px] text-[#A0A0A0] max-w-2xl mx-auto">
          Scale your enterprise AI initiatives securely across borders. Designed for seamless global operations, governance, and rapid deployment.
        </p>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {locations.map((l) => (
            <motion.div 
              key={l.name} 
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: l.delay }}
              className="group relative rounded-[24px] p-[1px] bg-gradient-to-b from-white/15 to-transparent hover:from-white/40 transition-all duration-500 cursor-pointer hover:-translate-y-4"
            >
              <div className="relative h-full rounded-[23px] bg-[#050505] p-10 flex flex-col items-center justify-center min-h-[240px] text-center shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                <div className="absolute top-6 right-6 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full animate-ping absolute opacity-70" style={{ backgroundColor: l.color }} />
                  <div className="w-3 h-3 rounded-full relative z-10" style={{ backgroundColor: l.color }} />
                </div>
                
                <h3 className="relative z-10 text-[32px] font-black text-white tracking-wide group-hover:scale-105 transition-transform duration-300">
                  {l.name}
                </h3>
                <p className="relative z-10 text-[14px] font-bold tracking-widest uppercase mt-4 px-4 py-1.5 rounded-full border bg-[#0A0A0A] group-hover:bg-black transition-colors" style={{ color: l.color, borderColor: `${l.color}40` }}>
                  {l.role}
                </p>
                <div className="absolute bottom-0 left-0 right-0 h-1/2 opacity-0 group-hover:opacity-20 transition-opacity duration-500" style={{ backgroundImage: `linear-gradient(to top, ${l.color}, transparent)` }} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
