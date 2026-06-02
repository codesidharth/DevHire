from app.models.job import Job
from app.repositories.job_repository import JobRepository
from fastapi import HTTPException


class JobService:

    @staticmethod
    def create_job(
        db,
        job_data,
        recruiter_id
    ):
        job = Job(
            title=job_data.title,
            description=job_data.description,
            location=job_data.location,
            salary=job_data.salary,
            recruiter_id=recruiter_id
        )

        return JobRepository.create(
            db,
            job
        )

    @staticmethod
    def get_jobs(
            db,
            skip=0,
            limit=10
    ):
        return JobRepository.get_all(
            db,
            skip,
            limit
        )

    @staticmethod
    def get_job_by_id(db, job_id):
        return JobRepository.get_by_id(
            db,
            job_id
        )

    @staticmethod
    def search_jobs(
            db,
            keyword
    ):
        return JobRepository.search_by_title(
            db,
            keyword
        )

    @staticmethod
    def update_job(
            db,
            job_id,
            job_data,
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

        updates = job_data.model_dump(
            exclude_unset=True
        )

        for field, value in updates.items():
            setattr(job, field, value)

        return JobRepository.update(
            db,
            job
        )

    @staticmethod
    def delete_job(
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

        JobRepository.delete(
            db,
            job
        )

