// fdc-ui.js
// Summary:
// Frontend logic for FDC Tier 1 Sandbox UI. Connects validator backend to UI elements.

import { validateFDCBlueprint, saveFDCBlueprint, getFDCBlueprintHistory } from './fdc-backend.js';

const inputField = document.getElementById('blueprintInput');
const nameField = document.getElementById('blueprintName');
const outputDiv = document.getElementById('validatorOutput');
const historyContainer = document.getElementById('historyContainer');

window.validateBlueprintInput = function (inputId, outputId) {
  const logic = document.getElementById(inputId).value.trim();
  const result = validateFDCBlueprint(logic);
  const outputEl = document.getElementById(outputId);

  outputEl.innerHTML = `<pre class="p-2 rounded bg-gray-800 text-green-400">${JSON.stringify(result, null, 2)}</pre>`;
};

window.saveBlueprintToLocal = function (nameId, inputId) {
  const name = document.getElementById(nameId).value.trim();
  const logic = document.getElementById(inputId).value.trim();
  const saveResult = saveFDCBlueprint(name, logic);

  outputDiv.innerHTML = `<div class="mt-2 text-blue-400">${saveResult}</div>`;
};

window.loadBlueprintHistory = function (containerId) {
  const historyEl = document.getElementById(containerId);
  const all = getFDCBlueprintHistory();
  if (!all.length) {
    historyEl.innerHTML = '<p class="text-gray-400">No saved sessions found.</p>';
    return;
  }

  historyEl.innerHTML = '<h3 class="text-lg font-semibold text-indigo-400 mb-2">Blueprint History</h3>';
  all.forEach(entry => {
    const div = document.createElement('div');
    div.className = 'mb-4 p-4 border rounded border-gray-600';
    div.innerHTML = `<strong>${entry.name}</strong><br /><pre class="text-sm bg-gray-900 text-gray-200 p-2 rounded overflow-auto">${JSON.stringify(entry.blueprint, null, 2)}</pre>`;
    historyEl.appendChild(div);
  });
};