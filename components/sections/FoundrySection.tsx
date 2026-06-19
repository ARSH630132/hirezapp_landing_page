"use client";

import { motion } from "motion/react";
import SectionHeading from "@/components/SectionHeading";
import { pageFadeVariants } from "@/lib/animations";
import { foundrySteps } from "@/lib/landing-data";

export default function FoundrySection() {
  return (
    <motion.section
      id="foundry"
      className="w-full bg-black px-6 lg:px-16 lg:py-20 py-12"
      variants={pageFadeVariants}
    >
      <SectionHeading
        title={
          <h2 className="text-[24px] sm:text-[30px] leading-none font-medium text-center uppercase text-white">
            THE <span className="text-red-500">AI FOUNDRY</span> PROCESS
          </h2>
        }
        titleClassName="text-center"
        dividerWidthClassName="w-[260px]"
      />

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-[1795px] mx-auto">
        {foundrySteps.map((item) => (
          <div
            key={item.title}
            className="group relative rounded-[20px] p-[1px] transition-all duration-300 hover:-translate-y-3 hover:scale-[1.02]"
            style={{ background: item.borderGradient }}
          >
            <div className="relative min-h-[380px] h-full rounded-[19px] bg-[#000102] p-6 flex flex-col overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" style={{ background: `radial-gradient(circle at center, ${item.color}18 0%, ${item.color}08 55%, transparent 80%)` }} />
              <div className="absolute inset-0 rounded-[19px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" style={{ boxShadow: `0 0 18px ${item.color}, 0 0 42px ${item.color}99, inset 0 0 30px ${item.color}55` }} />

              <h3 className="relative z-10 text-center text-[25px] leading-none font-semibold uppercase" style={{ color: item.color }}>
                {item.title}
              </h3>

              <div className="mt-6 flex justify-center">
                <img src={item.icon} alt={item.title} className="w-[130px] h-[130px] object-contain relative z-10 transition-all duration-300 group-hover:scale-105" />
              </div>

              <div className="relative z-10 mt-auto pt-6">
                <p className="text-[25px] leading-none font-medium text-white">{item.step}</p>
                <h4 className="mt-2 text-[25px] leading-none font-medium text-white uppercase">{item.name}</h4>
                <p className="mt-3 text-[15px] leading-[1.5] font-medium text-[#C1C1C1]">{item.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-10 text-center text-[20px] sm:text-[26px] leading-[1.4] font-medium uppercase text-white">
        BUILT IN OUR <span className="text-[#F74539]">GARAGE.</span>{" "}
        FORGED IN OUR <span className="text-[#E98828]">FOUNDRY.</span>{" "}
        DEPLOYED IN YOUR <span className="text-[#0186E4]">FACTORY.</span>
      </p>
    </motion.section>
  );
}
