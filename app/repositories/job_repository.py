from app.models.job import Job


class JobRepository:

    @staticmethod
    def create(db, job):
        db.add(job)
        db.commit()
        db.refresh(job)
        return job

    @staticmethod
    def get_all(
            db,
            skip: int = 0,
            limit: int = 10
    ):
        return (
            db.query(Job)
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def get_by_id(db, job_id: int):
        return (
            db.query(Job)
            .filter(Job.id == job_id)
            .first()
        )

    @staticmethod
    def search_by_title(
            db,
            keyword: str
    ):
        return (
            db.query(Job)
            .filter(
                Job.title.ilike(
                    f"%{keyword}%"
                )
            )
            .all()
        )

    @staticmethod
    def update(db, job):
        db.commit()
        db.refresh(job)
        return job

    @staticmethod
    def delete(db, job):
        db.delete(job)
        db.commit()