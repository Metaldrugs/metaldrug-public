// fdc-tier1-sync.js

/**
 * Moleculogic Tier 1 - FDC Logic Sync
 * Handles saving, exporting, and local syncing of FDC logic overlays and inputs.
 * This ensures persistence, reusability, and optional server or GitHub relay.
 */

const FDC_SYNC_STORAGE_KEY = "fdc_tier1_sync_state";

/**
 * Collect current overlay and logic state into a bundle object.
 * This can include validation scores, risk overlays, logic metadata, etc.
 */
function collectFDCLogicState() {
  return {
    timestamp: new Date().toISOString(),
    logicInputs: document.querySelector("#fdc-logic-input")?.value || "",
    entropyScore: document.querySelector("#entropy-score")?.textContent || null,
    riskLevel: document.querySelector("#risk-level")?.textContent || null,
    confidence: document.querySelector("#confidence-score")?.textContent || null,
    overlays: {
      entropy: window.fdcEntropyOverlay || null,
      annotations: window.fdcAnnotations || null
    }
  };
}

/**
 * Save current logic state to browser localStorage
 */
function saveFDCStateLocally() {
  const state = collectFDCLogicState();
  localStorage.setItem(FDC_SYNC_STORAGE_KEY, JSON.stringify(state));
  console.log("[✔] FDC state saved locally.");
}

/**
 * Load last saved FDC logic state from localStorage
 */
function loadFDCStateLocally() {
  const raw = localStorage.getItem(FDC_SYNC_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.warn("Error parsing saved FDC sync state:", e);
    return null;
  }
}

/**
 * Export current state as JSON file
 */
function exportFDCStateAsFile() {
  const state = collectFDCLogicState();
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `fdc_logic_sync_${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Optional future integration with GitHub or API endpoint.
 */
function pushFDCStateToBackend() {
  const state = collectFDCLogicState();

  fetch("/moleculogic/api/save-fdc-logic", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(state)
  })
    .then(res => res.ok ? res.json() : Promise.reject(res))
    .then(data => console.log("[✔] Synced with backend:", data))
    .catch(err => console.error("[✘] Failed backend sync:", err));
}

// UI Hookups
document.getElementById("save-fdc-state")?.addEventListener("click", saveFDCStateLocally);
document.getElementById("export-fdc-state")?.addEventListener("click", exportFDCStateAsFile);
