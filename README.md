# GFF AI Platform Workspace

An enterprise-grade, premium multi-tenant AI Platform built for high-performance secure client collaboration. The system integrates a **Next.js App Router Frontend** with a **FastAPI AWS-Ready Backend**.

---

## 🛠️ Rapid Workspace Commands (Project Root)

Operate the entire stack seamlessly from the root workspace directory:

- **Setup & Install Stack Dependencies**:
  ```bash
  npm run backend:install
  npm install
  ```
- **Seed Local SQLite Database**:
  ```bash
  npm run backend:seed
  ```
- **Start FastAPI Backend Server (Port 8000)**:
  ```bash
  npm run backend:dev
  ```
- **Start Next.js Frontend (Port 3000)**:
  ```bash
  npm run dev
  ```
- **Run Security, RBAC & E2E Backend Smoke Tests**:
  ```bash
  npm run backend:check
  ```
- **Build Next.js Production Frontend**:
  ```bash
  npm run build
  ```

---

## ☁️ Production AWS Deployment Configuration

The GFF AI Platform is prepared for MVP serverless cloud deployment, integrating Amazon DynamoDB single-table schemas and secure Amazon S3 storage buckets.

### 1. Required Cloud Environment Keys

#### Backend Variables (`backend/prod.env` / Lambda Variables)
| Variable Name | Required Value/Format | Purpose |
| :--- | :--- | :--- |
| `PROJECT_NAME` | `"GFF AI Enterprise Cloud Engine"` | API title metadata |
| `ENVIRONMENT` | `"production"` | Active runtime stage |
| `CORS_ORIGINS` | `https://portal.gff.ai,https://admin.gff.ai` | Allowed frontend domains (CORS compliance) |
| `FRONTEND_BASE_URL` | `https://portal.gff.ai` | Root URL of client-facing portal |
| `AWS_REGION` | `us-east-1` (or your chosen region) | Target deployment region |
| `DYNAMODB_USERS_TABLE` | `GFF_USERS` | DynamoDB User registry table |
| `DYNAMODB_CLIENTS_TABLE` | `GFF_CLIENTS` | DynamoDB Client registry table |
| `DYNAMODB_ITEMS_TABLE` | `GFF_PORTAL_ITEMS` | Multi-tenant single-table records |
| `S3_DOCUMENTS_BUCKET` | `gff-portal-documents-prod` | Secure S3 bucket name |
| `JWT_SECRET` | *cryptographically_secure_256_bit_signature_key* | Token signature key |

#### Frontend Variables (`.env.production`)
| Variable Name | Required Value/Format | Purpose |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_BASE_URL` | `https://api.gff.ai/v1` | URL of the production FastAPI gateway |
| `NEXT_PUBLIC_APP_ENV` | `production` | Deployment stage tag |
| `NEXT_PUBLIC_PORTAL_UPLOADS_ENABLED` | `true` | Enable upload features on the portal |
| `NEXT_PUBLIC_S3_BUCKET_NAME` | `gff-portal-documents-prod` | Target S3 bucket name |

---

### 2. Operational Start & Build Commands

#### FastAPI Backend (ASGI Server)
```bash
# Production start command
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

#### Next.js Frontend (Build & Run)
```bash
# Production build command
npm run build

# Production start command
npm run start
```

---

### 3. AWS Resource Names
Ensure these exact resources are provisioned in AWS:
- **DynamoDB Table (Users)**: `GFF_USERS`
- **DynamoDB Table (Clients)**: `GFF_CLIENTS`
- **DynamoDB Table (Single-Table Core Items)**: `GFF_PORTAL_ITEMS` (Index: `GSI1`)
- **S3 Bucket (Client Documents)**: `gff-portal-documents-prod`

For complete architectural details, schema designs, IAM policy templates, and step-by-step production runbooks, read the [Phase 6 AWS Production Deployment & Data Modeling Guide](./docs/PHASE_6_AWS_FINAL_SETUP.md).

