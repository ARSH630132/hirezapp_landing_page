"use client";

export type PreviewRole = "client_admin" | "client_member" | "gff_admin";

export interface PreviewSession {
  name: string;
  email: string;
  role: PreviewRole;
  clearance: string;
  isMock: boolean;
  label: string;
}

export const MOCK_PREVIEW_USERS: Record<PreviewRole, PreviewSession> = {
  client_admin: {
    name: "INTERNAL-PREVIEW-CLIENT-ADMIN",
    email: "preview-client-admin@internal.gff.ai",
    role: "client_admin",
    clearance: "CLEARANCE LEVEL III (CLIENT ADMIN)",
    isMock: true,
    label: "PREVIEW ONLY - CLIENT ADMIN",
  },
  client_member: {
    name: "INTERNAL-PREVIEW-CLIENT-MEMBER",
    email: "preview-client-member@internal.gff.ai",
    role: "client_member",
    clearance: "CLEARANCE LEVEL II (CLIENT MEMBER)",
    isMock: true,
    label: "PREVIEW ONLY - CLIENT MEMBER",
  },
  gff_admin: {
    name: "INTERNAL-PREVIEW-GFF-ADMIN",
    email: "preview-gff-admin@internal.gff.ai",
    role: "gff_admin",
    clearance: "CLEARANCE LEVEL V (GFF ADMIN)",
    isMock: true,
    label: "PREVIEW ONLY - GFF ADMIN",
  },
};

const SESSION_KEY = "gff_ai_preview_session_v1";

export function getPreviewSession(): PreviewSession | null {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(SESSION_KEY);
    if (!data) return null;
    return JSON.parse(data) as PreviewSession;
  } catch (e) {
    console.error("Error parsing preview session", e);
    return null;
  }
}

export function setPreviewSession(role: PreviewRole): PreviewSession {
  const session = MOCK_PREVIEW_USERS[role];
  if (typeof window !== "undefined") {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    window.dispatchEvent(new Event("gff_preview_session_changed"));
  }
  return session;
}

export function clearPreviewSession(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem("gff_ai_access_token");
    localStorage.removeItem("gff_api_token");
    window.dispatchEvent(new Event("gff_preview_session_changed"));
  }
}

export function hasRole(session: PreviewSession | null, allowedRoles: PreviewRole[]): boolean {
  if (!session) return false;
  return allowedRoles.includes(session.role);
}

const PORTAL_SECTIONS = [
  "dashboard",
  "projects",
  "ai-operations",
  "documents",
  "billing",
  "support",
  "analytics",
  "governance",
] as const;

const ADMIN_SECTIONS = [
  "dashboard",
  "clients",
  "users",
  "projects",
  "ai-operations",
  "documents",
  "billing",
  "support",
  "analytics",
  "governance",
] as const;

export function canAccessPortalSection(role: PreviewRole, sectionId: string): boolean {
  if (role === "gff_admin") return false;
  return PORTAL_SECTIONS.includes(sectionId as (typeof PORTAL_SECTIONS)[number]);
}

export function canAccessAdminSection(role: PreviewRole, sectionId: string): boolean {
  if (role !== "gff_admin") return false;
  return ADMIN_SECTIONS.includes(sectionId as (typeof ADMIN_SECTIONS)[number]);
}
