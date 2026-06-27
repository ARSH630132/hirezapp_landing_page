from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ClientAccountBase(BaseModel):
    name: str
    industry: Optional[str] = None
    region: Optional[str] = None
    status: str = "active"
    account_owner: Optional[str] = None

class ClientAccountCreate(ClientAccountBase):
    pass

class ClientAccountUpdate(BaseModel):
    name: Optional[str] = None
    industry: Optional[str] = None
    region: Optional[str] = None
    status: Optional[str] = None
    account_owner: Optional[str] = None

class ClientAccountResponse(ClientAccountBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
