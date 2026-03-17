"""
SarkarConnect AI — FastAPI Backend
===================================
Agentic grievance-resolution API powered by a LangGraph
state machine with 3 legal-processing nodes.

Run with:  uvicorn main:app --reload
"""

from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

from models.schemas import GrievanceRequest, GrievanceResponse
from agents.graph import grievance_graph
from database import insert_new_grievance, get_user_grievances

app = FastAPI(
    title="SarkarConnect AI",
    description="AI-powered legal grievance resolution using LangGraph agents",
    version="0.1.0",
)

# ── CORS (allow frontend app during development) ─────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Health ─────────────────────────────────────────────────────
@app.get("/health")
async def health():
    """Simple liveness probe."""
    return {"status": "ok"}


# ─── Submit Grievance (Text/JSON) ───────────────────────────────
@app.post("/api/v1/grievances", response_model=GrievanceResponse)
async def submit_grievance_text(req: GrievanceRequest):
    """
    Accept a JSON grievance and run it through the
    LangGraph pipeline.
    """
    initial_state = {
        "complaint_text": req.complaint_text,
        "user_id": req.user_id,
        "location": req.location,
        "summary": None,
        "legal_sections": [],
        "severity": 1,
        "department": None,
        "recommended_action": None,
        "escalated": False,
        "auditor_notes": None,
        "legal_draft": None,
        "cloud_synced": False,
    }

    try:
        result = await grievance_graph.ainvoke(initial_state)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return GrievanceResponse(
        grievance_id=f"GRV-{abs(hash(req.complaint_text)) % 100000:05d}",
        summary=result.get("summary"),
        matter_type=result.get("matter_type", "Criminal"),
        locality_alert=result.get("locality_alert"),
        legal_sections=result.get("legal_sections", []),
        severity=result.get("severity", 1),
        department=result.get("department", "General"),
        recommended_action=result.get("recommended_action"),
        escalated=result.get("escalated", False),
        legal_draft=result.get("legal_draft"),
        cloud_synced=result.get("cloud_synced", False),
        status="escalated" if result.get("escalated") else "processed",
    )


# ─── Submit Grievance (Audio/Multipart) ──────────────────────────
@app.post("/submit-grievance", response_model=GrievanceResponse)
async def submit_grievance_audio(
    user_id: str = Form(...),
    location: Optional[str] = Form(None),
    audio_file: UploadFile = File(...),
):
    """
    Accept an audio file grievance and run it through the
    LangGraph pipeline:
        legal_researcher → grievance_auditor → clerk_agent
    """
    # In a real app, you would:
    # 1. Save or stream the audio_file to a storage bucket
    # 2. Transcribe the audio using OpenAI Whisper (openai_service.transcribe)
    # 3. Pass the transcription to the LangGraph pipeline
    
    # Placeholder transcription for demo
    dummy_text = f"Audio grievance from {user_id}. File: {audio_file.filename}. This is a placeholder for transcribed text."

    # Build initial state for the graph
    initial_state = {
        "complaint_text": dummy_text,
        "user_id": user_id,
        "location": location,
        "summary": None,
        "legal_sections": [],
        "severity": 1,
        "department": None,
        "recommended_action": None,
        "escalated": False,
        "auditor_notes": None,
        "legal_draft": None,
        "cloud_synced": False,
    }

    # Run the LangGraph state machine
    try:
        result = await grievance_graph.ainvoke(initial_state)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return GrievanceResponse(
        grievance_id=f"GRV-{abs(hash(dummy_text)) % 100000:05d}",
        summary=result.get("summary"),
        matter_type=result.get("matter_type", "Criminal"),
        locality_alert=result.get("locality_alert"),
        legal_sections=result.get("legal_sections", []),
        severity=result.get("severity", 1),
        department=result.get("department", "General"),
        recommended_action=result.get("recommended_action"),
        escalated=result.get("escalated", False),
        legal_draft=result.get("legal_draft"),
        cloud_synced=result.get("cloud_synced", False),
        status="escalated" if result.get("escalated") else "processed",
    )


# ─── Get Grievance History ──────────────────────────────────────
@app.get("/api/v1/history/{user_id}")
async def get_history(user_id: str):
    """
    Retrieve all grievances submitted by a specific user
    from the Supabase cloud database.
    """
    try:
        history = get_user_grievances(user_id)
        # Supabase returns ISO strings for timestamptz usually, 
        # but we ensure consistency here.
        return history
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Supabase error: {str(e)}")
