import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

# ── Supabase Initialization ─────────────────────────────────────
# Using os.environ for strict cloud-native configuration
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    print("⚠️  Warning: Supabase credentials missing from environment.")
    supabase: Client = None
else:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

def insert_new_grievance(description: str, legal_analysis_json: dict):
    """
    Saves the user's input and the AI-generated legal analysis 
    to the Supabase 'grievances' table.
    """
    if not supabase:
        print("❌ Database Error: Supabase client not initialized.")
        return None

    try:
        data = {
            "user_id": "citizen-001", # Default or extract from auth context
            "complaint_text": description,
            "severity": str(legal_analysis_json.get("severity", "3")),
            "legal_analysis": legal_analysis_json,
        }
        
        response = supabase.table("grievances").insert(data).execute()
        return response.data
    except Exception as e:
        print(f"❌ Supabase Sync Error: {e}")
        return None

def get_user_grievances(user_id: str):
    """
    Retrieves previous grievances for a specific user from Supabase.
    Used by the History view.
    """
    if not supabase:
        return []

    try:
        response = supabase.table("grievances") \
            .select("*") \
            .eq("user_id", user_id) \
            .order("created_at", desc=True) \
            .execute()
        return response.data
    except Exception as e:
        print(f"❌ Supabase Retrieval Error: {e}")
        return []

# Alias for compatibility with existing LangGraph nodes
def insert_grievance(user_id, complaint_text, severity, legal_analysis):
    return insert_new_grievance(complaint_text, legal_analysis)
