"""
LangGraph State Machine
========================
3-node linear pipeline for legal grievance processing:

    legal_researcher → grievance_auditor → clerk_agent
"""

from langgraph.graph import StateGraph, END
from agents.nodes import (
    GrievanceState,
    legal_researcher,
    grievance_auditor,
    clerk_agent,
)


def build_graph():
    """Construct and compile the LangGraph StateGraph."""

    workflow = StateGraph(GrievanceState)

    # ── Register nodes ──────────────────────────────────────────
    workflow.add_node("legal_researcher", legal_researcher)
    workflow.add_node("grievance_auditor", grievance_auditor)
    workflow.add_node("clerk_agent", clerk_agent)

    # ── Wire edges ──────────────────────────────────────────────
    workflow.set_entry_point("legal_researcher")
    workflow.add_edge("legal_researcher", "grievance_auditor")
    workflow.add_edge("grievance_auditor", "clerk_agent")
    workflow.add_edge("clerk_agent", END)

    return workflow.compile()


# Pre-compiled graph — import and call  grievance_graph.invoke(state)
grievance_graph = build_graph()
