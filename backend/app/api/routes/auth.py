from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from ...db.session import get_db
from ...schemas.user import Token, UserCreate, UserResponse
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

@router.post("/login", response_model=Token)
def login_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    OAuth2 compatible token login, retrieve access token.
    """
    user = AuthService.authenticate_user(db, form_data.username, form_data.password)
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
    return Token(
        access_token=access_token,
        role=user.role
    )

@router.get("/me", response_model=UserResponse)
def get_me(current_user: UserResponse = Depends(get_current_user)):
    """
    Retrieve current authenticated user information.
    """
    return current_user
