"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { PrivateAppShell, BreadcrumbItem } from "@/components/private-app";
import { adminUser, adminSidebarLinks, adminLinkToRouteActual } from "@/components/private-app/routes-config";

export default function AdminPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

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

  return (
    <PrivateAppShell
      user={adminUser}
      breadcrumbs={breadcrumbs}
      links={adminSidebarLinks}
      activeLink={activeLinkId}
      onLinkChange={handleLinkChange}
      role="Administrator"
      onRoleChange={handleRoleChange}
    >
      {children}
    </PrivateAppShell>
  );
}
