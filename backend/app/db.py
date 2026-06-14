from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import declarative_base, sessionmaker

from .config import get_settings

settings = get_settings()

engine = create_engine(settings.sqlalchemy_url, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()


def init_db() -> None:
    from . import models  # noqa: F401

    Base.metadata.create_all(bind=engine)

    # Add columns introduced after initial deployment without requiring Alembic
    _run_migrations()


def _run_migrations() -> None:
    with engine.connect() as conn:
        existing = {col["name"] for col in inspect(engine).get_columns("projects")}
        if "mouqataa" not in existing:
            conn.execute(text("ALTER TABLE projects ADD COLUMN mouqataa VARCHAR(128)"))
            conn.commit()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

