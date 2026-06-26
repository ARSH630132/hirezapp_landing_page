"use client";

import InnerPageShell from "@/components/inner-pages/InnerPageShell";
import InnerPageHero from "@/components/inner-pages/InnerPageHero";
import SecurePortalPreview from "@/components/inner-pages/SecurePortalPreview";

export default function ClientPortalPage() {
  return (
    <InnerPageShell>
      <InnerPageHero
        category="Secure Boundary"
        title="GFF Client Portal"
        highlightedWord="Portal"
        description="Access your active multi-agent sandbox boundaries, verify compliance metrics, and download audit logs in a zero-trust enclave."
      />

      <div className="max-w-[1795px] mx-auto px-6 lg:px-16 pb-24">
        <h2 className="text-[26px] sm:text-[34px] font-bold text-white tracking-tight mb-8">
          Administrative Enclave Boundary
        </h2>
        <SecurePortalPreview />
      </div>
    </InnerPageShell>
  );
}