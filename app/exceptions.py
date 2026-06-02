class DevHireException(Exception):
    """Base exception for all domain-specific errors in the DevHire application."""
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)

class ResourceNotFoundException(DevHireException):
    """Raised when an object (User, Job, Application, Profile) doesn't exist in the database."""
    def __init__(self, message: str = "Requested resource not found."):
        super().__init__(message=message, status_code=404)

class UnauthorizedActionException(DevHireException):
    """Raised when a Role-Based Access Control (RBAC) constraint is violated."""
    def __init__(self, message: str = "You do not have permission to perform this action."):
        super().__init__(message=message, status_code=403)