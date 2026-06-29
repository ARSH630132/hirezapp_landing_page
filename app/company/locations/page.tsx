"use client";

import React, { useState } from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import CompanyNavigation from "@/components/inner-pages/CompanyNavigation";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";
import { MapPin, Clock, ShieldCheck } from "lucide-react";

export default function CompanyLocationsPage() {
  const [activeLocation, setActiveLocation] = useState("sg");

  const locations = [
    {
      id: "sg",
      city: "Singapore",
      title: "Global Headquarters",
      facility: "GFF AI Corporate HQ & Core Memory Sync",
      scope: "Global operations governance, regulatory compliance, and executive leadership council.",
      timezone: "SGT (UTC+8)",
      sla: "24/7 Operations Monitoring",
    },
    {
      id: "uk",
      city: "London",
      title: "Client Innovation Centre",
      facility: "Strategic Architecture Lab",
      scope: "Enterprise alignment workshops, bespoke sandboxing, and European compliance mapping.",
      timezone: "GMT/BST (UTC+0/+1)",
      sla: "Dedicated Regional Architect Desk",
    },
    {
      id: "in",
      city: "India",
      title: "AI Engineering Factory",
      facility: "Systems Engineering Core",
      scope: "Asynchronous execution testing, multi-agent state coordination, and telemetry design.",
      timezone: "IST (UTC+5:30)",
      sla: "High-Throughput Engineering Support",
    },
  ];

  const currentLoc = locations.find((l) => l.id === activeLocation) || locations[0];

  return (
    <InnerPageShell>
      <CompanyNavigation />
      <InnerPageHero
        category="Global Footprint"
        title="Physical Hubs Operating at Global Scale"
        highlightedWord="Global Scale"
        description="GFF AI coordinates operations across three primary global regions, ensuring 24/7 telemetry monitoring, continuous engineering, and secure system redundancy."
        visualType="countries"
      />

      <section className="relative w-full px-6 lg:px-16 pb-16">
        <div className="max-w-[1795px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="relative w-full max-w-[500px] aspect-[16/10] rounded-[20px] border border-white/5 bg-black/40 p-4 overflow-hidden flex items-center justify-center">
              <svg className="w-full h-full opacity-70" viewBox="0 0 500 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 0 50 L 500 50 M 0 150 L 500 150 M 0 250 L 500 250" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                <path d="M 160 110 Q 250 135 340 160" stroke="rgba(0,157,255,0.15)" strokeWidth="1" strokeDasharray="4 4" />
                <path d="M 340 160 Q 350 185 360 210" stroke="rgba(228,0,15,0.15)" strokeWidth="1" strokeDasharray="4 4" />

                <g className="cursor-pointer" onClick={() => setActiveLocation("uk")}>
                  <circle cx="160" cy="110" r="5" fill={activeLocation === "uk" ? "#E4000F" : "#009DFF"} />
                  <text x="160" y="100" fill="white" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">London</text>
                </g>
                <g className="cursor-pointer" onClick={() => setActiveLocation("in")}>
                  <circle cx="340" cy="160" r="5" fill={activeLocation === "in" ? "#E4000F" : "#009DFF"} />
                  <text x="340" y="150" fill="white" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">India Core</text>
                </g>
                <g className="cursor-pointer" onClick={() => setActiveLocation("sg")}>
                  <circle cx="360" cy="210" r="5" fill={activeLocation === "sg" ? "#E4000F" : "#009DFF"} />
                  <text x="360" y="200" fill="white" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">Singapore HQ</text>
                </g>
              </svg>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-between p-6 rounded-[20px] border border-white/5 bg-[#050505]/60 backdrop-blur-[12px]">
            <div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#E4000F]" />
                <span className="text-[10px] font-mono tracking-widest text-[#E4000F] uppercase font-bold">{currentLoc.title}</span>
              </div>
              <h3 className="text-[18px] font-bold text-white mt-1.5">{currentLoc.city} Core Hub</h3>
              <p className="text-[13px] leading-[1.6] text-white/70 mt-3 font-light font-sans">{currentLoc.scope}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 space-y-2 text-[11px] font-mono text-white/60">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#009DFF]" />
                <span>Timezone: {currentLoc.timezone}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Coverage: {currentLoc.sla}</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      <section className="relative w-full px-6 lg:px-16 pb-16">
        <div className="max-w-[1795px] mx-auto">
          <PremiumCTA
            title="Map Your Regional Compliance"
            description="Our regional desks can map local deployment structures and compliance protocols for your enterprise."
            primaryLabel="Contact Regional Architect"
            secondaryLabel="View Our Partners"
            secondaryHref="/company/partners"
          />
        </div>
      </section>
    </InnerPageShell>
  );
}
