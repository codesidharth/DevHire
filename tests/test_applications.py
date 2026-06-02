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
        "username": f"recruiter_user_{unique_id}", "email": recruiter_email, "password": recruiter_pass,
        "role": "recruiter"
    })
    recruiter_token = \
    client.post("/api/v1/auth/login", data={"username": recruiter_email, "password": recruiter_pass}).json()[
        "access_token"]
    recruiter_headers = {"Authorization": f"Bearer {recruiter_token}"}

    job_resp = client.post("/api/v1/jobs/", headers=recruiter_headers, json={
        "title": "Business Analyst", "description": "SQL & Power BI specialist", "company": "DataCorp",
        "location": "Bangalore", "salary": 700000
    })
    job_id = job_resp.json()["id"]

    # -------------------------------------------------------------
    # 2. SETUP: Candidate Registration & Apply
    # -------------------------------------------------------------
    candidate_email = f"cand_app_{unique_id}@example.com"
    candidate_pass = "cand_pass_123"

    client.post("/api/v1/auth/register", json={
        "username": f"sid_app_{unique_id}", "email": candidate_email, "password": candidate_pass, "role": "candidate"
    })
    candidate_token = \
    client.post("/api/v1/auth/login", data={"username": candidate_email, "password": candidate_pass}).json()[
        "access_token"]
    candidate_headers = {"Authorization": f"Bearer {candidate_token}"}

    # Candidate applies to job
    app_resp = client.post(f"/api/v1/applications/{job_id}", headers=candidate_headers, json={})
    assert app_resp.status_code in [200, 201]
    application_id = app_resp.json()["id"]

    # -------------------------------------------------------------
    # 3. TEST: Candidate fetches their own applications
    # -------------------------------------------------------------
    my_apps_resp = client.get("/api/v1/applications/my-applications", headers=candidate_headers)
    assert my_apps_resp.status_code == 200
    my_apps_list = my_apps_resp.json()
    assert isinstance(my_apps_list, list)
    assert any(app["id"] == application_id for app in my_apps_list)

    # -------------------------------------------------------------
    # 4. TEST: Recruiter fetches applications for a specific job
    # -------------------------------------------------------------
    job_apps_resp = client.get(f"/api/v1/applications/job/{job_id}", headers=recruiter_headers)
    assert job_apps_resp.status_code == 200
    job_apps_list = job_apps_resp.json()
    assert isinstance(job_apps_list, list)
    assert any(app["id"] == application_id for app in job_apps_list)

    # -------------------------------------------------------------
    # 5. SECURITY / RBAC TEST: Candidate cannot modify application status
    # -------------------------------------------------------------
    # Candidates shouldn't be allowed to shortlist themselves!
    bad_patch_resp = client.patch(
        f"/api/v1/applications/{application_id}/status",
        headers=candidate_headers,
        json={"status": "shortlisted"}
    )

    # If your router routes POST or PATCH fallback:
    if bad_patch_resp.status_code == 405:
        bad_patch_resp = client.post(
            f"/api/v1/applications/{application_id}/status",
            headers=candidate_headers,
            json={"status": "shortlisted"}
        )

    # Expecting an authorization/permission failure (403 Forbidden or 401 Unauthorized depending on your service layer)
    assert bad_patch_resp.status_code in [401, 403]