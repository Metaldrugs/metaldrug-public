// mdc-tier2-validator.js
/**
 * MDC Tier 2 Validator Script
 * ----------------------------
 * Summary:
 * Parses user-submitted JSON blueprint logic, performs structural validation,
 * and simulates local scoring (entropy index, risk estimate).
 * Used within: mdc-tier2/index.html
 */

function validateBlueprintInput(inputId, outputId) {
  const input = document.getElementById(inputId).value;
  const output = document.getElementById(outputId);
  output.innerHTML = "";

  try {
    const logic = JSON.parse(input);

    // Core schema checks
    const requiredKeys = ["name", "ligand", "activation_pathway", "constraints", "delivery_tags", "metadata"];
    const missingKeys = requiredKeys.filter(k => !(k in logic));
    if (missingKeys.length > 0) {
      output.innerHTML = `<p class="text-red-500">Missing required keys: ${missingKeys.join(", ")}</p>`;
      return;
    }

    // Metadata scoring simulation
    const entropy = simulateEntropy(logic);
    const risk = simulateRisk(logic);

    const results = `
      <div class="text-green-400 font-mono">
        <p><strong>Name:</strong> ${logic.name}</p>
        <p><strong>Ligand:</strong> ${logic.ligand}</p>
        <p><strong>Activation Pathways:</strong> ${logic.activation_pathway.join(", ")}</p>
        <p><strong>Delivery Tags:</strong> ${logic.delivery_tags.join(", ")}</p>
        <p><strong>Entropy Score:</strong> ${entropy.toFixed(3)}</p>
        <p><strong>Therapeutic Risk:</strong> ${risk.toFixed(3)}</p>
      </div>
    `;
    output.innerHTML = results;
  } catch (err) {
    output.innerHTML = `<p class="text-red-500">Invalid JSON: ${err.message}</p>`;
  }
}

function simulateEntropy(logic) {
  const len = JSON.stringify(logic).length;
  const ligands = logic.ligand.length;
  return Math.min(1, 0.1 + ligands * 0.05 + (len % 101) / 200);
}

function simulateRisk(logic) {
  return Math.max(0.05, 0.95 - simulateEntropy(logic));
}

function submitTier2Blueprint(inputId) {
  const blueprint = document.getElementById(inputId).value.trim();
  if (!blueprint) {
    alert("Blueprint is empty.");
    return;
  }

  fetch("/scripts/process_tier2_submission.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: blueprint
  })
    .then(r => r.json())
    .then(res => {
      if (res.status === "success") {
        alert("Blueprint submitted successfully. Await admin review.");
      } else {
        alert("Submission failed: " + res.message);
      }
    })
    .catch(err => alert("Error submitting blueprint: " + err.message));
}
