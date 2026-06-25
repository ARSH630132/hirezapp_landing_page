"use client";

import React, { useState, useRef, MouseEvent } from "react";

interface PremiumCTAProps {
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export default function PremiumCTA({
  title = "Ready to Blueprint Your Agent Infrastructure?",
  description = "Schedule a technical consultation with our systems architects to design an isolated, high-throughput sandbox suited for your regulatory framework.",
  primaryLabel = "Schedule Deep-Dive",
  primaryHref = "/#contact",
  secondaryLabel = "Explore Platform Spec",
  secondaryHref = "/platforms",
}: PremiumCTAProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const getGlowStyle = () => {
    return {
      background: isHovered
        ? `radial-gradient(circle 350px at ${coords.x}px ${coords.y}px, rgba(0, 157, 255, 0.1), rgba(228, 0, 15, 0.04), transparent 80%)`
        : "radial-gradient(circle 350px at 50% 50%, rgba(0, 157, 255, 0.05), transparent 80%)",
    };
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full overflow-hidden rounded-[32px] border border-white/5 bg-[#030304]/80 backdrop-blur-[16px] px-8 py-12 md:py-16 text-center shadow-2xl group transition-all duration-300 hover:border-white/10"
    >
      {/* Background spotlights */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-300"
        style={getGlowStyle()}
      />

      {/* Decorative mechanical corner accents */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-white/10 rounded-tl-[32px]" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/10 rounded-tr-[32px]" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-white/10 rounded-bl-[32px]" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-white/10 rounded-br-[32px]" />

      <div className="relative z-10 max-w-[800px] mx-auto flex flex-col items-center">
        <span className="px-3 py-1 text-[11px] font-bold tracking-[0.15em] text-[#009DFF] border border-[#009DFF]/20 bg-[#009DFF]/5 rounded-full uppercase mb-6">
          Architectural Session
        </span>

        <h3 className="text-[28px] sm:text-[38px] lg:text-[44px] leading-[1.15] font-bold text-white tracking-tight">
          {title}
        </h3>

        <p className="mt-4 text-[14px] sm:text-[16px] leading-[1.6] text-white/60 font-light max-w-[620px]">
          {description}
        </p>

        {/* Dual Actions Button row */}
        <div className="mt-8 flex flex-wrap gap-4 items-center justify-center">
          <a
            href={primaryHref}
            className="px-8 py-3.5 rounded-full text-[14px] font-semibold text-white transition-all shadow-lg shadow-black/20 hover:opacity-95"
            style={{ background: "linear-gradient(90deg, #E4000F 0%, #009DFF 100%)" }}
          >
            {primaryLabel}
          </a>

          <a
            href={secondaryHref}
            className="px-8 py-3.5 rounded-full text-[14px] font-semibold text-white transition-all bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/15"
          >
            {secondaryLabel}
          </a>
        </div>

        {/* Trust Badges Specification list */}
        <div className="mt-12 pt-8 border-t border-white/5 w-full max-w-[620px] flex flex-wrap justify-center items-center gap-6 md:gap-10 text-[10px] font-mono text-white/40 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4" />
            </svg>
            <span>SOC2 Type II Sandbox</span>
          </div>

          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4" />
            </svg>
            <span>100% GDPR Guardrails</span>
          </div>

          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4" />
            </svg>
            <span>AES-256 Memory Lock</span>
          </div>
        </div>
      </div>
    </div>
  );
}
