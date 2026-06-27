from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
import time
from typing import List, Dict, Any

from .database import get_db
from .models import SystemLog
from .schemas import SystemLogCreate, SystemLogResponse

router = APIRouter()

@router.get("/health", response_model=Dict[str, Any])
def health_check(db: Session = Depends(get_db)):
    """
    Health check endpoint to verify backend service and database connectivity.
    """
    db_status = "unhealthy"
    db_error = None
    try:
        # Simple query to check if DB is responsive
        db.execute(text("SELECT 1"))
        db_status = "healthy"
    except Exception as e:
        db_error = str(e)
    
    return {
        "status": "healthy" if db_status == "healthy" else "degraded",
        "timestamp": time.time(),
        "database": {
            "status": db_status,
            "error": db_error
        },
        "services": {
            "api": "healthy",
            "gff_core": "operational"
        },
        "version": "1.0.0"
    }

@router.get("/logs", response_model=List[SystemLogResponse])
def get_logs(limit: int = 10, db: Session = Depends(get_db)):
    """
    Retrieve the latest local system logs.
    """
    logs = db.query(SystemLog).order_by(SystemLog.created_at.desc()).limit(limit).all()
    return logs

@router.post("/logs", response_model=SystemLogResponse, status_code=201)
def create_log(log_in: SystemLogCreate, db: Session = Depends(get_db)):
    """
    Create a new system log entry (useful for testing writes).
    """
    db_log = SystemLog(
        level=log_in.level,
        message=log_in.message,
        module=log_in.module
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log
