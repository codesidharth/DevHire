from fastapi import HTTPException
from app.models.application import Application
from app.repositories.application_repository import ApplicationRepository
from app.repositories.job_repository import JobRepository
from app.repositories.candidate_profile_repository import CandidateProfileRepository


class ApplicationService:

    @staticmethod
    def apply_to_job(db, job_id, current_user):
        if current_user.role != "candidate":
            raise HTTPException(status_code=403, detail="Only candidates can apply")

        job = JobRepository.get_by_id(db, job_id)
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")

        existing = ApplicationRepository.get_by_candidate_and_job(db, current_user.id, job_id)
        if existing:
            raise HTTPException(status_code=400, detail="Already applied")

        application = Application(candidate_id=current_user.id, job_id=job_id)
        return ApplicationRepository.create(db, application)

    @staticmethod
    def get_my_applications(db, current_user):
        if current_user.role != "candidate":
            raise HTTPException(status_code=403, detail="Only candidates can view applications")
        return ApplicationRepository.get_by_candidate(db, current_user.id)

    @staticmethod
    def get_job_applications(db, job_id, current_user):
        job = JobRepository.get_by_id(db, job_id)
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        if job.recruiter_id != current_user.id:
            raise HTTPException(status_code=403, detail="You do not own this job")
        return ApplicationRepository.get_by_job(db, job_id)

    @staticmethod
    def update_status(db, application_id, status_data, current_user):
        application = ApplicationRepository.get_by_id(db, application_id)
        if not application:
            raise HTTPException(status_code=404, detail="Application not found")

        job = JobRepository.get_by_id(db, application.job_id)
        if job.recruiter_id != current_user.id:
            raise HTTPException(status_code=403, detail="You do not own this job")

        application.status = status_data.status.value
        return ApplicationRepository.update(db, application)

    @staticmethod
    def get_candidate_profile(db, candidate_id, current_user):
        if current_user.role != "recruiter":
            raise HTTPException(status_code=403, detail="Only recruiters can view candidate profiles")

        profile = CandidateProfileRepository.get_by_user_id(db, candidate_id)
        if not profile:
            raise HTTPException(status_code=404, detail="Candidate profile not found")

        return {
            "id": profile.id,
            "user_id": profile.user_id,
            "full_name": profile.full_name,
            "phone": profile.phone,
            "skills": profile.skills,
            "experience_years": profile.experience_years,
            "resume_path": profile.resume_path,
            "has_resume": profile.resume_path is not None,
        }