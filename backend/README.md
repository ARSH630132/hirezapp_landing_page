# GFF AI Local MVP Backend Foundation

Welcome to the local FastAPI MVP backend foundation for the GFF AI Enterprise platform. This module provides local developer API capabilities, SQLite storage connectivity, system health monitoring, and a fully configured local CORS workspace to interface seamlessly with the Next.js frontend.

---

## 🚀 Quick Start (Root Convenience Commands)

For rapid development, convenience scripts have been added to the repository's root `package.json`. These allow you to manage and run the backend seamlessly without manually creating or activating Python virtual environments in your active terminal.

From the **root directory** of the project, you can run:

*   **Install Backend Dependencies & Environment Setup**:
    ```bash
    npm run backend:install
    ```
    *This automatically creates the Python virtual environment (`venv`), installs all required pip dependencies, and copies `.env.example` to `.env` if not already present.*

*   **Initialize & Seed Local SQLite Database**:
    ```bash
    npm run backend:seed
    ```
    *This executes the database seeder to bootstrap SQLite (`dev.db`) with multi-tenant enterprise development data (including GFF Admin, Apex Tenant Admin, Apex Client Members, as well as mock client accounts, projects, support tickets, invoices, and compliance logs).*

*   **Run Backend Development Server (FastAPI)**:
    ```bash
    npm run backend:dev
    ```
    *Starts the FastAPI application via Uvicorn on [http://localhost:8000](http://localhost:8000) with hot-reloading enabled.*

*   **Run Backend Security & Dependency Tests**:
    ```bash
    npm run backend:check
    ```
    *Executes the backend verification suite (`test_security_utilities.py`) to validate JWT token parsing, password bcrypt hashing, and role-based access control (RBAC) rules.*

---

## Architecture Overview

The backend uses a standard, modular clean-architecture layout built for Python 3.12+ and FastAPI:

```text
backend/
├── app/
│   ├── __init__.py
│   ├── api.py           # Core endpoints (Health, SystemLogs)
│   ├── config.py        # Settings & Pydantic Config Validation
│   ├── database.py      # SQLAlchemy DB Connection & Dependency Injection
│   ├── main.py          # FastAPI App Entrypoint & CORS Middleware
│   ├── models.py        # SQLAlchemy Declarative Models
│   └── schemas.py       # Pydantic Schemas (V2)
├── .env.example         # Template for environment configuration
├── .gitignore           # Local development ignores
├── README.md            # Execution manual
└── requirements.txt     # Python Dependencies
```

## Features

- **Automated DB Bootstrap**: Automatically boots a local SQLite database (`dev.db`) on application launch.
- **Enterprise Logs**: A simple, high-performance database logger schema for auditing backend/frontend handshakes.
- **Health Verification**: An endpoint at `/api/v1/health` that dynamically validates database status and platform health.
- **Next.js Alignment**: Built-in CORS and request timing telemetry middleware matching frontend-dev requirements.
- **Clean Interactive Specs**: Automatic redirect of root `/` path to the interactive OpenAPI UI (`/docs`).

---

## Local Setup & Run Guide

### 1. Prerequisites
Ensure you have **Python 3.12+** and **pip** installed:
```bash
python3 --version
pip3 --version
```

### 2. Set Up Virtual Environment
Move to the backend folder and create a clean Python virtual environment:
```bash
cd backend
python3 -m venv venv
```

Activate the environment:
- **macOS / Linux**:
  ```bash
  source venv/bin/activate
  ```
- **Windows**:
  ```bash
  venv\Scripts\activate
  ```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Set Up Environment Config
Copy the example environment file:
```bash
cp .env.example .env
```
The defaults in `.env` are pre-tuned for seamless local development with the Next.js local frontend.

> ⚠️ **Production Security Warning**:
> In local development mode, `JWT_SECRET` defaults to a safe developer-only fallback key. However, for any production deployment, you **MUST** override `JWT_SECRET` in your environment variables with a cryptographically secure, high-entropy key (e.g., generated via `openssl rand -hex 32`). Leaving the default key active in production compromises token verification and authentication security.

### 5. Seed the Local Database
Seed the SQLite database with representative GFF AI multi-tenant development data (including 4 client accounts, 4 projects, 4 agent operations, 4 documents, 4 invoices, 3 support tickets, and 3 governance compliance records) and pre-configured role-based development users:

```bash
python app/seed.py
```

#### Pre-Configured Developer Accounts & Roles:
- **GFF Admin Lead** (Global Operations):
  - Email: `gff_admin@gff.ai`
  - Role: `gff_admin`
  - Password: `password123`
- **Apex Admin Lead** (Client Tenant Admin):
  - Email: `client_admin@apex.com`
  - Role: `client_admin`
  - Tenant: Apex Global
  - Password: `password123`
- **Apex Analyst** (Client Tenant Member):
  - Email: `client_member@apex.com`
  - Role: `client_member`
  - Tenant: Apex Global
  - Password: `password123`
- **Legacy Fallback Admin**:
  - Email: `admin@gff.ai`
  - Role: `admin`
  - Password: `gff_enterprise_admin_pass_2026`
- **Legacy Fallback Client**:
  - Email: `client@chevron.com`
  - Role: `client`
  - Tenant: Chevron Corporation
  - Password: `chevron_secure_pass_2026`

#### Idempotency & Database Resetting:
- Running `python app/seed.py` repeatedly is perfectly **idempotent**; it checks for existing records before inserting, ensuring no duplicated keys or rows.
- To safely **wipe all tables and fresh-seed** a clean slate, run with the `--reset` flag:
  ```bash
  python app/seed.py --reset
  ```

### 6. Run the Server
Launch the development server via Uvicorn:
```bash
uvicorn app.main:app --reload --port 8000
```

Once running, you can access:
- **Interactive OpenAPI Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Service Health Check Endpoint**: [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)

---

## API Documentation

### GET `/api/v1/health`
Checks backend and database health.
**Response (200 OK)**:
```json
{
  "status": "healthy",
  "timestamp": 1719493200.0,
  "database": {
    "status": "healthy",
    "error": null
  },
  "services": {
    "api": "healthy",
    "gff_core": "operational"
  },
  "version": "1.0.0"
}
```

### GET `/api/v1/logs`
Returns the recent list of system log entries.
**Response (200 OK)**:
```json
[]
```

### POST `/api/v1/logs`
Creates a test system log.
**Request Payload**:
```json
{
  "level": "INFO",
  "message": "Next.js frontend handshake completed successfully",
  "module": "handshake"
}
```
**Response (201 Created)**:
```json
{
  "id": 1,
  "level": "INFO",
  "message": "Next.js frontend handshake completed successfully",
  "module": "handshake",
  "created_at": "2026-06-27T15:10:00.000000"
}
```
