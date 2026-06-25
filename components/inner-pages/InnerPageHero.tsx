"use client";

import React from "react";

interface InnerPageHeroProps {
  category?: string;
  title: string;
  highlightedWord?: string;
  highlightColor?: "red" | "blue" | "gradient";
  description: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  centered?: boolean;
}

export default function InnerPageHero({
  category,
  title,
  highlightedWord,
  highlightColor = "gradient",
  description,
  breadcrumbs,
  centered = false,
}: InnerPageHeroProps) {
  const getHighlightClass = () => {
    switch (highlightColor) {
      case "red": return "text-[#E4000F]";
      case "blue": return "text-[#009DFF]";
      default: return "bg-clip-text text-transparent bg-gradient-to-r from-[#E4000F] to-[#009DFF]";
    }
  };

  const formattedTitle = () => {
    if (!highlightedWord || !title.includes(highlightedWord)) return title;
    const parts = title.split(highlightedWord);
    return (
      <>
        {parts[0]}
        <span className={getHighlightClass()}>{highlightedWord}</span>
        {parts[1]}
      </>
    );
  };

  return (
    <section className="relative w-full px-6 lg:px-16 pt-12 pb-16 lg:pt-20 lg:pb-24 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1795px] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="max-w-[1795px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        <div className={`${centered ? "lg:col-span-12 text-center" : "lg:col-span-7"} flex flex-col`}>
          {breadcrumbs && (
            <nav className={`flex items-center gap-2 mb-6 text-[12px] uppercase tracking-[0.1em] text-white/50 ${centered ? "justify-center" : ""}`}>
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <span>/</span>}
                  {crumb.href ? (
                    <a href={crumb.href} className="hover:text-white transition-colors">{crumb.label}</a>
                  ) : (
                    <span className="text-white/80">{crumb.label}</span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          )}

          {category && (
            <div className={`mb-4 flex ${centered ? "justify-center" : ""}`}>
              <span className="px-3 py-1 text-[11px] font-bold tracking-[0.12em] text-[#009DFF] border border-[#009DFF]/25 bg-[#009DFF]/5 rounded-full uppercase">
                {category}
              </span>
            </div>
          )}

          <h1 className="text-[36px] sm:text-[54px] lg:text-[64px] leading-[1.1] font-bold text-white tracking-tight">
            {formattedTitle()}
          </h1>

          <p className={`mt-6 text-[16px] sm:text-[18px] lg:text-[19px] leading-[1.6] text-white/70 font-light max-w-[800px] ${centered ? "mx-auto" : ""}`}>
            {description}
          </p>
        </div>

        {!centered && (
          <div className="lg:col-span-5 flex justify-center items-center relative">
            <div className="relative w-full aspect-square max-w-[360px] rounded-[24px] border border-white/5 bg-gradient-to-br from-[#0c0c0e] to-[#040405] p-6 shadow-2xl flex items-center justify-center overflow-hidden group">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-gradient-to-tr from-[#E4000F]/10 to-[#009DFF]/10 rounded-full blur-[40px]" />
              <svg className="w-full h-full relative z-10" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g className="animate-[spin_40s_linear_infinite] origin-center">
                  <circle cx="200" cy="200" r="140" stroke="url(#ringG)" strokeWidth="1" strokeDasharray="5 15" className="opacity-40" />
                  <circle cx="200" cy="200" r="100" stroke="url(#ringG)" strokeWidth="1" strokeDasharray="20 10" className="opacity-25" />
                  <circle cx="200" cy="200" r="70" stroke="url(#ringG)" strokeWidth="1.5" className="opacity-15" />
                  <path d="M200 40 L200 360 M40 200 L360 200 M87 87 L313 313" stroke="white" strokeWidth="0.5" className="opacity-10" />
                  <circle cx="200" cy="60" r="4" fill="#E4000F" />
                  <circle cx="200" cy="340" r="4" fill="#009DFF" />
                  <circle cx="60" cy="200" r="4" fill="#009DFF" />
                  <circle cx="340" cy="200" r="4" fill="#E4000F" />
                </g>
                <circle cx="200" cy="200" r="36" fill="#050505" stroke="url(#ringG)" strokeWidth="2" />
                <defs>
                  <linearGradient id="ringG" x1="0" y1="0" x2="400" y2="400" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#E4000F" />
                    <stop offset="1" stopColor="#009DFF" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
