from enum import Enum
from typing import List, Set, Dict, Union
from fastapi import HTTPException, status

class UserRole(str, Enum):
    CLIENT_ADMIN = "client_admin"
    CLIENT_MEMBER = "client_member"
    GFF_ADMIN = "gff_admin"
    # Legacy fallbacks
    ADMIN = "admin"
    CLIENT = "client"
    USER = "user"
    DEVELOPER = "developer"

class PermissionGroup(str, Enum):
    CLIENT_PORTAL_ACCESS = "client_portal_access"
    ADMIN_ACCESS = "admin_access"
    MANAGE_CLIENTS = "manage_clients"
    MANAGE_USERS = "manage_users"
    MANAGE_PROJECTS = "manage_projects"
    MANAGE_AI_OPERATIONS = "manage_ai_operations"
    MANAGE_DOCUMENTS = "manage_documents"
    MANAGE_BILLING = "manage_billing"
    MANAGE_SUPPORT = "manage_support"
    MANAGE_GOVERNANCE = "manage_governance"
    VIEW_ANALYTICS = "view_analytics"

# Explicit mapping of roles to their assigned permission groups
ROLE_PERMISSIONS: Dict[Union[UserRole, str], Set[PermissionGroup]] = {
    UserRole.GFF_ADMIN: {
        PermissionGroup.CLIENT_PORTAL_ACCESS,
        PermissionGroup.ADMIN_ACCESS,
        PermissionGroup.MANAGE_CLIENTS,
        PermissionGroup.MANAGE_USERS,
        PermissionGroup.MANAGE_PROJECTS,
        PermissionGroup.MANAGE_AI_OPERATIONS,
        PermissionGroup.MANAGE_DOCUMENTS,
        PermissionGroup.MANAGE_BILLING,
        PermissionGroup.MANAGE_SUPPORT,
        PermissionGroup.MANAGE_GOVERNANCE,
        PermissionGroup.VIEW_ANALYTICS,
    },
    UserRole.CLIENT_ADMIN: {
        PermissionGroup.CLIENT_PORTAL_ACCESS,
        PermissionGroup.MANAGE_USERS,
        PermissionGroup.MANAGE_PROJECTS,
        PermissionGroup.MANAGE_AI_OPERATIONS,
        PermissionGroup.MANAGE_DOCUMENTS,
        PermissionGroup.MANAGE_BILLING,
        PermissionGroup.MANAGE_SUPPORT,
        PermissionGroup.MANAGE_GOVERNANCE,
        PermissionGroup.VIEW_ANALYTICS,
    },
    UserRole.CLIENT_MEMBER: {
        PermissionGroup.CLIENT_PORTAL_ACCESS,
        PermissionGroup.VIEW_ANALYTICS,
        PermissionGroup.MANAGE_PROJECTS,
        PermissionGroup.MANAGE_DOCUMENTS,
        PermissionGroup.MANAGE_SUPPORT,
    },
    # Legacy fallbacks mapping
    UserRole.ADMIN: {
        PermissionGroup.CLIENT_PORTAL_ACCESS,
        PermissionGroup.ADMIN_ACCESS,
        PermissionGroup.MANAGE_CLIENTS,
        PermissionGroup.MANAGE_USERS,
        PermissionGroup.MANAGE_PROJECTS,
        PermissionGroup.MANAGE_AI_OPERATIONS,
        PermissionGroup.MANAGE_DOCUMENTS,
        PermissionGroup.MANAGE_BILLING,
        PermissionGroup.MANAGE_SUPPORT,
        PermissionGroup.MANAGE_GOVERNANCE,
        PermissionGroup.VIEW_ANALYTICS,
    },
    UserRole.CLIENT: {
        PermissionGroup.CLIENT_PORTAL_ACCESS,
        PermissionGroup.MANAGE_USERS,
        PermissionGroup.MANAGE_PROJECTS,
        PermissionGroup.MANAGE_AI_OPERATIONS,
        PermissionGroup.MANAGE_DOCUMENTS,
        PermissionGroup.MANAGE_BILLING,
        PermissionGroup.MANAGE_SUPPORT,
        PermissionGroup.MANAGE_GOVERNANCE,
        PermissionGroup.VIEW_ANALYTICS,
    },
    UserRole.USER: {
        PermissionGroup.CLIENT_PORTAL_ACCESS,
        PermissionGroup.VIEW_ANALYTICS,
    },
    UserRole.DEVELOPER: {
        PermissionGroup.CLIENT_PORTAL_ACCESS,
        PermissionGroup.VIEW_ANALYTICS,
    },
}

class RoleChecker:
    def __init__(self, allowed_roles: List[UserRole]):
        self.allowed_roles = allowed_roles

    def __call__(self, user_role: str):
        allowed_values = [role.value if hasattr(role, "value") else str(role) for role in self.allowed_roles]
        if user_role not in allowed_values:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Operation not permitted. Insufficient role permissions."
            )
        return True

