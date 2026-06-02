import logging
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

# Import custom exceptions
from app.exceptions import DevHireException

# Import routers
from app.api.v1.endpoints import auth, jobs, applications, profiles

# 1. Configure Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - [%(levelname)s] - %(name)s - %(message)s",
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler("devhire_system.log")
    ]
)
logger = logging.getLogger("DevHireCore")

# 2. Initialize App & Register Database Metadata
from app.db.session import engine
from app.models.user import Base

# Cleanly initialize schemas directly using the metadata layer
logger.info("Initializing database schemas and validating table lifecycles...")
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="DevHire Architecture Engine",
    version="1.0.0",
    description="Advanced backend with automated logging and centralized error handling."
)

# 3. Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. Global Exception Handler
@app.exception_handler(DevHireException)
async def devhire_exception_handler(request: Request, exc: DevHireException):
    logger.warning(f"Handled Exception: {request.method} {request.url.path} -> {exc.message}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"success": False, "error_type": exc.__class__.__name__, "message": exc.message}
    )

# 5. Include Routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(jobs.router, prefix="/api/v1/jobs", tags=["Jobs"])
app.include_router(applications.router, prefix="/api/v1/applications", tags=["Applications"])
app.include_router(profiles.router, prefix="/api/v1/profiles", tags=["Profiles"])

@app.get("/", tags=["Default"])
def read_root():
    return {"status": "healthy"}