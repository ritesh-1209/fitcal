"""
SmartCal FastAPI Application Entrypoint
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import sys
import os
import logging
from pathlib import Path

# Add project root and backend dir to sys.path
backend_dir = Path(__file__).resolve().parent.parent
root_dir = backend_dir.parent
sys.path.extend([str(backend_dir), str(root_dir)])

try:
    from app.api.routers import router
    from app.db.connection import init_db
except ImportError:
    from backend.app.api.routers import router
    from backend.app.db.connection import init_db

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("smartcal")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing SmartCal Backend Database...")
    await init_db()
    yield
    logger.info("Shutting down SmartCal Backend...")

app = FastAPI(
    title="SmartCal API",
    description="AI-Powered Calorie, Nutrition & Budget Meal Assistant API",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for React Native Expo / Web local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api/v1")

@app.get("/")
async def root():
    return {
        "app": "SmartCal API",
        "status": "online",
        "docs": "/docs",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
