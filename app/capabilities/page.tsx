"use client";

import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import EnterpriseFlowDiagram from "@/components/inner-pages/EnterpriseFlowDiagram";

export default function CapabilitiesPage() {
  const capabilities = [
    {
      id: "agentic-ai",
      title: "Agentic AI",
      desc: "Deploy autonomous multi-agent clusters capable of dynamic task routing, sub-agent spawning, and transactional isolation."
    },
    {
      id: "governance",
      title: "AI Governance & Compliance",
      desc: "Real-time compliance monitors and AI safety guardrails that scan inputs/outputs for PII leaks, safety violations, and security policy adherence."
    },
    {
      id: "managed-ai",
      title: "Managed AI Services",
      desc: "Fully managed AI operations with continuous model fine-tuning, latency optimization, cost management, and 24/7 uptime guarantees."
    },
    {
      id: "knowledge-graph",
      title: "Knowledge Graphs & Vector DBs",
      desc: "High-performance vector retrieval architectures coupled with rich structured graph reasoning for complex multi-hop contextual intelligence."
    },
    {
      id: "labs",
      title: "AI Labs & Prototyping",
      desc: "Collaborative sandbox environments designed for rapid prototyping, ROI modeling, and testing heuristic agent configurations."
    }
  ];

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Enterprise Tech"
        title="Our Capabilities"
        highlightedWord="Capabilities"
        description="GFF AI provides high-performance, enterprise-grade cognitive architectures and security frameworks to power your autonomous operations."
      />

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-16">
        <h2 className="text-[26px] sm:text-[34px] font-bold text-white tracking-tight mb-8">
          Interactive Agent Execution Flow
        </h2>
        <EnterpriseFlowDiagram />
      </div>

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-24">
        <h2 className="text-[26px] sm:text-[34px] font-bold text-white tracking-tight mb-8">
          Core Capabilities Directory
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((cap) => (
            <div key={cap.id} id={cap.id} className="p-6 rounded-[20px] border border-white/5 bg-[#050505]/60 backdrop-blur-[12px] hover:border-[#009DFF]/20 transition-all group">
              <span className="text-[10px] uppercase font-mono text-[#009DFF] tracking-wider font-semibold">CAPABILITY</span>
              <h3 className="text-[18px] font-semibold text-white tracking-tight mt-2 group-hover:text-[#009DFF] transition-colors">{cap.title}</h3>
              <p className="mt-3 text-[13.5px] leading-[1.6] text-white/60 font-light">{cap.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </InnerPageShell>
  );
}