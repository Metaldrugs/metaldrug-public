// nda_token_capture.js
// Captures ?token & ?tier, validates via backend, and redirects to Tier 1 if valid

(async function () {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const tier = params.get('tier');

  if (!token || !tier) {
    document.body.innerHTML = '<h2>Missing token or tier.</h2>';
    return;
  }

  try {
    const response = await fetch('/nda_handler/nda_token_status_check.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `token=${encodeURIComponent(token)}`
    });

    const data = await response.json();

    if (data.status === 'valid' && data.tier === tier) {
      sessionStorage.setItem(`nda_token_${tier}`, token);
      const redirectPath = tier === 'mdc' ? '/moleculogic/mdc-tier1.html' : '/moleculogic/fdc-tier1.html';
      window.location.href = redirectPath;
    } else {
      document.body.innerHTML = `<h2>Access Denied</h2><p>Invalid token or tier mismatch.</p>`;
    }
  } catch (err) {
    console.error('Validation error:', err);
    document.body.innerHTML = '<h2>Validation server error. Please try again later.</h2>';
  }
})();
