from app.models.application import Application


class ApplicationRepository:

    @staticmethod
    def create(db, application):
        db.add(application)
        db.commit()
        db.refresh(application)
        return application

    @staticmethod
    def get_by_candidate_and_job(
        db,
        candidate_id,
        job_id
    ):
        return (
            db.query(Application)
            .filter(
                Application.candidate_id == candidate_id,
                Application.job_id == job_id
            )
            .first()
        )

    @staticmethod
    def get_by_job(
        db,
        job_id
    ):
        return (
            db.query(Application)
            .filter(
                Application.job_id == job_id
            )
            .all()
        )

    @staticmethod
    def get_by_candidate(
            db,
            candidate_id: int
    ):
        return (
            db.query(Application)
            .filter(
                Application.candidate_id == candidate_id
            )
            .all()
        )

    @staticmethod
    def get_by_id(
            db,
            application_id: int
    ):
        return (
            db.query(Application)
            .filter(
                Application.id == application_id
            )
            .first()
        )

    @staticmethod
    def update(
            db,
            application
    ):
        db.commit()
        db.refresh(application)
        return application