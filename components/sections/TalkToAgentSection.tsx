"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import AgentChatPanel from "@/components/AgentChatPanel";
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
              <div className="relative w-full min-h-[390px] rounded-[19px] bg-[#000102] flex flex-col items-center text-center px-5 pb-7 overflow-hidden">
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
                  width={120}
                  height={120}
                  className="mt-[22px] w-[120px] h-[120px] object-contain relative z-10 transition-all duration-200 group-hover:scale-105"
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
                  className="relative z-10 mt-6 flex items-center gap-2 text-[16px] leading-none font-medium cursor-pointer"
                  style={{ color: agent.color }}
                >
                  TALK NOW <span>→</span>
                </button>
              </div>
            </div>

            {activeAgent === agent.name && (
              <AgentChatPanel
                variant="mobile"
                agentName={agent.name}
                agentIcon={agent.icon}
                agentColor={agent.color}
                onClose={() => setActiveAgent(null)}
                className="mt-4 block w-full max-w-[339px] md:hidden"
              />
            )}
          </div>
        ))}

        {activeAgent && selectedAgent && (
          <AgentChatPanel
            variant="desktop"
            agentName={selectedAgent.name}
            agentIcon={selectedAgent.icon}
            agentColor={selectedAgent.color}
            onClose={() => setActiveAgent(null)}
            className="relative hidden w-full md:flex xl:col-span-5"
          />
        )}
      </div>
    </motion.section>
  );
}
