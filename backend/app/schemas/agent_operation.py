from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class AgentOperationBase(BaseModel):
    client_id: int
    project_id: Optional[int] = None
    name: str
    agent_type: Optional[str] = None
    status: str = "active"
    health: Optional[str] = None
    owner: Optional[str] = None
    governance_status: Optional[str] = None

class AgentOperationCreate(AgentOperationBase):
    pass

class AgentOperationUpdate(BaseModel):
    client_id: Optional[int] = None
    project_id: Optional[int] = None
    name: Optional[str] = None
    agent_type: Optional[str] = None
    status: Optional[str] = None
    health: Optional[str] = None
    owner: Optional[str] = None
    governance_status: Optional[str] = None

class AgentOperationResponse(AgentOperationBase):
    id: int
    last_activity_at: datetime

    class Config:
        from_attributes = True
