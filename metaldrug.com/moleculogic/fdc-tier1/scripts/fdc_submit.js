// fdc_submit.js
// Connects FDC blueprint submission with validator and overlays

import { validateBlueprint } from './fdc-validator.js';
import { renderOverlay } from './fdc-overlays.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('fdc-blueprint-form');
  const inputField = document.getElementById('fdc-blueprint-input');
  const output = document.getElementById('fdc-validation-result');

  if (!form || !inputField || !output) {
    console.warn("FDC form elements not found");
    return;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const blueprintText = inputField.value.trim();

    if (!blueprintText) {
      output.textContent = "Blueprint input is empty.";
      output.className = "text-red-500";
      return;
    }

    const results = validateBlueprint(blueprintText);

    if (results.success) {
      output.textContent = "Blueprint validated successfully.";
      output.className = "text-green-600";
      renderOverlay(results);
    } else {
      output.textContent = `Validation failed: ${results.message}`;
      output.className = "text-red-500";
    }
  });
});
