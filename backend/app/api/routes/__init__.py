from fastapi import APIRouter
from .health import router as health_router
from .logs import router as logs_router
from .auth import router as auth_router
from .clients import router as clients_router
from .projects import router as projects_router
from .support_tickets import router as support_tickets_router
from .dashboard import router as dashboard_router
from .documents import router as documents_router

api_router = APIRouter()

# Include sub-routers with prefix and tags
api_router.include_router(health_router, prefix="/health", tags=["system-health"])
api_router.include_router(logs_router, prefix="/logs", tags=["system-logs"])
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(clients_router, prefix="/clients", tags=["clients"])
api_router.include_router(projects_router, prefix="/projects", tags=["projects"])
api_router.include_router(support_tickets_router, prefix="/support-tickets", tags=["support-tickets"])
api_router.include_router(dashboard_router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(documents_router, prefix="/documents", tags=["documents"])

