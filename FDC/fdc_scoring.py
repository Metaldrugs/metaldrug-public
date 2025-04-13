# fdc_scoring.py

"""
FDC Scoring Module
------------------
Evaluates an FDC blueprint and returns:
- Entropy Score (diversity/variability)
- Confidence Score (rule-based completeness)
- Risk Level (biological safety risk)

Used in Moleculogic Tier 2 scoring overlays.

Dependencies:
- math
"""

import math

def calculate_entropy(structure_string):
    """Entropy is a proxy for blueprint complexity and uniqueness."""
    if not structure_string:
        return 0.0
    freq = {}
    for char in structure_string:
        freq[char] = freq.get(char, 0) + 1
    total = len(structure_string)
    entropy = -sum((count/total) * math.log2(count/total) for count in freq.values())
    return round(entropy, 3)

def evaluate_confidence(blueprint):
    """Rule-based confidence based on field presence and structure logic."""
    required_fields = ["compound_name", "structure", "metal_core", "functional_groups"]
    completeness = sum(1 for field in required_fields if field in blueprint) / len(required_fields)
    if "metal_core" in blueprint and blueprint["metal_core"] in ["Fe", "Cu", "Zn", "Pt"]:
        score_boost = 0.1
    else:
        score_boost = 0.0
    return round(min(completeness + score_boost, 1.0), 2)

def assess_risk_level(blueprint):
    """Estimates biological risk from toxic elements or aggressive functional groups."""
    risky_metals = ["Hg", "Pb", "Cd"]
    risky_groups = ["nitroso", "azide", "peroxide"]
    
    metal_risk = blueprint.get("metal_core") in risky_metals
    group_risk = any(group in risky_groups for group in blueprint.get("functional_groups", []))

    if metal_risk and group_risk:
        return "high"
    elif metal_risk or group_risk:
        return "moderate"
    return "low"

def score_blueprint(blueprint):
    structure = blueprint.get("structure", "")
    return {
        "entropy_score": calculate_entropy(structure),
        "confidence_score": evaluate_confidence(blueprint),
        "risk_level": assess_risk_level(blueprint)
    }

# Example
if __name__ == "__main__":
    blueprint = {
        "compound_name": "FDC-Z1",
        "structure": "ring-ring-metal",
        "metal_core": "Zn",
        "functional_groups": ["hydroxyl", "amine", "peroxide"]
    }
    print(score_blueprint(blueprint))
