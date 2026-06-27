"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, X, ArrowRight, Sparkles } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import Link from "next/link";

interface SearchItem {
  title: string;
  category: "Industries" | "Capabilities" | "Platforms" | "Build With GFF" | "Resources" | "Company";
  description: string;
  link: string;
  keywords: string[];
}

const staticSearchDatabase: SearchItem[] = [
  // Example Quick Templates
  {
    title: "Build AI for Banking",
    category: "Build With GFF",
    description: "Deploy regulated, high-trust agent workflows, automated claims audits, risk modeling engines, and customer experience frameworks built on GFF Enterprise specs.",
    link: "/build?solution=banking",
    keywords: ["banking", "finance", "bank", "financial services", "audit", "onboarding", "investment", "risk", "wealth", "build ai for banking"]
  },
  {
    title: "Create University AI Lab",
    category: "Build With GFF",
    description: "Launch custom educational labs, grant management workflows, student learning assistance programs, and secure administrative automation hubs.",
    link: "/build?solution=university-lab",
    keywords: ["university", "education", "lab", "academic", "learning", "student", "grant", "school", "research", "create university ai lab"]
  },
  {
    title: "Insurance AI & Claims Automation",
    category: "Build With GFF",
    description: "Orchestrate end-to-end policy servicing, automated risk underwriting, and instant claims assessment with custom GFF AI agents.",
    link: "/build?solution=insurance",
    keywords: ["insurance", "claims", "policy", "underwriting", "claims audit", "servicing", "insurance ai"]
  },
  {
    title: "Mining AI & Operational Intelligence",
    category: "Build With GFF",
    description: "Deploy operational AI patterns for field maintenance, supply planning, plant diagnostics, and resource extraction logistics.",
    link: "/build?solution=mining",
    keywords: ["mining", "resources", "extraction", "plant", "maintenance", "supply planning", "natural resources", "geology", "mining ai"]
  },
  {
    title: "Retail AI & Growth Engines",
    category: "Build With GFF",
    description: "Deliver real-time commerce recommendations, telecom operations optimization, and agentic customer support for digital-first retail brands.",
    link: "/build?solution=retail",
    keywords: ["retail", "commerce", "e-commerce", "telecom", "customer service", "sales", "consumer", "retail ai"]
  },
  {
    title: "Build AI GCC (Global Capability Center)",
    category: "Build With GFF",
    description: "Accelerate your AI transformation at scale. Build highly structured GFF-compliant GCCs with integrated model hubs and governance.",
    link: "/build?solution=gcc",
    keywords: ["gcc", "global capability center", "scale", "offshore", "governance", "center of excellence", "coe", "build ai gcc"]
  },

  // Industries
  {
    title: "Financial Services & Trust",
    category: "Industries",
    description: "Dependable AI solutions for regulated financial teams. Streamline client onboarding, automated fraud reviews, and policy servicing.",
    link: "/industries",
    keywords: ["financial", "finance", "bank", "banking", "trust", "onboarding", "fraud", "servicing"]
  },
  {
    title: "Industry & Natural Resources",
    category: "Industries",
    description: "Empower extraction, manufacturing, and supply chain divisions with asset predictive maintenance, procurement advisors, and field operations copilot.",
    link: "/industries",
    keywords: ["industry", "mining", "manufacturing", "procurement", "supply chain", "maintenance", "resources", "oil", "gas"]
  },
  {
    title: "Health & Life Sciences",
    category: "Industries",
    description: "Helpful, secure AI solutions for patient intake, care coordination, research support, and pharmaceutical pipeline analysis.",
    link: "/industries",
    keywords: ["health", "life sciences", "medical", "patient", "intake", "care", "research", "pharmaceutical", "clinical"]
  },
  {
    title: "Public Service & Education",
    category: "Industries",
    description: "Modern civic services, transparent grant scoring, learning operations support, and modern campus AI tools designed for educational institutions.",
    link: "/industries",
    keywords: ["public service", "education", "civic", "grant", "campus", "learning", "government", "school", "university", "academic"]
  },
  {
    title: "Consumer & Digital Industry",
    category: "Industries",
    description: "Bring rapid intelligence, hyper-personalization, and continuous customer experience optimization to consumer-facing retail and telecom brands.",
    link: "/industries",
    keywords: ["consumer", "digital", "retail", "telecom", "customer experience", "personalization", "sales"]
  },

  // Capabilities
  {
    title: "AI Strategy & Consulting",
    category: "Capabilities",
    description: "Align your leadership and technology with robust business cases, executive AI roadmaps, and next-gen operating models.",
    link: "/capabilities",
    keywords: ["strategy", "roadmap", "consulting", "planning", "business case", "operating model", "leadership", "transformation"]
  },
  {
    title: "AI Engineering & Systems",
    category: "Capabilities",
    description: "Forge highly optimized custom models, secure semantic vector indexes, and complex cloud-native AI pipelines from scratch.",
    link: "/capabilities",
    keywords: ["engineering", "model", "vector", "pipeline", "cloud-native", "infrastructure", "coding", "software", "development"]
  },
  {
    title: "Agentic AI Orchestration",
    category: "Capabilities",
    description: "Design autonomous agents capable of independent multi-step planning, logical reasoning, and complete execution of business workflows.",
    link: "/capabilities",
    keywords: ["agentic", "agents", "autonomous", "workflows", "reasoning", "automation", "ops", "orchestrate"]
  },
  {
    title: "AI Governance & Guardrails",
    category: "Capabilities",
    description: "Incorporate robust runtime policy checks, comprehensive audit trails, and strict safety guardrails directly into your model pipelines.",
    link: "/capabilities",
    keywords: ["governance", "policy", "audit", "compliance", "guardrails", "safety", "trust", "security", "responsible"]
  },
  {
    title: "AI Labs & Co-Innovation",
    category: "Capabilities",
    description: "Co-innovate in our modern collaborative labs to ideate, prototype, and refine experimental high-performance AI solutions.",
    link: "/capabilities",
    keywords: ["labs", "co-innovate", "prototype", "experimental", "research", "garage", "sandbox", "innovation"]
  },
  {
    title: "AI Operations & Monitoring",
    category: "Capabilities",
    description: "Automate continuous monitoring, system orchestration, health checks, and smooth deployment cycles across the entire enterprise.",
    link: "/capabilities",
    keywords: ["operations", "monitoring", "orchestration", "deployment", "system", "health", "ops", "automation"]
  },

  // Platforms
  {
    title: "AI Factory Platform",
    category: "Platforms",
    description: "The complete platform to build, continuously monitor, deploy, and scale enterprise-grade AI agents with multi-cloud safety.",
    link: "/platforms",
    keywords: ["factory", "platform", "agents", "deploy", "scale", "multi-cloud", "orchestration", "enterprise"]
  },
  {
    title: "AI Marketplace Hub",
    category: "Platforms",
    description: "A centralized hub of ready-to-run, certified AI agents built specifically for high-frequency operations and customer service.",
    link: "/platforms",
    keywords: ["marketplace", "agents", "ready-to-run", "ops", "hub", "centralized", "certified"]
  },
  {
    title: "AI Control Center Dashboard",
    category: "Platforms",
    description: "A single unified interface to track total usage, approve complex agent activities, and monitor runtime model health in real-time.",
    link: "/platforms",
    keywords: ["control center", "monitor", "usage", "health", "approvals", "dashboard", "analytics"]
  },

  // Resources
  {
    title: "Articles & Blog",
    category: "Resources",
    description: "Read our technical articles and deep dives exploring modern AI design patterns, scaling practices, and corporate safety guardrails.",
    link: "/resources",
    keywords: ["articles", "blog", "news", "deep dives", "patterns", "scaling", "safety", "insights", "research"]
  },
  {
    title: "Videos & Demos Library",
    category: "Resources",
    description: "Watch in-depth developer walkthroughs, blueprint demonstrations, and product reveals of GFF AI platforms.",
    link: "/resources",
    keywords: ["videos", "demos", "walkthroughs", "visual", "blueprints", "reveals", "recordings"]
  },
  {
    title: "Podcasts & Leadership Interviews",
    category: "Resources",
    description: "Listen to conversations with global leaders and engineers about the future of enterprise automation and model safety.",
    link: "/resources",
    keywords: ["podcasts", "audio", "interviews", "listen", "conversations", "talks"]
  },
  {
    title: "Whitepapers & Sovereign AI Reports",
    category: "Resources",
    description: "Download extensive technical reports, security specifications, and sovereign AI readiness assessments.",
    link: "/resources",
    keywords: ["whitepapers", "reports", "download", "technical", "security", "sovereign", "compliance", "assessment"]
  },

  // Company
  {
    title: "Why GFF AI - Philosophy",
    category: "Company",
    description: "Discover our distinct engineering philosophy, trusted corporate oversight, and productized blueprint delivery models.",
    link: "/why-gff-ai",
    keywords: ["why gff ai", "philosophy", "approach", "value", "blueprints", "trust", "advantage"]
  },
  {
    title: "Company Overview & GFF Hubs",
    category: "Company",
    description: "Learn how GFF AI delivers comprehensive transformation from Garage (ideation) to Foundry (forging) to Factory (production scale).",
    link: "/company",
    keywords: ["company", "overview", "garage", "foundry", "factory", "hubs", "delivery", "locations", "presence", "leadership", "mission", "values"]
  }
];

const categoryColors: Record<string, string> = {
  "Industries": "#4F8CFF",     // Premium blue
  "Capabilities": "#9D00FF",   // Purple
  "Platforms": "#E4000F",      // Vibrant Red
  "Build With GFF": "#009DFF", // Cyan/Light Blue
  "Resources": "#E98828",      // Warm Orange
  "Company": "#24D39B"         // Emerald Green
};

const exampleSearches = [
  "Build AI for Banking",
  "Create University AI Lab",
  "Insurance AI",
  "Mining AI",
  "Retail AI",
  "Build AI GCC",
];

export default function QuickSearchSection() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    const terms = query.split(/\s+/).filter(Boolean);
    if (terms.length === 0) return [];

    return staticSearchDatabase.filter((item) => {
      return terms.every((term) => {
        const inTitle = item.title.toLowerCase().includes(term);
        const inDesc = item.description.toLowerCase().includes(term);
        const inCat = item.category.toLowerCase().includes(term);
        const inKeywords = item.keywords.some((kw) => kw.toLowerCase().includes(term));
        return inTitle || inDesc || inCat || inKeywords;
      });
    });
  }, [searchQuery]);

  return (
    <section className="w-full bg-black px-6 lg:px-16 lg:py-24 py-16 border-t border-white/5 relative overflow-hidden">
      {/* Dynamic Background subtle grid and radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,157,255,0.03)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      <div className="max-w-[1795px] mx-auto relative z-10">
        <SectionHeading
          title={
            <h2 className="text-[24px] sm:text-[32px] leading-none font-medium text-center uppercase text-white tracking-wider">
              ENTERPRISE <span className="text-[#009DFF]">QUICK SEARCH</span>
            </h2>
          }
          titleClassName="text-center"
          dividerWidthClassName="w-[260px]"
        />

        <p className="mt-5 mx-auto max-w-[800px] text-center text-white/60 text-[14px] sm:text-[16px] leading-relaxed">
          Ask our AI Concierge or select an enterprise blueprint template below. Explore customized frameworks, pre-built platforms, and engineering models instantly.
        </p>

        {/* AI Concierge Search Box */}
        <div className="mt-10 relative max-w-3xl mx-auto group">
          <div className="absolute -inset-[1px] rounded-[24px] bg-gradient-to-r from-white/10 via-[#009DFF]/20 to-white/10 opacity-75 blur-[2px] group-focus-within:from-[#E4000F]/30 group-focus-within:to-[#009DFF]/40 transition-all duration-500 pointer-events-none" />
          
          <div className="relative flex items-center rounded-[24px] bg-[#050505] border border-white/10 text-white focus-within:border-white/20 transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.85)]">
            <div className="absolute left-6 pointer-events-none text-white/40 group-focus-within:text-[#009DFF] transition-colors duration-300">
              <Search className="h-5 w-5" />
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search GFF AI solutions"
              placeholder="Ask GFF AI (e.g. Build AI for Banking or Mining)..."
              className="w-full pl-15 pr-14 py-5 bg-transparent text-white text-[15px] sm:text-[17px] leading-relaxed focus:outline-none placeholder-white/25 font-normal tracking-wide"
            />

            <AnimatePresence>
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setSearchQuery("")}
                  className="absolute right-6 p-1.5 rounded-full text-white/40 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                  title="Clear search"
                >
                  <X className="h-4.5 w-4.5" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Clickable Templates */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-sm max-w-3xl mx-auto">
          <span className="text-white/45 font-medium mr-1 text-[13px] sm:text-sm">Click examples:</span>
          {exampleSearches.map((example) => {
            const isActive = searchQuery.toLowerCase().trim() === example.toLowerCase().trim();
            return (
              <button
                key={example}
                onClick={() => setSearchQuery(example)}
                className={`px-4 py-2 rounded-[98px] text-[12px] sm:text-[13px] font-medium border transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-[#009DFF]/10 border-[#009DFF]/30 text-[#009DFF] shadow-[0_0_15px_rgba(0,157,255,0.1)]"
                    : "bg-white/[0.02] border-white/5 text-white/60 hover:text-white hover:border-white/15 hover:bg-white/[0.04]"
                }`}
              >
                {example}
              </button>
            );
          })}
        </div>

        {/* Dynamic Display Area */}
        <div className="mt-12 min-h-[160px] relative">
          <AnimatePresence mode="wait">
            {/* 1. Empty/Awaiting State */}
            {!searchQuery && (
              <motion.div
                key="empty-waiting"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="max-w-4xl mx-auto rounded-[28px] border border-white/5 bg-[#030303]/40 p-8 sm:p-10 text-center backdrop-blur-md shadow-2xl"
              >
                {/* <div className="inline-flex h-12 w-12 items-center justify-center rounded-[18px] bg-[#009DFF]/5 border border-[#009DFF]/10 mb-4 text-[#009DFF]">
                  <Sparkles className="h-5 w-5 animate-pulse" />
                </div> */}
                <h3 className="text-[17px] sm:text-lg font-semibold text-white tracking-wide">Enterprise Intelligent Concierge</h3>
                <p className="mt-2 text-sm text-white/50 max-w-2xl mx-auto leading-relaxed font-normal">
                  Our instant search indexing maps core architectural capabilities, delivery platforms, active research whitepapers, and build specifications across GFF AI's entire ecosystem.
                </p>
                <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3 text-left">
                  {Object.entries(categoryColors).map(([cat, color]) => (
                    <div
                      key={cat}
                      className="flex items-center gap-3 rounded-[16px] bg-[#050505]/60 border border-white/[0.03] p-4 transition-all duration-300 hover:border-white/10"
                    >
                      <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                      <span className="text-[12px] sm:text-[13px] font-semibold text-white/80 tracking-wide uppercase">{cat}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 2. No Match State */}
            {searchQuery && filteredResults.length === 0 && (
              <motion.div
                key="no-match"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="max-w-2xl mx-auto rounded-[28px] border border-white/5 bg-[#030303]/40 p-8 sm:p-10 text-center backdrop-blur-md shadow-2xl"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/5 mb-4 text-white/30">
                  <Search className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-white tracking-wide">No custom AI paths found</h3>
                <p className="mt-2 text-sm text-white/50 max-w-md mx-auto leading-relaxed">
                  We couldn't find matching capabilities for <span className="text-[#009DFF] font-medium">"{searchQuery}"</span>. Try typing other terms or clicking one of the templates above.
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-6 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white/80 hover:text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer"
                >
                  Reset Concierge Search
                </button>
              </motion.div>
            )}

            {/* 3. Search Results State */}
            {searchQuery && filteredResults.length > 0 && (
              <motion.div
                key="results-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`grid grid-cols-1 gap-5 mx-auto ${
  filteredResults.length === 1 ? "max-w-2xl" : "md:grid-cols-2 max-w-5xl"
}`}
              >
                {filteredResults.map((result, idx) => {
                  const color = categoryColors[result.category] || "#009DFF";
                  return (
                    <motion.div
                      key={result.title}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: Math.min(idx * 0.05, 0.25) }}
                      className="group relative h-full rounded-[24px] border border-white/5 bg-[#050505] p-6 hover:bg-[#070707] hover:border-white/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(0,157,255,0.06)] flex flex-col justify-between"
                    >
                      {/* Left border accent line representing the category color */}
                      <div
                        className="absolute left-0 top-6 bottom-6 w-[3px] rounded-r-[4px] transition-all duration-300 group-hover:scale-y-110"
                        style={{ backgroundColor: color }}
                      />

                      <div className="pl-4 flex flex-col h-full justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-3">
                            <span
                              className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.15em]"
                              style={{ color }}
                            >
                              {result.category}
                            </span>
                          </div>

                          <h4 className="mt-2 text-base sm:text-[18px] font-semibold text-white tracking-wide group-hover:text-[#009DFF] transition-colors duration-300">
                            {result.title}
                          </h4>

                          <p className="mt-3 text-[13px] sm:text-[14px] text-white/60 leading-relaxed font-normal">
                            {result.description}
                          </p>
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/[0.03] flex items-center justify-between text-xs sm:text-[13px] font-medium text-white/40 group-hover:text-white transition-colors duration-300">
                          <span>Explore Solution Specs</span>
                          <Link href={result.link} className="flex items-center gap-1 text-[#009DFF] hover:underline">
                            Explore <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
