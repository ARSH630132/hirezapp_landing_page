"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { PrivateAppShell, BreadcrumbItem } from "@/components/private-app";
import { adminSidebarLinks, adminLinkToRouteActual } from "@/components/private-app/routes-config";

type SessionUser = {
  name: string;
  email: string;
  role: string;
  clearance?: string;
};

export default function AdminPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const isAuthPage = pathname === "/admin" || pathname === "/admin/login";

  useEffect(() => {
    if (isAuthPage) {
      setLoading(false);
      return;
    }

    let ignore = false;

    const loadSession = async () => {
      setLoading(true);

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("gff_ai_access_token") || localStorage.getItem("gff_api_token")
          : null;

      if (!token) {
        if (!ignore) {
          setLoading(false);
          router.replace("/admin/login");
        }
        return;
      }

      try {
        const response = await fetch("/api/v1/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const payload = await response.json().catch(() => null);

        if (!response.ok || !payload?.success || !payload?.user) {
          localStorage.removeItem("gff_ai_access_token");
          localStorage.removeItem("gff_api_token");
          if (!ignore) {
            setLoading(false);
            router.replace("/admin/login");
          }
          return;
        }

        if (payload.user.role !== "gff_admin") {
          if (!ignore) {
            setLoading(false);
            router.replace("/portal/dashboard");
          }
          return;
        }

        if (!ignore) {
          setSession(payload.user);
          setLoading(false);
        }
      } catch {
        if (!ignore) {
          setLoading(false);
          router.replace("/admin/login");
        }
      }
    };

    loadSession();
    return () => {
      ignore = true;
    };
  }, [isAuthPage, pathname, router]);

  // If it's an auth page, we render it directly without the app shell
  if (isAuthPage) {
    return <>{children}</>;
  }

  if (loading || !session) {
    return <div className="min-h-screen bg-[#030303]" />;
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
  const activeUser = {
    name: session.name,
    email: session.email,
    role: "Administrator" as const,
    clearance: session.clearance || "Admin access"
  };

  return (
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
  );
}
