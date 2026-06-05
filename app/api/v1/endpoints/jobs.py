from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)
from sqlalchemy.orm import Session

from app.api.deps import (
    get_db,
    get_current_user,
)
from app.core.permissions import require_role
from app.schemas.job import (
    JobCreate,
    JobUpdate,
    JobResponse,
)
from app.services.job_service import JobService
from app.models.job import Job

router = APIRouter()

# 1. Stats route moved to the TOP so it is matched before /{job_id}
@router.get("/stats")
def get_recruiter_stats(
        db: Session = Depends(get_db),
        current_user=Depends(get_current_user),
):
    require_role(current_user, ["recruiter", "admin"])

    active_jobs = db.query(Job).filter(
        Job.recruiter_id == current_user.id,
        Job.is_active == True
    ).count()

    return {
        "active_jobs": active_jobs,
        "applications": 0,
        "interviews": 0
    }

# 2. Other routes follow
@router.post("/", response_model=JobResponse)
def create_job(
    job: JobCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    require_role(current_user, ["recruiter", "admin"])
    return JobService.create_job(db, job, current_user.id)

@router.get("/", response_model=list[JobResponse])
def get_jobs(
    page: int = 1,
    limit: int = 10,
    db: Session = Depends(get_db),
):
    skip = (page - 1) * limit
    return JobService.get_jobs(db, skip, limit)

@router.get("/search", response_model=list[JobResponse])
def search_jobs(
    keyword: str,
    db: Session = Depends(get_db),
):
    return JobService.search_jobs(db, keyword)

@router.get("/{job_id}", response_model=JobResponse)
def get_job(
    job_id: int,
    db: Session = Depends(get_db),
):
    job = JobService.get_job_by_id(db, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.put("/{job_id}", response_model=JobResponse)
def update_job(
    job_id: int,
    job_data: JobUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    require_role(current_user, ["recruiter", "admin"])
    return JobService.update_job(db, job_id, job_data, current_user)

@router.delete("/{job_id}")
def delete_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    require_role(current_user, ["recruiter", "admin"])
    JobService.delete_job(db, job_id, current_user)
    return {"message": "Job deleted successfully"}