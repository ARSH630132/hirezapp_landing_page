from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
import datetime
from ..db.base_class import Base

class ClientAccount(Base):
    __tablename__ = "client_accounts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    industry = Column(String(100), nullable=True)
    region = Column(String(100), nullable=True)
    status = Column(String(50), default="active", nullable=False)
    account_owner = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    users = relationship("User", back_populates="client", cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="client", cascade="all, delete-orphan")
    agent_operations = relationship("AgentOperation", back_populates="client", cascade="all, delete-orphan")
    documents = relationship("DocumentItem", back_populates="client", cascade="all, delete-orphan")
    invoices = relationship("Invoice", back_populates="client", cascade="all, delete-orphan")
    support_tickets = relationship("SupportTicket", back_populates="client", cascade="all, delete-orphan")
    governance_items = relationship("GovernanceItem", back_populates="client", cascade="all, delete-orphan")
