from pydantic import BaseModel
from typing import Optional

class JobCreate(BaseModel):
    title: str
    description: str
    location: str
    salary: int


class JobResponse(BaseModel):
    id: int
    title: str
    description: str
    location: str
    salary: int
    is_active: bool
    recruiter_id: int

    class Config:
        from_attributes = True


class JobUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    salary: Optional[int] = None
    is_active: Optional[bool] = None