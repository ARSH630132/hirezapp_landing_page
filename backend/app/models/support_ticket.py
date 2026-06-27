from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
import datetime
from ..db.base_class import Base

class SupportTicket(Base):
    __tablename__ = "support_tickets"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("client_accounts.id", ondelete="CASCADE"), nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(255), nullable=False)
    category = Column(String(100), nullable=True)
    priority = Column(String(50), nullable=True)
    status = Column(String(50), default="open", nullable=False)
    assigned_to = Column(String(255), nullable=True)
    created_by = Column(String(255), nullable=True)
    description = Column(String(2000), nullable=True)
    comments = Column(String(4000), nullable=True, default="[]")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    client = relationship("ClientAccount", back_populates="support_tickets")
    project = relationship("Project", back_populates="support_tickets")

