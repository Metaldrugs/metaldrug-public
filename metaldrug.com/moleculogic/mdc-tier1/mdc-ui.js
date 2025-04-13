// mdc-ui.js
// Summary:
// Handles dynamic rendering and interaction logic for MDC Tier 1 interface,
// including UI toggles, logic display, input clearing, and feedback rendering.

function toggleValidatorOutput() {
  const output = document.getElementById('validatorOutput');
  output.classList.toggle('hidden');
}

function displayValidationMessage(message, type = 'info') {
  const output = document.getElementById('validatorOutput');
  const color = type === 'success' ? 'green' : type === 'error' ? 'red' : 'blue';
  output.innerHTML = `<p class="text-${color}-400 font-medium">${message}</p>`;
  output.classList.remove('hidden');
}

function clearInputFields() {
  const input = document.getElementById('blueprintInput');
  const name = document.getElementById('blueprintName');
  if (input) input.value = '';
  if (name) name.value = '';
  displayValidationMessage('Input cleared.', 'info');
}

function showBlueprintHistory(historyContainerId) {
  const container = document.getElementById(historyContainerId);
  const history = JSON.parse(localStorage.getItem('mdc_blueprint_history') || '[]');
  if (!container) return;

  container.innerHTML = '<h3 class="text-lg font-bold text-indigo-400 mb-2">Saved Blueprints</h3>';

  if (history.length === 0) {
    container.innerHTML += '<p class="text-sm text-gray-400">No saved sessions yet.</p>';
    return;
  }

  const list = document.createElement('ul');
  list.className = 'list-disc ml-6 space-y-1 text-sm';

  history.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.name} (${new Date(item.timestamp).toLocaleString()})`;
    list.appendChild(li);
  });

  container.appendChild(list);
}
