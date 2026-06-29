"use client";

import React, { useState } from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import CompanyNavigation from "@/components/inner-pages/CompanyNavigation";
import { Lock, CheckCircle, RefreshCw, Send } from "lucide-react";
import { PATHWAYS } from "./pathways";

export default function CompanyContactPage() {
  const [activeId, setActiveId] = useState("talk-sales");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [hash, setHash] = useState("");
  const [form, setForm] = useState({ name: "", email: "", org: "", details: "" });

  const path = PATHWAYS.find(p => p.id === activeId) || PATHWAYS[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setHash("GFF-ENCLAVE-" + Math.random().toString(36).slice(2, 10).toUpperCase());
    setLoading(false);
    setSuccess(true);
  };

  const resetForm = () => {
    setForm({ name: "", email: "", org: "", details: "" });
    setSuccess(false);
  };

  return (
    <InnerPageShell showContact={false}>
      <CompanyNavigation />
      <InnerPageHero
        category="Secure Gateway"
        title="Decoupled Engagement Hub"
        highlightedWord="Hub"
        visualType="contact"
        description="Initiate validation sandbox sessions, structure enterprise pilot programs, or connect with specific functional representatives across GFF AI\s zero-trust gateway."
      />
      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-[12px] font-mono uppercase tracking-widest text-[#009DFF] font-bold">Active Routing Matrix</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 max-h-[550px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
              {PATHWAYS.map(p => {
                const Icon = p.icon;
                const active = p.id === activeId;
                return (
                  <button key={p.id} onClick={() => { setActiveId(p.id); setSuccess(false); }} className="w-full text-left p-3 rounded-[14px] border transition-all relative group cursor-pointer border-white/5 bg-[#020202]/30 hover:border-white/10" style={active ? {backgroundColor: "#000", borderColor: "rgba(255,255,255,0.15)"} : {}}>
                    {active && <div className={"absolute inset-y-0 left-0 w-1 " + (p.color === "red" ? "bg-[#E4000F]" : p.color === "blue" ? "bg-[#009DFF]" : "bg-gradient-to-b from-[#E4000F] to-[#009DFF]")} />}
                    <div className="flex gap-3 items-center">
                      <div className={"p-1.5 rounded-lg border " + (active ? "border-white/10 text-white" : "border-white/5 text-white/40")}><Icon className="w-4 h-4" /></div>
                      <div>
                        <span className={"text-[13px] font-semibold block " + (active ? "text-white" : "text-white/60")}>{p.title}</span>
                        <span className="text-[10px] text-white/30 block">{p.tag}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="lg:col-span-7 pt-8">
            <div className="rounded-[20px] border border-white/5 bg-[#050505]/40 backdrop-blur-[12px] p-6 relative overflow-hidden">
              <h3 className="text-sm font-bold text-white mb-2 font-mono uppercase tracking-widest text-white/90 border-b border-white/5 pb-3 flex items-center gap-2">
                {React.createElement(path.icon, { className: "w-4 h-4" })}
                {path.title} Gateway
              </h3>
              {!success ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input required placeholder="Full Name" name="name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full h-11 rounded-lg border border-white/10 bg-white/[0.01] px-4 text-white text-[13px] outline-none font-mono focus:border-white/25" />
                    <input required type="email" placeholder="Business Email" name="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full h-11 rounded-lg border border-white/10 bg-white/[0.01] px-4 text-white text-[13px] outline-none font-mono focus:border-white/25" />
                  </div>
                  <input required placeholder="Organization" name="org" value={form.org} onChange={e => setForm({...form, org: e.target.value})} className="w-full h-11 rounded-lg border border-white/10 bg-white/[0.01] px-4 text-white text-[13px] outline-none font-mono focus:border-white/25" />
                  <textarea required rows={4} placeholder={"Details on how GFF AI can assist with " + path.title + "..."} name="details" value={form.details} onChange={e => setForm({...form, details: e.target.value})} className="w-full rounded-lg border border-white/10 bg-white/[0.01] p-4 text-white text-[13px] outline-none font-mono focus:border-white/25 resize-none" />
                  <button type="submit" disabled={loading} className="w-full h-11 rounded-lg bg-white text-black font-semibold text-xs tracking-wider uppercase hover:bg-white/90 transition-all cursor-pointer flex items-center justify-center gap-2">
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><span>Transmit Protocol</span><Send className="w-3.5 h-3.5" /></>}
                  </button>
                  {/* <div className="flex gap-2.5 p-3 rounded-lg bg-white/[0.01] border border-white/5">
                    <Lock className="w-4 h-4 text-white/30 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-white/40 leading-relaxed font-mono">SECURE BOUNDARY: This portal is a premium frontend-only simulation. Data is processed locally in memory and never persisted.</p>
                  </div> */}
                </form>
              ) : (
                <div className="py-8 text-center flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-center mb-4"><CheckCircle className="w-6 h-6" /></div>
                  <span className="px-2 py-0.5 text-[8px] font-mono font-bold text-green-400 bg-green-500/5 border border-green-500/20 rounded-full uppercase mb-2">Transmission Signed</span>
                  <h3 className="text-lg font-bold text-white font-mono">Decapsulation Succeeded</h3>
                  <p className="text-xs text-white/60 max-w-[400px] mt-1">Your request was processed inside our simulated secure enclave. No real-world data was transmitted.</p>
                  <div className="mt-4 p-3 rounded-lg bg-white/[0.02] border border-white/5 w-full text-left font-mono text-[10px] space-y-1.5">
                    <div><span className="text-white/30">RECEIPT HASH:</span> <span className="text-white/80">{hash}</span></div>
                    <div><span className="text-white/30">GATEWAY:</span> <span className="text-[#009DFF] uppercase">{path.id}-enclave</span></div>
                    <div><span className="text-white/30">INTEGRITY:</span> <span className="text-white/80">SHA-256 SIGNED</span></div>
                  </div>
                  <button onClick={resetForm} className="mt-5 text-[10px] font-mono tracking-wider uppercase text-white/50 hover:text-white flex items-center gap-1.5 border border-white/10 px-4 py-1.5 rounded-full transition-all cursor-pointer"><RefreshCw className="w-3 h-3" />Reset Gateway</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </InnerPageShell>
  );
}
