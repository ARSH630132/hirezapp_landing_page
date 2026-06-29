"use client";

import React from "react";
import { motion } from "motion/react";
import {
  Compass,
  Settings,
  Bot,
  ShieldCheck,
  Globe2,
  Factory,
  FlaskConical,
  Cpu,
  DollarSign,
  type LucideIcon,
} from "lucide-react";
interface InnerPageHeroProps {
  category?: string;
  title: string;
  highlightedWord?: string;
  highlightColor?: "red" | "blue" | "gradient";
  description: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  centered?: boolean;
  visualType?: "default" | VisualType;
}

type VisualType =
  | "garage"
  | "foundry"
  | "factory"
  | "operate"
  | "optimize"
  | "scale"
  | "strategy"
  | "engineering"
  | "agents"
  | "governance"
 | "marketplace"
| "labs"
| "countries"
| "humanoid"
| "financial"
| "universityLab";

type VisualConfig = {
  icon?: string;
  Icon?: LucideIcon;
  color: string;
  second: string;
  alt: string;
};

const visualMap: Record<VisualType, VisualConfig> = {
  garage: {
    icon: "/ai_foundary/garage.svg",
    color: "#F74539",
    second: "#E98828",
    alt: "Garage",
  },
  foundry: {
    icon: "/ai_foundary/foundry.svg",
    color: "#E98828",
    second: "#F74539",
    alt: "Foundry",
  },
  factory: {
    icon: "/ai_foundary/factory.svg",
    color: "#0186E4",
    second: "#009DFF",
    alt: "Factory",
  },
  operate: {
    icon: "/intellegent_enterprise/robot.svg",
    color: "#F74539",
    second: "#E4000F",
    alt: "Operate",
  },
  optimize: {
    icon: "/intellegent_enterprise/blueprint.svg",
    color: "#e23f34",
    second: "#F74539",
    alt: "Optimize",
  },
  scale: {
    icon: "/intellegent_enterprise/industry.svg",
    color: "#dd2531",
    second: "#E4000F",
    alt: "Scale",
  },
  strategy: {
  Icon: Compass,
  color: "#F97316",
  second: "#FACC15",
  alt: "AI Strategy",
},
engineering: {
  Icon: Settings,
  color: "#3B82F6",
  second: "#60A5FA",
  alt: "AI Engineering",
},
agents: {
  Icon: Bot,
  color: "#F74539",
  second: "#FF7A70",
  alt: "Agentic AI",
},
governance: {
  Icon: ShieldCheck,
  color: "#2563EB",
  second: "#009DFF",
  alt: "AI Governance",
},
marketplace: {
  Icon: Globe2,
  color: "#F74539",
  second: "#009DFF",
  alt: "AI Marketplace",
},
labs: {
  Icon: FlaskConical,
  color: "#C084FC",
  second: "#A855F7",
  alt: "AI Labs",
},
countries: {
  Icon: Globe2,
  color: "#00D6A3",
  second: "#00FFF0",
  alt: "Countries",
},

humanoid: {
  Icon: Bot,
  color: "#8EEBFF",
  second: "#009DFF",
  alt: "Humanoid",
},

financial: {
  Icon: DollarSign,
  color: "#FACC15",
  second: "#F74539",
  alt: "Financial Services",
},

universityLab: {
  Icon: FlaskConical,
  color: "#C084FC",
  second: "#A855F7",
  alt: "University AI Lab",
},
};

function HeroVisual({ type }: { type: VisualType }) {
  const visual = visualMap[type];
const DynamicIcon = visual.Icon;

  return (
    <div className="relative z-10 w-full h-full flex items-center justify-center">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `linear-gradient(${visual.color}14 1px, transparent 1px), linear-gradient(90deg, ${visual.second}10 1px, transparent 1px)`,
          backgroundSize: "34px 34px",
        }}
      />

      <div
        className="absolute inset-8 rounded-[22px] border bg-black/10"
        style={{ borderColor: `${visual.color}26`, backgroundColor: `${visual.color}08` }}
      />

      <motion.div
        className="absolute inset-10 rounded-[20px] border"
        style={{ borderColor: `${visual.color}40` }}
        animate={{ opacity: [0.25, 0.65, 0.25], scale: [0.96, 1, 0.96] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute w-[72%] h-[72%] rounded-full blur-[48px]"
        style={{
          background: `radial-gradient(circle, ${visual.color}35 0%, ${visual.second}18 42%, transparent 70%)`,
        }}
        animate={{ opacity: [0.35, 0.75, 0.35] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="relative w-[220px] h-[220px] flex items-center justify-center"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
{visual.icon ? (
  <img
    src={visual.icon}
    alt={visual.alt}
    className="w-[180px] h-[180px] object-contain"
    style={{ filter: `drop-shadow(0 0 28px ${visual.color}88)` }}
  />
) : DynamicIcon ? (
  <DynamicIcon
    className="w-[150px] h-[150px]"
    strokeWidth={1.8}
    style={{
      color: visual.color,
      filter: `drop-shadow(0 0 28px ${visual.color}88)`,
    }}
  />
) : null}
      </motion.div>

      <motion.div
        className="absolute bottom-[18%] left-[18%] w-3 h-3 rounded-full"
        style={{ backgroundColor: visual.color, boxShadow: `0 0 18px ${visual.color}` }}
        animate={{ scale: [1, 1.45, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute top-[22%] right-[20%] w-3 h-3 rounded-full"
        style={{ backgroundColor: visual.second, boxShadow: `0 0 18px ${visual.second}` }}
        animate={{ scale: [1, 1.45, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute top-[30%] left-[22%] w-[70px] h-px bg-gradient-to-r from-transparent to-transparent"
        style={{ borderTop: `1px solid ${visual.color}` }}
        animate={{ opacity: [0.15, 0.85, 0.15], x: [-8, 8, -8] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute bottom-[28%] right-[20%] w-[86px] h-px bg-gradient-to-r from-transparent to-transparent"
        style={{ borderTop: `1px solid ${visual.second}` }}
        animate={{ opacity: [0.15, 0.85, 0.15], x: [8, -8, 8] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

export default function InnerPageHero({
  category,
  title,
  highlightedWord,
  highlightColor = "gradient",
  description,
  visualType = "default",
  breadcrumbs,
  centered = false,
}: InnerPageHeroProps) {
  const getHighlightClass = () => {
    switch (highlightColor) {
      case "red": return "text-[#E4000F]";
      case "blue": return "text-[#009DFF]";
      default: return "bg-clip-text text-transparent bg-gradient-to-r from-[#E4000F] to-[#009DFF]";
    }
  };

  const formattedTitle = () => {
    if (!highlightedWord || !title.includes(highlightedWord)) return title;
    const parts = title.split(highlightedWord);
    return (
      <>
        {parts[0]}
        <span className={getHighlightClass()}>{highlightedWord}</span>
        {parts[1]}
      </>
    );
  };

  return (
    <section className="relative w-full px-6 lg:px-16 pt-12 pb-16 lg:pt-20 lg:pb-24 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1795px] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="max-w-[1795px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        <div className={`${centered ? "lg:col-span-12 text-center" : "lg:col-span-7"} flex flex-col`}>
          {breadcrumbs && (
            <nav className={`flex items-center gap-2 mb-6 text-[12px] uppercase tracking-[0.1em] text-white/50 ${centered ? "justify-center" : ""}`}>
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <span>/</span>}
                  {crumb.href ? (
                    <a href={crumb.href} className="hover:text-white transition-colors">{crumb.label}</a>
                  ) : (
                    <span className="text-white/80">{crumb.label}</span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          )}

          {category && (
            <div className={`mb-4 flex ${centered ? "justify-center" : ""}`}>
              <span className="px-3 py-1 text-[11px] font-bold tracking-[0.12em] text-[#009DFF] border border-[#009DFF]/25 bg-[#009DFF]/5 rounded-full uppercase">
                {category}
              </span>
            </div>
          )}

          <h1 className="text-[36px] sm:text-[54px] lg:text-[64px] leading-[1.1] font-bold text-white tracking-tight">
            {formattedTitle()}
          </h1>

          <p className={`mt-6 text-[16px] sm:text-[18px] lg:text-[19px] leading-[1.6] text-white/70 font-light max-w-[800px] ${centered ? "mx-auto" : ""}`}>
            {description}
          </p>
        </div>

        {!centered && (
          <div className="lg:col-span-5 flex justify-center items-center relative">
            <div className="relative w-full aspect-square max-w-[360px] rounded-[24px] border border-white/5 bg-gradient-to-br from-[#0c0c0e] to-[#040405] p-6 shadow-2xl flex items-center justify-center overflow-hidden group">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-gradient-to-tr from-[#E4000F]/10 to-[#009DFF]/10 rounded-full blur-[40px]" />

              {visualType !== "default" ? (
                <HeroVisual type={visualType as VisualType} />
              ) : (
                <svg className="w-full h-full relative z-10" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g className="animate-[spin_40s_linear_infinite] origin-center">
                    <circle cx="200" cy="200" r="140" stroke="url(#ringG)" strokeWidth="1" strokeDasharray="5 15" className="opacity-40" />
                    <circle cx="200" cy="200" r="100" stroke="url(#ringG)" strokeWidth="1" strokeDasharray="20 10" className="opacity-25" />
                    <circle cx="200" cy="200" r="70" stroke="url(#ringG)" strokeWidth="1.5" className="opacity-15" />
                    <path d="M200 40 L200 360 M40 200 L360 200 M87 87 L313 313" stroke="white" strokeWidth="0.5" className="opacity-10" />
                    <circle cx="200" cy="60" r="4" fill="#E4000F" />
                    <circle cx="200" cy="340" r="4" fill="#009DFF" />
                    <circle cx="60" cy="200" r="4" fill="#009DFF" />
                    <circle cx="340" cy="200" r="4" fill="#E4000F" />
                  </g>
                  <circle cx="200" cy="200" r="36" fill="#050505" stroke="url(#ringG)" strokeWidth="2" />
                  <defs>
                    <linearGradient id="ringG" x1="0" y1="0" x2="400" y2="400" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#E4000F" />
                      <stop offset="1" stopColor="#009DFF" />
                    </linearGradient>
                  </defs>
                </svg>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}