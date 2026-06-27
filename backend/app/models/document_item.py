from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
import datetime
from ..db.base_class import Base

class DocumentItem(Base):
    __tablename__ = "document_items"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("client_accounts.id", ondelete="CASCADE"), nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(255), nullable=False)
    filename = Column(String(255), nullable=True)
    document_type = Column(String(100), nullable=True)
    status = Column(String(50), default="active", nullable=False)
    version = Column(String(50), default="1.0.0")
    owner = Column(String(255), nullable=True)
    visibility = Column(String(50), default="private")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    sha256 = Column(String(255), nullable=True)
    file_size = Column(String(50), nullable=True)
    description = Column(String(1000), nullable=True)
    s3_uri = Column(String(500), nullable=True)

    # Relationships
    client = relationship("ClientAccount", back_populates="documents")
    project = relationship("Project", back_populates="documents")


