from pydantic import BaseModel, Field
from typing import Literal


class UserBase(BaseModel):
    username: str
    email: str
    first_name: str
    last_name: str


class UserRead(UserBase):
    id: int

    class Config:
        from_attributes = True


class UserCreate(UserBase):
    username: str = Field(..., min_length=1)
    email: str | None = Field(None)
    first_name: str | None = Field(None)
    last_name: str | None = Field(None)
    password: str = Field(..., min_length=5)


class UserUpdate(UserBase):
    email: str | None = Field(None)
    first_name: str | None = Field(None)
    last_name: str | None = Field(None)
    password: str | None = Field(None)


class Token(BaseModel):
    access_token: str
    token_type: str
