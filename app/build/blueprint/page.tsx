"use client";

import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import BlueprintGenerator from "@/components/sections/BlueprintGenerator";

export default function BlueprintGeneratorPage() {
  return (
    <InnerPageShell showContact={true}>
      <div className="max-w-[1795px] mx-auto px-4 lg:px-8 pb-24 pt-8">
        <BlueprintGenerator />
      </div>
    </InnerPageShell>
  );
}
