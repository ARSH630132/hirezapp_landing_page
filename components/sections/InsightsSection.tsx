"use client";

import { motion } from "motion/react";
import SectionHeading from "@/components/SectionHeading";
import { pageFadeVariants } from "@/lib/animations";
import { insightsCards } from "@/lib/landing-data";

export default function InsightsSection() {
  return (
    <motion.section
      id="insights"
      className="w-full px-6 lg:px-16 py-12 lg:py-20"
      variants={pageFadeVariants}
    >
      <SectionHeading
        title={
          <h2 className="text-[#408CFF] text-[24px] sm:text-[30px] leading-none font-medium text-center uppercase">INSIGHTS</h2>
        }
        titleClassName="text-center"
        dividerWidthClassName="w-[333px]"
      />

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-[1795px] mx-auto">
        {insightsCards.map((card) => (
          <div key={card.title} className="rounded-[10px] border border-[#171717] bg-black/10 p-6 flex flex-col backdrop-blur-[40px]">
            <img src="/insights/insight.svg" alt={card.title} className="w-full h-[190px] object-contain" />
            <h3 className="mt-6 text-[24px] leading-[30px] font-bold text-white">{card.title.toUpperCase()}</h3>
            <p className="mt-5 text-[18px] leading-[29px] font-medium text-[#C1C1C1]">{card.description}</p>
            <button className="mt-auto pt-6 text-[#449AEB] text-[16px] leading-[24px] font-medium text-left">EXPLORE LAB →</button>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
