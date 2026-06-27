from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from ...db.session import get_db
from ...models.system_log import SystemLog
from ...schemas.system_log import SystemLogCreate, SystemLogResponse
from ...services.logger import SystemLoggerService

router = APIRouter()

@router.get("", response_model=List[SystemLogResponse])
def get_logs(
    limit: int = Query(10, ge=1, le=1000, description="Limit results"),
    offset: int = Query(0, ge=0, description="Offset results"),
    skip: Optional[int] = Query(None, ge=0, description="Skip results (alias for offset)"),
    db: Session = Depends(get_db)
):
    """
    Retrieve the latest local system logs.
    """
    final_offset = offset if skip is None else skip
    return SystemLoggerService.get_latest_logs(db, limit, final_offset)

@router.post("", response_model=SystemLogResponse, status_code=201)
def create_log(log_in: SystemLogCreate, db: Session = Depends(get_db)):
    """
    Create a new system log entry (useful for testing writes).
    """
    return SystemLoggerService.create_log(db, log_in)
