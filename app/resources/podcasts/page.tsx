"use client";

import React, { useState } from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";

const PODCASTS = [
  { id: "p1", title: "Ep 12: Structuring Sovereign Agent Boundaries in EU Contexts", host: "Dr. Ashish Chandra & Lady Sarah Sterling", duration: "32 mins" },
  { id: "p2", title: "Ep 11: Decoupling Computational State from Public Cloud Infrastructure", host: "GFF Engineering Lead", duration: "41 mins" }
];

export default function PodcastsPage() {
  const [playing, setPlaying] = useState<string | null>(null);

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Audio Room"
        title="GFF Boardroom Podcast Series"
        highlightedWord="Boardroom Podcast"
        description="Listen to executive board discussions on compliance, model alignment, and sovereign multi-agent deployment strategies."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Resources", href: "/resources" }, { label: "Podcasts" }]}
      />

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-24 grid grid-cols-1 md:grid-cols-2 gap-8">
        {PODCASTS.map((p) => (
          <div key={p.id} className="rounded-[24px] border border-white/5 bg-[#050505]/40 p-6 flex flex-col justify-between hover:border-white/10 transition-all group">
            <div>
              <div className="flex justify-between items-center text-[10px] font-mono text-white/40 mb-4">
                <span>SERIES: EXECUTIVE DIALOGUE</span>
                <span>{p.duration}</span>
              </div>
              <h3 className="text-[17px] sm:text-[18px] font-bold text-white tracking-tight leading-snug">{p.title}</h3>
              <p className="mt-2 text-[12px] font-mono text-white/50">Featuring: {p.host}</p>

              {/* Simulated audio waveform */}
              <div className="h-6 flex items-center gap-1 mt-6">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((bar) => (
                  <div
                    key={bar}
                    className={`w-1 rounded-full bg-[#009DFF] transition-all duration-300 ${
                      playing === p.id ? "animate-pulse" : "opacity-40"
                    }`}
                    style={{
                      height: playing === p.id ? `${Math.random() * 100}%` : "30%",
                      minHeight: "4px"
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-[11px]">
              <span className="text-white/30 font-mono">FORMAT: HIGH-FIDELITY FLAC</span>
              <button
                onClick={() => setPlaying(playing === p.id ? null : p.id)}
                className="text-[#009DFF] hover:text-white font-bold uppercase tracking-wider text-[10px] flex items-center gap-2"
              >
                {playing === p.id ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <span>PAUSE CONVERSATION</span>
                  </>
                ) : (
                  <span>LISTEN NOW →</span>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-16">
        <PremiumCTA title="Request Customized Audio Briefings" description="Request a confidential, audio briefings digest synthesized by our lead research analysts for executive boards." />
      </div>
    </InnerPageShell>
  );
}