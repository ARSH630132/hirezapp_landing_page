"use client";

import React, { useState } from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import CompanyNavigation from "@/components/inner-pages/CompanyNavigation";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";
import { ShieldCheck, FileText, Lock } from "lucide-react";

export default function CompanyInvestorsPage() {
  const [copied, setCopied] = useState(false);

  const reports = [
    {
      title: "Corporate Governance Framework 2026",
      type: "PDF Document",
      size: "2.4 MB",
      desc: "Detailed guidelines concerning our multi-agent risk boundaries, state isolation controls, and board oversights.",
    },
    {
      title: "Strategic Market Outlook",
      type: "Executive Briefing",
      size: "1.8 MB",
      desc: "Our structural analysis of the industrial Agent Economy and corporate roadmap through 2028.",
    },
  ];

  return (
    <InnerPageShell>
      <CompanyNavigation />
      <InnerPageHero
        category="Investor Relations"
        title="Fiscal Integrity & Systemic Trust"
        highlightedWord="Integrity"
        visualType="investors"
        description="GFF AI PTE. LTD. maintains strict operational discipline, governed by a rigorous risk-management framework and transparent institutional standards."
      />

      <section className="relative w-full px-6 lg:px-16 pb-16">
        <div className="max-w-[1795px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <span className="text-[10px] font-mono tracking-[0.2em] text-[#E4000F] uppercase font-bold font-semibold">Institutional Capital</span>
            <h2 className="text-[28px] sm:text-[34px] font-bold text-white tracking-tight">Structured for Long-Term Scale</h2>
            <p className="text-[14px] leading-[1.6] text-white/70 font-light font-sans">
              We operate with high capital efficiency, channeling resource allocations into deep infrastructure development, deterministic compiler safety research, and global hub operations.
            </p>
            
            <div className="space-y-4 pt-4">
              <h3 className="text-[16px] font-semibold text-white">Governance Folders</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {reports.map((rep) => (
                  <div key={rep.title} className="p-4 rounded-xl border border-white/5 bg-[#030304]/40 flex flex-col justify-between">
                    <div>
                      <h4 className="text-[14px] font-semibold text-white">{rep.title}</h4>
                      <p className="text-[12px] text-white/50 mt-1 font-sans">{rep.desc}</p>
                    </div>
                    <span className="text-[9px] font-mono text-[#009DFF] uppercase mt-4 block">Available upon authorization</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Secure Portal Preview */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-[24px] border border-white/5 bg-[#050505]/60 backdrop-blur-[12px] space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-gradient-to-bl from-[#009DFF]/10 to-transparent rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono text-emerald-400 uppercase flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 animate-pulse" />
                  <span>Secure Server</span>
                </span>
                <Lock className="w-3.5 h-3.5 text-white/30" />
              </div>

              <h3 className="text-[17px] font-semibold text-white tracking-tight">Shareholder Gateway</h3>
              <p className="text-[12.5px] leading-[1.5] text-white/60 font-sans">
                Access verified fiscal audits, board minutes, and deployment telemetry dashboards. Access is restricted to authorized partners.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="w-full h-[40px] rounded-lg border border-[#009DFF]/20 bg-[#009DFF]/5 hover:bg-[#009DFF]/10 text-white text-[12.5px] font-mono uppercase tracking-wider transition-all"
                >
                  {copied ? "SIMULATING REGISTRATION" : "REQUEST SHAREHOLDER ACCESS"}
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Premium CTA */}
      <section className="relative w-full px-6 lg:px-16 pb-16">
        <div className="max-w-[1795px] mx-auto">
          <PremiumCTA
            title="Inquire About Strategic Allocation"
            description="Our treasury and corporate governance team handles qualified institutional inquiries with high discretion."
            primaryLabel="Contact Treasury"
            secondaryLabel="Explore Leadership"
            secondaryHref="/company/leadership"
          />
        </div>
      </section>
    </InnerPageShell>
  );
}
