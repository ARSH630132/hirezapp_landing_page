"use client";
// import ThreeDView from "./3d_view";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { FaLocationDot, FaPhone } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import {
  Bot,
  Building2,
  Factory,
  GraduationCap,
  Gauge,
  HeartPulse,
  Landmark,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Workflow,
  Layers3,
} from "lucide-react";
import ContactSection from "@/components/ContactSection";

const navItems = [
  { label: "Home", href: "/landing_page#home" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Industries", href: "#industries" },
  { label: "Company", href: "#contact" },
];

const heroActions = [
  { label: "Explore Foundry", href: "#foundry", icon: "/intellegent_enterprise/industry.svg" },
  { label: "Start AI Journey", href: "#blueprint", icon: "/intellegent_enterprise/internet.svg" },
  { label: "Talk to Agent", href: "#capabilities", icon: "/intellegent_enterprise/robot.svg" },
  { label: "Generate Blueprint", href: "#blueprint", icon: "/intellegent_enterprise/blueprint.svg" },
];

const pageFadeVariants = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
    },
  },
};

function SectionHeading({
  title,
  titleClassName,
  dividerWidthClassName = "w-[333px]",
  dividerClassName = "hidden sm:block h-[1px]",
  leftGradient = "linear-gradient(270deg, #FFFFFF 0%, #000000 100%)",
  rightGradient = "linear-gradient(90deg, #FFFFFF 0%, #000000 100%)",
}: {
  title: React.ReactNode;
  titleClassName: string;
  dividerWidthClassName?: string;
  dividerClassName?: string;
  leftGradient?: string;
  rightGradient?: string;
}) {
  return (
    <div className="flex items-center justify-center gap-4 sm:gap-10">
      <div
        className={`${dividerClassName} ${dividerWidthClassName}`}
        style={{ background: leftGradient }}
      />
      <div className={titleClassName}>{title}</div>
      <div
        className={`${dividerClassName} ${dividerWidthClassName}`}
        style={{ background: rightGradient }}
      />
    </div>
  );
}

const industryCards = [
  {
    title: "Financial Services & Trust",
    icon: Landmark,
    accent: "linear-gradient(135deg, #4F8CFF 0%, #34D3FF 100%)",
    glow: "#4F8CFF",
    eyebrow: "High-trust systems",
    summary:
      "From claims to client service, build dependable AI experiences for regulated teams.",
    items: ["Fraud review", "Client onboarding", "Policy servicing"],
    outcome: "Faster approvals with auditability built in",
  },
  {
    title: "Industry & Natural Resources",
    icon: Factory,
    accent: "linear-gradient(135deg, #FF7A59 0%, #FFB84A 100%)",
    glow: "#FF7A59",
    eyebrow: "Operational intelligence",
    summary:
      "Support plant operations, procurement, and asset reliability with AI-driven workflows.",
    items: ["Asset maintenance", "Supply planning", "Field support"],
    outcome: "Better uptime across the value chain",
  },
  {
    title: "Health & Life Sciences",
    icon: HeartPulse,
    accent: "linear-gradient(135deg, #24D39B 0%, #7DDEFF 100%)",
    glow: "#24D39B",
    eyebrow: "Patient-first AI",
    summary:
      "Design helpful AI touchpoints for intake, care coordination, and life sciences teams.",
    items: ["Patient intake", "Care ops", "Research support"],
    outcome: "Less admin, more time for care",
  },
  {
    title: "Public Service & Education",
    icon: GraduationCap,
    accent: "linear-gradient(135deg, #7C5CFF 0%, #29B7FF 100%)",
    glow: "#7C5CFF",
    eyebrow: "Civic and learning systems",
    summary:
      "Modernize student, citizen, and back-office experiences with transparent AI.",
    items: ["Citizen services", "Learning ops", "Grants"],
    outcome: "More responsive public and campus services",
  },
  {
    title: "Consumer & Digital Industry",
    icon: ShoppingBag,
    accent: "linear-gradient(135deg, #FF3B7A 0%, #8E63FF 100%)",
    glow: "#FF3B7A",
    eyebrow: "Growth engines",
    summary:
      "Bring speed to commerce, support, and digital operations where experience matters.",
    items: ["Retail", "Telecom", "Customer experience"],
    outcome: "Smoother journeys and stronger conversion",
  },
];

const productizedFeatures = [
  {
    title: "Agent Marketplace",
    desc: "Curated agents ready for ops, support, and internal teams.",
    icon: Bot,
  },
  {
    title: "AI Academy",
    desc: "Learning paths for builders, leaders, and enterprise users.",
    icon: Sparkles,
  },
  {
    title: "AI Control Center",
    desc: "Monitor usage, approvals, and task health in one place.",
    icon: Gauge,
  },
  {
    title: "Runtime Governance",
    desc: "Policy checks, audit trails, and guardrails by design.",
    icon: ShieldCheck,
  },
];

const productizedColumns = [
  {
    title: "Garage",
    icon: Building2,
    items: ["Discover AI use cases", "Workshops and ideation", "AI labs", "Experiment zone"],
  },
  {
    title: "Runtime",
    icon: Workflow,
    items: ["Build agents", "Runtime orchestration", "Data fabric", "AI engineering"],
  },
  {
    title: "AI Architecture",
    icon: Layers3,
    items: [
      "Data & Intelligence Layer",
      "AI & Agent Layer",
      "Orchestration Layer",
      "Integration Layer",
    ],
  },
];

export default function LandingPage() {
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const industryCarouselRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = industryCarouselRef.current;
    if (!container) return;

    let raf = 0;
    let last = performance.now();
    let paused = false;
    const desktopQuery = window.matchMedia("(min-width: 1024px)");

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const tick = (now: number) => {
      if (desktopQuery.matches && !paused && !prefersReducedMotion) {
        const delta = now - last;
        const scrollAmount = delta * 0.03;
        container.scrollLeft += scrollAmount;

        const halfWidth = container.scrollWidth / 2;
        if (container.scrollLeft >= halfWidth) {
          container.scrollLeft -= halfWidth;
        }
      }

      last = now;
      raf = window.requestAnimationFrame(tick);
    };

    const onEnter = () => {
      paused = true;
    };

    const onLeave = () => {
      paused = false;
    };

    container.addEventListener("mouseenter", onEnter);
    container.addEventListener("mouseleave", onLeave);
    container.addEventListener("touchstart", onEnter, { passive: true });
    container.addEventListener("touchend", onLeave, { passive: true });

    raf = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(raf);
      container.removeEventListener("mouseenter", onEnter);
      container.removeEventListener("mouseleave", onLeave);
      container.removeEventListener("touchstart", onEnter);
      container.removeEventListener("touchend", onLeave);
    };
  }, []);

  return (
    <motion.main
      className="min-h-screen bg-[#010101] text-white overflow-x-hidden"
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.08,
            delayChildren: 0.04,
          },
        },
      }}
    >
      <div className="w-full max-w-[1920px] mx-auto bg-[#010101] overflow-x-hidden">
        <header className="fixed top-0 left-0 right-0 z-50 w-full h-[84px] bg-black/60 backdrop-blur-[20px] border-b border-white/5 flex items-center justify-between px-6 lg:px-16">
  <Link href="/landing_page#home" className="flex items-center gap-2 sm:gap-3 shrink-0">
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
  </Link>

  <div className="hidden md:flex items-center gap-[55px] text-white absolute left-1/2 -translate-x-1/2">
    {navItems.map((item) => (
      <Link
        key={item.label}
        href={item.href}
        className="text-white text-[16px] leading-[24px] font-medium cursor-pointer hover:text-red-400 transition-colors whitespace-nowrap"
      >
        {item.label}
      </Link>
    ))}
  </div>

  <a
    href="#contact"
    className="hidden md:flex w-[207px] h-[48px] items-center justify-center rounded-[98px] text-white text-[16px] leading-[24px] font-semibold cursor-pointer transition-all duration-300 hover:opacity-90 shrink-0 text-center"
    style={{
      background: "linear-gradient(90deg, #E4000F 0%, #009DFF 100%)",
    }}
  >
    Book a Consultation
  </a>

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
      className="absolute left-0 right-0 bottom-0 h-auto rounded-t-[28px] bg-[#050505] px-6 pt-6 pb-8 overflow-y-auto"
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
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            onClick={() => setIsMenuOpen(false)}
            className="w-full py-4 border-b border-white/10 text-white/80 text-[18px] leading-[24px] font-semibold text-left hover:text-white transition-colors"
          >
            {item.label}
          </a>
        ))}

        <a
          href="#contact"
          onClick={() => setIsMenuOpen(false)}
          className="mt-6 w-full h-[56px] rounded-[98px] text-white text-[16px] leading-[24px] font-semibold cursor-pointer flex items-center justify-center text-center"
          style={{
            background: "linear-gradient(90deg, #E4000F 0%, #009DFF 100%)",
          }}
        >
          Book a Consultation
        </a>
      </div>
    </div>
  </div>
)}
        <motion.section
          id="home"
          className="relative w-full h-[90vh] pt-[24px] lg:pt-[36px] overflow-hidden bg-black"
          variants={pageFadeVariants}
        >
          <div className="relative z-10 mt-[88px] lg:mt-[150px] ml-0 lg:ml-[64px] px-6 lg:px-0 w-full lg:w-[705px] min-h-[376px]">
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

            <div className="mt-[80px] sm:mt-[380px] lg:mt-[30px] grid grid-cols-1 sm:grid-cols-2 gap-x-[9px] gap-y-[20px] w-full sm:w-fit">
              {heroActions.map((action, index) => (
                <a
                  key={action.label}
                  href={action.href}
                  className={`w-full ${
                    index === 0
                      ? "sm:w-[231px]"
                      : index === 1
                      ? "sm:w-[228px]"
                      : index === 2
                      ? "sm:w-[201px]"
                      : "sm:w-[254px] sm:-ml-[22px]"
                  } h-[50px] rounded-[100px] border border-[#969696] bg-black px-[20px] flex items-center justify-center ${
                    index === 2 || index === 3 ? "sm:justify-start" : ""
                  } gap-[10px] cursor-pointer`}
                >
                  <Image
                    src={action.icon}
                    alt={action.label}
                    width={30}
                    height={30}
                    className="w-[30px] h-[30px] object-contain shrink-0"
                  />
                  <span className="text-white text-[18px] leading-[100%] font-medium whitespace-nowrap">
                    {action.label}
                  </span>
                </a>
              ))}
            </div>
          </div>

         <div className="absolute inset-y-0 right-0 w-full lg:w-[63%] h-full">
  <div className="relative w-full h-full overflow-hidden">
    <video
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      className="w-full h-full object-cover"
    >
      <source src="/videos/videomp_.mp4" type="video/mp4" />
    </video>

    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
  "linear-gradient(90deg, #000000 0%, rgba(0,0,0,0.75) 18%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0) 100%)",
      }}
    />
  </div>
</div>
        </motion.section>

        <motion.section
          id="capabilities"
          className="w-full bg-black px-6 lg:px-16 py-10 overflow-hidden"
          variants={pageFadeVariants}
        >
          <SectionHeading
            title={
              <h2 className="text-[#E8EDFF] text-[30px] sm:text-[40px] leading-[100%] font-semibold uppercase text-center">
                TALK TO AN AI AGENT
              </h2>
            }
            titleClassName="text-center"
            dividerWidthClassName="w-[260px]"
          />
          <div className="text-center">
            <p className="mt-[6px] text-[#C1C1C1] text-[15px] sm:text-[18px] leading-[130%] sm:leading-[100%] font-medium">
              Get instant insights, strategies and roadmaps from our Ai-powered
              expert agents.
            </p>
          </div>

          <div className="mt-[50px] max-w-[1795px] mx-auto grid grid-cols-1 xl:grid-cols-5 gap-6">
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
  <div key={agent.name} className="flex flex-col items-center xl:col-span-1">
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
  <div className="block md:hidden mt-4 w-full max-w-[339px] h-[280px] rounded-[18px] border border-[#1E1E1E] bg-[#111111] p-4 overflow-hidden">
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
      Hello! I&apos;m your AI assistant. How can I help you today?
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
    <div className="hidden md:block xl:col-span-5 mt-10 w-full max-w-[100%] h-[400px] mx-auto rounded-[18px] border border-[#1E1E1E] bg-[#111111] p-5 md:p-8 relative overflow-hidden">
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
        Hello! I&apos;m your {activeAgent.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())}. I can help you craft an AI transformation roadmap tailored to your enterprise goals. What industry are you in?
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
          </div>
        </motion.section>

        <motion.section
          id="blueprint"
          className="w-[calc(100%-24px)] lg:w-[calc(100%-128px)] max-w-[1792px] min-h-[633px] mx-auto mt-0 rounded-[20px] border border-[#151926] bg-[#000613] px-4 sm:px-6 py-8 overflow-hidden"
          variants={pageFadeVariants}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr_320px] xl:grid-cols-[430px_1fr_340px] gap-6 xl:gap-8">
            <div className="pl-0 lg:pl-[22px]">
              <h2 className="text-[32px] sm:text-[40px] lg:text-[42px] xl:text-[44px] leading-[100%] font-semibold text-[#E8EDFF] uppercase">
                BUILD YOUR <br /> AI ENTERPRISE
              </h2>

              <p className="mt-6 w-full lg:w-[360px] xl:w-[414px] text-[#C1C1C1] text-[15px] lg:text-[16px] xl:text-[18px] leading-[145%] xl:leading-[140%] font-medium">
                Answer a few questions. Our AI engine will design your operating
                model, architecture, agent ecosystem and transformation roadmap.
              </p>

              <div className="mt-[48px] lg:mt-[88px] xl:mt-[110px] grid grid-cols-1 sm:grid-cols-2 gap-x-[14px] gap-y-[12px] w-full max-w-[550px]">
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
                    className="w-full h-[48px] rounded-[10px] border border-[#2F2B3E] bg-[#070D1D] text-white text-[15px] lg:text-[16px] leading-[100%] tracking-[0.02em] font-semibold px-[20px] flex items-center gap-[8px] cursor-pointer whitespace-nowrap shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
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

                <div className="min-h-[300px] rounded-[18px] flex items-center justify-center cursor-pointer">
                  <Image
                    src="/ai_enterprise/main.png"
                    alt="AI Enterprise Blueprint"
                    width={637}
                    height={404}
                    className="w-full max-w-[720px] h-auto object-contain"
                  />
                </div>

                <div className="space-y-5">
                  <div className="min-h-[150px] rounded-[14px] border border-white/20 bg-[#07101f] px-4 py-6">
                    <h4 className="text-white text-[16px] lg:text-[18px] leading-[100%] tracking-[0.02em] font-semibold text-center whitespace-nowrap">
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
                          <span className="text-[15px] lg:text-[16px] leading-[100%] tracking-[0.02em] font-semibold text-white whitespace-nowrap">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="min-h-[110px] rounded-[14px] border border-white/20 bg-[#07101f] px-4 py-6 flex flex-col items-center justify-center text-center">
                    <h4 className="text-white text-[16px] lg:text-[18px] leading-[100%] tracking-[0.02em] font-semibold whitespace-nowrap">
                      GOVERNANCE FRAMEWORK
                    </h4>
                    <p className="mt-3 text-[#C1C1C1] text-[16px] lg:text-[18px] leading-[24px] lg:leading-[26px] font-medium text-center">
                      Trust Risk Security Compliance
                      <br />
                      Ethics
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 w-full rounded-[16px] border border-white/20 bg-[#07101f] px-4 sm:px-8 py-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
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
                      className="w-[44px] h-[44px] lg:w-[50px] lg:h-[50px] object-contain shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-[#C1C1C1] text-[15px] leading-[100%] font-medium uppercase whitespace-nowrap">
                        {phase}
                      </p>
                      <h5 className="text-[18px] leading-[110%] font-semibold text-white break-words">
                        {title}
                      </h5>
                      <p className="text-[#C1C1C1] text-[16px] leading-[100%] font-medium whitespace-nowrap">
                        {time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          id="foundry"
          className="w-full min-h-[586px] mt-0 bg-black px-6 lg:px-16 pt-[56px] pb-[56px]"
          variants={pageFadeVariants}
        >
          <SectionHeading
            title={
              <h2 className="text-[24px] sm:text-[30px] leading-[100%] tracking-[0px] font-medium text-center uppercase text-white">
                THE <span className="text-red-500">AI FOUNDRY</span> PROCESS
              </h2>
            }
            titleClassName="text-center"
            dividerWidthClassName="w-[260px]"
          />

          <div className="mt-[48px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-[1795px] mx-auto">
            
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
                color: "text-[#24ABFF]",
                borderGradient:
                  "linear-gradient(149.2deg, #24ABFF 1.91%, #8E99B7 97.57%)",
              },
              {
                title: "DEPLOY",
                step: "04",
                name: "DEPLOY",
                desc: "We launch AI solutions into your enterprise environment.",
                icon: "/ai_foundary/deploy.svg",
                color: "text-[#FF3424]",
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
className="group relative min-h-[420px] rounded-[20px] p-[1px] transition-all duration-300 hover:-translate-y-3 hover:scale-[1.02] hover:shadow-[0_0_10px_var(--foundry-color),0_0_24px_var(--foundry-color)]"  style={{
    background: item.borderGradient,
    "--foundry-color": item.color.replace("text-[", "").replace("]", ""),
  } as React.CSSProperties}
>
                <div className="relative h-full rounded-[19px] bg-[#000102] p-6 flex flex-col overflow-hidden">
  <div
    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
    style={{
    background: `radial-gradient(circle at center,
  ${item.color.replace("text-[", "").replace("]", "")}18 0%,
  ${item.color.replace("text-[", "").replace("]", "")}10 35%,
  ${item.color.replace("text-[", "").replace("]", "")}08 55%,
  transparent 80%)`,
    }}
  />

  <div
    className="absolute inset-0 rounded-[19px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
    style={{
      boxShadow: `
  0 0 18px ${item.color.replace("text-[", "").replace("]", "")},
  0 0 42px ${item.color.replace("text-[", "").replace("]", "")}99,
  inset 0 0 30px ${item.color.replace("text-[", "").replace("]", "")}55
`,
    }}
  />
                  <h3
                    className={`relative z-10 text-center text-[25px] leading-[100%] font-semibold uppercase ${item.color}`}
                  >
                    {item.title}
                  </h3>

                  <div className="mt-6 flex justify-center">
<img
  src={item.icon}
  alt={item.title}
  className="w-[130px] h-[130px] object-contain relative z-10 transition-all duration-300 group-hover:scale-105"
  style={{
    filter:
      item.title === "DEPLOY"
        ? "drop-shadow(0 0 18px #8E99B7)"
        : "none",
  }}
/>
                  </div>

                  <div className="relative z-10 mt-auto">
                    <p className="text-[25px] leading-[100%] font-medium text-white">
                      {item.step}
                    </p>

                    <h4 className="mt-1 text-[25px] leading-[100%] font-medium text-white uppercase">
                      {item.name}
                    </h4>

                    <p className="mt-3 text-[15px] leading-[100%] font-medium text-[#C1C1C1]">
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
        </motion.section>

        <motion.section
          id="industries"
          className="w-full mt-0 px-6 lg:px-16 pt-[56px] pb-[52px]"
          variants={pageFadeVariants}
        >
          <div className="max-w-[1795px] mx-auto">
            <SectionHeading
              title={
                <p className="text-[#408CFF] text-[24px] sm:text-[30px] leading-[100%] tracking-[0px] font-medium uppercase">
                  INDUSTRY SOLUTIONS
                </p>
              }
              titleClassName="text-center"
              dividerWidthClassName="w-[120px]"
            />

            <p className="mt-5 mx-auto max-w-[880px] text-center text-white/68 text-[15px] sm:text-[17px] leading-[28px]">
              Industry-ready AI patterns for regulated, operational, and customer-facing teams.
              Each card points to a practical starting point for automation, copilot experiences,
              and decision support.
            </p>

            <div
              ref={industryCarouselRef}
              className="mt-[34px] overflow-x-auto pb-2 -mx-1 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory lg:snap-none"
            >
              <div className="flex w-max gap-4 pr-4">
                {[...industryCards, ...industryCards].map((item, index) => (
                  <div
                    key={`${item.title}-${index}`}
                    className="group relative w-[86vw] max-w-[330px] sm:w-[320px] lg:w-[330px] shrink-0 min-h-[286px] overflow-hidden rounded-[24px] border border-[#10162B] bg-[linear-gradient(180deg,rgba(4,7,18,0.96)_0%,rgba(2,4,10,0.98)_100%)] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/15 hover:shadow-[0_0_22px_rgba(64,140,255,0.12)] snap-start"
                  >
                    <div
                      className="pointer-events-none absolute inset-0 opacity-100"
                      style={{
                        background: `
                          radial-gradient(circle at 20% 18%, ${item.glow}20 0%, transparent 34%),
                          radial-gradient(circle at 88% 10%, ${item.glow}16 0%, transparent 24%),
                          radial-gradient(circle at 86% 82%, ${item.glow}12 0%, transparent 28%),
                          linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 48%)
                        `,
                      }}
                    />

                    <div className="relative z-10 flex h-full flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div
                          className="inline-flex h-[52px] w-[52px] items-center justify-center rounded-[16px] shadow-[0_16px_30px_rgba(0,0,0,0.35)]"
                          style={{ backgroundImage: item.accent }}
                        >
                          <item.icon className="h-[24px] w-[24px] text-white" />
                        </div>

                        <div className="rounded-full bg-white/[0.05] px-3 py-1 text-[12px] font-medium uppercase tracking-[0.14em] text-white/65">
                          {item.eyebrow}
                        </div>
                      </div>

                      <h3 className="mt-6 text-[19px] leading-[25px] font-semibold text-white">
                        {item.title}
                      </h3>

                      <p className="mt-3 text-[14px] leading-[23px] text-white/70">
                        {item.summary}
                      </p>

                      <div className="mt-5 grid grid-cols-1 gap-2">
                        {item.items.map((listItem) => (
                          <div
                            key={listItem}
                            className="flex items-center gap-3 rounded-[12px] bg-white/[0.05] px-3 py-2 text-[13px] leading-[18px] text-white/86"
                          >
                            <span
                              className="h-[6px] w-[6px] rounded-full shadow-[0_0_10px_rgba(141,198,255,0.75)]"
                              style={{ backgroundColor: item.glow }}
                            />
                            <span>{listItem}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-auto pt-5">
                        <div className="flex items-center justify-between gap-3 rounded-[14px] bg-white/[0.04] px-4 py-3">
                          <span className="text-[12px] font-medium uppercase tracking-[0.12em] text-white/50">
                            Outcome
                          </span>
                          <span className="text-right text-[13px] leading-[18px] font-medium text-white/82">
                            {item.outcome}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          id="productized-assets"
          className="w-full mt-0 px-6 lg:px-16 pt-[24px] pb-[52px]"
          variants={pageFadeVariants}
        >
          <div className="max-w-[1795px] mx-auto rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,#050816_0%,#02040a_100%)] px-5 sm:px-6 lg:px-8 py-8 lg:py-10">
            <div className="grid grid-cols-1 xl:grid-cols-[1.02fr_0.92fr_1.08fr] gap-6 items-stretch">
              <div className="rounded-[24px] border border-[#18223C] bg-[linear-gradient(180deg,rgba(8,12,24,0.95)_0%,rgba(3,6,14,0.98)_100%)] p-6 lg:p-7">
                <h2 className="text-white text-[34px] sm:text-[42px] lg:text-[48px] leading-[0.95] font-semibold uppercase">
                  PRODUCTIZED
                  <br />
                  ASSETS
                </h2>

                <p className="mt-5 max-w-[360px] text-white/72 text-[15px] sm:text-[16px] leading-[26px]">
                  Practical tools and repeatable systems that help teams move from
                  idea to delivery with less friction and more confidence.
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {["Agent-ready", "Governed", "Composable", "Enterprise scale"].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white/[0.06] px-3 py-1 text-[13px] text-white/76"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {productizedFeatures.map((item, index) => {
                    const Icon = item.icon;
                    const accent =
                      index === 0
                        ? "from-[#FF5F6D] to-[#FFD36D]"
                        : index === 1
                        ? "from-[#7C5CFF] to-[#29B7FF]"
                        : index === 2
                        ? "from-[#24D39B] to-[#7DDEFF]"
                        : "from-[#FF7A59] to-[#FFB84A]";

                    return (
                      <div
                        key={item.title}
                        className="group rounded-[16px] bg-[#0A0F1F] p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-[#0D1324]"
                      >
                        <div className={`inline-flex h-11 w-11 items-center justify-center rounded-[12px] bg-gradient-to-br ${accent}`}>
                          <Icon className="h-5 w-5 text-[#07111D]" />
                        </div>
                        <h3 className="mt-4 text-[16px] font-semibold text-white">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-[13px] leading-[21px] text-white/66">
                          {item.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="relative overflow-hidden rounded-[24px] border border-[#18223C] bg-[radial-gradient(circle_at_top,rgba(16,213,255,0.14),transparent_48%),linear-gradient(180deg,rgba(4,9,20,0.96)_0%,rgba(2,4,10,1)_100%)] p-5 lg:p-6 flex items-center justify-center">
                <div className="absolute inset-x-8 top-8 h-[1px] bg-gradient-to-r from-transparent via-[#29B7FF]/60 to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,213,255,0.12)_0%,transparent_62%)]" />

                <div className="relative w-full max-w-[420px] aspect-square">
                  <div className="absolute inset-12 rounded-full bg-[#10D5FF]/20 blur-3xl" />
                  <div className="absolute left-[10%] top-[14%] rounded-full border border-white/10 bg-black/35 px-3 py-2 text-[12px] text-white/80 backdrop-blur-md">
                    AI workflow
                  </div>
                  <div className="absolute right-[10%] top-[18%] rounded-full border border-white/10 bg-black/35 px-3 py-2 text-[12px] text-white/80 backdrop-blur-md">
                    Governance
                  </div>
                  <div className="absolute left-[12%] bottom-[14%] rounded-full border border-white/10 bg-black/35 px-3 py-2 text-[12px] text-white/80 backdrop-blur-md">
                    Runtime
                  </div>
                  <div className="absolute right-[12%] bottom-[14%] rounded-full border border-white/10 bg-black/35 px-3 py-2 text-[12px] text-white/80 backdrop-blur-md">
                    Scale
                  </div>

                  <Image
                    src="/intellegent_enterprise/blueprint.png"
                    alt="Productized assets blueprint"
                    width={840}
                    height={840}
                    className="relative z-10 h-full w-full object-contain drop-shadow-[0_0_26px_rgba(16,213,255,0.34)]"
                  />
                </div>
              </div>

                <div className="grid grid-cols-1 gap-4">
                {productizedColumns.map((column) => {
                  const Icon = column.icon;
                  return (
                    <div
                      key={column.title}
                      className="rounded-[20px] bg-[linear-gradient(180deg,rgba(7,12,28,0.94)_0%,rgba(3,6,14,0.98)_100%)] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.05)_inset]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-white/5">
                          <Icon className="h-5 w-5 text-[#8DC6FF]" />
                        </div>
                        <div>
                          <h3 className="text-[16px] font-semibold uppercase text-white">
                            {column.title}
                          </h3>
                          <p className="text-[13px] text-white/52">
                            Core capabilities and building blocks
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 h-[1px] w-full bg-white/10" />

                      <ul className="mt-4 space-y-3 text-[14px] sm:text-[15px] leading-[22px] font-medium text-white/84">
                        {column.items.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span className="text-white/80">→</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          id="insights"
          className="w-full min-h-[610px] mt--10 px-6 lg:px-16 pt-[56px] pb-[56px]"
          variants={pageFadeVariants}
        >
          <SectionHeading
            title={
              <h2 className="text-[#408CFF] text-[24px] sm:text-[30px] leading-[100%] tracking-[0px] font-medium text-center uppercase">
                INSIGHTS
              </h2>
            }
            titleClassName="text-center"
            dividerWidthClassName="w-[333px]"
          />

          <div className="mt-[48px] grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-[1795px] mx-auto">
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
        </motion.section>

        <motion.section
          id="garage"
          className="relative w-full min-h-[760px] mt-0 bg-black overflow-hidden"
          variants={pageFadeVariants}
        >
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
                DEPLOYED IN YOUR ENTERPRISE.
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
        </motion.section>

        <ContactSection />

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
                  typesetting industry. Lorem Ipsum has been the industry&apos;s
                  standard dummy text ever since the 1500s.
                </p>

                <div className="flex items-center gap-3 mt-8 text-white text-xl">
                  {[
                    { src: "/footer/linkedin.png", alt: "LinkedIn" },
                    { src: "/footer/twitter.png", alt: "Twitter" },
                    { src: "/footer/mail.png", alt: "Mail" },
                    { src: "/footer/youtube.png", alt: "YouTube" },
                    { src: "/footer/instagram.png", alt: "Instagram" },
                  ].map((icon) => (
                    <button
                      key={icon.alt}
                      type="button"
                      aria-label={icon.alt}
                      title={icon.alt}
                      className="group inline-flex h-10 w-10 items-center justify-center text-white/80 transition-all duration-300 hover:-translate-y-0.5 hover:text-white active:scale-95 cursor-pointer"
                    >
                      <img
                        src={icon.src}
                        alt={icon.alt}
                        className="h-5 w-5 object-contain brightness-0 invert transition-transform duration-300 group-hover:scale-110"
                      />
                    </button>
                  ))}
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
                      item === "About Us" ? (
                        <Link
                          key={item}
                          href="/about-us"
                          className="block text-white/70 hover:text-white transition-colors duration-300 cursor-pointer text-left"
                        >
                          {item}
                        </Link>
                      ) : (
                        <button
                          key={item}
                          type="button"
                          className="block text-white/70 hover:text-white transition-colors duration-300 cursor-pointer text-left"
                        >
                          {item}
                        </button>
                      )
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
                  <p className="flex items-center gap-3">
                    <FaLocationDot className="text-[#E8EDFF] text-[16px] shrink-0" />
                    <span>71 Pennington Lane Vernon Rockville, CT 06066</span>
                  </p>
                  <p className="flex items-center gap-3">
                    <MdEmail className="text-[#E8EDFF] text-[16px] shrink-0" />
                    <span>thefactoryai@gmail.com</span>
                  </p>
                  <p className="flex items-center gap-3">
                    <FaPhone className="text-[#E8EDFF] text-[14px] shrink-0" />
                    <span>12345 67890</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 py-5 text-center text-white/60 text-[13px]">
             © 2026 GFF AI All Rights Reserved
          </div>
        </footer>
      </div>
    </motion.main>
  );
}
