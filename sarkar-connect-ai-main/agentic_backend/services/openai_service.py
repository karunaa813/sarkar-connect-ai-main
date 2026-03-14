"""
OpenAI Service
==============
Wrapper around the OpenAI API for classification,
priority scoring, and response generation.
"""

import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def get_embedding(text: str) -> list[float]:
    """Generate an embedding for the given text using OpenAI."""
    text = text.replace("\n", " ")
    return client.embeddings.create(input=[text], model="text-embedding-3-small").data[0].embedding


async def classify(text: str) -> str:
    """Classify a complaint into a category."""
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a government complaint classifier. "
                    "Categorise the complaint into exactly one of: "
                    "land, water, health, education, infrastructure, "
                    "law_enforcement, sanitation, other."
                ),
            },
            {"role": "user", "content": text},
        ],
        max_tokens=20,
    )
    return response.choices[0].message.content.strip().lower()


async def assess_priority(text: str) -> int:
    """Return a priority score 1 (low) – 5 (critical)."""
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": (
                    "Rate the urgency of this government complaint "
                    "from 1 (low) to 5 (critical). Reply with ONLY "
                    "the number."
                ),
            },
            {"role": "user", "content": text},
        ],
        max_tokens=5,
    )
    try:
        return int(response.choices[0].message.content.strip())
    except ValueError:
        return 3  # default medium priority


async def generate_response(category: str, department: str, assignment_id: str) -> str:
    """Generate a citizen-friendly acknowledgement."""
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a friendly government assistant. "
                    "Write a brief, reassuring acknowledgement for "
                    "a citizen who just filed a complaint."
                ),
            },
            {
                "role": "user",
                "content": (
                    f"Category: {category}, Department: {department}, "
                    f"Tracking ID: {assignment_id}"
                ),
            },
        ],
        max_tokens=150,
    )
    return response.choices[0].message.content.strip()
import json

async def analyze_legal_grievance(complaint_text: str, context_sections: list[dict] = []) -> dict:
    """
    Analyzes a citizen's complaint as a Senior Indian Legal Consultant.
    Uses context_sections from Pinecone RAG for grounded legal analysis.
    """
    context_text = ""
    if context_sections:
        context_text = "\n### POTENTIALLY RELEVANT LEGAL SECTIONS (from RAG):\n"
        for i, s in enumerate(context_sections):
            context_text += f"{i+1}. {s.get('act')} Section {s.get('section')}: {s.get('description')}\n"

    prompt = f"""
Act as a Senior Indian Legal Consultant and Grievance Redressal Officer for "SarkarConnect AI." Your goal is to analyze citizen complaints with 100% legal accuracy and empathy.

### YOUR EXPERTISE:
1. Deep knowledge of the Bharatiya Nyaya Sanhita (BNS) 2023 and the Indian Penal Code (IPC).
2. Expertise in Administrative Law and Civic Rights (Municipal Acts, RTI, Consumer Protection).
3. Ability to categorize grievances into government departments (Police, Municipal, Health, Revenue).

### OPERATIONAL GUIDELINES:
- LANGUAGE: You can understand Hinglish/Hindi but your primary reasoning must be professional. 
- FORMAT: Always output in a structured JSON format.
- TONE: Professional, grounded, and authoritative yet supportive.

{context_text}

### RESPONSE TASK:
1. SUMMARY: Provide a 1-sentence legal summary of the issue.
2. LEGAL CITATION: Identify the most applicable Section (BNS or IPC). Use the context sections provided above if they fit well, or your internal knowledge for the best legal grounding.
3. SEVERITY: Rate the issue from 1 (Low) to 5 (Critical).
4. DEPARTMENT: Recommend the exact government department responsible for this.
5. ACTIONABLE ADVICE: Tell the citizen the next immediate legal step they should take.

### OUTPUT SCHEMA (STRICT JSON):
{{
  "summary": "String",
  "legal_sections": [{{ "act": "BNS/IPC", "section": "Number", "description": "Brief Explanation" }}],
  "severity": 1-5,
  "department": "String",
  "recommended_action": "String"
}}

Do not provide legal disclaimers in the JSON. Keep the analysis sharp and fact-based.

COMPLAINT TEXT:
"{complaint_text}"
"""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"❌ OpenAI Service Error: {e}")
        # Graceful fallback for demo purposes when API is down/quota exceeded
        return {
            "summary": f"Initial analysis for: {complaint_text[:50]}...",
            "legal_sections": [
                { "act": "BNS 2024", "section": "General", "description": "Analysis pending (Service unavailable)" }
            ],
            "severity": 3,
            "department": "General Redressal",
            "recommended_action": "Your grievance has been received. Please wait while a human officer reviews the legal classification."
        }
