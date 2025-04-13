// mdc-tier2-validator.js
// Summary:
// MDC Tier 2 Logic Validator handles logic import from Tier 1, integrity revalidation,
// and submission for Tier 3 review. It also supports metadata updates and logic lock checks.

function loadApprovedLogic() {
  const approved = localStorage.getItem('mdc_tier1_approved');
  if (!approved) {
    alert('No approved Tier 1 logic found.');
    return;
  }

  try {
    const parsed = JSON.parse(approved);
    document.getElementById('blueprintDisplay').value = JSON.stringify(parsed, null, 2);
    document.getElementById('logicStatus').innerText = 'Tier 1 logic loaded.';
  } catch (e) {
    document.getElementById('logicStatus').innerText = 'Failed to parse stored logic.';
  }
}

function validateBlueprint() {
  const input = document.getElementById('blueprintDisplay').value.trim();
  if (!input) {
    return alert('Blueprint is empty.');
  }

  try {
    const json = JSON.parse(input);
    if (!json.id || !json.version || !json.logic) {
      throw new Error('Missing required fields (id, version, logic).');
    }

    document.getElementById('logicStatus').innerHTML = `<span class="text-green-400">Validation passed.</span>`;
  } catch (err) {
    document.getElementById('logicStatus').innerHTML = `<span class="text-red-400">Error: ${err.message}</span>`;
  }
}

function promoteToTier3() {
  const token = sessionStorage.getItem('nda_token');
  const blueprint = document.getElementById('blueprintDisplay').value;

  if (!token || !blueprint) {
    return alert('Missing NDA token or blueprint.');
  }

  fetch('/nda_handler/tier3_submission_queue.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, blueprint })
  })
    .then(res => res.json())
    .then(data => {
      if (data.status === 'received') {
        document.getElementById('logicStatus').innerHTML =
          `<span class="text-green-500">Tier 3 promotion request submitted.</span>`;
      } else {
        throw new Error(data.message || 'Submission failed.');
      }
    })
    .catch(err => {
      document.getElementById('logicStatus').innerHTML =
        `<span class="text-red-500">Error: ${err.message}</span>`;
    });
}
