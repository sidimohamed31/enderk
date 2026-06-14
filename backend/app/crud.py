from __future__ import annotations

from datetime import date
import json

from fastapi import UploadFile
from sqlalchemy.orm import Session

from . import models, schemas
from .storage import delete_from_cloudinary, upload_to_cloudinary


def _parse_date(value: str | None) -> date:
    if value:
        try:
            return date.fromisoformat(value)
        except ValueError:
            pass
    return date.today()


def _media_to_read(media: models.ProjectMedia) -> schemas.MediaRead:
    return schemas.MediaRead.model_validate(media)


def _project_to_read(project: models.Project) -> schemas.ProjectRead:
    media = list(project.media)
    images = [item.url for item in media if item.kind == "image"]
    video_url = next((item.url for item in media if item.kind == "video"), None)
    payload = schemas.ProjectRead.model_validate(
        {
            "id": project.id,
            "title": project.title,
            "title_fr": project.title_fr,
            "title_en": project.title_en,
            "region_id": project.region_id,
            "mouqataa": project.mouqataa,
            "category": project.category,
            "category_fr": project.category_fr,
            "category_en": project.category_en,
            "description": project.description,
            "description_fr": project.description_fr,
            "description_en": project.description_en,
            "impact": project.impact,
            "impact_fr": project.impact_fr,
            "impact_en": project.impact_en,
            "project_date": project.project_date,
            "created_at": project.created_at,
            "updated_at": project.updated_at,
            "media": [_media_to_read(item) for item in media],
            "images": images,
            "video_url": video_url,
        }
    )
    return payload


def list_projects(db: Session) -> list[schemas.ProjectRead]:
    projects = db.query(models.Project).order_by(models.Project.created_at.desc()).all()
    return [_project_to_read(project) for project in projects]


def get_project(db: Session, project_id: str) -> models.Project | None:
    return db.query(models.Project).filter(models.Project.id == project_id).first()


def _store_existing_media(media_json: str | None) -> list[dict]:
    if not media_json:
        return []
    try:
        parsed = json.loads(media_json)
        return parsed if isinstance(parsed, list) else []
    except json.JSONDecodeError:
        return []


def _persist_media(
    db: Session,
    project: models.Project,
    *,
    existing_media_json: str | None,
    image_files: list[UploadFile],
    video_file: UploadFile | None,
    image_urls: list[str],
    video_url: str | None,
) -> None:
    sort_index = 0
    existing_media = _store_existing_media(existing_media_json)

    for item in existing_media:
        kind = item.get("kind")
        url = item.get("url")
        if not kind or not url:
            continue

        media = models.ProjectMedia(
            project_id=project.id,
            kind=kind,
            source_type=item.get("source_type", "upload"),
            url=url,
            storage_path=item.get("storage_path"),
            original_filename=item.get("original_filename"),
            mime_type=item.get("mime_type"),
            size_bytes=item.get("size_bytes"),
            sort_order=sort_index,
        )
        db.add(media)
        sort_index += 1

    for image_file in image_files:
        stored = upload_to_cloudinary(
            image_file.file,
            kind="image",
            filename=image_file.filename,
            mime_type=image_file.content_type,
        )
        media = models.ProjectMedia(
            project_id=project.id,
            kind="image",
            source_type="upload",
            url=stored.url,
            storage_path=stored.storage_path,
            original_filename=stored.original_filename,
            mime_type=stored.mime_type,
            size_bytes=stored.size_bytes,
            sort_order=sort_index,
        )
        db.add(media)
        sort_index += 1

    if video_file is not None:
        stored = upload_to_cloudinary(
            video_file.file,
            kind="video",
            filename=video_file.filename,
            mime_type=video_file.content_type,
        )
        media = models.ProjectMedia(
            project_id=project.id,
            kind="video",
            source_type="upload",
            url=stored.url,
            storage_path=stored.storage_path,
            original_filename=stored.original_filename,
            mime_type=stored.mime_type,
            size_bytes=stored.size_bytes,
            sort_order=sort_index,
        )
        db.add(media)
        sort_index += 1

    for image_url in image_urls:
        media = models.ProjectMedia(
            project_id=project.id,
            kind="image",
            source_type="url",
            url=image_url,
            storage_path=None,
            original_filename=None,
            mime_type=None,
            size_bytes=None,
            sort_order=sort_index,
        )
        db.add(media)
        sort_index += 1

    if video_url:
        media = models.ProjectMedia(
            project_id=project.id,
            kind="video",
            source_type="url",
            url=video_url,
            storage_path=None,
            original_filename=None,
            mime_type=None,
            size_bytes=None,
            sort_order=sort_index,
        )
        db.add(media)


def create_project(
    db: Session,
    *,
    title: str,
    region_id: str,
    mouqataa: str | None,
    category: str,
    description: str,
    impact: str,
    project_date: str | None,
    existing_media_json: str | None,
    image_files: list[UploadFile],
    video_file: UploadFile | None,
    image_urls: list[str],
    video_url: str | None,
) -> schemas.ProjectRead:
    project = models.Project(
        title=title.strip(),
        region_id=region_id.strip(),
        mouqataa=mouqataa.strip() if mouqataa else None,
        category=category.strip(),
        description=description.strip(),
        impact=impact.strip(),
        project_date=_parse_date(project_date),
    )
    db.add(project)
    db.flush()

    _persist_media(
        db,
        project,
        existing_media_json=existing_media_json,
        image_files=image_files,
        video_file=video_file,
        image_urls=image_urls,
        video_url=video_url,
    )
    db.commit()
    db.refresh(project)
    return _project_to_read(project)


def update_project(
    db: Session,
    project: models.Project,
    *,
    title: str,
    region_id: str,
    mouqataa: str | None,
    category: str,
    description: str,
    impact: str,
    project_date: str | None,
    existing_media_json: str | None,
    image_files: list[UploadFile],
    video_file: UploadFile | None,
    image_urls: list[str],
    video_url: str | None,
) -> schemas.ProjectRead:
    current_media_payload = [
        {
            "kind": media.kind,
            "source_type": media.source_type,
            "url": media.url,
            "storage_path": media.storage_path,
            "original_filename": media.original_filename,
            "mime_type": media.mime_type,
            "size_bytes": media.size_bytes,
        }
        for media in list(project.media)
    ]

    for media in list(project.media):
        db.delete(media)

    project.title = title.strip()
    project.region_id = region_id.strip()
    project.mouqataa = mouqataa.strip() if mouqataa else None
    project.category = category.strip()
    project.description = description.strip()
    project.impact = impact.strip()
    project.project_date = _parse_date(project_date)

    db.flush()

    _persist_media(
        db,
        project,
        existing_media_json=existing_media_json or json.dumps(current_media_payload),
        image_files=image_files,
        video_file=video_file,
        image_urls=image_urls,
        video_url=video_url,
    )
    db.commit()
    db.refresh(project)
    return _project_to_read(project)


def delete_project(db: Session, project: models.Project) -> None:
    for media in list(project.media):
        delete_from_cloudinary(media.storage_path, media.kind)
    db.delete(project)
    db.commit()


# ── News ──────────────────────────────────────────────────────────────────────

def _news_to_read(article: models.NewsArticle) -> schemas.NewsRead:
    media = list(article.media)
    images = [item.url for item in media if item.kind == "image"]
    video_url = next((item.url for item in media if item.kind == "video"), None)
    return schemas.NewsRead.model_validate(
        {
            "id": article.id,
            "title": article.title,
            "title_fr": article.title_fr,
            "title_en": article.title_en,
            "excerpt": article.excerpt,
            "excerpt_fr": article.excerpt_fr,
            "excerpt_en": article.excerpt_en,
            "body": article.body,
            "body_fr": article.body_fr,
            "body_en": article.body_en,
            "category": article.category,
            "category_fr": article.category_fr,
            "category_en": article.category_en,
            "published_at": article.published_at,
            "created_at": article.created_at,
            "updated_at": article.updated_at,
            "media": [schemas.NewsMediaRead.model_validate(m) for m in media],
            "images": images,
            "video_url": video_url,
        }
    )


def _persist_news_media(
    db: Session,
    article: models.NewsArticle,
    *,
    existing_media_json: str | None,
    image_files: list[UploadFile],
    video_file: UploadFile | None,
) -> None:
    sort_index = 0
    existing_media = _store_existing_media(existing_media_json)

    for item in existing_media:
        kind = item.get("kind")
        url = item.get("url")
        if not kind or not url:
            continue
        media = models.NewsMedia(
            article_id=article.id,
            kind=kind,
            source_type=item.get("source_type", "upload"),
            url=url,
            storage_path=item.get("storage_path"),
            original_filename=item.get("original_filename"),
            mime_type=item.get("mime_type"),
            size_bytes=item.get("size_bytes"),
            sort_order=sort_index,
        )
        db.add(media)
        sort_index += 1

    for image_file in image_files:
        stored = upload_to_cloudinary(
            image_file.file,
            kind="image",
            filename=image_file.filename,
            mime_type=image_file.content_type,
        )
        media = models.NewsMedia(
            article_id=article.id,
            kind="image",
            source_type="upload",
            url=stored.url,
            storage_path=stored.storage_path,
            original_filename=stored.original_filename,
            mime_type=stored.mime_type,
            size_bytes=stored.size_bytes,
            sort_order=sort_index,
        )
        db.add(media)
        sort_index += 1

    if video_file is not None:
        stored = upload_to_cloudinary(
            video_file.file,
            kind="video",
            filename=video_file.filename,
            mime_type=video_file.content_type,
        )
        media = models.NewsMedia(
            article_id=article.id,
            kind="video",
            source_type="upload",
            url=stored.url,
            storage_path=stored.storage_path,
            original_filename=stored.original_filename,
            mime_type=stored.mime_type,
            size_bytes=stored.size_bytes,
            sort_order=sort_index,
        )
        db.add(media)


def list_news(db: Session) -> list[schemas.NewsRead]:
    articles = (
        db.query(models.NewsArticle)
        .order_by(models.NewsArticle.published_at.desc())
        .all()
    )
    return [_news_to_read(a) for a in articles]


def get_news_article(db: Session, article_id: str) -> models.NewsArticle | None:
    return (
        db.query(models.NewsArticle)
        .filter(models.NewsArticle.id == article_id)
        .first()
    )


def create_news(
    db: Session,
    *,
    title: str,
    excerpt: str,
    body: str,
    category: str,
    published_at: str | None,
    existing_media_json: str | None,
    image_files: list[UploadFile],
    video_file: UploadFile | None,
) -> schemas.NewsRead:
    article = models.NewsArticle(
        title=title.strip(),
        excerpt=excerpt.strip(),
        body=body.strip(),
        category=category.strip(),
        published_at=_parse_date(published_at),
    )
    db.add(article)
    db.flush()

    _persist_news_media(
        db,
        article,
        existing_media_json=existing_media_json,
        image_files=image_files,
        video_file=video_file,
    )
    db.commit()
    db.refresh(article)
    return _news_to_read(article)


def update_news(
    db: Session,
    article: models.NewsArticle,
    *,
    title: str,
    excerpt: str,
    body: str,
    category: str,
    published_at: str | None,
    existing_media_json: str | None,
    image_files: list[UploadFile],
    video_file: UploadFile | None,
) -> schemas.NewsRead:
    current_media_payload = [
        {
            "kind": m.kind,
            "source_type": m.source_type,
            "url": m.url,
            "storage_path": m.storage_path,
            "original_filename": m.original_filename,
            "mime_type": m.mime_type,
            "size_bytes": m.size_bytes,
        }
        for m in list(article.media)
    ]

    for m in list(article.media):
        db.delete(m)

    article.title = title.strip()
    article.excerpt = excerpt.strip()
    article.body = body.strip()
    article.category = category.strip()
    article.published_at = _parse_date(published_at)

    db.flush()

    _persist_news_media(
        db,
        article,
        existing_media_json=existing_media_json or json.dumps(current_media_payload),
        image_files=image_files,
        video_file=video_file,
    )
    db.commit()
    db.refresh(article)
    return _news_to_read(article)


def delete_news(db: Session, article: models.NewsArticle) -> None:
    for m in list(article.media):
        delete_from_cloudinary(m.storage_path, m.kind)
    db.delete(article)
    db.commit()


# ── Volunteer Applications ────────────────────────────────────────────────────

def create_volunteer(
    db: Session,
    *,
    name: str,
    email: str,
    phone: str,
    region: str,
    interest: str,
    experience: str,
) -> schemas.VolunteerApplicationRead:
    application = models.VolunteerApplication(
        name=name.strip(),
        email=email.strip(),
        phone=phone.strip(),
        region=region.strip(),
        interest=interest.strip(),
        experience=experience.strip(),
    )
    db.add(application)
    db.commit()
    db.refresh(application)
    return schemas.VolunteerApplicationRead.model_validate(application)


def list_volunteers(db: Session) -> list[schemas.VolunteerApplicationRead]:
    apps = (
        db.query(models.VolunteerApplication)
        .order_by(models.VolunteerApplication.submitted_at.desc())
        .all()
    )
    return [schemas.VolunteerApplicationRead.model_validate(a) for a in apps]


def get_volunteer(db: Session, volunteer_id: str) -> models.VolunteerApplication | None:
    return (
        db.query(models.VolunteerApplication)
        .filter(models.VolunteerApplication.id == volunteer_id)
        .first()
    )


def update_volunteer_status(
    db: Session,
    application: models.VolunteerApplication,
    status: str,
) -> schemas.VolunteerApplicationRead:
    application.status = status
    db.commit()
    db.refresh(application)
    return schemas.VolunteerApplicationRead.model_validate(application)


def delete_volunteer(db: Session, application: models.VolunteerApplication) -> None:
    db.delete(application)
    db.commit()


# ── Background translation tasks ──────────────────────────────────────────────

def _bg_translate_project(session_factory, project_id: str) -> None:
    from .translation import translate_text
    db = session_factory()
    try:
        proj = db.query(models.Project).filter(models.Project.id == project_id).first()
        if not proj:
            return
        proj.title_fr = translate_text(proj.title, "fr")
        proj.title_en = translate_text(proj.title, "en")
        proj.description_fr = translate_text(proj.description, "fr")
        proj.description_en = translate_text(proj.description, "en")
        proj.impact_fr = translate_text(proj.impact, "fr")
        proj.impact_en = translate_text(proj.impact, "en")
        proj.category_fr = translate_text(proj.category, "fr")
        proj.category_en = translate_text(proj.category, "en")
        db.commit()
    except Exception:
        db.rollback()
    finally:
        db.close()


def _bg_retranslate_all(session_factory) -> None:
    # Retranslate every record — covers both NULL and bad data (e.g. stored error strings)
    db = session_factory()
    try:
        project_ids = [p.id for p in db.query(models.Project.id).all()]
        article_ids = [a.id for a in db.query(models.NewsArticle.id).all()]
    finally:
        db.close()

    for pid in project_ids:
        _bg_translate_project(session_factory, pid)

    for aid in article_ids:
        _bg_translate_news(session_factory, aid)


def _bg_translate_news(session_factory, article_id: str) -> None:
    from .translation import translate_text
    db = session_factory()
    try:
        art = db.query(models.NewsArticle).filter(models.NewsArticle.id == article_id).first()
        if not art:
            return
        art.title_fr = translate_text(art.title, "fr")
        art.title_en = translate_text(art.title, "en")
        art.excerpt_fr = translate_text(art.excerpt, "fr")
        art.excerpt_en = translate_text(art.excerpt, "en")
        art.body_fr = translate_text(art.body, "fr")
        art.body_en = translate_text(art.body, "en")
        art.category_fr = translate_text(art.category, "fr")
        art.category_en = translate_text(art.category, "en")
        db.commit()
    except Exception:
        db.rollback()
    finally:
        db.close()
