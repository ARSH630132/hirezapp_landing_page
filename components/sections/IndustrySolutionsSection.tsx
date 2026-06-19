"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import SectionHeading from "@/components/SectionHeading";
import { pageFadeVariants } from "@/lib/animations";
import { industryCards } from "@/lib/landing-data";

export default function IndustrySolutionsSection() {
  const industryCarouselRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = industryCarouselRef.current;
    if (!container) return;

    let raf = 0;
    let last = performance.now();
    let paused = false;
    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const tick = (now: number) => {
      if (desktopQuery.matches && !paused && !prefersReducedMotion) {
        const delta = now - last;
        container.scrollLeft += delta * 0.03;
        const halfWidth = container.scrollWidth / 2;
        if (container.scrollLeft >= halfWidth) container.scrollLeft -= halfWidth;
      }
      last = now;
      raf = window.requestAnimationFrame(tick);
    };

    const onEnter = () => { paused = true; };
    const onLeave = () => { paused = false; };

    container.addEventListener("mouseenter", onEnter);
    container.addEventListener("mouseleave", onLeave);
    container.addEventListener("touchstart", onEnter, { passive: true });
    container.addEventListener("touchend", onLeave, { passive: true });
    raf = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(raf);
      container.removeEventListener("mouseenter", onEnter);
      container.removeEventListener("mouseleave", onLeave);
      container.removeEventListener("touchstart", onEnter);
      container.removeEventListener("touchend", onLeave);
    };
  }, []);

  return (
    <motion.section
      id="industries"
      className="w-full px-6 lg:px-16 py-12 lg:py-20"
      variants={pageFadeVariants}
    >
      <div className="max-w-[1795px] mx-auto">
        <SectionHeading
          title={<p className="text-[#408CFF] text-[24px] sm:text-[30px] leading-none font-medium uppercase">INDUSTRY SOLUTIONS</p>}
          titleClassName="text-center"
          dividerWidthClassName="w-[120px]"
        />

        <p className="mt-5 mx-auto max-w-[880px] text-center text-white/68 text-[15px] sm:text-[17px] leading-[28px]">
          Industry-ready AI patterns for regulated, operational, and customer-facing teams. Each card points to a practical starting point for automation, copilot experiences, and decision support.
        </p>

        <div
          ref={industryCarouselRef}
          className="mt-8 overflow-x-auto pb-2 -mx-1 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory lg:snap-none"
        >
          <div className="flex w-max gap-4 pr-4">
            {industryCards.map((item, index) => (
              <div
                key={`${item.title}-${index}`}
                className="group relative w-[86vw] max-w-[330px] sm:w-[320px] lg:w-[330px] shrink-0 overflow-hidden rounded-[24px] border border-[#10162B] bg-[linear-gradient(180deg,rgba(4,7,18,0.96)_0%,rgba(2,4,10,0.98)_100%)] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/15 hover:shadow-[0_0_22px_rgba(64,140,255,0.12)] snap-start"
              >
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background: `radial-gradient(circle at 20% 18%, ${item.glow}20 0%, transparent 34%), radial-gradient(circle at 88% 10%, ${item.glow}16 0%, transparent 24%), radial-gradient(circle at 86% 82%, ${item.glow}12 0%, transparent 28%)`,
                  }}
                />

                <div className="relative z-10 flex h-full flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className="inline-flex h-[52px] w-[52px] items-center justify-center rounded-[16px]"
                    >
                      <item.icon
                        className="h-[60px] w-[60px]"
                        strokeWidth={1.75}
                        fill="none"
                        style={{ color: item.glow, stroke: item.glow }}
                      />
                    </div>
                  </div>

                  <h3 className="mt-6 text-[19px] leading-[25px] font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-[14px] leading-[23px] text-white/70">{item.summary}</p>

                  <div className="mt-5 grid grid-cols-1 gap-2">
                    {item.items.map((listItem) => (
                      <div key={listItem} className="flex items-center gap-3 rounded-[12px] bg-white/[0.05] px-3 py-2 text-[13px] leading-[18px] text-white/86">
                        <span className="h-[6px] w-[6px] rounded-full shrink-0 shadow-[0_0_10px_rgba(141,198,255,0.75)]" style={{ backgroundColor: item.glow }} />
                        <span>{listItem}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto pt-5">
                    <div className="flex items-center justify-between gap-3 rounded-[14px] bg-white/[0.04] px-4 py-3">
                      <span className="text-center text-[13px] leading-[18px] font-medium text-white/82">{item.outcome}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
