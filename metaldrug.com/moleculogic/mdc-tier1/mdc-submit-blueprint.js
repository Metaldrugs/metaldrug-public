// mdc-submit-blueprint.js
// Summary:
// Handles MDC Tier 1 blueprint submission to backend for Tier 2 review.
// Includes session name, NDA token from sessionStorage, timestamp, and blueprint JSON payload.

async function submitMDCBlueprint(formId = 'blueprintInput', nameId = 'blueprintName') {
  const blueprintInput = document.getElementById(formId).value.trim();
  const sessionName = document.getElementById(nameId).value.trim();
  const ndaToken = sessionStorage.getItem('nda_token');

  if (!blueprintInput || !sessionName) {
    alert('Session name and blueprint content are required.');
    return;
  }

  if (!ndaToken) {
    alert('Missing NDA token. Please re-authenticate.');
    return;
  }

  let blueprintJson;
  try {
    blueprintJson = JSON.parse(blueprintInput);
  } catch (err) {
    alert('Invalid JSON format in blueprint input.');
    return;
  }

  const submissionPayload = {
    token: ndaToken,
    session: sessionName,
    timestamp: new Date().toISOString(),
    blueprint: blueprintJson
  };

  try {
    const response = await fetch('/moleculogic/mdc-tier2/process_tier2_submission.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submissionPayload)
    });

    const result = await response.json();
    if (result.status === 'success') {
      alert('✅ Submission received for Tier 2 review.');
    } else {
      alert('⚠️ Submission failed: ' + result.message);
    }
  } catch (err) {
    console.error('Error submitting blueprint:', err);
    alert('Submission error. See console for details.');
  }
}
