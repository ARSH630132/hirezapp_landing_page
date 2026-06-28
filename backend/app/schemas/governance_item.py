from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class GovernanceItemBase(BaseModel):
    client_id: int
    project_id: Optional[int] = None
    title: str
    severity: Optional[str] = None
    status: str = "active"
    owner: Optional[str] = None
    due_date: Optional[datetime] = None
    description: Optional[str] = None

class GovernanceItemCreate(GovernanceItemBase):
    pass

class GovernanceItemUpdate(BaseModel):
    client_id: Optional[int] = None
    project_id: Optional[int] = None
    title: Optional[str] = None
    severity: Optional[str] = None
    status: Optional[str] = None
    owner: Optional[str] = None
    due_date: Optional[datetime] = None
    description: Optional[str] = None

class GovernanceItemResponse(GovernanceItemBase):
    id: int

    class Config:
        from_attributes = True
