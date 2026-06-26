"use client";

import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";

export default function NdaPage() {
  const clauses = [
    {
      title: "1. Definition of Confidential Information",
      text: "Confidential Information encompasses all technical DAG blueprints, vector reasoning data, custom cognitive core architectures, token benchmarks, and business parameters shared during our Garage or Foundry consultation phases."
    },
    {
      title: "2. Absolute Non-Disclosure Commitment",
      text: "Both parties agree to hold all Confidential Information in the strictest confidence. GFF AI enforces zero-trust sandbox boundaries to prevent unauthorized logical leakage across multi-tenant clusters."
    },
    {
      title: "3. Cryptographic and Memory Isolation",
      text: "All shared code repositories, cognitive rules, and semantic context vectors will be immediately deleted or returned upon request, leaving zero residual cache weights on GFF AI local systems."
    }
  ];

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Legal & Compliance"
        title="NDA Mutual Agreement"
        highlightedWord="Agreement"
        description="Review our standard bilateral Mutual Non-Disclosure Agreement safeguarding proprietary models, APIs, and business data."
      />

      <div className="max-w-[1200px] mx-auto px-6 lg:px-16 pb-24 text-white/80 font-light text-[15px] leading-[1.75] space-y-10">
        <p>
          Last updated: June 26, 2026. This Agreement establishes the protective rules and mutual sandboxing commitments governing GFF AI exploratory pilot workshops.
        </p>

        {clauses.map((clause) => (
          <div key={clause.title} className="p-8 rounded-[24px] border border-white/5 bg-[#050505]/60 backdrop-blur-[12px] space-y-4">
            <h2 className="text-[18px] font-semibold text-white tracking-tight">{clause.title}</h2>
            <p className="text-white/70 leading-[1.7]">{clause.text}</p>
          </div>
        ))}
      </div>
    </InnerPageShell>
  );
}