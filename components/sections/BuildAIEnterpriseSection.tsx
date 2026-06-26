"use client";

import BlueprintGenerator from "./BlueprintGenerator";

export default function BuildAIEnterpriseSection() {
  return (
    <section id="blueprint" className="w-[calc(100%-24px)] lg:w-[calc(100%-128px)] max-w-[1792px] mx-auto rounded-[20px] border border-[#151926] bg-[#000613] px-4 sm:px-6 py-16 overflow-hidden">
      <BlueprintGenerator />
    </section>
  );
}
