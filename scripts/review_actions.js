// review_actions.js
// Summary:
// Admin review controller for MDC and FDC blueprint submissions.
// Provides logic to load, approve, reject, and send email notifications via backend.

function loadBlueprintSubmission() {
  const id = document.getElementById("submissionId").value.trim();
  if (!id) {
    alert("Please enter a submission ID or filename.");
    return;
  }

  fetch(`/metaldrug.com/data/submissions/${id}.json`)
    .then(res => {
      if (!res.ok) throw new Error("Submission not found");
      return res.json();
    })
    .then(data => {
      document.getElementById("blueprintContent").textContent = JSON.stringify(data, null, 2);
      document.getElementById("overlayDisplay").innerHTML = "[Generating overlay...]";
      document.getElementById("blueprintDisplay").classList.remove("hidden");

      if (window.generateReviewOverlay) {
        const overlay = generateReviewOverlay(data);
        document.getElementById("overlayDisplay").innerHTML = overlay;
      }
    })
    .catch(err => {
      document.getElementById("reviewStatus").innerHTML =
        `<span class="text-red-400">Error: ${err.message}</span>`;
    });
}

function approveBlueprint() {
  const id = document.getElementById("submissionId").value.trim();
  const comment = document.getElementById("reviewComment").value.trim();

  if (!id) return alert("Missing submission ID.");

  fetch("/metaldrug.com/review/process_review_action.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id,
      status: "approved",
      comment
    })
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("reviewStatus").innerHTML =
        `<span class="text-green-400">✅ Approved. Notification sent to submitter.</span>`;
    })
    .catch(err => {
      document.getElementById("reviewStatus").innerHTML =
        `<span class="text-red-400">Error: ${err.message}</span>`;
    });
}

function rejectBlueprint() {
  const id = document.getElementById("submissionId").value.trim();
  const comment = document.getElementById("reviewComment").value.trim();

  if (!id) return alert("Missing submission ID.");

  fetch("/metaldrug.com/review/process_review_action.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id,
      status: "rejected",
      comment
    })
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("reviewStatus").innerHTML =
        `<span class="text-yellow-400">⛔ Rejected. Submitter has been notified.</span>`;
    })
    .catch(err => {
      document.getElementById("reviewStatus").innerHTML =
        `<span class="text-red-400">Error: ${err.message}</span>`;
    });
}
