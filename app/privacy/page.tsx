"use client";

import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: "1. Data Isolation & Decoupling",
      text: "At GFF AI, client data ingestion is cryptographically sandboxed. We do not store, process, or transmit raw training data outside of your designated container boundary. Models operating in the Foundry or Factory stage are completely isolated and decouple live transactions from global training weight pipelines."
    },
    {
      title: "2. Telemetry and Audit Logging",
      text: "We collect basic, structural operational metrics (CPU loads, agent node latencies, and token spend tallies) to power your real-time dashboard telemetry. No personal, sensitive, or payload-level data is collected, logged, or scanned during this process, in absolute alignment with SOC2 compliance criteria."
    },
    {
      title: "3. Cryptographic Boundary Standards",
      text: "All administrative client tokens, dashboard login credentials, and sandbox keys are encrypted using AES-256-GCM at rest and TLS 1.3 in transit. Dynamic multi-agent routing runs inside dedicated virtual networking blocks to ensure zero-leak security."
    }
  ];

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Legal & Compliance"
        title="Privacy Policy"
        highlightedWord="Privacy"
        description="Learn how GFF AI enforces cryptographic boundaries, data sandboxing, and SOC2-compliant logging to protect enterprise assets."
      />

      <div className="max-w-[1200px] mx-auto px-6 lg:px-16 pb-24 text-white/80 font-light text-[15px] leading-[1.75] space-y-10">
        <p>
          Effective Date: June 26, 2026. This policy outlines GFF AI&apos;s rigorous, zero-trust framework regarding enterprise client data ingestion, telemetry monitoring, and sandbox security parameters.
        </p>

        {sections.map((sect) => (
          <div key={sect.title} className="p-8 rounded-[24px] border border-white/5 bg-[#050505]/60 backdrop-blur-[12px] space-y-4">
            <h2 className="text-[18px] font-semibold text-white tracking-tight">{sect.title}</h2>
            <p className="text-white/70 leading-[1.7]">{sect.text}</p>
          </div>
        ))}
      </div>
    </InnerPageShell>
  );
}