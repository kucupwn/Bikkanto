from typing import Annotated
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


@router.post("/", response_model=HistoryRead, status_code=status.HTTP_201_CREATED)
async def create_history_entry(db: db_dependency, history_create: HistoryCreate):
    history_model = History(**history_create.model_dump())
    db.add(history_model)
    db.commit()
    db.refresh(history_model)

    return history_model
