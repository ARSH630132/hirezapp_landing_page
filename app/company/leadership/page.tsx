"use client";

import React from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import CompanyNavigation from "@/components/inner-pages/CompanyNavigation";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";
import { User, ShieldCheck, Cpu, Briefcase } from "lucide-react";

export default function CompanyLeadershipPage() {
  const leadershipRoles = [
    {
      name: "Dr. Ashish Chandra",
      role: "Founder & Chief Executive Officer",
      icon: <User className="w-5 h-5 text-[#E4000F]" />,
      bio: "An industry visionary in autonomous AI networks and high-throughput systems. Dr. Chandra leads GFF AI's strategic mandate, guiding enterprises towards the secure Agent Economy.",
      status: "Active",
    },
    {
      name: "Office of the CTO",
      role: "Chief Technology Officer",
      icon: <Cpu className="w-5 h-5 text-[#009DFF]" />,
      bio: "Leading development of deterministic routing algorithms, state isolation modules, and GFF AI's core runtime environment.",
      status: "Executive Committee",
    },
    {
      name: "Office of the COO",
      role: "Chief Operating Officer",
      icon: <Briefcase className="w-5 h-5 text-purple-400" />,
      bio: "Overseeing international client deployments and global hubs, assuring alignment with regional regulatory parameters.",
      status: "Executive Committee",
    },
    {
      name: "Cognitive Security Lead",
      role: "VP of Safety & Compliance",
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      bio: "Ensuring zero-trust sandboxing and SOC2 auditability protocols are standard across all GFF client installations.",
      status: "Executive Committee",
    },
  ];

  return (
    <InnerPageShell>
      <CompanyNavigation />
      <InnerPageHero
        category="Corporate Leadership"
        title="Led by Visionaries in AI Architecture"
        highlightedWord="AI Architecture"
        description="GFF AI is founded and led by CEO Dr. Ashish Chandra, coordinating a global team of systems architects, safety researchers, and deployment specialists."
      />

      {/* Leadership Profile Section */}
      <section className="relative w-full px-6 lg:px-16 pb-16">
        <div className="max-w-[1795px] mx-auto">
          <div className="text-center sm:text-left max-w-[800px] mb-12">
            <span className="text-[10px] font-mono tracking-[0.2em] text-[#009DFF] uppercase font-bold">Executive Council</span>
            <h2 className="text-[28px] sm:text-[34px] font-bold text-white tracking-tight mt-2">The GFF Executive Committee</h2>
            <p className="text-[14px] text-white/60 font-light mt-3">
              Combining world-class systems design with enterprise operational expertise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {leadershipRoles.map((member) => (
              <div
                key={member.role}
                className="p-8 rounded-[24px] border border-white/5 bg-[#030304]/40 hover:border-[#009DFF]/20 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-center">
                      {member.icon}
                    </div>
                    <span className="px-2.5 py-1 text-[9px] font-mono tracking-wider text-[#009DFF] bg-[#009DFF]/5 border border-[#009DFF]/15 rounded-full uppercase">
                      {member.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-[20px] font-bold text-white tracking-tight">{member.name}</h3>
                    <p className="text-[11px] font-mono uppercase text-[#E4000F] tracking-widest mt-1">
                      {member.role}
                    </p>
                  </div>

                  <p className="text-[13.5px] leading-[1.6] text-white/70 font-light font-sans pt-2">
                    {member.bio}
                  </p>
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
            title="Coordinate with Our Executive Officers"
            description="Discuss high-level AI deployment mandates directly with our strategy and operations teams."
            primaryLabel="Initiate Executive Consultation"
            secondaryLabel="Explore Locations"
            secondaryHref="/company/locations"
          />
        </div>
      </section>
    </InnerPageShell>
  );
}
