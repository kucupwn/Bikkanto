from typing import Annotated
from sqlalchemy.orm import Session
from fastapi import Depends, APIRouter, HTTPException, Path
from starlette import status
from ..database import get_db
from ..models import Exercises
from ..schemas.exercises_schema import (
    ExerciseRead,
    ExerciseCreate,
    ExerciseUpdate,
    Category,
)

router = APIRouter(prefix="/exercises", tags=["exercises"])


db_dependency = Annotated[Session, Depends(get_db)]


@router.get("/categories")
def get_categories():
    return [c.value for c in Category]


@router.get("/", response_model=list[ExerciseRead], status_code=status.HTTP_200_OK)
async def read_all(db: db_dependency):
    return db.query(Exercises).all()


@router.post("/", response_model=ExerciseRead, status_code=status.HTTP_201_CREATED)
async def create_exercise(db: db_dependency, exercise_create: ExerciseCreate):
    existing = (
        db.query(Exercises)
        .filter_by(exercise_name=exercise_create.exercise_name)
        .first()
    )
    if existing:
        raise HTTPException(status_code=400, detail="Exercise already exists")

    exercise_model = Exercises(**exercise_create.model_dump())
    db.add(exercise_model)
    db.commit()
    db.refresh(exercise_model)

    return exercise_model


@router.put(
    "/{exercise_id}", response_model=ExerciseRead, status_code=status.HTTP_200_OK
)
async def update_exercise(
    db: db_dependency, exercise_update: ExerciseUpdate, exercise_id: int = Path(gt=0)
):
    exercise_model = db.query(Exercises).filter(Exercises.id == exercise_id).first()

    if exercise_model is None:
        raise HTTPException(status_code=404, detail="Exercise not found")

    update_data = exercise_update.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(exercise_model, key, value)

    db.commit()
    db.refresh(exercise_model)

    return exercise_model


@router.delete(
    "/{exercise_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_exercise(db: db_dependency, exercise_id: int = Path(gt=0)):
    exercise_model = db.query(Exercises).filter(Exercises.id == exercise_id).first()

    if not exercise_model:
        raise HTTPException(status_code=404, detail="Exercise not found")

    db.query(Exercises).filter(Exercises.id == exercise_id).delete()

    db.commit()
