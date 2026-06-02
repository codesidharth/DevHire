import time
from tests.conftest import client

def test_register_user():
    """Test that a new candidate can register successfully."""
    # Generate a unique timestamp to ensure the email never collides
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

    assert response.status_code == 200
    data = response.json()
    assert data["email"] == email


def test_register_duplicate_email_fails():
    """Test that registering an email that already exists is blocked with a 400 error."""
    unique_id = int(time.time())
    duplicate_email = f"user_duplicate_{unique_id}@example.com"

    # First registration (Succeeds)
    client.post(
        "/api/v1/auth/register",
        json={
            "username": f"user_a_{unique_id}",
            "email": duplicate_email,
            "password": "password123",
            "role": "candidate"
        }
    )

    # Second registration with the EXACT same email (Must fail)
    response = client.post(
        "/api/v1/auth/register",
        json={
            "username": f"user_b_{unique_id}",
            "email": duplicate_email,
            "password": "differentpassword",
            "role": "candidate"
        }
    )

    assert response.status_code == 400