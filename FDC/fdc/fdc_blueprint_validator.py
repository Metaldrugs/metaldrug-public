# fdc_blueprint_validator.py

"""
FDC Blueprint Validator
-----------------------
Performs schema-level checks on any incoming FDC blueprint:
- Mandatory fields
- Acceptable types
- Functional logic guards

Used to prevent malformed or incomplete blueprints from entering the Moleculogic system.
"""

def validate_blueprint(blueprint):
    """Returns (is_valid, errors[])"""
    errors = []

    # Required fields and types
    required_fields = {
        "compound_name": str,
        "structure": str,
        "metal_core": str,
        "functional_groups": list
    }

    for field, ftype in required_fields.items():
        if field not in blueprint:
            errors.append(f"Missing field: {field}")
        elif not isinstance(blueprint[field], ftype):
            errors.append(f"Field '{field}' must be of type {ftype.__name__}")

    # Logic constraints
    if "metal_core" in blueprint and blueprint["metal_core"] not in ["Fe", "Cu", "Zn", "Pt", "Ag", "Pd"]:
        errors.append(f"Unsupported metal core: {blueprint['metal_core']}")

    if "functional_groups" in blueprint:
        if not all(isinstance(g, str) for g in blueprint["functional_groups"]):
            errors.append("All functional groups must be strings")
        if len(blueprint["functional_groups"]) < 1:
            errors.append("At least one functional group is required")

    is_valid = len(errors) == 0
    return is_valid, errors

# Example usage
if __name__ == "__main__":
    sample = {
        "compound_name": "FDC-Test",
        "structure": "metal-bridge-ring",
        "metal_core": "Cu",
        "functional_groups": ["amine", "carboxyl"]
    }
    valid, err = validate_blueprint(sample)
    print("Valid:", valid)
    if not valid:
        print("Errors:", err)
