import os
from supabase import create_client, Client
from sentence_transformers import SentenceTransformer

# ── Supabase Configuration ─────────────────────────────────────
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# ── Embedding Configuration ─────────────────────────────────────
model = SentenceTransformer('all-MiniLM-L6-v2')

def query_legal_sections(query: str, top_k: int = 3):
    """
    Search Supabase for relevant Indian Law sections using 
    vector similarity search.
    """
    try:
        # 1. Generate embedding locally
        query_embedding = model.encode(query).tolist()

        # 2. Call the RPC function 'match_legal_knowledge' in Supabase
        response = supabase.rpc(
            "match_legal_knowledge",
            {
                "query_embedding": query_embedding,
                "match_threshold": 0.5,
                "match_count": top_k,
            }
        ).execute()
        
        # Format results for the prompt
        sections = []
        for match in response.data:
            meta = match.get("metadata", {})
            sections.append({
                "act": meta.get("act", "BNS"),
                "section": meta.get("section", "N/A"),
                "description": match.get("content", "")
            })
        return sections
    except Exception as e:
        print(f"❌ Supabase Vector Search Error: {e}")
        return []
