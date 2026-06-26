"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Profile", href: "/company" },
  { label: "Mission", href: "/company/mission" },
  { label: "Leadership", href: "/company/leadership" },
  { label: "Locations", href: "/company/locations" },
  { label: "Partners", href: "/company/partners" },
  { label: "Advisors", href: "/company/advisors" },
  { label: "Careers", href: "/company/careers" },
  { label: "Investors", href: "/company/investors" },
  { label: "Media", href: "/company/media" },
  { label: "Contact", href: "/company/contact" },
];

export default function CompanyNavigation() {
  const pathname = usePathname();
  const activeRef = useRef<HTMLAnchorElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeRef.current && containerRef.current) {
      const activeElement = activeRef.current;
      const container = containerRef.current;
      const activeRect = activeElement.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      if (
        activeRect.left < containerRect.left ||
        activeRect.right > containerRect.right
      ) {
        container.scrollTo({
          left:
            activeElement.offsetLeft -
            container.clientWidth / 2 +
            activeElement.clientWidth / 2,
          behavior: "smooth",
        });
      }
    }
  }, [pathname]);

  return (
    <div className="relative w-full border-b border-white/5 bg-black/40 backdrop-blur-[12px] z-20">
      <div className="max-w-[1795px] mx-auto px-6 lg:px-16">
        <div
          ref={containerRef}
          className="flex items-center gap-6 md:gap-8 overflow-x-auto no-scrollbar py-4"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                ref={isActive ? activeRef : null}
                className={cn(
                  "relative text-[12.5px] uppercase font-mono tracking-widest py-1 whitespace-nowrap transition-colors cursor-pointer shrink-0 select-none",
                  isActive
                    ? "text-[#009DFF] font-semibold"
                    : "text-white/40 hover:text-white/80"
                )}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-[-17px] left-0 right-0 h-[2px] bg-gradient-to-r from-[#E4000F] to-[#009DFF]" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
