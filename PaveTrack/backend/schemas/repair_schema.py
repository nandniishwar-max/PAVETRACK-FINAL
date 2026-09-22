from pydantic import BaseModel
from typing import Optional


class RepairVerification(BaseModel):
    pothole_id: str

    media_url: Optional[str] = None
    media_type: Optional[str] = None

    latitude: float
    longitude: float

    repair_description: Optional[str] = None

    verification_status: str = "pending"