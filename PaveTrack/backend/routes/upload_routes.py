from fastapi import APIRouter, UploadFile, File, HTTPException
from pathlib import Path
import shutil
import uuid


router = APIRouter(
    prefix="/api/upload",
    tags=["File Upload"]
)


UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


ALLOWED_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".mp4",
    ".mov"
}


@router.post("/")
def upload_file(file: UploadFile = File(...)):

    extension = Path(file.filename).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type"
        )

    filename = f"{uuid.uuid4()}{extension}"

    file_path = UPLOAD_DIR / filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    media_type = (
        "video"
        if extension in {".mp4", ".mov"}
        else "image"
    )

    return {
        "message": "File uploaded successfully",
        "filename": filename,
        "file_url": f"/uploads/{filename}",
        "media_type": media_type
    }