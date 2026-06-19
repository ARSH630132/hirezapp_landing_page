"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { pageFadeVariants } from "@/lib/animations";
import { heroActions } from "@/lib/landing-data";

export default function HeroSection() {
  return (
    <motion.section
      id="home"
      className="w-full min-h-[70vh] pt-[84px] bg-black flex flex-col lg:flex-row overflow-hidden"
      variants={pageFadeVariants}
    >
      <div className="relative z-10 w-full lg:w-[45%] shrink-0 flex flex-col justify-center px-6 lg:pl-16 lg:pr-8 py-16 lg:py-24">
        <h1 className="text-[40px] sm:text-[48px] lg:text-[60px] leading-[1.05] font-semibold">
          The Intelligent
          <br />
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(90deg, #E4000F 0%, #009DFF 100%)" }}
          >
            Enterprise
          </span>{" "}
          Starts Here
        </h1>

        <p className="mt-5 text-[15px] sm:text-[16px] lg:text-[18px] leading-[1.65] font-medium text-white">
          Why GFF Garage to Foundry to Factory - Industries - Interactive AI Experience - Customer Stories - Live Metrics - Insights - Contact
        </p>

        <div className="mt-10 lg:mt-12 grid grid-cols-1 sm:grid-cols-2 gap-x-[9px] gap-y-4 w-full">
          {heroActions.map((action) => (
            <a
              key={action.label}
              href={action.href}
              className="w-auto h-[50px] rounded-full border border-[#969696] bg-black px-5 flex items-center justify-center gap-[10px] hover:border-white/50 transition-colors"
            >
              <Image src={action.icon} alt={action.label} width={30} height={30} className="w-[30px] h-[30px] object-contain shrink-0" />
              <span className="text-white text-[18px] leading-none font-medium whitespace-nowrap">{action.label}</span>
            </a>
          ))}
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
