from __future__ import annotations

import re

from fastapi import APIRouter, Depends, FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .config import get_settings
from .crud import create_project, delete_project, get_project, list_projects, update_project
from .db import get_db, init_db

settings = get_settings()

app = FastAPI(title="ENDERK Projects API", version="1.0.0")
project_router = APIRouter()


class CollapseRepeatedSlashesMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] == "http":
            path = scope.get("path", "")
            collapsed = re.sub(r"/{2,}", "/", path)
            if collapsed and collapsed != path:
                scope = dict(scope)
                scope["path"] = collapsed
        await self.app(scope, receive, send)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list or ["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(CollapseRepeatedSlashesMiddleware)


@app.on_event("startup")
def on_startup() -> None:
    init_db()


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/")
def root():
    return {
        "status": "ok",
        "service": "ENDEREK API",
        "docs": "/docs",
        "health": "/health",
        "projects": "/projects",
    }


@project_router.get("/projects")
def get_projects(db: Session = Depends(get_db)):
    return {"projects": list_projects(db)}


@project_router.post("/projects", status_code=201)
def create_project_endpoint(
    title: str = Form(...),
    region_id: str = Form(...),
    category: str = Form(...),
    description: str = Form(...),
    impact: str = Form(""),
    project_date: str | None = Form(None),
    existing_media_json: str | None = Form(None),
    image_urls_json: str | None = Form(None),
    video_url: str | None = Form(None),
    image_files: list[UploadFile] = File(default_factory=list),
    video_file: UploadFile | None = File(None),
    db: Session = Depends(get_db),
):
    image_urls = []
    if image_urls_json:
        import json

        try:
            parsed = json.loads(image_urls_json)
            if isinstance(parsed, list):
                image_urls = [str(item).strip() for item in parsed if str(item).strip()]
        except json.JSONDecodeError:
            image_urls = []

    return create_project(
        db,
        title=title,
        region_id=region_id,
        category=category,
        description=description,
        impact=impact,
        project_date=project_date,
        existing_media_json=existing_media_json,
        image_files=image_files or [],
        video_file=video_file,
        image_urls=image_urls,
        video_url=video_url.strip() if video_url else None,
    )


@project_router.put("/projects/{project_id}")
def update_project_endpoint(
    project_id: str,
    title: str = Form(...),
    region_id: str = Form(...),
    category: str = Form(...),
    description: str = Form(...),
    impact: str = Form(""),
    project_date: str | None = Form(None),
    existing_media_json: str | None = Form(None),
    image_urls_json: str | None = Form(None),
    video_url: str | None = Form(None),
    image_files: list[UploadFile] = File(default_factory=list),
    video_file: UploadFile | None = File(None),
    db: Session = Depends(get_db),
):
    project = get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    image_urls = []
    if image_urls_json:
        import json

        try:
            parsed = json.loads(image_urls_json)
            if isinstance(parsed, list):
                image_urls = [str(item).strip() for item in parsed if str(item).strip()]
        except json.JSONDecodeError:
            image_urls = []

    return update_project(
        db,
        project,
        title=title,
        region_id=region_id,
        category=category,
        description=description,
        impact=impact,
        project_date=project_date,
        existing_media_json=existing_media_json,
        image_files=image_files or [],
        video_file=video_file,
        image_urls=image_urls,
        video_url=video_url.strip() if video_url else None,
    )


@project_router.delete("/projects/{project_id}", status_code=204)
def delete_project_endpoint(project_id: str, db: Session = Depends(get_db)):
    project = get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    delete_project(db, project)
    return None


app.include_router(project_router)
app.include_router(project_router, prefix="/api")
