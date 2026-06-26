"use client";

import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import ContactSection from "@/components/ContactSection";

export default function ContactPage() {
  return (
    <InnerPageShell showContact={false}>
      <InnerPageHero
        category="Consultation Gateway"
        title="Connect with GFF AI"
        highlightedWord="Connect"
        description="Initiate an evaluation session with our enterprise architects. Map out your security, integration, and scaling parameters."
      />
      <div className="relative border-t border-white/5 bg-[#010101]/40 backdrop-blur-[4px] pb-16">
        <ContactSection />
      </div>
    </InnerPageShell>
  );
}