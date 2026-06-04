import time
from tests.conftest import client


def test_register_user():
    """Test that a new candidate can register successfully."""
    unique_id = int(time.time())
    email = f"user_success_{unique_id}@example.com"

    response = client.post(
        "/api/v1/auth/register",
        json={
            "username": f"user_{unique_id}",
            "email": email,
            "password": "password123",
            "role": "candidate"
        }
    )

    assert response.status_code == 201

    data = response.json()

    assert data["email"] == email
    assert "id" in data or "user_id" in data


def test_register_duplicate_email_fails():
    """Test that duplicate email registration is blocked."""

    unique_id = int(time.time())
    duplicate_email = f"user_duplicate_{unique_id}@example.com"

    # -------------------------------------------------------------
    # First registration (should succeed)
    # -------------------------------------------------------------
    first_resp = client.post(
        "/api/v1/auth/register",
        json={
            "username": f"user_a_{unique_id}",
            "email": duplicate_email,
            "password": "password123",
            "role": "candidate"
        }
    )

    assert first_resp.status_code == 201

    # -------------------------------------------------------------
    # Second registration (should fail)
    # -------------------------------------------------------------
    second_resp = client.post(
        "/api/v1/auth/register",
        json={
            "username": f"user_b_{unique_id}",
            "email": duplicate_email,
            "password": "differentpassword",
            "role": "candidate"
        }
    )

    assert second_resp.status_code == 400