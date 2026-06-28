"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { PrivateAppShell, BreadcrumbItem } from "@/components/private-app";
import { clientSidebarLinks, clientLinkToRoute } from "@/components/private-app/routes-config";

type SessionUser = {
  name: string;
  email: string;
  role: string;
  clearance?: string;
};

export default function ClientPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const loadSession = async () => {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("gff_ai_access_token") || localStorage.getItem("gff_api_token")
          : null;

      if (!token) {
        if (!ignore) {
          setLoading(false);
          router.replace("/portal/login");
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
            router.replace("/portal/login");
          }
          return;
        }

        if (!["client_admin", "client_member"].includes(payload.user.role)) {
          if (!ignore) {
            setLoading(false);
            router.replace("/admin/dashboard");
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
          router.replace("/portal/login");
        }
      }
    };

    loadSession();
    return () => {
      ignore = true;
    };
  }, [router]);

  // If it's an auth page, we render it directly without the app shell
  const isAuthPage = pathname === "/portal" || pathname === "/portal/login" || pathname === "/login";

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
  const activeUser = {
    name: session.name,
    email: session.email,
    role: "Client" as const,
    clearance: session.clearance || "Client access"
  };

  return (
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
  );
}
