# GFF AI Platform: Phase 3 Interactive Tools & Phase 4 FastAPI Backend Contracts

This document establishes the strategic architectural interface between the high-fidelity client-side interactive tools built in **Phase 3** and the future enterprise-grade, high-performance **FastAPI backend (Phase 4)**. 

---

## 1. Executive Architecture Overview

In Phase 3, GFF AI delivers an **unmatched, premium, frontend-only interactive suite** spanning the *Build Hub* workspace. These tools (Blueprint Builder, Readiness Assessment, ROI Calculator, RFP/Proposal Builder, Client Sandbox, Foundry Studio workflow canvas, and Agent Marketplace) run fully on client-side state machine architectures to maximize fluid responsiveness, respect data privacy boundaries, and ensure flawless offline capability during presentation.

In Phase 4, these interactive tools will transition from local state management to a robust, containerized Python **FastAPI backend**. This migration will enable secure multi-user collaboration, real-time agent execution orchestration, persistent database storage, and integrations with enterprise identity providers.

### 1.1. Hybrid Architecture Topology

```
+---------------------------------------------------------------------------------+
|                               CLIENT BROWSER (Next.js)                          |
|                                                                                 |
|  +-------------------------+   +------------------------+   +----------------+  |
|  |  Build Hub Workspace    |   |  Interactive Tools UI  |   | Local Storage  |  |
|  |  (React/Next.js/Framer) |   |  (React Hook Form/Zod) |   | & Session Cache|  |
|  +------------+------------+   +-----------+------------+   +--------+-------+  |
|               |                            |                         |          |
+---------------|----------------------------|-------------------------|----------+
                | SECURE TLS (HTTPS)         |                         | Sync
                |                            |                         | (Future Phase 4)
                v                            v                         v
+--------------------------------------------+------------------------------------+
|                             FUTURE FASTAPI BACKEND SERVICES                     |
|                                                                                 |
|   +--------------------------------------------------------------------------+  |
|   |                       API Router & Gateway Controller                    |  |
|   |         - Pydantic Input Validation      - JWT/OTP Security Middleware   |  |
|   |         - SlowAPI Rate Limiter           - CORS Policy Manager           |  |
|   +----+--------------------+--------------------+--------------------+----+  |
|        |                    |                    |                    |         |
|        v                    v                    v                    v         |
|  +-----------+        +-----------+        +-----------+        +------------+  |
|  | Cache     |        | Database  |        | Object    |        | Email /    |  |
|  | (Redis)   |        | (Postgres)|        | Store     |        | OTP Engine |  |
|  | - OTPs    |        | - Users   |        | (AWS S3)  |        | (SES /     |  |
|  | - Session |        | - Proposls|        | - PDFs    |        | SendGrid)  |  |
|  | - RateLim |        | - Flows   |        | - Configs |        | - Auth     |  |
|  +-----------+        +-----------+        +-----------+        +------------+  |
+---------------------------------------------------------------------------------+
```

---

## 2. Phase 3 Interactive Tools Status

The table below catalogs what has been fully implemented inside the Next.js workspace for Phase 3, specifying where the boundary of "frontend-only simulation" lies and what operations will be handled by the FastAPI microservices in Phase 4.

| Interactive Tool | Phase 3 Frontend Capability | Future Phase 4 Backend Integration |
| :--- | :--- | :--- |
| **Blueprint Builder** | Interactive multi-step journey, dynamic architecture node rendering, PDF download simulation, client-side share link creation. | Persistent storage, real-time database generation, AI-generated custom system components, PDF generation in Python. |
| **Readiness Assessment** | Comprehensive 5-category evaluation matrix, scoring weights, remediation checklists, local results storage. | Enterprise aggregation, comparative industry benchmarking, administrative audit trails. |
| **ROI Calculator** | Real-time strategic financial formula processor (TCO, NPV, Payback, FTE reallocation) with visual charts. | High-fidelity model adjustment, customizable exportable spreadsheets, corporate database storage. |
| **Proposal Builder**| Custom RFP requirements intake, step-by-step modular timeline constructor, proposal compiler. | Large Language Model (LLM) customized RFP generation, direct client PDF render pipeline, collaborative drafting. |
| **Client Sandbox** | Interactive shell with terminal output simulation, sample developer tasks, live log visualizer. | Dockerized ephemeral execution environments, actual command execution, sandboxed Python interpreters. |
| **Foundry Studio** | Drag-and-drop multi-agent workflow DAG designer, canvas node interaction, cyclical validation checks. | DAG execution engine, Celery task broker synchronization, deployment manifest compiles. |
| **Agent Marketplace** | Filterable catalog of pre-configured enterprise agent definitions, installation toggles. | Real-time agent downloads, version control, third-party author portal uploads, licensing, secure keys. |

---

## 3. Phase 4 Target Backend System Architecture

To ensure premium execution, the FastAPI backend will utilize a robust architectural stack:

1. **FastAPI Framework (Python 3.12+)**: Leveraging high-performance `asyncio` for scalable multi-connection handling. FastAPI natively exports strict OpenAPI schemas via Redoc or Swagger.
2. **Relational Database (PostgreSQL 16+)**: Managed relational store utilizing SQLAlchemy ORM or SQLModel. Houses user credentials, enterprise workflows, generated proposals, audit histories, and compliance records.
3. **In-Memory Cache (Redis 7+)**: Used for high-speed rate-limiting, short-term OTP validation tokens, and secure JWT blacklist/session states.
4. **AWS S3 or S3-Compatible Object Storage**: Enterprise repository for archiving dynamically compiled PDF blueprints, corporate agreements, custom proposals, and downloadable sandbox snapshots. 
5. **No AWS or Cloud Credentials in Phase 3**: In compliance with security policies, all cloud, database, and SMTP services remain abstractly represented via strict, un-hydrated configuration variables.
6. **Authentication Flow**: Completely passwordless, secure, enterprise-tailored One-Time Password (OTP) validation delivered to business emails. Supports corporate domains only, utilizing an abstract communication dispatcher layer (SES, Mailgun, or SendGrid).

---

## 4. FastAPI API Endpoint Catalog

This section contains the official HTTP specifications for the target FastAPI endpoints. All endpoints assume a baseline prefix of `/api`. All JSON schemas represent strict Pydantic structures.

---

### 4.1. POST /api/blueprint/generate

**Purpose**: Persistently stores and generates an advanced strategic enterprise AI architecture blueprint based on target constraints, compliance frameworks, and infrastructure choices.

*   **HTTP Method**: `POST`
*   **Path**: `/api/blueprint/generate`
*   **Security Requirement**: Optional Session Authentication (registers draft anonymously or links to authenticated user profile).
*   **Request Payload Schema (JSON)**:
    ```json
    {
      "company_name": "Acme Global Enterprise",
      "industry": "Financial Services",
      "compliance_frameworks": ["SOC2", "HIPAA", "EU_AI_ACT"],
      "data_residency": "EU_WEST",
      "infrastructure_preference": "Sovereign_Cloud",
      "deployment_scale": "Enterprise_Wide",
      "selected_capabilities": [
        "Knowledge_Graph_Mesh",
        "Autonomous_Agent_Orchestrators",
        "Governance_Guardrails"
      ],
      "budget_tier": "Premium_Enterprise"
    }
    ```
*   **Response Payload (`[ILLUSTRATIVE MOCK]`)**:
    ```json
    {
      "blueprint_id": "blu_908f7e21-3a0c-4991-88b1-38f7e1b99c72",
      "created_at": "2026-06-27T10:30:15Z",
      "compliance_rating": 98.4,
      "estimated_deployment_time_weeks": 12,
      "recommended_architecture_nodes": [
        {
          "id": "node-1",
          "label": "GFF AI Sovereign Edge",
          "type": "infrastructure",
          "status": "critical"
        },
        {
          "id": "node-2",
          "label": "Agent Orchestration Mesh",
          "type": "orchestrator",
          "status": "active"
        }
      ],
      "generated_narrative": "Based on financial service constraints, GFF AI prescribes a secure, sovereign-hosted multi-agent cluster backed by real-time governance guardrails.",
      "pdf_download_url": "https://assets.gff.ai/blueprints/blu_908f7e21_export.pdf"
    }
    ```
*   **Error Responses**:
    *   `400 Bad Request`: If empty inputs or incompatibilities exist in selected frameworks.
    *   `422 Unprocessable Entity`: Validation failure on Pydantic models (e.g. invalid string enum in `data_residency`).

---

### 4.2. POST /api/assessment/score

**Purpose**: Takes complex multi-dimensional AI readiness assessments from the client, calculates overall and categorical readiness scores, and maps out targeted remediation paths.

*   **HTTP Method**: `POST`
*   **Path**: `/api/assessment/score`
*   **Security Requirement**: Public / Anonymous Access with optional JWT Session linking.
*   **Request Payload Schema (JSON)**:
    ```json
    {
      "assessment_session_id": "sess_89a71b3e",
      "answers": [
        { "question_id": "data_strategy_01", "score": 4 },
        { "question_id": "governance_compliance_02", "score": 2 },
        { "question_id": "infrastructure_cloud_03", "score": 3 },
        { "question_id": "talent_readiness_04", "score": 5 },
        { "question_id": "executive_alignment_05", "score": 2 }
      ],
      "organization_size": "10000+",
      "comments": "Currently migrating core infrastructure to secure air-gapped systems."
    }
    ```
*   **Response Payload (`[ILLUSTRATIVE MOCK]`)**:
    ```json
    {
      "assessment_id": "asm_10a29b8c-5521-4f93-90be-8a7199c811fa",
      "calculated_at": "2026-06-27T10:32:00Z",
      "overall_readiness_score": 64.0,
      "readiness_tier": "Strategic Scale-Up",
      "category_scores": {
        "Data & Strategy": 80.0,
        "Governance & Compliance": 40.0,
        "Infrastructure & Cloud": 60.0,
        "Talent & Enablement": 100.0,
        "Executive Alignment": 40.0
      },
      "remediation_milestones": [
        {
          "phase": "Phase 1: Compliance Foundation",
          "action": "Deploy centralized LLM governance guardrails to address the critical 40% Compliance score.",
          "priority": "CRITICAL"
        },
        {
          "phase": "Phase 2: Strategic Executive Roadmap",
          "action": "Establish cross-functional steering committee to align on AI ROI parameters.",
          "priority": "HIGH"
        }
      ]
    }
    ```
*   **Error Responses**:
    *   `400 Bad Request`: Incomplete questionnaire answers (fewer than the required threshold).

---

### 4.3. POST /api/roi/calculate

**Purpose**: Processes custom financial variables, staffing costs, and proposed automation volumes to return complete strategic ROI projections, TCO analyses, and amortization timelines.

*   **HTTP Method**: `POST`
*   **Path**: `/api/roi/calculate`
*   **Security Requirement**: Public / Rate-Limited.
*   **Request Payload Schema (JSON)**:
    ```json
    {
      "annual_revenue": 500000000,
      "employee_count": 2500,
      "average_fte_cost": 120000,
      "current_it_maintenance_spend": 15000000,
      "estimated_agent_deployments": 50,
      "primary_impact_areas": ["Customer_Support", "Compliance_Audit", "Engineering_Velocity"],
      "implementation_horizon_years": 5
    }
    ```
*   **Response Payload (`[ILLUSTRATIVE MOCK]`)**:
    ```json
    {
      "calculation_id": "roi_21d7b8ca-889a-4122-b0cc-99ca82b1c7da",
      "financials": {
        "net_present_value": 4820000.00,
        "internal_rate_of_return": 42.5,
        "payback_period_months": 14,
        "five_year_total_savings": 12450000.00,
        "five_year_total_cost_of_ownership": 2650000.00
      },
      "projected_yearly_breakdown": [
        { "year": 1, "costs": 950000, "savings": 1200000, "net": 250000 },
        { "year": 2, "costs": 450000, "savings": 2500000, "net": 2050000 },
        { "year": 3, "costs": 450000, "savings": 2900000, "net": 2450000 },
        { "year": 4, "costs": 400000, "savings": 2900000, "net": 2500000 },
        { "year": 5, "costs": 400000, "savings": 2950000, "net": 2550000 }
      ],
      "fte_hours_reallocated_annually": 85000
    }
    ```
*   **Error Responses**:
    *   `400 Bad Request`: If impossible numbers are submitted (e.g. employee count is 0 or average cost is negative).

---

### 4.4. POST /api/contact/submit

**Purpose**: Processes incoming enterprise-tier lead submissions from the unified Contact module. Automatically sends custom alert notifications via email.

*   **HTTP Method**: `POST`
*   **Path**: `/api/contact/submit`
*   **Security Requirement**: Public / Strict Rate-Limiting.
*   **Request Payload Schema (JSON)**:
    ```json
    {
      "fullName": "Elizabeth Vance",
      "fullNameDetail": "Elizabeth Vance, VP of Strategy",
      "company": "Vance & Co Logistics",
      "companyDetail": "Vance & Co Logistics (International Carrier)",
      "businessEmail": "evance@vancelogistics.com",
      "businessEmailDetail": "evance@vancelogistics.com (Primary Office)",
      "estimated_timeline": "Immediate (Within 3 months)",
      "message": "Interested in deploying Oremesh and Foundry clusters across our operations."
    }
    ```
*   **Response Payload (`[ILLUSTRATIVE MOCK]`)**:
    ```json
    {
      "success": true,
      "submission_id": "contact_9a87cdb1-21e0-40e8-b80c-e87f21a8b9e1",
      "submitted_at": "2026-06-27T10:35:12Z",
      "message": "Thank you. An Enterprise Integration Executive will reach out within 4 business hours."
    }
    ```
*   **Error Responses**:
    *   `400 Bad Request`: Validation failure (e.g. missing fields, invalid email address format).
    *   `429 Too Many Requests`: Rate limit exceeded on contact submission IP or email address.

---

### 4.5. POST /api/proposal/generate

**Purpose**: Compiles client-defined custom requirements, timelines, budget allocations, and architectural structures to construct a complete RFP / GFF AI Engagement Proposal.

*   **HTTP Method**: `POST`
*   **Path**: `/api/proposal/generate`
*   **Security Requirement**: Authenticated Session / Valid OTP Session Token.
*   **Request Payload Schema (JSON)**:
    ```json
    {
      "rfp_id": "rfp_782ab912",
      "compliance_stipulations": ["SOC2_TYPE_II", "ISO_27001"],
      "strategic_objectives": [
        "Reduce operational cost by 30%",
        "Automate multi-agent document review with human-in-the-loop"
      ],
      "proposed_timeline_weeks": 16,
      "key_milestones_requested": [
        "Architecture Co-Design",
        "Foundry Studio Workflow Verification",
        "Full Edge Production Launch"
      ],
      "budget_cap": 750000
    }
    ```
*   **Response Payload (`[ILLUSTRATIVE MOCK]`)**:
    ```json
    {
      "proposal_id": "prp_bc82a17f-1c09-4d9d-9a99-b8efc892a01f",
      "generated_at": "2026-06-27T10:38:40Z",
      "download_url": "https://assets.gff.ai/proposals/prp_bc82a17f_export.pdf",
      "financial_schedule": {
        "foundational_licensing": 180000.00,
        "custom_edge_engineering": 240000.00,
        "operational_governance_setup": 100000.00,
        "contingency_reserve": 50000.00,
        "total_estimated_value": 570000.00
      },
      "suggested_delivery_stages": [
        { "milestone": "Co-Design Workshop", "weeks_from_kickoff": 2, "description": "Full alignment of network topology and data flows" },
        { "milestone": "Foundry Studio DAG Validation", "weeks_from_kickoff": 8, "description": "Compilation of all active agent models inside standard mock runs" },
        { "milestone": "Sovereign Production Buildout", "weeks_from_kickoff": 16, "description": "Final governance keys transferred to target enterprise team" }
      ]
    }
    ```
*   **Error Responses**:
    *   `401 Unauthorized`: Session token is absent, expired, or invalid.
    *   `422 Unprocessable Entity`: Input is out of acceptable project scopes or budget boundaries.

---

### 4.6. POST /api/auth/request-otp

**Purpose**: Dispatches a highly secure 6-digit One-Time Password to verified enterprise business emails. Blocks public disposable email domains.

*   **HTTP Method**: `POST`
*   **Path**: `/api/auth/request-otp`
*   **Security Requirement**: Public / High-Sensitivity Rate-Limiter (prevents spam and brute-force).
*   **Request Payload Schema (JSON)**:
    ```json
    {
      "email": "evance@vancelogistics.com"
    }
    ```
*   **Response Payload (`[ILLUSTRATIVE MOCK]`)**:
    ```json
    {
      "status": "sent",
      "temporary_tracking_id": "otp_82a1bc23",
      "expires_in_seconds": 600,
      "message": "A 6-digit access code has been dispatched. Please verify within 10 minutes."
    }
    ```
*   **Error Responses**:
    *   `400 Bad Request`: Non-corporate domain rejected (e.g. gmail.com, mailinator.com are blocked).
    *   `429 Too Many Requests`: Strict verification cooldown period (must wait 60 seconds before requesting another code).

---

### 4.7. POST /api/auth/verify-otp

**Purpose**: Verifies the dispatched One-Time Password against cached Redis entries. If valid, generates a secure, HTTP-only cookie and JWT Access Token to authenticate all subsequently protected platform requests.

*   **HTTP Method**: `POST`
*   **Path**: `/api/auth/verify-otp`
*   **Security Requirement**: Public / Anti-Brute-Force Lock-out.
*   **Request Payload Schema (JSON)**:
    ```json
    {
      "email": "evance@vancelogistics.com",
      "otp_code": "481029",
      "device_identifier": "Chrome_Mac_10.15.7"
    }
    ```
*   **Response Payload (`[ILLUSTRATIVE MOCK]`)**:
    ```json
    {
      "access_token": "gff_jwt_ey298ac1002b8d9c028e1837a28...37281",
      "token_type": "bearer",
      "expires_in_seconds": 86400,
      "user_profile": {
        "id": "usr_9a82cdbf-12a0-4050-9fbe-3891cfae82ab",
        "email": "evance@vancelogistics.com",
        "organization": "Vance & Co Logistics",
        "assigned_role": "Enterprise_Strategy_Lead",
        "verified_at": "2026-06-27T10:41:02Z"
      }
    }
    ```
*   **Error Responses**:
    *   `401 Unauthorized`: Code mismatch, invalid code, or code has expired.
    *   `429 Too Many Requests`: Maximum of 3 consecutive invalid code attempts allowed before account email is locked out for 15 minutes.

---

### 4.8. POST /api/newsletter/subscribe

**Purpose**: Seamlessly registers a user to receive high-fidelity research alerts, whitepapers, and corporate patterns of intelligence updates.

*   **HTTP Method**: `POST`
*   **Path**: `/api/newsletter/subscribe`
*   **Security Requirement**: Public / Rate-Limited.
*   **Request Payload Schema (JSON)**:
    ```json
    {
      "email": "evance@vancelogistics.com",
      "consent_acknowledged": true,
      "preferred_topics": ["Architectures", "Sovereign_AI", "Case_Studies"]
    }
    ```
*   **Response Payload (`[ILLUSTRATIVE MOCK]`)**:
    ```json
    {
      "status": "subscription_initiated",
      "email": "evance@vancelogistics.com",
      "confirmation_required": true,
      "message": "Opt-in confirmation sent. Please verify your subscription from your inbox."
    }
    ```
*   **Error Responses**:
    *   `400 Bad Request`: Email already subscribed, or consent checkbox is false.

---

### 4.9. POST /api/sandbox/run

**Purpose**: Compiles custom client-configured system instructions, agent definitions, and sandbox scenarios. Returns complete visual trace logs, step metrics, and simulated model tokens.

*   **HTTP Method**: `POST`
*   **Path**: `/api/sandbox/run`
*   **Security Requirement**: Public / Session-Bound.
*   **Request Payload Schema (JSON)**:
    ```json
    {
      "system_prompt": "You are a secure compliance supervisor agent analyzing transaction streams.",
      "agent_temperature": 0.2,
      "tools_enabled": ["database_query", "compliance_checker"],
      "query_input": "Validate transaction #TRX-98210 for typical AML issues.",
      "simulation_depth": "comprehensive"
    }
    ```
*   **Response Payload (`[ILLUSTRATIVE MOCK]`)**:
    ```json
    {
      "execution_id": "exe_892ba09c-33b0-4f90-a3bc-99ba8201fa90",
      "status": "completed",
      "execution_time_ms": 1420,
      "token_metrics": {
        "input_tokens": 420,
        "output_tokens": 280,
        "simulated_cost_usd": 0.0042
      },
      "execution_trace_logs": [
        { "timestamp": "10:45:00.100", "actor": "Supervisor Agent", "action": "Initialize Task Parsing", "detail": "Analyzing user query for transaction reference TRX-98210." },
        { "timestamp": "10:45:00.520", "actor": "database_query", "action": "Querying secure transaction DB", "detail": "Returned payload: {amount: $450,000, origin: Sovereign_Acc_92}" },
        { "timestamp": "10:45:01.110", "actor": "compliance_checker", "action": "Rules evaluation", "detail": "Evaluating rules under EU AI Act & AML regulations. Compliance tier verified." }
      ],
      "final_output_text": "Compliance trace verified successfully. No active threat indicators detected for TRX-98210. Isolation protocols are negative."
    }
    ```
*   **Error Responses**:
    *   `400 Bad Request`: Malformed execution parameters or unsupported sandbox tools.
    *   `500 Internal Server Error`: Execution sandbox simulation failed or timed out.

---

### 4.10. POST /api/foundry/workflow

**Purpose**: Compiles a directed acyclic graph (DAG) workflow topology designed in the Foundry Studio canvas. Automatically checks for dead ends, loose ports, or circular dependency errors.

*   **HTTP Method**: `POST`
*   **Path**: `/api/foundry/workflow`
*   **Security Requirement**: Authenticated Session / OTP Verified.
*   **Request Payload Schema (JSON)**:
    ```json
    {
      "canvas_id": "canvas_foundry_821",
      "workflow_name": "Procurement Audit Pipeline",
      "nodes": [
        { "id": "n-1", "type": "ingestion", "label": "Document Scanner", "config": { "source": "RFP_Folder" } },
        { "id": "n-2", "type": "agent", "label": "Risk Analyzer", "config": { "model": "gff-sovereign-large", "temp": 0.0 } },
        { "id": "n-3", "type": "action", "label": "Compliance Sign-off", "config": { "approver_role": "Compliance_VP" } }
      ],
      "edges": [
        { "id": "e-1-2", "source": "n-1", "target": "n-2" },
        { "id": "e-2-3", "source": "n-2", "target": "n-3" }
      ]
    }
    ```
*   **Response Payload (`[ILLUSTRATIVE MOCK]`)**:
    ```json
    {
      "workflow_id": "wfl_ff8a02bd-2210-4c7b-a1bc-7cde92a017fa",
      "status": "validated_and_saved",
      "last_updated": "2026-06-27T10:48:15Z",
      "validation_report": {
        "is_valid_dag": true,
        "cycles_detected": false,
        "dangling_nodes_count": 0,
        "issues_logged": []
      },
      "deployment_manifest_hash": "sha256_e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    }
    ```
*   **Error Responses**:
    *   `400 Bad Request`: Invalid canvas layout structure.
    *   `401 Unauthorized`: Session token is invalid or missing.

---

### 4.11. GET /api/marketplace/agents

**Purpose**: Queries and paginates pre-configured, enterprise-ready specialized GFF AI agents for integration.

*   **HTTP Method**: `GET`
*   **Path**: `/api/marketplace/agents`
*   **Security Requirement**: Public (Read-Only Portal).
*   **Query Parameters**:
    *   `category` (string, optional): e.g. "finance", "compliance"
    *   `industry` (string, optional): e.g. "energy", "telecom"
    *   `certification` (string, optional): e.g. "SOC2", "EU_AI_ACT"
    *   `search_term` (string, optional): e.g. "sovereign"
    *   `page` (int, default: 1)
    *   `page_size` (int, default: 12)
*   **Response Payload (`[ILLUSTRATIVE MOCK]`)**:
    ```json
    {
      "agents": [
        {
          "agent_id": "agt_01_sovereign_tax",
          "name": "Sovereign Audit & Tax Inspector",
          "description": "High-assurance specialist agent configured specifically to audit cross-border tax pipelines under sovereign legal frameworks.",
          "author": "GFF AI Core Labs",
          "category": "Tax & Finance",
          "certifications": ["SOC2", "EU_AI_ACT"],
          "cost_per_million_tokens": 12.50,
          "popularity_score": 4.9,
          "icon_slug": "shield-tax"
        }
      ],
      "pagination": {
        "total_items": 1,
        "total_pages": 1,
        "current_page": 1,
        "page_size": 12
      }
    }
    ```
*   **Error Responses**:
    *   `400 Bad Request`: Invalid pagination numbers or unrecognized filter parameters.

---

## 5. Security & Environment Configuration Templates

To ensure proper operational continuity when moving from client-side simulation to server execution, the backend requires a strict configuration schema. Below is the production-grade, fully documented `.env.example` template that defines the service bindings.

### 5.1. Target `.env.example` File

```bash
# ==============================================================================
# GFF AI PLATFORM: ENTERPRISE FASTAPI ENGINE - ENVIRONMENT BINDINGS
# ==============================================================================

# --- PLATFORM CORE ---
APP_NAME="GFF AI Enterprise Platform Backend"
APP_ENV="production" # options: development, staging, production
DEBUG=false
SECRET_KEY="replace-with-a-64-character-cryptographically-secure-hex-string"
ACCESS_TOKEN_EXPIRE_MINUTES=1440 # 24 hours

# --- NETWORKING & CORS CORRIDORS ---
# Comma-separated list of fully-qualified client-facing origin domains
ALLOWED_HOSTS="https://gff.ai,https://www.gff.ai,https://build.gff.ai"
PORT=8000
HOST="0.0.0.0"

# --- RELATIONAL STORAGE (POSTGRESQL) ---
DATABASE_HOST="postgres.internal.gff.ai"
DATABASE_PORT=5432
DATABASE_USER="gff_sec_admin"
DATABASE_PASSWORD="secure_database_password_placeholder"
DATABASE_NAME="gff_ai_core"
DATABASE_POOL_SIZE=20
DATABASE_MAX_OVERFLOW=10

# --- IN-MEMORY SESSION & CACHE STORE (REDIS) ---
REDIS_HOST="redis.internal.gff.ai"
REDIS_PORT=6379
REDIS_DB=0
REDIS_PASSWORD="secure_redis_password_placeholder"
REDIS_SSL=true

# --- SECURE EMAIL & OTP DISPATCHER ---
# Integration credentials for sending corporate verification keys
SMTP_HOST="smtp.mailgun.org"
SMTP_PORT=587
SMTP_USER="postmaster@mg.gff.ai"
SMTP_PASSWORD="secure_smtp_password_placeholder"
CONTACT_RECEIVER_EMAIL="ceohirezapp@gmail.com"

# --- SECURE S3 OBJECT REPOSITORY ---
# For archiving dynamic proposals, architectures, and compiled logs.
# DO NOT hardcode real credentials in development or repository environments.
AWS_ACCESS_KEY_ID="AWS_ACCESS_KEY_ID_REPLACE"
AWS_SECRET_ACCESS_KEY="AWS_SECRET_ACCESS_KEY_REPLACE"
AWS_DEFAULT_REGION="eu-west-1"
AWS_S3_BUCKET_NAME="gff-enterprise-assets"
AWS_S3_ENDPOINT_URL="https://s3.eu-west-1.amazonaws.com" # custom endpoint for sovereign-compatible clouds

# --- AGENT SANDBOX INTERPRETER (EPHEMERAL RUNTIMES) ---
SANDBOX_TIMEOUT_MS=5000
SANDBOX_MAX_MEMORY_MB=128
SANDBOX_EXECUTION_MODE="isolated_sandbox_container"
```

---

## 6. Local State Synchronization Strategy (Phase 4 Migration Guide)

When executing the integration, use the following operational mapping to safely transition without breaking existing user flows:

1. **State Hydration**: On page mount within Next.js, read from client-side `localStorage` or session store. If user authenticates via OTP (`POST /api/auth/verify-otp`), retrieve the corresponding persistent record from the server and hydrate the local React state.
2. **Optimistic UI Updates**: Keep calculating calculations client-side dynamically (for fluid animations and responsive interactions), but dispatch a background debounce request to `/api/blueprint/generate` or `/api/roi/calculate` to sync and freeze the official calculated blueprint or ROI sheet.
3. **Graceful Fallbacks**: If the FastAPI backend is temporarily unreachable, the frontend tools will catch the error, log it securely, and revert seamlessly to local Web-Worker simulation mode. This ensures high availability and 100% uptime of the strategic interactive tool visualizer.

