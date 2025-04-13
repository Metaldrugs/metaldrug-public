// submit_update.js
// Handles secure blueprint submission on MDC Tier 1

document.getElementById('blueprintForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  if (!validateBlueprintForm()) return;

  const formData = new FormData(this);

  try {
    const response = await fetch('php/submit_blueprint.php', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (result.success) {
      alert("Blueprint submitted successfully.");
      this.reset();
    } else {
      alert("Error: " + result.message);
    }
  } catch (err) {
    console.error("Submission failed:", err);
    alert("Server error. Please try again later.");
  }
});
