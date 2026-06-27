"use client";

import { 
  Activity, Users, Cpu, FileText, CreditCard, HelpCircle, 
  BarChart3, ShieldCheck, Settings, Layers, LayoutDashboard,
  Shield, UserCheck, Bot, MessageSquare, History
} from "lucide-react";
import { SidebarLink, UserProfile } from "./types";

export const clientUser: UserProfile = {
  name: "Alexander Mercer",
  email: "a.mercer@apex-sovereign.gff.ai",
  role: "Client",
  clearance: "CLEARANCE LEVEL III (SANDBOX OPERATOR)"
};

export const adminUser: UserProfile = {
  name: "Dr. Sarah Vance",
  email: "s.vance@governance.gff.ai",
  role: "Administrator",
  clearance: "CLEARANCE LEVEL V (SECURE SUPERUSER)"
};

export const clientSidebarLinks: SidebarLink[] = [
  { id: "dashboard", label: "Oversight Core", desc: "Sovereign gateway core", icon: LayoutDashboard },
  { id: "projects", label: "Active Projects", desc: "Sandbox environment layers", icon: Layers },
  { id: "ai-operations", label: "AI Operations", desc: "Multi-agent model health", icon: Bot },
  { id: "documents", label: "Compliance Docs", desc: "Audit logs & signed receipts", icon: FileText },
  { id: "billing", label: "Ledgers & Billing", desc: "Financial ledger & invoices", icon: CreditCard },
  { id: "support", label: "Support Wire", desc: "Active priority secure wires", icon: MessageSquare },
  { id: "analytics", label: "Telemetry Analytics", desc: "Real-time thread spends", icon: BarChart3 },
  { id: "governance", label: "Guardrail Policies", desc: "Continuous policy verification", icon: ShieldCheck },
  { id: "activity", label: "Activity Ledger", desc: "Cryptographic event stream", icon: History },
  { id: "settings", label: "Enclave Settings", desc: "Manage credentials", icon: Settings },
];

export const adminSidebarLinks: SidebarLink[] = [
  { id: "dashboard", label: "Oversight Deck", desc: "Global telemetry overview", icon: Activity },
  { id: "clients", label: "Enterprise Clients", desc: "Manage secure sandboxes", icon: Users },
  { id: "projects", label: "Global Projects", desc: "Active sandbox layers", icon: Layers },
  { id: "users", label: "System Users", desc: "Verify clearance credentials", icon: UserCheck },
  { id: "ai-operations", label: "AI Operations", desc: "Model parameters & loads", icon: Bot },
  { id: "documents", label: "Document Registry", desc: "System-wide file storage", icon: FileText },
  { id: "billing", label: "Financial Ledger", desc: "Settled epoch invoices", icon: CreditCard },
  { id: "support", label: "SLA Support", desc: "Monitor urgent tickets", icon: HelpCircle },
  { id: "analytics", label: "Global Analytics", desc: "Cross-cluster CPU workloads", icon: BarChart3 },
  { id: "governance", label: "Guardrail Control", desc: "Verify ISO-27001 rulesets", icon: ShieldCheck },
  { id: "activity", label: "System Activity", desc: "Cryptographic audit trail", icon: History },
  { id: "settings", label: "Portal Settings", desc: "Oversight credentials", icon: Settings },
];

export const clientLinkToRoute: Record<string, string> = {
  dashboard: "/portal/dashboard",
  projects: "/portal/projects",
  "ai-operations": "/portal/ai-operations",
  documents: "/portal/documents",
  billing: "/portal/billing",
  support: "/portal/support",
  analytics: "/portal/analytics",
  governance: "/portal/governance",
  activity: "/portal/activity",
  settings: "/portal/settings",
};

export const adminLinkToRoute: Record<string, string> = {
  dashboard: "/admin/dashboard",
  clients: "/admin/clients",
  projects: "/admin/projects",
  users: "/admin/users", // we will write matching mapping
  "ai-operations": "/admin/ai-operations",
  documents: "/admin/documents",
  billing: "/admin/billing",
  support: "/admin/support",
  analytics: "/admin/analytics",
  governance: "/admin/governance",
  activity: "/admin/activity",
  settings: "/admin/settings",
};

export const adminLinkToRouteActual: Record<string, string> = {
  dashboard: "/admin/dashboard",
  clients: "/admin/clients",
  projects: "/admin/projects",
  users: "/admin/users",
  "ai-operations": "/admin/ai-operations",
  documents: "/admin/documents",
  billing: "/admin/billing",
  support: "/admin/support",
  analytics: "/admin/analytics",
  governance: "/admin/governance",
  activity: "/admin/activity",
  settings: "/admin/settings",
};
