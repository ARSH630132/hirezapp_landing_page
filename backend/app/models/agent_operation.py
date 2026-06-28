from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
import datetime
from ..db.base_class import Base

class AgentOperation(Base):
    __tablename__ = "agent_operations"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("client_accounts.id", ondelete="CASCADE"), nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="SET NULL"), nullable=True)
    name = Column(String(255), nullable=False)
    agent_type = Column(String(100), nullable=True)
    status = Column(String(50), default="active", nullable=False)
    health = Column(String(50), nullable=True)
    owner = Column(String(255), nullable=True)
    governance_status = Column(String(100), nullable=True)
    last_activity_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    client = relationship("ClientAccount", back_populates="agent_operations")
    project = relationship("Project", back_populates="agent_operations")
