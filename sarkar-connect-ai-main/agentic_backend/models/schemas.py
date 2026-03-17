"""
Pydantic Models & LangGraph State
==================================
Data schemas for the SarkarConnect AI legal-agent pipeline.
"""

from typing import Optional
from pydantic import BaseModel, Field


# ─── API Request / Response ─────────────────────────────────────
class GrievanceRequest(BaseModel):
    """Payload sent by the frontend app when a citizen files a grievance."""

    user_id: str = Field(..., description="Authenticated user ID")
    complaint_text: str = Field(..., min_length=10, max_length=5000,
                                description="Full text of the citizen complaint")
    location: Optional[str] = Field(None, description="Location of the incident")


class GrievanceResponse(BaseModel):
    """Final response returned to the citizen with rich AI analysis."""

    grievance_id: str
    summary: Optional[str] = None
    legal_sections: list[dict] = Field(default_factory=list,
                                       description="Matched BNS/IPC sections with descriptions")
    matter_type: Optional[str] = "Criminal"
    locality_alert: Optional[dict] = None
    severity: int = Field(3, description="1 (Low) to 5 (Critical)")
    department: str = Field("General", description="Responsible department")
    recommended_action: Optional[str] = None
    escalated: bool = False
    legal_draft: Optional[str] = None
    cloud_synced: bool = False
    status: str = "processed"


# ─── LangGraph State ────────────────────────────────────────────
class GrievanceState(BaseModel):
    """
    State object that flows through the 3-node LangGraph pipeline.
    """

    complaint_text: str
    user_id: str
    location: Optional[str] = None

    # Filled by legal_researcher (AI Consultant)
    summary: Optional[str] = None
    matter_type: Optional[str] = "Criminal"
    locality_alert: Optional[dict] = None
    legal_sections: list[dict] = Field(default_factory=list)
    severity: int = 1
    department: Optional[str] = None
    recommended_action: Optional[str] = None

    # Filled by grievance_auditor
    escalated: bool = False
    auditor_notes: Optional[str] = None

    # Filled by clerk_agent
    legal_draft: Optional[str] = None
    cloud_synced: bool = False
