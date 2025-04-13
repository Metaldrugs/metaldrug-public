// File: C:/Users/Kunfirm/Downloads/MDC_Root/metaldrug.com/moleculogic/mdc-tier2/admin/mdc_review_admin.js

/**
 * Summary:
 * Handles admin-level review actions for MDC Tier 2 blueprint submissions.
 * Features include loading submission logs, filtering by status, and applying review outcomes.
 */

document.addEventListener('DOMContentLoaded', () => {
  loadMDCSubmissions();
});

function loadMDCSubmissions() {
  fetch('/metaldrug.com/moleculogic/mdc-tier2/admin/mdc_submissions.json')
    .then(res => res.json())
    .then(data => renderSubmissions(data))
    .catch(() => {
      document.getElementById('mdcSubmissionList').innerHTML = '<p class="text-red-500">Failed to load submissions.</p>';
    });
}

function renderSubmissions(data) {
  const container = document.getElementById('mdcSubmissionList');
  container.innerHTML = '';

  if (!data || data.length === 0) {
    container.innerHTML = '<p class="text-yellow-400">No submissions found.</p>';
    return;
  }

  data.forEach((item, index) => {
    const box = document.createElement('div');
    box.className = 'border border-gray-700 p-4 mb-4 rounded bg-gray-900';

    box.innerHTML = `
      <h3 class="text-lg font-bold text-indigo-400">${item.sessionName}</h3>
      <p class="text-sm text-gray-300">Submitted: ${item.submissionDate}</p>
      <pre class="bg-black p-2 text-white overflow-x-auto">${JSON.stringify(item.payload, null, 2)}</pre>
      <label class="block mt-2 text-gray-200">Status:
        <select onchange="updateStatus(${index}, this.value)" class="bg-gray-800 text-white p-1 rounded">
          <option value="pending" ${item.status === 'pending' ? 'selected' : ''}>Pending</option>
          <option value="approved" ${item.status === 'approved' ? 'selected' : ''}>Approve</option>
          <option value="rejected" ${item.status === 'rejected' ? 'selected' : ''}>Reject</option>
        </select>
      </label>
      <label class="block mt-2 text-gray-200">Notes:
        <textarea id="note-${index}" class="w-full bg-gray-800 text-white p-1 rounded" rows="2">${item.notes || ''}</textarea>
      </label>
      <button onclick="submitReview(${index})" class="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save Review</button>
    `;

    container.appendChild(box);
  });
}

function updateStatus(index, newStatus) {
  console.log(`Status of submission ${index} updated to ${newStatus}`);
}

function submitReview(index) {
  const textarea = document.getElementById(`note-${index}`);
  const noteText = textarea.value.trim();
  const statusSelect = textarea.parentElement.previousElementSibling.querySelector('select');
  const newStatus = statusSelect.value;

  const payload = {
    index,
    newStatus,
    noteText
  };

  fetch('/metaldrug.com/moleculogic/mdc-tier2/admin/mdc_submit_review.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(res => res.text())
    .then(response => {
      alert(`Review submitted: ${response}`);
      loadMDCSubmissions();
    })
    .catch(() => alert('Failed to submit review.'));
}
