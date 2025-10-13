from pydantic import BaseModel


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


class ExercisesCreate(ExercisesBase):
    pass


class ExercisesUpdate(ExercisesBase):
    pass
