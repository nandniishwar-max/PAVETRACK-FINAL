from pydantic import BaseModel


class ApprovalRequest(BaseModel):
    citizen_approved: bool = False
    authority_approved: bool = False