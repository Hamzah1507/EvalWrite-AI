import time
import secrets
from collections import defaultdict
from datetime import datetime, timedelta, timezone
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError, InvalidHashError

# Argon2id password hasher with secure default parameters
_ph = PasswordHasher(
    time_cost=3,
    memory_cost=65536,  # 64 MB
    parallelism=4,
    hash_len=32,
    salt_len=16,
)

# Session configuration
SESSION_DURATION_DAYS = 7
SESSION_COOKIE_NAME = "evalwrite_session"

# In-memory rate limiting for login attempts: identifier -> list of failure timestamps
# Identifier is IP address or lowercased email
_failed_attempts: dict[str, list[float]] = defaultdict(list)
RATE_LIMIT_WINDOW_SECONDS = 300  # 5 minutes
MAX_FAILED_ATTEMPTS = 5  # Allow max 5 failed attempts within 5 minutes


def hash_password(password: str) -> str:
    """Hashes a plaintext password using Argon2id."""
    return _ph.hash(password)


def verify_password(hashed_password: str, plain_password: str) -> bool:
    """Verifies a plaintext password against an Argon2id hash."""
    try:
        return _ph.verify(hashed_password, plain_password)
    except (VerifyMismatchError, InvalidHashError):
        return False


def generate_session_token() -> str:
    """Generates a cryptographically strong 43-character URL-safe session token."""
    return secrets.token_urlsafe(32)


def get_session_expiry() -> datetime:
    """Returns the UTC expiry datetime for a new session."""
    return datetime.now(timezone.utc) + timedelta(days=SESSION_DURATION_DAYS)


def is_rate_limited(identifier: str) -> bool:
    """Checks if the identifier has exceeded the maximum allowed failed attempts."""
    now = time.time()
    cutoff = now - RATE_LIMIT_WINDOW_SECONDS
    # Filter attempts to only keep those within the window
    _failed_attempts[identifier] = [t for t in _failed_attempts[identifier] if t > cutoff]
    return len(_failed_attempts[identifier]) >= MAX_FAILED_ATTEMPTS


def record_failed_attempt(identifier: str) -> None:
    """Records a failed authentication attempt."""
    _failed_attempts[identifier].append(time.time())


def clear_failed_attempts(identifier: str) -> None:
    """Clears failed attempts after a successful login."""
    if identifier in _failed_attempts:
        del _failed_attempts[identifier]
