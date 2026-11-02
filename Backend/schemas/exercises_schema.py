from enum import Enum
from pydantic import BaseModel, Field, field_validator


class CategoryRead(BaseModel):
    id: int
    category_name: str

    class Config:
        from_attributes = True


class CategoryCreate(BaseModel):
    category_name: str

    @field_validator("category_name")
    @classmethod
    def lowercase_name(cls, value: str) -> str:
        return value.lower()


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

    @field_validator("exercise_name")
    @classmethod
    def lowercase_name(cls, value: str) -> str:
        return value.lower()


class ExerciseUpdate(ExerciseBase):
    category_id: int = Field(gt=0)


class ExercisePoolRead(BaseModel):
    exercise_name: str
    category_name: str
    difficulty: Difficulty
    easy_min: int
    easy_max: int
    medium_min: int
    medium_max: int
    hard_min: int
    hard_max: int
    sample_count: int
