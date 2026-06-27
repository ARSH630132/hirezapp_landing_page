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

if __name__ == "__main__":
    try:
        test_password_hashing()
        test_jwt_utilities()
        print("\nAll backend security tests passed successfully!")
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
