from fastapi import APIRouter
from app.api.v1.endpoints import auth, jobs, applications, profiles

api_router = APIRouter()

api_router.include_router(auth.router,         prefix="/auth",         tags=["Authentication"])
api_router.include_router(jobs.stats_router,   prefix="/jobs",         tags=["Stats"])   # stats FIRST
api_router.include_router(jobs.router,         prefix="/jobs",         tags=["Jobs"])    # dynamic AFTER
api_router.include_router(applications.router, prefix="/applications", tags=["Applications"])
api_router.include_router(profiles.router,     prefix="/profiles",     tags=["Profiles"])