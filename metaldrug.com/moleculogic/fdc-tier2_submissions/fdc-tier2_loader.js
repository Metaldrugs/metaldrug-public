// fdc-tier2_loader.js
// Summary:
// Loads approved FDC Tier 2 logic from index.json, populates dropdown, renders selection

async function loadFDCApprovedLogic() {
  try {
    const res = await fetch('/metaldrug.com/moleculogic/fdc-tier2_submissions/approved/index.json');
    const blueprints = await res.json();
    const select = document.getElementById('fdcLogicSelect');
    select.innerHTML = '';

    blueprints.forEach(bp => {
      const opt = document.createElement('option');
      opt.value = bp.filename;
      opt.textContent = `${bp.name} – ${bp.description}`;
      select.appendChild(opt);
    });

    document.getElementById('loadBtn').disabled = false;
  } catch (e) {
    document.getElementById('loaderStatus').innerText = 'Failed to load Tier 2 data.';
    console.error('Blueprint loading error:', e);
  }
}

async function simulateFDCSelection() {
  const file = document.getElementById('fdcLogicSelect').value;
  const output = document.getElementById('fdcOutput');

  if (!file) {
    output.innerText = 'No blueprint selected.';
    return;
  }

  try {
    const res = await fetch(`/metaldrug.com/moleculogic/fdc-tier2_submissions/approved/${file}`);
    const json = await res.json();

    output.innerHTML = `<pre class="bg-black text-green-400 p-4 rounded overflow-auto">${JSON.stringify(json, null, 2)}</pre>`;
  } catch (e) {
    output.innerHTML = `<span class="text-red-400">Failed to simulate blueprint.</span>`;
  }
}

window.addEventListener('DOMContentLoaded', loadFDCApprovedLogic);
