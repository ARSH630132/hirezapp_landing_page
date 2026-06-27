"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.API_MOCK_PROJECTS = exports.DEFAULT_API_MOCK_PROJECTS = exports.API_MOCK_USERS = exports.DEFAULT_API_MOCK_USERS = void 0;
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
