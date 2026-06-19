"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import SectionHeading from "@/components/SectionHeading";
import { pageFadeVariants } from "@/lib/animations";
import { agents } from "@/lib/landing-data";

export default function TalkToAgentSection() {
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const selectedAgent = agents.find((a) => a.name === activeAgent);

  return (
    <motion.section
      id="capabilities"
      className="w-full bg-black px-6 lg:px-16 lg:py-20 py-12 overflow-hidden"
      variants={pageFadeVariants}
    >
      <SectionHeading
        title={
          <h2 className="text-[#E8EDFF] text-[30px] sm:text-[40px] leading-none font-semibold uppercase text-center">
            TALK TO AN AI AGENT
          </h2>
        }
        titleClassName="text-center"
        dividerWidthClassName="w-[260px]"
      />
      <p className="mt-3 text-center text-[#C1C1C1] text-[15px] sm:text-[18px] leading-[1.4] font-medium">
        Get instant insights, strategies and roadmaps from our AI-powered expert agents.
      </p>

      <div className="mt-12 max-w-[1795px] mx-auto grid grid-cols-1 xl:grid-cols-5 gap-6">
        {agents.map((agent) => (
          <div key={agent.name} className="flex flex-col items-center xl:col-span-1">
            <div
              className={`group relative w-full max-w-[339px] rounded-[20px] p-[1px] mx-auto transition-all duration-300 hover:shadow-[0_0_10px_var(--agent-color),0_0_24px_var(--agent-color)] ${activeAgent === agent.name ? "md:scale-[1.04] z-30 shadow-[0_0_10px_var(--agent-color),0_0_24px_var(--agent-color)]" : "scale-100 z-10"}`}
              style={{ background: agent.gradient, "--agent-color": agent.color } as React.CSSProperties}
            >
              <div className="relative w-full rounded-[19px] bg-[#000102] flex flex-col items-center text-center px-5 pb-7 overflow-hidden">
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                  style={{ background: `radial-gradient(circle at center, ${agent.color}18 0%, ${agent.color}10 35%, ${agent.color}08 55%, transparent 80%)` }}
                />
                <div
                  className="absolute inset-0 rounded-[19px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                  style={{ boxShadow: `0 0 18px ${agent.color}, 0 0 42px ${agent.color}99, inset 0 0 30px ${agent.color}55` }}
                />

                <Image
                  src={agent.icon}
                  alt={agent.name}
                  width={170}
                  height={170}
                  className="mt-[22px] w-[150px] h-[150px] object-contain relative z-10 transition-all duration-200 group-hover:scale-105"
                  style={{ color: agent.color }}
                />

                <h3 className="mt-5 w-full text-[22px] leading-none font-semibold text-center uppercase" style={{ color: agent.color }}>
                  {agent.name}
                </h3>

                <p className="mt-4 w-full max-w-[240px] text-[#C1C1C1] text-[16px] leading-[1.4] font-medium text-center">
                  {agent.desc}
                </p>

                <button
                  onClick={() => setActiveAgent(activeAgent === agent.name ? null : agent.name)}
                  className="relative z-10 mt-6 flex items-center gap-2 text-[16px] leading-none font-medium"
                  style={{ color: agent.color }}
                >
                  TALK NOW <span>→</span>
                </button>
              </div>
            </div>

            {activeAgent === agent.name && (
              <div className="block md:hidden mt-4 w-full max-w-[339px] h-[400px] rounded-[18px] border border-[#1E1E1E] bg-[#111111] p-4 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between mb-4 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-[40px] h-[40px] rounded-full flex items-center justify-center" style={{ background: `${agent.color}20`, border: `1px solid ${agent.color}` }}>
                      <img src={agent.icon} alt={agent.name} className="w-[22px] h-[22px]" />
                    </div>
                    <div>
                      <h3 className="text-white text-[16px] font-semibold">{agent.name}</h3>
                      <p className="text-[#C1C1C1] text-[12px]">Online</p>
                    </div>
                  </div>
                  <button onClick={() => setActiveAgent(null)} className="text-white/70 text-2xl leading-none">×</button>
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto">
                  <div className="rounded-[10px] bg-[#1B1B1B] px-4 py-3 text-white/80 text-[14px]">Hello! I&apos;m your AI assistant. How can I help you today?</div>
                </div>
                <div className="mt-4 flex items-center gap-2 shrink-0">
                  <input type="text" placeholder="Type your message..." className="w-full h-[44px] rounded-[6px] bg-black border border-[#1E1E1E] px-4 text-white outline-none" />
                  <button className="w-[44px] h-[44px] rounded-[10px] text-white flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #E4000F 0%, #009DFF 100%)" }}>➤</button>
                </div>
              </div>
            )}
          </div>
        ))}

        {activeAgent && selectedAgent && (
          <div className="hidden md:block xl:col-span-5 mt-10 w-full h-[480px] rounded-[18px] border border-[#1E1E1E] bg-[#111111] p-6 md:p-8 relative flex flex-col overflow-hidden">
            <button onClick={() => setActiveAgent(null)} className="absolute top-6 right-6 text-white/70 hover:text-white text-2xl">×</button>

            <div className="flex items-center gap-3 shrink-0">
              <div className="w-[46px] h-[46px] rounded-full flex items-center justify-center" style={{ background: `${selectedAgent.color}20`, border: `1px solid ${selectedAgent.color}` }}>
                <Image src={selectedAgent.icon} alt={activeAgent} width={28} height={28} className="w-[28px] h-[28px] object-contain" />
              </div>
              <div>
                <h3 className="text-white text-[18px] font-semibold">{activeAgent.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}</h3>
                <p className="text-[#C1C1C1] text-[13px]">Online</p>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto mt-6">
              <div className="inline-block max-w-[900px] rounded-[10px] bg-[#1B1B1B] px-4 py-3 text-white/80 text-[15px] leading-[24px]">
                Hello! I&apos;m your {activeAgent.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}. I can help you craft an AI transformation roadmap tailored to your enterprise goals. What industry are you in?
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3 shrink-0">
              <input type="text" placeholder="Type your message..." className="w-full h-[48px] rounded-[6px] bg-black border border-[#1E1E1E] px-4 text-white outline-none placeholder:text-white/30" />
              <button className="w-[48px] h-[48px] rounded-[12px] flex items-center justify-center text-white shrink-0" style={{ background: "linear-gradient(135deg, #E4000F 0%, #009DFF 100%)" }}>➤</button>
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
}
