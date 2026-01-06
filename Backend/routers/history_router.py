from typing import Annotated, List
from sqlalchemy.orm import Session
from fastapi import Depends, APIRouter, HTTPException
from starlette import status
from .auth import get_current_user
from ..database import get_db
from ..models import History, Users, Exercises
from ..schemas.history_schema import HistoryRead, HistoryCreate

router = APIRouter(prefix="/history", tags=["history"])

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]


@router.get("/", response_model=List[HistoryRead], status_code=status.HTTP_200_OK)
async def read_all(user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")

    history_entries = (
        db.query(History).join(Users).filter(Users.id == user.get("id")).all()
    )

    return [
        HistoryRead(
            id=h.id,
            date_complete=h.date_complete,
            cycles=h.cycles,
            category=h.category,
            exercise=h.exercise.exercise_name,
            repetitions=h.repetitions,
            sum_repetitions=h.sum_repetitions,
        )
        for h in history_entries
    ]


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_history_batch(
    user: user_dependency, db: db_dependency, entries: List[HistoryCreate]
):
    history_models = []

    for entry in entries:
        user = db.query(Users).filter(Users.id == user.get("id")).first()
        exercise = (
            db.query(Exercises)
            .filter(Exercises.exercise_name == entry.exercise)
            .first()
        )

        if not user or not exercise:
            raise HTTPException(
                status_code=400, detail="User or exercise reference not found"
            )

        history = History(
            date_complete=entry.date_complete,
            cycles=entry.cycles,
            category=entry.category,
            exercise_id=exercise.id,
            repetitions=entry.repetitions,
            sum_repetitions=entry.sum_repetitions,
            user_id=user.id,
        )

        history_models.append(history)

    db.add_all(history_models)
    db.commit()

    for model in history_models:
        db.refresh(model)

    return history_models
