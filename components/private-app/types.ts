export interface UserProfile {
  name: string;
  email: string;
  role: "Client" | "Administrator";
  clearance: string;
  avatarUrl?: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  desc: string;
  severity: "high" | "medium" | "low";
  timestamp: string;
  unread: boolean;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

export interface ActivityItem {
  id: string;
  category: "security" | "compile" | "ledger" | "health";
  title: string;
  desc: string;
  timestamp: string;
  meta?: string;
}

export interface TimelineStep {
  title: string;
  desc: string;
  status: "complete" | "current" | "pending";
  timestamp?: string;
}

export interface ComplianceRule {
  id: string;
  name: string;
  status: "verified" | "warning";
  desc: string;
}

export interface AgentSpec {
  id: string;
  name: string;
  status: "verified" | "evaluating" | "decoupled";
  threads: number;
  memory: string;
  logs: string[];
}

export interface ProjectSpec {
  id: string;
  name: string;
  status: "verified" | "evaluating";
  desc: string;
  nodesCount: number;
  lastUpdated: string;
}

export interface SidebarLink {
  id: string;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}

export type BadgeState = "active" | "warning" | "error" | "stable" | "decoupled";

