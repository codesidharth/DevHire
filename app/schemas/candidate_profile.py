from pydantic import BaseModel


class CandidateProfileCreate(BaseModel):
    full_name: str
    phone: str
    skills: str | None = None
    experience_years: int = 0


class CandidateProfileUpdate(BaseModel):
    full_name: str | None = None
    phone: str | None = None
    skills: str | None = None
    experience_years: int | None = None


class CandidateProfileResponse(BaseModel):
    id: int
    user_id: int
    full_name: str
    phone: str
    skills: str | None = None
    experience_years: int
    resume_path: str | None = None

    class Config:
        from_attributes = True