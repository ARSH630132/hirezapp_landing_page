from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
import datetime
from ..db.base_class import Base

class GovernanceItem(Base):
    __tablename__ = "governance_items"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("client_accounts.id", ondelete="CASCADE"), nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(255), nullable=False)
    severity = Column(String(50), nullable=True)
    status = Column(String(50), default="active", nullable=False)
    owner = Column(String(255), nullable=True)
    due_date = Column(DateTime, nullable=True)
    description = Column(String(2000), nullable=True)

    # Relationships
    client = relationship("ClientAccount", back_populates="governance_items")
    project = relationship("Project", back_populates="governance_items")
