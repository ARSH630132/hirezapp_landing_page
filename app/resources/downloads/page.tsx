"use client";

import React, { useState } from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";

const UTILITIES = [
  { id: "ut-comp", t: "GFF GDPR & SOC2 Regulatory Checklist", size: "1.2 MB", hash: "SHA-256: 0x9fba...1a" },
  { id: "ut-calc", t: "Offline C-Suite Agentic ROI Calculator", size: "4.8 MB", hash: "SHA-256: 0x81ee...2c" },
  { id: "ut-cli", t: "Sovereign Sandbox Docker Core Image", size: "142 MB", hash: "SHA-256: 0x05ac...9f" }
];

export default function DownloadsPage() {
  const [downloading, setDownloading] = useState<Record<string, boolean>>({});

  const handleDownload = (id: string) => {
    setDownloading(p => ({ ...p, [id]: true }));
    setTimeout(() => {
      setDownloading(p => ({ ...p, [id]: false }));
      alert(`Utility package "${id}" secured and packaged in browser sandbox.`);
    }, 1200);
  };

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Asset Utilities"
        title="Verified Toolkit & Asset Downloads"
        highlightedWord="Toolkit & Asset"
        description="Access compliance spreadsheets, offline sandbox calculators, and Docker utility containers signed by our security group."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Resources", href: "/resources" }, { label: "Downloads" }]}
      />

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {UTILITIES.map((ut) => (
          <div key={ut.id} className="rounded-[24px] border border-white/5 bg-[#050505]/40 p-6 flex flex-col justify-between hover:border-white/10 transition-all group">
            <div>
              <span className="text-[9px] font-mono text-[#009DFF] font-bold tracking-widest uppercase">CRYPTOGRAPHIC ASSET</span>
              <h3 className="text-[17px] sm:text-[18px] font-bold text-white tracking-tight mt-2 leading-snug">{ut.t}</h3>
              <p className="mt-4 text-[11px] font-mono text-white/40">{ut.hash}</p>
            </div>
            <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-[11px]">
              <span className="text-white/30 font-mono">{ut.size}</span>
              <button onClick={() => handleDownload(ut.id)} className="text-white hover:text-[#009DFF] font-bold uppercase tracking-wider text-[10px]">
                {downloading[ut.id] ? "PACKING..." : "SECURE UTILITY ↓"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-16">
        <PremiumCTA title="Request On-Premise Core Packages" description="Connect with GFF Enterprise Deployment team to request cryptographically signed offline RPM or Debian packages." />
      </div>
    </InnerPageShell>
  );
}