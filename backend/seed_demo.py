"""
EvalWrite AI — Local Demo Account Seed Script
Seeds a local demo user account for demonstration and testing purposes.
Safe for development only: disabled in production, does not overwrite existing accounts.
"""

import os
import sys
from dotenv import load_dotenv

# Load local environment variables
load_dotenv()

from typing import Optional
from sqlalchemy.orm import Session
from database import engine, SessionLocal, Base
from models import User
from security import hash_password


def seed_demo_account(db_session: Optional[Session] = None, force: bool = False) -> bool:
    environment = os.getenv("ENVIRONMENT", "development").lower()

    if environment == "production":
        print("[ERROR] Demo account seeding is strictly disabled in production environments.")
        return False

    # Initialize tables if not already present
    if db_session is None:
        Base.metadata.create_all(bind=engine)

    demo_email = os.getenv("DEMO_USER_EMAIL", "evaluator@evalwrite.edu").strip().lower()
    demo_password = os.getenv("DEMO_USER_PASSWORD", "AcademicEval2026!")
    demo_name = os.getenv("DEMO_USER_NAME", "Dr. Sarah Chen")

    close_db_when_done = False
    if db_session is not None:
        db = db_session
    else:
        db = SessionLocal()
        close_db_when_done = True

    try:
        existing = db.query(User).filter(User.email == demo_email).first()

        if existing:
            if not force:
                print(f"[INFO] Demo account '{demo_email}' already exists. Skipping seed to prevent silent overwrites.")
                print(f"       Use --force to overwrite password if explicitly intended.")
                return False
            else:
                existing.hashed_password = hash_password(demo_password)
                existing.full_name = demo_name
                existing.is_demo = True
                db.commit()
                print(f"[SUCCESS] Updated demo account password for: {demo_email}")
                return True

        hashed = hash_password(demo_password)
        demo_user = User(
            email=demo_email,
            full_name=demo_name,
            hashed_password=hashed,
            role="Lead Academic Reviewer",
            is_demo=True,
        )
        db.add(demo_user)
        db.commit()

        print("============================================================")
        print("  EvalWrite AI — Development Demo Account Successfully Seeded")
        print("============================================================")
        print(f"  Email:    {demo_email}")
        print(f"  Password: {demo_password}")
        print(f"  Role:     {demo_user.role}")
        print(f"  Status:   Development Demo Account (is_demo=True)")
        print("============================================================")
        print("  NOTE: This account is intended for local evaluation only.")
        print("============================================================")
        return True

    finally:
        if close_db_when_done:
            db.close()


if __name__ == "__main__":
    force_overwrite = "--force" in sys.argv
    seed_demo_account(force=force_overwrite)
