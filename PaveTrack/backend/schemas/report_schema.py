from pydantic import BaseModel
from typing import Optional


class PotholeReport(BaseModel):
    description: Optional[str] = None

    severity: str

    latitude: float
    longitude: float

    media_url: Optional[str] = None
    media_type: Optional[str] = None

    status: str = "reported"

    assigned_contractor: Optional[str] = None

    # Optional frontend metadata retained by the backend.
    address_text: Optional[str] = None
    area: Optional[str] = None
    citizen_id: Optional[str] = None
