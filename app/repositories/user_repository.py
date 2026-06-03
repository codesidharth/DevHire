from sqlalchemy.orm import Session
from app.models.user import User

class UserRepository:

    @staticmethod
    def create(db: Session, user: User) -> User:
        """Persists a new user record to the database."""
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def get_by_id(db: Session, user_id: int) -> User | None:
        """Retrieves a single user by their primary key ID."""
        return db.query(User).filter(User.id == user_id).first()

    @staticmethod
    def get_by_email(db: Session, email: str) -> User | None:
        """Looks up a user by their unique email address (critical for login and uniqueness checks)."""
        return db.query(User).filter(User.email == email).first()

    @staticmethod
    def get_by_username(db: Session, username: str) -> User | None:
        """Looks up a user by their username string."""
        return db.query(User).filter(User.username == username).first()

    @staticmethod
    def update(db: Session, user: User) -> User:
        """Commits changes to an existing user record."""
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def delete(db: Session, user: User) -> None:
        """Removes a user record and handles cascading dependencies cleanly."""
        db.delete(user)
        db.commit()