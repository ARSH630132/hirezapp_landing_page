import datetime
from typing import Optional, List
from ..core.config import settings
from .dynamodb_client import db_manager

ENTITY_PREFIXES = {"PROJECT": "PROJ#", "AI_OPERATION": "AIOPS#", "DOCUMENT": "DOC#", "INVOICE": "INV#", "SUPPORT": "TICKET#", "GOVERNANCE": "GOV#"}

class DynamoPortalItem:
    def __init__(self, data: dict):
        self.data = dict(data)
        self.PK = data.get("PK")
        self.SK = data.get("SK")
        self.GSI1PK = data.get("GSI1PK")
        self.GSI1SK = data.get("GSI1SK")
        self.entity_type = data.get("entity_type") or "PROJECT"
        self.client_id = data.get("client_id")
        if self.client_id is not None:
            try: self.client_id = int(self.client_id)
            except ValueError: pass
        self.project_id = data.get("project_id")
        if self.project_id is not None:
            try: self.project_id = int(self.project_id)
            except ValueError: pass
        if "id" in data:
            try: self.id = int(data["id"])
            except ValueError: self.id = data["id"]
        else:
            sk = data.get("SK", "")
            if "#" in sk:
                id_val = sk.split("#")[-1]
                try: self.id = int(id_val)
                except ValueError: self.id = id_val
            else: self.id = 1
        for k, v in data.items():
            if k not in ["client_id", "project_id", "id"]:
                setattr(self, k, v)

    def to_dict(self) -> dict:
        res = dict(self.data)
        res["id"] = self.id
        if self.client_id is not None: res["client_id"] = str(self.client_id)
        if self.project_id is not None: res["project_id"] = str(self.project_id)
        return res

class PortalItemsRepository:
    def __init__(self):
        self.table = db_manager.get_table(settings.DYNAMODB_ITEMS_TABLE)

    def _get_next_id(self, entity_type: str) -> int:
        all_items = self.list_items(entity_type)
        max_id = 0
        for item in all_items:
            try:
                val = int(item.id)
                if val > max_id: max_id = val
            except ValueError: pass
        return max_id + 1

    def create_item(self, entity_type: str, client_id: str, data: dict) -> DynamoPortalItem:
        item_id = self._get_next_id(entity_type)
        prefix = ENTITY_PREFIXES.get(entity_type, "ITEM#")
        item_data = dict(data)
        item_data["id"] = item_id
        item_data["client_id"] = str(client_id)
        item_data["entity_type"] = entity_type
        item_data["PK"] = f"CLIENT#{client_id}"
        item_data["SK"] = f"{prefix}{item_id}"
        if entity_type == "PROJECT":
            item_data["GSI1PK"] = f"PROJ#{item_id}"
            item_data["GSI1SK"] = "METADATA"
        elif entity_type in ["AI_OPERATION", "DOCUMENT", "SUPPORT", "GOVERNANCE"]:
            proj_id = data.get("project_id") or "1"
            item_data["GSI1PK"] = f"PROJ#{proj_id}"
            item_data["GSI1SK"] = f"{prefix}{item_id}"
        elif entity_type == "INVOICE":
            ym = datetime.datetime.utcnow().strftime("%Y_%m")
            item_data["GSI1PK"] = f"BILLING_PERIOD#{ym}"
            item_data["GSI1SK"] = f"{prefix}{item_id}"
        if "created_at" not in item_data and "issued_date" not in item_data:
            item_data["created_at"] = datetime.datetime.utcnow().isoformat()
        item = DynamoPortalItem(item_data)
        self.table.put_item(Item=item.to_dict())
        return item

    def get_item(self, entity_type: str, client_id: str, item_id: str) -> Optional[DynamoPortalItem]:
        prefix = ENTITY_PREFIXES.get(entity_type, "ITEM#")
        try:
            res = self.table.get_item(Key={"PK": f"CLIENT#{client_id}", "SK": f"{prefix}{item_id}"})
            item = res.get("Item")
            if item: return DynamoPortalItem(item)
        except Exception: pass
        return None

    def update_item(self, entity_type: str, client_id: str, item_id: str, update_data: dict) -> Optional[DynamoPortalItem]:
        item = self.get_item(entity_type, client_id, item_id)
        if not item: return None
        data = item.to_dict()
        data.update(update_data)
        updated = DynamoPortalItem(data)
        self.table.put_item(Item=updated.to_dict())
        return updated

    def delete_item(self, entity_type: str, client_id: str, item_id: str) -> bool:
        prefix = ENTITY_PREFIXES.get(entity_type, "ITEM#")
        item = self.get_item(entity_type, client_id, item_id)
        if not item: return False
        self.table.delete_item(Key={"PK": f"CLIENT#{client_id}", "SK": f"{prefix}{item_id}"})
        return True

    def list_items(self, entity_type: str, client_id: Optional[str] = None, project_id: Optional[str] = None) -> List[DynamoPortalItem]:
        try:
            res = self.table.scan()
            items = []
            for item in res.get("Items", []):
                if item.get("entity_type") != entity_type: continue
                if client_id is not None and str(item.get("client_id")) != str(client_id): continue
                if project_id is not None and str(item.get("project_id")) != str(project_id): continue
                items.append(DynamoPortalItem(item))
            return items
        except Exception: return []

portal_items_repo = PortalItemsRepository()
