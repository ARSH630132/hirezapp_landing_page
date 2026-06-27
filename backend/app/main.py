import time
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from contextlib import asynccontextmanager

from .core.config import settings
from .db.session import engine
from .db.base import Base
from .api.routes import api_router

# Lifespan for FastAPI (creates DB tables on startup)
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create SQLite database tables automatically on launch for a local MVP setup
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="GFF AI Enterprise Local MVP Backend Platform.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
origins = settings.get_cors_origins()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request timing middleware (for enterprise-grade logging and performance tracking)
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = f"{process_time:.4f}s"
    return response

# Include all V1 API endpoints under settings.API_V1_STR (e.g. /api/v1)
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/", include_in_schema=False)
def root():
    """
    Redirect root path to interactive OpenAPI documentation interface.
    """
    return RedirectResponse(url="/docs")

