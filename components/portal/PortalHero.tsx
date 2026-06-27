"use client";

import React from "react";
import Link from "next/link";
import { Fingerprint, ArrowRight, ChevronRight, Lock } from "lucide-react";

interface PortalHeroProps {
  onExploreClick: () => void;
}

export default function PortalHero({ onExploreClick }: PortalHeroProps) {
  return (
    <section className="relative w-full px-6 lg:px-16 pt-12 pb-16 lg:pt-20 lg:pb-28 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1795px] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="max-w-[1795px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
        
        {/* Left Hero Narrative */}
        <div className="lg:col-span-7 flex flex-col">
          <nav className="flex items-center gap-2 mb-6 text-[12px] uppercase tracking-[0.1em] text-white/50">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white/80">Sovereign Gateway</span>
          </nav>

          <div className="mb-4 flex">
            <span className="px-3 py-1 text-[11px] font-bold tracking-[0.12em] text-[#009DFF] border border-[#009DFF]/25 bg-[#009DFF]/5 rounded-full uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#009DFF] animate-pulse" />
              Sovereign Gateway Secure Workspace
            </span>
          </div>

          <h1 className="text-[38px] sm:text-[56px] lg:text-[66px] leading-[1.08] font-bold text-white tracking-tight">
            Govern, Monitor, & Audit Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#E4000F] to-[#009DFF]">Autonomous Workforce</span>
          </h1>

          <p className="mt-6 text-[16px] sm:text-[18px] lg:text-[19px] leading-[1.6] text-white/70 font-light max-w-[720px]">
            GFF AI PTE LTD. provides client boards and executives with absolute transparency. Oversee active multi-agent sandboxes, cryptographic ledger epochs, real-time analytics, and safety compliance from a single, hyper-secure presentation terminal.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link 
              href="/portal/login"
              className="group relative h-12 px-6 rounded-xl bg-white text-black font-bold text-[13px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:bg-white/95 active:scale-[0.98] hover:shadow-[0_0_25px_rgba(255,255,255,0.25)] cursor-pointer"
            >
              <Fingerprint className="w-4 h-4 text-black group-hover:scale-110 transition-transform" />
              Authenticate Gateway
              <ArrowRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-1 transition-transform text-[#009DFF]" />
            </Link>

            <button 
              onClick={onExploreClick}
              className="h-12 px-6 rounded-xl border border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.05] text-white font-medium text-[13px] tracking-wide transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              Explore Workspace Modules
              <ChevronRight className="w-4 h-4 text-white/40" />
            </button>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-6 pt-8 border-t border-white/5 max-w-[600px]">
            <div>
              <span className="block text-[20px] font-bold text-white tracking-tight font-mono">0x7FFA</span>
              <span className="text-[11px] text-white/40 uppercase tracking-wider">Handshake Keys</span>
            </div>
            <div>
              <span className="block text-[20px] font-bold text-[#E4000F] tracking-tight font-mono">eBPF</span>
              <span className="text-[11px] text-white/40 uppercase tracking-wider">Kernel Auditing</span>
            </div>
            <div>
              <span className="block text-[20px] font-bold text-[#009DFF] tracking-tight font-mono">100%</span>
              <span className="text-[11px] text-white/40 uppercase tracking-wider">Sandbox Isolated</span>
            </div>
          </div>
        </div>

        {/* Right Hero Custom Decryption Graphic */}
        <div className="lg:col-span-5 flex justify-center items-center relative">
          <div className="relative w-full aspect-square max-w-[420px] rounded-[24px] border border-white/5 bg-gradient-to-br from-[#0a0a0c] to-[#030304] p-6 shadow-2xl flex flex-col justify-between overflow-hidden group">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] h-[75%] bg-gradient-to-tr from-[#E4000F]/10 to-[#009DFF]/10 rounded-full blur-[50px]" />
            
            <div className="flex items-center justify-between border-b border-white/5 pb-4 relative z-10">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E4000F] animate-pulse" />
                <span className="text-[9px] font-mono tracking-widest text-white/40 uppercase">GATEWAY BOUNDARY</span>
              </div>
              <span className="text-[9px] font-mono text-white/50 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded">STATUS: DECOUPLED</span>
            </div>

            <div className="my-auto py-4 relative z-10 flex items-center justify-center">
              <svg className="w-[180px] h-[180px]" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="100" r="85" stroke="#ffffff" strokeOpacity="0.03" strokeWidth="1" />
                <circle cx="100" cy="100" r="70" stroke="url(#gradientRing)" strokeOpacity="0.15" strokeWidth="1" strokeDasharray="5 10" className="animate-[spin_40s_linear_infinite] origin-center" />
                <circle cx="100" cy="100" r="55" stroke="url(#gradientRing)" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="15 5" className="animate-[spin_20s_linear_infinite_reverse] origin-center" />
                <circle cx="100" cy="100" r="40" stroke="#009DFF" strokeOpacity="0.5" strokeWidth="2" />
                
                <circle cx="100" cy="100" r="16" fill="#050507" stroke="#E4000F" strokeWidth="2" />
                <path d="M96 95 H104 V105 H96 Z M100 91 V95 M100 105 V109" stroke="#E4000F" strokeWidth="2" strokeLinecap="round" />

                <line x1="100" y1="15" x2="100" y2="35" stroke="#E4000F" strokeWidth="1.5" className="opacity-40" />
                <line x1="100" y1="165" x2="100" y2="185" stroke="#009DFF" strokeWidth="1.5" className="opacity-40" />
                <line x1="15" y1="100" x2="35" y2="100" stroke="#009DFF" strokeWidth="1.5" className="opacity-40" />
                <line x1="165" y1="100" x2="185" y2="100" stroke="#E4000F" strokeWidth="1.5" className="opacity-40" />

                <defs>
                  <linearGradient id="gradientRing" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#E4000F" />
                    <stop offset="1" stopColor="#009DFF" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="border-t border-white/5 pt-4 font-mono text-[9px] text-white/40 space-y-1 relative z-10">
              <div className="flex justify-between">
                <span>ENCLAVE HANDSHAKE</span>
                <span className="text-[#009DFF]">STANDBY</span>
              </div>
              <div className="flex justify-between">
                <span>SESSION TOKEN ID</span>
                <span className="text-white">GFF_SESSION_0x99AA...</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
