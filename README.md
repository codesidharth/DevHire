---
title: DevHire
colorFrom: blue
colorTo: indigo
sdk: docker
pinned: false
---
# DevHire — Recruitment Platform API

A full-stack recruitment platform built with **FastAPI**, **PostgreSQL**, and **React**. Features role-based access for candidates and recruiters with a complete hiring workflow.

**Live API:** https://codesidharth-devhire.hf.space/docs

---

## Features

**Candidate**
- Register and login with JWT authentication
- Browse and apply to job listings
- Upload resume (PDF)
- Track application status in real time

**Recruiter**
- Post, edit, and delete job listings
- View all applicants per job
- Download candidate resumes
- Update application status (Applied → Reviewing → Shortlisted → Hired)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend Framework | FastAPI (Python 3.10) |
| Database | PostgreSQL (Neon) |
| ORM | SQLAlchemy |
| Authentication | JWT (python-jose) |
| Password Hashing | bcrypt (passlib) |
| Data Validation | Pydantic v2 |
| File Handling | Python multipart |
| Deployment | Docker + Hugging Face Spaces |
| Frontend | React + Tailwind CSS |

---

## Project Structure

---

## API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | /api/v1/auth/register | Register user | No |
| POST | /api/v1/auth/login | Login and get token | No |
| GET | /api/v1/jobs/ | List all jobs | No |
| POST | /api/v1/jobs/ | Post a job | Recruiter |
| GET | /api/v1/jobs/stats | Recruiter stats | Recruiter |
| POST | /api/v1/applications/{job_id} | Apply to job | Candidate |
| GET | /api/v1/applications/my-applications | My applications | Candidate |
| GET | /api/v1/applications/job/{job_id} | Job applicants | Recruiter |
| PATCH | /api/v1/applications/{id}/status | Update status | Recruiter |
| POST | /api/v1/profiles/ | Create profile | Candidate |
| POST | /api/v1/profiles/upload-resume | Upload resume | Candidate |
| GET | /api/v1/profiles/resume/download | Download own resume | Candidate |
| GET | /api/v1/profiles/resume/download/{id} | Download candidate resume | Recruiter |

---

## Running Locally

**Prerequisites:** Python 3.10+, PostgreSQL

```bash
# Clone the repo
git clone https://github.com/codesidharth/DevHire.git
cd DevHire

# Install dependencies
pip install fastapi uvicorn sqlalchemy psycopg2-binary passlib[bcrypt] python-jose[cryptography] python-multipart python-dotenv pydantic[email] alembic httpx email-validator

# Set environment variable
export DATABASE_URL=postgresql://user:password@localhost/devhire

# Run the server
uvicorn app.main:app --reload
```

Or with Docker:

```bash
docker build -t devhire .
docker run -e DATABASE_URL=your_db_url -p 7860:7860 devhire
```

---

## Architecture

## CI/CD Pipeline

Every push to `master` triggers a GitHub Actions workflow that:
1. Installs dependencies using `uv` (ultra-fast Python package manager)
2. Runs the full test suite with `pytest`
3. Deployment to Hugging Face Spaces is automatic on passing tests

---

## Running Tests

```bash
# Install uv
pip install uv

# Sync dependencies
uv sync

# Run tests
uv run pytest
```

---
| Package Manager | uv (Astral) |
| Testing | pytest |
| CI/CD | GitHub Actions |

Role-based access control enforced at the service layer. JWT tokens carry user ID and role, validated on every protected endpoint.

---

## Author

**Sidharth Kumar** — MCA Graduate, Backend Developer  
GitHub: [@codesidharth](https://github.com/codesidharth)  
LinkedIn: [linkedin.com/in/sidharthkumar04](https://linkedin.com/in/sidharthkumar04)