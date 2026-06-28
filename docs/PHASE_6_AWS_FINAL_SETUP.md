# GFF AI Platform: Phase 6 AWS Production Deployment & Data Modeling Guide

This document defines the enterprise AWS cloud migration strategy for the **GFF AI Platform** from the local Phase 5 sandbox. It specifies the exact schemas for three required DynamoDB tables, an S3 storage bucket, and the required environment parameters.

---

## 1. Cloud-Native Serverless Architecture

```
+------------------------------------------------------------------------------------------------+
|                               PHASE 6 ENTERPRISE AWS TOPOLOGY                                  |
|  [ SECURE CLIENTS ] ==( HTTPS / TLS 1.3 )==> [ API GATEWAY ] ==> [ FASTAPI ON AWS LAMBDA ]    |
|                                                                          |                     |
|  [ S3 STORAGE BUCKET ] <--(Presigned URLs)-------------------------------+                     |
|  (gff-portal-documents)                                                  v                     |
|                                                                 [ AMAZON DYNAMODB ]            |
|                                                                 - GFF_USERS                    |
|                                                                 - GFF_CLIENTS                  |
|                                                                 - GFF_PORTAL_ITEMS             |
+------------------------------------------------------------------------------------------------+
```

---

## 2. Production DynamoDB Data Modeling

Exactly **three** DynamoDB tables are used. Complex workspace and transactional entities are modeled inside a single-table architecture (`GFF_PORTAL_ITEMS`) using custom Partition Keys (`PK`) and Sort Keys (`SK`).

### 2.1. Table Map Overview
| Table Name | Partition Key (PK) | Sort Key (SK) | Global Secondary Index (GSI) | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **`GFF_USERS`** | `email` (String) | *None* | *None* | Global user registry and access credentials. |
| **`GFF_CLIENTS`** | `client_id` (String) | *None* | *None* | Enterprise customer accounts. |
| **`GFF_PORTAL_ITEMS`** | `PK` (String) | `SK` (String) | `GSI1` (using `GSI1PK` & `GSI1SK`) | Multi-tenant workspace record store. |

### 2.2. Table Definition: `GFF_USERS`
*   **Table Name**: `GFF_USERS`
*   **Primary Key**: `email` (String)
*   **Example Item**: `{"email": "admin@client.com", "role": "admin", "client_id": "client_gff_01"}`

### 2.3. Table Definition: `GFF_CLIENTS`
*   **Table Name**: `GFF_CLIENTS`
*   **Primary Key**: `client_id` (String)
*   **Example Item**: `{"client_id": "client_gff_01", "company_name": "Sovereign Logistics Corp", "tier": "ENTERPRISE"}`

### 2.4. Single-Table Definition: `GFF_PORTAL_ITEMS`
*   **Table Name**: `GFF_PORTAL_ITEMS`
*   **Primary Key**: `PK` (String), `SK` (String)
*   **GSI Name**: `GSI1` (using `GSI1PK` and `GSI1SK`)
*   **Purpose**: Single-table design housing the 6 core operational models of the GFF AI Portal.

#### Entity Mappings & Storage Patterns

1. **Projects**
   - **`PK`**: `CLIENT#<client_id>` | **`SK`**: `PROJ#<project_id>`
   - **`GSI1PK`**: `PROJ#<project_id>` | **`GSI1SK`**: `METADATA`
   - **Attributes**: `name`, `status`, `progress`, `budget`, `created_at`

2. **AI Operations**
   - **`PK`**: `CLIENT#<client_id>` | **`SK`**: `AIOPS#<ops_id>`
   - **`GSI1PK`**: `PROJ#<project_id>` (links to project) | **`GSI1SK`**: `AIOPS#<ops_id>`
   - **Attributes**: `name`, `status`, `agent_count`, `runtime_seconds`, `cpu_usage`, `memory_usage`

3. **Documents Metadata**
   - **`PK`**: `CLIENT#<client_id>` | **`SK`**: `DOC#<doc_id>`
   - **`GSI1PK`**: `PROJ#<project_id>` (retrieves files by project) | **`GSI1SK`**: `DOC#<doc_id>`
   - **Attributes**: `title`, `s3_key`, `file_size`, `category`, `uploaded_by`, `uploaded_at`

4. **Invoices Metadata**
   - **`PK`**: `CLIENT#<client_id>` | **`SK`**: `INV#<invoice_id>`
   - **`GSI1PK`**: `BILLING_PERIOD#<year_month>` | **`GSI1SK`**: `INV#<invoice_id>`
   - **Attributes**: `amount_usd`, `status`, `due_date`, `epochs_consumed`, `created_at`

5. **Support Tickets**
   - **`PK`**: `CLIENT#<client_id>` | **`SK`**: `TICKET#<ticket_id>`
   - **`GSI1PK`**: `STATUS#<status_code>` (supports dashboard queues) | **`GSI1SK`**: `TICKET#<ticket_id>`
   - **Attributes**: `subject`, `priority`, `status_text`, `assigned_to`, `created_at`

6. **Governance Items**
   - **`PK`**: `CLIENT#<client_id>` | **`SK`**: `GOV#<gov_id>`
   - **`GSI1PK`**: `STANDARD#<compliance_standard>` | **`GSI1SK`**: `GOV#<gov_id>`
   - **Attributes**: `control_name`, `status`, `remediation_notes`, `assessed_at`

---

## 3. Cloud Object Storage Setup (Amazon S3)

*   **Bucket Reference**: `gff-portal-documents-prod`
*   **Security Configurations**:
    *   **Block Public Access**: Enabled.
    *   **Encryption at Rest**: Enforced using KMS customer-managed keys (SSE-KMS).
    *   **Secure Transport**: Restricts transport to TLS 1.3/HTTPS.
    *   **Presigned Access**: Frontend uploads/downloads via short-lived pre-signed URLs generated by Lambda (valid for 15 minutes).

---

## 4. Required Deployment Environment Keys

### 4.1. Next.js Frontend Keys (`.env.production`)
```env
NEXT_PUBLIC_API_BASE_URL=https://api.gff.ai/v1
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_PORTAL_UPLOADS_ENABLED=true
NEXT_PUBLIC_S3_BUCKET_NAME=gff-portal-documents-prod
```

### 4.2. FastAPI AWS Backend Keys (`backend/prod.env` / Lambda Variables)
```env
PROJECT_NAME="GFF AI Enterprise Cloud Engine"
API_V1_STR="/api/v1"
ENVIRONMENT="production"
CORS_ORIGINS="https://portal.gff.ai,https://admin.gff.ai"
FRONTEND_BASE_URL="https://portal.gff.ai"
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=production_aws_access_key_id
AWS_SECRET_ACCESS_KEY=production_aws_secret_access_key
DYNAMODB_USERS_TABLE=GFF_USERS
DYNAMODB_CLIENTS_TABLE=GFF_CLIENTS
DYNAMODB_ITEMS_TABLE=GFF_PORTAL_ITEMS
DYNAMODB_ITEMS_TYPE_INDEX=GSI1
S3_DOCUMENTS_BUCKET=gff-portal-documents-prod
S3_DOCUMENTS_PREFIX=clients
JWT_SECRET=production_cryptographically_secure_256_bit_signature_key_2026
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```


---

## 5. Seeded User Credentials (Final MVP Data)

The system contains exactly **four** seeded user accounts covering the three standard RBAC roles (`gff_admin`, `client_admin`, `client_member`). All passwords, roles, and client associations are modeled to enable immediate high-fidelity secure testing.

| Role | Email | Password | Associated Client | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **`gff_admin`** | `gff_admin@gff.ai` | `password123` | *None* | Global platform administrator. Accesses the GFF Admin Panel. |
| **`client_admin`** | `client_admin@apex.com` | `password123` | `Apex Global Solutions` (ID: 1) | Enterprise client administrator. Full workspace management for Client 1. |
| **`client_member`** | `client_member@apex.com` | `password123` | `Apex Global Solutions` (ID: 1) | Client 1 standard user. Limited operational access inside Client 1 workspace. |
| **`client_member`** | `client@chevron.com` | `chevron_secure_pass_2026` | `Sovereign Logistics Corp` (ID: 2) | Client 2 standard user. Used to verify cross-tenant security and upload/download boundaries in smoke tests. |

These credentials can be used both locally (via SQLite/mock fallbacks) and in the production cloud (AWS DynamoDB) once the environment is initialized and seeded using:
```bash
npm run backend:seed
```



---

## 6. Execution, Build, and Deployment Manual

This section outlines the operational commands, deployment procedures, required environment parameters, and AWS production resources for launching the GFF AI Platform.

### 6.1. Backend Execution & Deployment Commands

The backend is built as a cloud-ready FastAPI application that can be run locally using Uvicorn or deployed to AWS Lambda (e.g., using Mangum adapter) or AWS App Runner / Elastic Beanstalk.

#### 1. Setup & Installation
To create the virtual environment and install all python dependencies, run:
```bash
# From project root
npm run backend:install

# Or from backend directory
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### 2. Seed Database
To seed the database with multi-tenant workspace credentials, projects, operations, invoices, support tickets, and compliance logs:
```bash
# From project root
npm run backend:seed

# Or from backend directory with active virtual environment
cd backend
python app/seed.py
```

#### 3. Run Backend Start Command (Development/Production)
To launch the FastAPI ASGI server:
```bash
# From project root (hot-reload enabled)
npm run backend:dev

# From backend directory (standard FastAPI startup)
cd backend
venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
```
*For production cloud environments (e.g., AWS App Runner or EC2), execute:*
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

#### 4. Backend Health & Smoke Checks
To execute complete RBAC, JWT, and multi-tenancy isolation tests:
```bash
# From project root
npm run backend:check

# Or from backend directory
cd backend
./venv/bin/pytest app/test_backend_smoke.py
./venv/bin/python app/test_security_utilities.py
./venv/bin/python app/test_clients_api.py
```

---

### 6.2. Next.js Frontend Execution & Build Commands

The frontend is an enterprise-grade Next.js App Router workspace optimized for modern deployment platforms (Vercel, AWS Amplify, AWS ECS, or S3/CloudFront for static builds).

#### 1. Frontend Build Command
To produce an optimized production-ready bundle:
```bash
# From project root
npm run build
```
This command compiles the TypeScript components, static assets, and App Router pages into the `.next` production distribution.

#### 2. Frontend Start Command
To run the built production frontend server:
```bash
# From project root
npm run start
```

#### 3. Frontend Development Command
To launch the local development hot-reloading server:
```bash
# From project root
npm run dev
```

---

### 6.3. Complete Production Environment Variables

#### Backend Environment Variables
These variables must be configured in AWS Parameter Store, AWS Secrets Manager, or as environment variables on the hosting container/Lambda:

| Variable Name | Required Value/Format | Purpose |
| :--- | :--- | :--- |
| `PROJECT_NAME` | `"GFF AI Enterprise Cloud Engine"` | API title metadata |
| `API_V1_STR` | `"/api/v1"` | API prefix path |
| `ENVIRONMENT` | `"production"` | Set runtime stage |
| `CORS_ORIGINS` | `https://portal.gff.ai,https://admin.gff.ai` | Allowed frontend domains (CORS compliance) |
| `FRONTEND_BASE_URL` | `https://portal.gff.ai` | Root URL of client-facing portal |
| `AWS_REGION` | `us-east-1` (or chosen region) | Target region for DynamoDB and S3 |
| `AWS_ACCESS_KEY_ID` | *production_aws_access_key_id* | AWS IAM deployer credentials |
| `AWS_SECRET_ACCESS_KEY` | *production_aws_secret_access_key* | AWS IAM deployer secret |
| `DYNAMODB_USERS_TABLE` | `GFF_USERS` | DynamoDB user registry table |
| `DYNAMODB_CLIENTS_TABLE` | `GFF_CLIENTS` | DynamoDB enterprise client registry table |
| `DYNAMODB_ITEMS_TABLE` | `GFF_PORTAL_ITEMS` | Multi-tenant operational records store |
| `DYNAMODB_ITEMS_TYPE_INDEX` | `GSI1` | Global Secondary Index for single-table queries |
| `S3_DOCUMENTS_BUCKET` | `gff-portal-documents-prod` | Secure client document storage |
| `S3_DOCUMENTS_PREFIX` | `clients` | File key namespace prefix |
| `JWT_SECRET` | *cryptographically_secure_256_bit_signature_key* | Cryptographic token signing secret |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `1440` (24 hours) | Token lifespan limit |

#### Frontend Environment Variables
These variables must be set in the build pipeline (e.g. Vercel dashboard, AWS Amplify console):

| Variable Name | Required Value/Format | Purpose |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_BASE_URL` | `https://api.gff.ai/v1` | URL pointing to the FastAPI gateway |
| `NEXT_PUBLIC_APP_ENV` | `production` | Deployment stage tag |
| `NEXT_PUBLIC_PORTAL_UPLOADS_ENABLED` | `true` | Enables upload features on Client Portal |
| `NEXT_PUBLIC_S3_BUCKET_NAME` | `gff-portal-documents-prod` | Target S3 bucket name |

---

### 6.4. AWS Production Cloud Resource Names

Ensure the following exact resource names are created in your target AWS account to match the production configuration defaults:

1. **Amazon DynamoDB Tables**:
   - `GFF_USERS` (Primary Key: `email` [String])
   - `GFF_CLIENTS` (Primary Key: `client_id` [String])
   - `GFF_PORTAL_ITEMS` (Primary Key: `PK` [String], Sort Key: `SK` [String], GSI: `GSI1` with PK `GSI1PK` [String] and SK `GSI1SK` [String])

2. **Amazon S3 Storage Bucket**:
   - `gff-portal-documents-prod` (Block All Public Access, KMS SSE-KMS Encryption, TLS 1.3 Secure Transport enforced)

3. **AWS IAM Execution Role Policy**:
   - Create a role with a minimum privilege boundary allowing full read/write access to the three DynamoDB tables above, and pre-signed URL generation access on the `gff-portal-documents-prod` S3 bucket.

