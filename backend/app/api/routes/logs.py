from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ...db.session import get_db
from ...models.system_log import SystemLog
from ...schemas.system_log import SystemLogCreate, SystemLogResponse
from ...services.logger import SystemLoggerService

router = APIRouter()

@router.get("", response_model=List[SystemLogResponse])
def get_logs(limit: int = 10, db: Session = Depends(get_db)):
    """
    Retrieve the latest local system logs.
    """
    return SystemLoggerService.get_latest_logs(db, limit)

@router.post("", response_model=SystemLogResponse, status_code=201)
def create_log(log_in: SystemLogCreate, db: Session = Depends(get_db)):
    """
    Create a new system log entry (useful for testing writes).
    """
    return SystemLoggerService.create_log(db, log_in)
