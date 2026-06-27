from fastapi import APIRouter, Depends, HTTPException, status, Request, Query
from typing import List, Optional
import json
import datetime
from pydantic import BaseModel

from ...db.session import get_db
from ...models.user import User
from ...schemas.support_ticket import SupportTicketResponse, SupportTicketCreate, SupportTicketUpdate
from ...api.deps import get_current_user
from ...repositories.portal_items import portal_items_repo

router = APIRouter()

class StatusUpdate(BaseModel):
    status: str

class AssignUpdate(BaseModel):
    assigned_to: str

class CommentCreate(BaseModel):
    text: str

def find_ticket(id: int):
    tickets = portal_items_repo.list_items("SUPPORT")
    ticket = next((t for t in tickets if t.id == id), None)
    if not ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Support ticket not found")
    return ticket

@router.post("", response_model=SupportTicketResponse, status_code=201)
def create_support_ticket(
    ticket_in: SupportTicketCreate,
    db = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a support ticket."""
    is_admin_or_support = current_user.role in ["admin", "gff_admin", "support_agent"]
    if not is_admin_or_support:
        if current_user.client_id is None:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User does not belong to any client account.")
        if ticket_in.client_id != current_user.client_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You can only create tickets for your own client account.")
            
    item_data = {
        "project_id": ticket_in.project_id,
        "title": ticket_in.title,
        "category": ticket_in.category,
        "priority": ticket_in.priority,
        "status": ticket_in.status,
        "assigned_to": ticket_in.assigned_to,
        "created_by": current_user.email,
        "description": ticket_in.description,
        "comments": ticket_in.comments or "[]"
    }
    return portal_items_repo.create_item("SUPPORT", str(ticket_in.client_id), item_data)

@router.get("", response_model=List[SupportTicketResponse])
def list_support_tickets(
    status: Optional[str] = None,
    priority: Optional[str] = None,
    category: Optional[str] = None,
    client_id: Optional[int] = None,
    project_id: Optional[int] = None,
    assigned_to: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0),
    skip: Optional[int] = Query(None, ge=0),
    db = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List support tickets scoped to user's client account unless admin."""
    is_admin_or_support = current_user.role in ["admin", "gff_admin", "support_agent"]
    if not is_admin_or_support:
        if client_id is not None and client_id != current_user.client_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to view other client accounts' tickets.")
        query_client_id = str(current_user.client_id)
    else:
        query_client_id = str(client_id) if client_id is not None else None
        
    tickets = portal_items_repo.list_items("SUPPORT", client_id=query_client_id)
    
    if status is not None:
        tickets = [t for t in tickets if t.status.lower() == status.lower()]
    if priority is not None:
        tickets = [t for t in tickets if t.priority.lower() == priority.lower()]
    if category is not None:
        tickets = [t for t in tickets if t.category.lower() == category.lower()]
    if project_id is not None:
        tickets = [t for t in tickets if t.project_id == project_id]
    if assigned_to is not None:
        tickets = [t for t in tickets if t.assigned_to.lower() == assigned_to.lower()]
    if search is not None:
        s = search.lower()
        tickets = [t for t in tickets if s in t.title.lower() or s in t.description.lower()]
        
    final_offset = offset if skip is None else skip
    return tickets[final_offset:final_offset + limit]

@router.get("/{id}", response_model=SupportTicketResponse)
def get_support_ticket(
    id: int,
    db = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a single support ticket by ID."""
    db_ticket = find_ticket(id)
    is_admin_or_support = current_user.role in ["admin", "gff_admin", "support_agent"]
    if not is_admin_or_support and db_ticket.client_id != current_user.client_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to access this ticket.")
    return db_ticket

@router.patch("/{id}", response_model=SupportTicketResponse)
def update_support_ticket(
    id: int,
    ticket_in: SupportTicketUpdate,
    db = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a support ticket."""
    db_ticket = find_ticket(id)
    is_admin_or_support = current_user.role in ["admin", "gff_admin", "support_agent"]
    if not is_admin_or_support:
        if db_ticket.client_id != current_user.client_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to modify this ticket.")
        if ticket_in.client_id is not None or ticket_in.assigned_to is not None:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You cannot change client association or assignment.")
            
    update_data = ticket_in.model_dump(exclude_unset=True)
    return portal_items_repo.update_item("SUPPORT", str(db_ticket.client_id), str(db_ticket.id), update_data)

@router.patch("/{id}/status", response_model=SupportTicketResponse)
def update_support_ticket_status(
    id: int,
    status_in: StatusUpdate,
    db = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update status."""
    db_ticket = find_ticket(id)
    is_admin_or_support = current_user.role in ["admin", "gff_admin", "support_agent"]
    if not is_admin_or_support and db_ticket.client_id != current_user.client_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to modify this ticket.")
    return portal_items_repo.update_item("SUPPORT", str(db_ticket.client_id), str(db_ticket.id), {"status": status_in.status})

@router.patch("/{id}/assign", response_model=SupportTicketResponse)
def assign_support_ticket(
    id: int,
    assign_in: AssignUpdate,
    db = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Assign ticket."""
    db_ticket = find_ticket(id)
    is_admin_or_support = current_user.role in ["admin", "gff_admin", "support_agent"]
    if not is_admin_or_support:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only administrators and support agents can assign tickets.")
    return portal_items_repo.update_item("SUPPORT", str(db_ticket.client_id), str(db_ticket.id), {"assigned_to": assign_in.assigned_to})

@router.post("/{id}/comments", response_model=SupportTicketResponse)
@router.post("/{id}/comment", response_model=SupportTicketResponse)
def add_support_ticket_comment(
    id: int,
    comment_in: CommentCreate,
    db = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add a comment."""
    db_ticket = find_ticket(id)
    is_admin_or_support = current_user.role in ["admin", "gff_admin", "support_agent"]
    if not is_admin_or_support and db_ticket.client_id != current_user.client_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to comment on this ticket.")
            
    try: comments_list = json.loads(db_ticket.comments or "[]")
    except Exception: comments_list = []
        
    comments_list.append({
        "sender": current_user.name or current_user.email,
        "text": comment_in.text,
        "timestamp": datetime.datetime.utcnow().isoformat()
    })
    return portal_items_repo.update_item("SUPPORT", str(db_ticket.client_id), str(db_ticket.id), {"comments": json.dumps(comments_list)})

@router.delete("/{id}", response_model=SupportTicketResponse)
def delete_support_ticket(
    id: int,
    db = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete ticket."""
    db_ticket = find_ticket(id)
    is_admin = current_user.role in ["admin", "gff_admin"]
    if not is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only administrators can delete support tickets.")
    portal_items_repo.delete_item("SUPPORT", str(db_ticket.client_id), str(db_ticket.id))
    return db_ticket

