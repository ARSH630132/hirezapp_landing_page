from datetime import timedelta
from typing import Optional
from ..core.security import hash_password, verify_password, create_access_token
from ..core.config import settings
from ..repositories.users import users_repo, DynamoUser
from ..schemas.user import UserCreate

class AuthService:
    @staticmethod
    def get_user_by_email(db, email: str) -> Optional[DynamoUser]:
        return users_repo.get_by_email(email)

    @staticmethod
    def create_user(db, user_in: UserCreate) -> DynamoUser:
        hashed = hash_password(user_in.password)
        user_data = {
            "email": user_in.email,
            "hashed_password": hashed,
            "full_name": user_in.full_name or user_in.email,
            "role": user_in.role,
            "client_id": user_in.client_id,
            "is_active": user_in.is_active
        }
        dynamo_user = users_repo.create(user_data)
        
        # Dual-write to SQLite if db is present
        from app.models.user import User
        try:
            if db is not None:
                # Check if already exists in SQLite to avoid duplication
                existing = db.query(User).filter(User.email == user_in.email).first()
                if not existing:
                    db_user = User(
                        email=user_in.email,
                        hashed_password=hashed,
                        full_name=user_in.full_name,
                        role=user_in.role,
                        is_active=user_in.is_active,
                        client_id=user_in.client_id
                    )
                    db.add(db_user)
                    db.commit()
                    db.refresh(db_user)
        except Exception:
            pass
            
        return dynamo_user

    @staticmethod
    def authenticate_user(db, email: str, password: str) -> Optional[DynamoUser]:
        user = AuthService.get_user_by_email(db, email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

    @staticmethod
    def create_access_token_for_user(user: DynamoUser) -> str:
        expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        return create_access_token(
            subject=user.email,
            user_id=user.email,
            role=user.role,
            client_id=user.client_id,
            email=user.email,
            expires_delta=expires
        )

