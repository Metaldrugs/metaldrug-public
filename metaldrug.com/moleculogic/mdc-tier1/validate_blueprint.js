// validate_blueprint.js
// Validates logic form fields before submission on MDC Tier 1

function validateBlueprintForm() {
  const id = document.getElementById('blueprint_id').value.trim();
  const focus = document.getElementById('therapeutic_focus').value.trim();
  const core = document.getElementById('metal_core').value.trim();
  const trigger = document.getElementById('trigger_mechanism').value.trim();
  const logic = document.getElementById('logic_gate').value.trim();

  if (!id || !focus || !core || !trigger || !logic) {
    alert("Please fill out all blueprint fields before submitting.");
    return false;
  }

  if (!/^[A-Z0-9\-]+$/.test(id)) {
    alert("Blueprint ID format is invalid. Use only uppercase letters, numbers, and dashes.");
    return false;
  }

  return true;
}
