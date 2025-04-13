import json

def load_logic(path="fdc_logic.json"):
    with open(path, "r") as file:
        return json.load(file)

def evaluate_blueprint(blueprint, logic):
    score = 0
    details = []

    # Core metal match
    if blueprint["core"] in logic["allowed_metal_cores"]:
        score += logic["scoring_weights"]["metal_core"]
        details.append("Valid metal core")

    # Structure type
    if blueprint["structure"] in logic["allowed_structures"]:
        score += logic["scoring_weights"]["structure"]
        details.append("Valid structure")

    # Ligand count match
    lig_count = blueprint.get("ligand_count", 0)
    if lig_count >= logic["validation_rules"]["ligand1_min"] and lig_count <= logic["validation_rules"]["ligand2_max"]:
        score += logic["scoring_weights"]["ligand_count_match"]
        details.append("Valid ligand count")

    # Environment match
    if blueprint["environment"] in logic["environments"]:
        score += logic["scoring_weights"]["environment_match"]
        details.append("Valid environment")

    # Tier classification
    tier = "Unclassified"
    for t, threshold in logic["tier_thresholds"].items():
        if score >= threshold:
            tier = t

    return {
        "score": score,
        "tier": tier,
        "tier_description": logic["tier_descriptions"].get(tier, ""),
        "details": details
    }

# Optional test run
if __name__ == "__main__":
    logic = load_logic()
    test_blueprint = {
        "core": "Fe",
        "structure": "octahedral",
        "ligand_count": 3,
        "environment": "cytosolic"
    }
    result = evaluate_blueprint(test_blueprint, logic)
    print(json.dumps(result, indent=2))
