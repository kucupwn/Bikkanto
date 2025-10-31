from .database import Base, engine, SessionLocal


def create_tables():
    from ..models import Exercises, History, Users

    Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
