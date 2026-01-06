from pydantic import BaseModel, Field
from datetime import date
from .exercises_schema import Category


class HistoryBase(BaseModel):
    date_complete: date
    cycles: int
    category: Category
    exercise: str
    repetitions: int
    sum_repetitions: int


class HistoryRead(HistoryBase):
    id: int

    class Config:
        from_attributes = True


class HistoryCreate(HistoryBase):
    date_complete: date = Field(...)
    cycles: int = Field(..., gt=0)
    category: Category
    exercise: str = Field(..., min_length=1)
    repetitions: int = Field(..., gt=0)
    sum_repetitions: int = Field(..., gt=0)
