from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Annotated

from ...db.session import get_db
from ...models.client_account import ClientAccount
from ...models.user import User
from ...schemas.client_account import ClientAccountCreate, ClientAccountUpdate, ClientAccountResponse
from ...api.deps import require_admin
from ...services.logger import SystemLoggerService
from ...schemas.system_log import SystemLogCreate

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
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    query = db.query(ClientAccount)
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            ClientAccount.name.ilike(search_filter) |
            ClientAccount.industry.ilike(search_filter) |
            ClientAccount.region.ilike(search_filter) |
            ClientAccount.account_owner.ilike(search_filter)
        )
    if status:
        query = query.filter(ClientAccount.status == status)
    if industry:
        query = query.filter(ClientAccount.industry.ilike(f"%{industry}%"))
    if region:
        query = query.filter(ClientAccount.region.ilike(f"%{region}%"))
    final_offset = offset if offset is not None else skip
    return query.offset(final_offset).limit(limit).all()

@router.get("/{client_id}", response_model=ClientAccountResponse)
def get_client(
    client_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    client = db.query(ClientAccount).filter(ClientAccount.id == client_id).first()
    if not client:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client account not found")
    return client

@router.post("", response_model=ClientAccountResponse, status_code=201)
def create_client(
    client_in: ClientAccountCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    existing = db.query(ClientAccount).filter(ClientAccount.name == client_in.name).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"A client account with name '{client_in.name}' already exists."
        )
    db_client = ClientAccount(
        name=client_in.name,
        industry=client_in.industry,
        region=client_in.region,
        status=client_in.status,
        account_owner=client_in.account_owner
    )
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
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
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    client = db.query(ClientAccount).filter(ClientAccount.id == client_id).first()
    if not client:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client account not found")
    update_data = client_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(client, field, value)
    db.add(client)
    db.commit()
    db.refresh(client)
    SystemLoggerService.create_log(
        db,
        SystemLogCreate(
            level="INFO",
            message=f"ClientAccount '{client.name}' (ID: {client.id}) updated by Admin {current_user.email}.",
            module="client_management"
        )
    )
    return client

@router.delete("/{client_id}", response_model=ClientAccountResponse)
def delete_client(
    client_id: int,
    hard_delete: bool = Query(False),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    client = db.query(ClientAccount).filter(ClientAccount.id == client_id).first()
    if not client:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client account not found")
    if hard_delete:
        client_name = client.name
        industry = client.industry
        region = client.region
        account_owner = client.account_owner
        created_at = client.created_at
        db.delete(client)
        db.commit()
        SystemLoggerService.create_log(
            db,
            SystemLogCreate(
                level="WARNING",
                message=f"ClientAccount '{client_name}' (ID: {client_id}) deleted by Admin {current_user.email}.",
                module="client_management"
            )
        )
        return ClientAccountResponse(
            id=client_id,
            name=client_name,
            industry=industry,
            region=region,
            status="deleted",
            account_owner=account_owner,
            created_at=created_at
        )
    else:
        client.status = "archived"
        db.add(client)
        db.commit()
        db.refresh(client)
        SystemLoggerService.create_log(
            db,
            SystemLogCreate(
                level="INFO",
                message=f"ClientAccount '{client.name}' (ID: {client.id}) soft-archived by Admin {current_user.email}.",
                module="client_management"
            )
        )
        return client

