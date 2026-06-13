"use client";
import ThreeDView from "../component/3d_view";
import { useState } from "react";
import Image from "next/image";
export default function Home() {
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [openSolution, setOpenSolution] = useState<number | null>(null);
  return (
    <main className="min-h-screen bg-[#010101] text-white overflow-x-hidden">
      <div className="w-full max-w-[1920px] mx-auto bg-[#010101] overflow-x-hidden">

        <section className="relative w-full min-h-[520px] md:min-h-[700px]">
          <header className="w-full h-auto md:h-[96px] bg-black flex flex-wrap md:flex-nowrap items-center justify-between gap-4 px-4 md:px-8 py-4">
            <div className="flex items-center">
              <img
                src="/footer/logo.png"
                alt="GFF AI"
                className="w-[50px] md:w-[50px] h-auto object-contain"
              />
            </div>

            <div className="hidden md:flex items-center gap-8 text-sm text-white">
  <button className="cursor-pointer hover:text-red-400 transition-colors cursor-pointer">
    Global Navigation
  </button>

  <button className="cursor-pointer hover:text-red-400 transition-colors cursor-pointer">
    Home
  </button>

  <button className="cursor-pointer hover:text-red-400 transition-colors cursor-pointer">
    Capabilities
  </button>

  <button className="cursor-pointer hover:text-red-400 transition-colors cursor-pointer">
    Industries
  </button>

  <button className="cursor-pointer hover:text-red-400 transition-colors cursor-pointer">
    Platforms
  </button>

  <button className="cursor-pointer hover:text-red-400 transition-colors cursor-pointer">
    Build With Gff
  </button>

  <button className="cursor-pointer hover:text-red-400 transition-colors cursor-pointer">
    Client Portal
  </button>

  <button className="cursor-pointer hover:text-red-400 transition-colors cursor-pointer">
    Insights
  </button>

  <button className="cursor-pointer hover:text-red-400 transition-colors cursor-pointer">
    Company
  </button>
</div>

            <button className="h-[42px] px-6 rounded-full bg-gradient-to-r from-red-500 to-blue-500 text-white text-sm font-medium cursor-pointer">
              Book a Consultation
            </button>
          </header>
          <div className="relative z-10 mt-8 md:mt-[120px] mx-4 md:ml-16 w-auto md:w-full max-w-[705px] min-h-[376px]">  <h1 className="text-[30px] sm:text-[42px] md:text-[52px] lg:text-[60px] leading-[1.08] font-bold">
            The Intelligent
            <br />
            <span className="bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
              Enterprise
            </span>{" "}
            Starts Here
          </h1>

            <p className="mt-7 max-w-[620px] text-[15px] sm:text-[17px] leading-8 text-white">
              Why GFF- Garage to Foundry to Factory- Industries- Interactive AI
              Experience- Customer Stories- Live Metrics- Insights- Contact
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 w-full sm:w-fit">
              <button className="h-[40px] w-full sm:w-full sm:min-w-[190px] px-5 rounded-full border border-[#969696] text-white text-[15px] font-medium flex items-center justify-center gap-3 cursor-pointer">
                <Image
                  src="/intellegent_enterprise/industry.png"
                  alt="Industry"
                  width={18}
                  height={18}
                />
                Explore Foundry
              </button>

              <button className="h-[40px] w-full sm:w-full sm:min-w-[190px] px-5 rounded-full border border-[#969696] text-white text-[15px] font-medium flex items-center justify-center gap-2 cursor-pointer">
                <Image
                  src="/intellegent_enterprise/internet.png"
                  alt="AI Journey"
                  width={18}
                  height={18}
                />
                Start AI Journey
              </button>

              <button className="h-[40px] w-full sm:w-full sm:min-w-[190px] px-5 rounded-full border border-[#969696] text-white text-[15px] font-medium flex items-center justify-center gap-2 cursor-pointer">
                <Image
                  src="/intellegent_enterprise/robot.png"
                  alt="Agent"
                  width={18}
                  height={18}
                />
                Talk to Agent
              </button>

              <button className="h-[40px] w-full sm:w-full sm:min-w-[190px] px-5 rounded-full border border-[#969696] text-white text-[15px] font-medium flex items-center justify-center gap-2 cursor-pointer">
                <Image
                  src="/intellegent_enterprise/blueprint.png"
                  alt="Blueprint"
                  width={18}
                  height={18}
                />
                Generate Blueprint
              </button>
            </div>
          </div>
          {/* Video Block */}
          <div className="absolute top-[84px] right-0 w-[58%] h-[calc(100%-84px)]">
            <div className="w-full h-full bg-[#0B0B0B] border border-[#1A1A1A] overflow-hidden">

              {/* Temporary Placeholder */}
              <div className="w-full h-full flex items-center justify-center text-white/40 text-3xl font-semibold">
                HERO VIDEO
              </div>

              {/* Later replace with video */}
              {/*
    <video
      autoPlay
      muted
      loop
      playsInline
      className="w-full h-full object-cover"
    >
      <source src="/videos/hero.mp4" type="video/mp4" />
    </video>
    */}

            </div>
          </div>
        </section>

        <section className="w-full min-h-[420px] md:min-h-[562px]mt-0 px-6 py-10">
          <div className="text-center">
            <h2 className="text-2xl md:text-4xl font-bold uppercase">
              TALK TO AN AI AGENT
            </h2>
            <p className="mt-3 text-sm md:text-base text-white/70">
              Get instant insights, strategies and roadmaps from our Ai-powered expert agents.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="min-h-[250px] rounded-[12px] border border-red-500/40 bg-black p-6 flex flex-col items-center justify-center text-center">
              <Image
                src="/talk-to-an-ai-agent/strategy-agent.png"
                alt="Strategy Agent"
                width={100}
                height={100}
                className="w-[100px] h-[100px] object-contain"
              />
              <h3 className="mt-8 text-red-500 text-lg font-bold">STRATEGY AGENT</h3>
              <p className="mt-4 text-sm text-white/70">
                AI transformation strategy and roadmap advisor
              </p>
              <button
                onClick={() => setActiveAgent("Strategy Agent")}
                className="mt-6 text-red-500 text-sm font-medium cursor-pointer"
              >
                TALK NOW →
              </button>
            </div>

            <div className="min-h-[250px] rounded-[12px] border border-sky-500/40 bg-black p-6 flex flex-col items-center justify-center text-center">
              <Image
                src="/talk-to-an-ai-agent/architect-agent.png"
                alt="AI Architect Agent"
                width={100}
                height={100}
                className="w-[100px] h-[100px] object-contain"
              />
              <h3 className="mt-8 text-sky-500 text-lg font-bold">AI ARCHITECT AGENT</h3>
              <p className="mt-4 text-sm text-white/70">
                Enterprise AI architecture and solution designer
              </p>
              <button
                onClick={() => setActiveAgent("AI ARCHITECT AGENT")}
                className="mt-6 text-emerald-500 text-sm font-medium cursor-pointer"
              >
                TALK NOW →
              </button>
            </div>

            <div className="min-h-[250px] rounded-[12px] border border-emerald-500/40 bg-black p-6 flex flex-col items-center justify-center text-center">
              <Image
                src="/talk-to-an-ai-agent/governance-agent.png"
                alt="Governance Agent"
                width={100}
                height={100}
                className="w-[100px] h-[100px] object-contain"
              />
              <h3 className="mt-8 text-emerald-500 text-lg font-bold">GOVERNANCE AGENT</h3>
              <p className="mt-4 text-sm text-white/70">
                AI governance, risk and compliance expert
              </p>
              <button
                onClick={() => setActiveAgent("Governance Agent")}
                className="mt-6 text-emerald-500 text-sm font-medium cursor-pointer"
              >
                TALK NOW →
              </button>
            </div>

            <div className="min-h-[250px] rounded-[12px] border border-orange-500/40 bg-black p-6 flex flex-col items-center justify-center text-center">
              <Image
                src="/talk-to-an-ai-agent/industry-agent.png"
                alt="Industry Agent"
                width={100}
                height={100}
                className="w-[100px] h-[100px] object-contain"
              />
              <h3 className="mt-8 text-orange-500 text-lg font-bold">INDUSTRY AGENT</h3>
              <p className="mt-4 text-sm text-white/70">
                Industry-specific AI use cases and transformation guide
              </p>
              <button
                onClick={() => setActiveAgent("Industry Agent")}
                className="mt-6 text-orange-500 text-sm font-medium cursor-pointer"
              >
                TALK NOW →
              </button>
            </div>

            <div className="min-h-[250px] rounded-[12px] border border-purple-500/40 bg-black p-6 flex flex-col items-center justify-center text-center">
              <Image
                src="/talk-to-an-ai-agent/training-agent.png"
                alt="Training Agent"
                width={100}
                height={100}
                className="w-[100px] h-[100px] object-contain"
              />
              <h3 className="mt-8 text-purple-500 text-lg font-bold">TRAINING ADVISOR</h3>
              <p className="mt-4 text-sm text-white/70">
                AI talent, training and capability advisor
              </p>
              <button
                onClick={() => setActiveAgent("Training Agent")}
                className="mt-6 text-purple-500 text-sm font-medium cursor-pointer"
              >
                TALK NOW →
              </button>
            </div>
          </div>
          {activeAgent && (
            <div className="mt-10 w-full max-w-[900px] mx-auto rounded-[18px]/50 bg-[#050505] p-6 md:p-8">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-2xl md:text-3xl font-bold text-white">
                  {activeAgent}
                </h3>

                <button
                  onClick={() => setActiveAgent(null)}
                  className="text-white/60 hover:text-white text-xl cursor-pointer"
                >
                  ×
                </button>
              </div>

              <p className="mt-3 text-white/70 text-sm md:text-base">
                Ask anything to {activeAgent}.
              </p>

              <div className="mt-6 flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  placeholder={`Message ${activeAgent}`}
                  className="w-full h-[48px] rounded-full border border-white/20 bg-black px-5 text-white outline-none placeholder:text-white/40"
                />

                <button className="h-[48px] px-8 rounded-full bg-gradient-to-r from-red-500 to-blue-500 text-white font-semibold cursor-pointer">
                  Send
                </button>
              </div>
            </div>
          )}
        </section>
        {/*AI Enterprise Blueprint*/}
        <section className="w-full min-h-[460px] md:min-h-[633px]mt-0 bg-[#020711] px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr_320px] gap-8">

            {/* Left */}
            <div>
              <h2 className="text-[34px] leading-tight font-bold text-white">
                BUILD YOUR <br /> AI ENTERPRISE
              </h2>

              <p className="mt-6 text-white/70 text-[15px] leading-5">
                Answer a few questions. Our AI engine will design your operating model,
                architecture, agent ecosystem and transformation roadmap.
              </p>

              <div className="mt-10 grid grid-cols-2 gap-3">
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
                    className="h-[44px] rounded-[8px] border border-white/15 bg-[#07101f] text-white text-[13px] font-semibold px-4 flex items-center gap-2 cursor-pointer"
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

              <button className="mt-10 w-full h-[52px] rounded-[8px] bg-gradient-to-r from-pink-600 to-blue-500 text-white text-[13px] font-bold cursor-pointer">
                GENERATE BLUEPRINT →
              </button>
            </div>

            {/* Center + Right */}
            <div className="lg:col-span-2">
              <h3 className="text-center text-[20px] font-bold tracking-wide">
                YOUR AI ENTERPRISE BLUEPRINT
              </h3>

              <div className="mt-8 grid grid-cols-1 lg:grid-cols-[240px_1fr_240px] gap-6">
                <div className="space-y-5">
                  <div className="min-h-[150px] rounded-[14px] border border-white/20 bg-[#07101f] p-6">
                    <h4 className="font-bold text-sm">AI OPERATING MODEL</h4>
                    <div className="mt-5 space-y-4 text-sm font-semibold text-white/90">
                      {[
                        "Intelligent Workforce",
                        "Agentic Automation",
                        "Decision Intelligence",
                        "Continuous Learning",
                      ].map((item) => (
                        <div key={item} className="flex items-center gap-2">
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
                    <h4 className="font-bold text-sm">AGENT ECOSYSTEM</h4>
                    <p className="mt-3 text-white/70">24 Agents Recommended</p>
                  </div>
                </div>

                <div className="min-h-[260px] rounded-[18px] flex items-center justify-center cursor-pointer">
                  <Image
                    src="/ai_enterprise/main.png"
                    alt="AI Enterprise Blueprint"
                    width={520}
                    height={380}
                    className="w-full max-w-[560px] h-auto object-contain"
                  />
                </div>

                <div className="space-y-5">
                  <div className="min-h-[150px] rounded-[14px] border border-white/20 bg-[#07101f] p-6">
                    <h4 className="text-center font-bold text-sm">AI ARCHITECTURE</h4>
                    <div className="mt-5 space-y-4 text-sm font-semibold text-white/90">
                      {[
                        "Data & Intelligence Layer",
                        "AI & Agent Layer",
                        "Orchestration Layer",
                        "Integration Layer",
                      ].map((item) => (
                        <div key={item} className="flex items-center gap-2">
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

                  <div className="min-h-[110px] rounded-[14px] border border-white/20 bg-[#07101f] p-6 flex flex-col items-center justify-center text-center">
                    <h4 className="font-bold text-sm">GOVERNANCE FRAMEWORK</h4>
                    <p className="mt-3 text-white/70">
                      Trust Risk Security Compliance Ethics
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 w-full rounded-[16px] border border-white/20 bg-[#07101f] px-8 py-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {[
                  ["PHASE 1", "Foundation", "0-3 Months"],
                  ["PHASE 2", "Scale", "3-9 Months"],
                  ["PHASE 3", "Optimize", "9-18 Months"],
                  ["PHASE 4", "Autonomous Enterprise", "18+ Months"],
                ].map(([phase, title, time]) => (
                  <div key={phase} className="flex items-center gap-4">
                    <Image
                      src="/intellegent_enterprise/robot.png"
                      alt="Robot"
                      width={38}
                      height={38}
                      className="w-[28px] h-[28px] object-contain shrink-0 "
                    />

                    <div>
                      <p className="text-white/60 text-[11px] uppercase">{phase}</p>
                      <h5 className="text-[16px] font-bold leading-tight text-white">
                        {title}
                      </h5>
                      <p className="text-white/70 text-[12px] ">{time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>
        <section className="w-full min-h-[586px]mt-0 bg-black px-6 py-8">
          <div className="flex items-center justify-center gap-10">
            <div className="h-[1px] w-[260px] bg-white/30" />
            <h2 className="text-[28px] font-medium tracking-wide text-white">
              THE <span className="text-red-500">AI FOUNDRY</span> PROCESS
            </h2>
            <div className="h-[1px] w-[260px] bg-white/30" />
          </div>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              {
                title: "GARAGE",
                step: "01",
                name: "IDEATE",
                desc: "We explore ideas, problems and possibilities.",
                icon: "/ai_foundary/garage.png",
                color: "text-red-500",
                border: "border-red-500/70",
              },
              {
                title: "FOUNDRY",
                step: "02",
                name: "FORGE",
                desc: "We engineer, train and forge AI models and agents.",
                icon: "/ai_foundary/foundry.png",
                color: "text-orange-500",
                border: "border-orange-500/70",
              },
              {
                title: "FACTORY",
                step: "03",
                name: "ORCHESTRATE",
                desc: "We orchestrate intelligent workflows and integrate systems.",
                icon: "/ai_foundary/factory.png",
                color: "text-sky-500",
                border: "border-sky-500/70",
              },
              {
                title: "DEPLOY",
                step: "04",
                name: "DEPLOY",
                desc: "We launch AI solutions into your enterprise environment.",
                icon: "/ai_foundary/deploy.png",
                color: "text-sky-500",
                border: "border-red-500/70",
              },
              {
                title: "EVOLVE",
                step: "05",
                name: "EVOLVE",
                desc: "We monitor, learn and continuously evolve for greater impact.",
                icon: "/ai_foundary/evolve.png",
                color: "text-purple-500",
                border: "border-purple-500/70",
              },
            ].map((item) => (
              <div
                key={item.title}
                className={`min-h-[420px] rounded-[14px] border ${item.border} bg-black p-6 flex flex-col`}
              >
                <h3 className={`text-center text-[26px] font-bold ${item.color}`}>
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
                  <p className="text-[24px] text-white">{item.step}</p>
                  <h4 className="mt-1 text-[26px] leading-none text-white">
                    {item.name}
                  </h4>
                  <p className="mt-3 text-[15px] leading-5 text-white/70">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-[22px] tracking-wide text-white">
            BUILT IN OUR <span className="text-red-500">GARAGE.</span>{" "}
            FORGED IN OUR <span className="text-orange-500">FOUNDRY.</span>{" "}
            DEPLOYED IN YOUR <span className="text-blue-500">FACTORY.</span>
          </p>
        </section>


        {/* What We Build */}
        <section className="w-full min-h-[531px]mt-0 px-6 py-8">

          <div className="flex items-center justify-center gap-4">
            <div className="h-[1px] w-[120px] bg-white/30" />
            <p className="text-sky-500 uppercase tracking-wider">
              What We Build
            </p>
            <div className="h-[1px] w-[120px] bg-white/30" />
          </div>

          <h2 className="mt-4 text-center text-3xl md:text-5xl font-bold">
            AI SOLUTIONS FOR THE{" "}
            <span className="text-sky-500">NEXT GENERATION</span>{" "}
            ENTERPRISE
          </h2>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">

            {[
              {
                title: "AGENTIC AI SYSTEMS",
                icon: "/what_we_build/agentic-ai.png",
                desc: "Autonomous agents that plan, reason and execute complex enterprise tasks.",
                more: "Detailed information about Agentic AI Systems."
              },
              {
                title: "AI STRATEGY & ADVISORY",
                icon: "/what_we_build/strategy.png",
                desc: "Roadmaps and operating models for AI-driven transformation.",
                more: "Detailed information about AI Strategy & Advisory."
              },
              {
                title: "AI ENGINEERING",
                icon: "/what_we_build/engineering.png",
                desc: "Custom AI solutions and platforms built for scale.",
                more: "Detailed information about AI Engineering."
              },
              {
                title: "INTELLIGENT AUTOMATION",
                icon: "/what_we_build/automation.png",
                desc: "End-to-end automation of enterprise workflows.",
                more: "Detailed information about Intelligent Automation."
              },
              {
                title: "AI GOVERNANCE",
                icon: "/what_we_build/governance.png",
                desc: "Responsible AI with trust, transparency and compliance.",
                more: "Detailed information about AI Governance."
              },
              {
                title: "AI LABS & INNOVATION",
                icon: "/what_we_build/labs.png",
                desc: "Co-innovate in our labs and build what's next.",
                more: "Detailed information about AI Labs."
              },
            ].map((item, index) => (
              <div
                key={item.title}
                className="min-h-[330px] rounded-[16px] border border-white/15 bg-black p-5 flex flex-col"
              >
                <div className="flex justify-center">
                  <img
                    src={item.icon}
                    alt={item.title}
                    className="w-[70px] h-[70px] object-contain"
                  />
                </div>

                <h3 className="mt-8 text-sm font-bold text-white">
                  {item.title}
                </h3>

                <p className="mt-4 text-sm text-white/70">
                  {item.desc}
                </p>

                <div className="mt-auto pt-4">
                  <button
                    onClick={() =>
                      setOpenSolution(openSolution === index ? null : index)
                    }
                    className="text-red-500 text-sm font-medium text-left cursor-pointer"
                  >
                    Learn More →
                  </button>
                </div>
              </div>
            ))}
          </div>
          {openSolution !== null && (
            <div className="mt-6 w-full rounded-[16px] border border-white/15 bg-[#080808] p-6 text-white/70">
              {
                [
                  "Detailed information about Agentic AI Systems.",
                  "Detailed information about AI Strategy & Advisory.",
                  "Detailed information about AI Engineering.",
                  "Detailed information about Intelligent Automation.",
                  "Detailed information about AI Governance.",
                  "Detailed information about AI Labs.",
                ][openSolution]
              }
            </div>
          )}

        </section>
        {/*Insights*/}
        <section className="w-full min-h-[610px]mt-0 bg-black px-6 py-8">
          <div className="flex items-center justify-center gap-10">
            <div className="h-[1px] w-[300px] bg-white/30" />
            <h2 className="text-[26px] font-medium tracking-wide text-blue-500">
              INSIGHTS
            </h2>
            <div className="h-[1px] w-[300px] bg-white/30" />
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="min-h-[420px] rounded-[10px] border border-white/10 bg-black p-6 flex flex-col"
              >
                <img
                  src="/insights/insight.jpg"
                  alt="Agentic AI Lab"
                  className="w-full h-[190px] object-contain"
                />

                <h3 className="mt-6 text-[20px] font-bold text-white">
                  AGENTIC AI LAB
                </h3>

                <p className="mt-5 text-[15px] leading-7 text-white/70">
                  Services Across Singapore, UK & India GFF AI continues expanding its
                  enterprise AI consulting, engineering, AI training, and Agentic...
                </p>

                <button className="mt-auto pt-6 text-blue-500 text-sm font-medium cursor-pointer">
                  EXPLORE LAB →
                </button>
              </div>
            ))}
          </div>
        </section>
        {/* GFF AI Garage */}
        <section className="relative w-full min-h-[760px]mt-0 bg-black overflow-hidden">
          {/* Top image + heading */}
          <div className="grid grid-cols-1 lg:grid-cols-2 h-[430px]">
            <div className="relative h-full">
              <img
                src="/garage/main.png"
                alt="Garage"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="h-full bg-black flex items-center pl-[40px] lg:pl-[60px]">
              <h2 className="text-white font-semibold uppercase text-[40px] leading-[58px] tracking-[0.01em]">
                BUILT IN OUR GRAAGE.
                <br />
                FORGED IN OUR FOUNDRY.
                <br />
                DEPLOYED IN YOUR
                <br />
                ENTERPRISE.
              </h2>
            </div>
          </div>

          {/* Cards */}
          {/* Cards */}
          <div className="relative z-20 -mt-[70px] mx-auto max-w-[1746px] px-4 sm:px-8 lg:px-[63px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-[24px]">
              {[
                {
                  title: "Mission",
                  desc: "Autonomous agents that plan, reason and execute complex enterprise tasks.",
                  icon: "/garage/mission.png",
                  borderGradient:
                    "linear-gradient(149.2deg,#422B2A 1.08%,#09112B 98.68%)",
                },
                {
                  title: "Leadership",
                  desc: "Roadmaps and operating models for AI-driven transformation.",
                  icon: "/garage/Leadership.png",
                  borderGradient:
                    "linear-gradient(149.2deg,#321716 1.08%,#09112B 98.68%)",
                },
                {
                  title: "Locations",
                  desc: "Custom AI solutions and platforms built for scale.",
                  icon: "/garage/Location.png",
                  borderGradient:
                    "linear-gradient(149.2deg,#582F19 1.08%,#09112B 98.68%)",
                },
                {
                  title: "Partners",
                  desc: "End-to-end automation of enterprise workflows with AI at the core.",
                  icon: "/garage/end-end.png",
                  borderGradient:
                    "linear-gradient(149.2deg,#003881 1.08%,#09112B 98.68%)",
                },
                {
                  title: "Advisors",
                  desc: "Responsible AI with trust, transparency and compliance.",
                  icon: "/garage/advisors.png",
                  borderGradient:
                    "linear-gradient(149.2deg,#192636 1.08%,#182F76 98.68%)",
                },
                {
                  title: "Investors",
                  desc: "Co-innovate in our labs and build what's next, together.",
                  icon: "/garage/investors.png",
                  borderGradient:
                    "linear-gradient(149.2deg,#250537 1.08%,#182F76 98.68%)",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="relative w-full max-w-[282px] h-[330px] rounded-[28px] overflow-hidden bg-[rgba(0,1,2,0.04)] backdrop-blur-[8px] px-[20px] pt-[34px] pb-[24px] flex flex-col"
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

                  <img
                    src={item.icon}
                    alt={item.title}
                    className="w-[72px] h-[72px] object-contain mb-[24px]"
                  />

                  <h3 className="text-white text-[15px] font-bold">
                    {item.title}
                  </h3>

                  <p className="mt-[14px] text-white/70 text-[15px] leading-[1.15]">
                    {item.desc}
                  </p>

                  <button className="mt-auto text-[#FF2A2A] text-[13px] font-medium text-left cursor-pointer">
                    Learn More →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="w-full mt-0 bg-black px-6 py-10 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-[56%_44%] gap-0 items-center max-w-[1500px] mx-auto">

            {/* Map */}
            <div className="w-full min-h-[260px] md:min-h-[360px] lg:min-h-[430px] flex items-center justify-center overflow-hidden bg-black">
  <ThreeDView />
</div>

            {/* Contact Form */}
            <div
              className="w-full h-fit rounded-[8px] border border-transparent bg-black/10 backdrop-blur-[40px] p-6 md:p-8"
              style={{
                borderImageSource:
                  "linear-gradient(180deg, #78A7FF 0%, #57000F 100%)",
                borderImageSlice: 1,
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <label className="text-white text-[15px] font-medium">
                    Full Name
                  </label>
                  <input
                    placeholder="Enter"
                    className="mt-3 w-full h-[44px] rounded-[6px] border border-[#1E1E2D] bg-[#16060680] px-4 text-white outline-none placeholder:text-white/60"
                  />
                </div>

                <div>
                  <label className="text-white text-[15px] font-medium">
                    Enter your full name
                  </label>
                  <input
                    placeholder="Enter"
                    className="mt-3 w-full h-[44px] rounded-[6px] border border-[#1E1E2D] bg-[#16060680] px-4 text-white outline-none placeholder:text-white/60"
                  />
                </div>

                <div>
                  <label className="text-white text-[15px] font-medium">
                    Company / Organization
                  </label>
                  <input
                    placeholder="Enter"
                    className="mt-3 w-full h-[44px] rounded-[6px] border border-[#1E1E2D] bg-[#16060680] px-4 text-white outline-none placeholder:text-white/60"
                  />
                </div>

                <div>
                  <label className="text-white text-[15px] font-medium">
                    Enter company or institution name
                  </label>
                  <input
                    placeholder="Enter"
                    className="mt-3 w-full h-[44px] rounded-[6px] border border-[#1E1E2D] bg-[#16060680] px-4 text-white outline-none placeholder:text-white/60"
                  />
                </div>

                <div>
                  <label className="text-white text-[15px] font-medium">
                    Business Email
                  </label>
                  <input
                    placeholder="Enter"
                    className="mt-3 w-full h-[44px] rounded-[6px] border border-[#1E1E2D] bg-[#16060680] px-4 text-white outline-none placeholder:text-white/60"
                  />
                </div>

                <div>
                  <label className="text-white text-[15px] font-medium">
                    Enter your official email address
                  </label>
                  <input
                    placeholder="Enter"
                    className="mt-3 w-full h-[44px] rounded-[6px] border border-[#1E1E2D] bg-[#16060680] px-4 text-white outline-none placeholder:text-white/60"
                  />
                </div>
              </div>

              <div
                className="mt-10 p-[2px] rounded-full"
                style={{
                  background:
                    "linear-gradient(270deg, #9A0003 0%, #1173BC 100%)",
                }}
              >
                <button
                  className="w-full h-[44px] rounded-full text-white text-[13px] font-semibold shadow-[0px_4px_4px_0px_#00000040] cursor-pointer"
                  style={{
                    background:
                      "linear-gradient(270deg, rgba(85,6,7,0.213) 0%, rgba(7,78,156,0.24) 100%)",
                  }}
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </section>
        <footer className="w-full mt-0 bg-black">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 py-14">

            <div className="grid grid-cols-1 md:grid-cols-[1.7fr_1fr_1fr_1.2fr] gap-12">

              {/* Logo + About */}
              <div>
                <div className="flex items-center gap-3">
  <img
    src="/footer/logo.png"
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
                  <div className="flex items-center gap-5 mt-8">
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
              </div>

              {/* Information */}
              <div>
                <h3 className="text-white text-[28px] font-semibold">
                  Information
                </h3>

                <div
                  className="mt-[10px] h-[1px] w-[90px]"
                  style={{
                    background:
                      "linear-gradient(270deg, #000000 49.66%, #FF0004 100%)",
                  }}
                />

                <div className="mt-[34px] space-y-[18px] text-white/70 text-[14px]">
                  <p>Responsible AI</p>
                  <p>Careers</p>
                  <p>Resources</p>
                  <p>About Us</p>
                  <p>Contact Us</p>
                  <p>Privacy Policy</p>
                  <p>Terms & Conditions</p>
                </div>
              </div>

              {/* Services */}
              <div>
                <h3 className="text-white text-[28px] font-semibold">
                  Service
                </h3>

                <div
                  className="mt-[10px] h-[1px] w-[90px]"
                  style={{
                    background:
                      "linear-gradient(270deg, #000000 49.66%, #FF0004 100%)",
                  }}
                />

                <div className="mt-[34px] space-y-[18px] text-white/70 text-[14px]">
                  <p>AI Chips</p>
                  <p>Authentication</p>
                  <p>Edtech</p>
                  <p>Femtech</p>
                  <p>TravelTech</p>
                  <p>Proptech</p>
                </div>
              </div>

              {/* Contact */}
              <div>
                <h3 className="text-white text-[28px] font-semibold">
                  Contact Info
                </h3>

                <div
                  className="mt-[10px] h-[1px] w-[90px]"
                  style={{
                    background:
                      "linear-gradient(270deg, #000000 49.66%, #FF0004 100%)",
                  }}
                />

                <div className="mt-[34px] space-y-[24px] text-white/70 text-[14px]">
                  <p> 71 Pennington Lane Vernon Rockville, CT 06066</p>
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