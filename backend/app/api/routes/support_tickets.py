from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from typing import List, Optional

from ...db.session import get_db
from ...models.support_ticket import SupportTicket
from ...models.user import User
from ...schemas.support_ticket import SupportTicketResponse, SupportTicketCreate
from ...api.deps import get_current_user

router = APIRouter()

@router.post("", response_model=SupportTicketResponse, status_code=201)
def create_support_ticket(
    ticket_in: SupportTicketCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a support ticket. Client users can only create support tickets for their own client account.
    """
    if current_user.role not in ["admin", "gff_admin"]:
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
        description=ticket_in.description
    )
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket

@router.get("", response_model=List[SupportTicketResponse])
def list_support_tickets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    List support tickets scoped to user's client account unless admin.
    """
    query = db.query(SupportTicket)
    if current_user.role not in ["admin", "gff_admin"]:
        query = query.filter(SupportTicket.client_id == current_user.client_id)
    return query.all()
