"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { pageFadeVariants } from "@/lib/animations";

const blueprintQuestions = [
  "Select Industry",
  "Enterprise Size",
  "AI Transformation Goals",
  "Workforce Size",
  "Existing Systems",
  "Risk Appetite",
];

const operatingModelItems = ["Intelligent Workforce", "Agentic Automation", "Decision Intelligence", "Continuous Learning"];

const architectureItems = ["Data & Intelligence Layer", "AI & Agent Layer", "Orchestration Layer", "Integration Layer"];

const roadmapPhases = [
  ["PHASE 1", "Foundation", "0-3 Months"],
  ["PHASE 2", "Scale", "3-9 Months"],
  ["PHASE 3", "Optimize", "9-18 Months"],
  ["PHASE 4", "Autonomous Enterprise", "18+ Months"],
] as const;

export default function BuildAIEnterpriseSection() {
  return (
    <motion.section
      id="blueprint"
      className="w-[calc(100%-24px)] lg:w-[calc(100%-128px)] max-w-[1792px] mx-auto rounded-[20px] border border-[#151926] bg-[#000613] px-4 sm:px-6 py-16 overflow-hidden"
      variants={pageFadeVariants}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr_320px] xl:grid-cols-[430px_1fr_340px] gap-6 xl:gap-8">
        <div className="pl-0 lg:pl-[22px]">
          <h2 className="text-[32px] sm:text-[40px] lg:text-[44px] leading-none font-semibold text-[#E8EDFF] uppercase">
            BUILD YOUR <br /> AI ENTERPRISE
          </h2>

          <p className="mt-6 text-[#C1C1C1] text-[15px] lg:text-[18px] leading-[1.45] font-medium max-w-[414px]">
            Answer a few questions. Our AI engine will design your operating model, architecture, agent ecosystem and transformation roadmap.
          </p>

          <div className="mt-10 lg:mt-16 grid grid-cols-1 sm:grid-cols-2 gap-x-[14px] gap-y-3 w-full max-w-[550px]">
            {blueprintQuestions.map((item) => (
              <button key={item} className="w-full h-[48px] rounded-[10px] border border-[#2F2B3E] bg-[#070D1D] text-white text-[15px] lg:text-[16px] leading-none font-semibold px-5 flex items-center gap-2 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
                <Image src="/ai_enterprise/Arrow - Right 4.png" alt="arrow" width={20} height={20} className="w-5 h-5 object-contain shrink-0" />
                {item}
              </button>
            ))}
          </div>

          <button
            className="mt-8 w-full max-w-[550px] h-[50px] rounded-[10px] text-white text-[16px] font-semibold flex items-center justify-center gap-2 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
            style={{ background: "linear-gradient(270deg, #087DF3 0%, #4835C6 50%, #B11C58 100%)" }}
          >
            GENERATE BLUEPRINT →
          </button>
        </div>

        <div className="lg:col-span-1 xl:col-span-2">
          <h3 className="text-center text-white text-[20px] sm:text-[24px] leading-none font-semibold uppercase tracking-[0.02em]">
            YOUR AI ENTERPRISE BLUEPRINT
          </h3>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-[302px_1fr_302px] gap-6">
            <div className="space-y-5">
              <div className="rounded-[14px] border border-white/20 bg-[#07101f] px-[22px] py-6">
                <h4 className="text-white text-[18px] leading-none font-semibold text-center">AI OPERATING MODEL</h4>
                <div className="mt-5 space-y-4">
                  {operatingModelItems.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-[16px] font-semibold text-white">
                      <Image src="/ai_enterprise/Arrow - Right 4.png" alt="arrow" width={20} height={20} className="w-5 h-5 object-contain shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[14px] border border-white/20 bg-[#07101f] p-6">
                <h4 className="text-white text-[18px] leading-none font-semibold">AGENT ECOSYSTEM</h4>
                <p className="mt-3 text-[#C1C1C1] text-[18px] leading-none font-medium">24 Agents Recommended</p>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <Image src="/ai_enterprise/main.png" alt="AI Enterprise Blueprint" width={637} height={404} className="w-full max-w-[720px] h-auto object-contain" />
            </div>

            <div className="space-y-5">
              <div className="rounded-[14px] border border-white/20 bg-[#07101f] px-4 py-6">
                <h4 className="text-white text-[16px] lg:text-[18px] leading-none font-semibold text-center">AI ARCHITECTURE</h4>
                <div className="mt-5 space-y-4">
                  {architectureItems.map((item) => (
                    <div key={item} className="flex items-center gap-2 min-w-0">
                      <Image src="/ai_enterprise/Arrow - Right 4.png" alt="arrow" width={20} height={20} className="w-5 h-5 object-contain shrink-0" />
                      <span className="text-[15px] lg:text-[16px] font-semibold text-white">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[14px] border border-white/20 bg-[#07101f] px-4 py-6 flex flex-col items-center justify-center text-center">
                <h4 className="text-white text-[16px] lg:text-[18px] leading-none font-semibold">GOVERNANCE FRAMEWORK</h4>
                <p className="mt-3 text-[#C1C1C1] text-[16px] lg:text-[18px] leading-[1.5] font-medium">
                  Trust Risk Security Compliance<br />Ethics
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 w-full rounded-[16px] border border-white/20 bg-[#07101f] px-4 sm:px-8 py-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {roadmapPhases.map(([phase, title, time]) => (
              <div key={phase} className="flex items-center gap-3">
                <Image src="/intellegent_enterprise/robot.svg" alt="Robot" width={50} height={50} className="w-[44px] h-[44px] lg:w-[50px] lg:h-[50px] object-contain shrink-0" />
                <div>
                  <p className="text-[#C1C1C1] text-[15px] leading-none font-medium uppercase">{phase}</p>
                  <h5 className="text-[18px] leading-[1.2] font-semibold text-white">{title}</h5>
                  <p className="text-[#C1C1C1] text-[16px] leading-none font-medium">{time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
