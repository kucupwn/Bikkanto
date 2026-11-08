from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    Integer,
    String,
    Date,
    DateTime,
    ForeignKey,
    UniqueConstraint,
)
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
    )
    user = relationship("Users", back_populates="category")


class History(Base):
    # A self-contained snapshot of a finished workout row. It deliberately holds no
    # reference to exercises or categories: deleting or editing an exercise later
    # must never change or remove what was logged. Only the owner is referenced,
    # so a user's history goes away with the user.
    __tablename__ = "history"

    id = Column(Integer, primary_key=True, index=True)
    session = Column(Integer, nullable=False)
    date_complete = Column(Date, nullable=False)

    exercise_name = Column(String, nullable=False)
    category_name = Column(String, nullable=False)
    difficulty = Column(String, nullable=False)
    reps_difficulty = Column(String, nullable=False)
    cycles = Column(Integer, nullable=False)
    reps = Column(Integer, nullable=False)
    sum_repetitions = Column(Integer, nullable=False)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    user = relationship("Users", back_populates="history")


class Presets(Base):
    __tablename__ = "presets"
    __table_args__ = (
        UniqueConstraint("preset_name", "user_id", name="uq_preset_user"),
    )

    id = Column(Integer, primary_key=True, index=True)
    preset_name = Column(String, nullable=False)
    created_at = Column(
        DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    user = relationship("Users", back_populates="presets")
    exercises = relationship(
        "PresetExercises",
        back_populates="preset",
        cascade="all, delete-orphan",
        order_by="PresetExercises.position",
    )


class PresetExercises(Base):
    __tablename__ = "preset_exercises"

    id = Column(Integer, primary_key=True, index=True)
    position = Column(Integer, nullable=False)
    reps_difficulty = Column(String, nullable=False)
    reps = Column(Integer, nullable=False)

    preset_id = Column(Integer, ForeignKey("presets.id"), nullable=False, index=True)
    exercise_id = Column(
        Integer, ForeignKey("exercises.id"), nullable=False, index=True
    )

    preset = relationship("Presets", back_populates="exercises")
    exercise = relationship("Exercises")

    # Read live from the exercise, so edits/renames show up in the preset
    @property
    def exercise_name(self):
        return self.exercise.exercise_name if self.exercise else None

    @property
    def difficulty(self):
        return self.exercise.difficulty if self.exercise else None

    @property
    def category_id(self):
        return self.exercise.category_id if self.exercise else None

    @property
    def category_name(self):
        return self.exercise.category_name if self.exercise else None


class DraftWorkout(Base):
    __tablename__ = "draft_workout"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, nullable=False)
    difficulty = Column(String)
    reps_difficulty = Column(String)
    reps = Column(Integer)

    exercise_id = Column(
        Integer, ForeignKey("exercises.id"), nullable=False, index=True
    )
    category_id = Column(
        Integer, ForeignKey("categories.id"), nullable=False, index=True
    )
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    exercise_name = Column(String, nullable=False)
    category_name = Column(String, nullable=False)

    # "random" | "custom" | "preset"; preset_id is set only for "preset"
    origin = Column(String, nullable=False, default="random", server_default="random")
    preset_id = Column(Integer, ForeignKey("presets.id"), nullable=True)

    user = relationship("Users", back_populates="draft_workout")

    exercise = relationship("Exercises")
    category = relationship("Categories")


class Users(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True)
    first_name = Column(String)
    last_name = Column(String)
    role = Column(String)
    hashed_password = Column(String)

    history = relationship(
        "History",
        back_populates="user",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
    exercise = relationship(
        "Exercises", back_populates="user", cascade="all, delete-orphan"
    )
    category = relationship(
        "Categories", back_populates="user", cascade="all, delete-orphan"
    )
    draft_workout = relationship(
        "DraftWorkout", back_populates="user", cascade="all, delete-orphan"
    )
    presets = relationship(
        "Presets", back_populates="user", cascade="all, delete-orphan"
    )
