"use client";

import SecureLogin from "@/components/portal/SecureLogin";

export default function AdminPortalPage() {
  return <SecureLogin defaultRole="Administrator" />;
}

