# GFF AI Platform: Phase 5 Local MVP Backend Setup & Developer Guide

This document establishes the strategic, technical, and operational manual for configuring and running the **Phase 5 Local MVP Backend** of the GFF AI Platform. 

To support the premium, high-fidelity presentation layer developed in Phase 4, Phase 5 introduces a lightweight, high-performance local FastAPI backend. This local server connects to a local SQLite database, processes authentications via JSON Web Tokens (JWT), and hosts multi-tenant workspaces so that developers and stakeholders can test complete client and administrative flows locally.

---

## 1. Executive Narrative & Architectural Scope

### 1.1. Decoupled Sandbox Metaphor
In alignment with the GFF AI **Sovereign Operating System** philosophy, the Phase 5 backend is engineered as a local developer sandbox. It replicates multi-tenant access control and core database persistence without introducing complex, expensive production dependencies. 

This local engine acts as the "State Synchronizer" for the frontend cockpit, enabling real-time REST API handshakes, dynamic database logging, and role-based clearance verification.

### 1.2. Scope & Boundaries (MVP Development Phase)
The Phase 5 backend is designed **exclusively for local development, demonstration, and offline evaluation**. It provides a solid architectural foundation while intentionally omitting several enterprise cloud-scale features.

> ⚠️ **Phase Scope Limitations**:
> *   **Local-Only Database**: Uses a local SQLite file (`dev.db`). No RDS/Postgres database setups are used.
> *   **No AWS Integrations**: Does not utilize real AWS resources (such as DynamoDB, S3 file buckets, or AWS IAM roles).
> *   **No Storage Backend**: File uploads and secure legal document storage are handled via frontend-only simulation placeholders; no physical file-saving backend is active.
> *   **No External Payment Gateways**: Computational "Epoch" invoicing and billing tables exist in SQLite, but there is no integration with billing aggregators like Stripe or Chargebee.
> *   **No Real Emails/OTP/SSO**: There is no live SMTP mailer, Multi-Factor/One-Time Password (OTP) verification, or OAuth2/SSO identity providers. Auth relies strictly on standard OAuth2 JWT tokens with local bcrypt hashing.
> *   **No Live Backend for GFF AI Tools**: Tool execution engines, prompt generators, and agent configurations run within mock sandboxes inside the frontend client.
> *   **No Production Auth Hardening**: Features like Rate-limiting, IP-restrictions, secure HttpOnly cookie session management, or Hardware Security Module (HSM) signing are deferred to production deployment phases.

---

## 2. Prerequisites

Ensure you have the following environments installed locally on your system:
*   **Node.js**: `v18.x` or later (for running the Next.js frontend)
*   **Python**: `v3.12.x` or later (for running the FastAPI backend)
*   **pip**: Python package manager
*   **SQLite3**: Installed on your system (typically comes bundled with Python)

---

## 3. Local Environment Variables Configuration

To bridge the Next.js frontend and the FastAPI backend, you must establish environment templates in both repositories.

### 3.1. Create Backend Environment
Copy the backend configuration template inside the `backend` folder:
```bash
cp backend/.env.example backend/.env
```

Your `backend/.env` file will look like this:
```env
# GFF AI Local MVP Backend Configuration
PROJECT_NAME="GFF AI Enterprise API"
API_V1_STR="/api/v1"
ENVIRONMENT="development"
DATABASE_URL="sqlite:///dev.db"

# Local JWT configuration
JWT_SECRET="gff_ai_super_secret_local_key_for_jwt_tokens_2026"
ACCESS_TOKEN_EXPIRE_MINUTES=11520  # 8 Days

# Allowed CORS Origins
CORS_ORIGINS="http://localhost:3000,http://127.0.0.1:3000"
FRONTEND_BASE_URL="http://localhost:3000"
```

### 3.2. Create Frontend Environment
Copy the frontend environment template in the project root:
```bash
cp .env.example .env
```

To enable active backend connectivity in the Next.js frontend, configure `NEXT_PUBLIC_API_BASE_URL` in the root `.env` to point to the local FastAPI port:
```env
# API Integration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_PORTAL_UPLOADS_ENABLED=true
```

*Note: If `NEXT_PUBLIC_API_BASE_URL` is omitted or commented out, the frontend gracefully falls back to its client-side mock handlers.*

---

## 4. Local Backend Setup & Installation

To streamline development, root-level convenience scripts are provided in the master `package.json` file. These scripts manage virtual environments and package installations automatically.

### 4.1. Automatic Automated Installation (Recommended)
From the **root directory** of the project, run:
```bash
npm run backend:install
```
This automated command:
1.  Enters the `backend/` directory.
2.  Creates a Python virtual environment (`venv/`) if it does not exist.
3.  Upgrades pip and installs all required dependencies from `backend/requirements.txt`.
4.  Generates a `.env` file from `.env.example` if it is missing.

### 4.2. Manual Installation
If you prefer setting up the workspace manually, execute the following commands in your terminal:
```bash
# Navigate to the backend directory
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS / Linux:
source venv/bin/activate
# On Windows (CMD):
# venv\Scripts\activate.bat

# Install package dependencies
pip install -r requirements.txt
```

---

## 5. Database Initialization & Seeding

The backend utilizes SQLite for multi-tenant data storage. The database tables are automatically initialized during FastAPI startup, but you must seed the tables to bootstrap enterprise development users and sample data.

### 5.1. Initialize & Seed Database
From the **root directory**, run:
```bash
npm run backend:seed
```
Alternatively, from the `backend` folder with your virtual environment active:
```bash
python app/seed.py
```

This bootstraps a local SQLite file named `dev.db` inside the `backend/` directory and populates it with:
*   **Multi-tenant Client Accounts**: Apex Global, Chevron Corporation, and other reference enterprise enclaves.
*   **Projects & Sandboxes**: Dynamic multi-agent project pipelines mapped to roles and clients.
*   **Governance Audits**: Simulated compliance frameworks, compliance standards, and compliance tracking items.
*   **Secure Documents**: Legal records, service-level contracts, and ISO checklists.
*   **Billing Ledger & Invoices**: Compute epochs, consumption hours, and signed developer invoices.
*   **System Logs**: Dynamic audit logging structures.

### 5.2. Database Seeder Idempotency & Reset
*   **Idempotency**: Running `npm run backend:seed` repeatedly is fully idempotent. It verifies existing primary records before inserting, preventing duplicated keys or rows.
*   **Wiping the slate clean**: To hard reset the database (drop all tables, recreate schemas, and fresh seed), run the seeder script with the `--reset` flag:
    ```bash
    cd backend
    venv/bin/python app/seed.py --reset
    ```

---

## 6. Running the Services

To test the end-to-end integration, you must run both the backend FastAPI server and the Next.js frontend simultaneously.

### 6.1. Launching the Backend (FastAPI)
From the **root directory**, run:
```bash
npm run backend:dev
```
This starts the Uvicorn ASGI server on `http://localhost:8000` with hot-reloading active.

#### Active Ports & URLs:
*   **Service Root**: [http://localhost:8000](http://localhost:8000) (Automatically redirects to `/docs`)
*   **Interactive Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs) (OpenAPI spec explorer)
*   **Dynamic Health Check**: [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)

### 6.2. Launching the Frontend (Next.js)
In a separate terminal window, from the **root directory**, run:
```bash
npm run dev
```
This starts the Next.js web application on [http://localhost:3000](http://localhost:3000).


---

## 7. Authenticating and Testing Portal/Admin Flows

### 7.1. Pre-Configured Developer Accounts & Roles
The seeder bootstraps five distinct users across different enterprise roles. You can log in using these credentials to test role-based access control (RBAC):

| User Email | Assigned Role | Tenant Affiliation | Clear Password | Intended Test Flow |
| :--- | :--- | :--- | :--- | :--- |
| **gff_admin@gff.ai** | `gff_admin` | Platform Global | `password123` | Full administrative oversight, Client registry management, Audit logs, System-wide statistics. |
| **client_admin@apex.com** | `client_admin` | Apex Global | `password123` | Apex Client admin dashboard, Project pipelines, Billing summaries, Document review, Support. |
| **client_member@apex.com** | `client_member` | Apex Global | `password123` | Standard client operative view, Read-only billing, Read-write support tickets & compliance audits. |
| **admin@gff.ai** | `admin` | Platform Global | `gff_enterprise_admin_pass_2026` | Legacy administrative fallback authentication flow. |
| **client@chevron.com** | `client` | Chevron Corp | `chevron_secure_pass_2026` | Legacy single-tenant client dashboard authentication flow. |

### 7.2. Handshake Verification (End-to-End Test)
1.  Open [http://localhost:3000/portal/login](http://localhost:3000/portal/login) (or `/admin/login`).
2.  Observe the **Living Terminal Feed** on the right side. It will report:
    `[SYS] API backend service connection verified. Active mode: REST API.`
3.  Enter credentials (e.g., `client_admin@apex.com` and `password123`).
4.  Click **Initiate Secure Access**.
5.  The system performs a cryptographic handshake, calling `/api/v1/auth/login` on the FastAPI server to retrieve a JWT, saves it in `localStorage` as `gff_api_token`, and routes you to the secure Client Dashboard (`/portal/dashboard`).
6.  The backend validates the JWT token on every subsequent API call and scopes database queries based on the tenant (e.g., users logged in under Apex Global will not see Chevron Corporation's private projects).

---

## 8. Developer Troubleshooting Guide

### 8.1. Cross-Origin Resource Sharing (CORS) Issues
*   **Symptom**: The console shows `Access-Control-Allow-Origin` errors, or login handshakes fail with network/CORS block messages.
*   **Resolution**: 
    1. Check your `backend/.env` file. Ensure `CORS_ORIGINS` is configured with the exact URL of your running frontend (usually `http://localhost:3000`).
    2. Multiple origins should be separated by commas without spaces, or formatted as a JSON list (e.g., `["http://localhost:3000","http://127.0.0.1:3000"]`).
    3. Restart your FastAPI backend server after updating `.env`.

### 8.2. Missing Database / SQLite Locks
*   **Symptom**: SQLite database errors like `OperationalError: no such table` or `database is locked` appear in the backend terminal logs.
*   **Resolution**:
    1. Verify that `dev.db` has been successfully created in the `backend/` directory.
    2. Run `npm run backend:seed` to initialize the SQLite database schema and seed user models.
    3. If SQLite reports a database lock, ensure there are no active, hanging Python processes or DB browsers holding a transaction open. Kill any zombie python processes:
       - macOS/Linux: `killall python python3` or `pkill uvicorn`
       - Windows: `taskkill /F /IM python.exe`

### 8.3. Invalid or Expired JWT Token
*   **Symptom**: Frontend queries immediately redirect back to login routes, or return `401 Unauthorized` responses in the developer console.
*   **Resolution**:
    1. Ensure the `JWT_SECRET` configured in your `backend/.env` matches what the backend loads. If the secret changed during server restarts, old tokens stored in your browser will become invalid.
    2. Clear your browser storage. Open the DevTools console and execute:
       ```javascript
       localStorage.clear();
       ```
    3. Re-authenticate via `/portal/login` to establish a fresh JWT token handshake.

### 8.4. Seed Rerun Failures
*   **Symptom**: Running the seeder yields unique constraint violations or integrity errors.
*   **Resolution**:
    1. The seeder is designed to be idempotent and update fields when keys match. However, if structural schema alterations were made to the SQLAlchemy models, migrations may conflict.
    2. Wipe the tables and run a clean bootstrap using the reset argument:
       ```bash
       npm run backend:seed -- --reset
       ```
       *(Note: The extra `--` passes the `--reset` option through npm to the python seed runner script).*

