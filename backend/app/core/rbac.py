from enum import Enum
from typing import List
from fastapi import HTTPException, status

class UserRole(str, Enum):
    ADMIN = "admin"
    CLIENT = "client"
    USER = "user"
    DEVELOPER = "developer"

class RoleChecker:
    def __init__(self, allowed_roles: List[UserRole]):
        self.allowed_roles = allowed_roles

    def __call__(self, user_role: str):
        if user_role not in [role.value for role in self.allowed_roles]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Operation not permitted. Insufficient role permissions."
            )
        return True
