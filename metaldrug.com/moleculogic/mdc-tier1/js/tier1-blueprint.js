// tier1-blueprint.js
document.addEventListener("DOMContentLoaded", () => {
  const tokenForm = document.getElementById("token-form");
  const blueprintForm = document.getElementById("blueprint-form");
  const tokenResult = document.getElementById("token-result");
  const statusBox = document.getElementById("submission-status");

  tokenForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const token = document.getElementById("nda-token").value.trim();
    tokenResult.textContent = "Verifying...";
    try {
      const res = await fetch("../../nda_handler/backend/nda_token_status_check.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `token=${encodeURIComponent(token)}`
      });
      const data = await res.json();
      if (data.valid) {
        tokenResult.textContent = `✔ Access granted: ${data.name} (${data.organization})`;
        blueprintForm.classList.remove("hidden");
      } else {
        tokenResult.textContent = "❌ Invalid or expired token.";
      }
    } catch (err) {
      tokenResult.textContent = "⚠ Server error during token verification.";
    }
  });

  blueprintForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusBox.textContent = "Submitting blueprint...";
    const formData = new FormData(blueprintForm);
    try {
      const res = await fetch("../php/submit_blueprint.php", {
        method: "POST",
        body: formData
      });
      const result = await res.json();
      if (result.success) {
        statusBox.textContent = "✅ Blueprint submitted successfully.";
        blueprintForm.reset();
      } else {
        statusBox.textContent = `❌ ${result.message}`;
      }
    } catch (err) {
      statusBox.textContent = "⚠ Submission failed.";
    }
  });
});
