import datetime
from typing import Optional, List
from ..core.config import settings
from .dynamodb_client import db_manager

class DynamoClient:
    def __init__(self, data: dict):
        self.client_id = str(data.get("client_id") or data.get("id") or "")
        try:
            self.id = int(self.client_id)
        except ValueError:
            self.id = self.client_id
        self.name = data.get("name") or data.get("company_name")
        self.company_name = self.name
        self.industry = data.get("industry")
        self.region = data.get("region")
        self.status = data.get("status", "active")
        self.account_owner = data.get("account_owner", "GFF Partner Team")
        self.created_at = data.get("created_at") or datetime.datetime.utcnow().isoformat()

    def to_dict(self):
        return {
            "client_id": self.client_id,
            "name": self.name,
            "company_name": self.company_name,
            "industry": self.industry,
            "region": self.region,
            "status": self.status,
            "account_owner": self.account_owner,
            "created_at": self.created_at
        }

class ClientsRepository:
    def __init__(self):
        self.table = db_manager.get_table(settings.DYNAMODB_CLIENTS_TABLE)

    def get_by_id(self, client_id: str) -> Optional[DynamoClient]:
        try:
            res = self.table.get_item(Key={"client_id": str(client_id)})
            item = res.get("Item")
            if item:
                return DynamoClient(item)
        except Exception:
            pass
        return None

    def get_by_name(self, name: str) -> Optional[DynamoClient]:
        try:
            res = self.table.scan()
            for item in res.get("Items", []):
                if item.get("name") == name or item.get("company_name") == name:
                    return DynamoClient(item)
        except Exception:
            pass
        return None

    def create(self, client_data: dict) -> DynamoClient:
        # Determine unique client_id
        existing_clients = self.list_all()
        max_id = 0
        for c in existing_clients:
            try:
                val = int(c.client_id)
                if val > max_id:
                    max_id = val
            except ValueError:
                pass
        
        new_id = str(max_id + 1)
        data = dict(client_data)
        data["client_id"] = new_id
        client = DynamoClient(data)
        self.table.put_item(Item=client.to_dict())
        return client

    def update(self, client_id: str, update_data: dict) -> Optional[DynamoClient]:
        client = self.get_by_id(client_id)
        if not client:
            return None
        data = client.to_dict()
        data.update(update_data)
        updated = DynamoClient(data)
        self.table.put_item(Item=updated.to_dict())
        return updated

    def delete(self, client_id: str) -> bool:
        client = self.get_by_id(client_id)
        if not client:
            return False
        self.table.delete_item(Key={"client_id": str(client_id)})
        return True

    def list_all(self) -> List[DynamoClient]:
        try:
            res = self.table.scan()
            return [DynamoClient(item) for item in res.get("Items", [])]
        except Exception:
            return []

clients_repo = ClientsRepository()
