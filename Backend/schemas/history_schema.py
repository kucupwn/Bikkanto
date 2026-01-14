from pydantic import BaseModel, Field
from datetime import date
from .exercises_schema import Difficulty


class HistoryBase(BaseModel):
    date_complete: date
    difficulty: Difficulty
    cycles: int
    repetitions: int
    sum_repetitions: int


class HistoryRead(HistoryBase):
    id: int
    exercise_name: str
    category_name: str

    class Config:
        from_attributes = True


class HistoryCreate(HistoryBase):
    date_complete: date = Field(...)
    difficulty: Difficulty
    cycles: int = Field(..., gt=0)
    repetitions: int = Field(..., gt=0)
    sum_repetitions: int = Field(..., gt=0)
    exercise_id: int = Field(..., gt=0)
    category_id: int = Field(..., gt=0)
