from sqlalchemy import Column, Integer, String, Boolean, DateTime
import datetime
from ..db.base_class import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    role = Column(String(50), default="user", nullable=False)  # admin, client, user, developer
    is_active = Column(Boolean(), default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
