import datetime
from typing import Optional, List
from ..core.config import settings
from .dynamodb_client import db_manager

class DynamoUser:
    def __init__(self, data: dict):
        self.email = data.get("email")
        self.hashed_password = data.get("hashed_password")
        self.full_name = data.get("full_name") or data.get("name") or self.email
        self.name = self.full_name
        self.role = data.get("role") or "client_member"
        self.status = data.get("status") or "active"
        
        self.client_id = data.get("client_id")
        if self.client_id is not None:
            try:
                self.client_id = int(self.client_id)
            except ValueError:
                pass
                
        self.is_active = data.get("is_active") if data.get("is_active") is not None else True
        
        self.id = data.get("id")
        if self.id is None:
            known_ids = {
                "gff_admin@gff.ai": 1,
                "client_admin@apex.com": 2,
                "client_member@apex.com": 3,
                "admin@gff.ai": 4,
                "client@chevron.com": 5
            }
            self.id = known_ids.get(self.email) or (abs(hash(self.email)) % 1000000)
            
        c_at = data.get("created_at")
        if isinstance(c_at, str):
            try:
                self.created_at = datetime.datetime.fromisoformat(c_at.replace("Z", "+00:00"))
            except ValueError:
                self.created_at = datetime.datetime.utcnow()
        elif isinstance(c_at, datetime.datetime):
            self.created_at = c_at
        else:
            self.created_at = datetime.datetime.utcnow()
            
        u_at = data.get("updated_at") or c_at
        if isinstance(u_at, str):
            try:
                self.updated_at = datetime.datetime.fromisoformat(u_at.replace("Z", "+00:00"))
            except ValueError:
                self.updated_at = datetime.datetime.utcnow()
        elif isinstance(u_at, datetime.datetime):
            self.updated_at = u_at
        else:
            self.updated_at = datetime.datetime.utcnow()
        
    def to_dict(self):
        return {
            "email": self.email,
            "hashed_password": self.hashed_password,
            "full_name": self.full_name,
            "name": self.name,
            "role": self.role,
            "status": self.status,
            "client_id": str(self.client_id) if self.client_id is not None else None,
            "is_active": self.is_active,
            "id": self.id,
            "created_at": self.created_at.isoformat() if isinstance(self.created_at, datetime.datetime) else self.created_at,
            "updated_at": self.updated_at.isoformat() if isinstance(self.updated_at, datetime.datetime) else self.updated_at
        }

class UsersRepository:
    def __init__(self):
        self.table = db_manager.get_table(settings.DYNAMODB_USERS_TABLE)

    def get_by_email(self, email: str) -> Optional[DynamoUser]:
        try:
            res = self.table.get_item(Key={"email": email})
            item = res.get("Item")
            if item:
                return DynamoUser(item)
        except Exception:
            pass
        return None

    def create(self, user_data: dict) -> DynamoUser:
        user = DynamoUser(user_data)
        self.table.put_item(Item=user.to_dict())
        return user

    def update(self, email: str, update_data: dict) -> Optional[DynamoUser]:
        user = self.get_by_email(email)
        if not user:
            return None
        data = user.to_dict()
        data.update(update_data)
        updated = DynamoUser(data)
        self.table.put_item(Item=updated.to_dict())
        return updated

    def delete(self, email: str) -> bool:
        user = self.get_by_email(email)
        if not user:
            return False
        self.table.delete_item(Key={"email": email})
        return True

    def list_users(self) -> List[DynamoUser]:
        res = self.table.scan()
        return [DynamoUser(item) for item in res.get("Items", [])]

users_repo = UsersRepository()

