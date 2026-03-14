"""
LangGraph Agent Nodes
======================
Three specialised nodes for the SarkarConnect AI legal pipeline.

    1. legal_researcher  – queries Pinecone for matching BNS/IPC sections
    2. grievance_auditor – assesses severity & decides escalation
    3. clerk_agent       – formats the final legal draft for the citizen
"""

from typing import TypedDict, Optional


# ─── State TypedDict (used by LangGraph) ────────────────────────
class GrievanceState(TypedDict):
    complaint_text: str
    user_id: str
    location: Optional[str]
    summary: Optional[str]
    legal_sections: list[dict]  # List of {act, section, description}
    severity: Optional[int]      # 1-5
    department: Optional[str]
    recommended_action: Optional[str]
    escalated: bool
    auditor_notes: Optional[str]
    legal_draft: Optional[str]


# ═════════════════════════════════════════════════════════════════
# Node 1 — Legal Researcher (AI Consultant)
# ═════════════════════════════════════════════════════════════════
from services.openai_service import analyze_legal_grievance
from services.supabase_service import query_legal_sections
import asyncio

async def legal_researcher(state: GrievanceState) -> dict:
    """
    RAG-powered node:
    1. Queries Pinecone for relevant Indian Law sections.
    2. Calls the AI Consultant with the retrieved context.
    """
    text = state["complaint_text"]
    
    # 1. Retrieve Law Context from Pinecone
    context_sections = query_legal_sections(text, top_k=3)
    
    # 2. Analyze using AI Consultant with Grounded Context
    analysis = await analyze_legal_grievance(text, context_sections=context_sections)

    return {
        "summary": analysis.get("summary"),
        "legal_sections": analysis.get("legal_sections", []),
        "severity": analysis.get("severity", 3),
        "department": analysis.get("department", "General"),
        "recommended_action": analysis.get("recommended_action"),
    }


# ═════════════════════════════════════════════════════════════════
# Node 2 — Grievance Auditor
# ═════════════════════════════════════════════════════════════════
async def grievance_auditor(state: GrievanceState) -> dict:
    """
    Final review of the AI's analysis and automatic escalation logic.
    """
    severity = state.get("severity", 1)
    escalated = severity >= 4  # Critical or High

    notes = (
        f"AI Consultant identified the issue for the {state.get('department')} department. "
        f"Severity: {severity}/5. "
        f"{'Escalated for immediate review.' if escalated else 'Queued for standard redressal.'}"
    )

    return {
        "escalated": escalated,
        "auditor_notes": notes,
    }


# ═════════════════════════════════════════════════════════════════
# Node 3 — Clerk Agent
# ═════════════════════════════════════════════════════════════════
from database import insert_new_grievance

async def clerk_agent(state: GrievanceState) -> dict:
    """
    Format a professional legal draft based on the AI analysis
    and persist the final state into Supabase Cloud.
    """
    sections_list = state.get("legal_sections", [])
    sections_text = ""
    for item in sections_list:
        act = item.get("act", "N/A")
        sec = item.get("section", "N/A")
        desc = item.get("description", "")
        sections_text += f"  • {act} Section {sec}: {desc}\n"

    escalation_note = ""
    if state.get("escalated"):
        escalation_note = (
            "\n⚠️  CRITICAL: This case has been escalated for high-priority "
            "review by a Senior Grievance Officer.\n"
        )

    draft = f"""
═══════════════════════════════════════════════════════════
         SARKARCONNECT AI — LEGAL ANALYSIS REPORT
═══════════════════════════════════════════════════════════

Dear Citizen,

The SarkarConnect AI Legal Advisory System has analyzed your
grievance with the following findings:

SUMMARY:
  {state.get('summary', 'Analysis in progress.')}

APPLICABLE LEGAL CITATIONS:
{sections_text}
SEVERITY: {state.get('severity', 1)}/5
ASSIGNED DEPARTMENT: {state.get('department', 'General').upper()}
{escalation_note}
RECOMMENDED ACTION:
  {state.get('recommended_action', 'Please wait for further updates.')}

AUDITOR REMARKS:
  {state.get('auditor_notes', 'N/A')}

— Senior Legal Consultant, SarkarConnect AI
═══════════════════════════════════════════════════════════
""".strip()

    # ── PERSIST TO SUPABASE ─────────────────────────────────────
    legal_analysis = {
        "summary": state.get("summary"),
        "legal_sections": sections_list,
        "severity": state.get("severity"),
        "department": state.get("department"),
        "recommended_action": state.get("recommended_action"),
        "escalated": state.get("escalated", False),
        "clerk_draft": draft,
        "auditor_notes": state.get("auditor_notes")
    }

    # Use the new Supabase function
    response = insert_new_grievance(
        description=state["complaint_text"],
        legal_analysis_json=legal_analysis
    )

    return {
        "legal_draft": draft,
        "cloud_synced": True if response else False
    }
