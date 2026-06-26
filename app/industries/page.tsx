"use client";

import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import IndustrySolutionMap from "@/components/inner-pages/IndustrySolutionMap";

export default function IndustriesPage() {
  const industries = [
    {
      id: "finance",
      title: "Financial Services",
      desc: "Deploy liquidity rebalancing, compliance auditing, and automated anti-money laundering agents across high-frequency ledgers."
    },
    {
      id: "manufacturing",
      title: "Advanced Manufacturing",
      desc: "Real-time predictive maintenance, factory floor computer-vision inspection, and automated supply-demand coordinating systems."
    },
    {
      id: "logistics",
      title: "Supply Chain & Logistics",
      desc: "Optimized autonomous vehicle routing, real-time inventory velocity calculations, and automatic document parsers for global freight."
    },
    {
      id: "healthcare",
      title: "Healthcare & Life Sciences",
      desc: "Privacy-compliant clinical trials coordination, medical documentation parsing, and diagnostic assistance pipelines."
    },
    {
      id: "insurance",
      title: "Insurance",
      desc: "Automated underwriting heuristics, claims scanning pipelines, and customer support agent routing for immediate processing."
    },
    {
      id: "telecom",
      title: "Telecom & Networks",
      desc: "Autonomous edge routing, predictive signal analysis, and real-time support chatbots configured with cognitive memory."
    }
  ];

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Vertical Solutions"
        title="Industries We Transform"
        highlightedWord="Industries"
        description="GFF AI engineers custom cognitive architectures calibrated for the specific security, compliance, and velocity needs of your sector."
      />

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-16">
        <h2 className="text-[26px] sm:text-[34px] font-bold text-white tracking-tight mb-8">
          Interactive Industry Automation Hotspots
        </h2>
        <IndustrySolutionMap />
      </div>

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-24">
        <h2 className="text-[26px] sm:text-[34px] font-bold text-white tracking-tight mb-8">
          Industry Solutions Directory
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((ind) => (
            <div key={ind.id} id={ind.id} className="p-6 rounded-[20px] border border-white/5 bg-[#050505]/60 backdrop-blur-[12px] hover:border-[#009DFF]/20 transition-all group">
              <span className="text-[10px] uppercase font-mono text-[#009DFF] tracking-wider font-semibold">SECTOR</span>
              <h3 className="text-[18px] font-semibold text-white tracking-tight mt-2 group-hover:text-[#009DFF] transition-colors">{ind.title}</h3>
              <p className="mt-3 text-[13.5px] leading-[1.6] text-white/60 font-light">{ind.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </InnerPageShell>
  );
}