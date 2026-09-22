from fastapi import APIRouter
from config.database import db


router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard"],
)


@router.get("/stats")
def get_stats():
    reports = list(db.reports.find())

    total = len(reports)
    resolved = sum(
        1 for r in reports
        if r.get("status") in {"closed", "ai_verified"}
    )
    in_progress = max(total - resolved, 0)

    announcements = [
        {
            "id": "roadworks-mvp",
            "title": "PaveTrack live repair monitoring",
            "status": "Active",
        }
    ]

    return {
        "total_complaints": total,
        "in_progress": in_progress,
        "resolved": resolved,
        "announcements_count": len(announcements),
        "announcements": announcements,
    }
