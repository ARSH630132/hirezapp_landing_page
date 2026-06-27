# GFF AI Local MVP Backend Foundation

Welcome to the local FastAPI MVP backend foundation for the GFF AI Enterprise platform. This module provides local developer API capabilities, SQLite storage connectivity, system health monitoring, and a fully configured local CORS workspace to interface seamlessly with the Next.js frontend.

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

- **Automated DB Bootstrap**: Automatically boots a local SQLite database (`gff_ai_local.db`) on application launch.
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

### 5. Run the Server
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
