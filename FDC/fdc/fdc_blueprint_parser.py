# fdc_blueprint_parser.py

"""
FDC Blueprint Parser
--------------------
Parses Functional Drug Complex (FDC) blueprints and validates structure, logic, and parameters before simulation.

Dependencies:
- json
- os
- fdc_logic_engine.FDCLogicEngine
"""

import json
import os
from fdc_logic_engine import FDCLogicEngine

class FDCBlueprintParser:
    def __init__(self, blueprint_path):
        self.blueprint_path = blueprint_path
        self.logic_engine = FDCLogicEngine()
        self.blueprint = None
        self.errors = []

    def load_blueprint(self):
        if not os.path.isfile(self.blueprint_path):
            self.errors.append("Blueprint file does not exist.")
            return False
        try:
            with open(self.blueprint_path, 'r') as f:
                self.blueprint = json.load(f)
            return True
        except json.JSONDecodeError:
            self.errors.append("Invalid JSON format.")
            return False

    def validate_structure(self):
        required_fields = ["compound_name", "structure", "metal_core", "functional_groups", "environment"]
        missing = [field for field in required_fields if field not in self.blueprint]
        if missing:
            self.errors.append(f"Missing required fields: {', '.join(missing)}")
            return False
        return True

    def validate_logic(self):
        if not self.logic_engine.validate(self.blueprint):
            self.errors.extend(self.logic_engine.get_violations())
            return False
        return True

    def parse(self):
        if not self.load_blueprint():
            return False
        if not self.validate_structure():
            return False
        if not self.validate_logic():
            return False
        return True

    def report(self):
        if self.errors:
            print("Blueprint validation failed:")
            for error in self.errors:
                print(f" - {error}")
        else:
            print("Blueprint validated successfully.")

# Example usage
if __name__ == "__main__":
    parser = FDCBlueprintParser("fdc_blueprints/fdc_example.json")
    if parser.parse():
        parser.report()
    else:
        parser.report()
