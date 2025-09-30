from sqlalchemy import Column, Integer, String
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
