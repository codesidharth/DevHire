from app.models.candidate_profile import CandidateProfile


class CandidateProfileRepository:

    @staticmethod
    def create(db, profile):
        db.add(profile)
        db.commit()
        db.refresh(profile)
        return profile

    @staticmethod
    def get_by_user_id(
        db,
        user_id
    ):
        return (
            db.query(CandidateProfile)
            .filter(
                CandidateProfile.user_id == user_id
            )
            .first()
        )

    @staticmethod
    def update(
        db,
        profile
    ):
        db.commit()
        db.refresh(profile)
        return profile