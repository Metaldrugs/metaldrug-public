// review_dashboard.js
// Summary: Loads and renders Tier 2 logic submissions for review
// Features: Filter by name/status, render JSON, handle reviewer notes and decision

async function fetchSubmissions() {
  const res = await fetch('/metaldrug.com/scripts/fdc_tier2_submissions.json');
  const submissions = await res.json();
  renderSubmissions(submissions);
}

function renderSubmissions(data) {
  const container = document.getElementById('reviewTable');
  container.innerHTML = '';

  data.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'bg-gray-800 p-6 rounded shadow';

    card.innerHTML = `
      <div class="mb-2 text-sm text-gray-400">Date: ${item.timestamp || 'N/A'}</div>
      <h2 class="text-xl font-bold text-indigo-400">${item.name || 'Unnamed Session'}</h2>
      <div class="text-sm text-gray-300 mb-4">Status: <span class="font-semibold">${item.status || 'pending'}</span></div>

      <pre class="bg-gray-900 text-green-300 text-xs p-4 overflow-auto rounded mb-4">${JSON.stringify(item.logic, null, 2)}</pre>

      <textarea placeholder="Reviewer notes..." class="w-full bg-gray-700 text-white p-2 rounded mb-2" id="notes-${index}">${item.notes || ''}</textarea>

      <div class="flex space-x-3">
        <button onclick="approve(${index})" class="bg-green-600 px-3 py-1 text-white rounded">Approve</button>
        <button onclick="reject(${index})" class="bg-red-600 px-3 py-1 text-white rounded">Reject</button>
      </div>
    `;

    container.appendChild(card);
  });
}

function applyFilters() {
  const nameFilter = document.getElementById('filterName').value.toLowerCase();
  const statusFilter = document.getElementById('filterStatus').value;

  fetch('/metaldrug.com/scripts/fdc_tier2_submissions.json')
    .then(res => res.json())
    .then(data => {
      const filtered = data.filter(item => {
        const matchName = !nameFilter || (item.name && item.name.toLowerCase().includes(nameFilter));
        const matchStatus = !statusFilter || (item.status === statusFilter);
        return matchName && matchStatus;
      });
      renderSubmissions(filtered);
    });
}

function approve(index) {
  submitDecision(index, 'approved');
}

function reject(index) {
  submitDecision(index, 'rejected');
}

function submitDecision(index, newStatus) {
  const notes = document.getElementById(`notes-${index}`).value;
  fetch('/metaldrug.com/scripts/fdc_review_decision.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ index, newStatus, notes })
  })
    .then(res => res.text())
    .then(response => {
      alert(response);
      fetchSubmissions();
    })
    .catch(err => console.error('Decision error:', err));
}

document.addEventListener('DOMContentLoaded', fetchSubmissions);
