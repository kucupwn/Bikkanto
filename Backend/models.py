from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base


class Exercises(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    exercise_name = Column(String, unique=True)
    category = Column(String)
    difficulty = Column(String)
    easy_min = Column(Integer)
    easy_max = Column(Integer)
    medium_min = Column(Integer)
    medium_max = Column(Integer)
    hard_min = Column(Integer)
    hard_max = Column(Integer)

    histories = relationship("History", back_populates="exercise")


class History(Base):
    __tablename__ = "history"

    id = Column(Integer, primary_key=True, index=True)
    date_complete = Column(Date)
    cycles = Column(Integer)
    category = Column(String)
    difficulty = Column(String)
    repetitions = Column(Integer)
    sum_repetitions = Column(Integer)

    exercise_id = Column(Integer, ForeignKey("exercises.id"))
    user_id = Column(Integer, ForeignKey("users.id"))

    exercise = relationship("Exercises", back_populates="histories")
    user = relationship("Users", back_populates="histories")


class Users(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True)
    email = Column(String, unique=True)
    first_name = Column(String)
    last_name = Column(String)
    role = Column(String, default="user")
    hashed_password = Column(String)

    histories = relationship("History", back_populates="user")
