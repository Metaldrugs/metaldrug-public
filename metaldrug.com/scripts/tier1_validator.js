// File: scripts/tier1_validator.js

function validateBlueprintInput(textareaId, outputId) {
  const rawInput = document.getElementById(textareaId).value;
  const outputEl = document.getElementById(outputId);
  outputEl.innerHTML = '';

  try {
    const parsed = JSON.parse(rawInput);
    const requiredFields = ['compound', 'target', 'mode'];

    const missing = requiredFields.filter(field => !parsed.hasOwnProperty(field));

    if (missing.length > 0) {
      outputEl.innerHTML = `<div class='text-red-500'>❌ Missing fields: ${missing.join(', ')}</div>`;
    } else {
      const pretty = JSON.stringify(parsed, null, 2);
      outputEl.innerHTML = `
        <div class='text-green-500 font-bold mb-2'>✅ Blueprint Valid</div>
        <pre class='bg-gray-800 text-white p-4 rounded text-sm'><code>${pretty}</code></pre>`;
    }
  } catch (e) {
    outputEl.innerHTML = `<div class='text-red-500'>❌ Invalid JSON format</div>`;
  }
}

function saveBlueprintToLocal(nameFieldId, inputId) {
  const name = document.getElementById(nameFieldId).value;
  const blueprint = document.getElementById(inputId).value;
  if (!name || !blueprint) return alert("Name and blueprint required");
  try {
    JSON.parse(blueprint);
    const record = { timestamp: Date.now(), name, logic: blueprint };
    const history = JSON.parse(localStorage.getItem('tier1_blueprints') || '[]');
    history.push(record);
    localStorage.setItem('tier1_blueprints', JSON.stringify(history));
    alert("Saved locally");
  } catch {
    alert("Invalid JSON");
  }
}

function loadBlueprintHistory(outputId) {
  const container = document.getElementById(outputId);
  const history = JSON.parse(localStorage.getItem('tier1_blueprints') || '[]');
  container.innerHTML = history.length === 0 ? '<p class="text-gray-400">No saved logic.</p>' : '';
  history.slice().reverse().forEach(item => {
    const div = document.createElement('div');
    div.className = 'border border-gray-600 rounded p-2 mb-2';
    div.innerHTML = `<strong>${item.name}</strong> @ ${new Date(item.timestamp).toLocaleString()}<pre class='text-xs bg-gray-900 text-white p-2 mt-1'>${item.logic}</pre>`;
    container.appendChild(div);
  });
}
