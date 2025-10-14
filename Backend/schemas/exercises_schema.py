from pydantic import BaseModel, Field


class ExerciseBase(BaseModel):
    exercise_name: str
    category: str
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
    category: str = Field(..., min_length=1)
    easy_min: int | None = Field(None, gt=0)
    easy_max: int | None = Field(None, gt=0)
    medium_min: int | None = Field(None, gt=0)
    medium_max: int | None = Field(None, gt=0)
    hard_min: int | None = Field(None, gt=0)
    hard_max: int | None = Field(None, gt=0)


class ExerciseUpdate(BaseModel):
    exercise_name: str | None = Field(None, min_length=1)
    category: str | None = Field(None, min_length=1)
    easy_min: int | None = Field(None, gt=0)
    easy_max: int | None = Field(None, gt=0)
    medium_min: int | None = Field(None, gt=0)
    medium_max: int | None = Field(None, gt=0)
    hard_min: int | None = Field(None, gt=0)
    hard_max: int | None = Field(None, gt=0)
