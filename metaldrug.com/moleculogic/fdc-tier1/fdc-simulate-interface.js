// fdc-simulate-interface.js

/**
 * Frontend JS module to simulate FDC logic by POSTing to backend Python server.
 * Sends JSON blueprint to http://localhost:8802/simulate and displays results.
 */

document.getElementById("runFdcSimulation").addEventListener("click", async () => {
  const output = document.getElementById("fdcSimResult");
  const input = document.getElementById("fdcBlueprintInput").value;

  output.innerHTML = "Running simulation...";

  try {
    const response = await fetch("http://localhost:8802/simulate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: input
    });

    if (!response.ok) {
      throw new Error("Simulation failed: HTTP status " + response.status);
    }

    const result = await response.json();

    output.innerHTML = `
      <strong>Simulation Complete:</strong><br>
      <pre>${JSON.stringify(result, null, 2)}</pre>
    `;
  } catch (err) {
    output.innerHTML = `<span style="color:red">Error: ${err.message}</span>`;
  }
});
