// fdc-overlays.js
// Summary:
// Evaluates FDC logic objects and assigns entropy_class, risk_level, and confidence_score based on structural patterns, length, redundancy, and logical novelty.

function analyzeFDCLogic(blueprint) {
  if (!blueprint || typeof blueprint !== 'object') {
    return {
      entropy_class: 'unknown',
      risk_level: 'unknown',
      confidence_score: 0,
    };
  }

  const logicStr = JSON.stringify(blueprint);
  const logicLength = logicStr.length;
  const hasRepeats = /\b(\w+)\b.*\1/.test(logicStr);
  const numKeys = Object.keys(blueprint).length;
  const novelTerms = ['dynamic_cofactor', 'adaptive_ligand', 'synapse_trigger'];

  let entropy_class = 'stable';
  let risk_level = 'low';
  let confidence_score = 85;

  if (logicLength > 1500) {
    entropy_class = 'chaotic';
    confidence_score -= 20;
  } else if (logicLength > 900) {
    entropy_class = 'emergent';
    confidence_score -= 10;
  }

  if (hasRepeats) {
    entropy_class = 'redundant';
    confidence_score -= 15;
  }

  if (numKeys < 4) {
    risk_level = 'high';
    confidence_score -= 25;
  } else if (numKeys < 6) {
    risk_level = 'medium';
    confidence_score -= 10;
  }

  const noveltyBoost = novelTerms.some(term => logicStr.includes(term));
  if (noveltyBoost) {
    confidence_score += 10;
  }

  if (confidence_score > 95) confidence_score = 95;
  if (confidence_score < 0) confidence_score = 0;

  return {
    entropy_class,
    risk_level,
    confidence_score,
  };
}

function renderOverlays(result, containerId) {
  const container = document.getElementById(containerId);
  if (!container || !result) return;

  container.innerHTML = `
    <div class="mt-4 p-4 bg-gray-800 rounded">
      <p><strong class="text-indigo-400">Entropy Class:</strong> ${result.entropy_class}</p>
      <p><strong class="text-red-400">Risk Level:</strong> ${result.risk_level}</p>
      <p><strong class="text-green-400">Confidence Score:</strong> ${result.confidence_score}%</p>
      ${result.confidence_score >= 70
        ? '<button onclick="requestTier2Promotion()" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Promote to Tier 2</button>'
        : '<p class="mt-2 text-yellow-300">Logic must reach at least 70% confidence to qualify for Tier 2 promotion.</p>'}
    </div>
  `;
}

function requestTier2Promotion() {
  alert('Promotion request submitted. A reviewer will be notified.');
  // Future: connect to submission_logs and GitHub automation
}

// Export if using in module
if (typeof module !== 'undefined') {
  module.exports = { analyzeFDCLogic, renderOverlays };
}