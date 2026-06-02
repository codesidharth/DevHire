import os

from fastapi import (
    HTTPException,
    UploadFile,
)

from app.models.candidate_profile import (
    CandidateProfile,
)

from app.repositories.candidate_profile_repository import (
    CandidateProfileRepository,
)

from app.utils.file_handler import (
    save_resume,
)


class CandidateProfileService:

    @staticmethod
    def create_profile(
        db,
        profile_data,
        current_user,
    ):
        existing = (
            CandidateProfileRepository
            .get_by_user_id(
                db,
                current_user.id,
            )
        )

        if existing:
            raise HTTPException(
                status_code=400,
                detail="Profile already exists",
            )

        profile = CandidateProfile(
            user_id=current_user.id,
            full_name=profile_data.full_name,
            phone=profile_data.phone,
            skills=profile_data.skills,
            experience_years=profile_data.experience_years,
        )

        return CandidateProfileRepository.create(
            db,
            profile,
        )

    @staticmethod
    def get_my_profile(
        db,
        current_user,
    ):
        profile = (
            CandidateProfileRepository
            .get_by_user_id(
                db,
                current_user.id,
            )
        )

        if not profile:
            raise HTTPException(
                status_code=404,
                detail="Profile not found",
            )

        return profile

    @staticmethod
    def update_profile(
        db,
        profile_data,
        current_user,
    ):
        profile = (
            CandidateProfileRepository
            .get_by_user_id(
                db,
                current_user.id,
            )
        )

        if not profile:
            raise HTTPException(
                status_code=404,
                detail="Profile not found",
            )

        update_data = profile_data.model_dump(
            exclude_unset=True,
        )

        for key, value in update_data.items():
            setattr(profile, key, value)

        return CandidateProfileRepository.update(
            db,
            profile,
        )

    @staticmethod
    def upload_resume(
        db,
        file: UploadFile,
        current_user,
    ):
        profile = (
            CandidateProfileRepository
            .get_by_user_id(
                db,
                current_user.id,
            )
        )

        if not profile:
            raise HTTPException(
                status_code=404,
                detail="Profile not found",
            )

        # Allow only PDF files
        allowed_types = [
            "application/pdf",
        ]

        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail="Only PDF files are allowed",
            )

        # Maximum file size = 5 MB
        MAX_SIZE = 5 * 1024 * 1024

        contents = file.file.read()

        if len(contents) > MAX_SIZE:
            raise HTTPException(
                status_code=400,
                detail="File size must not exceed 5 MB",
            )

        # Reset pointer after reading
        file.file.seek(0)

        # Delete old resume if exists
        if (
            profile.resume_path
            and os.path.exists(
                profile.resume_path
            )
        ):
            os.remove(
                profile.resume_path
            )

        # Save new resume
        file_path = save_resume(
            file,
            current_user.id,
        )

        profile.resume_path = file_path

        return CandidateProfileRepository.update(
            db,
            profile,
        )