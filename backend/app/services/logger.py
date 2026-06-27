from sqlalchemy.orm import Session
from ..models.system_log import SystemLog
from ..schemas.system_log import SystemLogCreate

class SystemLoggerService:
    @staticmethod
    def get_latest_logs(db: Session, limit: int = 10):
        return db.query(SystemLog).order_by(SystemLog.created_at.desc()).limit(limit).all()

    @staticmethod
    def create_log(db: Session, log_in: SystemLogCreate):
        db_log = SystemLog(
            level=log_in.level,
            message=log_in.message,
            module=log_in.module
        )
        db.add(db_log)
        db.commit()
        db.refresh(db_log)
        return db_log
