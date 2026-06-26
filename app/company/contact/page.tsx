"use client";

import React from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import CompanyNavigation from "@/components/inner-pages/CompanyNavigation";
import ContactSection from "@/components/ContactSection";

export default function CompanyContactPage() {
  return (
    <InnerPageShell showContact={false}>
      <CompanyNavigation />
      <InnerPageHero
        category="Consultation Gateway"
        title="Connect with GFF AI"
        highlightedWord="Connect"
        description="Initiate an evaluation session with our enterprise architects. Map out your security, integration, and scaling parameters across our Singapore, London, and India cores."
      />
      <div className="relative border-t border-white/5 bg-[#010101]/40 backdrop-blur-[4px] pb-16">
        <ContactSection />
      </div>
    </InnerPageShell>
  );
}
