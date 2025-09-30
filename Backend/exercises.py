from typing import Annotated
from sqlalchemy.orm import Session
from fastapi import Depends, APIRouter, HTTPException
from starlette import status
from pydantic import BaseModel, Field
from .database import SessionLocal
from .models import Exercises

router = APIRouter(prefix="/exercises", tags=["exercises"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]


class ExerciseRequest(BaseModel):
    exercise_name: str = Field(min_length=1)
    category: str = Field(min_length=1)
    easy_min: int = Field(gt=0)
    easy_max: int = Field(gt=0)
    medium_min: int = Field(gt=0)
    medium_max: int = Field(gt=0)
    hard_min: int = Field(gt=0)
    hard_max: int = Field(gt=0)


@router.get("/", status_code=status.HTTP_200_OK)
async def read_all(db: db_dependency):
    return db.query(Exercises).all()


@router.post("/exercise", status_code=status.HTTP_201_CREATED)
async def create_exercise(db: db_dependency, exercise_request: ExerciseRequest):
    exercise_model = Exercises(**exercise_request.model_dump())
    db.add(exercise_model)
    db.commit()
