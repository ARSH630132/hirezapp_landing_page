import sys
import os
from datetime import datetime, timedelta, timezone

# Add backend directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token,
    decode_access_token_payload,
    get_token_expiry
)

def test_password_hashing():
    print("Running test_password_hashing...")
    password = "SuperSecurePassword2026!"
    hashed = hash_password(password)
    
    # Check that hashing works and is not plaintext
    assert hashed != password
    assert len(hashed) > 20
    assert hashed.startswith("$2") # bcrypt hash prefix
    
    # Verify correct password
    assert verify_password(password, hashed) is True
    
    # Verify incorrect password
    assert verify_password("WrongPassword!", hashed) is False
    
    # Verify unique salts (different hashes for same password)
    hashed2 = hash_password(password)
    assert hashed != hashed2
    assert verify_password(password, hashed2) is True
    
    print("✓ test_password_hashing passed.")

def test_jwt_utilities():
    print("Running test_jwt_utilities...")
    user_id = 42
    email = "enterprise_admin@gff.ai"
    role = "client_admin"
    client_id = 99
    
    # Create token
    token = create_access_token(
        subject=email,
        user_id=user_id,
        role=role,
        client_id=client_id,
        email=email,
        expires_delta=timedelta(minutes=15)
    )
    
    # Check token structure
    assert isinstance(token, str)
    parts = token.split(".")
    assert len(parts) == 3
    
    # Decode token
    decoded_email = decode_access_token(token)
    assert decoded_email == email
    
    # Retrieve full payload
    payload = decode_access_token_payload(token)
    assert payload is not None
    assert payload["sub"] == email
    assert payload["user_id"] == user_id
    assert payload["role"] == role
    assert payload["client_id"] == client_id
    assert payload["email"] == email
    assert "exp" in payload
    assert "iat" in payload
    
    # Test token expiry retrieval
    expiry = get_token_expiry(token)
    assert expiry is not None
    assert isinstance(expiry, datetime)
    
    # Test nullable client_id
    token_no_client = create_access_token(
        subject=email,
        user_id=user_id,
        role=role,
        client_id=None,
        email=email
    )
    payload_no_client = decode_access_token_payload(token_no_client)
    assert payload_no_client["client_id"] is None
    
    # Test expired token
    expired_token = create_access_token(
        subject=email,
        user_id=user_id,
        role=role,
        client_id=client_id,
        email=email,
        expires_delta=timedelta(seconds=-10) # expired 10 seconds ago
    )
    assert decode_access_token(expired_token) is None
    assert decode_access_token_payload(expired_token) is None
    
    print("✓ test_jwt_utilities passed.")

from app.core.rbac import UserRole, PermissionGroup, ROLE_PERMISSIONS, RoleChecker
from app.api.deps import (
    require_roles,
    require_admin,
    require_client_access,
    require_same_client_or_admin,
    require_permission
)
from fastapi import HTTPException

# Mock User class for testing dependencies
class MockUser:
    def __init__(self, role: str, client_id: int = None, is_active: bool = True):
        self.role = role
        self.client_id = client_id
        self.is_active = is_active

# Mock Request class for testing client parameter extraction
class MockRequest:
    def __init__(self, path_params=None, query_params=None):
        self.path_params = path_params or {}
        self.query_params = query_params or {}

def test_rbac_roles_and_permissions():
    print("Running test_rbac_roles_and_permissions...")
    # Verify new roles exist
    assert UserRole.CLIENT_ADMIN == "client_admin"
    assert UserRole.CLIENT_MEMBER == "client_member"
    assert UserRole.GFF_ADMIN == "gff_admin"
    
    # Verify permission groups exist
    assert PermissionGroup.CLIENT_PORTAL_ACCESS == "client_portal_access"
    assert PermissionGroup.ADMIN_ACCESS == "admin_access"
    assert PermissionGroup.MANAGE_CLIENTS == "manage_clients"
    assert PermissionGroup.MANAGE_USERS == "manage_users"
    
    # Verify mapping assignments
    assert PermissionGroup.ADMIN_ACCESS in ROLE_PERMISSIONS[UserRole.GFF_ADMIN]
    assert PermissionGroup.ADMIN_ACCESS not in ROLE_PERMISSIONS[UserRole.CLIENT_ADMIN]
    assert PermissionGroup.ADMIN_ACCESS not in ROLE_PERMISSIONS[UserRole.CLIENT_MEMBER]
    
    assert PermissionGroup.CLIENT_PORTAL_ACCESS in ROLE_PERMISSIONS[UserRole.CLIENT_MEMBER]
    assert PermissionGroup.MANAGE_USERS in ROLE_PERMISSIONS[UserRole.CLIENT_ADMIN]
    assert PermissionGroup.MANAGE_USERS not in ROLE_PERMISSIONS[UserRole.CLIENT_MEMBER]
    
    print("✓ test_rbac_roles_and_permissions passed.")

def test_role_checker():
    print("Running test_role_checker...")
    checker = RoleChecker([UserRole.GFF_ADMIN, UserRole.CLIENT_ADMIN])
    
    # Allowed
    assert checker("gff_admin") is True
    assert checker("client_admin") is True
    
    # Forbidden
    try:
        checker("client_member")
        assert False, "Should raise 403"
    except HTTPException as e:
        assert e.status_code == 403
        assert "Insufficient role" in e.detail
        
    print("✓ test_role_checker passed.")

def test_require_roles_dependency():
    print("Running test_require_roles_dependency...")
    dep = require_roles([UserRole.CLIENT_ADMIN, UserRole.CLIENT_MEMBER])
    
    member_user = MockUser(role="client_member")
    admin_user = MockUser(role="client_admin")
    gff_user = MockUser(role="gff_admin")
    
    # Allowed
    assert dep(member_user) == member_user
    assert dep(admin_user) == admin_user
    
    # Forbidden
    try:
        dep(gff_user)
        assert False, "Should raise 403"
    except HTTPException as e:
        assert e.status_code == 403
        
    print("✓ test_require_roles_dependency passed.")

def test_require_admin_dependency():
    print("Running test_require_admin_dependency...")
    
    gff_user = MockUser(role="gff_admin")
    legacy_admin = MockUser(role="admin")
    member_user = MockUser(role="client_member")
    
    # Allowed
    assert require_admin(gff_user) == gff_user
    assert require_admin(legacy_admin) == legacy_admin
    
    # Forbidden
    try:
        require_admin(member_user)
        assert False, "Should raise 403"
    except HTTPException as e:
        assert e.status_code == 403
        
    print("✓ test_require_admin_dependency passed.")

def test_require_client_access_dependency():
    print("Running test_require_client_access_dependency...")
    
    gff_user = MockUser(role="gff_admin", client_id=None)
    client_admin_user = MockUser(role="client_admin", client_id=42)
    client_member_user = MockUser(role="client_member", client_id=42)
    other_client_user = MockUser(role="client_admin", client_id=99)
    
    # Case 1: GFF Admin bypasses with client_id present
    req1 = MockRequest(path_params={"client_id": "42"})
    assert require_client_access(req1, gff_user) == gff_user
    
    # Case 2: Matching client_id allowed
    assert require_client_access(req1, client_admin_user) == client_admin_user
    assert require_client_access(req1, client_member_user) == client_member_user
    
    # Case 3: Mismatched client_id forbidden
    try:
        require_client_access(req1, other_client_user)
        assert False, "Should raise 403"
    except HTTPException as e:
        assert e.status_code == 403
        assert "Access to this client's data is denied" in e.detail
        
    # Case 4: client_id in query parameters
    req2 = MockRequest(query_params={"client_id": "42"})
    assert require_client_access(req2, client_admin_user) == client_admin_user
    
    # Case 5: Invalid client_id format
    req_invalid = MockRequest(path_params={"client_id": "abc"})
    try:
        require_client_access(req_invalid, client_admin_user)
        assert False, "Should raise 400"
    except HTTPException as e:
        assert e.status_code == 400
        assert "Invalid client_id format" in e.detail
        
    print("✓ test_require_client_access_dependency passed.")

def test_require_same_client_or_admin_dependency():
    print("Running test_require_same_client_or_admin_dependency...")
    
    gff_user = MockUser(role="gff_admin", client_id=None)
    client_admin_user = MockUser(role="client_admin", client_id=42)
    other_client_user = MockUser(role="client_admin", client_id=99)
    
    req1 = MockRequest(path_params={"client_id": "42"})
    
    # Admin is bypassed
    assert require_same_client_or_admin(req1, gff_user) == gff_user
    
    # Same client is allowed
    assert require_same_client_or_admin(req1, client_admin_user) == client_admin_user
    
    # Other client is rejected
    try:
        require_same_client_or_admin(req1, other_client_user)
        assert False, "Should raise 403"
    except HTTPException as e:
        assert e.status_code == 403
        assert "You can only access data belonging to your own client account" in e.detail
        
    # Missing parameter
    req_missing = MockRequest()
    try:
        require_same_client_or_admin(req_missing, other_client_user)
        assert False, "Should raise 400"
    except HTTPException as e:
        assert e.status_code == 400
        assert "client_id parameter is required" in e.detail
        
    print("✓ test_require_same_client_or_admin_dependency passed.")

def test_require_permission_dependency():
    print("Running test_require_permission_dependency...")
    
    gff_user = MockUser(role="gff_admin")
    client_admin_user = MockUser(role="client_admin")
    client_member_user = MockUser(role="client_member")
    
    dep_manage_clients = require_permission(PermissionGroup.MANAGE_CLIENTS)
    dep_manage_users = require_permission(PermissionGroup.MANAGE_USERS)
    dep_portal = require_permission(PermissionGroup.CLIENT_PORTAL_ACCESS)
    
    # GFF Admin has all permissions
    assert dep_manage_clients(gff_user) == gff_user
    assert dep_manage_users(gff_user) == gff_user
    assert dep_portal(gff_user) == gff_user
    
    # Client Admin
    assert dep_manage_users(client_admin_user) == client_admin_user
    assert dep_portal(client_admin_user) == client_admin_user
    try:
        dep_manage_clients(client_admin_user)
        assert False, "Should raise 403"
    except HTTPException as e:
        assert e.status_code == 403
        assert "Missing permission" in e.detail
        
    # Client Member
    assert dep_portal(client_member_user) == client_member_user
    try:
        dep_manage_users(client_member_user)
        assert False, "Should raise 403"
    except HTTPException as e:
        assert e.status_code == 403
        
    print("✓ test_require_permission_dependency passed.")

if __name__ == "__main__":
    try:
        test_password_hashing()
        test_jwt_utilities()
        test_rbac_roles_and_permissions()
        test_role_checker()
        test_require_roles_dependency()
        test_require_admin_dependency()
        test_require_client_access_dependency()
        test_require_same_client_or_admin_dependency()
        test_require_permission_dependency()
        print("\nAll backend security and RBAC dependency tests passed successfully!")
        sys.exit(0)
    except AssertionError as e:
        print("\nAssertion error occurred during tests:")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    except Exception as e:
        print(f"\nAn error occurred: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
