# generate_index_json.py
"""
Summary:
Scans the logic_submissions/ directory and generates index.json with all MDC Tier 2 submission filenames.
Run this periodically or after new uploads to keep the logs viewer updated.
"""

import os
import json

SUBMISSIONS_DIR = "C:/Users/Kunfirm/Downloads/MDC_Root/metaldrug.com/scripts/logic_submissions"
INDEX_FILE = os.path.join(SUBMISSIONS_DIR, "index.json")

def generate_index():
    try:
        files = [
            f for f in os.listdir(SUBMISSIONS_DIR)
            if f.endswith(".json") and f != "index.json"
        ]
        with open(INDEX_FILE, "w") as index_file:
            json.dump(files, index_file, indent=2)
        print(f"Index file updated with {len(files)} entries.")
    except Exception as e:
        print(f"Error generating index.json: {e}")

if __name__ == "__main__":
    generate_index()
