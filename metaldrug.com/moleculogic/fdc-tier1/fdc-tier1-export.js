// fdc-tier1-export.js

/**
 * Moleculogic Tier 1 - FDC Export Engine
 * Handles exporting fully scored and annotated FDC logic as a bundled JSON.
 * Includes timestamp, raw logic input, all overlay scores, and optional tier promotions.
 */

function buildFDCExportBundle() {
  const logic = document.querySelector("#fdc-logic-input")?.value || "";
  const exportPayload = {
    tier: "FDC-Tier-1",
    submittedAt: new Date().toISOString(),
    logicContent: logic,
    overlayScores: {
      entropyScore: document.querySelector("#entropy-score")?.textContent || null,
      riskLevel: document.querySelector("#risk-level")?.textContent || null,
      confidenceScore: document.querySelector("#confidence-score")?.textContent || null
    },
    overlays: {
      entropyOverlay: window.fdcEntropyOverlay || null,
      annotationHighlights: window.fdcAnnotations || null
    },
    metadata: {
      promoted: false,
      reviewerNotes: ""
    }
  };
  return exportPayload;
}

function triggerFDCDownloadBundle() {
  const bundle = buildFDCExportBundle();
  const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `fdc_logic_export_${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  console.log("[✔] Exported FDC logic bundle.");
}

function promoteFDCBundleToTier2() {
  const bundle = buildFDCExportBundle();
  bundle.metadata.promoted = true;
  bundle.metadata.reviewerNotes = "Auto-promoted from Tier 1";

  fetch("/moleculogic/fdc-tier2/promote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bundle)
  })
    .then(res => res.ok ? res.json() : Promise.reject(res))
    .then(data => {
      console.log("[✔] Promoted FDC logic to Tier 2", data);
      alert("Logic promoted to Tier 2 successfully.");
    })
    .catch(err => {
      console.error("[✘] Promotion failed:", err);
      alert("Promotion failed. Check backend logs.");
    });
}

// UI Bindings
document.getElementById("export-fdc-bundle")?.addEventListener("click", triggerFDCDownloadBundle);
document.getElementById("promote-fdc-tier2")?.addEventListener("click", promoteFDCBundleToTier2);
