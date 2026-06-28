import time
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse, JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from contextlib import asynccontextmanager

from .core.config import settings
from .db import init_db
from .api.routes import api_router

# Lifespan for FastAPI (creates DB tables on startup)
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize SQLite database tables automatically on launch for a local MVP setup
    init_db()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="GFF AI Enterprise Local MVP Backend Platform.",
    version="1.0.0",
    lifespan=lifespan
)

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    # Map status code to friendly error category
    error_map = {
        400: "Bad Request",
        401: "Unauthorized",
        403: "Forbidden",
        404: "Not Found",
        409: "Conflict",
        422: "Validation Error",
    }
    err_title = error_map.get(exc.status_code, "Error")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": err_title,
            "message": exc.detail,
            "detail": exc.detail
        }
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    # Extract details
    errors = exc.errors()
    # Format a simple message
    messages = []
    for err in errors:
        loc = " -> ".join(str(loc) for loc in err.get("loc", []))
        msg = err.get("msg", "invalid value")
        messages.append(f"{loc}: {msg}")
    detailed_message = "; ".join(messages) or "Validation failed"
    
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "error": "Validation Error",
            "message": detailed_message,
            "detail": detailed_message,
            "errors": errors
        }
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

