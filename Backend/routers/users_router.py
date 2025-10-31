from typing import Annotated
from sqlalchemy.orm import Session
from fastapi import Depends, APIRouter, HTTPException
from starlette import status
from passlib.context import CryptContext
from ..database.db_helper import get_db
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

    return UserRead.model_validate(user_model)


@router.post("/", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def create_user(user_create: UserCreate, db: db_dependency):
    existing_user = (
        db.query(Users)
        .filter(
            (Users.username == user_create.username)
            | (Users.email == user_create.email)
        )
        .first()
    )

    if existing_user:
        raise HTTPException(status_code=400, detail="Username or email already exists")

    user_data = user_create.model_dump(exclude={"password"})
    create_user_model = Users(
        **user_data,
        hashed_password=bcrypt_context.hash(user_create.password),
        is_active=True
    )
    db.add(create_user_model)
    db.commit()
    db.refresh(create_user_model)

    return UserRead.model_validate(create_user_model)
