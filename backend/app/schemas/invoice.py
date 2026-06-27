from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class InvoiceBase(BaseModel):
    client_id: int
    project_id: Optional[int] = None
    invoice_number: str
    status: str = "unpaid"
    amount: float
    currency: str = "USD"
    due_date: Optional[datetime] = None

class InvoiceCreate(InvoiceBase):
    pass

class InvoiceUpdate(BaseModel):
    client_id: Optional[int] = None
    project_id: Optional[int] = None
    invoice_number: Optional[str] = None
    status: Optional[str] = None
    amount: Optional[float] = None
    currency: Optional[str] = None
    due_date: Optional[datetime] = None

class InvoiceResponse(InvoiceBase):
    id: int
    issued_date: datetime

    class Config:
        from_attributes = True
