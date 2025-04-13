// mdc-preview_display.js
// Summary:
// Dynamically renders validated MDC logic blueprints into a visual table format.
// Highlights key fields such as ligand, target, and behavior attributes.

function renderMDCPreview(jsonInputId = 'blueprintInput', previewContainerId = 'validatorOutput') {
  const container = document.getElementById(previewContainerId);
  container.innerHTML = '';

  let blueprint;
  try {
    blueprint = JSON.parse(document.getElementById(jsonInputId).value.trim());
  } catch (e) {
    container.innerHTML = '<div class="text-red-500">⚠️ Invalid JSON format. Cannot render preview.</div>';
    return;
  }

  const { ligand, target, logic, properties } = blueprint;
  const logicKeys = Object.keys(logic || {});
  const propertiesKeys = Object.keys(properties || {});

  const section = document.createElement('section');
  section.className = 'p-4 bg-gray-900 rounded shadow text-sm text-white space-y-3';

  if (ligand) {
    section.innerHTML += `<div><span class="font-semibold text-indigo-400">Ligand:</span> ${ligand}</div>`;
  }

  if (target) {
    section.innerHTML += `<div><span class="font-semibold text-indigo-400">Target:</span> ${target}</div>`;
  }

  if (logicKeys.length) {
    section.innerHTML += `<div class="font-semibold text-indigo-400">Logic Gates:</div>`;
    logicKeys.forEach((key) => {
      section.innerHTML += `<div class="ml-4">• ${key}: ${logic[key]}</div>`;
    });
  }

  if (propertiesKeys.length) {
    section.innerHTML += `<div class="font-semibold text-indigo-400 mt-2">Properties:</div>`;
    propertiesKeys.forEach((key) => {
      section.innerHTML += `<div class="ml-4">• ${key}: ${properties[key]}</div>`;
    });
  }

  container.appendChild(section);
}
