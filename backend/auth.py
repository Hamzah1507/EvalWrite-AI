import os
import re
from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from sqlalchemy.orm import Session

from database import get_db
from models import User, UserSession
from security import (
    hash_password,
    verify_password,
    generate_session_token,
    get_session_expiry,
    is_rate_limited,
    record_failed_attempt,
    clear_failed_attempts,
    SESSION_COOKIE_NAME,
    SESSION_DURATION_DAYS,
)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

IS_PRODUCTION = os.getenv("ENVIRONMENT", "development").lower() == "production"


# Pydantic Schemas
class SignupRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)

    @classmethod
    def validate_password_strength(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        if not re.search(r"[A-Za-z]", v) or not re.search(r"\d", v):
            raise ValueError("Password must contain at least one letter and one number")
        return v


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    is_demo: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class DemoStatusResponse(BaseModel):
    is_seeded: bool
    demo_email: Optional[str] = None
    demo_password_hint: Optional[str] = None
    environment: str


def set_auth_cookie(response: Response, session_token: str) -> None:
    """Sets a secure HttpOnly session cookie."""
    response.set_cookie(
        key=SESSION_COOKIE_NAME,
        value=session_token,
        max_age=SESSION_DURATION_DAYS * 24 * 3600,
        httponly=True,
        samesite="lax",
        secure=IS_PRODUCTION,
        path="/",
    )


def clear_auth_cookie(response: Response) -> None:
    """Clears the session cookie."""
    response.delete_cookie(
        key=SESSION_COOKIE_NAME,
        path="/",
        httponly=True,
        samesite="lax",
    )


def get_current_user(request: Request, db: Session = Depends(get_db)) -> User:
    """Dependency that authenticates the user using the session cookie."""
    session_token = request.cookies.get(SESSION_COOKIE_NAME)
    if not session_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. No active session.",
        )

    # Look up session in database
    session_record = (
        db.query(UserSession)
        .filter(UserSession.id == session_token)
        .first()
    )

    if not session_record:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session token.",
        )

    # Check expiration
    # Ensure timezone awareness for comparison
    expires_at = session_record.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    if expires_at < datetime.now(timezone.utc):
        db.delete(session_record)
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session has expired. Please sign in again.",
        )

    user = db.query(User).filter(User.id == session_record.user_id).first()
    if not user:
        db.delete(session_record)
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User associated with this session no longer exists.",
        )

    return user


@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def signup(payload: SignupRequest, request: Request, response: Response, db: Session = Depends(get_db)):
    """Registers a new user account with Argon2id password hashing and logs them in."""
    # Validate password rules
    if len(payload.password) < 8 or not re.search(r"[A-Za-z]", payload.password) or not re.search(r"\d", payload.password):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Password must be at least 8 characters long and contain both letters and numbers.",
        )

    normalized_email = payload.email.strip().lower()

    # Check for existing email
    existing = db.query(User).filter(User.email == normalized_email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email address already exists.",
        )

    # Create new user
    hashed = hash_password(payload.password)
    new_user = User(
        email=normalized_email,
        full_name=payload.full_name.strip(),
        hashed_password=hashed,
        role="Faculty Reviewer",
        is_demo=False,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Create session
    session_token = generate_session_token()
    client_ip = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")

    user_session = UserSession(
        id=session_token,
        user_id=new_user.id,
        expires_at=get_session_expiry(),
        ip_address=client_ip,
        user_agent=user_agent[:512] if user_agent else None,
    )
    db.add(user_session)
    db.commit()

    set_auth_cookie(response, session_token)
    return new_user


@router.post("/login", response_model=UserResponse)
def login(payload: LoginRequest, request: Request, response: Response, db: Session = Depends(get_db)):
    """Authenticates a user, checks rate limiting, and issues a secure session cookie."""
    normalized_email = payload.email.strip().lower()
    client_ip = request.client.host if request.client else "unknown"

    # Rate limiting protection
    rate_limit_key = f"{client_ip}:{normalized_email}"
    if is_rate_limited(rate_limit_key) or is_rate_limited(client_ip):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many failed login attempts. Please wait 5 minutes before trying again.",
        )

    user = db.query(User).filter(User.email == normalized_email).first()
    if not user or not verify_password(user.hashed_password, payload.password):
        record_failed_attempt(rate_limit_key)
        record_failed_attempt(client_ip)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    # Successful login: clear rate limiting counters
    clear_failed_attempts(rate_limit_key)
    clear_failed_attempts(client_ip)

    # Issue session token
    session_token = generate_session_token()
    user_agent = request.headers.get("user-agent")

    user_session = UserSession(
        id=session_token,
        user_id=user.id,
        expires_at=get_session_expiry(),
        ip_address=client_ip,
        user_agent=user_agent[:512] if user_agent else None,
    )
    db.add(user_session)
    db.commit()

    set_auth_cookie(response, session_token)
    return user


@router.get("/me", response_model=UserResponse)
def get_authenticated_user(current_user: User = Depends(get_current_user)):
    """Returns the authenticated user details for the active session."""
    return current_user


@router.post("/logout")
def logout(request: Request, response: Response, db: Session = Depends(get_db)):
    """Invalidates the active session and clears the authentication cookie."""
    session_token = request.cookies.get(SESSION_COOKIE_NAME)
    if session_token:
        session_record = (
            db.query(UserSession)
            .filter(UserSession.id == session_token)
            .first()
        )
        if session_record:
            db.delete(session_record)
            db.commit()

    clear_auth_cookie(response)
    return {"message": "Successfully logged out."}


@router.get("/demo-status", response_model=DemoStatusResponse)
def demo_status(db: Session = Depends(get_db)):
    """Provides information on whether a local demo account is seeded (development only)."""
    env = os.getenv("ENVIRONMENT", "development").lower()
    demo_email = os.getenv("DEMO_USER_EMAIL", "evaluator@evalwrite.edu").lower()

    if env == "production":
        return DemoStatusResponse(
            is_seeded=False,
            demo_email=None,
            demo_password_hint=None,
            environment="production",
        )

    demo_user = db.query(User).filter(User.email == demo_email).first()
    is_seeded = demo_user is not None and demo_user.is_demo

    return DemoStatusResponse(
        is_seeded=is_seeded,
        demo_email=demo_email if is_seeded else None,
        demo_password_hint=os.getenv("DEMO_USER_PASSWORD", "AcademicEval2026!") if is_seeded else None,
        environment=env,
    )
