from pydantic import BaseModel, Field
from enum import Enum
from datetime import date
from .exercises_schema import Difficulty


class RepsDifficulty(str, Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"


class HistoryBase(BaseModel):
    date_complete: date
    difficulty: Difficulty
    reps_difficulty: RepsDifficulty
    cycles: int = Field(gt=0)
    reps: int = Field(gt=0)
    sum_repetitions: int = Field(gt=0)
    exercise_id: int = Field(gt=0)
    category_id: int = Field(gt=0)


class HistoryRead(HistoryBase):
    id: int
    session: int
    exercise_name: str
    category_name: str

    class Config:
        from_attributes = True


class HistoryCreate(HistoryBase):
    pass


class DraftWorkoutBase(BaseModel):
    difficulty: Difficulty
    reps_difficulty: RepsDifficulty
    reps: int = Field(gt=0)
    exercise_id: int = Field(gt=0)
    category_id: int = Field(gt=0)


class DraftWorkoutRead(DraftWorkoutBase):
    id: int
    session_id: str
    exercise_name: str
    category_name: str

    class Config:
        from_attributes = True


class DraftWorkoutCreate(DraftWorkoutBase):
    pass
