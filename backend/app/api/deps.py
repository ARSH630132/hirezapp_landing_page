from typing import Generator, Optional, List
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from ..core.config import settings
from ..core.security import decode_access_token
from ..core.rbac import UserRole, PermissionGroup, ROLE_PERMISSIONS
from ..db.session import get_db
from ..repositories.users import users_repo, DynamoUser as User

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login"
)

def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(reusable_oauth2)
) -> User:
    """
    Dependency to validate token and return the current active user.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    email = decode_access_token(token)
    if email is None:
        raise credentials_exception
        
    user = users_repo.get_by_email(email)
    if user is None:
        raise credentials_exception
        
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user account"
        )
        
    return user

def get_current_active_admin(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Dependency to validate that the active user is an admin.
    """
    if current_user.role not in ["admin", "gff_admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user does not have enough privileges"
        )
    return current_user

def require_roles(allowed_roles: List[str]):
    """
    FastAPI dependency that restricts route access to specific roles.
    Accepts both strings and UserRole enums.
    """
    normalized_roles = [r.value if hasattr(r, "value") else str(r) for r in allowed_roles]
    def dependency(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in normalized_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Operation not permitted. Insufficient role privileges."
            )
        return current_user
    return dependency

def require_admin(current_user: User = Depends(get_current_user)) -> User:
    """
    FastAPI dependency that restricts route access to GFF admins (or legacy admins).
    """
    if current_user.role not in ["gff_admin", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Operation not permitted. Administrative privileges required."
        )
    return current_user

def require_client_access(
    request: Request,
    current_user: User = Depends(get_current_user)
) -> User:
    """
    FastAPI dependency that enforces that the user has access to a requested client_id.
    It automatically inspects path_params or query_params for client_id.
    GFF admin is granted access automatically.
    Client users must match the requested client_id.
    """
    client_id_str = request.path_params.get("client_id") or request.query_params.get("client_id")
    
    # GFF admins have access to all clients
    if current_user.role in ["gff_admin", "admin"]:
        return current_user

    if client_id_str is None:
        # If client_id is not specified, default to checking if the user has any assigned client_id
        if current_user.client_id is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Operation not permitted. User does not belong to any client."
            )
        return current_user

    try:
        client_id = int(client_id_str)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid client_id format."
        )

    if current_user.client_id != client_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Operation not permitted. Access to this client's data is denied."
        )

    return current_user

def require_same_client_or_admin(
    request: Request,
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Dependency that enforces that the user belongs to the same client_id
    as the one provided in the request (path or query params), OR is a GFF admin.
    """
    client_id_str = request.path_params.get("client_id") or request.query_params.get("client_id")
    
    # GFF Admin can bypass
    if current_user.role in ["gff_admin", "admin"]:
        return current_user
        
    if client_id_str is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="client_id parameter is required for this operation."
        )
        
    try:
        client_id = int(client_id_str)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid client_id format."
        )
        
    if current_user.client_id != client_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Operation not permitted. You can only access data belonging to your own client account."
        )
        
    return current_user

def require_permission(permission: str):
    """
    FastAPI dependency that restricts route access based on assigned permission groups.
    """
    # Normalize input in case a PermissionGroup Enum is passed
    perm_val = permission.value if hasattr(permission, "value") else str(permission)
    
    def dependency(current_user: User = Depends(get_current_user)) -> User:
        user_role = current_user.role
        allowed_perms = ROLE_PERMISSIONS.get(user_role, set())
        
        # Backward compatibility / Enum value fallback
        if not allowed_perms and hasattr(user_role, "value"):
            allowed_perms = ROLE_PERMISSIONS.get(user_role.value, set())
            
        # Standardize items in allowed_perms as strings
        allowed_perm_strings = {p.value if hasattr(p, "value") else str(p) for p in allowed_perms}
        
        if perm_val not in allowed_perm_strings:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Operation not permitted. Missing permission: '{perm_val}'."
            )
        return current_user
    return dependency
