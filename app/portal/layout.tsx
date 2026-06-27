"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { PrivateAppShell, BreadcrumbItem } from "@/components/private-app";
import { clientUser, clientSidebarLinks, clientLinkToRoute } from "@/components/private-app/routes-config";
import { PreviewRouteGuard } from "@/components/private-app/PreviewRouteGuard";
import { getPreviewSession, PreviewSession } from "@/lib/preview-auth";

export default function ClientPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<PreviewSession | null>(null);

  useEffect(() => {
    setSession(getPreviewSession());
    const handleSessionChanged = () => {
      setSession(getPreviewSession());
    };
    window.addEventListener("gff_preview_session_changed", handleSessionChanged);
    return () => {
      window.removeEventListener("gff_preview_session_changed", handleSessionChanged);
    };
  }, []);

  // If it's an auth page, we render it directly without the app shell
  const isAuthPage = pathname === "/portal" || pathname === "/portal/login" || pathname === "/login";

  if (isAuthPage) {
    return <>{children}</>;
  }

  // Parse active tab from pathname
  const segments = pathname.split("/");
  let activeTab = "dashboard";
  if (segments.length >= 3) {
    activeTab = segments[2];
  }

  // Map "ai-operations" pathname segment back to "ai-operations" link id
  const activeLinkId = activeTab;

  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Sovereign Gateway", href: "/portal/dashboard" },
    { label: activeTab.replace("-", " ").toUpperCase() }
  ];

  const handleLinkChange = (id: string) => {
    const route = clientLinkToRoute[id] || `/portal/${id}`;
    router.push(route);
  };

  const handleRoleChange = (role: "Client" | "Administrator") => {
    if (role === "Administrator") {
      router.push("/admin/dashboard");
    } else {
      router.push("/portal/dashboard");
    }
  };

  // Build current user representation
  const activeUser = session ? {
    name: session.name,
    email: session.email,
    role: (session.role === "client_admin" || session.role === "client_member") ? ("Client" as const) : ("Administrator" as const),
    clearance: session.clearance
  } : clientUser;

  return (
    <PreviewRouteGuard type="portal">
      <PrivateAppShell
        user={activeUser}
        breadcrumbs={breadcrumbs}
        links={clientSidebarLinks}
        activeLink={activeLinkId}
        onLinkChange={handleLinkChange}
        role="Client"
        onRoleChange={handleRoleChange}
      >
        {children}
      </PrivateAppShell>
    </PreviewRouteGuard>
  );
}

