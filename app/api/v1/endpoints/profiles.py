from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import os

from app.api.deps import get_db, get_current_user
from app.schemas.candidate_profile import (
    CandidateProfileCreate,
    CandidateProfileUpdate,
    CandidateProfileResponse,
)
from app.services.candidate_profile_service import CandidateProfileService
from app.repositories.candidate_profile_repository import CandidateProfileRepository

router = APIRouter()

@router.post("/", response_model=CandidateProfileResponse)
def create_profile(
    profile_data: CandidateProfileCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return CandidateProfileService.create_profile(db, profile_data, current_user)


@router.get("/me", response_model=CandidateProfileResponse)
def get_my_profile(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return CandidateProfileService.get_my_profile(db, current_user)


@router.put("/me", response_model=CandidateProfileResponse)
def update_profile(
    profile_data: CandidateProfileUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return CandidateProfileService.update_profile(db, profile_data, current_user)


@router.post("/upload-resume", response_model=CandidateProfileResponse)
def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return CandidateProfileService.upload_resume(db, file, current_user)


@router.get("/resume/download")
def download_my_resume(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    profile = CandidateProfileService.get_my_profile(db, current_user)
    if not profile.resume_path:
        raise HTTPException(status_code=404, detail="No resume uploaded")
    if not os.path.exists(profile.resume_path):
        raise HTTPException(status_code=404, detail="Resume file not found on server")
    return FileResponse(
        path=profile.resume_path,
        media_type="application/pdf",
        filename=f"resume_{current_user.id}.pdf"
    )


@router.get("/resume/download/{candidate_id}")
def download_candidate_resume(
    candidate_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if current_user.role != "recruiter":
        raise HTTPException(status_code=403, detail="Only recruiters can download candidate resumes")

    profile = CandidateProfileRepository.get_by_user_id(db, candidate_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Candidate profile not found")
    if not profile.resume_path:
        raise HTTPException(status_code=404, detail="Candidate has no resume")
    if not os.path.exists(profile.resume_path):
        raise HTTPException(status_code=404, detail="Resume file not found on server")

    return FileResponse(
        path=profile.resume_path,
        media_type="application/pdf",
        filename=f"candidate_{candidate_id}_resume.pdf"
    )