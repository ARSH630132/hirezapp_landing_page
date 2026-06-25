"use client";

import React, { useRef, useEffect, useState } from "react";

interface CarouselProps {
  items: Array<{
    title: string;
    tag?: string;
    desc: string;
    metric?: string;
  }>;
}

export default function Carousel({ items }: CarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    checkScroll();
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [items]);

  const scrollBy = (offset: number) => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <div className="w-full relative flex flex-col gap-4">
      {/* Navigation Buttons Row */}
      <div className="flex justify-end gap-2.5 px-1 relative z-10">
        <button
          onClick={() => scrollBy(-320)}
          disabled={!canScrollLeft}
          className={`w-10 h-10 rounded-full border border-white/10 bg-black/40 flex items-center justify-center text-white transition-all ${
            canScrollLeft ? "hover:bg-white/10 active:scale-95" : "opacity-35 cursor-not-allowed"
          }`}
          aria-label="Scroll left"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={() => scrollBy(320)}
          disabled={!canScrollRight}
          className={`w-10 h-10 rounded-full border border-white/10 bg-black/40 flex items-center justify-center text-white transition-all ${
            canScrollRight ? "hover:bg-white/10 active:scale-95" : "opacity-35 cursor-not-allowed"
          }`}
          aria-label="Scroll right"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Snap Container */}
      <div
        ref={containerRef}
        className="w-full overflow-x-auto flex gap-6 pb-4 scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, idx) => (
          <div
            key={idx}
            className="w-[85vw] sm:w-[350px] shrink-0 snap-start rounded-[24px] border border-white/5 bg-[#050505]/60 backdrop-blur-[12px] p-6 flex flex-col justify-between hover:border-white/12 transition-all duration-300 group"
          >
            <div>
              {item.tag && (
                <span className="text-[9px] font-mono tracking-widest text-[#009DFF] uppercase font-bold">
                  {item.tag}
                </span>
              )}
              <h4 className="text-[17px] font-semibold text-white tracking-tight mt-2 group-hover:text-[#009DFF] transition-colors">
                {item.title}
              </h4>
              <p className="mt-2.5 text-[13px] leading-[1.5] text-white/60 font-light">
                {item.desc}
              </p>
            </div>

            {item.metric && (
              <div className="mt-6 pt-4 border-t border-white/5 text-[20px] font-bold text-white tracking-tight">
                {item.metric}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
