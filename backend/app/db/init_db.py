from sqlalchemy.orm import Session
from .session import engine

def init_db(db: Session = None) -> None:
    """
    Initialize the local SQLite database by creating all tables from the registered SQLAlchemy models.
    """
    from .base import Base
    Base.metadata.create_all(bind=engine)

