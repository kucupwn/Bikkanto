from pydantic import BaseModel, Field
from datetime import date


class HistoryBase(BaseModel):
    date_complete: date
    cycles: int
    exercise: str
    repetitions: int
    sum_repetitions: int
    user: str


class HistoryRead(HistoryBase):
    id: int

    class Config:
        from_attributes = True


class HistoryCreate(HistoryBase):
    date_complete: date = Field(...)
    cycles: int = Field(..., gt=0)
    exercise: str = Field(..., min_length=1)
    repetitions: int = Field(..., gt=0)
    sum_repetitions: int = Field(..., gt=0)
    user: str = Field(..., min_length=1)
