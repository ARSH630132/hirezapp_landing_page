from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
import datetime
from ..db.base_class import Base

class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("client_accounts.id", ondelete="CASCADE"), nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="SET NULL"), nullable=True)
    invoice_number = Column(String(100), unique=True, index=True, nullable=False)
    status = Column(String(50), default="unpaid", nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(String(10), default="USD")
    due_date = Column(DateTime, nullable=True)
    issued_date = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    client = relationship("ClientAccount", back_populates="invoices")
    project = relationship("Project", back_populates="invoices")
