// mdc-logic-designer.js
// Summary:
// Dynamic interface to allow users to construct MDC logic blueprints using dropdowns, inputs, and real-time JSON generation.

function initMDCLogicDesigner(outputTextareaId = 'blueprintInput') {
  const container = document.createElement('div');
  container.className = 'space-y-4 mt-4';

  const ligandInput = createInputField('Ligand Name', 'ligand-name');
  const targetInput = createInputField('Target Protein', 'target-protein');
  const logicSection = createLogicGateSection();
  const propertiesSection = createPropertiesSection();

  const buildBtn = document.createElement('button');
  buildBtn.textContent = 'Generate Blueprint';
  buildBtn.className = 'bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700';
  buildBtn.onclick = () => {
    const blueprint = {
      ligand: ligandInput.value.trim(),
      target: targetInput.value.trim(),
      logic: getLogicGateValues(),
      properties: getPropertyValues()
    };
    document.getElementById(outputTextareaId).value = JSON.stringify(blueprint, null, 2);
  };

  container.appendChild(ligandInput);
  container.appendChild(targetInput);
  container.appendChild(logicSection);
  container.appendChild(propertiesSection);
  container.appendChild(buildBtn);

  const mountPoint = document.getElementById('fdcTier1Interface') || document.querySelector('main');
  mountPoint.appendChild(container);
}

function createInputField(labelText, id) {
  const wrapper = document.createElement('div');
  const label = document.createElement('label');
  label.textContent = labelText;
  label.className = 'block text-sm font-medium mb-1';
  const input = document.createElement('input');
  input.id = id;
  input.type = 'text';
  input.className = 'w-full p-2 rounded bg-gray-900 text-white border border-gray-700';
  wrapper.appendChild(label);
  wrapper.appendChild(input);
  return input;
}

function createLogicGateSection() {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `<label class="block text-sm font-medium mb-1">Logic Gates</label>`;
  ['gate1', 'gate2'].forEach(id => {
    const input = document.createElement('input');
    input.type = 'text';
    input.id = id;
    input.placeholder = `Logic ${id.toUpperCase()}`;
    input.className = 'w-full p-2 mb-1 rounded bg-gray-900 text-white border border-gray-700';
    wrapper.appendChild(input);
  });
  return wrapper;
}

function createPropertiesSection() {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `<label class="block text-sm font-medium mb-1">Properties</label>`;
  ['toxicity', 'activation'].forEach(id => {
    const input = document.createElement('input');
    input.type = 'text';
    input.id = id;
    input.placeholder = `Property: ${id}`;
    input.className = 'w-full p-2 mb-1 rounded bg-gray-900 text-white border border-gray-700';
    wrapper.appendChild(input);
  });
  return wrapper;
}

function getLogicGateValues() {
  return {
    gate1: document.getElementById('gate1').value.trim(),
    gate2: document.getElementById('gate2').value.trim()
  };
}

function getPropertyValues() {
  return {
    toxicity: document.getElementById('toxicity').value.trim(),
    activation: document.getElementById('activation').value.trim()
  };
}
