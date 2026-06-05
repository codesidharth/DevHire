import logging
from fastapi import FastAPI, Request, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.exceptions import DevHireException
from app.db.session import engine, get_db
from app.models.user import Base
from app.api.v1.api import api_router   # ← one import, one mount

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - [%(levelname)s] - %(name)s - %(message)s",
    handlers=[logging.StreamHandler(), logging.FileHandler("devhire_system.log")]
)
logger = logging.getLogger("DevHireCore")

logger.info("Initializing database schemas...")
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="DevHire Architecture Engine",
    version="1.0.0",
    description="Advanced backend with automated logging and centralized error handling. v2"

)
@app.get("/debug-routes")
def debug_routes():
    return [{"path": r.path, "methods": list(r.methods) if hasattr(r, 'methods') else []} for r in app.routes]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(DevHireException)
async def devhire_exception_handler(request: Request, exc: DevHireException):
    logger.warning(f"Handled Exception: {request.method} {request.url.path} -> {exc.message}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"success": False, "error_type": exc.__class__.__name__, "message": exc.message}
    )

# Single router mount — prefix here, not in api.py
app.include_router(api_router, prefix="/api/v1")

@app.get("/", tags=["Default"])
def read_root():
    return {"status": "healthy"}

@app.get("/health", tags=["Monitoring"])
def health_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "database": f"disconnected: {str(e)}"}