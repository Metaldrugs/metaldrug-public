// mdc-overlays.js
/*
  Summary:
  Calculates visual overlays (entropy, risk, confidence) for MDC logic blueprints.
  Intended for MDC Tier 1 secure sandbox analysis.
*/

function computeMDCOverlays(blueprintText, overlayOutputId) {
  let overlayOutput = document.getElementById(overlayOutputId);
  overlayOutput.innerHTML = "";

  try {
    const blueprint = JSON.parse(blueprintText);

    if (!blueprint.components || !Array.isArray(blueprint.components)) {
      throw new Error("Invalid MDC logic structure.");
    }

    let entropyScore = 0;
    let riskScore = 0;
    let confidence = "Unknown";

    blueprint.components.forEach(unit => {
      const entropy = unit.entropy_class || "";
      switch (entropy.toLowerCase()) {
        case "low": entropyScore += 1; break;
        case "moderate": entropyScore += 2; break;
        case "high": entropyScore += 3; break;
      }

      const target = unit.target || "";
      if (["neural", "hormonal"].includes(target.toLowerCase())) {
        riskScore += 3;
      } else if (["liver", "skin"].includes(target.toLowerCase())) {
        riskScore += 1;
      }
    });

    if (entropyScore <= 2) confidence = "High";
    else if (entropyScore <= 4) confidence = "Moderate";
    else confidence = "Low";

    overlayOutput.innerHTML = `
      <div class="mt-4 text-sm space-y-1">
        <div>Entropy Score: <span class="text-indigo-400">${entropyScore}</span></div>
        <div>Risk Index: <span class="text-red-400">${riskScore}</span></div>
        <div>Confidence Level: <span class="text-green-400">${confidence}</span></div>
      </div>
    `;
  } catch (err) {
    overlayOutput.innerHTML = `<span class="text-red-500">Overlay calculation failed: ${err.message}</span>`;
  }
}
