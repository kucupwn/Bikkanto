from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import create_tables
from .routers import exercises_router, auth, users_router, history_router
from .core.config import settings

app = FastAPI()

create_tables()

app.include_router(auth.router)
app.include_router(exercises_router.router)
app.include_router(users_router.router)
app.include_router(history_router.router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
