from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
import datetime
from ..db.base_class import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("client_accounts.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    phase = Column(String(50), nullable=True)
    status = Column(String(50), default="active", nullable=False)
    health = Column(String(50), nullable=True)
    owner = Column(String(255), nullable=True)
    start_date = Column(DateTime, nullable=True)
    target_date = Column(DateTime, nullable=True)
    progress = Column(Integer, default=0)
    description = Column(String(1000), nullable=True)

    # Relationships
    client = relationship("ClientAccount", back_populates="projects")
    agent_operations = relationship("AgentOperation", back_populates="project", cascade="all, delete-orphan")
    documents = relationship("DocumentItem", back_populates="project", cascade="all, delete-orphan")
    invoices = relationship("Invoice", back_populates="project", cascade="all, delete-orphan")
    support_tickets = relationship("SupportTicket", back_populates="project", cascade="all, delete-orphan")
    governance_items = relationship("GovernanceItem", back_populates="project", cascade="all, delete-orphan")
