// fdc-overlays.js

/**
 * Functional Drug Complex (FDC) Overlays
 * Renders visual indicators for entropy, confidence, and risk analysis
 * Part of Moleculogic Tier 1 system
 */

document.addEventListener("DOMContentLoaded", function () {
  const overlayPanel = document.getElementById("fdc-overlay-panel");

  function renderOverlay({ entropy, confidence, risk }) {
    if (!overlayPanel) return;

    overlayPanel.innerHTML = `
      <div class="p-4 rounded-lg shadow-lg bg-white dark:bg-gray-800">
        <h2 class="text-xl font-bold text-indigo-700 dark:text-indigo-300 mb-2">FDC Scoring Overlay</h2>
        <div class="mb-2">
          <strong class="text-gray-700 dark:text-gray-300">Entropy Score:</strong>
          <span class="text-indigo-600 dark:text-indigo-400">${entropy}</span>
        </div>
        <div class="mb-2">
          <strong class="text-gray-700 dark:text-gray-300">Confidence:</strong>
          <span class="text-green-600 dark:text-green-400">${confidence}%</span>
        </div>
        <div>
          <strong class="text-gray-700 dark:text-gray-300">Risk Level:</strong>
          <span class="text-red-600 dark:text-red-400">${risk}</span>
        </div>
      </div>
    `;
  }

  // Public function for validator to call
  window.updateFdcOverlay = renderOverlay;
});
