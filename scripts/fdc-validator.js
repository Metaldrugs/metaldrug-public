// fdc-validator.js
// Purpose: Handles FDC blueprint validation for Moleculogic Tier 1

async function validateFDC() {
  const inputEl = document.getElementById("fdc-blueprint");
  const resultContainer = document.getElementById("fdc-output");
  const resultDisplay = document.getElementById("fdc-results");

  const blueprintText = inputEl.value.trim();

  if (!blueprintText) {
    alert("Please enter an FDC blueprint.");
    return;
  }

  let blueprintData;
  try {
    blueprintData = JSON.parse(blueprintText);
  } catch (err) {
    alert("Invalid JSON format. Please check your blueprint.");
    return;
  }

  try {
    const response = await fetch("/metaldrug.com/moleculogic/fdc-tier1/fdc-simulate-logic.py", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(blueprintData)
    });

    const result = await response.json();
    resultDisplay.textContent = JSON.stringify(result, null, 2);
    resultContainer.classList.remove("hidden");
  } catch (err) {
    resultDisplay.textContent = "Error running simulation: " + err.message;
    resultContainer.classList.remove("hidden");
  }
}
