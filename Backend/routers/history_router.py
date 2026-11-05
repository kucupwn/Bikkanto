import uuid
from typing import Annotated, List
from sqlalchemy import func
from sqlalchemy.orm import Session
from fastapi import Depends, APIRouter, HTTPException, Path
from starlette import status
from datetime import date
from .auth import get_current_user
from ..database import get_db
from ..models import History, Exercises, DraftWorkout
from ..schemas.history_schema import (
    HistoryRead,
    HistoryCreate,
    DraftWorkoutRead,
    DraftWorkoutCreate,
)

router = APIRouter(prefix="/history", tags=["history"])

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]


@router.get("/", response_model=List[HistoryRead], status_code=status.HTTP_200_OK)
async def read_all(user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")

    history_entries = db.query(History).filter(History.user_id == user.get("id")).all()

    return history_entries


@router.get("/range", response_model=List[HistoryRead], status_code=status.HTTP_200_OK)
async def get_history_range(
    user: user_dependency, db: db_dependency, start_date: date, end_date: date
):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")

    if start_date > end_date:
        raise HTTPException(
            status_code=400, detail="Start date must be before or equal to end date"
        )

    history_entries = (
        db.query(History)
        .filter(
            History.user_id == user.get("id"),
            History.date_complete.between(start_date, end_date),
        )
        .all()
    )

    return history_entries


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=List[HistoryRead])
async def create_history_batch(
    user: user_dependency, db: db_dependency, entries: List[HistoryCreate]
):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")

    if not entries:
        raise HTTPException(status_code=400, detail="No history entries given")

    user_id = user.get("id")

    last_session = (
        db.query(func.max(History.session)).filter(History.user_id == user_id).scalar()
    )
    current_session = (last_session or 0) + 1

    history_models = []

    for entry in entries:
        exercise = (
            db.query(Exercises)
            .filter(Exercises.id == entry.exercise_id, Exercises.user_id == user_id)
            .first()
        )
        if not exercise:
            raise HTTPException(status_code=400, detail="Invalid exercise id")

        # Snapshot: copy the exercise as it is right now. Nothing links back to
        # it, so later edits or deletes of the exercise leave this row alone.
        history_models.append(
            History(
                session=current_session,
                date_complete=entry.date_complete,
                exercise_name=exercise.exercise_name,
                category_name=exercise.category_name,
                difficulty=exercise.difficulty,
                reps_difficulty=entry.reps_difficulty.value,
                cycles=entry.cycles,
                reps=entry.reps,
                sum_repetitions=entry.reps * entry.cycles,
                user_id=user_id,
            )
        )

    db.add_all(history_models)
    db.commit()

    for model in history_models:
        db.refresh(model)

    return history_models


@router.get(
    "/draft", response_model=List[DraftWorkoutRead], status_code=status.HTTP_200_OK
)
async def get_draft_workout(user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")

    draft_models = (
        db.query(DraftWorkout)
        .filter(
            DraftWorkout.user_id == user.get("id"),
        )
        .all()
    )

    return draft_models


@router.delete("/draft/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_draft_workout(
    user: user_dependency, db: db_dependency, session_id: str
):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")

    deleted_count = (
        db.query(DraftWorkout)
        .filter(
            DraftWorkout.session_id == session_id,
            DraftWorkout.user_id == user.get("id"),
        )
        .delete(synchronize_session=False)
    )

    if deleted_count == 0:
        raise HTTPException(status_code=404, detail="Session id not found.")

    db.commit()


@router.post(
    "/draft",
    response_model=List[DraftWorkoutRead],
    status_code=status.HTTP_201_CREATED,
)
async def create_draft_workout(
    user: user_dependency, db: db_dependency, entries: List[DraftWorkoutCreate]
):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")

    draft_models = []

    session = uuid.uuid4().hex

    for entry in entries:
        exercise = (
            db.query(Exercises)
            .filter(
                Exercises.id == entry.exercise_id,
                Exercises.user_id == user.get("id"),
            )
            .first()
        )
        if not exercise:
            raise HTTPException(status_code=400, detail="Invalid exercise id")

        draft = DraftWorkout(
            session_id=session,
            exercise_id=exercise.id,
            exercise_name=exercise.exercise_name,
            category_id=exercise.category_id,
            category_name=exercise.category_name,
            difficulty=entry.difficulty,
            reps_difficulty=entry.reps_difficulty,
            reps=entry.reps,
            user_id=user.get("id"),
        )

        draft_models.append(draft)

    db.add_all(draft_models)
    db.commit()

    for model in draft_models:
        db.refresh(model)

    return draft_models
