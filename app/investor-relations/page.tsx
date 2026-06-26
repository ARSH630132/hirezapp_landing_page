"use client";

import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";

export default function InvestorRelationsPage() {
  const highlights = [
    { title: "Market Alignment", desc: "GFF AI addresses the massive $150B enterprise AI consulting and orchestration gap with lightweight, high-performance, productized cognitive assets." },
    { title: "Bilateral Stability", desc: "Our subscription models, managed SLAs, and dedicated platforms ensure highly predictable enterprise client retention and scaling margins." },
    { title: "Capital Efficiency", desc: "Our remote-first, high-density engineering strategy decouples physical infrastructure overhead from core technology developments." }
  ];

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Financial Operations"
        title="Investor Relations"
        highlightedWord="Investor"
        description="Access GFF AI's institutional milestones, enterprise growth trajectories, and corporate development updates."
      />

      <div className="max-w-[1200px] mx-auto px-6 lg:px-16 pb-24 text-white/80 font-light text-[15px] space-y-12">
        <div className="p-8 rounded-[24px] border border-white/5 bg-[#050505]/60 backdrop-blur-[12px] space-y-4">
          <h2 className="text-[20px] font-semibold text-white tracking-tight">Institutional Positioning</h2>
          <p className="text-white/70 leading-[1.7]">
            GFF AI is backed by premium corporate capital and institutional AI visionaries. We deploy custom agent clusters into high-security finance, logistics, and manufacturing networks, capturing high-retention enterprise ARR.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {highlights.map((item) => (
            <div key={item.title} className="p-6 rounded-[20px] border border-white/5 bg-[#050505]/60 backdrop-blur-[12px] hover:border-[#009DFF]/20 transition-all">
              <h3 className="text-[16px] font-semibold text-white tracking-tight">{item.title}</h3>
              <p className="mt-3 text-[13px] leading-[1.6] text-white/60 font-light">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="p-8 rounded-[24px] border border-white/5 bg-[#050505]/60 backdrop-blur-[12px] space-y-4">
          <h2 className="text-[18px] font-semibold text-white tracking-tight">Inquiries and Contact</h2>
          <p className="text-white/70 leading-[1.7]">
            For qualified corporate development inquiries, shareholder materials, or institutional pilot reviews, please contact our administrative desk directly at <a href="mailto:investors@gff.ai" className="text-[#009DFF] hover:underline">investors@gff.ai</a>.
          </p>
        </div>
      </div>
    </InnerPageShell>
  );
}