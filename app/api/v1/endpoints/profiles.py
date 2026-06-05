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

router = APIRouter()

@router.post("/", response_model=CandidateProfileResponse)
def create_profile(
    profile_data: CandidateProfileCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return CandidateProfileService.create_profile(db, profile_data, current_user)


@router.get("/me", response_model=Candidat