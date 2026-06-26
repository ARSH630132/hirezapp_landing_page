"use client";

import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import ClientWorkspace from "@/components/portal/ClientWorkspace";

export default function ClientWorkspacePage() {
  return (
    <InnerPageShell showContact={false}>
      <InnerPageHero
        category="Sovereign Client Core"
        title="GFF Client Workspace Enclave"
        highlightedWord="Workspace"
        description="Verify active agent runs, configure runtime telemetry overlays, audit regulatory policy compliance, and download cryptographically signed invoices."
      />

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-24">
        <ClientWorkspace />
      </div>
    </InnerPageShell>
  );
}