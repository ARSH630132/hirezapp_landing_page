"use client";

import React, { useState, useRef, MouseEvent } from "react";

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
}

export function BentoGrid({ children, className = "" }: BentoGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full ${className}`}>
      {children}
    </div>
  );
}

interface BentoCardProps {
  title: string;
  description: string;
  badge?: string;
  metric?: { value: string; label: string };
  icon?: React.ReactNode;
  className?: string;
  glowColor?: "red" | "blue" | "purple";
}

export function BentoCard({
  title,
  description,
  badge,
  metric,
  icon,
  className = "",
  glowColor = "blue",
}: BentoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const getGlowStyle = () => {
    const colorMap = {
      red: "rgba(228, 0, 15, 0.12)",
      blue: "rgba(0, 157, 255, 0.12)",
      purple: "rgba(147, 51, 234, 0.12)",
    };
    return {
      background: isHovered
        ? `radial-gradient(circle 200px at ${coords.x}px ${coords.y}px, ${colorMap[glowColor]}, transparent 80%)`
        : "transparent",
    };
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden rounded-[24px] border border-white/5 bg-[#050505]/80 backdrop-blur-[12px] p-6 lg:p-8 flex flex-col justify-between group transition-all duration-300 hover:border-white/12 hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] ${className}`}
    >
      {/* Dynamic Cursor Spotlight Overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={getGlowStyle()}
      />

      {/* Grid cross lines for design depth */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/5 rounded-tl-[24px]" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/5 rounded-br-[24px]" />

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          {/* Badge & Icon Row */}
          <div className="flex items-center justify-between gap-4 mb-6">
            {badge && (
              <span className="px-2.5 py-0.5 text-[10px] font-bold tracking-[0.1em] text-white/60 bg-white/5 border border-white/10 rounded-full uppercase">
                {badge}
              </span>
            )}
            {icon && (
              <div className="text-white/60 group-hover:text-white transition-colors duration-300">
                {icon}
              </div>
            )}
          </div>

          {/* Heading */}
          <h3 className="text-[20px] lg:text-[22px] font-semibold text-white tracking-tight leading-[1.3]">
            {title}
          </h3>

          {/* Description */}
          <p className="mt-3 text-[14px] leading-[1.6] text-white/60 font-light group-hover:text-white/70 transition-colors duration-300">
            {description}
          </p>
        </div>

        {/* Optional Metric Block */}
        {metric && (
          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col">
            <span className="text-[32px] font-bold text-white tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              {metric.value}
            </span>
            <span className="mt-1 text-[11px] uppercase tracking-[0.08em] text-white/40">
              {metric.label}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
