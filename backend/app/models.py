from sqlalchemy import Column, Integer, String, DateTime, Text
import datetime
from .database import Base

class SystemLog(Base):
    __tablename__ = "system_logs"

    id = Column(Integer, primary_key=True, index=True)
    level = Column(String(50), default="INFO")
    message = Column(Text, nullable=False)
    module = Column(String(100), default="system")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
