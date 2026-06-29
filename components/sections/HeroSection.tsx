"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { pageFadeVariants } from "@/lib/animations";

export default function HeroSection() {
  const quickLinks: Record<string, string> = {
    "Animated Foundry": "/#foundry",
    "Live Agent Counter": "/#live-dashboard",
    "Live Projects": "/#live-dashboard",
    Countries: "/#live-dashboard",
    "Client Logos": "/#client-success",
    "Scroll Indicator": "/#journey",
  };

  return (
    <motion.section
      id="home"
      className="w-full min-h-[70vh] pt-[84px] bg-black flex flex-col lg:flex-row overflow-hidden"
      variants={pageFadeVariants}
    >
      <div className="relative z-10 w-full lg:w-[48%] xl:w-[46%] shrink-0 flex flex-col justify-start px-6 lg:pl-16 lg:pr-4 pt-10 lg:pt-14 pb-16 lg:pb-20">
        <h1 className="relative z-20 w-[115%] max-w-[760px] text-[40px] sm:text-[48px] lg:text-[52px] leading-[1.1] font-semibold">
        Building the World's First
<br />
<span
  className="bg-clip-text text-transparent"
  style={{ backgroundImage: "linear-gradient(90deg, #E4000F 0%, #009DFF 100%)" }}
>
  AI-Native
</span>{" "}
<span
  className="bg-clip-text text-transparent"
  style={{ backgroundImage: "linear-gradient(90deg, #E4000F 0%, #009DFF 100%)" }}
>
  Enterprise
</span>
<br />
Transformation Company
        </h1>

        <p className="mt-5 text-[15px] sm:text-[16px] lg:text-[18px] leading-[1.65] font-medium text-gray-300">
          Combining Agentic AI, Knowledge Graphs, Industry Platforms, Talent Cloud, and Managed AI Operations into a single transformation ecosystem.
        </p>

        <div className="mt-10 lg:mt-12 flex flex-col sm:flex-row flex-wrap gap-4 w-full">
          <Link
            href="/build/blueprint"
className="h-[50px] rounded-full px-6 flex items-center justify-center gap-[10px] hover:opacity-90 transition-all duration-300 overflow-hidden"
style={{
  background: "linear-gradient(90deg, #E4000F 0%, #009DFF 100%)"
}}          >
            <span className="text-white text-[16px] leading-none font-semibold whitespace-nowrap">Generate My Enterprise AI Blueprint</span>
          </Link>
          <Link
            href="/#experience"
            className="h-[50px] rounded-full border border-[#969696] bg-transparent px-6 flex items-center justify-center gap-[10px] hover:border-white/50 transition-colors"
          >
            <span className="text-white text-[16px] leading-none font-medium whitespace-nowrap">Experience GFF AI Live</span>
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-[520px]">
  {Object.entries(quickLinks).map(([item, href]) => (
    <Link
      key={item}
      href={href}
      className="flex w-full h-[42px] rounded-full border border-white/15 bg-white/[0.04] px-4 text-white/75 text-[12px] font-medium hover:border-[#009DFF]/50 hover:text-white hover:bg-[#009DFF]/10 transition-all items-center justify-center text-center"
    >
      {item}
    </Link>
  ))}
</div>
        <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex flex-col"><span className="text-2xl font-bold text-white">500+</span><span className="text-xs text-gray-400">AI Use Cases</span></div>
          <div className="flex flex-col"><span className="text-2xl font-bold text-white">20+</span><span className="text-xs text-gray-400">Industries</span></div>
          <div className="flex flex-col"><span className="text-lg font-bold text-white mt-1">Global Delivery</span><span className="text-xs text-gray-400">Model</span></div>
          <div className="flex flex-col"><span className="text-lg font-bold text-white mt-1">Agent Factory</span><span className="text-xs text-gray-400">Platform</span></div>
          <div className="flex flex-col"><span className="text-lg font-bold text-white mt-1">Knowledge Graph</span><span className="text-xs text-gray-400">Factory</span></div>
          <div className="flex flex-col"><span className="text-lg font-bold text-white mt-1">AI Academy</span><span className="text-xs text-gray-400">Talent Cloud</span></div>
        </div>
      </div>

      <div className="flex-1 relative h-auto lg:min-h-0 overflow-hidden">
        <video autoPlay muted loop playsInline preload="auto" className="w-full h-full object-cover">
          <source src="/videos/videomp_.mp4" type="video/mp4" />
        </video>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(90deg, #000000 0%, rgba(0,0,0,0.45) 18%, rgba(0,0,0,0) 50%)" }}
        />
      </div>
    </motion.section>
  );
}
