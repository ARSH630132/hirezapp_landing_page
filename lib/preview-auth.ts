"use client";

export type PreviewRole =
  | "client_admin"
  | "client_member"
  | "gff_admin"
  | "gff_operator"
  | "finance_admin"
  | "support_agent"
  | "viewer";

export interface PreviewSession {
  name: string;
  email: string;
  role: PreviewRole;
  clearance: string;
  isMock: true;
  label: string;
}

export const MOCK_PREVIEW_USERS: Record<PreviewRole, PreviewSession> = {
  client_admin: {
    name: "INTERNAL-PREVIEW-CLIENT-ADMIN",
    email: "preview-client-admin@internal.gff.ai",
    role: "client_admin",
    clearance: "CLEARANCE LEVEL III (SANDBOX ADMIN)",
    isMock: true,
    label: "PREVIEW ONLY - MOCK CLIENT ADMIN",
  },
  client_member: {
    name: "INTERNAL-PREVIEW-CLIENT-MEMBER",
    email: "preview-client-member@internal.gff.ai",
    role: "client_member",
    clearance: "CLEARANCE LEVEL II (SANDBOX WORKER)",
    isMock: true,
    label: "PREVIEW ONLY - MOCK CLIENT MEMBER",
  },
  gff_admin: {
    name: "INTERNAL-PREVIEW-GFF-ADMIN",
    email: "preview-gff-admin@internal.gff.ai",
    role: "gff_admin",
    clearance: "CLEARANCE LEVEL V (SECURE SUPERUSER)",
    isMock: true,
    label: "PREVIEW ONLY - GFF SUPER-ADMIN",
  },
  gff_operator: {
    name: "INTERNAL-PREVIEW-GFF-OPERATOR",
    email: "preview-gff-operator@internal.gff.ai",
    role: "gff_operator",
    clearance: "CLEARANCE LEVEL IV (GFF TECHNICAL OPERATOR)",
    isMock: true,
    label: "PREVIEW ONLY - GFF TECHNICAL OPERATOR",
  },
  finance_admin: {
    name: "INTERNAL-PREVIEW-FINANCE-ADMIN",
    email: "preview-finance-admin@internal.gff.ai",
    role: "finance_admin",
    clearance: "CLEARANCE LEVEL III (GFF FINANCIAL CONTROLLER)",
    isMock: true,
    label: "PREVIEW ONLY - GFF FINANCIAL CONTROLLER",
  },
  support_agent: {
    name: "INTERNAL-PREVIEW-SUPPORT-AGENT",
    email: "preview-support-agent@internal.gff.ai",
    role: "support_agent",
    clearance: "CLEARANCE LEVEL III (GFF SUPPORT WIRE)",
    isMock: true,
    label: "PREVIEW ONLY - GFF SUPPORT REPRESENTATIVE",
  },
  viewer: {
    name: "INTERNAL-PREVIEW-VIEWER-AUDITOR",
    email: "preview-viewer@internal.gff.ai",
    role: "viewer",
    clearance: "CLEARANCE LEVEL I (READ-ONLY AUDITOR)",
    isMock: true,
    label: "PREVIEW ONLY - READ-ONLY AUDITOR",
  },
};

const SESSION_KEY = "gff_ai_preview_session_v1";

export function getPreviewSession(): PreviewSession | null {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(SESSION_KEY);
    if (!data) return null;
    const parsed = JSON.parse(data);
    if (parsed && parsed.isMock) {
      return parsed as PreviewSession;
    }
  } catch (e) {
    console.error("Error parsing preview session", e);
  }
  return null;
}

export function setPreviewSession(role: PreviewRole): PreviewSession {
  const session = MOCK_PREVIEW_USERS[role];
  if (typeof window !== "undefined") {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    // Dispatch custom event to let other components know the session updated
    window.dispatchEvent(new Event("gff_preview_session_changed"));
  }
  return session;
}

export function clearPreviewSession(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_KEY);
    window.dispatchEvent(new Event("gff_preview_session_changed"));
  }
}

export function hasRole(session: PreviewSession | null, allowedRoles: PreviewRole[]): boolean {
  if (!session) return false;
  return allowedRoles.includes(session.role);
}

// Check access rules for Client Portal sections (/portal/[sectionId])
export function canAccessPortalSection(role: PreviewRole, sectionId: string): boolean {
  // GFF admin can access everything
  if (role === "gff_admin") return true;
  
  if (role === "viewer") {
    // Read-only auditor can view general stats but not settings/billing or write tools
    return ["dashboard", "analytics", "governance", "activity"].includes(sectionId);
  }
  
  if (role === "client_member") {
    // Client members can access everything except billing and settings
    return !["billing", "settings"].includes(sectionId);
  }
  
  if (role === "client_admin") {
    // Client Admin can access all client portal sections
    return true;
  }

  // GFF internal roles inside client portal layout:
  if (role === "finance_admin") {
    return ["dashboard", "billing", "analytics", "activity"].includes(sectionId);
  }
  if (role === "support_agent") {
    return ["dashboard", "support", "activity"].includes(sectionId);
  }
  if (role === "gff_operator") {
    return ["dashboard", "projects", "ai-operations", "governance", "activity"].includes(sectionId);
  }
  
  return false;
}

// Check access rules for Admin Oversight Console (/admin/[sectionId])
export function canAccessAdminSection(role: PreviewRole, sectionId: string): boolean {
  // Only GFF internal roles and auditor can access admin panel
  if (role === "gff_admin") return true;
  
  if (role === "gff_operator") {
    // Operator cannot access billing, settings, or users management
    return !["billing", "settings", "users"].includes(sectionId);
  }
  
  if (role === "finance_admin") {
    // Finance can access dashboard, clients, billing, analytics, activity, settings
    return ["dashboard", "clients", "billing", "analytics", "activity", "settings"].includes(sectionId);
  }
  
  if (role === "support_agent") {
    // Support agent can access dashboard, clients, support, activity, users
    return ["dashboard", "clients", "support", "activity", "users"].includes(sectionId);
  }
  
  if (role === "viewer") {
    // Auditor can view dashboards, activity, governance read-only
    return ["dashboard", "clients", "projects", "analytics", "governance", "activity"].includes(sectionId);
  }
  
  // Clients (client_admin, client_member) cannot access admin section AT ALL
  return false;
}
