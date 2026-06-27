from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class DocumentItemBase(BaseModel):
    client_id: int
    project_id: Optional[int] = None
    title: str
    document_type: Optional[str] = None
    status: str = "active"
    version: str = "1.0.0"
    owner: Optional[str] = None
    visibility: str = "private"

class DocumentItemCreate(DocumentItemBase):
    pass

class DocumentItemUpdate(BaseModel):
    client_id: Optional[int] = None
    project_id: Optional[int] = None
    title: Optional[str] = None
    document_type: Optional[str] = None
    status: Optional[str] = None
    version: Optional[str] = None
    owner: Optional[str] = None
    visibility: Optional[str] = None

class DocumentItemResponse(DocumentItemBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
