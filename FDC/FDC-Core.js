// FDC-Core.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("fdcForm");
  const statusDisplay = document.getElementById("fdcStatus");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusDisplay.textContent = "Submitting...";

    const blueprint = {
      metal_core: document.getElementById("metal_core").value.trim(),
      structure: document.getElementById("structure").value.trim(),
      ligand1_count: parseInt(document.getElementById("ligand1_count").value),
      ligand2_count: parseInt(document.getElementById("ligand2_count").value),
      environment: document.getElementById("environment").value.trim()
    };

    try {
      const response = await fetch("http://localhost:5000/submit-fdc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(blueprint)
      });

      const result = await response.json();

      if (result.success) {
        statusDisplay.textContent = `Blueprint accepted. ID: ${result.id}`;
      } else {
        statusDisplay.textContent = `Error: ${result.error || "Unknown failure"}`;
      }
    } catch (err) {
      console.error("Submission failed:", err);
      statusDisplay.textContent = "Submission failed. Check server.";
    }
  });
});
