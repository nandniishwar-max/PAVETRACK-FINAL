from fastapi import APIRouter, HTTPException
from schemas.repair_schema import RepairVerification
from config.database import db
from datetime import datetime


router = APIRouter(
    prefix="/api/repairs",
    tags=["Repair Verification"]
)


@router.post("/verify")
def submit_repair_evidence(repair: RepairVerification):
    pothole = db.reports.find_one({"_id": repair.pothole_id})

    if not pothole:
        raise HTTPException(status_code=404, detail="Pothole report not found")

    repair_data = repair.model_dump()
    repair_data["submitted_at"] = datetime.now().isoformat()

    result = db.repairs.insert_one(repair_data)

    timeline = pothole.get("timeline", [])
    timeline.append({
        "status": "repair_submitted",
        "timestamp": datetime.now().isoformat(),
    })

    db.reports.update_one(
        {"_id": repair.pothole_id},
        {
            "$set": {
                "status": "repair_submitted",
                "updated_at": datetime.now().isoformat(),
                "timeline": timeline,
            }
        },
    )

    return {
        "message": "Repair evidence submitted successfully",
        "repair_id": str(result.inserted_id),
        "pothole_id": repair.pothole_id,
    }


@router.get("/{pothole_id}")
def get_repairs_for_pothole(pothole_id: str):
    if not db.reports.find_one({"_id": pothole_id}):
        raise HTTPException(status_code=404, detail="Pothole report not found")

    return list(db.repairs.find({"pothole_id": pothole_id}))
