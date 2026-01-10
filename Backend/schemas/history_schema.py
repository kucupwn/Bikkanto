from pydantic import BaseModel, Field
from datetime import date
from .exercises_schema import Category, Difficulty


class HistoryBase(BaseModel):
    date_complete: date
    exercise: str
    category: Category
    difficulty: Difficulty
    cycles: int
    repetitions: int
    sum_repetitions: int


class HistoryRead(HistoryBase):
    id: int

    class Config:
        from_attributes = True


class HistoryCreate(HistoryBase):
    date_complete: date = Field(...)
    exercise: str = Field(..., min_length=1)
    category: Category
    difficulty: Difficulty
    cycles: int = Field(..., gt=0)
    repetitions: int = Field(..., gt=0)
    sum_repetitions: int = Field(..., gt=0)
