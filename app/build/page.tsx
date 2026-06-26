"use client";

import Link from "next/link";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";

export default function BuildHubPage() {
  const tools = [
    {
      title: "Blueprint Generator",
      href: "/build/blueprint",
      desc: "Generate custom multi-agent execution roadmaps based on your security, integration, and performance criteria."
    },
    {
      title: "ROI Calculator",
      href: "/build/roi",
      desc: "Calculate dynamic compute savings, staff efficiency multipliers, and dynamic ROI projections."
    },
    {
      title: "Live Assessment",
      href: "/build/assessment",
      desc: "Check your data readiness score, API density, and security compliance levels for autonomous operations."
    },
    {
      title: "Foundry Studio Simulator",
      href: "/build/foundry-studio",
      desc: "Interactive visual workspace simulating real-time multi-agent DAG configurations."
    },
    {
      title: "Talk to Agent",
      href: "/build/talk",
      desc: "Test-drive our active conversational model built with advanced semantic memory and safety guardrails."
    },
    {
      title: "Assets Marketplace",
      href: "/build/marketplace",
      desc: "Explore pre-packaged agent files, validated connector recipes, and compliance templates."
    }
  ];

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Interactive Workshop"
        title="Build with GFF AI"
        highlightedWord="Build"
        description="Deploy our interactive calculators, blueprint architects, and sandboxed simulation environments to map your AI roadmap."
      />

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <div key={tool.title} className="p-6 rounded-[20px] border border-white/5 bg-[#050505]/60 backdrop-blur-[12px] flex flex-col justify-between hover:border-[#009DFF]/20 transition-all group">
              <div>
                <span className="text-[10px] uppercase font-mono text-[#009DFF] tracking-wider font-semibold">INTERACTIVE UTILITY</span>
                <h3 className="text-[18px] font-semibold text-white tracking-tight mt-2 group-hover:text-[#009DFF] transition-colors">{tool.title}</h3>
                <p className="mt-3 text-[13px] leading-[1.6] text-white/60 font-light">{tool.desc}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5">
                <Link href={tool.href} className="inline-flex items-center gap-1.5 text-white hover:text-[#009DFF] text-[13px] font-semibold uppercase">
                  <span>Launch Tool</span>
                  <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </InnerPageShell>
  );
}