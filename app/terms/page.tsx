"use client";

import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";

export default function TermsOfServicePage() {
  const terms = [
    {
      title: "1. Sandbox & Compute Terms",
      text: "GFF AI grants you access to interactive blueprint generation, ROI calculations, and sandboxed DAG tools. Compute consumption quotas, model tokens, and request rates are governed by active tier allocations configured in your Client Portal."
    },
    {
      title: "2. Acceptable Usage and Model Alignment",
      text: "Clients agree not to exploit multi-agent loops to execute malicious payloads, bypass built-in safety guardrails, or conduct high-frequency penetration testing on live production gateways without written consent."
    },
    {
      title: "3. Service Level and Auto-Healing",
      text: "Factory-stage multi-agent production endpoints are subject to premium 99.99% uptime commitments. All critical dispatch errors trigger self-healing automated container recovery pipelines with real-time logs."
    }
  ];

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Legal & Compliance"
        title="Terms of Service"
        highlightedWord="Terms"
        description="Review the rules, API rate quotas, and dynamic compute terms governing GFF AI interactive platforms."
      />

      <div className="max-w-[1200px] mx-auto px-6 lg:px-16 pb-24 text-white/80 font-light text-[15px] leading-[1.75] space-y-10">
        <p>
          Effective Date: June 26, 2026. These Terms of Service dictate administrative and developer interaction boundaries on all GFF AI platforms.
        </p>

        {terms.map((term) => (
          <div key={term.title} className="p-8 rounded-[24px] border border-white/5 bg-[#050505]/60 backdrop-blur-[12px] space-y-4">
            <h2 className="text-[18px] font-semibold text-white tracking-tight">{term.title}</h2>
            <p className="text-white/70 leading-[1.7]">{term.text}</p>
          </div>
        ))}
      </div>
    </InnerPageShell>
  );
}