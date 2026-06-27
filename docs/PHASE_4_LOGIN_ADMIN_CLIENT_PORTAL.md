# GFF AI Platform: Phase 4 Secure Login, Client Portal & Admin Oversight Console

This document establishes the strategic, enterprise-grade architecture, implementation details, and future backend contracts for **Phase 4** of the GFF AI Platform. 

In Phase 4, GFF AI delivers an advanced, premium, **high-fidelity presentation interface** representing the ultimate Sovereign Operating System for enterprise AI governance. This frontend is carefully designed with a zero-trust, decoupled aesthetic, ensuring that client-facing boards and internal GFF administrators can configure, simulate, and audit multi-agent system states with total security and confidence.

---

## 1. Executive Narrative & Visual Metaphor

### 1.1. The "Air-Gapped Cockpit"
To provide boards of directors and enterprise security teams with absolute risk containment, the GFF AI Portal operates on an architecture metaphor of the **Air-Gapped Cockpit**. Just as a sophisticated flight simulator provides full-fidelity interactive controls, telemetry streams, and compliance feedback without endangering actual aircraft, the GFF AI Frontend presents a secure operational layer completely decoupled from live production model executors and database kernels.

### 1.2. Key Visual Metaphors Built Into Phase 4
*   **The Zero-Trust Handshake**: Visual block diagrams showing AES-256 session token pathways keeping client model parameters invisible to presentation networks.
*   **Decoupled Model Enclaves**: Isolated hypervisor-reinforced boxes representing hardware-level execution tracking protected by hardware seed security boundaries.
*   **The Living Terminal Feed**: Live, simulated eBPF-level diagnostic event streams flowing within the login page and route-guard modal, reinforcing the premium, high-tech engineering nature of GFF AI's systems.
*   **Role Negotiation Selector**: A highly custom bypass console allowing engineers to simulate and toggle between 7 distinct enterprise roles in real time, inspecting permission-based modules dynamically.

---

## 2. Implemented Routes & Navigation Map

Phase 4 includes a fully realized, responsive, and secure routing matrix built using Next.js App Router. These public and protected paths are structured into distinct areas of operational clearance:

### 2.1. Authentication Routes (Public Preview / Entrypoints)
*   `/login` — Central unified login terminal, defaulting to Client Portal entry.
*   `/portal/login` — Explicit Client Portal gateway.
*   `/admin/login` — Explicit GFF Administration gateway, defaulting to GFF Administrator credentials.

### 2.2. Client Portal Routes (`/portal/*`)
The Client Portal is tailored for executive control, tactical project management, and cost-governance audits.
*   `/portal/dashboard` — Unified Executive Control & Enclave Telemetry overview.
*   `/portal/projects` — Milestone and sandbox pipeline overview.
*   `/portal/projects/[id]` — Deep-dive tracker for an individual multi-agent project pipeline.
*   `/portal/ai-operations` — Configurator for active agent profiles, model configurations, and memory parameters.
*   `/portal/ai-operations/[id]` — Deep-dive sandbox editor for a specific cognitive pipeline.
*   `/portal/control-center` — Sovereign control hub for hardware deployment and orchestrator clusters.
*   `/portal/governance` — Live policy tracking and ISO compliance auditing.
*   `/portal/documents` — Secure Sovereign legal vault and document index.
*   `/portal/documents/[id]` — Inline document audit and validation engine.
*   `/portal/billing` — Chronological "Computational Epoch" cost ledger and summaries.
*   `/portal/billing/invoices` — List of current and past cryptographically signed invoices.
*   `/portal/billing/invoices/[id]` — PDF-like interactive view of invoice ledgers.
*   `/portal/analytics` — Dynamic resource, token, and memory lane analytics grids.
*   `/portal/support` — SLA ticket pipeline and live wire connection.
*   `/portal/support/[id]` — SLA wire communication log with active system engineers.
*   `/portal/settings` — Client workspace profiles, API keys, and notification bounds.
*   `/portal/activity` — Session tracking logs and cryptographic handshakes.

### 2.3. Admin Oversight Console Routes (`/admin/*`)
The Admin Portal is tailored for GFF staff to manage client accounts, monitor global compute load, and handle system governance.
*   `/admin/dashboard` — Oversight Deck with Global Telemetry, Enclave Status, and active incidents.
*   `/admin/clients` — Master directory of all enterprise client accounts.
*   `/admin/clients/[id]` — Dynamic client profile, active contracts, and allocated computational resources.
*   `/admin/projects` — Global sandbox scheduler and execution milestone pipelines.
*   `/admin/projects/[id]` — Master pipeline control room.
*   `/admin/ai-operations` — Global model deployment, latency logs, and prompt-injection safety controls.
*   `/admin/governance` — Master ISO compliance rules manager and guardrail template builder.
*   `/admin/documents` — Master contract vault and blueprint compiler.
*   `/admin/billing` — Accounts receivable ledger, contract terms manager, and computational SLA auditing.
*   `/admin/analytics` — Global network traffic, queue latency, and multi-region cluster efficiency.
*   `/admin/support` — Master ticket dispatcher, operator assignment, and SLA countdowns.
*   `/admin/users` — GFF staff roster and IAM permissions management.
*   `/admin/settings` — Global configuration, hardware regions, and emergency system boundaries.
*   `/admin/activity` — Audit stream tracking all administrative overrides and credential rotations.

---

## 3. High-Fidelity Local Preview Auth Behavior

To fulfill the "frontend-only placeholder" guardrails while delivering a deeply interactive premium experience, Phase 4 implements an innovative client-side authentication engine.

```
+-----------------------------------------------------------------------------------+
|                            LOCAL PREVIEW AUTH ENGINE                              |
|                                                                                   |
|  1. Select Role Preset   -->   2. Auto-hydrate Mock Credentials                   |
|  (Client Admin, etc.)          (Email, Cryptographic Salting logs)                |
|                                                                                   |
|  3. Trigger Handshake    -->   4. Simulate TLS Verification                       |
|  (Password or OTP Auth)        (eBPF Terminal telemetry output animation)         |
|                                                                                   |
|  5. Store Session Key    -->   6. Redirect via Route Guard                        |
|  (LocalStorage Cache)          (Enforces strict role permissions dynamically)     |
+-----------------------------------------------------------------------------------+
```

### 3.1. Credentials vs. One-Time Password (OTP) Dual-Mode Login
The `/login` screen offers users a seamless mechanism to explore enterprise access models:
1.  **Credentials Mode**: Classic password input with built-in telemetry simulation. As the user types their password, simulated SHA-512 salting processes stream to the active console terminal.
2.  **MFA OTP Mode**: Simulates a rotating 6-digit One-Time Password. To mimic state-of-the-art enterprise multi-factor authentication, an automatic 30-second countdown cycle triggers the generation of new temporary tokens with simulated cryptographic rotation logs.

### 3.2. Animated Telemetry Terminal Console
A live scrolling diagnostics feed is built directly into the login card. It streams low-noise, technical operation logs in real time, mirroring hardware-level eBPF system calls:
*   `[INIT] Handshake request received from node terminal.`
*   `[IDENTITY] Resolved profile context: client_admin`
*   `[SSL/TLS] Session handshake initiated via SHA-256 cipher.`
*   `[CRYPT] Salted passphrase vector: SHA-512_SALT_F38C...`
*   `[SANDBOX] Memory enclave isolated. Sandbox state: READY.`

---

## 4. Federated Identity & Access Management (IAM) Roles

Phase 4 defines 7 discrete user identities across Client and Administrative boundaries, mapping directly to enterprise clearance levels.

### 4.1. Enterprise IAM Matrix

| Role Key | Name | Clearance Level | Scope | Primary Responsibility |
| :--- | :--- | :--- | :--- | :--- |
| **`gff_admin`** | GFF Sovereign Superuser | `L-5 SYSTEM` | Global Admin & Portal | Total decentralized system override. Unfettered traversal of all client and admin enclaves. |
| **`gff_operator`** | GFF Systems Engineer | `L-4 OPERATIONAL` | Admin Console | Monitors physical infrastructure, active cluster health, queue latencies, and agent memory lanes. |
| **`finance_admin`**| GFF Financial Director | `L-3 FINANCE` | Admin & Client Billing | Oversees accounts receivable, billing tiers, epoch invoices, and SLA contract parameters. |
| **`support_agent`**| GFF Support Liaison | `L-3 SUPPORT` | Admin & Client Support | Dispatches and triage SLA tickets, maintains support channels, audits system logs. |
| **`client_admin`** | Client Administrator | `L-3 WORKSPACE` | Client Portal | Full control of client-owned sandboxes, project scopes, billing methods, and employee IAM. |
| **`client_member`**| Client Workspace Operator| `L-2 WORKSPACE` | Client Portal | Standard developer/user interface to deploy models, monitor telemetry, and view documents. |
| **`viewer`** | Global Compliance Auditor| `L-1 AUDIT` | Read-Only Views | Independent auditor node. Verifies compliance, ISO rule ledgers, and read-only activity logs. |

---

## 5. Security Route Guard Preview & Role Negotiation

Protected paths are enclosed inside a client-side layout element (`PreviewRouteGuard.tsx`) which validates the cached session state from LocalStorage against the path's required permissions.

### 5.1. Dynamic Clearance Denial Overlay
When a user attempts to navigate to a section that exceeds their role's clearance level (e.g., a standard `client_member` attempting to view the Admin `/admin` suite, or a read-only `viewer` attempting to change `/portal/settings`), the route guard intercepts the render. Instead of a blank page or a raw 403 error, a premium **Clearance Violation Warning** is rendered inline:
*   **Security Alert Metrics**: Displays the user's current identity, clearance level, and the requested boundary.
*   **Interactive Counter-Sign**: Simulates a secure gateway query showing live network packets blocking traversal.
*   **Interactive Role Switcher**: A dropdown allowing users to instantly select a role with sufficient clearance, showcasing the route guard's live reactivity.
*   **Awaiting Override Countdown**: A 5-second animated gateway countdown that gracefully releases the lockout if an authorized override is simulated.

### 5.2. Granular Route-Access Logic
The authorization rules are codified inside `lib/preview-auth.ts`:

```typescript
// Client Portal clearance rules
export function canAccessPortalSection(role: PreviewRole, sectionId: string): boolean {
  if (role === "gff_admin") return true;
  if (role === "viewer") {
    return ["dashboard", "analytics", "governance", "activity"].includes(sectionId);
  }
  if (role === "client_member") {
    return !["billing", "settings"].includes(sectionId);
  }
  if (role === "client_admin") return true;
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

// Admin Oversight Console clearance rules
export function canAccessAdminSection(role: PreviewRole, sectionId: string): boolean {
  if (role === "gff_admin") return true;
  if (role === "gff_operator") {
    return !["billing", "settings", "users"].includes(sectionId);
  }
  if (role === "finance_admin") {
    return ["dashboard", "clients", "billing", "analytics", "activity", "settings"].includes(sectionId);
  }
  if (role === "support_agent") {
    return ["dashboard", "clients", "support", "activity", "users"].includes(sectionId);
  }
  if (role === "viewer") {
    return ["dashboard", "clients", "projects", "analytics", "governance", "activity"].includes(sectionId);
  }
  return false; // Clients cannot access Admin sections at all
}
```

---

## 6. Detailed Module Implementations

### 6.1. Client Portal Module Features (`/portal/*`)
*   **Executive Control Dashboard**: Renders a comprehensive, premium grid of live eBPF-stream telemetry charts, active cluster status gauges, and hardware isolation alerts. Features real-time state monitoring and inline visual alerts.
*   **Sandbox Projects Pipeline**: Lists current active multi-agent sandbox developments. Clicking a project details card opens a narrative timeline charting progress from design to evaluation and deployment phases.
*   **Sovereign Legal & Document Vault**: A secured filing center displaying active client contracts, architecture blueprints, and service agreements. Integrates inline SHA-256 and MD5 integrity checkers for enterprise auditing.
*   **Computational Billing & Epoch Cost Ledger**: A comprehensive usage auditing suite logging resource allocation. Documents token usage, compute minutes, and network load on an epoch-by-epoch timeline with exportable audit logs.
*   **Model Configurator & Prompt Sandbox**: Allows authorized operators to toggle prompt parameters, edit short-term long-term memory lanes, and adjust security thresholds under isolated conditions.

### 6.2. Admin Oversight Portal Module Features (`/admin/*`)
*   **Global Oversight Deck**: Displays high-level administrative intelligence, multi-region cluster status, core processing loads, active ticketing streams, and live security events.
*   **Master Clients Directory**: A complete registry of client organizations under management. Admins can audit each client's SLA compliance matrices and allocate/revoke hardware nodes dynamically.
*   **Infrastructure Model Deployer**: Oversees regional orchestrator loads and schedules memory pruning routines.
*   **Global IAM & Users Hub**: Enables direct oversight over client employees and internal GFF staff clearance level assignments.

---

## 7. Local Mock Data Structures

All dashboards, tables, and telemetry parameters consume structured, static mock structures modeled to mimic real-world SQL schemas and JSON payloads.

### 7.1. Node Cluster Database Model (`ClusterNode`)
Represents the dedicated hardware nodes allocated to running models.
```typescript
export interface ClusterNode {
  id: string;
  nodeId: string;       // e.g., "RETAIL-CORE-A1"
  client: string;       // e.g., "Sovereign Retail Group"
  status: "active" | "warning" | "stable" | "decoupled";
  load: string;         // e.g., "42.1%"
  uptime: string;       // e.g., "99.998%"
}
```

### 7.2. Invoice Ledger Model (`Invoice`)
Used to render SLA cost auditing grids.
```typescript
export interface Invoice {
  id: string;           // e.g., "GFF-INV-2026-004"
  date: string;
  dueDate: string;
  amount: string;
  status: "Settled" | "Overdue" | "Pending Handshake";
  computationalEpochs: number;
  tokenConsumption: string;
  pdfHash: string;      // Simulated SHA-256 validation checksum
}
```

### 7.3. Incident SLA Ticket Model (`SupportTicket`)
Models mission-critical operator-support pipelines.
```typescript
export interface SupportTicket {
  id: string;           // e.g., "SLA-9102"
  subject: string;
  severity: "CRITICAL (L1)" | "HIGH (L2)" | "MEDIUM (L3)";
  status: "Resolved" | "Investigating" | "Awaiting Handshake";
  updatedAt: string;
  assignedOperator: string;
}
```

---

## 8. Frontend-Only Scope & Limitations

As configured by Phase 4 architectural guardrails, the portal and admin interfaces are **strictly client-side representations**. 

### 8.1. State Containment
*   **Local Storage Volatility**: All state changes (modified agent prompts, newly simulated support tickets, model toggles, profile adjustments) are stored either in localized React state or synced temporarily to `localStorage`. Refreshing the browser window resets all database metrics to their baseline template configurations.
*   **Mock Verification Gateway**: No actual network connections are initiated to backend databases, server hypervisors, or identity engines. Authentication succeeds automatically on valid role-selection templates.
*   **Abstract Identity Delivery**: Email OTP inputs bypass actual verification. Clicking the "Send OTP Code" button triggers local terminal animations listing simulated SMTP dispatch routes, rather than delivering a real code.

---

## 9. Target Phase 5 Backend Specifications & Schema Contracts

To transition the GFF AI sovereign operating system from frontend presentation templates to an production-ready SaaS ecosystem, the following specifications must be implemented in the future backend phase.

### 9.1. Future FastAPI Architecture
The target Python FastAPI application will run containerized (Docker/Kubernetes) under a secure, TLS 1.3 reverse-proxy layer. It will utilize **Pydantic v2** for robust static type verification and runtime schema enforcement.

```
                  +-----------------------------------+
                  |        FastAPI Gate Controller    |
                  +-----------------+-----------------+
                                    |
            +-----------------------+-----------------------+
            |                                               |
            v                                               v
+-----------------------+                       +-----------------------+
|  OAuth2 JWT Router    |                       | eBPF Telemetry Engine |
| - bcrypt/argon2 hashing|                      | - Live WebSockets     |
| - OAuth2 Bearer Tokens|                       | - Server-Sent Events  |
+-----------------------+                       +-----------------------+
```

### 9.2. Recommended Database Schema (PostgreSQL / pgvector)
A multi-tenant database structure isolating client data while allowing global administrative auditing is required.

#### `users` Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NULL, -- Null if passwordless-only
    mfa_secret VARCHAR(128) NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### `roles` Table & `user_roles` Relation
```sql
CREATE TYPE clearance_level AS ENUM ('L1', 'L2', 'L3', 'L4', 'L5');
CREATE TYPE preview_role_enum AS ENUM (
    'client_admin', 'client_member', 'gff_admin', 
    'gff_operator', 'finance_admin', 'support_agent', 'viewer'
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name preview_role_enum UNIQUE NOT NULL,
    clearance clearance_level NOT NULL,
    description TEXT
);

CREATE TABLE user_roles (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    client_id UUID NULL, -- Null for global GFF admin staff
    PRIMARY KEY (user_id, role_id)
);
```

#### `client_organizations` Table
```sql
CREATE TABLE client_organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    contract_start TIMESTAMP WITH TIME ZONE,
    contract_end TIMESTAMP WITH TIME ZONE,
    billing_tier VARCHAR(100) DEFAULT 'premium_enterprise'
);
```

#### `projects` Table
```sql
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES client_organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'design',
    completion_percentage NUMERIC(5, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### `telemetry_stream_logs` (TimescaleDB / Partitioned Table)
Optimized for high-throughput diagnostic event streams.
```sql
CREATE TABLE telemetry_stream_logs (
    id BIGSERIAL,
    node_id VARCHAR(100) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    level VARCHAR(20) DEFAULT 'INFO',
    module_context VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    sha_hash VARCHAR(64) NOT NULL -- Cryptographic integrity validation of logs
) PARTITION BY RANGE (timestamp);
```

### 9.3. Future Object Storage Specifications (AWS S3)
*   **Enveloped Encryption (AES-256-GCM)**: All corporate agreements, dynamic proposal PDFs, and blueprint maps generated by client workspaces are uploaded using server-side KMS encryption keys.
*   **Sovereign S3 Buckets**: Compliant with Singapore PDPA standards, file buckets are restricted to designated regions (e.g., `ap-southeast-1` or sovereign local private cloud endpoints).
*   **Presigned URLs**: To prevent accidental exposure of confidential legal assets, direct object access is disabled. Files are delivered exclusively via transient 5-minute presigned URLs with strict token tracking.

### 9.4. Real Email & OTP Dispatch Mechanics
To replace Phase 4's mock OTP behavior with a production passwordless engine:
1.  **Transport Gateway**: Integrate **AWS SES** or **SendGrid SMTP** API.
2.  **Transient Storage (Redis)**: Generated OTP values are cryptographically hashed and stored in Redis with a 180-second time-to-live (TTL) parameter.
3.  **Domain Restrictors**: To enforce the GFF AI corporate posture, the backend will validate incoming signup request domains against authorized enterprise whitelists, throwing `403 Forbidden` errors for free personal providers (Gmail, Outlook, Yahoo, etc.).

### 9.5. Future Billing & Enterprise Payment Architecture
*   **Stripe / Chargebee Integration**: Map computational "Epochs" directly to automated usage-based subscription items in Stripe.
*   **Cryptographic Invoice Signatures**: Upon invoice finalization, the backend will compute a SHA-256 hash representing the ledger data, signing it with GFF AI's institutional private HSM key. The resulting hash and signature are embedded in the PDF and stored on a ledger table for client-side auditing, guaranteeing zero tampering.

---

## 10. Phase 5 Backend Build Order Recommendations

To ensure a structured, risk-contained migration from the current high-fidelity mock architecture to a fully connected enterprise SaaS backend, the following development sprint order is highly recommended:

```
[SPRINT 1: Core Identity (IAM) & JWT]
       |
       v
[SPRINT 2: Multi-Tenant Database Structures]
       |
       v
[SPRINT 3: Telemetry Streams & WebSocket Endpoints]
       |
       v
[SPRINT 4: Client Sandbox Management APIs]
       |
       v
[SPRINT 5: Secure S3 File Store & SMTP OTP Integration]
       |
       v
[SPRINT 6: Enterprise Billing & SLA Ledger Audits]
```

### Sprint 1: Core Identity (IAM) & JWT Authorization Middleware
*   Implement FastAPI base routing with CORS policy rules.
*   Develop user registration, secure session tokens, and role-enforcement middlewares utilizing JSON Web Tokens (JWT).
*   *Verification Matrix*: Ensure the Next.js `PreviewRouteGuard` can cleanly parse backend JWT claims to mirror the existing 7 roles exactly.

### Sprint 2: Multi-Tenant Postgres Schema Implementation
*   Provision a high-availability Postgres cluster.
*   Apply tables for users, clients, organizations, and project pipelines.
*   Expose standard REST CRUD endpoints for `/api/clients`, `/api/projects`, and `/api/users`.

### Sprint 3: Live Telemetry Streams & WebSockets
*   Set up FastAPI WebSocket router paths to serve real-time hardware telemetry and audit messages.
*   Incorporate server loops to pipe simulated server load and uptime logs into active sockets.
*   *Verification Matrix*: Replace the static timer loops in `/portal/dashboard` with direct event listeners reading from active WS sockets.

### Sprint 4: Sandbox Workspace & Model Enclave API controllers
*   Build control parameters for client workspaces, enabling users to edit agent configurations, save custom prompts, and toggle active LLM model engines.
*   Incorporate database persistence to store prompt variations, preventing reset on browser reloads.

### Sprint 5: S3 Storage & SMTP Email Gates
*   Establish AWS SDK (boto3) configurations with zero access credentials committed to source control (utilizing AWS IAM Role profiles or container environment injectors).
*   Construct SMTP email delivery handlers using secure SMTP / AWS SES.
*   Enable real passwordless verification and file downloads on `/portal/documents`.

### Sprint 6: billing, Stripe webhooks, and Cryptographic Signatures
*   Develop usage-tracking cron workers that aggregate computational hours.
*   Set up Stripe subscription hooks to synchronize invoice generation.
*   Build the PDF ledger builder with cryptographic signatures, satisfying corporate compliance guidelines.





