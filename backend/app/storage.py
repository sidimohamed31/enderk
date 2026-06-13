from __future__ import annotations

import mimetypes
import os
import shutil
import tempfile
from dataclasses import dataclass
from pathlib import Path
from typing import BinaryIO
from uuid import uuid4

import cloudinary
import cloudinary.uploader

from .config import get_settings

settings = get_settings()


@dataclass
class StoredMedia:
    url: str
    storage_path: str
    original_filename: str | None
    mime_type: str | None
    size_bytes: int | None


_cloudinary_configured = False


def init_cloudinary() -> None:
    global _cloudinary_configured

    if _cloudinary_configured:
        return

    cloudinary.config(
        cloud_name=settings.cloudinary_cloud_name,
        api_key=settings.cloudinary_api_key,
        api_secret=settings.cloudinary_api_secret,
        secure=True,
    )
    _cloudinary_configured = True


def _guess_extension(filename: str | None, mime_type: str | None) -> str:
    if filename:
        suffix = Path(filename).suffix
        if suffix:
            return suffix.lower()

    if mime_type:
        guessed = mimetypes.guess_extension(mime_type)
        if guessed:
            return guessed.lower()

    return ""


def _resource_type(kind: str, mime_type: str | None) -> str:
    if kind == "video":
        return "video"
    if mime_type and mime_type.startswith("video/"):
        return "video"
    return "image"


def _upload_via_tempfile(file_obj: BinaryIO, *, kind: str, filename: str | None, mime_type: str | None) -> StoredMedia:
    init_cloudinary()

    extension = _guess_extension(filename, mime_type)
    folder = f"{settings.cloudinary_folder}/{kind}"
    public_id = uuid4().hex
    resource_type = _resource_type(kind, mime_type)

    file_obj.seek(0)
    with tempfile.NamedTemporaryFile(delete=False, suffix=extension) as temp_file:
        shutil.copyfileobj(file_obj, temp_file)
        temp_path = temp_file.name

    try:
        if resource_type == "video":
            result = cloudinary.uploader.upload_large(
                temp_path,
                resource_type="video",
                folder=folder,
                public_id=public_id,
                overwrite=False,
            )
        else:
            result = cloudinary.uploader.upload(
                temp_path,
                resource_type="image",
                folder=folder,
                public_id=public_id,
                overwrite=False,
            )
    finally:
        try:
            os.unlink(temp_path)
        except OSError:
            pass

    return StoredMedia(
        url=result.get("secure_url", ""),
        storage_path=result.get("public_id", f"{folder}/{public_id}"),
        original_filename=filename,
        mime_type=mime_type,
        size_bytes=result.get("bytes"),
    )


def upload_to_cloudinary(file_obj: BinaryIO, *, kind: str, filename: str | None, mime_type: str | None) -> StoredMedia:
    return _upload_via_tempfile(file_obj, kind=kind, filename=filename, mime_type=mime_type)


def delete_from_cloudinary(storage_path: str | None, kind: str | None = None) -> None:
    if not storage_path:
        return

    init_cloudinary()
    resource_type = _resource_type(kind or "image", None)
    try:
        cloudinary.uploader.destroy(storage_path, resource_type=resource_type, invalidate=True)
    except Exception:
        pass
