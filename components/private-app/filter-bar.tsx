"use client";

import React from "react";
import { Search, ChevronDown } from "lucide-react";

export function FilterBar({ 
  searchPlaceholder = "Filter records...",
  onSearchChange,
  categories = [],
  onCategoryChange,
  selectedCategory = ""
}: { 
  searchPlaceholder?: string;
  onSearchChange: (val: string) => void;
  categories?: string[];
  onCategoryChange?: (val: string) => void;
  selectedCategory?: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-white/30" />
        <input 
          type="text"
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full h-9 rounded-lg border border-white/5 bg-white/[0.02] pl-9 pr-4 text-[12px] font-mono text-white placeholder-white/30 outline-none focus:border-white/15 focus:bg-white/[0.04] transition-all"
        />
      </div>

      {categories.length > 0 && onCategoryChange && (
        <div className="relative shrink-0">
          <select 
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="h-9 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] px-3 pr-8 text-[12px] font-mono text-white/70 focus:text-white outline-none transition-all cursor-pointer appearance-none"
          >
            <option value="" className="bg-[#0c0c0c] text-white">ALL CATEGORIES</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat} className="bg-[#0c0c0c] text-white">{cat.toUpperCase()}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-white/40 pointer-events-none" />
        </div>
      )}
    </div>
  );
}
