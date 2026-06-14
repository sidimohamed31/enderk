from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict


class MediaRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    kind: Literal["image", "video"]
    source_type: Literal["upload", "url"]
    url: str
    storage_path: str | None = None
    original_filename: str | None = None
    mime_type: str | None = None
    size_bytes: int | None = None
    sort_order: int
    created_at: datetime


class ProjectRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    title_fr: str | None = None
    title_en: str | None = None
    region_id: str
    mouqataa: str | None = None
    category: str
    category_fr: str | None = None
    category_en: str | None = None
    description: str
    description_fr: str | None = None
    description_en: str | None = None
    impact: str
    impact_fr: str | None = None
    impact_en: str | None = None
    project_date: date
    created_at: datetime
    updated_at: datetime
    media: list[MediaRead]
    images: list[str]
    video_url: str | None


class ProjectListResponse(BaseModel):
    projects: list[ProjectRead]


class NewsMediaRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    kind: Literal["image", "video"]
    source_type: Literal["upload", "url"]
    url: str
    storage_path: str | None = None
    original_filename: str | None = None
    mime_type: str | None = None
    size_bytes: int | None = None
    sort_order: int
    created_at: datetime


class NewsRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    title_fr: str | None = None
    title_en: str | None = None
    excerpt: str
    excerpt_fr: str | None = None
    excerpt_en: str | None = None
    body: str
    body_fr: str | None = None
    body_en: str | None = None
    category: str
    category_fr: str | None = None
    category_en: str | None = None
    published_at: date
    created_at: datetime
    updated_at: datetime
    media: list[NewsMediaRead]
    images: list[str]
    video_url: str | None


class VolunteerApplicationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    email: str
    phone: str
    region: str
    interest: str
    experience: str
    status: str
    submitted_at: datetime


class StatusUpdate(BaseModel):
    status: str

