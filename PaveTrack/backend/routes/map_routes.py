from fastapi import APIRouter
from config.database import db


router = APIRouter(
    prefix="/api/map",
    tags=["Map"]
)


@router.get("/reports")
def get_map_reports():

    reports = list(
        db.reports.find()
    )

    markers = []

    for report in reports:

        markers.append({
            "id": report.get("_id"),
            "latitude": report.get("latitude"),
            "longitude": report.get("longitude"),
            "severity": report.get("severity"),
            "status": report.get("status"),
            "assigned_contractor": report.get(
                "assigned_contractor"
            ),
            "description": report.get(
                "description"
            )
        })

    return markers