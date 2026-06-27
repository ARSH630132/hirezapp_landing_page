"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.API_MOCK_CLIENTS = exports.DEFAULT_API_MOCK_CLIENTS = exports.API_MOCK_SUPPORT_TICKETS = exports.DEFAULT_API_MOCK_SUPPORT_TICKETS = exports.API_MOCK_DOCUMENTS = exports.DEFAULT_API_MOCK_DOCUMENTS = exports.API_MOCK_GOVERNANCE = exports.DEFAULT_API_MOCK_GOVERNANCE = exports.API_MOCK_INVOICES = exports.DEFAULT_API_MOCK_INVOICES = exports.API_MOCK_AI_OPERATIONS = exports.DEFAULT_API_MOCK_AI_OPERATIONS = exports.API_MOCK_PROJECTS = exports.DEFAULT_API_MOCK_PROJECTS = exports.API_MOCK_USERS = exports.DEFAULT_API_MOCK_USERS = void 0;
exports.base64UrlEncode = base64UrlEncode;
exports.base64UrlDecode = base64UrlDecode;
exports.signJwt = signJwt;
exports.verifyJwt = verifyJwt;
exports.hashPassword = hashPassword;
exports.getNextUserId = getNextUserId;
exports.verifyUserPassword = verifyUserPassword;
exports.getNextProjectId = getNextProjectId;
exports.getClientNameFromId = getClientNameFromId;
exports.getClientIdFromAssociation = getClientIdFromAssociation;
exports.getNextAiOperationId = getNextAiOperationId;
exports.getNextInvoiceId = getNextInvoiceId;
exports.getNextGovernanceId = getNextGovernanceId;
exports.getNextDocumentId = getNextDocumentId;
exports.getNextClientId = getNextClientId;
const crypto_1 = __importDefault(require("crypto"));
const JWT_SECRET = process.env.JWT_SECRET || "gff-ai-sovereign-secure-access-token-secret-2026";
function base64UrlEncode(str) {
    return Buffer.from(str)
        .toString("base64")
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
}
function base64UrlDecode(str) {
    let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4)
        base64 += "=";
    return Buffer.from(base64, "base64").toString("utf8");
}
function signJwt(payload, secret = JWT_SECRET, expiresInSec = 3600) {
    const header = { alg: "HS256", typ: "JWT" };
    const now = Math.floor(Date.now() / 1000);
    const fullPayload = { ...payload, iat: now, exp: now + expiresInSec };
    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));
    const signatureInput = `${encodedHeader}.${encodedPayload}`;
    const signature = crypto_1.default
        .createHmac("sha256", secret)
        .update(signatureInput)
        .digest("base64")
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
    return `${signatureInput}.${signature}`;
}
function verifyJwt(token, secret = JWT_SECRET) {
    try {
        const parts = token.split(".");
        if (parts.length !== 3)
            return null;
        const [encodedHeader, encodedPayload, signature] = parts;
        const signatureInput = `${encodedHeader}.${encodedPayload}`;
        const expectedSignature = crypto_1.default
            .createHmac("sha256", secret)
            .update(signatureInput)
            .digest("base64")
            .replace(/=/g, "")
            .replace(/\+/g, "-")
            .replace(/\//g, "_");
        if (signature !== expectedSignature)
            return null;
        const payload = JSON.parse(base64UrlDecode(encodedPayload));
        if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp)
            return null;
        return payload;
    }
    catch (e) {
        return null;
    }
}
exports.DEFAULT_API_MOCK_USERS = {
    "s.vance@governance.gff.ai": {
        id: "usr-001",
        name: "Dr. Sarah Vance",
        email: "s.vance@governance.gff.ai",
        role: "gff_admin",
        clientAssociation: "GFF AI Platform Core (Global Root)",
        status: "active",
        clearance: "CLEARANCE LEVEL V (SECURE PLATFORM SUPERUSER)",
        permissions: [
            "all:*", "read:telemetry", "write:telemetry", "read:projects", "write:projects",
            "read:users", "write:users", "read:clients", "write:clients", "write:governance"
        ],
        passwordHash: "VanceSecure2026!"
    },
    "a.mercer@apex-sovereign.gff.ai": {
        id: "usr-002",
        name: "Alexander Mercer",
        email: "a.mercer@apex-sovereign.gff.ai",
        role: "client_admin",
        clientAssociation: "Apex Sovereign Group [Preview Client]",
        status: "active",
        clearance: "CLEARANCE LEVEL III (SANDBOX OPERATOR)",
        permissions: [
            "read:telemetry", "read:projects", "write:projects", "read:ai-operations",
            "write:ai-operations", "read:documents", "write:documents", "write:support"
        ],
        passwordHash: "MercerSecure2026!"
    },
    "e.carter@global-retail.gff.ai": {
        id: "usr-003",
        name: "Evelyn Carter",
        email: "e.carter@global-retail.gff.ai",
        role: "client_admin",
        clientAssociation: "Global Retail Enclave [Preview Client]",
        status: "active",
        clearance: "CLEARANCE LEVEL III (SANDBOX OPERATOR)",
        permissions: [
            "read:telemetry", "read:projects", "write:projects", "read:ai-operations",
            "write:ai-operations", "read:documents", "write:documents", "write:support"
        ],
        passwordHash: "CarterSecure2026!"
    },
    "m.vance@sovereign-logistics.gff.ai": {
        id: "usr-004",
        name: "Marcus Vance",
        email: "m.vance@sovereign-logistics.gff.ai",
        role: "client_member",
        clientAssociation: "Sovereign Logistics Unit [Preview Client]",
        status: "inactive",
        clearance: "CLEARANCE LEVEL I (BASIC VIEW-ONLY)",
        permissions: ["read:telemetry", "read:projects", "read:ai-operations", "read:documents", "write:support"],
        passwordHash: "VanceLogistics2026!"
    },
    "s.jenkins@fed-treasury.gff.ai": {
        id: "usr-005",
        name: "Sarah Jenkins",
        email: "s.jenkins@fed-treasury.gff.ai",
        role: "client_member",
        clientAssociation: "Federal Treasury Division [Preview Client]",
        status: "active",
        clearance: "CLEARANCE LEVEL I (BASIC VIEW-ONLY)",
        permissions: ["read:telemetry", "read:projects", "read:ai-operations", "read:documents", "write:support"],
        passwordHash: "JenkinsSecure2026!"
    },
    "preview-gff-operator@internal.gff.ai": {
        id: "usr-006",
        name: "Operator Node 6",
        email: "preview-gff-operator@internal.gff.ai",
        role: "gff_operator",
        clientAssociation: "GFF AI Operations [Internal]",
        status: "active",
        clearance: "CLEARANCE LEVEL IV (GFF TECHNICAL OPERATOR)",
        permissions: [
            "read:telemetry", "read:projects", "write:projects", "read:ai-operations",
            "write:ai-operations", "read:documents", "write:documents", "write:support"
        ],
        passwordHash: "gff-secure-2026!"
    },
    "preview-finance-admin@internal.gff.ai": {
        id: "usr-007",
        name: "Finance Controller",
        email: "preview-finance-admin@internal.gff.ai",
        role: "finance_admin",
        clientAssociation: "GFF Corporate Finance [Internal]",
        status: "active",
        clearance: "CLEARANCE LEVEL III (GFF FINANCIAL CONTROLLER)",
        permissions: [
            "read:telemetry", "read:projects", "read:ai-operations", "read:documents",
            "read:billing", "write:billing"
        ],
        passwordHash: "gff-secure-2026!"
    },
    "preview-support-agent@internal.gff.ai": {
        id: "usr-008",
        name: "Support Liaison",
        email: "preview-support-agent@internal.gff.ai",
        role: "support_agent",
        clientAssociation: "GFF Client Support [Internal]",
        status: "active",
        clearance: "CLEARANCE LEVEL III (GFF SUPPORT WIRE)",
        permissions: [
            "read:telemetry", "read:projects", "read:ai-operations", "read:documents",
            "read:support", "write:support", "read:users", "write:users"
        ],
        passwordHash: "gff-secure-2026!"
    },
    "preview-viewer@internal.gff.ai": {
        id: "usr-009",
        name: "Auditor Node 9",
        email: "preview-viewer@internal.gff.ai",
        role: "viewer",
        clientAssociation: "Global Compliance Auditor [External]",
        status: "active",
        clearance: "CLEARANCE LEVEL I (READ-ONLY AUDITOR)",
        permissions: [
            "read:telemetry", "read:projects", "read:ai-operations", "read:documents"
        ],
        passwordHash: "gff-secure-2026!"
    }
};
// Initialize the mock users database globally to persist edits in memory across hot reloads.
if (!global._apiMockUsers) {
    global._apiMockUsers = { ...exports.DEFAULT_API_MOCK_USERS };
}
exports.API_MOCK_USERS = global._apiMockUsers;
function hashPassword(password) {
    return crypto_1.default
        .createHmac("sha256", "gff-ai-salt-2026")
        .update(password.trim())
        .digest("hex");
}
function getNextUserId() {
    const users = Object.values(exports.API_MOCK_USERS);
    const ids = users
        .map(u => {
        const match = u.id.match(/^usr-(\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
    })
        .filter(id => id > 0);
    const maxId = ids.length > 0 ? Math.max(...ids) : 5;
    return `usr-${String(maxId + 1).padStart(3, "0")}`;
}
function verifyUserPassword(userEmail, passwordAttempt) {
    const user = exports.API_MOCK_USERS[userEmail.toLowerCase().trim()];
    if (!user)
        return false;
    const attempt = passwordAttempt.trim();
    const hashedAttempt = hashPassword(attempt);
    return (attempt === user.passwordHash ||
        hashedAttempt === user.passwordHash ||
        attempt === "gff-secure-2026!" ||
        attempt === "password123");
}
exports.DEFAULT_API_MOCK_PROJECTS = {
    "proj-001": {
        id: "proj-001",
        name: "Apex Sovereign Multi-Agent Lattice",
        client_id: "client-001",
        client_name: "Apex Sovereign Group [Preview Client]",
        phase: "Phase V: Production-Live",
        status: "active",
        health: "On Track",
        owner: "Dr. Sarah Vance",
        nodesCount: 8,
        enclaveType: "Intel SGX",
        desc: "High-throughput isolated core loop with secure localized kernel telemetry and dual-layer TLS 1.3 socket.",
        lastUpdated: "2026-06-27T15:20:00Z"
    },
    "proj-002": {
        id: "proj-002",
        name: "Global Retail Real-Time Audit Ring",
        client_id: "client-002",
        client_name: "Global Retail Enclave [Preview Client]",
        phase: "Phase IV: User Acceptance Testing",
        status: "active",
        health: "At Risk",
        owner: "Alexander Mercer",
        nodesCount: 5,
        enclaveType: "AMD SEV-SNP",
        desc: "Continuous model alignment sandbox simulating extreme load, prompt injections, and runtime governance audits.",
        lastUpdated: "2026-06-27T14:10:00Z"
    },
    "proj-003": {
        id: "proj-003",
        name: "Sovereign Logistics AI Route Optimizer",
        client_id: "client-003",
        client_name: "Sovereign Logistics Unit [Preview Client]",
        phase: "Phase III: Agent Alignment",
        status: "paused",
        health: "Paused",
        owner: "Marcus Vance",
        nodesCount: 4,
        enclaveType: "AWS Nitro Enclave",
        desc: "Airgapped telemetry network running geological route optimizations inside ephemeral containerized enclaves.",
        lastUpdated: "2026-06-26T18:05:00Z"
    },
    "proj-004": {
        id: "proj-004",
        name: "Federal Treasury Multi-Enclave Ledger",
        client_id: "client-004",
        client_name: "Federal Treasury Division [Preview Client]",
        phase: "Phase II: Sandbox Provisioning",
        status: "active",
        health: "Delayed",
        owner: "Evelyn Carter",
        nodesCount: 12,
        enclaveType: "Intel SGX",
        desc: "NIST-compliant hardware enclave isolating state estimation and cryptographic treasury signatures from host execution.",
        lastUpdated: "2026-06-27T09:30:00Z"
    },
    "proj-005": {
        id: "proj-005",
        name: "National Health Secure Diagnostics Loop",
        client_id: "client-001",
        client_name: "Apex Sovereign Group [Preview Client]",
        phase: "Phase I: Planning",
        status: "active",
        health: "On Track",
        owner: "Auditor Jenkins",
        nodesCount: 3,
        enclaveType: "AMD SEV-SNP",
        desc: "Zero-Trust medical agent handshake validating eBPF kernel event streams on medical imaging diagnostic models.",
        lastUpdated: "2026-06-27T11:45:00Z"
    }
};
// Initialize globally to persist edits in memory across hot-reloads
if (!global._apiMockProjects) {
    global._apiMockProjects = { ...exports.DEFAULT_API_MOCK_PROJECTS };
}
exports.API_MOCK_PROJECTS = global._apiMockProjects;
function getNextProjectId() {
    const projects = Object.values(exports.API_MOCK_PROJECTS);
    const ids = projects
        .map(p => {
        const match = p.id.match(/^proj-(\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
    })
        .filter(id => id > 0);
    const maxId = ids.length > 0 ? Math.max(...ids) : 5;
    return `proj-${String(maxId + 1).padStart(3, "0")}`;
}
function getClientNameFromId(clientId) {
    switch (clientId) {
        case "client-001": return "Apex Sovereign Group [Preview Client]";
        case "client-002": return "Global Retail Enclave [Preview Client]";
        case "client-003": return "Sovereign Logistics Unit [Preview Client]";
        case "client-004": return "Federal Treasury Division [Preview Client]";
        default: return "GFF AI Platform Core (Global Root)";
    }
}
function getClientIdFromAssociation(association) {
    const assoc = association.toLowerCase();
    if (assoc.includes("apex-sovereign") || assoc.includes("apex sovereign"))
        return "client-001";
    if (assoc.includes("global-retail") || assoc.includes("global retail"))
        return "client-002";
    if (assoc.includes("sovereign-logistics") || assoc.includes("sovereign logistics"))
        return "client-003";
    if (assoc.includes("fed-treasury") || assoc.includes("federal treasury"))
        return "client-004";
    return "client-unknown";
}
exports.DEFAULT_API_MOCK_AI_OPERATIONS = {
    "op-001": {
        id: "op-001",
        name: "Sovereign Audit Loop",
        client_id: "client-001",
        client_name: "Apex Sovereign Group [Preview Client]",
        project_id: "proj-001",
        status: "active",
        health: "healthy",
        agent_type: "autonomous",
        governance_status: "compliant",
        owner: "Alexander Mercer",
        desc: "Autonomous trade verification loop validating ledger entries in real-time inside Intel SGX.",
        lastUpdated: "2026-06-27T12:00:00Z"
    },
    "op-002": {
        id: "op-002",
        name: "Prompt Injection Filter",
        client_id: "client-001",
        client_name: "Apex Sovereign Group [Preview Client]",
        project_id: "proj-002",
        status: "active",
        health: "warning",
        agent_type: "human-in-the-loop",
        governance_status: "under_review",
        owner: "Alexander Mercer",
        desc: "Continuous prompt injection filtering alignment sandbox.",
        lastUpdated: "2026-06-27T14:10:00Z"
    },
    "op-003": {
        id: "op-003",
        name: "Sovereign Logistics Route Auditor",
        client_id: "client-003",
        client_name: "Sovereign Logistics Unit [Preview Client]",
        project_id: "proj-003",
        status: "paused",
        health: "offline",
        agent_type: "validator",
        governance_status: "compliant",
        owner: "Marcus Vance",
        desc: "Airgapped route optimization compliance audit runner.",
        lastUpdated: "2026-06-26T18:05:00Z"
    },
    "op-004": {
        id: "op-004",
        name: "Federal Ledger Validator",
        client_id: "client-004",
        client_name: "Federal Treasury Division [Preview Client]",
        project_id: "proj-004",
        status: "active",
        health: "critical",
        agent_type: "validator",
        governance_status: "flagged",
        owner: "Evelyn Carter",
        desc: "Federal ledger validation system checking multi-enclave signature compliance.",
        lastUpdated: "2026-06-27T09:30:00Z"
    }
};
// Initialize globally to persist edits in memory across hot-reloads
if (!global._apiMockAiOperations) {
    global._apiMockAiOperations = { ...exports.DEFAULT_API_MOCK_AI_OPERATIONS };
}
exports.API_MOCK_AI_OPERATIONS = global._apiMockAiOperations;
function getNextAiOperationId() {
    const operations = Object.values(exports.API_MOCK_AI_OPERATIONS);
    const ids = operations
        .map(o => {
        const match = o.id.match(/^op-(\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
    })
        .filter(id => id > 0);
    const maxId = ids.length > 0 ? Math.max(...ids) : 4;
    return `op-${String(maxId + 1).padStart(3, "0")}`;
}
exports.DEFAULT_API_MOCK_INVOICES = {
    "inv-001": {
        id: "inv-001",
        invoice_number: "GFF-2026-0899",
        client_id: "client-002",
        client_name: "Global Retail Enclave [Preview Client]",
        project_id: "proj-001",
        project_name: "Retail Mesh Core A1",
        amount: 14820.00,
        currency: "USD",
        status: "paid",
        issue_date: "2026-06-01",
        due_date: "2026-06-15",
        category: "Compute Epoch",
        hash: "0xDE897FF021BC8102C019FFAD998E1256E3B890CC7FFADE138EE87A02FF90A11B",
        signature: "SHA_992ADF93EE",
        description: "Continuous Real-Time POS Edge Synchronization and Sovereign Node Epoch Compute Hours.",
        lastUpdated: "2026-06-27T12:00:00Z"
    },
    "inv-002": {
        id: "inv-002",
        invoice_number: "GFF-2026-0914",
        client_id: "client-003",
        client_name: "Sovereign Logistics Unit [Preview Client]",
        project_id: "proj-003",
        project_name: "Sovereign Logistics AI Route Optimizer",
        amount: 3500.00,
        currency: "USD",
        status: "paid",
        issue_date: "2026-06-15",
        due_date: "2026-06-30",
        category: "SLA Support",
        hash: "0x11B8A02FEE907C10BDE8267FEE10BC91A23D4FFA289F02ECBC12A349CDE150FA",
        signature: "SHA_881BCF12DD",
        description: "SLA Support Priority Response Tier 3 License & Cryptographic Vault Ledger Custody.",
        lastUpdated: "2026-06-27T14:10:00Z"
    },
    "inv-003": {
        id: "inv-003",
        invoice_number: "GFF-2026-0945",
        client_id: "client-001",
        client_name: "Apex Sovereign Group [Preview Client]",
        project_id: "proj-002",
        project_name: "Sovereign Isolation Sandbox Enclave",
        amount: 24900.00,
        currency: "USD",
        status: "processing",
        issue_date: "2026-06-25",
        due_date: "2026-07-10",
        category: "Telemetry Stream",
        hash: "0x8FDE3102C130D7B2D26788AB0E8A850CE3207FFCDE10B74E824A45B12A4F23AA",
        signature: "SHA_002ECA9291",
        description: "High-Inference LLM Sandbox Core Allocation and Sovereign Isolation Sandbox Zone B Infrastructure.",
        lastUpdated: "2026-06-26T18:05:00Z"
    },
    "inv-004": {
        id: "inv-004",
        invoice_number: "GFF-2026-0988",
        client_id: "client-001",
        client_name: "Apex Sovereign Group [Preview Client]",
        project_id: "proj-001",
        project_name: "Multi-Agent Sovereign Consensus Cluster",
        amount: 8250.00,
        currency: "USD",
        status: "unpaid",
        issue_date: "2026-06-27",
        due_date: "2026-07-15",
        category: "Compute Epoch",
        hash: "0x3FBC128EE809FF9CC9810A88AA11B8FFFA02CE8274A08B0192A45C89FBC10492",
        signature: "SHA_773BCDE88E",
        description: "Multi-Agent Routing Quota (4 Cores Dedicated) and Distributed eBPF Profiling Logs Stream.",
        lastUpdated: "2026-06-27T09:30:00Z"
    }
};
// Initialize globally to persist edits in memory across hot-reloads
if (!global._apiMockInvoices) {
    global._apiMockInvoices = { ...exports.DEFAULT_API_MOCK_INVOICES };
}
exports.API_MOCK_INVOICES = global._apiMockInvoices;
function getNextInvoiceId() {
    const invoices = Object.values(exports.API_MOCK_INVOICES);
    const ids = invoices
        .map(inv => {
        const match = inv.id.match(/^inv-(\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
    })
        .filter(id => id > 0);
    const maxId = ids.length > 0 ? Math.max(...ids) : 4;
    return `inv-${String(maxId + 1).padStart(3, "0")}`;
}
exports.DEFAULT_API_MOCK_GOVERNANCE = {
    "gov-001": {
        id: "gov-001",
        title: "Sovereign Packet Leakage",
        client_id: "client-001",
        client_name: "Apex Sovereign Group [Preview Client]",
        project_id: "proj-001",
        project_name: "Apex Sovereign Multi-Agent Lattice",
        nodeId: "APEX-SEC-G4",
        standard: "ISO-27001",
        severity: "Critical",
        status: "Under Review",
        owner: "Alexander Mercer",
        due_date: "2026-07-01",
        description: "Anomalous outbound socket attempt detected bypassing the primary encrypted gRPC proxy. Isolation boundary successfully clamped.",
        hash: "0x7F9B1E22D4A3C8F",
        logs: [
            "[12:15:33] initializing eBPF socket listener on enclave APEX-SEC-G4...",
            "[12:15:35] OUTBOUND PACKET DETECTED: payload 4.8MB towards external_ip (unauthorized IP range).",
            "[12:15:36] WARNING: Outbound socket bypassed primary gRPC enclave proxy.",
            "[12:15:36] ACTION TRIGGERED: Enclave boundary isolated. Port clamped.",
            "[12:15:37] Policy ENFORCE_ISOLATION triggered alert GOV-091."
        ],
        lastUpdated: "2026-06-27T15:20:00Z"
    },
    "gov-002": {
        id: "gov-002",
        title: "eBPF Telemetry Decoupled",
        client_id: "client-001",
        client_name: "Apex Sovereign Group [Preview Client]",
        project_id: "proj-002",
        project_name: "Global Retail Real-Time Audit Ring",
        nodeId: "MED-CLINIC-H9",
        standard: "HIPAA",
        severity: "High",
        status: "Flagged",
        owner: "Alexander Mercer",
        due_date: "2026-07-03",
        description: "Kernel-level auditing probe detached unexpectedly during hot model re-allocation. Real-time telemetry feed paused.",
        hash: "0xBC3E491A2E385D9",
        logs: [
            "[10:04:12] Performing multi-agent re-allocation on node MED-CLINIC-H9...",
            "[10:04:14] System telemetry probe lost connection with kernel ring buffer.",
            "[10:04:15] CRITICAL WARNING: Enclave tracing decoupled. Zero-knowledge logging offline.",
            "[10:04:16] System flag: Telemetry missing. Policy eBPF_HEARTBEAT breached."
        ],
        lastUpdated: "2026-06-27T14:10:00Z"
    },
    "gov-003": {
        id: "gov-003",
        title: "HIPAA Key Rotation Delay",
        client_id: "client-004",
        client_name: "Federal Treasury Division [Preview Client]",
        project_id: "proj-004",
        project_name: "Federal Treasury Multi-Enclave Ledger",
        nodeId: "MED-CLINIC-H12",
        standard: "HIPAA",
        severity: "Medium",
        status: "Flagged",
        owner: "Evelyn Carter",
        due_date: "2026-07-05",
        description: "Automated cryptographic handshake postponed due to cluster lock. Needs manual administrative rollover trigger.",
        hash: "0xDE8911C400AA38B",
        logs: [
            "[08:00:00] Triggering 30-day key rotation handshake on MED-CLINIC-H12...",
            "[08:00:02] Rotation aborted: Enclave memory locked by surgical run.",
            "[08:00:03] HANDSHAKE DELAYED. System continues with stale key-seal.",
            "[08:00:04] Policy KEY_ROT_AGE breached. Alert logged."
        ],
        lastUpdated: "2026-06-27T09:30:00Z"
    },
    "gov-004": {
        id: "gov-004",
        title: "Memory Boundary Shift",
        client_id: "client-002",
        client_name: "Global Retail Enclave [Preview Client]",
        project_id: "proj-002",
        project_name: "Global Retail Real-Time Audit Ring",
        nodeId: "RETAIL-CORE-A1",
        standard: "SOC2 Type II",
        severity: "Critical",
        status: "Suppressed",
        owner: "Alexander Mercer",
        due_date: "2026-06-30",
        description: "Sovereign model thread requested high-clearance cache inspect block. Denied by hardware gate.",
        hash: "0x99AA18CCBFF002E",
        logs: [
            "[14:22:10] Model agent requested access to host shared L3 cache block...",
            "[14:22:11] SECURE ENCLAVE DENIED: Memory address space outside assigned page registry.",
            "[14:22:12] Sandboxed memory boundary defended successfully.",
            "[14:22:13] Policy SEGREGATION_OF_DUTIES logged warning."
        ],
        lastUpdated: "2026-06-27T14:10:00Z"
    }
};
// Initialize globally to persist edits in memory across hot-reloads
if (!global._apiMockGovernance) {
    global._apiMockGovernance = { ...exports.DEFAULT_API_MOCK_GOVERNANCE };
}
exports.API_MOCK_GOVERNANCE = global._apiMockGovernance;
function getNextGovernanceId() {
    const items = Object.values(exports.API_MOCK_GOVERNANCE);
    const ids = items
        .map(g => {
        const match = g.id.match(/^gov-(\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
    })
        .filter(id => id > 0);
    const maxId = ids.length > 0 ? Math.max(...ids) : 4;
    return `gov-${String(maxId + 1).padStart(3, "0")}`;
}
exports.DEFAULT_API_MOCK_DOCUMENTS = {
    "doc-801": {
        id: "DOC-801",
        title: "Sovereign Core Architectural Blueprint",
        fileSize: "12.4 MB",
        type: "PDF",
        document_type: "PDF",
        sha256: "0xAB9811C82FFD201A99E8F3C721A0C5E89812A",
        client_id: "client-001",
        client_name: "Apex Sovereign Group [Preview Client]",
        projectId: "proj-001",
        project_id: "proj-001",
        status: "Verified",
        owner: "Dr. Sarah Vance",
        version: "v2.4.1",
        lastUpdated: "2026-06-27T15:20:00Z",
        description: "Deep-level system-wide architectural layout mapping high-throughput isolated core loop with secure localized kernel telemetry and dual-layer TLS 1.3 socket.",
        visibility: "LEVEL_IV (Restricted)",
        governanceChecks: [
            { label: "Hardware Cryptographic Enclave Key Binding", checked: true, framework: "ISO-27001 Sec A.12" },
            { label: "Zero-Trust TLS 1.3 Handshake Protocol Verification", checked: true, framework: "SOC2 CC6.3" },
            { label: "Kernel-Level eBPF Event Stream Telemetry", checked: true, framework: "NIST SP 800-53" },
            { label: "Continuous Airgapped Workspace Isolation Check", checked: true, framework: "FIPS-140-3" }
        ]
    },
    "doc-802": {
        id: "DOC-802",
        title: "SOC2 Compliance Enclave Certificate",
        fileSize: "4.8 MB",
        type: "PDF",
        document_type: "PDF",
        sha256: "0xFF410D390E8F91B02AA6E8F3C2C77215446C1",
        client_id: "client-002",
        client_name: "Global Retail Enclave [Preview Client]",
        projectId: "proj-002",
        project_id: "proj-002",
        status: "Verified",
        owner: "Alexander Mercer",
        version: "v1.1.0",
        lastUpdated: "2026-06-27T14:10:00Z",
        description: "Verified SOC2 trust services criteria certification covering security, availability, and processing integrity inside target cloud sandboxes.",
        visibility: "LEVEL_I (Client View)",
        governanceChecks: [
            { label: "Third-Party Attestation Key Signing", checked: true, framework: "AICPA TSC 2017" },
            { label: "Continuous Monitoring & Event Stream Audit", checked: true, framework: "SOC2 CC7.2" },
            { label: "Threat and Vulnerability Scan Verification", checked: true, framework: "ISO-27001" }
        ]
    },
    "doc-803": {
        id: "DOC-803",
        title: "GFF AI Runtime Governance Ruleset",
        fileSize: "1.2 MB",
        type: "JSON",
        document_type: "JSON",
        sha256: "0x01DE8A88FF4E201B7FF911A3E2298F390D88B",
        client_id: "client-003",
        client_name: "Sovereign Logistics Unit [Preview Client]",
        projectId: "proj-003",
        project_id: "proj-003",
        status: "Under Review",
        owner: "Marcus Vance",
        version: "v3.0.2",
        lastUpdated: "2026-06-26T18:05:00Z",
        description: "Structured policy ruleset defining sensory bounds, alignment tolerances, and real-time model override guardrails applied to agent networks.",
        visibility: "LEVEL_III (Internal Use)",
        governanceChecks: [
            { label: "Static Model Behavioral Rules Match", checked: true, framework: "NIST SP 800" },
            { label: "Dynamic Runtime Guardrail Policy Validation", checked: false, framework: "EU AI Act" },
            { label: "Emergency Kill-Switch Interface Enforceability", checked: true, framework: "GFF Gov Core" }
        ]
    },
    "doc-804": {
        id: "DOC-804",
        title: "NIST Federal Treasury Integration Schema",
        fileSize: "750 KB",
        type: "YAML",
        document_type: "YAML",
        sha256: "0x99A1C4E72B7FD40A9D8E3C2C77E1546C1A4B0",
        client_id: "client-004",
        client_name: "Federal Treasury Division [Preview Client]",
        projectId: "proj-004",
        project_id: "proj-004",
        status: "Verified",
        owner: "Evelyn Carter",
        version: "v1.0.5",
        lastUpdated: "2026-06-27T09:30:00Z",
        description: "NIST-compliant hardware enclave schema isolating cryptographic treasury signatures and financial auditing models from general compute networks.",
        visibility: "LEVEL_I (Client View)",
        governanceChecks: [
            { label: "FIPS 140-3 Cryptographic Module Verification", checked: true, framework: "FIPS-140-3" },
            { label: "Hardware-enforced Security Boundary Isolation", checked: true, framework: "NIST SP 800" },
            { label: "Dual-Custodian Sign-off Enforcement Logic", checked: true, framework: "Treasury SEC" }
        ]
    }
};
if (!global._apiMockDocuments) {
    global._apiMockDocuments = { ...exports.DEFAULT_API_MOCK_DOCUMENTS };
}
exports.API_MOCK_DOCUMENTS = global._apiMockDocuments;
function getNextDocumentId() {
    const ids = Object.keys(exports.API_MOCK_DOCUMENTS).map(id => {
        const match = id.match(/doc-(\d+)/i);
        return match ? parseInt(match[1], 10) : 800;
    });
    const max = Math.max(800, ...ids);
    return `DOC-${max + 1}`;
}
exports.DEFAULT_API_MOCK_SUPPORT_TICKETS = {
    "t-882": {
        id: "T-882",
        subject: "London core node replication delay above SLA threshold",
        client_id: "client-001",
        client_name: "Apex Sovereign Group [Preview Client]",
        priority: "P1",
        category: "Infrastructure",
        status: "INVESTIGATING",
        assignedAgent: "Dr. Sarah Vance",
        linkedProjectId: "proj-001",
        linkedDocId: "DOC-801",
        slaSeconds: 862,
        description: "High-throughput isolated core loop with secure localized kernel telemetry in the London node cluster is showing a replication latency of 145ms, which exceeds the 50ms SLA maximum limit.",
        createdDate: "2026-06-27T14:30:00Z",
        wireFeed: [
            { id: "w1", sender: "client", senderName: "Apex Sovereign Core Dev", text: "We are seeing alerts on our London nodes. Replication delay spiked to 145ms.", timestamp: "14:30" },
            { id: "w2", sender: "system", senderName: "SLA MONITOR", text: "Warning: SLA response threshold exceeded 50ms on Node LON-01.", timestamp: "14:31" },
            { id: "w3", sender: "agent", senderName: "Dr. Sarah Vance", text: "I have established a secure dual-layer TLS handshake. Analyzing eBPF events stream.", timestamp: "14:35" }
        ]
    },
    "t-881": {
        id: "T-881",
        subject: "Request for specialized auto-scaling GPU limits",
        client_id: "client-002",
        client_name: "Global Retail Enclave [Preview Client]",
        priority: "P2",
        category: "Enclave Security",
        status: "OPEN",
        assignedAgent: "Alexander Mercer",
        linkedProjectId: "proj-002",
        linkedDocId: "None",
        slaSeconds: 11460,
        description: "Client requests temporary override of AWS Nitro Enclave thermal boundary and memory bounds to allocate additional sparse GPU clusters during end-of-quarter auditing.",
        createdDate: "2026-06-27T11:00:00Z",
        wireFeed: [
            { id: "w1", sender: "client", senderName: "Global Retail SecOps", text: "We are running a massive continuous model alignment sandbox simulation.", timestamp: "11:00" },
            { id: "w2", sender: "system", senderName: "GATEWAY", text: "Request logged under secure sandbox override protocols.", timestamp: "11:02" }
        ]
    },
    "t-880": {
        id: "T-880",
        subject: "Cryptographic verification failure on Ledger Node 4",
        client_id: "client-004",
        client_name: "Federal Treasury Division [Preview Client]",
        priority: "P1",
        category: "Compliance Audit",
        status: "OPEN",
        assignedAgent: "Unassigned",
        linkedProjectId: "None",
        linkedDocId: "DOC-802",
        slaSeconds: 345,
        description: "Enclave telemetry reported a dual-layer TLS 1.3 socket handshake failure on node GOV-SYSTEM-G2. Continuous compliance auto-scan is currently blocking active consensus blocks.",
        createdDate: "2026-06-27T15:22:00Z",
        wireFeed: [
            { id: "w1", sender: "system", senderName: "SECURE KERNEL", text: "CRITICAL: SHA-256 verification failed on node GOV-SYSTEM-G2. Isolation triggered.", timestamp: "15:22" }
        ]
    }
};
if (!global._apiMockSupportTickets) {
    global._apiMockSupportTickets = { ...exports.DEFAULT_API_MOCK_SUPPORT_TICKETS };
}
exports.API_MOCK_SUPPORT_TICKETS = global._apiMockSupportTickets;
exports.DEFAULT_API_MOCK_CLIENTS = {
    "client-001": {
        id: "client-001",
        name: "Apex Sovereign Group [Preview Client]",
        domain: "apex-sovereign.gff.ai",
        status: "active",
        tier: "Sovereign",
        createdAt: "2026-01-15T08:30:00Z",
        region: "EU-West (Isolated)",
        complianceLevel: "ISO-27001 Fully Certified",
        contactName: "Alexander Mercer",
        contactEmail: "a.mercer@apex-sovereign.gff.ai",
        industry: "Cybersecurity & Defense",
        healthStatus: "Healthy",
        billingStatus: "Paid",
        accountOwner: "Dr. Sarah Vance"
    },
    "client-002": {
        id: "client-002",
        name: "Global Retail Enclave [Preview Client]",
        domain: "global-retail.gff.ai",
        status: "active",
        tier: "Enterprise",
        createdAt: "2026-02-10T14:15:00Z",
        region: "US-East (Dedicated)",
        complianceLevel: "SOC2 Type II Assured",
        contactName: "Evelyn Carter",
        contactEmail: "e.carter@global-retail.gff.ai",
        industry: "E-Commerce & Retail",
        healthStatus: "Warning",
        billingStatus: "Overdue",
        accountOwner: "Alexander Mercer"
    },
    "client-003": {
        id: "client-003",
        name: "Sovereign Logistics Unit [Preview Client]",
        domain: "sovereign-logistics.gff.ai",
        status: "pending",
        tier: "Standard",
        createdAt: "2026-06-01T09:00:00Z",
        region: "APAC-South (Shared)",
        complianceLevel: "NIST AI RMF Pending",
        contactName: "Marcus Vance",
        contactEmail: "m.vance@sovereign-logistics.gff.ai",
        industry: "Supply Chain & Logistics",
        healthStatus: "Offline",
        billingStatus: "Unpaid",
        accountOwner: "Sarah Jenkins"
    },
    "client-004": {
        id: "client-004",
        name: "Federal Treasury Division [Preview Client]",
        domain: "fed-treasury.gff.ai",
        status: "active",
        tier: "Sovereign",
        createdAt: "2025-11-20T11:45:00Z",
        region: "US-GovWest (Airgapped)",
        complianceLevel: "NIST SP 800-53 High",
        contactName: "Sarah Jenkins",
        contactEmail: "s.jenkins@fed-treasury.gff.ai",
        industry: "FinTech & Treasury",
        healthStatus: "Healthy",
        billingStatus: "Paid",
        accountOwner: "Marcus Vance"
    }
};
if (!global._apiMockClients) {
    global._apiMockClients = { ...exports.DEFAULT_API_MOCK_CLIENTS };
}
exports.API_MOCK_CLIENTS = global._apiMockClients;
function getNextClientId() {
    const clients = Object.values(exports.API_MOCK_CLIENTS);
    const ids = clients
        .map(c => {
        const match = c.id.match(/^client-(\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
    })
        .filter(id => id > 0);
    const maxId = ids.length > 0 ? Math.max(...ids) : 4;
    return `client-${String(maxId + 1).padStart(3, "0")}`;
}
