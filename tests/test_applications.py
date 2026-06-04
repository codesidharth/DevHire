import time
from tests.conftest import client


def test_complete_application_lifecycle_and_rbac():
    """Verifies retrieval endpoints (my-applications, job applications) and enforces Role-Based Access Control."""
    unique_id = int(time.time())

    # -------------------------------------------------------------
    # 1. SETUP: Recruiter & Job Creation
    # -------------------------------------------------------------
    recruiter_email = f"hr_app_{unique_id}@example.com"
    recruiter_pass = "secure_hr_123"

    client.post("/api/v1/auth/register", json={
        "username": f"recruiter_user_{unique_id}",
        "email": recruiter_email,
        "password": recruiter_pass,
        "role": "recruiter"
    })

    recruiter_login = client.post(
        "/api/v1/auth/login",
        json={
            "email": recruiter_email,
            "password": recruiter_pass
        }
    )

    recruiter_token = recruiter_login.json()["access_token"]
    recruiter_headers = {"Authorization": f"Bearer {recruiter_token}"}

    job_resp = client.post("/api/v1/jobs/", headers=recruiter_headers, json={
        "title": "Business Analyst",
        "description": "SQL & Power BI specialist",
        "company": "DataCorp",
        "location": "Bangalore",
        "salary": 700000
    })

    job_id = job_resp.json()["id"]

    # -------------------------------------------------------------
    # 2. SETUP: Candidate Registration & Apply
    # -------------------------------------------------------------
    candidate_email = f"cand_app_{unique_id}@example.com"
    candidate_pass = "cand_pass_123"

    client.post("/api/v1/auth/register", json={
        "username": f"sid_app_{unique_id}",
        "email": candidate_email,
        "password": candidate_pass,
        "role": "candidate"
    })

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
    # 3. APPLY TO JOB
    # -------------------------------------------------------------
    app_resp = client.post(
        f"/api/v1/applications/{job_id}",
        headers=candidate_headers,
        json={}
    )

    assert app_resp.status_code in [200, 201]
    application_id = app_resp.json()["id"]

    # -------------------------------------------------------------
    # 4. CANDIDATE: MY APPLICATIONS
    # -------------------------------------------------------------
    my_apps_resp = client.get(
        "/api/v1/applications/my-applications",
        headers=candidate_headers
    )

    assert my_apps_resp.status_code == 200
    my_apps_list = my_apps_resp.json()
    assert isinstance(my_apps_list, list)
    assert any(app["id"] == application_id for app in my_apps_list)

    # -------------------------------------------------------------
    # 5. RECRUITER: JOB APPLICATIONS
    # -------------------------------------------------------------
    job_apps_resp = client.get(
        f"/api/v1/applications/job/{job_id}",
        headers=recruiter_headers
    )

    assert job_apps_resp.status_code == 200
    job_apps_list = job_apps_resp.json()
    assert isinstance(job_apps_list, list)
    assert any(app["id"] == application_id for app in job_apps_list)

    # -------------------------------------------------------------
    # 6. RBAC TEST: Candidate cannot update status
    # -------------------------------------------------------------
    bad_patch_resp = client.patch(
        f"/api/v1/applications/{application_id}/status",
        headers=candidate_headers,
        json={"status": "shortlisted"}
    )

    # fallback if PATCH not supported
    if bad_patch_resp.status_code == 405:
        bad_patch_resp = client.post(
            f"/api/v1/applications/{application_id}/status",
            headers=candidate_headers,
            json={"status": "shortlisted"}
        )

    assert bad_patch_resp.status_code in [401, 403]