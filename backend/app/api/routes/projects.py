from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from typing import List, Optional

from ...db.session import get_db
from ...models.user import User
from ...schemas.project import ProjectResponse
from ...api.deps import get_current_user
from ...repositories.portal_items import portal_items_repo

router = APIRouter()

@router.get("", response_model=List[ProjectResponse])
def list_projects(
    request: Request,
    client_id: Optional[int] = Query(None, description="Filter projects by client ID"),
    limit: int = Query(100, ge=1, le=1000, description="Limit results"),
    offset: int = Query(0, ge=0, description="Offset results"),
    skip: Optional[int] = Query(None, ge=0, description="Skip results (alias for offset)"),
    db = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    List projects. If client_id is passed, it requires access permission.
    If the current user is a client user, automatically scope the projects to their own client_id.
    """
    target_client_id = client_id
    if current_user.role not in ["admin", "gff_admin"]:
        if current_user.client_id is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User does not belong to any client account."
            )
        if target_client_id is not None and str(target_client_id) != str(current_user.client_id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied to requested client's data."
            )
        target_client_id = current_user.client_id

    cid_str = str(target_client_id) if target_client_id is not None else None
    projects = portal_items_repo.list_items("PROJECT", client_id=cid_str)
    
    final_offset = offset if skip is None else skip
    return projects[final_offset:final_offset + limit]

