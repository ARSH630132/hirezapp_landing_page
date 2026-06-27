/**
 * UI QUALITY CONSTITUTION - GFF AI PREVIEW DATA MODEL
 * 
 * This file centralizes the complete, high-fidelity mock data model for the
 * Client Portal and Admin Portal as required by Task 77-phase4-private-mock-data-model.
 * 
 * All data is deterministic, marked as demo/preview data, and contains no real-world clients or logos.
 */

// ============================================================================
// 1. DATA TYPES (15 REQUIRED TYPES)
// ============================================================================

export interface ClientAccount {
  id: string;
  name: string;
  domain: string;
  status: "active" | "suspended" | "pending";
  tier: "Sovereign" | "Enterprise" | "Standard";
  createdAt: string;
  region: string;
  complianceLevel: string;
  contactName: string;
  contactEmail: string;
}

export interface Project {
  id: string;
  name: string;
  clientAccountId: string;
  status: "active" | "completed" | "paused" | "evaluating";
  desc: string;
  enclaveType: "Intel SGX" | "AMD SEV-SNP" | "AWS Nitro Enclave";
  nodesCount: number;
  lastUpdated: string;
  tag: string;
}

export interface Program {
  id: string;
  name: string;
  status: "active" | "completed" | "on_hold";
  progress: number; // percentage 0-100
  projectIds: string[];
}

export interface AgentOperation {
  id: string;
  name: string;
  projectId: string;
  status: "active" | "evaluating" | "decoupled" | "warning";
  threads: number;
  memory: string;
  logs: string[];
  lastHeartbeat: string;
}

export interface AgentHealth {
  agentId: string;
  status: "healthy" | "warning" | "critical" | "offline";
  cpuUtilization: number; // 0-100
  latencyMs: number;
  memoryUtilization: number; // 0-100
  uptimePercentage: number;
}

export interface DocumentItem {
  id: string;
  name: string;
  size: string;
  format: "PDF" | "JSON" | "YAML" | "CSV" | "DOCX";
  hash: string; // SHA-256 preview
  uploadedAt: string;
  category: "audit" | "governance" | "receipt" | "agreement";
  clearanceLevel: "LEVEL_I" | "LEVEL_II" | "LEVEL_III" | "LEVEL_IV" | "LEVEL_V";
}

export interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: "paid" | "unpaid" | "processing" | "overdue";
  dueDate: string;
  category: "Compute Epoch" | "SLA Support" | "Telemetry Stream" | "Premium Support";
  hash: string; // SHA-256 cryptographic seal
}

export interface SupportTicket {
  id: string;
  title: string;
  status: "open" | "resolved" | "in_progress";
  priority: "high" | "medium" | "low" | "critical";
  createdAt: string;
  desc: string;
  replies: {
    sender: string;
    text: string;
    timestamp: string;
  }[];
}

export interface AnalyticsMetric {
  id: string;
  name: string;
  value: string | number;
  delta: string;
  direction: "up" | "down" | "neutral";
  status: "normal" | "warning" | "stable" | "critical";
  sparkPoints: number[];
}

export interface GovernanceItem {
  id: string;
  name: string;
  standard: "ISO-27001" | "SOC2 Type II" | "HIPAA" | "GDPR Enclave" | "NIST AI RMF";
  status: "compliant" | "non_compliant" | "warning";
  desc: string;
  lastChecked: string;
}

export interface Approval {
  id: string;
  title: string;
  requester: string;
  status: "pending" | "approved" | "rejected";
  requestDate: string;
  category: "Enclave Provisioning" | "Model Boundary Shift" | "Access Elevation" | "HSM Seal Rollover";
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  clearance: string;
  status: "active" | "inactive";
  avatarUrl?: string;
}

export interface Role {
  name: "Client" | "Administrator" | "Auditor";
  permissions: string[];
}

export interface ActivityEvent {
  id: string;
  category: "security" | "compile" | "ledger" | "health";
  title: string;
  desc: string;
  timestamp: string;
  meta?: string;
}

export interface Notification {
  id: string;
  title: string;
  desc: string;
  severity: "high" | "medium" | "low";
  timestamp: string;
  unread: boolean;
}


// ============================================================================
// 2. DETERMINISTIC PREVIEW DATASETS (MARKED CLEARLY AS PREVIEW/DEMO DATA)
// ============================================================================

export const PREVIEW_META = {
  isDemoData: true,
  environment: "Sandbox Emulation",
  disclaimer: "All values, IDs, names, and metrics are simulated for demonstration purposes only.",
  generatedAt: "2026-06-27T12:00:00Z"
};

// 2.1 CLIENT ACCOUNTS
export const previewClientAccounts: ClientAccount[] = [
  {
    id: "client-001",
    name: "Apex Sovereign Group [Preview Client]",
    domain: "apex-sovereign.gff.ai",
    status: "active",
    tier: "Sovereign",
    createdAt: "2026-01-15T08:30:00Z",
    region: "EU-West (Isolated)",
    complianceLevel: "ISO-27001 Fully Certified",
    contactName: "Alexander Mercer",
    contactEmail: "a.mercer@apex-sovereign.gff.ai"
  },
  {
    id: "client-002",
    name: "Global Retail Enclave [Preview Client]",
    domain: "global-retail.gff.ai",
    status: "active",
    tier: "Enterprise",
    createdAt: "2026-02-10T14:15:00Z",
    region: "US-East (Dedicated)",
    complianceLevel: "SOC2 Type II Assured",
    contactName: "Evelyn Carter",
    contactEmail: "e.carter@global-retail.gff.ai"
  },
  {
    id: "client-003",
    name: "Sovereign Logistics Unit [Preview Client]",
    domain: "sovereign-logistics.gff.ai",
    status: "pending",
    tier: "Standard",
    createdAt: "2026-06-01T09:00:00Z",
    region: "APAC-South (Shared)",
    complianceLevel: "NIST AI RMF Pending",
    contactName: "Marcus Vance",
    contactEmail: "m.vance@sovereign-logistics.gff.ai"
  },
  {
    id: "client-004",
    name: "Federal Treasury Division [Preview Client]",
    domain: "fed-treasury.gff.ai",
    status: "active",
    tier: "Sovereign",
    createdAt: "2025-11-20T11:45:00Z",
    region: "US-GovWest (Airgapped)",
    complianceLevel: "NIST SP 800-53 High",
    contactName: "Sarah Jenkins",
    contactEmail: "s.jenkins@fed-treasury.gff.ai"
  }
];

// 2.2 ROLES
export const previewRoles: Record<"Client" | "Administrator" | "Auditor", Role> = {
  Client: {
    name: "Client",
    permissions: [
      "read:telemetry",
      "read:projects",
      "write:projects",
      "read:ai-operations",
      "read:documents",
      "read:billing",
      "write:support"
    ]
  },
  Administrator: {
    name: "Administrator",
    permissions: [
      "read:telemetry",
      "write:telemetry",
      "read:projects",
      "write:projects",
      "read:ai-operations",
      "write:ai-operations",
      "read:documents",
      "write:documents",
      "read:billing",
      "write:billing",
      "read:support",
      "write:support",
      "read:users",
      "write:users",
      "read:clients",
      "write:clients",
      "write:governance"
    ]
  },
  Auditor: {
    name: "Auditor",
    permissions: [
      "read:telemetry",
      "read:projects",
      "read:ai-operations",
      "read:documents",
      "read:governance",
      "read:activity"
    ]
  }
};

// 2.3 USERS
export const previewUsers: User[] = [
  {
    id: "user-001",
    name: "Alexander Mercer",
    email: "a.mercer@apex-sovereign.gff.ai",
    role: { name: "Client", permissions: ["read:telemetry", "read:projects", "write:projects", "read:ai-operations", "read:documents", "read:billing", "write:support"] },
    clearance: "CLEARANCE LEVEL III (SANDBOX OPERATOR)",
    status: "active"
  },
  {
    id: "user-002",
    name: "Dr. Sarah Vance",
    email: "s.vance@governance.gff.ai",
    role: { name: "Administrator", permissions: ["read:telemetry", "write:telemetry", "read:projects", "write:projects", "read:ai-operations", "write:ai-operations", "read:documents", "write:documents", "read:billing", "write:billing", "read:support", "write:support", "read:users", "write:users", "read:clients", "write:clients", "write:governance"] },
    clearance: "CLEARANCE LEVEL V (SECURE SUPERUSER)",
    status: "active"
  },
  {
    id: "user-003",
    name: "Auditor Jenkins",
    email: "j.auditor@compliance.gff.ai",
    role: { name: "Auditor", permissions: ["read:telemetry", "read:projects", "read:ai-operations", "read:documents", "read:governance", "read:activity"] },
    clearance: "CLEARANCE LEVEL IV (TRUST AUDITOR)",
    status: "active"
  }
];


// 2.4 PROJECTS
export const previewProjects: Project[] = [
  {
    id: "proj-001",
    name: "Sovereign Core Sandbox 02",
    clientAccountId: "client-001",
    status: "active",
    desc: "Isolated core processing thread cluster with localized kernel telemetry listening.",
    enclaveType: "Intel SGX",
    nodesCount: 3,
    lastUpdated: "2026-06-27T08:15:00Z",
    tag: "CORE"
  },
  {
    id: "proj-002",
    name: "Model Guardrail Sandbox 04",
    clientAccountId: "client-001",
    status: "active",
    desc: "High-latency filter block simulating continuous alignment and prompt injections prevention.",
    enclaveType: "AMD SEV-SNP",
    nodesCount: 2,
    lastUpdated: "2026-06-27T07:30:00Z",
    tag: "ALIGNMENT"
  },
  {
    id: "proj-003",
    name: "Sovereign Mining Intel Loop",
    clientAccountId: "client-002",
    status: "active",
    desc: "AMD SEV based geological data crunching agents with isolated memory partitions.",
    enclaveType: "AMD SEV-SNP",
    nodesCount: 4,
    lastUpdated: "2026-06-26T22:11:00Z",
    tag: "GEOLOGY"
  },
  {
    id: "proj-004",
    name: "Federal Ledger Enclave Alpha",
    clientAccountId: "client-004",
    status: "active",
    desc: "NIST-compliant hardware enclave isolating state estimation from host execution memory.",
    enclaveType: "AWS Nitro Enclave",
    nodesCount: 5,
    lastUpdated: "2026-06-27T10:00:00Z",
    tag: "FINTECH"
  }
];

// 2.5 PROGRAMS
export const previewPrograms: Program[] = [
  {
    id: "prog-001",
    name: "Sovereign Threat Mitigation Lifecycle",
    status: "active",
    progress: 74,
    projectIds: ["proj-001", "proj-002"]
  },
  {
    id: "prog-002",
    name: "Enterprise Geological Alignment Program",
    status: "active",
    progress: 91,
    projectIds: ["proj-003"]
  },
  {
    id: "prog-003",
    name: "Federal Secure Accounting Ledger Initiative",
    status: "active",
    progress: 45,
    projectIds: ["proj-004"]
  }
];

// 2.6 AGENT OPERATIONS
export const previewAgentOperations: AgentOperation[] = [
  {
    id: "agent-001",
    name: "RETAIL-CORE-A1 [Preview Agent]",
    projectId: "proj-001",
    status: "active",
    threads: 24,
    memory: "4.2 GB / 8.0 GB",
    logs: [
      "Core verification complete (SHA-256: FF81)",
      "Local memory state synchronized successfully",
      "eBPF telemetry boundary active"
    ],
    lastHeartbeat: "2026-06-27T11:58:30Z"
  },
  {
    id: "agent-002",
    name: "ALIGN-GUARD-A2 [Preview Agent]",
    projectId: "proj-002",
    status: "evaluating",
    threads: 16,
    memory: "3.1 GB / 4.0 GB",
    logs: [
      "Policy verification pass 99.8%",
      "No direct model manipulation requests detected.",
      "Syncing guardrail ledger block..."
    ],
    lastHeartbeat: "2026-06-27T11:59:12Z"
  },
  {
    id: "agent-003",
    name: "ORE-TUNNEL-X4 [Preview Agent]",
    projectId: "proj-003",
    status: "active",
    threads: 32,
    memory: "12.8 GB / 16.0 GB",
    logs: [
      "Seismic array map loaded successfully.",
      "AMD SEV memory block verified securely.",
      "Telemetry streaming active: 45.2 MB/s"
    ],
    lastHeartbeat: "2026-06-27T11:57:45Z"
  },
  {
    id: "agent-004",
    name: "MED-CLINIC-H9 [Preview Agent]",
    projectId: "proj-001",
    status: "warning",
    threads: 16,
    memory: "7.1 GB / 8.0 GB",
    logs: [
      "Warning: Thread load above safety line (85%)",
      "Triggered telemetry frame check...",
      "Awaiting auto-scaling context re-allocator"
    ],
    lastHeartbeat: "2026-06-27T11:58:11Z"
  },
  {
    id: "agent-005",
    name: "TRANS-LOOP-Z1 [Preview Agent]",
    projectId: "proj-001",
    status: "decoupled",
    threads: 0,
    memory: "0.0 GB / 8.0 GB",
    logs: [
      "Thread execution terminated gracefully by operator.",
      "State dumped to local cryptographic storage block.",
      "Hardware enclave decoupled."
    ],
    lastHeartbeat: "2026-06-26T23:55:00Z"
  }
];

// 2.7 AGENT HEALTH
export const previewAgentHealths: AgentHealth[] = [
  {
    agentId: "agent-001",
    status: "healthy",
    cpuUtilization: 42,
    latencyMs: 12,
    memoryUtilization: 52,
    uptimePercentage: 99.998
  },
  {
    agentId: "agent-002",
    status: "healthy",
    cpuUtilization: 18,
    latencyMs: 24,
    memoryUtilization: 77,
    uptimePercentage: 99.982
  },
  {
    agentId: "agent-003",
    status: "healthy",
    cpuUtilization: 65,
    latencyMs: 14,
    memoryUtilization: 80,
    uptimePercentage: 99.991
  },
  {
    agentId: "agent-004",
    status: "warning",
    cpuUtilization: 94,
    latencyMs: 88,
    memoryUtilization: 89,
    uptimePercentage: 99.954
  },
  {
    agentId: "agent-005",
    status: "offline",
    cpuUtilization: 0,
    latencyMs: 999,
    memoryUtilization: 0,
    uptimePercentage: 98.712
  }
];


// 2.8 DOCUMENT ITEMS
export const previewDocuments: DocumentItem[] = [
  {
    id: "doc-001",
    name: "ISO27001_Sovereign_Sandbox_Audit_2026.pdf",
    size: "4.8 MB",
    format: "PDF",
    hash: "0x8FDE3102C130D7B2D26788AB0E8A850CE3207FFCDE10B74E824A45B12A4F23AA",
    uploadedAt: "2026-05-12T10:30:00Z",
    category: "audit",
    clearanceLevel: "LEVEL_III"
  },
  {
    id: "doc-002",
    name: "Guardrail_Ruleset_SOC2_Compliance_Signed.yaml",
    size: "24 KB",
    format: "YAML",
    hash: "0x3FBC128EE809FF9CC9810A88AA11B8FFFA02CE8274A08B0192A45C89FBC10492",
    uploadedAt: "2026-06-01T15:45:00Z",
    category: "governance",
    clearanceLevel: "LEVEL_IV"
  },
  {
    id: "doc-003",
    name: "Compute_Epoch_GFF_Receipt_2026_Q2.pdf",
    size: "1.2 MB",
    format: "PDF",
    hash: "0xDE897FF021BC8102C019FFAD998E1256E3B890CC7FFADE138EE87A02FF90A11B",
    uploadedAt: "2026-06-15T09:12:00Z",
    category: "receipt",
    clearanceLevel: "LEVEL_II"
  },
  {
    id: "doc-004",
    name: "Airgapped_Interlock_Agreement_Executed.pdf",
    size: "14.2 MB",
    format: "PDF",
    hash: "0x11B8A02FEE907C10BDE8267FEE10BC91A23D4FFA289F02ECBC12A349CDE150FA",
    uploadedAt: "2026-01-20T11:00:00Z",
    category: "agreement",
    clearanceLevel: "LEVEL_V"
  }
];

// 2.9 INVOICES
export const previewInvoices: Invoice[] = [
  {
    id: "GFF-2026-0899",
    date: "2026-06-01",
    amount: "14,820.00 USD",
    status: "paid",
    dueDate: "2026-06-15",
    category: "Compute Epoch",
    hash: "0xDE897FF021BC8102C019FFAD998E1256E3B890CC7FFADE138EE87A02FF90A11B"
  },
  {
    id: "GFF-2026-0914",
    date: "2026-06-15",
    amount: "3,500.00 USD",
    status: "paid",
    dueDate: "2026-06-30",
    category: "SLA Support",
    hash: "0x11B8A02FEE907C10BDE8267FEE10BC91A23D4FFA289F02ECBC12A349CDE150FA"
  },
  {
    id: "GFF-2026-0945",
    date: "2026-06-25",
    amount: "24,900.00 USD",
    status: "processing",
    dueDate: "2026-07-10",
    category: "Telemetry Stream",
    hash: "0x8FDE3102C130D7B2D26788AB0E8A850CE3207FFCDE10B74E824A45B12A4F23AA"
  },
  {
    id: "GFF-2026-0988",
    date: "2026-06-27",
    amount: "8,250.00 USD",
    status: "unpaid",
    dueDate: "2026-07-15",
    category: "Compute Epoch",
    hash: "0x3FBC128EE809FF9CC9810A88AA11B8FFFA02CE8274A08B0192A45C89FBC10492"
  }
];

// 2.10 SUPPORT TICKETS
export const previewSupportTickets: SupportTicket[] = [
  {
    id: "SLA-TKT-9912",
    title: "Secure HSM Key Rotation Interlock Delayed",
    status: "open",
    priority: "critical",
    createdAt: "2026-06-27T10:15:00Z",
    desc: "Enclave hardware is reporting socket timeout while performing automatic HSM roll-key rotation with Sovereign Core Sandbox 02. Expected timeout in 45 minutes.",
    replies: [
      {
        sender: "Alexander Mercer",
        text: "Initiated automated rotation but the ledger remains uncommitted. Telemetry is fully active.",
        timestamp: "2026-06-27T10:15:00Z"
      },
      {
        sender: "Dr. Sarah Vance (Admin)",
        text: "Analyzing cryptographic enclave stream. Standby, we will manually sign the handshake bypass if needed.",
        timestamp: "2026-06-27T10:25:00Z"
      }
    ]
  },
  {
    id: "SLA-TKT-9801",
    title: "Thread Load Allocation Exceeding Normal Boundaries",
    status: "in_progress",
    priority: "high",
    createdAt: "2026-06-27T07:18:00Z",
    desc: "Node MED-CLINIC-H9 CPU utilization hit 94.5% during diagnostic prompt scan lifecycle. Requesting auto-scaling validation check.",
    replies: [
      {
        sender: "Evelyn Carter",
        text: "The threat mapping thread is locked in an infinite evaluation state on local SGX enclave.",
        timestamp: "2026-06-27T07:18:00Z"
      },
      {
        sender: "Security Bot",
        text: "Auto-scan activated. Sandboxed namespace isolated. No breach or policy leakage detected.",
        timestamp: "2026-06-27T07:22:00Z"
      }
    ]
  },
  {
    id: "SLA-TKT-9450",
    title: "SOC2 Compliance Report Signoff Complete",
    status: "resolved",
    priority: "medium",
    createdAt: "2026-06-25T11:40:00Z",
    desc: "Audit check complete on all active sandbox namespaces. No policy violations detected across 10,000 epoch transactions.",
    replies: [
      {
        sender: "Auditor Jenkins",
        text: "Signed off on compliant enclaves for Q2 2026. Cryptographic seal logged on GFF AI ledger.",
        timestamp: "2026-06-25T11:40:00Z"
      },
      {
        sender: "Alexander Mercer",
        text: "Confirmed. Loaded compliance badge into Sovereign Core portal.",
        timestamp: "2026-06-25T14:30:00Z"
      }
    ]
  }
];

// 2.11 ANALYTICS METRICS
export const previewAnalyticsMetrics: AnalyticsMetric[] = [
  {
    id: "metric-cpu",
    name: "Global Enclave CPU Utilization",
    value: "41.8%",
    delta: "+2.4%",
    direction: "up",
    status: "normal",
    sparkPoints: [32, 45, 38, 52, 48, 65, 58, 72, 69, 85, 78, 82]
  },
  {
    id: "metric-latency",
    name: "Mean Cryptographic Interlock Latency",
    value: "14.2 ms",
    delta: "-1.1 ms",
    direction: "down",
    status: "stable",
    sparkPoints: [18, 16, 17, 15, 14, 15, 14, 13, 14, 14, 13, 14]
  },
  {
    id: "metric-compliance",
    name: "Sandbox Compliance Verification Rate",
    value: "100.00%",
    delta: "0.0%",
    direction: "neutral",
    status: "stable",
    sparkPoints: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100]
  },
  {
    id: "metric-memory",
    name: "Isolated HSM Memory Overhead",
    value: "62.4 GB",
    delta: "+8.1 GB",
    direction: "up",
    status: "normal",
    sparkPoints: [52, 54, 53, 55, 57, 58, 60, 61, 62, 62, 62, 62]
  }
];


// 2.12 GOVERNANCE ITEMS
export const previewGovernanceItems: GovernanceItem[] = [
  {
    id: "gov-001",
    name: "ISO-27001 Cryptographic Key Hygiene",
    standard: "ISO-27001",
    status: "compliant",
    desc: "Enforces a 30-day automatic key rotation cycle inside isolated HSM memory pools.",
    lastChecked: "2026-06-27T11:00:00Z"
  },
  {
    id: "gov-002",
    name: "eBPF Sandboxed Host Execution Boundaries",
    standard: "SOC2 Type II",
    status: "compliant",
    desc: "Active kernel-level monitoring ensuring sandbox containers cannot inspect host system memory space.",
    lastChecked: "2026-06-27T11:30:00Z"
  },
  {
    id: "gov-003",
    name: "Sovereign Compliance Model Audit Range",
    standard: "NIST AI RMF",
    status: "warning",
    desc: "Requires continuous prompt/response filtering log streams. Alert: Node MED-CLINIC-H9 logs are approaching local disk limits.",
    lastChecked: "2026-06-27T10:15:00Z"
  },
  {
    id: "gov-004",
    name: "Patient Identity Isolation Enclave",
    standard: "HIPAA",
    status: "compliant",
    desc: "Cryptographically redacts high-risk patient fields inside secure enclave boundaries before transit.",
    lastChecked: "2026-06-27T09:00:00Z"
  }
];

// 2.13 APPROVALS
export const previewApprovals: Approval[] = [
  {
    id: "appr-001",
    title: "Elevate Alexander Mercer to Level IV Clearance (Temporary)",
    requester: "Apex Sovereign Group",
    status: "pending",
    requestDate: "2026-06-27T11:15:00Z",
    category: "Access Elevation"
  },
  {
    id: "appr-002",
    title: "Deploy 5 New AMD SEV-SNP Sandbox Nodes for Sovereign Mining",
    requester: "Global Retail Enclave",
    status: "approved",
    requestDate: "2026-06-26T14:30:00Z",
    category: "Enclave Provisioning"
  },
  {
    id: "appr-003",
    title: "Force Roll-Over HSM Cryptographic Root Certificates",
    requester: "Dr. Sarah Vance",
    status: "approved",
    requestDate: "2026-06-25T09:00:00Z",
    category: "HSM Seal Rollover"
  }
];

// 2.14 ACTIVITY EVENTS
export const previewActivityEvents: ActivityEvent[] = [
  {
    id: "act-001",
    category: "security",
    title: "Zero-Zero Handshake Established",
    desc: "Node MED-CLINIC-H9 established dual-layer TLS 1.3 socket and validated root certificates.",
    timestamp: "3 mins ago",
    meta: "SHA_0x11B8"
  },
  {
    id: "act-002",
    category: "compile",
    title: "Agent Run Re-Compiled",
    desc: "Admin Dr. Sarah Vance triggered high-priority context re-allocation on RETAIL-CORE-A1 sandbox.",
    timestamp: "12 mins ago",
    meta: "SHA_0x7FFA"
  },
  {
    id: "act-003",
    category: "ledger",
    title: "Cryptographic Invoice Signed",
    desc: "Invoice Ledger GFF-2026-0899 cryptographically sealed by treasury private key.",
    timestamp: "1 hour ago",
    meta: "SHA_0xDE89"
  },
  {
    id: "act-004",
    category: "health",
    title: "Enclave Heartbeat Delayed",
    desc: "Host AMD-SEV core on Sovereign Mining Intel Loop reported 120ms latency spike.",
    timestamp: "2 hours ago",
    meta: "SHA_0xBF99"
  }
];

// 2.15 NOTIFICATIONS
export const previewNotifications: Notification[] = [
  {
    id: "notif-001",
    title: "SLA-TKT-9912 Key Rotation Conflict",
    desc: "Critical support ticket initiated regarding automatic HSM roll-key rotation delay.",
    severity: "high",
    timestamp: "5 mins ago",
    unread: true
  },
  {
    id: "notif-002",
    title: "Access Elevation Request",
    desc: "Alexander Mercer requested temporary Clearance Level IV access elevation.",
    severity: "medium",
    timestamp: "45 mins ago",
    unread: true
  },
  {
    id: "notif-003",
    title: "Weekly Compliance Ledger Sealed",
    desc: "Weekly sandbox compliance audit logs cryptographically compiled and zipped.",
    severity: "low",
    timestamp: "1 day ago",
    unread: false
  }
];

// ============================================================================
// 3. HELPER SECTIONS / DATA QUERY UTILITIES
// ============================================================================

export function getClientAccount(id: string): ClientAccount | undefined {
  return previewClientAccounts.find(c => c.id === id);
}

export function getProjectsForClient(clientId: string): Project[] {
  return previewProjects.filter(p => p.clientAccountId === clientId);
}

export function getAgentOperationsForProject(projectId: string): AgentOperation[] {
  return previewAgentOperations.filter(a => a.projectId === projectId);
}

export function getAgentHealth(agentId: string): AgentHealth | undefined {
  return previewAgentHealths.find(h => h.agentId === agentId);
}

export function getTicketReplies(ticketId: string) {
  const ticket = previewSupportTickets.find(t => t.id === ticketId);
  return ticket ? ticket.replies : [];
}

export function getUnreadNotificationsCount(): number {
  return previewNotifications.filter(n => n.unread).length;
}

