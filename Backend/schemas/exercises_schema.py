from enum import Enum
from pydantic import BaseModel, Field


class CategoryRead(BaseModel):
    id: int
    category_name: str

    class Config:
        from_attributes = True


class CategoryCreate(BaseModel):
    category_name: str


class Difficulty(str, Enum):
    BEGINNER = "beginner"
    ADVANCED = "advanced"
    PRO = "pro"


class ExerciseBase(BaseModel):
    exercise_name: str = Field(min_length=1)
    difficulty: Difficulty
    easy_min: int = Field(gt=0)
    easy_max: int = Field(gt=0)
    medium_min: int = Field(gt=0)
    medium_max: int = Field(gt=0)
    hard_min: int = Field(gt=0)
    hard_max: int = Field(gt=0)


class ExerciseRead(ExerciseBase):
    id: int
    category_id: int
    category_name: str

    class Config:
        from_attributes = True


class ExerciseCreate(ExerciseBase):
    category_id: int = Field(gt=0)


class ExerciseUpdate(ExerciseBase):
    category_id: int = Field(gt=0)
