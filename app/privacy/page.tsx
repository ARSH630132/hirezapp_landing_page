"use client";

import React, { useState } from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";
import AnimatedBackgroundGrid from "@/components/inner-pages/AnimatedBackgroundGrid";
import { Shield, Lock, Eye } from "lucide-react";

export default function PrivacyPolicyPage() {
  const [active, setActive] = useState<"vpc" | "weights" | "telemetry">("vpc");

  return (
    <InnerPageShell>
      <div className="relative overflow-hidden min-h-screen pb-16">
        <AnimatedBackgroundGrid />

        <InnerPageHero
          category="Legal & Compliance"
          title="Privacy & Data Sovereign Policy"
          highlightedWord="Sovereign"
          description="Learn how GFF AI enforces cryptographic boundaries, strict tenant decoupling, and SOC2-compliant logging to protect enterprise assets."
        />

        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] font-mono tracking-[0.2em] text-[#E4000F] uppercase font-bold">Interactive Sandbox Console</span>
            <h2 className="text-[24px] sm:text-[32px] font-bold text-white tracking-tight leading-tight">Inspect Our Decoupling & Isolation</h2>
            <p className="text-[13.5px] leading-[1.6] text-white/70 font-light">
              Click the selectors below to inspect how we secure and isolate your valuable enterprise data assets.
            </p>

            <div className="space-y-3 pt-4">
              {[
                { id: "vpc", t: "Cryptographic Sandboxing", d: "Enforces VPC isolation with no raw text escape routes." },
                { id: "weights", t: "Model Weight Decoupling", d: "Keeps fine-tuning layers stored in private KMS enclaves." },
                { id: "telemetry", t: "Non-Intrusive Telemetry", d: "Streams only resource metrics (CPU, latency). Zero raw payload logging." }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActive(tab.id as any)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-4 ${
                    active === tab.id ? "border-white/12 bg-white/[0.04]" : "border-white/5 bg-transparent hover:border-white/8"
                  }`}
                >
                  <div className={`p-2 rounded-lg border ${active === tab.id ? "bg-[#009DFF]/10 text-[#009DFF]" : "bg-white/5 text-white/60"}`}>
                    {tab.id === "vpc" ? <Shield className="w-4 h-4" /> : tab.id === "weights" ? <Lock className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="text-[14px] font-semibold text-white">{tab.t}</h4>
                    <p className="text-[12px] text-white/50 mt-1">{tab.d}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="w-full rounded-[24px] border border-white/5 bg-[#050505]/70 backdrop-blur-[12px] p-6 space-y-6 shadow-2xl relative min-h-[300px]">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <span className="text-[9px] font-mono text-[#009DFF] uppercase tracking-widest font-bold">ACTIVE MODULE</span>
                <span className="text-[9px] font-mono text-emerald-400">● SECURE</span>
              </div>

              <div className="flex justify-center py-6 min-h-[140px] border border-white/5 rounded-xl bg-black/40">
                {active === "vpc" ? "VPC ISOLATION ACTIVE" : active === "weights" ? "KMS WEIGHTS ISOLATION ACTIVE" : "eBPF ZERO-PAYLOAD ACTIVE"}
              </div>

              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 text-[12.5px] leading-relaxed font-light text-white/70">
                {active === "vpc" && "Bespoke network topologies ensure all pipeline steps occur strictly inside isolated execution environments with no outbound WAN escape routes."}
                {active === "weights" && "To isolate cognitive intelligence, custom weights are protected with customer-managed keys (CMK) and never backpropagated."}
                {active === "telemetry" && "Continuous uptime tracking streams metadata parameters only. System prompt texts, contexts, and keys are physically excluded."}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pb-16 relative z-10 border-t border-white/5 pt-16">
          <PremiumCTA
            title="Have custom governance requirements?"
            description="Our specialized integration architects regularly configure bespoke isolated model deployments for global finance, logtech, and healthcare institutions."
            primaryLabel="Initiate Security Review"
            primaryHref="/contact?pathway=governance"
            secondaryLabel="Explore Architecture Specs"
            secondaryHref="/resources/architecture-library"
          />
        </div>
      </div>
    </InnerPageShell>
  );
}
