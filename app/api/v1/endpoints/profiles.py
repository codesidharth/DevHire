from fastapi import (
    APIRouter,
    Depends,
)

from sqlalchemy.orm import Session

from app.api.deps import (
    get_db,
    get_current_user,
)

from app.schemas.candidate_profile import (
    CandidateProfileCreate,
    CandidateProfileUpdate,
    CandidateProfileResponse,
)

from app.services.candidate_profile_service import (
    CandidateProfileService,
)
from fastapi import UploadFile, File

router = APIRouter()


@router.post(
    "/",
    response_model=CandidateProfileResponse
)
def create_profile(
    profile_data: CandidateProfileCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return (
        CandidateProfileService
        .create_profile(
            db,
            profile_data,
            current_user
        )
    )


@router.get(
    "/me",
    response_model=CandidateProfileResponse
)
def get_my_profile(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return (
        CandidateProfileService
        .get_my_profile(
            db,
            current_user
        )
    )


@router.put(
    "/me",
    response_model=CandidateProfileResponse
)
def update_profile(
    profile_data: CandidateProfileUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return (
        CandidateProfileService
        .update_profile(
            db,
            profile_data,
            current_user
        )
    )

@router.post(
    "/upload-resume",
    response_model=CandidateProfileResponse,
)
def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return (
        CandidateProfileService
        .upload_resume(
            db,
            file,
            current_user,
        )
    )