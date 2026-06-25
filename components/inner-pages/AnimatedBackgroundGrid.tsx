"use client";

import React, { useEffect, useState } from "react";

export default function AnimatedBackgroundGrid() {
  const [shouldAnimate, setShouldAnimate] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setShouldAnimate(!mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setShouldAnimate(!e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <div className="absolute inset-0 -z-50 w-full h-full bg-[#010101] overflow-hidden pointer-events-none">
      {/* Premium Ambient Glow Pools (Brand Colors: Red and Blue) */}
      <div 
        className={`absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#E4000F]/8 blur-[140px] md:blur-[220px] mix-blend-screen ${
          shouldAnimate ? "animate-[pulse_10s_infinite_alternate]" : ""
        }`} 
      />
      <div 
        className={`absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#009DFF]/8 blur-[140px] md:blur-[220px] mix-blend-screen ${
          shouldAnimate ? "animate-[pulse_12s_infinite_alternate_reverse]" : ""
        }`} 
      />
      <div 
        className="absolute top-[40%] left-[30%] w-[40%] h-[40%] rounded-full bg-[#E4000F]/3 blur-[120px] md:blur-[180px] mix-blend-screen" 
      />

      {/* SVG Fine Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* Subtly Glowing Grid Crosses */}
      <div className="absolute inset-0 opacity-[0.12] bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* Futuristic Laser Scanner Lines */}
      {shouldAnimate && (
        <div className="absolute inset-0 w-full h-full opacity-[0.02]">
          <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E4000F] to-transparent animate-[scan_8s_linear_infinite]" />
          <div className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#009DFF] to-transparent animate-[scanVertical_12s_linear_infinite]" />
        </div>
      )}

      {/* Noise/Grain Overlay for High-End Premium Texture */}
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Style definitions for custom animations */}
      <style jsx global>{`
        @keyframes scan {
          0% { top: -10%; }
          100% { top: 110%; }
        }
        @keyframes scanVertical {
          0% { left: -10%; }
          100% { left: 110%; }
        }
      `}</style>
    </div>
  );
}
