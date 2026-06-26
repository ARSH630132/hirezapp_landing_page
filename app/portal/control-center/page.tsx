"use client";

import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import ControlCenterWorkspace from "@/components/portal/ControlCenterWorkspace";

export default function PortalControlCenterPage() {
  return (
    <InnerPageShell showContact={false}>
      <InnerPageHero
        category="Terminal Enclave"
        title="GFF Client Control Center"
        highlightedWord="Center"
        description="Configure, inspect, and evaluate multi-agent health diagnostic states, Continuous Delivery states, spend parameters, adoption levels, and governance rules in real time."
      />

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-24">
        <ControlCenterWorkspace />
      </div>
    </InnerPageShell>
  );
}