import sys
import os
# Adjust path to enable importing from backend.app
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from sqlalchemy.orm import Session
from backend.app.db import SessionLocal, init_db
from backend.app.services.auth import AuthService
from backend.app.services.logger import SystemLoggerService
from backend.app.schemas.user import UserCreate
from backend.app.schemas.system_log import SystemLogCreate

def seed_db():
    print("Initializing database tables via init_db...")
    init_db()
    
    db: Session = SessionLocal()
    try:
        # Check if users already exist
        admin_user = AuthService.get_user_by_email(db, "admin@gff.ai")
        if not admin_user:
            print("Creating default enterprise admin (admin@gff.ai)...")
            AuthService.create_user(
                db,
                UserCreate(
                    email="admin@gff.ai",
                    password="gff_enterprise_admin_pass_2026",
                    full_name="GFF Executive Admin",
                    role="admin"
                )
            )
        
        test_client = AuthService.get_user_by_email(db, "client@chevron.com")
        if not test_client:
            print("Creating default test client (client@chevron.com)...")
            AuthService.create_user(
                db,
                UserCreate(
                    email="client@chevron.com",
                    password="chevron_secure_pass_2026",
                    full_name="Chevron Operations Lead",
                    role="client"
                )
            )
            
        # Seed system initialization log
        print("Creating default system log entries...")
        SystemLoggerService.create_log(
            db,
            SystemLogCreate(
                level="INFO",
                message="Enterprise API initialized and seeded successfully with role definitions.",
                module="system_init"
            )
        )
        print("Database seeding completed successfully.")
        
    except Exception as e:
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
