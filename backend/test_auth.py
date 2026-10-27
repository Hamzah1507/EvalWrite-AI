import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.pool import StaticPool
from sqlalchemy.orm import sessionmaker

from database import Base, get_db
from main import app
from security import clear_failed_attempts, SESSION_COOKIE_NAME

# Test database setup (in-memory SQLite for isolated test runs)
TEST_DATABASE_URL = "sqlite:///:memory:"
test_engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


@pytest.fixture(autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=test_engine)

    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    yield
    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=test_engine)


@pytest.fixture
def client():
    return TestClient(app)


def test_health_check(client):
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"


def test_signup_success(client):
    res = client.post(
        "/api/auth/signup",
        json={
            "full_name": "Dr. Sarah Chen",
            "email": "sarah.chen@evalwrite.edu",
            "password": "SecurePassword123!",
        },
    )
    assert res.status_code == 201
    data = res.json()
    assert data["email"] == "sarah.chen@evalwrite.edu"
    assert data["full_name"] == "Dr. Sarah Chen"
    assert "id" in data
    # Verify session cookie was set
    assert SESSION_COOKIE_NAME in res.cookies


def test_signup_duplicate_email_rejected(client):
    user_data = {
        "full_name": "Duplicate User",
        "email": "duplicate@evalwrite.edu",
        "password": "SecurePassword123!",
    }
    res1 = client.post("/api/auth/signup", json=user_data)
    assert res1.status_code == 201

    res2 = client.post("/api/auth/signup", json=user_data)
    assert res2.status_code == 409
    assert "already exists" in res2.json()["detail"].lower()


def test_signup_weak_password_rejected(client):
    res = client.post(
        "/api/auth/signup",
        json={
            "full_name": "Weak Pass",
            "email": "weak@evalwrite.edu",
            "password": "short",  # Less than 8 chars
        },
    )
    assert res.status_code in [422, 400]


def test_login_success(client):
    # Register user first
    client.post(
        "/api/auth/signup",
        json={
            "full_name": "Professor Marcus",
            "email": "marcus@evalwrite.edu",
            "password": "ValidPassword999!",
        },
    )

    # Login
    res = client.post(
        "/api/auth/login",
        json={
            "email": "marcus@evalwrite.edu",
            "password": "ValidPassword999!",
        },
    )
    assert res.status_code == 200
    assert res.json()["email"] == "marcus@evalwrite.edu"
    assert SESSION_COOKIE_NAME in res.cookies


def test_login_invalid_password(client):
    client.post(
        "/api/auth/signup",
        json={
            "full_name": "Professor Marcus",
            "email": "marcus@evalwrite.edu",
            "password": "ValidPassword999!",
        },
    )

    res = client.post(
        "/api/auth/login",
        json={
            "email": "marcus@evalwrite.edu",
            "password": "WrongPassword123!",
        },
    )
    assert res.status_code == 401
    assert "invalid email or password" in res.json()["detail"].lower()


def test_unauthorized_access_rejected(client):
    # Attempting to access /api/auth/me without cookie
    res = client.get("/api/auth/me")
    assert res.status_code == 401


def test_authenticated_me_flow(client):
    # Sign up
    client.post(
        "/api/auth/signup",
        json={
            "full_name": "Elena Rostova",
            "email": "elena@evalwrite.edu",
            "password": "Password2026!",
        },
    )

    # Request /api/auth/me (cookies automatically sent by TestClient)
    res = client.get("/api/auth/me")
    assert res.status_code == 200
    data = res.json()
    assert data["email"] == "elena@evalwrite.edu"
    assert data["full_name"] == "Elena Rostova"


def test_logout_invalidates_session(client):
    # Sign up
    client.post(
        "/api/auth/signup",
        json={
            "full_name": "Devon Miller",
            "email": "devon@evalwrite.edu",
            "password": "Password2026!",
        },
    )

    # Verify session is active
    res_me = client.get("/api/auth/me")
    assert res_me.status_code == 200

    # Logout
    res_logout = client.post("/api/auth/logout")
    assert res_logout.status_code == 200

    # Subsequent /api/auth/me request should be rejected (401)
    res_after = client.get("/api/auth/me")
    assert res_after.status_code == 401


def test_rate_limiting_after_repeated_failures(client):
    clear_failed_attempts("testclient:target@evalwrite.edu")
    clear_failed_attempts("testclient")

    # Send 5 failed attempts
    for _ in range(5):
        client.post(
            "/api/auth/login",
            json={"email": "target@evalwrite.edu", "password": "WrongPassword!"},
        )

    # 6th attempt should be throttled with HTTP 429
    res = client.post(
        "/api/auth/login",
        json={"email": "target@evalwrite.edu", "password": "WrongPassword!"},
    )
    assert res.status_code == 429
    assert "too many" in res.json()["detail"].lower()


def test_demo_status_endpoint(client):
    res = client.get("/api/auth/demo-status")
    assert res.status_code == 200
    data = res.json()
    assert "is_seeded" in data
    assert "environment" in data


def test_demo_seed_behavior(client):
    from seed_demo import seed_demo_account
    from models import User

    db = TestingSessionLocal()
    try:
        # First seed should succeed
        created = seed_demo_account(db)
        assert created is True

        user = db.query(User).filter(User.is_demo.is_(True)).first()
        assert user is not None
        assert user.email == "evaluator@evalwrite.edu"

        # Second seed attempt should recognize existing account and not overwrite/error
        created_again = seed_demo_account(db)
        assert created_again is False
    finally:
        db.close()

