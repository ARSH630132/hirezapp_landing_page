from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
import time
from typing import Dict, Any

from ...db.session import get_db
from ...core.config import settings

router = APIRouter()

@router.get("", response_model=Dict[str, Any])
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
        "status": "ok",
        "app_name": settings.PROJECT_NAME,
        "environment": settings.ENVIRONMENT,
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
