"use client";

import React from "react";
import { useRouter } from "next/navigation";
import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import { ArrowRight, LayoutDashboard, ShieldCheck } from "lucide-react";

export default function ClientDashboardLegacyPage() {
  const router = useRouter();

  return (
    <InnerPageShell showContact={false}>
      <InnerPageHero
        category="Compatibility Sandbox"
        title="GFF Client legacy Core"
        highlightedWord="Dashboard"
        description="Verify legacy multi-agent sessions, monitor latency over eBPF overlays, and audit compliance indices."
      />

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-24 text-white">
        <div className="max-w-[560px] mx-auto p-6 rounded-xl border border-white/5 bg-[#050505]/40 backdrop-blur-sm space-y-4 text-center">
          <div className="h-10 w-10 bg-[#009DFF]/10 text-[#009DFF] border border-[#009DFF]/20 rounded-full flex items-center justify-center mx-auto">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <h3 className="text-md font-bold font-mono uppercase tracking-wider">Redirecting to Premium Portal Core</h3>
          <p className="text-xs text-white/50 leading-relaxed">
            Legacy Client routes have been migrated to the secure GFF AI Enclave Portal. Access real-time multi-agent sandboxes under ISO-27001 zero-trust bounds.
          </p>
          <div className="pt-2">
            <button
              onClick={() => router.push("/portal/dashboard")}
              className="inline-flex h-10 px-5 rounded bg-white hover:bg-white/90 text-black font-semibold text-[11px] uppercase tracking-wider items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Launch Sovereign Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </InnerPageShell>
  );
}
