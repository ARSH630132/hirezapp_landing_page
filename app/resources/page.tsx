"use client";

import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import ResearchLibraryGrid from "@/components/inner-pages/ResearchLibraryGrid";

export default function ResourcesPage() {
  return (
    <InnerPageShell>
      <InnerPageHero
        category="Knowledge Center"
        title="Resources and Research"
        highlightedWord="Resources"
        description="Explore our library of academic whitepapers, framework documentations, memory architectures, and latency benchmarks."
      />

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-24">
        <h2 className="text-[26px] sm:text-[34px] font-bold text-white tracking-tight mb-8">
          Enterprise Technical Library
        </h2>
        <ResearchLibraryGrid />
      </div>
    </InnerPageShell>
  );
}