"use client";

import React from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import CompanyNavigation from "@/components/inner-pages/CompanyNavigation";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";
import { Shield, Layers, Cpu, Network, CheckCircle2 } from "lucide-react";

export default function CompanyProfilePage() {
  const divisions = [
    {
      title: "Garage Foundry Factory Model",
      icon: <Layers className="w-5 h-5 text-[#E4000F]" />,
      desc: "Our standard blueprint transitioning systems from sandbox sandboxing to production scaling.",
    },
    {
      title: "GFF AI Research Division",
      icon: <Cpu className="w-5 h-5 text-[#009DFF]" />,
      desc: "Formulating deterministic routing and state isolation standards for the global agent economy.",
    },
    {
      title: "Architects of the Agent Economy",
      icon: <Network className="w-5 h-5 text-purple-400" />,
      desc: "Setting standards for secure, compliant, and state-isolated multi-agent enterprise deployments.",
    },
  ];

  return (
    <InnerPageShell>
      <CompanyNavigation />
      <InnerPageHero
        category="Corporate Profile"
        title="Architects of the Agent Economy"
        highlightedWord="Agent Economy"
        description="GFF AI PTE. LTD. (UEN 202621347N) is a premier global AI strategy and deployment firm. We build and scale high-throughput, secure, and compliant agentic systems to run complex workflows for global enterprises."
      />

      <section className="relative w-full px-6 lg:px-16 pb-16">
        <div className="max-w-[1795px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-[10px] font-mono tracking-[0.2em] text-[#E4000F] uppercase font-bold">Institutional Mandate</span>
            <h2 className="text-[28px] sm:text-[34px] font-bold text-white tracking-tight">Industrializing Cognitive Intelligence</h2>
            <p className="text-[14px] leading-[1.6] text-white/70 font-light font-sans">
              Founded under the leadership of CEO Dr. Ashish Chandra, GFF AI stands as a specialized institution dedicated to bridging the gap between cutting-edge LLM reasoning and hard-nosed deterministic operational metrics.
            </p>
            <p className="text-[14px] leading-[1.6] text-white/70 font-light font-sans">
              Through our trademarked Garage, Foundry, and Factory operating model, we transition enterprises from exploratory sandboxes to industrial-scale, zero-trust autonomous agent clusters.
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="p-6 rounded-[20px] border border-white/5 bg-[#050505]/60 backdrop-blur-[12px] space-y-4 relative overflow-hidden">
              <h3 className="text-[15px] font-semibold text-white tracking-tight flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#009DFF]" />
                <span>Corporate Verification</span>
              </h3>
              <div className="space-y-2 text-[12px]">
                {[
                  { label: "Registered Entity", value: "GFF AI PTE. LTD." },
                  { label: "UEN Identification", value: "202621347N" },
                  { label: "Headquarters", value: "Singapore" },
                  { label: "Locations Hub", value: "Singapore, London, India" },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-white/5 last:border-b-0">
                    <span className="text-white/40 font-mono uppercase tracking-wider text-[9px]">{item.label}</span>
                    <span className="text-white/80 font-medium font-sans">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative w-full px-6 lg:px-16 pb-16 border-t border-white/5 pt-16">
        <div className="max-w-[1795px] mx-auto">
          <h2 className="text-[22px] font-bold text-white tracking-tight mb-8">Our Organizational Divisions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {divisions.map((item, idx) => (
              <div key={idx} className="p-6 rounded-[16px] border border-white/5 bg-[#030304]/40 hover:border-[#009DFF]/20 transition-all flex flex-col justify-between group">
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded bg-white/[0.02] border border-white/10 flex items-center justify-center">{item.icon}</div>
                  <h3 className="text-[15px] font-semibold text-white tracking-tight">{item.title}</h3>
                  <p className="text-[12.5px] leading-[1.5] text-white/60 font-light font-sans">{item.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-[#009DFF] uppercase tracking-wider">
                  <span>Authorized Division</span>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative w-full px-6 lg:px-16 pb-16">
        <div className="max-w-[1795px] mx-auto">
          <PremiumCTA
            title="Operationalize Your AI Ambitions"
            description="Consult our lead architects to transition from conceptual sandboxes to secure, multi-agent automated production loops."
            primaryLabel="Schedule Architecture Briefing"
            secondaryLabel="View Locations"
            secondaryHref="/company/locations"
          />
        </div>
      </section>
    </InnerPageShell>
  );
}
