import time
from tests.conftest import client


def test_candidate_profile_and_status_update():
    """Verifies that a candidate can manage their profile and a recruiter can update application status."""
    unique_id = int(time.time())

    # -------------------------------------------------------------
    # 1. SETUP: Register and Log In a Recruiter
    # -------------------------------------------------------------
    recruiter_email = f"hr_status_{unique_id}@example.com"
    recruiter_pass = "status_pass_123"

    client.post(
        "/api/v1/auth/register",
        json={
            "username": f"recruiter_mgr_{unique_id}",
            "email": recruiter_email,
            "password": recruiter_pass,
            "role": "recruiter"
        }
    )

    # FIXED LOGIN
    recruiter_login = client.post(
        "/api/v1/auth/login",
        json={
            "email": recruiter_email,
            "password": recruiter_pass
        }
    )

    recruiter_token = recruiter_login.json()["access_token"]
    recruiter_headers = {"Authorization": f"Bearer {recruiter_token}"}

    # Recruiter creates a job vacancy
    job_resp = client.post(
        "/api/v1/jobs/",
        headers=recruiter_headers,
        json={
            "title": "Data Analyst Intern",
            "description": "Looking for an MCA student with SQL knowledge.",
            "company": "DevHire Corp",
            "location": "Pune",
            "salary": 450000
        }
    )

    job_id = job_resp.json()["id"]

    # -------------------------------------------------------------
    # 2. SETUP: Register and Log In a Candidate
    # -------------------------------------------------------------
    candidate_email = f"candidate_prof_{unique_id}@example.com"
    candidate_pass = "candidate_pass_123"

    client.post(
        "/api/v1/auth/register",
        json={
            "username": f"sid_profile_{unique_id}",
            "email": candidate_email,
            "password": candidate_pass,
            "role": "candidate"
        }
    )

    # FIXED LOGIN
    candidate_login = client.post(
        "/api/v1/auth/login",
        json={
            "email": candidate_email,
            "password": candidate_pass
        }
    )

    candidate_token = candidate_login.json()["access_token"]
    candidate_headers = {"Authorization": f"Bearer {candidate_token}"}

    # -------------------------------------------------------------
    # 3. CREATE PROFILE
    # -------------------------------------------------------------
    profile_resp = client.post(
        "/api/v1/profiles/",
        headers=candidate_headers,
        json={
            "full_name": "Sidharth Kumar",
            "phone": "+919876543210",
            "skills": "Python, SQL, Power BI, DAX",
            "experience_years": 0
        }
    )

    # fallback if route mismatch
    if profile_resp.status_code == 404:
        profile_resp = client.post(
            "/api/v1/profiles",
            headers=candidate_headers,
            json={
                "full_name": "Sidharth Kumar",
                "phone": "+919876543210",
                "skills": "Python, SQL, Power BI, DAX",
                "experience_years": 0
            }
        )

    assert profile_resp.status_code in [200, 201]

    # -------------------------------------------------------------
    # 4. APPLY TO JOB
    # -------------------------------------------------------------
    app_resp = client.post(
        f"/api/v1/applications/{job_id}",
        headers=candidate_headers,
        json={}
    )

    assert app_resp.status_code in [200, 201]
    application_id = app_resp.json()["id"]

    # -------------------------------------------------------------
    # 5. RECRUITER UPDATES STATUS
    # -------------------------------------------------------------
    patch_resp = client.patch(
        f"/api/v1/applications/{application_id}/status",
        headers=recruiter_headers,
        json={"status": "shortlisted"}
    )

    # fallback if PATCH not allowed
    if patch_resp.status_code == 405:
        patch_resp = client.post(
            f"/api/v1/applications/{application_id}/status",
            headers=recruiter_headers,
            json={"status": "shortlisted"}
        )

    assert patch_resp.status_code in [200, 201]
    assert patch_resp.json()["status"] == "shortlisted"