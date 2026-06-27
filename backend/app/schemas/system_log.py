from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class SystemLogBase(BaseModel):
    level: str = "INFO"
    message: str
    module: str = "system"

class SystemLogCreate(SystemLogBase):
    pass

class SystemLogResponse(SystemLogBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
