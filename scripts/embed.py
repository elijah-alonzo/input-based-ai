import os
import json
import requests
import time
import random

UPSTASH_URL = os.environ.get("UPSTASH_VECTOR_REST_URL")
UPSTASH_TOKEN = os.environ.get("UPSTASH_VECTOR_REST_TOKEN")

if not UPSTASH_URL or not UPSTASH_TOKEN:
    raise RuntimeError("Set UPSTASH_VECTOR_REST_URL and UPSTASH_VECTOR_REST_TOKEN in your environment.")

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "data.json")

with open(DATA_PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

def flatten_json(value, base_path=""):
    if value is None:
        return []
    if isinstance(value, (str, int, float, bool)):
        path = base_path or "root"
        return [{
            "path": path,
            "text": str(value),
            "id": f"{path}-{int(time.time())}-{random.randint(0, 999999)}"
        }]
    if isinstance(value, list):
        combined = []
        for idx, item in enumerate(value):
            combined.extend(flatten_json(item, f"{base_path}[{idx}]"))
        return combined
    if isinstance(value, dict):
        combined = []
        for k, v in value.items():
            next_path = f"{base_path}.{k}" if base_path else k
            combined.extend(flatten_json(v, next_path))
        return combined
    return []

chunks = flatten_json(data)

print(f"Flattened to {len(chunks)} chunks. Uploading to Upstash...")

headers = {
    "Authorization": f"Bearer {UPSTASH_TOKEN}",
    "Content-Type": "application/json"
}

success = 0
for chunk in chunks:
    payload = {
        "id": chunk["id"],
        "data": f"{chunk['path']}: {chunk['text']}",
        "metadata": {
            "path": chunk["path"],
            "text": chunk["text"]
        }
    }
    resp = requests.post(f"{UPSTASH_URL}/vectors/upsert", headers=headers, json=payload)
    if resp.status_code == 200:
        success += 1
    else:
        print(f"Failed to upsert chunk {chunk['id']}: {resp.text}")

print(f"Successfully upserted {success}/{len(chunks)} chunks to Upstash Vector DB.")
