"use client";

import React from "react";

interface BulletItem {
  text: string;
  boldText?: string;
}

interface NarrativeSectionProps {
  tag?: string;
  title: string;
  subtitle?: string;
  paragraphs: string[];
  bullets?: BulletItem[];
  reversed?: boolean;
  visualPanel?: React.ReactNode;
}

export default function NarrativeSection({
  tag,
  title,
  subtitle,
  paragraphs,
  bullets,
  reversed = false,
  visualPanel,
}: NarrativeSectionProps) {
  return (
    <section className="relative w-full px-6 lg:px-16 py-12 lg:py-20 overflow-hidden">
      <div className="max-w-[1795px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        
        <div className={`lg:col-span-6 flex flex-col ${reversed ? "lg:order-2" : ""}`}>
          {tag && <span className="text-[11px] font-bold tracking-[0.15em] text-[#E4000F] uppercase mb-3">{tag}</span>}
          <h2 className="text-[26px] sm:text-[36px] lg:text-[40px] leading-[1.2] font-semibold text-white tracking-tight">{title}</h2>
          {subtitle && <p className="mt-2 text-[15px] sm:text-[17px] text-[#009DFF] font-medium">{subtitle}</p>}

          <div className="mt-5 flex flex-col gap-4">
            {paragraphs.map((p, idx) => (
              <p key={idx} className="text-[14px] sm:text-[15px] leading-[1.65] text-white/70 font-light">{p}</p>
            ))}
          </div>

          {bullets && bullets.length > 0 && (
            <ul className="mt-6 flex flex-col gap-3">
              {bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="mt-1 shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-[#009DFF]/10 border border-[#009DFF]/30">
                    <svg className="w-2.5 h-2.5 text-[#009DFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-[14px] text-white/80 font-light">
                    {bullet.boldText && <strong className="font-semibold text-white mr-1.5">{bullet.boldText}</strong>}
                    {bullet.text}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={`lg:col-span-6 flex justify-center items-center ${reversed ? "lg:order-1" : ""}`}>
          {visualPanel ? (
            <div className="w-full">{visualPanel}</div>
          ) : (
            <div className="relative w-full aspect-[4/3] max-w-[500px] rounded-[24px] border border-white/5 bg-gradient-to-b from-[#060608] to-[#020203] p-5 overflow-hidden flex flex-col justify-between group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(228,0,15,0.03),transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(0,157,255,0.03),transparent_50%)]" />

              <div className="w-full h-full rounded-[16px] border border-white/5 bg-black/60 backdrop-blur-[4px] p-4 flex flex-col justify-between relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500/80" />
                    <span className="w-2 h-2 rounded-full bg-yellow-500/80" />
                    <span className="w-2 h-2 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-[9px] tracking-[0.1em] text-white/30 uppercase font-mono">telemetry.log</span>
                </div>

                <div className="flex-grow font-mono text-[11px] leading-[1.6] text-white/50 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[#009DFF]">[SYS]</span>
                    <span className="text-white/80">Initializing Sandbox Gateways...</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">[OK]</span>
                    <span className="text-white/60">Zero-Trust security active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#E4000F]">[WARN]</span>
                    <span className="text-white/60">Anomaly scan initiated...</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">[LIVE]</span>
                    <span className="text-[#009DFF] animate-pulse">Syncing telemetry logs...</span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-white/30">
                  <span>LATENCY: 12ms</span>
                  <span>CPU: 14%</span>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
