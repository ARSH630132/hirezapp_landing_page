import sys, os, datetime, argparse
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

import boto3
from decimal import Decimal
from sqlalchemy.orm import Session
from backend.app.db import SessionLocal, init_db
from backend.app.core.config import settings
from backend.app.core.security import hash_password
from backend.app.services.auth import AuthService
from backend.app.services.logger import SystemLoggerService
from backend.app.schemas.user import UserCreate
from backend.app.schemas.system_log import SystemLogCreate
from backend.app.models import (
    User, ClientAccount, Project, AgentOperation,
    DocumentItem, Invoice, SupportTicket, GovernanceItem, SystemLog
)

# Helper function to convert floats to Decimals for safe DynamoDB serialization
def convert_floats_to_decimals(obj):
    if isinstance(obj, list):
        return [convert_floats_to_decimals(x) for x in obj]
    elif isinstance(obj, dict):
        return {k: convert_floats_to_decimals(v) for k, v in obj.items()}
    elif isinstance(obj, float):
        return Decimal(str(obj))
    return obj

# Generic representative data for absolute compliance with GFF guidelines
SEED_CLIENTS = [
    {
        "id": 1,
        "name": "Apex Global Solutions",
        "industry": "Financial Services",
        "region": "North America",
        "status": "active",
        "account_owner": "GFF Partner Team"
    },
    {
        "id": 2,
        "name": "Sovereign Logistics Corp",
        "industry": "Supply Chain",
        "region": "Europe",
        "status": "active",
        "account_owner": "GFF Partner Team"
    }
]

SEED_USERS = [
    {
        "email": "gff_admin@gff.ai",
        "password": "password123",
        "full_name": "GFF Admin Lead",
        "role": "gff_admin",
        "client_id": None
    },
    {
        "email": "client_admin@apex.com",
        "password": "password123",
        "full_name": "Apex Admin Lead",
        "role": "client_admin",
        "client_id": 1
    },
    {
        "email": "client_member@apex.com",
        "password": "password123",
        "full_name": "Apex Analyst",
        "role": "client_member",
        "client_id": 1
    },
    {
        "email": "client@chevron.com",
        "password": "chevron_secure_pass_2026",
        "full_name": "Sovereign Operations Lead",
        "role": "client_member",
        "client_id": 2
    }
]

def get_seed_projects(now):
    return [
        {
            "id": 1,
            "client_id": 1,
            "name": "Project Sovereign Mesh",
            "phase": "Phase 1: Foundation",
            "status": "active",
            "health": "green",
            "owner": "GFF Partner Team",
            "progress": 45,
            "description": "Deploying foundation for distributed agent meshes."
        },
        {
            "id": 2,
            "client_id": 2,
            "name": "Project Ledger Compliance",
            "phase": "Phase 3: Integration",
            "status": "active",
            "health": "amber",
            "owner": "GFF Partner Team",
            "progress": 75,
            "description": "Integrating automated compliance controls."
        }
    ]

def get_seed_ops():
    return [
        {
            "id": 1,
            "client_id": 1,
            "project_id": 1,
            "name": "SovereignMeshAgent",
            "agent_type": "Distributed Mesh Orchestration",
            "status": "active",
            "health": "healthy",
            "owner": "system",
            "governance_status": "compliant"
        },
        {
            "id": 2,
            "client_id": 2,
            "project_id": 2,
            "name": "LedgerAuditAgent",
            "agent_type": "Automated Audit & Compliance",
            "status": "active",
            "health": "healthy",
            "owner": "system",
            "governance_status": "compliant"
        }
    ]

def get_seed_docs(now):
    return [
        {
            "id": 1,
            "client_id": 1,
            "project_id": 1,
            "title": "Sovereign AI Security Blueprint",
            "filename": "sovereign_ai_security_blueprint.pdf",
            "document_type": "Architecture Guide",
            "visibility": "private",
            "status": "active",
            "version": "1.0.0",
            "owner": "security_officer",
            "sha256": "0x" + "0" * 64,
            "fileSize": "2.4 MB",
            "description": "Cryptographically secured enclave system documentation and guidelines.",
            "lastUpdated": now.isoformat()
        },
        {
            "id": 2,
            "client_id": 2,
            "project_id": 2,
            "title": "Ledger Integration Compliance Standard",
            "filename": "ledger_integration_compliance_standard.pdf",
            "document_type": "Regulatory Specification",
            "visibility": "private",
            "status": "active",
            "version": "1.1.0",
            "owner": "compliance_lead",
            "sha256": "0x" + "0" * 64,
            "fileSize": "1.8 MB",
            "description": "Audit trails and regulatory schema specifications.",
            "lastUpdated": now.isoformat()
        }
    ]

def get_seed_invoices(now):
    return [
        {
            "id": 1,
            "client_id": 1,
            "project_id": 1,
            "invoice_number": "INV-2026-001",
            "status": "paid",
            "amount": 150000.0,
            "currency": "USD"
        },
        {
            "id": 2,
            "client_id": 2,
            "project_id": 2,
            "invoice_number": "INV-2026-002",
            "status": "outstanding",
            "amount": 95000.0,
            "currency": "USD"
        }
    ]

def get_seed_tickets():
    return [
        {
            "id": 1,
            "client_id": 1,
            "project_id": 1,
            "title": "Enclave Handshake Connection Refused",
            "category": "Technical",
            "priority": "critical",
            "status": "resolved",
            "assigned_to": "support_team",
            "created_by": "client_admin",
            "description": "Secure enclave reported handshake timeout during high-frequency telemetry load testing."
        },
        {
            "id": 2,
            "client_id": 2,
            "project_id": 2,
            "title": "Fine-Tuning Data Format Validation",
            "category": "Feature Request",
            "priority": "medium",
            "status": "open",
            "assigned_to": "support_team",
            "created_by": "client_admin",
            "description": "Requesting schema validation templates for incremental model training pipelines."
        }
    ]

def get_seed_gov():
    return [
        {
            "id": 1,
            "client_id": 1,
            "project_id": 1,
            "title": "Autonomous Agent Risk Audit",
            "severity": "high",
            "status": "active",
            "owner": "risk_officer",
            "description": "Continuous evaluation and drift checking of decision boundaries for regulatory compliance."
        },
        {
            "id": 2,
            "client_id": 2,
            "project_id": 2,
            "title": "Key Rotation & Access Audit",
            "severity": "critical",
            "status": "resolved",
            "owner": "compliance_lead",
            "description": "Enforcement of automated 90-day integration token rotations across auditing endpoints."
        }
    ]

def seed_db(reset: bool = False):
    print("--------------------------------------------------")
    print("      SEEDING GFF PLATFORM SYSTEM DATA             ")
    print("--------------------------------------------------")
    
    # 1. Seed SQLite Database
    print("Initializing SQLite database...")
    init_db()
    db = SessionLocal()
    
    now = datetime.datetime.utcnow()
    
    try:
        if reset:
            print("Wiping existing SQLite tables for clean slate...")
            for model in [SystemLog, SupportTicket, GovernanceItem, Invoice, DocumentItem, AgentOperation, User, Project, ClientAccount]:
                db.query(model).delete()
            db.commit()

        # Seed SQLite Clients
        clients_map = {}
        for c in SEED_CLIENTS:
            existing = db.query(ClientAccount).filter_by(id=c["id"]).first()
            if not existing:
                existing = ClientAccount(
                    id=c["id"],
                    name=c["name"],
                    industry=c["industry"],
                    region=c["region"],
                    account_owner=c["account_owner"]
                )
                db.add(existing)
                db.commit()
                db.refresh(existing)
            clients_map[c["id"]] = existing

        # Seed SQLite Users
        for u in SEED_USERS:
            existing = db.query(User).filter_by(email=u["email"]).first()
            if not existing:
                print(f"Creating SQLite User: {u['email']} ({u['role']})")
                AuthService.create_user(
                    db, 
                    UserCreate(
                        email=u["email"], 
                        password=u["password"], 
                        full_name=u["full_name"], 
                        role=u["role"], 
                        client_id=u["client_id"]
                    )
                )
                user = db.query(User).filter_by(email=u["email"]).first()
                user.client_id = u["client_id"]
                user.name = u["full_name"]
                db.add(user)
                db.commit()
            else:
                existing.hashed_password = hash_password(u["password"])
                existing.client_id = u["client_id"]
                existing.name = u["full_name"]
                existing.full_name = u["full_name"]
                existing.role = u["role"]
                db.add(existing)
                db.commit()

        # Seed SQLite Projects
        projects_map = {}
        for p in get_seed_projects(now):
            existing = db.query(Project).filter_by(id=p["id"]).first()
            if not existing:
                existing = Project(
                    id=p["id"],
                    client_id=p["client_id"],
                    name=p["name"],
                    phase=p["phase"],
                    status=p["status"],
                    health=p["health"],
                    owner=p["owner"],
                    progress=p["progress"],
                    description=p["description"]
                )
                db.add(existing)
                db.commit()
                db.refresh(existing)
            projects_map[p["id"]] = existing

        # Seed SQLite AI Operations
        for o in get_seed_ops():
            existing = db.query(AgentOperation).filter_by(id=o["id"]).first()
            if not existing:
                db.add(AgentOperation(
                    id=o["id"],
                    client_id=o["client_id"],
                    project_id=o["project_id"],
                    name=o["name"],
                    agent_type=o["agent_type"],
                    status=o["status"],
                    health=o["health"],
                    owner=o["owner"],
                    governance_status=o["governance_status"]
                ))

        # Seed SQLite Documents Metadata
        for d in get_seed_docs(now):
            existing = db.query(DocumentItem).filter_by(id=d["id"]).first()
            if not existing:
                db.add(DocumentItem(
                    id=d["id"],
                    client_id=d["client_id"],
                    project_id=d["project_id"],
                    title=d["title"],
                    filename=d["filename"],
                    document_type=d["document_type"],
                    visibility=d["visibility"],
                    status=d["status"],
                    version=d["version"],
                    owner=d["owner"]
                ))

        # Seed SQLite Invoices
        for i in get_seed_invoices(now):
            existing = db.query(Invoice).filter_by(id=i["id"]).first()
            if not existing:
                db.add(Invoice(
                    id=i["id"],
                    client_id=i["client_id"],
                    project_id=i["project_id"],
                    invoice_number=i["invoice_number"],
                    status=i["status"],
                    amount=i["amount"],
                    currency=i["currency"],
                    due_date=now + datetime.timedelta(days=30)
                ))

        # Seed SQLite Support Tickets
        for t in get_seed_tickets():
            existing = db.query(SupportTicket).filter_by(id=t["id"]).first()
            if not existing:
                db.add(SupportTicket(
                    id=t["id"],
                    client_id=t["client_id"],
                    project_id=t["project_id"],
                    title=t["title"],
                    category=t["category"],
                    priority=t["priority"],
                    status=t["status"],
                    assigned_to=t["assigned_to"],
                    created_by=t["created_by"],
                    description=t["description"]
                ))

        # Seed SQLite Governance Items
        for g in get_seed_gov():
            existing = db.query(GovernanceItem).filter_by(id=g["id"]).first()
            if not existing:
                db.add(GovernanceItem(
                    id=g["id"],
                    client_id=g["client_id"],
                    project_id=g["project_id"],
                    title=g["title"],
                    severity=g["severity"],
                    status=g["status"],
                    owner=g["owner"],
                    due_date=now + datetime.timedelta(days=15),
                    description=g["description"]
                ))

        db.commit()
        
        SystemLoggerService.create_log(
            db,
            SystemLogCreate(
                level="INFO",
                message="SQLite database seeded with compliant GFF representative entities.",
                module="system_init"
            )
        )
        print("SQLite seeding completed successfully.")
    except Exception as e:
        print(f"Error seeding SQLite database: {e}")
    finally:
        db.close()

    # 2. Seed AWS DynamoDB Tables if Environment is Configured
    seed_aws_dynamodb()

def seed_aws_dynamodb():
    print("--------------------------------------------------")
    print("      SEEDING AWS DYNAMODB TABLES                 ")
    print("--------------------------------------------------")
    
    # Run seed only if environment is configured
    aws_access_key = os.getenv("AWS_ACCESS_KEY_ID") or getattr(settings, "AWS_ACCESS_KEY_ID", "")
    aws_secret_key = os.getenv("AWS_SECRET_ACCESS_KEY") or getattr(settings, "AWS_SECRET_ACCESS_KEY", "")
    region = os.getenv("AWS_REGION") or getattr(settings, "AWS_REGION", "us-east-1")
    
    is_configured = (
        aws_access_key and "placeholder" not in aws_access_key and len(aws_access_key.strip()) > 10 and
        aws_secret_key and "placeholder" not in aws_secret_key and len(aws_secret_key.strip()) > 10
    )
    
    if not is_configured:
        print("[DYNAMODB_SEED] AWS environment keys are not configured. Skipping AWS DynamoDB seeding.")
        return False

    print(f"[DYNAMODB_SEED] Detected configured AWS environment in {region}. Checking DynamoDB connection...")
    try:
        dynamodb = boto3.resource(
            "dynamodb",
            region_name=region,
            aws_access_key_id=aws_access_key,
            aws_secret_access_key=aws_secret_key
        )
        
        # Access tables specified in settings
        users_table = dynamodb.Table(settings.DYNAMODB_USERS_TABLE)
        clients_table = dynamodb.Table(settings.DYNAMODB_CLIENTS_TABLE)
        items_table = dynamodb.Table(settings.DYNAMODB_ITEMS_TABLE)
        
        # Verify connectivity by checking table status
        users_table.table_status
        clients_table.table_status
        items_table.table_status
        print("[DYNAMODB_SEED] Successfully connected to AWS DynamoDB.")
    except Exception as e:
        print(f"[DYNAMODB_SEED] Error connecting to AWS DynamoDB: {e}. Cannot perform AWS seeding.")
        return False

    now = datetime.datetime.utcnow()
    
    # A. Seed GFF_USERS Table
    print(f"[DYNAMODB_SEED] Seeding GFF_USERS table ({settings.DYNAMODB_USERS_TABLE})...")
    for u in SEED_USERS:
        hashed_pass = hash_password(u["password"])
        item = {
            "email": u["email"],
            "hashed_password": hashed_pass,
            "full_name": u["full_name"],
            "name": u["full_name"],
            "role": u["role"],
            "status": "active",
            "client_id": str(u["client_id"]) if u["client_id"] is not None else None,
            "is_active": True,
            "id": u["client_id"] or 1,
            "created_at": now.isoformat(),
            "updated_at": now.isoformat()
        }
        users_table.put_item(Item=convert_floats_to_decimals(item))
        print(f"  -> Seeded User: {u['email']}")

    # B. Seed GFF_CLIENTS Table
    print(f"[DYNAMODB_SEED] Seeding GFF_CLIENTS table ({settings.DYNAMODB_CLIENTS_TABLE})...")
    for c in SEED_CLIENTS:
        item = {
            "client_id": str(c["id"]),
            "name": c["name"],
            "company_name": c["name"],
            "industry": c["industry"],
            "region": c["region"],
            "status": c["status"],
            "account_owner": c["account_owner"],
            "created_at": now.isoformat()
        }
        clients_table.put_item(Item=convert_floats_to_decimals(item))
        print(f"  -> Seeded Client: {c['name']}")

    # C. Seed GFF_PORTAL_ITEMS Table
    print(f"[DYNAMODB_SEED] Seeding GFF_PORTAL_ITEMS single-table ({settings.DYNAMODB_ITEMS_TABLE})...")
    
    # C1. Projects
    for p in get_seed_projects(now):
        item = {
            "PK": f"CLIENT#{p['client_id']}",
            "SK": f"PROJ#{p['id']}",
            "GSI1PK": f"PROJ#{p['id']}",
            "GSI1SK": "METADATA",
            "id": p["id"],
            "client_id": str(p["client_id"]),
            "name": p["name"],
            "phase": p["phase"],
            "status": p["status"],
            "health": p["health"],
            "owner": p["owner"],
            "progress": p["progress"],
            "description": p["description"],
            "entity_type": "PROJECT",
            "created_at": now.isoformat()
        }
        items_table.put_item(Item=convert_floats_to_decimals(item))
        print(f"  -> Seeded Project: {p['name']}")

    # C2. AI Operations
    for o in get_seed_ops():
        item = {
            "PK": f"CLIENT#{o['client_id']}",
            "SK": f"AIOPS#{o['id']}",
            "GSI1PK": f"PROJ#{o['project_id']}",
            "GSI1SK": f"AIOPS#{o['id']}",
            "id": o["id"],
            "client_id": str(o["client_id"]),
            "project_id": str(o["project_id"]),
            "name": o["name"],
            "agent_type": o["agent_type"],
            "status": o["status"],
            "health": o["health"],
            "owner": o["owner"],
            "governance_status": o["governance_status"],
            "entity_type": "AI_OPERATION",
            "created_at": now.isoformat()
        }
        items_table.put_item(Item=convert_floats_to_decimals(item))
        print(f"  -> Seeded AI Operation: {o['name']}")

    # C3. Document Metadata
    for d in get_seed_docs(now):
        item = {
            "PK": f"CLIENT#{d['client_id']}",
            "SK": f"DOC#{d['id']}",
            "GSI1PK": f"PROJ#{d['project_id']}",
            "GSI1SK": f"DOC#{d['id']}",
            "id": d["id"],
            "client_id": str(d["client_id"]),
            "project_id": str(d["project_id"]),
            "title": d["title"],
            "filename": d["filename"],
            "document_type": d["document_type"],
            "visibility": d["visibility"],
            "status": d["status"],
            "version": d["version"],
            "owner": d["owner"],
            "sha256": d["sha256"],
            "fileSize": d["fileSize"],
            "description": d["description"],
            "lastUpdated": d["lastUpdated"],
            "entity_type": "DOCUMENT",
            "created_at": now.isoformat()
        }
        items_table.put_item(Item=convert_floats_to_decimals(item))
        print(f"  -> Seeded Document: {d['title']}")

    # C4. Invoices
    for i in get_seed_invoices(now):
        item = {
            "PK": f"CLIENT#{i['client_id']}",
            "SK": f"INV#{i['id']}",
            "GSI1PK": "BILLING_PERIOD#2026_06",
            "GSI1SK": f"INV#{i['id']}",
            "id": i["id"],
            "client_id": str(i["client_id"]),
            "project_id": str(i["project_id"]),
            "invoice_number": i["invoice_number"],
            "status": i["status"],
            "amount": i["amount"],
            "currency": i["currency"],
            "entity_type": "INVOICE",
            "created_at": now.isoformat()
        }
        items_table.put_item(Item=convert_floats_to_decimals(item))
        print(f"  -> Seeded Invoice: {i['invoice_number']}")

    # C5. Support Tickets
    for t in get_seed_tickets():
        item = {
            "PK": f"CLIENT#{t['client_id']}",
            "SK": f"TICKET#{t['id']}",
            "GSI1PK": f"STATUS#{t['status'].upper()}",
            "GSI1SK": f"TICKET#{t['id']}",
            "id": t["id"],
            "client_id": str(t["client_id"]),
            "project_id": str(t["project_id"]),
            "title": t["title"],
            "category": t["category"],
            "priority": t["priority"],
            "status": t["status"],
            "assigned_to": t["assigned_to"],
            "created_by": t["created_by"],
            "description": t["description"],
            "entity_type": "SUPPORT",
            "created_at": now.isoformat()
        }
        items_table.put_item(Item=convert_floats_to_decimals(item))
        print(f"  -> Seeded Support Ticket: {t['title']}")

    # C6. Governance Items
    for g in get_seed_gov():
        item = {
            "PK": f"CLIENT#{g['client_id']}",
            "SK": f"GOV#{g['id']}",
            "GSI1PK": "STANDARD#EXTERNAL",
            "GSI1SK": f"GOV#{g['id']}",
            "id": g["id"],
            "client_id": str(g["client_id"]),
            "project_id": str(g["project_id"]),
            "title": g["title"],
            "severity": g["severity"],
            "status": g["status"],
            "owner": g["owner"],
            "description": g["description"],
            "entity_type": "GOVERNANCE",
            "created_at": now.isoformat()
        }
        items_table.put_item(Item=convert_floats_to_decimals(item))
        print(f"  -> Seeded Governance Item: {g['title']}")

    print("[DYNAMODB_SEED] AWS DynamoDB seeding completed successfully.")
    return True

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Seed GFF AI Platform Datasets.")
    parser.add_argument("--reset", action="store_true", help="Reset SQLite database before seeding.")
    args = parser.parse_args()
    seed_db(reset=args.reset)
