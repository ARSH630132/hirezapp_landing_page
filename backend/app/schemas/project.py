from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ProjectBase(BaseModel):
    client_id: int
    name: str
    phase: Optional[str] = None
    status: str = "active"
    health: Optional[str] = None
    owner: Optional[str] = None
    start_date: Optional[datetime] = None
    target_date: Optional[datetime] = None
    progress: int = 0
    description: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    client_id: Optional[int] = None
    name: Optional[str] = None
    phase: Optional[str] = None
    status: Optional[str] = None
    health: Optional[str] = None
    owner: Optional[str] = None
    start_date: Optional[datetime] = None
    target_date: Optional[datetime] = None
    progress: Optional[int] = None
    description: Optional[str] = None

class ProjectResponse(ProjectBase):
    id: int

    class Config:
        from_attributes = True
