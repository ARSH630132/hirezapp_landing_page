import { UserProfile, BreadcrumbItem, SidebarLink, ActivityItem, TimelineStep } from "@/components/private-app";
import { Activity, HelpCircle, FileText, Server, Sliders } from "lucide-react";

export const adminUser: UserProfile = {
  name: "Dr. Sarah Vance",
  email: "s.vance@governance.gff.ai",
  role: "Administrator",
  clearance: "CLEARANCE LEVEL V (SECURE SUPERUSER)"
};

export const sidebarLinks: SidebarLink[] = [
  { id: "dashboard", label: "Oversight Deck", desc: "Global telemetry overview", icon: Activity },
  { id: "nodes", label: "Enclave Clusters", desc: "Isolated sensory mappings", icon: Server },
  { id: "governance", label: "Guardrail Ledger", desc: "Verify ISO-27001 rulesets", icon: Sliders },
  { id: "billing", label: "Financial ledger", desc: "Settled epoch invoices", icon: FileText },
  { id: "support", label: "SLA Tickets", desc: "Active priority secure wires", icon: HelpCircle }
];

export interface ClusterNode {
  id: string;
  nodeId: string;
  client: string;
  status: "active" | "warning" | "stable" | "decoupled";
  load: string;
  uptime: string;
}

export const nodesData: ClusterNode[] = [
  { id: "1", nodeId: "RETAIL-CORE-A1", client: "Sovereign Retail Group", status: "active", load: "42.1%", uptime: "99.998%" },
  { id: "2", nodeId: "ORE-TUNNEL-X4", client: "Sovereign Mining Corp", status: "stable", load: "18.4%", uptime: "99.982%" },
  { id: "3", nodeId: "GOV-SYSTEM-G2", client: "Federal Treasury Division", status: "active", load: "89.2%", uptime: "100.000%" },
  { id: "4", nodeId: "MED-CLINIC-H9", client: "National Health Enclave", status: "warning", load: "94.5%", uptime: "99.954%" },
  { id: "5", nodeId: "TRANS-LOOP-Z1", client: "Continental Transit Org", status: "decoupled", load: "0.0%", uptime: "98.712%" }
];

export const feedItems: ActivityItem[] = [
  { id: "1", category: "security", title: "Zero-Trust Handshake Established", desc: "Node MED-CLINIC-H9 established dual-layer TLS 1.3 socket.", timestamp: "3 mins ago", meta: "SHA_0x11B8" },
  { id: "2", category: "compile", title: "Agent Run Re-Compiled", desc: "Admin Sarah Vance triggered context re-allocation on RETAIL-CORE-A1.", timestamp: "12 mins ago", meta: "SHA_0x7FFA" },
  { id: "3", category: "ledger", title: "Cryptographic Invoice Signed", desc: "Invoice Ledger GFF-2026-0899 cryptographically sealed by treasury key.", timestamp: "1 hour ago", meta: "SHA_0xDE89" }
];

export const timelineSteps: TimelineStep[] = [
  { title: "Sovereign HSM Key Signed", desc: "Root certificate cryptographically embedded in secure enclave hardware.", status: "complete", timestamp: "10:22:15" },
  { title: "Telemetry Pipeline Active", desc: "eBPF kernel-level event stream listening on target nodes.", status: "complete", timestamp: "10:22:18" },
  { title: "Continuous Compliance Check", desc: "Auto-scan of sandbox namespaces for policy violations in progress.", status: "current" },
  { title: "De-provision and Terminate", desc: "Graceful tear-down of transient sandbox memory blocks.", status: "pending" }
];
