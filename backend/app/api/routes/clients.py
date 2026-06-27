from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional, Annotated

from ...db.session import get_db
from ...models.user import User
from ...schemas.client_account import ClientAccountCreate, ClientAccountUpdate, ClientAccountResponse
from ...api.deps import require_admin
from ...services.logger import SystemLoggerService
from ...schemas.system_log import SystemLogCreate
from ...repositories.clients import clients_repo

router = APIRouter()

@router.get("", response_model=List[ClientAccountResponse])
def list_clients(
    search: Annotated[Optional[str], Query(description="Search term for name, industry, region, or owner")] = None,
    status: Annotated[Optional[str], Query(description="Filter by client status")] = None,
    industry: Annotated[Optional[str], Query(description="Filter by client industry")] = None,
    region: Annotated[Optional[str], Query(description="Filter by client region")] = None,
    limit: Annotated[int, Query(ge=1, le=1000)] = 100,
    skip: Annotated[int, Query(ge=0)] = 0,
    offset: Annotated[Optional[int], Query(ge=0)] = None,
    db = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    clients = clients_repo.list_all()
    if search:
        s = search.lower()
        clients = [
            c for c in clients
            if s in c.name.lower() or s in c.industry.lower() or s in c.region.lower() or s in c.account_owner.lower()
        ]
    if status:
        clients = [c for c in clients if c.status == status]
    if industry:
        clients = [c for c in clients if industry.lower() in c.industry.lower()]
    if region:
        clients = [c for c in clients if region.lower() in c.region.lower()]
    final_offset = offset if offset is not None else skip
    return clients[final_offset:final_offset + limit]

@router.get("/{client_id}", response_model=ClientAccountResponse)
def get_client(
    client_id: int,
    db = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    client = clients_repo.get_by_id(str(client_id))
    if not client:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client account not found")
    return client

@router.post("", response_model=ClientAccountResponse, status_code=201)
def create_client(
    client_in: ClientAccountCreate,
    db = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    existing = clients_repo.get_by_name(client_in.name)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"A client account with name '{client_in.name}' already exists."
        )
    db_client = clients_repo.create(client_in.model_dump())
    SystemLoggerService.create_log(
        db,
        SystemLogCreate(
            level="INFO",
            message=f"ClientAccount '{db_client.name}' (ID: {db_client.id}) created by Admin {current_user.email}.",
            module="client_management"
        )
    )
    return db_client

@router.patch("/{client_id}", response_model=ClientAccountResponse)
def update_client(
    client_id: int,
    client_in: ClientAccountUpdate,
    db = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    client = clients_repo.get_by_id(str(client_id))
    if not client:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client account not found")
    db_client = clients_repo.update(str(client_id), client_in.model_dump(exclude_unset=True))
    SystemLoggerService.create_log(
        db,
        SystemLogCreate(
            level="INFO",
            message=f"ClientAccount '{db_client.name}' (ID: {db_client.id}) updated by Admin {current_user.email}.",
            module="client_management"
        )
    )
    return db_client

@router.delete("/{client_id}", response_model=ClientAccountResponse)
def delete_client(
    client_id: int,
    hard_delete: bool = Query(False),
    db = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    client = clients_repo.get_by_id(str(client_id))
    if not client:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client account not found")
    if hard_delete:
        clients_repo.delete(str(client_id))
        SystemLoggerService.create_log(
            db,
            SystemLogCreate(
                level="WARNING",
                message=f"ClientAccount '{client.name}' (ID: {client_id}) deleted by Admin {current_user.email}.",
                module="client_management"
            )
        )
        return client
    else:
        db_client = clients_repo.update(str(client_id), {"status": "archived"})
        SystemLoggerService.create_log(
            db,
            SystemLogCreate(
                level="INFO",
                message=f"ClientAccount '{db_client.name}' (ID: {db_client.id}) soft-archived by Admin {current_user.email}.",
                module="client_management"
            )
        )
        return db_client

