from enum import Enum
from pydantic import BaseModel, Field


class Category(str, Enum):
    PUSH_UP = "push up"
    PULL_UP = "pull up"
    ABS = "abs"
    LOWER_BACK = "lower back"
    PLANCHE = "planche"
    FRONT_LEVER = "front lever"
    REHAB = "rehab"
    OTHER = "other"


class ExerciseBase(BaseModel):
    exercise_name: str
    category: Category
    easy_min: int | None = None
    easy_max: int | None = None
    medium_min: int | None = None
    medium_max: int | None = None
    hard_min: int | None = None
    hard_max: int | None = None


class ExerciseRead(ExerciseBase):
    id: int

    class Config:
        from_attributes = True


class ExerciseCreate(ExerciseBase):
    exercise_name: str = Field(..., min_length=1)
    category: Category = Field(...)
    easy_min: int | None
    easy_max: int | None
    medium_min: int | None
    medium_max: int | None
    hard_min: int | None
    hard_max: int | None


class ExerciseUpdate(BaseModel):
    exercise_name: str = Field(min_length=1)
    category: Category
    easy_min: int = Field(gt=0)
    easy_max: int = Field(gt=0)
    medium_min: int = Field(gt=0)
    medium_max: int = Field(gt=0)
    hard_min: int = Field(gt=0)
    hard_max: int = Field(gt=0)
