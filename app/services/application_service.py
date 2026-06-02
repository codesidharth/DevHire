from fastapi import HTTPException

from app.models.application import Application
from app.repositories.application_repository import (
    ApplicationRepository,
)
from app.repositories.job_repository import (
    JobRepository,
)


class ApplicationService:

    @staticmethod
    def apply_to_job(
        db,
        job_id,
        current_user
    ):
        if current_user.role != "candidate":
            raise HTTPException(
                status_code=403,
                detail="Only candidates can apply"
            )

        job = JobRepository.get_by_id(
            db,
            job_id
        )

        if not job:
            raise HTTPException(
                status_code=404,
                detail="Job not found"
            )

        existing_application = (
            ApplicationRepository
            .get_by_candidate_and_job(
                db,
                current_user.id,
                job_id
            )
        )

        if existing_application:
            raise HTTPException(
                status_code=400,
                detail="Already applied"
            )

        application = Application(
            candidate_id=current_user.id,
            job_id=job_id
        )

        return ApplicationRepository.create(
            db,
            application
        )

    @staticmethod
    def get_my_applications(
            db,
            current_user
    ):
        if current_user.role != "candidate":
            raise HTTPException(
                status_code=403,
                detail="Only candidates can view applications"
            )

        return (
            ApplicationRepository
            .get_by_candidate(
                db,
                current_user.id
            )
        )

    @staticmethod
    def get_job_applications(
            db,
            job_id,
            current_user
    ):
        job = JobRepository.get_by_id(
            db,
            job_id
        )

        if not job:
            raise HTTPException(
                status_code=404,
                detail="Job not found"
            )

        if job.recruiter_id != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="You do not own this job"
            )

        return (
            ApplicationRepository
            .get_by_job(
                db,
                job_id
            )
        )

    @staticmethod
    def update_status(
            db,
            application_id,
            status_data,
            current_user
    ):
        application = (
            ApplicationRepository
            .get_by_id(
                db,
                application_id
            )
        )

        if not application:
            raise HTTPException(
                status_code=404,
                detail="Application not found"
            )

        job = JobRepository.get_by_id(
            db,
            application.job_id
        )

        if job.recruiter_id != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="You do not own this job"
            )

        application.status = (
            status_data.status.value
        )

        return (
            ApplicationRepository
            .update(
                db,
                application
            )
        )