from sqlalchemy.orm import Session
from .base import Base
from .session import engine

def init_db(db: Session = None) -> None:
    """
    Initialize the local SQLite database by creating all tables from the registered SQLAlchemy models.
    """
    Base.metadata.create_all(bind=engine)
