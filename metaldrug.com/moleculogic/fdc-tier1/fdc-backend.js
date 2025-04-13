// File: C:/Users/Kunfirm/Downloads/MDC_Root/metaldrug.com/moleculogic/fdc-tier1/fdc-backend.js

/**
 * FDC Tier 1 Backend Logic
 * Summary:
 * Core backend handler for validating, scoring, and storing FDC blueprints.
 * Handles blueprint parsing, logic validation, entropy scoring, and local storage.
 * To be called from the frontend UI in fdc-tier1-module.html.
 */

// Validate basic FDC logic structure
function validateFDCBlueprint(json) {
  if (!json || typeof json !== 'object') return { valid: false, message: 'Empty or invalid blueprint format.' };
  if (!json.name || !json.type || !json.components) return { valid: false, message: 'Missing core blueprint fields (name, type, components).' };
  if (!Array.isArray(json.components)) return { valid: false, message: 'Components must be an array.' };
  return { valid: true, message: 'Blueprint is valid.' };
}

// Simple entropy calculator (character distribution based)
function calculateEntropy(blueprintString) {
  const charMap = new Map();
  for (const char of blueprintString) {
    charMap.set(char, (charMap.get(char) || 0) + 1);
  }
  const total = blueprintString.length;
  let entropy = 0;
  for (const [, count] of charMap) {
    const p = count / total;
    entropy -= p * Math.log2(p);
  }
  return entropy.toFixed(3);
}

// Store blueprint locally (Tier 1 sandbox only)
function storeBlueprint(name, content) {
  if (!name || !content) return false;
  localStorage.setItem(`fdc_blueprint_${name}`, content);
  return true;
}

// Load all saved blueprints
function loadAllBlueprints() {
  const keys = Object.keys(localStorage).filter(k => k.startsWith('fdc_blueprint_'));
  return keys.map(k => ({ name: k.replace('fdc_blueprint_', ''), content: localStorage.getItem(k) }));
}

// Export for UI
window.FDCBackend = {
  validateFDCBlueprint,
  calculateEntropy,
  storeBlueprint,
  loadAllBlueprints
};
