"use client";

import React from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import CompanyNavigation from "@/components/inner-pages/CompanyNavigation";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";
import { Handshake, Network, GraduationCap, Server } from "lucide-react";

export default function CompanyPartnersPage() {
  const pathways = [
    {
      title: "Systems Integrators",
      icon: <Network className="w-5 h-5 text-[#E4000F]" />,
      desc: "For global consultancies and integration firms looking to scale high-throughput, deterministic multi-agent networks within their existing client accounts.",
    },
    {
      title: "Academic Co-Innovation",
      icon: <GraduationCap className="w-5 h-5 text-[#009DFF]" />,
      desc: "Joint research projects with specialized computer science departments focusing on heuristic reasoning networks, state isolation, and secure agency.",
    },
    {
      title: "Technology Alliances",
      icon: <Server className="w-5 h-5 text-purple-400" />,
      desc: "Deep-level integration partnerships with zero-trust sandboxing systems, database networks, and cloud providers to optimize the agent execution layer.",
    },
  ];

  return (
    <InnerPageShell>
      <CompanyNavigation />
      <InnerPageHero
        category="Partner Ecosystem"
        title="Accelerating the Agent Economy Together"
        highlightedWord="Agent Economy"
         visualType="partners"
        description="We align with elite systems integrators, leading academic laboratories, and core infrastructure providers to establish reliable standards for autonomous enterprise operations."
      />

      <section className="relative w-full px-6 lg:px-16 pb-16">
        <div className="max-w-[1795px] mx-auto">
          <div className="text-center max-w-[800px] mx-auto mb-12">
            <span className="text-[10px] font-mono tracking-[0.2em] text-[#009DFF] uppercase font-bold">Co-Innovation Pathways</span>
            <h2 className="text-[28px] sm:text-[34px] font-bold text-white tracking-tight mt-2">Strategic Alliance Framework</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pathways.map((item, idx) => (
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
            title="Become an Authorized GFF Partner"
            description="Initiate a structural discussion with our alliances team to map compatibility and joint go-to-market strategies."
            primaryLabel="Apply for Partnership"
            secondaryLabel="View Strategic Advisors"
            secondaryHref="/company/advisors"
          />
        </div>
      </section>
    </InnerPageShell>
  );
}
