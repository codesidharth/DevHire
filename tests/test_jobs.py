import time
from tests.conftest import client


def test_create_job_and_apply():
    """Verifies end-to-end recruitment cycle: job creation and candidate application with valid authorization headers."""
    unique_id = int(time.time())

    # -------------------------------------------------------------
    # STEP 1: Register and Log In a Recruiter
    # -------------------------------------------------------------
    recruiter_email = f"recruiter_{unique_id}@example.com"
    recruiter_pass = "secure_hr_password"

    reg_recruiter = client.post(
        "/api/v1/auth/register",
        json={
            "username": f"hr_manager_{unique_id}",
            "email": recruiter_email,
            "password": recruiter_pass,
            "role": "recruiter"
        }
    )
    assert reg_recruiter.status_code == 200

    # Log in as the recruiter to generate an access token
    login_recruiter = client.post(
        "/api/v1/auth/login",
        data={
            "username": recruiter_email,
            "password": recruiter_pass
        }
    )
    assert login_recruiter.status_code == 200
    recruiter_token = login_recruiter.json()["access_token"]
    recruiter_headers = {"Authorization": f"Bearer {recruiter_token}"}

    # Post a brand new job opening using numerical formatting for salary constraints
    job_resp = client.post(
        "/api/v1/jobs/",
        headers=recruiter_headers,
        json={
            "title": "Associate Data Analyst",
            "description": "Looking for an MCA graduate proficient in SQL and Power BI.",
            "company": "TechCorp Solutions",
            "location": "Bangalore",
            "salary": 650000
        }
    )
    assert job_resp.status_code in [200, 201]
    job_id = job_resp.json()["id"]

    # -------------------------------------------------------------
    # STEP 2: Register and Log In a Candidate
    # -------------------------------------------------------------
    candidate_email = f"applicant_{unique_id}@example.com"
    candidate_pass = "candidate_password123"

    reg_candidate = client.post(
        "/api/v1/auth/register",
        json={
            "username": f"sid_kumar_{unique_id}",
            "email": candidate_email,
            "password": candidate_pass,
            "role": "candidate"
        }
    )
    assert reg_candidate.status_code == 200

    # Log in as the candidate to generate their access token
    login_candidate = client.post(
        "/api/v1/auth/login",
        data={
            "username": candidate_email,
            "password": candidate_pass
        }
    )
    assert login_candidate.status_code == 200
    candidate_token = login_candidate.json()["access_token"]
    candidate_headers = {"Authorization": f"Bearer {candidate_token}"}

    # Submit an application by passing the job_id directly in the URL path string
    app_resp = client.post(
        f"/api/v1/applications/{job_id}",  # Corrected to Path Parameter syntax
        headers=candidate_headers,
        json={}  # No body payload needed since it maps out of the route path
    )

    assert app_resp.status_code in [200, 201]
    app_data = app_resp.json()
    assert app_data["job_id"] == job_id
    assert app_data["status"] == "applied"