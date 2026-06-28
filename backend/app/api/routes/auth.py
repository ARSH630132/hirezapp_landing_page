from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from ...db.session import get_db
from ...schemas.auth import AuthLoginResponse
from ...schemas.user import UserCreate, UserResponse
from ...services.auth import AuthService
from ...api.deps import get_current_user

router = APIRouter()

@router.post("/register", response_model=UserResponse, status_code=201)
def register_user(user_in: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user in the enterprise portal.
    """
    user_exists = AuthService.get_user_by_email(db, user_in.email)
    if user_exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists in the system."
        )
    return AuthService.create_user(db, user_in)

@router.post("/login", response_model=AuthLoginResponse)
async def login_access_token(request: Request, db: Session = Depends(get_db)):
    """
    Accept either JSON or form-encoded credentials and issue an access token.
    """
    content_type = (request.headers.get("content-type") or "").lower()

    email = None
    password = None

    if "application/json" in content_type:
        body = await request.json()
        email = body.get("email") or body.get("username")
        password = body.get("password")
    else:
        form = await request.form()
        email = form.get("email") or form.get("username")
        password = form.get("password")

    if not email or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email/username and password are required."
        )

    user = AuthService.authenticate_user(db, str(email), str(password))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password"
        )
    elif not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
        
    access_token = AuthService.create_access_token_for_user(user)
    return AuthLoginResponse(
        access_token=access_token,
        role=user.role,
        user=UserResponse.model_validate(user)
    )

@router.get("/me", response_model=UserResponse)
def get_me(current_user: UserResponse = Depends(get_current_user)):
    """
    Retrieve current authenticated user information.
    """
    return current_user
