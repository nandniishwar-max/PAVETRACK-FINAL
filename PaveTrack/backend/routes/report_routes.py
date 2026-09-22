from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from schemas.report_schema import PotholeReport
from config.database import db
from datetime import datetime


router = APIRouter(
    prefix="/api/reports",
    tags=["Reports"]
)


class StatusUpdate(BaseModel):
    status: str
    note: str = ""
    assigned_contractor: str | None = None


STATUS_ALIASES = {
    "Reported": "reported",
    "Assigned": "assigned",
    "Work Started": "work_started",
    "Repair Submitted": "repair_submitted",
    "AI Verification": "manual_review",
    "AI Verified": "ai_verified",
    "Verified": "verified",
    "Manual Review": "manual_review",
    "Closed": "closed",
    "reported": "reported",
    "assigned": "assigned",
    "work_started": "work_started",
    "repair_submitted": "repair_submitted",
    "ai_verified": "ai_verified",
    "verified": "verified",
    "manual_review": "manual_review",
    "closed": "closed",
}


@router.post("/")
def create_report(report: PotholeReport):
    now = datetime.now().isoformat()
    report_data = report.model_dump()
    report_data["created_at"] = now
    report_data["updated_at"] = now
    report_data["status"] = "reported"
    report_data["timeline"] = [{"status": "reported", "timestamp": now}]

    result = db.reports.insert_one(report_data)

    return {
        "message": "Pothole report created successfully",
        "report_id": str(result.inserted_id),
    }


@router.get("/")
def get_reports():
    return list(db.reports.find())


@router.get("/{report_id}")
def get_report(report_id: str):
    report = db.reports.find_one({"_id": report_id})

    if not report:
        raise HTTPException(status_code=404, detail="Pothole report not found")

    # Include the latest repair evidence so the frontend can render the
    # complete complaint details with a single request.
    report["repairs"] = db.repairs.find({"pothole_id": report_id})
    return report


@router.patch("/{report_id}/status")
def update_report_status(report_id: str, update: StatusUpdate):
    report = db.reports.find_one({"_id": report_id})

    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    new_status = STATUS_ALIASES.get(update.status, update.status)
    current_status = report.get("status", "reported")

    # Allow UI actions to move the complaint through the MVP workflow while
    # still rejecting unknown statuses.
    allowed = {
        "reported": {"reported", "verified", "assigned", "manual_review"},
        "verified": {"verified", "assigned", "closed", "manual_review"},
        "assigned": {"assigned", "work_started", "manual_review"},
        "work_started": {"work_started", "repair_submitted", "manual_review"},
        "repair_submitted": {"repair_submitted", "ai_verified", "manual_review", "verified"},
        "ai_verified": {"ai_verified", "closed", "manual_review"},
        "manual_review": {"manual_review", "ai_verified", "verified", "closed"},
        "closed": {"closed"},
    }

    if new_status not in allowed.get(current_status, {new_status}):
        raise HTTPException(
            status_code=400,
            detail=f"Cannot move from {current_status} to {new_status}",
        )

    now = datetime.now().isoformat()
    timeline = report.get("timeline", [])
    timeline.append({
        "status": new_status,
        "timestamp": now,
        "note": update.note,
    })

    fields = {
        "status": new_status,
        "updated_at": now,
        "timeline": timeline,
    }

    if update.assigned_contractor:
        fields["assigned_contractor"] = update.assigned_contractor

    db.reports.update_one({"_id": report_id}, {"$set": fields})

    return {
        "message": "Status updated successfully",
        "report_id": report_id,
        "status": new_status,
        "assigned_contractor": update.assigned_contractor or report.get("assigned_contractor"),
    }
