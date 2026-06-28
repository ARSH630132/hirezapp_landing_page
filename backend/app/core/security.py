import hmac
import hashlib
import base64
import json
import time
from typing import Dict, Any, Optional
from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext
from .config import settings

# Enterprise-grade secure password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """
    Securely hash a password using bcrypt.
    """
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify if a plain password matches its hash.
    """
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        return False

def base64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b'=').decode('utf-8')

def base64url_decode(data: str) -> bytes:
    padding = '=' * (4 - (len(data) % 4))
    return base64.urlsafe_b64decode(data + padding)

def create_access_token(
    subject: str,
    user_id: Optional[int] = None,
    role: Optional[str] = None,
    client_id: Optional[int] = None,
    email: Optional[str] = None,
    expires_delta: Optional[timedelta] = None
) -> str:
    """
    Create a secure HS256 JSON Web Token (JWT) containing user_id, role, client_id, and email.
    """
    now_utc = datetime.now(timezone.utc)
    if expires_delta:
        expire = now_utc + expires_delta
    else:
        expire = now_utc + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    header = {"alg": "HS256", "typ": "JWT"}
    payload = {
        "sub": str(subject),
        "user_id": user_id,
        "role": role,
        "client_id": client_id,
        "email": email or subject,
        "exp": int(expire.timestamp()),
        "iat": int(now_utc.timestamp())
    }
    
    header_json = json.dumps(header, separators=(',', ':')).encode('utf-8')
    payload_json = json.dumps(payload, separators=(',', ':')).encode('utf-8')
    
    header_b64 = base64url_encode(header_json)
    payload_b64 = base64url_encode(payload_json)
    
    signing_input = f"{header_b64}.{payload_b64}".encode('utf-8')
    signature = hmac.new(
        settings.JWT_SECRET.encode('utf-8'),
        signing_input,
        hashlib.sha256
    ).digest()
    
    signature_b64 = base64url_encode(signature)
    return f"{header_b64}.{payload_b64}.{signature_b64}"

def decode_access_token(token: str) -> Optional[str]:
    """
    Decode and verify a JWT token. Returns the subject/email if valid, else None.
    """
    try:
        parts = token.split('.')
        if len(parts) != 3:
            return None
        
        header_b64, payload_b64, signature_b64 = parts
        
        # Verify signature
        signing_input = f"{header_b64}.{payload_b64}".encode('utf-8')
        expected_signature = hmac.new(
            settings.JWT_SECRET.encode('utf-8'),
            signing_input,
            hashlib.sha256
        ).digest()
        
        if not hmac.compare_digest(base64url_decode(signature_b64), expected_signature):
            return None
        
        payload_bytes = base64url_decode(payload_b64)
        payload = json.loads(payload_bytes.decode('utf-8'))
        
        # Check expiration
        exp = payload.get("exp")
        if exp is None or time.time() > exp:
            return None
            
        return payload.get("email") or payload.get("sub")
    except Exception:
        return None

def decode_access_token_payload(token: str) -> Optional[Dict[str, Any]]:
    """
    Decode and return the full validated payload of a JWT token, or None if invalid.
    """
    try:
        parts = token.split('.')
        if len(parts) != 3:
            return None
        
        header_b64, payload_b64, signature_b64 = parts
        
        # Verify signature
        signing_input = f"{header_b64}.{payload_b64}".encode('utf-8')
        expected_signature = hmac.new(
            settings.JWT_SECRET.encode('utf-8'),
            signing_input,
            hashlib.sha256
        ).digest()
        
        if not hmac.compare_digest(base64url_decode(signature_b64), expected_signature):
            return None
        
        payload_bytes = base64url_decode(payload_b64)
        payload = json.loads(payload_bytes.decode('utf-8'))
        
        # Check expiration
        exp = payload.get("exp")
        if exp is None or time.time() > exp:
            return None
            
        return payload
    except Exception:
        return None

def get_token_expiry(token: str) -> Optional[datetime]:
    """
    Decode a JWT token and return its expiry datetime if valid.
    """
    try:
        parts = token.split('.')
        if len(parts) != 3:
            return None
        
        header_b64, payload_b64, signature_b64 = parts
        
        # Verify signature
        signing_input = f"{header_b64}.{payload_b64}".encode('utf-8')
        expected_signature = hmac.new(
            settings.JWT_SECRET.encode('utf-8'),
            signing_input,
            hashlib.sha256
        ).digest()
        
        if not hmac.compare_digest(base64url_decode(signature_b64), expected_signature):
            return None
        
        payload_bytes = base64url_decode(payload_b64)
        payload = json.loads(payload_bytes.decode('utf-8'))
        
        exp = payload.get("exp")
        if exp is None:
            return None
            
        # Return naive datetime in UTC representation
        return datetime.fromtimestamp(exp, tz=timezone.utc).replace(tzinfo=None)
    except Exception:
        return None


