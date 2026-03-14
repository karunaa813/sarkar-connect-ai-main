from services.supabase_service import query_legal_sections

def test_rag():
    query = "What happens if someone steals property in India?"
    print(f"🔍 Testing RAG with query: '{query}'")
    
    results = query_legal_sections(query, top_k=2)
    
    if not results:
        print("❌ No results found. (Note: Make sure to run ingest_data.py first to populate the database)")
    else:
        for i, res in enumerate(results):
            print(f"\nMatch {i+1}:")
            print(f"Act: {res['act']}")
            print(f"Section: {res['section']}")
            print(f"Content: {res['description'][:150]}...")

if __name__ == "__main__":
    test_rag()
