from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from database import engine, Base
import auth


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure all tables are created on startup
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="EvalWrite AI API",
    description="NLP-powered descriptive answer evaluation system with authentication",
    version="0.2.0",
    lifespan=lifespan,
)

# CORS configuration supporting secure HttpOnly cookies across localhost ports
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount authentication routes
app.include_router(auth.router)


@app.get("/")
def home():
    return {
        "message": "Welcome to EvalWrite AI",
        "status": "running",
        "auth_enabled": True,
    }


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "EvalWrite AI API",
        "database": "sqlite_connected",
        "auth_ready": True,
    }
