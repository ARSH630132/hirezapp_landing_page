"use client";

import React, { useState } from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import CompanyNavigation from "@/components/inner-pages/CompanyNavigation";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";
import { Download, Globe, FileText, Check } from "lucide-react";
import { downloadAssetLinks } from "@/lib/cta-links";

export default function CompanyMediaPage() {
  const [downloaded, setDownloaded] = useState<string | null>(null);

  const assets = [
    {
      id: "brand",
      title: "Corporate Brand Book",
      type: "PDF Guide",
      spec: "SVG logos, premium dark theme colors, typography guidelines.",
      href: downloadAssetLinks.brand,
    },
    {
      id: "boilerplate",
      title: "Official Press Boilerplate",
      type: "PDF Document",
      spec: "Verified corporate descriptions of GFF AI PTE. LTD. and UEN 202621347N.",
      href: downloadAssetLinks.boilerplate,
    },
  ];

  const handleDownload = (id: string) => {
    setDownloaded(id);
    setTimeout(() => setDownloaded(null), 2500);
  };

  return (
    <InnerPageShell>
      <CompanyNavigation />
      <InnerPageHero
        category="Media Kit"
        title="Official Brand Resources and Assets"
        highlightedWord="Resources"
        description="Access verified company information, downloadable high-resolution logos, and official boilerplate statements for publication."
      />

      {/* Brand assets section */}
      <section className="relative w-full px-6 lg:px-16 pb-16">
        <div className="max-w-[1795px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-7 space-y-6">
            <span className="text-[10px] font-mono tracking-[0.2em] text-[#E4000F] uppercase font-bold">Verified Boilerplate</span>
            <div className="p-6 rounded-[20px] border border-white/5 bg-[#030304]/40 space-y-4">
              <h3 className="text-[16px] font-semibold text-white">About GFF AI</h3>
              <p className="text-[13.5px] leading-[1.7] text-white/70 font-light font-sans">
                GFF AI PTE. LTD. (UEN 202621347N) is a global AI strategy and deployment firm. Known as the Architects of the Agent Economy, the company was founded and is led by CEO Dr. Ashish Chandra. Operating physical co-innovation cores in Singapore, London, and India, GFF AI transitions global enterprises from exploratory design (Garage) to dedicated multi-agent development (Foundry) to deterministic, high-throughput production (Factory).
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <span className="text-[10px] font-mono tracking-[0.2em] text-[#009DFF] uppercase font-bold">Downloadable Kits</span>
            <div className="space-y-4">
              {assets.map((asset) => (
                <div key={asset.id} className="p-5 rounded-[20px] border border-white/5 bg-[#050505]/60 backdrop-blur-[12px] flex items-center justify-between gap-6">
                  <div>
                    <h4 className="text-[14.5px] font-semibold text-white">{asset.title}</h4>
                    <span className="text-[9px] font-mono text-[#009DFF] uppercase tracking-wider block mt-0.5">{asset.type}</span>
                    <p className="text-[12.5px] text-white/50 font-light font-sans mt-2">{asset.spec}</p>
                  </div>

                  <a
                    href={asset.href}
                    download
                    onClick={() => handleDownload(asset.id)}
                    className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-[#009DFF]/10 hover:border-[#009DFF]/30 text-white flex items-center justify-center transition-all shrink-0"
                    aria-label={`Download ${asset.title}`}
                  >
                    {downloaded === asset.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4 text-white/70" />}
                  </a>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Premium CTA */}
      <section className="relative w-full px-6 lg:px-16 pb-16">
        <div className="max-w-[1795px] mx-auto">
          <PremiumCTA
            title="Inquire for Press and Interviews"
            description="Our media relations coordinator reviews interview proposals and speaking engagement requests for executive leadership."
            primaryLabel="Submit Press Inquiry"
            secondaryLabel="Contact Us"
            secondaryHref="/company/contact"
          />
        </div>
      </section>
    </InnerPageShell>
  );
}
