from sqlalchemy import Column, Integer, String, Date, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from .database import Base


class Exercises(Base):
    __tablename__ = "exercises"
    __table_args__ = (
        UniqueConstraint("exercise_name", "user_id", name="uq_exercise_user"),
    )

    id = Column(Integer, primary_key=True, index=True)
    exercise_name = Column(String, nullable=False)
    difficulty = Column(String)
    easy_min = Column(Integer)
    easy_max = Column(Integer)
    medium_min = Column(Integer)
    medium_max = Column(Integer)
    hard_min = Column(Integer)
    hard_max = Column(Integer)

    category_id = Column(
        Integer, ForeignKey("categories.id"), nullable=False, index=True
    )
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    category = relationship("Categories", back_populates="exercise")
    history = relationship(
        "History",
        back_populates="exercise",
        cascade="all, delete-orphan",
    )
    user = relationship("Users", back_populates="exercise")

    @property
    def category_name(self):
        return self.category.category_name if self.category else None


class Categories(Base):
    __tablename__ = "categories"
    __table_args__ = (
        UniqueConstraint("category_name", "user_id", name="uq_category_user"),
    )

    id = Column(Integer, primary_key=True, index=True)
    category_name = Column(String, nullable=False)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    exercise = relationship(
        "Exercises",
        back_populates="category",
        cascade="all, delete-orphan",
    )
    history = relationship("History", back_populates="category")
    user = relationship("Users", back_populates="category")


class History(Base):
    __tablename__ = "history"

    id = Column(Integer, primary_key=True, index=True)
    date_complete = Column(Date, nullable=False)
    cycles = Column(Integer)
    difficulty = Column(String)
    repetitions = Column(Integer)
    sum_repetitions = Column(Integer)

    exercise_id = Column(
        Integer, ForeignKey("exercises.id"), nullable=False, index=True
    )
    category_id = Column(
        Integer, ForeignKey("categories.id"), nullable=False, index=True
    )
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    exercise = relationship("Exercises", back_populates="history")
    category = relationship("Categories", back_populates="history")
    user = relationship("Users", back_populates="history")

    @property
    def category_name(self):
        return self.category.category_name if self.category else None

    @property
    def exercise_name(self):
        return self.exercise.exercise_name if self.exercise else None


class Users(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True)
    first_name = Column(String)
    last_name = Column(String)
    role = Column(String, default="user")
    hashed_password = Column(String)

    history = relationship(
        "History", back_populates="user", cascade="all, delete-orphan"
    )
    exercise = relationship(
        "Exercises", back_populates="user", cascade="all, delete-orphan"
    )
    category = relationship(
        "Categories", back_populates="user", cascade="all, delete-orphan"
    )
