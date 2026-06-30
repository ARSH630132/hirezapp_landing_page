"use client";

import React, { useState } from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";
import AnimatedBackgroundGrid from "@/components/inner-pages/AnimatedBackgroundGrid";
import { Lock, CheckCircle2, Send, ShieldCheck } from "lucide-react";

export default function NdaPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [jurisdiction, setJurisdiction] = useState("Delaware, United States");

  const steps = [
    { num: "01", title: "Initiate Request", desc: "Submit your corporate legal name and preferred jurisdiction." },
    { num: "02", title: "Automated Draft", desc: "Our compliance parser compiles a standardized Mutual NDA." },
    { num: "03", title: "Execute & Lock", desc: "All shared context is digitally sealed in secure enclaves." }
  ];

  const handleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <InnerPageShell>
      <div className="relative overflow-hidden min-h-screen pb-16">
        <AnimatedBackgroundGrid />
        <InnerPageHero
          category="Legal & Compliance"
          title="Mutual NDA Protocol"
          highlightedWord="Protocol"
          visualType="mutualNDA"
          description="Safeguard proprietary codebases, vector weights, model parameters, and corporate credentials under premium security."
        />

        <div className="max-w-[1200px] mx-auto px-6 lg:px-16 pb-24 space-y-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 rounded-[24px] border border-white/5 bg-[#050505]/60 backdrop-blur-[12px]">
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center gap-2 text-[#E4000F] text-[10px] font-mono uppercase font-bold">
                <Lock className="w-3.5 h-3.5" /> Reciprocal Protection
              </div>
              <h2 className="text-[20px] font-semibold text-white tracking-tight">Two-Way Intellectual Property Vault</h2>
              <p className="text-white/70 text-[13px] font-light">
                Before evaluating database schemas or launching sandboxes, we establish bilateral legal protection. Our Mutual NDA is engineered to secure shared corporate IP.
              </p>
            </div>
            
            <div className="lg:col-span-5 p-4 rounded-xl border border-white/5 bg-black/40 flex items-center gap-4">
              <ShieldCheck className="w-8 h-8 text-[#009DFF]" />
              <div>
                <h4 className="text-[13px] font-semibold text-white">Jurisdiction Selected</h4>
                <p className="text-[11.5px] text-[#009DFF] font-mono">{jurisdiction}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="p-6 rounded-[24px] border border-white/5 bg-gradient-to-b from-[#08080a] to-[#010101] relative overflow-hidden">
                <span className="absolute top-4 right-4 text-[38px] font-mono font-bold leading-none text-white/5">{s.num}</span>
                <h4 className="text-[14px] font-semibold text-white tracking-tight mt-2">{s.title}</h4>
                <p className="mt-2 text-[12px] text-white/50 font-light leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="p-6 rounded-[24px] border border-white/5 bg-[#030304]/80 max-w-md mx-auto space-y-4">
            <h3 className="text-[16px] font-semibold text-white text-center">Initiate Mutual NDA Draft</h3>

            {submitted ? (
              <div className="py-6 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto" />
                <p className="text-white/80 text-[12.5px] font-light">Bilateral NDA draft will be dispatched to your email within 4 business hours.</p>
              </div>
            ) : (
              <form onSubmit={handleRequest} className="space-y-3">
                <input required placeholder="Corporate Legal Name" className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-black/60 text-[12.5px] text-white focus:outline-none" />
                <input type="email" required placeholder="Authorized Email Address" className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-black/60 text-[12.5px] text-white focus:outline-none" />
                <select value={jurisdiction} onChange={(e) => setJurisdiction(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-black/60 text-[12.5px] text-white/80 focus:outline-none">
                  <option>Delaware, United States</option>
                  <option>England & Wales</option>
                  <option>Singapore (SGX Compliant)</option>
                </select>
                <button type="submit" className="w-full py-2.5 rounded-xl text-[12px] font-bold text-white bg-gradient-to-r from-[#E4000F] to-[#009DFF] hover:opacity-95 flex items-center justify-center gap-1.5">
                  <Send className="w-3.5 h-3.5" /> Request NDA Review
                </button>
              </form>
            )}
          </div>

          <PremiumCTA
            title="Preparing for an architectural audit session?"
            description="Schedule a technical review session to explore isolated workspace configurations."
            primaryLabel="Contact Legal Desk"
            primaryHref="/contact?pathway=nda"
            secondaryLabel="Review Trust Specs"
            secondaryHref="/privacy"
          />
        </div>
      </div>
    </InnerPageShell>
  );
}
