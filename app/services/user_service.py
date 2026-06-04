import os
from datetime import datetime, timedelta, timezone
from typing import Optional
from fastapi import HTTPException, status
from jose import jwt
from passlib.context import CryptContext
from app.core.security import hash_password, verify_password, create_access_token

from app.models.user import User
from app.repositories.user_repository import UserRepository

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = os.getenv("JWT_SECRET", "DEV_MATRIX_SUPER_SECRET_KEY_9988")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


class UserService:

    @staticmethod
    def hash_password(password: str) -> str:
        """Utility method to safely hash plain text passwords."""
        return pwd_context.hash(password)

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Utility method to verify incoming text passwords against DB hashes."""
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
        """Generates a secure, stateless JWT encryption string."""
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.now(timezone.utc) + expires_delta
        else:
            expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    @staticmethod
    def register_user(db, user_data):
        """
        Orchestrates account registration.
        Validates unique constraints and maps ALL required database parameters.
        """
        existing_user = UserRepository.get_by_email(db, user_data.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Account credentials already exist."
            )

        hashed_pwd = UserService.hash_password(user_data.password)

        # ✅ FIXED: Included user_data.username to satisfy the NOT NULL database requirement!
        user = User(
            username=user_data.username,
            email=user_data.email,
            hashed_password=hashed_pwd,
            role=user_data.role
        )

        return UserRepository.create(db, user)


    @staticmethod
    def login_user(db, credentials):
        user = UserRepository.get_by_email(db, credentials.email)

        if not user or not UserService.verify_password(
                credentials.password,
                user.hashed_password
        ):
            raise HTTPException(
                status_code=401,
                detail="Invalid credentials"
            )

        token_payload = {
            "sub": user.email,
            "id": user.id,
            "role": user.role
        }

        access_token = UserService.create_access_token(data=token_payload)

        print("LOGIN ROLE =", user.role)

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "debug": "NEW_DEPLOYMENT_TEST",
            "user": {
                "id": user.id,
                "email": user.email,
                "role": user.role
            }
        }