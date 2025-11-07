from typing import Annotated
from sqlalchemy.orm import Session
from fastapi import Depends, APIRouter, HTTPException, Path
from starlette import status
from passlib.context import CryptContext
from ..database import get_db
from ..models import Users
from ..schemas.users_schema import UserRead, UserCreate, UserUpdate
from .auth import get_current_user

router = APIRouter(prefix="/users", tags=["users"])


bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]


@router.get("/", response_model=UserRead, status_code=status.HTTP_200_OK)
async def get_user(user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")

    user_model = db.query(Users).filter(Users.id == user.get("id")).first()

    if user_model is None:
        raise HTTPException(status_code=404, detail="User not found")

    return UserRead.model_validate(user_model)


@router.post("/", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def create_user(user_create: UserCreate, db: db_dependency):
    existing_user = (
        db.query(Users).filter(Users.username == user_create.username).first()
    )

    if existing_user:
        raise HTTPException(status_code=400, detail="Username or email already exists")

    if user_create.email:
        existing_email = (
            db.query(Users).filter(Users.email == user_create.email).first()
        )
        if existing_email:
            raise HTTPException(status_code=400, detail="Email already exists")

    user_data = user_create.model_dump(exclude={"password"})
    create_user_model = Users(
        **user_data,
        hashed_password=bcrypt_context.hash(user_create.password),
    )
    db.add(create_user_model)
    db.commit()
    db.refresh(create_user_model)

    return UserRead.model_validate(create_user_model)


@router.patch("/{user_id}", response_model=UserRead, status_code=status.HTTP_200_OK)
async def update_user(
    user_update: UserUpdate,
    user: user_dependency,
    db: db_dependency,
    user_id: int = Path(gt=0),
):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")

    user_model = db.query(Users).filter(Users.id == user_id).first()

    if user_model is None:
        raise HTTPException(status_code=404, detail="User not found")

    update_data = user_update.model_dump(exclude_unset=True)

    if "password" in update_data:
        user_model.hashed_password = bcrypt_context.hash(update_data["password"])
        del update_data["password"]

    if "email" in update_data:
        existing_email = (
            db.query(Users).filter(Users.email == update_data["email"]).first()
        )
        if existing_email and existing_email.id != user_model.id:
            raise HTTPException(status_code=400, detail="Email already exists")

    for key, value in update_data.items():
        setattr(user_model, key, value)

    db.commit()
    db.refresh(user_model)

    return UserRead.model_validate(user_model)
