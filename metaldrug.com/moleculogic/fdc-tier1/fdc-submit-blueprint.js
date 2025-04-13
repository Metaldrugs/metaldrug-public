// File: C:\Users\Kunfirm\Downloads\MDC_Root\metaldrug.com\moleculogic\fdc-tier1\fdc-submit-blueprint.js

/**
 * FDC Blueprint Submission Handler
 * Captures current blueprint data, overlay scores, and submits to backend for KT review.
 */

document.addEventListener("DOMContentLoaded", () => {
  const submitBtn = document.getElementById("submit-blueprint-btn");
  const statusDisplay = document.getElementById("submission-status");

  submitBtn.addEventListener("click", async () => {
    try {
      const userEmail = prompt("Enter your email or NDA token:");
      if (!userEmail || userEmail.trim().length < 4) {
        alert("Submission cancelled. Valid email or token required.");
        return;
      }

      const blueprintData = window.fdcBlueprint || {};
      const overlayData = window.fdcOverlayScores || {};

      const payload = {
        email_or_token: userEmail,
        blueprint: blueprintData,
        overlays: overlayData,
        timestamp: new Date().toISOString()
      };

      const response = await fetch("fdc_submission_handler.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.text();
      statusDisplay.textContent = result.includes("Success") ? "✅ Submitted successfully." : "❌ Submission failed.";
    } catch (err) {
      console.error("Submission error:", err);
      statusDisplay.textContent = "❌ Error submitting blueprint.";
    }
  });
});
