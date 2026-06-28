from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str

class CurrentUserResponse(BaseModel):
    id: int
    email: str
    name: Optional[str] = None
    full_name: Optional[str] = None
    role: str
    client_id: Optional[int] = None
    status: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
