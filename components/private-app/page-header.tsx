"use client";

import React from "react";

export function PrivatePageHeader({ 
  title, 
  desc, 
  badgeLabel = "SOC2 Enclave",
  actions 
}: { 
  title: string; 
  desc: string; 
  badgeLabel?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-5 select-none">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">{title}</h1>
          <span className="inline-flex rounded bg-[#009DFF]/10 border border-[#009DFF]/20 px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase text-[#009DFF]">
            {badgeLabel}
          </span>
        </div>
        <p className="text-[12.5px] text-white/50 font-mono mt-1 leading-relaxed max-w-2xl">{desc}</p>
      </div>

      {actions && (
        <div className="flex flex-wrap gap-2.5 shrink-0 w-full md:w-auto">
          {actions}
        </div>
      )}
    </div>
  );
}
