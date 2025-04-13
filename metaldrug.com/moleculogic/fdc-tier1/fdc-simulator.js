// fdc-simulator.js

/**
 * FDC Simulator Module
 * 
 * Simulates ligand behaviors for FDC blueprints based on molecular type, binding affinity,
 * functional activity, and potential overactivation risks.
 * Connects directly to the visual FDC UI for dynamic updates.
 */

const fdcSimulateBlueprint = (blueprint) => {
  if (!blueprint || !Array.isArray(blueprint.ligands)) {
    return { error: "Invalid blueprint structure" };
  }

  let totalAffinity = 0;
  let activationScore = 0;
  let overstimRisk = false;

  blueprint.ligands.forEach(ligand => {
    const affinity = parseFloat(ligand.affinity || 0);
    const activity = parseFloat(ligand.activity || 0);
    totalAffinity += affinity;
    activationScore += affinity * activity;
    if (activity > 0.9 && affinity > 0.8) overstimRisk = true;
  });

  const result = {
    ligandCount: blueprint.ligands.length,
    totalAffinity: totalAffinity.toFixed(3),
    activationScore: activationScore.toFixed(3),
    overstimulationRisk: overstimRisk,
    status: overstimRisk ? "Caution: Overstim Potential" : "Stable Response"
  };

  return result;
};

// Integration with UI
document.addEventListener("DOMContentLoaded", () => {
  const simulateButton = document.getElementById("run-fdc-simulation");
  const outputBox = document.getElementById("fdc-simulation-output");

  simulateButton?.addEventListener("click", () => {
    try {
      const input = document.getElementById("fdc-blueprint-input").value;
      const blueprint = JSON.parse(input);
      const result = fdcSimulateBlueprint(blueprint);
      outputBox.textContent = JSON.stringify(result, null, 2);
    } catch (err) {
      outputBox.textContent = `Simulation error: ${err.message}`;
    }
  });
});

// Expose to global
window.fdcSimulateBlueprint = fdcSimulateBlueprint;
