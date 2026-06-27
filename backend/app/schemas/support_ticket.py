from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class SupportTicketBase(BaseModel):
    client_id: int
    project_id: Optional[int] = None
    title: str
    category: Optional[str] = None
    priority: Optional[str] = None
    status: str = "open"
    assigned_to: Optional[str] = None
    created_by: Optional[str] = None
    description: Optional[str] = None

class SupportTicketCreate(SupportTicketBase):
    pass

class SupportTicketUpdate(BaseModel):
    client_id: Optional[int] = None
    project_id: Optional[int] = None
    title: Optional[str] = None
    category: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    assigned_to: Optional[str] = None
    created_by: Optional[str] = None
    description: Optional[str] = None

class SupportTicketResponse(SupportTicketBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
