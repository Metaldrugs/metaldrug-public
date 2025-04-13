import json
import uuid
import datetime

SAVE_PATH = "fdc_saved_blueprints.jsonl"

def save_blueprint(blueprint, evaluation):
    entry = {
        "id": str(uuid.uuid4()),
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "blueprint": blueprint,
        "evaluation": evaluation
    }

    with open(SAVE_PATH, "a", encoding="utf-8") as file:
        file.write(json.dumps(entry) + "\n")

    print(f"✅ Blueprint saved with ID: {entry['id']}")

# Optional test
if __name__ == "__main__":
    sample_blueprint = {
        "core": "Fe",
        "structure": "octahedral",
        "ligand_count": 3,
        "environment": "cytosolic"
    }
    sample_evaluation = {
        "score": 90,
        "tier": "Tier 1",
        "tier_description": "Promising candidate with favorable structure and context",
        "details": ["Valid metal core", "Valid structure", "Valid ligand count", "Valid environment"]
    }

    save_blueprint(sample_blueprint, sample_evaluation)
