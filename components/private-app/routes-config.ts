"use client";

import {
  Activity,
  Users,
  FileText,
  CreditCard,
  HelpCircle,
  BarChart3,
  ShieldCheck,
  Layers,
  LayoutDashboard,
  UserCheck,
  Bot,
  MessageSquare,
} from "lucide-react";
import { SidebarLink, UserProfile } from "./types";

export const clientUser: UserProfile = {
  name: "Apex Admin Lead",
  email: "client_admin@apex.com",
  role: "Client",
  clearance: "Client admin access",
};

export const adminUser: UserProfile = {
  name: "GFF Admin Lead",
  email: "gff_admin@gff.ai",
  role: "Administrator",
  clearance: "Admin access",
};

export const clientSidebarLinks: SidebarLink[] = [
  { id: "dashboard", label: "Dashboard", desc: "Client overview", icon: LayoutDashboard },
  { id: "projects", label: "Projects", desc: "Active client projects", icon: Layers },
  { id: "ai-operations", label: "AI Operations", desc: "Client AI operations", icon: Bot },
  { id: "documents", label: "Documents", desc: "Assigned documents", icon: FileText },
  { id: "billing", label: "Billing", desc: "Invoice metadata", icon: CreditCard },
  { id: "support", label: "Support", desc: "Support tickets", icon: MessageSquare },
  { id: "analytics", label: "Analytics", desc: "Client analytics", icon: BarChart3 },
  { id: "governance", label: "Governance", desc: "Governance items", icon: ShieldCheck },
];

export const adminSidebarLinks: SidebarLink[] = [
  { id: "dashboard", label: "Dashboard", desc: "Platform overview", icon: Activity },
  { id: "clients", label: "Clients", desc: "Manage clients", icon: Users },
  { id: "users", label: "Users", desc: "Manage users", icon: UserCheck },
  { id: "projects", label: "Projects", desc: "Manage projects", icon: Layers },
  { id: "ai-operations", label: "AI Operations", desc: "Manage AI operations", icon: Bot },
  { id: "documents", label: "Documents", desc: "Manage documents", icon: FileText },
  { id: "billing", label: "Billing", desc: "Manage invoices", icon: CreditCard },
  { id: "support", label: "Support", desc: "Manage tickets", icon: HelpCircle },
  { id: "analytics", label: "Analytics", desc: "Platform analytics", icon: BarChart3 },
  { id: "governance", label: "Governance", desc: "Manage governance", icon: ShieldCheck },
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
};

export const adminLinkToRoute: Record<string, string> = {
  dashboard: "/admin/dashboard",
  clients: "/admin/clients",
  users: "/admin/users",
  projects: "/admin/projects",
  "ai-operations": "/admin/ai-operations",
  documents: "/admin/documents",
  billing: "/admin/billing",
  support: "/admin/support",
  analytics: "/admin/analytics",
  governance: "/admin/governance",
};

export const adminLinkToRouteActual = adminLinkToRoute;
