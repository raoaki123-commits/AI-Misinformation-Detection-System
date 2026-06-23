"""
SENTINEL – AI Misinformation Detection & Narrative Intelligence System
FastAPI Application Entry Point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.db.database import create_db_and_tables
from app.api.routes import analysis, reports


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(
    title="SENTINEL API",
    description="AI Misinformation Detection & Narrative Intelligence System",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analysis.router, prefix="/api/v1", tags=["Analysis"])
app.include_router(reports.router, prefix="/api/v1", tags=["Reports"])


@app.get("/health")
async def health():
    return {"status": "operational", "service": "SENTINEL"}
