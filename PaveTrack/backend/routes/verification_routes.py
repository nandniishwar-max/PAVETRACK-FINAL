from fastapi import APIRouter, HTTPException
from config.database import db
from services.verification_service import verify_repair
from datetime import datetime


router = APIRouter(
    prefix="/api/verification",
    tags=["AI Verification"]
)


@router.post("/{pothole_id}")
def verify_pothole_repair(
    pothole_id: str
):

    pothole = db.reports.find_one({
        "_id": pothole_id
    })

    if not pothole:
        raise HTTPException(
            status_code=404,
            detail="Pothole report not found"
        )

    repairs = list(
        db.repairs.find({
            "pothole_id": pothole_id
        })
    )

    if not repairs:
        raise HTTPException(
            status_code=404,
            detail="No repair evidence found"
        )

    latest_repair = repairs[-1]

    before_media = (
        pothole.get("media_url")
        or pothole.get("image_url")
    )

    after_media = latest_repair.get(
        "media_url"
    )

    if not before_media:
        raise HTTPException(
            status_code=400,
            detail="Before image/video is missing"
        )

    if not after_media:
        raise HTTPException(
            status_code=400,
            detail="After image/video is missing"
        )

    result = verify_repair(
        before_media,
        after_media,

        pothole["latitude"],
        pothole["longitude"],

        latest_repair["latitude"],
        latest_repair["longitude"]
    )

    new_status = result[
        "verification_status"
    ]

    timeline = pothole.get(
        "timeline",
        []
    )

    if new_status == "verified":

        timeline.append({
            "status": "ai_verified",
            "timestamp": datetime.now().isoformat()
        })

    elif new_status == "manual_review":

        timeline.append({
            "status": "manual_review",
            "timestamp": datetime.now().isoformat()
        })

    db.reports.update_one(
        {"_id": pothole_id},
        {
            "$set": {
                "status": new_status,
                "verification": result,
                "updated_at": datetime.now().isoformat(),
                "timeline": timeline
            }
        }
    )

    return {
        "pothole_id": pothole_id,

        "before_media": before_media,

        "after_media": after_media,

        "verification": result
    }