from typing import Annotated, List
from sqlalchemy.orm import Session, joinedload
from fastapi import Depends, APIRouter, HTTPException, Path
from starlette import status
from .auth import get_current_user
from ..database import get_db
from ..models import Exercises, Categories
from ..schemas.exercises_schema import (
    ExerciseRead,
    ExerciseCreate,
    ExerciseUpdate,
    CategoryRead,
    CategoryCreate,
)

router = APIRouter(prefix="/exercises", tags=["exercises"])
db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]


@router.get(
    "/categories", response_model=List[CategoryRead], status_code=status.HTTP_200_OK
)
async def read_all_categories(user: user_dependency, db: db_dependency):

    return db.query(Categories).filter(Categories.user_id == user.get("id")).all()


@router.post("/categories", response_model=CategoryRead, status_code=status.HTTP_200_OK)
async def create_category(
    user: user_dependency, db: db_dependency, category_create: CategoryCreate
):

    existing = (
        db.query(Categories)
        .filter(
            Categories.category_name == category_create.category_name,
            Categories.user_id == user.get("id"),
        )
        .first()
    )

    if existing:
        raise HTTPException(status_code=400, detail="Category already exists")

    category_model = Categories(
        **category_create.model_dump(),
        user_id=user.get("id"),
    )
    db.add(category_model)
    db.commit()
    db.refresh(category_model)

    return category_model


@router.delete(
    "/{category_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_category(
    user: user_dependency, db: db_dependency, category_id: int = Path(gt=0)
):

    category_model = (
        db.query(Categories)
        .filter(
            Categories.id == category_id,
            Categories.user_id == user.get("id"),
        )
        .first()
    )

    if not category_model:
        raise HTTPException(status_code=404, detail="Exercise not found")

    db.delete(category_model)

    db.commit()


@router.get("/", response_model=List[ExerciseRead], status_code=status.HTTP_200_OK)
async def read_all_exercises(user: user_dependency, db: db_dependency):

    exercises = (
        db.query(Exercises)
        .filter(Exercises.user_id == user.get("id"))
        .options(joinedload(Exercises.category))
        .all()
    )
    return exercises


@router.post("/", response_model=ExerciseRead, status_code=status.HTTP_201_CREATED)
async def create_exercise(
    user: user_dependency, db: db_dependency, exercise_create: ExerciseCreate
):

    existing = (
        db.query(Exercises)
        .filter(
            Exercises.exercise_name == exercise_create.exercise_name,
            Exercises.user_id == user.get("id"),
        )
        .first()
    )

    if existing:
        raise HTTPException(status_code=400, detail="Exercise already exists")

    category = (
        db.query(Categories)
        .filter(
            Categories.id == exercise_create.category_id,
            Categories.user_id == user.get("id"),
        )
        .first()
    )

    if not category:
        raise HTTPException(status_code=400, detail="Invalid category id")

    exercise_model = Exercises(**exercise_create.model_dump(), user_id=user.get("id"))
    db.add(exercise_model)
    db.commit()
    db.refresh(exercise_model)

    return exercise_model


@router.put(
    "/{exercise_id}", response_model=ExerciseRead, status_code=status.HTTP_200_OK
)
async def update_exercise(
    user: user_dependency,
    db: db_dependency,
    exercise_update: ExerciseUpdate,
    exercise_id: int = Path(gt=0),
):

    exercise_model = (
        db.query(Exercises)
        .filter(
            Exercises.id == exercise_id,
            Exercises.user_id == user.get("id"),
        )
        .first()
    )

    if exercise_model is None:
        raise HTTPException(status_code=404, detail="Exercise not found")

    category = (
        db.query(Categories)
        .filter(
            Categories.id == exercise_update.category_id,
            Categories.user_id == user.get("id"),
        )
        .first()
    )

    if not category:
        raise HTTPException(status_code=400, detail="Invalid category id")

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
async def delete_exercise(
    user: user_dependency, db: db_dependency, exercise_id: int = Path(gt=0)
):

    exercise_model = (
        db.query(Exercises)
        .filter(
            Exercises.id == exercise_id,
            Exercises.user_id == user.get("id"),
        )
        .first()
    )

    if not exercise_model:
        raise HTTPException(status_code=404, detail="Exercise not found")

    db.delete(exercise_model)

    db.commit()
