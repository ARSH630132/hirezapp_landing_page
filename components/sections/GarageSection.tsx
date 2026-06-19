"use client";

import { motion } from "motion/react";
import { pageFadeVariants } from "@/lib/animations";
import { garageCards } from "@/lib/landing-data";

export default function GarageSection() {
  return (
    <motion.section
      id="garage"
      className="relative w-full bg-black py-12 lg:py-20 overflow-hidden"
      variants={pageFadeVariants}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:h-[430px]">
        <div className="relative h-[300px] lg:h-full">
          <img src="/factory.png" alt="Garage" className="w-full h-full object-cover" />
        </div>
        <div className="h-full bg-black flex items-center px-6 lg:pl-[60px] py-10 lg:py-0">
          <h2 className="text-white font-semibold uppercase text-[30px] sm:text-[40px] leading-[1.4] tracking-[0.01em]">
            BUILT IN OUR GARAGE.<br />
            FORGED IN OUR FOUNDRY.<br />
            DEPLOYED IN YOUR ENTERPRISE.
          </h2>
        </div>
      </div>

      <div className="relative z-20 mt-10 mx-auto max-w-[1746px] px-4 sm:px-8 lg:px-[63px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {garageCards.map((item) => (
            <div
              key={item.title}
              className="relative w-full max-w-[282px] rounded-[28px] overflow-hidden bg-black/10 backdrop-blur-[8px] px-5 pt-8 pb-6 flex flex-col mx-auto"
            >
              <div
                className="pointer-events-none absolute inset-0 rounded-[28px] p-[1px]"
                style={{
                  background: item.borderGradient,
                  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                }}
              />
              <div className="w-full flex justify-center mb-6">
                <img src={item.icon} alt={item.title} className="w-[72px] h-[72px] object-contain" />
              </div>
              <h3 className="text-[18px] leading-none font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-[#C1C1C1] text-[16px] leading-[1.5] font-medium">{item.desc}</p>
              <button className="mt-6 text-[#FF2B2B] text-[16px] leading-none font-medium text-left">Learn More →</button>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
