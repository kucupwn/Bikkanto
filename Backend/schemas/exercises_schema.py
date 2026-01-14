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
    exercise_name: str
    difficulty: Difficulty
    easy_min: int
    easy_max: int
    medium_min: int
    medium_max: int
    hard_min: int
    hard_max: int


class ExerciseRead(ExerciseBase):
    id: int
    category_id: int
    category_name: str

    class Config:
        from_attributes = True


class ExerciseCreate(ExerciseBase):
    exercise_name: str = Field(..., min_length=1)
    difficulty: Difficulty
    easy_min: int = Field(gt=0)
    easy_max: int = Field(gt=0)
    medium_min: int = Field(gt=0)
    medium_max: int = Field(gt=0)
    hard_min: int = Field(gt=0)
    hard_max: int = Field(gt=0)
    category_id: int = Field(..., gt=0)


class ExerciseUpdate(BaseModel):
    exercise_name: str = Field(min_length=1)
    easy_min: int = Field(gt=0)
    easy_max: int = Field(gt=0)
    medium_min: int = Field(gt=0)
    medium_max: int = Field(gt=0)
    hard_min: int = Field(gt=0)
    hard_max: int = Field(gt=0)
    category_id: int = Field(gt=0)
