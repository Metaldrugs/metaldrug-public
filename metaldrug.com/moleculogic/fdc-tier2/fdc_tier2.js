// fdc_tier2.js
// Summary: Loads and renders all promoted Tier 1 FDC blueprints for Tier 2 visualization.

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('fdcTier2Cards');
  if (!container) return;

  fetch('fdc-tier1-validated.json')
    .then(response => response.json())
    .then(data => {
      if (!Array.isArray(data) || data.length === 0) {
        container.innerHTML = "<p class='text-gray-500'>No validated FDC logic available yet.</p>";
        return;
      }

      data.forEach(entry => {
        const card = document.createElement('div');
        card.className = 'border border-gray-700 rounded-lg p-4 bg-gray-900 text-white shadow mb-6';

        const title = `<h3 class="text-xl font-semibold text-indigo-400">${entry.title}</h3>`;
        const author = `<p class="text-sm text-gray-400 mb-1">Author: ${entry.author}</p>`;
        const date = `<p class="text-sm text-gray-400 mb-3">Validated On: ${entry.validated_on}</p>`;
        const desc = `<p class="mb-4">${entry.description}</p>`;

        const logicTree = entry.logic.logicTree || {};
        const logicHtml = `
          <div class="text-sm bg-gray-800 p-3 rounded">
            <p><strong>Ligand Type:</strong> ${entry.logic.ligandType}</p>
            <p><strong>Metal Affinity:</strong> ${entry.logic.metalAffinity}</p>
            <p><strong>Delivery Vector:</strong> ${entry.logic.deliveryVector}</p>
            <p><strong>Triggers:</strong> ${entry.logic.triggers.join(", ")}</p>
            <p class="mt-2"><strong>Logic Gates:</strong></p>
            <ul class="list-disc ml-6">
              <li>${logicTree.gate1}</li>
              <li>${logicTree.gate2}</li>
              <li><em>${logicTree.action}</em></li>
            </ul>
          </div>
        `;

        card.innerHTML = title + author + date + desc + logicHtml;
        container.appendChild(card);
      });
    })
    .catch(err => {
      console.error('Error loading FDC Tier 2 JSON:', err);
      container.innerHTML = "<p class='text-red-500'>Error loading data. Please try again later.</p>";
    });
});
