"use client";

import React from "react";

interface RelatedPage {
  title: string;
  tag: string;
  desc: string;
  href: string;
}

interface RelatedPagesGridProps {
  links: RelatedPage[];
}

export default function RelatedPagesGrid({ links }: RelatedPagesGridProps) {
  return (
    <div className="w-full">
      <p className="text-[11px] font-bold tracking-[0.15em] text-white/40 uppercase mb-6">
        NEXT STEPS & ARCHITECTURAL DIRECTORIES
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {links.map((link) => (
          <a
            key={link.title}
            href={link.href}
            className="group rounded-[20px] border border-white/5 bg-[#050505]/50 backdrop-blur-[8px] p-6 flex flex-col justify-between hover:border-white/12 transition-all duration-300"
          >
            <div>
              <span className="text-[9px] font-mono tracking-widest text-[#E4000F] uppercase font-bold">
                {link.tag}
              </span>
              <h4 className="text-[16px] font-semibold text-white tracking-tight mt-2 flex items-center justify-between gap-2">
                <span>{link.title}</span>
                {/* Translate chevron on hover */}
                <svg
                  className="w-4 h-4 text-white/50 group-hover:text-white group-hover:translate-x-1.5 transition-transform duration-300 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </h4>
              <p className="mt-2 text-[12.5px] leading-[1.5] text-white/55 font-light">
                {link.desc}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
