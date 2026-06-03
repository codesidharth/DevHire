from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.user import UserCreate, UserLogin, UserResponse
from app.services.user_service import UserService

router = APIRouter()

@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED
)
def register(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    """Handles new user accounts extraction and validation layers cleanly."""
    return UserService.register_user(db, user_data)


@router.post("/login")
def login(
    credentials: UserLogin,
    db: Session = Depends(get_db)
):
    """Validates user entry claims and signs active secure session tokens."""
    return UserService.login_user(db, credentials)