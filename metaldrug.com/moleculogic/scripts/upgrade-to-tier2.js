// upgrade-to-tier2.js
// Summary: Handles MDC Tier 1 → Tier 2 upgrade request by sending validated logic to backend.

function submitTier2Upgrade(logicFieldId, sessionNameId) {
  const logic = document.getElementById(logicFieldId)?.value.trim();
  const sessionName = document.getElementById(sessionNameId)?.value.trim();
  const ndaToken = sessionStorage.getItem("nda_token") || "";

  if (!logic || !ndaToken) {
    alert("Missing required fields or invalid NDA session.");
    return;
  }

  fetch("/nda_handler/process_tier2_submission.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      logic_content: logic,
      session_name: sessionName,
      nda_token: ndaToken,
      tier: "mdc",
      timestamp: new Date().toISOString()
    })
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === "ok") {
        alert("Logic submitted for Tier 2 upgrade.");
      } else {
        alert("Submission error: " + data.message);
      }
    })
    .catch(() => {
      alert("Failed to submit logic to server.");
    });
}
