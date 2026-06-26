"use client";

import Link from "next/link";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";

export default function PlatformsHubPage() {
  const platforms = [
    {
      title: "Foundry Studio",
      href: "/platforms/foundry",
      desc: "Our premium visual DAG workspace where you connect cognitive reasoning cores, relational database ingest hubs, and real-time security guardrails.",
      features: ["Visual Flow Builder", "Hot-swap Models", "Active Telemetry Logs", "SOC2 Secured"],
      buttonText: "Launch Studio View"
    },
    {
      title: "GFF Marketplace",
      href: "/platforms/marketplace",
      desc: "An enterprise directory of pre-packaged autonomous agents, specialized compliance guardrails, and dynamic API connector recipes.",
      features: ["Pre-built Agent Clusters", "Certified Connectors", "One-Click Sandbox Deploy", "Audit-Ready Logs"],
      buttonText: "Browse Marketplace"
    }
  ];

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Productized Assets"
        title="Platforms and Products"
        highlightedWord="Platforms"
        description="Access GFF AI's signature developer platforms, visual orchestrators, and pre-packaged agent marketplaces."
      />

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {platforms.map((plat) => (
            <div key={plat.title} className="p-8 rounded-[24px] border border-white/5 bg-[#050505]/60 backdrop-blur-[12px] flex flex-col justify-between hover:border-[#009DFF]/20 transition-all group">
              <div>
                <span className="text-[10px] uppercase font-mono text-[#009DFF] tracking-wider font-bold">ENTERPRISE PLATFORM</span>
                <h2 className="text-[24px] font-bold text-white tracking-tight mt-2">{plat.title}</h2>
                <p className="mt-4 text-[14.5px] leading-[1.6] text-white/70 font-light">{plat.desc}</p>
                
                <ul className="mt-6 space-y-2.5">
                  {plat.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2.5 text-[13.5px] text-white/80">
                      <svg className="w-4 h-4 text-[#009DFF] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="font-light">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5">
                <Link href={plat.href} className="inline-flex w-full h-[48px] items-center justify-center rounded-xl bg-gradient-to-r from-[#E4000F] to-[#009DFF] text-white text-[14.5px] font-semibold hover:opacity-95 transition-opacity">
                  {plat.buttonText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </InnerPageShell>
  );
}