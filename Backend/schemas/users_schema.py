from pydantic import BaseModel, Field


class UserBase(BaseModel):
    username: str


class UserRead(UserBase):
    id: int
    email: str | None = None
    first_name: str | None = None
    last_name: str | None = None

    class Config:
        from_attributes = True


class UserCreate(UserBase):
    username: str = Field(..., min_length=1)
    email: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    password: str = Field(..., min_length=5)


class UserUpdate(BaseModel):
    email: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    password: str | None = None


class Token(BaseModel):
    access_token: str
    token_type: str
