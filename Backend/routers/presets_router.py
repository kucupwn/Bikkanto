from typing import Annotated, List
from sqlalchemy.orm import Session, selectinload
from fastapi import Depends, APIRouter, HTTPException, Path
from starlette import status
from .auth import get_current_user
from ..database import get_db
from ..models import Presets, PresetExercises, Exercises
from ..schemas.preset_schema import (
    PresetRead,
    PresetCreate,
    PresetUpdate,
    PresetExerciseCreate,
)

router = APIRouter(prefix="/presets", tags=["presets"])

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]


def _get_user_preset(db: Session, preset_id: int, user_id: int) -> Presets:
    preset = (
        db.query(Presets)
        .options(selectinload(Presets.exercises).selectinload(PresetExercises.exercise))
        .filter(Presets.id == preset_id, Presets.user_id == user_id)
        .first()
    )
    if not preset:
        raise HTTPException(status_code=404, detail="Preset not found")
    return preset


def _ensure_unique_name(
    db: Session, preset_name: str, user_id: int, exclude_id: int | None = None
):
    query = db.query(Presets).filter(
        Presets.preset_name == preset_name, Presets.user_id == user_id
    )
    if exclude_id is not None:
        query = query.filter(Presets.id != exclude_id)
    if query.first():
        raise HTTPException(status_code=400, detail="Preset name already exists")


def _build_preset_exercises(
    db: Session, entries: List[PresetExerciseCreate], user_id: int
) -> List[PresetExercises]:
    exercise_ids = {entry.exercise_id for entry in entries}
    owned_ids = {
        row.id
        for row in db.query(Exercises.id).filter(
            Exercises.id.in_(exercise_ids), Exercises.user_id == user_id
        )
    }
    if owned_ids != exercise_ids:
        raise HTTPException(status_code=400, detail="Invalid exercise id")

    # List order becomes the preset's exercise order
    return [
        PresetExercises(
            position=index,
            exercise_id=entry.exercise_id,
            reps_difficulty=entry.reps_difficulty.value,
            reps=entry.reps,
        )
        for index, entry in enumerate(entries)
    ]


@router.get("/", response_model=List[PresetRead], status_code=status.HTTP_200_OK)
async def read_all_presets(user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")

    return (
        db.query(Presets)
        .options(selectinload(Presets.exercises).selectinload(PresetExercises.exercise))
        .filter(Presets.user_id == user.get("id"))
        .order_by(Presets.created_at.desc())
        .all()
    )


@router.get(
    "/{preset_id}", response_model=PresetRead, status_code=status.HTTP_200_OK
)
async def read_preset(
    user: user_dependency, db: db_dependency, preset_id: int = Path(gt=0)
):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")

    return _get_user_preset(db, preset_id, user.get("id"))


@router.post("/", response_model=PresetRead, status_code=status.HTTP_201_CREATED)
async def create_preset(
    user: user_dependency, db: db_dependency, preset_create: PresetCreate
):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")

    user_id = user.get("id")
    _ensure_unique_name(db, preset_create.preset_name, user_id)

    preset = Presets(
        preset_name=preset_create.preset_name,
        user_id=user_id,
        exercises=_build_preset_exercises(db, preset_create.exercises, user_id),
    )
    db.add(preset)
    db.commit()

    return _get_user_preset(db, preset.id, user_id)


@router.put(
    "/{preset_id}", response_model=PresetRead, status_code=status.HTTP_200_OK
)
async def update_preset(
    user: user_dependency,
    db: db_dependency,
    preset_update: PresetUpdate,
    preset_id: int = Path(gt=0),
):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")

    user_id = user.get("id")
    preset = _get_user_preset(db, preset_id, user_id)
    _ensure_unique_name(db, preset_update.preset_name, user_id, exclude_id=preset.id)

    new_exercises = _build_preset_exercises(db, preset_update.exercises, user_id)

    preset.preset_name = preset_update.preset_name
    # Full replace: delete-orphan cascade removes the old rows
    preset.exercises = new_exercises
    db.commit()

    db.expire_all()
    return _get_user_preset(db, preset_id, user_id)


@router.delete("/{preset_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_preset(
    user: user_dependency, db: db_dependency, preset_id: int = Path(gt=0)
):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")

    preset = _get_user_preset(db, preset_id, user.get("id"))
    db.delete(preset)
    db.commit()
