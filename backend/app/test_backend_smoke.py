import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.seed import seed_db
from app.db.session import SessionLocal
from app.models.user import User
from app.models.client_account import ClientAccount
from app.models.project import Project
from app.models.support_ticket import SupportTicket

client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_database():
    """
    Ensure the SQLite database is freshly initialized and seeded before running smoke tests.
    """
    # Seed the database
    seed_db(reset=True)
    yield

def test_1_health_endpoint():
    """
    1. Verify the health check endpoint returns 200 and healthy statuses.
    """
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["database"]["status"] == "healthy"
    assert data["services"]["api"] == "healthy"

def test_2_auth_login():
    """
    2. Verify authentication flow - login and JWT token generation.
    """
    # Test valid login for admin
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "gff_admin@gff.ai", "password": "password123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["role"] == "gff_admin"

    # Test valid login for client admin
    response_client = client.post(
        "/api/v1/auth/login",
        data={"username": "client_admin@apex.com", "password": "password123"}
    )
    assert response_client.status_code == 200
    assert "access_token" in response_client.json()

    # Test invalid login credentials
    response_invalid = client.post(
        "/api/v1/auth/login",
        data={"username": "client_admin@apex.com", "password": "wrongpassword"}
    )
    assert response_invalid.status_code == 400
    assert "Incorrect email or password" in response_invalid.json()["detail"]

def test_3_auth_me():
    """
    3. Verify auth/me endpoint retrieves current authenticated user profile.
    """
    # Get token for client_admin
    login_res = client.post(
        "/api/v1/auth/login",
        data={"username": "client_admin@apex.com", "password": "password123"}
    )
    token = login_res.json()["access_token"]

    # Request /me with Bearer token
    headers = {"Authorization": f"Bearer {token}"}
    me_res = client.get("/api/v1/auth/me", headers=headers)
    assert me_res.status_code == 200
    user_data = me_res.json()
    assert user_data["email"] == "client_admin@apex.com"
    assert user_data["role"] == "client_admin"
    assert user_data["client_id"] is not None

def test_4_rbac_blocked_admin_route_for_client_user():
    """
    4. Verify RBAC blocks client users from admin-only routes.
    """
    # Get token for client_member (a non-admin role)
    login_res = client.post(
        "/api/v1/auth/login",
        data={"username": "client_member@apex.com", "password": "password123"}
    )
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # /api/v1/clients is an admin-only route that requires 'require_admin'
    response = client.get("/api/v1/clients", headers=headers)
    assert response.status_code == 403
    assert "Operation not permitted" in response.json()["detail"]


def test_5_client_dashboard_data_scoping():
    """
    5. Verify client dashboard data scoping and multi-tenant isolation.
    """
    # Get token for client_admin at Apex Global
    login_res = client.post(
        "/api/v1/auth/login",
        data={"username": "client_admin@apex.com", "password": "password123"}
    )
    apex_token = login_res.json()["access_token"]
    apex_headers = {"Authorization": f"Bearer {apex_token}"}

    # Get apex user details to find client_id
    me_res = client.get("/api/v1/auth/me", headers=apex_headers)
    apex_client_id = me_res.json()["client_id"]

    # Verify client user can access their own dashboard
    res_own = client.get(f"/api/v1/dashboard/client?client_id={apex_client_id}", headers=apex_headers)
    assert res_own.status_code == 200
    assert res_own.json()["success"] is True
    assert res_own.json()["client_id"] == apex_client_id

    # Verify client user is BLOCKED from accessing another client's dashboard (e.g. client_id + 1)
    other_client_id = apex_client_id + 1
    res_other = client.get(f"/api/v1/dashboard/client?client_id={other_client_id}", headers=apex_headers)
    assert res_other.status_code == 403
    assert "Access denied" in res_other.json()["detail"]

def test_6_projects_list_data_scoping():
    """
    6. Verify project listing is scoped to the user's client account.
    """
    # Get token for client_admin at Apex Global
    login_res = client.post(
        "/api/v1/auth/login",
        data={"username": "client_admin@apex.com", "password": "password123"}
    )
    apex_token = login_res.json()["access_token"]
    apex_headers = {"Authorization": f"Bearer {apex_token}"}

    # Retrieve projects list for Apex Global
    response = client.get("/api/v1/projects", headers=apex_headers)
    assert response.status_code == 200
    projects = response.json()
    
    # Check that all retrieved projects belong to the same client_id
    db = SessionLocal()
    apex_user = db.query(User).filter(User.email == "client_admin@apex.com").first()
    assert apex_user is not None
    
    for proj in projects:
        assert proj["client_id"] == apex_user.client_id
    db.close()

def test_7_support_ticket_create_isolation():
    """
    7. Verify support ticket creation successfully saves data and prevents cross-tenant submissions.
    """
    # Get token for client_admin at Apex Global
    login_res = client.post(
        "/api/v1/auth/login",
        data={"username": "client_admin@apex.com", "password": "password123"}
    )
    apex_token = login_res.json()["access_token"]
    apex_headers = {"Authorization": f"Bearer {apex_token}"}

    db = SessionLocal()
    apex_user = db.query(User).filter(User.email == "client_admin@apex.com").first()
    apex_client_id = apex_user.client_id
    other_client = db.query(ClientAccount).filter(ClientAccount.id != apex_client_id).first()
    other_client_id = other_client.id
    db.close()

    # Create a valid ticket under own client account
    ticket_payload = {
        "client_id": apex_client_id,
        "title": "Smoke Test Ticket",
        "category": "Technical",
        "priority": "low",
        "status": "open",
        "description": "This is a backend smoke test ticket description."
    }
    response_create = client.post("/api/v1/support-tickets", json=ticket_payload, headers=apex_headers)
    assert response_create.status_code == 201
    created_ticket = response_create.json()
    assert created_ticket["title"] == "Smoke Test Ticket"
    assert created_ticket["client_id"] == apex_client_id

    # Try to create a ticket for another client account and verify 403 Forbidden
    invalid_ticket_payload = {
        "client_id": other_client_id,
        "title": "Malicious Cross-Tenant Ticket",
        "category": "Security",
        "priority": "critical",
        "status": "open",
        "description": "Attempting to insert a ticket into another client account."
    }
    response_invalid = client.post("/api/v1/support-tickets", json=invalid_ticket_payload, headers=apex_headers)
    assert response_invalid.status_code == 403
    assert "You can only create tickets for your own client account" in response_invalid.json()["detail"]



def test_8_document_upload_and_download_scoping():
    """
    8. Verify document upload, storage, listing boundaries, and secure download with S3.
    """
    # 1. Login as GFF Admin and get token
    login_admin = client.post(
        "/api/v1/auth/login",
        data={"username": "gff_admin@gff.ai", "password": "password123"}
    )
    admin_token = login_admin.json()["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    # 2. Login as Apex Admin (client_id 1) and get token
    login_apex = client.post(
        "/api/v1/auth/login",
        data={"username": "client_admin@apex.com", "password": "password123"}
    )
    apex_token = login_apex.json()["access_token"]
    apex_headers = {"Authorization": f"Bearer {apex_token}"}

    # 3. Login as Chevron Lead (client_id 4) and get token
    login_chevron = client.post(
        "/api/v1/auth/login",
        data={"username": "client@chevron.com", "password": "chevron_secure_pass_2026"}
    )
    chevron_token = login_chevron.json()["access_token"]
    chevron_headers = {"Authorization": f"Bearer {chevron_token}"}

    # Verify admin can list all documents
    res_list_admin = client.get("/api/v1/documents", headers=admin_headers)
    assert res_list_admin.status_code == 200
    docs_admin = res_list_admin.json()
    assert len(docs_admin) > 0

    # Verify Apex user only gets documents for client_id 1
    res_list_apex = client.get("/api/v1/documents", headers=apex_headers)
    assert res_list_apex.status_code == 200
    docs_apex = res_list_apex.json()
    for doc in docs_apex:
        assert doc["client_id"] == "1"

    # Verify Chevron user cannot upload a document for client_id 1 (Apex)
    file_payload = {"file": ("test_doc.pdf", b"Sovereign Cryptographic Enclave Ledger Document", "application/pdf")}
    form_data = {
        "client_id": 1,
        "title": "Chevron Intrusion Document",
        "description": "Malicious attempt to upload document under Apex."
    }
    res_upload_forbidden = client.post(
        "/api/v1/documents/upload",
        files=file_payload,
        data=form_data,
        headers=chevron_headers
    )
    assert res_upload_forbidden.status_code == 403

    # Verify Admin can upload a document for client_id 1 (Apex)
    admin_file_payload = {"file": ("apex_contract_2026.pdf", b"Top secret Apex Core statement of work and specs", "application/pdf")}
    admin_form_data = {
        "client_id": 1,
        "title": "Apex Statement of Work Executed",
        "document_type": "SOW",
        "version": "1.0.1",
        "visibility": "private",
        "description": "Sealed SOW contract between Apex and GFF AI."
    }
    res_upload_success = client.post(
        "/api/v1/documents/upload",
        files=admin_file_payload,
        data=admin_form_data,
        headers=admin_headers
    )
    assert res_upload_success.status_code == 201
    upload_data = res_upload_success.json()
    assert upload_data["success"] is True
    uploaded_doc = upload_data["document"]
    assert uploaded_doc["title"] == "Apex Statement of Work Executed"
    assert uploaded_doc["client_id"] == "1"
    assert uploaded_doc["sha256"].startswith("0x")
    uploaded_id = uploaded_doc["id"]

    # Verify Apex user (client_id 1) can download the uploaded document
    res_download_success = client.get(
        f"/api/v1/documents/download/{uploaded_id}",
        headers=apex_headers
    )
    assert res_download_success.status_code == 200
    assert res_download_success.content == b"Top secret Apex Core statement of work and specs"

    # Verify Chevron user (client_id 4) is blocked from downloading the same document (client_id 1)
    res_download_forbidden = client.get(
        f"/api/v1/documents/download/{uploaded_id}",
        headers=chevron_headers
    )
    assert res_download_forbidden.status_code == 403
    assert "Access denied" in res_download_forbidden.json()["detail"]

