import logging
import boto3
from ..core.config import settings

logger = logging.getLogger(__name__)

MOCK_DB = {
    settings.DYNAMODB_USERS_TABLE: [],
    settings.DYNAMODB_CLIENTS_TABLE: [],
    settings.DYNAMODB_ITEMS_TABLE: []
}

class MockTable:
    def __init__(self, name, pks):
        self.name, self.pks = name, pks

    def put_item(self, Item):
        self.delete_item(Key={k: Item[k] for k in self.pks if k in Item})
        MOCK_DB[self.name].append(Item)
        return {"ResponseMetadata": {"HTTPStatusCode": 200}}

    def get_item(self, Key):
        sync_with_sqlite()
        for item in MOCK_DB[self.name]:
            if all(item.get(k) == Key[k] for k in self.pks):
                return {"Item": item}
        return {}

    def delete_item(self, Key):
        MOCK_DB[self.name] = [item for item in MOCK_DB[self.name] if not all(item.get(k) == Key[k] for k in self.pks)]
        return {"ResponseMetadata": {"HTTPStatusCode": 200}}

    def scan(self, **kwargs):
        sync_with_sqlite()
        return {"Items": MOCK_DB[self.name], "Count": len(MOCK_DB[self.name])}

    def query(self, **kwargs):
        sync_with_sqlite()
        items = MOCK_DB[self.name]
        expr_vals = kwargs.get("ExpressionAttributeValues", {})
        key_expr = kwargs.get("KeyConditionExpression", "")
        res = []
        for item in items:
            keep = True
            if key_expr:
                pk_f = "GSI1PK" if ("GSI1" in kwargs.get("IndexName", "") or "GSI1PK" in key_expr) else "PK"
                pk_val = expr_vals.get(":pk") or expr_vals.get(":gsi1pk")
                if not pk_val:
                    for val in expr_vals.values():
                        pk_val = val
                        break
                if pk_val and item.get(pk_f) != pk_val:
                    keep = False
                sk_prefix = expr_vals.get(":sk") or expr_vals.get(":sk_prefix")
                if sk_prefix:
                    sk_f = "SK" if pk_f == "PK" else "GSI1SK"
                    if not str(item.get(sk_f, "")).startswith(str(sk_prefix)):
                        keep = False
            if keep:
                res.append(item)
        return {"Items": res, "Count": len(res)}

class DynamoDBClientManager:
    def __init__(self):
        self.use_mock = True
        self.dynamodb = None
        try:
            if settings.ENVIRONMENT == "production":
                self.dynamodb = boto3.resource(
                    "dynamodb",
                    region_name=settings.AWS_REGION,
                    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                )
                self.dynamodb.meta.client.list_tables()
                self.use_mock = False
        except Exception:
            self.use_mock = True

    def get_table(self, name):
        if self.use_mock:
            pks = ["email"]
            if name == settings.DYNAMODB_CLIENTS_TABLE:
                pks = ["client_id"]
            elif name == settings.DYNAMODB_ITEMS_TABLE:
                pks = ["PK", "SK"]
            return MockTable(name, pks)
        return self.dynamodb.Table(name)

db_manager = DynamoDBClientManager()

from ..core.security import hash_password

def seed_mock_database():
    pwd = hash_password("password123")
    MOCK_DB[settings.DYNAMODB_CLIENTS_TABLE] = [
        {"client_id": str(i), "name": n, "industry": ind, "region": reg, "status": "active", "account_owner": "GFF Partner Team"}
        for i, (n, ind, reg) in enumerate([
            ("Apex Global", "Financial Services", "North America"),
            ("Nova Energy", "Energy", "Europe"),
            ("Orion Tech", "Technology", "Asia-Pacific"),
            ("Chevron Corporation", "Energy", "North America")
        ], 1)
    ]
    MOCK_DB[settings.DYNAMODB_USERS_TABLE] = [
        {"email": "gff_admin@gff.ai", "hashed_password": pwd, "full_name": "GFF Admin Lead", "role": "gff_admin", "client_id": None, "is_active": True},
        {"email": "client_admin@apex.com", "hashed_password": pwd, "full_name": "Apex Admin Lead", "role": "client_admin", "client_id": "1", "is_active": True},
        {"email": "client_member@apex.com", "hashed_password": pwd, "full_name": "Apex Analyst", "role": "client_member", "client_id": "1", "is_active": True},
        {"email": "admin@gff.ai", "hashed_password": hash_password("gff_enterprise_admin_pass_2026"), "full_name": "GFF Executive Admin", "role": "admin", "client_id": None, "is_active": True},
        {"email": "client@chevron.com", "hashed_password": hash_password("chevron_secure_pass_2026"), "full_name": "Chevron Operations Lead", "role": "client", "client_id": "4", "is_active": True}
    ]
    MOCK_DB[settings.DYNAMODB_ITEMS_TABLE] = [
        {"PK": "CLIENT#1", "SK": "PROJ#1", "GSI1PK": "PROJ#1", "GSI1SK": "METADATA", "id": 1, "client_id": "1", "name": "Project Sovereign", "phase": "Phase 1: Foundation", "status": "active", "health": "green", "owner": "GFF Lead", "progress": 35, "description": "Deploying foundation.", "entity_type": "PROJECT"},
        {"PK": "CLIENT#1", "SK": "PROJ#2", "GSI1PK": "PROJ#2", "GSI1SK": "METADATA", "id": 2, "client_id": "1", "name": "Automated Tax Intelligence", "phase": "Phase 3: Integration", "status": "active", "health": "amber", "owner": "GFF Lead", "progress": 75, "description": "Integrating ERP.", "entity_type": "PROJECT"},
        {"PK": "CLIENT#2", "SK": "PROJ#3", "GSI1PK": "PROJ#3", "GSI1SK": "METADATA", "id": 3, "client_id": "2", "name": "Omesh Predictive Operations", "phase": "Phase 2: Core Deployment", "status": "active", "health": "green", "owner": "GFF Lead", "progress": 55, "description": "Deploying agent meshes.", "entity_type": "PROJECT"},
        {"PK": "CLIENT#3", "SK": "PROJ#4", "GSI1PK": "PROJ#4", "GSI1SK": "METADATA", "id": 4, "client_id": "3", "name": "Orion Agent Orchestrator", "phase": "Phase 4: Optimization", "status": "active", "health": "green", "owner": "GFF Lead", "progress": 90, "description": "Constructing orchestrator.", "entity_type": "PROJECT"},
        {"PK": "CLIENT#1", "SK": "AIOPS#1", "GSI1PK": "PROJ#2", "GSI1SK": "AIOPS#1", "id": 1, "client_id": "1", "project_id": 2, "name": "TaxComplianceAgent", "agent_type": "Compliance & Regulatory Audit", "status": "active", "health": "healthy", "owner": "system", "governance_status": "compliant", "entity_type": "AI_OPERATION"},
        {"PK": "CLIENT#1", "SK": "DOC#1", "GSI1PK": "PROJ#1", "GSI1SK": "DOC#1", "id": 1, "client_id": "1", "project_id": 1, "title": "Sovereign AI Security Architecture", "document_type": "Architecture Guide", "visibility": "private", "status": "active", "version": "1.0.0", "owner": "system", "entity_type": "DOCUMENT"},
        {"PK": "CLIENT#1", "SK": "INV#1", "GSI1PK": "BILLING_PERIOD#2026_06", "GSI1SK": "INV#1", "id": 1, "client_id": "1", "project_id": 1, "invoice_number": "INV-2026-001", "status": "paid", "amount": 125000.0, "currency": "USD", "entity_type": "INVOICE"},
        {"PK": "CLIENT#1", "SK": "INV#2", "GSI1PK": "BILLING_PERIOD#2026_06", "GSI1SK": "INV#2", "id": 2, "client_id": "1", "project_id": 2, "invoice_number": "INV-2026-002", "status": "unpaid", "amount": 95000.0, "currency": "USD", "entity_type": "INVOICE"},
        {"PK": "CLIENT#1", "SK": "TICKET#1", "GSI1PK": "STATUS#RESOLVED", "GSI1SK": "TICKET#1", "id": 1, "client_id": "1", "project_id": 2, "title": "API Handshake Failure in Production", "category": "Technical", "priority": "critical", "status": "resolved", "assigned_to": "support_team", "created_by": "user", "description": "The API gateway returned 502 errors.", "entity_type": "SUPPORT"},
        {"PK": "CLIENT#1", "SK": "TICKET#2", "GSI1PK": "STATUS#OPEN", "GSI1SK": "TICKET#2", "id": 2, "client_id": "1", "project_id": 2, "title": "Request for Custom Model Fine-Tuning", "category": "Feature Request", "priority": "medium", "status": "open", "assigned_to": "support_team", "created_by": "user", "description": "Need custom fine-tuning.", "entity_type": "SUPPORT"},
        {"PK": "CLIENT#2", "SK": "TICKET#3", "GSI1PK": "STATUS#IN_PROGRESS", "GSI1SK": "TICKET#3", "id": 3, "client_id": "2", "project_id": 3, "title": "Late Telemetry Sync from Omesh Nodes", "category": "Hardware", "priority": "high", "status": "in_progress", "assigned_to": "support_team", "created_by": "user", "description": "Late telemetry reporting.", "entity_type": "SUPPORT"},
        {"PK": "CLIENT#1", "SK": "GOV#1", "GSI1PK": "STANDARD#EXTERNAL", "GSI1SK": "GOV#1", "id": 1, "client_id": "1", "project_id": 1, "title": "Third-Party Agent Audit", "severity": "high", "status": "active", "description": "Third-party audit guidelines.", "entity_type": "GOVERNANCE"}
    ]

seed_mock_database()


_sqlite_synced = False

def sync_with_sqlite():
    global _sqlite_synced
    if _sqlite_synced:
        return
    _sqlite_synced = True
    try:
        from app.db.session import SessionLocal
        from app.models.user import User
        from app.models.client_account import ClientAccount
        from app.models.project import Project
        from app.models.agent_operation import AgentOperation
        from app.models.document_item import DocumentItem
        from app.models.invoice import Invoice
        from app.models.support_ticket import SupportTicket
        from app.models.governance_item import GovernanceItem
        
        db = SessionLocal()
        
        db_clients = db.query(ClientAccount).all()
        if db_clients:
            MOCK_DB[settings.DYNAMODB_CLIENTS_TABLE] = [
                {
                    "client_id": str(c.id), "name": c.name, "company_name": c.name,
                    "industry": c.industry, "region": c.region, "status": c.status,
                    "account_owner": c.account_owner, "created_at": c.created_at.isoformat() if c.created_at else None
                }
                for c in db_clients
            ]
            
        db_users = db.query(User).all()
        if db_users:
            MOCK_DB[settings.DYNAMODB_USERS_TABLE] = [
                {
                    "email": u.email, "hashed_password": u.hashed_password,
                    "full_name": u.full_name or u.name or u.email, "name": u.name or u.full_name,
                    "role": u.role, "client_id": str(u.client_id) if u.client_id is not None else None,
                    "is_active": u.is_active, "created_at": u.created_at.isoformat() if u.created_at else None
                }
                for u in db_users
            ]
            
        items = []
        db_projects = db.query(Project).all()
        for p in db_projects:
            items.append({
                "PK": f"CLIENT#{p.client_id}", "SK": f"PROJ#{p.id}", "GSI1PK": f"PROJ#{p.id}", "GSI1SK": "METADATA",
                "id": p.id, "client_id": str(p.client_id), "name": p.name, "phase": p.phase, "status": p.status,
                "health": p.health, "owner": p.owner, "progress": p.progress, "description": p.description, "entity_type": "PROJECT"
            })
            
        db_ops = db.query(AgentOperation).all()
        for o in db_ops:
            items.append({
                "PK": f"CLIENT#{o.client_id}", "SK": f"AIOPS#{o.id}", "GSI1PK": f"PROJ#{o.project_id or 1}", "GSI1SK": f"AIOPS#{o.id}",
                "id": o.id, "client_id": str(o.client_id), "project_id": o.project_id, "name": o.name, "agent_type": o.agent_type,
                "status": o.status, "health": o.health, "owner": o.owner, "governance_status": o.governance_status, "entity_type": "AI_OPERATION"
            })
            
        db_docs = db.query(DocumentItem).all()
        for d in db_docs:
            items.append({
                "PK": f"CLIENT#{d.client_id}", "SK": f"DOC#{d.id}", "GSI1PK": f"PROJ#{d.project_id or 1}", "GSI1SK": f"DOC#{d.id}",
                "id": d.id, "client_id": str(d.client_id), "project_id": d.project_id, "title": d.title, "filename": getattr(d, "filename", d.title), "document_type": d.document_type,
                "status": d.status, "version": d.version, "owner": d.owner, "visibility": d.visibility, "entity_type": "DOCUMENT",
                "sha256": getattr(d, "sha256", None) or (f"0x{d.id:064x}" if hasattr(d, "id") and isinstance(d.id, int) else "0x" + "0" * 40),
                "fileSize": getattr(d, "file_size", None) or "1.0 MB",
                "description": getattr(d, "description", None) or "Cryptographically secured enclave system documentation.",
                "lastUpdated": d.created_at.isoformat() if hasattr(d, "created_at") and d.created_at else datetime.datetime.utcnow().isoformat(),
                "s3_uri": getattr(d, "s3_uri", None)
            })
            
        db_invs = db.query(Invoice).all()
        for i in db_invs:
            items.append({
                "PK": f"CLIENT#{i.client_id}", "SK": f"INV#{i.id}", "GSI1PK": "BILLING_PERIOD#2026_06", "GSI1SK": f"INV#{i.id}",
                "id": i.id, "client_id": str(i.client_id), "project_id": i.project_id, "invoice_number": i.invoice_number,
                "status": i.status, "amount": i.amount, "currency": i.currency, "entity_type": "INVOICE"
            })
        db_tickets = db.query(SupportTicket).all()
        for t in db_tickets:
            items.append({
                "PK": f"CLIENT#{t.client_id}", "SK": f"TICKET#{t.id}", "GSI1PK": f"STATUS#{t.status.upper()}", "GSI1SK": f"TICKET#{t.id}",
                "id": t.id, "client_id": str(t.client_id), "project_id": t.project_id, "title": t.title, "category": t.category,
                "priority": t.priority, "status": t.status, "assigned_to": t.assigned_to, "created_by": t.created_by,
                "description": t.description, "comments": t.comments, "entity_type": "SUPPORT"
            })
            
        db_govs = db.query(GovernanceItem).all()
        for g in db_govs:
            items.append({
                "PK": f"CLIENT#{g.client_id}", "SK": f"GOV#{g.id}", "GSI1PK": f"STANDARD#EXTERNAL", "GSI1SK": f"GOV#{g.id}",
                "id": g.id, "client_id": str(g.client_id), "project_id": g.project_id, "title": g.title, "severity": g.severity,
                "status": g.status, "owner": g.owner, "description": g.description, "entity_type": "GOVERNANCE"
            })
            
        if items:
            MOCK_DB[settings.DYNAMODB_ITEMS_TABLE] = items
            
        db.close()
    except Exception as e:
        logger.error(f"Error syncing with SQLite: {e}")


