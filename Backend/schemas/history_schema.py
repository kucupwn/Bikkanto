from pydantic import BaseModel, Field
from enum import Enum
from typing import Optional
from datetime import date
from .exercises_schema import Difficulty


class RepsDifficulty(str, Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"


class HistoryBase(BaseModel):
    date_complete: date
    reps_difficulty: RepsDifficulty
    cycles: int = Field(gt=0)
    reps: int = Field(gt=0)


class HistoryCreate(HistoryBase):
    # Only used to look up the user's exercise at save time; the name, category
    # and difficulty are copied from it and the id itself is not stored.
    exercise_id: int = Field(gt=0)


class HistoryRead(HistoryBase):
    id: int
    session: int
    exercise_name: str
    category_name: str
    difficulty: Difficulty
    sum_repetitions: int

    class Config:
        from_attributes = True


class WorkoutOrigin(str, Enum):
    RANDOM = "random"  # Create -> Random
    CUSTOM = "custom"  # Create -> Preset, exercises picked by hand
    PRESET = "preset"  # Started from a saved preset on the Select page


class DraftWorkoutBase(BaseModel):
    difficulty: Difficulty
    reps_difficulty: RepsDifficulty
    reps: int = Field(gt=0)
    exercise_id: int = Field(gt=0)
    category_id: int = Field(gt=0)
    origin: WorkoutOrigin = WorkoutOrigin.RANDOM
    preset_id: Optional[int] = None


class DraftWorkoutRead(DraftWorkoutBase):
    id: int
    session_id: str
    exercise_name: str
    category_name: str

    class Config:
        from_attributes = True


class DraftWorkoutCreate(DraftWorkoutBase):
    pass
