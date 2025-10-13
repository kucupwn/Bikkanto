from pydantic import BaseModel, Field
from typing import Optional


class ExercisesBase(BaseModel):
    exercise_name: str | None = None
    category: str | None = None
    easy_min: int | None = None
    easy_max: int | None = None
    medium_min: int | None = None
    medium_max: int | None = None
    hard_min: int | None = None
    hard_max: int | None = None


class ExercisesRead(ExercisesBase):
    id: int

    class Config:
        from_attributes = True


class ExerciseCreate(ExercisesBase):
    exercise_name: str = Field(min_length=1)
    category: str = Field(min_length=1)
    easy_min: int = Field(gt=0)
    easy_max: int = Field(gt=0)
    medium_min: int = Field(gt=0)
    medium_max: int = Field(gt=0)
    hard_min: int = Field(gt=0)
    hard_max: int = Field(gt=0)


class ExercisesUpdate(BaseModel):
    exercise_name: Optional[str] = Field(None, min_length=1)
    category: Optional[str] = Field(None, min_length=1)
    easy_min: Optional[int] = Field(None, gt=0)
    easy_max: Optional[int] = Field(None, gt=0)
    medium_min: Optional[int] = Field(None, gt=0)
    medium_max: Optional[int] = Field(None, gt=0)
    hard_min: Optional[int] = Field(None, gt=0)
    hard_max: Optional[int] = Field(None, gt=0)
