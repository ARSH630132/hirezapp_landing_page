from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from typing import List, Optional
import json
import datetime
from pydantic import BaseModel

from ...db.session import get_db
from ...models.support_ticket import SupportTicket
from ...models.user import User
from ...schemas.support_ticket import SupportTicketResponse, SupportTicketCreate, SupportTicketUpdate
from ...api.deps import get_current_user

router = APIRouter()

class StatusUpdate(BaseModel):
    status: str

class AssignUpdate(BaseModel):
    assigned_to: str

class CommentCreate(BaseModel):
    text: str

@router.post("", response_model=SupportTicketResponse, status_code=201)
def create_support_ticket(
    ticket_in: SupportTicketCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a support ticket. Client users can only create support tickets for their own client account.
    """
    is_admin_or_support = current_user.role in ["admin", "gff_admin", "support_agent"]
    if not is_admin_or_support:
        if current_user.client_id is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User does not belong to any client account."
            )
        if ticket_in.client_id != current_user.client_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only create tickets for your own client account."
            )
            
    db_ticket = SupportTicket(
        client_id=ticket_in.client_id,
        project_id=ticket_in.project_id,
        title=ticket_in.title,
        category=ticket_in.category,
        priority=ticket_in.priority,
        status=ticket_in.status,
        assigned_to=ticket_in.assigned_to,
        created_by=current_user.email,
        description=ticket_in.description,
        comments=ticket_in.comments or "[]"
    )
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket

@router.get("", response_model=List[SupportTicketResponse])
def list_support_tickets(
    status: Optional[str] = None,
    priority: Optional[str] = None,
    category: Optional[str] = None,
    client_id: Optional[int] = None,
    project_id: Optional[int] = None,
    assigned_to: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    List support tickets scoped to user's client account unless admin.
    """
    query = db.query(SupportTicket)
    
    is_admin_or_support = current_user.role in ["admin", "gff_admin", "support_agent"]
    if not is_admin_or_support:
        query = query.filter(SupportTicket.client_id == current_user.client_id)
        if client_id is not None and client_id != current_user.client_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to view other client accounts' tickets."
            )
    else:
        if client_id is not None:
            query = query.filter(SupportTicket.client_id == client_id)
            
    if status is not None:
        query = query.filter(SupportTicket.status.ilike(status))
    if priority is not None:
        query = query.filter(SupportTicket.priority.ilike(priority))
    if category is not None:
        query = query.filter(SupportTicket.category.ilike(category))
    if project_id is not None:
        query = query.filter(SupportTicket.project_id == project_id)
    if assigned_to is not None:
        query = query.filter(SupportTicket.assigned_to.ilike(assigned_to))
    if search is not None:
        search_filter = f"%{search}%"
        query = query.filter(
            SupportTicket.title.ilike(search_filter) |
            SupportTicket.description.ilike(search_filter)
        )
        
    return query.all()


@router.get("/{id}", response_model=SupportTicketResponse)
def get_support_ticket(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get a single support ticket by ID. Scoped to client's account unless admin.
    """
    db_ticket = db.query(SupportTicket).filter(SupportTicket.id == id).first()
    if not db_ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Support ticket not found"
        )
        
    is_admin_or_support = current_user.role in ["admin", "gff_admin", "support_agent"]
    if not is_admin_or_support:
        if db_ticket.client_id != current_user.client_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to access this ticket."
            )
            
    return db_ticket

@router.patch("/{id}", response_model=SupportTicketResponse)
def update_support_ticket(
    id: int,
    ticket_in: SupportTicketUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update a support ticket.
    """
    db_ticket = db.query(SupportTicket).filter(SupportTicket.id == id).first()
    if not db_ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Support ticket not found"
        )
        
    is_admin_or_support = current_user.role in ["admin", "gff_admin", "support_agent"]
    if not is_admin_or_support:
        if db_ticket.client_id != current_user.client_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to modify this ticket."
            )
        if ticket_in.client_id is not None or ticket_in.assigned_to is not None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You cannot change client association or assignment."
            )
            
    update_data = ticket_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_ticket, field, value)
        
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket

@router.patch("/{id}/status", response_model=SupportTicketResponse)
def update_support_ticket_status(
    id: int,
    status_in: StatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update the status of a support ticket.
    """
    db_ticket = db.query(SupportTicket).filter(SupportTicket.id == id).first()
    if not db_ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Support ticket not found"
        )
        
    is_admin_or_support = current_user.role in ["admin", "gff_admin", "support_agent"]
    if not is_admin_or_support:
        if db_ticket.client_id != current_user.client_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to modify this ticket."
            )
            
    db_ticket.status = status_in.status
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket

@router.patch("/{id}/assign", response_model=SupportTicketResponse)
def assign_support_ticket(
    id: int,
    assign_in: AssignUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Assign a support ticket. Only admins/support agents can assign.
    """
    db_ticket = db.query(SupportTicket).filter(SupportTicket.id == id).first()
    if not db_ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Support ticket not found"
        )
        
    is_admin_or_support = current_user.role in ["admin", "gff_admin", "support_agent"]
    if not is_admin_or_support:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators and support agents can assign tickets."
        )
        
    db_ticket.assigned_to = assign_in.assigned_to
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket

@router.post("/{id}/comments", response_model=SupportTicketResponse)
@router.post("/{id}/comment", response_model=SupportTicketResponse)
def add_support_ticket_comment(
    id: int,
    comment_in: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Add a comment to a support ticket.
    """
    db_ticket = db.query(SupportTicket).filter(SupportTicket.id == id).first()
    if not db_ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Support ticket not found"
        )
        
    is_admin_or_support = current_user.role in ["admin", "gff_admin", "support_agent"]
    if not is_admin_or_support:
        if db_ticket.client_id != current_user.client_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to comment on this ticket."
            )
            
    try:
        comments_list = json.loads(db_ticket.comments or "[]")
    except Exception:
        comments_list = []
        
    comments_list.append({
        "sender": current_user.name or current_user.email,
        "text": comment_in.text,
        "timestamp": datetime.datetime.utcnow().isoformat()
    })
    
    db_ticket.comments = json.dumps(comments_list)
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket

@router.delete("/{id}", response_model=SupportTicketResponse)
def delete_support_ticket(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete a support ticket. Only administrators can delete support tickets.
    """
    db_ticket = db.query(SupportTicket).filter(SupportTicket.id == id).first()
    if not db_ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Support ticket not found"
        )
        
    is_admin = current_user.role in ["admin", "gff_admin"]
    if not is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can delete support tickets."
        )
        
    db.delete(db_ticket)
    db.commit()
    return db_ticket

