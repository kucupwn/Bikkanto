from pydantic import BaseModel, Field
from enum import Enum


class UserRole(str, Enum):
    user = "user"
    admin = "admin"


class UserBase(BaseModel):
    email: str | None = None
    first_name: str | None = None
    last_name: str | None = None


class UserRead(UserBase):
    id: int
    username: str = Field(min_length=1)
    role: UserRole = UserRole.user

    class Config:
        from_attributes = True


class UserCreate(UserBase):
    username: str = Field(min_length=1)
    password: str = Field(min_length=5)


class UserUpdate(UserBase):
    pass


class Token(BaseModel):
    access_token: str
    token_type: str


class PasswordVerification(BaseModel):
    password: str
    new_password: str
