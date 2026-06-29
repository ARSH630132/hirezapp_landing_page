"use client";

import React, { useState } from "react";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import PremiumCTA from "@/components/inner-pages/PremiumCTA";

const VIDEOS = [
  { id: "v1", title: "Sovereign Multi-Agent Systems: Launch Keynote Singapore", duration: "18:42", desc: "A full stream of Dr. Ashish Chandra detailing GFF's core sovereign multi-agent architecture in Singapore." },
  { id: "v2", title: "Security Walkthrough: Memory Sandboxes & mTLS Boundaries", duration: "12:15", desc: "A technical screen-capture guide illustrating real-time containment loops under active malware simulation." }
];

export default function VideosPage() {
  const [playing, setPlaying] = useState<string | null>(null);

  return (
    <InnerPageShell>
      <InnerPageHero
        category="Media Room"
        title="Keynotes & Video Demonstrations"
        highlightedWord="Keynotes & Video"
        visualType="multimediaKeynotes"
        description="Stream GFF technical presentations, keynotes, and live system demonstrations of sovereign agent environments."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Resources", href: "/resources" }, { label: "Videos" }]}
      />

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-24 grid grid-cols-1 md:grid-cols-2 gap-8">
        {VIDEOS.map((vid) => (
          <div key={vid.id} className="rounded-[24px] border border-white/5 bg-[#050505]/40 overflow-hidden flex flex-col justify-between hover:border-white/10 transition-all group">
            <div className="aspect-video bg-black relative flex items-center justify-center border-b border-white/5">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
              {playing === vid.id ? (
                <div className="relative z-20 text-center px-4">
                  <span className="w-3 h-3 rounded-full bg-red-500 animate-ping inline-block mr-2" />
                  <span className="text-[11px] font-mono text-white/80">STREAMING HIGH-DEFINITION SECURE FEED</span>
                  <button onClick={() => setPlaying(null)} className="block mt-4 mx-auto px-4 py-1.5 rounded-full text-[10px] font-mono bg-white text-black font-bold uppercase tracking-wider">Pause Stream</button>
                </div>
              ) : (
                <button onClick={() => setPlaying(vid.id)} className="relative z-20 w-16 h-16 rounded-full bg-white/10 hover:bg-[#009DFF] border border-white/20 hover:border-transparent flex items-center justify-center text-white transition-all group-hover:scale-105">
                  <svg className="w-6 h-6 fill-current ml-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                </button>
              )}
            </div>
            <div className="p-6">
              <div className="flex justify-between text-[10px] font-mono text-white/40 mb-2">
                <span>FORMAT: ULTRA-HD STREAM</span>
                <span>{vid.duration}</span>
              </div>
              <h3 className="text-[17px] font-bold text-white tracking-tight leading-snug">{vid.title}</h3>
              <p className="mt-2 text-[13px] text-white/50 leading-relaxed font-light">{vid.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-16">
        <PremiumCTA title="Request Customized Live Demo Session" description="Schedule an isolated video demonstration with GFF core architects tailored to your firm's specific workflows." />
      </div>
    </InnerPageShell>
  );
}