from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
import datetime
from ..db.base_class import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=True)
    full_name = Column(String(255), nullable=True)  # Backward compatibility fallback
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default="client_member", nullable=False)  # Roles: client_admin, client_member, gff_admin
    client_id = Column(Integer, ForeignKey("client_accounts.id", ondelete="SET NULL"), nullable=True)
    status = Column(String(50), default="active", nullable=False)  # active, inactive, pending
    is_active = Column(Boolean(), default=True, nullable=False)  # Backward compatibility fallback
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    client = relationship("ClientAccount", back_populates="users")

