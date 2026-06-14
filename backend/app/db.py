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
        proj_cols = {col["name"] for col in inspect(engine).get_columns("projects")}
        news_cols = {col["name"] for col in inspect(engine).get_columns("news_articles")}

        if "mouqataa" not in proj_cols:
            conn.execute(text("ALTER TABLE projects ADD COLUMN mouqataa VARCHAR(128)"))
            conn.commit()

        for col in ("title_fr", "title_en", "description_fr", "description_en",
                    "impact_fr", "impact_en", "category_fr", "category_en"):
            if col not in proj_cols:
                conn.execute(text(f"ALTER TABLE projects ADD COLUMN {col} TEXT"))
                conn.commit()

        for col in ("title_fr", "title_en", "excerpt_fr", "excerpt_en",
                    "body_fr", "body_en", "category_fr", "category_en"):
            if col not in news_cols:
                conn.execute(text(f"ALTER TABLE news_articles ADD COLUMN {col} TEXT"))
                conn.commit()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

