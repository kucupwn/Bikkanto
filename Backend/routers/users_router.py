from typing import Annotated, List
from sqlalchemy.orm import Session
from fastapi import Depends, APIRouter, HTTPException, Path
from starlette import status
from passlib.context import CryptContext
from ..database import get_db
from ..models import Users
from ..schemas.users_schema import UserRead, UserCreate, UserUpdate, UserVerification
from .auth import get_current_user

router = APIRouter(prefix="/users", tags=["users"])


bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]


@router.get("/", response_model=UserRead, status_code=status.HTTP_200_OK)
async def get_current_user(user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")

    users_model = db.query(Users).filter(Users.id == user.get("id")).first()

    if users_model is None:
        raise HTTPException(status_code=404, detail="User not found")

    return UserRead.model_validate(users_model)


@router.get("/all", response_model=List[UserRead], status_code=status.HTTP_200_OK)
async def get_users(user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")

    if user.get("role") == "admin":
        users_model = db.query(Users).all()
    else:
        return None

    return [UserRead.model_validate(user) for user in users_model]


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
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


@router.patch("/", response_model=UserRead, status_code=status.HTTP_200_OK)
async def update_user(
    user_update: UserUpdate,
    user: user_dependency,
    db: db_dependency,
):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")

    user_model = db.query(Users).filter(Users.id == user.get("id")).first()

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


@router.put("/change_password", status_code=status.HTTP_204_NO_CONTENT)
async def change_password(
    user: user_dependency, db: db_dependency, user_verification: UserVerification
):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")

    user_model = db.query(Users).filter(Users.id == user.get("id")).first()

    if not bcrypt_context.verify(
        user_verification.password, user_model.hashed_password
    ):
        raise HTTPException(status_code=401, detail="Error on password change")

    user_model.hashed_password = bcrypt_context.hash(user_verification.password)

    db.commit()
