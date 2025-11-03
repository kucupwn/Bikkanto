from typing import Annotated, List
from sqlalchemy.orm import Session
from fastapi import Depends, APIRouter
from starlette import status
from ..database import get_db
from ..models import History
from ..schemas.history_schema import HistoryRead, HistoryCreate

router = APIRouter(prefix="/history", tags=["history"])

db_dependency = Annotated[Session, Depends(get_db)]


@router.get("/", response_model=list[HistoryRead], status_code=status.HTTP_200_OK)
async def read_all(db: db_dependency):
    return db.query(History).all()


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_history_batch(db: db_dependency, entries: List[HistoryCreate]):
    history_models = [History(**entry.model_dump()) for entry in entries]
    db.add_all(history_models)
    db.commit()

    for model in history_models:
        db.refresh(model)

    return history_models
