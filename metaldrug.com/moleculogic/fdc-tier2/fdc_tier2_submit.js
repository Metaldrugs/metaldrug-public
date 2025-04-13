// fdc_tier2_submit.js
// Summary:
// Handles frontend submission of validated FDC Tier 2 logic for review.
// Uses modal form to collect submitter data, submits via POST to backend handler.

function openTier2Modal() {
  document.getElementById('fdcTier2Modal').classList.remove('hidden');
}

function closeTier2Modal() {
  document.getElementById('fdcTier2Modal').classList.add('hidden');
}

function submitTier2Upgrade() {
  const name = document.getElementById('submitterName').value.trim();
  const email = document.getElementById('submitterEmail').value.trim();
  const logicTitle = document.getElementById('logicTitle').value.trim();
  const message = document.getElementById('upgradeMessage').value.trim();
  const logicContent = document.getElementById('blueprintInput')?.value.trim() || '';

  if (!name || !email || !logicContent || !logicTitle) {
    alert('All required fields must be filled out.');
    return;
  }

  fetch('/moleculogic/fdc-tier2/fdc_tier2_submission.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      email,
      logicTitle,
      message,
      logicContent,
      nda_token: sessionStorage.getItem('nda_token') || ''
    })
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message || 'Submitted. Admin will review shortly.');
      closeTier2Modal();
    })
    .catch(() => alert('Submission failed. Please try again.'));
}
