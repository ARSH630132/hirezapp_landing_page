"use client";

import { motion } from "motion/react";
import SectionHeading from "@/components/SectionHeading";
import Link from "next/link";

export default function LatestResearchSection() {
  const items = [
    { name: 'Articles', href: '/resources/blog', color: '#E98828', desc: 'Read our latest thinking on AI patterns.' },
    { name: 'Videos', href: '/resources/videos', color: '#009DFF', desc: 'Watch deep-dives into enterprise architectures.' },
    { name: 'Podcasts', href: '/resources/podcasts', color: '#9d00ff', desc: 'Listen to leaders in AI transformation.' },
    { name: 'Whitepapers', href: '/resources/whitepapers', color: '#F74539', desc: 'Download comprehensive industry reports.' }
  ];

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className="w-full bg-[#050505] px-6 lg:px-16 lg:py-32 py-20 relative overflow-hidden"
    >
      <div className="max-w-[1795px] mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <SectionHeading
            title={
              <h2 className="text-[32px] sm:text-[44px] leading-none font-bold uppercase text-white tracking-widest text-left">
                LATEST <span className="text-[#E98828]">RESEARCH</span>
              </h2>
            }
            titleClassName="text-left"
            dividerWidthClassName="w-[200px]"
          />
          <Link href="/resources" className="text-[14px] font-bold uppercase tracking-widest text-[#E98828] hover:text-white transition-colors flex items-center gap-2">
            View All Resources <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((c, i) => (
            <Link key={c.name} href={c.href} className="block group">
              <motion.div 
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative rounded-[24px] p-[1px] bg-gradient-to-b from-white/10 to-transparent hover:from-white/30 transition-all duration-500 h-full hover:-translate-y-2"
              >
                <div className="relative h-full rounded-[23px] bg-black p-8 flex flex-col justify-between min-h-[220px] overflow-hidden">
                  
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none" style={{ background: `radial-gradient(circle at top left, ${c.color} 0%, transparent 70%)` }} />
                  
                  <div className="relative z-10">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mb-6 bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
                    </div>
                    <h3 className="text-[24px] font-bold text-white group-hover:text-transparent group-hover:bg-clip-text transition-all" style={{ backgroundImage: `linear-gradient(90deg, #fff 0%, ${c.color} 150%)` }}>
                      {c.name}
                    </h3>
                  </div>

                  <div className="relative z-10 mt-6 border-t border-white/10 pt-4">
                    <p className="text-[14px] text-[#A0A0A0] leading-relaxed group-hover:text-white/80 transition-colors">
                      {c.desc}
                    </p>
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
