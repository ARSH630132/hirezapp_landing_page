"use client";

import React, { useState } from "react";
import { HelpCircle } from "lucide-react";

interface InfoTooltipProps {
  content: string;
  className?: string;
  position?: "top" | "bottom" | "left" | "right";
}

export function InfoTooltip({
  content,
  className = "",
  position = "top",
}: InfoTooltipProps) {
  const [visible, setVisible] = useState(false);

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        type="button"
        className="text-white/45 hover:text-[#009DFF] transition-colors focus:outline-none focus:ring-1 focus:ring-[#009DFF]/50 rounded-full p-0.5"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        aria-label="More information"
      >
        <HelpCircle className="w-3.5 h-3.5 cursor-pointer" />
      </button>

      {visible && (
        <div
          className={`absolute z-50 w-64 p-2.5 text-[10.5px] font-medium leading-relaxed text-white/90 bg-[#0d0d0d] border border-white/10 rounded-lg shadow-xl backdrop-blur-md transition-all duration-150 ${positionClasses[position]}`}
          role="tooltip"
        >
          {content}
          <div
            className={`absolute w-1.5 h-1.5 bg-[#0d0d0d] border-b border-r border-white/10 rotate-45 ${
              position === "top"
                ? "top-full left-1/2 -translate-x-1/2 -translate-y-1"
                : position === "bottom"
                ? "bottom-full left-1/2 -translate-x-1/2 translate-y-1 border-t border-l border-b-0 border-r-0"
                : position === "left"
                ? "left-full top-1/2 -translate-y-1/2 -translate-x-1 border-t border-r border-b-0 border-l-0"
                : "right-full top-1/2 -translate-y-1/2 translate-x-1 border-b border-l border-t-0 border-r-0"
            }`}
          />
        </div>
      )}
    </div>
  );
}
