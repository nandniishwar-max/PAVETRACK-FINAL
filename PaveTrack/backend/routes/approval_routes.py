from fastapi import APIRouter, HTTPException
from config.database import db
from schemas.approval_schema import ApprovalRequest
from datetime import datetime


router = APIRouter(
    prefix="/api/approval",
    tags=["Approval"]
)


@router.post("/{report_id}")
def approve_report(
    report_id: str,
    approval: ApprovalRequest
):

    report = db.reports.find_one({
        "_id": report_id
    })

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Report not found"
        )

    if report.get("status") != "verified":
        raise HTTPException(
            status_code=400,
            detail="Report must pass AI verification first"
        )

    if not approval.citizen_approved:
        raise HTTPException(
            status_code=400,
            detail="Citizen approval is required"
        )

    if not approval.authority_approved:
        raise HTTPException(
            status_code=400,
            detail="Authority approval is required"
        )

    timeline = report.get(
        "timeline",
        []
    )

    timeline.append({
        "status": "closed",
        "timestamp": datetime.now().isoformat()
    })

    db.reports.update_one(
        {"_id": report_id},
        {
            "$set": {
                "status": "closed",
                "citizen_approved": True,
                "authority_approved": True,
                "closed_at": datetime.now().isoformat(),
                "timeline": timeline
            }
        }
    )

    return {
        "message": "Complaint approved and closed",
        "report_id": report_id,
        "status": "closed"
    }