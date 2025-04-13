// fdc_overlays.js

/**
 * FDC Tier 1: Overlay Visualization Engine
 * Visualizes simulation results from fdc_logic_simulator.js
 * Displays entropy classification, risk level, and logic notes for each input set.
 */

function renderOverlay(results, containerId = "overlay-results") {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";

  results.forEach((result, index) => {
    const block = document.createElement("div");
    block.className = "border rounded p-4 mb-4 bg-gray-50 dark:bg-gray-800 shadow";

    const title = document.createElement("h3");
    title.className = "text-lg font-semibold text-indigo-700 dark:text-indigo-300";
    title.textContent = `Blueprint ${index + 1}`;

    const entropy = document.createElement("p");
    entropy.innerHTML = `<strong>Entropy Class:</strong> <span class='text-blue-600 dark:text-blue-300'>${result.entropyClass}</span>`;

    const risk = document.createElement("p");
    risk.innerHTML = `<strong>Risk Level:</strong> <span class='text-red-600 dark:text-red-400'>${result.riskProfile}</span>`;

    const logic = document.createElement("pre");
    logic.className = "bg-gray-100 dark:bg-gray-900 p-2 mt-2 text-sm overflow-x-auto";
    logic.textContent = JSON.stringify(result.logicNotes, null, 2);

    block.appendChild(title);
    block.appendChild(entropy);
    block.appendChild(risk);
    block.appendChild(logic);

    container.appendChild(block);
  });
}
