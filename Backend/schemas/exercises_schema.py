from enum import Enum
from pydantic import BaseModel, Field


class Category(str, Enum):
    PUSH_UP = "push up"
    PULL_UP = "pull up"
    ABS = "abs"
    LOWER_BACK = "lower back"
    HANDSTAND = "handstand"
    PLANCHE = "planche"
    FRONT_LEVER = "front lever"
    LEG = "leg"
    REHAB = "rehab"
    OTHER = "other"


class ExerciseBase(BaseModel):
    exercise_name: str
    category: Category
    easy_min: int
    easy_max: int
    medium_min: int
    medium_max: int
    hard_min: int
    hard_max: int


class ExerciseRead(ExerciseBase):
    id: int

    class Config:
        from_attributes = True


class ExerciseCreate(ExerciseBase):
    exercise_name: str = Field(..., min_length=1)
    category: Category
    easy_min: int = Field(gt=0)
    easy_max: int = Field(gt=0)
    medium_min: int = Field(gt=0)
    medium_max: int = Field(gt=0)
    hard_min: int = Field(gt=0)
    hard_max: int = Field(gt=0)


class ExerciseUpdate(BaseModel):
    exercise_name: str = Field(min_length=1)
    category: Category
    easy_min: int = Field(gt=0)
    easy_max: int = Field(gt=0)
    medium_min: int = Field(gt=0)
    medium_max: int = Field(gt=0)
    hard_min: int = Field(gt=0)
    hard_max: int = Field(gt=0)
