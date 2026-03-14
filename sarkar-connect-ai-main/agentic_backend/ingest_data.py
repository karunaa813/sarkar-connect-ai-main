import os
import uuid
from dotenv import load_dotenv
from supabase import create_client, Client
from sentence_transformers import SentenceTransformer

load_dotenv()

# ── Supabase Configuration ─────────────────────────────────────
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# ── Embedding Configuration ─────────────────────────────────────
# all-MiniLM-L6-v2 produces 384-dimensional embeddings
model = SentenceTransformer('all-MiniLM-L6-v2')

def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 100):
    """Simple sliding window chunking."""
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start += (chunk_size - overlap)
    return chunks

def ingest_legal_docs(doc_folder: str = "legal_docs"):
    """
    Reads text files, generates embeddings using sentence-transformers,
    and uploads to the Supabase 'legal_knowledge' table.
    """
    if not os.path.exists(doc_folder):
        print(f"Error: Folder '{doc_folder}' not found. Please create it and add .txt files.")
        return

    files = [f for f in os.listdir(doc_folder) if f.endswith(".txt")]
    if not files:
        print(f"No .txt files found in '{doc_folder}'.")
        return

    print(f"Processing {len(files)} files...")

    for filename in files:
        file_path = os.path.join(doc_folder, filename)
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        chunks = chunk_text(content)
        print(f"File '{filename}' split into {len(chunks)} chunks.")

        batch_data = []
        for i, chunk in enumerate(chunks):
            try:
                # 1. Generate embedding locally
                embedding = model.encode(chunk).tolist()

                # 2. Prepare payload for Supabase
                # Table: legal_knowledge
                # Columns: content (text), metadata (jsonb), embedding (vector(384))
                payload = {
                    "id": str(uuid.uuid4()),
                    "content": chunk,
                    "metadata": {
                        "source": filename,
                        "act": filename.split(".")[0].upper(),
                        "section": f"Chunk-{i+1}",
                    },
                    "embedding": embedding
                }
                batch_data.append(payload)

                if len(batch_data) >= 10: # Batch insert for efficiency
                    supabase.table("legal_knowledge").insert(batch_data).execute()
                    batch_data = []
                    print(f"Upserted batch for {filename}")

            except Exception as e:
                print(f"Error processing chunk {i+1} of {filename}: {e}")
        
        # Insert remaining chunks
        if batch_data:
            try:
                supabase.table("legal_knowledge").insert(batch_data).execute()
                print(f"Upserted final batch for {filename}")
            except Exception as e:
                print(f"Error in final batch for {filename}: {e}")

    print("\nIngestion complete!")

if __name__ == "__main__":
    ingest_legal_docs()
