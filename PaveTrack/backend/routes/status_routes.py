from fastapi import APIRouter, HTTPException
from config.database import db
from datetime import datetime


router = APIRouter(
    prefix="/api/status",
    tags=["Status Tracking"]
)


ALLOWED_TRANSITIONS = {
    "reported": ["verified"],
    "verified": ["assigned"],
    "assigned": ["work_started"],
    "work_started": ["repair_submitted"],
    "repair_submitted": ["ai_verified", "manual_review"],
    "ai_verified": ["closed"],
    "manual_review": ["ai_verified", "closed"]
}


@router.patch("/{report_id}")
def update_status(
    report_id: str,
    new_status: str
):

    report = db.reports.find_one({
        "_id": report_id
    })

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Report not found"
        )

    current_status = report.get(
        "status",
        "reported"
    )

    allowed = ALLOWED_TRANSITIONS.get(
        current_status,
        []
    )

    if new_status not in allowed:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot move from {current_status} to {new_status}"
        )

    timeline = report.get(
        "timeline",
        []
    )

    timeline.append({
        "status": new_status,
        "timestamp": datetime.now().isoformat()
    })

    db.reports.update_one(
        {"_id": report_id},
        {
            "$set": {
                "status": new_status,
                "updated_at": datetime.now().isoformat(),
                "timeline": timeline
            }
        }
    )

    return {
        "message": "Status updated successfully",
        "report_id": report_id,
        "status": new_status
    }