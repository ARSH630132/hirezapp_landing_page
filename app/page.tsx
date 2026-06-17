"use client";

import ThreeDView from "../component/3d_view";
import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSolution, setOpenSolution] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-[#010101] text-white overflow-x-hidden">
      <div className="w-full max-w-[1920px] mx-auto bg-[#010101] overflow-x-hidden">
        <section className="relative w-full min-h-[700px] lg:h-[700px] overflow-hidden bg-black">
       <header className="relative w-full h-[84px] bg-[#000000B8] backdrop-blur-[20px] flex items-center justify-between px-[12px] sm:px-[17px]">
  <div className="flex items-center gap-2 sm:gap-3 shrink-0">
    <img
      src="/footer/logo.svg"
      alt="GFF AI"
      className="w-[52px] h-[52px] sm:w-[70px] sm:h-[70px] object-contain"
    />

    <div className="flex flex-col">
      <div className="text-white text-[22px] sm:text-[28px] leading-[24px] sm:leading-[30px] font-semibold tracking-[0.02em]">
        GFF AI
      </div>

      <div className="flex items-center gap-[4px] sm:gap-[6px] text-[8px] sm:text-[11px] leading-[12px] sm:leading-[14px] font-bold tracking-[0.08em]">
        <span className="text-[#E4000F]">GARAGE</span>
        <span className="text-white">|</span>
        <span className="text-white">FOUNDRY</span>
        <span className="text-white">|</span>
        <span className="text-[#009DFF]">FACTORY</span>
      </div>
    </div>
  </div>

  <div className="hidden md:flex items-center gap-[55px] text-white ml-auto mr-[60px]">
    {["Home", "Capabilities", "Industries", "Company"].map((item) => (
      <button
        key={item}
        className="text-white text-[16px] leading-[24px] font-medium cursor-pointer hover:text-red-400 transition-colors whitespace-nowrap"
      >
        {item}
      </button>
    ))}
  </div>

  <button
    className="hidden md:block w-[207px] h-[48px] rounded-[98px] text-white text-[16px] leading-[24px] font-semibold cursor-pointer transition-all duration-300 hover:opacity-90 shrink-0"
    style={{
      background: "linear-gradient(90deg, #E4000F 0%, #009DFF 100%)",
    }}
  >
    Book a Consultation
  </button>

  <button
    onClick={() => setIsMenuOpen(!isMenuOpen)}
    className="md:hidden flex flex-col gap-[6px] cursor-pointer"
  >
    <span className="w-[34px] h-[4px] bg-white rounded-full" />
    <span className="w-[34px] h-[4px] bg-white rounded-full" />
    <span className="w-[34px] h-[4px] bg-white rounded-full" />
  </button>
</header>
{isMenuOpen && (
  <div
    className="fixed inset-0 z-[999] md:hidden bg-black/65"
    onClick={() => setIsMenuOpen(false)}
  >
    <div
      className="absolute left-0 right-0 bottom-0 h-[62vh] rounded-t-[28px] bg-[#050505] px-6 pt-6 pb-8 overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between pb-5 border-b border-white/10">
        <div>
          <p className="text-white text-[18px] font-semibold">GFF AI</p>
          <p className="text-white/50 text-[13px]">Navigation Menu</p>
        </div>

        <button
          onClick={() => setIsMenuOpen(false)}
          className="text-white text-[34px] leading-none cursor-pointer"
        >
          ×
        </button>
      </div>

      <div className="mt-6 flex flex-col">
        {["Home", "Capabilities", "Industries", "Company"].map((item) => (
          <button
            key={item}
            onClick={() => setIsMenuOpen(false)}
            className="w-full py-4 border-b border-white/10 text-white/80 text-[18px] leading-[24px] font-semibold text-left hover:text-white transition-colors"
          >
            {item}
          </button>
        ))}

        <button
          onClick={() => setIsMenuOpen(false)}
          className="mt-6 w-full h-[56px] rounded-[98px] text-white text-[16px] leading-[24px] font-semibold cursor-pointer"
          style={{
            background: "linear-gradient(90deg, #E4000F 0%, #009DFF 100%)",
          }}
        >
          Book a Consultation
        </button>
      </div>
    </div>
  </div>
)}
          <div className="relative z-10 mt-[70px] lg:mt-[120px] ml-0 lg:ml-[64px] px-6 lg:px-0 w-full lg:w-[705px] min-h-[376px]">
            <h1 className="text-[40px] sm:text-[48px] lg:text-[60px] leading-[100%] font-semibold tracking-[0px]">
              The Intelligent
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #E4000F 0%, #009DFF 100%)",
                }}
              >
                Enterprise
              </span>{" "}
              Starts Here
            </h1>

            <p className="mt-[20px] w-full lg:w-[704px] text-[15px] sm:text-[16px] lg:text-[18px] leading-[26px] lg:leading-[30px] font-medium text-white">
              Why GFF- Garage to Foundry to Factory- Industries- Interactive AI
              <br className="hidden lg:block" />
              Experience- Customer Stories- Live Metrics- Insights- Contact
            </p>

            <div className="mt-[30px] grid grid-cols-1 sm:grid-cols-2 gap-x-[9px] gap-y-[20px] w-full sm:w-fit">
              <button className="w-full sm:w-[231px] h-[50px] rounded-[100px] border border-[#969696] bg-black px-[20px] flex items-center justify-center gap-[10px] cursor-pointer">
                <Image
                  src="/intellegent_enterprise/industry.svg"
                  alt="Industry"
                  width={26}
                  height={28}
                  className="w-[26px] h-[28px] object-contain shrink-0"
                />
                <span className="text-white text-[18px] leading-[100%] font-medium whitespace-nowrap">
                  Explore Foundry
                </span>
              </button>

              <button className="w-full sm:w-[228px] h-[50px] rounded-[100px] border border-[#969696] bg-black px-[20px] flex items-center justify-center gap-[11px] cursor-pointer">
                <Image
                  src="/intellegent_enterprise/internet.svg"
                  alt="AI Journey"
                  width={30}
                  height={30}
                  className="w-[30px] h-[30px] object-contain shrink-0"
                />
                <span className="text-white text-[18px] leading-[100%] font-medium whitespace-nowrap">
                  Start AI Journey
                </span>
              </button>

              <button className="w-full sm:w-[201px] h-[50px] rounded-[100px] border border-[#969696] bg-black px-[20px] flex items-center justify-center sm:justify-start gap-[10px] cursor-pointer">
                <Image
                  src="/intellegent_enterprise/robot.svg"
                  alt="Agent"
                  width={30}
                  height={30}
                  className="w-[30px] h-[30px] object-contain shrink-0"
                />
                <span className="text-white text-[18px] leading-[100%] font-medium whitespace-nowrap">
                  Talk to Agent
                </span>
              </button>

              <button className="w-full sm:w-[254px] h-[50px] rounded-[100px] border border-[#969696] bg-black px-[20px] flex items-center justify-center sm:justify-start gap-[11px] cursor-pointer sm:-ml-[22px]">
                <Image
                  src="/intellegent_enterprise/blueprint.svg"
                  alt="Blueprint"
                  width={30}
                  height={30}
                  className="w-[30px] h-[30px] object-contain shrink-0"
                />
                <span className="text-white text-[18px] leading-[100%] font-medium whitespace-nowrap">
                  Generate Blueprint
                </span>
              </button>
            </div>
          </div>

          <div className="hidden lg:block absolute top-[84px] right-0 w-[58%] h-[calc(100%-84px)]">
            <div
              className="relative w-full h-full overflow-hidden"
              style={{
                background:
                  "linear-gradient(270deg, rgba(0, 0, 0, 0) 0%, #000000 15%)",
              }}
            >
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="/hero/hero-video.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </section>

        <section className="w-full bg-black px-6 py-10 overflow-hidden">
          <div className="text-center">
            <h2 className="text-[#E8EDFF] text-[30px] sm:text-[40px] leading-[100%] font-semibold uppercase">
              TALK TO AN AI AGENT
            </h2>
            <p className="mt-[6px] text-[#C1C1C1] text-[15px] sm:text-[18px] leading-[130%] sm:leading-[100%] font-medium">
              Get instant insights, strategies and roadmaps from our Ai-powered
              expert agents.
            </p>
          </div>

          <div className="mt-[50px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-[1795px] mx-auto">
            {[
              {
                name: "STRATEGY AGENT",
                desc: "AI transformation strategy and roadmap advisor",
                icon: "/talk-to-an-ai-agent/strategy-agent.svg",
                color: "#E53434",
                gradient:
                  "linear-gradient(149.2deg, rgba(229,52,52,0.3) 1.08%, rgba(142,153,183,0.3) 98.68%)",
              },
              {
                name: "AI ARCHITECT AGENT",
                desc: "Enterprise AI architecture and solution designer",
                icon: "/talk-to-an-ai-agent/architect-agent.svg",
                color: "#04B0FE",
                gradient:
                  "linear-gradient(149.2deg, rgba(0,177,255,0.3) 1.08%, rgba(142,153,183,0.3) 98.68%)",
              },
              {
                name: "GOVERNANCE AGENT",
                desc: "AI governance, risk and compliance expert",
                icon: "/talk-to-an-ai-agent/governance-agent.svg",
                color: "#1DEE7B",
                gradient:
                  "linear-gradient(149.2deg, rgba(29,238,123,0.3) 1.08%, rgba(142,153,183,0.3) 98.68%)",
              },
              {
                name: "INDUSTRY AGENT",
                desc: "Industry-specific AI use cases and transformation guide",
                icon: "/talk-to-an-ai-agent/industry-agent.svg",
                color: "#EB5620",
                gradient:
                  "linear-gradient(149.2deg, rgba(235,86,32,0.3) 1.08%, rgba(142,153,183,0.3) 98.68%)",
              },
              {
                name: "TRAINING ADVISOR",
                desc: "AI talent, training and capability advisor",
                icon: "/talk-to-an-ai-agent/training-agent.svg",
                color: "#9C4DF0",
                gradient:
                  "linear-gradient(149.2deg, rgba(156,77,240,0.3) 1.08%, rgba(142,153,183,0.3) 98.68%)",
              },
            ].map((agent) => (
  <div key={agent.name} className="flex flex-col items-center">
<div
 
className={`
  group relative w-full max-w-[339px] h-[435px] rounded-[20px] p-[1px] mx-auto
  transition-all duration-100
  hover:shadow-[0_0_10px_var(--agent-color),0_0_24px_var(--agent-color)]
  ${
    activeAgent === agent.name
  ? "md:scale-[1.04] z-30 shadow-[0_0_10px_var(--agent-color),0_0_24px_var(--agent-color)]"
  : "scale-100 z-10"
  }
`}
  style={{
    background: agent.gradient,
    "--agent-color": agent.color,
  } as React.CSSProperties}
>
                
 <div
  className="relative w-full h-full rounded-[19px] bg-[#000102] flex flex-col items-center text-center px-[20px] overflow-hidden transition-all duration-200"
  style={{
    boxShadow: "none",
  }}
>
<div
  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
  style={{
    background: `radial-gradient(circle at center,
      ${agent.color}18 0%,
      ${agent.color}10 35%,
      ${agent.color}08 55%,
      transparent 80%)`,
  }}
/>

<div
  className="absolute inset-0 rounded-[19px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
  style={{
    boxShadow: `
      0 0 18px ${agent.color},
      0 0 42px ${agent.color}99,
      inset 0 0 30px ${agent.color}55
    `,
  }}
/>
<div
  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
  style={{
    background: `radial-gradient(circle at center,
      ${agent.color}18 0%,
      ${agent.color}10 35%,
      ${agent.color}08 55%,
      transparent 80%)`,
  }}
/>
  <Image
  src={agent.icon}
  alt={agent.name}
  width={170}
  height={170}
  className="mt-[22px] w-[170px] h-[170px] object-contain relative z-10 transition-all duration-200 group-hover:scale-105 group-hover:drop-shadow-[0_0_18px_currentColor]"
  style={{
    color: agent.color,
  }}
/>

                  <h3
                    className="mt-[22px] w-full text-[24px] leading-[100%] tracking-[0px] font-semibold text-center uppercase font-montserrat"
                    style={{ color: agent.color }}
                  >
                    {agent.name}
                  </h3>

                  <p className="mt-[20px] w-full max-w-[240px] text-[#C1C1C1] text-[18px] leading-[100%] font-medium text-center">
                    {agent.desc}
                  </p>

             <button
  onClick={() => setActiveAgent(activeAgent === agent.name ? null : agent.name)}
  className="relative z-10 mt-auto mb-[28px] flex items-center gap-[8px] text-[16px] leading-[24px] font-medium cursor-pointer"
  style={{ color: agent.color }}
>
  TALK NOW <span>→</span>
</button>
                </div>
                </div>
                {activeAgent === agent.name && (
  <div className="block md:hidden mt-4 w-full max-w-[339px] rounded-[18px] border border-[#1E1E1E] bg-[#111111] p-4">
   <button
  onClick={() => setActiveAgent(null)}
  className="ml-auto text-white/70 text-xl"
>
      ×
    </button>

    <div className="flex items-center gap-3">
      <div
        className="w-[40px] h-[40px] rounded-full flex items-center justify-center"
        style={{
          background: `${agent.color}20`,
          border: `1px solid ${agent.color}`,
        }}
      >
        <img
          src={agent.icon}
          alt={agent.name}
          className="w-[22px] h-[22px]"
        />
      </div>

      <div>
        <h3 className="text-white text-[16px] font-semibold">
          {agent.name}
        </h3>
        <p className="text-[#C1C1C1] text-[12px]">Online</p>
      </div>
    </div>

    <div className="mt-4 rounded-[10px] bg-[#1B1B1B] px-4 py-3 text-white/80 text-[14px]">
      Hello! I'm your AI assistant. How can I help you today?
    </div>

    <div className="mt-4 flex items-center gap-2">
      <input
        type="text"
        placeholder="Type your message..."
        className="w-full h-[44px] rounded-[6px] bg-black border border-[#1E1E1E] px-4 text-white outline-none"
      />

      <button
        className="w-[44px] h-[44px] rounded-[10px] text-white"
        style={{
          background:
            "linear-gradient(135deg, #E4000F 0%, #009DFF 100%)",
        }}
      >
        ➤
      </button>
    </div>
  </div>
)}
                          </div>
          ))}
          </div>
{activeAgent && (() => {
  const selectedAgent = [
    {
      name: "STRATEGY AGENT",
      icon: "/talk-to-an-ai-agent/strategy-agent.svg",
      color: "#E53434",
    },
    {
      name: "AI ARCHITECT AGENT",
      icon: "/talk-to-an-ai-agent/architect-agent.svg",
      color: "#04B0FE",
    },
    {
      name: "GOVERNANCE AGENT",
      icon: "/talk-to-an-ai-agent/governance-agent.svg",
      color: "#1DEE7B",
    },
    {
      name: "INDUSTRY AGENT",
      icon: "/talk-to-an-ai-agent/industry-agent.svg",
      color: "#EB5620",
    },
    {
      name: "TRAINING ADVISOR",
      icon: "/talk-to-an-ai-agent/training-agent.svg",
      color: "#9C4DF0",
    },
  ].find((agent) => agent.name === activeAgent);

  return (
    <div className="hidden md:block mt-10 w-full max-w-[1700px] min-h-[430px] mx-auto rounded-[18px] border border-[#1E1E1E] bg-[#111111] p-5 md:p-8 relative">
      <button
        onClick={() => setActiveAgent(null)}
        className="absolute top-6 right-6 text-white/70 hover:text-white text-2xl cursor-pointer"
      >
        ×
      </button>

      <div className="flex items-center gap-3">
        <div
          className="w-[46px] h-[46px] rounded-full flex items-center justify-center"
          style={{
            background: `${selectedAgent?.color}20`,
            border: `1px solid ${selectedAgent?.color}`,
          }}
        >
          <Image
            src={selectedAgent?.icon || ""}
            alt={activeAgent}
            width={28}
            height={28}
            className="w-[28px] h-[28px] object-contain"
          />
        </div>

        <div>
          <h3 className="text-white text-[18px] font-semibold">
            {activeAgent
              .toLowerCase()
              .replace(/\b\w/g, (char) => char.toUpperCase())}
          </h3>
          <p className="text-[#C1C1C1] text-[13px]">Online</p>
        </div>
      </div>

      <div className="mt-6 inline-block max-w-[900px] rounded-[10px] bg-[#1B1B1B] px-4 py-3 text-white/80 text-[15px] leading-[24px]">
        Hello! I'm your {activeAgent.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())}. I can help you craft an AI transformation roadmap tailored to your enterprise goals. What industry are you in?
      </div>

      <div className="absolute left-5 right-5 bottom-5 flex items-center gap-3">
        <input
          type="text"
          placeholder="Type your message..."
          className="w-full h-[48px] rounded-[6px] bg-black border border-[#1E1E1E] px-4 text-white outline-none placeholder:text-white/30"
        />

        <button
          className="w-[48px] h-[48px] rounded-[12px] flex items-center justify-center text-white cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #E4000F 0%, #009DFF 100%)",
          }}
        >
          ➤
        </button>
      </div>
    </div>
  );
})()}
        </section>

        <section className="w-[calc(100%-24px)] sm:w-[calc(100%-55px)] max-w-[1792px] min-h-[633px] mx-auto mt-0 rounded-[20px] border border-[#151926] bg-[#000613] px-4 sm:px-6 py-8 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-[550px_1fr] xl:grid-cols-[550px_1fr_320px] gap-8">
            <div className="pl-0 lg:pl-[22px]">
              <h2 className="text-[30px] sm:text-[40px] leading-[100%] font-semibold text-[#E8EDFF] uppercase">
                BUILD YOUR <br /> AI ENTERPRISE
              </h2>

              <p className="mt-6 w-full lg:w-[414px] text-[#C1C1C1] text-[16px] lg:text-[18px] leading-[140%] lg:leading-[100%] font-medium">
                Answer a few questions. Our AI engine will design your operating
                model, architecture, agent ecosystem and transformation roadmap.
              </p>

              <div className="mt-[50px] lg:mt-[110px] grid grid-cols-1 sm:grid-cols-2 gap-x-[16px] gap-y-[14px] w-full max-w-[550px]">
                {[
                  "Select Indiatry",
                  "Enterprise Stre",
                  "AI Transformation Goals",
                  "Workforce Size",
                  "Existing Systems",
                  "Risk Appetite",
                ].map((item) => (
                  <button
                    key={item}
                    className="w-full h-[48px] rounded-[10px] border border-[#2F2B3E] bg-[#070D1D] text-white text-[16px] leading-[100%] tracking-[0.02em] font-semibold px-[20px] flex items-center gap-[8px] cursor-pointer whitespace-nowrap shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
                  >
                    <Image
                      src="/ai_enterprise/Arrow - Right 4.png"
                      alt="arrow"
                      width={10}
                      height={6}
                      className="w-[20px] h-[20px] object-contain shrink-0"
                    />
                    {item}
                  </button>
                ))}
              </div>

              <button
                className="mt-10 w-full max-w-[550px] h-[50px] rounded-[10px] text-white text-[16px] leading-[100%] tracking-[0.02em] font-semibold cursor-pointer flex items-center justify-center gap-[8px] whitespace-nowrap shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
                style={{
                  background:
                    "linear-gradient(270deg, #087DF3 0%, #4835C6 50%, #B11C58 100%)",
                }}
              >
                GENERATE BLUEPRINT →
              </button>
            </div>

            <div className="lg:col-span-1 xl:col-span-2">
              <h3 className="text-center text-white text-[20px] sm:text-[24px] leading-[100%] tracking-[0.02em] font-semibold">
                YOUR AI ENTERPRISE BLUEPRINT
              </h3>

              <div className="mt-8 grid grid-cols-1 lg:grid-cols-[302px_1fr_302px] gap-6">
                <div className="space-y-5">
                  <div className="min-h-[150px] rounded-[14px] border border-white/20 bg-[#07101f] px-[22px] py-6">
                    <h4 className="text-white text-[18px] leading-[100%] tracking-[0.02em] font-semibold text-center whitespace-nowrap">
                      AI OPERATING MODEL
                    </h4>
                    <div className="mt-5 space-y-4 text-[16px] leading-[100%] tracking-[0.02em] font-semibold text-white">
                      {[
                        "Intelligent Workforce",
                        "Agentic Automation",
                        "Decision Intelligence",
                        "Continuous Learning",
                      ].map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-2 whitespace-nowrap"
                        >
                          <Image
                            src="/ai_enterprise/Arrow - Right 4.png"
                            alt="arrow"
                            width={10}
                            height={6}
                            className="w-[20px] h-[20px] object-contain shrink-0"
                          />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="min-h-[110px] rounded-[14px] border border-white/20 bg-[#07101f] p-6 flex flex-col justify-center cursor-pointer">
                    <h4 className="text-white text-[18px] leading-[100%] tracking-[0.02em] font-semibold whitespace-nowrap">
                      AGENT ECOSYSTEM
                    </h4>
                    <p className="mt-3 text-[#C1C1C1] text-[18px] leading-[100%] tracking-[0px] font-medium whitespace-nowrap">
                      24 Agents Recommended
                    </p>
                  </div>
                </div>

                <div className="min-h-[260px] rounded-[18px] flex items-center justify-center cursor-pointer">
                  <Image
                    src="/ai_enterprise/main.png"
                    alt="AI Enterprise Blueprint"
                    width={637}
                    height={404}
                    className="w-full max-w-[637px] h-auto object-contain"
                  />
                </div>

                <div className="space-y-5">
                  <div className="min-h-[150px] rounded-[14px] border border-white/20 bg-[#07101f] px-3 py-6">
                    <h4 className="text-white text-[18px] leading-[100%] tracking-[0.02em] font-semibold text-center whitespace-nowrap">
                      AI ARCHITECTURE
                    </h4>
                    <div className="mt-5 space-y-4 text-sm font-semibold text-white/90">
                      {[
                        "Data & Intelligence Layer",
                        "AI & Agent Layer",
                        "Orchestration Layer",
                        "Integration Layer",
                      ].map((item) => (
                        <div key={item} className="flex items-center gap-2 min-w-0">
                          <Image
                            src="/ai_enterprise/Arrow - Right 4.png"
                            alt="arrow"
                            width={10}
                            height={6}
                            className="w-[20px] h-[20px] object-contain shrink-0"
                          />
                          <span className="text-[16px] leading-[100%] tracking-[0.02em] font-semibold text-white whitespace-nowrap">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="min-h-[110px] rounded-[14px] border border-white/20 bg-[#07101f] px-3 py-6 flex flex-col items-center justify-center text-center">
                    <h4 className="text-white text-[18px] leading-[100%] tracking-[0.02em] font-semibold whitespace-nowrap">
                      GOVERNANCE FRAMEWORK
                    </h4>
                    <p className="mt-3 text-[#C1C1C1] text-[18px] leading-[26px] font-medium text-center">
                      Trust Risk Security Compliance
                      <br />
                      Ethics
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 w-full rounded-[16px] border border-white/20 bg-[#07101f] px-4 sm:px-8 py-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                  ["PHASE 1", "Foundation", "0-3 Months"],
                  ["PHASE 2", "Scale", "3-9 Months"],
                  ["PHASE 3", "Optimize", "9-18 Months"],
                  ["PHASE 4", "Autonomous Enterprise", "18+ Months"],
                ].map(([phase, title, time]) => (
                  <div key={phase} className="flex items-center gap-3 min-w-0">
                    <Image
                      src="/intellegent_enterprise/robot.svg"
                      alt="Robot"
                      width={38}
                      height={38}
                      className="w-[50px] h-[50px] object-contain shrink-0"
                    />
                    <div>
                      <p className="text-[#C1C1C1] text-[16px] leading-[100%] font-medium uppercase">
                        {phase}
                      </p>
                      <h5 className="text-[20px] leading-[100%] font-semibold text-white">
                        {title}
                      </h5>
                      <p className="text-[#C1C1C1] text-[18px] leading-[100%] font-medium">
                        {time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="w-full min-h-[586px] mt-0 bg-black px-6 pt-[56px] pb-[56px]">
          <div className="flex items-center justify-center gap-4 sm:gap-10">
            <div className="hidden sm:block h-[1px] w-[260px] bg-white/30" />
            <h2 className="text-[24px] sm:text-[30px] leading-[100%] tracking-[0px] font-medium text-center uppercase text-white">
              THE <span className="text-red-500">AI FOUNDRY</span> PROCESS
            </h2>
            <div className="hidden sm:block h-[1px] w-[260px] bg-white/30" />
          </div>

          <div className="mt-[48px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {[
              {
                title: "GARAGE",
                step: "01",
                name: "IDEATE",
                desc: "We explore ideas, problems and possibilities.",
                icon: "/ai_foundary/garage.svg",
                color: "text-[#F74539]",
                borderGradient:
                  "linear-gradient(149.2deg, #F74539 1.08%, #8E99B7 98.68%)",
              },
              {
                title: "FOUNDRY",
                step: "02",
                name: "FORGE",
                desc: "We engineer, train and forge AI models and agents.",
                icon: "/ai_foundary/foundry.svg",
                color: "text-[#E98828]",
                borderGradient:
                  "linear-gradient(155.78deg, #E98828 3.75%, #8E99B7 98.35%)",
              },
              {
                title: "FACTORY",
                step: "03",
                name: "ORCHESTRATE",
                desc: "We orchestrate intelligent workflows and integrate systems.",
                icon: "/ai_foundary/factory.svg",
                color: "text-[#0186E4]",
                borderGradient:
                  "linear-gradient(149.2deg, #24ABFF 1.91%, #8E99B7 97.57%)",
              },
              {
                title: "DEPLOY",
                step: "04",
                name: "DEPLOY",
                desc: "We launch AI solutions into your enterprise environment.",
                icon: "/ai_foundary/deploy.svg",
                color: "text-[#0D95E9]",
                borderGradient:
                  "linear-gradient(149.1deg, #FF3424 1.89%, #8E99B7 97.91%)",
              },
              {
                title: "EVOLVE",
                step: "05",
                name: "EVOLVE",
                desc: "We monitor, learn and continuously evolve for greater impact.",
                icon: "/ai_foundary/evolve.svg",
                color: "text-[#976BFF]",
                borderGradient:
                  "linear-gradient(150.6deg, #976BFF 1.33%, #8E99B7 98.72%)",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="min-h-[420px] rounded-[20px] p-[1px]"
                style={{ background: item.borderGradient }}
              >
                <div className="h-full rounded-[19px] bg-[#000102] p-6 flex flex-col">
                  <h3
                    className={`text-center text-[30px] leading-[100%] font-semibold uppercase ${item.color}`}
                  >
                    {item.title}
                  </h3>

                  <div className="mt-6 flex justify-center">
                    <img
                      src={item.icon}
                      alt={item.title}
                      className="w-[130px] h-[130px] object-contain"
                    />
                  </div>

                  <div className="mt-auto">
                    <p className="text-[30px] leading-[100%] font-medium text-white">
                      {item.step}
                    </p>

                    <h4 className="mt-1 text-[30px] leading-[100%] font-medium text-white uppercase">
                      {item.name}
                    </h4>

                    <p className="mt-3 text-[18px] leading-[100%] font-medium text-[#C1C1C1]">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-[40px] mb-[-60px] text-center text-[20px] sm:text-[26px] leading-[130%] sm:leading-[100%] tracking-[0px] font-medium uppercase text-white">
            BUILT IN OUR <span className="text-[#F74539]">GARAGE.</span>{" "}
            FORGED IN OUR <span className="text-[#E98828]">FOUNDRY.</span>{" "}
            DEPLOYED IN YOUR <span className="text-[#0186E4]">FACTORY.</span>
          </p>
        </section>

        <section className="w-full min-h-[531px] mt-0 px-6 pt-[56px] pb-[56px]">
          <div className="flex items-center justify-center gap-4">
            <div
              className="hidden sm:block h-[1px] w-[120px]"
              style={{
                background: "linear-gradient(270deg, #FFFFFF 0%, #000000 100%)",
              }}
            />

            <p className="text-[#408CFF] text-[24px] sm:text-[30px] leading-[100%] tracking-[0px] font-medium uppercase">
              INDUSTRY SOLUTIONS
            </p>

            <div
              className="hidden sm:block h-[1px] w-[120px]"
              style={{
                background: "linear-gradient(90deg, #FFFFFF 0%, #000000 100%)",
              }}
            />
          </div>

          <h2 className="mt-[32px] text-center text-[30px] sm:text-[40px] leading-[115%] sm:leading-[100%] tracking-[0px] font-semibold uppercase text-white">
            AI SOLUTIONS FOR THE{" "}
            <span className="text-[#47B9FF]">NEXT GENERATION</span> ENTERPRISE
          </h2>

          <div className="mt-[48px] mb-[-60px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {[
              {
                title: "AGENTIC AI SYSTEMS",
                icon: "/what_we_build/agentic-ai.svg",
                desc: "Autonomous agents that plan, reason and execute complex enterprise tasks.",
                more: "Detailed information about Agentic AI Systems.",
                borderColor: "background: linear-gradient(270deg, #000000 49.66%, #FF0004 100%)",
              },
              {
                title: "AI STRATEGY & ADVISORY",
                icon: "/what_we_build/strategy.svg",
                desc: "Roadmaps and operating models for AI-driven transformation.",
                more: "Detailed information about AI Strategy & Advisory.",
                borderColor: "#321716",
              },
              {
                title: "AI ENGINEERING",
                icon: "/what_we_build/engineering.svg",
                desc: "Custom AI solutions and platforms built for scale.",
                more: "Detailed information about AI Engineering.",
                borderColor: "#582F19",
              },
              {
                title: "INTELLIGENT AUTOMATION",
                icon: "/what_we_build/automation.svg",
                desc: "End-to-end automation of enterprise workflows.",
                more: "Detailed information about Intelligent Automation.",
                borderColor: "#003881",
              },
              {
                title: "AI GOVERNANCE",
                icon: "/what_we_build/governance.svg",
                desc: "Responsible AI with trust, transparency and compliance.",
                more: "Detailed information about AI Governance.",
                borderColor: "#192636",
              },
              {
                title: "AI LABS & INNOVATION",
                icon: "/what_we_build/labs.svg",
                desc: "Co-innovate in our labs and build what's next.",
                more: "Detailed information about AI Labs.",
                borderColor: "#250537",
              },
            ].map((item, index) => (
  <div key={item.title} className="flex flex-col">
    <div
      className="min-h-[330px] rounded-[16px] border bg-[#000102] p-5 flex flex-col"
      style={{ borderColor: item.borderColor }}
    >
                <div className="flex justify-center">
                  <img
                    src={item.icon}
                    alt={item.title}
                    className="w-[70px] h-[70px] object-contain"
                  />
                </div>

                <h3 className="mt-8 text-[18px] leading-[100%] font-semibold text-white">
                  {item.title}
                </h3>

                <p className="mt-4 text-[18px] leading-[100%] font-medium text-[#C1C1C1]">
                  {item.desc}
                </p>

                <div className="mt-auto pt-4">
                  <button
        onClick={() =>
          setOpenSolution(openSolution === index ? null : index)
        }
      >
        Learn More →
      </button>
    </div>

    </div>

{openSolution === index && (
  <div className="block md:hidden mt-4 w-full rounded-[16px] border border-white/20 bg-[#07101f] p-4">
    {item.more}
  </div>
)}
</div>
))} 
 </div> {/* cards grid close */}

{openSolution !== null && (
  <div className="mt-25 w-full rounded-[20px] border border-white/10 bg-[#0A0A0A] p-8">
    <p className="text-white/70">
      {
        [
          "Detailed information about Agentic AI Systems.",
          "Detailed information about AI Strategy & Advisory.",
          "Detailed information about AI Engineering.",
          "Detailed information about Intelligent Automation.",
          "Detailed information about AI Governance.",
          "Detailed information about AI Labs & Innovation."
        ][openSolution]
      }
    </p>
  </div>
)}
        </section>

        <section className="w-full min-h-[610px] mt--10  bg-black px-6 pt-[56px] pb-[56px]">
          <div className="flex items-center justify-center gap-4 sm:gap-10">
            <div
              className="hidden sm:block h-[1px] w-[333px]"
              style={{
                background: "linear-gradient(270deg, #FFFFFF 0%, #000000 100%)",
              }}
            />

            <h2 className="text-[#408CFF] text-[24px] sm:text-[30px] leading-[100%] tracking-[0px] font-medium text-center uppercase">
              INSIGHTS
            </h2>

            <div
              className="hidden sm:block h-[1px] w-[333px]"
              style={{
                background: "linear-gradient(90deg, #FFFFFF 0%, #000000 100%)",
              }}
            />
          </div>

          <div className="mt-[48px]  grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="min-h-[420px] rounded-[10px] border p-6 flex flex-col backdrop-blur-[40px]"
                style={{
                  background: "rgba(0, 0, 0, 0.1)",
                  border: "1px solid #171717",
                }}
              >
                <img
                  src="/insights/insight.svg"
                  alt="Agentic AI Lab"
                  className="w-full h-[190px] object-contain"
                />

                <h3 className="mt-6 text-[24px] leading-[30px] tracking-[0.02em] font-bold text-white">
                  AGENTIC AI LAB
                </h3>

                <p className="mt-5 text-[18px] leading-[29px] tracking-[0.02em] font-medium text-[#C1C1C1]">
                  Services Across Singapore, UK & India GFF AI continues
                  expanding its enterprise AI consulting, engineering, AI
                  training, and Agentic...
                </p>

                <button className="mt-auto pt-6 text-[#449AEB] text-[16px] leading-[24px] font-medium cursor-pointer">
                  EXPLORE LAB →
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="relative w-full min-h-[760px] mt-0 bg-black overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:h-[430px]">
            <div className="relative h-[300px] lg:h-full">
              <img
                src="/garage/main.svg"
                alt="Garage"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="h-full bg-black flex items-center px-6 lg:pl-[60px] py-10 lg:py-0">
              <h2 className="text-white font-semibold uppercase text-[30px] sm:text-[40px] leading-[42px] sm:leading-[58px] tracking-[0.01em]">
                BUILT IN OUR GARAGE.
                <br />
                FORGED IN OUR FOUNDRY.
                <br />
                DEPLOYED IN YOUR
                <br />
                ENTERPRISE.
              </h2>
            </div>
          </div>

<div className="relative z-20 mt-8 lg:-mt-[70px] mx-auto max-w-[1746px] px-4 sm:px-8 lg:px-[63px]">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-[24px]">
    {[
      {
        title: "Mission",
        desc: "Autonomous agents that plan, reason and execute complex enterprise tasks.",
        icon: "/garage/mission.svg",
        borderGradient:
          "linear-gradient(149.2deg,#422B2A 1.08%,#09112B 98.68%)",
      },
      {
        title: "Leadership",
        desc: "Roadmaps and operating models for AI-driven transformation.",
        icon: "/garage/Leadership.svg",
        borderGradient:
          "linear-gradient(149.2deg,#321716 1.08%,#09112B 98.68%)",
      },
      {
        title: "Locations",
        desc: "Custom AI solutions and platforms built for scale.",
        icon: "/garage/Location .svg",
        borderGradient:
          "linear-gradient(149.2deg,#582F19 1.08%,#09112B 98.68%)",
      },
      {
        title: "Partners",
        desc: "End-to-end automation of enterprise workflows with AI at the core.",
        icon: "/garage/end-end.svg",
        borderGradient:
          "linear-gradient(149.2deg,#003881 1.08%,#09112B 98.68%)",
      },
      {
        title: "Advisors",
        desc: "Responsible AI with trust, transparency and compliance.",
        icon: "/garage/advisors.svg",
        borderGradient:
          "linear-gradient(149.2deg,#192636 1.08%,#182F76 98.68%)",
      },
      {
        title: "Investors",
        desc: "Co-innovate in our labs and build what's next, together.",
        icon: "/garage/investors.svg",
        borderGradient:
          "linear-gradient(149.2deg,#250537 1.08%,#182F76 98.68%)",
      },
    ].map((item) => (
      <div
        key={item.title}
        className="relative w-full max-w-[282px] h-[330px] rounded-[28px] overflow-hidden bg-[rgba(0,1,2,0.04)] backdrop-blur-[8px] px-[20px] pt-[34px] pb-[24px] flex flex-col mx-auto"
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-[28px] p-[1px]"
          style={{
            background: item.borderGradient,
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />

        {/* Centered Icon */}
        <div className="w-full flex justify-center items-center mb-[24px]">
          <img
            src={item.icon}
            alt={item.title}
            className="w-[72px] h-[72px] object-contain"
          />
        </div>

        <h3 className="text-[18px] leading-[100%] tracking-[0px] font-semibold text-white">
          {item.title}
        </h3>

        <p className="mt-[14px] text-[#C1C1C1] text-[18px] leading-[100%] tracking-[0px] font-medium">
          {item.desc}
        </p>

        <button className="mt-auto text-[#FF2B2B] text-[16px] leading-[24px] tracking-[0px] font-medium text-left cursor-pointer">
          Learn More →
        </button>
      </div>
    ))}
  </div>
</div>
        </section>

        <section className="w-full mt-0 bg-black px-6 py-10 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-[56%_44%] gap-0 items-center max-w-[1500px] mx-auto">
            <div className="w-full min-h-[260px] md:min-h-[360px] lg:min-h-[430px] flex items-center justify-center overflow-hidden bg-black">
              <ThreeDView />
            </div>
<div
  className="relative w-full max-w-[853px] min-h-[475px] rounded-[10px] bg-[#0000001A] backdrop-blur-[40px] p-6 md:p-8"
  style={{
    border: "1px solid transparent",
  }}
>
  <div
    className="pointer-events-none absolute inset-0 rounded-[10px]"
    style={{
      border: "1px solid transparent",
      background:
        "linear-gradient(180deg, #78A7FF 0%, #57000F 100%) border-box",
      WebkitMask:
        "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
      WebkitMaskComposite: "xor",
      maskComposite: "exclude",
    }}
  />

  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
    {[
      "Full Name",
      "Enter your full name",
      "Company / Organization",
      "Enter company or institution name",
      "Business Email",
      "Enter your official email address",
    ].map((label) => (
      <div key={label}>
        <label className="block text-white font-[var(--font-montserrat)] font-medium text-[15px] sm:text-[16px] lg:text-[18px] leading-[100%] tracking-[0.02em] whitespace-nowrap overflow-hidden text-ellipsis">
          {label}
        </label>
        <input
          placeholder="Enter"
          className="mt-3 w-full h-[50px] rounded-[18px] border border-[#1A2145] bg-[#16060680] px-4 text-white outline-none font-[var(--font-montserrat)] font-medium text-[18px] leading-[100%] tracking-[0.02em] placeholder:text-[#C1C1C1]"
          style={{
            boxShadow: "inset 0 0 0 1px rgba(120,167,255,0.08)",
          }}
        />
      </div>
    ))}
  </div>

  <div className="mt-10 w-full rounded-full p-[2px] shadow-[0px_4px_4px_0px_#00000040] bg-[linear-gradient(90deg,#9A0003_0%,#1173BC_100%)]">
    <button className="w-full h-[42px] rounded-full text-white text-[13px] font-semibold backdrop-blur-[40px] bg-[linear-gradient(90deg,rgba(85,6,7,0.213)_0%,rgba(7,78,156,0.24)_100%)] cursor-pointer">
      Send Message
    </button>
  </div>
</div>
          </div>
        </section>

        <footer className="w-full mt-0 bg-black">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 py-14">
            <div className="grid grid-cols-1 md:grid-cols-[1.7fr_1fr_1fr_1.2fr] gap-12">
              <div>
                <div className="flex items-center gap-3">
                  <img
                    src="/footer/logo.svg"
                    alt="Logo"
                    className="h-[55px] w-auto object-contain"
                  />

                  <img
                    src="/footer/text.png"
                    alt="GFF AI"
                    className="h-[32px] w-auto object-contain"
                  />
                </div>

                <p className="mt-6 text-white/70 text-[14px] leading-8 max-w-[380px]">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s.
                </p>

                <div className="flex items-center gap-5 mt-8 text-white text-xl">
                  <img
                    src="/footer/linkedin.png"
                    alt="LinkedIn"
                    className="w-5 h-5 object-contain brightness-0 invert cursor-pointer"
                  />

                  <img
                    src="/footer/twitter.png"
                    alt="Twitter"
                    className="w-5 h-5 object-contain brightness-0 invert cursor-pointer"
                  />

                  <img
                    src="/footer/mail.png"
                    alt="mail"
                    className="w-5 h-5 object-contain brightness-0 invert cursor-pointer"
                  />

                  <img
                    src="/footer/youtube.png"
                    alt="Youtube"
                    className="w-5 h-5 object-contain brightness-0 invert cursor-pointer"
                  />

                  <img
                    src="/footer/instagram.png"
                    alt="Instagram"
                    className="w-5 h-5 object-contain brightness-0 invert cursor-pointer"
                  />
                </div>
              </div>

              {[
  {
    title: "Information",
    items: [
      "Responsible AI",
      "Careers",
      "Resources",
      "About Us",
      "Contact Us",
      "Privacy Policy",
      "Terms & Conditions",
    ],
  },
  {
    title: "Service",
    items: [
      "AI Chips",
      "Authentication",
      "Edtech",
      "Femtech",
      "TravelTech",
      "Proptech",
    ],
  },
].map((col) => (
  <div key={col.title}>
    <h3 className="text-white text-[28px] font-semibold">
      {col.title}
    </h3>

    <div
      className="mt-[10px] h-[1px] w-[149px]"
      style={{
        background:
          "linear-gradient(270deg, #000000 49.66%, #FF0004 100%)",
      }}
    />

    <div className="mt-[34px] space-y-[18px] text-[14px]">
      {col.items.map((item) => (
        <button
          key={item}
          type="button"
          className="block text-white/70 hover:text-white transition-colors duration-300 cursor-pointer text-left"
        >
          {item}
        </button>
      ))}
    </div>
  </div>
))}

              <div>
                <h3 className="text-white text-[28px] font-semibold">
                  Contact Info
                </h3>

                <div
                  className="mt-[10px] h-[1px] w-[149px]"
                  style={{
                    background:
                      "linear-gradient(270deg, #000000 49.66%, #FF0004 100%)",
                  }}
                />

                <div className="mt-[34px] space-y-[24px] text-white/70 text-[14px]">
                  <p>71 Pennington Lane Vernon Rockville, CT 06066</p>
                  <p>✉ thefactoryai@gmail.com</p>
                  <p>☎ 12345 67890</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 py-5 text-center text-white/60 text-[13px]">
            © 2017-2026 Lorem Ipsum All Rights Reserved
          </div>
        </footer>
      </div>
    </main>
  );
}