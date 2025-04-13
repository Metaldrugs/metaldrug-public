// fdc-export-promote.js
// Summary:
// Handles export and promotion of validated FDC Tier 1 logic. Provides:
// 1. JSON export
// 2. Tier 2 promotion trigger (token-gated)

function exportFDCBlueprintJSON(inputId) {
  const input = document.getElementById(inputId).value.trim();
  if (!input) return alert("No blueprint to export.");

  try {
    const json = JSON.parse(input);
    const blob = new Blob([JSON.stringify(json, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `fdc_blueprint_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (e) {
    alert("Invalid JSON. Cannot export.");
  }
}

function promoteToTier2(inputId) {
  const token = sessionStorage.getItem("nda_token");
  const logic = document.getElementById(inputId).value.trim();

  if (!token) return alert("NDA token missing or expired.");
  if (!logic) return alert("No blueprint provided.");

  fetch("/nda_handler/promote_to_tier2.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, logic })
  })
    .then(res => res.json())
    .then(data => {
      if (data.status === "success") {
        alert("Logic submitted for Tier 2 review.");
      } else {
        alert("Submission failed: " + (data.message || "Unknown error"));
      }
    })
    .catch(() => alert("Network or server error."));
}
