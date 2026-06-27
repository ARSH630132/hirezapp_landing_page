import sys, os, datetime, argparse
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from sqlalchemy.orm import Session
from backend.app.db import SessionLocal, init_db
from backend.app.services.auth import AuthService
from backend.app.services.logger import SystemLoggerService
from backend.app.schemas.user import UserCreate
from backend.app.schemas.system_log import SystemLogCreate
from backend.app.models import (
    User, ClientAccount, Project, AgentOperation,
    DocumentItem, Invoice, SupportTicket, GovernanceItem, SystemLog
)

def seed_db(reset: bool = False):
    print("Initializing database tables...")
    init_db()
    db = SessionLocal()
    try:
        if reset:
            print("Wiping all existing tables for a clean slate...")
            for model in [SystemLog, SupportTicket, GovernanceItem, Invoice, DocumentItem, AgentOperation, User, Project, ClientAccount]:
                db.query(model).delete()
            db.commit()

        # Seed Clients
        clients = {
            "Apex Global": ClientAccount(name="Apex Global", industry="Financial Services", region="North America", account_owner="GFF Partner Team"),
            "Nova Energy": ClientAccount(name="Nova Energy", industry="Energy", region="Europe", account_owner="GFF Partner Team"),
            "Orion Tech": ClientAccount(name="Orion Tech", industry="Technology", region="Asia-Pacific", account_owner="GFF Partner Team"),
            "Chevron Corporation": ClientAccount(name="Chevron Corporation", industry="Energy", region="North America", account_owner="GFF Partner Team"),
        }
        for name, client in list(clients.items()):
            existing = db.query(ClientAccount).filter_by(name=name).first()
            if not existing:
                db.add(client)
                db.commit()
                db.refresh(client)
                clients[name] = client
            else:
                clients[name] = existing

        # Seed Users
        users_data = [
            ("gff_admin@gff.ai", "password123", "GFF Admin Lead", "gff_admin", None),
            ("client_admin@apex.com", "password123", "Apex Admin Lead", "client_admin", "Apex Global"),
            ("client_member@apex.com", "password123", "Apex Analyst", "client_member", "Apex Global"),
            ("admin@gff.ai", "gff_enterprise_admin_pass_2026", "GFF Executive Admin", "admin", None),
            ("client@chevron.com", "chevron_secure_pass_2026", "Chevron Operations Lead", "client", "Chevron Corporation"),
        ]
        for email, pwd, name, role, client_name in users_data:
            client_id = clients[client_name].id if client_name else None
            user = db.query(User).filter_by(email=email).first()
            if not user:
                print(f"Creating User: {email} ({role})")
                AuthService.create_user(db, UserCreate(email=email, password=pwd, full_name=name, role=role, client_id=client_id))
                user = db.query(User).filter_by(email=email).first()
                user.client_id = client_id
                user.name = name
                db.add(user)
                db.commit()
            else:
                from backend.app.core.security import hash_password
                user.hashed_password = hash_password(pwd)
                user.client_id, user.name, user.full_name, user.role = client_id, name, name, role
                db.add(user)
                db.commit()

        # Seed Projects
        now = datetime.datetime.utcnow()
        projects_data = [
            ("Apex Global", "Project Sovereign", "Phase 1: Foundation", "green", 35, "Deploying enterprise sovereign AI foundation."),
            ("Apex Global", "Automated Tax Intelligence", "Phase 3: Integration", "amber", 75, "Integrating tax reporting agent nodes with internal ERP."),
            ("Nova Energy", "Omesh Predictive Operations", "Phase 2: Core Deployment", "green", 55, "Deploying autonomous agent meshes on energy infrastructure."),
            ("Orion Tech", "Orion Agent Orchestrator", "Phase 4: Optimization", "green", 90, "Constructing the next-gen developer platform agent hub."),
        ]
        projects = {}
        for c_name, name, phase, health, prog, desc in projects_data:
            client = clients[c_name]
            proj = db.query(Project).filter_by(client_id=client.id, name=name).first()
            if not proj:
                proj = Project(
                    client_id=client.id, name=name, phase=phase, status="active", health=health,
                    owner="Lead", start_date=now - datetime.timedelta(days=30),
                    target_date=now + datetime.timedelta(days=120), progress=prog, description=desc
                )
                db.add(proj)
                db.commit()
                db.refresh(proj)
            projects[(c_name, name)] = proj

        # Seed Agents
        agents = [
            ("Apex Global", "Automated Tax Intelligence", "TaxComplianceAgent", "Compliance & Regulatory Audit", "compliant"),
            ("Apex Global", "Automated Tax Intelligence", "LedgerIngestionAgent", "Data Processing & Validation", "compliant"),
            ("Nova Energy", "Omesh Predictive Operations", "PipelineAnomalyDetector", "Anomaly Detection & Vision", "warning"),
            ("Orion Tech", "Orion Agent Orchestrator", "DeveloperCopilotAgent", "Code Synthesis & QA Test", "compliant"),
        ]
        for c_name, p_name, name, atype, gov in agents:
            cid = clients[c_name].id
            pid = projects[(c_name, p_name)].id if p_name else None
            existing = db.query(AgentOperation).filter_by(client_id=cid, name=name).first()
            if not existing:
                db.add(AgentOperation(client_id=cid, project_id=pid, name=name, agent_type=atype, status="active", health="healthy", owner="system", governance_status=gov))

        # Seed Documents
        docs = [
            ("Apex Global", "Project Sovereign", "Sovereign AI Security Architecture", "Architecture Guide", "private"),
            ("Apex Global", "Automated Tax Intelligence", "Tax Automation Node Protocol", "Integration Protocol", "private"),
            ("Nova Energy", "Omesh Predictive Operations", "Omesh Agent Security Threat Model", "Threat Model", "private"),
            ("Orion Tech", "Orion Agent Orchestrator", "API Gateway Specifications", "Technical Spec", "public"),
        ]
        for c_name, p_name, title, dtype, vis in docs:
            cid = clients[c_name].id
            pid = projects[(c_name, p_name)].id if p_name else None
            existing = db.query(DocumentItem).filter_by(client_id=cid, title=title).first()
            if not existing:
                db.add(DocumentItem(client_id=cid, project_id=pid, title=title, document_type=dtype, status="active", version="1.0.0", owner="system", visibility=vis))

        # Seed Invoices
        invoices = [
            ("Apex Global", "Project Sovereign", "INV-2026-001", "paid", 125000.0),
            ("Apex Global", "Automated Tax Intelligence", "INV-2026-002", "unpaid", 95000.0),
            ("Nova Energy", "Omesh Predictive Operations", "INV-2026-003", "unpaid", 150000.0),
            ("Orion Tech", "Orion Agent Orchestrator", "INV-2026-004", "paid", 80000.0),
        ]
        for c_name, p_name, inv_num, status, amt in invoices:
            cid = clients[c_name].id
            pid = projects[(c_name, p_name)].id if p_name else None
            existing = db.query(Invoice).filter_by(invoice_number=inv_num).first()
            if not existing:
                db.add(Invoice(client_id=cid, project_id=pid, invoice_number=inv_num, status=status, amount=amt, currency="USD", due_date=now + datetime.timedelta(days=30)))

        # Seed Support Tickets
        tickets = [
            ("Apex Global", "Automated Tax Intelligence", "API Handshake Failure in Production", "Technical", "critical", "resolved", "The API gateway returned 502 errors during high-volume ledger integration runs."),
            ("Apex Global", "Automated Tax Intelligence", "Request for Custom Model Fine-Tuning", "Feature Request", "medium", "open", "Need a pipeline to fine-tune Sovereign Llama models with quarterly tax reports."),
            ("Nova Energy", "Omesh Predictive Operations", "Late Telemetry Sync from Omesh Nodes", "Hardware Integration", "high", "in_progress", "Some remote nodes show high latency (>10s) when reporting pipeline status."),
        ]
        for c_name, p_name, title, cat, prio, status, desc in tickets:
            cid = clients[c_name].id
            pid = projects[(c_name, p_name)].id if p_name else None
            existing = db.query(SupportTicket).filter_by(client_id=cid, title=title).first()
            if not existing:
                db.add(SupportTicket(client_id=cid, project_id=pid, title=title, category=cat, priority=prio, status=status, assigned_to="support_team", created_by="user", description=desc))

        # Seed Governance
        gov_items = [
            ("Apex Global", "Project Sovereign", "Third-Party Agent Audit", "high", "active", "Perform independent automated audits of all external integrations."),
            ("Nova Energy", "Omesh Predictive Operations", "Model Drift Check - Pipeline Anomaly Detector", "medium", "active", "Review performance metrics of pipeline anomaly models to verify consistency."),
            ("Orion Tech", "Orion Agent Orchestrator", "Access Token Rotation Enforcement", "critical", "resolved", "Force rotate all integration access keys for API Gateway following scheduled quarterly audit."),
        ]
        for c_name, p_name, title, sev, status, desc in gov_items:
            cid = clients[c_name].id
            pid = projects[(c_name, p_name)].id if p_name else None
            existing = db.query(GovernanceItem).filter_by(client_id=cid, title=title).first()
            if not existing:
                db.add(GovernanceItem(client_id=cid, project_id=pid, title=title, severity=sev, status=status, owner="compliance_lead", due_date=now + datetime.timedelta(days=15), description=desc))

        db.commit()

        SystemLoggerService.create_log(
            db,
            SystemLogCreate(
                level="INFO",
                message="Enterprise API initialized and seeded successfully with robust role-based identities.",
                module="system_init"
            )
        )
        print("Database seeding completed successfully.")
        
    except Exception as e:
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Seed GFF AI Local MVP Database.")
    parser.add_argument("--reset", action="store_true", help="Reset (wipe) the database before seeding.")
    args = parser.parse_args()
    seed_db(reset=args.reset)
