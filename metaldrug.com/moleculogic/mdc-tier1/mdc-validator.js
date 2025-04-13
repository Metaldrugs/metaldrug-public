// File: C:\Users\Kunfirm\Downloads\MDC_Root\metaldrug.com\moleculogic\mdc-tier1\mdc-validator.js

/*
  Summary:
  MDC Validator - Tier 1 Blueprint Validator Script
  This file handles validation of MDC logic input (JSON format),
  checks structure and basic schema, and provides real-time feedback
  for blueprint preparation.
*/

function validateBlueprintInput(inputId, outputId) {
  const rawInput = document.getElementById(inputId).value.trim();
  const outputEl = document.getElementById(outputId);
  outputEl.innerHTML = '';

  if (!rawInput) {
    outputEl.innerHTML = '<span class="text-yellow-400">Please paste logic into the validator.</span>';
    return;
  }

  try {
    const json = JSON.parse(rawInput);

    // Basic schema checks
    if (!json.name || !json.structure || !json.logic) {
      outputEl.innerHTML = '<span class="text-red-400">Missing required fields: name, structure, or logic.</span>';
      return;
    }

    // Logic array validation
    if (!Array.isArray(json.logic)) {
      outputEl.innerHTML = '<span class="text-red-400">Logic field must be an array.</span>';
      return;
    }

    outputEl.innerHTML = `
      <span class="text-green-400">✅ Valid Blueprint</span><br>
      <strong>Name:</strong> ${json.name}<br>
      <strong>Logic Steps:</strong> ${json.logic.length}<br>
    `;
  } catch (err) {
    outputEl.innerHTML = `<span class="text-red-400">Invalid JSON: ${err.message}</span>`;
  }
}
