from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.schemas.application import ApplicationResponse, ApplicationStatusUpdate
from app.services.application_service import ApplicationService

router = APIRouter()

@router.post("/{job_id}", response_model=ApplicationResponse)
def apply_to_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return ApplicationService.apply_to_job(db, job_id, current_user)


@router.get("/my-applications", response_model=list[ApplicationResponse])
def my_applications(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return ApplicationService.get_my_applications(db, current_user)


@router.get("/job/{job_id}", response_model=list[ApplicationResponse])
def get_job_applications(
    job_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return ApplicationService.get_job_applications(db, job_id, current_user)


@router.patch("/{application_id}/status", response_model=ApplicationResponse)
def update_application_status(
    application_id: int,
    status_data: ApplicationStatusUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return ApplicationService.update_status(db, application_id, status_data, current_user)


@router.get("/candidate/{candidate_id}/profile")
def get_candidate_profile(
    candidate_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return ApplicationService.get_candidate_profile(db, candidate_id, current_user)