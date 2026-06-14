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
            "region_id": project.region_id,
            "mouqataa": project.mouqataa,
            "category": project.category,
            "description": project.description,
            "impact": project.impact,
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
