from pydantic import BaseModel, Field
from typing import Literal


class UserBase(BaseModel):
    username: str
    password: str
    role: str
    email: str
    first_name: str
    last_name: str


class UserRead(UserBase):
    id: int

    class Config:
        from_attributes = True


class UserCreate(UserBase):
    username: str = Field(..., min_length=1)
    password: str = Field(..., min_length=5)
    role: Literal["user", "admin"] = Field(...)
    email: str | None = Field(None)
    first_name: str | None = Field(None, min_length=1)
    last_name: str | None = Field(None, min_length=1)


class UserUpdate(UserBase):
    username: str | None = Field(None, min_length=1)
    password: str | None = Field(None, min_length=5)
    role: Literal["user", "admin"] | None = Field(None)
    email: str | None = Field(None)
    first_name: str | None = Field(None, min_length=1)
    last_name: str | None = Field(None, min_length=1)


class Token(BaseModel):
    access_token: str
    token_type: str
