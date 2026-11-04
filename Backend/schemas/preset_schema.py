from datetime import datetime
from typing import List
from pydantic import BaseModel, Field, field_validator
from .exercises_schema import Difficulty
from .history_schema import RepsDifficulty


class PresetExerciseBase(BaseModel):
    exercise_id: int = Field(gt=0)
    reps_difficulty: RepsDifficulty
    reps: int = Field(gt=0)


class PresetExerciseCreate(PresetExerciseBase):
    pass


class PresetExerciseRead(PresetExerciseBase):
    id: int
    position: int
    exercise_name: str
    difficulty: Difficulty
    category_id: int
    category_name: str

    class Config:
        from_attributes = True


class PresetBase(BaseModel):
    preset_name: str = Field(min_length=1)

    @field_validator("preset_name")
    @classmethod
    def normalize_name(cls, value: str) -> str:
        value = value.strip().lower()
        if not value:
            raise ValueError("Preset name cannot be empty")
        return value


class PresetCreate(PresetBase):
    # List order becomes the exercise order (position) in the preset
    exercises: List[PresetExerciseCreate] = Field(min_length=1)


class PresetUpdate(PresetCreate):
    pass


class PresetRead(PresetBase):
    id: int
    created_at: datetime
    exercises: List[PresetExerciseRead]

    class Config:
        from_attributes = True
