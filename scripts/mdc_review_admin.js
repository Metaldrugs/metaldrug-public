// mdc_review_admin.js
// Summary:
// JavaScript logic for handling MDC Tier 2 review interface
// Enables actions: Approve, Reject, Promote, Delete on submitted logic
// Integrates with `mdc_tier2_submissions.json` and backend APIs

let submissions = [];

async function loadMDCSubmissions() {
  try {
    const res = await fetch('/metaldrug.com/data/mdc_tier2_submissions.json');
    submissions = await res.json();
    renderSubmissionList(submissions);
  } catch (err) {
    console.error('Failed to load MDC submissions:', err);
  }
}

function renderSubmissionList(data) {
  const container = document.getElementById('submissionContainer');
  container.innerHTML = '';

  if (!data.length) {
    container.innerHTML = '<p class="text-gray-400">No submissions found.</p>';
    return;
  }

  data.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'border border-gray-700 rounded p-4 mb-4 bg-gray-900';

    card.innerHTML = `
      <div class="flex justify-between">
        <h3 class="text-xl font-semibold text-indigo-400">${item.session || 'Untitled Session'} (Index: ${index})</h3>
        <span class="text-sm text-gray-400">${item.timestamp}</span>
      </div>
      <pre class="mt-2 text-sm text-gray-300 bg-gray-800 p-2 rounded overflow-x-auto">${JSON.stringify(item.logic, null, 2)}</pre>
      <div class="mt-4 space-x-3">
        <button onclick="approveSubmission(${index})" class="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-white text-sm">Approve</button>
        <button onclick="rejectSubmission(${index})" class="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white text-sm">Reject</button>
        <button onclick="promoteSubmission(${index})" class="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded text-black text-sm">Promote to Tier 3</button>
        <button onclick="deleteSubmission(${index})" class="bg-gray-700 hover:bg-gray-800 px-3 py-1 rounded text-white text-sm">Delete</button>
      </div>
    `;

    container.appendChild(card);
  });
}

function approveSubmission(index) {
  alert(`MDC Submission #${index} approved.`);
  // Future: trigger email notification, move to approved set
}

function rejectSubmission(index) {
  alert(`MDC Submission #${index} rejected.`);
  // Future: log reason, notify user
}

function promoteSubmission(index) {
  alert(`MDC Submission #${index} promoted to Tier 3.`);
  // Future: move to tier3 folder or flag as promoted
}

function deleteSubmission(index) {
  if (confirm('Are you sure you want to permanently delete this submission?')) {
    alert(`Deleted MDC Submission #${index}.`);
    // Future: remove from JSON file via backend
  }
}

document.addEventListener('DOMContentLoaded', loadMDCSubmissions);
