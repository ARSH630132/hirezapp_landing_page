"use client";

import React, { useState } from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";

const TABS = {
  cli: {
    label: "GFF CLI Installation",
    code: `# Install secure GFF sovereign agentic workspace toolkit
curl -sS https://get.gff.ai/install.sh | sh

# Authenticate local hardware sandbox
gff auth login --local-sandbox-only

# Verify container runtime integrity
gff verify --integrity`
  },
  sdk: {
    label: "TypeScript SDK Setup",
    code: `import { GffAgentOrchestrator } from "@gff-ai/sdk";

// Initialize isolation loop with local security sandbox
const cluster = await GffAgentOrchestrator.initialize({
  sandboxId: "sg-garage-0x8f",
  memoryIsolation: "aes-256-gcm",
  safetyFallback: "human-in-the-loop"
});

console.log("Integrity: verified ✅");`
  }
};

type TabKey = keyof typeof TABS;

export default function DeveloperDocsPage() {
  const [active, setActive] = useState<TabKey>("cli");

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Developer Hub"
        title="Developer Documentation & API Spec"
        highlightedWord="Developer Documentation"
        description="Comprehensive reference APIs, cryptographic state specs, and quickstart guidelines for sovereign orchestration."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Resources", href: "/resources" }, { label: "Developer Docs" }]}
      />

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          <div className="flex gap-2 border-b border-white/5 pb-4 mb-6">
            {(Object.keys(TABS) as TabKey[]).map((k) => (
              <button
                key={k} onClick={() => setActive(k)}
                className={`px-4 py-2 rounded-lg text-[11px] font-mono transition-all uppercase tracking-wider ${
                  active === k ? "bg-white text-black font-bold" : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                {TABS[k].label}
              </button>
            ))}
          </div>

          <div className="rounded-[20px] border border-white/5 bg-[#030304] p-6 font-mono text-[12px] text-white/80 leading-relaxed overflow-x-auto">
            <div className="flex items-center gap-1.5 mb-4 text-white/30 border-b border-white/5 pb-3 text-[10px]">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              <span className="ml-2 font-mono uppercase tracking-widest text-[9px]">SECURE SANDBOX COGNITIVE TERMINAL v1.4</span>
            </div>
            <pre className="whitespace-pre-wrap">{TABS[active].code}</pre>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="rounded-[24px] border border-white/5 bg-[#050505]/40 p-6">
            <h4 className="text-[12px] font-mono text-[#009DFF] font-bold uppercase tracking-widest mb-3">API Guidelines</h4>
            <p className="text-[13px] text-white/60 font-light leading-relaxed">
              Every API dispatch from the GFF environment undergoes dynamic verification through safety fallback gates, guaranteeing that code injections are sandboxed at the hypervisor level.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-16">
        <PremiumCTA title="Need SDK Enterprise Integration?" description="Schedule a workshop with our core developer-platform engineers." />
      </div>
    </InnerPageShell>
  );
}