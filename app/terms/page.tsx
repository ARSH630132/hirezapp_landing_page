"use client";

import React, { useState } from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";
import AnimatedBackgroundGrid from "@/components/inner-pages/AnimatedBackgroundGrid";
import { Cpu, ShieldAlert, Activity } from "lucide-react";

export default function TermsOfServicePage() {
  const [tier, setTier] = useState<"sandbox" | "foundry" | "factory">("sandbox");

  const specs: Record<string, { t: string; c: string; r: string; s: string; d: string }> = {
    sandbox: { t: "Garage Sandbox", c: "5 Workflows", r: "1.5K tokens/m", s: "Best-effort", d: "Discovery & prototyping sandbox environments." },
    foundry: { t: "Foundry Hardened", c: "50 Workflows", r: "25K tokens/m", s: "99.9% SLA", d: "Production APIs & live database integrations." },
    factory: { t: "Factory Autonomous", c: "Unlimited scaling", r: "Custom speed", s: "99.99% SLA", d: "Dedicated industrial enclaves with kernel-level recovery." }
  };

  return (
    <InnerPageShell>
      <div className="relative overflow-hidden min-h-screen pb-16">
        <AnimatedBackgroundGrid />
        <InnerPageHero
          category="Legal & Compliance"
          title="Terms of Service & SLA Guide"
          highlightedWord="Terms"
          description="Review compute parameter quotas, tenant rate-limits, and sovereign SLA guarantees governing the GFF AI runtime stages."
        />

        <div className="max-w-[1200px] mx-auto px-6 lg:px-16 pb-16 relative z-10 space-y-8">
          <div className="p-6 rounded-[24px] border border-white/5 bg-[#050505]/60 backdrop-blur-[12px] space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
              <div>
                <span className="text-[10px] font-mono tracking-[0.2em] text-[#009DFF] uppercase font-bold">RESOURCE ALLOCATOR</span>
                <h2 className="text-[18px] font-semibold text-white mt-1">Compute Parameter Boundaries</h2>
              </div>
              <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
                {(["sandbox", "foundry", "factory"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTier(t)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-mono uppercase tracking-wider transition-all ${
                      tier === t ? "bg-white text-black font-bold" : "text-white/60 hover:text-white"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
              <div className="space-y-4">
                <span className="inline-flex px-2.5 py-0.5 text-[9px] font-mono tracking-widest text-[#E4000F] border border-[#E4000F]/25 bg-[#E4000F]/5 rounded-full uppercase">Active Stage</span>
                <h3 className="text-[20px] font-semibold text-white tracking-tight">{specs[tier].t}</h3>
                <p className="text-[13.5px] leading-relaxed text-white/70 font-light">{specs[tier].d}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { l: "CONCURRENCY", v: specs[tier].c },
                  { l: "THROUGHPUT", v: specs[tier].r },
                  { l: "AVAILABILITY SLA", v: specs[tier].s }
                ].map((s, i) => (
                  <div key={i} className="p-4 rounded-xl border border-white/5 bg-black/40">
                    <span className="text-[9px] font-mono text-white/40 uppercase block">{s.l}</span>
                    <span className="text-[12.5px] text-white font-medium mt-1 block">{s.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            {[
              { icon: <Cpu className="w-5 h-5 text-[#E4000F]" />, title: "1. Sandbox & Compute Quotas", desc: "Access parameters and sandbox tools are governed strictly by active tier structures in the Client Portal." },
              { icon: <ShieldAlert className="w-5 h-5 text-[#009DFF]" />, title: "2. Usage & Model Alignment", desc: "Enterprise networks agree not to manipulate cognitive loops to execute adversarial prompts or bypass safety boundaries." },
              { icon: <Activity className="w-5 h-5 text-white" />, title: "3. SLA & Self-Healing", desc: "Production endpoints hosted in Factory carry a 99.99% SLA, backed by automatic kernel self-healing recovery loops." }
            ].map((t, i) => (
              <div key={i} className="p-6 rounded-[24px] border border-white/5 bg-[#050505]/40 backdrop-blur-[12px] space-y-4">
                <div className="p-2.5 w-fit rounded-xl bg-white/5 border border-white/10">{t.icon}</div>
                <h4 className="text-[15px] font-semibold text-white tracking-tight">{t.title}</h4>
                <p className="text-[13px] leading-relaxed text-white/60 font-light">{t.desc}</p>
              </div>
            ))}
          </div>

          <PremiumCTA
            title="Require customized API terms or higher throughput?"
            description="Our customer solutions team is available to negotiate tailored SLAs, isolated regional models, and specialized token pools."
            primaryLabel="Review Developer Quotas"
            primaryHref="/contact?pathway=developer"
            secondaryLabel="Explore Specs"
            secondaryHref="/resources/developer-docs"
          />
        </div>
      </div>
    </InnerPageShell>
  );
}
