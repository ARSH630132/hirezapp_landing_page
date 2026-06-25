"use client";

import React, { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import AnimatedBackgroundGrid from "./AnimatedBackgroundGrid";

interface InnerPageShellProps {
  children: React.ReactNode;
  showContact?: boolean;
  contactHref?: string;
  className?: string;
}

export default function InnerPageShell({
  children,
  showContact = true,
  contactHref = "/#contact",
  className = "",
}: InnerPageShellProps) {
  // Reset scroll to top on mount for inner pages
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  return (
    <main className="min-h-screen bg-[#010101] text-white overflow-x-hidden relative flex flex-col font-sans">
      {/* Background Layer */}
      <AnimatedBackgroundGrid />

      {/* Main Container */}
      <div className="w-full max-w-[1920px] mx-auto flex flex-col min-h-screen relative overflow-x-hidden">
        {/* Shared Premium Header */}
        <Header contactHref={contactHref} />

        {/* Padding-top to avoid fixed Header overlap (Header is h-[84px]) */}
        <div className={`flex-grow pt-[84px] ${className}`}>
          {children}
        </div>

        {/* Optional contact section for enterprise consultation */}
        {showContact && (
          <div className="relative border-t border-white/5 bg-[#010101]/40 backdrop-blur-[4px]">
            <ContactSection />
          </div>
        )}

        {/* Shared Premium Footer */}
        <Footer />
      </div>
    </main>
  );
}
