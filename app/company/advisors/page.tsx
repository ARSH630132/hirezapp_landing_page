"use client";

import React from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import CompanyNavigation from "@/components/inner-pages/CompanyNavigation";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";
import { ShieldAlert, Cpu, Network, UserCheck } from "lucide-react";

export default function CompanyAdvisorsPage() {
  const pillars = [
    {
      title: "Regulatory Compliance Advisory",
      icon: <ShieldAlert className="w-5 h-5 text-[#E4000F]" />,
      desc: "Guiding GFF AI on international digital governance, PII boundaries, and EU/UK/Singapore compliance parameters.",
    },
    {
      title: "Industrial Automation Scale",
      icon: <Cpu className="w-5 h-5 text-[#009DFF]" />,
      desc: "Laying out rigorous benchmarks modeled after critical industrial SCADA systems and sub-millisecond network topologies.",
    },
    {
      title: "Enterprise Strategy & Delivery",
      icon: <Network className="w-5 h-5 text-purple-400" />,
      desc: "Assisting in high-level roadmap modeling to ease the transition of global retail, telecom, and banking systems into autonomous workflows.",
    },
  ];

  return (
    <InnerPageShell>
      <CompanyNavigation />
      <InnerPageHero
        category="Strategic Advisory"
        title="Governed by Industry-Standard Advisors"
        highlightedWord="Advisors"
        visualType="advisors"
        description="Our Strategic Advisory Board brings together leading perspectives in compliance, secure systems, and enterprise scaling to assure GFF operations meet the highest institutional standards."
      />

      <section className="relative w-full px-6 lg:px-16 pb-16">
        <div className="max-w-[1795px] mx-auto">
          <div className="text-center max-w-[800px] mx-auto mb-12">
            <span className="text-[10px] font-mono tracking-[0.2em] text-[#009DFF] uppercase font-bold font-semibold">Governance Framework</span>
            <h2 className="text-[28px] sm:text-[34px] font-bold text-white tracking-tight mt-2">Advisory Pillars</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((item, idx) => (
              <div key={idx} className="p-6 rounded-[20px] border border-white/5 bg-[#030304]/40 hover:border-[#009DFF]/25 transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-9 h-9 rounded-lg bg-white/[0.02] border border-white/10 flex items-center justify-center">{item.icon}</div>
                  <h3 className="text-[17px] font-semibold text-white tracking-tight">{item.title}</h3>
                  <p className="text-[13px] leading-[1.6] text-white/60 font-light font-sans">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium CTA */}
      <section className="relative w-full px-6 lg:px-16 pb-16">
        <div className="max-w-[1795px] mx-auto">
          <PremiumCTA
            title="Learn More About Our Governance"
            description="Our advisors work behind the scenes to keep our technologies secure and compliant. Request a compliance briefing."
            primaryLabel="Request Briefing Document"
            secondaryLabel="View Open Roles"
            secondaryHref="/company/careers"
          />
        </div>
      </section>
    </InnerPageShell>
  );
}
