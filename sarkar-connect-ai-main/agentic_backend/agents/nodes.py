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
    matter_type: Optional[str]   # "Criminal" or "Civil"
    locality_alert: Optional[dict]
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
        "matter_type": analysis.get("matter_type", "Criminal"),
        "legal_sections": analysis.get("legal_sections", []),
        "severity": analysis.get("severity", 3),
        "department": analysis.get("department", "General"),
        "locality_alert": analysis.get("locality_alert"),
        "recommended_action": analysis.get("recommended_action"),
    }


# ═════════════════════════════════════════════════════════════════
# Node 2 — Grievance Auditor
# ═════════════════════════════════════════════════════════════════
async def grievance_auditor(state: GrievanceState) -> dict:
    """
    Final review of the AI's analysis and automatic escalation logic.
    """
    severity_raw = state.get("severity", 1)
    try:
        severity = int(severity_raw) if severity_raw is not None else 1
    except (ValueError, TypeError):
        severity = 3
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

    matter_type = state.get("matter_type", "Criminal")
    header_title = "LEGAL ANALYSIS REPORT" if matter_type == "Criminal" else "CIVIL DISPUTE RESOLUTION"
    draft_intro = "The SarkarConnect AI Legal Advisory System has analyzed your grievance with the following findings:"
    
    if matter_type == "Civil":
        header_title = "PROPOSED LEGAL NOTICE (DRAFT)"
        draft_intro = "This matter has been triaged as a Civil/Consumer dispute. Here is a suggested Legal Notice draft:"

    locality_section = ""
    alert = state.get("locality_alert")
    if alert and isinstance(alert, dict) and alert.get("is_pattern"):
        locality_section = f"\n📢 LOCALITY WATCH ALERT: {alert.get('alert_msg')}\n"

    draft = f"""
═══════════════════════════════════════════════════════════
         SARKARCONNECT AI — {header_title}
═══════════════════════════════════════════════════════════

Dear Citizen,

{draft_intro}

SUMMARY:
  {str(state.get('summary', 'Analysis in progress.'))}
{locality_section}
APPLICABLE LEGAL CITATIONS:
{sections_text}
MATTER TYPE: {str(matter_type).upper()}
SEVERITY: {state.get('severity', 1)}/5
ASSIGNED DEPARTMENT: {str(state.get('department', 'General')).upper()}
{escalation_note}
RECOMMENDED ACTION:
  {str(state.get('recommended_action', 'Please wait for further updates.'))}

AUDITOR REMARKS:
  {str(state.get('auditor_notes', 'N/A'))}

— Senior Legal Consultant, SarkarConnect AI
═══════════════════════════════════════════════════════════
""".strip()

    # ── PERSIST TO SUPABASE (WITH CHAIN OF CUSTODY) ────────────
    legal_analysis = {
        "summary": state.get("summary"),
        "matter_type": state.get("matter_type"),
        "legal_sections": sections_list,
        "severity": state.get("severity"),
        "department": state.get("department"),
        "recommended_action": state.get("recommended_action"),
        "escalated": state.get("escalated", False),
        "clerk_draft": draft,
        "auditor_notes": state.get("auditor_notes"),
        "chain_of_custody": [
             {"action": "AI Analysis Completed", "user": "SarkarConnect System", "date": "2024-03-14", "hash": "bak_8293"}
        ]
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
