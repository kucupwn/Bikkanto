from pydantic import BaseModel, Field
from enum import Enum


class UserRole(str, Enum):
    user = "user"
    admin = "admin"


class UserBase(BaseModel):
    username: str = Field(min_length=1)


class UserRead(UserBase):
    id: int
    email: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    role: UserRole = UserRole.user

    class Config:
        from_attributes = True


class UserCreate(UserBase):
    password: str = Field(min_length=5)


class UserUpdate(BaseModel):
    email: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    password: str | None = Field(default=None, min_length=5)


class Token(BaseModel):
    access_token: str
    token_type: str


class UserVerification(BaseModel):
    password: str
    new_password: str
