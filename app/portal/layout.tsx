"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { PrivateAppShell, BreadcrumbItem } from "@/components/private-app";
import { clientUser, clientSidebarLinks, clientLinkToRoute } from "@/components/private-app/routes-config";

export default function ClientPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

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

  return (
    <PrivateAppShell
      user={clientUser}
      breadcrumbs={breadcrumbs}
      links={clientSidebarLinks}
      activeLink={activeLinkId}
      onLinkChange={handleLinkChange}
      role="Client"
      onRoleChange={handleRoleChange}
    >
      {children}
    </PrivateAppShell>
  );
}
