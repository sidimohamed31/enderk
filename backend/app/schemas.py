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
    region_id: str
    mouqataa: str | None = None
    category: str
    description: str
    impact: str
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
    excerpt: str
    body: str
    category: str
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

