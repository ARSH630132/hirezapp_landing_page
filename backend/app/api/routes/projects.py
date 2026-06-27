from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from sqlalchemy.orm import Session
from typing import List, Optional

from ...db.session import get_db
from ...models.project import Project
from ...models.user import User
from ...schemas.project import ProjectResponse
from ...api.deps import get_current_user

router = APIRouter()

@router.get("", response_model=List[ProjectResponse])
def list_projects(
    request: Request,
    client_id: Optional[int] = Query(None, description="Filter projects by client ID"),
    limit: int = Query(100, ge=1, le=1000, description="Limit results"),
    offset: int = Query(0, ge=0, description="Offset results"),
    skip: Optional[int] = Query(None, ge=0, description="Skip results (alias for offset)"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    List projects. If client_id is passed, it requires access permission.
    If the current user is a client user, automatically scope the projects to their own client_id.
    """
    query = db.query(Project)
    if current_user.role not in ["admin", "gff_admin"]:
        # Client user - always scope to their client_id
        if current_user.client_id is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User does not belong to any client account."
            )
        # If client_id is requested, check if it matches
        if client_id is not None and client_id != current_user.client_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied to requested client's data."
            )
        query = query.filter(Project.client_id == current_user.client_id)
    else:
        # Admin user
        if client_id is not None:
            query = query.filter(Project.client_id == client_id)
            
    final_offset = offset if skip is None else skip
    return query.offset(final_offset).limit(limit).all()
