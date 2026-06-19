"use client";

import { useState } from "react";
import Link from "next/link";
import { navItems } from "@/lib/nav-data";

type HeaderProps = {
  contactHref?: string;
};

export default function Header({ contactHref = "/#contact" }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 w-full h-[84px] bg-black/60 backdrop-blur-[20px] border-b border-white/5 flex items-center justify-between px-6 lg:px-16">
        <Link href="/#home" className="flex items-center gap-2 sm:gap-3 shrink-0">
          <img src="/footer/logo.svg" alt="GFF AI" className="w-[52px] h-[52px] sm:w-[70px] sm:h-[70px] object-contain" />
          <div className="flex flex-col">
            <div className="text-white text-[22px] sm:text-[28px] leading-[24px] sm:leading-[30px] font-semibold tracking-[0.02em]">GFF AI</div>
            <div className="flex items-center gap-[4px] sm:gap-[6px] text-[8px] sm:text-[11px] leading-[12px] sm:leading-[14px] font-bold tracking-[0.08em]">
              <span className="text-[#E4000F]">GARAGE</span>
              <span className="text-white">|</span>
              <span className="text-white">FOUNDRY</span>
              <span className="text-white">|</span>
              <span className="text-[#009DFF]">FACTORY</span>
            </div>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-[55px] text-white absolute left-1/2 -translate-x-1/2">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} className="text-white text-[16px] leading-[24px] font-medium hover:text-red-400 transition-colors whitespace-nowrap">
              {item.label}
            </Link>
          ))}
        </div>

        <a
          href={contactHref}
          className="hidden md:flex w-[207px] h-[48px] items-center justify-center rounded-[98px] text-white text-[16px] leading-[24px] font-semibold hover:opacity-90 transition-all duration-300 shrink-0"
          style={{ background: "linear-gradient(90deg, #E4000F 0%, #009DFF 100%)" }}
        >
          Book a Consultation
        </a>

        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden flex flex-col gap-[6px]">
          <span className="w-[34px] h-[4px] bg-white rounded-full" />
          <span className="w-[34px] h-[4px] bg-white rounded-full" />
          <span className="w-[34px] h-[4px] bg-white rounded-full" />
        </button>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 z-[999] md:hidden bg-black/65" onClick={() => setIsMenuOpen(false)}>
          <div className="absolute left-0 right-0 bottom-0 rounded-t-[28px] bg-[#050505] px-6 pt-6 pb-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-5 border-b border-white/10">
              <div>
                <p className="text-white text-[18px] font-semibold">GFF AI</p>
                <p className="text-white/50 text-[13px]">Navigation Menu</p>
              </div>
              <button onClick={() => setIsMenuOpen(false)} className="text-white text-[34px] leading-none">×</button>
            </div>
            <div className="mt-6 flex flex-col">
              {navItems.map((item) => (
                <a key={item.label} href={item.href} onClick={() => setIsMenuOpen(false)} className="w-full py-4 border-b border-white/10 text-white/80 text-[18px] font-semibold hover:text-white transition-colors">
                  {item.label}
                </a>
              ))}
              <a
                href={contactHref}
                onClick={() => setIsMenuOpen(false)}
                className="mt-6 w-full h-[56px] rounded-[98px] text-white text-[16px] font-semibold flex items-center justify-center"
                style={{ background: "linear-gradient(90deg, #E4000F 0%, #009DFF 100%)" }}
              >
                Book a Consultation
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
