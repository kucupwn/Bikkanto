from sqlalchemy import Column, Integer, String, Boolean, Date
from .database import Base


class Exercises(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    exercise_name = Column(String, unique=True)
    category = Column(String)
    easy_min = Column(Integer)
    easy_max = Column(Integer)
    medium_min = Column(Integer)
    medium_max = Column(Integer)
    hard_min = Column(Integer)
    hard_max = Column(Integer)


class History(Base):
    __tablename__ = "history"

    id = Column(Integer, primary_key=True, index=True)
    date_complete = Column(Date)
    cycles = Column(Integer)
    exercise = Column(String)
    repetitions = Column(Integer)
    user = Column(String)


class Users(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True)
    role = Column(String)
    email = Column(String, unique=True)
    first_name = Column(String)
    last_name = Column(String)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
