"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { PrivateAppShell, BreadcrumbItem } from "@/components/private-app";
import { adminUser, adminSidebarLinks, adminLinkToRouteActual } from "@/components/private-app/routes-config";
import { PreviewRouteGuard } from "@/components/private-app/PreviewRouteGuard";
import { getPreviewSession, PreviewSession } from "@/lib/preview-auth";

export default function AdminPortalLayout({
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
  const isAuthPage = pathname === "/admin" || pathname === "/admin/login";

  if (isAuthPage) {
    return <>{children}</>;
  }

  // Parse active tab from pathname
  const segments = pathname.split("/");
  let activeTab = "dashboard";
  if (segments.length >= 3) {
    activeTab = segments[2];
  }

  const activeLinkId = activeTab;

  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Oversight Console", href: "/admin/dashboard" },
    { label: activeTab.replace("-", " ").toUpperCase() }
  ];

  const handleLinkChange = (id: string) => {
    const route = adminLinkToRouteActual[id] || `/admin/${id}`;
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
  } : adminUser;

  return (
    <PreviewRouteGuard type="admin">
      <PrivateAppShell
        user={activeUser}
        breadcrumbs={breadcrumbs}
        links={adminSidebarLinks}
        activeLink={activeLinkId}
        onLinkChange={handleLinkChange}
        role="Administrator"
        onRoleChange={handleRoleChange}
      >
        {children}
      </PrivateAppShell>
    </PreviewRouteGuard>
  );
}

