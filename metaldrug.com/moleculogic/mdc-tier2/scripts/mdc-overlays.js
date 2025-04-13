// mdc-overlays.js
// Summary:
// MDC Overlay Visualizer handles entropy class, confidence, and risk level overlays.
// It reads approved logic, computes qualitative summaries, and displays them with color-coded labels.

function renderOverlays() {
  const raw = document.getElementById('blueprintDisplay').value;
  if (!raw) return;

  let logic;
  try {
    logic = JSON.parse(raw);
  } catch {
    document.getElementById('overlayResult').innerHTML = '<span class="text-red-400">Invalid logic format.</span>';
    return;
  }

  const entropy = computeEntropy(logic.logic);
  const risk = assessRisk(logic.logic);
  const confidence = estimateConfidence(logic);

  const result = `
    <div class="space-y-2">
      <div><strong>Entropy Class:</strong> <span class="text-yellow-400">${entropy}</span></div>
      <div><strong>Risk Level:</strong> <span class="text-red-400">${risk}</span></div>
      <div><strong>Confidence Score:</strong> <span class="text-green-400">${confidence}</span></div>
    </div>
  `;

  document.getElementById('overlayResult').innerHTML = result;
}

function computeEntropy(logicBlock) {
  if (!Array.isArray(logicBlock)) return 'Low';
  const unique = new Set(logicBlock.map(l => l.type)).size;
  if (unique > 6) return 'Very High';
  if (unique > 3) return 'Moderate';
  return 'Low';
}

function assessRisk(logicBlock) {
  if (!logicBlock || logicBlock.length === 0) return 'None';
  const risky = logicBlock.filter(l => l.type === 'inhibitor' || l.risk === 'high');
  if (risky.length > 3) return 'High';
  if (risky.length > 0) return 'Moderate';
  return 'Low';
}

function estimateConfidence(blueprint) {
  if (!blueprint.metadata || !blueprint.metadata.source) return 'Unknown';
  const source = blueprint.metadata.source.toLowerCase();
  if (source.includes('verified')) return '95%';
  if (source.includes('literature')) return '80%';
  return '60%';
}
