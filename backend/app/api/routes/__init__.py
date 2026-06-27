from fastapi import APIRouter
from .health import router as health_router
from .logs import router as logs_router
from .auth import router as auth_router

api_router = APIRouter()

# Include sub-routers with prefix and tags
api_router.include_router(health_router, prefix="/health", tags=["system-health"])
api_router.include_router(logs_router, prefix="/logs", tags=["system-logs"])
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
