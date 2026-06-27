from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from typing import Dict, Any, Optional

from ...db.session import get_db
from ...models.user import User
from ...api.deps import get_current_user
from ...repositories.portal_items import portal_items_repo

router = APIRouter()

@router.get("/client", response_model=Dict[str, Any])
def get_client_dashboard(
    client_id: Optional[int] = Query(None, description="The client ID to query dashboard metrics for"),
    db = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve client dashboard summary with data scoping checks.
    """
    target_client_id = client_id
    if current_user.role not in ["admin", "gff_admin"]:
        if current_user.client_id is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User does not belong to any client account."
            )
        if target_client_id is not None and target_client_id != current_user.client_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied to requested client's dashboard."
            )
        target_client_id = current_user.client_id
    else:
        # Admin defaults to client_id = 1 if none provided
        if target_client_id is None:
            target_client_id = 1

    projects_count = len(portal_items_repo.list_items("PROJECT", client_id=str(target_client_id)))
    tickets_count = len(portal_items_repo.list_items("SUPPORT", client_id=str(target_client_id)))

    return {
        "success": True,
        "client_id": target_client_id,
        "summary": {
            "projects_count": projects_count,
            "tickets_count": tickets_count
        }
    }

